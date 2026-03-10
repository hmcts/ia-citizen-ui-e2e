import { Page } from '@playwright/test';
import { AppealDetailsSentPage } from './appeal-details-sent.po';
import { CuiBase } from '../../cui-base';

export class ConfirmationOfPaymentPage extends CuiBase {
  private appealDetailsSentPage: AppealDetailsSentPage;
  public readonly $interactive: typeof this.appealDetailsSentPage.$interactive;
  public readonly $static: typeof this.appealDetailsSentPage.$static;

  constructor(page: Page) {
    super(page);
    this.appealDetailsSentPage = new AppealDetailsSentPage(page);
    this.$interactive = this.appealDetailsSentPage.$interactive;
    this.$static = this.appealDetailsSentPage.$static;
  }

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'confirmation-payment', pageHeading: this.$static.pageHeading });
  }
}
