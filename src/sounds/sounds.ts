import { Howl } from 'howler'

export const sounds = {
  score: new Howl({ src: ['/sounds/score.mp3'] }),
  gameOver: new Howl({ src: ['/sounds/gameover.mp3'] }),
  bonus: new Howl({ src: ['/sounds/bonus.mp3'] }),
  levelUp: new Howl({ src: ['/sounds/score.mp3'] }),
}
