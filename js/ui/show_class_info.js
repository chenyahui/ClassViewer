class ClassInfoToZtreeNode {
    constructor(klass) {
        this.klass = klass
        this.result = []

    }

    convert() {
        this.append("magic", [], [0, 4])
        this.append("minor_version:" + this.klass.minor, [], [4, 6])
        this.append("major_version:" + this.klass.major, [], [6, 8])

        this.appendConstPool()

        this.const_end = this.klass.const_pool.range[1]

        let access_info = AccessFlag.get_class_flag(this.klass.access_flags)
        this.acc_end = this.const_end + 2
        this.append("access_flags: " + access_info.join(","), [], [this.const_end, this.acc_end])


        this.appendClass("this", [this.acc_end, this.acc_end + 2])
        this.appendClass("super", [this.acc_end + 2, this.acc_end + 4])

        this.super_end = this.acc_end + 4
        this.appendInterfaces()

        this.appendMember("field")
        this.appendMember("method")

        let attrs = this.parseAttributes(this.klass.attribute_table)

        this.appendArray(this.result, attrs)

        return this.result
    }

    appendMember(type) {
        let members = eval(`this.klass.${type}s`)
        let count = members.length
        this.append(`${type}_count: ${count}`)

        let children = []
        for (let i = 0; i < count; i++) {
            let name = members[i].member_name()
            let descriptor = members[i].descriptor_name()

            let access_info = eval(`AccessFlag.get_${type}_flag(members[i].access_flags)`)
            access_info = access_info.join(" ")

            let signature = eval(`this.trans_${type}_signature(descriptor, name)`)
            children.push({
                name: `${i + 1}. ${access_info} ${signature}`
            })
        }

        this.append(`${type}s`, children)
    }

    trans_method_signature(descriptor, name) {
        let result = trans_method_descriptor(descriptor)

        return `${result[1]} ${name} (${result[0].join(",")})`
    }

    trans_field_signature(descriptor, name) {
        return trans_field_descriptor(descriptor) + " " + name
    }
    appendInterfaces() {
        let interfaces = this.klass.interfaces
        this.append("interface_count: " + interfaces.length, [], [this.super_end, this.super_end + 2])

        let start = this.super_end + 2
        let end = start

        let children = []
        for (let i = 0; i < interfaces.length; i++) {
            const index = infos[i];

            let name = this.klass.const_pool.className(index)
            children.push({
                name: `#${i + 1} -> ${name}`,
                range: [end, end + 2]
            })

            end += 2
        }

        this.append("interfaces", children, [start, end])
    }
    appendClass(type, range) {
        let index = eval(`this.klass.${type}_class`)
        let name = this.klass.const_pool.className(index)

        this.append(`${type}_class: ${index} -> ${name}`, [], range)
    }

    append(name, children = [], range = []) {
        this.result.push({
            name: name,
            range: range,
            children: children,
            showIcon: children.length == 0 ? false : true,
        })
    }

    appendConstPool() {
        let infos = this.klass.const_pool.const_infos
        this.append("constant_pool_count: " + infos.length, [], [8, 10])

        let children = []
        for (let i = 0; i < infos.length; i++) {
            const e = infos[i]
            if (e) {
                let name = infos[i].constructor.name.slice(5).slice(0, -4)
                children.push({
                    name: `#${i} (${name})`,
                    range: infos[i].range,
                })
            }
        }
        this.append("constant_pool", children, this.klass.const_pool.range)
    }

    parseAttributes(attributes) {
        let result = []

        let attr_infos = attributes.attr_infos

        result.push({
            name: "attribute_count: " + attr_infos.length,
        })

        let children = []
        for (let i = 0; i < attr_infos.length; i++) {
            children.push(this.parseAttribute(i, attr_infos[i]))
        }

        result.push({
            name: "attributes",
            children: children
        })

        return result
    }


    parseAttribute(index, attr) {
        let attr_name = attr.constructor.name
        attr_name = attr_name.slice(4).slice(0, -4)

        return {
            name: `#${index} ${attr_name}`,
        }
    }

    appendArray(arr1, arr2) {
        for (let item of arr2) {
            arr1.push(item)
        }
    }



}

class ShowClassInfo {
    constructor(painter, klass, ztree_id) {
        this.painter = painter

        this.class_converter = new ClassInfoToZtreeNode(klass)

        let self = this
        this.ztree_setting = {
            callback: {
                onClick: (e, i, t) => { self.onclick(e, i, t) }
            }
        }

        this.ztree_id = ztree_id
    }

    show() {
        let znodes = this.class_converter.convert()

        $.fn.zTree.init($(this.ztree_id), this.ztree_setting, znodes);

        this.painter.draw()
    }

    onclick(event, treeId, treeNode) {
        log(event, treeId, treeNode)

        let range = treeNode["range"]
        if (range != undefined && range.length != 0) {
            this.painter.highlight(range[0], range[1])
        }

    }
}