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
      if (slide === 2 && attempt === 1) {
        const structure = await page.evaluate(() => ({
          url: location.href,
          viewport: { width: innerWidth, height: innerHeight },
          center: document.elementFromPoint(innerWidth / 2, innerHeight / 2)?.outerHTML?.slice(0, 450),
          roots: [...document.querySelectorAll('.anm')].slice(0, 25).map(e => ({
            number: e.querySelector('.slide-n')?.textContent?.trim(),
            heading: e.querySelector('h1')?.textContent,
            rect: (() => { const r = e.getBoundingClientRect(); return { x:r.x, y:r.y, w:r.width, h:r.height } })(),
            parents: (() => { let n=e, x=[]; for(let i=0;i<5 && n;i++,n=n.parentElement){ const r=n.getBoundingClientRect(); x.push({tag:n.tagName, cls:String(n.className).slice(0,85), w:r.width,h:r.height}) } return x })(),
          })),
        }))
        console.log('SLIDE_STRUCTURE ' + JSON.stringify(structure))
      }
      report = await page.evaluate((slide) => {
        const elements = [...document.querySelectorAll('.anm')]
        const el = elements.find(e => e.getBoundingClientRect().width > 200 && e.querySelector('.slide-n')?.textContent?.trim() === String(slide).padStart(2, '0'))
        const h = el?.querySelector('.anm-head h1')
        const rect = el?.getBoundingClientRect()
        const styles = el ? getComputedStyle(el) : null
        return {
          title: document.title,
          bodyText: el?.innerText.slice(0, 180) || '',
          slideNumber: el?.querySelector('.slide-n')?.textContent?.trim() || '',
          anmCount: elements.length,
          heading: h?.textContent || '',
          slideBox: rect ? { width: rect.width, height: rect.height } : null,
          style: styles ? { display: styles.display, opacity: styles.opacity, visibility: styles.visibility, background: styles.backgroundImage.slice(0, 90) } : null,
        }
      }, slide)
      if (report.slideNumber === String(slide).padStart(2, '0') && report.slideBox?.width > 200) break
      console.log('RETRY ' + slide + ' attempt ' + attempt)
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    const visible = !!(report?.slideNumber === String(slide).padStart(2, '0') && report.slideBox?.width > 200)
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
