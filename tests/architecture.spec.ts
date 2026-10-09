import { expect, test } from '@playwright/test';
import { activateTelemetry } from './helpers';
import { readFileSync } from 'node:fs';

type Chunk = { file: string; name: string; imports?: string[]; dynamicImports?: string[]; isDynamicEntry?: boolean };
const manifest: Record<string, Chunk> = JSON.parse(readFileSync('.svelte-kit/output/client/.vite/manifest.json', 'utf8'));
const telemetryKey = 'src/lib/components/Telemetry.svelte';

function eagerDependencies(key: string, result = new Set<string>()): Set<string> {
  if (result.has(key)) return result;
  result.add(key);
  for (const dependency of manifest[key].imports ?? []) eagerDependencies(dependency, result);
  return result;
}

test('production manifest keeps telemetry lazy and controls independent of routes', () => {
  const homepage = Object.keys(manifest).find(key => manifest[key].name === 'nodes/2')!;
  const poster = Object.keys(manifest).find(key => manifest[key].name === 'nodes/3')!;
  const controls = Object.keys(manifest).find(key => manifest[key].name === 'ui-controls')!;
  expect(controls).toBeTruthy();
  expect(manifest[telemetryKey].isDynamicEntry).toBe(true);
  expect(eagerDependencies(homepage).has(telemetryKey)).toBe(false);
  expect(eagerDependencies(poster).has(telemetryKey)).toBe(false);
  expect([...eagerDependencies(homepage)].some(key => manifest[key].dynamicImports?.includes(telemetryKey))).toBe(true);
  expect([...eagerDependencies(telemetryKey)].some(key => manifest[key].name === '2' || manifest[key].name.startsWith('nodes/'))).toBe(false);
  expect([...eagerDependencies(controls)].some(key => manifest[key].name === '2' || manifest[key].name.startsWith('nodes/'))).toBe(false);
});

test('telemetry mounts only near the viewport and is removed on navigation', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Load input demo' })).toBeAttached();
  await activateTelemetry(page);
  await expect(page.locator('canvas')).toHaveCount(4);
  await page.goto('/poster.html');
  await expect(page.locator('canvas')).toHaveCount(0);
});

test('lazy telemetry exposes a retry when its chunk fails to load', async ({ page }) => {
  await page.route('**/' + manifest[telemetryKey].file, route => route.abort());
  await page.goto('/');
  await page.getByTestId('telemetry-loader').scrollIntoViewIfNeeded();
  await expect(page.getByRole('button', { name: 'Retry input demo' })).toBeVisible();
  await expect(page.getByRole('status')).toHaveText('The demo could not load. Try again.');
  await page.unroute('**/' + manifest[telemetryKey].file);
  await page.getByRole('button', { name: 'Retry input demo' }).click();
  await expect(page.locator('section[aria-labelledby="telemetry-heading"]')).toHaveAttribute('data-ready', 'true');
});

test('calendar download works without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL + '/');
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('link', { name: /^Add to calendar/ }).first().click()
  ]);
  expect(download.suggestedFilename()).toBe('hardware-interaction-design-conference.ics');
  await context.close();
});

test('shared buttons preserve native actions, link semantics, and pressed state', async ({ page }) => {
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Section menu' });
  await expect(menu).toHaveClass(/button-ghost/);
  await expect(menu).toHaveAttribute('type', 'button');
  await expect(page.locator('nav a[target="_blank"]')).toHaveClass(/button-outline/);
  await expect(page.locator('nav a[target="_blank"]')).toHaveAttribute('rel', /noopener/);
  await expect(page.getByRole('link', { name: /^Add to calendar/ }).first()).toHaveClass(/button-secondary/);
  await activateTelemetry(page);
  const pause = page.getByRole('button', { name: 'Pause live input' });
  await expect(pause).toHaveClass(/button-secondary/);
  await pause.click();
  await expect(pause).toHaveAttribute('aria-pressed', 'true');
});
