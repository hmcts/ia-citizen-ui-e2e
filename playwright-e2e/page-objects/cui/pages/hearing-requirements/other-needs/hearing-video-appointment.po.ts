import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';
import { YesOrNoType } from '../../../../../citizen-types';

export class HearingVideoAppointmentPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly pageForm = this.page.locator('body:has(form[action="/hearing-video-appointment"])');

  public readonly $interactive = {
    saveAndContinueButton: this.pageForm.getByRole('button', { name: 'Save and continue', exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.pageForm.getByRole('heading', { name: 'Would you be able to join the hearing by video call?', level: 1, exact: true }),
    videoHearingHintText: this.pageForm.locator('div[id="answer-hint"] p'),
    yesLabel: this.pageForm.locator('input[type="radio"][value="yes"] + label'),
    noLabel: this.pageForm.locator('input[type="radio"][value="no"] + label'),
    whyUnableToJoinVideoCallHeading: this.pageForm.getByRole('heading', {
      name: 'Why you might not be able to join a video call?',
      level: 2,
      exact: true,
    }),
    whyUnableToJoinVideoCallExampleText: this.pageForm.getByText('For example, if you:', { exact: true }),
    whyUnableToJoinVideoCallBulletPoint1: this.pageForm.locator('div[class="panel-background"]').getByRole('listitem').nth(0),
    whyUnableToJoinVideoCallBulletPoint2: this.pageForm.locator('div[class="panel-background"]').getByRole('listitem').nth(1),
    whyUnableToJoinVideoCallBulletPoint3: this.pageForm.locator('div[class="panel-background"]').getByRole('listitem').nth(2),
    whyUnableToJoinVideoCallBulletPoint4: this.pageForm.locator('div[class="panel-background"]').getByRole('listitem').nth(3),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'hearing-video-appointment', pageHeading: this.$static.pageHeading });
  }

  private async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.videoHearingHintText).toHaveText(
        'The Tribunal may decide to have the hearing by video call.  Answer no if there are reasonsyou would not be able to join a video call.',
      ),
      expect(this.$static.videoHearingHintText).toBeVisible(),

      expect(this.$static.yesLabel).toHaveText('Yes'),
      expect(this.$static.yesLabel).toBeVisible(),

      expect(this.$static.noLabel).toHaveText('No'),
      expect(this.$static.noLabel).toBeVisible(),

      expect(this.$static.whyUnableToJoinVideoCallHeading).toBeVisible(),

      expect(this.$static.whyUnableToJoinVideoCallExampleText).toBeVisible(),

      expect(this.$static.whyUnableToJoinVideoCallBulletPoint1).toHaveText(
        'have a disability that would make it difficult to join a video call, like being blind or deaf',
      ),
      expect(this.$static.whyUnableToJoinVideoCallBulletPoint1).toBeVisible(),

      expect(this.$static.whyUnableToJoinVideoCallBulletPoint2).toHaveText(
        'do not have a computer or mobile device you can use to join the video call',
      ),
      expect(this.$static.whyUnableToJoinVideoCallBulletPoint2).toBeVisible(),

      expect(this.$static.whyUnableToJoinVideoCallBulletPoint3).toHaveText('do not have a good internet connection'),
      expect(this.$static.whyUnableToJoinVideoCallBulletPoint3).toBeVisible(),

      expect(this.$static.whyUnableToJoinVideoCallBulletPoint4).toHaveText('do not have a quiet, private room to use for the hearing'),
      expect(this.$static.whyUnableToJoinVideoCallBulletPoint4).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(option: { areYouAbleToJoinHearingViaVideoCall: YesOrNoType; verifyAllTextOnPage?: boolean }): Promise<void> {
    if (option.verifyAllTextOnPage) {
      await this.verifyAllTextOnPage();
    }

    const element = this.pageForm.locator(`input[type="radio"][value="${option.areYouAbleToJoinHearingViaVideoCall.toLowerCase()}"]`);
    await element.check();
    await expect(element).toBeChecked();

    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
