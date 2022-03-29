import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import HomePage from "./HomePage";
import ProjectConfiguration from "./ProjectConfiguration";



const App = () => {
    return (
        <>
            <React.StrictMode>
                <Router>
                    <Routes>
                        <Route path="/" element={<HomePage/>}>
                            <Route path="project-configuration" element={<ProjectConfiguration/>}/>
                        </Route>
                        {/* <Route path="create"/> */}
                        <Route path="*" element={<Navigate to="/"/>}/>
                    </Routes>
                </Router>
            </React.StrictMode>
        </>
    )
}

export default App