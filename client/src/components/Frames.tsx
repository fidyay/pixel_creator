import React, { useContext } from "react";
import Button from "./Button";
import Frame from "./Frame";
import { StateContext } from "./App";
import { observer } from "mobx-react";

interface FramesProps {
    drawingId: string,
    chosenFrame: number,
    setChosenFrame: React.Dispatch<React.SetStateAction<number>>
}

const averageMaxFrameSize = 100

const Frames = observer(({drawingId, chosenFrame, setChosenFrame}: FramesProps) => {
    const state = useContext(StateContext)
    const drawing = state.drawings[drawingId]
    const frames = drawing.frames
    let squareSize: number
    const squareWidth = averageMaxFrameSize/drawing.widthInSquares
    const squareHeight = averageMaxFrameSize/drawing.heightInSquares
    if (squareWidth > squareHeight) {
        squareSize = Math.round(squareWidth)
    } else {
        squareSize = Math.round(squareHeight)
    }
    return (
        <div className="main__frames frames">
            <h3 className="frames__heading">
                Frames
            </h3>
            <ol className="frames__frame-list">
                {frames.map((frame, index) => {
                    return <Frame canvasWidth={squareSize * drawing.widthInSquares} canvasHeight={squareSize * drawing.heightInSquares} drawingId={drawingId} deleteFrame={e => {
                        e.stopPropagation()
                        state.deleteFrame(drawingId, chosenFrame)
                        if (chosenFrame === index) {
                            if (index !== 0) {
                                setChosenFrame(index - 1)
                            }
                        }
                    }} setChosenFrame={setChosenFrame} chosen={chosenFrame === index} index={index} key={index}/>
                })}
            </ol>
            <Button onClick={() => {
                setChosenFrame(frames.length)
                state.createFrame(drawingId)
            }} transparent className="frames__create-frame">Create frame</Button>
        </div>
    )
})

export default Frames