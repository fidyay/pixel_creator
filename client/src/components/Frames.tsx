import React, { useContext, useRef } from "react";
import Button from "./Button";
import Frame from "./Frame";
import { StateContext } from "../index";
import { observer } from "mobx-react";
import Scrollbar from "./Effects/Scrollbar";

interface FramesProps {
    drawingId: string,
    chosenFrame: number,
    setChosenFrame: React.Dispatch<React.SetStateAction<number>>
}

const averageMaxFrameSize = 100

const Frames = observer(({drawingId, chosenFrame, setChosenFrame}: FramesProps) => {
    const state = useContext(StateContext)
    const drawing = state.drawings[drawingId]
    const ol = useRef<HTMLOListElement>(null)
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
            <Scrollbar>
                <ol ref={ol} className="frames__frame-list">
                    {frames.map((frame, index) => {
                        return <Frame canvasWidth={squareSize * drawing.widthInSquares} canvasHeight={squareSize * drawing.heightInSquares} drawingId={drawingId} deleteFrame={e => {
                            e.stopPropagation()
                            if (drawing.frames.length === 1) return
                            state.deleteFrame(drawingId, chosenFrame)
                            if (index === drawing.frames.length) setChosenFrame(index - 1)
                            else setChosenFrame(index)
                        }}
                        setChosenFrame={setChosenFrame} chosen={chosenFrame === index}
                        changeOrder={e => {
                            const el = e.currentTarget
                            el.style.transition = 'unset'
                            const elHeight = squareSize * drawing.widthInSquares + 40
                            const frameIndex = index
                            let toIndex = index
                            const initialElementTop = el.getBoundingClientRect().top
                            const pointY = e.clientY - initialElementTop
                            let elementTop = initialElementTop
                            const olRect = ol.current.getBoundingClientRect()
                            const minY = olRect.top
                            const maxY = olRect.bottom - elHeight
                            const moveElement = (e: MouseEvent) => {
                                const yPos = e.clientY - pointY - elementTop
                                if (e.clientY - pointY < minY) return
                                if (e.clientY - pointY > maxY) return 0
                                el.style.top = `${e.clientY - pointY - initialElementTop}px`
                                if (yPos < -elHeight/2) {
                                    elementTop -= elHeight
                                    const liElements = document.querySelectorAll('.frames__frame-list-item')
                                    const liElementOnToIndex = liElements[toIndex] as HTMLLIElement
                                    const liElementBefore = liElements[toIndex - 1] as HTMLLIElement
                                    if (liElementOnToIndex && liElementOnToIndex.style.top === `${-elHeight}px` && toIndex !== index) {
                                        liElementOnToIndex.style.top = ''
                                    } else if (liElementBefore) {
                                        const liElY = elHeight
                                        liElementBefore.style.top = `${liElY}px`
                                    }
                                    toIndex = toIndex === index ? index - 1 : toIndex - 1
                                }
                                if (yPos > elHeight/2) {
                                    elementTop += elHeight
                                    const liElements = document.querySelectorAll('.frames__frame-list-item')
                                    const liElementOnToIndex = liElements[toIndex] as HTMLLIElement
                                    const liElementAfter = liElements[toIndex + 1] as HTMLLIElement
                                    if (liElementOnToIndex && liElementOnToIndex.style.top === `${elHeight}px` && toIndex !== index) {
                                        liElementOnToIndex.style.top = ''
                                    } else if (liElementAfter) {
                                        const liElY = -elHeight
                                        liElementAfter.style.top = `${liElY}px`
                                    }
                                    toIndex = toIndex === index ? index + 1 : toIndex + 1
                                }
                            }

                            const setFramesToIndexes = (e: MouseEvent) => {
                                if (frameIndex !== toIndex) {
                                    state.changeFrameOrder(drawingId, frameIndex, toIndex)
                                    setTimeout(() => setChosenFrame(toIndex))
                                }
                                document.querySelectorAll('.frames__frame-list-item').forEach((element: HTMLLIElement) => {
                                    element.style.transition = 'unset'
                                    element.style.top = ''
                                    setTimeout(() => element.style.transition = '')
                                })
                                window.removeEventListener('mousemove', moveElement)
                                window.removeEventListener('mouseup', setFramesToIndexes)
                            }

                            window.addEventListener('mousemove', moveElement)
                            window.addEventListener('mouseup', setFramesToIndexes)
                        }}
                        index={index} key={index}/>
                    })}
                </ol>
            </Scrollbar>
            <Button onClick={() => {
                setChosenFrame(frames.length)
                state.createFrame(drawingId)
            }} transparent className="frames__create-frame">Create frame</Button>
        </div>
    )
})

export default Frames