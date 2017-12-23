class ConstInfo {
    constructor(const_pool) {
        this.const_pool = const_pool
    }

    readinfo(reader) {
        if (this.properties != undefined) {

            for (let i = 0; i < this.properties.length; i += 2) {
                let len = this.properties[i]
                let property = this.properties[i + 1]

                if (Array.isArray(len)) {
                    eval(`this.${property} = reader.readarr(${len[0]}, ${len[1]})`)
                } else {

                    eval(`this.${property} = reader.read(${len})`)
                }
            }

        }
    }
}
class ConstClassInfo {
    constructor(const_pool) {
        super(const_pool)
        this.properties = [
            2, 'name_index',
        ]
    }
}

class ConstMemberInfo {
    constructor(const_pool) {
        super(const_pool)
        this.properties = [
            2, "class_index",
            2, "name_and_type_index",
        ]
    }
}

class ConstStringInfo {
    constructor(const_pool) {
        super(const_pool)
        this.properties = [
            2, "string_index",
        ]
    }
}

class ConstFloatInfo {
    constructor(const_pool) {
        super(const_pool)
        this.properties = [
            4, "val",
        ]
    }
}

class ConstIntegerInfo {
    constructor(const_pool) {
        super(const_pool)
        this.properties = [
            4, "val",
        ]
    }
}
class ConstLongInfo {
    constructor(const_pool) {
        super(const_pool)
        this.properties = [
            8, "val",
        ]
    }
}
class ConstDoubleInfo {
    constructor(const_pool) {
        super(const_pool)
        this.properties = [
            8, "val",
        ]
    }
}

class ConstNameAndTypeInfo {
    constructor(const_pool) {
        super(const_pool)
        this.properties = [
            2, "name_index",
            2, "descriptor_index",
        ]
    }
}

class ConstUtf8Info {
    constructor(const_pool) {
        super(const_pool)
        this.properties = [
            [2, 1], "data"
        ]
    }
}

class ConstMethodHandle {
    constructor(const_pool) {
        super(const_pool)
        this.properties = [
            1, "reference_kind",
            2, "reference_index",
        ]
    }
}

class ConstMethodType {
    constructor(const_pool) {
        super(const_pool)
        this.properties = [
            2, "descriptor_index_",
        ]
    }
}

class ConstInvokeDynamic {
    constructor(const_pool) {
        super(const_pool)
        this.properties = [
            2, "boostrap_method_attr_index",
            2, "name_and_type_index",
        ]
    }
}