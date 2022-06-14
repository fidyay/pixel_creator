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
    type?: "button" | "submit" | "reset"
}

const Button = ({link, linkPath, onClick, className, children, transparent, chosen, deleteButton, type}: ButtonProps) => {
    return link ? 
    <Link to={linkPath} className={`${className}${chosen ? ' chosen' : ''}${transparent ? ' transparent' : ''}${deleteButton ? ' delete' : ''}`}>
        {children}
        <ActiveEffect/>
    </Link> 
    :
    <button type={type || 'button'} onClick={onClick} className={`${className}${chosen ? ' chosen' : ''}${transparent ? ' transparent' : ''}${deleteButton ? ' delete' : ''}`}>
        {children}
        <ActiveEffect/>
    </button>
}

export default Button