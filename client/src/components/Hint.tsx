import React, { useState, useRef, useEffect } from "react";

interface HintProps {
    children: string
}

const Hint = ({children}: HintProps) => {
    const [showHint, setShowHint] = useState(false)
    const hint = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // set event listeners to parent
        const showHint = (e: PointerEvent) => {
            setShowHint(true)
        }
        const hideHint = (e: PointerEvent) => {
            setShowHint(false)
        }
        const parent = hint.current.parentElement
        parent.addEventListener('pointerenter', showHint)
        parent.addEventListener('pointerleave', hideHint)
        return () => {
            parent.removeEventListener('pointerenter', showHint)
            parent.removeEventListener('pointerleave', hideHint)
        }
    })

    useEffect(() => {
        // change size and position
        if (showHint) {
            const parent = hint.current.parentElement
            const parentRect = parent.getBoundingClientRect()
            const hintRect = hint.current.getBoundingClientRect()
            const hintBottomMargin = 10
            const top = parentRect.top - hintBottomMargin - hintRect.height
            let left = parentRect.left + parentRect.width/2 - hintRect.width/2
            if (left < 0) left = 0
            else if (left + hintRect.width > document.documentElement.clientWidth) left = document.documentElement.clientWidth - hintRect.width
            hint.current.style.top = `${top}px`
            hint.current.style.left = `${left}px`
        }
    }, [showHint])
    return <div style={{width: showHint ? '' : '0px', height: showHint ? '' : '0px', padding: showHint ? '5px 10px' : ''}} ref={hint} className="hint">{children}</div>
}

export default Hint