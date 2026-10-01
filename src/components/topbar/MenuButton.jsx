// Three thin lines that turn into a cross while the menu is open.
export default function MenuButton({ open, onClick, controls }) {
  return (
    <button
      type="button"
      className={`menu-button${open ? ' open' : ''}`}
      aria-label={open ? 'Đóng' : 'Mở menu'}
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
}
