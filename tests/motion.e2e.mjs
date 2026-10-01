// Reveal at 375 and 1280, reduced vs normal: how many times the words change position, over
// what time, and the diagram opacity curve.
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { chromium } = require('playwright')
const BASE = process.env.BASE || 'http://localhost:4173/'
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium' })
for (const w of [375, 1280]) {
  for (const reduced of [true, false]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 812 }, reducedMotion: reduced ? 'reduce' : 'no-preference' })
    const page = await ctx.newPage()
    await page.goto(BASE); await page.waitForSelector('.system-section')
    await page.locator('.system-section').scrollIntoViewIfNeeded()
    await page.waitForTimeout(200)
    const snap = () => page.evaluate(() => ({
      words: [...document.querySelectorAll('.system-word')].map((e) => { const r = e.getBoundingClientRect(); return [r.x, r.y] }),
      op: +getComputedStyle(document.querySelector('.system-diagram')).opacity,
      mode: document.querySelector('.system-section').className,
    }))
    const start = await snap()
    await page.locator('.system-sentence-more').click()
    const t0 = Date.now(); let prev = JSON.stringify(start.words); const changes = []; let maxMove = 0; let minOp = 1; let endAt = null; let last = start
    while (Date.now() - t0 < 1500) {
      const s = await snap(); const k = JSON.stringify(s.words)
      if (k !== prev) { changes.push(Date.now() - t0); prev = k }
      minOp = Math.min(minOp, s.op); last = s
      await page.waitForTimeout(10)
    }
    // Largest straight-line distance any word travelled between start and end, in px.
    maxMove = Math.max(...start.words.map((p, i) => Math.hypot(last.words[i][0] - p[0], last.words[i][1] - p[1])))
    // Distance travelled in the first frame sample after the click (are words moving while visible?)
    console.log(`${w}px ${reduced ? 'reduced' : 'normal '} [${start.mode}] position changes: ${changes.length}, first ${changes[0]}ms last ${changes[changes.length - 1]}ms; min opacity ${minOp}; end-to-end word displacement max ${maxMove.toFixed(0)}px`)
    await ctx.close()
  }
}
await browser.close()
