import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = 'sunwoojava@gmail.com';
const ADMIN_PASSWORD = 'testpassword';

async function adminLogin(page: import('@playwright/test').Page) {
  await page.goto('/login');
  await page.waitForLoadState('networkidle');
  await page.fill('input[type="email"]', ADMIN_EMAIL);
  await page.fill('input[type="password"]', ADMIN_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15000 });
}

async function scrollToPopupSection(page: import('@playwright/test').Page) {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  await page.getByText('팝업/배너 관리').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
}

test.describe('메인페이지 관리 - 히어로 텍스트', () => {
  test.beforeEach(async ({ page }) => {
    await adminLogin(page);
    await page.goto('/infos/main');
    await page.waitForLoadState('networkidle');
  });

  test('페이지 렌더링 및 히어로 텍스트 폼 표시', async ({ page }) => {
    await expect(page.getByText('메인 비주얼 문구')).toBeVisible();
    await expect(page.getByText('미리보기')).toBeVisible();
    await expect(page.locator('#tagline')).toBeVisible();
    await expect(page.locator('#headingLine1')).toBeVisible();
    await expect(page.locator('#headingLine2')).toBeVisible();
    await expect(page.locator('#buttonText')).toBeVisible();
    await expect(page.getByRole('button', { name: '저장' })).toBeVisible();

    await page.screenshot({ path: 'tests/e2e/screenshots/hero-text-render.png', fullPage: true });
  });

  test('히어로 텍스트 수정 → DB 반영 확인', async ({ page }) => {
    const timestamp = Date.now();
    const testTagline = `테스트 태그라인 ${timestamp}`;
    const testHeading1 = `테스트 제목1 ${timestamp}`;
    const testHeading2 = `테스트 제목2 ${timestamp}`;
    const testButton = `테스트 버튼 ${timestamp}`;

    await page.waitForTimeout(2000);

    await page.locator('#tagline').fill(testTagline);
    await page.locator('#headingLine1').fill(testHeading1);
    await page.locator('#headingLine2').fill(testHeading2);
    await page.locator('#buttonText').fill(testButton);

    await page.screenshot({ path: 'tests/e2e/screenshots/hero-text-before-save.png', fullPage: true });

    const saveButton = page.getByRole('button', { name: '저장' });
    await saveButton.scrollIntoViewIfNeeded();
    await saveButton.click();
    await page.waitForTimeout(3000);

    await page.screenshot({ path: 'tests/e2e/screenshots/hero-text-after-save.png', fullPage: true });

    // 새로고침 후 DB 반영 검증
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await expect(page.locator('#tagline')).toHaveValue(testTagline);
    await expect(page.locator('#headingLine1')).toHaveValue(testHeading1);
    await expect(page.locator('#headingLine2')).toHaveValue(testHeading2);
    await expect(page.locator('#buttonText')).toHaveValue(testButton);

    await page.screenshot({ path: 'tests/e2e/screenshots/hero-text-after-reload.png', fullPage: true });

    // 원래 값으로 복원
    await page.locator('#tagline').fill('당신만의 힐링');
    await page.locator('#headingLine1').fill('SE Club에서 누리는');
    await page.locator('#headingLine2').fill('완벽한 휴식');
    await page.locator('#buttonText').fill('지금 예약하기');
    await saveButton.scrollIntoViewIfNeeded();
    await saveButton.click();
    await page.waitForTimeout(3000);
  });
});

