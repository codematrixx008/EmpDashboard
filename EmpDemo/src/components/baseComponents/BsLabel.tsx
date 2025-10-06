import React from 'react'
import { LblCustomType } from "../types/type.ts"

const BsLabel: React.FC<LblCustomType> = ({ className, text}) => {
  return (
    <label className={className} >
          {text}
    </label>
  )
}

export default BsLabel;