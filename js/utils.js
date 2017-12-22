String.prototype.format = function () {
    var args = arguments;
    return this.replace(/\{(\d+)\}/g,
        function (m, i) {
            return args[i];
        });
}

var log = console.log

function convertToUnsigned(val, byte_num) {
    return eval("(new Uint{0}Array([{1}]))[0]".format(byte_num * 8, val))
}