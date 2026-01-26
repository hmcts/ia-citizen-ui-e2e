import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../cui-base';

export class EqualityAndDiversityStartPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly pageForm = this.page.locator('body:has(form[action="/start-page"])');

  public readonly $static = {
    pageHeading: this.pageForm.locator('h1', {
      hasText: 'Equality and diversity questions',
    }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnEqualityAndDiversityStartPage(): Promise<void> {
    await Promise.all([
      expect(async () => {
        expect(this.page.url().includes('start-page')).toBeTruthy();
      }).toPass({ intervals: [100], timeout: 15_000 }),

      expect(this.$static.pageHeading).toBeVisible({ timeout: 15_000 }),
    ]);
  }

  public async completePageAndContinue(): Promise<void> {
    const element = this.pageForm.locator('button[type="submit"]', { hasText: "I don't want to answer these questions" });
    await this.navigationClick(element);
  }
}
