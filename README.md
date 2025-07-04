# 🎮 Dodge Game

Modern web teknolojileri ile geliştirilmiş, eğlenceli ve rekabetçi bir dodge oyunu. React, TypeScript ve Tailwind CSS kullanılarak oluşturulmuştur.

## ✨ Özellikler

### 🎯 Temel Oyun Mekaniği
- **Karakter Kontrolü**: Sol/sağ ok tuşları veya mobil dokunmatik butonlarla karakter kontrolü
- **Düşen Objeler**: Farklı türlerde objelerden kaçma
- **Skor Sistemi**: Sürekli artan skor ve level sistemi
- **Çarpışma Algılama**: Hassas çarpışma kontrolü

### 🎨 Tema Sistemi
- **Classic**: Geleneksel kırmızı/yeşil renk paleti
- **Neon**: Parlak neon renkler ve gölge efektleri
- **Pastel**: Yumuşak pastel renkler ve açık arka plan

### 🏆 Özel Objeler
- **⭐ Bonus Objeler**: Yeşil yıldızlı objeler (+10 puan)
- **💣 Bomb Objeler**: Kırmızı bombalar (skor sıfırlar)
- **⏰ Yavaşlatıcı Objeler**: Mavi saat objeleri (3 saniye yavaşlatıcı)

### 📊 Level Sistemi
- **Otomatik Level Atlama**: Her 100 puanda level atlama
- **Zorluk Artışı**: Level arttıkça hız ve obje sayısı artar
- **Görsel Geri Bildirim**: Level atlama animasyonları

### 🏅 Leaderboard Sistemi
- **En Yüksek 5 Skor**: localStorage'da saklanan skor tablosu
- **Nickname Sistemi**: Kişiselleştirilmiş oyuncu adları
- **Detaylı Bilgiler**: Skor, level ve tarih bilgileri

### 📱 Mobil Uyumluluk
- **Responsive Tasarım**: Tüm cihazlarda mükemmel görünüm
- **Dokunmatik Kontroller**: Özel mobil butonlar
- **Touch Events**: Ekran dokunma ile kontrol

### 🔗 Skor Paylaşımı
- **URL Slug Sistemi**: `?score=87&theme=neon&level=3&nickname=Player`
- **Sosyal Medya Paylaşımı**: Native share API desteği
- **Görsel Skor Kartları**: Canvas ile oluşturulan paylaşım kartları

## 🚀 Kurulum

### Gereksinimler
- Node.js (v14 veya üzeri)
- npm veya yarn

### Adımlar
```bash
# Projeyi klonlayın
git clone https://github.com/yourusername/dodge-game.git
cd dodge-game

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm start

# Tarayıcıda açın
# http://localhost:3000
```

## 🎮 Oyun Kontrolleri

### Desktop
- **Sol Ok**: Sola hareket
- **Sağ Ok**: Sağa hareket

### Mobil
- **Sol Buton**: Sola hareket
- **Sağ Buton**: Sağa hareket
- **Ekran Dokunma**: Sol/sağ yarıya dokunarak hareket

## 🏆 Skor Sistemi

### Puan Kazanma
- **Normal Oyun**: Her 500ms'de 1 puan
- **Bonus Objeler**: +10 puan
- **Level Atlama**: Her 100 puanda otomatik

### Level Sistemi
- **Level 1**: Temel zorluk
- **Her Level**: Hız ve obje sayısı artar
- **Maksimum Level**: 10

## 🎨 Tema Detayları

### Classic Theme
- **Normal Objeler**: Kırmızı
- **Bonus Objeler**: Yeşil
- **Bomb Objeler**: Siyah
- **Yavaşlatıcı**: Mavi
- **Player**: Mavi

### Neon Theme
- **Normal Objeler**: Pembe (gölgeli)
- **Bonus Objeler**: Sarı (gölgeli)
- **Bomb Objeler**: Kırmızı (gölgeli)
- **Yavaşlatıcı**: Mavi (gölgeli)
- **Player**: Cyan (gölgeli)

### Pastel Theme
- **Normal Objeler**: Açık pembe
- **Bonus Objeler**: Açık yeşil
- **Bomb Objeler**: Gri
- **Yavaşlatıcı**: Açık mavi
- **Player**: Açık mavi

