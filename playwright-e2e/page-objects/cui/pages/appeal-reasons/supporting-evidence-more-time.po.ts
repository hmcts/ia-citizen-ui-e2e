import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../cui-base';
import { YesOrNoType } from '../../../../citizen-types';

export class SupportingEvidenceMoreTimePage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly pageForm = this.page.locator('body:has(form[action*="/supporting-evidence-more-time"])');

  public readonly $interactive = {
    continueButton: this.pageForm.getByRole('button', { name: 'Continue', exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.pageForm.getByRole('heading', {
      level: 1,
      name: 'Do you want to provide supporting evidence for why you need more time?',
      exact: true,
    }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'supporting-evidence-more-time', pageHeading: this.$static.pageHeading });
  }

  public async completePageAndContinue(options: { doYouWishToProvideSupportingEvidence: YesOrNoType }): Promise<void> {
    const element = this.pageForm.locator(`input[type="radio"][value="${options.doYouWishToProvideSupportingEvidence.toLowerCase()}"]`);
    await element.check();
    await expect(element).toBeChecked();

    await this.navigationClick(this.$interactive.continueButton);
  }
}
