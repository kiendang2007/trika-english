// Learner-facing labels for the end of a practice. Stage numbers are passed in from data, never
// written into the text. Vietnamese only, no dashes.

// Shown on the practice screen once its last question is answered.
export const PRACTICE_DONE = 'Đã làm xong phần luyện tập.'

// The button at the end of a practice that moves the learner on: to the next practice of the
// same stage, or, from the last practice of a stage, to the next stage's first material.
export const NEXT_PRACTICE_LABEL = 'Phần luyện tập tiếp theo'

export function nextStageLabel(stage) {
  return `Học giai đoạn ${stage}`
}
