import React, { useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import HomePage from "./HomePage";
import ProjectConfiguration from "./ProjectConfiguration";
import Workplace from "./Workplace";
import LoginOrSignIn from "./LoginOrSignIn";
import Loader from "./Effects/Loader";
import { observer } from "mobx-react";
import { gql, useLazyQuery } from "@apollo/client";
import { StateContext } from "../index";
import ChangeName from "./ChangeName";
import ChangePassword from "./ChangePassword";
import LogOff from "./LogOff";
import DeleteAccount from "./DeleteAccount";


const GET_USER_AND_PROJET_INFO = gql`
    query UserAndProjects {
        me {
            id
            token
            name
        }
        # projects query will be added later
    }
`

const App = observer(() => {
    const state = useContext(StateContext)
    const [queryInfo, {data, loading, error}] = useLazyQuery(GET_USER_AND_PROJET_INFO)
    
    const queryUserInfo = async () => {
        try {
            const { data } = await queryInfo()
            state.setUserName(data.me.name)
            localStorage.setItem('token', data.me.token)
        } catch(e) {
            localStorage.removeItem('token')
        }
    }

    useEffect(() => {
        if (localStorage.getItem('token') && !state.userName) {
            queryUserInfo()
        }
    }, [localStorage.getItem('token'), state.userName])

    if (loading) return <Loader className="main-loader"/>

    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage/>}>
                        <Route path="project-configuration" element={<ProjectConfiguration/>}/>
                        <Route path="login" element={<LoginOrSignIn/>}/>
                        <Route path="sign-in" element={<LoginOrSignIn creatingAccount/>}/>
                        <Route path="change-username" element={<ChangeName/>}/>
                        <Route path="change-password" element={<ChangePassword/>}/>
                        <Route path="log-off" element={<LogOff/>}/>
                        <Route path="delete-account" element={<DeleteAccount/>}/>
                    </Route>
                    <Route path="workplace/:id" element={<Workplace/>}/>
                    <Route path="*" element={<Navigate to="/"/>}/>
                </Routes>
            </Router>
        </>
    )
})

export default App