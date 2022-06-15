import React, { useContext } from "react";
import { StateContext } from "../index";
import Button from "./Button";

const AccountOptions = () => {
    const userName = useContext(StateContext).userName
    return (
        <div className="home-header__account-options account-options">
            <h3 className="account-options__heading">Hi👋, {userName}.</h3>
            <Button className="account-options__button" link linkPath="change-username">Change name</Button>
            <Button className="account-options__button" link linkPath="change-password">Change password</Button>
            <Button className="account-options__button" link linkPath="log-off">Log off</Button>
            <Button className="account-options__button" link linkPath="delete-account" deleteButton>Delete account</Button>
        </div>
    )
}

export default AccountOptions