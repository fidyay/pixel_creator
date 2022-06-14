import React, {useContext, useState} from "react";
import UserProject from "./UserProject";
import { StateContext } from "../index";
import { observer } from "mobx-react";

const averageMaxWidthInPixels = 200

const UserProjects = observer(() => {
    const drawings = useContext(StateContext).drawings
    const [projectsParentDiv, setProjectsParentDiv] = useState<HTMLDivElement>(null)
    const maxWidthInSquares = Math.max(...Object.values(drawings).map(drawing => drawing.widthInSquares))
    const squareWidth = Math.round(averageMaxWidthInPixels/maxWidthInSquares)
    const maxWidthInPixels = squareWidth * maxWidthInSquares
    let margines = 0
    let projectsInOneLine = 0
    if (projectsParentDiv) {
        const parentDivWidth = parseInt(getComputedStyle(projectsParentDiv).width)
        projectsInOneLine = Math.floor(parentDivWidth / (maxWidthInPixels + 20))
        const freeSpace = parentDivWidth - projectsInOneLine * (maxWidthInPixels + 20)
        margines = freeSpace / (projectsInOneLine + 1)
    }
    return (
        <div className="home__user-projects user-projects">
            <h1 className="user-projects__heading">Projects</h1>
            <div ref={node => setProjectsParentDiv(node)} className="user-projects__projects projects">
                {Object.keys(drawings).map((id, index) => {
                    return (
                        <UserProject key={id} id={id} squareWidth={squareWidth} maxWidthInPixels={maxWidthInPixels} margines={margines} onStartOfTheLine={index % projectsInOneLine === 0}/>
                    )
                })}
            </div>
        </div>
    )
})

export default UserProjects