test.describe('메인페이지 관리 - 팝업 CRUD', () => {
  test.setTimeout(120000);

  test.beforeEach(async ({ page }) => {
    await adminLogin(page);
    await page.goto('/infos/main');
    await page.waitForLoadState('networkidle');
  });

  test('팝업 목록 섹션 렌더링', async ({ page }) => {
    await scrollToPopupSection(page);
    await expect(page.getByText('팝업/배너 관리')).toBeVisible();
    await expect(page.getByText('팝업 목록')).toBeVisible();
    await expect(page.getByRole('button', { name: /새 팝업 등록/ })).toBeVisible();

    await page.screenshot({ path: 'tests/e2e/screenshots/popup-section-render.png', fullPage: true });
  });

  test('팝업 등록 → 수정 → 토글 → 삭제 전체 CRUD 플로우', async ({ page }) => {
    const testTitle = `E2E 테스트 팝업 ${Date.now()}`;
    const testContent = '이것은 E2E 테스트용 팝업입니다.';
    const updatedTitle = `${testTitle} 수정됨`;

    await scrollToPopupSection(page);

    // ========== 1. 팝업 등록 ==========
    await page.getByRole('button', { name: /새 팝업 등록/ }).click();
    await expect(page.getByRole('heading', { name: '새 팝업 등록' })).toBeVisible();

    await page.locator('#popup-title').fill(testTitle);
    await page.locator('#popup-content').fill(testContent);
    await page.locator('#popup-priority').fill('5');

    await page.screenshot({ path: 'tests/e2e/screenshots/popup-create-form.png' });

    const submitBtn = page.locator('[role="dialog"]').getByRole('button', { name: '등록' });
    await submitBtn.scrollIntoViewIfNeeded();
    await submitBtn.click();

    // 모달 닫힘 대기 + 네비게이션 완료 대기
    await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 15000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // 팝업 테이블로 스크롤
    await scrollToPopupSection(page);

    await expect(page.getByText(testTitle)).toBeVisible({ timeout: 10000 });
    await page.screenshot({ path: 'tests/e2e/screenshots/popup-created.png', fullPage: true });

    // ========== 2. 팝업 수정 ==========
    // 드롭다운 메뉴 열기 - 더 안정적인 셀렉터 사용
    const popupRow = page.locator('tr').filter({ hasText: testTitle });
    await popupRow.scrollIntoViewIfNeeded();
    // ghost 버튼 (MoreHorizontal 아이콘) 클릭
    const moreBtn = popupRow.locator('button').last();
    await moreBtn.click();
    await page.waitForTimeout(500);

    await page.getByRole('menuitem', { name: '편집' }).click();
    await expect(page.getByRole('heading', { name: '팝업 수정' })).toBeVisible();

    await page.locator('#popup-title').fill(updatedTitle);
    await page.screenshot({ path: 'tests/e2e/screenshots/popup-edit-form.png' });

    const editSubmitBtn = page.locator('[role="dialog"]').getByRole('button', { name: '수정' });
    await editSubmitBtn.scrollIntoViewIfNeeded();
    await editSubmitBtn.click();

    await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 15000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await scrollToPopupSection(page);
    await expect(page.getByText(updatedTitle)).toBeVisible({ timeout: 10000 });
    await page.screenshot({ path: 'tests/e2e/screenshots/popup-updated.png', fullPage: true });

    // ========== 3. 활성/비활성 토글 ==========
    const updatedRow = page.locator('tr').filter({ hasText: updatedTitle });
    await updatedRow.scrollIntoViewIfNeeded();
    const toggleSwitch = updatedRow.locator('button[role="switch"]');
    const initialState = await toggleSwitch.getAttribute('data-state');
    await toggleSwitch.click();
    await page.waitForTimeout(2000);

    const newState = await toggleSwitch.getAttribute('data-state');
    expect(newState).not.toBe(initialState);

    await page.screenshot({ path: 'tests/e2e/screenshots/popup-toggled.png', fullPage: true });

    // 다시 토글 (원복)
    await toggleSwitch.click();
    await page.waitForTimeout(1500);

    // ========== 4. 팝업 삭제 ==========
    const deleteRow = page.locator('tr').filter({ hasText: updatedTitle });
    await deleteRow.scrollIntoViewIfNeeded();
    const deleteMoreBtn = deleteRow.locator('button').last();
    await deleteMoreBtn.click();
    await page.waitForTimeout(500);

    await page.getByRole('menuitem', { name: '삭제' }).click();
    await expect(page.getByText('정말로 삭제하시겠습니까?')).toBeVisible();

    await page.screenshot({ path: 'tests/e2e/screenshots/popup-delete-confirm.png' });

    await page.locator('[role="alertdialog"]').getByRole('button', { name: '삭제' }).click();

    await expect(page.locator('[role="alertdialog"]')).not.toBeVisible({ timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await scrollToPopupSection(page);
    await expect(page.getByText(updatedTitle)).not.toBeVisible({ timeout: 10000 });

    await page.screenshot({ path: 'tests/e2e/screenshots/popup-deleted.png', fullPage: true });
  });
});
