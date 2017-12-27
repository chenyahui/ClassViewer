class ClassReader {
    // data is ArrayBuffer
    constructor(data) {
        this.data = data

        this.now = 0
    }

    read(byte_num) {
        // 将字节转为大端序
        let result = eval(`new DataView(this.data, 0,  ${byte_num})
        .getUint${byte_num * 8}(0 , false)`)

        this.data = this.data.slice(byte_num)

        this.now += byte_num
        
        return result
    }

    /*
    @param num_type num的字节个数
    @param item_type 每个元素的类型。当为int的时候，代表直接利用reader进行读取相应字节个数。
                    当为字符串类型的时候，是一个对象的名字
    */

    readarr(num_type, item_type) {
        let num = this.read(num_type)
        let result = []

        for (let i = 0; i < num; i++) {

            let item = ""

            if (Number.isInteger(item_type)) {
                item = this.read(item_type)
            } else {
                item = eval(`new ${item_type}()`)
                item.read(this)
            }

            result.push(item)
        }

        return result
    }

}