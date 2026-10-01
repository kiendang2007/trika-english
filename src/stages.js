import { materials } from './content.js'

// How many stages the site shows is never written down as a number. The last stage is the
// highest `stage` in content/materials/*.json, so merging materials into one stage, or adding a
// stage, changes the site on its own. A stage value that is not a usable number is ignored
// rather than allowed to break the count.
function lastStage(list) {
  let highest = 1
  for (const material of list) {
    const stage = Number(material.stage)
    if (Number.isFinite(stage) && stage > highest) highest = Math.floor(stage)
  }
  return highest
}

export const STAGE_COUNT = lastStage(materials)

// The stages a learner can be on, 1 to STAGE_COUNT. `current_stage` never leaves this range:
// there is no stage after the last one, so finishing it advances nothing.
export function clampToStages(stage) {
  if (typeof stage !== 'number' || !Number.isFinite(stage)) return 1
  return Math.min(Math.max(Math.round(stage), 1), STAGE_COUNT)
}
