class CodeReader {
    constructor(data) {
        this.data = data
    }

    read(num) {
        if (this.data.length == 0) {
            return false
        }
        let result = 0x0;
        for (let i = 0; i < num; i++) {
            result = (result << 8) | this.data[i]
        }

        this.data = this.data.slice(num)

        return result
    }
}