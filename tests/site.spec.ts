import { expect, test } from '@playwright/test';
import { createEventICS } from '../src/lib/calendar';
import { InputTelemetry } from '../src/lib/telemetry';
import { activateTelemetry } from './helpers';

const event = '/events/eindhoven-2026/';

test('external link labels are underlined without decorating their arrows', async ({ page }) => {
  await page.goto(event);
  const links = [page.locator('#recap a').first(), page.getByRole('link', { name: /^Original Dutch Design Week listing/ })];
  for (const link of links) {
    await expect(link).toHaveCSS('text-decoration-line', 'none');
    await expect(link.locator('span').first()).toHaveCSS('text-decoration-line', 'underline');
    await expect(link.locator('span[aria-hidden="true"]')).toHaveCSS('text-decoration-line', 'none');
    await link.hover();
    await expect(link).toHaveCSS('text-decoration-line', 'none');
    await expect(link.locator('span[aria-hidden="true"]')).toHaveCSS('text-decoration-line', 'none');
  }
});

test('the first screen explains the community and offers a join action and next event', async ({ page }) => {
  for (const width of [375, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const header = page.locator('main header');
    await expect(header.getByRole('link', { name: /^Join on LinkedIn/ })).toBeInViewport({ ratio: 1 });
    await expect(header.getByRole('link', { name: 'See events' })).toBeInViewport({ ratio: 1 });
    await expect(header.getByRole('link', { name: 'Next event: Stockholm, early 2027' })).toBeInViewport({ ratio: 1 });
  }
});

test('community comes before the ungated live input demo', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/');
  const order = await page.evaluate(() => {
    const community = document.querySelector('#community')!.getBoundingClientRect();
    const demo = document.querySelector('[data-testid="telemetry-loader"]')!.getBoundingClientRect();
    return { communityBottom: community.bottom, demoTop: demo.top };
  });
  expect(order.communityBottom).toBeLessThan(order.demoTop);
  await expect(page.locator('canvas')).toHaveCount(0);
  await activateTelemetry(page);
  await expect(page.locator('canvas')).toHaveCount(3);
  await expect(page.getByRole('button', { name: /Try the input demo|Close input demo/ })).toHaveCount(0);
});

test('desktop exposes the same global destinations without opening the menu', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  for (const path of ['/', event]) {
    await page.goto(path);
    const nav = page.getByRole('navigation', { name: 'Main navigation' });
    for (const name of ['Home', 'Events', 'Topics', 'Community']) {
      await expect(nav.getByRole('link', { name, exact: true })).toBeVisible();
    }
  }
  await page.goto('/');
  const topics = page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Topics', exact: true });
  await topics.click();
  await expect(topics).toHaveAttribute('aria-current', 'location');
});

test('event photos stay inline without links or open controls', async ({ page }) => {
  await page.goto(event);
  const photos = page.locator('main figure img');
  await expect(photos).toHaveCount(4);
  for (const photo of await photos.all()) {
    expect(await photo.evaluate(element => element.closest('a, button'))).toBeNull();
  }
  await expect(page.getByText('Full size', { exact: true })).toHaveCount(0);
  const pages = page.context().pages().length;
  await photos.first().click();
  await expect(page).toHaveURL(new RegExp(event + '$'));
  expect(page.context().pages()).toHaveLength(pages);
});

