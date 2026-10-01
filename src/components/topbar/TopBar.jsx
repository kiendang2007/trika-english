import { useEffect, useRef, useState } from 'react'
import { LogoMark } from '../Logo.jsx'
import { LockOutline } from '../Icons.jsx'
import { SUBJECTS } from '../../subjects.js'
import SubjectTab from './SubjectTab.jsx'
import MenuButton from './MenuButton.jsx'

// Fixed bar on every screen: logo home link, the four subject tabs (hidden under 720px) and a
// menu button that drops the same four subjects down under the bar, aligned to the right.
// `active` is a subject key, or '' on screens that belong to no subject (home, teacher).
export default function TopBar({ active, onHome, onSubject }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const panelRef = useRef(null)

  function menuButton() {
    return rootRef.current?.querySelector('.top-bar-menu button')
  }

  // While the menu is open, Tab and Shift+Tab cycle through the menu button and the four items.
  function trapList() {
    const items = panelRef.current ? [...panelRef.current.querySelectorAll('.menu-item')] : []
    return [menuButton(), ...items].filter(Boolean)
  }

  function close(refocus) {
    setOpen(false)
    if (refocus) menuButton()?.focus()
  }

  useEffect(() => {
    if (!open) return
    const frame = requestAnimationFrame(() => trapList()[1]?.focus())
    function onKey(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        close(true)
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
    function onDown(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) close(false)
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDown)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onDown)
    }
  }, [open])

  function goHome(event) {
    event.preventDefault()
    setOpen(false)
    onHome()
  }

  function pickTab(key) {
    setOpen(false)
    onSubject(key)
  }

  // Choosing an item in the menu closes it and puts focus back on the menu button.
  function pickItem(key) {
    close(true)
    onSubject(key)
  }

  function toggle() {
    if (open) close(true)
    else setOpen(true)
  }

  return (
    <div ref={rootRef} className="top-bar">
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
              onClick={() => pickTab(s.key)}
            />
          ))}
        </nav>
        <div className="top-bar-menu">
          <MenuButton open={open} controls="top-bar-panel" onClick={toggle} />
        </div>
      </header>
      <div id="top-bar-panel" ref={panelRef} className={`top-bar-panel${open ? ' open' : ''}`}>
        <div className="top-bar-panel-clip">
          <nav aria-label="Menu môn học" className="top-bar-panel-list">
            {SUBJECTS.map((s) => {
              const on = s.key === active
              const state = on ? ' active' : s.locked ? ' locked' : ''
              return (
                <button
                  type="button"
                  key={s.key}
                  className={`menu-item${state}`}
                  aria-current={on ? 'page' : undefined}
                  tabIndex={open ? 0 : -1}
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
        </div>
      </div>
    </div>
  )
}
