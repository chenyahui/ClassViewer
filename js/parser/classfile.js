class ClassFile {
    constructor(bytearray) {
        this.reader = new ClassReader(bytearray)

        this.const_pool = new ConstPool()

        this.attribute_table = new AttrTable()
    }

    parse() {
        let reader = this.reader

        this.checkMagicAndVersion()

        this.const_pool.read(reader)

        this.access_flags = reader.read(2)
        this.this_class = reader.read(2)
        this.super_class = reader.read(2)
        this.interfaces = reader.readarr(2, 2)


        this.fields = this.readMembers()
        this.methods = this.readMembers()

        this.attribute_table.read(this.reader, this.const_pool)
    }

    readMembers() {
        let reader = this.reader

        let count = reader.read(2);
        let result = []

        for (let i = 0; i < count; ++i) {

            let member = new MemberInfo(this.const_pool)
            member.read(reader);
            result[i] = member;
        }

        return result;
    }
    checkMagicAndVersion() {
        let reader = this.reader

        let magic = reader.read(4)
        if (magic != 0xcafebabe) {
            alert("magic number is wrong")
            return;
        }

        this.magic = magic
        log("magic number is right!")

        var minor = reader.read(2)
        var major = reader.read(2)

        this.minor = minor
        this.major = major
        log("major version", major)
        log("minor version", minor)
    }
}