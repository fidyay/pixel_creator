import React, { useRef, useEffect } from "react";

interface ActiveEffectProps {
    disabled?: boolean
}

const ActiveEffect = ({disabled}: ActiveEffectProps) => {
    const effectDiv = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (disabled) return 
        const parent = effectDiv.current.parentNode as HTMLElement
        if (getComputedStyle(parent).position === 'static') {
            parent.style.position = 'relative'
        }
        const pointerDownHandler = (e: PointerEvent) => {
            effectDiv.current.style.transition = ''
            effectDiv.current.style.width = '0px'
            effectDiv.current.style.height = '0px'
            effectDiv.current.style.backgroundColor = ''
            const parentClientRect = parent.getBoundingClientRect()
            const leftCoord = e.clientX - parentClientRect.left
            const topCoord = e.clientY - parentClientRect.top
            effectDiv.current.style.left = `${leftCoord}px`
            effectDiv.current.style.top = `${topCoord}px`
            effectDiv.current.style.transition = 'background-color .3s, width .3s, height .3s'
            effectDiv.current.style.backgroundColor = 'rgba(0, 0, 0, .5)'
            if (parentClientRect.height > parentClientRect.width) {
                effectDiv.current.style.width = `${parentClientRect.height * 3}px`
                effectDiv.current.style.height = `${parentClientRect.height * 3}px`
            } else {
                effectDiv.current.style.width = `${parentClientRect.width * 3}px`
                effectDiv.current.style.height = `${parentClientRect.width * 3}px`
            }
        }

        const pointerUpHandler = (e: PointerEvent) => {
            effectDiv.current.style.transition = 'background-color .4s'
            effectDiv.current.style.backgroundColor = 'transparent'
        }

        parent.addEventListener('pointerdown', pointerDownHandler)
        window.addEventListener('pointerup', pointerUpHandler)

        return () => {
            parent.removeEventListener('pointerdown', pointerDownHandler)
            window.removeEventListener('pointerup', pointerUpHandler)
        }
    }, [disabled])

    return <div style={{position: 'absolute', transform: 'translate(-50%, -50%)', borderRadius: '50%', zIndex: 10}} ref={effectDiv}/>
}

export default ActiveEffect