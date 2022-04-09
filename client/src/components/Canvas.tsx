import React, { useState } from "react";

interface CanvasProps {
    actionType: 'pen' | 'line' | 'paint_bucket' | 'eraser' | 'selection_rectangle' | 'selection_round' | 'selection_rectangle_filled' | 'selection_round_filled' | 'pipette',
    widthSqr: number,
    heightSqr: number
}

const maxSquareWidthAndHeight = 7
const maxWidth = document.documentElement.clientWidth * .45
const maxHeight = document.documentElement.clientHeight * .73

const Canvas = ({actionType, widthSqr, heightSqr}: CanvasProps) => {
    const [canvas, setCanvas] = useState(null)

    let squareWidthAndHeight = maxSquareWidthAndHeight
    let width = widthSqr * squareWidthAndHeight
    let height = heightSqr * squareWidthAndHeight

    while (width > maxWidth || height > maxHeight) {
        squareWidthAndHeight--
        width = widthSqr * squareWidthAndHeight
        height = heightSqr * squareWidthAndHeight
    }

    return (<div className="main__canvas">
                <canvas width={width} height={height} ref={node => setCanvas(node)}/>
            </div>)
}

export default Canvas