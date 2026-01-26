import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';
import { YesOrNoType } from '../../../../../types';

export class HasSponsorPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly pageForm = this.page.locator('body:has(form[action="/has-sponsor"])');

  public readonly $interactive = {
    continueButton: this.pageForm.locator('button[name="continue"]', {
      hasText: 'Continue',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.pageForm.locator('h1', {
      hasText: 'Do you have a sponsor?',
    }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnHasSponsorPage(): Promise<void> {
    await Promise.all([
      expect(async () => {
        expect(this.page.url().includes('has-sponsor')).toBeTruthy();
      }).toPass({ intervals: [100], timeout: 15_000 }),

      expect(this.$static.pageHeading).toBeVisible({ timeout: 15_000 }),
    ]);
  }

  public async completePageAndContinue(option: { doesApplicantHaveASponsor: YesOrNoType }): Promise<void> {
    const element = this.pageForm.locator(`input[type="radio"][value="${option.doesApplicantHaveASponsor}"]`);
    await element.check();
    await expect(element).toBeChecked();
    await this.navigationClick(this.$interactive.continueButton);
  }
}
