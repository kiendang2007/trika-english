import { forwardRef } from 'react'

// Three thin lines that turn into a cross while the menu is open.
const MenuButton = forwardRef(function MenuButton({ open, onClick }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      className={`menu-button${open ? ' open' : ''}`}
      aria-label={open ? 'Đóng' : 'Mở menu'}
      aria-expanded={open}
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
