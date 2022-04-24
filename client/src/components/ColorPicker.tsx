import React, { useState } from "react";

interface ColorPickerProps {
    className: string,
    onChange: (e: {value: string}) => void,
    forBackground?: boolean
}

const ColorPicker = ({className, onChange, forBackground}: ColorPickerProps) => {
    const [colorBlock, setColorBlock] = useState(null)
    const [colorSlider, setColorSlider] = useState(null)
    const [colorBlockInfo, setColorBlockInfo] = useState({
        color: {
            r: forBackground ? 255 : 0,
            g: forBackground ? 255 : 0,
            b: forBackground ? 255 : 0
        },
        thumpPos: {
            x: forBackground ? -5 : 95,
            y: forBackground ? -5 : 95
        }
    })
    const [colorSliderInfo, setColorSliderInfo] = useState({
        color: 'rgba(255, 0, 0)',
        top: '-2px' 
    })
    
    if (colorBlock) {
        let ColorCtx = colorBlock.getContext('2d')  // This create a 2D context for the canvas

        let color = colorSliderInfo.color
        let gradientH = ColorCtx.createLinearGradient(0, 0, 100, 0)
        gradientH.addColorStop(0, '#fff')
        gradientH.addColorStop(1, color)
        ColorCtx.fillStyle = gradientH
        ColorCtx.fillRect(0, 0, ColorCtx .canvas.width, ColorCtx .canvas.height)

        // Create a Vertical Gradient(white to black)
        let gradientV = ColorCtx.createLinearGradient(0, 0, 0, 100)
        gradientV.addColorStop(0, 'rgba(0, 0, 0, 0)')
        gradientV.addColorStop(1, '#000')
        ColorCtx.fillStyle = gradientV
        ColorCtx.fillRect(0, 0, ColorCtx.canvas.width, 
        ColorCtx.canvas.height) 
    }

    if (colorSlider) {
        let ctx = colorSlider.getContext('2d')
        const sliderGradient = ctx.createLinearGradient(0, 0, 0, 100)
        const colors = ['rgb(255, 0, 0)', 'rgb(255, 128, 0)', 'rgb(255, 242, 0)', 'rgb(0, 255, 0)', 'rgb(0, 255, 238)', 'rgb(0, 0, 255)', 'rgb(255, 0, 255)']
        for (let i = 0, percentage = 1/colors.length; i < colors.length; i++) {
            sliderGradient.addColorStop(i * percentage, colors[i])
        }
        ctx.fillStyle = sliderGradient  
        ctx.fillRect(0, 0, 10, 100)
    }

    return (
        <div className={`color-picker ${className}`}>
            <div style={{backgroundColor: `rgb(${colorBlockInfo.color.r}, ${colorBlockInfo.color.g}, ${colorBlockInfo.color.b})`}} className="color-picker__color"/>
            <div className="color-picker__rgb-input">
                <label>R: <input value={colorBlockInfo.color.r} type="number" min="0" max="255" onChange={e => {
                    const newColor = {...colorBlockInfo.color, r: Number(e.target.value)}
                    setColorBlockInfo({...colorBlockInfo, color: newColor})
                    onChange({value: `rgb(${newColor.r}, ${newColor.g}, ${newColor.b})`})
                }}/></label>
                <label>G: <input value={colorBlockInfo.color.g} type="number" min="0" max="255" onChange={e => {
                    const newColor = {...colorBlockInfo.color, g: Number(e.target.value)}
                    setColorBlockInfo({...colorBlockInfo, color: newColor})
                    onChange({value: `rgb(${newColor.r}, ${newColor.g}, ${newColor.b})`})
                }}/></label>
                <label>B: <input value={colorBlockInfo.color.b} type="number" min="0" max="255" onChange={e => {
                    const newColor = {...colorBlockInfo.color, b: Number(e.target.value)}
                    setColorBlockInfo({...colorBlockInfo, color: newColor})
                    onChange({value: `rgb(${newColor.r}, ${newColor.g}, ${newColor.b})`})
                }}/></label>
            </div>
            <div className="color-picker__canvases">
                <div className="color-picker__color-block">
                    <canvas onPointerDown={e => {
                        if (colorBlock) {
                            const {top: targetTop, height: targetHeight, left: targetLeft} = e.currentTarget.getBoundingClientRect()
                            const responseOnBlockEvent = (e: any) => {
                                let X = e.clientX - targetLeft
                                if (X < 0) X = 0
                                if (X > targetHeight) X = targetHeight - 1
                                let Y = e.clientY - targetTop
                                if (Y < 0) Y = 0
                                if (Y > targetHeight) Y = targetHeight - 1
                                const ctx = colorBlock.getContext('2d')
                                const pixel = ctx.getImageData(X, Y, 1, 1).data
                                const newColor = {r: pixel[0], g: pixel[1], b: pixel[2]}
                                setColorBlockInfo({color: newColor, thumpPos: {x: X - 5, y: Y - 5}})
                                onChange({value: `rgb(${newColor.r}, ${newColor.g}, ${newColor.b})`})
                            }
                            responseOnBlockEvent(e)
                            const removeListeners = () => {
                                window.removeEventListener('pointermove', responseOnBlockEvent)
                                window.removeEventListener('pointerup', removeListeners)
                            }
                            window.addEventListener('pointermove', responseOnBlockEvent)
                            window.addEventListener('pointerup', removeListeners)
                        }
                    }} ref={node => setColorBlock(node)} height="100" width="100"/>
                    <div style={{backgroundColor: `rgb(${colorBlockInfo.color.r}, ${colorBlockInfo.color.g}, ${colorBlockInfo.color.b})`, left: `${colorBlockInfo.thumpPos.x}px`, top: `${colorBlockInfo.thumpPos.y}px`}} className="color-picker__color-block-thumb"/>
                </div>
                <div className="color-picker__color-slider">
                    <canvas onPointerDown={e => {
                        if (colorSlider) {
                            const {top: targetTop, height: targetHeight} = e.currentTarget.getBoundingClientRect()
                            const responseOnSliderEvent = (e: any) => {
                                let Y = e.clientY - targetTop
                                if (Y < 0) Y = 0
                                if (Y > targetHeight) Y = targetHeight - 1
                                const ctx = colorSlider.getContext('2d')
                                const pixel = ctx.getImageData(0, Y, 1, 1).data
                                setColorSliderInfo({color: `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`, top: `${Y - 2}px`})
                            }
                            responseOnSliderEvent(e)
                            const removeListeners = () => {
                                window.removeEventListener('pointermove', responseOnSliderEvent)
                                window.removeEventListener('pointerup', removeListeners)
                            }
                            window.addEventListener('pointermove', responseOnSliderEvent)
                            window.addEventListener('pointerup', removeListeners)
                        }
                    }} ref={node => setColorSlider(node)} width="10" height="100"/>
                    <div style={{backgroundColor: colorSliderInfo.color, top: colorSliderInfo.top}} className="color-picker__slider-thumb"/>
                </div>
            </div>
        </div>
    )
}

export default ColorPicker