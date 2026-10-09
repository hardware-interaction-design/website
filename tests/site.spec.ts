import { expect, test } from '@playwright/test';
import { createEventICS } from '../src/lib/calendar';
import { InputTelemetry } from '../src/lib/telemetry';
import { activateTelemetry } from './helpers';

test('content, metadata, assets, and responsive layout', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Interaction Design');
  await expect(page.locator('article')).toHaveCount(3);
  await expect(page.locator('.topic')).toHaveCount(18);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://hardwareux.com/og-image.png');
  for (const image of await page.locator('img').all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBeTruthy();
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test('Bits UI section menu opens, navigates, and closes with Escape', async ({ page }) => {
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Section menu' });
  await trigger.click();
  await expect(page.getByRole('menu')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu')).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.getByRole('menuitem', { name: 'Venue & getting there' }).click();
  await expect(page).toHaveURL(/#venue$/);
  await expect(page.getByRole('menu')).toBeHidden();
});

test('narrow mobile layout has no horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('keyboard opens menu and selects a section', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Section menu' }).focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Home');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#program$/);
});

test('pointer and keyboard telemetry update and canvases scale correctly', async ({ page }) => {
  await page.goto('/');
  await activateTelemetry(page);
  await expect(page.locator('canvas')).toHaveCount(4);
  await page.mouse.move(100, 100);
  await page.mouse.move(200, 100, { steps: 5 });
  await expect(page.getByTestId('cursor-x')).toHaveText('200');
  await expect(page.getByTestId('direction')).toHaveText('→');
  await expect.poll(async () => Number(await page.getByTestId('peak').textContent())).toBeGreaterThan(0);
  await page.keyboard.down('a');
  await page.keyboard.up('a');
  await page.keyboard.press('b');
  await expect(page.getByTestId('hold')).not.toHaveText('—');
  await expect(page.getByTestId('interval')).not.toHaveText('—');
  const dimensions = await page.locator('canvas').first().evaluate((canvas: HTMLCanvasElement) => ({
    width: canvas.width, displayed: canvas.getBoundingClientRect().width, dpr: devicePixelRatio, height: canvas.height
  }));
  expect(dimensions.width).toBe(Math.round(dimensions.displayed * dimensions.dpr));
  expect(dimensions.height).toBe(60 * dimensions.dpr);
});

test('touch telemetry tracks individual contacts and cancellation', async ({ page }) => {
  await page.goto('/');
  await activateTelemetry(page);
  await page.evaluate(() => {
    document.dispatchEvent(new PointerEvent('pointerdown', { pointerType: 'touch', pointerId: 1 }));
    document.dispatchEvent(new PointerEvent('pointerdown', { pointerType: 'touch', pointerId: 2 }));
    document.dispatchEvent(new PointerEvent('pointerup', { pointerType: 'touch', pointerId: 1 }));
    document.dispatchEvent(new PointerEvent('pointercancel', { pointerType: 'touch', pointerId: 2 }));
  });
  await expect(page.getByTestId('hold')).not.toHaveText('—');
  await expect(page.getByTestId('interval')).not.toHaveText('—');
});

test('registration opens the form without an unexpected download', async ({ page }) => {
  await page.route('https://forms.gle/**', route => route.fulfill({ body: 'Registration form' }));
  await page.goto('/');
  const links = page.locator('a[href="https://forms.gle/9G9bd8FyDzxz4YTr9"]');
  const downloads: string[] = [];
  page.on('download', download => downloads.push(download.suggestedFilename()));
  await expect(links).toHaveCount(3);
  for (const link of await links.all()) {
    await expect(link).toHaveAttribute('target', '_blank');
    const [popup] = await Promise.all([
      page.waitForEvent('popup'), link.click()
    ]);
    await popup.close();
  }
  expect(downloads).toEqual([]);
});

test('explicit calendar links download the event file', async ({ page }) => {
  await page.goto('/');
  const buttons = page.getByRole('link', { name: /^Add to calendar/ });
  await expect(buttons).toHaveCount(2);
  for (const button of await buttons.all()) {
    const [download] = await Promise.all([page.waitForEvent('download'), button.click()]);
    expect(download.suggestedFilename()).toBe('hardware-interaction-design-conference.ics');
  }
});

test('poster keeps the original URL and square dimensions', async ({ page }) => {
  await page.setViewportSize({ width: 1080, height: 1080 });
  const response = await page.goto('/poster.html');
  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  const bounds = await page.locator('main').boundingBox();
  expect(bounds?.width).toBe(1080);
  expect(bounds?.height).toBe(1080);
  await expect(page.locator('img')).toHaveCount(6);
});

test('static HTML includes content without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL + '/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('article')).toHaveCount(3);
  await expect(page.locator('a[href*="forms.gle"]')).toHaveCount(3);
  await context.close();
});

test('calendar timestamps, escaping, CRLF, and folding', () => {
  const ics = createEventICS(new Date('2026-10-09T12:00:00Z'));
  expect(ics).toContain('DTSTAMP:20261009T120000Z\r\n');
  expect(ics).toContain('DTSTART:20261023T070000Z\r\n');
  expect(ics).toContain('DTEND:20261023T160000Z\r\n');
  expect(ics.replace(/\r\n /g, '')).toContain('LOCATION:High Tech Campus\\, 1d The Strip\\, Eindhoven\\, Netherlands');
  expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true);
  for (const line of ics.split('\r\n')) expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
});

test('telemetry directions, repeats, bounds, and blur reset', () => {
  const input = new InputTelemetry();
  input.move(0, 0, 0);
  input.move(10, 0, 10);
  expect(input.direction).toBe('→');
  input.move(10, 10, 20);
  expect(input.direction).toBe('↓');
  input.start('a', 0);
  input.start('a', 20);
  input.end('a', 50);
  expect(input.hold).toBe(50);
  input.start('b', 100);
  expect(input.interval).toBe(100);
  input.pause();
  input.end('b', 1000);
  expect(input.hold).toBe(50);
  for (let i = 0; i < 100; i++) {
    input.move(i, i, 1000 + i);
    input.start('key', 1000 + i * 2);
    input.end('key', 1001 + i * 2);
  }
  expect(input.trail.length).toBe(60);
  expect(input.speeds.length).toBe(80);
  expect(input.intervals.length).toBe(40);
  expect(input.holds.length).toBe(40);
});
