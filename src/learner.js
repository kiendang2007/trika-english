import { advanceStage } from './progress.js'
import { STAGE_COUNT } from './stages.js'

const LAST_KEY = 'trika:last'
const DEFAULT_PROGRESS = { current_stage: 1, correct: {} }

function progressKey(name) {
  return 'trika:' + name.trim().toLowerCase()
}

// Saved progress predates the restructure, so a stored stage can be anything up to the old 16.
// Anything above the last stage is clamped down to it; advanceStage then puts the learner back
// where the materials they have actually finished say they belong.
function clampStage(stage) {
  if (typeof stage !== 'number' || Number.isNaN(stage)) return 1
  return Math.min(Math.max(Math.round(stage), 1), STAGE_COUNT)
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
    if (!raw) return { current_stage: 1, correct: {} }
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed.correct !== 'object' || parsed.correct === null) {
      return { current_stage: 1, correct: {} }
    }
    const correct = { ...parsed.correct }
    return { current_stage: advanceStage(clampStage(parsed.current_stage), correct), correct }
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
