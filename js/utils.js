var log = console.log

function convertToUnsigned(val, byte_num) {
    return eval(`(new Uint${byte_num * 8}Array([${val}]))[0]`)
}
