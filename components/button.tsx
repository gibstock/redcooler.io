import React from 'react'

type ButtonProps = {
  label: string,
  onClick?: () => void,
  bgColor: string,
  fontColor: string,
  padding: string,
  hover: string,
  disabled?: boolean,
  disabledConditions?: string,
  outline?: string,
  type?: "button" | "submit" | "reset" | undefined,
  fullWidth?: boolean,
}

function Button({label, onClick, bgColor, fontColor, padding, hover, disabled, disabledConditions, outline, type, fullWidth}: ButtonProps) {
  return (
    <button 
      className={` ${fontColor} ${bgColor} ${padding} ${hover} ${disabledConditions} ${outline} ${fullWidth? 'w-full' : ''} flex flex-row justify-center items-center rounded-full`}
      onClick={onClick}
      disabled={disabled ? true : false}
      type={type? type : "button"}
    >
      <span>{label}</span>
    </button>
  )
}

export default Button