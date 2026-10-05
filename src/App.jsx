import { useEffect, useState } from 'react'
import ListScreen from './screens/ListScreen.jsx'
import MaterialPage from './MaterialPage.jsx'
import PracticePage from './PracticePage.jsx'
import TopBar from './components/topbar/TopBar.jsx'
import HomeOpening from './screens/home/HomeOpening.jsx'
import LockedSubjectPage from './screens/LockedSubjectPage.jsx'
import { materials } from './content.js'
import { practiceSets, practiceSetsForStage } from './practice.js'
import { STAGE_COUNT } from './stages.js'

// Screens that belong to Ngữ pháp, for the active tab in the top bar.
const GRAMMAR_SCREENS = ['list', 'material', 'practice']

// What "Bước tiếp theo" points to from a material: the next material in the same stage. On the
// last material of a stage that has practice, the stage's first practice. Otherwise the first
// material of the next stage, or, after the last material of all, the stage list.
function nextStepFor(material) {
  const isLastOfStage = !materials.some(
    (m) => m.stage === material.stage && m.material_id > material.material_id,
  )
  const stagePractice = practiceSetsForStage(material.stage)
  if (isLastOfStage && stagePractice.length > 0) {
    return { kind: 'practice', stage: material.stage, practice: stagePractice[0] }
  }
  const later = materials
    .filter(
      (m) =>
        m.stage > material.stage ||
        (m.stage === material.stage && m.material_id > material.material_id),
    )
    .sort((a, b) => a.stage - b.stage || a.material_id - b.material_id)
  return later[0] ? { kind: 'material', material: later[0] } : { kind: 'list' }
}

// What the third button at the end of a practice does: the next practice of the same stage, by
// practice_id order, or, from the last practice of a stage, the first material of the next
// stage. The last practice of the last stage has nothing after it, so the button does not render.
function nextPracticeStepFor(practiceSet) {
  const sameStage = practiceSetsForStage(practiceSet.stage)
  const idx = sameStage.findIndex((p) => p.practice_id === practiceSet.practice_id)
  if (idx < sameStage.length - 1) return { kind: 'practice', practice: sameStage[idx + 1] }

  if (practiceSet.stage >= STAGE_COUNT) return null

  const nextStageMaterials = materials
    .filter((m) => m.stage === practiceSet.stage + 1)
    .sort((a, b) => a.material_id - b.material_id)
  return nextStageMaterials[0] ? { kind: 'material', material: nextStageMaterials[0] } : null
}

export default function App() {
  const [screen, setScreen] = useState('home')
  const [lockedSubject, setLockedSubject] = useState(null)
  const [currentMaterialId, setCurrentMaterialId] = useState(null)
  const [currentPracticeId, setCurrentPracticeId] = useState(null)

  // Ngữ pháp, from the top bar, the menu, "Học ngữ pháp ngay" and "Về Ngữ pháp".
  function goToGrammar() {
    setScreen('list')
  }

  function goHome() {
    setScreen('home')
  }

  function openSubject(key) {
    if (key === 'grammar') {
      goToGrammar()
      return
    }
    setLockedSubject(key)
    setScreen('locked')
  }

  function openMaterial(material) {
    setCurrentMaterialId(material.material_id)
    setScreen('material')
  }

  function openPractice(set) {
    setCurrentPracticeId(set.practice_id)
    setScreen('practice')
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [screen, lockedSubject, currentMaterialId, currentPracticeId])

  const currentMaterial = materials.find((m) => m.material_id === currentMaterialId)
  const currentPracticeSet = practiceSets.find((p) => p.practice_id === currentPracticeId)

  const activeSubject =
    screen === 'locked' ? lockedSubject : GRAMMAR_SCREENS.includes(screen) ? 'grammar' : ''

  return (
    <>
      <TopBar active={activeSubject} onHome={goHome} onSubject={openSubject} />
      {screen === 'home' && (
        <HomeOpening onLearnGrammar={goToGrammar} />
      )}
      {screen === 'locked' && <LockedSubjectPage subject={lockedSubject} onBack={goToGrammar} />}
      {screen !== 'home' && screen !== 'locked' && (
        <div className="page">
          {screen === 'list' && (
            <ListScreen
              materials={materials}
              practiceSets={practiceSets}
              onOpenMaterial={openMaterial}
              onOpenPractice={openPractice}
            />
          )}
          {screen === 'material' && currentMaterial && (
            <MaterialPage
              key={currentMaterial.material_id}
              material={currentMaterial}
              stageMaterials={materials.filter((m) => m.stage === currentMaterial.stage)}
              onBack={goToGrammar}
              nextStep={nextStepFor(currentMaterial)}
              onOpenMaterial={openMaterial}
              onOpenPractice={openPractice}
            />
          )}
          {screen === 'practice' && currentPracticeSet && (
            <PracticePage
              key={currentPracticeSet.practice_id}
              practiceSet={currentPracticeSet}
              onBack={goToGrammar}
              nextStep={nextPracticeStepFor(currentPracticeSet)}
              onOpenPractice={openPractice}
              onOpenMaterial={openMaterial}
            />
          )}
        </div>
      )}
    </>
  )
}
