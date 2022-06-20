import React, { useContext } from "react";
import Button from "./Button";
import SpriteAnimation from "./SpriteAnimation";
import { StateContext } from "../index";
import { gql, useMutation } from "@apollo/client";
import Loader from "./Effects/Loader";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react";
import downloadPICR from "../functions/downloadPICR";

interface ProjectOptionsProps {
    drawingId: string
}

export const CREATE_PROJECT = gql`
    mutation createNewProject($drawing: JSON) {
        createProject(drawing: $drawing) {
            id
            name
            type
            frames
            background
            widthInSquares
            heightInSquares
        }
    }
`
export const UPDATE_PROJECT = gql`
    mutation updateProject($id: ID, $name: String, $frames: [JSON!]!) {
        updateProject(id: $id, name: $name, frames: $frames) {
            id
            name
            type
            frames
            background
            widthInSquares
            heightInSquares
        }
    }
`

export const DELETE_PROJECT = gql`
    mutation deleteProject($id: ID) {
        deleteProject(id: $id) {
            status
        }
    }
`

const ProjectOptions = observer(({drawingId}: ProjectOptionsProps) => {
    const navigate = useNavigate()
    const state = useContext(StateContext)
    const drawing = state.drawings[drawingId]
    const [createProject, {loading: creatingProjectLoading}] = useMutation(CREATE_PROJECT)
    const [updateProject, {loading: updatingProjectLoading}] = useMutation(UPDATE_PROJECT)
    const [deleteProject, {loading: deletingProjectLoading}] = useMutation(DELETE_PROJECT)
    return (
        <div className="main__project-options project-options">
            {drawing.type !== 'image' && <SpriteAnimation drawing={drawing}/>}
            <Button saveButton className="project-options__button" onClick={() => downloadPICR(drawing)}>Save with .picr file</Button>
            <Button saveButton className="project-options__button" disabled={!state.userName || !state.hasChanges(drawingId)}
            onClick={async () => {
                if (!state.isSavedOnline(drawingId)) {
                    await createProject({variables: {drawing}})
                    state.setSavedOnline(drawing)
                } else {
                    await updateProject({variables: {id: drawing.id, name: drawing.name, frames: drawing.frames}})
                    state.setSavedOnline(drawing)
                }
            }}
            >{
                (creatingProjectLoading || updatingProjectLoading) ? 
                    <Loader widthAndHeight={8.4}/>
                    :
                    `Save ${state.isSavedOnline(drawingId) ? 'changes' : 'on cloud'}`
            }
            </Button>
            <Button className="project-options__button">Export</Button>
            <Button className="project-options__button">Import</Button>
            <Button deleteButton disabled={deletingProjectLoading} className="project-options__button" onClick={async () => {
                if (state.isSavedOnline(drawingId)) {
                    await deleteProject({variables: {id: drawingId}})
                }
                navigate('/')
                state.deleteProject(drawingId)
            }}>
                {
                    deletingProjectLoading ? 
                        <Loader widthAndHeight={8.4}/>
                        :
                        'Delete'
                }
            </Button>
        </div>
    )
})

export default ProjectOptions