import { SIDE_DECOR_LEFT, SIDE_DECOR_RIGHT } from '../constants/assets'
import './GameLayout.css'

interface GameLayoutProps {
  children: React.ReactNode
}

export default function GameLayout({ children }: GameLayoutProps) {
  return (
    <div className="game-layout">
      <img
        className="game-layout__side game-layout__side--left"
        src={SIDE_DECOR_LEFT}
        alt=""
        aria-hidden
      />
      <div className="game-layout__center">{children}</div>
      <img
        className="game-layout__side game-layout__side--right"
        src={SIDE_DECOR_RIGHT}
        alt=""
        aria-hidden
      />
    </div>
  )
}

