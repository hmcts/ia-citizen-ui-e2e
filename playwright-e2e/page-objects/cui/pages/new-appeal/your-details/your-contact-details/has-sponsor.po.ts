import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../../cui-base';
import { YesOrNoType } from '../../../../../../citizen-types';

export class HasSponsorPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    continueButton: this.page.locator('button[name="saveAndContinue"]', {
      hasText: 'Save and continue',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.locator('h1', {
      hasText: 'Do you have a sponsor?',
    }),
    sponsorHintText: this.page.locator('div[id="answer-hint"]'),
    yesLabel: this.page.locator("//input[@value='Yes']/following-sibling::label"),
    noLabel: this.page.locator("//input[@value='No']/following-sibling::label"),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'has-sponsor', pageHeading: this.$static.pageHeading });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.sponsorHintText).toHaveText('A sponsor is usually someone you want to join in the UK.'),
      expect(this.$static.sponsorHintText).toBeVisible(),

      expect(this.$static.yesLabel).toHaveText('Yes'),
      expect(this.$static.yesLabel).toBeVisible(),

      expect(this.$static.noLabel).toHaveText('No'),
      expect(this.$static.noLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(option: { doesApplicantHaveASponsor: YesOrNoType }): Promise<void> {
    const element = this.page.locator(`input[type="radio"][value="${option.doesApplicantHaveASponsor}"]`);
    await element.check();
    await expect(element).toBeChecked();
    await this.navigationClick(this.$interactive.continueButton);
  }
}
