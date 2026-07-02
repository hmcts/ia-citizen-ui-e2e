import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../../cui-base';
import { YesOrNoType } from '../../../../../../citizen-types';

export class DeportationOrderPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    saveAndContinueButton: this.page.locator('button', {
      hasText: 'Save and continue',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.locator('h1', {
      hasText: 'Has a deportation order been made against you?',
    }),
    informationText: this.page.locator('p', { hasText: 'This information' }),
    yesLabel: this.page.locator('label[for="answer"]'),
    noLabel: this.page.locator('label[for="answer-2"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'deportation-order', pageHeading: this.$static.pageHeading });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.informationText).toHaveText('This information helps the tribunal manage your appeal'),
      expect(this.$static.informationText).toBeVisible(),

      expect(this.$static.yesLabel).toHaveText('Yes'),
      expect(this.$static.yesLabel).toBeVisible(),

      expect(this.$static.noLabel).toHaveText('No'),
      expect(this.$static.noLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(option: { deportationOrderReceived: YesOrNoType }): Promise<void> {
    const element = this.page.locator(`input[type="radio"][value="${option.deportationOrderReceived}"]`);
    await element.check();
    await expect(element).toBeChecked();
    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
