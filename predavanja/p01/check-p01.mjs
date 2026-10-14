import puppeteer from 'puppeteer-core'

const base = process.env.SLIDEV_BASE || 'http://localhost:3030'
const browser = await puppeteer.launch({
  headless: true,
  executablePath: process.env.CHROME_BIN || '/usr/bin/google-chrome',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
})

let failed = false
try {
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', e => errors.push(e.message))
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
  for (const slide of [1, 2, 3, 12, 32, 39]) {
    let report
    for (let attempt = 1; attempt <= 3; attempt++) {
      await page.goto(base + '/' + slide, { waitUntil: 'domcontentloaded', timeout: 30000 })
      try {
        await page.waitForSelector('.anm', { timeout: 5000, visible: true })
      } catch {}
      report = await page.evaluate(() => {
        const el = document.querySelector('.anm')
        const h = document.querySelector('.anm-head h1')
        const rect = el?.getBoundingClientRect()
        const styles = el ? getComputedStyle(el) : null
        return {
          title: document.title,
          bodyText: document.body.innerText.slice(0, 180),
          anmCount: document.querySelectorAll('.anm').length,
          heading: h?.textContent || '',
          slideBox: rect ? { width: rect.width, height: rect.height } : null,
          style: styles ? { display: styles.display, opacity: styles.opacity, visibility: styles.visibility, background: styles.backgroundImage.slice(0, 90) } : null,
        }
      })
      if (report.anmCount > 0 && report.slideBox?.width > 200) break
      console.log('RETRY ' + slide + ' attempt ' + attempt)
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    const visible = !!(report?.anmCount > 0 && report.slideBox?.width > 200)
    console.log('SLIDE_PROBE ' + slide + ' ' + JSON.stringify({ visible, ...report }))
    if (!visible) failed = true
  }
  console.log('BROWSER_ERRORS ' + JSON.stringify(errors.slice(0, 15)))
} finally {
  await browser.close()
}
if (failed) {
  console.error('Some slides were not rendered in Chromium')
  process.exit(1)
}
