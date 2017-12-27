var log = console.log

function convertToUnsigned(val, byte_num) {
    return eval(`(new Uint${byte_num * 8}Array([${val}]))[0]`)
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};