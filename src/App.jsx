import { useEffect, useState } from 'react'
import ListScreen from './screens/ListScreen.jsx'
import MaterialPage from './MaterialPage.jsx'
import PracticePage from './PracticePage.jsx'
import TopBar from './components/topbar/TopBar.jsx'
import LockedSubjectPage from './screens/LockedSubjectPage.jsx'
import { materials } from './content.js'
import { practiceSets } from './practice.js'
import { STAGE_COUNT } from './stages.js'

const BUILD_TIME = __BUILD_TIME__

function formatBuildTime(iso) {
  try {
    return new Date(iso).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
  } catch {
    return iso
  }
}

// What "Bước tiếp theo" points to from a material: the next material in material_id order, which
// is the next stage's first material after the last material of a stage. Null after the very
// last material, where the page offers a way back to the trail instead.
export function nextMaterialFor(material) {
  const ordered = [...materials].sort((a, b) => a.material_id - b.material_id)
  const idx = ordered.findIndex((m) => m.material_id === material.material_id)
  return ordered[idx + 1] ?? null
}

// What the third button at the end of a practice does. The next practice of the same stage, by
// practice_id order, if there is one; otherwise the first material of the next stage, from the
// last practice of a stage. The last practice of the last stage has nothing after it, so the
// button does not render there.
export function nextPracticeStepFor(practiceSet) {
  const sameStage = practiceSets.filter((p) => p.stage === practiceSet.stage)
  const idx = sameStage.findIndex((p) => p.practice_id === practiceSet.practice_id)
  if (idx < sameStage.length - 1) return { kind: 'practice', practice: sameStage[idx + 1] }

  if (practiceSet.stage >= STAGE_COUNT) return null

  const nextStageMaterials = materials
    .filter((m) => m.stage === practiceSet.stage + 1)
    .sort((a, b) => a.material_id - b.material_id)
  return nextStageMaterials[0] ? { kind: 'material', material: nextStageMaterials[0] } : null
}

// Screens that belong to Ngữ pháp, for the active tab in the top bar.
const GRAMMAR_SCREENS = ['list', 'material', 'practice']

export default function App() {
  const [screen, setScreen] = useState('home')
  const [lockedSubject, setLockedSubject] = useState(null)
  const [currentMaterialId, setCurrentMaterialId] = useState(null)
  const [currentPracticeId, setCurrentPracticeId] = useState(null)

  // Ngữ pháp, from the top bar, the menu and the home page: the stage trail.
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
        <main className="home-placeholder">
          <button type="button" className="locked-subject-button" onClick={goToGrammar}>
            Học ngữ pháp ngay
          </button>
        </main>
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
              nextMaterial={nextMaterialFor(currentMaterial)}
              onOpenMaterial={openMaterial}
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
      <p className="build-time">Bản dựng: {formatBuildTime(BUILD_TIME)}</p>
    </>
  )
}
