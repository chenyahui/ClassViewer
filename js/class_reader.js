class ClassReader {
    constructor(data) {
        this.data = data
        this.now = 0
    }

    read(byte_num) {
        var result = 0

        for (var i = 0; i < byte_num; ++i) {
            result |= this.data[this.now + i] << ((byte_num - i - 1) * 8);
        }

        this.now += byte_num

        return convertToUnsigned(result, byte_num)
    }
}