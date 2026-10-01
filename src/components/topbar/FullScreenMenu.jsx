import { useEffect, useRef } from 'react'
import { LockOutline } from '../Icons.jsx'
import { SUBJECTS } from '../../subjects.js'

const FOCUSABLE = 'button:not([disabled]), a[href]'

// Covers the whole viewport. Closes with the Đóng button and Escape, keeps Tab inside itself
// while open, and hands focus back to the menu button on close.
export default function FullScreenMenu({ id, active, onClose, onPick, returnFocusRef }) {
  const rootRef = useRef(null)
  const closeRef = useRef(null)

  useEffect(() => {
    const returnTo = returnFocusRef.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = previousOverflow
      returnTo?.focus()
    }
  }, [returnFocusRef])

  function onKeyDown(event) {
    if (event.key === 'Escape') {
      event.stopPropagation()
      onClose()
      return
    }
    if (event.key !== 'Tab') return
    const items = rootRef.current ? Array.from(rootRef.current.querySelectorAll(FOCUSABLE)) : []
    if (items.length === 0) return
    const first = items[0]
    const last = items[items.length - 1]
    const here = document.activeElement
    if (event.shiftKey && (here === first || !rootRef.current.contains(here))) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && (here === last || !rootRef.current.contains(here))) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    <div
      ref={rootRef}
      id={id}
      className="full-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      onKeyDown={onKeyDown}
    >
      <div className="full-menu-bar">
        <button ref={closeRef} type="button" className="full-menu-close" onClick={onClose}>
          Đóng
        </button>
      </div>
      <nav aria-label="Môn học" className="full-menu-list">
        {SUBJECTS.map((s) => {
          const on = s.key === active
          const state = on ? ' active' : s.locked ? ' locked' : ''
          return (
            <button
              type="button"
              key={s.key}
              className={`menu-item${state}`}
              aria-current={on ? 'page' : undefined}
              onClick={() => onPick(s.key)}
            >
              <span className="menu-item-label">{s.label}</span>
              {s.locked && (
                <span className="menu-item-locked">
                  <LockOutline size={16} />
                  Chưa có
                </span>
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
