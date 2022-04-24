import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import Tools from "./Tools";
import Frames from "./Frames";
import Canvas from "./Canvas";
import ProjectOptions from "./ProjectOptions";
import getRandomNumber from "../functions/getRandomNumber";

const compliments = ['awesome', 'best', 'great', 'amazing']

// termporary code
const name = 'Nameofartist'
const defaultSquareSize = 7

export type PenSizeType = 1 | 2 | 3 | 4
export type BrushType = 'pen' | 'line' | 'paint_bucket' | 'eraser' | 'selection_rectangle' | 'selection_round' | 'selection_rectangle_filled' | 'selection_round_filled' | 'pipette'

const Workplace = () => {
    const [chosenPenSize, setChosenPenSize] = useState<PenSizeType>(1)
    const [chosenBrush, setChosenBrush] = useState<BrushType>('pen')
    const [projectName, setProjectName] = useState('ProjectName')
    const compliment = useRef('')
    const [squareSize, setSquareSize] = useState(defaultSquareSize)
    const [chosenColor, setChosenColor] = useState('#000')

    if (compliment.current === '') {
        compliment.current = compliments[Math.round(getRandomNumber(0, 3))]
    }

    return (
        <div className="workplace">
            <header className="workplace__header header">
                <Link className="header__logo-link" to="/">
                    <Logo/>
                </Link>
                <input value={projectName} onChange={e => setProjectName(e.target.value)} className="header__project-name-input" type="text"/>
                <h3 className="header__nickname-compliment">{`By ${compliment.current} artist ${name}`}</h3>
            </header>
            <main className="workplace__main main">
                <Tools setChosenColor={setChosenColor} chosenPenSize={chosenPenSize} setChosenPenSize={setChosenPenSize} chosenBrush={chosenBrush} setChosenBrush={setChosenBrush}/>
                <Frames/>
                <Canvas chosenColor={chosenColor} chosenPenSize={chosenPenSize} widthInSquares={100} heightInSquares={100} background={'transparent'} squareSize={squareSize} setSquareSize={setSquareSize} chosenBrush={chosenBrush}/>
                <ProjectOptions/>
            </main>
        </div>
    )
}

export default Workplace