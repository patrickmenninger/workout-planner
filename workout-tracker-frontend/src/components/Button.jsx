import React from 'react'

const Button = ({children, bg = 'bg-side', className = ""}) => {
  return (
    <button className={`${bg} ${className}`}>
        {children}
    </button>
  )
}

export default Button