function showMainArea() {
    $(".index").hide()
    $(".mainarea").show()
}

function showIndexArea() {
    $(".mainarea").hide()
    $(".index").show()
}
function showOpcode() {
    $("#bytearea").hide()
    $("#opcode").show()
}

function hideOpcode() {
    $("#bytearea").show()
    $("#opcode").hide()
}

function changeLoadText(text){
    $(".loading-text").text(text)
}
function adjust_size() {

    let window_h = window.innerHeight - 60

    $(".wrapper").height(window_h - $("header").height() - 10)
    let wrapper_height = $(".wrapper").height()
    $(".wrapper > *").height(wrapper_height)

    $("main").width($("body").width() - $(".class-info").width() - $(".detail-info").width() - 20)

    let status_h = 50

    let h = wrapper_height - status_h
    let w = $("main").width()
    $("#bytearea").height(h)
    $("#bytearea").width(w)
    $("#opcode").height(h)
    $("#opcode").width(w)
}

function _Main() {
    $("#loading-modal").iziModal({
        overlayClose: false,
        closeOnEscape: false,
    })

    $(".select-file").click(function () {
        log("click")
        $("#fileInput").trigger("click")
    })

    $("[name=showtype][value=opcode]").click(function(){
        showOpcode()
    })
    $("[name=showtype][value=bytecode]").click(function(){
        hideOpcode()
    })

    adjust_size()

    let fileLoader = new FileLoader()

    $("#fileInput").change(function () {
        log("change")
        $("#loading-modal").iziModal('open');
        let self = this

        async function loadfile(file) {
            await fileLoader.loadfile(file)
            showMainArea()

            $(self).val(null)
            $("#loading-modal").iziModal('close');
        }
        loadfile(self.files[0])
    })
}
