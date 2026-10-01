// Plays every practice set with seeded random clicks (right and wrong answers, retries) and
// audits tap targets, page-level horizontal scroll and overflowing text after every click.
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { chromium } = require('playwright')
const BASE = process.env.BASE || 'http://localhost:4173/'
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium' })
const SEL = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
const audit = (page) => page.evaluate((SEL) => {
  const small = []; const over = []
  for (const el of document.querySelectorAll(SEL)) {
    const r = el.getBoundingClientRect(); const cs = getComputedStyle(el)
    if (!r.width || !r.height || cs.visibility === 'hidden') continue
    if (r.width < 44 || r.height < 44) small.push(`${el.className || el.tagName} ${Math.round(r.width)}x${Math.round(r.height)} "${el.textContent.trim().slice(0, 18)}"`)
  }
  for (const el of document.querySelectorAll('.page *')) {
    if (el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0) {
      const ox = getComputedStyle(el).overflowX
      if (ox === 'visible' || ox === 'hidden') over.push(`${el.className || el.tagName}:${el.scrollWidth}>${el.clientWidth}`)
    }
  }
  return { h: document.documentElement.scrollWidth - innerWidth, small, over }
}, SEL)
function rng(seed) { return () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296 }
let total = 0
for (const w of [360, 375, 414, 768, 1280]) {
  const page = await (await browser.newContext({ viewport: { width: w, height: 812 } })).newPage()
  await page.goto(BASE)
  const toList = async () => { await page.locator('.top-bar-menu button').click(); await page.locator('.menu-item', { hasText: 'Ngữ pháp' }).click() }
  await toList()
  const n = await page.locator('.practice-list .material-link').count()
  let clicks = 0, maxH = 0; const smalls = new Set(), overs = new Set()
  for (let i = 0; i < n; i++) {
    await page.locator('.practice-list .material-link').nth(i).click()
    const rand = rng(1000 + i + w)
    for (let step = 0; step < 40; step++) {
      const els = await page.locator('.page button:not([disabled]):not(.link-button)').elementHandles()
      if (!els.length) break
      // Prefer answer-like controls, as a learner would.
      const el = els[Math.floor(rand() * els.length)]
      await el.click({ timeout: 2000 }).catch(() => {})
      clicks++
      const a = await audit(page)
      maxH = Math.max(maxH, a.h); a.small.forEach((x) => smalls.add(x)); a.over.forEach((x) => overs.add(x))
    }
    await toList()
  }
  total += maxH + smalls.size + overs.size
  console.log(`${w}px: ${n} practice sets, ${clicks} clicks, max horizontal overflow ${maxH}px, small targets: ${smalls.size ? [...smalls].join(' | ') : 'none'}, overflowing text: ${overs.size ? [...overs].join(' | ') : 'none'}`)
}
await browser.close()
process.exit(total ? 1 : 0)
