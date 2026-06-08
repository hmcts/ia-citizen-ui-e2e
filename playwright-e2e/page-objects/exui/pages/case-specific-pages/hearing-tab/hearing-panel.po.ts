import { expect, Locator, Page } from '@playwright/test';
import { ExuiBase } from '../../../exui-base';
import { YesOrNoType } from '../../../../../citizen-types';

export class HearingPanelPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { name: 'Do you require a panel for this hearing?', level: 1, exact: true }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'hearing-panel',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async completePageAndContinue(options: { doYouRequireAPanel: YesOrNoType }): Promise<void> {
    const radioButtonToSelect = this.page.getByRole('radio', { name: options.doYouRequireAPanel, exact: true });
    if (!(await radioButtonToSelect.isChecked())) {
      await radioButtonToSelect.click();
      await expect(radioButtonToSelect).toBeChecked();
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
