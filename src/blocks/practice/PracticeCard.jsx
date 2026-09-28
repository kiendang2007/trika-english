// Shared chrome for every practice question type: label, optional progress badge, prompt,
// then the type-specific body, then an optional footer hint.
export default function PracticeCard({ label, badge, prompt, children, footer }) {
  return (
    <div className="question">
      <div className="question-card">
        <div className="question-head">
          <div className="practice-card-top">
            <span className="question-label">{label}</span>
            {badge && <span className="pill pill-current">{badge}</span>}
          </div>
          {prompt && <p className="question-prompt">{prompt}</p>}
        </div>
        {children}
        {footer && <p className="hint">{footer}</p>}
      </div>
    </div>
  )
}
