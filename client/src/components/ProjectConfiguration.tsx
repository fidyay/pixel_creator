import React, { useState } from "react";
import Button from "./Button";

export default () => {
    const [projectType, setProjectType] = useState('')

    return (
        <div className="modal">
            <form className="modal__form project-configuration-form">
                <h1 className="project-configuration-form__heading">Project configuration</h1>
                <label className="project-configuration-form__project-name">Project name<span className="required">*</span>: <input placeholder="Project 1" type="text"/></label>
                <fieldset className="project-configuration-form__project-type fieldset">
                    <legend className="fieldset__legend">Project type<span className="required">*</span></legend>
                    <label onClick={() => setProjectType('image')}><span className={`fieldset__radiobutton${projectType === 'image' ? ' fieldset__radiobutton_checked' : ''}`}><input name="type" type="radio"/></span>Image</label>
                    <label onClick={() => setProjectType('sprite')}><span className={`fieldset__radiobutton${projectType === 'sprite' ? ' fieldset__radiobutton_checked' : ''}`}><input name="type" type="radio"/></span>Sprite</label>
                </fieldset>
                <fieldset className="project-configuration-form__project-size fieldset">
                    <legend className="fieldset__legend">Project size</legend>
                    <label>Width: <input type="number"/></label>
                    <label>Height: <input type="number"/></label>
                </fieldset>
                <div>
                    <Button className="project-configuration-form__button" link linkPath="/create">Ok</Button>
                    <Button className="project-configuration-form__button" link linkPath="/">Cancel</Button>
                </div>
            </form> 
        </div>
    )
}