import { useEffect, useRef, useState } from 'react'
import { CheckCircle, CrossCircle } from '../components/Icons.jsx'
import { QuotedBold } from '../components/RichText.jsx'

// Each correction step fades up 160ms after the one before and then stays visible.
const STEP_START_MS = 60
const STEP_GAP_MS = 160

function RevealStep({ index, children }) {
  return (
    <div className="reveal-step" style={{ animationDelay: `${STEP_START_MS + index * STEP_GAP_MS}ms` }}>
      {children}
    </div>
  )
}

function AnswerOption({ option, state, onPick }) {
  const content = (
    <>
      <span className="option-key">{option.key}</span>
      <span className="option-text">{option.text}</span>
      {state === 'correct' && (
        <>
          <CheckCircle size={18} />
          <span className="option-verdict">Đúng</span>
        </>
      )}
      {state === 'wrong' && (
        <>
          <CrossCircle size={18} />
          <span className="option-verdict">Sai</span>
        </>
      )}
    </>
  )

  if (state === 'idle' || state === 'muted-open') {
    return (
      <button
        type="button"
        className={state === 'idle' ? 'option' : 'option muted'}
        onClick={() => onPick(option.key)}
      >
        {content}
      </button>
    )
  }
  return <div className={`option ${state}`}>{content}</div>
}

function CorrectionReveal({ chosenOption, rule, onRetry }) {
  return (
    <div className="feedback feedback-wrong" role="status">
      <RevealStep index={0}>
        <div className="feedback-title">
          <CrossCircle size={20} />
          <span>Sai</span>
        </div>
      </RevealStep>
      <RevealStep index={1}>
        <p className="feedback-quote">&quot;{chosenOption.text}&quot;</p>
      </RevealStep>
      <RevealStep index={2}>
        <p>
          <QuotedBold text={chosenOption.diagnosis_vi} />
        </p>
      </RevealStep>
      <RevealStep index={3}>
        <div className="rule-box">
          <span className="rule-label">Ghi nhớ</span>
          <p>
            <QuotedBold text={rule} />
          </p>
        </div>
      </RevealStep>
      <RevealStep index={4}>
        <button type="button" className="btn-retry" onClick={onRetry}>
          Thử lại
        </button>
      </RevealStep>
    </div>
  )
}

export default function QuestionCard({ item }) {
  const [status, setStatus] = useState('unanswered')
  const [chosenKey, setChosenKey] = useState(null)
  const [retried, setRetried] = useState(false)
  const optionsRef = useRef(null)

  useEffect(() => {
    if (retried && status === 'unanswered') {
      optionsRef.current?.querySelector('button')?.focus()
      setRetried(false)
    }
  }, [retried, status])

  const chosenOption = item.options.find((option) => option.key === chosenKey)

  function pick(key) {
    setChosenKey(key)
    const isCorrect = key === item.answer
    setStatus(isCorrect ? 'correct' : 'wrong')
  }

  function retry() {
    setStatus('unanswered')
    setChosenKey(null)
    setRetried(true)
  }

  // The chosen option is marked by comparing its key to item.answer in pick(). After a correct
  // answer the other options stay tappable, so the item can always be answered again. After a
  // wrong answer the learner goes through the correction and then "Thử lại".
  function optionState(key) {
    if (status === 'unanswered') return 'idle'
    if (key === chosenKey) return status
    return status === 'correct' ? 'muted-open' : 'muted'
  }

  return (
    <div className="question">
      <div className="question-card">
        <div className="question-head">
          <span className="question-label">Câu hỏi</span>
          <p className="question-prompt">
            <QuotedBold text={item.prompt_vi} />
          </p>
        </div>

        <div className="options" ref={optionsRef}>
          {item.options.map((option) => (
            <AnswerOption key={option.key} option={option} state={optionState(option.key)} onPick={pick} />
          ))}
        </div>

        {status === 'correct' && (
          <div className="feedback feedback-correct" role="status">
            <div className="feedback-title">
              <CheckCircle size={20} />
              <span>Đúng</span>
            </div>
            <p>
              <QuotedBold text={item.rule_vi} />
            </p>
          </div>
        )}

        {status === 'wrong' && chosenOption && (
          <CorrectionReveal chosenOption={chosenOption} rule={item.rule_vi} onRetry={retry} />
        )}
      </div>
    </div>
  )
}
