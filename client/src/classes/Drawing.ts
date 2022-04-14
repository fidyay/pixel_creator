import type { PenSizeType } from "../components/Workplace";

class Drawing {
    ctx?: CanvasRenderingContext2D
    drawing: any

    constructor() {
        this.drawing = {}
    }

    setCTX(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx
    }

    drawSquare(penSize: PenSizeType, x: number, y: number, squareSize: number, color: string) {
        this.ctx.fillStyle = color
        const startCoords = {
            x: Math.floor((x)/(squareSize*penSize)) * penSize,
            y: Math.floor((y)/(squareSize*penSize)) * penSize
        }
        for (let i = 0; i < penSize; i++) {
            for (let j = 0; j < penSize; j++) {
                const coordX = startCoords.x + i
                const coordY = startCoords.y + j
                if (!this.drawing[`x:${coordX};y:${coordY}`] || this.drawing[`x:${coordX};y:${coordY}`].color !== color) {
                    this.drawing[`x:${coordX};y:${coordY}`] = color
                    this.ctx.fillRect(coordX * squareSize, coordY * squareSize, squareSize, squareSize)
                }
            }
        }
    }
}

export default Drawing