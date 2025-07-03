import React from 'react'
import { useGameStore } from '../store/gameStore'

export default function Player() {
  const playerX = useGameStore((state) => state.playerX)

  return (
    <div
      className="absolute bottom-2 w-12 h-12 bg-blue-500 rounded"
      style={{ left: playerX }}
    />
  )
}
