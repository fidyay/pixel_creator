import React, { useState, useRef, useContext } from "react";
import { Link, useParams, Navigate, Outlet } from "react-router-dom";
import Logo from "./Logo";
import Tools from "./Tools";
import Frames from "./Frames";
import Canvas from "./Canvas";
import ProjectOptions from "./ProjectOptions";
import getRandomNumber from "../functions/getRandomNumber";
import { StateContext } from "../index";
import { observer } from "mobx-react";
import { ColorType } from "../state/State";

const compliments = ['awesome', 'best', 'great', 'amazing']

const defaultSquareSize = 15

export type PenSizeType = 1 | 2 | 3 | 4
export type BrushType = 'pen' | 'line' | 'paint_bucket' | 'eraser' | 'rectangle' | 'elipse' | 'selection' | 'pipette'

const Workplace = observer(() => {
    const [chosenPenSize, setChosenPenSize] = useState<PenSizeType>(1)
    const [chosenBrush, setChosenBrush] = useState<BrushType>('pen')
    const compliment = useRef('')
    const [squareSize, setSquareSize] = useState(defaultSquareSize)
    const [chosenColor, setChosenColor] = useState<ColorType>('rgb(0, 0, 0)')
    const [chosenFrame, setChosenFrame] = useState(0)
    const state = useContext(StateContext)
    const drawings = state.drawings
    const {id: drawingId} = useParams()

    const drawing = drawings[drawingId]

    if (!drawings[drawingId]) {
        return <Navigate to="/"/>
    }

    if (compliment.current === '') {
        compliment.current = compliments[Math.round(getRandomNumber(0, 3))]
    }

    return (
        <div className="workplace">
            <header className="workplace__header header">
                <Link className="header__logo-link" to="/">
                    <Logo/>
                </Link>
                <input value={drawing.name} onChange={e => state.changeDrawingName(drawingId, e.target.value)} className="header__project-name-input" type="text"/>
                <h3 className="header__nickname-compliment">{`By ${compliment.current} artist${state.userName ? ` ${state.userName} `: ''}`}</h3>
            </header>
            <main className="workplace__main main">
                <Tools setChosenColor={setChosenColor} chosenPenSize={chosenPenSize} setChosenPenSize={setChosenPenSize} chosenBrush={chosenBrush} setChosenBrush={setChosenBrush} chosenColor={chosenColor}/>
                {drawing.type !== 'image' && <Frames drawingId={drawingId} chosenFrame={chosenFrame} setChosenFrame={setChosenFrame}/>}
                <Canvas chosenFrame={chosenFrame} chosenColor={chosenColor} chosenPenSize={chosenPenSize} squareSize={squareSize} setSquareSize={setSquareSize} chosenBrush={chosenBrush} setChosenColor={setChosenColor} drawingId={drawingId}/>
                <ProjectOptions drawingId={drawingId}/>
            </main>
            <Outlet/>
        </div>
    )
})

export default Workplace