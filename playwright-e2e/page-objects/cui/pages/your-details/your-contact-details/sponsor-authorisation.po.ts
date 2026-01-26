import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';
import { YesOrNoType } from '../../../../../types';

export class SponsorAuthorisationPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly pageForm = this.page.locator('body:has(form[action="/sponsor-authorisation"])');

  public readonly $interactive = {
    continueButton: this.pageForm.locator('button[name="continue"]', {
      hasText: 'Continue',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.pageForm.locator('h1', {
      hasText: 'Do you agree to let your sponsor have access to information about your appeal?',
    }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnSponsorAuthorisationPage(): Promise<void> {
    await Promise.all([
      expect(async () => {
        expect(this.page.url().includes('sponsor-authorisation')).toBeTruthy();
      }).toPass({ intervals: [100], timeout: 15_000 }),

      expect(this.$static.pageHeading).toBeVisible({ timeout: 15_000 }),
    ]);
  }

  public async completePageAndContinue(option: { allowSponsorToSeeAppealInformation: YesOrNoType }): Promise<void> {
    const element = this.pageForm.locator(`input[type="radio"][value="${option.allowSponsorToSeeAppealInformation}"]`);
    await element.check();
    await expect(element).toBeChecked();
    await this.navigationClick(this.$interactive.continueButton);
  }
}
