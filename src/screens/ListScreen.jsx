import { isEverythingComplete, isMaterialComplete, isStageComplete } from '../progress.js'
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
// not a stage number the learner has moved past, is what marks a stage done.
function statusFor(stage, currentStage, correct) {
  if (stage < currentStage || isStageComplete(stage, correct)) return 'done'
  if (stage === currentStage) return 'current'
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

function StageCard({ stage, status, materials, correct, onOpenMaterial, practiceSets, onOpenPractice }) {
  const practiceUnlocked = isStageComplete(stage, correct)
  return (
    <div className={`stage-card ${status}`}>
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

  return (
    <main>
      <div className="screen-header">
        <span className="learner-name">{learner.name}</span>
        <button type="button" className="link-button underline" onClick={onSwitchLearner}>
          Đổi người học
        </button>
      </div>
      <Notice notice={notice} onDismiss={onDismissNotice} />
      {isEverythingComplete(learner.correct) && (
        <p className="all-done">Đã học xong tất cả các giai đoạn.</p>
      )}
      <ol className="stage-trail">
        {stages.map(({ stage, materials: stageMaterials }) => {
          const status = statusFor(stage, learner.current_stage, learner.correct)
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
                  correct={learner.correct}
                  onOpenMaterial={onOpenMaterial}
                  practiceSets={practiceSets.filter((p) => p.stage === stage)}
                  onOpenPractice={onOpenPractice}
                />
              </div>
            </li>
          )
        })}
      </ol>
    </main>
  )
}
