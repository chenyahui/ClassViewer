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

        this.field_end = this.appendMember("field", this.interface_end)
        this.method_end = this.appendMember("method", this.field_end)

        let attrs = this.parseAttributes(this.klass.attribute_table, this.method_end)

        this.appendArray(this.result, attrs)
        return this.result
    }

    appendMember(type, start) {
        let members = eval(`this.klass.${type}s`)
        let count = members.length
        this.append(`${type}_count: ${count}`, [], [start, start + 2])

        let end = start + 2
        let children = []
        for (let i = 0; i < count; i++) {
            let member = this.parseMember(members[i], type, i)
            member.icon = `image/${type}.png`
            children.push(member)
            end = member.range[1]
        }

        this.append(`${type}s`, children, [start + 2, end])

        return end
    }

    parseMember(member, type, i) {
        let name = member.member_name()
        let descriptor = member.descriptor_name()

        let access_info = eval(`AccessFlag.get_${type}_flag(member.access_flags)`)
        access_info = access_info.join(" ")

        let signature = eval(`this.trans_${type}_signature(descriptor, name)`)

        name = `${i + 1}. ${access_info} ${signature}`

        let children = []
        children.push({
            name: "access_flags:" + member.access_flags,
            range: [member.range[0], member.range[0] + 2],
        })

        children.push({
            name: "name_index:" + member.name_index,
            range: [member.range[0] + 2, member.range[0] + 4],
        })

        children.push({
            name: "descriptor_index:" + member.descriptor_index,
            range: [member.range[0] + 4, member.range[0] + 6],
        })

        let attr_table = this.parseAttributes(member.attr_table, member.range[0] + 6)

        this.appendArray(children, attr_table)
        if (type == "field") {
            return {
                name: name,
                range: member.range,
                children: children,
            }
        } else {
            return {
                name: name,
                range: member.range,
                children: children,
                code: member.attr_table.attr_infos[0].bytecode,
            }
        }
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
                range: [end, end + 2],
                icon: "image/classTypeInterface.png",
            })

            end += 2
        }

        this.interface_end = end
        this.append("interfaces", children, [start, end])
    }
    appendClass(type, range) {
        let index = eval(`this.klass.${type}_class`)
        let name = this.klass.const_pool.className(index)

        this.append(`${type}_class: ${index} -> ${name}`, [], range, "image/classTypeJavaClass.png")
    }

    append(name, children = [], range = [], icon) {
        let item = {
            name: name,
            range: range,
            children: children,
        }
        if (icon != undefined) {
            item["icon"] = icon
        }
        this.result.push(item)
    }

    appendConstPool() {
        let infos = this.klass.const_pool.const_infos
        this.append("constant_pool_count: " + infos.length, [], [8, 10])

        let children = []
        for (let i = 0; i < infos.length; i++) {
            const e = infos[i]
            if (e) {
                children.push(this.parseConstInfo(i, e))
            }
        }
        this.append("constant_pool", children, this.klass.const_pool.range)
    }

    parseConstInfo(index, info) {
        let name = info.constructor.name.slice(5).slice(0, -4)

        let children = []
        children.push({
            name: "tag: " + info.tag,
            range: [info.range[0], info.range[0] + 1],
        })

        let start = info.range[0] + 1;
        for (let i = 0; i < info.properties.length; i += 2) {
            let len = info.properties[i]
            let property = info.properties[i + 1]

            if (Array.isArray(len)) {
                // 根据目前的情况，如果const_info某个字段是array，那么一定是最后一个了。

                children.push({
                    name: property + "_count : " + len[0],
                    range: [start, start + len[0]],
                })
                children.push({
                    name: property + "->" + info.asString(),
                    range: [start + len[0], info.range[1]],
                })
            } else {
                children.push({
                    name: property,
                    range: [start, start + len],
                })
                start += len
            }
        }
        return {
            name: `#${index} (${name})`,
            range: info.range,
            children: children,
        }
    }

    parseAttributes(attributes, start) {
        let result = []

        let attr_infos = attributes.attr_infos

        result.push({
            name: "attribute_count: " + attr_infos.length,
            range: [start, start + 2],
        })

        let children = []
        for (let i = 0; i < attr_infos.length; i++) {
            children.push(this.parseAttribute(i, attr_infos[i]))
        }

        result.push({
            name: "attributes",
            children: children,
            range: attributes.range,
        })

        return result
    }


    parseAttribute(index, attr) {
        let attr_name = attr.constructor.name
        attr_name = attr_name.slice(4).slice(0, -4)


        let children = []
        let attr_start = attr.range[0]
        children.push({
            "name": "attr_name_index",
            "range": [attr_start, attr_start + 2],
        })
        children.push({
            "name": "attr_len",
            "range": [attr_start + 2, attr_start + 6],
        })

        let start = attr_start + 6
        if (attr.properties != undefined) {
            for (let i = 0; i < attr.properties.length; i += 2) {
                let item_type = attr.properties[i]
                let property = attr.properties[i + 1]
                var param = eval(`attr.${property}`)

                if (Array.isArray(item_type)) {
                    children.push({
                        name: property + "_count",
                        range: [start, start + item_type[0]]
                    })
                    start += item_type[0]

                    if (Number.isInteger(item_type[1])) {
                        children.push({
                            name: property,
                            range: [start, start + param.length * item_type[1]]
                        })

                        start += param.length * item_type[1]
                    }
                    else {
                        var stru = this.parseStruct(property, param, start)
                        children.push(stru)

                        start = stru.range[1]
                    }

                } else if (Number.isInteger(item_type)) {
                    children.push({
                        name: property + " : " + param,
                        range: [start, start + item_type]
                    })

                    start += item_type
                } else if (item_type == "AttrTable") {
                    var data = this.parseAttributes(param, start)
                    this.appendArray(children, data)
                    start = param.range[1]
                }
            }
        }
        return {
            name: `#${index} ${attr_name}`,
            children: children,
            range: attr.range,
        }
    }

    parseStruct(name, stru_arr, start) {
        let end = start
        let arr_children = []


        for (let t = 0; t < stru_arr.length; t++) {
            let stru = stru_arr[t]
            let children = []
            let item_start = end
            for (let i = 0; i < stru.properties.length; i += 2) {
                let item_type = stru.properties[i]
                let property = stru.properties[i + 1]
                var param = eval(`stru.${property}`)

                children.push({
                    name: property + " : " + param,
                    range: [end, end + item_type]
                })

                end += item_type
            }

            arr_children.push({
                name: "#${t}",
                children: children,
                range: [item_start, end]
            })
        }

        return {
            name: name,
            range: [start, end],
            children: arr_children,
        }
    }


    appendArray(arr1, arr2) {
        for (let item of arr2) {
            arr1.push(item)
        }
    }



}

