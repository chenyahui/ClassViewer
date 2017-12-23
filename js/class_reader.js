class ClassReader {
    // data is ArrayBuffer
    constructor(data) {
        this.data = data
    }

    read(byte_num) {
        // 将字节转为大端序
        let result = eval(`new DataView(this.data, 0,  ${byte_num})
        .getUint${byte_num * 8}(0 , false)`)

        this.data = this.data.slice(byte_num)

        return result
    }

    readarr(num_byte_len, item_byte_len){
        let num = this.read(num_byte_len)
        let result = []

        for (let i = 0; i < num; i++) {
            result.push(this.read(item_byte_len))            
        }
    }
}