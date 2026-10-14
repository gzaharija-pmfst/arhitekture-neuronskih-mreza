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
  for (const slide of [1, 2, 5, 6, 7, 8, 9, 12, 14, 19, 34, 35, 36, 37, 38, 40]) {
    let report
    for (let attempt = 1; attempt <= 3; attempt++) {
      await page.goto(base + '/' + slide, { waitUntil: 'domcontentloaded', timeout: 30000 })
      try {
        await page.waitForSelector('.anm', { timeout: 5000, visible: true })
      } catch {}
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
    if (slide === 36 && visible) {
      const getReveal = () => page.evaluate(() => {
        const active = [...document.querySelectorAll('.anm')].find(e => e.getBoundingClientRect().width > 200 && e.querySelector('.slide-n')?.textContent?.trim() === '36')
        const el = [...(active?.querySelectorAll('.panel') || [])].find(e => e.textContent.includes('Rješenje (otkrij klikom)'))
        return el ? { className: el.className, opacity: getComputedStyle(el).opacity, visibility: getComputedStyle(el).visibility } : null
      })
      const before = await getReveal()
      await page.keyboard.press('ArrowRight')
      await new Promise(resolve => setTimeout(resolve, 500))
      const after = await getReveal()
      console.log('REVEAL_36 ' + JSON.stringify({ before, after }))
      if (!before || !after || Number(after.opacity) <= Number(before.opacity)) failed = true
    }
    if (slide === 37 && visible) {
      const metrics = await page.evaluate(() => {
        const el = [...document.querySelectorAll('.anm')].find(e => e.getBoundingClientRect().width > 200)
        const root = el?.querySelector('.threshold-demo')
        const score = key => root?.querySelector('[data-testid="' + key + '"]')?.textContent?.trim()
        return { exists: !!root, tp: score('tp'), fp: score('fp'), fn: score('fn'), tn: score('tn'), accuracy: score('accuracy'), precision: score('precision'), recall: score('recall'), f1: score('f1') }
      })
      console.log('DEMO_INITIAL ' + JSON.stringify(metrics))
      if (JSON.stringify([metrics.tp,metrics.fp,metrics.fn,metrics.tn,metrics.accuracy,metrics.precision,metrics.recall,metrics.f1]) !== JSON.stringify(['4','1','16','79','83 %','80 %','20 %','32 %'])) failed = true
      await page.evaluate(() => {
        const input = document.querySelector('.threshold-demo input[type="range"]')
        if (input) {
          const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set
          setter.call(input,'0.2')
          input.dispatchEvent(new Event('input', { bubbles: true }))
          input.dispatchEvent(new Event('change', { bubbles: true }))
        }
      })
      await new Promise(resolve => setTimeout(resolve, 400))
      const changed = await page.evaluate(() => {
        const root = [...document.querySelectorAll('.anm')].find(e => e.getBoundingClientRect().width > 200)?.querySelector('.threshold-demo')
        const score = key => root?.querySelector('[data-testid="' + key + '"]')?.textContent?.trim()
        return { threshold:score('threshold-value'), tp:score('tp'), recall:score('recall') }
      })
      console.log('DEMO_CHANGED ' + JSON.stringify(changed))
      if (changed.threshold !== '0.20' || Number(changed.tp) <= 4 || changed.recall === '20 %') failed = true
    }
  }
  console.log('BROWSER_ERRORS ' + JSON.stringify(errors.slice(0, 15)))
} finally {
  await browser.close()
}
if (failed) {
  console.error('Some slides were not rendered in Chromium')
  process.exit(1)
}
