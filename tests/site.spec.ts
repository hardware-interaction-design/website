import { expect, test } from '@playwright/test';
import { createEventICS } from '../src/lib/calendar';
import { InputTelemetry } from '../src/lib/telemetry';
import { activateTelemetry } from './helpers';

const event = '/events/eindhoven-2026/';
test('content, metadata, assets, and responsive layout', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Hardware Interaction Design');
  await expect(page.locator('.topic')).toHaveCount(18);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://hardwareux.com/og-image.png');
  await page.goto(event);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Hardware Interaction Design Conference');
  await expect(page.locator('article')).toHaveCount(4);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://hardwareux.com' + event);
  for (const path of ['/', event]) {
    await page.goto(path);
    for (const image of await page.locator('img').all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBeTruthy();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  expect(errors).toEqual([]);
});

test('home page features the conference and links to its page', async ({ page }) => {
  await page.goto('/');
  const feature = page.getByRole('article', { name: 'Hardware Interaction Design Conference' });
  await expect(feature).toContainText('Friday 23 October 2026');
  await feature.getByRole('link', { name: /^See the programme/ }).click();
  await expect(page).toHaveURL(new RegExp(event + '$'));
  await expect(page.locator('#program')).toBeVisible();
});

test('old conference section links move to the event page', async ({ page }) => {
  await page.goto('/#register');
  await expect(page).toHaveURL(new RegExp(event + '#register$'));
});

test('Bits UI section menu opens, navigates, and closes with Escape', async ({ page }) => {
  await page.goto(event);
  const trigger = page.getByRole('button', { name: 'Site menu' });
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
  for (const path of ['/', event]) {
    await page.goto(path);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('keyboard opens menu and selects a section', async ({ page }) => {
  await page.goto(event);
  await page.getByRole('button', { name: 'Site menu' }).focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('End');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#about$/);
});

test('both pages share one site menu that links across pages', async ({ page }) => {
  for (const path of ['/', event]) {
    await page.goto(path);
    await page.getByRole('button', { name: 'Site menu' }).click();
    const items = await page.getByRole('menuitem').allTextContents();
    expect(items).toEqual(['Home', 'Events', 'Topics', 'Live input demo', 'Conference overview', 'Programme', "Who you'll meet", 'Venue & getting there', 'Register', 'Hosted by']);
    await expect(page.getByRole('menuitem', { name: path === '/' ? 'Home' : 'Conference overview' })).toHaveAttribute('aria-current', 'page');
    await page.keyboard.press('Escape');
  }
  await page.getByRole('button', { name: 'Site menu' }).click();
  await page.getByRole('menuitem', { name: 'Topics' }).click();
  await expect(page).toHaveURL(/\/#topics$/);
  await page.getByRole('button', { name: 'Site menu' }).click();
  await page.getByRole('menuitem', { name: 'Register' }).click();
  await expect(page).toHaveURL(new RegExp(event + '#register$'));
  await expect(page.locator('#register')).toBeInViewport();
});

test('pointer and keyboard telemetry update and canvases scale correctly', async ({ page }) => {
  await page.goto('/');
  await activateTelemetry(page);
  await expect(page.locator('canvas')).toHaveCount(3);
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
  // Overlapping touches have no gap between them; the next touch after release does.
  await expect(page.getByTestId('interval')).toHaveText('—');
  await page.evaluate(() => {
    document.dispatchEvent(new PointerEvent('pointerdown', { pointerType: 'touch', pointerId: 3 }));
    document.dispatchEvent(new PointerEvent('pointerup', { pointerType: 'touch', pointerId: 3 }));
  });
  await expect(page.getByTestId('interval')).not.toHaveText('—');
});

test('mouse clicks count as presses on the timeline', async ({ page }) => {
  await page.goto('/');
  await activateTelemetry(page);
  await page.mouse.move(5, 5);
  await page.mouse.down();
  await page.mouse.up();
  await page.mouse.down();
  await page.mouse.up();
  await expect(page.getByTestId('hold')).not.toHaveText('—');
  await expect(page.getByTestId('interval')).not.toHaveText('—');
  await expect(page.getByRole('figure', { name: /^Press timeline\. 2 presses in the last 8 seconds/ })).toBeAttached();
});

test('registration opens the form without an unexpected download', async ({ page }) => {
  await page.route('https://forms.gle/**', route => route.fulfill({ body: 'Registration form' }));
  await page.goto(event);
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
  await page.goto(event);
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
  await page.goto(baseURL + event);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('article')).toHaveCount(4);
  await expect(page.locator('a[href*="forms.gle"]')).toHaveCount(3);
  await context.close();
});

test('calendar timestamps, escaping, CRLF, and folding', () => {
  const ics = createEventICS(new Date('2026-10-09T12:00:00Z'));
  expect(ics).toContain('DTSTAMP:20261009T120000Z\r\n');
  expect(ics).toContain('DTSTART:20261023T100000Z\r\n');
  expect(ics).toContain('DTEND:20261023T160000Z\r\n');
  expect(ics.replace(/\r\n /g, '')).toContain('LOCATION:Student Base\\, The Strip (first floor)\\, High Tech Campus 1d\\, Eindhoven\\, Netherlands');
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
  expect(input.interval).toBe(50);
  input.start('c', 120);
  expect(input.interval).toBe(50);
  input.pause();
  input.end('b', 1000);
  expect(input.hold).toBe(50);
  expect(input.presses.map(press => press.start)).toEqual([0]);
  for (let i = 0; i < 100; i++) {
    input.move(i, i, 1000 + i);
    input.tick(1000 + i);
    input.start('key', 1000 + i * 2);
    input.end('key', 1001 + i * 2);
  }
  expect(input.trail.length).toBe(60);
  expect(input.speeds.length).toBe(80);
  expect(input.intervals.length).toBe(40);
  expect(input.holds.length).toBe(40);
  expect(input.presses.length).toBe(40);
  input.tick(1199 + 8001);
  expect(input.presses.length).toBe(0);
});
