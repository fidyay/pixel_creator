import React from "react";
import { Link } from "react-router-dom";

interface ButtonProps {
    link?: boolean,
    linkPath?: string
    buttonOnClickHandler?: React.MouseEventHandler<HTMLButtonElement>,
    className: string,
    children: string
}

const pointerDownHandler: React.PointerEventHandler<HTMLElement> = e => {
    const {left: targetLeft, top: targetTop} = e.currentTarget.getBoundingClientRect()
    const newX = e.clientX - targetLeft
    const newY = e.clientY - targetTop
    document.documentElement.style.setProperty('--x', `${newX}px`)
    document.documentElement.style.setProperty('--y', `${newY}px`)
}

export default ({link, linkPath, buttonOnClickHandler, className, children}: ButtonProps) => {
    return link ? 
    <Link to={linkPath} onPointerDown={pointerDownHandler} className={className}>{children}</Link> 
    :
    <button onPointerDown={pointerDownHandler}
    onClick={buttonOnClickHandler} className={className}>{children}</button>
}