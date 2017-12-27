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
        return trans_descriptor(descriptor.slice(1)) + "[]"
    }

    return descriptor
}

function trans_method_descriptor(descriptor) {
    let split_index = descriptor.indexOf(")")

    let param_types = descriptor.slice(1, split_index)
    let return_type = descriptor.slice(split_index + 1)

    let result = [[], trans_field_descriptor(return_type)]
    let i = 0
    
    while (i < param_types.length) {
        let now = param_types[i]

        if (field_descriptors[now] != undefined) {
            let basic_type = trans_field_descriptor(now) 
            result[0].push(basic_type)
            i++;

        } else if (now == "L" || now == "[") {
            let comma = param_types.indexOf(";", i)
            let param = trans_field_descriptor(param_types.slice(i, comma + 1))

            result[0].push(param)

            i = comma+1
        }
    }

    return result
}