import { useState } from 'react'
import { LogoLockup } from '../components/Logo.jsx'

export default function NameScreen({ onStart }) {
  const [name, setName] = useState('')
  const disabled = name.trim().length === 0

  function handleSubmit(event) {
    event.preventDefault()
    if (disabled) return
    onStart(name.trim())
  }

  return (
    <main className="name-screen">
      <LogoLockup size={72} />
      <form className="field" onSubmit={handleSubmit}>
        <label htmlFor="learner-name">Tên người học</label>
        <input
          id="learner-name"
          type="text"
          autoComplete="off"
          placeholder="Tên đăng nhập"
          aria-label="Tên người học"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <div className="btn-row">
          <button
            type="submit"
            className="btn-primary"
            disabled={disabled}
            aria-describedby={disabled ? 'start-hint' : undefined}
          >
            Bắt đầu
          </button>
        </div>
        {disabled && (
          <p id="start-hint" className="hint">
            Nhập tên để bắt đầu.
          </p>
        )}
      </form>
    </main>
  )
}
