import { useState } from 'react'
import PracticeCard from './PracticeCard.jsx'
import PracticeFeedback from './PracticeFeedback.jsx'
import { CheckCircle, CrossCircle } from '../../components/Icons.jsx'

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

  if (state === 'idle') {
    return (
      <button type="button" className="option" onClick={() => onPick(option.key)}>
        {content}
      </button>
    )
  }
  return <div className={`option ${state === 'muted' ? 'muted' : state}`}>{content}</div>
}

// Shared by mcq and blank: both are a single-tap, auto-graded choice among options, checked the
// moment the learner taps one, same as the in-material question.
export default function ChoiceBlock({ label, prompt, options, answerKey, ruleVi, onNext }) {
  const [status, setStatus] = useState('unanswered')
  const [chosenKey, setChosenKey] = useState(null)

  const chosen = options.find((o) => o.key === chosenKey)

  function pick(key) {
    const isCorrect = key === answerKey
    setChosenKey(key)
    setStatus(isCorrect ? 'correct' : 'wrong')
  }

  function retry() {
    setStatus('unanswered')
    setChosenKey(null)
  }

  function optionState(key) {
    if (status === 'unanswered') return 'idle'
    if (key === chosenKey) return status
    return 'muted'
  }

  return (
    <PracticeCard label={label} prompt={prompt}>
      <div className="options">
        {options.map((option) => (
          <AnswerOption key={option.key} option={option} state={optionState(option.key)} onPick={pick} />
        ))}
      </div>
      {status !== 'unanswered' && (
        <PracticeFeedback
          status={status}
          quote={status === 'wrong' ? chosen?.text : null}
          explanation={ruleVi}
          onNext={onNext}
          onRetry={retry}
        />
      )}
    </PracticeCard>
  )
}
