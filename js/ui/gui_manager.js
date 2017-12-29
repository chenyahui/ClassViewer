class GuiManager {
    constructor(painter, klass, ztree_id) {
        this.painter = painter

        this.class_converter = new ClassInfoToZtreeNode(klass)

        let self = this
        this.ztree_setting = {
            callback: {
                onClick: (e, i, t) => { self.onclick(e, i, t) },
                onExpand: () => { self.onExpand() }
            }
        }

        this.ztree_id = ztree_id

    }

    show() {
        let znodes = this.class_converter.convert()

        this.ztree_obj = $.fn.zTree.init($(this.ztree_id), this.ztree_setting, znodes);

        this.painter.draw()
    }

    onExpand() {
        $("aside.class-info").getNiceScroll().onResize();
    }

    onclick(event, treeId, treeNode) {
        let range = treeNode["range"]
        // 高亮
        if (range != undefined && range.length != 0) {
            this.painter.highlight(range[0], range[1])
        }
    }
}