class ConstInfo {
    constructor(const_pool) {
        this.const_pool = const_pool
    }

    read(reader) {
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
class ConstClassInfo extends ConstInfo {
    constructor(const_pool) {
        super(const_pool)
        this.properties = [
            2, 'name_index',
        ]
    }
}

class ConstFieldRefInfo extends ConstInfo {
    constructor(const_pool) {
        super(const_pool)
        this.properties = [
            2, "class_index",
            2, "name_and_type_index",
        ]
    }
}
class ConstMethodRefInfo extends ConstInfo {
    constructor(const_pool) {
        super(const_pool)
        this.properties = [
            2, "class_index",
            2, "name_and_type_index",
        ]
    }
}
class ConstInterfaceMethodRefInfo extends ConstInfo {
    constructor(const_pool) {
        super(const_pool)
        this.properties = [
            2, "class_index",
            2, "name_and_type_index",
        ]
    }
}
class ConstStringInfo extends ConstInfo {
    constructor(const_pool) {
        super(const_pool)
        this.properties = [
            2, "string_index",
        ]
    }
}

class ConstFloatInfo extends ConstInfo {
    constructor(const_pool) {
        super(const_pool)
        this.properties = [
            4, "val",
        ]
    }
}

class ConstIntegerInfo extends ConstInfo {
    constructor(const_pool) {
        super(const_pool)
        this.properties = [
            4, "val",
        ]
    }
}
class ConstLongInfo extends ConstInfo {
    constructor(const_pool) {
        super(const_pool)
        this.properties = [
            4, "high",
            4, "low",
        ]
    }
}
class ConstDoubleInfo extends ConstInfo {
    constructor(const_pool) {
        super(const_pool)
        this.properties = [
            4, "high",
            4, "low",
        ]
    }
}

class ConstNameAndTypeInfo extends ConstInfo {
    constructor(const_pool) {
        super(const_pool)
        this.properties = [
            2, "name_index",
            2, "descriptor_index",
        ]
    }
}

class ConstUtf8Info extends ConstInfo {
    constructor(const_pool) {
        super(const_pool)
        this.properties = [
            [2, 1], "data"
        ]
    }

    asString() {
        let params = this.data.join(",")
        return eval(`String.fromCharCode(${params})`)
    }
}

class ConstMethodHandleInfo   extends ConstInfo{
    constructor(const_pool) {
        super(const_pool)
        this.properties = [
            1, "reference_kind",
            2, "reference_index",
        ]
    }
}

class ConstMethodTypeInfo   extends ConstInfo {
    constructor(const_pool) {
        super(const_pool)
        this.properties = [
            2, "descriptor_index",
        ]
    }
}

class ConstInvokeDynamicInfo   extends ConstInfo {
    constructor(const_pool) {
        super(const_pool)
        this.properties = [
            2, "boostrap_method_attr_index",
            2, "name_and_type_index",
        ]
    }
}