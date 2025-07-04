import { useEffect, useRef, useState } from 'react'
import { useGameStore, LEVEL_CONFIG } from '../store/gameStore'
import { sounds } from '../sounds/sounds'


type FallingObject = {
  id: number
  x: number
  y: number
  type: 'normal' | 'bonus' | 'bomb' | 'slow'
}

const PLAYER_SIZE = 48
const OBJECT_SIZE = 30
const GAME_HEIGHT = 500

export function useGameLoop(boardWidth: number) {
  const [objects, setObjects] = useState<FallingObject[]>([])
  const [slowMotionEndTime, setSlowMotionEndTime] = useState(0)
  const [slowMotionRemaining, setSlowMotionRemaining] = useState(0)
  const nextId = useRef(0)
  const animationRef = useRef<number | undefined>(undefined)
  const lastScoreTime = useRef(0)
  const { playerX, incrementScore, resetScore, setSlowMotion, endGame, isGameOver, level, isSlowMotion: currentIsSlowMotion } = useGameStore()
  const lastLevel = useRef(level)

  // Level'a göre zorluk hesaplama
  const getLevelDifficulty = () => {
    const fallSpeed = LEVEL_CONFIG.BASE_FALL_SPEED + (level - 1) * LEVEL_CONFIG.SPEED_INCREASE_PER_LEVEL
    const spawnChance = LEVEL_CONFIG.BASE_SPAWN_CHANCE + (level - 1) * LEVEL_CONFIG.SPAWN_INCREASE_PER_LEVEL
    return { fallSpeed, spawnChance }
  }

  const { fallSpeed, spawnChance } = getLevelDifficulty()
  
  // Yavaşlatıcı durumunu kontrol et
  useEffect(() => {
    const checkSlowMotion = () => {
      if (currentIsSlowMotion && Date.now() > slowMotionEndTime) {
        console.log('Yavaşlatıcı deaktif! Şu anki zaman:', new Date().toLocaleTimeString())
        setSlowMotion(false)
        setSlowMotionEndTime(0)
        setSlowMotionRemaining(0)
      }
    }

    // Her 100ms'de bir kontrol et
    const interval = setInterval(checkSlowMotion, 100)
    
    return () => clearInterval(interval)
  }, [currentIsSlowMotion, slowMotionEndTime, setSlowMotion, setSlowMotionEndTime, setSlowMotionRemaining])
  
  // Geri sayım sayacını güncelle
  useEffect(() => {
    const updateCountdown = () => {
      if (currentIsSlowMotion && slowMotionEndTime > 0) {
        const remaining = Math.max(0, Math.ceil((slowMotionEndTime - Date.now()) / 1000))
        setSlowMotionRemaining(remaining)
      }
    }

    // Her 100ms'de bir güncelle
    const interval = setInterval(updateCountdown, 100)
    
    return () => clearInterval(interval)
  }, [currentIsSlowMotion, slowMotionEndTime, setSlowMotionRemaining])
  
  // Slow motion durumunda fall speed'i yavaşlat
  const effectiveFallSpeed = currentIsSlowMotion ? fallSpeed * 0.3 : fallSpeed

  const spawnObject = () => {
    // Level'a göre bonus oranı - yüksek level'larda daha az bonus
    const baseBonusChance = 0.10 // %15'ten %10'a düşürdük
    const levelPenalty = (level - 1) * 0.008 // Her level'da %0.8 azalır (daha yumuşak)
    const bonusChance = Math.max(baseBonusChance - levelPenalty, 0.03) // Minimum %3
    
    // Bomb oranı - çok nadir
    const bombChance = 0.02 // %3'ten %2'ye düşürdük
    
    // Yavaşlatıcı oranı - nadir
    const slowChance = 0.03 // %5'ten %3'e düşürdük
    
    const random = Math.random()
    let objectType: 'normal' | 'bonus' | 'bomb' | 'slow' = 'normal'
    
    if (random < bombChance) {
      objectType = 'bomb'
    } else if (random < bombChance + bonusChance) {
      objectType = 'bonus'
    } else if (random < bombChance + bonusChance + slowChance) {
      objectType = 'slow'
    }
    
    const maxX = boardWidth - OBJECT_SIZE
  
    // Dağılımı daha doğal yapmak için biraz karıştır
    const randomOffset = Math.random() ** 1.2 // biraz merkeze kaydırır
    const x = randomOffset * maxX
  
    setObjects((prev) => [
      ...prev,
      {
        id: nextId.current++,
        x,
        y: 0,
        type: objectType,
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
  
  // Level atlama kontrolü
  useEffect(() => {
    if (level > lastLevel.current) {
      // Level atladık! Efekt ekleyebiliriz
      console.log(`Level ${level} atladın!`)
      sounds.levelUp.play() // Level atlama sesi
    }
    lastLevel.current = level
  }, [level])

  // Game over durumunda yavaşlatıcıyı sıfırla
  useEffect(() => {
    if (isGameOver) {
      setSlowMotion(false)
      setSlowMotionEndTime(0)
    }
  }, [isGameOver])

  useEffect(() => {
    const loop = () => {
      const now = Date.now()
      
      setObjects((prev) => {
        const updated = prev
          .map((obj) => ({ ...obj, y: obj.y + effectiveFallSpeed }))
          .filter((obj) => obj.y < GAME_HEIGHT)
      
        const remainingObjects: FallingObject[] = []
      
        for (let obj of updated) {
          if (checkCollision(obj)) {
            if (obj.type === 'bonus') {
              incrementScore(10) // Bonus objeler 10 puan verir
              sounds.bonus.play()
              // Bonus objeyi oyundan silmek için devam et
              continue
            } else if (obj.type === 'bomb') {
              // Bombaya çarpınca skor sıfırla ama oyun devam etsin
              resetScore()
              sounds.gameOver.play() // Bomb sesi için gameOver sesini kullan
              // Bomb objeyi oyundan silmek için devam et
              continue
            } else if (obj.type === 'slow') {
              // Yavaşlatıcıya çarpınca 3 saniye slow motion
              const endTime = Date.now() + 3000 // 3 saniye
              setSlowMotion(true)
              setSlowMotionEndTime(endTime)
              setSlowMotionRemaining(3) // Başlangıç değeri
              console.log('Yavaşlatıcı aktif! Bitiş zamanı:', new Date(endTime).toLocaleTimeString())
              sounds.bonus.play() // Yavaşlatıcı sesi için bonus sesini kullan
              
              // 3 saniye sonra otomatik olarak deaktif et
              setTimeout(() => {
                console.log('Yavaşlatıcı timeout ile deaktif!')
                setSlowMotion(false)
                setSlowMotionEndTime(0)
                setSlowMotionRemaining(0)
              }, 3000)
              
              // Yavaşlatıcı objeyi oyundan silmek için devam et
              continue
            } else {
              sounds.gameOver.play()
              endGame()
              return []
            }
          }
      
          // Çarpmayan objeleri listeye ekle
          remainingObjects.push(obj)
        }
      
        return remainingObjects
      })
      
      if (Math.random() < spawnChance) {
        spawnObject()
      }

      // Skor artışını yavaşlat - her 500ms'de 1 puan
      if (now - lastScoreTime.current > 500) {
        incrementScore(1)
        lastScoreTime.current = now
      }

      animationRef.current = requestAnimationFrame(loop)
    }

    if (!isGameOver) {
      animationRef.current = requestAnimationFrame(loop)
    }

    return () => cancelAnimationFrame(animationRef.current!)
  }, [isGameOver, playerX, effectiveFallSpeed, spawnChance, level, checkCollision, endGame, incrementScore, resetScore, setSlowMotion, spawnObject])

  return { objects, level, isSlowMotion: currentIsSlowMotion, slowMotionRemaining }
}
