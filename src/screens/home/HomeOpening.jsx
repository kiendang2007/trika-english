import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import OpeningLanding from './OpeningLanding.jsx'
import SystemSentence from './SystemSentence.jsx'
import SystemDiagram from './SystemDiagram.jsx'
import Footer from './Footer.jsx'
import { EASE, STAGE_WIDTH } from './systemLayout.js'

const DURATION = 1000
// The wide diagram is drawn for 1184px. Under this width it would shrink too far, so the
// narrow three column layout takes over.
const WIDE_MIN = 1000

function prefersReducedMotion() {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}

function layoutFor(width) {
  const mode = width >= WIDE_MIN ? 'wide' : 'narrow'
  return { mode, scale: Math.min(1, width / STAGE_WIDTH[mode]) }
}

// The home page: the landing screen, then the sentence whose ending turns the loose hanging
// words into the system tree. Motion: one 1000ms clock on cubic-bezier(0.65, 0, 0.35, 1) drives
// every word, string and fade together. With reduced motion nothing travels: the diagram fades
// out over 150ms, swaps to the tree and fades back in over 150ms, and the sentence ending
// crossfades over 300ms.
export default function HomeOpening({ buildTime, onLearnGrammar }) {
  const [progress, setProgress] = useState(0)
  const [fade, setFade] = useState(1)
  const [reduced, setReduced] = useState(prefersReducedMotion)
  const [layout, setLayout] = useState(() => layoutFor(Math.min(window.innerWidth, 1280) - 96))
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
      const next = layoutFor(inner)
      setLayout((prev) => (prev.mode === next.mode && prev.scale === next.scale ? prev : next))
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
            scale={layout.scale}
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
        <Footer buildTime={buildTime} />
      </section>
    </div>
  )
}
