import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../../cui-base';
import { YesOrNoType } from '../../../../../../citizen-types';

export class InTheUkPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    continueButton: this.page.locator('button[name="continue"]', {
      hasText: 'Continue',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.locator('h1', {
      hasText: 'Are you currently living in the United Kingdom?',
    }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'in-the-uk', pageHeading: this.$static.pageHeading });
  }

  public async completePageAndContinue(option: { isUserInTheUk: YesOrNoType }): Promise<void> {
    const element = this.page.locator(`input[type="radio"][value="${option.isUserInTheUk}"]`);

    switch (option.isUserInTheUk) {
      case 'Yes':
        await expect(element).toBeChecked();
        break;
      case 'No':
        await element.check();
        await expect(element).toBeChecked();
        break;
      default:
        throw new Error(`Option value: ${option.isUserInTheUk} is not valid`);
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
