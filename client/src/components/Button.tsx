import React from "react";
import { Link } from "react-router-dom";

interface ButtonProps {
    link?: boolean,
    linkPath?: string
    onClick?: React.PointerEventHandler<HTMLButtonElement>,
    className: string,
    children: React.ReactNode,
    transparent?: boolean,
    chosen?: boolean,
    deleteButton?: boolean
}

export const pointerDownHandler: React.PointerEventHandler<HTMLElement> = e => {
    const {left: targetLeft, top: targetTop} = e.currentTarget.getBoundingClientRect()
    const newX = e.clientX - targetLeft
    const newY = e.clientY - targetTop
    document.documentElement.style.setProperty('--x', `${newX}px`)
    document.documentElement.style.setProperty('--y', `${newY}px`)
}


const Button = ({link, linkPath, onClick, className, children, transparent, chosen, deleteButton}: ButtonProps) => {
    return link ? 
    <Link to={linkPath} onPointerDown={pointerDownHandler} className={`${className}${chosen ? ' chosen' : ''}${transparent ? ' transparent' : ''}${deleteButton ? ' delete' : ''}`}>{children}</Link> 
    :
    <button onPointerDown={pointerDownHandler}
    onClick={onClick} className={`${className}${chosen ? ' chosen' : ''}${transparent ? ' transparent' : ''}${deleteButton ? ' delete' : ''}`}>{children}</button>
}

export default Button