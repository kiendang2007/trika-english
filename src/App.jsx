import { useEffect, useState } from 'react'
import NameScreen from './screens/NameScreen.jsx'
import ListScreen from './screens/ListScreen.jsx'
import TeacherScreen from './screens/TeacherScreen.jsx'
import MaterialPage from './MaterialPage.jsx'
import PracticePage from './PracticePage.jsx'
import { materials } from './content.js'
import { practiceSets } from './practice.js'
import { loadLastName, saveLastName, hasProgress, loadProgress, saveProgress } from './learner.js'
import {
  advanceStage,
  areStageMaterialsComplete,
  isEverythingComplete,
  isMaterialComplete,
  isPracticeComplete,
  isStagePracticeComplete,
  practiceItemKey,
  stageHasPractice,
} from './progress.js'
import { STAGE_COUNT } from './stages.js'
import {
  PRACTICE_DONE,
  ROUTE_DONE,
  lockedPracticeMessage,
  lockedStageMessage,
  materialsDoneMessage,
  stageOpenedMessage,
} from './messages.js'
import { log, setLogContext } from './log.js'

const BUILD_TIME = __BUILD_TIME__

function formatBuildTime(iso) {
  try {
    return new Date(iso).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
  } catch {
    return iso
  }
}

// What "Bước tiếp theo" points to from a material. On any material but the last of its stage,
// this is always the next material in the same stage. On the last material of a stage that has
// practice, it is that stage's practice instead of the next stage's first material, since the
// practice is what actually opens the next stage. A stage with no practice file keeps pointing
// at the next stage's first material.
export function nextStepFor(material) {
  const sameStage = materials
    .filter((m) => m.stage === material.stage)
    .sort((a, b) => a.material_id - b.material_id)
  const idx = sameStage.findIndex((m) => m.material_id === material.material_id)
  if (idx < sameStage.length - 1) return { kind: 'material', material: sameStage[idx + 1] }

  if (stageHasPractice(material.stage)) {
    return { kind: 'practice', stage: material.stage }
  }

  // Whatever stage the remaining materials start, rather than "this stage plus one", so the
  // last material of the last stage finds nothing and the button is not rendered at all.
  const later = materials
    .filter((m) => m.stage > material.stage)
    .sort((a, b) => a.material_id - b.material_id)
  return later[0] ? { kind: 'material', material: later[0] } : null
}

