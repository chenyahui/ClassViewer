class FileLoader {
    constructor() {
        this.buffer = []
    }

    loadfile(file) {
        let self = this

        return new Promise(function (resolve, reject) {

            var reader = new FileReader();

            reader.onload = function (event) {
                self.buffer = event.target.result

                var klass = new ClassFile(self.buffer.slice(0))
                klass.parse()

                let filename = self.parseFileName(file.name)
                self.showClass(klass, filename)
                log("完成")
                resolve()
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
function _Main() {
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
                    $(self).val(null)
                    showMainArea()
                    $("#loading-modal").iziModal('close');
                })
        }

        loadfile(self.files[0])
    })
}
