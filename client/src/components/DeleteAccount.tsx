import React, { useContext } from "react";
import Button from "./Button";
import { StateContext, apolloClient } from "../index";
import { gql, useMutation } from "@apollo/client";
import Loader from "./Effects/Loader";

const DELETE_ACCOUNT = gql`
    mutation deleteAccount {
        deleteAccount {
            status
        }
    }
`

const DeleteAccount = () => {
    const state = useContext(StateContext)
    const [deleteAccount, {data, loading, error}] = useMutation(DELETE_ACCOUNT)
    const submit = async (e: SubmitEvent | React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        await deleteAccount()
        localStorage.removeItem('token')
        state.clearState()
        await apolloClient.resetStore()
    }
    return (
        <div className="modal">
            <form className="modal__form account-action" onSubmit={submit}>
                <h1 className="account-action__heading">Delete aссount?</h1>
                {(data && data.deleteAccount.status === 'success') ?  
                (
                    <div className="account-action__success-message">
                        <p className="account-action__success">Account succesfully deleted.</p>
                        <Button className="account-action__button" link linkPath="/">Go to home page</Button>
                    </div>
                )
                :
                loading ?
                    <Loader widthAndHeight={28.4} className="account-action__loader"/>
                :
                (
                    <div className="account-action__buttons">
                        <Button className="account-action__button" type="submit" onClick={() => {}} deleteButton>Yes</Button>
                        <Button className="account-action__button" link linkPath="/">Cancel</Button>
                    </div>
                )}
            </form>
        </div>
    )
}

export default DeleteAccount