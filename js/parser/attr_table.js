class AttrTable {
    constructor() {
        this.attr_infos = []
    }

    read(reader, const_pool) {
        let count = reader.read(2)
        let table_start = reader.now
        for (let i = 0; i < count; ++i) {
            let start = reader.now

            let attr_info = this.readAttributeInfo(reader, const_pool)
            attr_info.range = [start, reader.now]
           
            this.attr_infos.push(attr_info)
        }

        this.range = [table_start, reader.now]
    }

    readAttributeInfo(reader, const_pool) {
        let attr_name_index = reader.read(2);
        let attr_len = reader.read(4);

        let attr_name = const_pool.getUtf8String(attr_name_index)
        
        let attr_info = this.attrInfoFactory(attr_name, const_pool)
       // log("attr", attr_info)
        if (attr_info == null) {
            attr_info = new AttrUnparsedInfo(attr_name, attr_len, const_pool)
        }

        attr_info.read(reader)

        return attr_info
    }

    attrInfoFactory(attr_name, const_pool) {
        if (attr_name == "BootstrapMethods") {
            return new AttrBootstrapMethodsInfo(const_pool);
        } else if (attr_name == "Code") {
            return new AttrCodeInfo(const_pool);
        } else if (attr_name == "ConstantValue") {
            return new AttrConstValueInfo(const_pool);
        } else if (attr_name == "Deprecated") {
            return new AttrDeprecatedInfo(const_pool);
        } else if (attr_name == "EnclosingMethod") {
            return new AttrEnclosingMethodInfo(const_pool);
        } else if (attr_name == "Exceptions") {
            return new AttrExceptionsInfo(const_pool);
        } else if (attr_name == "InnerClasses") {
            return new AttrInnerClassesInfo(const_pool);
        } else if (attr_name == "LineNumberTable") {
            return new AttrLineNumberTableInfo(const_pool);
        } else if (attr_name == "LocalVariableTable") {
            return new AttrLocalVariableTableInfo(const_pool);
        } else if (attr_name == "LocalVariableTypeTable") {
            return new AttrLocalVariableTypeTableInfo(const_pool);
        } else if (attr_name == "Signature") {
            return new AttrSignatureInfo(const_pool);
        } else if (attr_name == "SourceFile") {
            return new AttrSourceFileInfo(const_pool);
        } else if (attr_name == "Synthetic") {
            return new AttrSyntheticInfo(const_pool);
        }

        return null
    }
}

class AttrInfo {
    constructor(const_pool) {
        this.const_pool = const_pool
    }

    read(reader) {
        if (this.properties != undefined) {
            for (let i = 0; i < this.properties.length; i += 2) {
                let item_type = this.properties[i]
                let property = this.properties[i + 1]

                if (Array.isArray(item_type)) {
                    // 当为数组的时候
                    eval(`this.${property} = reader.readarr(${item_type[0]}, ${item_type[1]})`)
                } else if (Number.isInteger(item_type)) {
                    // 当属性是个数字的时候
                    eval(`this.${property} = reader.read(${item_type})`)
                } else {
                    // 当属性是个对象的时候
                    eval(`this.${property} = new ${item_type}()`)

                    if (item_type == "AttrTable") {
                        eval(`this.${property}.read(reader, this.const_pool)`)
                    } else {
                        eval(`this.${property}.read(reader)`)
                    }
                }
            }
        }
    }
}


class AttrConstValueInfo extends AttrInfo {
    constructor(const_pool) {
        super(const_pool)
        this.properties = [
            2, "constant_value_index",
        ]
    }

}

class ExceptionInfo extends AttrInfo {
    constructor() {
        super(null)

        this.properties = [
            2, "start_pc",
            2, "end_pc",
            2, "handler_pc",
            2, "catch_type",
        ]
    }
}

class AttrCodeInfo extends AttrInfo {
    constructor(const_pool) {
        super(const_pool)

        this.properties = [
            2, "max_stack",
            2, "max_locals",
            [4, 1], "bytecode",
            [2, "ExceptionInfo"], "exception_table",
            'AttrTable', 'attr_table',
        ]
    }
}

