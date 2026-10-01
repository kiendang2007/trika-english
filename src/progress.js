import { materials, itemIdsFor } from './content.js'
import { practiceSets } from './practice.js'
import { STAGE_COUNT } from './stages.js'

export function isMaterialComplete(material, correct) {
  return itemIdsFor(material).every((id) => Boolean(correct[`${material.material_id}:${id}`]))
}

export function materialsForStage(stage) {
  return materials.filter((m) => m.stage === stage)
}

export function areStageMaterialsComplete(stage, correct) {
  const inStage = materialsForStage(stage)
  return inStage.length > 0 && inStage.every((m) => isMaterialComplete(m, correct))
}

// Which stages have practice is read from content/practice/, never written down here. A stage
// with no practice file keeps the old rule, so no learner can be stuck behind practice that
// does not exist.
export function practiceSetsForStage(stage) {
  return practiceSets.filter((p) => p.stage === stage)
}

export function stageHasPractice(stage) {
  return practiceSetsForStage(stage).length > 0
}

export function practiceItemKey(practiceSet, itemId) {
  return `${practiceSet.practice_id}:${itemId}`
}

// Same rule as a material: every item answered correctly at least once. Held per item, so
// "Làm lại" replays the questions without clearing anything.
export function isPracticeComplete(practiceSet, practiceCorrect) {
  return practiceSet.items.every((item) =>
    Boolean(practiceCorrect[practiceItemKey(practiceSet, item.id)]),
  )
}

export function isStagePracticeComplete(stage, practiceCorrect) {
  const sets = practiceSetsForStage(stage)
  return sets.length > 0 && sets.every((p) => isPracticeComplete(p, practiceCorrect))
}

// What opens the next stage. Practice decides it wherever practice exists; the materials only
// decide it for a stage that has none.
export function isStageComplete(stage, correct, practiceCorrect) {
  if (stageHasPractice(stage)) return isStagePracticeComplete(stage, practiceCorrect)
  return areStageMaterialsComplete(stage, correct)
}

export function isEverythingComplete(correct, practiceCorrect) {
  return isStageComplete(STAGE_COUNT, correct, practiceCorrect)
}

// Walks up from the stage given, so a learner whose stored stage was clamped down still lands on
// the first stage they have not actually finished. A stage below the one passed in is never
// looked at, which is what makes redoing an older stage change nothing. Stops at the last stage:
// finishing it has no next stage to move to, so `current_stage` never goes above STAGE_COUNT and
// never falls.
export function advanceStage(currentStage, correct, practiceCorrect) {
  let stage = currentStage
  while (stage < STAGE_COUNT && isStageComplete(stage, correct, practiceCorrect)) {
    stage += 1
  }
  return stage
}
