import { Page, expect, Locator } from "@playwright/test";

// A base page inherited by pages & components
// can contain any additional config needed + instantiated page object
export abstract class Base {
  constructor(public readonly page: Page) {}

  public async navigationClick(elementToClickOn: Locator): Promise<void> {
    await expect(elementToClickOn).toBeVisible();
    await expect(elementToClickOn).toBeEnabled();

    await expect(async () => {
      if (
        (await elementToClickOn.isVisible()) &&
        (await elementToClickOn.isEnabled())
      ) {
        await elementToClickOn.click();
      }
      await expect(elementToClickOn).toBeHidden({ timeout: 5_000 });
    }).toPass({ intervals: [1_000], timeout: 30_000 });
  }
}
