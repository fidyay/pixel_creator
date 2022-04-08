import React, { useState } from "react";

interface CanvasProps {
    actionType: 'pen' | 'line' | 'paint_bucket' | 'eraser' | 'selection_rectangle' | 'selection_round' | 'selection_rectangle_filled' | 'selection_round_filled' | 'pipette'
}

const Canvas = ({actionType}: CanvasProps) => {
    const [canvas, setCanvas] = useState(null)
    return (<div className="main__canvas">
                <canvas ref={node => setCanvas(node)}/>
            </div>)
}

export default Canvas