import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { gql, useMutation, useLazyQuery } from "@apollo/client";
import { StateContext } from "../index";
import Loader from "./Effects/Loader";
import { apolloClient } from "../index";
import type { Drawing } from "../state/State";

interface LoginOrSignInProps {
    creatingAccount?: boolean
}

const CREATE_ACCOUNT = gql`
    mutation createNewAccount($name: String, $password: String) {
        createAccount(name: $name, password: $password) {
            id
            name
            token
        }
    }
`

const LOGIN_WITH_NAME_AND_PASSWORD = gql`
    query LoginWithNameAndPassword($name: String, $password: String) {
        me(name: $name, password: $password) {
            id
            token
            name
        }
        projects(authorName: $name, authorPassword: $password) {
            background
            id
            name
            type
            frames
            widthInSquares
            heightInSquares
        }
    }
`

const LoginOrSignIn = ({creatingAccount}: LoginOrSignInProps) => {
    const [name, setUserName] = useState('')
    const [password, setUserPassword] = useState('')
    const [nameTaken, setNameTaken] = useState(false)
    const [nameOrPasswordIsInvalid, setNameOrPasswordIsInvalid] = useState(false)
    const navigate = useNavigate()
    const state = useContext(StateContext)
    const [createAccount, { data: mutationData, loading: mutationLoading, error: mutationError }] = useMutation(CREATE_ACCOUNT)
    const [login, { data: queryData, loading: queryLoading, error: queryError }] = useLazyQuery(LOGIN_WITH_NAME_AND_PASSWORD)

    const submit = async (e: SubmitEvent | React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()
            if (creatingAccount) {
                const { data } = await createAccount({variables: {name, password}})
                localStorage.setItem('token', data.createAccount.token)
                state.setUserName(data.createAccount.name)
                navigate(`/`)
                await apolloClient.resetStore()
            } else {
                const { data } = await login({variables: {name, password}})
                if (data.me.token) {
                    localStorage.setItem('token', data.me.token)
                    state.setUserName(data.me.name)
                    data.projects.forEach((project: Drawing) => state.addProjectToState(project))
                    navigate(`/`)
                    await apolloClient.resetStore()
                } else {
                    setNameOrPasswordIsInvalid(true)
                }
            }
        } catch(e) {
            if (e.message.includes('duplicate key error')) {
                setNameTaken(true)
            }
        }
    }
    return (
        <div className="modal">
            <form className="modal__form login-or-sign-in-form" onSubmit={submit}>
                <h1 className="login-or-sign-in-form__heading">{creatingAccount ? 'Sign in' : 'Login'}</h1>
                <label className="login-or-sign-in-form__field">Name<span className="required">*</span>: <input value={name}
                onChange={e => {
                    setUserName(e.target.value)
                    if (nameTaken) setNameTaken(false)
                    if (nameOrPasswordIsInvalid) setNameOrPasswordIsInvalid(false)
                }}
                placeholder="User1" type="text" required/></label>
                {nameTaken && <p className="login-or-sign-in-form__error">Name {name} is already taken.</p>}
                <label className="login-or-sign-in-form__field">Password<span className="required">*</span>: <input value={password}
                onChange={e => {
                    setUserPassword(e.target.value)
                    if (nameOrPasswordIsInvalid) setNameOrPasswordIsInvalid(false)
                }}
                placeholder="*******" type="password" required/></label>
                {nameOrPasswordIsInvalid && <p className="login-or-sign-in-form__error login-or-sign-in-form__login-error">Name or password is invalid.</p>}
                {!(mutationLoading || queryLoading) && <div className="login-or-sign-in-form__buttons">
                    <Button className="login-or-sign-in-form__button" type="submit" onClick={() => {}}>Ok</Button>
                    <Button className="login-or-sign-in-form__button" link linkPath="/">Cancel</Button>
                </div>}
                {(mutationLoading || queryLoading) && <Loader widthAndHeight={28.4} className="login-or-sign-in-form__loader"/>}
            </form> 
        </div>
    )
}

export default LoginOrSignIn