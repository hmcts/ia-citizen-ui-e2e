import { Page, expect, Locator } from '@playwright/test';

// A base page inherited by pages & components
// can contain any additional config needed + instantiated page object
export abstract class Base {
  constructor(public readonly page: Page) {}

  public async navigationClick(elementToClickOn: Locator): Promise<void> {
    await expect(elementToClickOn).toBeVisible();
    await expect(elementToClickOn).toBeEnabled();

    await expect(async () => {
      if ((await elementToClickOn.isVisible()) && (await elementToClickOn.isEnabled())) {
        await elementToClickOn.click();
      }
      await expect(elementToClickOn).toBeHidden({ timeout: 5_000 });
    }).toPass({ intervals: [1_000], timeout: 30_000 });
  }

  protected async verifyUserIsOnExpectedPage(options: { urlPath: string; pageHeading: Locator; timeout?: number }): Promise<void> {
    const timeout = options.timeout ?? 15_000;
    await Promise.all([
      expect(async () => {
        expect(this.page.url().includes(options.urlPath)).toBeTruthy();
      }).toPass({ intervals: [100], timeout: timeout }),

      expect(options.pageHeading).toBeVisible({ timeout: timeout }),
    ]);
  }
}
