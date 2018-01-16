var log = console.log

function convertToUnsigned(val, byte_num) {
    return eval(`(new Uint${byte_num * 8}Array([${val}]))[0]`)
}

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function html2Escape(sHtml) {
    return sHtml.replace(/[<>&"]/g, function (c) { return { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]; });
}