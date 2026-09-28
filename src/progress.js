import { materials, itemIdsFor } from './content.js'
import { STAGE_COUNT } from './stages.js'

export function isMaterialComplete(material, correct) {
  return itemIdsFor(material).every((id) => Boolean(correct[`${material.material_id}:${id}`]))
}

// Stage 11 holds five materials, so this is every one of them, not just the first.
export function isStageComplete(stage, correct) {
  const inStage = materials.filter((m) => m.stage === stage)
  return inStage.length > 0 && inStage.every((m) => isMaterialComplete(m, correct))
}

// Walks up from the stage given, so a learner whose stored stage was clamped down still lands on
// the first stage they have not actually finished. Tops out at FINISHED_STAGE.
export function advanceStage(currentStage, correct) {
  let stage = currentStage
  while (stage <= STAGE_COUNT && isStageComplete(stage, correct)) {
    stage += 1
  }
  return stage
}
