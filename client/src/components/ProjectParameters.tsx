import React, { useState } from "react";
import ActiveEffect from "./Effects/ActiveEffect";
import Button from "./Button";

const ProjectParameters = () => {
    const [parametersShown, setParametersShown] = useState(false)

    return (
        <>
            <div onClick={() => setParametersShown(!parametersShown)} className="dots">
                <svg width="4" height="20" viewBox="0 0 4 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle r="2" transform="matrix(-1 0 0 1 2 2)" fill="white"/>
                    <circle r="2" transform="matrix(-1 0 0 1 2 10)" fill="white"/>
                    <circle r="2" transform="matrix(-1 0 0 1 2 18)" fill="white"/>
                </svg>
                <ActiveEffect/>
            </div>
            {parametersShown && (
                <div className="parameters">
                    <Button className="parameters__button">Save with .picr file</Button>
                    <Button className="parameters__button">Save on cloud</Button>
                    <Button className="parameters__button">Export</Button>
                    <Button className="parameters__button" deleteButton>Delete</Button>
                </div>
            )}
        </>

    )
}

export default ProjectParameters