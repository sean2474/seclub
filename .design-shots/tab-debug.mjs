import { chromium } from "/Users/sean2474/Desktop/seclub-monorepo/node_modules/.pnpm/playwright@1.60.0/node_modules/playwright/index.mjs"

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()
page.on("console", (m) => console.log("[console]", m.type(), m.text()))
page.on("pageerror", (e) => console.log("[pageerror]", e.message))

await page.goto("http://localhost:3004/login", { waitUntil: "networkidle" })

// What does the email tab look like
const emailTab = page.getByRole("tab", { name: "이메일" })
const phoneTab = page.getByRole("tab", { name: "휴대폰" })
console.log("email aria-selected:", await emailTab.getAttribute("aria-selected"))
console.log("phone aria-selected:", await phoneTab.getAttribute("aria-selected"))

// Click phone
await phoneTab.click()
await page.waitForTimeout(500)
console.log("--- after click ---")
console.log("email aria-selected:", await emailTab.getAttribute("aria-selected"))
console.log("phone aria-selected:", await phoneTab.getAttribute("aria-selected"))
console.log("phone field visible:", await page.getByRole("textbox", { name: "휴대폰 번호" }).isVisible())

// Try clicking back
await emailTab.click()
await page.waitForTimeout(500)
console.log("--- after click email back ---")
console.log("email aria-selected:", await emailTab.getAttribute("aria-selected"))
console.log("email field visible:", await page.getByRole("textbox", { name: "이메일" }).isVisible())

await browser.close()
