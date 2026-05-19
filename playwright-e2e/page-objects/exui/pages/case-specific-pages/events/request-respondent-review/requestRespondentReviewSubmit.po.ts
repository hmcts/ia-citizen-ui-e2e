import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { DataUtils } from '../../../../../../utils';

export class RequestRespondentReviewSubmitPage extends ExuiBase {
  private readonly dataUtils: DataUtils = new DataUtils();
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    sendDirectionButton: this.page.getByRole('button', { name: 'Send direction', exact: true }),
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
    changeDirectionYouAreIssuingButton: this.page.locator('span[aria-label="Change Explain the direction you are issuing"]'),
    changeByWhatDateMustTheyComplyButton: this.page.locator('span[aria-label="Change By what date must they comply?"]'),
  } as const satisfies Record<string, Locator>;

  private readonly directionYouAreIssuingTableRowLocator = this.page.locator('tr', { hasText: 'Explain the direction' });
  private readonly whoAreYouGivingDirectionToTableRowLocator = this.page.locator('tr', { hasText: 'Who are you giving' });
  private readonly byWhatDateMustTheyComplyTableRowLocator = this.page.locator('tr', { hasText: 'By what date' });

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Request respondent review', exact: true }),
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
      urlPath: 'trigger/requestRespondentReview/submit',
      pageHeading: this.$static.pageHeading,
    });
  }

  private async verifyAllTextOnPage(): Promise<void> {
    const expectedDate = await this.dataUtils.getDateFromToday({ dayOffset: 14 });
    const date = new Date(expectedDate.year, expectedDate.month - 1, expectedDate.day);
    const formattedExpectedDate = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.checkYouAnswersHeading).toBeVisible(),
      expect(this.$static.checkInformationCarefullyText).toBeVisible(),

      expect(this.$static.directionYouAreIssuingQuestion).toHaveText('Explain the direction you are issuing'),
      expect(this.$static.directionYouAreIssuingQuestion).toBeVisible(),
      expect(this.$static.directionYouAreIssuingValue).toHaveText(`By the date below you must review the appellant’s ASA and bundle.
The review must comply with (i) Rule 24A (3) of the Tribunal Procedure Rules 2014 and (ii) Practice Direction (1.11.2024) Part 2, section 2.1 (e), Part 3, sections 7.11 – 7.12. Specifically, the review must:

- be meaningful.
- explain whether you agree that the schedule of disputed issues is correct. If not, the review must set out the correct list of disputed issues, including whether there are any further issues that the respondent wishes to raise.
- state whether you oppose or accept the appellant’s position on each issue and why.
- cross-reference your submissions to paragraphs in the decision under appeal, pages in the respondent’s bundle, any country information evidence schedule, and/or any additional evidence relied upon.
- specify which, if any, witnesses you intend to cross-examine and if you do not intend to cross-examine a witness, outline any objections to that witness’s statement being read by a judge.
- address whether the appeal should be allowed on any ground if the appellant and/or their key witnesses are found to be credible according to the applicable standard of proof.
- identify whether you are prepared to withdraw the decision (or part of it).
- state whether the appeal can be resolved without a hearing.
- not exceed 6 pages unless reasons are submitted in an accompanying application.
- not contain standard or pro-forma paragraphs.
- provide the name of the author of the review and the date.

Parties must ensure they conduct proceedings with procedural rigour. The Tribunal will not overlook breaches of the requirements of the Procedure Rules, Practice Statement or Practice Direction, nor failures to comply with directions issued by the Tribunal. Parties are reminded of the sanctions for non-compliance set out in paragraph 5.3 of the Practice Direction of 01.11.24.`),
      expect(this.$static.directionYouAreIssuingValue).toBeVisible(),

      expect(this.$static.whoAreYouGivingDirectionToQuestion).toHaveText('Who are you giving the direction to?'),
      expect(this.$static.whoAreYouGivingDirectionToQuestion).toBeVisible(),
      expect(this.$static.whoAreYouGivingDirectionToValue).toHaveText('Respondent'),
      expect(this.$static.whoAreYouGivingDirectionToValue).toBeVisible(),

      expect(this.$static.byWhatDateMustTheyComplyQuestion).toHaveText('By what date must they comply?'),
      expect(this.$static.byWhatDateMustTheyComplyQuestion).toBeVisible(),
      expect(this.$static.byWhatDateMustTheyComplyValue).toHaveText(formattedExpectedDate),
      expect(this.$static.byWhatDateMustTheyComplyValue).toBeVisible(),

      expect(this.$interactive.changeDirectionYouAreIssuingButton).toHaveText('Change'),
      expect(this.$interactive.changeDirectionYouAreIssuingButton).toBeVisible(),
      expect(this.$interactive.changeByWhatDateMustTheyComplyButton).toHaveText('Change'),
      expect(this.$interactive.changeByWhatDateMustTheyComplyButton).toBeVisible(),
    ]);
  }

  public async sendDirection(): Promise<void> {
    await this.verifyAllTextOnPage();
    await this.navigationClick(this.$interactive.sendDirectionButton);
  }
}
