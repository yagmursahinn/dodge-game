import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '../store/gameStore'

type FallingObject = {
  id: number
  x: number
  y: number
}

const PLAYER_SIZE = 48
const OBJECT_SIZE = 30
const GAME_HEIGHT = 500

export function useGameLoop() {
  const [objects, setObjects] = useState<FallingObject[]>([])
  const nextId = useRef(0)
  const animationRef = useRef<number | undefined>(undefined)
  const { playerX, incrementScore, endGame, isGameOver } = useGameStore()

  const spawnObject = () => {
    setObjects((prev) => [
      ...prev,
      {
        id: nextId.current++,
        x: Math.random() * (300 - OBJECT_SIZE),
        y: 0,
      },
    ])
  }

  const checkCollision = (obj: FallingObject) => {
    const objBottom = obj.y + OBJECT_SIZE
    const objRight = obj.x + OBJECT_SIZE
    const playerBottom = GAME_HEIGHT - 2
    const playerRight = playerX + PLAYER_SIZE

    const horizontalOverlap = obj.x < playerRight && objRight > playerX
    const verticalOverlap = objBottom >= playerBottom - PLAYER_SIZE

    return horizontalOverlap && verticalOverlap
  }

  useEffect(() => {
    const loop = () => {
      setObjects((prev) => {
        const updated = prev
          .map((obj) => ({ ...obj, y: obj.y + 4 }))
          .filter((obj) => obj.y < GAME_HEIGHT)

        for (let obj of updated) {
          if (checkCollision(obj)) {
            endGame()
            return []
          }
        }

        return updated
      })

      if (Math.random() < 0.05) {
        spawnObject()
      }

      incrementScore()

      animationRef.current = requestAnimationFrame(loop)
    }

    if (!isGameOver) {
      animationRef.current = requestAnimationFrame(loop)
    }

    return () => cancelAnimationFrame(animationRef.current!)
  }, [isGameOver, playerX])

  return { objects }
}
