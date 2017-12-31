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
