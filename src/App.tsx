import { useGameStore } from './store/gameStore'
import StartScreen from './components/StartScreen'
import GameScreen from './components/GameScreen'
import { useEffect } from 'react'

export default function App() {
  const screen = useGameStore((state) => state.screen)
  const loadFromUrl = useGameStore((state) => state.loadFromUrl)

  useEffect(() => {
    // URL'den parametreleri yükle
    loadFromUrl()
  }, [loadFromUrl])

  return screen === 'start' ? <StartScreen /> : <GameScreen />
}
