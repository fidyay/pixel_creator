import React from "react";

interface NumberInputProps {
    className: string,
    frontText: string,
    backText?: string,
    value: string | number,
    onChange: React.ChangeEventHandler<HTMLInputElement>,
    placeholder: string,
    max: string | number,
    min: string | number
}

const NumberInput = ({className, frontText, value, onChange, placeholder, max, min, backText = ''}: NumberInputProps) => {
    return (
        <label className={className}>{frontText}: <input value={value} onChange={onChange} placeholder={placeholder} max={max} min={min} type="number"/>{backText}</label>
    )
}

export default NumberInput