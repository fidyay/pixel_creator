import React, { useState, useRef, PointerEvent, PointerEventHandler } from "react";
import Drawing from "../classes/Drawing";

interface CanvasProps {
    actionType: 'pen' | 'line' | 'paint_bucket' | 'eraser' | 'selection_rectangle' | 'selection_round' | 'selection_rectangle_filled' | 'selection_round_filled' | 'pipette',
    squareSize: number,
    setSquareSize: React.Dispatch<React.SetStateAction<number>>,
    backgroundTransparent: boolean,
    widthInSquares: number,
    heightInSquares: number
}

const trasparentBgSquareSize = 6

let currentSquareSize = 7
const maxWidth = document.documentElement.clientWidth * .45
const maxHeight = document.documentElement.clientHeight * .73

const Canvas = ({actionType, widthInSquares, heightInSquares, squareSize, setSquareSize, backgroundTransparent}: CanvasProps) => {
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
        if (backgroundTransparent) {
            let fourTransparentSquaresWidth = Math.ceil(width/(2*trasparentBgSquareSize))
            let fourTransparentSquaresHeight = Math.ceil(height/(2*trasparentBgSquareSize))
            for (let i = 0; i < fourTransparentSquaresWidth; i++) {
                for (let j = 0; j < fourTransparentSquaresHeight; j++) {
                    for (let k = 0, m = 0; k < 2; k++, m++) {
                        for (let l = 0; l < 2; l++, m++) {
                            ctx.fillStyle = (m % 2 === 0) ? '#555555' : '#4c4c4c'
                            ctx.fillRect(i * 2 * trasparentBgSquareSize + k * trasparentBgSquareSize, j * 2 * trasparentBgSquareSize + l * trasparentBgSquareSize, trasparentBgSquareSize, trasparentBgSquareSize)
                        }
                    }
                }
            }
        }
    }

    return (<div className="main__canvas">
                <canvas className="main__canvas-painting" onPointerDown={e => {
                    const draw = (e: PointerEvent<HTMLCanvasElement> | MouseEvent) => {
                        if ((e.target as HTMLCanvasElement).className !== 'main__canvas-painting') return
                        const { top: canvasTop, left: canvasLeft, width: cannvasWidth, height: canvasHeight } = (e.target as HTMLCanvasElement).getBoundingClientRect()
                        const coords = {
                            x: Math.floor((e.clientX - canvasLeft)/squareWidthAndHeight),
                            y: Math.floor((e.clientY - canvasTop)/squareWidthAndHeight)
                        }

                        if (coords.x < 0 || coords.x > cannvasWidth || coords.y < 0 || coords.y > canvasHeight) return

                        switch(actionType) {
                            case 'pen':
                                drawing.current.drawSquare(coords.x, coords.y, squareWidthAndHeight, '#000')
                                break
                            default: 
                                drawing.current.drawSquare(coords.x, coords.y, squareWidthAndHeight, '#000')
                                break
                        }
                    }

                    draw(e)

                    const pointerMoveListener = (e:MouseEvent) => {
                        draw(e)
                    }

                    const pointerUpListener = () => {
                        window.removeEventListener('pointermove', pointerMoveListener)
                        window.removeEventListener('pointerup', pointerUpListener)
                    } 


                    window.addEventListener('pointermove', pointerMoveListener)
                    window.addEventListener('pointerup', pointerUpListener)
                    
                }} width={width} height={height} ref={node => setCanvas(node)}/>
            </div>)
}

export default Canvas