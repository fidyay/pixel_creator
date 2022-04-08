import React from "react";
import Button from "./Button";
import SpriteAnimation from "./SpriteAnimation";

const spriteWidth = 100
const spriteHeight = 120

const ProjectOptions = () => {
    return (
        <div className="main__project-options project-options">
            <SpriteAnimation width={spriteWidth} height={spriteHeight}/>
            <Button className="project-options__button">Save with .picr file</Button>
            <Button className="project-options__button">Save on cloud</Button>
            <Button className="project-options__button">Export</Button>
            <Button className="project-options__button">Import</Button>
            <Button deleteButton className="project-options__button">Delete</Button>
        </div>
    )
}

export default ProjectOptions