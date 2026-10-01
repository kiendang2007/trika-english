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
