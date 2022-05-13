import React, { useState } from "react";

interface ColorPickerProps {
    className: string,
    value: string,
    onChange: (e: {value: string}) => void,
    forBackground?: boolean
}

const ColorPicker = ({value, className, onChange, forBackground}: ColorPickerProps) => {
    const [colorBlock, setColorBlock] = useState(null)
    const [colorSlider, setColorSlider] = useState(null)
    const rgbArray = value.slice(4, value.length - 1).split(',')
    const [colorBlockInfo, setColorBlockInfo] = useState({
        x: forBackground ? -5 : 95,
        y: forBackground ? -5 : 95
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
            <div style={{backgroundColor: value}} className="color-picker__color"/>
            <div className="color-picker__rgb-input">
                <label>R: <input value={rgbArray[0].trim()} type="number" min="0" max="255" onChange={e => {
                    let value = Number(e.target.value)
                    if (value < 0) value = 0
                    if (value > 255) value = 255
                    onChange({value: `rgb(${value}, ${rgbArray[1]}, ${rgbArray[2]})`})
                }}/></label>
                <label>G: <input value={rgbArray[1].trim()} type="number" min="0" max="255" onChange={e => {
                    let value = Number(e.target.value)
                    if (value < 0) value = 0
                    if (value > 255) value = 255
                    onChange({value: `rgb(${rgbArray[0]}, ${value}, ${rgbArray[2]})`})
                }}/></label>
                <label>B: <input value={rgbArray[2].trim()} type="number" min="0" max="255" onChange={e => {
                    let value = Number(e.target.value)
                    if (value < 0) value = 0
                    if (value > 255) value = 255
                    onChange({value: `rgb(${rgbArray[0]}, ${rgbArray[1]}, ${value})`})
                }}/></label>
            </div>
            <div className="color-picker__canvases">
                <div className="color-picker__color-block">
                    <canvas onPointerDown={e => {
                        if (colorBlock) {
                            const {top: targetTop, height: targetHeight, left: targetLeft} = e.currentTarget.getBoundingClientRect()
                            const responseOnBlockEvent = (e: PointerEvent | React.PointerEvent) => {
                                let X = e.clientX - targetLeft
                                if (X < 0) X = 0
                                if (X > targetHeight) X = targetHeight - 1
                                let Y = e.clientY - targetTop
                                if (Y < 0) Y = 0
                                if (Y > targetHeight) Y = targetHeight - 1
                                const ctx = colorBlock.getContext('2d')
                                const pixel = ctx.getImageData(X, Y, 1, 1).data
                                const newColor = {r: pixel[0], g: pixel[1], b: pixel[2]}
                                setColorBlockInfo({x: X - 5, y: Y - 5})
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
                    <div style={{backgroundColor: `rgb(${rgbArray[0]}, ${rgbArray[1]}, ${rgbArray[2]})`, left: `${colorBlockInfo.x}px`, top: `${colorBlockInfo.y}px`}} className="color-picker__color-block-thumb"/>
                </div>
                <div className="color-picker__color-slider">
                    <canvas onPointerDown={e => {
                        if (colorSlider) {
                            const {top: targetTop, height: targetHeight} = e.currentTarget.getBoundingClientRect()
                            const responseOnSliderEvent = (e: PointerEvent | React.PointerEvent) => {
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