class FileLoader {
    constructor() {
        this.buffer = []
    }

    loadfile(file) {
        let self = this

        return new Promise(function (resolve, reject) {
            let abs_filename = file.name
            if (!abs_filename.endsWith(".class")) {
                reject("the file must end with .class")
            }

            var reader = new FileReader();

            reader.onload = function (event) {
                self.buffer = event.target.result

                var klass = new ClassFile(self.buffer.slice(0))
                if (!klass.parse()) {
                    reject("invalid class file")
                }

                let filename = self.parseFileName(abs_filename)


                self.showClass(klass, filename)

                resolve(true)
            }

            reader.readAsArrayBuffer(file)
        })
    }
    parseFileName(abs_filename) {
        return abs_filename
    }

    showClass(klass, filename) {
        let painter = new ByteAreaPainter("#bytearea", new Uint8Array(this.buffer))

        let show = new GuiManager(painter, klass, "#infoTree", filename)
        show.show()
    }
}

function showMainArea() {
    $(".index").hide()
    $(".mainarea").show()
}

function showIndexArea() {
    $(".mainarea").hide()
    $(".index").show()
}

function adjust_size() {
    $(".wrapper").height($("body").height() - $("header").height() - 10)
    let wrapper_height = $(".wrapper").height()
    $(".wrapper > *").height(wrapper_height)

    $("main").width($("body").width() - $(".class-info").width() - $(".detail-info").width() - 20)
    $("#bytearea").height(wrapper_height - $(".statusBar").height())
    $("#bytearea").width($("main").width())
}

function isSupport() {
    let userAgent = navigator.userAgent;
    return userAgent.indexOf("Chrome") > -1
}

function _Main() {
    if (!isSupport()) {
        $("#suggest").css("display", "block")
    }
    $("#loading-modal").iziModal({
        overlayClose: false,
        closeOnEscape: false,
    })

    $(".uploader").click(function () {
        $("#fileInput").trigger("click")

    })

    $("#changeClass").click(function () {
        $("#fileInput").trigger("click")
    })

    $(window).resize(function () {
        alert("Resizing window will erase byte area!")
    })

    adjust_size()

    let fileLoader = new FileLoader()
    $("#fileInput").change(function () {
        $("#loading-modal").iziModal('open');
        let self = this

        async function loadfile(file) {
            fileLoader.loadfile(file)
                .then(function () {
                    showMainArea()
                    log("结束！！！")
                }, function (error) {
                    log(error)
                    alert(error)
                })
                .then(function () {
                    log("进入")
                    // always 
                    $(self).val(null)
                    $("#loading-modal").iziModal('close');
                })
        }

        loadfile(self.files[0])
    })
}
