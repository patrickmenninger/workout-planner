import React from 'react'

export const Card = ({children, bg = 'bg-side-900', className = ""}) => {
  return (
    <div className={`${bg} border-border-900 border-2 rounded-lg shadow-md p-3 m-3 ${className}`}>
        {children}
    </div>
  )
}

export const Button = ({children, type = "primary", className = "", onClick = null}) => {

    const styling = 
        type === "primary" 
        ? "bg-accent-900 hover:bg-accent-500 text-black"
        : type === "secondary" 
        ? "bg-side-900 hover:bg-side-500"
        : type === "go"
        ? "bg-go-900 hover:bg-go-500"
        : type === "danger"
        ? "bg-danger-900 hover:bg-danger-500"
        : "";

  return (
    <div 
        className={`${styling} py-1 rounded-2 px-2 hover:cursor-pointer text-center ${className}`}
        onClick={onClick}
    >
        {children}
    </div>
  )
}