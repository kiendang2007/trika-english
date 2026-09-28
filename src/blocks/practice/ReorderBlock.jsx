import { useState } from 'react'
import PracticeCard from './PracticeCard.jsx'
import PracticeFeedback from './PracticeFeedback.jsx'
import { buildSentence } from '../../practiceUtils.js'

function AnswerLine({ placed, status }) {
  const className = `answer-line${status !== 'building' ? ` ${status}` : ''}`
  return (
    <div className={className}>
      {placed.length === 0 ? (
        <span className="answer-line-empty">Bấm một từ ở dưới để đặt vào đây</span>
      ) : (
        placed.map((chip) => (
          <OrderChip key={chip.id} chip={chip} state={status === 'building' ? 'placed' : status} />
        ))
      )}
    </div>
  )
}

function OrderChip({ chip, state, onClick }) {
  if (state === 'correct' || state === 'wrong') {
    return <span className={`order-chip ${state}`}>{chip.text}</span>
  }
  if (state === 'placed') {
    return (
      <button type="button" className="order-chip placed" onClick={onClick}>
        {chip.text}
        <span className="chip-return">↩</span>
      </button>
    )
  }
  return (
    <button type="button" className="order-chip" onClick={onClick}>
      {chip.text}
    </button>
  )
}

// Sắp xếp: tap pool chips onto the answer line in order, tap a placed chip to return it.
export default function ReorderBlock({ item, onNext, onAnswer }) {
  const allChips = item.chips.map((text, i) => ({ id: i, text }))
  const [placedIds, setPlacedIds] = useState([])
  const [status, setStatus] = useState('building')

  const placed = placedIds.map((id) => allChips.find((c) => c.id === id))
  const pool = allChips.filter((c) => !placedIds.includes(c.id))
  const poolEmpty = pool.length === 0

  function place(id) {
    if (status !== 'building') return
    setPlacedIds([...placedIds, id])
  }

  function unplace(id) {
    if (status !== 'building') return
    setPlacedIds(placedIds.filter((i) => i !== id))
  }

  function check() {
    const built = buildSentence(placed.map((c) => c.text))
    const isCorrect = built === item.answer
    setStatus(isCorrect ? 'correct' : 'wrong')
    onAnswer?.(isCorrect)
  }

  function retry() {
    setPlacedIds([])
    setStatus('building')
  }

  const builtSentence = buildSentence(placed.map((c) => c.text))

  return (
    <PracticeCard
      label="Sắp xếp"
      prompt={item.prompt_vi}
      footer={
        status === 'building'
          ? poolEmpty
            ? 'Bấm Kiểm tra để xem kết quả.'
            : 'Bấm hết các từ trong bể để mở nút Kiểm tra.'
          : null
      }
    >
      <AnswerLine placed={placed} status={status} />

      {status === 'building' && (
        <div className="chip-pool">
          <span className="chip-pool-label">
            {poolEmpty ? 'Bể từ · còn 0' : `Bể từ · còn ${pool.length}`}
          </span>
          <div className="chip-pool-row">
            {pool.map((chip) => (
              <OrderChip key={chip.id} chip={chip} state="pool" onClick={() => place(chip.id)} />
            ))}
          </div>
        </div>
      )}

      {status === 'building' && (
        <button type="button" className="btn-primary" disabled={!poolEmpty} onClick={check}>
          Kiểm tra
        </button>
      )}

      {status !== 'building' && (
        <PracticeFeedback
          status={status}
          quote={builtSentence}
          explanation={item.rule_vi}
          ghiNho={status === 'wrong' ? item.answer : null}
          onNext={onNext}
          onRetry={retry}
        />
      )}
    </PracticeCard>
  )
}
