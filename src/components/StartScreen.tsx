import { useGameStore } from '../store/gameStore'
import { useState } from 'react'

export default function StartScreen() {
  const setTheme = useGameStore((state) => state.setTheme)
  const setScreen = useGameStore((state) => state.setScreen)
  const setNickname = useGameStore((state) => state.setNickname)
  const currentTheme = useGameStore((state) => state.currentTheme)
  const nickname = useGameStore((state) => state.nickname)
  const leaderboard = useGameStore((state) => state.leaderboard)
  
  const [tempNickname, setTempNickname] = useState(nickname)
  const [showLeaderboard, setShowLeaderboard] = useState(false)

  const handleStartGame = () => {
    if (tempNickname.trim()) {
      setNickname(tempNickname.trim())
      setScreen('game')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800 p-4">
      <div className="w-full max-w-md p-4 flex flex-col items-center gap-4 border rounded bg-gray-900 text-white">
        <h1 className="text-4xl font-bold">🎮 Dodge Game</h1>
        
 
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Nickname:
          </label>
          <input
            type="text"
            value={tempNickname}
            onChange={(e) => setTempNickname(e.target.value)}
            placeholder="Nickname girin..."
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            maxLength={15}
          />
        </div>
        
        <div className="text-center text-sm text-gray-300 mb-2">
          <p>Her 100 puanda level atla!</p>
          <p>Level arttıkça oyun zorlaşır.</p>
          <p className="text-green-400 mt-1">★ Yeşil yıldızlı objeleri topla (+10 puan)</p>
          <p className="text-red-400 mt-1">💣 Kırmızı bombalardan kaç! (Skor sıfırlanır)</p>
          <p className="text-blue-400 mt-1">⏰ Mavi saat objelerini topla (3 saniye yavaşlatıcı)</p>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setTheme('classic')} 
            className={`px-3 py-2 text-white rounded transition-all ${
              currentTheme === 'classic' 
                ? 'bg-red-600 ring-2 ring-red-300 scale-105' 
                : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            Klasik
          </button>
          <button 
            onClick={() => setTheme('neon')} 
            className={`px-3 py-2 text-white rounded transition-all ${
              currentTheme === 'neon' 
                ? 'bg-pink-600 ring-2 ring-pink-300 scale-105 shadow-pink-500 shadow-md' 
                : 'bg-pink-500 hover:bg-pink-600'
            }`}
          >
            Neon
          </button>
          <button 
            onClick={() => setTheme('pastel')} 
            className={`px-3 py-2 text-black rounded transition-all ${
              currentTheme === 'pastel' 
                ? 'bg-rose-300 ring-2 ring-rose-200 scale-105' 
                : 'bg-rose-200 hover:bg-rose-300'
            }`}
          >
            Pastel
          </button>
        </div>

        <div className="flex gap-2 w-full">
          <button
            onClick={handleStartGame}
            disabled={!tempNickname.trim()}
            className="flex-1 px-6 py-3 bg-white text-black font-bold rounded hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Oyunu Başlat
          </button>
          <button
            onClick={() => setShowLeaderboard(!showLeaderboard)}
            className="px-4 py-3 bg-gray-700 text-white font-bold rounded hover:bg-gray-600 transition-colors"
          >
            🏆
          </button>
        </div>

   
        {showLeaderboard && (
          <div className="w-full mt-4 p-3 bg-gray-800 rounded border border-gray-600">
            <h3 className="text-lg font-bold text-center mb-3 text-yellow-400">🏆 Lider Listesi</h3>
            {leaderboard.length === 0 ? (
              <p className="text-center text-gray-400">Henüz skor yok!</p>
            ) : (
              <div className="space-y-2">
                {leaderboard.map((entry, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-700 rounded">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-400 font-bold">#{index + 1}</span>
                      <span className="font-medium">{entry.nickname}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{entry.score}</div>
                      <div className="text-xs text-gray-400">Level {entry.level}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

