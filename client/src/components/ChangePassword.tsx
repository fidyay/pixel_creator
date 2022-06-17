import React, { useState, useContext } from "react";
import Button from "./Button";
import Loader from "./Effects/Loader";
import { gql, useMutation } from "@apollo/client";
import { StateContext, apolloClient } from "../index";

const CHANGE_PASSWORD = gql`
    mutation changePassword($password: String) {
        changePassword(password: $password) {
            id
            name
            token
        }
    }
`

const ChangePassword = () => {
    const [newPassword, setNewPassword] = useState('')
    const [passwordIsOld, setPasswordIsOld] = useState(false)
    const [changePassword, {data, loading, error}] = useMutation(CHANGE_PASSWORD)
    const state = useContext(StateContext)

    const submit = async (e: SubmitEvent | React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()
            const { data } = await changePassword({variables: {password: newPassword}})
            state.setUserName(data.changePassword.name)
            localStorage.setItem('token', data.changePassword.token)
            await apolloClient.resetStore()
        } catch(e) {
            if (e.message === 'Cannot set password to the old value.') {
                setPasswordIsOld(true)
            }
        }
    }
    return (
        <div className="modal">
            <form className="modal__form account-action" onSubmit={submit}>
                <h1 className="account-action__heading">Change password</h1>
                <label className="account-action__field">Password<span className="required">*</span>: <input value={newPassword}
                onChange={e => {
                    setNewPassword(e.target.value)
                    if (passwordIsOld) setPasswordIsOld(false)
                }}
                placeholder="*******" type="password" required/></label>
                {passwordIsOld && <p className="account-action__error">Cannot set password to the old value.</p>}
                {(data && data.changePassword.token) ? 
                (
                    <div className="account-action__success-message">
                        <p className="account-action__success">Password succesfully changed.</p>
                        <Button className="account-action__button" link linkPath="/">Go to home page</Button>
                    </div>
                )
                :
                loading ?
                    <Loader widthAndHeight={28.4} className="account-action__loader"/>
                :
                (
                    <div className="account-action__buttons">
                        <Button className="account-action__button" type="submit" onClick={() => {}}>Ok</Button>
                        <Button className="account-action__button" link linkPath="/">Cancel</Button>
                    </div>
                )}
            </form> 
        </div>
    )
}

export default ChangePassword