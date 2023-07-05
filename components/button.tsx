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
  type?: "button" | "submit" | "reset" | undefined,
}

function Button({label, onClick, bgColor, fontColor, padding, hover, disabled, disabledConditions, type}: ButtonProps) {
  return (
    <button 
      className={` ${fontColor} ${bgColor} ${padding} ${hover} ${disabledConditions} flex flex-row justify-center items-center rounded-full`}
      onClick={onClick}
      disabled={disabled ? true : false}
      type={type? type : "button"}
    >
      <span>{label}</span>
    </button>
  )
}

export default Button