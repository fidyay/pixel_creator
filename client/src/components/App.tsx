import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import HomePage from "./HomePage";


export default () => {
    return (
        <>
            <React.StrictMode>
                <Router>
                    <Routes>
                        <Route index element={<HomePage/>}/>
                        <Route path="create"/>
                        <Route path="*" element={<Navigate to="/"/>}/>
                    </Routes>
                </Router>
            </React.StrictMode>
        </>
    )
}