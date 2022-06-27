import React, { useState, useContext, useRef, useEffect } from "react";
import Button from "./Button";
import NumberInput from "./NumberInput";
import { useParams, useNavigate } from "react-router-dom";
import { StateContext } from "../index";
import type { CoordType, Drawing } from "../state/State";

const maxWidthAndHeight = 1024

const countRowsOrCollumns = (n: number, max: number) => {
    return Math.ceil(max/n)
}

const drawFrameSprite = (ctx: CanvasRenderingContext2D, drawing: Drawing, frameIndex: number, startFrameCoordX: number, startFrameCoordY: number, frameWidth: number, frameHeight: number, squareWidthAndHeight: number, row: number, collumn: number) => {
    const frame = drawing.frames[frameIndex]
    if (drawing.background !== 'transparent') {
        ctx.fillStyle = drawing.background
        ctx.fillRect(frameWidth * collumn * squareWidthAndHeight, frameHeight * row * squareWidthAndHeight, frameWidth * squareWidthAndHeight, frameHeight * squareWidthAndHeight)
    }
    Object.keys(frame).forEach((coords: CoordType) => {
        const coordsArray = coords.split(';')
        const X = Number(coordsArray[0].slice(2)) - startFrameCoordX
        const Y = Number(coordsArray[1].slice(2)) - startFrameCoordY
        ctx.fillStyle = frame[coords]
        ctx.fillRect((frameWidth * collumn + X) * squareWidthAndHeight, (frameHeight * row + Y) * squareWidthAndHeight, squareWidthAndHeight, squareWidthAndHeight)
    })
}

const ExportFile = () => {
    const navigate = useNavigate()
    const { id: drawingId } = useParams()
    const drawing = useContext(StateContext).drawings[drawingId]
    const [squareWidthAndHeight, setSquareWidthAndHeight] = useState<number>(2)
    const [rows, setRows] = useState<number>(1)
    const [collumns, setCollumns] = useState<number>(drawing.frames.length)
    const canvas = useRef<HTMLCanvasElement>(null)
    return (
        <div className="modal">
            <form className="modal__form exporting-file-form" onSubmit={e => {
                e.preventDefault()
                const ctx = canvas.current.getContext('2d')
                

                let startFrameCoordX = 0
                let startFrameCoordY = 0
                let frameWidth = drawing.widthInSquares
                let frameHeight = drawing.heightInSquares

                ctx.clearRect(0, 0, collumns * frameWidth * squareWidthAndHeight, rows * frameHeight * squareWidthAndHeight)

                if (drawing.background === 'transparent') {
                    const framesJSON = JSON.stringify(drawing.frames)
                    console.log(framesJSON)
                    for (let i = startFrameCoordX; i < drawing.widthInSquares; i++) {
                        if (framesJSON.includes(`x:${i};`)) {
                            startFrameCoordX = i
                            break
                        }
                    }
                    for (let i = startFrameCoordY; i < drawing.heightInSquares; i++) {
                        if (framesJSON.includes(`y:${i}"`)) {
                            startFrameCoordY = i
                            break
                        }
                    }
                    for (let i = drawing.widthInSquares; i >= 0; i--) {
                        if (framesJSON.includes(`x:${i};`)) {
                            frameWidth = i - startFrameCoordX + 1
                            break
                        }
                    }
                    for (let i = drawing.heightInSquares; i >= 0; i--) {
                        if (framesJSON.includes(`y:${i}`)) {
                            frameHeight = i - startFrameCoordY + 1
                            break
                        }
                    }                    
                }

                canvas.current.width = frameWidth * collumns * squareWidthAndHeight 
                canvas.current.height = frameHeight * rows * squareWidthAndHeight             

                for (let frameIndex = 0, row = 0; row < rows; row++) {
                    for (let collumn = 0; collumn < collumns && frameIndex < drawing.frames.length; collumn++, frameIndex++) {
                        drawFrameSprite(ctx, drawing, frameIndex, startFrameCoordX, startFrameCoordY, frameWidth, frameHeight, squareWidthAndHeight, row, collumn)
                    }
                }

                canvas.current.toBlob(function(blob) {
                    let link = document.createElement('a')
                    link.download = `${drawing.name}.png`
                
                    link.href = URL.createObjectURL(blob)
                    link.click()
                
                    URL.revokeObjectURL(link.href)

                    navigate(-1)
                }, 'image/png')
            }}>
                <h1 className="exporting-file-form__heading">Export file</h1>
                <canvas className="exporting-file-form__canvas" width={0} height={0} ref={canvas}/>
                <NumberInput className="exporting-file-form__number-input" value={squareWidthAndHeight} onChange={e => setSquareWidthAndHeight(Number(e.target.value))} frontText="Square width and height" backText="px" max={
                    drawing.heightInSquares > drawing.widthInSquares ? 
                    Math.floor(maxWidthAndHeight/drawing.heightInSquares) :
                    Math.floor(maxWidthAndHeight/drawing.widthInSquares)
                } min="1" placeholder="8"/>
                {drawing.type === 'sprite' && (
                    <>
                        <NumberInput className="exporting-file-form__number-input" value={rows} onChange={e => {
                            const n = Number(e.target.value)
                            setRows(n)
                            setCollumns(countRowsOrCollumns(n, drawing.frames.length))
                        }} frontText="Rows" max={drawing.frames.length} min="1" placeholder="2"/>
                        <NumberInput className="exporting-file-form__number-input" value={collumns} onChange={e => {
                            const n = Number(e.target.value)
                            setCollumns(n)
                            setRows(countRowsOrCollumns(n, drawing.frames.length))
                        }} frontText="Columns" max={drawing.frames.length} min="1" placeholder="2"/>
                    </>
                )}
                
                <div className="exporting-file-form__buttons">
                    <Button className="exporting-file-form__button" type="submit">Ok</Button>
                    <Button className="exporting-file-form__button" link linkPath={`/workplace/${drawingId}`}>Cancel</Button>
                </div>
            </form>
        </div>
    )
}

export default ExportFile