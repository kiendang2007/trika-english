// Every material and practice page at five widths: horizontal page scroll, tap targets under
// 44px, and text boxes that overflow without being a scroll container. See menu.e2e.mjs.
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
  return { h: document.documentElement.scrollWidth - innerWidth, small: [...new Set(small)], over: [...new Set(over)] }
}, SEL)
let bad = 0
for (const w of [360, 375, 414, 768, 1280]) {
  const page = await (await browser.newContext({ viewport: { width: w, height: 812 } })).newPage()
  await page.goto(BASE)
  let pages = 0; const smalls = new Set(); const overs = new Set(); let maxH = 0
  const toList = async () => { await page.locator('.top-bar-menu button').click(); await page.locator('.menu-item', { hasText: 'Ngữ pháp' }).click() }
  await toList()
  const n = await page.locator('.material-link').count()
  for (let i = 0; i < n; i++) {
    await page.locator('.material-link').nth(i).click(); await page.waitForTimeout(80)
    const a = await audit(page); pages++; maxH = Math.max(maxH, a.h); a.small.forEach((x) => smalls.add(x)); a.over.forEach((x) => overs.add(x))
    await toList()
  }
  bad += maxH + smalls.size + overs.size
  console.log(`${w}px: ${pages} material/practice pages, max horizontal overflow ${maxH}px, small targets: ${smalls.size ? [...smalls].join(' | ') : 'none'}, overflowing text boxes: ${overs.size ? [...overs].join(' | ') : 'none'}`)
}
await browser.close()
process.exit(bad ? 1 : 0)
