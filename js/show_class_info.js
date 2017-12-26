class ClassInfoToZtreeNode {
    constructor(klass) {
        this.klass = klass
        this.result = []
    }

    convert() {
        this.append("magic")
        this.append("minor_version:" + this.klass.minor)
        this.append("major_version:" + this.klass.major)

        this.appendConstPool()

        this.append("access_flags")
        
        this.appendClass("this")
        this.appendClass("super")

        this.appendInterfaces()
        
        return this.result
    }

    appendInterfaces(){
        let interfaces = this.klass.interfaces
        this.append("interface_count: " + interfaces.length)

        let children = []
        for (let i = 0; i < interfaces.length; i++) {
            const index = infos[i];

            let name = this.klass.const_pool.className(index)
            children.push({
                name: `#${i + 1} -> ${name}`,
            })
        }

        this.append("interfaces", children)
    }
    appendClass(type){
        let index = eval(`this.klass.${type}_class`)
        let name = this.klass.const_pool.className(index)

        this.append(`${type}_class: ${index} -> ${name}`)
    }

    append(name, children = []) {
        this.result.push({
            name: name,
            children: children,
            showIcon: children.length == 0 ? false : true,
        })
    }

    appendConstPool() {
        let infos = this.klass.const_pool.const_infos
        this.append("constant_pool_count: " + infos.length)

        let children = []
        for (let i = 0; i < infos.length; i++) {
            const e = infos[i];
            if (e) {
                children.push({
                    name: `#${i + 1}`,
                })
            }
        }
        this.append("constant_pool", children)
    }
}

class ShowClassInfo {
    constructor(klass, ztree_id) {
        this.class_converter = new ClassInfoToZtreeNode(klass)

        this.ztree_setting = {
        }

        this.ztree_id = ztree_id
    }

    show() {
        let znodes = this.class_converter.convert()

        $.fn.zTree.init($(this.ztree_id), this.ztree_setting, znodes);
    }
}