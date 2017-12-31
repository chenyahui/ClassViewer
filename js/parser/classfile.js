class ClassFile {
    constructor(bytearray) {
        this.reader = new ClassReader(bytearray)

        this.const_pool = new ConstPool()

        this.attribute_table = new AttrTable()
    }

    parse() {
        let reader = this.reader

        if(!this.checkMagicAndVersion()){
            return false
        }

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
            let start = reader.now

            let member = new MemberInfo(this.const_pool)
            member.read(reader);

            member.range = [start, reader.now]
            result[i] = member;
        }

        return result;
    }
    checkMagicAndVersion() {
        let reader = this.reader

        let magic = reader.read(4)
        if (magic != 0xcafebabe) {
            log("magic number is wrong")
            return false;
        }

        this.magic = magic

        var minor = reader.read(2)
        var major = reader.read(2)

        this.minor = minor
        this.major = major

        return true
    }
}