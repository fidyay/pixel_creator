import React, { useState } from "react";
import Button from "./Button";
import ColorPicker from "./ColorPicker";

const spriteSizeTips = 'Maximum width and height for animated sprites is 100'
const imageSizeTips = 'For images maximum width is 1024 and maximum height is 768'


const ProjectConfiguration = () => {
    const [projectType, setProjectType] = useState('')
    const [projectBG, setProjectBG] = useState('transparent')
    const maxSizes = {
        width: projectType === 'sprite' ? 100 : 1024,
        height: projectType === 'sprite' ? 100 : 768,
    }
    const numberPlaceHolder = projectType === 'sprite' ? '16' : '100'
    

    return (
        <div className="modal">
            <form className="modal__form project-configuration-form">
                <h1 className="project-configuration-form__heading">Project configuration</h1>
                <label className="project-configuration-form__project-name">Project name<span className="required">*</span>: <input placeholder="Project 1" type="text"/></label>
                <fieldset className="project-configuration-form__project-type fieldset">
                    <legend className="fieldset__legend">Project type<span className="required">*</span></legend>
                    <label className="fieldset__label" onClick={() => setProjectType('image')}><span className={`radiobutton${projectType === 'image' ? ' radiobutton_checked' : ''}`}><input name="type" type="radio"/></span>Image</label>
                    <label className="fieldset__label" onClick={() => setProjectType('sprite')}><span className={`radiobutton${projectType === 'sprite' ? ' radiobutton_checked' : ''}`}><input name="type" type="radio"/></span>Sprite</label>
                </fieldset>

                <fieldset className="project-configuration-form__project-size fieldset">
                    <legend className="fieldset__legend">Project size<span className="required">*</span></legend>
                    {projectType && <p className="fieldset__tips">{projectType === 'sprite' ? spriteSizeTips : imageSizeTips}</p>}
                    <div className="fieldset__number-inputs">
                        <label className="fieldset__label">Width: <input placeholder={numberPlaceHolder} max={maxSizes.width} min="1" type="number"/></label>
                        <label className="fieldset__label">Height: <input placeholder={numberPlaceHolder} max={maxSizes.height} min="1" type="number"/></label>
                    </div>
                </fieldset>

                <fieldset className="project-configuration-form__project-background-color fieldset">
                    <legend className="fieldset__legend">Background color<span className="required">*</span></legend>
                    <label onClick={() => setProjectBG('transparent')} className="fieldset__label"><span className={`radiobutton${projectBG === 'transparent' ? ' radiobutton_checked' : ''}`}><input name="type" type="radio"/></span>Transparent</label>
                    <label onClick={() => setProjectBG('custom')} className="fieldset__label"><span className={`radiobutton${projectBG !== 'transparent' ? ' radiobutton_checked' : ''}`}><input name="type" type="radio"/></span>Custom</label>
                    {projectBG !== 'transparent' && <ColorPicker className="fieldset__color-picker"/>}
                </fieldset>

                <div className="project-configuration-form__buttons">
                    <Button className="project-configuration-form__button" link linkPath="/create">Ok</Button>
                    <Button className="project-configuration-form__button" link linkPath="/">Cancel</Button>
                </div>
            </form> 
        </div>
    )
}

export default ProjectConfiguration