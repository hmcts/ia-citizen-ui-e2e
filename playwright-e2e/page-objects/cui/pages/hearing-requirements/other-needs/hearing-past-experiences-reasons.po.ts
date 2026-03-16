import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';

export class HearingPastExperiencesReasonsPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly pageForm = this.page.locator('body:has(form[action="/hearing-past-experiences-reasons"])');

  public readonly $inputs = {
    howManyPastExpereincesThatMayAffectHearingTextarea: this.pageForm.locator('textarea[name="reason"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    saveAndContinueButton: this.pageForm.getByRole('button', { name: 'Save and continue', exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.pageForm.getByRole('heading', {
      name: 'Tell us how any past experiences may affect you at the hearing',
      level: 1,
      exact: true,
    }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'hearing-past-experiences-reasons', pageHeading: this.$static.pageHeading });
  }

  public async completePageAndContinue(option: { howManyPastExpereincesThatMayAffectHearing: string }): Promise<void> {
    await this.$inputs.howManyPastExpereincesThatMayAffectHearingTextarea.fill(option.howManyPastExpereincesThatMayAffectHearing);
    await expect(this.$inputs.howManyPastExpereincesThatMayAffectHearingTextarea).toHaveValue(option.howManyPastExpereincesThatMayAffectHearing);

    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
