import { LogoMark } from './Logo.jsx'
import { LockOutline } from './Icons.jsx'
import { SUBJECTS } from '../subjects.js'
import { STAGE_COUNT } from '../stages.js'

function prefersReducedMotion() {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}

// One plain text link in the footer: at least 44px tall, underline on hover, gold ring on focus.
function FooterLink({ className = '', current, onClick, children }) {
  return (
    <button
      type="button"
      className={`footer-link ${className}`.trim()}
      aria-current={current ? 'page' : undefined}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

// A heading with a thin rule under it, then its content.
function FooterGroup({ as: Tag = 'nav', label, children }) {
  return (
    <Tag className="footer-group" aria-label={label}>
      <h2 className="footer-heading">{label}</h2>
      {children}
    </Tag>
  )
}

// A thin rule, the copyright on the left and "Lên đầu trang" on the right. On a narrow footer the
// link wraps below the copyright.
function FooterBottomBar() {
  return (
    <div className="footer-bottom">
      <span className="footer-copy">© 2026 Trika English</span>
      <FooterLink className="footer-top" onClick={scrollToTop}>
        Lên đầu trang
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M7 12V2M2.5 6.5 7 2l4.5 4.5" />
        </svg>
      </FooterLink>
    </div>
  )
}

// The one footer, rendered by the app shell as the last thing under every screen. A full-width
// Mocha đậm band: the logo lockup, then three groups (Học, Ngữ pháp, Về trang) side by side when
// the footer is at least 900px wide and stacked under that, then the bottom bar.
// `active` is the subject key of the current screen, as in the top bar. Each "Giai đoạn N" opens
// the first material of that stage; the number of stages comes from the content.
export default function Footer({ active, materials, onHome, onSubject, onOpenMaterial }) {
  const stages = []
  for (let stage = 1; stage <= STAGE_COUNT; stage++) {
    const first = materials
      .filter((m) => m.stage === stage)
      .sort((a, b) => a.material_id - b.material_id)[0]
    if (first) stages.push({ stage, first })
  }
  // Two sub-columns on a wide footer, the first one taking the odd stage out (6 and 5 for 11).
  const half = Math.ceil(stages.length / 2)
  const stageColumns = [stages.slice(0, half), stages.slice(half)]

  function goHome() {
    onHome()
    scrollToTop()
  }

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <button type="button" className="footer-home" aria-label="Trika English, trang chủ" onClick={goHome}>
          <LogoMark size={40} reversed />
          <span className="top-bar-wordmark">
            <span className="top-bar-trika">Trika</span>
            <span className="top-bar-english">ENGLISH</span>
          </span>
        </button>

        <div className="footer-grid">
          <FooterGroup label="Học">
            <ul className="footer-list">
              {SUBJECTS.map((s) => (
                <li key={s.key}>
                  <FooterLink current={active === s.key} onClick={() => onSubject(s.key)}>
                    <span className="footer-subject">{s.label}</span>
                    {s.locked && (
                      <span className="footer-lock">
                        <LockOutline size={16} />
                        Chưa có
                      </span>
                    )}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </FooterGroup>

          <FooterGroup label="Ngữ pháp">
            <div className="footer-stages">
              {stageColumns.map((column, i) => (
                <ul key={i} className="footer-list">
                  {column.map(({ stage, first }) => (
                    <li key={stage}>
                      <FooterLink className="footer-stage" onClick={() => onOpenMaterial(first)}>
                        Giai đoạn {stage}
                      </FooterLink>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </FooterGroup>

          <FooterGroup as="section" label="Về trang">
            <p className="footer-about">Trang không lưu và không thu thập thông tin của người học.</p>
          </FooterGroup>
        </div>

        <FooterBottomBar />
      </div>
    </footer>
  )
}
