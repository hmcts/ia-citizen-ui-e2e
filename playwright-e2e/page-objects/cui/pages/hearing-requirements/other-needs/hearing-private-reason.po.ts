import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';

export class HearingPrivateReasonPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly pageForm = this.page.locator('body:has(form[action="/hearing-private-reason"])');

  public readonly $inputs = {
    reasonForPrivateHearingTextarea: this.pageForm.locator('textarea[name="reason"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    saveAndContinueButton: this.pageForm.getByRole('button', { name: 'Save and continue', exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.pageForm.getByRole('heading', {
      name: 'Tell us why you need a private hearing',
      level: 1,
      exact: true,
    }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'hearing-private-reason', pageHeading: this.$static.pageHeading });
  }

  public async completePageAndContinue(option: { reasonForPrivateHearing: string }): Promise<void> {
    await this.$inputs.reasonForPrivateHearingTextarea.fill(option.reasonForPrivateHearing);
    await expect(this.$inputs.reasonForPrivateHearingTextarea).toHaveValue(option.reasonForPrivateHearing);

    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