export default function App() {
  const [learner, setLearner] = useState(null)
  const [screen, setScreen] = useState('name')
  const [currentMaterialId, setCurrentMaterialId] = useState(null)
  const [currentPracticeId, setCurrentPracticeId] = useState(null)
  const [lockMessage, setLockMessage] = useState(null)
  const [highlightStage, setHighlightStage] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    if (params.has('giao-vien')) {
      setScreen('teacher')
      return
    }

    const gdRaw = params.get('gd')
    const hvRaw = params.get('hv')
    const gdValid =
      gdRaw !== null &&
      /^\d+$/.test(gdRaw) &&
      Number(gdRaw) >= 1 &&
      Number(gdRaw) <= STAGE_COUNT
    const nameFromLink = hvRaw !== null ? hvRaw.trim() : ''

    if (gdValid && nameFromLink.length > 0) {
      const gd = Number(gdRaw)
      const existed = hasProgress(nameFromLink)
      const previous = loadProgress(nameFromLink)
      const current_stage = existed ? Math.max(previous.current_stage, gd) : gd
      const correct = existed ? previous.correct : {}
      const practice = existed ? previous.practice : {}

      saveLastName(nameFromLink)
      saveProgress(nameFromLink, { current_stage, correct, practice })
      setLearner({ name: nameFromLink, current_stage, correct, practice })
      setScreen('list')
      setLogContext(nameFromLink, current_stage)
      log('open')
      log('placed', { stage: current_stage })
      window.history.replaceState(null, '', window.location.pathname)
      return
    }

    const lastName = loadLastName()
    if (lastName) {
      const progress = loadProgress(lastName)
      setLearner({ name: lastName, ...progress })
      setScreen('list')
      setLogContext(lastName, progress.current_stage)
      log('open')
    }
  }, [])

  function handleStart(name) {
    const trimmed = name.trim()
    const progress = loadProgress(trimmed)
    saveLastName(trimmed)
    saveProgress(trimmed, progress)
    setLearner({ name: trimmed, ...progress })
    setCurrentMaterialId(null)
    setLockMessage(null)
    setScreen('list')
    setLogContext(trimmed, progress.current_stage)
    log('open')
  }

  function handleSwitchLearner() {
    setCurrentMaterialId(null)
    setLockMessage(null)
    setScreen('name')
  }

  function handleAnswerPick(materialId, itemId, choiceKey, isCorrect) {
    if (learner) {
      setLogContext(learner.name, learner.current_stage)
      log('answer', { material: materialId, item: itemId, choice: choiceKey, correct: isCorrect })
    }
    if (!isCorrect) return

    setLearner((prev) => {
      if (!prev) return prev
      const key = `${materialId}:${itemId}`
      if (prev.correct[key]) return prev
      const correct = { ...prev.correct, [key]: true }

      const material = materials.find((m) => m.material_id === materialId)
      const wasMaterialComplete = material ? isMaterialComplete(material, prev.correct) : false
      const isNowMaterialComplete = material ? isMaterialComplete(material, correct) : false

      // For a stage that has practice this can no longer move the learner on: advanceStage
      // reads the practice for those stages. A stage without any practice still advances here.
      const current_stage = advanceStage(prev.current_stage, correct, prev.practice)
      saveProgress(prev.name, { current_stage, correct, practice: prev.practice })

      if (!wasMaterialComplete && isNowMaterialComplete) {
        setLogContext(prev.name, current_stage)
        log('material_done', { material: materialId })
      }
      if (current_stage > prev.current_stage) {
        setLogContext(prev.name, current_stage)
        log('stage_up', { stage: current_stage })
      }

      return { name: prev.name, current_stage, correct, practice: prev.practice }
    })
  }

  // Called when the learner moves past a practice question, which every question type allows
  // only after a correct answer. Held per item, so "Làm lại" replays without clearing anything.
  function handlePracticeItemDone(practiceSet, itemId) {
    setLearner((prev) => {
      if (!prev) return prev
      const key = practiceItemKey(practiceSet, itemId)
      if (prev.practice[key]) return prev
      const practice = { ...prev.practice, [key]: true }

      const current_stage = advanceStage(prev.current_stage, prev.correct, practice)
      saveProgress(prev.name, { current_stage, correct: prev.correct, practice })

      if (current_stage > prev.current_stage) {
        setLogContext(prev.name, current_stage)
        log('stage_up', { stage: current_stage })
      }

      return { name: prev.name, current_stage, correct: prev.correct, practice }
    })
  }

  function showNotice(text) {
    setLockMessage({ text })
  }

  function openMaterial(material) {
    if (!learner) return
    if (material.stage > learner.current_stage) {
      showNotice(lockedStageMessage(material.stage, learner.current_stage))
      setLogContext(learner.name, learner.current_stage)
      log('locked_click', { material: material.material_id })
      return
    }
    setLockMessage(null)
    setCurrentMaterialId(material.material_id)
    setScreen('material')
  }

  function backToList() {
    setLockMessage(null)
    setHighlightStage(null)
    setScreen('list')
  }

  // From the last material of a stage that has practice: same destination as "Về danh sách",
  // but scrolled to and briefly highlighting that stage's practice section. The stage is always
  // the material's own stage, so it is openable whenever the material was, but the same locked
  // refusal covers the rare case where it is not.
  function goToStagePractice(stage) {
    if (!learner) return
    if (stage > learner.current_stage) {
      showNotice(lockedPracticeMessage(stage, learner.current_stage))
      setLogContext(learner.name, learner.current_stage)
      log('practice_locked_click', { practice: stage })
      return
    }
    setLockMessage(null)
    setHighlightStage(stage)
    setScreen('list')
  }

  // A practice is openable exactly when its own stage is, the same test the materials use.
  // It cannot wait for the stage to be finished, because finishing it is what finishes the stage.
  function openPractice(set) {
    if (!learner) return
    if (set.stage > learner.current_stage) {
      showNotice(lockedPracticeMessage(set.stage, learner.current_stage))
      setLogContext(learner.name, learner.current_stage)
      log('practice_locked_click', { practice: set.practice_id })
      return
    }
    setLockMessage(null)
    setCurrentPracticeId(set.practice_id)
    setScreen('practice')
  }

  useEffect(() => {
    // The stage-practice destination scrolls itself to the stage card; scrolling to the top
    // first would only be undone a moment later.
    if (screen === 'list' && highlightStage) return
    window.scrollTo(0, 0)
  }, [screen, currentMaterialId, currentPracticeId, highlightStage])

  const currentMaterial = materials.find((m) => m.material_id === currentMaterialId)
  const currentPracticeSet = practiceSets.find((p) => p.practice_id === currentPracticeId)

  // The line under a material, once every question in its stage is answered. It only appears
  // when the practice that actually opens the next stage is still outstanding, and only on a
  // material that has no "Bước tiếp theo" of its own to say so: the last material of the stage
  // already names the same practice next to its own button, so showing this line there too
  // would just repeat it.
  function stageNoteFor(material) {
    if (!learner) return null
    if (nextStepFor(material)?.kind === 'practice') return null
    if (!areStageMaterialsComplete(material.stage, learner.correct)) return null
    if (!stageHasPractice(material.stage)) return null
    if (isStagePracticeComplete(material.stage, learner.practice)) return null
    return materialsDoneMessage(material.stage)
  }

  // What the practice screen says once its last question is answered.
  function practiceNoteFor(set) {
    if (!learner) return PRACTICE_DONE
    if (!isPracticeComplete(set, learner.practice)) return PRACTICE_DONE
    if (!isStagePracticeComplete(set.stage, learner.practice)) return PRACTICE_DONE
    if (set.stage >= STAGE_COUNT) return ROUTE_DONE
    return stageOpenedMessage(set.stage)
  }

  return (
    <div className="page">
      {screen === 'teacher' && <TeacherScreen materials={materials} />}
      {screen === 'name' && <NameScreen onStart={handleStart} />}
      {screen === 'list' && learner && (
        <ListScreen
          learner={learner}
          materials={materials}
          practiceSets={practiceSets}
          onOpenMaterial={openMaterial}
          onOpenPractice={openPractice}
          onSwitchLearner={handleSwitchLearner}
          notice={lockMessage}
          onDismissNotice={() => setLockMessage(null)}
          highlightStage={highlightStage}
          onHighlightDone={() => setHighlightStage(null)}
        />
      )}
      {screen === 'material' && learner && currentMaterial && (
        <MaterialPage
          key={currentMaterial.material_id}
          material={currentMaterial}
          stageMaterials={materials.filter((m) => m.stage === currentMaterial.stage)}
          onBack={backToList}
          nextStep={nextStepFor(currentMaterial)}
          onOpenMaterial={openMaterial}
          onGoToStagePractice={goToStagePractice}
          correct={learner.correct}
          onAnswerPick={handleAnswerPick}
          allStagesDone={isEverythingComplete(learner.correct, learner.practice)}
          stageNote={stageNoteFor(currentMaterial)}
          notice={lockMessage}
          onDismissNotice={() => setLockMessage(null)}
        />
      )}
      {screen === 'practice' && learner && currentPracticeSet && (
        <PracticePage
          key={currentPracticeSet.practice_id}
          practiceSet={currentPracticeSet}
          onBack={backToList}
          onItemDone={handlePracticeItemDone}
          finishedNote={practiceNoteFor(currentPracticeSet)}
        />
      )}
    </div>
  )
}
