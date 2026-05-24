import './TouchControls.css'

interface TouchControlsProps {
  onLeft: (pressed: boolean) => void
  onRight: (pressed: boolean) => void
  visible: boolean
}

function bindPress(handler: (pressed: boolean) => void) {
  return {
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault()
      e.currentTarget.setPointerCapture(e.pointerId)
      handler(true)
    },
    onPointerUp: () => handler(false),
    onPointerCancel: () => handler(false),
    onPointerLeave: () => handler(false),
  }
}

export default function TouchControls({
  onLeft,
  onRight,
  visible,
}: TouchControlsProps) {
  if (!visible) return null

  return (
    <div className="touch-controls" aria-label="Controles tactiles">
      <button
        type="button"
        className="touch-controls__btn touch-controls__btn--left"
        aria-label="Mover a la izquierda"
        {...bindPress(onLeft)}
      >
        ◀
      </button>
      <button
        type="button"
        className="touch-controls__btn touch-controls__btn--right"
        aria-label="Mover a la derecha"
        {...bindPress(onRight)}
      >
        ▶
      </button>
    </div>
  )
}
