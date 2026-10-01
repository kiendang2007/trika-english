import ScrollCue from './ScrollCue.jsx'

// Screen 1 of the home page: the two line headline, one button and the scroll cue. Both the
// button and the cue scroll to the system sentence below.
export default function OpeningLanding({ onMore }) {
  return (
    <section className="opening-landing">
      <div className="opening-landing-body">
        <h1 className="opening-title">
          <span>Giải quyết việc học tiếng Anh</span>
          <span className="opening-accent">một lần và mãi mãi</span>
        </h1>
        <button type="button" className="home-button opening-more" onClick={onMore}>
          Tìm hiểu thêm
        </button>
      </div>
      <ScrollCue onClick={onMore} />
    </section>
  )
}
