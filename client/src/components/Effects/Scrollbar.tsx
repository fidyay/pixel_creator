import React, { useState, useEffect } from "react";

interface ScrollbarProps {
    children: React.ReactChildren | React.ReactNode
}

const Scrollbar = ({children}: ScrollbarProps) => {
    const [childrenWrapper, setChildrenWrapper] = useState<HTMLDivElement>(null)
    const [thumb, setThumb] = useState<HTMLDivElement>(null)

    useEffect(() => {
        if (childrenWrapper && thumb) {
            let thumbY = (childrenWrapper.clientHeight ** 2)/childrenWrapper.scrollHeight
            // min height is 30
            if (thumbY < 30) thumbY = 30
            thumb.style.height = `${thumbY}px`
        }
    })


    return (<div className="scroll-wrapper">
                <div ref={node => setChildrenWrapper(node)} className="scroll-wrapper__children-wrapper"
                onScroll={() => {
                    let newTop = childrenWrapper.scrollTop/childrenWrapper.scrollHeight * childrenWrapper.clientHeight
                    thumb.style.top = `${newTop}px`
                }}>{children}</div>
                {childrenWrapper && childrenWrapper.scrollHeight > childrenWrapper.clientHeight && <div onPointerDown={e => {
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
                        childrenWrapper.scrollTo({top: (Y - thumbY)/childrenWrapper.clientHeight * childrenWrapper.scrollHeight})
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