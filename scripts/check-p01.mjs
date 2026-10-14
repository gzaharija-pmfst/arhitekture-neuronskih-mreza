import puppeteer from 'puppeteer-core'

const browser = await puppeteer.launch({
  headless: true,
  executablePath: process.env.CHROME_BIN || '/usr/bin/google-chrome',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
})
try {
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', e => errors.push(e.message))
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
  for (const slide of [1, 2, 3, 12, 32, 39]) {
    await page.goto('http://localhost:3030/' + slide, { waitUntil: 'networkidle2', timeout: 30000 })
    const report = await page.evaluate(() => {
      const el = document.querySelector('.anm')
      const h = document.querySelector('.anm-head h1')
      const root = document.querySelector('.slidev-layout')
      const styles = el ? getComputedStyle(el) : null
      const rect = el ? el.getBoundingClientRect() : null
      return {
        title: document.title,
        text: document.body.innerText.slice(0, 180).replace(/\\n/g, ' '),
        rootCount: document.querySelectorAll('.slidev-layout').length,
        anmCount: document.querySelectorAll('.anm').length,
        heading: h?.textContent || null,
        slideBox: rect ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height } : null,
        css: styles ? { display: styles.display, opacity: styles.opacity, visibility: styles.visibility, position: styles.position, background: styles.backgroundImage.slice(0, 160) } : null,
        rootText: root?.innerText.slice(0, 120) || null,
      }
    })
    console.log('SLIDE_PROBE ' + slide + ' ' + JSON.stringify(report))
  }
  console.log('BROWSER_ERRORS ' + JSON.stringify(errors.slice(0, 15)))
} finally {
  await browser.close()
}
