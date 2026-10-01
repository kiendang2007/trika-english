// Positions for the fifteen words of the home page diagram, in the loose layout (HangingWords)
// and in the hierarchy (SystemTree), for the wide 1184px stage and the narrow 343px stage.
// One eased value e from 0 to 1 moves every word and string between the two.

export const WORDS = [
  ['np', 'ngữ pháp', 'ngữ\npháp'],
  ['cau', 'câu', 'câu'],
  ['md', 'mệnh đề', 'mệnh\nđề'],
  ['ct', 'cụm từ', 'cụm\ntừ'],
  ['tu', 'từ', 'từ'],
  ['pa', 'phát âm', 'phát\nâm'],
  ['at', 'âm tiết', 'âm\ntiết'],
  ['am', 'âm', 'âm'],
  ['tra', 'trọng âm', 'trọng\nâm'],
  ['tv', 'từ vựng', 'từ\nvựng'],
  ['ng', 'nghĩa', 'nghĩa'],
  ['cd', 'cách đọc', 'cách\nđọc'],
  ['tdn', 'từ đồng nghĩa', 'từ đồng\nnghĩa'],
  ['ttn', 'từ trái nghĩa', 'từ trái\nnghĩa'],
  ['cdu', 'cách dùng', 'cách\ndùng'],
]

// Loose layout: [centerX, top, anchorOffsetX]. The string runs from (centerX + offset, 0) on the
// line down to the top centre of the word.
const WIDE_A = {
  np: [774, 165, -12], cau: [486, 41, -2], md: [576, 142, -9], ct: [332, 59, 1],
  tu: [706, 25, 1], pa: [88, 35, 3], at: [229, 199, 1], am: [445, 230, -16],
  tra: [1041, 296, 11], tv: [951, 133, 8], ng: [1116, 89, 0], cd: [659, 270, 8],
  tdn: [393, 318, 21], ttn: [157, 286, 16], cdu: [854, 21, -2],
}
const NARROW_A = {
  tdn: [87, 394, 40], ttn: [208, 389, 49], md: [306, 368, -11], tv: [55, 337, -16],
  tra: [158, 332, 29], cdu: [247, 327, -33], ct: [26, 280, 35], np: [130, 273, 8],
  pa: [274, 269, -32], cd: [192, 252, -29], ng: [78, 143, 13], at: [323, 142, 2],
  am: [204, 135, -2], cau: [20, 124, -2], tu: [280, 124, -3],
}

// Hierarchy. n = [x, top, size, isHead, translateX%]; s = string [x1, y1, x2, y2, opacity].
const WIDE_B = {
  sizeA: 20, h: [380, 380], trunk: [592, 0, 592, 25], spine: [951, 136, 951, 313],
  dot: [592, 30], box: [517, 160, 150, 83],
  n: {
    np: [197, 96, 28, 1], pa: [592, 96, 28, 1], tv: [987, 96, 28, 1],
    cau: [197, 160, 24], md: [197, 219, 22], ct: [197, 276, 20], tu: [197, 330, 18],
    at: [592, 170, 22], am: [592, 205, 20], tra: [592, 271, 20],
    ng: [975, 156, 20, 0, 0], cd: [975, 192, 20, 0, 0], tdn: [975, 228, 20, 0, 0],
    ttn: [975, 264, 20, 0, 0], cdu: [975, 300, 20, 0, 0],
  },
  s: {
    np: [592, 35, 197, 96], pa: [592, 35, 592, 96], tv: [592, 35, 987, 96],
    cau: [197, 132, 197, 160], md: [197, 191, 197, 219], ct: [197, 248, 197, 276],
    tu: [197, 302, 197, 330], at: [592, 132, 592, 160], am: [592, 199, 592, 205, 0],
    tra: [592, 243, 592, 271], ng: [951, 169, 971, 169], cd: [951, 205, 971, 205],
    tdn: [951, 241, 971, 241], ttn: [951, 277, 971, 277], cdu: [951, 313, 971, 313],
  },
}
const NARROW_B = {
  sizeA: 17, h: [456, 392], trunk: [171, 0, 171, 20], spine: [252, 130, 252, 350],
  dot: [171, 25], box: [131, 146, 80, 95],
  n: {
    np: [58, 72, 21, 1], pa: [171, 72, 21, 1], tv: [270, 72, 21, 1],
    cau: [58, 146, 20], md: [58, 192, 19], ct: [58, 262, 18], tu: [58, 328, 17],
    at: [171, 154, 19], am: [171, 210, 18], tra: [171, 261, 18],
    ng: [264, 142, 17, 0, 0], cd: [264, 172, 17, 0, 0], tdn: [264, 224, 17, 0, 0],
    ttn: [264, 276, 17, 0, 0], cdu: [264, 328, 17, 0, 0],
  },
  s: {
    np: [171, 30, 58, 72], pa: [171, 30, 171, 72], tv: [171, 30, 270, 72],
    cau: [58, 126, 58, 146], md: [58, 172, 58, 192], ct: [58, 242, 58, 262],
    tu: [58, 308, 58, 328], at: [171, 126, 171, 146], am: [171, 204, 171, 210, 0],
    tra: [171, 241, 171, 261], ng: [252, 153, 260, 153], cd: [252, 194, 260, 194],
    tdn: [252, 246, 260, 246], ttn: [252, 298, 260, 298], cdu: [252, 350, 260, 350],
  },
}

