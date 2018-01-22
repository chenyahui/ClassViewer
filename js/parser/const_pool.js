const ConstType = {
    Klass: 7,
    Fieldref: 9,
    Methodref: 10,
    InterfaceMethodref: 11,
    String: 8,
    Integer: 3,
    Float: 4,
    Long: 5,
    Double: 6,
    NameAndType: 12,
    Utf8: 1,
    MethodHandle: 15,
    MethodType: 16,
    InvokeDynamic: 18,
}

class ConstPool {
    constructor() {
        this.const_infos = []
        this.range = []
    }

    // @param reader classreader
    read(reader) {
        let count = reader.read(2)

        this.range[0] = reader.now
        for (let i = 1; i < count; ++i) {
            let range = []

            range[0] = reader.now
            
            let tag = reader.read(1);
            let const_info = this.constInfoFactory(tag)
            const_info.read(reader)
            const_info.tag = tag

            range[1] = reader.now
            const_info.range = range

            this.const_infos[i] = const_info

            if (tag == ConstType.Long || tag == ConstType.Double) {
                ++i;
            }
        }

        this.range[1] = reader.now
    }

    getUtf8String(index) {
        let utf8_info = this.const_infos[index]
        //log(this, index, utf8_info)
        return utf8_info.asString()
    }

    className(index) {
        let class_info = this.const_infos[index]
        return this.getUtf8String(class_info.name_index)
    }

    constInfoFactory(tag) {
        switch (tag) {
            case ConstType.Klass:
                return new ConstClassInfo(this);
            case ConstType.Fieldref:
                return new ConstFieldRefInfo(this);
            case ConstType.Methodref:
                return new ConstMethodRefInfo(this);
            case ConstType.InterfaceMethodref:
                return new ConstInterfaceMethodRefInfo(this);
            case ConstType.String:
                return new ConstStringInfo(this);
            case ConstType.Integer:
                return new ConstIntegerInfo(this);
            case ConstType.Float:
                return new ConstFloatInfo(this);
            case ConstType.Double:
                return new ConstDoubleInfo(this);
            case ConstType.Long:
                return new ConstLongInfo(this);
            case ConstType.NameAndType:
                return new ConstNameAndTypeInfo(this);
            case ConstType.Utf8:
                return new ConstUtf8Info(this);
            case ConstType.MethodHandle:
                return new ConstMethodHandleInfo(this);
            case ConstType.MethodType:
                return new ConstMethodTypeInfo(this);
            case ConstType.InvokeDynamic:
                return new ConstInvokeDynamicInfo(this);
        }
    }
}