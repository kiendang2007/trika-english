// A declarative sentence has no "." chip; a question sentence has "?" as its own chip.
// Reconstructing the built sentence has to add the missing period itself.
export function buildSentence(words) {
  const isQuestion = words[words.length - 1] === '?'
  const joined = words.join(' ')
  return isQuestion ? joined.replace(/ \?$/, '?') : joined + '.'
}
