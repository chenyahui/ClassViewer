class ByteAreaPainter {
    constructor(wrapper_sel, buffer) {
        this.wrapper_sel = wrapper_sel
        this.data = new Uint8Array(buffer)

        this.ctx = this.getctx(wrapper_sel + "> canvas")

        this.canvas = this.querysel(wrapper_sel + "> canvas")

        this.col = 10
        this.box_l = 25

        this.last_highlight = [0, 0]
        this.setup()
    }

    resizeCanvas() {
        let wrapper = this.querysel(this.wrapper_sel)
        let width = parseInt(wrapper.style.width.slice(0, -2))
        // let rect = this.querysel(sel).getBoundingClientRect()

        this.canvas.width = width - 5
        this.col = parseInt(this.canvas.width / this.box_l)
        let row = Math.ceil(this.data.length / this.col)

        this.canvas.height = row * this.box_l + 20
    }

    setup() {
        this.resizeCanvas()
        window.addEventListener('resize', () => { 
            this.draw() 
        }, false);
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
        log("draw")
        this.drawRange(0, this.data.length)
    }

    drawRange(start, end, bgcolor = "#fff") {
        for (let i = start; i < end; i++) {
            this.drawItem(i, bgcolor)
        }
    }
    drawItem(index, bgcolor) {
        let [x, y] = this.getCanvasCoord(index)

        this.drawBox(x, y, bgcolor)

        let text = this.uint8ToHex(this.data[index]).toUpperCase()
        this.drawText(text, x, y)
    }

    drawBox(x, y, border_color = "#fff") {
        let ctx = this.ctx
        ctx.clearRect(x, y, this.box_l, this.box_l)

        ctx.strokeStyle = border_color
        ctx.fillStyle = "#fff"
        ctx.lineWidth = 2;
        ctx.fillRect(x, y, this.box_l, this.box_l);
        ctx.strokeRect(x, y, this.box_l, this.box_l);
    }

    getCoord(index) {
        let y = parseInt(index / this.col)
        let x = index % this.col

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

        // 清除
        this.drawRange(this.last_highlight[0], this.last_highlight[1])

        // 高亮
        this.drawRange(start, end, "red")

        // 记录
        this.last_highlight = [start, end]

        // 滚动
        this.scrollTo(start)

    }

    scrollTo(index) {
        let [x, y] = this.getCanvasCoord(index)
        $(this.wrapper_sel).scrollTop(y)
    }
}
