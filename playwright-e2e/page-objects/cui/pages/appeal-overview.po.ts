import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../cui-base';

export class AppealOverviewPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  // Due to lack of unique identifiers, using the following elements to scope specific areas of the page
  private readonly caseInformationArea = this.page.locator('div[class*="overview-banner"]');
  private readonly yourAppealArgumentArea = this.page.locator("//h3[normalize-space()='Your appeal argument']/parent::div");
  private readonly yourAppealDetailsArea = this.page.locator("//h3[normalize-space()='Your appeal details']/parent::div");

  public readonly $interactive = {
    continueButton: this.page.locator('a[href="/about-appeal"][role="button"]', {
      hasText: 'Continue',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    userNameHeading: this.page.locator('h1[class*="govuk-heading"]'),
    nothingToDoNextHeading: this.page.getByRole('heading', { name: 'Nothing to do next', level: 2, exact: true }),
    completedHeading: this.page.getByRole('heading', { name: 'Completed', level: 2, exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $yourCaseInformation = {
    detailsSentToTribunalParagraph: this.caseInformationArea.getByText('Your appeal details have been sent to the Tribunal.', { exact: true }),
    thereIsAFeeForThisAppealParagraph: this.caseInformationArea.getByText(
      'There is a fee for this appeal. You told the Tribunal that you believe you do not have to pay some or all of the fee.',
      { exact: true },
    ),
    tribunalWillCheckInformationSentParagraph: this.caseInformationArea.getByText(
      'The Tribunal will check the information you sent and let you know if you need to pay a fee.',
      { exact: true },
    ),
    helpfulInformationHeading: this.caseInformationArea.getByText('Helpful Information', { exact: true }),
    whatIsATribunalCaseWorkerLink: this.caseInformationArea.getByText('What is a Tribunal Caseworker?', { exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $yourAppealArgument = {
    yourAppealArgumentHeading: this.page.getByRole('heading', { name: 'Your appeal argument', level: 3, exact: true }),
    whatYouSentHeading: this.yourAppealArgumentArea.getByRole('heading', { name: 'What you sent', level: 4, exact: true }),
    yourAppealDetailsLink: this.yourAppealArgumentArea.getByRole('link', { name: 'Your appeal details', exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $yourAppealDetails = {
    yourAppealDetailsHeading: this.page.getByRole('heading', { name: 'Your appeal details', level: 3, exact: true }),
    whatYouSentHeading: this.yourAppealDetailsArea.getByRole('heading', { name: 'What you sent', level: 4, exact: true }),
    yourAppealDetailsLink: this.yourAppealDetailsArea.getByRole('link', { name: 'Your appeal details', exact: true }),
    helpfulInformationHeading: this.yourAppealDetailsArea.getByRole('heading', { name: 'Helpful information', level: 4, exact: true }),
    whatIsATribunalCaseWorkerLink: this.yourAppealDetailsArea.getByRole('link', { name: 'What is a Tribunal Caseworker?', exact: true }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'appeal-overview', pageHeading: this.$static.userNameHeading });
  }
}
