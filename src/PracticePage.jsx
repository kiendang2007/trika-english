import { useState } from 'react'
import StepDots from './components/StepDots.jsx'
import SelectWordsBlock from './blocks/practice/SelectWordsBlock.jsx'
import SortTwoBlock from './blocks/practice/SortTwoBlock.jsx'
import McqBlock from './blocks/practice/McqBlock.jsx'
import BlankBlock from './blocks/practice/BlankBlock.jsx'
import ReorderBlock from './blocks/practice/ReorderBlock.jsx'
import TwoStepBlock from './blocks/practice/TwoStepBlock.jsx'

const BLOCKS = {
  select_words: SelectWordsBlock,
  sort_two: SortTwoBlock,
  mcq: McqBlock,
  blank: BlankBlock,
  reorder: ReorderBlock,
  two_step: TwoStepBlock,
}

export default function PracticePage({
  practiceSet,
  onBack,
  nextStep,
  onOpenPractice,
  onOpenMaterial,
}) {
  const [index, setIndex] = useState(0)
  const items = practiceSet.items
  const total = items.length
  const finished = index >= total

  function goNext() {
    setIndex((i) => i + 1)
  }

  function restart() {
    setIndex(0)
  }

  // The button that moves the learner on: to the next practice of this stage, or, from the last
  // one, to the next stage's first material.
  function goToNextStep() {
    if (!nextStep) return
    if (nextStep.kind === 'practice') onOpenPractice?.(nextStep.practice)
    else onOpenMaterial?.(nextStep.material)
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
        <span className="pill pill-muted">Không tính điểm</span>
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

      {!finished && Block && <Block key={item.id} item={item} onNext={goNext} />}

      {finished && (
        <>
          <p className="all-done">Đã làm xong phần luyện tập.</p>
          {/* One column, one shared size for all three buttons (see .practice-end in
              styles.css), so Làm lại and Về danh sách can never drift apart again. The third
              button is missing only past 11.2, the last practice of the whole route. */}
          <div className="practice-end">
            <button type="button" className="btn-retry" onClick={restart}>
              Làm lại
            </button>
            <button type="button" className="btn-primary" onClick={onBack}>
              Về danh sách
            </button>
            {nextStep && (
              <button type="button" className="btn-primary" onClick={goToNextStep}>
                {nextStep.kind === 'practice'
                  ? 'Phần luyện tập tiếp theo'
                  : `Học giai đoạn ${nextStep.material.stage}`}
              </button>
            )}
          </div>
        </>
      )}
    </main>
  )
}
