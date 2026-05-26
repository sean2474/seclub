// Exhaustive interaction test for apps/auth (mock mode).
// Every page, every button, every validation, both desktop + mobile.

import { chromium, devices } from "/Users/sean2474/Desktop/seclub-monorepo/node_modules/.pnpm/playwright@1.60.0/node_modules/playwright/index.mjs"
import { mkdir } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, "suite")
await mkdir(OUT, { recursive: true })

const BASE = "http://localhost:3004"
const browser = await chromium.launch()

const desktop = { viewport: { width: 1440, height: 900 } }
const mobile = devices["iPhone 13"]

let pass = 0
let fail = 0
const failures = []

function ok(msg) {
  console.log("  ✓", msg)
  pass++
}
function bad(msg, err) {
  console.log("  ✗", msg, err ? `\n      ${err}` : "")
  fail++
  failures.push(msg + (err ? ` :: ${err}` : ""))
}

async function withCtx(name, viewport, fn) {
  console.log("\n──", name, viewport === desktop ? "(desktop)" : "(mobile)")
  const ctx = await browser.newContext(viewport)
  const page = await ctx.newPage()
  page.on("pageerror", (e) => bad(`${name}: pageerror`, e.message))
  try {
    await fn(page)
  } catch (err) {
    bad(`${name} — uncaught`, err.message)
  } finally {
    await ctx.close()
  }
}

async function shot(page, name) {
  await page.screenshot({ path: resolve(OUT, `${name}.png`), fullPage: true })
}

