import { create } from 'zustand'

type Theme = 'classic' | 'neon' | 'pastel'
type Screen = 'start' | 'game'

interface LeaderboardEntry {
  nickname: string
  score: number
  level: number
  date: string
  timestamp: number
}

interface GameState {
  score: number
  highScore: number
  level: number
  isGameOver: boolean
  isSlowMotion: boolean
  playerX: number
  currentTheme: Theme
  screen: Screen
  nickname: string
  leaderboard: LeaderboardEntry[]
  setPlayerX: (x: number) => void
  incrementScore: (amount?: number) => void
  resetScore: () => void
  setSlowMotion: (isSlow: boolean) => void
  setNickname: (nickname: string) => void
  addToLeaderboard: (entry: LeaderboardEntry) => void
  generateShareUrl: () => string
  loadFromUrl: () => void
  endGame: () => void
  restart: () => void
  setTheme: (theme: Theme) => void
  setScreen: (screen: Screen) => void
  setLevel: (level: number) => void
}

// Level sistemi için sabitler
export const LEVEL_CONFIG = {
  SCORE_PER_LEVEL: 100, // Her 100 puanda level atla
  MAX_LEVEL: 10,
  BASE_FALL_SPEED: 4,
  BASE_SPAWN_CHANCE: 0.03, // %5'ten %3'e düşürdük
  SPEED_INCREASE_PER_LEVEL: 0.5,
  SPAWN_INCREASE_PER_LEVEL: 0.015, // %2'den %1.5'e düşürdük
}

export const useGameStore = create<GameState>((set, get) => ({
  score: 0,
  highScore: Number(localStorage.getItem('highScore')) || 0,
  level: 1,
  isGameOver: false,
  isSlowMotion: false,
  playerX: 150,
  currentTheme: 'classic',
  screen: 'start',
  nickname: localStorage.getItem('nickname') || '',
  leaderboard: JSON.parse(localStorage.getItem('leaderboard') || '[]'),

  setPlayerX: (x) => set({ playerX: x }),
  incrementScore: (amount = 1) =>
    set((state) => {
      const newScore = state.score + amount
      const newLevel = Math.min(
        Math.floor(newScore / LEVEL_CONFIG.SCORE_PER_LEVEL) + 1,
        LEVEL_CONFIG.MAX_LEVEL
      )
      
      return { 
        score: newScore,
        level: newLevel
      }
    }),

  resetScore: () => set({ score: 0 }),

  setSlowMotion: (isSlow) => set({ isSlowMotion: isSlow }),

  setNickname: (nickname) => {
    localStorage.setItem('nickname', nickname)
    set({ nickname })
  },

  addToLeaderboard: (entry) =>
    set((state) => {
      // Aynı nickname, skor ve timestamp zaten varsa ekleme
      const existingEntry = state.leaderboard.find(
        item => item.nickname === entry.nickname && 
                item.score === entry.score && 
                item.timestamp === entry.timestamp
      )
      
      if (existingEntry) {
        return state // Değişiklik yapma
      }
      
      const newLeaderboard = [...state.leaderboard, entry]
        .sort((a, b) => b.score - a.score) // Yüksek skordan düşüğe sırala
        .slice(0, 5) // Sadece en yüksek 5 skoru tut
      
      localStorage.setItem('leaderboard', JSON.stringify(newLeaderboard))
      return { leaderboard: newLeaderboard }
    }),

  endGame: () => {
    const { score, highScore, nickname, level, addToLeaderboard, isGameOver } = get()
    
    // Eğer zaten game over ise tekrar çalıştırma
    if (isGameOver) return
    
    if (score > highScore) {
      localStorage.setItem('highScore', String(score))
      set({ highScore: score })
    }
    
    // Leaderboard'a ekle
    if (nickname.trim()) {
      addToLeaderboard({
        nickname: nickname.trim(),
        score,
        level,
        date: new Date().toLocaleDateString(),
        timestamp: Date.now()
      })
    }
    
    set({ isGameOver: true })
  },

  restart: () =>
    set({ score: 0, level: 1, isGameOver: false, isSlowMotion: false, playerX: 150 }),

  setTheme: (theme) => set({ currentTheme: theme }),
  setScreen: (screen) => set({ screen }),
  setLevel: (level) => set({ level }),

  generateShareUrl: () => {
    const { score, level, currentTheme, nickname } = get()
    const params = new URLSearchParams({
      score: score.toString(),
      level: level.toString(),
      theme: currentTheme,
      nickname: nickname || 'Anonymous'
    })
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`
  },

  loadFromUrl: () => {
    const urlParams = new URLSearchParams(window.location.search)
    const score = urlParams.get('score')
    const level = urlParams.get('level')
    const theme = urlParams.get('theme') as Theme
    const nickname = urlParams.get('nickname')

    if (score && level && theme && nickname) {
      set({
        score: parseInt(score),
        level: parseInt(level),
        currentTheme: theme,
        nickname: nickname,
        screen: 'game'
      })
    }
  },
}))
