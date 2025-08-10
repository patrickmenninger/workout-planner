import React from 'react'

const Card = ({children, bg = 'bg-side', className = ""}) => {
  return (
    <div className={`${bg} rounded-lg shadow-md p-3 my-3 ${className}`}>
        {children}
    </div>
  )
}

export default Card