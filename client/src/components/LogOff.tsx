import React, { useContext } from "react";
import Button from "./Button";
import { StateContext, apolloClient } from "../index";
import { useNavigate } from "react-router-dom";

const LogOff = () => {
    const navigate = useNavigate()
    const state = useContext(StateContext)
    const submit = async (e: SubmitEvent | React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        localStorage.removeItem('token')
        state.clearState()
        navigate('/')
        await apolloClient.resetStore()
    }
    return (
        <div className="modal">
            <form className="modal__form account-action" onSubmit={submit}>
                <h1 className="account-action__heading">Log off?</h1>
                <div className="account-action__buttons">
                    <Button className="account-action__button" type="submit" onClick={() => {}}>Yes</Button>
                    <Button className="account-action__button" link linkPath="/">Cancel</Button>
                </div>
            </form> 
        </div>
    )
}

export default LogOff