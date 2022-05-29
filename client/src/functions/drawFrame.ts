import type { Drawing, CoordType } from "../state/State"

const drawFrame = (drawing: Drawing, canvas: HTMLCanvasElement, canvasWidth: number, canvasHeight: number, frameIndex: number) => {
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    if (drawing.background !== 'transparent') {
        ctx.fillStyle = drawing.background
        ctx.fillRect(0, 0, canvasWidth, canvasHeight)
    }
    let squareSize = canvasWidth/drawing.widthInSquares
    Object.keys(drawing.frames[frameIndex]).forEach((key: CoordType) => {
        const coords = key.split(';')
        const X = Number(coords[0].slice(2))
        const Y = Number(coords[1].slice(2))
        ctx.fillStyle = drawing.frames[frameIndex][key]
        ctx.clearRect(X * squareSize, Y * squareSize, squareSize, squareSize)
        ctx.fillRect(X * squareSize, Y * squareSize, squareSize, squareSize)
    })
}

export default drawFrame