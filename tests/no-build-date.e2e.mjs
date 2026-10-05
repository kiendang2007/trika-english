// The learner must never see a build date or time. Visits every screen at two sizes and scans
// document.body.innerText. Also checks data-build exists on #root and is not exposed as text.
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { chromium } = require('playwright')
const BASE = process.env.BASE || 'http://localhost:4173/'
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium' })

const scan = async (page, content) => page.evaluate((content) => {
  // Allowed, explained: the locked page copy "chưa có trong phiên bản này" (this version of the
  // site, no date or time) and the English verb in the content example "build a house".
  // On material and practice pages only, the English example words "build" and "building" in
  // exercises (build (xây), the chips "The building is ...") are content, not a build stamp.
  let t = document.body.innerText.replace(/trong phiên bản này/gi, '')
  if (content) t = t.replace(/\bbuild(ing)?\b/gi, '')
  const hits = []
  if (/\b20\d{2}\b/.test(t) && /\d{1,2}:\d{2}/.test(t)) hits.push('year+time')
  for (const w of ['build', 'Bản dựng', 'Phiên bản']) if (t.toLowerCase().includes(w.toLowerCase())) hits.push(w)
  if (/\b\d{1,2}\/\d{1,2}\/\d{4}\b/.test(t)) hits.push('dd/mm/yyyy')
  if (/\b\d{4}-\d{2}-\d{2}\b/.test(t)) hits.push('yyyy-mm-dd')
  const b = document.getElementById('root').getAttribute('data-build')
  if (!b) hits.push('data-build missing')
  else if (document.documentElement.outerHTML.replace(/data-build="[^"]*"/, '').includes(b)) hits.push('build value leaked outside attribute')
  return hits
}, content)

let bad = 0
for (const [w, h] of [[1280, 800], [375, 812]]) {
  const page = await (await browser.newContext({ viewport: { width: w, height: h } })).newPage()
  await page.goto(BASE)
  const results = []
  const check = async (name, content = false) => { await page.waitForTimeout(80); const hits = await scan(page, content); if (hits.length) bad++; results.push(`${hits.length ? 'FAIL' : 'ok  '} ${name}${hits.length ? ' -> ' + hits.join(', ') : ''}`) }
  const menu = async (label) => { await page.locator('.top-bar-menu button').click(); await page.locator('.menu-item', { hasText: label }).click() }
  await check('home')
  await menu('Ngữ pháp'); await check('stage list (all stages)')
  const n = await page.locator('.material-link').count()
  for (let i = 0; i < n; i++) {
    const link = page.locator('.material-link').nth(i)
    const label = (await link.textContent()).trim().slice(0, 40)
    await link.click(); await check(`page ${i + 1}/${n} ${label}`, true)
    await menu('Ngữ pháp')
  }
  for (const s of ['Phát âm', 'Từ vựng', 'IELTS']) { await menu(s); await check(`locked ${s}`) }
  console.log(`--- ${w}x${h}: ${results.length} screens`)
  console.log(results.filter((r) => r.startsWith('FAIL')).join('\n') || 'all ok')
  console.log(results.slice(0, 3).concat(results.slice(-3)).join('\n'))
}
await browser.close()
process.exit(bad ? 1 : 0)
