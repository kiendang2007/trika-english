import { STAGE_COUNT } from './stages.js'
import { stageHasPractice } from './progress.js'

// Every learner-facing sentence about opening, finishing or refusing a stage. Stage numbers are
// always passed in from data, never written into the text. Vietnamese only, no dashes.

// What the learner has to finish to move on, which depends on whether their stage has practice.
// `namesNextStage` spells out the stage that opens, for the cases where it is not the stage the
// learner just tapped.
function unlockClause(currentStage, namesNextStage) {
  const what = stageHasPractice(currentStage)
    ? `tất cả phần luyện tập của giai đoạn ${currentStage}`
    : `tất cả câu hỏi của giai đoạn ${currentStage}`
  return namesNextStage
    ? `Hoàn thành ${what} để mở giai đoạn ${currentStage + 1}.`
    : `Hoàn thành ${what} để mở.`
}

export function lockedStageMessage(clickedStage, currentStage) {
  return `Giai đoạn ${clickedStage} chưa mở. ${unlockClause(currentStage, clickedStage !== currentStage + 1)}`
}

export function lockedPracticeMessage(practiceStage, currentStage) {
  return `Phần luyện tập này thuộc giai đoạn ${practiceStage}, chưa mở. ${unlockClause(currentStage, true)}`
}

// Shown on the practice screen once its last question is answered.
export const PRACTICE_DONE = 'Đã làm xong phần luyện tập.'
export const ROUTE_DONE = 'Đã xong phần luyện tập cuối. Lộ trình đã hoàn thành.'

export function stageOpenedMessage(stage) {
  return `Đã xong phần luyện tập cuối của giai đoạn ${stage}. Giai đoạn ${stage + 1} đã mở.`
}

// Shown at the bottom of a material once every question in the stage is answered but the
// practice that actually opens the next stage is still outstanding.
export function materialsDoneMessage(stage) {
  const tail =
    stage >= STAGE_COUNT
      ? 'để hoàn thành lộ trình.'
      : `để mở giai đoạn ${stage + 1}.`
  return `Đã xong câu hỏi trong bài. Làm hết các phần luyện tập của giai đoạn ${stage} ${tail}`
}
