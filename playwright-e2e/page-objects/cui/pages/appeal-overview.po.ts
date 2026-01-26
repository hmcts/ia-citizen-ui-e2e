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
    nothingToDoNextHeading: this.page.locator('h2', {
      hasText: 'Nothing to do next',
    }),
    completedHeading: this.page.locator('h2', {
      hasText: 'Completed',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $yourCaseInformation = {
    detailsSentToTribunalParagraph: this.caseInformationArea.locator('p', {
      hasText: 'Your appeal details have been sent to the Tribunal.',
    }),
    thereIsAFeeForThisAppealParagraph: this.caseInformationArea.locator('p', {
      hasText: 'There is a fee for this appeal. You told the Tribunal that you believe you do not have to pay some or all of the fee.',
    }),
    tribunalWillCheckInformationSentParagraph: this.caseInformationArea.locator('p', {
      hasText: 'The Tribunal will check the information you sent and let you know if you need to pay a fee.',
    }),
    helpfulInformationHeading: this.caseInformationArea.locator('span', { hasText: 'Helpful Information' }),
    whatIsATribunalCaseWorkerLink: this.caseInformationArea.locator('a[href="/tribunal-caseworker"]', {
      hasText: 'What is a Tribunal Caseworker?',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $yourAppealArgument = {
    yourAppealArgumentHeading: this.page.locator('h3', {
      hasText: 'Your appeal argument',
    }),
    whatYouSentHeading: this.yourAppealArgumentArea.locator('h4', {
      hasText: 'What you sent',
    }),
    yourAppealDetailsLink: this.yourAppealArgumentArea.locator('a[href="/appeal-details"]', {
      hasText: 'Your appeal details',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $yourAppealDetails = {
    yourAppealDetailsHeading: this.page.locator('h3', {
      hasText: 'Your appeal details',
    }),
    whatYouSentHeading: this.yourAppealDetailsArea.locator('h4', {
      hasText: 'What you sent',
    }),
    yourAppealDetailsLink: this.yourAppealDetailsArea.locator('a[href="/appeal-details"]', {
      hasText: 'Your appeal details',
    }),
    helpfulInformationHeading: this.yourAppealDetailsArea.locator('h4', {
      hasText: 'Helpful information',
    }),
    whatIsATribunalCaseWorkerLink: this.yourAppealDetailsArea.locator('a[href="/tribunal-caseworker"]', {
      hasText: 'What is a Tribunal Caseworker?',
    }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnAppealOverviewPage(): Promise<void> {
    await Promise.all([
      expect(async () => {
        expect(this.page.url().includes('appeal-overview')).toBeTruthy();
      }).toPass({ intervals: [100], timeout: 15_000 }),

      expect(this.$static.userNameHeading).toBeVisible({ timeout: 15_000 }),
    ]);
  }
}
