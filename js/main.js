function showMainArea() {
    $(".index").hide()
    $(".mainarea").show()
}

function showIndexArea() {
    $(".mainarea").hide()
    $(".index").show()
}

function adjust_size() {

    let window_h = window.innerHeight - 60

    $(".wrapper").height(window_h - $("header").height() - 10)
    let wrapper_height = $(".wrapper").height()
    $(".wrapper > *").height(wrapper_height)

    $("main").width($("body").width() - $(".class-info").width() - $(".detail-info").width() - 20)

    let status_h = 50

    $("#bytearea").height(wrapper_height - status_h)
    $("#bytearea").width($("main").width())
}

function isSupport() {
    // https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
    return !!window.chrome && !!window.chrome.webstore;
}

function _Main() {
    if (!isSupport()) {
        $("#suggest").css("display", "block")
    }
    $("#loading-modal").iziModal({
        overlayClose: false,
        closeOnEscape: false,
    })

    $(".uploader").click(function () {
        $("#fileInput").trigger("click")

    })

    $("#changeClass").click(function () {
        $("#fileInput").trigger("click")
    })

    $(window).resize(function () {
        alert("Resizing window will erase byte area!")
        adjust_size()
    })

    adjust_size()

    let fileLoader = new FileLoader()

    $("#fileInput").change(function () {
        $("#loading-modal").iziModal('open');
        let self = this

        async function loadfile(file) {
            fileLoader.loadfile(file)
                .then(function () {
                    showMainArea()
                }, function (error) {
                    log(error)
                    alert(error)
                })
                .then(function () {
                    // always 
                    $(self).val(null)
                    $("#loading-modal").iziModal('close');
                })
        }

        loadfile(self.files[0])
    })
}
