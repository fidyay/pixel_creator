import React from "react";
import Logo from "./Logo";
import Button from "./Button";

export default () => {
    return (
        <>
            <header className="home-header">
                <Logo isInMainPage/>
                <p className="home-header__description">Free online editor for pixel art and animated sprites</p>
                {/* Temporaly just go to project page */}
                {/* <Button link linkPath="/create" className="home-header__button">Create project</Button> */}
                <Button buttonOnClickHandler={() => {}} className="home-header__button">Create project</Button>
            </header>
        </>
    )
}