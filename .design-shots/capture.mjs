// Capture screenshots of the auth pages in every interaction state we care
// about. Run with `node .design-shots/capture.mjs` while the auth dev server
// is up on port 3004.
//
// Output files (PNG, dropped in this directory):
//   login-idle-desktop.png        — initial load, desktop
//   login-idle-mobile.png         — initial load, mobile (iPhone 12 viewport)
//   login-focus.png               — email field focused
//   login-error.png               — submit empty form, both fields show errors
//   login-loading.png             — submit valid creds, captured mid-request
//   signup-idle-desktop.png
//   signup-idle-mobile.png
//   signup-filled.png             — all 5 fields filled in, before submit
//   signup-error.png              — mismatched password confirm
//
// We use playwright directly (no test runner) so we can drive the form
// at any point in its lifecycle and pause to capture animations.

import { chromium, devices } from "/Users/sean2474/Desktop/seclub-monorepo/node_modules/.pnpm/playwright@1.60.0/node_modules/playwright/index.mjs"
import { mkdir } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = __dirname
await mkdir(outDir, { recursive: true })

const BASE = "http://localhost:3004"
const desktop = { viewport: { width: 1440, height: 900 } }
const mobile = devices["iPhone 13"]

function path(name) {
  return resolve(outDir, `${name}.png`)
}

async function shot(page, name, opts = {}) {
  await page.screenshot({ path: path(name), fullPage: opts.fullPage ?? false })
  console.log("✓", name)
}

const browser = await chromium.launch()

try {
  // ──────────────────── LOGIN ────────────────────
  {
    const ctx = await browser.newContext(desktop)
    const page = await ctx.newPage()
    await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" })
    await page.waitForTimeout(800) // let slide-up animation finish + hydration
    await shot(page, "login-idle-desktop", { fullPage: true })

    // focus state
    await page.locator("input#email, input[type=email]").first().focus()
    await page.waitForTimeout(220) // input transition 180ms
    await shot(page, "login-focus")

    // empty submit → field errors
    await page.locator("button[type=submit]").click()
    await page.waitForTimeout(360) // shake animation 320ms
    await shot(page, "login-error")

    await ctx.close()
  }
  {
    const ctx = await browser.newContext(mobile)
    const page = await ctx.newPage()
    await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" })
    await page.waitForTimeout(500)
    await shot(page, "login-idle-mobile", { fullPage: true })
    await ctx.close()
  }

  // Loading state — submit with a valid-looking but failing creds.
  // We slow the network so the spinner stays on screen long enough to capture.
  {
    const ctx = await browser.newContext(desktop)
    const page = await ctx.newPage()
    await page.route("**/auth/v1/**", async (route) => {
      await new Promise((r) => setTimeout(r, 1500))
      await route.continue()
    })
    await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" })
    await page.waitForTimeout(400)
    await page.fill("input[type=email]", "noone@example.com")
    await page.fill("input[type=password]", "wrongpass")
    await Promise.all([
      page.locator("button[type=submit]").click(),
      page.waitForTimeout(450),
    ])
    await shot(page, "login-loading")
    await ctx.close()
  }

  // ──────────────────── SIGNUP ────────────────────
  {
    const ctx = await browser.newContext(desktop)
    const page = await ctx.newPage()
    await page.goto(`${BASE}/signup`, { waitUntil: "domcontentloaded" })
    await page.waitForTimeout(500)
    await shot(page, "signup-idle-desktop", { fullPage: true })

    // filled state (still valid)
    await page.fill('input[autocomplete=name]', "이서연")
    await page.fill('input[autocomplete=tel]', "010-1234-5678")
    await page.fill("input[type=email]", "yeon@example.com")
    // both password fields
    const pwds = page.locator('input[type=password]')
    await pwds.nth(0).fill("hunter22")
    await pwds.nth(1).fill("hunter22")
    await page.waitForTimeout(150)
    await shot(page, "signup-filled", { fullPage: true })

    // mismatched confirm → error
    await pwds.nth(1).fill("different")
    await page.locator("button[type=submit]").click()
    await page.waitForTimeout(360)
    await shot(page, "signup-error", { fullPage: true })

    await ctx.close()
  }
  {
    const ctx = await browser.newContext(mobile)
    const page = await ctx.newPage()
    await page.goto(`${BASE}/signup`, { waitUntil: "domcontentloaded" })
    await page.waitForTimeout(500)
    await shot(page, "signup-idle-mobile", { fullPage: true })
    await ctx.close()
  }
} finally {
  await browser.close()
}
