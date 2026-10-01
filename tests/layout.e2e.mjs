// Layout, contrast and reduced-motion measurements. See menu.e2e.mjs for how to run.
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { chromium } = require('playwright')
const BASE = process.env.BASE || 'http://localhost:4173/'
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium' })

const lum = (c) => { const [r, g, b] = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }); return 0.2126 * r + 0.7152 * g + 0.0722 * b }
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) }
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))

const SEL = 'a[href], button, input, select, textarea, summary, [tabindex]:not([tabindex="-1"])'
async function audit(page, label) {
  return page.evaluate((SEL) => {
    const out = { overflow: document.documentElement.scrollWidth - innerWidth, small: [], wrap: [] }
    for (const el of document.querySelectorAll(SEL)) {
      if (el.closest('[inert]') && !el.closest('[role=dialog]')) continue
      const r = el.getBoundingClientRect(); const cs = getComputedStyle(el)
      if (!r.width || !r.height || cs.visibility === 'hidden' || cs.display === 'none') continue
      if (r.width < 44 || r.height < 44) out.small.push(`${(el.className || el.tagName).toString().slice(0, 40)} ${Math.round(r.width)}x${Math.round(r.height)} "${el.textContent.trim().slice(0, 20)}"`)
    }
    // Text that sticks out of its box or the viewport = a word that did not wrap.
    for (const el of document.querySelectorAll('h1,h2,h3,p,li,td,th,button,span,a')) {
      const r = el.getBoundingClientRect()
      if (r.width && r.right > innerWidth + 0.5 && !el.closest('.table-scroll,.table-wrap,[class*=scroll]')) out.wrap.push(`${el.className || el.tagName} right=${Math.round(r.right)}`)
    }
    return out
  }, SEL)
}

for (const w of [360, 375, 414, 768, 1280]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 812 } })
  const page = await ctx.newPage()
  await page.goto(BASE); await page.waitForSelector('.top-bar')
  console.log(`\n=== ${w}px ===`)
  const rep = async (name) => {
    const a = await audit(page, name)
    console.log(`${name}: hscroll overflow ${a.overflow}px; targets <44: ${a.small.length ? '\n    ' + [...new Set(a.small)].join('\n    ') : 'none'}; sticking out: ${a.wrap.length ? a.wrap.slice(0, 4).join('; ') : 'none'}`)
  }
  await rep('home (landing)')
  await page.locator('.system-section').scrollIntoViewIfNeeded()
  await page.locator('.system-sentence-more').click()
  await page.waitForTimeout(1300)
  await rep('home (revealed)')
  // Diagram words, mid-reveal sizes: measure at start too via a fresh page below.
  await page.locator('.home-button.system-cta, .system-cta .home-button').click()
  await page.waitForTimeout(150)
  await rep('stage list')
  await page.locator('.top-bar-menu button').click(); await page.waitForTimeout(250)
  await rep('menu open')
  await page.keyboard.press('Escape')
  await page.locator('.top-bar-menu button').click(); await page.locator('.menu-item', { hasText: 'IELTS' }).click(); await page.waitForTimeout(100)
  await rep('locked page')
  // First material, long Vietnamese words
  await page.locator('.top-bar-tabs, .top-bar-menu').first().evaluate(() => {})
  await page.locator('.top-bar-home').click()
  await page.locator('.system-section').scrollIntoViewIfNeeded()
  const sizes = async () => page.evaluate(() => [...document.querySelectorAll('.system-word')].map((e) => parseFloat(getComputedStyle(e).fontSize)))
  const s0 = await sizes()
  console.log(`diagram words before reveal (hanging): min font ${Math.min(...s0)}px, count ${s0.length}`)
  await page.locator('.system-sentence-more').click(); await page.waitForTimeout(1300)
  const s1 = await sizes()
  console.log(`diagram words after reveal (tree): min font ${Math.min(...s1)}px`)
  // material page
  await page.locator('.system-cta .home-button').click(); await page.waitForTimeout(150)
  const first = page.locator('.page button, .page a').first()
  await page.locator('.page').getByRole('button').first().click().catch(() => {})
  await page.waitForTimeout(150)
  await rep('after first click in list')
  await ctx.close()
}

// Contrast, from the computed styles in the browser.
{
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage()
  await page.goto(BASE); await page.waitForSelector('.top-bar')
  const css = await page.evaluate(() => {
    const rgb = (s) => s.match(/[\d.]+/g).slice(0, 3).map(Number)
    const v = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim()
    const q = (s) => document.querySelector(s)
    return {
      hint: rgb(getComputedStyle(q('.system-sentence-hint')).color),
      homeBg: rgb(getComputedStyle(document.body).backgroundColor), ivory: v('--ivory'),
      tabs: [...document.querySelectorAll('.subject-tab')].map((e) => [e.textContent.trim().slice(0, 12), getComputedStyle(e).color, e.className]),
      barBg: getComputedStyle(q('.top-bar-row')).backgroundColor,
      sandHex: v('--sand'),
    }
  })
  const rgbs = (s) => s.match(/[\d.]+/g).slice(0, 3).map(Number)
  console.log('\n=== Contrast ===')
  console.log('body background:', css.homeBg, 'ivory token', css.ivory)
  const bg = css.homeBg[0] === 0 && css.homeBg[1] === 0 ? hex(css.ivory) : css.homeBg
  console.log(`"Bấm để biết thêm" rgb(${css.hint}) on rgb(${bg}): ${ratio(css.hint, bg).toFixed(2)}:1`)
  for (const [n, c, cls] of css.tabs) console.log(`tab "${n}" (${cls}) ${c} on bar ${css.barBg}: ${ratio(rgbs(c), rgbs(css.barBg)).toFixed(2)}:1`)
}

// Reduced motion: no travel, short crossfade.
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  await page.goto(BASE); await page.waitForSelector('.top-bar')
  await page.locator('.system-section').scrollIntoViewIfNeeded()
  const snap = () => page.evaluate(() => ({
    words: [...document.querySelectorAll('.system-word')].map((e) => { const r = e.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y)] }),
    op: +getComputedStyle(document.querySelector('.system-diagram')).opacity,
  }))
  const before = await snap()
  await page.locator('.system-sentence-more').click()
  const track = []
  const t0 = Date.now()
  let prev = JSON.stringify(before.words), moves = 0, jumps = []
  while (Date.now() - t0 < 700) {
    const s = await snap(); const key = JSON.stringify(s.words)
    track.push([Date.now() - t0, +s.op.toFixed(2), key !== prev])
    if (key !== prev) { jumps.push(Date.now() - t0); prev = key }
    await page.waitForTimeout(15)
  }
  console.log('\n=== prefers-reduced-motion: reduce ===')
  console.log('word position changes (count, at ms):', jumps.length, jumps.join(','))
  console.log('diagram opacity samples (ms, opacity):', track.filter((_, i) => i % 3 === 0).slice(0, 18).map((t) => `${t[0]}:${t[1]}`).join(' '))
  const mid = track.filter((t) => t[1] > 0.02 && t[1] < 0.98)
  console.log(`opacity went to min ${Math.min(...track.map((t) => t[1]))}, intermediate samples ${mid.length}; done by ${track.find((t, i) => i > 3 && t[1] === 1 && track[i-1][1]===1)?.[0] ?? 'n/a'} ms`)
  const sent = await page.evaluate(() => getComputedStyle(document.querySelector('.system-sentence-end')).opacity)
  console.log('sentence ending opacity after:', sent)
  const cta = await page.evaluate(() => document.querySelector('.system-cta').getBoundingClientRect().height)
  console.log('cta height after:', cta)
}
await browser.close()
