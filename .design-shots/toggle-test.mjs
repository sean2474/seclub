// Probe the password visibility toggle. Logs the input's `type` attribute
// before and after clicking the eye button so we can tell whether the toggle
// actually works in the browser.

import { chromium } from "/Users/sean2474/Desktop/seclub-monorepo/node_modules/.pnpm/playwright@1.60.0/node_modules/playwright/index.mjs"

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()
page.on("console", (msg) => console.log("[browser]", msg.type(), msg.text()))

await page.goto("http://localhost:3004/login", { waitUntil: "domcontentloaded" })
await page.waitForTimeout(800)

const pwd = page.locator('input[type=password], input[type=text][autocomplete*=password]').first()
await pwd.fill("hunter22")

const initialType = await pwd.getAttribute("type")
console.log("initial type:", initialType)

// Try to click the eye toggle button (aria-label switches based on state)
const eye = page.getByRole("button", { name: /비밀번호 보기|비밀번호 숨기기/ })
console.log("eye button count:", await eye.count())
if ((await eye.count()) === 0) {
  console.log("EYE BUTTON NOT FOUND — toggle is missing in DOM")
  await page.screenshot({ path: "/Users/sean2474/Desktop/seclub-monorepo/.design-shots/toggle-debug-no-button.png" })
  await browser.close()
  process.exit(1)
}

await eye.first().click()
await page.waitForTimeout(120)
const afterClick1 = await page.locator("input").first().evaluate((el) => el.outerHTML)
const pwdAfter = page.locator('input[autocomplete*=password]').first()
const typeAfter1 = await pwdAfter.getAttribute("type")
console.log("after first click, type:", typeAfter1)

await eye.first().click()
await page.waitForTimeout(120)
const typeAfter2 = await pwdAfter.getAttribute("type")
console.log("after second click, type:", typeAfter2)

await page.screenshot({ path: "/Users/sean2474/Desktop/seclub-monorepo/.design-shots/toggle-after.png" })

await browser.close()
