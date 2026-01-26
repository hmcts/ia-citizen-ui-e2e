import { APIRequestContext } from '@playwright/test';
import { CheckAndSendJourney } from '../../../types';
import { CheckAnswersApi, PaymentApi } from '../../../api-requests/citizen/index';

export class CheckAndSendJourneyApi {
  private cui_checkAnswersApi: CheckAnswersApi;
  private cui_paymentApi: PaymentApi;

  constructor(apiContext: APIRequestContext) {
    this.cui_checkAnswersApi = new CheckAnswersApi(apiContext);
    this.cui_paymentApi = new PaymentApi(apiContext);
  }

  public async submitCheckAndSendJourneyViaApi(appealData: CheckAndSendJourney): Promise<void> {
    await this.cui_checkAnswersApi.submitForm();

    if (appealData.appealSubmissionType === 'Pay Appeal') {
      await this.cui_paymentApi.submitForm();
    }
  }
}
