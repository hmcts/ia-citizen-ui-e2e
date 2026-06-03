import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../cui-base';

export class FtpaReasonPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    continueButton: this.page.getByRole('button', {
      name: 'Continue',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $inputs = {
    ftpaReasonInput: this.page.locator('textarea[id="ftpaReason"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { name: "Why do you think the Tribunal's decision is wrong?", level: 1, exact: true }),
    ftpaReasonLabel: this.page.locator('label[for="ftpaReason"]'),
    ftpaReasonHintText: this.page.locator('div[id="ftpaReason-hint"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'ftpa-reason', pageHeading: this.$static.pageHeading });
  }

  private async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.ftpaReasonLabel).toBeVisible(),
      expect(this.$static.ftpaReasonLabel).toHaveText(
        'Tell us what you think the Tribunal got wrong when deciding your appeal and explain why you think it is wrong. You can provide supporting evidence for your answer on the next page, if you have it.',
      ),
      expect(this.$static.ftpaReasonHintText).toBeVisible(),
      expect(this.$static.ftpaReasonHintText).toHaveText("Explain why you think the Tribunal's decision is wrong."),
    ]);
  }

  public async completePageAndContinue(options: { ftpaReason: string }): Promise<void> {
    await this.verifyAllTextOnPage();

    await this.$inputs.ftpaReasonInput.fill(options.ftpaReason);
    await expect(this.$inputs.ftpaReasonInput).toHaveValue(options.ftpaReason);

    await this.navigationClick(this.$interactive.continueButton);
  }
}
