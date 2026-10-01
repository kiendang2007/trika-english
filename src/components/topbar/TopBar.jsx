import { useRef, useState } from 'react'
import { LogoMark } from '../Logo.jsx'
import { SUBJECTS } from '../../subjects.js'
import SubjectTab from './SubjectTab.jsx'
import MenuButton from './MenuButton.jsx'
import FullScreenMenu from './FullScreenMenu.jsx'

// Fixed bar on every screen: logo home link, the four subject tabs (hidden under 720px) and a
// menu button that opens the full screen menu with the same four subjects.
// `active` is a subject key, or '' on screens that belong to no subject (home, teacher).
export default function TopBar({ active, onHome, onSubject }) {
  const [open, setOpen] = useState(false)
  const menuButtonRef = useRef(null)

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
                onClick={() => pick(s.key)}
              />
            ))}
          </nav>
          <div className="top-bar-menu">
            <MenuButton
              ref={menuButtonRef}
              open={open}
              controls="full-menu"
              onClick={() => setOpen(true)}
            />
          </div>
        </header>
      </div>
      {open && (
        <FullScreenMenu
          id="full-menu"
          active={active}
          onClose={() => setOpen(false)}
          onPick={pick}
          returnFocusRef={menuButtonRef}
        />
      )}
    </>
  )
}
