// Click-through smoke test for the auth app in mock mode. Verifies that
// every primary CTA produces a state transition (no silent failures), and
// captures one before/after screenshot per flow for visual confirmation.

import { chromium, devices } from "/Users/sean2474/Desktop/seclub-monorepo/node_modules/.pnpm/playwright@1.60.0/node_modules/playwright/index.mjs"
import { mkdir } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, "mock")
await mkdir(OUT, { recursive: true })

const BASE = "http://localhost:3004"
const browser = await chromium.launch()

async function shot(page, name) {
  await page.screenshot({ path: resolve(OUT, `${name}.png`), fullPage: true })
  console.log("✓", name)
}

async function expect(cond, msg) {
  if (!cond) {
    console.error("✗", msg)
    process.exitCode = 1
  } else {
    console.log("✓", msg)
  }
}

async function withCtx(viewport, fn) {
  const ctx = await browser.newContext(viewport)
  const page = await ctx.newPage()
  try {
    await fn(page)
  } finally {
    await ctx.close()
  }
}

const desktop = { viewport: { width: 1440, height: 900 } }
const mobile = devices["iPhone 13"]

try {
  // ── 1. EMAIL LOGIN ──
  await withCtx(desktop, async (page) => {
    await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" })
    await shot(page, "01-login-initial")
    await page.getByRole("textbox", { name: "이메일" }).fill("demo@seclub.test")
    await page.locator('input[type="password"]').fill("demopw123")
    await page.getByRole("button", { name: /^로그인$/ }).click()
    await page.waitForURL(`${BASE}/`, { timeout: 12000 })
    await expect(page.url() === `${BASE}/`, "email login → landed at /")
    await shot(page, "01-login-after")
  })

  // ── 2. PHONE LOGIN (tab switch + OTP) ──
  await withCtx(desktop, async (page) => {
    await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" })
    await page.getByRole("tab", { name: "휴대폰" }).click()
    await page.getByRole("textbox", { name: "휴대폰 번호" }).fill("010-1234-5678")
    await page.getByRole("button", { name: /인증번호 받기/ }).click()
    await page.waitForSelector('input[autocomplete="one-time-code"]', { timeout: 12000 })
    await shot(page, "02-phone-otp-step")
    await page.locator('input[autocomplete="one-time-code"]').fill("123456")
    await page.getByRole("button", { name: /^로그인$/ }).click()
    await page.waitForURL(`${BASE}/`, { timeout: 12000 })
    await expect(page.url() === `${BASE}/`, "phone OTP → landed at /")
  })

  // ── 3. KAKAO OAUTH (mock) ──
  await withCtx(desktop, async (page) => {
    await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" })
    await page.getByRole("button", { name: /카카오로 계속하기/ }).click()
    await page.waitForURL(`${BASE}/`, { timeout: 12000 })
    await expect(page.url() === `${BASE}/`, "kakao OAuth (mock) → landed at /")
  })

  // ── 4. SIGNUP PICKER → EMAIL → PROFILE ──
  await withCtx(desktop, async (page) => {
    await page.goto(`${BASE}/signup`, { waitUntil: "domcontentloaded" })
    await shot(page, "04-signup-picker")
    await page.getByRole("link", { name: /이메일로 가입/ }).click()
    await page.waitForURL(/\/signup\/email/)
    await page.getByRole("textbox", { name: "이메일" }).fill("new@seclub.test")
    await page.locator('input[autocomplete="new-password"]').first().fill("strong123")
    await page.locator('input[autocomplete="new-password"]').nth(1).fill("strong123")
    await page.getByRole("button", { name: /^다음$/ }).click()
    await page.waitForURL(/\/signup\/email\/sent/, { timeout: 12000 })
    await expect(/\/signup\/email\/sent/.test(page.url()), "email signup → /signup/email/sent")
    await shot(page, "04-signup-email-sent")
  })

  // ── 5. SIGNUP PHONE FLOW ──
  await withCtx(mobile, async (page) => {
    await page.goto(`${BASE}/signup/phone`, { waitUntil: "domcontentloaded" })
    await shot(page, "05a-signup-phone-initial")
    await page.getByRole("textbox", { name: "휴대폰 번호" }).fill("010-9999-0000")
    await page.getByRole("button", { name: /인증번호 받기/ }).click()
    await page.waitForTimeout(1500)
    await shot(page, "05b-signup-phone-after-send")
    await page.waitForSelector('input[autocomplete="one-time-code"]', { timeout: 8000 })
    await page.locator('input[autocomplete="one-time-code"]').fill("123456")
    await page.getByRole("button", { name: /^다음$/ }).click()
    await page.waitForURL(/\/signup\/profile/, { timeout: 12000 })
    await expect(/\/signup\/profile/.test(page.url()), "phone signup → /signup/profile")
    await shot(page, "05-signup-profile")
    await page.getByRole("textbox", { name: "이름" }).fill("홍길동")
    await page.getByRole("button", { name: /가입 완료/ }).click()
    await page.waitForURL(`${BASE}/`, { timeout: 10000 })
    await expect(page.url() === `${BASE}/`, "profile save → landed at /")
  })

  // ── 6. FORGOT → SENT ──
  await withCtx(desktop, async (page) => {
    page.on("console", (msg) => console.log("[browser]", msg.type(), msg.text()))
    page.on("pageerror", (err) => console.log("[pageerror]", err.message))
    await page.goto(`${BASE}/forgot-password`, { waitUntil: "domcontentloaded" })
    await shot(page, "06a-forgot-initial")
    await page.getByRole("textbox", { name: "이메일" }).fill("demo@seclub.test")
    await page.getByRole("button", { name: /재설정 링크 받기/ }).click()
    await page.waitForTimeout(2000)
    await shot(page, "06b-forgot-after-click")
    console.log("URL after click:", page.url())
    await page.waitForURL(/\/forgot-password\/sent/, { timeout: 12000 })
    await expect(/\/forgot-password\/sent/.test(page.url()), "forgot → /forgot-password/sent")
    await shot(page, "06-forgot-sent")
  })

  // ── 7. RESET PASSWORD → /login?reset=success ──
  await withCtx(desktop, async (page) => {
    page.on("pageerror", (err) => console.log("[pageerror]", err.message))
    await page.goto(`${BASE}/reset-password`, { waitUntil: "domcontentloaded" })
    await shot(page, "07a-reset-initial")
    await page.locator('input[autocomplete="new-password"]').first().fill("brandnew1")
    await page.locator('input[autocomplete="new-password"]').nth(1).fill("brandnew1")
    await page.getByRole("button", { name: /비밀번호 변경/ }).click()
    await page.waitForTimeout(2000)
    await shot(page, "07b-reset-after-click")
    console.log("URL after reset click:", page.url())
    await page.waitForURL(/\/login\?reset=success/, { timeout: 12000 })
    await expect(/reset=success/.test(page.url()), "reset → /login?reset=success")
    await shot(page, "07-after-reset")
  })
} finally {
  await browser.close()
}
