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

function time2stamp(){
    var d = new Date();
    return Date.parse(d)+d.getMilliseconds();
}

class TimeStat{
    constructor(sign){
        this.sign = sign
    }

    start(){
        this.last_time = this.start_time = time2stamp()

        log(this.sign, "开始", this.start_time)
    }

    interrupt(){
        let now_time = time2stamp()
        log(this.sign, "距上次获取消耗", now_time - this.last_time)
        this.last_time = now_time
    }
    
    finish(){
        log(this.sign, "共消耗",  time2stamp()- this.start_time)
    }
}