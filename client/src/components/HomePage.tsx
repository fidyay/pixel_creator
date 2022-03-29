import React from "react";
import Logo from "./Logo";
import Button from "./Button";
import { Outlet } from "react-router-dom";


const HomePage = () => {
    return (
        <>
            <header className="home-header">
                <Logo isInMainPage/>
                <p className="home-header__description">Free online editor for pixel art and animated sprites</p>
                <Button link linkPath="project-configuration" className="home-header__button">Create project</Button>
            </header>
            <Outlet/>
        </>
    )
}

export default HomePage