try {
  // ─────────────────────────────────────────────────────────────
  // 1. ROOT redirect / mock landing
  // ─────────────────────────────────────────────────────────────
  await withCtx("01 root mock landing", desktop, async (page) => {
    await page.goto(BASE, { waitUntil: "domcontentloaded" })
    const url = page.url()
    if (url === `${BASE}/`) ok("mock root stays at / (login complete page)")
    else if (/\/login$/.test(url)) ok("non-mock root → /login")
    else bad("unexpected root URL", url)
    await shot(page, "01-root")
  })

  // ─────────────────────────────────────────────────────────────
  // 2. LOGIN PAGE — tab switching
  // ─────────────────────────────────────────────────────────────
  for (const [tag, vp] of [["desktop", desktop], ["mobile", mobile]]) {
    await withCtx(`02 login tab switch ${tag}`, vp, async (page) => {
      await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" })
      await page.waitForLoadState("networkidle")

      const email = page.getByRole("tab", { name: "이메일" })
      const phone = page.getByRole("tab", { name: "휴대폰" })
      if ((await email.getAttribute("aria-selected")) === "true") ok("email tab default selected")
      else bad("email tab not default")

      await phone.click()
      await page.waitForTimeout(200)
      if ((await phone.getAttribute("aria-selected")) === "true") ok("phone tab activates on click")
      else bad("phone tab did NOT activate")
      if (await page.getByRole("textbox", { name: "휴대폰 번호" }).isVisible())
        ok("phone field appears")
      else bad("phone field not visible after tab click")

      await email.click()
      await page.waitForTimeout(200)
      if ((await email.getAttribute("aria-selected")) === "true") ok("email tab re-activates")
      else bad("email tab did NOT re-activate")

      // Keyboard arrow navigation
      await email.focus()
      await page.keyboard.press("ArrowRight")
      await page.waitForTimeout(200)
      if ((await phone.getAttribute("aria-selected")) === "true") ok("ArrowRight switches to phone")
      else bad("ArrowRight did not switch tabs")
      await page.keyboard.press("ArrowLeft")
      await page.waitForTimeout(200)
      if ((await email.getAttribute("aria-selected")) === "true") ok("ArrowLeft switches back to email")
      else bad("ArrowLeft did not switch back")
      await shot(page, `02-login-tabs-${tag}`)
    })
  }

  // ─────────────────────────────────────────────────────────────
  // 3. EMAIL LOGIN validation + success
  // ─────────────────────────────────────────────────────────────
  await withCtx("03 email login validation", desktop, async (page) => {
    await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" })

    // Empty submit
    await page.getByRole("button", { name: /^로그인$/ }).click()
    await page.waitForTimeout(200)
    const emailErr = page.locator('[role="alert"]').first()
    if (await emailErr.isVisible()) ok("empty submit surfaces inline error")
    else bad("empty submit did not surface error")

    // Bad email format
    await page.getByRole("textbox", { name: "이메일" }).fill("not-an-email")
    await page.locator('input[type="password"]').fill("12345")
    await page.getByRole("button", { name: /^로그인$/ }).click()
    await page.waitForTimeout(200)
    const errText = await page.locator('[role="alert"]').first().textContent()
    if (errText && /이메일/.test(errText)) ok("invalid email format flagged")
    else bad("invalid email NOT flagged", errText)

    // Short password (mock rejects <6)
    await page.getByRole("textbox", { name: "이메일" }).fill("demo@seclub.test")
    await page.locator('input[type="password"]').fill("12345")
    await page.getByRole("button", { name: /^로그인$/ }).click()
    await page.waitForTimeout(800)
    const formErr = await page.locator('[role="alert"]').first().textContent()
    if (formErr && /비밀번호/.test(formErr)) ok("server-side short password rejected")
    else bad("short password not rejected in mock", formErr)

    // Successful login
    await page.locator('input[type="password"]').fill("longenough123")
    await page.getByRole("button", { name: /^로그인$/ }).click()
    await page.waitForURL(`${BASE}/`, { timeout: 8000 })
    ok("valid email/password → /")
  })

  // ─────────────────────────────────────────────────────────────
  // 4. PASSWORD VISIBILITY TOGGLE
  // ─────────────────────────────────────────────────────────────
  await withCtx("04 password toggle", desktop, async (page) => {
    await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" })
    const pwInput = page.locator('input[id]:has(~ button)')
    const pwField = page.locator('input[autocomplete="current-password"]')
    await pwField.fill("secret123")
    const before = await pwField.getAttribute("type")
    await page.getByLabel("비밀번호 보기").click()
    await page.waitForTimeout(150)
    const after = await pwField.getAttribute("type")
    if (before === "password" && after === "text") ok("password toggle: hide → show")
    else bad(`toggle failed (before=${before}, after=${after})`)
    await page.getByLabel("비밀번호 숨기기").click()
    await page.waitForTimeout(150)
    const after2 = await pwField.getAttribute("type")
    if (after2 === "password") ok("password toggle: show → hide")
    else bad(`toggle back failed (now=${after2})`)
  })

  // ─────────────────────────────────────────────────────────────
  // 5. PHONE OTP flow (login + signup share semantics)
  // ─────────────────────────────────────────────────────────────
  await withCtx("05 phone login OTP", desktop, async (page) => {
    await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" })
    await page.getByRole("tab", { name: "휴대폰" }).click()
    await page.getByRole("textbox", { name: "휴대폰 번호" }).fill("010-1234-5678")
    await page.getByRole("button", { name: /인증번호 받기/ }).click()
    await page.waitForSelector('input[autocomplete="one-time-code"]', { timeout: 8000 })
    ok("OTP send → OTP step renders")

    // Wrong OTP
    await page.locator('input[autocomplete="one-time-code"]').fill("000000")
    await page.getByRole("button", { name: /^로그인$/ }).click()
    await page.waitForTimeout(800)
    const otpErr = await page.locator('[role="alert"]').first().textContent()
    if (otpErr && /123456/.test(otpErr)) ok("wrong OTP rejected with demo hint")
    else bad("wrong OTP did not get demo hint", otpErr)

    // Resend button
    await page.getByRole("button", { name: /인증번호 재전송/ }).click()
    await page.waitForTimeout(700)
    ok("resend button reachable")

    // Right OTP
    await page.locator('input[autocomplete="one-time-code"]').fill("123456")
    await page.getByRole("button", { name: /^로그인$/ }).click()
    await page.waitForURL(`${BASE}/`, { timeout: 8000 })
    ok("correct OTP → /")
  })

  // ─────────────────────────────────────────────────────────────
  // 6. OAUTH BUTTONS (kakao + google)
  // ─────────────────────────────────────────────────────────────
  for (const provider of ["카카오로 계속하기", "Google로 계속하기"]) {
    await withCtx(`06 OAuth login ${provider}`, desktop, async (page) => {
      await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" })
      await page.getByRole("button", { name: provider }).click()
      await page.waitForURL(`${BASE}/`, { timeout: 8000 })
      ok(`${provider} → callback → /`)
    })
  }

  // ─────────────────────────────────────────────────────────────
  // 7. SIGNUP PICKER navigation (4 entries)
  // ─────────────────────────────────────────────────────────────
  await withCtx("07 signup picker entries", desktop, async (page) => {
    await page.goto(`${BASE}/signup`, { waitUntil: "domcontentloaded" })
    await page.waitForLoadState("networkidle")

    for (const [label, expect] of [
      ["휴대폰으로 가입", /\/signup\/phone/],
      ["이메일로 가입", /\/signup\/email/],
    ]) {
      await page.goto(`${BASE}/signup`, { waitUntil: "domcontentloaded" })
      await page.getByRole("link", { name: new RegExp(label) }).click()
      await page.waitForURL(expect, { timeout: 8000 })
      ok(`picker → ${label}`)
    }

    // Kakao + Google in picker (OAuth)
    for (const oauth of ["카카오로 가입", "Google로 가입"]) {
      await page.goto(`${BASE}/signup`, { waitUntil: "domcontentloaded" })
      await page.getByRole("button", { name: oauth }).click()
      await page.waitForURL(/\/signup\/profile/, { timeout: 8000 })
      ok(`picker OAuth → /signup/profile (${oauth})`)
    }

    // login link in footer
    await page.goto(`${BASE}/signup`, { waitUntil: "domcontentloaded" })
    await page.getByRole("link", { name: /^로그인$/ }).click()
    await page.waitForURL(/\/login/, { timeout: 8000 })
    ok("picker footer → /login")
  })

  // ─────────────────────────────────────────────────────────────
  // 8. EMAIL SIGNUP — validation + check mail
  // ─────────────────────────────────────────────────────────────
  await withCtx("08 email signup validation", mobile, async (page) => {
    await page.goto(`${BASE}/signup/email`, { waitUntil: "domcontentloaded" })
    await page.waitForLoadState("networkidle")

    // Use specific IDs since validateEmail and validatePassword both surface
    // alerts; "first()" isn't deterministic across viewports.
    await page.locator('input[type="email"]').fill("new@seclub.test")
    await page.locator('input[autocomplete="new-password"]').nth(0).fill("password1")
    await page.locator('input[autocomplete="new-password"]').nth(1).fill("differentpw")
    await page.getByRole("button", { name: /^다음$/ }).click()
    await page.waitForTimeout(400)
    const allErrs = await page.locator('[role="alert"]').allTextContents()
    if (allErrs.some((t) => /일치/.test(t))) ok("password mismatch flagged")
    else bad(`mismatch not in alerts: ${JSON.stringify(allErrs)}`)

    // success → check-mail
    await page.locator('input[autocomplete="new-password"]').nth(1).fill("password1")
    await page.getByRole("button", { name: /^다음$/ }).click()
    await page.waitForURL(/\/signup\/email\/sent/, { timeout: 10000 })
    ok("email signup → /signup/email/sent")
  })

  // ─────────────────────────────────────────────────────────────
  // 9. PHONE SIGNUP — full flow
  // ─────────────────────────────────────────────────────────────
  await withCtx("09 phone signup full", mobile, async (page) => {
    await page.goto(`${BASE}/signup/phone`, { waitUntil: "domcontentloaded" })
    await page.waitForLoadState("networkidle")
    await page.locator('input[type="tel"]').fill("010-9999-0000")
    await page.getByRole("button", { name: /인증번호 받기/ }).click()
    await page.waitForSelector('input[autocomplete="one-time-code"]', { timeout: 12000 })
    ok("phone OTP step renders")

    // "Re-enter number" link
    await page.getByRole("button", { name: /번호 다시 입력/ }).click()
    await page.waitForTimeout(200)
    if (await page.getByRole("textbox", { name: "휴대폰 번호" }).isVisible())
      ok("'번호 다시 입력' returns to phone step")
    else bad("did not return to phone step")

    // Forward again with valid OTP
    await page.locator('input[type="tel"]').fill("010-9999-0000")
    await page.getByRole("button", { name: /인증번호 받기/ }).click()
    await page.waitForSelector('input[autocomplete="one-time-code"]', { timeout: 12000 })
    await page.locator('input[autocomplete="one-time-code"]').fill("123456")
    await page.getByRole("button", { name: /^다음$/ }).click()
    await page.waitForURL(/\/signup\/profile/, { timeout: 8000 })
    ok("phone signup → /signup/profile")

    // Profile name validation
    await page.getByRole("textbox", { name: "이름" }).fill("ㄱ")
    await page.getByRole("button", { name: /가입 완료/ }).click()
    await page.waitForTimeout(400)
    const nameErr = await page.locator('[role="alert"]').first().textContent()
    if (nameErr && /이름/.test(nameErr)) ok("short name rejected")
    else bad("short name not rejected", nameErr)

    // Valid name
    await page.getByRole("textbox", { name: "이름" }).fill("홍길동")
    await page.getByRole("button", { name: /가입 완료/ }).click()
    await page.waitForURL(`${BASE}/`, { timeout: 10000 })
    ok("profile save → /")
  })

  // ─────────────────────────────────────────────────────────────
  // 10. FORGOT PASSWORD flow + footer link
  // ─────────────────────────────────────────────────────────────
  await withCtx("10 forgot password", desktop, async (page) => {
    await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" })

    // Click "비밀번호 찾기" link from email tab
    await page.getByRole("link", { name: /비밀번호 찾기/ }).click()
    await page.waitForURL(/\/forgot-password/, { timeout: 8000 })
    ok("login → forgot-password link")

    // Bad email
    await page.getByRole("textbox", { name: "이메일" }).fill("nope")
    await page.getByRole("button", { name: /재설정 링크 받기/ }).click()
    await page.waitForTimeout(300)
    const badErr = await page.locator('[role="alert"]').first().textContent()
    if (badErr && /이메일/.test(badErr)) ok("invalid email flagged on forgot")
    else bad("invalid email not flagged", badErr)

    // Good email
    await page.getByRole("textbox", { name: "이메일" }).fill("demo@seclub.test")
    await page.getByRole("button", { name: /재설정 링크 받기/ }).click()
    await page.waitForURL(/\/forgot-password\/sent/, { timeout: 8000 })
    ok("forgot → /forgot-password/sent")

    // Back link
    await page.getByRole("link", { name: /로그인으로 돌아가기/ }).click()
    await page.waitForURL(/\/login/, { timeout: 8000 })
    ok("sent → 로그인으로 돌아가기")
  })

  // ─────────────────────────────────────────────────────────────
  // 11. RESET PASSWORD flow + login banner
  // ─────────────────────────────────────────────────────────────
  await withCtx("11 reset password", desktop, async (page) => {
    await page.goto(`${BASE}/reset-password`, { waitUntil: "domcontentloaded" })
    await page.waitForLoadState("networkidle")

    // Too short
    await page.locator('input[autocomplete="new-password"]').nth(0).fill("abc")
    await page.locator('input[autocomplete="new-password"]').nth(1).fill("abc")
    await page.getByRole("button", { name: /비밀번호 변경/ }).click()
    await page.waitForTimeout(400)
    const shortAlerts = await page.locator('[role="alert"]').allTextContents()
    if (shortAlerts.some((t) => /6자/.test(t))) ok("too-short password rejected")
    else bad(`too-short not in alerts: ${JSON.stringify(shortAlerts)}`)

    // Mismatch
    await page.locator('input[autocomplete="new-password"]').nth(0).fill("brandnew1")
    await page.locator('input[autocomplete="new-password"]').nth(1).fill("nomatch12")
    await page.getByRole("button", { name: /비밀번호 변경/ }).click()
    await page.waitForTimeout(400)
    const mismatchAlerts = await page.locator('[role="alert"]').allTextContents()
    if (mismatchAlerts.some((t) => /일치/.test(t))) ok("reset mismatch flagged")
    else bad(`mismatch not in alerts: ${JSON.stringify(mismatchAlerts)}`)

    // Good → /login?reset=success
    await page.locator('input[autocomplete="new-password"]').nth(1).fill("brandnew1")
    await page.getByRole("button", { name: /비밀번호 변경/ }).click()
    await page.waitForURL(/\/login\?reset=success/, { timeout: 8000 })
    ok("reset → /login?reset=success")

    // Banner visible on /login
    const banner = page.getByRole("status").filter({ hasText: /비밀번호가 재설정/ })
    if (await banner.first().isVisible()) ok("reset banner shown on login")
    else bad("reset banner not visible")
  })

  // ─────────────────────────────────────────────────────────────
  // 12. NEXT redirect chain — login with ?next=
  // ─────────────────────────────────────────────────────────────
  await withCtx("12 next redirect chain", desktop, async (page) => {
    const dest = encodeURIComponent("http://localhost:3001/dashboard")
    await page.goto(`${BASE}/login?next=${dest}`, { waitUntil: "domcontentloaded" })

    // Footer signup link should preserve ?next=
    const signupLink = page.getByRole("link", { name: /^회원가입$/ })
    const href = await signupLink.getAttribute("href")
    if (href && /next=/.test(href)) ok("signup link preserves ?next=")
    else bad(`signup link drops next param: ${href}`)
  })

  // ─────────────────────────────────────────────────────────────
  // 13. Mobile-only header brand link
  // ─────────────────────────────────────────────────────────────
  await withCtx("13 mobile brand link", mobile, async (page) => {
    await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" })
    const link = page.getByRole("link", { name: /SE Club/ }).first()
    const href = await link.getAttribute("href")
    if (href === "/") ok(`mobile brand → /`)
    else bad(`mobile brand link href=${href}`)
  })

  // ─────────────────────────────────────────────────────────────
  // 14. Error/?error= banner
  // ─────────────────────────────────────────────────────────────
  await withCtx("14 ?error= banner", desktop, async (page) => {
    await page.goto(`${BASE}/login?error=oauth_failed`, { waitUntil: "domcontentloaded" })
    const banner = page.locator('[role="alert"]').filter({ hasText: /소셜 로그인/ })
    if (await banner.first().isVisible()) ok("?error=oauth_failed surfaces banner")
    else bad("error banner not surfaced")
  })
} finally {
  await browser.close()
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`  PASS: ${pass}    FAIL: ${fail}`)
  if (failures.length) {
    console.log("\n  Failures:")
    failures.forEach((f) => console.log(`   • ${f}`))
    process.exitCode = 1
  }
}
