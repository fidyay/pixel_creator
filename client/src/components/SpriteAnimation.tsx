import React, { useState, useEffect } from "react";
import Button from "./Button";
import type { Drawing } from "../state/State";
import drawFrame from "../functions/drawFrame"

interface SpriteAnimationProps {
    drawing: Drawing
}

const maxHeightOrWidth = 200

const SpriteAnimation = ({drawing}: SpriteAnimationProps) => {
    const [canvas, setCanvas] = useState(null)
    const [fps, setFPS] = useState(16)

    let squareSize: number
    const squareWidth = maxHeightOrWidth/drawing.widthInSquares
    const squareHeight = maxHeightOrWidth/drawing.heightInSquares
    if (squareWidth > squareHeight) {
        squareSize = Math.round(squareWidth)
    } else {
        squareSize = Math.round(squareHeight)
    }

    let canvasHeight = drawing.heightInSquares * squareSize
    let canvasWidth = drawing.widthInSquares * squareSize

    useEffect(() => {
        let animationFrame: number
        if (canvas) {
            let currentFrameIndex = 0
            let timestamp = performance.now()
            const drawSpriteAnimation = () => {
                const currentTime = performance.now()
                if (currentTime - timestamp > 1000/fps) {
                    timestamp = currentTime
                    drawFrame(drawing, canvas, canvasWidth, canvasHeight, currentFrameIndex)
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
        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame)
            }
        }
    })

    return (
        <div className="project-options__sprite-animation sprite-animation">
            <canvas height={canvasHeight} width={canvasWidth} ref={node => setCanvas(node)}/>
            <div className="sprite-animation__fps-contoller">
                <Button onClick={() => {
                    if (fps !== 1) {
                        setFPS(fps - 1)
                    }
                }} className="sprite-animation__button">&#60;</Button>
                <input value={fps} onChange={e => {
                    if (Number(e.target.value) >= 1) {
                        setFPS(Number(e.target.value))
                    }
                }} type="number" min="1"/>
                <Button onClick={() => setFPS(fps + 1)} className="sprite-animation__button">&gt;</Button>
            </div>
        </div>
    )
}

export default SpriteAnimation