import React from "react"

interface LoaderProps {
    className?: string,
    widthAndHeight?: number
}

const Loader = ({className, widthAndHeight}: LoaderProps) => {
    return (
        <div style={{width: widthAndHeight ? `${widthAndHeight}px` : '', height: widthAndHeight ? `${widthAndHeight}px` : ''}} className={`lds-ellipsis${className ? ` ${className}` : ''}`}>
            <div/>
            <div/>
            <div/>
            <div/>
        </div>
    )
}

export default Loader