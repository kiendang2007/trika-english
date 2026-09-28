// Progress across the ten items in a practice set. Purely visual, never counted or scored.
export default function StepDots({ total, current }) {
  return (
    <div className="step-dots" aria-hidden="true">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`step-dot${i < current ? ' done' : ''}${i === current ? ' current' : ''}`}
        />
      ))}
    </div>
  )
}
