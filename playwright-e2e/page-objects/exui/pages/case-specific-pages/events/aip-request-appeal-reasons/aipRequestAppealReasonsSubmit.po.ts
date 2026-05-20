import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { DataUtils } from '../../../../../../utils';

export class AipRequestAppealReasonsSubmitPage extends ExuiBase {
  private readonly dataUtils: DataUtils = new DataUtils();
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    submitButton: this.page.getByRole('button', { name: 'Submit', exact: true }),
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
    changeByWhatDateMustTheyComplyButton: this.page.locator('span[aria-label="Change By what date must they comply?"]'),
  } as const satisfies Record<string, Locator>;

  private readonly directionYouAreIssuingTableRowLocator = this.page.locator('tr', { hasText: 'Explain the direction' });
  private readonly whoAreYouGivingDirectionToTableRowLocator = this.page.locator('tr', { hasText: 'Who are you giving' });
  private readonly byWhatDateMustTheyComplyTableRowLocator = this.page.locator('tr', { hasText: 'By what date' });

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'AiP - Request Appeal Reasons', exact: true }),
    caseRecordHeading: this.page.getByRole('heading', { level: 1, name: 'Case record for' }),
    checkYouAnswersHeading: this.page.getByRole('heading', { level: 2, name: 'Check your answers', exact: true }),
    checkInformationCarefullyText: this.page.getByText('Check the information below carefully.', { exact: true }),
    directionYouAreIssuingQuestion: this.directionYouAreIssuingTableRowLocator.locator('th span'),
    directionYouAreIssuingValue: this.directionYouAreIssuingTableRowLocator.locator('td span').nth(0),
    whoAreYouGivingDirectionToQuestion: this.whoAreYouGivingDirectionToTableRowLocator.locator('th span'),
    whoAreYouGivingDirectionToValue: this.whoAreYouGivingDirectionToTableRowLocator.locator('td span').nth(0),
    byWhatDateMustTheyComplyQuestion: this.byWhatDateMustTheyComplyTableRowLocator.locator('th span'),
    byWhatDateMustTheyComplyValue: this.byWhatDateMustTheyComplyTableRowLocator.locator('td span').nth(0),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/requestReasonsForAppeal/submit',
      pageHeading: this.$static.pageHeading,
    });
  }

  private async verifyAllTextOnPage(): Promise<void> {
    const expectedDate = await this.dataUtils.getDateFromToday({ dayOffset: 28 });
    const date = new Date(expectedDate.year, expectedDate.month - 1, expectedDate.day);
    const formattedExpectedDate = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.checkYouAnswersHeading).toBeVisible(),
      expect(this.$static.checkInformationCarefullyText).toBeVisible(),

      expect(this.$static.directionYouAreIssuingQuestion).toHaveText('Explain the direction you are issuing'),
      expect(this.$static.directionYouAreIssuingQuestion).toBeVisible(),
      expect(this.$static.directionYouAreIssuingValue).toHaveText(
        'You must now tell us why you think the Home Office decision to refuse your claim is wrong.',
      ),
      expect(this.$static.directionYouAreIssuingValue).toBeVisible(),

      expect(this.$static.whoAreYouGivingDirectionToQuestion).toHaveText('Who are you giving the direction to?'),
      expect(this.$static.whoAreYouGivingDirectionToQuestion).toBeVisible(),
      expect(this.$static.whoAreYouGivingDirectionToValue).toHaveText('Appellant'),
      expect(this.$static.whoAreYouGivingDirectionToValue).toBeVisible(),

      expect(this.$static.byWhatDateMustTheyComplyQuestion).toHaveText('By what date must they comply?'),
      expect(this.$static.byWhatDateMustTheyComplyQuestion).toBeVisible(),
      expect(this.$static.byWhatDateMustTheyComplyValue).toHaveText(formattedExpectedDate),
      expect(this.$static.byWhatDateMustTheyComplyValue).toBeVisible(),

      expect(this.$interactive.changeByWhatDateMustTheyComplyButton).toHaveText('Change'),
      expect(this.$interactive.changeByWhatDateMustTheyComplyButton).toBeVisible(),
    ]);
  }

  public async sendDirection(): Promise<void> {
    await this.verifyAllTextOnPage();
    await this.navigationClick(this.$interactive.submitButton);
  }
}
