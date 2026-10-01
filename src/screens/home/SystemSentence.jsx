import { forwardRef } from 'react'

// The sentence above the diagram. "… Bấm để biết thêm" and "một hệ thống." share one grid
// slot, so the line never reflows while one fades out and the other fades in.
const SystemSentence = forwardRef(function SystemSentence(
  { progress, eased, reduced, onPress },
  ref
) {
  const started = progress > 0
  const crossfade = reduced ? { transition: 'opacity 300ms ease' } : null
  return (
    <p ref={ref} tabIndex={-1} className="system-sentence">
      Tiếng Anh không phải là một nhóm các khái niệm riêng biệt, mà là
      <span className="system-sentence-slot">
        <span
          className="system-sentence-end"
          aria-hidden={!started}
          style={{ opacity: eased, ...crossfade }}
        >
          một hệ thống.
        </span>
        <button
          type="button"
          className="system-sentence-more"
          aria-expanded={started}
          tabIndex={started ? -1 : 0}
          onClick={onPress}
          style={{
            opacity: 1 - eased,
            visibility: progress >= 1 ? 'hidden' : 'visible',
            ...crossfade,
          }}
        >
          <span className="system-sentence-dots">…</span>
          <span className="system-sentence-hint">Bấm để biết thêm</span>
        </button>
      </span>
    </p>
  )
})

export default SystemSentence
