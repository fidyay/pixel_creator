import React, { useState, useContext, useRef, useEffect } from "react";
import Button from "./Button";
import type { Drawing } from "../state/State";
import { StateContext } from "../index";
import drawFrame from "../functions/drawFrame";
import { useNavigate, useParams } from "react-router-dom";
import Radiobutton from "./Radiobutton";

const maxHeightOrWidth = 200

interface ImportProjectProps {
    inWorkplace?: boolean
}

type Operation = 'combining' | 'replacing'

const ImportProject = ({inWorkplace}: ImportProjectProps) => {
    const navigate = useNavigate()
    const {id: drawingId} = useParams()
    const [drawing, setDrawing] = useState<Drawing>(null)
    const [fileAboveInput, setFileAboveInput] = useState(false)
    const [operation, setOperation] = useState<Operation>('combining')
    const state = useContext(StateContext)
    const label = useRef<HTMLLabelElement>(null)
    const input = useRef<HTMLInputElement>(null)
    const canvas = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (!drawing) {
            label.current.style.height = '200px'
            label.current.style.width = '200px'
            input.current.style.height = '198px'
            input.current.style.width = '198px'
            return
        }
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
        label.current.style.height = `${canvasHeight}px`
        label.current.style.width = `${canvasWidth}px`
        input.current.style.height = `${canvasHeight}px`
        input.current.style.width = `${canvasWidth}px`
        canvas.current.height = canvasHeight
        canvas.current.width = canvasWidth
        let animationFrame: number
        const fps = 16
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
    }, [drawing])

    const highlightLabel = () => setFileAboveInput(true)
    const unHighlightLabel = () => setFileAboveInput(false)
    return (
        <div className="modal">
            <form className="modal__form import-project-form" onSubmit={e => e.preventDefault()}>
                <h1 className="import-project-form__heading">Import project</h1>
                <label ref={label} className={`import-project-form__file-selection-label${fileAboveInput ? ' import-project-form__file-selection-label_file-dragged' : ''}`} onDragEnter={highlightLabel} onDragOver={highlightLabel} onDragLeave={unHighlightLabel} onDrop={unHighlightLabel}>
                    {
                        drawing ? 
                        <canvas className="import-project-form__file-selection-canvas" ref={canvas}/> :
                        'Choose .picr file'
                    }
                    <input ref={input} className="import-project-form__file-selection-input" type="file" accept=".picr" onChange={e => {
                        const reader = new FileReader()

                        reader.readAsText(e.target.files[0])

                        reader.onload = () => {
                            const result = reader.result as string
                            const drawing = JSON.parse(result) as Drawing
                            setDrawing(drawing)
                        }
                    }}/>
                </label>
                {drawing && (
                    <>
                        <p className="import-project-form__paragraph">Name: {drawing.name}</p>
                        <p className="import-project-form__paragraph">Type: {drawing.type}</p>
                        <p className="import-project-form__paragraph">Width: {drawing.widthInSquares}</p>
                        <p className="import-project-form__paragraph">Height: {drawing.heightInSquares}</p>
                        {drawing.type === 'sprite' && <p className="import-project-form__paragraph">Frames: {drawing.frames.length}</p>}
                    </>
                )}

                {inWorkplace && (
                    <fieldset className="import-project-form__operation fieldset">
                        <legend className="fieldset__legend">Operation<span className="required">*</span></legend>
                        <Radiobutton className="fieldset__label" onClick={() => setOperation('combining')} radiobuttonValue="combining" currentRadiobuttonValue={operation}>Combining</Radiobutton>
                        <Radiobutton className="fieldset__label" onClick={() => setOperation('replacing')} radiobuttonValue='replacing' currentRadiobuttonValue={operation}>Replacing</Radiobutton>
                    </fieldset>
                )}

                <div className="import-project-form__buttons">
                    <Button className="import-project-form__button" disabled={!drawing} onClick={() => {
                        if (inWorkplace) {
                            if (operation === 'combining') state.combineProjects(drawingId, drawing)
                            else if (operation === 'replacing') state.replaceProject(drawingId, drawing)
                        } else {
                            state.addProjectToStateFromImport(drawing)
                        }
                        navigate(-1)
                    }}>Ok</Button>
                    <Button className="import-project-form__button" link linkPath={inWorkplace ? `/workplace/${drawingId}` : '/'}>Cancel</Button>
                </div>
            </form> 
        </div>
    )
}

export default ImportProject