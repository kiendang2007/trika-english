// Trika English mark, option 7a. Geometry is a ratio of the tile side `size`.
// Below a 20px tile the mark falls back to the single-letter T (see public/favicon.svg).
// `reversed` is the version for a brown background: white tile, brown bars, gold bottom step.
export function LogoMark({ size = 58, reversed = false }) {
  const ink = reversed ? '#5B4636' : '#FFFFFF'
  const px = (ratio) => `${(ratio * size).toFixed(2)}px`
  const t = 0.0517 * size
  const row = 0.2241 * size
  const bar = (width, color) => (
    <div style={{ width, height: px(0.0517), borderRadius: `${(t / 2).toFixed(2)}px`, background: color }} />
  )

  return (
    <div
      className="logo-tile"
      style={{
        width: size,
        height: size,
        borderRadius: px(0.29),
        background: reversed ? '#FFFFFF' : undefined,
      }}
      aria-hidden="true"
    >
      <div className="logo-glyph" style={{ width: px(0.4828) }}>
        {bar(px(0.4828), ink)}
        <div className="logo-row" style={{ width: px(0.4828), height: px(0.2241) }}>
          <div
            style={{
              marginLeft: px(0.1466),
              width: px(0.0517),
              height: px(0.2241),
              borderRadius: `${(row / 2).toFixed(2)}px`,
              background: ink,
            }}
          />
          <div className="logo-steps" style={{ height: px(0.2241), gap: px(0.0603) }}>
            {bar(px(0.1897), ink)}
            {bar(px(0.2414), '#D4AF7C')}
          </div>
        </div>
      </div>
    </div>
  )
}
