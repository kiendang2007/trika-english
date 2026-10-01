import { STAGE_WIDTH, diagramAt } from './systemLayout.js'

// HangingWords and SystemTree are one layer with two layouts, so the same fifteen words glide
// between them. Below e = 0.5 the layer reports itself as HangingWords, above as SystemTree.
// `scale` shrinks the fixed-size stage to fit narrower screens than it was drawn for.
export default function SystemDiagram({ mode, eased, fade, reduced, scale }) {
  const d = diagramAt(mode, eased)
  const width = STAGE_WIDTH[mode]
  return (
    <div
      className="system-diagram-frame"
      style={{ width: width * scale, height: d.height * scale }}
    >
      <div
        data-component={eased < 0.5 ? 'HangingWords' : 'SystemTree'}
        className="system-diagram"
        style={{
          width,
          height: d.height,
          transform: scale === 1 ? undefined : `scale(${scale})`,
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
    </div>
  )
}
