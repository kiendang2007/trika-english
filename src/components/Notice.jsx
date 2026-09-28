import { useEffect, useRef } from 'react'

// The message shown when a learner taps something that is not open yet.
// A centered modal dialog, so it never moves the page or the scroll position.
export default function Notice({ notice, onDismiss }) {
  const dialogRef = useRef(null)
  const previouslyFocused = useRef(null)
  const scrollPos = useRef(0)

  useEffect(() => {
    if (!notice) return undefined

    previouslyFocused.current = document.activeElement

    scrollPos.current = window.scrollY
    const body = document.body
    const prevPosition = body.style.position
    const prevTop = body.style.top
    const prevLeft = body.style.left
    const prevRight = body.style.right
    const prevWidth = body.style.width
    body.style.position = 'fixed'
    body.style.top = `-${scrollPos.current}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'

    if (dialogRef.current) {
      dialogRef.current.focus()
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onDismiss()
      }
    }
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      body.style.position = prevPosition
      body.style.top = prevTop
      body.style.left = prevLeft
      body.style.right = prevRight
      body.style.width = prevWidth
      window.scrollTo(0, scrollPos.current)

      const toRefocus = previouslyFocused.current
      if (toRefocus && typeof toRefocus.focus === 'function') {
        toRefocus.focus()
      }
    }
  }, [notice, onDismiss])

  if (!notice) return null

  return (
    <div className="modal-overlay" onClick={onDismiss}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notice-text"
        tabIndex={-1}
        ref={dialogRef}
        onClick={(event) => event.stopPropagation()}
      >
        <p id="notice-text">{notice.text}</p>
        <button type="button" className="btn-secondary btn-small" onClick={onDismiss}>
          Đóng
        </button>
      </div>
    </div>
  )
}
