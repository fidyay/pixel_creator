import React, { useState, useRef, PointerEvent } from "react";
import Drawing from "../classes/Drawing";
import type { PenSizeType, BrushType} from "./Workplace";

interface CanvasProps {
    chosenBrush: BrushType,
    squareSize: number,
    setSquareSize: React.Dispatch<React.SetStateAction<number>>,
    background: string,
    widthInSquares: number,
    heightInSquares: number,
    chosenPenSize: PenSizeType,
    chosenColor: string
}

let currentSquareSize = 7
const maxWidth = document.documentElement.clientWidth * .45
const maxHeight = document.documentElement.clientHeight * .73

const Canvas = ({chosenBrush, widthInSquares, heightInSquares, squareSize, setSquareSize, background, chosenPenSize, chosenColor}: CanvasProps) => {
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
        if (chosenBrush !== 'selection' && drawing.current.selectedSquares?.squares?.length) {
            drawing.current.resetSelectedSquares()
        }
        drawing.current.setCTX(ctx)
        drawing.current.setSquareSize(squareWidthAndHeight)
        drawing.current.setPenSize(chosenPenSize)
        drawing.current.setColor(chosenColor)
        drawing.current.setBackground(background)
        drawing.current.setCanvasSize(heightInSquares, widthInSquares)
        drawing.current.drawImage()
    }


    function isPointedOutOfSelection(pointX: number, pointY: number) {
        const selectionStartX = drawing.current.getPixelCoord(drawing.current.selectedSquares.xStart)
        const selectionStartY = drawing.current.getPixelCoord(drawing.current.selectedSquares.yStart)
        const selectionEndX = drawing.current.getPixelCoord(drawing.current.selectedSquares.xEnd) + squareSize
        const selectionEndY = drawing.current.getPixelCoord(drawing.current.selectedSquares.yEnd) + squareSize

        if (pointX < selectionStartX) {
            return true
        }
        if (pointX > selectionEndX) {
            return true
        }
        if (pointY < selectionStartY) {
            return true
        }
        if (pointY > selectionEndY) {
            return true
        }

        return false
    }

    return (<div className="main__canvas">
                <canvas className="main__canvas-painting" onPointerDown={e => {
                    if ((e.target as HTMLCanvasElement).className !== 'main__canvas-painting') return
                    const { top: canvasTop, left: canvasLeft, width: cannvasWidth, height: canvasHeight } = (e.target as HTMLCanvasElement).getBoundingClientRect()
                    const pointX = e.clientX - canvasLeft
                    const pointY = e.clientY - canvasTop



                    if (pointX < 0 || pointX > cannvasWidth || pointY < 0 || pointY > canvasHeight) return

                    if (drawing.current.selectedSquares?.squares?.length > 0 && isPointedOutOfSelection(pointX, pointY)) {
                        drawing.current.resetSelectedSquares()
                    }

                    let clickX = 0
                    let clickY = 0

                    if (drawing.current.selectedSquares?.squares?.length > 0) {
                        clickX = pointX - drawing.current.selectedSquares.xStart * squareSize
                        clickY = pointY - drawing.current.selectedSquares.yStart * squareSize
                    }

                    let squaresToDraw: string[] = []

                    switch(chosenBrush) {
                        case 'pen':
                            drawing.current.drawSquare(pointX, pointY)
                            break
                        case 'line':
                            squaresToDraw = drawing.current.drawLine(pointX, pointY, pointX, pointY)
                            break
                        case 'paint_bucket': 
                            drawing.current.areaFill(pointX, pointY)
                            break
                        case 'eraser':
                            drawing.current.erase(pointX, pointY)
                            break
                        case 'rectangle':
                            squaresToDraw = drawing.current.rectangle(pointX, pointY, pointX, pointY)
                            break
                        case 'elipse': 
                            squaresToDraw = drawing.current.elipse(pointX, pointY, pointX, pointY)
                            break
                        case 'selection': 
                            if (!drawing.current.selectedSquares?.squares?.length) {
                                drawing.current.selectedSquares.isDrawing = true
                                drawing.current.selection(pointX, pointY, pointX, pointY)
                                drawing.current.drawSelectedSquares()
                            }
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

                        switch(chosenBrush) {
                            case 'pen':
                                drawing.current.drawSquare(pointMoveX, pointMoveY)
                                break
                            case 'line':
                                squaresToDraw = drawing.current.drawLine(pointX, pointY, pointMoveX, pointMoveY)
                                break
                            case 'eraser':
                                drawing.current.erase(pointMoveX, pointMoveY)
                                break
                            case 'rectangle':
                                squaresToDraw = drawing.current.rectangle(pointX, pointY, pointMoveX, pointMoveY)
                                break
                            case 'elipse': 
                                squaresToDraw = drawing.current.elipse(pointX, pointY, pointMoveX, pointMoveY)
                                break
                            case 'selection': 
                                if (drawing.current.selectedSquares?.isDrawing) {
                                    drawing.current.selection(pointX, pointY, pointMoveX, pointMoveY)
                                    drawing.current.drawSelectedSquares()
                                } else {
                                    drawing.current.moveSelection(pointMoveX - clickX, pointMoveY - clickY)
                                    drawing.current.drawSelectedSquares()
                                }
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
                        drawing.current.selectedSquares.isDrawing = false
                        window.removeEventListener('pointermove', pointerMoveListener)
                        window.removeEventListener('pointerup', pointerUpListener)
                    } 

                    window.addEventListener('pointermove', pointerMoveListener)
                    window.addEventListener('pointerup', pointerUpListener)
                    
                }} width={width} height={height} ref={node => setCanvas(node)}/>
            </div>)
}

export default Canvas