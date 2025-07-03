import { create } from 'zustand'

interface GameState {
  score: number
  isGameOver: boolean
  playerX: number
  setPlayerX: (x: number) => void
  incrementScore: () => void
  endGame: () => void
  restart: () => void
}

export const useGameStore = create<GameState>((set) => ({
  score: 0,
  isGameOver: false,
  playerX: 150,
  setPlayerX: (x) => set({ playerX: x }),
  incrementScore: () => set((state) => ({ score: state.score + 1 })),
  endGame: () => set({ isGameOver: true }),
  restart: () => set({ score: 0, isGameOver: false, playerX: 150 }),
}))
