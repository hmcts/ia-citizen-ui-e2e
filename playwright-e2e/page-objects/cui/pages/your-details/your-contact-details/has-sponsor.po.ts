import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';
import { YesOrNoType } from '../../../../../citizen-types';

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
    sponsorHintText: this.pageForm.locator('div[id="answer-hint"]'),
    yesLabel: this.pageForm.locator("//input[@value='Yes']/following-sibling::label"),
    noLabel: this.pageForm.locator("//input[@value='No']/following-sibling::label"),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'has-sponsor', pageHeading: this.$static.pageHeading });
  }

  private async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.sponsorHintText).toHaveText('A sponsor is usually someone you want to join in the UK.'),
      expect(this.$static.sponsorHintText).toBeVisible(),

      expect(this.$static.yesLabel).toHaveText('Yes'),
      expect(this.$static.yesLabel).toBeVisible(),

      expect(this.$static.noLabel).toHaveText('No'),
      expect(this.$static.noLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(option: { doesApplicantHaveASponsor: YesOrNoType; verifyAllTextOnPage?: boolean }): Promise<void> {
    if (option.verifyAllTextOnPage) {
      await this.verifyAllTextOnPage();
    }

    const element = this.pageForm.locator(`input[type="radio"][value="${option.doesApplicantHaveASponsor}"]`);
    await element.check();
    await expect(element).toBeChecked();
    await this.navigationClick(this.$interactive.continueButton);
  }
}
