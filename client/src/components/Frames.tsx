import React, { useContext } from "react";
import Button from "./Button";
import Frame from "./Frame";
import { StateContext } from "./App";
import { observer } from "mobx-react";

const frameHeight = 100
const frameWidth = 100

interface FramesProps {
    drawingId: string,
    chosenFrame: number,
    setChosenFrame: React.Dispatch<React.SetStateAction<number>>
}

const Frames = observer(({drawingId, chosenFrame, setChosenFrame}: FramesProps) => {
    const state = useContext(StateContext)
    const frames = state.drawings[drawingId].frames
    return (
        <div className="main__frames frames">
            <h3 className="frames__heading">
                Frames
            </h3>
            <ol className="frames__frame-list">
                {frames.map((frame, index) => {
                    return <Frame drawingId={drawingId} deleteFrame={e => {
                        e.stopPropagation()
                        state.deleteFrame(drawingId, chosenFrame)
                        if (chosenFrame === index) {
                            if (index !== 0) {
                                setChosenFrame(index - 1)
                            }
                        }
                    }} setChosenFrame={setChosenFrame} chosen={chosenFrame === index} index={index} key={index} height={frameHeight} width={frameWidth}/>
                })}
            </ol>
            <Button onClick={() => {
                state.createFrame(drawingId)
            }} transparent className="frames__create-frame">Create frame</Button>
        </div>
    )
})

export default Frames