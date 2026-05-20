import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { DataUtils } from '../../../../../../utils';

export class RequestRespondentEvidenceSubmitPage extends ExuiBase {
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
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Request respondent evidence', exact: true }),
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
      urlPath: 'trigger/requestRespondentEvidence/submit',
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
      expect(this.$static.directionYouAreIssuingValue).toHaveText(`A notice of appeal has been lodged against this decision.

By the date indicated below the respondent is directed to supply the documents:

The bundle must comply with (i) Rule 23 or Rule 24 of the Tribunal Procedure Rules 2014 (as applicable) and (ii) Practice Direction (1.11.2024) Part 3, sections 7.1 - 7.4. Specifically, the bundle must contain:

- the notice of decision appealed against.
- any other document provided to the appellant giving reasons for that decision.
- any evidence or material relevant to the disputed issues.
- any statements of evidence.
- the application form.
- any record of interview with the appellant in relation to the decision being appealed.
- any previous decision(s) of the Tribunal and Upper Tribunal (IAC) relating to the appellant.
- any other unpublished documents on which you rely.
- the notice of any other appealable decision made in relation to the appellant.

Where the appeal involves deportation, you must also include the following evidence:

- a copy of the Certificate of Conviction.
- a copy of any indictment/charge.
- a transcript of the Sentencing Judge's Remarks.
- a copy of any Pre-Sentence Report.
- a copy of the appellant's criminal record.
- a copy of any Parole Report or other document relating to the appellant's period in custody and/or release.
- a copy of any mental health report.

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
