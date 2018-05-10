const field_descriptors = {
    B: "byte",
    C: "char",
    D: "double",
    F: "float",
    I: "int",
    J: "long",
    S: "short",
    Z: "boolean",
    V: "void",
}


function trans_field_descriptor(descriptor) {
    let basic_type = field_descriptors[descriptor]
    if (basic_type != undefined) {
        return basic_type
    }

    if (descriptor.startsWith("L")) {
        let klass_name = descriptor.slice(1).slice(0, -1)
        return klass_name.replaceAll("/", ".")
    }

    if (descriptor.startsWith("[")) {
        return trans_field_descriptor(descriptor.slice(1)) + "[]"
    }

    return descriptor
}

class MethodDescriptor{
    constructor(descriptor){
        this.descriptor = descriptor
        this.offset = 0
        this.param_types = []
    }

    parse(){
        this.startParams()
        this.parseParamsType()
        this.endParams()
        this.parseReturnType()
        this.finish()
    }

    finish(){
        if(this.offset != this.descriptor.length){
            log(this.offset, this.descriptor.length)
            this.causePanic("finish")
        }
    }
    startParams(){
        if (this.readchar() != '(') {
            this.causePanic("start params");
        }
    }
    endParams(){
        if (this.readchar() != ')') {
            this.causePanic("end param");
        }
    }
    parseParamsType(){
        while (true) {
            let param = this.parseFieldType();
            if (param == null) {
                break;
            }
            this.param_types.push(param);
        }
    }

    parseFieldType(){
        let c = this.readchar();
        switch (c) {
            case 'B':
            case 'C':
            case 'D':
            case 'F':
            case 'I':
            case 'J':
            case 'S':
            case 'Z':
            case 'V':
                return c;
            case 'L':
                return this.parseObjectType();
            case '[':
                return this.parseArrayType();
            default:
                this.unRead();
                return null;
        }
    }
    unRead(){
        this.offset--
    }
    parseObjectType(){
        let arr_start = this.offset - 1;
        let obj_end = this.descriptor.indexOf(';', this.offset);
        if (obj_end != -1) {
            let result = this.descriptor.slice(arr_start, obj_end + 1);
            this.offset = obj_end + 1;
            return result;
        }else{
            log(-1)
        }
        return null;
    }
    parseArrayType(){
        let arr_start = this.offset - 1;
        this.parseFieldType();
        let arr_end = this.offset;
        return this.descriptor.slice(arr_start, arr_end);
    }

    parseReturnType(){
        this.return_type = this.parseFieldType();

        if (this.return_type == null) {
            this.causePanic("return");
        }
    }
    causePanic(msg){
        log(msg, "错误!", this.descriptor)
    }

    readchar(){
        return this.descriptor[this.offset++];
    }
}
// (Ljava/lang/Object;[B)V
// (Ljava/lang/Class;)Ljava/io/ObjectStreamClass;
function trans_method_descriptor(descriptor) {
    let parser = new MethodDescriptor(descriptor)

    parser.parse()

    result = [[]]
    for(let param of  parser.param_types){
        result[0].push(trans_field_descriptor(param))
    }

    result[1] = trans_field_descriptor(parser.return_type)
    return result
}
