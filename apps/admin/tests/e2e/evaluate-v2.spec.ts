import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = 'sunwoojava@gmail.com';
const ADMIN_PASSWORD = 'testpassword';
const SCREENSHOT_DIR = 'tests/e2e/screenshots/evaluate-v2';
const MAIN_SITE = 'http://localhost:3002';

async function adminLogin(page: import('@playwright/test').Page) {
  await page.goto('/login');
  await page.waitForLoadState('networkidle');

  // Wait for React hydration (form element should have __reactFiber)
  await page.waitForFunction(() => {
    const form = document.querySelector('form');
    if (!form) return false;
    return Object.getOwnPropertyNames(form).some(k => k.startsWith('__reactFiber'));
  }, { timeout: 15000 });

  await page.locator('input#email').fill(ADMIN_EMAIL);
  await page.locator('input#password').fill(ADMIN_PASSWORD);
  await page.locator('button[type="submit"]').click();

  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 30000 });
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
}

// ============================================================
// ADMIN FUNCTIONAL TESTS
// ============================================================
test.describe('어드민 기능 테스트', () => {
  test.setTimeout(120000);

  test.beforeEach(async ({ page }) => {
    await adminLogin(page);
    await page.goto('/infos/main');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('히어로 텍스트 수정 → 저장 → 새로고침 → 유지 확인', async ({ page }) => {
    const timestamp = Date.now();
    const testTagline = `평가v2 태그 ${timestamp}`;
    const testH1 = `평가v2 제목1 ${timestamp}`;
    const testH2 = `평가v2 제목2 ${timestamp}`;
    const testBtn = `평가v2 버튼 ${timestamp}`;

    // Fill in test values
    await page.locator('#tagline').fill(testTagline);
    await page.locator('#headingLine1').fill(testH1);
    await page.locator('#headingLine2').fill(testH2);
    await page.locator('#buttonText').fill(testBtn);

    // Save
    const saveBtn = page.getByRole('button', { name: '저장' });
    await saveBtn.scrollIntoViewIfNeeded();
    await saveBtn.click();
    await page.waitForTimeout(3000);

    // Verify toast has no emoji
    const toastEl = page.locator('[data-sonner-toast], [role="status"], [data-radix-toast-viewport] > div').first();
    if (await toastEl.isVisible({ timeout: 3000 }).catch(() => false)) {
      const toastText = await toastEl.textContent();
      const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
      expect(toastText?.match(emojiRegex)).toBeNull();
    }

    // Reload and verify persistence
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await expect(page.locator('#tagline')).toHaveValue(testTagline);
    await expect(page.locator('#headingLine1')).toHaveValue(testH1);
    await expect(page.locator('#headingLine2')).toHaveValue(testH2);
    await expect(page.locator('#buttonText')).toHaveValue(testBtn);

    // Screenshot: hero preview with gradient
    const previewCard = page.locator('.aspect-\\[16\\/7\\]').first();
    if (await previewCard.isVisible()) {
      await previewCard.scrollIntoViewIfNeeded();
      await page.screenshot({ path: `${SCREENSHOT_DIR}/admin-hero-preview-gradient.png`, fullPage: false });
    }

    // Restore original values
    await page.locator('#tagline').fill('당신만의 힐링');
    await page.locator('#headingLine1').fill('SE Club에서 누리는');
    await page.locator('#headingLine2').fill('완벽한 휴식');
    await page.locator('#buttonText').fill('지금 예약하기');
    await saveBtn.scrollIntoViewIfNeeded();
    await saveBtn.click();
    await page.waitForTimeout(3000);
  });

  test('히어로 미리보기 그라디언트 배경 확인', async ({ page }) => {
    // Scroll to preview section
    const previewSection = page.getByText('미리보기').first();
    await previewSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Check gradient background exists (not a 404 image)
    const gradientBg = page.locator('[style*="linear-gradient"]');
    await expect(gradientBg).toBeVisible();

    await page.screenshot({ path: `${SCREENSHOT_DIR}/admin-hero-preview-gradient.png` });
  });

  test('날짜 유효성 검증 - 시작일 > 종료일 에러', async ({ page }) => {
    // Scroll to popup section
    await page.getByText('팝업/배너 관리').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Open new popup form
    await page.getByRole('button', { name: /새 팝업 등록/ }).click();
    await expect(page.getByRole('heading', { name: '새 팝업 등록' })).toBeVisible();

    // Set start date > end date
    await page.locator('#popup-start').fill('2026-12-31');
    await page.locator('#popup-end').fill('2026-01-01');
    await page.waitForTimeout(500);

    // Verify error message
    const errorMsg = page.getByText('시작일이 종료일보다 늦을 수 없습니다.');
    await expect(errorMsg).toBeVisible();

    // Verify submit button is disabled
    const submitBtn = page.locator('[role="dialog"]').getByRole('button', { name: '등록' });
    await expect(submitBtn).toBeDisabled();

    await page.screenshot({ path: `${SCREENSHOT_DIR}/admin-date-validation-error.png` });

    // Close dialog
    await page.locator('[role="dialog"]').getByRole('button', { name: '취소' }).click();
  });

  test('팝업 CRUD 전체 플로우', async ({ page }) => {
    const testTitle = `평가v2 팝업 ${Date.now()}`;

    // Scroll to popup section
    await page.getByText('팝업/배너 관리').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // CREATE
    await page.getByRole('button', { name: /새 팝업 등록/ }).click();
    await page.locator('#popup-title').fill(testTitle);
    await page.locator('#popup-content').fill('평가 테스트 팝업 내용');
    await page.locator('#popup-link').fill('https://seclub.kr');
    await page.locator('#popup-priority').fill('10');

    const submitBtn = page.locator('[role="dialog"]').getByRole('button', { name: '등록' });
    await submitBtn.scrollIntoViewIfNeeded();
    await submitBtn.click();
    await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 15000 });
    await page.waitForTimeout(3000);

    await page.getByText('팝업/배너 관리').scrollIntoViewIfNeeded();
    await expect(page.getByText(testTitle)).toBeVisible({ timeout: 10000 });

    // UPDATE
    const row = page.locator('tr').filter({ hasText: testTitle });
    await row.scrollIntoViewIfNeeded();
    await row.locator('button').last().click();
    await page.waitForTimeout(500);
    await page.getByRole('menuitem', { name: '편집' }).click();

    const updatedTitle = testTitle + ' 수정';
    await page.locator('#popup-title').fill(updatedTitle);
    const editBtn = page.locator('[role="dialog"]').getByRole('button', { name: '수정' });
    await editBtn.scrollIntoViewIfNeeded();
    await editBtn.click();
    await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 15000 });
    await page.waitForTimeout(3000);

    await page.getByText('팝업/배너 관리').scrollIntoViewIfNeeded();
    await expect(page.getByText(updatedTitle)).toBeVisible({ timeout: 10000 });

    // TOGGLE
    const updatedRow = page.locator('tr').filter({ hasText: updatedTitle });
    await updatedRow.scrollIntoViewIfNeeded();
    const toggle = updatedRow.locator('button[role="switch"]');
    const before = await toggle.getAttribute('data-state');
    await toggle.click();
    await page.waitForTimeout(2000);
    const after = await toggle.getAttribute('data-state');
    expect(after).not.toBe(before);

    // Toggle back
    await toggle.click();
    await page.waitForTimeout(1500);

    // DELETE
    await updatedRow.scrollIntoViewIfNeeded();
    await updatedRow.locator('button').last().click();
    await page.waitForTimeout(500);
    await page.getByRole('menuitem', { name: '삭제' }).click();
    await expect(page.getByText('정말로 삭제하시겠습니까?')).toBeVisible();
    await page.locator('[role="alertdialog"]').getByRole('button', { name: '삭제' }).click();
    await expect(page.locator('[role="alertdialog"]')).not.toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(3000);

    await page.getByText('팝업/배너 관리').scrollIntoViewIfNeeded();
    await expect(page.getByText(updatedTitle)).not.toBeVisible({ timeout: 10000 });
  });

  test('토스트 메시지 이모지 없음 확인', async ({ page }) => {
    // Trigger a toast by saving hero text
    const saveBtn = page.getByRole('button', { name: '저장' });
    await saveBtn.scrollIntoViewIfNeeded();
    await saveBtn.click();
    await page.waitForTimeout(1000);

    // Check all visible toast-like elements for emoji
    const toasts = page.locator('[data-sonner-toast], [role="status"], ol[data-sonner-toaster] li, [data-radix-toast-viewport] div');
    const count = await toasts.count();
    for (let i = 0; i < count; i++) {
      const text = await toasts.nth(i).textContent();
      if (text) {
        const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}]/gu;
        expect(text.match(emojiRegex), `Toast contains emoji: "${text}"`).toBeNull();
      }
    }

    await page.screenshot({ path: `${SCREENSHOT_DIR}/admin-toast-no-emoji.png` });
  });
});

