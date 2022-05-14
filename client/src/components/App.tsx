import React, { createContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import HomePage from "./HomePage";
import ProjectConfiguration from "./ProjectConfiguration";
import Workplace from "./Workplace";
import State from "../state/State";

const state = new State

export const StateContext = createContext<State>(state)

const App = () => {
    return (
        <>
            <React.StrictMode>
                <StateContext.Provider value={state}>
                    <Router>
                        <Routes>
                            <Route path="/" element={<HomePage/>}>
                                <Route path="project-configuration" element={<ProjectConfiguration/>}/>
                            </Route>
                            <Route path="workplace/:id" element={<Workplace/>}/>
                            <Route path="*" element={<Navigate to="/"/>}/>
                        </Routes>
                    </Router>
                </StateContext.Provider>
            </React.StrictMode>
        </>
    )
}

export default App