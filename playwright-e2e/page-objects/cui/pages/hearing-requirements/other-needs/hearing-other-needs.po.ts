import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';

export class HearingOtherNeedsPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    continueButton: this.page.getByRole('button', { name: 'Continue', exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { name: 'Other needs', level: 1, exact: true }),
    ifYouHaveAnyOtherNeedsText: this.page.getByText('If you have any other needs,'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'hearing-other-needs', pageHeading: this.$static.pageHeading });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.ifYouHaveAnyOtherNeedsText).toHaveText(
        'If you have any other needs, they will be considered but it might not be possible to provide for them at the appointment.',
      ),
      expect(this.$static.ifYouHaveAnyOtherNeedsText).toBeVisible(),
    ]);
  }

  public async continueOnToNextPage(): Promise<void> {
    await this.navigationClick(this.$interactive.continueButton);
  }
}