class AttrExceptionsInfo extends AttrInfo {
    constructor(const_pool) {
        super(const_pool)

        this.properties = [
            [2, 2], 'exception_index_table'
        ]
    }
}

class InnerClassInfo extends AttrInfo {
    constructor() {
        super(null)

        this.properties = [
            2, "inner_class_info_index",
            2, "outer_class_info_index",
            2, "inner_name_index",
            2, "inner_class_access_flags",
        ]
    }
}

class AttrInnerClassesInfo extends AttrInfo {
    constructor(const_pool) {
        super(const_pool)

        this.properties = [
            [2, "InnerClassInfo"], "inner_classes",
        ]
    }
}

class AttrEnclosingMethodInfo extends AttrInfo {
    constructor(const_pool) {
        super(const_pool)

        this.properties = [
            2, "class_index",
            2, "method_index",
        ]
    }
}

class AttrSignatureInfo extends AttrInfo {
    constructor(const_pool) {
        super(const_pool)

        this.properties = [
            2, "signature_index",
        ]
    }
}
class AttrSourceFileInfo extends AttrInfo {
    constructor(const_pool) {
        super(const_pool)

        this.properties = [
            2, "sourcefile_index",
        ]
    }
}

class LineNumberInfo extends AttrInfo {
    constructor() {
        super(null)

        this.properties = [
            2, "start_pc",
            2, "line_number",
        ]
    }
}

class AttrLineNumberTableInfo extends AttrInfo {
    constructor(const_pool) {
        super(const_pool)

        this.properties = [
            [2, "LineNumberInfo"], "line_number_table",
        ]
    }
}

class LocalVariableInfo extends AttrInfo {
    constructor() {
        super(null)

        this.properties = [
            2, "start_pc",
            2, "length",
            2, "name_index",
            2, "descriptor_index",
            2, "index",
        ]
    }
}

class LocalVariableTypeInfo extends AttrInfo {
    constructor() {
        super(null)

        this.properties = [
            2, "start_pc",
            2, "length",
            2, "name_index",
            2, "signature_index",
            2, "index",
        ]
    }
}


class AttrLocalVariableTableInfo extends AttrInfo {
    constructor(const_pool) {
        super(const_pool)

        this.properties = [
            [2, "LocalVariableInfo"], "local_variable_table",
        ]
    }
}

class AttrLocalVariableTypeTableInfo extends AttrInfo {
    constructor(const_pool) {
        super(const_pool)

        this.properties = [
            [2, "LocalVariableTypeInfo"], "local_variable_type_table",
        ]
    }
}

class BootStrapMethod extends AttrInfo {

    constructor() {
        super(null)

        this.properties = [
            2, "bootstrap_method_ref",
            [2, 2], "bootstrap_arguments",
        ]
    }
}
class AttrSyntheticInfo extends AttrInfo {
    constructor(const_pool) {
        super(const_pool)
    }
}
class AttrDeprecatedInfo extends AttrInfo {
    constructor(const_pool) {
        super(const_pool)
    }
}

class AttrBootstrapMethodsInfo extends AttrInfo {

    constructor(const_pool) {
        super(const_pool)

        this.properties = [
            [2, "BootStrapMethod"], "bootStrap_methods",
        ]
    }

};

class AttrUnparsedInfo extends AttrInfo {
    constructor(attr_name, attr_len, const_pool) {
        super(const_pool)

        this.attr_name = attr_name
        this.attr_len = attr_len
        this.data = []
    }

    read(reader) {
        for (let i = 0; i < this.attr_len; i++) {
            this.data.push(reader.read(1))
        }
    }
}

class MemberInfo extends AttrInfo {
    constructor(const_pool) {
        super(const_pool)

        this.properties = [
            2, "access_flags",
            2, "name_index",
            2, "descriptor_index",
            "AttrTable", "attr_table",
        ]
    }

    member_name() {
        return this.const_pool.getUtf8String(this.name_index)
    }

    descriptor_name(){
        return this.const_pool.getUtf8String(this.descriptor_index)
    }
}

