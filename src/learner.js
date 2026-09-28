import { advanceStage } from './progress.js'
import { clampToStages } from './stages.js'

const LAST_KEY = 'trika:last'
const DEFAULT_PROGRESS = { current_stage: 1, correct: {} }

function progressKey(name) {
  return 'trika:' + name.trim().toLowerCase()
}

// Saved progress predates the merge into eleven stages, so a stored stage can be higher than any
// stage that exists now. Anything above the last stage is clamped down to it, the one case where
// `current_stage` is allowed to fall. `correct` is keyed by material and item and is copied
// through untouched, so nothing a learner finished is lost.
function storedStage(stage) {
  return clampToStages(typeof stage === 'number' ? stage : Number(stage))
}

export function loadLastName() {
  try {
    return localStorage.getItem(LAST_KEY)
  } catch {
    return null
  }
}

export function saveLastName(name) {
  try {
    localStorage.setItem(LAST_KEY, name)
  } catch {
    // ignore
  }
}

export function hasProgress(name) {
  try {
    return localStorage.getItem(progressKey(name)) !== null
  } catch {
    return false
  }
}

export function loadProgress(name) {
  try {
    const raw = localStorage.getItem(progressKey(name))
    if (!raw) return { ...DEFAULT_PROGRESS, correct: {} }
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed.correct !== 'object' || parsed.correct === null) {
      return { ...DEFAULT_PROGRESS, correct: {} }
    }
    const correct = { ...parsed.correct }
    return { current_stage: advanceStage(storedStage(parsed.current_stage), correct), correct }
  } catch {
    return { ...DEFAULT_PROGRESS, correct: {} }
  }
}

export function saveProgress(name, progress) {
  try {
    localStorage.setItem(progressKey(name), JSON.stringify(progress))
  } catch {
    // ignore
  }
}
