import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';

export class HearingDatesAvoidReasonsPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly pageForm = this.page.locator('body:has(form[action="/hearing-dates-avoid-reasons"])');

  public readonly $inputs = {
    reasonForAvoidingDateTextarea: this.pageForm.locator('textarea[name="reason"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    saveAndContinueButton: this.pageForm.getByRole('button', { name: 'Save and continue', exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.pageForm.getByRole('heading', {
      name: 'Why can you or any witnesses not go to the hearing on this date?',
      level: 1,
      exact: true,
    }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'hearing-dates-avoid-reasons', pageHeading: this.$static.pageHeading });
  }

  public async completePageAndContinue(option: { reasonForAvoidingDate: string }): Promise<void> {
    await this.$inputs.reasonForAvoidingDateTextarea.fill(option.reasonForAvoidingDate);
    await expect(this.$inputs.reasonForAvoidingDateTextarea).toHaveValue(option.reasonForAvoidingDate);

    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
