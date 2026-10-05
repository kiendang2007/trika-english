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

// Smooth scroll to the top; with reduced motion it jumps.
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}

// One plain text link in the footer: at least 44px tall, underline on hover, gold ring on focus.
function FooterLink({ className = '', onClick, children }) {
  return (
    <button type="button" className={`footer-link ${className}`.trim()} onClick={onClick}>
      {children}
    </button>
  )
}

// A heading with a thin rule under it, then its content.
function FooterGroup({ as: Tag = 'div', label, children }) {
  return (
    <Tag className="footer-group" aria-label={Tag === 'section' ? label : undefined}>
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

// The home page footer, the last thing under "Học ngữ pháp ngay". No other screen has a footer.
// A full-width Mocha đậm band: the logo lockup, then the link groups Học and Ngữ pháp (inside one
// nav) and Về trang, side by side when the footer is at least 900px wide and stacked under that,
// then the bottom bar. The Ngữ pháp group mirrors the stage list: each stage's number, then each
// of its materials as a link that opens that material.
export default function Footer({ materials, onSubject, onOpenMaterial }) {
  const stages = []
  for (let stage = 1; stage <= STAGE_COUNT; stage++) {
    stages.push({
      stage,
      materials: materials
        .filter((m) => m.stage === stage)
        .sort((a, b) => a.material_id - b.material_id),
    })
  }
  // Two sub-columns on a wide footer, the first one taking the odd stage out (6 and 5 for 11).
  const half = Math.ceil(stages.length / 2)
  const stageColumns = [stages.slice(0, half), stages.slice(half)]

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <button type="button" className="footer-home" aria-label="Trika English, trang chủ" onClick={scrollToTop}>
          <LogoMark size={40} reversed />
          <span className="top-bar-wordmark">
            <span className="top-bar-trika">Trika</span>
            <span className="top-bar-english">ENGLISH</span>
          </span>
        </button>

        <div className="footer-grid">
          <nav className="footer-nav" aria-label="Chân trang">
            <FooterGroup label="Học">
              <ul className="footer-list">
                {SUBJECTS.map((s) => (
                  <li key={s.key}>
                    <FooterLink onClick={() => onSubject(s.key)}>
                      <span>{s.label}</span>
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
                  <div key={i} className="footer-stage-column">
                    {column.map(({ stage, materials: stageMaterials }) => (
                      <div key={stage} className="footer-stage">
                        <h3 className="footer-stage-title">Giai đoạn {stage}</h3>
                        <ul className="footer-list footer-material-list">
                          {stageMaterials.map((m) => (
                            <li key={m.material_id}>
                              <FooterLink className="footer-material" onClick={() => onOpenMaterial(m)}>
                                {m.title_vi}
                              </FooterLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </FooterGroup>
          </nav>

          <FooterGroup as="section" label="Về trang">
            <p className="footer-about">Trang không lưu và không thu thập thông tin của người học.</p>
          </FooterGroup>
        </div>

        <FooterBottomBar />
      </div>
    </footer>
  )
}
