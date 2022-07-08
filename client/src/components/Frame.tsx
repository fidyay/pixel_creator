import React, { useState, useContext } from "react";
import RippleEffect from "./Effects/RippleEffect";
import Button from "./Button";
import { observer } from "mobx-react";
import { StateContext } from "../index";
import drawFrame from "../functions/drawFrame";
import Hint from "./Hint";

interface FrameProps {
    index: number,
    chosen: boolean,
    drawingId: string,
    canvasWidth: number,
    canvasHeight: number,
    setChosenFrame: React.Dispatch<React.SetStateAction<number>>,
    deleteFrame: (e: React.PointerEvent<HTMLButtonElement>) => void,
    copyFrame: (e: React.PointerEvent<HTMLButtonElement>) => void
    changeOrder: (e: React.MouseEvent<HTMLLIElement>) => void
}

const Frame = observer(({index, drawingId, chosen, canvasWidth, canvasHeight, setChosenFrame, deleteFrame, copyFrame, changeOrder}: FrameProps) => {
    const [canvas, setCanvas] = useState(null)
    const drawing = useContext(StateContext).drawings[drawingId]

    if (canvas) {
        drawFrame(drawing, canvas, canvasWidth, canvasHeight, index)
    }

    return (
        <li onMouseDown={changeOrder} style={{width: `${canvasWidth + 30}px`, height: `${canvasHeight + 40}px`}} className="frames__frame-list-item">
            <div style={{right: `${canvasWidth + 20}px`}} className="frames__frame-list-number">{index + 1}.</div>
            <div onClick={e => {
                    setChosenFrame(index)
                }} style={{width: `${canvasWidth + 10}px`, height: `${canvasHeight + 10}px`}} className={`frames__frame-list-canvas${chosen ? ' chosen' : ''}`}>
                <canvas height={Math.floor(canvasHeight)} width={Math.floor(canvasWidth)} ref={node => setCanvas(node)}/>
                <Button deleteButton transparent onClick={deleteFrame} className="frames__frame-list-delete-frame">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF"><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/></svg>
                </Button>
                <Button transparent onClick={copyFrame} className="frames__frame-list-copy-frame">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M9 43.95q-1.2 0-2.1-.9-.9-.9-.9-2.1V10.8h3v30.15h23.7v3Zm6-6q-1.2 0-2.1-.9-.9-.9-.9-2.1v-28q0-1.2.9-2.1.9-.9 2.1-.9h22q1.2 0 2.1.9.9.9.9 2.1v28q0 1.2-.9 2.1-.9.9-2.1.9Zm0-3h22v-28H15v28Zm0 0v-28 28Z"/></svg>
                </Button>
                <RippleEffect/>
            </div>
        </li>
    )
})

export default Frame