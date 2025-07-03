
import Player from './Player'
import FallingObject from './FallingObject'
import { useGameStore } from '../store/gameStore'
import { useGameLoop } from '../hooks/useGameLoop'

import React, { useEffect, useRef, useState } from 'react'


export default function GameBoard() {
  const boardRef = useRef<HTMLDivElement>(null)
  const [boardWidth, setBoardWidth] = useState(300)
  const playerX = useGameStore((state) => state.playerX)
  const setPlayerX = useGameStore((state) => state.setPlayerX)
  const isGameOver = useGameStore((state) => state.isGameOver)
  const restart = useGameStore((state) => state.restart)
  const score = useGameStore((state) => state.score)
  const { objects } = useGameLoop()

  useEffect(() => {
    if (boardRef.current) {
      setBoardWidth(boardRef.current.offsetWidth)
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const PLAYER_WIDTH = 48
      if (isGameOver) return

      if (e.key === 'ArrowLeft') {
        setPlayerX(Math.max(0, playerX - 20))
      }

      if (e.key === 'ArrowRight') {
        setPlayerX(Math.min(boardWidth - PLAYER_WIDTH, playerX + 20))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [playerX, boardWidth, isGameOver])

  return (
    <div
      ref={boardRef}
      className="relative w-full h-[500px] bg-gray-900 border border-gray-700 overflow-hidden mx-auto max-w-md"
    >
      <Player />
      {objects.map((obj) => (
        <FallingObject key={obj.id} x={obj.x} y={obj.y} />
      ))}
      <div className="absolute top-2 left-2 text-white text-lg font-mono">
        Score: {score}
      </div>
      {isGameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center gap-4">
          <h2 className="text-white text-3xl font-bold">Game Over</h2>
          <button
            onClick={restart}
            className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  )
}
