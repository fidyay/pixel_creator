import React, { useContext, useEffect, useRef } from "react";
import { observer } from "mobx-react";
import { StateContext } from "./App";
import { Link } from "react-router-dom";
import ProjectParameters from "./ProjectParameters";
import drawFrame from "../functions/drawFrame";
import ActiveEffect from "./Effects/ActiveEffect";

interface UserProjectProps {
    id: string, 
    maxWidthInPixels: number,
    squareWidth: number,
    margines: number,
    onStartOfTheLine: boolean
}

const fps = 16

const UserProject = observer(({id, squareWidth, maxWidthInPixels, margines, onStartOfTheLine}: UserProjectProps) => {
    const drawing = useContext(StateContext).drawings[id]
    const canvas = useRef<HTMLCanvasElement>(null)

    const canvasHeight = squareWidth * drawing.heightInSquares
    const canvasWidth = squareWidth * drawing.widthInSquares

    useEffect(() => {
        let animationFrame: number
        if (drawing.type === 'sprite') {
            if (canvas.current) {
                let currentFrameIndex = 0
                let timestamp = performance.now()
                const drawSpriteAnimation = () => {
                    const currentTime = performance.now()
                    if (currentTime - timestamp > 1000/fps) {
                        timestamp = currentTime
                        drawFrame(drawing, canvas.current, canvasWidth, canvasHeight, currentFrameIndex)
                        if (currentFrameIndex === drawing.frames.length - 1) {
                            currentFrameIndex = 0
                        } else {
                            currentFrameIndex++
                        }
                    }
                    animationFrame = requestAnimationFrame(drawSpriteAnimation)
                }
                animationFrame = requestAnimationFrame(drawSpriteAnimation)
            }
        } else if (drawing.type === 'image') {
            drawFrame(drawing, canvas.current, canvasWidth, canvasHeight, 0)
        }

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame)
            }
        }
    })

    return (
        <div style={{marginRight: `${margines}px`, marginLeft: onStartOfTheLine ? `${margines}px` : '0'}} className="projects__project project">
            <Link style={{width: `${maxWidthInPixels}px`}} className="project__link" to={`/workplace/${id}`}>
                <canvas width={canvasWidth} height={canvasHeight} ref={canvas}/>
                <h3>{drawing.name}</h3>
                <ActiveEffect/>
            </Link>
            <ProjectParameters/>
        </div>
    )
})

export default UserProject