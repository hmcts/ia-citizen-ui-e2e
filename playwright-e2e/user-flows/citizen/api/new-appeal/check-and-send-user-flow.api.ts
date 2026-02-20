import { APIRequestContext } from '@playwright/test';
import { CheckAndSendJourney } from '../../../../citizen-types';
import { LateAppealApi, CheckAnswersApi, PaymentApi } from '../../../../api-requests/citizen/index';

export class CheckAndSendUserFlowApi {
  private cui_lateAppealApi: LateAppealApi;
  private cui_checkAnswersApi: CheckAnswersApi;
  private cui_paymentApi: PaymentApi;

  constructor(apiContext: APIRequestContext) {
    this.cui_checkAnswersApi = new CheckAnswersApi(apiContext);
    this.cui_paymentApi = new PaymentApi(apiContext);
    this.cui_lateAppealApi = new LateAppealApi(apiContext);
  }

  public async submitCheckAndSendFlowViaApi(appealData: CheckAndSendJourney): Promise<void> {
    if (!appealData.isApplicationInTime) {
      await this.cui_lateAppealApi.submitForm({ reasonForLateAppeal: 'The appeal is late because of reasons beyond my control.' });
    }

    await this.cui_checkAnswersApi.submitForm();

    if (appealData.appealSubmissionType === 'Pay Appeal') {
      await this.cui_paymentApi.submitForm();
    }
  }
}