test('content, metadata, assets, and responsive layout', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Hardware Interaction Design');
  await expect(page.locator('.topic')).toHaveCount(18);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://hardwareux.com/events/eindhoven-2026/community-projects-and-conversations.jpg');
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

test('home page separates upcoming Stockholm from past Eindhoven', async ({ page }) => {
  await page.goto('/');
  const upcoming = page.getByRole('region', { name: 'Upcoming events' });
  await expect(upcoming).toContainText('Stockholm');
  await expect(upcoming).toContainText('Early 2027');
  await expect(upcoming).toContainText('Date and venue to be announced.');
  const feature = page.getByRole('region', { name: 'Past events' }).getByRole('article', { name: 'Hardware Interaction Design Conference' });
  await expect(feature).toContainText('Friday 23 October 2026');
  await feature.getByRole('link', { name: /^Read the recap/ }).click();
  await expect(page).toHaveURL(new RegExp(event + '$'));
  await expect(page.locator('header')).toContainText('Past event');
});

test('old conference section links move to the event page', async ({ page }) => {
  await page.goto('/#register');
  await expect(page).toHaveURL(new RegExp(event + '#register$'));
});

test('Bits UI site menu opens, navigates, and closes with Escape', async ({ page }) => {
  await page.goto(event);
  const trigger = page.getByRole('button', { name: 'Site menu' });
  await trigger.click();
  await expect(page.getByRole('menu')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu')).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.getByRole('menuitem', { name: 'All past events' }).click();
  await expect(page).toHaveURL(/\/#past-events$/);
  await expect(page.getByRole('menu')).toBeHidden();
});

test('narrow mobile layout has no horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  for (const path of ['/', event]) {
    await page.goto(path);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('keyboard opens menu and selects an archive destination', async ({ page }) => {
  await page.goto(event);
  await page.getByRole('button', { name: 'Site menu' }).focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('End');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(new RegExp(event + '$'));
});

test('both pages share one site menu that links across pages', async ({ page }) => {
  for (const path of ['/', event]) {
    await page.goto(path);
    await page.getByRole('button', { name: 'Site menu' }).click();
    const items = (await page.getByRole('menuitem').allTextContents()).map(text => text.replace('You are here', ''));
    expect(items).toEqual(['Home', 'Events', 'Topics', 'Community', 'All past events', 'Eindhoven 2026 recap']);
    const current = page.getByRole('menuitem', { name: path === '/' ? /^Home/ : /^Eindhoven 2026 recap/ });
    await expect(current).toHaveAttribute('aria-current', 'page');
    await expect(current).toContainText('You are here');
    await page.keyboard.press('Escape');
  }
  await page.getByRole('button', { name: 'Site menu' }).click();
  await page.getByRole('menuitem', { name: 'Topics' }).click();
  await expect(page).toHaveURL(/\/#topics$/);
  await page.getByRole('button', { name: 'Site menu' }).click();
  await page.getByRole('menuitem', { name: 'Eindhoven 2026 recap' }).click();
  await expect(page).toHaveURL(new RegExp(event + '$'));
  await page.getByRole('navigation', { name: 'Conference sections' }).getByRole('link', { name: 'View photos' }).click();
  await expect(page).toHaveURL(/#photos$/);
  await expect(page.locator('#photos')).toBeInViewport();
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

test('community links open the LinkedIn group without an unexpected download', async ({ page }) => {
  await page.route('https://www.linkedin.com/groups/42710001/**', route => route.fulfill({ body: 'Community group' }));
  await page.goto(event);
  const links = page.locator('a[href="https://www.linkedin.com/groups/42710001/"]');
  const downloads: string[] = [];
  page.on('download', download => downloads.push(download.suggestedFilename()));
  await expect(links).toHaveCount(2);
  for (const link of await links.all()) {
    await expect(link).toHaveAttribute('target', '_blank');
    const [popup] = await Promise.all([
      page.waitForEvent('popup'), link.click()
    ]);
    await popup.close();
  }
  expect(downloads).toEqual([]);
});

test('past event has a recap and photos, not live registration or calendar calls to action', async ({ page }) => {
  for (const path of ['/', event]) {
    await page.goto(path);
    await expect(page.locator('a[href*="forms.gle"]')).toHaveCount(0);
    await expect(page.getByRole('link', { name: /^Reserve your spot|^Add to calendar/ })).toHaveCount(0);
  }
  await expect(page.locator('#register')).toContainText('Registration is closed.');
  await expect(page.locator('main figure img')).toHaveCount(4);
  for (const name of ['Thomas Müller', 'Stefanie Birk', 'Samuel Beek', 'Klemen Lilija', 'Hane Park', 'Jurrian Doornbos']) {
    await expect(page.locator('#recap')).toContainText(name);
  }
  await expect(page.getByRole('link', { name: /^Lautsprecher Teufel/ })).toHaveAttribute('href', 'https://lu.teufelaudio.com/mynd-107002004');
  await expect(page.getByRole('link', { name: /^OSHNED/ })).toHaveAttribute('href', 'https://en.makerdays.nl/maker/oshned/');
  await page.getByText("View the day's programme", { exact: true }).click();
  await expect(page.locator('#program ol')).toContainText('OSHned');
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
  await expect(page.locator('a[href*="forms.gle"]')).toHaveCount(0);
  await expect(page.locator('#register')).toContainText('Registration is closed.');
  await expect(page.locator('main figure img')).toHaveCount(4);
  await page.goto(baseURL + '/');
  await expect(page.getByRole('region', { name: 'Upcoming events' })).toContainText('Stockholm');
  await expect(page.getByRole('region', { name: 'Past events' })).toBeVisible();
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
