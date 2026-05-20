import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

export class RequestHearingRequirementsPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    submitButton: this.page.getByRole('button', { name: 'Submit', exact: true }),
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Request hearing requirements', exact: true }),
    caseRecordHeading: this.page.getByRole('heading', { level: 1, name: 'Case record for' }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/requestHearingRequirementsFeature/requestHearingRequirementsFeaturerequestHearingRequirementsFeature',
      pageHeading: this.$static.pageHeading,
    });
  }

  private async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([expect(this.$static.caseRecordHeading).toBeVisible()]);
  }

  public async submitEvent(): Promise<void> {
    await this.verifyAllTextOnPage();
    await this.navigationClick(this.$interactive.submitButton);
  }
}
