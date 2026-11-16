import { expect, type Page } from '@playwright/test';

export async function activateTelemetry(page: Page) {
  await page.getByTestId('telemetry-loader').scrollIntoViewIfNeeded();
  await expect(page.locator('section[aria-labelledby="telemetry-heading"]')).toHaveAttribute('data-ready', 'true');
}
