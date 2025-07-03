import React from 'react'

type Props = {
  x: number
  y: number
  size?: number
}

export default function FallingObject({ x, y, size = 30 }: Props) {
  return (
    <div
      className="absolute bg-red-500 rounded"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
      }}
    />
  )
}
