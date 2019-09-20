function isChrome() {
    // https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
    return !!window.chrome

// 检测浏览器是否支持let以及模板字符串
function isSupport() {
    try {
        new Function('let a = 1; (`${a}b`)');
        return true
    } catch (e) {
        console.log(e)
        return false
    }
}

function suggestInfo(text){
    var dom = document.getElementById("suggest")
    dom.innerText = text
    dom.style.display = "block"
}

function checkBrowser(){
    if(!isSupport()){
        suggestInfo("ClassViewer doesn't support your web browser, please upgrade to the latest version!")
        return 
    }

    if (!isChrome()) {
        suggestInfo("Suggest to open in chrome!")
        return 
    }
}

checkBrowser()