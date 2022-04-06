import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import Tools from "./Tools";
import Frames from "./Frames";
import getRandomNumber from "../functions/getRandomNumber";

const compliments = ['awesome', 'best', 'great', 'amazing']

// termporary code
const name = 'Nameofartist'

const Workplace = () => {
    const [projectName, setProjectName] = useState('ProjectName')
    const compliment = useRef('')

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
                <Tools/>
                <Frames/>
            </main>
        </div>
    )
}

export default Workplace