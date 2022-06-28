import React, { useState, useEffect } from "react";
import useResizeElement from "../../functions/hooks/useResizeElement";

interface ScrollbarProps {
    children: React.ReactChildren | React.ReactNode
}

function isOverflownVertically(element: HTMLElement) {
    return element.scrollHeight > element.clientHeight
}

const Scrollbar = ({children}: ScrollbarProps) => {
    const [childrenWrapper, setChildrenWrapper] = useState<HTMLDivElement>(null)
    const [thumb, setThumb] = useState<HTMLDivElement>(null)
    const childrenWrapperScrollHeight = useResizeElement(childrenWrapper)

    useEffect(() => {
        if (childrenWrapper && thumb) {
            let thumbY = (childrenWrapper.clientHeight ** 2)/childrenWrapperScrollHeight
            thumb.style.height = `${thumbY}px`
        }
    }, [childrenWrapper, thumb, childrenWrapperScrollHeight])


    return (<div className="scroll-wrapper">
                <div ref={node => setChildrenWrapper(node)} className="scroll-wrapper__children-wrapper"
                onScroll={() => {
                    let newTop = childrenWrapper.scrollTop/childrenWrapperScrollHeight * childrenWrapper.clientHeight
                    thumb.style.top = `${newTop}px`
                }}>{children}</div>
                {childrenWrapper && isOverflownVertically(childrenWrapper) && <div onPointerDown={e => {
                    const {top: divY} = e.currentTarget.getBoundingClientRect()
                    const {height: thumbHeight} = thumb.getBoundingClientRect()
                    const thumbTop = parseFloat(thumb.style.top)
                    let thumbY = e.clientY - divY - thumbTop
                    if (thumbY < 0 || thumbY > thumbHeight) thumbY = thumbHeight/2

                    // event listeners
                    const handleScrolling = (e: PointerEvent | React.PointerEvent<HTMLDivElement>) => {
                        let Y = e.clientY - divY
                        if (Y < thumbY) Y = thumbY
                        if (Y > childrenWrapper.clientHeight - (thumbHeight - thumbY)) Y = childrenWrapper.clientHeight - (thumbHeight - thumbY)
                        childrenWrapper.scrollTo({top: (Y - thumbY)/childrenWrapper.clientHeight * childrenWrapperScrollHeight})
                    }
                    const removeEventListeners = () => {
                        window.removeEventListener('pointermove', handleScrolling)
                        window.removeEventListener('pointerup', removeEventListeners)
                    }

                    handleScrolling(e)

                    window.addEventListener('pointermove', handleScrolling)
                    window.addEventListener('pointerup', removeEventListeners)
                }} className="scroll-wrapper__scrollbar scrollbar">
                    <div style={{top: '0px'}} ref={node => setThumb(node)} className="scrollbar__thumb"/>
                </div>}
            </div>)

}

export default Scrollbar