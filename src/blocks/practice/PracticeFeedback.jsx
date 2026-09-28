import { CheckCircle, CrossCircle } from '../../components/Icons.jsx'
import { QuotedBold } from '../../components/RichText.jsx'

const STEP_START_MS = 60
const STEP_GAP_MS = 160

function RevealStep({ index, children }) {
  return (
    <div className="reveal-step" style={{ animationDelay: `${STEP_START_MS + index * STEP_GAP_MS}ms` }}>
      {children}
    </div>
  )
}

// The correct/wrong reveal shared by every practice question type. Correct ends with "Câu
// tiếp" to move on; wrong runs the four-step correction and ends with "Thử lại".
export default function PracticeFeedback({ status, quote, explanation, ghiNho, onNext, onRetry }) {
  if (status === 'correct') {
    return (
      <div className="feedback feedback-correct" role="status">
        <div className="feedback-title">
          <CheckCircle size={20} />
          <span>Đúng</span>
        </div>
        {explanation && (
          <p>
            <QuotedBold text={explanation} />
          </p>
        )}
        <button type="button" className="btn-primary" onClick={onNext}>
          Câu tiếp
        </button>
      </div>
    )
  }

  return (
    <div className="feedback feedback-wrong" role="status">
      <RevealStep index={0}>
        <div className="feedback-title">
          <CrossCircle size={20} />
          <span>Sai</span>
        </div>
      </RevealStep>
      {quote && (
        <RevealStep index={1}>
          <p className="feedback-quote">&quot;{quote}&quot;</p>
        </RevealStep>
      )}
      <RevealStep index={2}>
        <p>
          <QuotedBold text={explanation} />
        </p>
      </RevealStep>
      {ghiNho && (
        <RevealStep index={3}>
          <div className="rule-box">
            <span className="rule-label">Ghi nhớ</span>
            <p>
              <strong>{ghiNho}</strong>
            </p>
          </div>
        </RevealStep>
      )}
      <RevealStep index={4}>
        <button type="button" className="btn-retry" onClick={onRetry}>
          Thử lại
        </button>
      </RevealStep>
    </div>
  )
}
