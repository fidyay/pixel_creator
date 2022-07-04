import React, { useState, useContext, useEffect } from "react";
import RippleEffect from "./Effects/RippleEffect";
import Button from "./Button";
import { useMutation } from "@apollo/client";
import { CREATE_PROJECT, UPDATE_PROJECT, DELETE_PROJECT } from "./ProjectOptions";
import { observer } from "mobx-react";
import { StateContext } from "../index";
import Loader from "./Effects/Loader";
import { useNavigate } from "react-router-dom";
import downloadPICR from "../functions/downloadPICR";

interface ProjectParametersProps {
    drawingId: string
}

const ProjectParameters = observer(({drawingId}: ProjectParametersProps) => {
    const navigate = useNavigate()
    const state = useContext(StateContext)
    const drawing = state.drawings[drawingId]
    const [parametersShown, setParametersShown] = useState(false)
    const [createProject, {loading: creatingProjectLoading}] = useMutation(CREATE_PROJECT)
    const [updateProject, {loading: updatingProjectLoading}] = useMutation(UPDATE_PROJECT)
    const [deleteProject, {loading: deletingProjectLoading}] = useMutation(DELETE_PROJECT)

    useEffect(() => {
        const closingProjectParameters = (e: PointerEvent) => {
            const target = e.target as HTMLElement
            if (target.closest('.parameters__button') || target.closest('.dots')) return
            setParametersShown(false)
        }
        window.addEventListener('click', closingProjectParameters)
        return () => {
            window.removeEventListener('click', closingProjectParameters)
        }
    })

    return (
        <>
            <div onClick={() => setParametersShown(!parametersShown)} className="dots">
                <svg width="4" height="20" viewBox="0 0 4 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle r="2" transform="matrix(-1 0 0 1 2 2)" fill="white"/>
                    <circle r="2" transform="matrix(-1 0 0 1 2 10)" fill="white"/>
                    <circle r="2" transform="matrix(-1 0 0 1 2 18)" fill="white"/>
                </svg>
                <RippleEffect/>
            </div>
            {parametersShown && (
                <div className="parameters">
                    <Button className="parameters__button" saveButton onClick={() => downloadPICR(drawing)}>Save with .picr file</Button>
                    <Button className="parameters__button" saveButton disabled={!state.userName || !state.hasChanges(drawingId)}
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
                    }</Button>
                    <Button className="parameters__button" link linkPath={`/export-file/${drawingId}`}>Export</Button>
                    <Button disabled={deletingProjectLoading} className="parameters__button" deleteButton onClick={async () => {
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
            )}
        </>

    )
})

export default ProjectParameters