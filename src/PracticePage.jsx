import { useEffect, useState } from 'react'
import StepDots from './components/StepDots.jsx'
import SelectWordsBlock from './blocks/practice/SelectWordsBlock.jsx'
import SortTwoBlock from './blocks/practice/SortTwoBlock.jsx'
import McqBlock from './blocks/practice/McqBlock.jsx'
import BlankBlock from './blocks/practice/BlankBlock.jsx'
import ReorderBlock from './blocks/practice/ReorderBlock.jsx'
import TwoStepBlock from './blocks/practice/TwoStepBlock.jsx'
import { log } from './log.js'

const BLOCKS = {
  select_words: SelectWordsBlock,
  sort_two: SortTwoBlock,
  mcq: McqBlock,
  blank: BlankBlock,
  reorder: ReorderBlock,
  two_step: TwoStepBlock,
}

export default function PracticePage({ practiceSet, onBack }) {
  const [index, setIndex] = useState(0)
  const items = practiceSet.items
  const total = items.length
  const finished = index >= total

  function handleAnswer(isCorrect) {
    if (finished) return
    log('practice_answer', {
      practice: practiceSet.practice_id,
      item: items[index].id,
      correct: isCorrect,
    })
  }

  useEffect(() => {
    if (finished) {
      log('practice_done', { practice: practiceSet.practice_id })
    }
  }, [finished, practiceSet.practice_id])

  function goNext() {
    setIndex((i) => i + 1)
  }

  function restart() {
    setIndex(0)
  }

  const Block = !finished ? BLOCKS[practiceSet.type] : null
  const item = !finished ? items[index] : null

  return (
    <main>
      <div className="screen-header">
        <button type="button" className="link-button" onClick={onBack}>
          <span className="arrow" aria-hidden="true">
            ←
          </span>
          <span>Về danh sách</span>
        </button>
        <span className="pill pill-locked">Không tính điểm</span>
      </div>

      <div className="material-heading">
        <h1>{practiceSet.title_vi}</h1>
        {!finished && (
          <span className="material-sub">
            Câu {index + 1} trong {total}
          </span>
        )}
      </div>

      {!finished && <StepDots total={total} current={index} />}

      {!finished && Block && (
        <Block key={item.id} item={item} onNext={goNext} onAnswer={handleAnswer} />
      )}

      {finished && (
        <>
          <p className="all-done">Đã làm xong phần luyện tập.</p>
          <div className="btn-row">
            <button type="button" className="btn-retry" onClick={restart}>
              Làm lại
            </button>
            <button type="button" className="btn-primary" onClick={onBack}>
              Về danh sách
            </button>
          </div>
        </>
      )}
    </main>
  )
}
