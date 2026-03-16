import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';

export class HearingPhysicalMentalHealthReasonsPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly pageForm = this.page.locator('body:has(form[action="/hearing-physical-mental-health-reasons"])');

  public readonly $inputs = {
    howManyPhysicalOrMentalHealthConditionsTextarea: this.pageForm.locator('textarea[name="reason"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    saveAndContinueButton: this.pageForm.getByRole('button', { name: 'Save and continue', exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.pageForm.getByRole('heading', {
      name: 'Tell us how any physical or mental health conditions you have may affect you at the hearing',
      level: 1,
      exact: true,
    }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'hearing-physical-mental-health-reasons', pageHeading: this.$static.pageHeading });
  }

  public async completePageAndContinue(option: { howManyPhysicalOrMentalHealthConditions: string }): Promise<void> {
    await this.$inputs.howManyPhysicalOrMentalHealthConditionsTextarea.fill(option.howManyPhysicalOrMentalHealthConditions);
    await expect(this.$inputs.howManyPhysicalOrMentalHealthConditionsTextarea).toHaveValue(option.howManyPhysicalOrMentalHealthConditions);

    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
