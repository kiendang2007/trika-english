// A declarative sentence has no "." chip; a question sentence has "?" as its own chip.
// Reconstructing the built sentence has to add the missing period itself.
export function buildSentence(words) {
  const isQuestion = words[words.length - 1] === '?'
  const joined = words.join(' ')
  return isQuestion ? joined.replace(/ \?$/, '?') : joined + '.'
}

export const AUX_WORDS = new Set([
  'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being',
  'has', 'have', 'had',
  'do', 'does', 'did',
  'will', 'would', 'shall', 'should', 'can', 'could', 'may', 'might', 'must',
])

// The two decoys are always one spare auxiliary and one spare form of the main verb. There is
// no explicit tag per chip, so the main-verb decoy's category is inferred by sharing a stem
// with the other chips (walk/walks/walked, writ-e/-ing/-ten, clean/cleaned/cleaning).
export function classifyChip(word, decoys) {
  const w = word.toLowerCase()
  if (AUX_WORDS.has(w)) return 'aux'
  const decoyVerb = decoys.map((d) => d.toLowerCase()).find((d) => !AUX_WORDS.has(d))
  if (decoyVerb && w.length >= 4 && decoyVerb.length >= 4 && w.slice(0, 4) === decoyVerb.slice(0, 4)) {
    return 'verbform'
  }
  return null
}
