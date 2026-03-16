import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';

export class HearingVideoAppointmentReasonsPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly pageForm = this.page.locator('body:has(form[action="/hearing-video-appointment-reasons"])');

  public readonly $inputs = {
    reasonUnableToJoinVideoCallTextarea: this.pageForm.locator('textarea[name="reason"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    saveAndContinueButton: this.pageForm.getByRole('button', { name: 'Save and continue', exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.pageForm.getByRole('heading', {
      name: 'Tell us the reasons you would not be able to join a video call',
      level: 1,
      exact: true,
    }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'hearing-video-appointment-reasons', pageHeading: this.$static.pageHeading });
  }

  public async completePageAndContinue(option: { reasonUnableToJoinVideoCall: string }): Promise<void> {
    await this.$inputs.reasonUnableToJoinVideoCallTextarea.fill(option.reasonUnableToJoinVideoCall);
    await expect(this.$inputs.reasonUnableToJoinVideoCallTextarea).toHaveValue(option.reasonUnableToJoinVideoCall);

    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
