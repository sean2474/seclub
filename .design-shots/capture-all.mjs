// Full auth-app screenshot sweep: every route × mobile + desktop, plus the
// key interactive states (tab switch, OTP step, error/loading).
//
// Run while `pnpm --filter @seclub/auth dev` is up on port 3004.

import { chromium, devices } from "/Users/sean2474/Desktop/seclub-monorepo/node_modules/.pnpm/playwright@1.60.0/node_modules/playwright/index.mjs"
import { mkdir } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = __dirname
await mkdir(OUT, { recursive: true })

const BASE = "http://localhost:3004"
const desktop = { viewport: { width: 1440, height: 900 } }
const mobile = devices["iPhone 13"]

async function shot(page, name, opts = {}) {
  await page.screenshot({ path: resolve(OUT, `${name}.png`), fullPage: opts.fullPage ?? true })
  console.log("✓", name)
}

const browser = await chromium.launch()

async function visit(viewport, name, url, prepare) {
  const ctx = await browser.newContext(viewport)
  const page = await ctx.newPage()
  await page.goto(`${BASE}${url}`, { waitUntil: "domcontentloaded" })
  await page.waitForTimeout(700)
  if (prepare) await prepare(page)
  await shot(page, name)
  await ctx.close()
}

try {
  // ─────── /login ───────
  await visit(desktop, "login-desktop", "/login")
  await visit(mobile, "login-mobile", "/login")
  await visit(desktop, "login-phone-tab-desktop", "/login", async (page) => {
    await page.getByRole("tab", { name: "휴대폰" }).click()
    await page.waitForTimeout(200)
  })
  await visit(mobile, "login-phone-tab-mobile", "/login", async (page) => {
    await page.getByRole("tab", { name: "휴대폰" }).click()
    await page.waitForTimeout(200)
  })

  // ─────── /signup picker ───────
  await visit(desktop, "signup-picker-desktop", "/signup")
  await visit(mobile, "signup-picker-mobile", "/signup")

  // ─────── /signup/email ───────
  await visit(desktop, "signup-email-desktop", "/signup/email")
  await visit(mobile, "signup-email-mobile", "/signup/email")

  // ─────── /signup/phone (input step) ───────
  await visit(desktop, "signup-phone-desktop", "/signup/phone")
  await visit(mobile, "signup-phone-mobile", "/signup/phone")

  // ─────── /forgot-password ───────
  await visit(desktop, "forgot-desktop", "/forgot-password")
  await visit(mobile, "forgot-mobile", "/forgot-password")

  // ─────── /forgot-password/sent ───────
  await visit(desktop, "forgot-sent-desktop", "/forgot-password/sent?email=you%40example.com")
  await visit(mobile, "forgot-sent-mobile", "/forgot-password/sent?email=you%40example.com")

  // ─────── /reset-password ───────
  await visit(desktop, "reset-desktop", "/reset-password")
  await visit(mobile, "reset-mobile", "/reset-password")

  // ─────── /signup/profile (will redirect if no session, but capture chrome) ───────
  await visit(desktop, "signup-profile-desktop", "/signup/profile")
  await visit(mobile, "signup-profile-mobile", "/signup/profile")

  // ─────── / (mock-mode signed-in landing) ───────
  await visit(desktop, "root-mock-desktop", "/")
  await visit(mobile, "root-mock-mobile", "/")
} finally {
  await browser.close()
}
