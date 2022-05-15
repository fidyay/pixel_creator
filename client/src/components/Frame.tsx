import React, { useState, useContext } from "react";
import { pointerDownHandler } from "./Button";
import Button from "./Button";
import { observer } from "mobx-react";
import { StateContext } from "./App";

interface FrameProps {
    height: number,
    width: number,
    index: number,
    chosen: boolean,
    drawingId: string,
    setChosenFrame: React.Dispatch<React.SetStateAction<number>>,
    deleteFrame: (e: React.PointerEvent<HTMLButtonElement>) => void
}

const maxHeightOrWidth = 100

const Frame = observer(({height, width, index, drawingId, chosen, setChosenFrame, deleteFrame}: FrameProps) => {
    const [canvas, setCanvas] = useState(null)
    const drawing = useContext(StateContext).drawings[drawingId]
    
    let canvasHeight = drawing.heightInSquares > drawing.widthInSquares ? maxHeightOrWidth : drawing.heightInSquares/drawing.widthInSquares*maxHeightOrWidth
    let canvasWidth = drawing.widthInSquares > drawing.heightInSquares ? maxHeightOrWidth : drawing.widthInSquares/drawing.heightInSquares*maxHeightOrWidth

    if (canvas) {
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
        if (drawing.background !== 'transparent') {
            ctx.fillStyle = drawing.background
            ctx.fillRect(0, 0, canvasWidth, canvasHeight)
        }
        let squareSize = canvasWidth/drawing.widthInSquares
        Object.keys(drawing.frames[index]).forEach(key => {
            const coords = key.split(';')
            const X = Number(coords[0].slice(2))
            const Y = Number(coords[1].slice(2))
            ctx.fillStyle = drawing.frames[index][key]
            ctx.clearRect(Math.floor(X * squareSize), Math.floor(Y * squareSize), squareSize, squareSize)
            ctx.fillRect(Math.floor(X * squareSize), Math.floor(Y * squareSize), squareSize, squareSize)
        })
    }

    return (
        <li onClick={() => setChosenFrame(index)} onPointerDown={pointerDownHandler} className="frames__frame-list-item">
            <div className="frames__frame-list-number">{index + 1}.</div>
            <div className={`frames__frame-list-canvas${chosen ? ' chosen' : ''}`}>
                <canvas height={Math.floor(canvasHeight)} width={Math.floor(canvasWidth)} ref={node => setCanvas(node)}/>
            </div>
            <Button deleteButton transparent onClick={deleteFrame} className="frames__frame-list-delete-frame">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF"><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/></svg>
            </Button>
        </li>
    )
})

export default Frame