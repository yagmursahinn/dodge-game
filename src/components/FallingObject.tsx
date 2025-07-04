import { useGameStore } from '../store/gameStore'
import { themes } from '../themes/themeStyles'

type Props = {
  x: number
  y: number
  size?: number
  type?: 'normal' | 'bonus' | 'bomb' | 'slow'
}

export default function FallingObject({ x, y, size = 30, type = 'normal' }: Props) {
  const currentTheme = useGameStore((state) => state.currentTheme)
  const color = themes[currentTheme]?.[type || 'normal'] || 'bg-white'

  // Bonus objeler için özel stiller
  const isBonus = type === 'bonus'
  const isBomb = type === 'bomb'
  const isSlow = type === 'slow'
  
  const bonusClasses = isBonus 
    ? 'animate-pulse shadow-lg border-2 border-white' 
    : ''
    
  const bombClasses = isBomb
    ? 'animate-pulse shadow-lg border-2 border-red-500'
    : ''
    
  const slowClasses = isSlow
    ? 'animate-pulse shadow-lg border-2 border-blue-300'
    : ''

  return (
    <div
      className={`absolute rounded ${color} ${bonusClasses} ${bombClasses} ${slowClasses}`}
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        transform: isBonus ? 'scale(1.1)' : isBomb ? 'scale(1.2)' : isSlow ? 'scale(1.15)' : 'scale(1)',
      }}
    >
      {/* Bonus objeler için içeride yıldız efekti */}
      {isBonus && (
        <div className="absolute inset-0 flex items-center justify-center text-white text-lg font-bold">
          ★
        </div>
      )}
      
      {/* Bomb objeler için içeride bomba efekti */}
      {isBomb && (
        <div className="absolute inset-0 flex items-center justify-center text-white text-lg font-bold">
          💣
        </div>
      )}
      
      {/* Yavaşlatıcı objeler için içeride saat efekti */}
      {isSlow && (
        <div className="absolute inset-0 flex items-center justify-center text-white text-lg font-bold">
          ⏰
        </div>
      )}
    </div>
  )
}
