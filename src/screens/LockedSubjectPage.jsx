import { LockOutline } from '../components/Icons.jsx'
import { subjectLabel } from '../subjects.js'

// One page for every subject that has no content yet: Phát âm, Từ vựng, IELTS.
export default function LockedSubjectPage({ subject, onBack }) {
  return (
    <div className="locked-subject">
      <main className="locked-subject-main">
        <div className="locked-subject-body">
          <div className="locked-subject-text">
            <div className="locked-subject-icon">
              <LockOutline size={28} width={1.5} />
            </div>
            <span className="locked-subject-badge">Chưa có</span>
            <h1 className="locked-subject-title">{subjectLabel(subject)}</h1>
            <p className="locked-subject-line">
              Phần này chưa có trong phiên bản này. Hiện chỉ có Ngữ pháp.
            </p>
          </div>
          <button type="button" className="locked-subject-button" onClick={onBack}>
            Về Ngữ pháp
          </button>
        </div>
      </main>
    </div>
  )
}
