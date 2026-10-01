import { forwardRef } from 'react'

// Three thin lines. While the full screen menu is open it covers this button, so the way out
// is the Đóng button inside the menu.
const MenuButton = forwardRef(function MenuButton({ open, onClick, controls }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      className="menu-button"
      aria-label="Mở menu"
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-controls={controls}
      onClick={onClick}
    >
      <span className="menu-button-lines" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
    </button>
  )
})

export default MenuButton
