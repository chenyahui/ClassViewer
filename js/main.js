function adjust_size() {
    $(".wrapper").height($("body").height() - $("header").height() - 10)
    let wrapper_height = $(".wrapper").height()
    $(".wrapper > *").height(wrapper_height)

    $("main").width($("body").width() - $(".class-info").width() - $(".detail-info").width() - 20)
    $("#bytearea").height(wrapper_height - $(".statusBar").height())
    $("#bytearea").width($("main").width())
}

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

                self.showClass(klass)
                log("完成")
                resolve()
            }

            reader.readAsArrayBuffer(file)
        })
    }

    showClass(klass) {
        let painter = new ByteAreaPainter("#bytearea", new Uint8Array(this.buffer))

        let show = new GuiManager(painter, klass, "#infoTree")
        show.show()
    }
}