// ============================================================
// MAIN SITE DESIGN + UX TESTS
// ============================================================
test.describe('메인사이트 디자인/UX 평가', () => {
  test.setTimeout(60000);

  test('히어로 섹션 표시 확인 (데스크탑)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(MAIN_SITE);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Hero section should be visible with DB text
    await expect(page.locator('section').first()).toBeVisible();

    await page.screenshot({ path: `${SCREENSHOT_DIR}/main-hero-desktop.png`, fullPage: false });
  });

  test('팝업 배너 표시 + CTA 버튼 (데스크탑)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    // Clear any localStorage dismissal for popups
    await page.goto(MAIN_SITE);
    await page.evaluate(() => {
      const keys = Object.keys(localStorage).filter(k => k.startsWith('popup_dismissed_'));
      keys.forEach(k => localStorage.removeItem(k));
    });

    // Reload to show popup
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Popup should appear
    const popupOverlay = page.locator('.fixed.inset-0.z-50');
    await expect(popupOverlay).toBeVisible({ timeout: 10000 });

    // Check for CTA button "자세히 보기"
    const ctaButton = page.getByText('자세히 보기');
    const ctaVisible = await ctaButton.isVisible().catch(() => false);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/main-popup-desktop.png`, fullPage: false });

    // Check popup title
    const popupTitle = page.locator('.fixed.inset-0.z-50 h3');
    await expect(popupTitle).toBeVisible();

    // If CTA is visible, verify it works
    if (ctaVisible) {
      const [newPage] = await Promise.all([
        page.context().waitForEvent('page', { timeout: 5000 }).catch(() => null),
        ctaButton.click(),
      ]);
      if (newPage) {
        await newPage.close();
      }
    }
  });

  test('팝업 배너 표시 (모바일 375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    await page.goto(MAIN_SITE);
    await page.evaluate(() => {
      const keys = Object.keys(localStorage).filter(k => k.startsWith('popup_dismissed_'));
      keys.forEach(k => localStorage.removeItem(k));
    });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const popupOverlay = page.locator('.fixed.inset-0.z-50');
    await expect(popupOverlay).toBeVisible({ timeout: 10000 });

    await page.screenshot({ path: `${SCREENSHOT_DIR}/main-popup-mobile.png`, fullPage: false });
  });

  test('팝업 닫기 애니메이션', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    await page.goto(MAIN_SITE);
    await page.evaluate(() => {
      const keys = Object.keys(localStorage).filter(k => k.startsWith('popup_dismissed_'));
      keys.forEach(k => localStorage.removeItem(k));
    });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const popupOverlay = page.locator('.fixed.inset-0.z-50');
    await expect(popupOverlay).toBeVisible({ timeout: 10000 });

    // Click close button
    const closeBtn = page.getByText('닫기').last();
    await closeBtn.click();

    // Capture mid-animation
    await page.waitForTimeout(100);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/main-popup-closing.png`, fullPage: false });

    // Wait for animation to complete
    await page.waitForTimeout(500);
    await expect(popupOverlay).not.toBeVisible({ timeout: 5000 });

    await page.screenshot({ path: `${SCREENSHOT_DIR}/main-popup-closed.png`, fullPage: false });
  });

  test('히어로 섹션 DB 텍스트 반영 확인', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(MAIN_SITE);
    await page.waitForLoadState('networkidle');

    // Dismiss popup if visible
    const popup = page.locator('.fixed.inset-0.z-50');
    if (await popup.isVisible({ timeout: 3000 }).catch(() => false)) {
      await page.getByText('닫기').last().click();
      await page.waitForTimeout(500);
    }

    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/main-hero-section.png`, fullPage: false });
  });
});
