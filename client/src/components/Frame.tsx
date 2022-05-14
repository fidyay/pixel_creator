import React, { useState } from "react";
import { pointerDownHandler } from "./Button";
import Button from "./Button";

interface FrameProps {
    height: number,
    width: number,
    index: number,
    chosen: boolean,
    setChosenFrame: React.Dispatch<React.SetStateAction<number>>,
    deleteFrame: (e: React.PointerEvent<HTMLButtonElement>) => void
}

const maxHeightOrWidth = 100

const Frame = ({height, width, index, chosen, setChosenFrame, deleteFrame}: FrameProps) => {
    const [canvas, setCanvas] = useState(null)
    
    let canvasHeight
    let canvasWidth

    if (height === width) {
        canvasWidth = maxHeightOrWidth
        canvasHeight = maxHeightOrWidth
    }

    if (height > width) {
        canvasHeight = maxHeightOrWidth
        canvasWidth = maxHeightOrWidth * (width/height)
    }

    if (width > height) {
        canvasWidth = maxHeightOrWidth
        canvasHeight = maxHeightOrWidth * (height/width)
    }

    return (
        <li onClick={() => setChosenFrame(index)} onPointerDown={pointerDownHandler} className="frames__frame-list-item">
            <div className="frames__frame-list-number">{index + 1}.</div>
            <div className={`frames__frame-list-canvas${chosen ? ' chosen' : ''}`}>
                <canvas height={canvasHeight} width={canvasWidth} ref={node => setCanvas(node)}/>
            </div>
            <Button deleteButton transparent onClick={deleteFrame} className="frames__frame-list-delete-frame">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF"><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/></svg>
            </Button>
        </li>
    )
}

export default Frame