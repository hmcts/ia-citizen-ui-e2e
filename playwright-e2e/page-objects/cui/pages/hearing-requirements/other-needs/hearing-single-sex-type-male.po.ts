import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';

export class HearingSingleSexTypeMalePage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly pageForm = this.page.locator('body:has(form[action="/hearing-single-sex-type-male"])');

  public readonly $inputs = {
    reasonForSingleSextypeHearingTextarea: this.pageForm.locator('textarea[name="reason"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    saveAndContinueButton: this.pageForm.getByRole('button', { name: 'Save and continue', exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.pageForm.getByRole('heading', {
      name: 'Tell us why you need an all-male hearing',
      level: 1,
      exact: true,
    }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'hearing-single-sex-type-male', pageHeading: this.$static.pageHeading });
  }

  public async completePageAndContinue(option: { reasonForAllMaleHearing: string }): Promise<void> {
    await this.$inputs.reasonForSingleSextypeHearingTextarea.fill(option.reasonForAllMaleHearing);
    await expect(this.$inputs.reasonForSingleSextypeHearingTextarea).toHaveValue(option.reasonForAllMaleHearing);

    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
