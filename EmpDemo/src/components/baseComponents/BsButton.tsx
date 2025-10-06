import React from 'react'
import { BtnCustomType } from "../types/type.ts"


const BsButton: React.FC<BtnCustomType> = ({className, text, action, disabled }) => {
  return (
    <button className={className} onClick={action} disabled={disabled} >
        {text}
    </button>
  )
}

export default BsButton;