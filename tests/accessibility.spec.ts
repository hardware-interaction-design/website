import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { activateTelemetry } from './helpers';

const event = '/events/eindhoven-2026/';
const tags = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'];

test('homepage and open navigation pass automated accessibility checks', async ({ page }) => {
  await page.goto('/');
  const compact = await new AxeBuilder({ page }).withTags(tags).analyze();
  expect(compact.violations).toEqual([]);
  await activateTelemetry(page);
  const closed = await new AxeBuilder({ page }).withTags(tags).analyze();
  expect(closed.violations).toEqual([]);
  await page.getByRole('button', { name: 'Site menu' }).click();
  const open = await new AxeBuilder({ page }).withTags(tags).analyze();
  expect(open.violations).toEqual([]);
});

test('event page passes automated accessibility checks', async ({ page }) => {
  await page.goto(event);
  const results = await new AxeBuilder({ page }).withTags(tags).analyze();
  expect(results.violations).toEqual([]);
});

test('poster passes accessibility checks and reflows on narrow screens', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/poster.html');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  const results = await new AxeBuilder({ page }).withTags(tags).analyze();
  expect(results.violations).toEqual([]);
});

test('skip link moves keyboard focus to main content', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  const bounds = await skip.boundingBox();
  expect(bounds?.y).toBeGreaterThanOrEqual(0);
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
});

test('recap shortcuts move keyboard focus to the selected section', async ({ page }) => {
  await page.goto(event);
  await page.getByRole('navigation', { name: 'Conference sections' }).getByRole('link', { name: 'With thanks' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#about')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('#about a').first()).toBeFocused();
});

test('navigation has readable labels and large touch targets', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto(event);
  expect((await page.getByRole('navigation', { name: 'Main navigation' }).boundingBox())!.height).toBeLessThan(80);
  for (const control of await page.locator('nav a, nav button').all()) {
    if (!await control.isVisible()) continue;
    const bounds = await control.boundingBox();
    expect(bounds?.height).toBeGreaterThanOrEqual(44);
    expect(bounds?.width).toBeGreaterThanOrEqual(44);
  }
  await expect(page.getByRole('button', { name: 'Site menu' })).toContainText('Menu');
  await expect(page.locator('nav a[target="_blank"]')).toContainText('opens in a new tab');
});

test('pause freezes readings and charts, and resume restarts input', async ({ page }) => {
  await page.goto('/');
  await activateTelemetry(page);
  await page.mouse.move(100, 100);
  await page.mouse.move(200, 100, { steps: 5 });
  const toggle = page.getByRole('button', { name: /^Pause live input/ });
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  const frozen = await page.locator('#telemetry-readings').textContent();
  const chart = await page.locator('canvas').first().evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL());
  await page.mouse.move(300, 200, { steps: 5 });
  await page.keyboard.press('a');
  await page.waitForTimeout(150);
  expect(await page.locator('#telemetry-readings').textContent()).toBe(frozen);
  expect(await page.locator('canvas').first().evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL())).toBe(chart);
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await page.mouse.move(150, 100);
  await expect(page.getByTestId('cursor-x')).toHaveText('150');
});

test('reduced motion starts paused and removes automatic animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await activateTelemetry(page);
  await expect(page.getByRole('button', { name: /^Pause live input/ })).toHaveAttribute('aria-pressed', 'true');
  expect(await page.locator('html').evaluate(node => getComputedStyle(node).scrollBehavior)).toBe('auto');
  expect(await page.locator('.sensor-dot').first().evaluate(node => getComputedStyle(node).animationName)).toBe('none');
});

test('charts expose text summaries rather than unlabelled canvas graphics', async ({ page }) => {
  await page.goto('/');
  await activateTelemetry(page);
  await page.mouse.move(100, 100);
  await page.mouse.move(200, 100, { steps: 5 });
  await expect(page.getByRole('figure', { name: /^Speed history\. 80 recent samples/ })).toBeVisible();
  await expect(page.getByRole('figure', { name: /^Movement trail\..*recent positions/ })).toBeVisible();
  await expect(page.locator('#telemetry-readings')).toHaveAttribute('aria-live', 'off');
});

test('text spacing overrides do not clip content or cause horizontal scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  for (const path of ['/', event]) {
    await page.goto(path);
    await page.addStyleTag({ content: '* { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-bottom: 2em !important; }' });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  }
});

test('200 percent text enlargement retains content and controls', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/');
  await page.addStyleTag({ content: 'html { font-size: 200%; }' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  await expect(page.getByRole('button', { name: 'Site menu' })).toBeVisible();
});

test('dark mode follows the system and passes accessibility checks', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  for (const path of ['/', event]) {
    await page.goto(path);
    if (path === '/') await activateTelemetry(page);
    await expect(page.getByRole('button', { name: 'Dark mode' })).toHaveAttribute('aria-pressed', 'true');
    const results = await new AxeBuilder({ page }).withTags(tags).analyze();
    expect(results.violations).toEqual([]);
  }
});

test('theme toggle overrides the system and persists across pages', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Dark mode' });
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.goto(event);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  expect(await page.locator('body').evaluate(node => getComputedStyle(node).backgroundColor)).toBe('rgb(25, 27, 26)');
});

test('on phones the navigation hides on scroll down and returns on scroll up', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 740 });
  await page.goto(event);
  const nav = page.getByRole('navigation', { name: 'Main navigation' });
  const top = async () => (await nav.boundingBox())!.y;
  await page.mouse.move(180, 400);
  await page.mouse.wheel(0, 1500);
  await expect.poll(top).toBeLessThan(-30);
  await page.mouse.wheel(0, -200);
  await expect.poll(top).toBe(0);
  await page.getByRole('button', { name: 'Site menu' }).click();
  await page.getByRole('menuitem', { name: 'Community', exact: true }).click();
  await expect(page.locator('#community')).toBeFocused();
});

test('on wide screens the navigation stays visible while scrolling down', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(event);
  await page.mouse.move(600, 400);
  await page.mouse.wheel(0, 1500);
  await page.waitForTimeout(300);
  expect((await page.getByRole('navigation', { name: 'Main navigation' }).boundingBox())!.y).toBe(0);
});
