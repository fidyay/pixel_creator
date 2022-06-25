import React from "react";

interface RadiobuttonProps {
    onClick: React.MouseEventHandler<HTMLLabelElement>,
    radiobuttonValue: any,
    currentRadiobuttonValue: any,
    children: string,
    className: string
}

const Radiobutton = ({onClick, radiobuttonValue, currentRadiobuttonValue, children, className}: RadiobuttonProps) => {

    return (
        <label onClick={onClick} className={className}><span className={`radiobutton${currentRadiobuttonValue === radiobuttonValue ? ' radiobutton_checked' : ''}`}><input name="type" type="radio"/></span>{children}</label>
    )
}

export default Radiobutton