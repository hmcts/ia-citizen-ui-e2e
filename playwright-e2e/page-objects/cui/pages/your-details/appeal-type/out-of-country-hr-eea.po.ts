import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';
import { YesOrNoType } from '../../../../../citizen-types';

export class OutOfCountryHrEeaPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly pageForm = this.page.locator('body:has(form[action="/ooc-hr-eea"])');

  public readonly $interactive = {
    continueButton: this.pageForm.getByRole('button', {
      name: 'Continue',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.pageForm.locator('h1', {
      hasText: 'Were you outside the UK when you made your application?',
    }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'ooc-hr-eea', pageHeading: this.$static.pageHeading });
  }

  public async completePageAndContinue(option: { outsideUkWhenApplicationMade: YesOrNoType }): Promise<void> {
    const element = this.pageForm.locator(`input[type="radio"][value="${option.outsideUkWhenApplicationMade}"]`);

    await element.check();
    await expect(element).toBeChecked();
    await this.navigationClick(this.$interactive.continueButton);
  }
}
