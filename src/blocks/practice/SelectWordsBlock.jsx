import { useState } from 'react'
import PracticeCard from './PracticeCard.jsx'
import PracticeFeedback from './PracticeFeedback.jsx'

// Chọn từ: tap tokens in the sentence until exactly `count` are selected, then Kiểm tra.
// A word can appear twice in the sentence; each position is tracked by index, not by text.
export default function SelectWordsBlock({ item, onNext }) {
  const [selected, setSelected] = useState([])
  const [status, setStatus] = useState('building') // building | correct | wrong

  const answerSet = new Set(item.answer_indices)
  const full = selected.length >= item.count

  function toggle(index) {
    if (status !== 'building') return
    if (selected.includes(index)) {
      setSelected(selected.filter((i) => i !== index))
      return
    }
    if (full) return
    setSelected([...selected, index])
  }

  function check() {
    const selectedSet = new Set(selected)
    const isCorrect =
      selectedSet.size === answerSet.size && [...answerSet].every((i) => selectedSet.has(i))
    setStatus(isCorrect ? 'correct' : 'wrong')
  }

  function retry() {
    setSelected([])
    setStatus('building')
  }

  function tokenClass(index) {
    const isSelected = selected.includes(index)
    if (status === 'building') {
      if (isSelected) return 'token selected'
      return 'token'
    }
    const isAnswer = answerSet.has(index)
    if (isSelected && isAnswer) return 'token correct'
    if (isSelected && !isAnswer) return 'token wrong'
    if (!isSelected && isAnswer) return 'token missed'
    return 'token'
  }

  const correctWords = item.answer_indices.map((i) => item.tokens[i]).join(', ')

  return (
    <PracticeCard
      label="Chọn từ"
      prompt={item.prompt_vi}
      footer={
        status === 'building'
          ? `Đã chọn ${selected.length}/${item.count} từ.`
          : null
      }
    >
      <div className="token-row">
        {item.tokens.map((word, index) => (
          <button
            key={index}
            type="button"
            className={tokenClass(index)}
            disabled={status !== 'building' || (!selected.includes(index) && full)}
            onClick={() => toggle(index)}
          >
            {word}
          </button>
        ))}
      </div>

      {status === 'building' && (
        <button type="button" className="btn-primary" disabled={!full} onClick={check}>
          Kiểm tra
        </button>
      )}

      {status !== 'building' && (
        <PracticeFeedback
          status={status}
          explanation={item.rule_vi}
          ghiNho={status === 'wrong' ? correctWords : null}
          onNext={onNext}
          onRetry={retry}
        />
      )}
    </PracticeCard>
  )
}
