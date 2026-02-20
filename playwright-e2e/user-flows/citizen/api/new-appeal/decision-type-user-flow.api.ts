import { APIRequestContext } from '@playwright/test';
import { DecisionTypeJourney } from '../../../../citizen-types';
import { DecisionTypeApi, PayNowApi } from '../../../../api-requests/citizen/index';

export class DecisionTypeUserFlowApi {
  private cui_decisionTypeApi: DecisionTypeApi;
  private cui_payNowApi: PayNowApi;

  constructor(apiContext: APIRequestContext) {
    this.cui_decisionTypeApi = new DecisionTypeApi(apiContext);
    this.cui_payNowApi = new PayNowApi(apiContext);
  }

  public async submitDecisionTypeFlowViaApi(appealData: DecisionTypeJourney): Promise<void> {
    await this.cui_decisionTypeApi.submitForm({
      decisionWithOrWithoutHearing: appealData.decisionWithOrWithoutHearing,
    });

    if (appealData.appealType === 'Protection') {
      if (!appealData.payForAppealNowOrLater) {
        throw new Error('appealData.payForAppealNowOrLater must be provided for appeal type Protection');
      }
      await this.cui_payNowApi.submitForm({
        payNowOrLater: appealData.payForAppealNowOrLater,
      });
    }
  }
}
