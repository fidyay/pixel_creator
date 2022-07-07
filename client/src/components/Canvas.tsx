import React, { useState, useRef, PointerEvent, useEffect, useContext } from "react";
import Drawing from "../classes/Drawing";
import type { PenSizeType, BrushType} from "./Workplace";
import { StateContext } from "../index";
import { ColorType, CoordType } from "../state/State";
import { observer } from "mobx-react";

interface CanvasProps {
    chosenBrush: BrushType,
    squareSize: number,
    setSquareSize: React.Dispatch<React.SetStateAction<number>>,
    chosenPenSize: PenSizeType,
    chosenColor: ColorType,
    setChosenColor: React.Dispatch<React.SetStateAction<string>>,
    drawingId: string,
    chosenFrame: number
}

type AllowedKeyToPress = 'ShiftLeft' | 'ShiftRight' | 'KeyC' | 'KeyV'  | 'KeyZ' | 'KeyY' | ''

let currentSquareSize = 15
const maxWidth = document.documentElement.clientWidth * .45
const maxHeight = document.documentElement.clientHeight * .73

const Canvas = observer(({chosenBrush, squareSize, setSquareSize, chosenPenSize, chosenColor, setChosenColor, drawingId, chosenFrame}: CanvasProps) => {
    const [canvas, setCanvas] = useState(null)
    const drawing = useRef(new Drawing)
    const pressedKey = useRef<AllowedKeyToPress>('')
    const state = useContext(StateContext)
    const actionState = useRef({
        currentFrame: chosenFrame,
        currentActionIndex: 0,
        actions: [state.drawings[drawingId].frames[chosenFrame]]
    })

    let squareWidthAndHeight = squareSize
    let width = state.drawings[drawingId].widthInSquares * squareWidthAndHeight
    let height = state.drawings[drawingId].heightInSquares * squareWidthAndHeight

    while (width > maxWidth || height > maxHeight) {
        squareWidthAndHeight--
        width = state.drawings[drawingId].widthInSquares * squareWidthAndHeight
        height = state.drawings[drawingId].heightInSquares * squareWidthAndHeight
    }

    if (squareWidthAndHeight !== currentSquareSize) {
        setSquareSize(squareWidthAndHeight)
        currentSquareSize = squareWidthAndHeight
    }

    if (canvas) {
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
        if (chosenBrush !== 'selection' && Object.keys(drawing.current.selectedSquares?.squares).length) {
            drawing.current.resetSelectedSquares()
        }
        drawing.current.setDrawing(state.drawings[drawingId])
        drawing.current.setCTX(ctx)
        drawing.current.setSquareSize(squareWidthAndHeight)
        drawing.current.setPenSize(chosenPenSize)
        drawing.current.setColor(chosenColor)
        drawing.current.setChosenFrame(chosenFrame)
        drawing.current.drawImage(chosenFrame)
    }


    function isPointedOutOfSelection(pointX: number, pointY: number) {
        const selectionStartX = drawing.current.getPixelCoord(drawing.current.selectedSquares.xStart)
        const selectionStartY = drawing.current.getPixelCoord(drawing.current.selectedSquares.yStart)
        const selectionEndX = drawing.current.getPixelCoord(drawing.current.selectedSquares.xEnd) + squareSize
        const selectionEndY = drawing.current.getPixelCoord(drawing.current.selectedSquares.yEnd) + squareSize

        if (pointX < selectionStartX) {
            return true
        }
        if (pointX > selectionEndX) {
            return true
        }
        if (pointY < selectionStartY) {
            return true
        }
        if (pointY > selectionEndY) {
            return true
        }

        return false
    }


    useEffect(() => {
        // checking for accordance with app state
        if (chosenFrame !== actionState.current.currentFrame) {
            actionState.current.currentFrame = chosenFrame
            actionState.current.currentActionIndex = 0
            actionState.current.actions = [state.drawings[drawingId].frames[chosenFrame]]
        }

        const allowedKeys: AllowedKeyToPress[] = ['ShiftLeft', 'ShiftRight', 'KeyC', 'KeyV', 'KeyZ', 'KeyY']

        // action handlers

        const cancelOrRepeatActionHandler = (e: KeyboardEvent) => {
            const code = e.code as AllowedKeyToPress
            if (!allowedKeys.includes(code)) return
            if (code === 'KeyZ' && pressedKey.current !== 'KeyZ' && actionState.current.currentActionIndex > 0) {
                actionState.current.currentActionIndex--
                pressedKey.current = 'KeyZ'
                state.restoreFrameState(drawingId, chosenFrame, actionState.current.actions[actionState.current.currentActionIndex])
            }
            if (code === 'KeyY' && pressedKey.current !== 'KeyY' && actionState.current.currentActionIndex < actionState.current.actions.length - 1) {
                actionState.current.currentActionIndex++
                pressedKey.current = 'KeyY'
                state.restoreFrameState(drawingId, chosenFrame, actionState.current.actions[actionState.current.currentActionIndex])
            }
        }

        window.addEventListener('keydown', cancelOrRepeatActionHandler)

        // rectange and elipse shift handler

        const rectangeAndCircleShiftHandler = (e: KeyboardEvent) => {
            const code = e.code as AllowedKeyToPress
            if (code.includes('Shift'))
            pressedKey.current = code
        }

        if (chosenBrush === 'elipse' || chosenBrush === 'rectangle') {
            window.addEventListener('keydown', rectangeAndCircleShiftHandler)
        }

        // selection handlers

        const selectionControlsHandler = (e: KeyboardEvent) => {
            const code = e.code as AllowedKeyToPress
            if (!allowedKeys.includes(code)) return
            if (code.includes('Shift') && !pressedKey.current.includes('Shift')) {
                drawing.current.fixSquaresToSelection(true)
            }
            if (e.ctrlKey && code === 'KeyC' && !pressedKey.current.includes('KeyC')) {
                drawing.current.fixSquaresToSelection()
            }
            if (e.ctrlKey && code === 'KeyV' && !pressedKey.current.includes('KeyV')) {
                drawing.current.placeSquaresFromSelection()
            }
            pressedKey.current = code
        }

        // keyup handler for all
        const keyUp = (e: KeyboardEvent) => {
            const code = e.code as AllowedKeyToPress
            if (!allowedKeys.includes(code)) return
            if (code.includes('Shift') && pressedKey.current.includes('Shift') && chosenBrush === 'selection') {
                drawing.current.placeSquaresFromSelection(true)
            }
            pressedKey.current = ''
        }

        if (chosenBrush === 'selection') {
            window.addEventListener('keydown', selectionControlsHandler)
        }
        
        window.addEventListener('keyup', keyUp)
        return () => {
            window.removeEventListener('keydown', cancelOrRepeatActionHandler)
            if (chosenBrush === 'selection') {
                window.removeEventListener('keydown', selectionControlsHandler)
            }
            if (chosenBrush === 'elipse' || chosenBrush === 'rectangle') {
                window.removeEventListener('keydown', rectangeAndCircleShiftHandler)
            }
            window.removeEventListener('keyup', keyUp)
        }
    })

    return (<div className="main__canvas">
                <canvas className="main__canvas-painting" onPointerDown={e => {
                    if ((e.target as HTMLCanvasElement).className !== 'main__canvas-painting') return
                    const { top: canvasTop, left: canvasLeft, width: cannvasWidth, height: canvasHeight } = (e.target as HTMLCanvasElement).getBoundingClientRect()
                    const pointX = e.clientX - canvasLeft
                    const pointY = e.clientY - canvasTop

                    if (pointX < 0 || pointX > cannvasWidth || pointY < 0 || pointY > canvasHeight) return

                    if (Object.keys(drawing.current.selectedSquares.squares).length > 0 && isPointedOutOfSelection(pointX, pointY)) {
                        drawing.current.resetSelectedSquares()
                    }

                    let clickX = 0
                    let clickY = 0

                    if (Object.keys(drawing.current.selectedSquares.squares).length > 0) {
                        clickX = pointX - drawing.current.selectedSquares.xStart * squareSize
                        clickY = pointY - drawing.current.selectedSquares.yStart * squareSize
                    }

                    let squaresToDraw: CoordType[] = []

                    switch(chosenBrush) {
                        case 'pen':
                            drawing.current.drawSquare(pointX, pointY)
                            break
                        case 'line':
                            squaresToDraw = drawing.current.drawLine(pointX, pointY, pointX, pointY)
                            break
                        case 'paint_bucket': 
                            drawing.current.areaFill(pointX, pointY)
                            break
                        case 'eraser':
                            drawing.current.erase(pointX, pointY)
                            break
                        case 'rectangle':
                            squaresToDraw = drawing.current.rectangle(pointX, pointY, pointX, pointY, pressedKey.current.includes('Shift'))
                            break
                        case 'elipse': 
                            squaresToDraw = drawing.current.elipse(pointX, pointY, pointX, pointY, pressedKey.current.includes('Shift'))
                            break
                        case 'selection': 
                            if (!Object.keys(drawing.current.selectedSquares.squares).length) {
                                drawing.current.selectedSquares.isDrawing = true
                                drawing.current.selection(pointX, pointY, pointX, pointY)
                                drawing.current.drawSelectedSquares()
                            }
                            break
                        case 'pipette': 
                            const color = drawing.current.getColorFromPixelCoords(pointX, pointY)
                            if (color) {
                                setChosenColor(color)
                            }
                            break
                        default: 
                            drawing.current.drawSquare(pointX, pointY)
                            break
                    }
                    const draw = (e: PointerEvent<HTMLCanvasElement> | MouseEvent) => {
                        if ((e.target as HTMLCanvasElement).className !== 'main__canvas-painting') return
                        const { top: canvasTop, left: canvasLeft, width: cannvasWidth, height: canvasHeight } = (e.target as HTMLCanvasElement).getBoundingClientRect()
                        const pointMoveX = e.clientX - canvasLeft
                        const pointMoveY = e.clientY - canvasTop

                        if (pointMoveX < 0 || pointMoveX > cannvasWidth || pointMoveY < 0 || pointMoveY > canvasHeight) return

                        switch(chosenBrush) {
                            case 'pen':
                                drawing.current.drawSquare(pointMoveX, pointMoveY)
                                break
                            case 'line':
                                squaresToDraw = drawing.current.drawLine(pointX, pointY, pointMoveX, pointMoveY)
                                break
                            case 'eraser':
                                drawing.current.erase(pointMoveX, pointMoveY)
                                break
                            case 'rectangle':
                                squaresToDraw = drawing.current.rectangle(pointX, pointY, pointMoveX, pointMoveY, pressedKey.current.includes('Shift'))
                                break
                            case 'elipse': 
                                squaresToDraw = drawing.current.elipse(pointX, pointY, pointMoveX, pointMoveY, pressedKey.current.includes('Shift'))
                                break
                            case 'selection': 
                                if (drawing.current.selectedSquares.isDrawing) {
                                    drawing.current.selection(pointX, pointY, pointMoveX, pointMoveY)
                                    drawing.current.drawSelectedSquares()
                                } else {
                                    drawing.current.moveSelection(pointMoveX - clickX, pointMoveY - clickY)
                                    drawing.current.drawSelectedSquares()
                                }
                                break
                            case 'pipette': 
                                break
                            default: 
                                drawing.current.drawSquare(pointMoveX, pointMoveY)
                                break
                        }
                    }

                    const pointerMoveListener = (e: MouseEvent) => {
                        draw(e)
                    }

                    const pointerUpListener = () => {
                        if (squaresToDraw.length > 0) {
                            drawing.current.addAndDrawSquares(squaresToDraw)
                        }
                        drawing.current.selectedSquares.isDrawing = false
                        window.removeEventListener('pointermove', pointerMoveListener)
                        window.removeEventListener('pointerup', pointerUpListener)

                        // adding actions 

                        if (JSON.stringify(state.drawings[drawingId].frames[chosenFrame]) !== JSON.stringify(actionState.current.actions[actionState.current.actions.length - 1])) {
                            if (actionState.current.currentActionIndex === actionState.current.actions.length - 1) {
                                actionState.current.currentActionIndex++
                                actionState.current.actions.push(state.drawings[drawingId].frames[chosenFrame])
                            } else if (actionState.current.currentActionIndex < actionState.current.actions.length - 1) {
                                actionState.current.currentActionIndex++
                                actionState.current.actions = actionState.current.actions.slice(0, actionState.current.currentActionIndex)
                                actionState.current.actions.push(state.drawings[drawingId].frames[chosenFrame])
                            }
                        }
                    } 

                    window.addEventListener('pointermove', pointerMoveListener)
                    window.addEventListener('pointerup', pointerUpListener)
                    
                }} width={width} height={height} ref={node => setCanvas(node)}/>
            </div>)
})

export default Canvas