import { useEffect, useRef } from 'react'
import {
  isEverythingComplete,
  isMaterialComplete,
  isPracticeComplete,
  isStageComplete,
} from '../progress.js'
import { STAGE_COUNT } from '../stages.js'
import Notice from '../components/Notice.jsx'
import { CheckStroke, LockIcon } from '../components/Icons.jsx'

function LockedInlineIcon() {
  return (
    <span className="lock-icon lock-icon-inline" aria-hidden="true">
      <span className="shackle" />
      <span className="body" />
    </span>
  )
}

// The last stage has no stage after it, so a learner who finishes it stays on it. Completion,
// not a stage number the learner has moved past, is what marks a stage done. A stage the learner
// has already passed stays done whatever the current rule says, so nobody who moved on under the
// old rule sees their stages turn incomplete.
function statusFor(stage, learner) {
  if (stage < learner.current_stage || isStageComplete(stage, learner.correct, learner.practice)) {
    return 'done'
  }
  if (stage === learner.current_stage) return 'current'
  return 'locked'
}

const STATUS_LABEL = { done: 'Đã xong', current: 'Đang học', locked: 'Chưa mở' }

function StageMarker({ stage, status }) {
  return (
    <div className={`trail-marker ${status}`}>
      {status === 'done' && <CheckStroke size={22} />}
      {status === 'current' && <span aria-hidden="true">{stage}</span>}
      {status === 'locked' && <LockIcon />}
    </div>
  )
}

function StageCard({
  stage,
  status,
  materials,
  learner,
  onOpenMaterial,
  practiceSets,
  onOpenPractice,
  highlighted,
  cardRef,
}) {
  const { correct } = learner
  // Practice opens with its stage, not after it: finishing the practice is what finishes it.
  const practiceUnlocked = stage <= learner.current_stage
  return (
    <div ref={cardRef} className={`stage-card ${status}${highlighted ? ' highlight' : ''}`}>
      <div className="stage-card-head">
        <h2 className="stage-title">Giai đoạn {stage}</h2>
        <span className={`pill pill-${status}`}>{STATUS_LABEL[status]}</span>
      </div>
      <ul className="material-list">
        {materials.map((m) => (
          <li key={m.material_id}>
            <button type="button" className="material-link" onClick={() => onOpenMaterial(m)}>
              {m.title_vi}
              {isMaterialComplete(m, correct) ? ' ✓' : ''}
            </button>
          </li>
        ))}
      </ul>
      {practiceSets.length > 0 && (
        <div className="practice-list">
          <span className="practice-list-label">Luyện tập</span>
          <ul className="material-list">
            {practiceSets.map((p) => (
              <li key={p.practice_id}>
                <button
                  type="button"
                  className={`material-link${practiceUnlocked ? '' : ' locked-item'}`}
                  aria-disabled={!practiceUnlocked}
                  onClick={() => onOpenPractice(p)}
                >
                  {!practiceUnlocked && <LockedInlineIcon />}
                  {p.title_vi}
                  {isPracticeComplete(p, learner.practice) ? ' ✓' : ''}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default function ListScreen({
  learner,
  materials,
  practiceSets,
  onOpenMaterial,
  onOpenPractice,
  onSwitchLearner,
  notice,
  onDismissNotice,
  highlightStage,
  onHighlightDone,
}) {
  const stages = []
  for (let stage = 1; stage <= STAGE_COUNT; stage++) {
    stages.push({
      stage,
      materials: materials
        .filter((m) => m.stage === stage)
        .sort((a, b) => a.material_id - b.material_id),
    })
  }

  const highlightedCardRef = useRef(null)

  // Arriving from "Sang phần luyện tập": jump to the stage's card and let it glow briefly, the
  // same way the learner would find it by scrolling, then let the highlight fade on its own.
  useEffect(() => {
    if (!highlightStage) return
    highlightedCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    const timer = setTimeout(() => onHighlightDone?.(), 2000)
    return () => clearTimeout(timer)
  }, [highlightStage, onHighlightDone])

  return (
    <main>
      <div className="screen-header">
        <span className="learner-name">{learner.name}</span>
        <button type="button" className="link-button underline" onClick={onSwitchLearner}>
          Đổi người học
        </button>
      </div>
      <Notice notice={notice} onDismiss={onDismissNotice} />
      {isEverythingComplete(learner.correct, learner.practice) && (
        <p className="all-done">Đã học xong tất cả các giai đoạn.</p>
      )}
      <ol className="stage-trail">
        {stages.map(({ stage, materials: stageMaterials }) => {
          const status = statusFor(stage, learner)
          const solid = status === 'done'
          return (
            <li key={stage}>
              <div className="stage-row">
                <div className="trail-rail">
                  <StageMarker stage={stage} status={status} />
                  <div className={`trail-line${solid ? ' solid' : ''}`} />
                </div>
                <StageCard
                  stage={stage}
                  status={status}
                  materials={stageMaterials}
                  learner={learner}
                  onOpenMaterial={onOpenMaterial}
                  practiceSets={practiceSets.filter((p) => p.stage === stage)}
                  onOpenPractice={onOpenPractice}
                  highlighted={stage === highlightStage}
                  cardRef={stage === highlightStage ? highlightedCardRef : null}
                />
              </div>
            </li>
          )
        })}
      </ol>
    </main>
  )
}
