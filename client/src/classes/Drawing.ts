class Drawing {
    ctx?: CanvasRenderingContext2D
    drawing: any

    constructor() {
        this.drawing = {}
    }

    setCTX(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx
    }

    drawSquare(x: number, y: number, squareSize: number, color: string) {
        this.drawing[`x:${x};y:${y}`] = color
        this.ctx.fillStyle = color
        this.ctx.fillRect(x * squareSize, y * squareSize, squareSize, squareSize)
    }
}

export default Drawing