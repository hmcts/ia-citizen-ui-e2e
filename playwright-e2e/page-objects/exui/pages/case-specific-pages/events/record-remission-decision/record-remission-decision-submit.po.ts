import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { RemissionDecisionType } from '../../../../../../exui-event-types';

export class RecordRemissionDecisionSubmitPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    recordDecisionButton: this.page.getByRole('button', { name: 'Record decision', exact: true }),
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
    changeDecisionButton: this.page.locator('span[aria-label="Change Decision"]'),
    changeAmountRemittedButton: this.page.locator('span[aria-label="Change Amount remitted"]'),
    changeAmountLeftToPayButton: this.page.locator('span[aria-label="Change Amount left to pay"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Record remission decision', exact: true }),
    caseRecordHeading: this.page.getByRole('heading', { level: 1, name: 'Case record for' }),
    checkYourAnswersHeading: this.page.getByRole('heading', { level: 2, name: 'Check your answers', exact: true }),
    checkInformationText: this.page.locator('span', { hasText: 'Check the information' }),
    decisionLabel: this.page.locator('th span', { hasText: 'Decision' }),
    decisionValue: this.page.locator('tr', { hasText: 'Decision' }).locator('td[class*="case-field-content"] span'),
    amountRemittedLabel: this.page.locator('th span', { hasText: 'Amount remitted' }),
    amountRemittedValue: this.page.locator('tr', { hasText: 'Amount remitted' }).locator('td[class*="case-field-content"] span'),
    amountLeftToPayLabel: this.page.locator('th span', { hasText: 'Amount left to pay' }),
    amountLeftToPayValue: this.page.locator('tr', { hasText: 'Amount left to pay' }).locator('td[class*="case-field-content"] span'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/recordRemissionDecision/submit',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyCorrectInformationIsDisplayed(options: {
    remissionDecision: RemissionDecisionType;
    amountRemitted: number;
    amountLeftToPay: number;
  }): Promise<void> {
    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.checkYourAnswersHeading).toBeVisible(),

      expect(this.$static.checkInformationText).toHaveText('Check the information below carefully.'),
      expect(this.$static.checkInformationText).toBeVisible(),

      expect(this.$static.decisionLabel).toBeVisible(),
      expect(this.$static.decisionValue).toHaveText(options.remissionDecision, { ignoreCase: true }),
      expect(this.$static.decisionValue).toBeVisible(),

      expect(this.$static.amountRemittedLabel).toBeVisible(),
      expect(this.$static.amountRemittedValue).toHaveText(`£${options.amountRemitted}.00`),
      expect(this.$static.amountRemittedValue).toBeVisible(),

      expect(this.$static.amountLeftToPayLabel).toBeVisible(),
      expect(this.$static.amountLeftToPayValue).toHaveText(`£${options.amountLeftToPay}.00`),
      expect(this.$static.amountLeftToPayValue).toBeVisible(),

      expect(this.$interactive.changeDecisionButton).toBeVisible(),
      expect(this.$interactive.changeAmountRemittedButton).toBeVisible(),
      expect(this.$interactive.changeAmountLeftToPayButton).toBeVisible(),
    ]);
  }

  public async submitRecordDecision(): Promise<void> {
    await this.navigationClick(this.$interactive.recordDecisionButton);
  }
}
