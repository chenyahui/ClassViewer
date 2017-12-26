function query(sel) {
    return document.querySelector(sel)
}

function queryAll(sel) {
    return document.querySelectorAll(sel)
}

function registerEvent(sel, event, action) {
    let doms = queryAll(sel)

    for (let item of doms) {
        item.addEventListener(event, action)
    }
}

var display_toggle = (ele_obj) => {
    ele_obj.style.display = ele_obj.style.display == "none" ? "block" : "none"
}