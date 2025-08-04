import React from 'react'

const Card = ({children, bg = 'bg-gray-100', className}) => {
  return (
    <div className={`${bg} rounded-lg shadow-md p-5 ${className}`}>
        {children}
    </div>
  )
}

export default Card