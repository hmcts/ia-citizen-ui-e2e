import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../cui-base';
import { YesOrNoType } from '../../../../citizen-types';

export class FtpaEvidenceQuestionPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    continueButton: this.page.getByRole('button', {
      name: 'Continue',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { name: 'Do you want to provide supporting evidence?', level: 1, exact: true }),
    yesLabel: this.page.locator('input[value="Yes"] + label'),
    noLabel: this.page.locator('input[value="No"] + label'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'ftpa-evidence-question', pageHeading: this.$static.pageHeading });
  }

  private async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.yesLabel).toBeVisible(),
      expect(this.$static.yesLabel).toHaveText('Yes'),
      expect(this.$static.noLabel).toBeVisible(),
      expect(this.$static.noLabel).toHaveText('No'),
    ]);
  }

  public async completePageAndContinue(options: { doesUserWantToProvideEvidence: YesOrNoType }): Promise<void> {
    await this.verifyAllTextOnPage();

    await this.page.getByRole('radio', { name: options.doesUserWantToProvideEvidence }).check();
    await expect(this.page.getByRole('radio', { name: options.doesUserWantToProvideEvidence })).toBeChecked();

    await this.navigationClick(this.$interactive.continueButton);
  }
}
