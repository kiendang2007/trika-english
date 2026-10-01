import { useState } from 'react'
import PracticeCard from './PracticeCard.jsx'
import PracticeFeedback from './PracticeFeedback.jsx'
import { CheckCircle, CrossCircle } from '../../components/Icons.jsx'

function AnswerOption({ option, state, onPick }) {
  const content = (
    <>
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

// Điền vào chỗ trống: the English sentence with "___" sits in an ivory box above the choices.
export default function BlankBlock({ item, onNext }) {
  const [status, setStatus] = useState('unanswered')
  const [chosenKey, setChosenKey] = useState(null)

  const chosen = item.options.find((o) => o.key === chosenKey)

  function pick(key) {
    const isCorrect = key === item.answer
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
    <PracticeCard label="Điền vào chỗ trống" prompt={item.prompt_vi || null}>
      <p className="sentence-box">{item.sentence_en}</p>
      <div className="options">
        {item.options.map((option) => (
          <AnswerOption key={option.key} option={option} state={optionState(option.key)} onPick={pick} />
        ))}
      </div>
      {status !== 'unanswered' && (
        <PracticeFeedback
          status={status}
          quote={status === 'wrong' ? chosen?.text : null}
          explanation={item.rule_vi}
          onNext={onNext}
          onRetry={retry}
        />
      )}
    </PracticeCard>
  )
}
