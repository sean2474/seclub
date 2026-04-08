# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: evaluate-v2.spec.ts >> 어드민 기능 테스트 >> 토스트 메시지 이모지 없음 확인
- Location: tests/e2e/evaluate-v2.spec.ts:205:7

# Error details

```
Test timeout of 120000ms exceeded while running "beforeEach" hook.
```

```
Error: page.waitForFunction: Test timeout of 120000ms exceeded.
```

# Page snapshot

```yaml
- generic:
  - alert [ref=e1]
  - generic [active]:
    - generic [ref=e6] [cursor=pointer]:
      - button "Open Next.js Dev Tools" [ref=e7]:
        - img [ref=e8]
      - generic [ref=e11]:
        - button "Open issues overlay" [ref=e12]:
          - generic [ref=e13]:
            - generic [ref=e14]: "0"
            - generic [ref=e15]: "1"
          - generic [ref=e16]: Issue
        - button "Collapse issues badge" [ref=e17]:
          - img [ref=e18]
    - generic [ref=e22]:
      - generic [ref=e23]:
        - generic [ref=e24]:
          - navigation [ref=e25]:
            - button "previous" [disabled] [ref=e26]:
              - img "previous" [ref=e27]
            - generic [ref=e29]:
              - generic [ref=e30]: 1/
              - text: "1"
            - button "next" [disabled] [ref=e31]:
              - img "next" [ref=e32]
          - img
        - generic [ref=e34]:
          - link "Next.js 15.3.6 (outdated) Webpack" [ref=e35] [cursor=pointer]:
            - /url: https://nextjs.org/docs/messages/version-staleness
            - img [ref=e36]
            - generic "An outdated version detected (latest is 16.2.2), upgrade is highly recommended!" [ref=e38]: Next.js 15.3.6 (outdated)
            - generic [ref=e39]: Webpack
          - img
      - generic [ref=e40]:
        - dialog "Runtime Error" [ref=e41]:
          - generic [ref=e43]:
            - generic [ref=e44]:
              - generic [ref=e45]:
                - generic [ref=e46]:
                  - generic [ref=e48]: Runtime Error
                  - generic [ref=e49]:
                    - button "Copy Stack Trace" [ref=e50] [cursor=pointer]:
                      - img [ref=e51]
                    - button "No related documentation found" [disabled] [ref=e53]:
                      - img [ref=e54]
                    - link "Learn more about enabling Node.js inspector for server code with Chrome DevTools" [ref=e56] [cursor=pointer]:
                      - /url: https://nextjs.org/docs/app/building-your-application/configuring/debugging#server-side-code
                      - img [ref=e57]
                - paragraph [ref=e66]: "SyntaxError: Unexpected end of JSON input"
              - generic [ref=e68]:
                - generic [ref=e69]:
                  - paragraph [ref=e70]:
                    - text: Call Stack
                    - generic [ref=e71]: "16"
                  - button "Show 15 ignore-listed frame(s)" [ref=e72] [cursor=pointer]:
                    - text: Show 15 ignore-listed frame(s)
                    - img [ref=e73]
                - generic [ref=e75]:
                  - generic [ref=e76]: JSON.parse
                  - text: <anonymous> (0:0)
            - generic [ref=e77]:
              - generic [ref=e78]: "1"
              - generic [ref=e79]: "2"
        - contentinfo [ref=e80]:
          - paragraph [ref=e81]: This error happened while generating the page. Any console logs will be displayed in the terminal window.
          - region "Error feedback" [ref=e82]:
            - paragraph [ref=e83]:
              - link "Was this helpful?" [ref=e84] [cursor=pointer]:
                - /url: https://nextjs.org/telemetry#error-feedback
            - button "Mark as helpful" [ref=e85] [cursor=pointer]:
              - img [ref=e86]
            - button "Mark as not helpful" [ref=e89] [cursor=pointer]:
              - img [ref=e90]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | const ADMIN_EMAIL = 'sunwoojava@gmail.com';
  4   | const ADMIN_PASSWORD = 'testpassword';
  5   | const SCREENSHOT_DIR = 'tests/e2e/screenshots/evaluate-v2';
  6   | const MAIN_SITE = 'http://localhost:3002';
  7   | 
  8   | async function adminLogin(page: import('@playwright/test').Page) {
  9   |   await page.goto('/login');
  10  |   await page.waitForLoadState('networkidle');
  11  | 
  12  |   // Wait for React hydration (form element should have __reactFiber)
> 13  |   await page.waitForFunction(() => {
      |              ^ Error: page.waitForFunction: Test timeout of 120000ms exceeded.
  14  |     const form = document.querySelector('form');
  15  |     if (!form) return false;
  16  |     return Object.getOwnPropertyNames(form).some(k => k.startsWith('__reactFiber'));
  17  |   }, { timeout: 15000 });
  18  | 
  19  |   await page.locator('input#email').fill(ADMIN_EMAIL);
  20  |   await page.locator('input#password').fill(ADMIN_PASSWORD);
  21  |   await page.locator('button[type="submit"]').click();
  22  | 
  23  |   await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 30000 });
  24  |   await page.waitForLoadState('networkidle');
  25  |   await page.waitForTimeout(2000);
  26  | }
  27  | 
  28  | // ============================================================
  29  | // ADMIN FUNCTIONAL TESTS
  30  | // ============================================================
  31  | test.describe('어드민 기능 테스트', () => {
  32  |   test.setTimeout(120000);
  33  | 
  34  |   test.beforeEach(async ({ page }) => {
  35  |     await adminLogin(page);
  36  |     await page.goto('/infos/main');
  37  |     await page.waitForLoadState('networkidle');
  38  |     await page.waitForTimeout(2000);
  39  |   });
  40  | 
  41  |   test('히어로 텍스트 수정 → 저장 → 새로고침 → 유지 확인', async ({ page }) => {
  42  |     const timestamp = Date.now();
  43  |     const testTagline = `평가v2 태그 ${timestamp}`;
  44  |     const testH1 = `평가v2 제목1 ${timestamp}`;
  45  |     const testH2 = `평가v2 제목2 ${timestamp}`;
  46  |     const testBtn = `평가v2 버튼 ${timestamp}`;
  47  | 
  48  |     // Fill in test values
  49  |     await page.locator('#tagline').fill(testTagline);
  50  |     await page.locator('#headingLine1').fill(testH1);
  51  |     await page.locator('#headingLine2').fill(testH2);
  52  |     await page.locator('#buttonText').fill(testBtn);
  53  | 
  54  |     // Save
  55  |     const saveBtn = page.getByRole('button', { name: '저장' });
  56  |     await saveBtn.scrollIntoViewIfNeeded();
  57  |     await saveBtn.click();
  58  |     await page.waitForTimeout(3000);
  59  | 
  60  |     // Verify toast has no emoji
  61  |     const toastEl = page.locator('[data-sonner-toast], [role="status"], [data-radix-toast-viewport] > div').first();
  62  |     if (await toastEl.isVisible({ timeout: 3000 }).catch(() => false)) {
  63  |       const toastText = await toastEl.textContent();
  64  |       const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
  65  |       expect(toastText?.match(emojiRegex)).toBeNull();
  66  |     }
  67  | 
  68  |     // Reload and verify persistence
  69  |     await page.reload();
  70  |     await page.waitForLoadState('networkidle');
  71  |     await page.waitForTimeout(3000);
  72  | 
  73  |     await expect(page.locator('#tagline')).toHaveValue(testTagline);
  74  |     await expect(page.locator('#headingLine1')).toHaveValue(testH1);
  75  |     await expect(page.locator('#headingLine2')).toHaveValue(testH2);
  76  |     await expect(page.locator('#buttonText')).toHaveValue(testBtn);
  77  | 
  78  |     // Screenshot: hero preview with gradient
  79  |     const previewCard = page.locator('.aspect-\\[16\\/7\\]').first();
  80  |     if (await previewCard.isVisible()) {
  81  |       await previewCard.scrollIntoViewIfNeeded();
  82  |       await page.screenshot({ path: `${SCREENSHOT_DIR}/admin-hero-preview-gradient.png`, fullPage: false });
  83  |     }
  84  | 
  85  |     // Restore original values
  86  |     await page.locator('#tagline').fill('당신만의 힐링');
  87  |     await page.locator('#headingLine1').fill('SE Club에서 누리는');
  88  |     await page.locator('#headingLine2').fill('완벽한 휴식');
  89  |     await page.locator('#buttonText').fill('지금 예약하기');
  90  |     await saveBtn.scrollIntoViewIfNeeded();
  91  |     await saveBtn.click();
  92  |     await page.waitForTimeout(3000);
  93  |   });
  94  | 
  95  |   test('히어로 미리보기 그라디언트 배경 확인', async ({ page }) => {
  96  |     // Scroll to preview section
  97  |     const previewSection = page.getByText('미리보기').first();
  98  |     await previewSection.scrollIntoViewIfNeeded();
  99  |     await page.waitForTimeout(500);
  100 | 
  101 |     // Check gradient background exists (not a 404 image)
  102 |     const gradientBg = page.locator('[style*="linear-gradient"]');
  103 |     await expect(gradientBg).toBeVisible();
  104 | 
  105 |     await page.screenshot({ path: `${SCREENSHOT_DIR}/admin-hero-preview-gradient.png` });
  106 |   });
  107 | 
  108 |   test('날짜 유효성 검증 - 시작일 > 종료일 에러', async ({ page }) => {
  109 |     // Scroll to popup section
  110 |     await page.getByText('팝업/배너 관리').scrollIntoViewIfNeeded();
  111 |     await page.waitForTimeout(500);
  112 | 
  113 |     // Open new popup form
```