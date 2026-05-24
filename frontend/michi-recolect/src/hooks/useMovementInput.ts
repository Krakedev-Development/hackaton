import { useCallback, useEffect, useRef } from 'react'

export interface MovementInput {
  left: boolean
  right: boolean
}

export function useMovementInput(active: boolean) {
  const inputRef = useRef<MovementInput>({ left: false, right: false })

  const setLeft = useCallback((pressed: boolean) => {
    inputRef.current.left = pressed
  }, [])

  const setRight = useCallback((pressed: boolean) => {
    inputRef.current.right = pressed
  }, [])

  useEffect(() => {
    if (!active) {
      inputRef.current = { left: false, right: false }
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return
      if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') {
        inputRef.current.left = true
        event.preventDefault()
      }
      if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') {
        inputRef.current.right = true
        event.preventDefault()
      }
    }

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') {
        inputRef.current.left = false
      }
      if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') {
        inputRef.current.right = false
      }
    }

    const onBlur = () => {
      inputRef.current = { left: false, right: false }
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
      inputRef.current = { left: false, right: false }
    }
  }, [active])

  return { inputRef, setLeft, setRight }
}
