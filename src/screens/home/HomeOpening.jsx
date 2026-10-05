import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import OpeningLanding from './OpeningLanding.jsx'
import SystemSentence from './SystemSentence.jsx'
import SystemDiagram from './SystemDiagram.jsx'
import Footer from '../../components/Footer.jsx'
import { EASE } from './systemLayout.js'

const DURATION = 1000
// From 1024px the wide diagram fills the whole content box, however wide. Under that, the
// narrow three column layout is drawn at min(content, 560).
const DESK_MIN = 1024
const NARROW_MAX = 560

function prefersReducedMotion() {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}

// Same test as the stylesheet's tiers, so the diagram and the padding switch together.
function isDesk() {
  try {
    return window.matchMedia(`(min-width: ${DESK_MIN}px)`).matches
  } catch {
    return window.innerWidth >= DESK_MIN
  }
}

function layoutFor(desk, content) {
  const mode = desk ? 'wide' : 'narrow'
  const width = mode === 'wide' ? content : Math.min(content, NARROW_MAX)
  return { mode, width: Math.round(width * 100) / 100 }
}

// The home page: the landing screen, then the sentence whose ending turns the loose hanging
// words into the system tree. Motion: one 1000ms clock on cubic-bezier(0.65, 0, 0.35, 1) drives
// every word, string and fade together. With reduced motion nothing travels: the diagram fades
// out over 150ms, swaps to the tree and fades back in over 150ms, and the sentence ending
// crossfades over 300ms. The footer is the last thing on the page, and only this screen has one.
export default function HomeOpening({ materials, onLearnGrammar, onSubject, onOpenMaterial }) {
  const [progress, setProgress] = useState(0)
  const [fade, setFade] = useState(1)
  const [reduced, setReduced] = useState(prefersReducedMotion)
  const [layout, setLayout] = useState(() =>
    layoutFor(isDesk(), window.innerWidth - 96)
  )
  const systemRef = useRef(null)
  const mainRef = useRef(null)
  const sentenceRef = useRef(null)
  const frameRef = useRef(0)
  const timerRef = useRef(0)

  useLayoutEffect(() => {
    const el = mainRef.current
    if (!el) return
    const measure = () => {
      const cs = getComputedStyle(el)
      const inner = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
      const next = layoutFor(isDesk(), inner)
      setLayout((prev) => (prev.mode === next.mode && prev.width === next.width ? prev : next))
    }
    measure()
    if (!window.ResizeObserver) return
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    let mq
    try {
      mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    } catch {
      return
    }
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener?.('change', onChange)
    return () => mq.removeEventListener?.('change', onChange)
  }, [])

  useEffect(
    () => () => {
      cancelAnimationFrame(frameRef.current)
      clearTimeout(timerRef.current)
    },
    []
  )

  function scrollToSystem() {
    systemRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  }

  function reveal() {
    if (progress > 0) return
    sentenceRef.current?.focus({ preventScroll: true })
    if (reduced) {
      setFade(0)
      timerRef.current = setTimeout(() => {
        setProgress(1)
        setFade(1)
      }, 150)
      return
    }
    const start = performance.now()
    const step = (now) => {
      const p = Math.min(1, (now - start) / DURATION)
      setProgress(p)
      if (p < 1) frameRef.current = requestAnimationFrame(step)
    }
    frameRef.current = requestAnimationFrame(step)
  }

  const eased = reduced ? progress : EASE(progress)
  const wide = layout.mode === 'wide'
  const ctaHeight = (wide ? 104 : 88) * eased

  return (
    <div className="home">
      <OpeningLanding onMore={scrollToSystem} />
      <section ref={systemRef} className={`system-section ${layout.mode}`}>
        <main ref={mainRef} className="system-main">
          <SystemSentence
            ref={sentenceRef}
            progress={progress}
            eased={eased}
            reduced={reduced}
            onPress={reveal}
          />
          <SystemDiagram
            mode={layout.mode}
            eased={eased}
            fade={fade}
            reduced={reduced}
            width={layout.width}
          />
          <div
            className="system-cta"
            style={{
              height: ctaHeight,
              opacity: eased,
              visibility: progress > 0 ? 'visible' : 'hidden',
            }}
          >
            <div className="system-cta-inner">
              <button
                type="button"
                className="home-button"
                tabIndex={progress >= 1 ? 0 : -1}
                onClick={onLearnGrammar}
              >
                Học ngữ pháp ngay
              </button>
            </div>
          </div>
        </main>
      </section>
      <Footer materials={materials} onSubject={onSubject} onOpenMaterial={onOpenMaterial} />
    </div>
  )
}
