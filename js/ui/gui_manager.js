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
    }

    onclick(event, treeId, treeNode) {
        log(event)
        let range = treeNode["range"]
        // 高亮
        if (range != undefined && range.length != 0) {
            this.painter.highlight(range[0], range[1])
        }

        //显示range
        $(".statusbar").text(`range: ${range[0]}, ${range[1]}`)
    }
}