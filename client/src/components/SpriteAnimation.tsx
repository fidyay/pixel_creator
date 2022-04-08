import React, { useState } from "react";
import Button from "./Button";

interface SpriteAnimationProps {
    width: number,
    height: number
}

const maxHeightOrWidth = 200

const SpriteAnimation = ({width, height}: SpriteAnimationProps) => {
    const [canvas, setCanvas] = useState(null)
    const [fps, setFPS] = useState(16)

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