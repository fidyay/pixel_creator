import React from "react";
import { Link } from "react-router-dom";
import ActiveEffect from "./Effects/ActiveEffect"

interface ButtonProps {
    link?: boolean,
    linkPath?: string
    onClick?: React.PointerEventHandler<HTMLButtonElement>,
    className: string,
    children: React.ReactNode,
    transparent?: boolean,
    chosen?: boolean,
    deleteButton?: boolean,
    saveButton?: boolean,
    disabled?: boolean,
    type?: "button" | "submit" | "reset"
}

const Button = ({link, linkPath, onClick, className, children, transparent, chosen, deleteButton, saveButton, type, disabled}: ButtonProps) => {
    return link ? 
    <Link to={linkPath} className={`${className}${chosen ? ' chosen' : ''}${transparent ? ' transparent' : ''}${deleteButton ? ' delete' : ''}${saveButton ? ' save' : ''}`}>
        {children}
        <ActiveEffect/>
    </Link> 
    :
    <button type={type || 'button'} disabled={disabled} onClick={onClick} className={`${className}${chosen ? ' chosen' : ''}${transparent ? ' transparent' : ''}${deleteButton ? ' delete' : ''}${saveButton ? ' save' : ''}`}>
        {children}
        <ActiveEffect disabled={disabled}/>
    </button>
}

export default Button