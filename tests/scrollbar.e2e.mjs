// With a classic (non-overlay) scrollbar, does opening the menu shift the page behind it?
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { chromium } = require('playwright')
const BASE = process.env.BASE || 'http://localhost:4173/'
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium', ignoreDefaultArgs: ['--hide-scrollbars'] })
const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage()
await page.goto(BASE); await page.waitForSelector('.system-section')
const m = () => page.evaluate(() => {
  const t = document.querySelector('.opening-title').getBoundingClientRect()
  const d = document.querySelector('[role=dialog]')?.getBoundingClientRect()
  return { scrollbar: innerWidth - document.documentElement.clientWidth, titleX: +t.x.toFixed(1), titleW: +t.width.toFixed(1), overlayW: d ? d.width : null, vw: innerWidth }
})
await page.evaluate(() => window.scrollTo(0, 0))
const before = await m()
await page.locator('.top-bar-menu button').click(); await page.waitForTimeout(300)
const open = await m()
await page.keyboard.press('Escape'); await page.waitForTimeout(200)
const after = await m()
console.log('before', before); console.log('open  ', open); console.log('after ', after)
// Does the diagram (ResizeObserver) re-layout while open?
await browser.close()
