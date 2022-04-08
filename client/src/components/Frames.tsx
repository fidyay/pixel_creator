import React, { useState } from "react";
import Button from "./Button";
import Frame from "./Frame";

const frameHeight = 100
const frameWidth = 100

const Frames = () => {
    const [chosenFrame, setChosenFrame] = useState(0)
    const [frames, setFrames] = useState([{}])
    return (
        <div className="main__frames frames">
            <h3 className="frames__heading">
                Frames
            </h3>
            <ol className="frames__frame-list">
                {frames.map((frame, index) => {
                    return <Frame deleteFrame={e => {
                        e.stopPropagation()
                        const newFramesArray: {}[] = []
                        frames.forEach((frame, frameIndex) => {
                            if (frameIndex !== index) {
                                newFramesArray.push(frame)
                            }
                        })
                        setFrames(newFramesArray)

                        if (chosenFrame === index) {
                            if (index !== 0) {
                                setChosenFrame(index - 1)
                            }
                        }
                    }} setChosenFrame={setChosenFrame} chosen={chosenFrame === index} index={index} key={index} height={frameHeight} width={frameWidth}/>
                })}
            </ol>
            <Button onClick={() => {
                setFrames([...frames, {}])
            }} transparent className="frames__create-frame">Create frame</Button>
        </div>
    )
}

export default Frames