import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';

export class HearingAnythingElseReasonsPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly pageForm = this.page.locator('body:has(form[action="/hearing-anything-else-reasons"])');

  public readonly $inputs = {
    whatAndWhyYouNeedItTextarea: this.pageForm.locator('textarea[name="reason"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    saveAndContinueButton: this.pageForm.getByRole('button', { name: 'Save and continue', exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.pageForm.getByRole('heading', {
      name: 'Tell us what you will need and why you need it',
      level: 1,
      exact: true,
    }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'hearing-anything-else-reasons', pageHeading: this.$static.pageHeading });
  }

  public async completePageAndContinue(option: { whatAndWhyYouNeedIt: string }): Promise<void> {
    await this.$inputs.whatAndWhyYouNeedItTextarea.fill(option.whatAndWhyYouNeedIt);
    await expect(this.$inputs.whatAndWhyYouNeedItTextarea).toHaveValue(option.whatAndWhyYouNeedIt);

    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
