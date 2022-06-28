import React, { useContext } from "react";
import Logo from "./Logo";
import Button from "./Button";
import UserProjects from "./UserProjects";
import { observer } from "mobx-react";
import { Outlet, Link } from "react-router-dom";
import { StateContext } from "../index";
import Scrollbar from "./Effects/Scrollbar";
import AccountOptions from "./AccountOptions";


const HomePage = observer(() => {
    const state = useContext(StateContext)
    const amountOfProjects = Object.keys(state.drawings).length
    const userName = state.userName
    return (
        <Scrollbar>
            <div className="home">
                <header className="home__header home-header">
                    <Logo isInMainPage/>
                    <p className="home-header__description">Free online editor for pixel art and animated sprites.</p>
                    <Button link linkPath="project-configuration" className="home-header__button">Create project</Button>
                    <Button link linkPath="import-project" className="home-header__button">Import project</Button>
                    {(!localStorage.getItem('token') && !userName) ? (
                        <>
                            <p className="home-header__authorization">Have an account? <Link className="home-header__authorization-link" to='login'>Login here.</Link></p>
                            <p className="home-header__authorization">Wanna create an account? <Link className="home-header__authorization-link" to='sign-in'>Sign up here.</Link></p>
                        </> 
                    ) : (
                        <AccountOptions/>
                    )}
                </header>
                {amountOfProjects ? <UserProjects/> : null}
                <Outlet/>
            </div>
        </Scrollbar>
    )
})

export default HomePage