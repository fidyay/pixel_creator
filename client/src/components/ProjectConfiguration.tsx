import React, { useState, useContext } from "react";
import Button from "./Button";
import ColorPicker from "./ColorPicker";
import { useNavigate } from "react-router-dom";
import generateId from "../functions/generateId";
import { StateContext } from "../index";
import type { ProjectType, ColorType } from "../state/State";
import Radiobutton from "./Radiobutton";
import NumberInput from "./NumberInput";


const spriteSizeTips = 'Maximum width and height for animated sprites is 100'
const imageSizeTips = 'For images maximum width is 1024 and maximum height is 768'

const ProjectConfiguration = () => {
    const state = useContext(StateContext)
    const navigate = useNavigate()
    /*  
        User projects can be either a sprite or a image.
        In this app sprite and image have the same structure, but image can have 1 frame only.
    */

    const [projectName, setProjectName] = useState(`Project ${Object.keys(state.drawings).length + 1}`)
    const [projectType, setProjectType] = useState<ProjectType>('sprite')
    const [projectBG, setProjectBG] = useState<ColorType>('transparent')
    const maxSizes = {
        width: projectType === 'sprite' ? 100 : 1024,
        height: projectType === 'sprite' ? 100 : 768,
    }

    const numberPlaceHolder = projectType === 'sprite' ? '16' : '100'
    const [projectWidthInSquares, setProjectWidthInSquares] = useState(numberPlaceHolder)
    const [projectHeightInSquares, setProjectHeightInSquares] = useState(numberPlaceHolder)
    
    return (
        <div className="modal">
            <form className="modal__form project-configuration-form">
                <h1 className="project-configuration-form__heading">Project configuration</h1>
                <label className="project-configuration-form__project-name">Project name<span className="required">*</span>: <input value={projectName}
                onChange={e => {
                    setProjectName(e.target.value)
                }}
                placeholder="Project 1" type="text"/></label>
                <fieldset className="project-configuration-form__project-type fieldset">
                    <legend className="fieldset__legend">Project type<span className="required">*</span></legend>
                    <Radiobutton className="fieldset__label" onClick={() => setProjectType('image')} radiobuttonValue="image" currentRadiobuttonValue={projectType}>Image</Radiobutton>
                    <Radiobutton className="fieldset__label" onClick={() => setProjectType('sprite')} radiobuttonValue="sprite" currentRadiobuttonValue={projectType}>Sprite</Radiobutton>
                </fieldset>

                <fieldset className="project-configuration-form__project-size fieldset">
                    <legend className="fieldset__legend">Project size<span className="required">*</span></legend>
                    {projectType && <p className="fieldset__tips">{projectType === 'sprite' ? spriteSizeTips : imageSizeTips}</p>}
                    <div className="fieldset__number-inputs">
                        <NumberInput className="fieldset__label" frontText="Width" value={projectWidthInSquares} onChange={e => setProjectWidthInSquares(e.target.value)} placeholder={numberPlaceHolder} max={maxSizes.width} min="1"/>
                        <NumberInput className="fieldset__label" frontText="Height" value={projectHeightInSquares} onChange={e => setProjectHeightInSquares(e.target.value)} placeholder={numberPlaceHolder} max={maxSizes.height} min="1"/>
                    </div>
                </fieldset>

                <fieldset className="project-configuration-form__project-background-color fieldset">
                    <legend className="fieldset__legend">Background color<span className="required">*</span></legend>
                    <Radiobutton className="fieldset__label" onClick={() => setProjectBG('transparent')} radiobuttonValue="transparent" currentRadiobuttonValue={projectBG}>Transparent</Radiobutton>
                    <Radiobutton className="fieldset__label" onClick={() => setProjectBG(projectBG === 'transparent' ? 'rgb(255, 255, 255)' : projectBG)} radiobuttonValue={projectBG === 'transparent' ? 'rgb(255, 255, 255)' : projectBG} currentRadiobuttonValue={projectBG}>Custom</Radiobutton>
                    {projectBG !== 'transparent' && <ColorPicker onChange={e => {
                            const color = e.value as ColorType
                            setProjectBG(color)
                        }}
                        value={projectBG} className="fieldset__color-picker" forBackground/>}
                </fieldset>

                <div className="project-configuration-form__buttons">
                    <Button className="project-configuration-form__button" onClick={() => {
                        const newId = generateId()
                        state.createDrawing(newId, projectName, projectType, projectBG, Number(projectWidthInSquares), Number(projectHeightInSquares))
                        navigate(`/workplace/${newId}`)
                    }}>Ok</Button>
                    <Button className="project-configuration-form__button" link linkPath="/">Cancel</Button>
                </div>
            </form> 
        </div>
    )
}

export default ProjectConfiguration