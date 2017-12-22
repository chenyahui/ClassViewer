class ClassFile {
    constructor(bytearray) {
        log(bytearray.length)
        this.reader = new ClassReader(bytearray);
    }

    parse() {
        this.checkMagicAndVersion()
    }

    checkMagicAndVersion() {
        var reader = this.reader

        var magic = reader.read(4)
        if (magic != 0xcafebabe) {
            alert("magic number is wrong")
            return;
        }

        log("magic number is right!")

        var minor = reader.read(2)
        var major = reader.read(2)
        log("major version", major)
        log("minor version", minor)
    }
}