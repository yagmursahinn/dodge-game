import React, { useEffect, useRef, useState } from 'react'
import Player from './Player'
import FallingObject from './FallingObject'
import { useGameStore } from '../store/gameStore'
import { useGameLoop } from '../hooks/useGameLoop'
import { themes } from '../themes/themeStyles'

export default function GameBoard() {
  const boardRef = useRef<HTMLDivElement>(null)
  const [boardWidth, setBoardWidth] = useState(300)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [levelUpText, setLevelUpText] = useState('')
  const [showBonus, setShowBonus] = useState(false)
  const [bonusText, setBonusText] = useState('')
  const [showBomb, setShowBomb] = useState(false)
  const [bombText, setBombText] = useState('')
  const [showSlow, setShowSlow] = useState(false)
  const [slowText, setSlowText] = useState('')
  const playerX = useGameStore((state) => state.playerX)
  const setPlayerX = useGameStore((state) => state.setPlayerX)
  const isGameOver = useGameStore((state) => state.isGameOver)
  const restart = useGameStore((state) => state.restart)
  const setScreen = useGameStore((state) => state.setScreen)
  const score = useGameStore((state) => state.score)
  const highScore = useGameStore((state) => state.highScore)
  const currentTheme = useGameStore((state) => state.currentTheme)
  const level = useGameStore((state) => state.level)
  const lastLevel = useRef(level)
  const lastScore = useRef(score)
  
  const { objects, level: loopLevel, isSlowMotion, slowMotionRemaining } = useGameLoop(boardWidth)
  const currentIsSlowMotion = useGameStore((state) => state.isSlowMotion)
  const nickname = useGameStore((state) => state.nickname)
  const leaderboard = useGameStore((state) => state.leaderboard)
  const generateShareUrl = useGameStore((state) => state.generateShareUrl)
  
  const backgroundClass = themes[currentTheme]?.background || 'bg-gray-900'

  const PLAYER_WIDTH = 48

  useEffect(() => {
    if (boardRef.current) {
      setBoardWidth(boardRef.current.offsetWidth)
    }
  }, [])

  // Level atlama animasyonu
  useEffect(() => {
    if (level > lastLevel.current) {
      setLevelUpText(`LEVEL ${level}!`)
      setShowLevelUp(true)
      
      // 2 saniye sonra animasyonu gizle
      setTimeout(() => {
        setShowLevelUp(false)
      }, 2000)
    }
    lastLevel.current = level
  }, [level])

  // Bonus toplama animasyonu
  useEffect(() => {
    if (score > lastScore.current + 1) { // Normal skor artışı 1, bonus 10
      const scoreDiff = score - lastScore.current
      if (scoreDiff >= 10) { // Bonus toplandı
        setBonusText(`+${scoreDiff} BONUS!`)
        setShowBonus(true)
        
        // 1.5 saniye sonra animasyonu gizle
        setTimeout(() => {
          setShowBonus(false)
        }, 1500)
      }
    }
    lastScore.current = score
  }, [score])

  // Bomb toplama animasyonu
  useEffect(() => {
    if (score === 0 && lastScore.current > 0) { // Skor sıfırlandı
      setBombText('SKOR SIFIRLANDI!')
      setShowBomb(true)
      
      // 2 saniye sonra animasyonu gizle
      setTimeout(() => {
        setShowBomb(false)
      }, 2000)
    }
  }, [score])

  // Yavaşlatıcı toplama animasyonu
  useEffect(() => {
    if (currentIsSlowMotion) {
      setSlowText('YAVAŞLATICI!')
      setShowSlow(true)
      
      // 1.5 saniye sonra animasyonu gizle
      setTimeout(() => {
        setShowSlow(false)
      }, 1500)
    }
  }, [currentIsSlowMotion])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

  // Mobil butonlar için fonksiyonlar
  const moveLeft = () => setPlayerX(Math.max(0, playerX - 20))
  const moveRight = () => setPlayerX(Math.min(boardWidth - PLAYER_WIDTH, playerX + 20))

  // Home butonu için fonksiyon
  const handleHome = () => {
    restart()
    setScreen('start')
  }

  // Paylaşım fonksiyonu
  const handleShare = async () => {
    const shareUrl = generateShareUrl()
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${nickname} - Mini Game Skoru`,
          text: `${nickname} ${score} puan ve ${level}. seviyeye ulaştı! Sen de dene!`,
          url: shareUrl
        })
      } catch (error) {
        // Kullanıcı paylaşımı iptal etti
        console.log('Paylaşım iptal edildi')
      }
    } else {
      // Fallback: URL'yi panoya kopyala
      try {
        await navigator.clipboard.writeText(shareUrl)
        alert('Skor linki panoya kopyalandı!')
      } catch (error) {
        // Fallback: URL'yi göster
        prompt('Skor linkini kopyalayın:', shareUrl)
      }
    }
  }

  // Skor kartı oluşturma fonksiyonu
  const createScoreCard = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    canvas.width = 600
    canvas.height = 400

    // Arka plan
    ctx.fillStyle = '#1f2937'
    ctx.fillRect(0, 0, 600, 400)

    // Başlık
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 48px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('🎮 Mini Game', 300, 80)

    // Oyuncu adı
    ctx.fillStyle = '#60a5fa'
    ctx.font = 'bold 32px Arial'
    ctx.fillText(nickname, 300, 140)

    // Skor
    ctx.fillStyle = '#fbbf24'
    ctx.font = 'bold 64px Arial'
    ctx.fillText(`${score}`, 300, 220)

    // Level
    ctx.fillStyle = '#ffffff'
    ctx.font = '24px Arial'
    ctx.fillText(`Level ${level}`, 300, 260)

    // Tema
    ctx.fillStyle = '#9ca3af'
    ctx.font = '20px Arial'
    ctx.fillText(`Theme: ${currentTheme}`, 300, 300)

    // Tarih
    ctx.fillStyle = '#6b7280'
    ctx.font = '16px Arial'
    ctx.fillText(new Date().toLocaleDateString(), 300, 340)

    return canvas.toDataURL()
  }

  return (
    <div
    onTouchStart={(e) => {
        const touchX = e.touches[0].clientX
        const screenMid = boardRef.current?.offsetWidth! / 2
        if (touchX < screenMid) {
          setPlayerX(Math.max(0, playerX - 20))
        } else {
          setPlayerX(Math.min(boardWidth - PLAYER_WIDTH, playerX + 20))
        }
      }}
      
      ref={boardRef}
      className={`relative w-full h-[500px] border border-gray-700 overflow-hidden mx-auto max-w-md ${backgroundClass}`}
    >
      <Player />
      {objects.map((obj) => (
  <FallingObject key={obj.id} x={obj.x} y={obj.y} type={obj.type} />
))}

<div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-white text-center text-lg font-mono">
  <div>Score: {score}</div>
  <div className="text-sm text-gray-400">High Score: {highScore}</div>
  <div className="text-sm text-yellow-400 font-bold">Level: {level}</div>
  {currentIsSlowMotion && (
    <div className="text-sm text-blue-400 font-bold animate-pulse">
      ⏰ YAVAŞLATICI AKTİF ({slowMotionRemaining}s)
    </div>
  )}
</div>

      {/* Yavaşlatıcı Geri Sayım Sayacı */}
      {currentIsSlowMotion && slowMotionRemaining > 0 && (
        <div className={`absolute top-2 right-2 px-3 py-1 rounded-lg font-bold text-lg shadow-lg animate-pulse ${
          slowMotionRemaining <= 1 
            ? 'bg-red-500 text-white' 
            : slowMotionRemaining <= 2 
            ? 'bg-yellow-500 text-black' 
            : 'bg-blue-500 text-white'
        }`}>
          ⏰ {slowMotionRemaining}s
        </div>
      )}

      {/* Level Up Animasyonu */}
      {showLevelUp && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-yellow-500 text-black px-6 py-3 rounded-lg text-2xl font-bold animate-pulse shadow-lg">
            {levelUpText}
          </div>
        </div>
      )}

      {/* Bonus Toplama Animasyonu */}
      {showBonus && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-green-500 text-white px-4 py-2 rounded-lg text-xl font-bold animate-bounce shadow-lg">
            {bonusText}
          </div>
        </div>
      )}

      {/* Bomb Toplama Animasyonu */}
      {showBomb && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-red-500 text-white px-4 py-2 rounded-lg text-xl font-bold animate-bounce shadow-lg">
            {bombText}
          </div>
        </div>
      )}

      {/* Yavaşlatıcı Toplama Animasyonu */}
      {showSlow && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-blue-500 text-white px-4 py-2 rounded-lg text-xl font-bold animate-bounce shadow-lg">
            {slowText}
          </div>
        </div>
      )}

      {isGameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center gap-4">
          <h2 className="text-white text-3xl font-bold">Game Over</h2>
          <div className="text-white text-center">
            <p className="text-lg font-medium">{nickname}</p>
            <p>Final Score: {score}</p>
            <p>Level Reached: {level}</p>
            {leaderboard.length > 0 && (
              <div className="mt-2 p-2 bg-gray-800 rounded">
                <p className="text-sm text-gray-300">En Yüksek Skor: {leaderboard[0].score}</p>
                <p className="text-xs text-gray-400">by {leaderboard[0].nickname}</p>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={restart}
              className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
            >
              Try Again
            </button>
            <button
              onClick={handleShare}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              📤 Paylaş
            </button>
            <button
              onClick={handleHome}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Home
            </button>
          </div>
        </div>
      )}

      {/* Mobil butonlar */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-between px-8 md:hidden">
        <button
          onClick={moveLeft}
          className={`w-16 h-16 text-white rounded-full text-2xl font-bold shadow-lg hover:shadow-xl active:scale-95 transition-all duration-150 border-2 flex items-center justify-center hover:scale-105 ${
            currentTheme === 'classic' 
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 border-blue-400 hover:from-blue-600 hover:to-blue-700' 
              : currentTheme === 'neon'
              ? 'bg-gradient-to-br from-cyan-400 to-blue-500 border-cyan-300 shadow-cyan-500/50 hover:from-cyan-300 hover:to-blue-400'
              : 'bg-gradient-to-br from-blue-300 to-blue-400 border-blue-200 hover:from-blue-400 hover:to-blue-500'
          }`}
          style={{
            boxShadow: currentTheme === 'neon' 
              ? '0 10px 25px rgba(34, 211, 238, 0.4)' 
              : '0 10px 25px rgba(59, 130, 246, 0.3)'
          }}
        >
          ←
        </button>
        <button
          onClick={moveRight}
          className={`w-16 h-16 text-white rounded-full text-2xl font-bold shadow-lg hover:shadow-xl active:scale-95 transition-all duration-150 border-2 flex items-center justify-center hover:scale-105 ${
            currentTheme === 'classic' 
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 border-blue-400 hover:from-blue-600 hover:to-blue-700' 
              : currentTheme === 'neon'
              ? 'bg-gradient-to-br from-cyan-400 to-blue-500 border-cyan-300 shadow-cyan-500/50 hover:from-cyan-300 hover:to-blue-400'
              : 'bg-gradient-to-br from-blue-300 to-blue-400 border-blue-200 hover:from-blue-400 hover:to-blue-500'
          }`}
          style={{
            boxShadow: currentTheme === 'neon' 
              ? '0 10px 25px rgba(34, 211, 238, 0.4)' 
              : '0 10px 25px rgba(59, 130, 246, 0.3)'
          }}
        >
          →
        </button>
      </div>
    </div>
  )
}
