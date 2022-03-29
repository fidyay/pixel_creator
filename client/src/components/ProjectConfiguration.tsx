import React, { useState } from "react";
import Button from "./Button";

const spriteSizeTips = 'Maximum width and height for animated sprites is 100'
const imageSizeTips = 'For images maximum width is 1024 and maximum height is 768'


const ProjectConfiguration = () => {
    const [projectType, setProjectType] = useState('')
    const maxSizes = {
        width: projectType === 'sprite' ? 100 : 1024,
        height: projectType === 'sprite' ? 100 : 768,
    }

    return (
        <div className="modal">
            <form className="modal__form project-configuration-form">
                <h1 className="project-configuration-form__heading">Project configuration</h1>
                <label className="project-configuration-form__project-name">Project name<span className="required">*</span>: <input placeholder="Project 1" type="text"/></label>
                <fieldset className="project-configuration-form__project-type fieldset">
                    <legend className="fieldset__legend">Project type<span className="required">*</span></legend>
                    <label className="fieldset__label" onClick={() => setProjectType('image')}><span className={`fieldset__radiobutton${projectType === 'image' ? ' fieldset__radiobutton_checked' : ''}`}><input name="type" type="radio"/></span>Image</label>
                    <label className="fieldset__label" onClick={() => setProjectType('sprite')}><span className={`fieldset__radiobutton${projectType === 'sprite' ? ' fieldset__radiobutton_checked' : ''}`}><input name="type" type="radio"/></span>Sprite</label>
                </fieldset>

                <fieldset className="project-configuration-form__project-size fieldset">
                    <legend className="fieldset__legend">Project size<span className="required">*</span></legend>
                    {projectType && <p className="fieldset__tips">{projectType === 'sprite' ? spriteSizeTips : imageSizeTips}</p>}
                    <div className="fieldset__number-inputs">
                        <label className="fieldset__label">Width: <input max={maxSizes.width} min="1" type="number"/></label>
                        <label className="fieldset__label">Height: <input max={maxSizes.height} min="1" type="number"/></label>
                    </div>
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