## 📱 Mobil Özellikler

### Responsive Tasarım
- **Breakpoint**: md (768px) altında mobil butonlar
- **Touch Events**: Dokunmatik ekran desteği
- **Viewport**: Mobil cihazlara optimize edilmiş

### Mobil Butonlar
- **Boyut**: 16x16 (64px)
- **Konum**: Ekranın alt kısmında
- **Animasyon**: Hover ve active efektleri
- **Tema Uyumu**: Seçilen temaya göre renk değişimi

## 🔧 Teknik Detaylar

### Kullanılan Teknolojiler
- **React 18**: Modern React hooks ve functional components
- **TypeScript**: Tip güvenliği ve geliştirici deneyimi
- **Tailwind CSS**: Utility-first CSS framework
- **Zustand**: Hafif state management
- **Canvas API**: Görsel skor kartları için

### Proje Yapısı
```
src/
├── components/          # React bileşenleri
│   ├── GameBoard.tsx   # Ana oyun alanı
│   ├── Player.tsx      # Oyuncu karakteri
│   ├── FallingObject.tsx # Düşen objeler
│   ├── StartScreen.tsx # Başlangıç ekranı
│   └── GameScreen.tsx  # Oyun ekranı
├── hooks/              # Custom React hooks
│   └── useGameLoop.ts  # Oyun döngüsü
├── store/              # State management
│   └── gameStore.ts    # Zustand store
├── themes/             # Tema sistemi
│   └── themeStyles.ts  # Tema renkleri
└── sounds/             # Ses efektleri
    └── sounds.ts       # Ses yönetimi
```

### State Management
- **Zustand**: Hafif ve performanslı state management
- **localStorage**: Skor ve ayarların kalıcı saklanması
- **URL Parameters**: Skor paylaşımı için

## 🎵 Ses Efektleri

### Mevcut Sesler
- **score.mp3**: Normal skor artışı
- **bonus.mp3**: Bonus obje toplama
- **gameOver.mp3**: Oyun bitişi

### Ses Kullanımı
- **Bonus Objeler**: Bonus sesi
- **Bomb Objeler**: Game over sesi
- **Yavaşlatıcı**: Bonus sesi
- **Level Atlama**: Score sesi

## 📊 Performans Optimizasyonları

### Oyun Döngüsü
- **requestAnimationFrame**: Smooth animasyonlar
- **Object Pooling**: Obje yeniden kullanımı
- **Efficient Collision Detection**: Optimize edilmiş çarpışma kontrolü

### Memory Management
- **Cleanup Functions**: useEffect cleanup
- **Event Listener Management**: Proper event listener removal
- **State Optimization**: Minimal state updates

## 🔗 Skor Paylaşımı

### URL Formatı
```
https://yourdomain.com/?score=150&level=2&theme=neon&nickname=PlayerName
```

### Paylaşım Özellikleri
- **Native Share API**: Mobil cihazlarda native paylaşım
- **Clipboard Fallback**: Desktop'ta panoya kopyalama
- **Visual Score Cards**: Canvas ile oluşturulan görsel kartlar

## 🐛 Bilinen Sorunlar

### Çözülmüş Sorunlar
- ✅ Çift skor kaydı sorunu
- ✅ Yavaşlatıcı inaktif olmama sorunu
- ✅ Mobil buton görünüm sorunları

### Mevcut Durum
- 🟢 Tüm özellikler çalışır durumda
- 🟢 Mobil uyumluluk tam
- 🟢 Performans optimize edilmiş

## 🤝 Katkıda Bulunma

### Geliştirme
1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

### Önerilen Geliştirmeler
- [ ] Yeni tema seçenekleri
- [ ] Ses ayarları
- [ ] Daha fazla özel obje türü
- [ ] Çoklu oyuncu modu
- [ ] Başarım sistemi

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 👨‍💻 Geliştirici

**Yagmur Sahin**
- GitHub: [@yagmursahin](https://github.com/yagmursahin)
- Email: your.email@example.com

## 🙏 Teşekkürler

- React ekibi
- Tailwind CSS ekibi
- Zustand geliştiricileri
- Tüm katkıda bulunanlara

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
