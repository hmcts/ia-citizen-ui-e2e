import { APIRequestContext } from '@playwright/test';
import { YourDetailsJourney, DecisionTypeJourney, FeeSupportJourney, CheckAndSendJourney, AppealData } from '../types';
import { ApplicantDetailsType } from '../user-flows/citizen/api';

import { YourDetailsUserFlowApi, DecisionTypeUserFlowApi, FeeSupportUserFlowApi, CheckAndSendUserFlowApi } from '../user-flows/citizen/api';

export class ApiClient {
  private cui_yourDetailsUserFlowApi: YourDetailsUserFlowApi;
  private cui_decisionTypeUserFlowApi: DecisionTypeUserFlowApi;
  private cui_feeSupportUserFlowApi: FeeSupportUserFlowApi;
  private cui_checkAndSendUserFlowApi: CheckAndSendUserFlowApi;

  constructor(apiContext: APIRequestContext) {
    this.cui_yourDetailsUserFlowApi = new YourDetailsUserFlowApi(apiContext);
    this.cui_decisionTypeUserFlowApi = new DecisionTypeUserFlowApi(apiContext);
    this.cui_feeSupportUserFlowApi = new FeeSupportUserFlowApi(apiContext);
    this.cui_checkAndSendUserFlowApi = new CheckAndSendUserFlowApi(apiContext);
  }

  /**
   * Submits the "Your Details" user flow via the API.
   * @param appealData: YourDetailsJourney - The data required for the "Your Details" user flow.
   * @returns The applicant details used to populate the forms in the user flow
   */
  public async submitYourDetailsUserFlowViaApi(appealData: YourDetailsJourney): Promise<ApplicantDetailsType> {
    const applicantDetails = await this.cui_yourDetailsUserFlowApi.submitYourDetailsJourneyViaApi(appealData);
    return applicantDetails;
  }

  /**
   * Submits the "Decision Type" user flow via the API.
   * @param appealData: DecisionTypeJourney - The data required for the "Decision Type" user flow.
   */
  public async submitDecisionTypeUserFlowViaApi(appealData: DecisionTypeJourney): Promise<void> {
    await this.cui_decisionTypeUserFlowApi.submitDecisionTypeJourneyViaApi(appealData);
  }

  /**
   * Submits the "Fee Support" user flow via the API.
   * @param appealData: FeeSupportJourney - The data required for the "Fee Support" user flow.
   */
  public async submitFeeSupportUserFlowViaApi(appealData: FeeSupportJourney): Promise<void> {
    await this.cui_feeSupportUserFlowApi.submitFeeSupportJourneyViaApi(appealData);
  }

  /**
   * Submits the "Check and Send" user flow via the API.
   * @param appealData: CheckAndSendJourney - The data required for the "Check and Send" user flow.
   */
  public async submitCheckAndSendUserFlowViaApi(appealData: CheckAndSendJourney): Promise<void> {
    await this.cui_checkAndSendUserFlowApi.submitCheckAndSendJourneyViaApi(appealData);
  }

  /**
   * Submits the entire appeal process via the API, including all user flows.
   * @param appealData: AppealData - The complete appeal data required for all user flows.
   * @returns The applicant details used to populate the forms in the journey
   * @throws Error if fee support information is missing for applicable appeal types.
   */
  public async completeAndSubmitAppealJourneyViaApi(appealData: AppealData): Promise<ApplicantDetailsType> {
    const applicantDetails = await this.submitYourDetailsUserFlowViaApi({
      isUserInTheUk: appealData.isUserInTheUk,
      appealType: appealData.appealType,
      isApplicantStateless: appealData.isApplicantStateless,
      isApplicationInTime: appealData.isApplicationInTime,
      nationality: appealData.nationality,
      hasApplicantReceivedADeportationOrder: appealData.hasApplicantReceivedADeportationOrder,
      doesApplicantHaveASponsor: appealData.doesApplicantHaveASponsor,
    });

    await this.submitDecisionTypeUserFlowViaApi({
      appealType: appealData.appealType,
      decisionWithOrWithoutHearing: appealData.decisionWithOrWithoutHearing,
      payForAppealNowOrLater: appealData.payForAppealNowOrLater,
    });

    if (appealData.appealType !== 'Deprivation of Citizenship' && appealData.appealType !== 'Revocation of Protection Status') {
      if (!appealData.whetherApplicantHasToPayAFee) {
        throw new Error('Fee support information is required for this appeal type.');
      }

      await this.submitFeeSupportUserFlowViaApi({
        whetherApplicantHasToPayAFee: appealData.whetherApplicantHasToPayAFee,
      });
    }

    await this.submitCheckAndSendUserFlowViaApi({
      isApplicationInTime: appealData.isApplicationInTime,
      appealSubmissionType: appealData.appealSubmissionType,
    });

    return applicantDetails;
  }
}
