class ByteAreaPainter {
    constructor(wrapper_sel, buffer) {
        this.data = new Uint8Array(buffer)

        this.ctx = this.getctx(wrapper_sel + "> canvas")

        this.canvas = this.querysel(wrapper_sel + "> canvas")

        this.row = 10
        this.box_l = 25

        this.setup(wrapper_sel)
    }

    setup(sel) {
        let ctx = this.ctx

        let resizeCanvas = () => {
            let rect = this.querysel(sel).getBoundingClientRect()

            this.canvas.width = rect.width

            this.row = parseInt(this.canvas.width / this.box_l)

            let col = Math.ceil(this.data.length / this.row)

            this.canvas.height = col * this.box_l + 20
        }

        window.addEventListener('resize', resizeCanvas, false);

        resizeCanvas()
    }
    getctx(canvas_sel) {
        let canvas = this.querysel(canvas_sel)
        let ctx = canvas.getContext("2d"); //你的canvas代码在这里
        return ctx;
    }

    querysel(sel) {
        return document.querySelector(sel);
    }

    draw() {
        for (let i = 0; i < this.data.length; i++) {
            this.drawItem(i)
        }
    }

    drawItem(index, bgcolor="#fff") {
        let [x, y] = this.getCanvasCoord(index)

        log(x, y)
        this.drawBox(x, y, bgcolor)

        let text = this.uint8ToHex(this.data[index]).toUpperCase()
        this.drawText(text, x, y)
    }

    drawBox(x, y, bgcolor) {
        let ctx = this.ctx
        ctx.clearRect(x, y, this.box_l, this.box_l)

        ctx.fillStyle = bgcolor
        ctx.lineWidth = 2;
        ctx.fillRect(x, y, this.box_l, this.box_l);
    }

    getCoord(index) {
        let y = parseInt(index / this.row)
        let x = index % this.row

        return [x, y]
    }

    getCanvasCoord(index) {
        let [x, y] = this.getCoord(index)

        return [this.box_l * x, this.box_l * y]
    }

    drawText(text, x, y) {
        let ctx = this.ctx
        
        x += 3
        y += 3

        ctx.font = "15px Courier";
        ctx.fillStyle = "black";
        ctx.textBaseline = "top"
        ctx.fillText(text, x, y);
    }

    uint8ToHex(val) {
        let high = val >> 4
        let low = val & 0xf
        return high.toString(16) + low.toString(16)
    }


    highlight(start, end) {
        for (let i = start; i < end; i++) {
            this.drawItem(i, "#eee")
        }
    }
}
