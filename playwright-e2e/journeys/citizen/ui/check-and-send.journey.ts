import { Page } from '@playwright/test';
import { CheckAndSendJourney } from '../../../types';
import {
  AboutAppealPage,
  CheckAnswersPage,
  AppealDetailsSentPage,
  PaymentDetailsPage,
  ConfirmPaymentDetailsPage,
  ConfirmationOfPaymentPage,
  AppealOverviewPage,
} from '../../../page-objects/cui/pages/index';

export class CheckAndSendSectionOfAppealJourney {
  constructor(private readonly page: Page) {}
  private cui_aboutAppealPage = new AboutAppealPage(this.page);
  private cui_checkAnswersPage = new CheckAnswersPage(this.page);
  private cui_appealDetailsSentPage = new AppealDetailsSentPage(this.page);
  private cui_paymentDetailsPage = new PaymentDetailsPage(this.page);
  private cui_confirmPaymentDetailsPage = new ConfirmPaymentDetailsPage(this.page);
  private cui_confirmationOfPaymentPage = new ConfirmationOfPaymentPage(this.page);
  private cui_appealOverviewPage = new AppealOverviewPage(this.page);

  public async complete(appealData: CheckAndSendJourney): Promise<void> {
    await this.cui_aboutAppealPage.verifyUserIsOnAboutAppealPage();
    await this.cui_aboutAppealPage.navigationClick(this.cui_aboutAppealPage.$interactive.checkAndSendYourAppealDetailsLink);

    await this.cui_checkAnswersPage.verifyUserIsOnCheckAnswersPage();
    await this.cui_checkAnswersPage.submitApplication();

    await this.cui_appealDetailsSentPage.verifyUserIsOnAppealDetailsSentPage();

    switch (appealData.appealSubmissionType) {
      case 'Non-Pay Appeal':
        await this.cui_appealDetailsSentPage.navigationClick(this.cui_appealDetailsSentPage.$interactive.seeYourAppealProgressButton);
        break;
      case 'Pay Appeal':
        await this.cui_appealDetailsSentPage.navigationClick(this.cui_appealDetailsSentPage.$interactive.payForAppealButton);

        await this.cui_paymentDetailsPage.verifyUserIsOnPaymentDetailsPage();
        await this.cui_paymentDetailsPage.autoPopulateAndSubmitPaymentDetailsForm();

        await this.cui_confirmPaymentDetailsPage.verifyUserIsOnConfirmPaymentDetailsPage();
        await this.cui_confirmPaymentDetailsPage.navigationClick(this.cui_confirmPaymentDetailsPage.$interactive.confirmPaymentButton);

        await this.cui_confirmationOfPaymentPage.verifyUserIsOnConfirmationOfPaymentPage();
        await this.cui_confirmationOfPaymentPage.navigationClick(this.cui_confirmationOfPaymentPage.$interactive.appealProgressButton);
        break;
      default:
        throw new Error(`Unsupported Appeal Submission Type: ${appealData}`);
    }

    await this.cui_appealOverviewPage.verifyUserIsOnAppealOverviewPage();
  }
}