export const STAGE_WIDTH = { wide: 1184, narrow: 343 }

// cubic-bezier(0.65, 0, 0.35, 1), solved for y at a given x by Newton's method.
function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1
  const bx = 3 * (x2 - x1) - cx
  const ax = 1 - cx - bx
  const cy = 3 * y1
  const by = 3 * (y2 - y1) - cy
  const ay = 1 - cy - by
  return (t) => {
    if (t <= 0) return 0
    if (t >= 1) return 1
    let u = t
    for (let i = 0; i < 10; i++) {
      const x = ((ax * u + bx) * u + cx) * u - t
      const d = (3 * ax * u + 2 * bx) * u + cx
      if (Math.abs(x) < 1e-6 || Math.abs(d) < 1e-6) break
      u -= x / d
    }
    u = Math.min(1, Math.max(0, u))
    return ((ay * u + by) * u + cy) * u
  }
}

export const EASE = bezier(0.65, 0, 0.35, 1)

const lerp = (a, b, e) => a + (b - a) * e
const r2 = (n) => Math.round(n * 100) / 100

function mix(a, b, e) {
  const parse = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
  const A = parse(a)
  const B = parse(b)
  return '#' + A.map((v, i) => Math.round(lerp(v, B[i], e)).toString(16).padStart(2, '0')).join('')
}

function segment(a, b, e) {
  const x1 = lerp(a[0], b[0], e)
  const y1 = lerp(a[1], b[1], e)
  const x2 = lerp(a[2], b[2], e)
  const y2 = lerp(a[3], b[3], e)
  const opacity = lerp(a[4] ?? 1, b[4] ?? 1, e)
  return {
    left: r2(x1),
    top: r2(y1 - 0.75),
    width: r2(Math.hypot(x2 - x1, y2 - y1)),
    transform: `rotate(${r2((Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI)}deg)`,
    opacity: r2(opacity),
  }
}

// Everything the diagram draws at eased progress e, as React style objects. `width` is the
// width the stage is drawn at: only x positions scale to it, so word sizes never shrink.
export function diagramAt(mode, e, width = STAGE_WIDTH[mode]) {
  const narrow = mode === 'narrow'
  const A = narrow ? NARROW_A : WIDE_A
  const B = narrow ? NARROW_B : WIDE_B
  const k = width / STAGE_WIDTH[mode]
  const X = (x) => x * k
  const words = []
  const strings = []
  for (const [id, label, narrowLabel] of WORDS) {
    const [cxRaw, top, offRaw] = A[id]
    const cx = X(cxRaw)
    const off = X(offRaw)
    const [bxRaw, btop, bsize, head = 0, btx = -50] = B.n[id]
    const bx = X(bxRaw)
    const rotA = (Math.atan2(off, top) * 180) / Math.PI
    const size = lerp(B.sizeA, bsize, e)
    words.push({
      id,
      label: narrow ? narrowLabel : label,
      style: {
        left: r2(lerp(cx, bx, e)),
        top: r2(lerp(top, btop, e)),
        transform: `translateX(${r2(lerp(-50, btx, e))}%) rotate(${r2(lerp(rotA, 0, e))}deg)`,
        fontSize: r2(size),
        lineHeight: `${Math.round(size * 1.3)}px`,
        fontWeight: Math.round(lerp(700, head ? 800 : 700, e)),
        color: head ? mix('#2E251E', '#5B4636', e) : '#2E251E',
        textAlign: btx === 0 && e > 0.5 ? 'left' : 'center',
      },
    })
    const sb = B.s[id]
    strings.push({ id, style: segment([cx + off, 0, cx, top, 1], [X(sb[0]), sb[1], X(sb[2]), sb[3], sb[4]], e) })
  }
  const t = B.trunk
  const sp = B.spine
  strings.push({ id: 'trunk', style: segment([X(t[0]), 0, X(t[0]), 0, 0], [X(t[0]), t[1], X(t[2]), t[3]], e) })
  strings.push({ id: 'spine', style: segment([X(sp[0]), sp[1], X(sp[0]), sp[1], 0], [X(sp[0]), sp[1], X(sp[2]), sp[3]], e) })
  const [bl, bt, bw, bh] = B.box
  return {
    height: Math.round(lerp(B.h[0], B.h[1], e)),
    words,
    strings,
    dot: { left: r2(X(B.dot[0]) - 5), top: B.dot[1] - 5, opacity: r2(e) },
    box: {
      left: r2(X(bl + bw / 2) - bw / 2),
      top: bt,
      width: bw,
      height: bh,
      opacity: r2(Math.max(0, (e - 0.4) / 0.6)),
    },
  }
}
