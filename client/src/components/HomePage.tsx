import React, { useContext } from "react";
import Logo from "./Logo";
import Button from "./Button";
import UserProjects from "./UserProjects";
import { observer } from "mobx-react";
import { Outlet } from "react-router-dom";
import { StateContext } from "./App";
import Scrollbar from "./Effects/Scrollbar";


const HomePage = observer(() => {
    const amountOfProjects = Object.keys(useContext(StateContext).drawings).length
    return (
        <Scrollbar>
            <div className="home">
                <header className="home__header home-header">
                    <Logo isInMainPage/>
                    <p className="home-header__description">Free online editor for pixel art and animated sprites</p>
                    <Button link linkPath="project-configuration" className="home-header__button">Create project</Button>
                </header>
                {amountOfProjects ? <UserProjects/> : null}
                <Outlet/>
            </div>
        </Scrollbar>
    )
})

export default HomePage