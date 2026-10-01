import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { LogoMark } from '../Logo.jsx'
import { LockOutline } from '../Icons.jsx'
import { SUBJECTS } from '../../subjects.js'
import SubjectTab from './SubjectTab.jsx'
import MenuButton from './MenuButton.jsx'

// Fixed bar on every screen: logo home link, the four subject tabs (hidden under 720px) and a
// menu button that opens a full-screen menu with the same four subjects. The menu is a modal
// dialog rendered in a portal on document.body, so it is a sibling of the bar and of #root, never
// a child of the 64px bar. While it is open the page behind is inert and does not scroll.
// `active` is a subject key, or '' on screens that belong to no subject (home, teacher).
export default function TopBar({ active, onHome, onSubject }) {
  const [open, setOpen] = useState(false)
  const barButtonRef = useRef(null)
  const dialogRef = useRef(null)
  const wasOpen = useRef(false)

  // Tab and Shift+Tab cycle through the close button and the four items.
  function trapList() {
    return dialogRef.current
      ? [...dialogRef.current.querySelectorAll('button:not([disabled])')]
      : []
  }

  // Page behind: inert (no focus, no clicks, hidden from screen readers) and not scrollable.
  useEffect(() => {
    if (!open) return
    const root = document.getElementById('root')
    root?.setAttribute('inert', '')
    const prevHtml = document.documentElement.style.overflow
    const prevBody = document.body.style.overflow
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    return () => {
      root?.removeAttribute('inert')
      document.documentElement.style.overflow = prevHtml
      document.body.style.overflow = prevBody
    }
  }, [open])

  // Focus moves into the menu on open and back to the menu button on close. Runs after the
  // cleanup above, so the bar is no longer inert when the button is focused.
  useEffect(() => {
    if (open) {
      trapList()[1]?.focus()
    } else if (wasOpen.current) {
      barButtonRef.current?.focus()
    }
    wasOpen.current = open
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKey(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
        return
      }
      if (event.key !== 'Tab') return
      const list = trapList()
      if (!list.length) return
      const i = list.indexOf(document.activeElement)
      if (event.shiftKey && i <= 0) {
        event.preventDefault()
        list[list.length - 1].focus()
      } else if (!event.shiftKey && (i === -1 || i === list.length - 1)) {
        event.preventDefault()
        list[0].focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  function goHome(event) {
    event.preventDefault()
    onHome()
  }

  function pickItem(key) {
    setOpen(false)
    onSubject(key)
  }

  return (
    <>
      <div className="top-bar">
        <header className="top-bar-row">
          <a href="/" className="top-bar-home" aria-label="Trika English, trang chủ" onClick={goHome}>
            <LogoMark size={40} reversed />
            <span className="top-bar-wordmark">
              <span className="top-bar-trika">Trika</span>
              <span className="top-bar-english">ENGLISH</span>
            </span>
          </a>
          <nav aria-label="Môn học" className="top-bar-tabs">
            {SUBJECTS.map((s) => (
              <SubjectTab
                key={s.key}
                label={s.label}
                locked={s.locked}
                active={s.key === active}
                onClick={() => onSubject(s.key)}
              />
            ))}
          </nav>
          <div className="top-bar-menu">
            <MenuButton ref={barButtonRef} open={open} onClick={() => setOpen((v) => !v)} />
          </div>
        </header>
      </div>
      {open &&
        createPortal(
          <div
            ref={dialogRef}
            className="menu-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="menu-overlay-row">
              <span className="menu-overlay-brand" aria-hidden="true">
                <LogoMark size={40} reversed />
                <span className="top-bar-wordmark">
                  <span className="top-bar-trika">Trika</span>
                  <span className="top-bar-english">ENGLISH</span>
                </span>
              </span>
              <MenuButton open onClick={() => setOpen(false)} />
            </div>
            <nav aria-label="Menu môn học" className="menu-overlay-list">
              {SUBJECTS.map((s) => {
                const on = s.key === active
                const state = on ? ' active' : s.locked ? ' locked' : ''
                return (
                  <button
                    type="button"
                    key={s.key}
                    className={`menu-item${state}`}
                    aria-current={on ? 'page' : undefined}
                    onClick={() => pickItem(s.key)}
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
          </div>,
          document.body,
        )}
    </>
  )
}
