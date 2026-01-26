import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';
import { AppealType } from '../../../../../types';

export class AppealTypePage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly pageForm = this.page.locator('body:has(form[action="/appeal-type"])');

  public readonly $interactive = {
    saveAndContinueButton: this.pageForm.locator('button', {
      hasText: 'Save and continue',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.pageForm.locator('h1', {
      hasText: 'What is your appeal type?',
    }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnAppealTypePage(): Promise<void> {
    await Promise.all([
      expect(async () => {
        expect(this.page.url().includes('appeal-type')).toBeTruthy();
      }).toPass({ intervals: [100], timeout: 15_000 }),

      expect(this.$static.pageHeading).toBeVisible({ timeout: 15_000 }),
    ]);
  }

  public async completePageAndContinue(option: { appealType: AppealType }): Promise<void> {
    const optionToSelect = option.appealType;
    const element = this.pageForm.getByRole('radio', { name: new RegExp(`^${optionToSelect}`, 'i') });

    await element.check();
    await expect(element).toBeChecked();
    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
