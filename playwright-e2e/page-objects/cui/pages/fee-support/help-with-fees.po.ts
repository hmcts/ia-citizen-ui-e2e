import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../cui-base';
import { FeeSupportType } from '../../../../types';

export class HelpWithFeesPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly pageForm = this.page.locator('body:has(form[action="/help-with-fees"])');

  public readonly $interactive = {
    saveAndContinueButton: this.pageForm.locator('button', {
      hasText: 'Save and continue',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.pageForm.locator('h1', {
      hasText: 'Help with paying the fee',
    }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnHelpWithTheFeesPage(): Promise<void> {
    await Promise.all([
      expect(async () => {
        expect(this.page.url().includes('help-with-fees')).toBeTruthy();
      }).toPass({ intervals: [100], timeout: 15_000 }),

      expect(this.$static.pageHeading).toBeVisible({ timeout: 15_000 }),
    ]);
  }

  public async completePageAndContinue(option: { helpWithFees: 'wantToApply' | 'alreadyApplied' | 'willPayForAppeal' }): Promise<void> {
    const element = this.pageForm.locator(`input[type="radio"][value="${option.helpWithFees}"]`);

    await element.check();
    await expect(element).toBeChecked();
    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
