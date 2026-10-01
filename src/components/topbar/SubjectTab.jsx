import { LockOutline } from '../Icons.jsx'

// One text tab in the top bar. The hidden 800 weight copy of the label reserves the active
// width, so switching tabs never shifts the row.
export default function SubjectTab({ label, active, locked, onClick }) {
  const state = active ? ' active' : locked ? ' locked' : ''
  return (
    <button
      type="button"
      className={`subject-tab${state}`}
      aria-current={active ? 'page' : undefined}
      onClick={onClick}
    >
      <span className="subject-tab-label">
        <span>{label}</span>
        <span aria-hidden="true" className="subject-tab-reserve">
          {label}
        </span>
      </span>
      {locked && (
        <>
          <span className="subject-tab-lock">
            <LockOutline size={14} />
          </span>
          <span className="visually-hidden">, chưa có nội dung</span>
        </>
      )}
      {active && <span className="subject-tab-underline" aria-hidden="true" />}
    </button>
  )
}
