import React, { useState, useContext } from "react";
import Button from "./Button";
import Loader from "./Effects/Loader";
import { gql, useMutation } from "@apollo/client";
import { StateContext, apolloClient } from "../index";
import { useNavigate } from "react-router-dom";

const CHANGE_NAME = gql`
    mutation changeName($name: String) {
        changeName(name: $name) {
            id
            name
            token
        }
    }
`

const ChangeName = () => {
    const [newName, setNewName] = useState('')
    const [nameIsOld, setNameIsOld] = useState(false)
    const [changeName, {data, loading, error}] = useMutation(CHANGE_NAME)
    const state = useContext(StateContext)
    const navigate = useNavigate()

    const submit = async (e: SubmitEvent | React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()
            const { data } = await changeName({variables: {name: newName}})
            state.setUserName(data.changeName.name)
            localStorage.setItem('token', data.changeName.token)
            navigate(`/`)
            await apolloClient.resetStore()
        } catch(e) {
            if (e.message === 'Cannot set name to the old value.') setNameIsOld(true)
        }
    }
    return (
        <div className="modal">
            <form className="modal__form account-action" onSubmit={submit}>
                <h1 className="account-action__heading">Change name</h1>
                <label className="account-action__field">Name<span className="required">*</span>: <input value={newName}
                onChange={e => {
                    setNewName(e.target.value)
                    if (nameIsOld) setNameIsOld(false)
                }}
                placeholder="User1" type="text" required/></label>
                {nameIsOld && <p className="account-action__error">Cannot set name to the old value.</p>}
                {!loading && <div className="account-action__buttons">
                    <Button className="account-action__button" type="submit" onClick={() => {}}>Ok</Button>
                    <Button className="account-action__button" link linkPath="/">Cancel</Button>
                </div>}
                {loading && <Loader widthAndHeight={28.4} className="account-action__loader"/>}
            </form> 
        </div>
    )
}

export default ChangeName