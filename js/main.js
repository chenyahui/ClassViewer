function adjust_size() {
    $(".wrapper").height($("body").height() - $("header").height() - 10)
    let wrapper_height = $(".wrapper").height()
    $(".wrapper > *").height(wrapper_height)

    $("main").width($("body").width() - $(".class-info").width() - $(".detail-info").width() - 20)

    $("#bytearea").height(wrapper_height - $(".statusBar").height())
    $("#bytearea").width($("main").width())
}
