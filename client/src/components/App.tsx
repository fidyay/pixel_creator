import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import HomePage from "./HomePage";
import ProjectConfiguration from "./ProjectConfiguration";
import Workplace from "./Workplace";



const App = () => {
    return (
        <>
            <React.StrictMode>
                <Router>
                    <Routes>
                        <Route path="/" element={<HomePage/>}>
                            <Route path="project-configuration" element={<ProjectConfiguration/>}/>
                        </Route>
                        <Route path="workplace" element={<Workplace/>}/>
                        <Route path="*" element={<Navigate to="/"/>}/>
                    </Routes>
                </Router>
            </React.StrictMode>
        </>
    )
}

export default App