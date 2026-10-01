import { useState } from 'react'
import PracticeCard from './PracticeCard.jsx'
import PracticeFeedback from './PracticeFeedback.jsx'
import { buildSentence } from '../../practiceUtils.js'

// Firefox refuses to start a drag unless dataTransfer carries data, even though the id
// itself is read from React state (draggingId), not from the drop event.
const DRAG_MIME = 'text/plain'

function AnswerLine({ placed, status, onDropAtEnd, onDropBefore, draggingId, onDragStart, onDragEnd, onUnplace }) {
  const className = `answer-line${status !== 'building' ? ` ${status}` : ''}`
  const interactive = status === 'building'
  return (
    <div
      className={className}
      onDragOver={interactive ? (e) => e.preventDefault() : undefined}
      onDrop={interactive ? (e) => { e.preventDefault(); onDropAtEnd() } : undefined}
    >
      {placed.length === 0 ? (
        <span className="answer-line-empty">Bấm hoặc kéo một từ ở dưới để đặt vào đây</span>
      ) : (
        placed.map((chip) => (
          <OrderChip
            key={chip.id}
            chip={chip}
            state={status === 'building' ? 'placed' : status}
            onClick={interactive ? () => onUnplace(chip.id) : undefined}
            draggable={interactive}
            isDragging={draggingId === chip.id}
            onDragStart={interactive ? onDragStart(chip.id) : undefined}
            onDragEnd={interactive ? onDragEnd : undefined}
            onDragOverChip={interactive ? (e) => { e.preventDefault(); e.stopPropagation() } : undefined}
            onDropOnChip={
              interactive
                ? (e) => { e.preventDefault(); e.stopPropagation(); onDropBefore(chip.id) }
                : undefined
            }
          />
        ))
      )}
    </div>
  )
}

function OrderChip({ chip, state, onClick, draggable, isDragging, onDragStart, onDragEnd, onDragOverChip, onDropOnChip }) {
  if (state === 'correct' || state === 'wrong') {
    return <span className={`order-chip ${state}`}>{chip.text}</span>
  }
  if (state === 'placed') {
    return (
      <button
        type="button"
        className={`order-chip placed${isDragging ? ' dragging' : ''}`}
        onClick={onClick}
        draggable={draggable}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOverChip}
        onDrop={onDropOnChip}
      >
        {chip.text}
        <span className="chip-return">↩</span>
      </button>
    )
  }
  return (
    <button
      type="button"
      className={`order-chip${isDragging ? ' dragging' : ''}`}
      onClick={onClick}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      {chip.text}
    </button>
  )
}

// Sắp xếp: pool chips move onto the answer line, in order, either by tapping them or by
// dragging them; a placed chip returns to the pool by tapping it or dragging it back down.
export default function ReorderBlock({ item, onNext }) {
  const allChips = item.chips.map((text, i) => ({ id: i, text }))
  const [placedIds, setPlacedIds] = useState([])
  const [status, setStatus] = useState('building')
  const [draggingId, setDraggingId] = useState(null)

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

  function moveBefore(id, beforeId) {
    if (status !== 'building' || id === beforeId) return
    const without = placedIds.filter((i) => i !== id)
    const target = without.indexOf(beforeId)
    if (target === -1) {
      setPlacedIds([...without, id])
      return
    }
    setPlacedIds([...without.slice(0, target), id, ...without.slice(target)])
  }

  function startDrag(id) {
    return (e) => {
      setDraggingId(id)
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData(DRAG_MIME, String(id))
    }
  }

  function endDrag() {
    setDraggingId(null)
  }

  function dropAtEnd() {
    if (draggingId === null) return
    if (placedIds.includes(draggingId)) {
      moveBefore(draggingId, undefined)
    } else {
      place(draggingId)
    }
  }

  function dropBefore(beforeId) {
    if (draggingId === null) return
    if (placedIds.includes(draggingId)) {
      moveBefore(draggingId, beforeId)
    } else {
      const target = placedIds.indexOf(beforeId)
      setPlacedIds([...placedIds.slice(0, target), draggingId, ...placedIds.slice(target)])
    }
  }

  function dropOnPool() {
    if (draggingId === null) return
    unplace(draggingId)
  }

  function check() {
    const built = buildSentence(placed.map((c) => c.text))
    const isCorrect = built === item.answer
    setStatus(isCorrect ? 'correct' : 'wrong')
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
      <AnswerLine
        placed={placed}
        status={status}
        draggingId={draggingId}
        onDropAtEnd={dropAtEnd}
        onDropBefore={dropBefore}
        onDragStart={startDrag}
        onDragEnd={endDrag}
        onUnplace={unplace}
      />

      {status === 'building' && (
        <div
          className="chip-pool"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); dropOnPool() }}
        >
          <span className="chip-pool-label">
            {poolEmpty ? 'Bể từ · còn 0' : `Bể từ · còn ${pool.length}`}
          </span>
          <div className="chip-pool-row">
            {pool.map((chip) => (
              <OrderChip
                key={chip.id}
                chip={chip}
                state="pool"
                onClick={() => place(chip.id)}
                draggable
                isDragging={draggingId === chip.id}
                onDragStart={startDrag(chip.id)}
                onDragEnd={endDrag}
              />
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
