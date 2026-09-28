import { useState } from 'react'
import { STAGE_COUNT } from '../stages.js'

// A stage can hold several materials, so commas carry the list and "và" only joins the last one.
function stageLabel(stage, materials) {
  const titles = materials
    .filter((m) => m.stage === stage)
    .sort((a, b) => a.material_id - b.material_id)
    .map((m) => m.title_vi)
  const list =
    titles.length > 1
      ? `${titles.slice(0, -1).join(', ')} và ${titles[titles.length - 1]}`
      : titles.join('')
  return `Giai đoạn ${stage}: ${list}`
}

export default function TeacherScreen({ materials }) {
  const [name, setName] = useState('')
  const [stage, setStage] = useState(1)
  const [link, setLink] = useState(null)
  const [copied, setCopied] = useState(false)
  const disabled = name.trim().length === 0

  function handleCreate() {
    if (disabled) return
    const trimmed = name.trim()
    const url = `${window.location.origin}?hv=${encodeURIComponent(trimmed)}&gd=${stage}`
    setLink(url)
    setCopied(false)
  }

  async function handleCopy() {
    if (!link) return
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // ignore
    }
  }

  return (
    <main>
      <h1>Xếp giai đoạn</h1>
      <div className="teacher-form">
        <div className="field">
          <label htmlFor="teacher-name">Tên học viên</label>
          <input
            id="teacher-name"
            type="text"
            autoComplete="off"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="teacher-stage">Giai đoạn bắt đầu</label>
          <select
            id="teacher-stage"
            value={stage}
            onChange={(event) => setStage(Number(event.target.value))}
          >
            {/* One option per stage the content actually has. See src/stages.js. */}
            {Array.from({ length: STAGE_COUNT }, (_, i) => i + 1).map((s) => (
              <option key={s} value={s}>
                {stageLabel(s, materials)}
              </option>
            ))}
          </select>
        </div>
        <div className="btn-row">
          <button
            type="button"
            className="btn-primary"
            disabled={disabled}
            aria-describedby={disabled ? 'create-hint' : undefined}
            onClick={handleCreate}
          >
            Tạo đường link
          </button>
        </div>
        {disabled && (
          <p id="create-hint" className="hint">
            Nhập tên học viên để tạo đường link.
          </p>
        )}
      </div>
      {link && (
        <div className="teacher-link">
          <p className="teacher-link-text" role="textbox" aria-readonly="true" tabIndex={0}>
            {link}
          </p>
          <button type="button" className="btn-secondary btn-small" onClick={handleCopy}>
            {copied ? 'Đã sao chép' : 'Sao chép'}
          </button>
        </div>
      )}
    </main>
  )
}
