// The four subjects in the top bar. Only Ngữ pháp has content; the other three open the
// LockedSubjectPage.
export const SUBJECTS = [
  { key: 'grammar', label: 'Ngữ pháp', locked: false },
  { key: 'pronunciation', label: 'Phát âm', locked: true },
  { key: 'vocab', label: 'Từ vựng', locked: true },
  { key: 'ielts', label: 'IELTS', locked: true },
]

export function subjectLabel(key) {
  return SUBJECTS.find((s) => s.key === key)?.label ?? ''
}
