import React, { useState, useContext } from "react";
import ActiveEffect from "./Effects/ActiveEffect";
import Button from "./Button";
import { observer } from "mobx-react";
import { StateContext } from "./App";
import drawFrame from "../functions/drawFrame"

interface FrameProps {
    index: number,
    chosen: boolean,
    drawingId: string,
    canvasWidth: number,
    canvasHeight: number,
    setChosenFrame: React.Dispatch<React.SetStateAction<number>>,
    deleteFrame: (e: React.PointerEvent<HTMLButtonElement>) => void
}

const maxHeightOrWidth = 100

const Frame = observer(({index, drawingId, chosen, canvasWidth, canvasHeight, setChosenFrame, deleteFrame}: FrameProps) => {
    const [canvas, setCanvas] = useState(null)
    const drawing = useContext(StateContext).drawings[drawingId]

    if (canvas) {
        drawFrame(drawing, canvas, canvasWidth, canvasHeight, index)
    }

    return (
        <li style={{width: `${canvasWidth + 30}px`, height: `${canvasHeight + 40}px`}} onClick={() => setChosenFrame(index)} className="frames__frame-list-item">
            <div style={{right: `${canvasWidth + 20}px`}} className="frames__frame-list-number">{index + 1}.</div>
            <div style={{width: `${canvasWidth + 10}px`, height: `${canvasHeight + 10}px`}} className={`frames__frame-list-canvas${chosen ? ' chosen' : ''}`}>
                <canvas height={Math.floor(canvasHeight)} width={Math.floor(canvasWidth)} ref={node => setCanvas(node)}/>
                <Button deleteButton transparent onClick={deleteFrame} className="frames__frame-list-delete-frame">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF"><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/></svg>
                </Button>
                <ActiveEffect/>
            </div>
        </li>
    )
})

export default Frame