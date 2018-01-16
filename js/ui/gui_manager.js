class GuiManager {
    constructor(painter, klass, ztree_id, filename) {
        this.painter = painter
        this.filename = filename
        this.class_converter = new ClassInfoToZtreeNode(klass)

        let self = this
        this.ztree_setting = {
            callback: {
                onClick: (e, i, t) => { self.onclick(e, i, t) },
            },
            view: {
                showLine: false,
            }
        }
        this.ztree_id = ztree_id
    }

    show() {
        let znodes = this.class_converter.convert()

        this.ztree_obj = $.fn.zTree.init($(this.ztree_id), this.ztree_setting, znodes);

        this.painter.draw()

        $("#classname").text(this.filename)
        $("#totalCount").text("Total : " + this.painter.data.length)
    }

    onclick(event, treeId, treeNode) {
        let range = treeNode["range"]
        let code = treeNode["code"]
    
        if (code != undefined) {
            let result = interpret_code(code)
            this.displayMethod(treeNode["name"], result)
        } else{
            $("#switch").hide()
            hideOpcode()
        }
        // 高亮
        if (range != undefined && range.length != 0) {
            this.painter.highlight(range[0], range[1])
        }

        //显示range
        let range_value = range[0] == range[1] ? "" : `${range[0]}, ${range[1]}`
        $("#range").text(`range: [${range_value}]`)
    }

    displayMethod(name, code) {
        name = html2Escape(name.substr(2)) + ":"

        let html = code.join("<br>")

        $("#func_name").html(name)
        $("#func_code").html(html)

        $("#switch").show()

        $("[name=showtype][value=opcode]").attr("checked", "checked")

        showOpcode()
    }

   
}