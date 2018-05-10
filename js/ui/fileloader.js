class FileLoader {
    constructor() {
        this.buffer = []
        this.reader = new FileReader();
    }

    loadfile(file) {
        let self = this

        return new Promise(function (resolve, reject) {
            changeLoadText("reading file ...")
            let abs_filename = file.name
            
            if (!abs_filename.endsWith(".class")) {
                reject("the file must end with .class")
            }

            self.reader.onload = function (event) {
                log("loader")
                self.buffer = event.target.result
                log("parse")
                changeLoadText("parsing class file ...")
                var klass = new ClassFile(self.buffer.slice(0))
                parse_time.start()
                if (!klass.parse()) {
                    reject("invalid class file")
                }
                parse_time.finish()
                let filename = self.parseFileName(abs_filename)

                changeLoadText("show data on browers...")

                convert_time.start()
                self.showClass(klass, filename)
                convert_time.finish()
                resolve(true)
            }

            self.reader.readAsArrayBuffer(file)
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

let parse_time = new TimeStat("parse")
let convert_time = new TimeStat("convert")