import React from 'react'
import { useGameStore } from '../store/gameStore'
import { themes } from '../themes/themeStyles'

export default function Player() {
  const playerX = useGameStore((state) => state.playerX)
  const currentTheme = useGameStore((state) => state.currentTheme)
  
  const playerColor = themes[currentTheme]?.player || 'bg-blue-500'

  return (
    <div
      className={`absolute bottom-2 w-12 h-12 rounded ${playerColor}`}
      style={{ left: playerX }}
    />
  )
}
