import { advanceStage } from './progress.js'
import { clampToStages } from './stages.js'

const LAST_KEY = 'trika:last'
// `practice` was added on 28 September, when practice became what opens the next stage. It is a
// new field inside the object already stored at `trika:<name>`: no key is renamed, and a save
// written before that day simply has no `practice` and reads as an empty one.
const DEFAULT_PROGRESS = { current_stage: 1, correct: {}, practice: {} }

function freshProgress() {
  return { current_stage: DEFAULT_PROGRESS.current_stage, correct: {}, practice: {} }
}

function asMap(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? { ...value } : {}
}

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
    if (!raw) return freshProgress()
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed.correct !== 'object' || parsed.correct === null) {
      return freshProgress()
    }
    const correct = asMap(parsed.correct)
    const practice = asMap(parsed.practice)
    return {
      current_stage: advanceStage(storedStage(parsed.current_stage), correct, practice),
      correct,
      practice,
    }
  } catch {
    return freshProgress()
  }
}

export function saveProgress(name, progress) {
  try {
    localStorage.setItem(progressKey(name), JSON.stringify(progress))
  } catch {
    // ignore
  }
}
