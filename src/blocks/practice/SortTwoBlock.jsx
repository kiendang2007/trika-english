import { useState } from 'react'
import PracticeCard from './PracticeCard.jsx'
import { CheckCircle, CrossCircle } from '../../components/Icons.jsx'

// Xếp vào hai nhóm: tap a chip in the pool then tap a column to place it, or drag a chip
// directly onto a column. A placed chip is tapped or dragged back to the pool the same way.
export default function SortTwoBlock({ item, onNext }) {
  const chips = item.chips.map((c, i) => ({ id: i, word: c.word, group: c.group }))
  const [placement, setPlacement] = useState({}) // id -> 'left' | 'right'
  const [selectedId, setSelectedId] = useState(null)
  const [checked, setChecked] = useState(false)

  const pool = chips.filter((c) => placement[c.id] === undefined)
  const leftChips = chips.filter((c) => placement[c.id] === 'left')
  const rightChips = chips.filter((c) => placement[c.id] === 'right')
  const allPlaced = pool.length === 0

  function pickFromPool(id) {
    if (checked) return
    setSelectedId(id === selectedId ? null : id)
  }

  function placeChip(id, column) {
    if (checked || id === null || id === undefined) return
    setPlacement({ ...placement, [id]: column })
    setSelectedId(null)
  }

  function placeInColumn(column) {
    placeChip(selectedId, column)
  }

  function returnToPool(id) {
    if (checked) return
    const next = { ...placement }
    delete next[id]
    setPlacement(next)
  }

  function dragStart(e, id) {
    if (checked) return
    e.dataTransfer.setData('text/plain', String(id))
    e.dataTransfer.effectAllowed = 'move'
  }

  function allowDrop(e) {
    if (checked) return
    e.preventDefault()
  }

  function dropOnColumn(e, column) {
    if (checked) return
    e.preventDefault()
    const id = Number(e.dataTransfer.getData('text/plain'))
    placeChip(id, column)
  }

  function dropOnPool(e) {
    if (checked) return
    e.preventDefault()
    const id = Number(e.dataTransfer.getData('text/plain'))
    returnToPool(id)
  }

  function check() {
    setChecked(true)
  }

  function retry() {
    setPlacement({})
    setSelectedId(null)
    setChecked(false)
  }

  const allCorrect = checked && chips.every((c) => placement[c.id] === c.group)

  function chipClass(c) {
    if (!checked) return `order-chip${selectedId === c.id ? ' selected' : ''}`
    return placement[c.id] === c.group ? 'order-chip correct' : 'order-chip wrong'
  }

  function Column({ label, group, list }) {
    return (
      <div className="sort-column">
        <div className="sort-column-label">{label}</div>
        <div
          className="sort-column-drop"
          role="button"
          tabIndex={0}
          onClick={() => placeInColumn(group)}
          onKeyDown={(e) => e.key === 'Enter' && placeInColumn(group)}
          onDragOver={allowDrop}
          onDrop={(e) => dropOnColumn(e, group)}
        >
          {list.length === 0 && <span className="sort-column-empty">Chưa có từ nào</span>}
          {list.map((c) =>
            checked ? (
              <span key={c.id} className={chipClass(c)}>
                {c.word}
              </span>
            ) : (
              <button
                key={c.id}
                type="button"
                className={chipClass(c)}
                draggable
                onDragStart={(e) => dragStart(e, c.id)}
                onClick={(e) => {
                  e.stopPropagation()
                  returnToPool(c.id)
                }}
              >
                {c.word}
                <span className="chip-return">↩</span>
              </button>
            )
          )}
        </div>
      </div>
    )
  }

  const explanationOrder = item.explanations
    .map((e) => ({ ...e, chip: chips.find((c) => c.word === e.word) }))
    .filter((e) => e.chip)

  return (
    <PracticeCard
      label="Xếp vào hai nhóm"
      prompt={item.prompt_vi}
      footer={
        !checked
          ? selectedId !== null
            ? 'Bấm vào cột đúng để xếp từ đã chọn.'
            : 'Bấm một từ trong bể, rồi bấm vào cột đúng.'
          : null
      }
    >
      <div className="sort-columns">
        <Column label={item.left_label_vi} group="left" list={leftChips} />
        <Column label={item.right_label_vi} group="right" list={rightChips} />
      </div>

      {!checked && (
        <div className="chip-pool" onDragOver={allowDrop} onDrop={dropOnPool}>
          <span className="chip-pool-label">Bể từ · còn {pool.length}</span>
          <div className="chip-pool-row">
            {pool.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`order-chip${selectedId === c.id ? ' selected' : ''}`}
                draggable
                onDragStart={(e) => dragStart(e, c.id)}
                onClick={() => pickFromPool(c.id)}
              >
                {c.word}
              </button>
            ))}
          </div>
        </div>
      )}

      {!checked && (
        <button type="button" className="btn-primary" disabled={!allPlaced} onClick={check}>
          Kiểm tra
        </button>
      )}

      {checked && (
        <div className={`feedback ${allCorrect ? 'feedback-correct' : 'feedback-wrong'}`} role="status">
          <div className="feedback-title">
            {allCorrect ? <CheckCircle size={20} /> : <CrossCircle size={20} />}
            <span>{allCorrect ? 'Đúng' : 'Chưa đúng hết'}</span>
          </div>
          <div className="sort-explanations">
            {explanationOrder.map(({ word, text_vi, chip }) => {
              const isCorrect = placement[chip.id] === chip.group
              return (
                <p key={word} className="sort-explanation-line">
                  {isCorrect ? <CheckCircle size={16} /> : <CrossCircle size={16} />}
                  <span>{text_vi}</span>
                </p>
              )
            })}
          </div>
          <p>{item.rule_vi}</p>
          {allCorrect ? (
            <button type="button" className="btn-primary" onClick={onNext}>
              Câu tiếp
            </button>
          ) : (
            <button type="button" className="btn-retry" onClick={retry}>
              Thử lại
            </button>
          )}
        </div>
      )}
    </PracticeCard>
  )
}
