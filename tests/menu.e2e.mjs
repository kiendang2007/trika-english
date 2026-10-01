// Browser checks for the menu. Run: npm run build && npx vite preview --port 4173, then
// NODE_PATH=$(npm root -g) node tests/menu.e2e.mjs   (needs Playwright; not a project dependency)
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { chromium } = require('playwright')

const BASE = process.env.BASE || 'http://localhost:4173/'
const results = []
const check = (name, ok, detail = '') => {
  results.push(ok)
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}

const browser = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium' })

for (const [w, h] of [[1280, 800], [375, 812]]) {
  console.log(`\n=== ${w}x${h} ===`)
  const page = await (await browser.newContext({ viewport: { width: w, height: h } })).newPage()
  await page.goto(BASE)
  await page.waitForSelector('.top-bar')
  const btn = page.locator('.top-bar-menu button')
  check('closed: label Mở menu, aria-expanded false',
    (await btn.getAttribute('aria-label')) === 'Mở menu' && (await btn.getAttribute('aria-expanded')) === 'false')

  // Scroll the page first so "not scrollable" is measurable.
  await page.evaluate(() => window.scrollTo(0, 300))
  const y0 = await page.evaluate(() => window.scrollY)
  await btn.click()
  const dlg = page.locator('[role=dialog]')
  await dlg.waitFor()
  await page.waitForTimeout(300)
  const m = await page.evaluate(() => {
    const d = document.querySelector('[role=dialog]')
    const r = d.getBoundingClientRect()
    const cs = getComputedStyle(d)
    const bar = document.querySelector('.top-bar')
    const top = document.elementFromPoint(innerWidth / 2, 5)
    const topBtn = document.elementFromPoint(innerWidth - 30, 32)
    return {
      box: [r.x, r.y, r.width, r.height], vw: innerWidth, vh: innerHeight, pos: cs.position,
      z: +cs.zIndex, barZ: +getComputedStyle(bar).zIndex, parentIsBody: d.parentElement === document.body,
      insideBar: bar.contains(d), name: d.getAttribute('aria-label'), modal: d.getAttribute('aria-modal'),
      topHit: d.contains(top), btnHit: d.contains(topBtn),
      ov: getComputedStyle(document.body).overflow + '/' + getComputedStyle(document.documentElement).overflow,
    }
  })
  check('overlay bbox equals viewport', m.box[0] === 0 && m.box[1] === 0 && m.box[2] === m.vw && m.box[3] === m.vh, JSON.stringify(m.box) + ` viewport ${m.vw}x${m.vh}`)
  check('position fixed', m.pos === 'fixed', m.pos)
  check('above top bar and content', m.z > m.barZ && m.topHit && m.btnHit, `z ${m.z} > bar ${m.barZ}, hit-test on overlay at top and at button spot`)
  check('sibling of bar, not inside it', m.parentIsBody && !m.insideBar)
  check('role=dialog aria-modal=true name "Menu"', m.modal === 'true' && m.name === 'Menu')
  await page.mouse.wheel(0, 600)
  await page.keyboard.press('PageDown')
  await page.waitForTimeout(150)
  const y1 = await page.evaluate(() => window.scrollY)
  check('page behind does not scroll', y1 === y0 && m.ov === 'hidden/hidden', `scrollY ${y0} -> ${y1}, overflow ${m.ov}`)
  const close = page.locator('[role=dialog] .menu-button')
  check('open: label Đóng, aria-expanded true',
    (await close.getAttribute('aria-label')) === 'Đóng' && (await close.getAttribute('aria-expanded')) === 'true')

  // Focus
  const label = () => page.evaluate(() => document.activeElement?.textContent?.trim() || document.activeElement?.getAttribute('aria-label'))
  const inDialog = () => page.evaluate(() => !!document.activeElement?.closest('[role=dialog]'))
  check('opening moves focus into the menu', await inDialog(), `focus: ${await label()}`)
  let ok = true; const seen = []
  for (let i = 0; i < 12; i++) { await page.keyboard.press('Tab'); ok &&= await inDialog(); seen.push(await label()) }
  check('Tab stays inside (12 presses)', ok, seen.slice(0, 6).join(' > '))
  ok = true
  for (let i = 0; i < 12; i++) { await page.keyboard.press('Shift+Tab'); ok &&= await inDialog() }
  check('Shift+Tab stays inside (12 presses)', ok)
  await page.keyboard.press('Escape')
  await page.waitForTimeout(100)
  check('Escape closes', (await dlg.count()) === 0)
  check('closing returns focus to menu button', await page.evaluate(() => document.activeElement === document.querySelector('.top-bar-menu button')))
  check('closed again: Mở menu / false',
    (await btn.getAttribute('aria-label')) === 'Mở menu' && (await btn.getAttribute('aria-expanded')) === 'false')
  check('page scroll restored', await page.evaluate(() => getComputedStyle(document.body).overflow !== 'hidden'))

  // Links
  for (const [name, locked] of [['Ngữ pháp', false], ['Phát âm', true], ['Từ vựng', true], ['IELTS', true]]) {
    await btn.click(); await dlg.waitFor()
    const item = page.locator('[role=dialog] .menu-item', { hasText: name })
    const txt = await item.innerText()
    const hasLock = (await item.locator('svg').count()) === 1
    check(`${name}: ${locked ? 'lock and Chưa có shown' : 'no lock'}`, locked ? hasLock && /Chưa có/.test(txt) : !hasLock && !/Chưa có/.test(txt), JSON.stringify(txt))
    await item.click()
    await page.waitForTimeout(120)
    check(`${name}: menu closes`, (await dlg.count()) === 0)
    const where = locked
      ? (await page.locator('.locked-subject-title').innerText().catch(() => '')) === name && /Chưa có/.test(await page.locator('.locked-subject-badge').innerText())
      : (await page.locator('.page').count()) === 1 && (await page.locator('.locked-subject').count()) === 0
    check(`${name}: opens ${locked ? 'locked page' : 'stage list'}`, where)
    await page.locator('.top-bar-home').click()
  }
  await page.context().close()
}
await browser.close()
console.log(`\n${results.filter(Boolean).length}/${results.length} passed`)
process.exit(results.every(Boolean) ? 0 : 1)
