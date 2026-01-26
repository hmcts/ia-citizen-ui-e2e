import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../cui-base';
import { decisionWithOrWithoutHearingType } from '../../../../types';

export class DecisionTypePage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly pageForm = this.page.locator('body:has(form[action="/decision-type"])');

  public readonly $interactive = {
    saveAndContinueButton: this.pageForm.locator('button', {
      hasText: 'Save and continue',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.pageForm.locator('h1', {
      hasText: 'How do you want your appeal to be decided?',
    }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnDecisionTypePage(): Promise<void> {
    await Promise.all([
      expect(async () => {
        expect(this.page.url().includes('decision-type')).toBeTruthy();
      }).toPass({ intervals: [100], timeout: 15_000 }),

      expect(this.$static.pageHeading).toBeVisible({ timeout: 15_000 }),
    ]);
  }

  public async completePageAndContinue(option: { decisionWithOrWithoutHearing: decisionWithOrWithoutHearingType }): Promise<void> {
    const element = this.pageForm.locator(`input[type="radio"][value="${option.decisionWithOrWithoutHearing}"]`);
    await element.check();
    await expect(element).toBeChecked();
    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
