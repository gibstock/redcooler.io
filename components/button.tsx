import React from 'react'

type ButtonProps = {
  label: string,
  onClick: () => void,
}

function Button({label, onClick}: ButtonProps) {
  return (
    <button 
      className='text-white font-bold flex flex-row justify-center items-center'
      onClick={onClick}
    >
      <span>{label}</span>
    </button>
  )
}

export default Button