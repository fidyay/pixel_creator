import React, { useState, useRef, PointerEvent } from "react";
import Drawing from "../classes/Drawing";
import type { PenSizeType, BrushType} from "./Workplace";

interface CanvasProps {
    chosenBrush: BrushType,
    squareSize: number,
    setSquareSize: React.Dispatch<React.SetStateAction<number>>,
    backgroundTransparent: boolean,
    widthInSquares: number,
    heightInSquares: number,
    chosenPenSize: PenSizeType
}

let currentSquareSize = 7
const maxWidth = document.documentElement.clientWidth * .45
const maxHeight = document.documentElement.clientHeight * .73

const Canvas = ({chosenBrush, widthInSquares, heightInSquares, squareSize, setSquareSize, backgroundTransparent, chosenPenSize}: CanvasProps) => {
    const [canvas, setCanvas] = useState(null)
    const drawing = useRef(new Drawing)

    let squareWidthAndHeight = squareSize
    let width = widthInSquares * squareWidthAndHeight
    let height = heightInSquares * squareWidthAndHeight

    while (width > maxWidth || height > maxHeight) {
        squareWidthAndHeight--
        width = widthInSquares * squareWidthAndHeight
        height = heightInSquares * squareWidthAndHeight
    }

    if (squareWidthAndHeight !== currentSquareSize) {
        setSquareSize(squareWidthAndHeight)
        currentSquareSize = squareWidthAndHeight
    }

    if (canvas) {
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
        drawing.current.setCTX(ctx)
        drawing.current.setSquareSize(squareWidthAndHeight)
        drawing.current.setPenSize(chosenPenSize)
        drawing.current.setColor('#000')
        drawing.current.setBackground(backgroundTransparent ? 'transparent' : '')
        drawing.current.setCanvasSize(heightInSquares, widthInSquares)
        drawing.current.drawImage()
    }

    return (<div className="main__canvas">
                <canvas className="main__canvas-painting" onPointerDown={e => {
                    if ((e.target as HTMLCanvasElement).className !== 'main__canvas-painting') return
                    const { top: canvasTop, left: canvasLeft, width: cannvasWidth, height: canvasHeight } = (e.target as HTMLCanvasElement).getBoundingClientRect()
                    const pointX = e.clientX - canvasLeft
                    const pointY = e.clientY - canvasTop

                    if (pointX < 0 || pointX > cannvasWidth || pointY < 0 || pointY > canvasHeight) return

                    let squaresToDraw: string[] = []

                    switch(chosenBrush) {
                        case 'pen':
                            drawing.current.drawSquare(pointX, pointY)
                            break
                        case 'line':
                            squaresToDraw = drawing.current.drawLine(pointX, pointY, pointX, pointY)
                            break
                        default: 
                            drawing.current.drawSquare(pointX, pointY)
                            break
                    }
                    const draw = (e: PointerEvent<HTMLCanvasElement> | MouseEvent) => {
                        if ((e.target as HTMLCanvasElement).className !== 'main__canvas-painting') return
                        const { top: canvasTop, left: canvasLeft, width: cannvasWidth, height: canvasHeight } = (e.target as HTMLCanvasElement).getBoundingClientRect()
                        const pointMoveX = e.clientX - canvasLeft
                        const pointMoveY = e.clientY - canvasTop

                        if (pointMoveX < 0 || pointMoveX > cannvasWidth || pointMoveY < 0 || pointMoveY > canvasHeight) return

                        // temporary code


                        switch(chosenBrush) {
                            case 'pen':
                                drawing.current.drawSquare(pointMoveX, pointMoveY)
                                break
                            case 'line':
                                squaresToDraw = drawing.current.drawLine(pointX, pointY, pointMoveX, pointMoveY)
                                break
                            default: 
                                drawing.current.drawSquare(pointMoveX, pointMoveY)
                                break
                        }
                    }

                    const pointerMoveListener = (e: MouseEvent) => {
                        draw(e)
                    }

                    const pointerUpListener = () => {
                        if (squaresToDraw.length > 0) {
                            drawing.current.addAndDrawSquares(squaresToDraw)
                        }
                        window.removeEventListener('pointermove', pointerMoveListener)
                        window.removeEventListener('pointerup', pointerUpListener)
                    } 

                    window.addEventListener('pointermove', pointerMoveListener)
                    window.addEventListener('pointerup', pointerUpListener)
                    
                }} width={width} height={height} ref={node => setCanvas(node)}/>
            </div>)
}

export default Canvas