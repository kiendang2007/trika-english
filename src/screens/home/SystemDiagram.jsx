import { diagramAt } from './systemLayout.js'

// HangingWords and SystemTree are one layer with two layouts, so the same fifteen words glide
// between them. Below e = 0.5 the layer reports itself as HangingWords, above as SystemTree.
// `width` is the drawn width; only x positions follow it, so words stay at 17px or more.
export default function SystemDiagram({ mode, eased, fade, reduced, width }) {
  const d = diagramAt(mode, eased, width)
  return (
    <div
      data-component={eased < 0.5 ? 'HangingWords' : 'SystemTree'}
      className="system-diagram"
      style={{
        width,
        height: d.height,
        opacity: fade,
        transition: reduced ? 'opacity 150ms linear' : 'none',
      }}
    >
      <div className="system-line" />
      {d.strings.map((s) => (
        <div key={s.id} className="system-string" style={s.style} />
      ))}
      <div className="system-box" style={d.box} />
      <div className="system-dot" style={d.dot} />
      {d.words.map((w) => (
        <span key={w.id} className="system-word" style={w.style}>
          {w.label}
        </span>
      ))}
    </div>
  )
}
