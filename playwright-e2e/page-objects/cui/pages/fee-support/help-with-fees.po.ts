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

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'help-with-fees', pageHeading: this.$static.pageHeading });
  }

  public async completePageAndContinue(option: { helpWithFees: 'wantToApply' | 'alreadyApplied' | 'willPayForAppeal' }): Promise<void> {
    const element = this.pageForm.locator(`input[type="radio"][value="${option.helpWithFees}"]`);

    await element.check();
    await expect(element).toBeChecked();
    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
