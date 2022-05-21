import React, { useContext } from "react";
import Button from "./Button";
import SpriteAnimation from "./SpriteAnimation";
import { StateContext } from "./App"

interface ProjectOptionsProps {
    drawingId: string
}

const ProjectOptions = ({drawingId}: ProjectOptionsProps) => {
    const drawing = useContext(StateContext).drawings[drawingId]
    return (
        <div className="main__project-options project-options">
            <SpriteAnimation drawing={drawing}/>
            <Button className="project-options__button">Save with .picr file</Button>
            <Button className="project-options__button">Save on cloud</Button>
            <Button className="project-options__button">Export</Button>
            <Button className="project-options__button">Import</Button>
            <Button deleteButton className="project-options__button">Delete</Button>
        </div>
    )
}

export default ProjectOptions