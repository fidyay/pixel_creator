import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { gql, useMutation, useLazyQuery } from "@apollo/client";
import { StateContext } from "../index";
import Loader from "./Effects/Loader";
import { apolloClient } from "../index";

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
    }
`

const LoginOrSignIn = ({creatingAccount}: LoginOrSignInProps) => {
    const [name, setUserName] = useState('')
    const [password, setUserPassword] = useState('')
    const [nameTaken, setNameTaken] = useState(false)
    const navigate = useNavigate()
    const state = useContext(StateContext)
    const [createAccount, { data: mutationData, loading: mutationLoading, error: mutationError }] = useMutation(CREATE_ACCOUNT)
    const [login, { data: queryData, loading: queryLoading, error: queryError }] = useLazyQuery(LOGIN_WITH_NAME_AND_PASSWORD)

    const submit = async (e: SubmitEvent | React.FormEvent<HTMLFormElement> | PointerEvent | React.PointerEvent) => {
        try {
            e.preventDefault()
            if (creatingAccount) {
                const { data } = await createAccount({variables: {name, password}})
                localStorage.setItem('token', data.createAccount.token)
                state.setUserName(data.createAccount.name)
            } else {
                const { data } = await login({variables: {name, password}})
                localStorage.setItem('token', data.me.token)
                state.setUserName(data.me.name)
            }
            await apolloClient.resetStore()
            navigate(`/`)
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
                }}
                placeholder="User1" type="text" required/></label>
                {nameTaken && <p className="login-or-sign-in-form__error">Name {name} is already taken.</p>}
                <label className="login-or-sign-in-form__field">Password<span className="required">*</span>: <input value={password}
                onChange={e => {
                    setUserPassword(e.target.value)
                }}
                placeholder="*******" type="password" required/></label>
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