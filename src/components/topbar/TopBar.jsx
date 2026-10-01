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

  useEffect(() => {
    if (!open) return
    function onKey(event) {
      if (event.key === 'Escape') setOpen(false)
    }
    function onDown(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onDown)
    }
  }, [open])

  function goHome(event) {
    event.preventDefault()
    setOpen(false)
    onHome()
  }

  function pick(key) {
    setOpen(false)
    onSubject(key)
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
              onClick={() => pick(s.key)}
            />
          ))}
        </nav>
        <div className="top-bar-menu">
          <MenuButton open={open} controls="top-bar-panel" onClick={() => setOpen((o) => !o)} />
        </div>
      </header>
      <div id="top-bar-panel" className={`top-bar-panel${open ? ' open' : ''}`}>
        <div className="top-bar-panel-clip">
          <nav aria-label="Môn học" className="top-bar-panel-list">
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
                  onClick={() => pick(s.key)}
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
