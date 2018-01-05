const field_mask = {
    public: 0x0001,
    private: 0x0002,
    protected: 0x0004,
    static: 0x0008,
    final: 0x0010,
    volatile: 0x0040,
    transient: 0x0080,
    synthetic: 0x1000,
    enum: 0x4000,
}

const method_mask = {
    public: 0x0001,
    private: 0x0002,
    protected: 0x0004,
    static: 0x0008,
    final: 0x0010,
    synchronized: 0x0020,
    bridge: 0x0040,
    varargs: 0x0080,
    native: 0x0100,
    abstract: 0x0400,
    strict: 0x0800,
    synthetic: 0x1000,
}

const class_mask = {
    public: 0x0001,
    final: 0x0010,
    super: 0x0020,
    interface: 0x0200,
    abstract: 0x0400,
    synthetic: 0x1000,
    annotation: 0x2000,
    enum: 0x4000,
}

class AccessFlag {
    static get_method_flag(flags) {
        return AccessFlag.basic_get_flag(method_mask, flags)
    }

    static get_class_flag(flags) {
        return AccessFlag.basic_get_flag(class_mask, flags)
    }

    static get_field_flag(flags) {
        return AccessFlag.basic_get_flag(field_mask, flags)
    }

    static basic_get_flag(masks, flags) {
        let result = []

        for (let key in masks) {
            if ((flags & masks[key]) != 0) {
                result.push(key)
            }
        }
        return result
    }
}