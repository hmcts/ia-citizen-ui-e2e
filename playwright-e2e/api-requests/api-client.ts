import { APIRequestContext } from '@playwright/test';
import { YourDetailsJourney, DecisionTypeJourney, FeeSupportJourney, CheckAndSendJourney, AppealData } from '../types';
import { ApplicantDetailsType } from '../journeys/citizen/ui';

import { YourDetailsJourneyApi, DecisionTypeJourneyApi, FeeSupportJourneyApi, CheckAndSendJourneyApi } from '../journeys/citizen/api';

export class ApiClient {
  private cui_yourDetailsJourneyApi: YourDetailsJourneyApi;
  private cui_decisionTypeJourneyApi: DecisionTypeJourneyApi;
  private cui_feeSupportJourneyApi: FeeSupportJourneyApi;
  private cui_checkAndSendJourneyApi: CheckAndSendJourneyApi;

  constructor(apiContext: APIRequestContext) {
    this.cui_yourDetailsJourneyApi = new YourDetailsJourneyApi(apiContext);
    this.cui_decisionTypeJourneyApi = new DecisionTypeJourneyApi(apiContext);
    this.cui_feeSupportJourneyApi = new FeeSupportJourneyApi(apiContext);
    this.cui_checkAndSendJourneyApi = new CheckAndSendJourneyApi(apiContext);
  }

  /**
   * Submits the "Your Details" journey via the API.
   * @param appealData: YourDetailsJourney - The data required for the "Your Details" journey.
   * @returns The applicant details used to populate the forms in the journey
   */
  public async submitYourDetailsJourneyViaApi(appealData: YourDetailsJourney): Promise<ApplicantDetailsType> {
    const applicantDetails = await this.cui_yourDetailsJourneyApi.submitYourDetailsJourneyViaApi(appealData);
    return applicantDetails;
  }

  /**
   * Submits the "Decision Type" journey via the API.
   * @param appealData: DecisionTypeJourney - The data required for the "Decision Type" journey.
   */
  public async submitDecisionTypeJourneyViaApi(appealData: DecisionTypeJourney): Promise<void> {
    await this.cui_decisionTypeJourneyApi.submitDecisionTypeJourneyViaApi(appealData);
  }

  /**
   * Submits the "Fee Support" journey via the API.
   * @param appealData: FeeSupportJourney - The data required for the "Fee Support" journey.
   */
  public async submitFeeSupportJourneyViaApi(appealData: FeeSupportJourney): Promise<void> {
    await this.cui_feeSupportJourneyApi.submitFeeSupportJourneyViaApi(appealData);
  }

  /**
   * Submits the "Check and Send" journey via the API.
   * @param appealData: CheckAndSendJourney - The data required for the "Check and Send" journey.
   */
  public async submitCheckAndSendJourneyViaApi(appealData: CheckAndSendJourney): Promise<void> {
    await this.cui_checkAndSendJourneyApi.submitCheckAndSendJourneyViaApi(appealData);
  }

  /**
   * Submits the entire appeal process via the API, including all journeys.
   * @param appealData: AppealData - The complete appeal data required for all journeys.
   * @returns The applicant details used to populate the forms in the journey
   * @throws Error if fee support information is missing for applicable appeal types.
   */
  public async completeAndSubmitAppealJourneyViaApi(appealData: AppealData): Promise<ApplicantDetailsType> {
    const applicantDetails = await this.submitYourDetailsJourneyViaApi({
      isUserInTheUk: appealData.isUserInTheUk,
      appealType: appealData.appealType,
      isApplicantStateless: false,
      nationality: appealData.nationality,
      hasApplicantReceivedADeportationOrder: appealData.hasApplicantReceivedADeportationOrder,
      doesApplicantHaveASponsor: appealData.doesApplicantHaveASponsor,
    });

    await this.submitDecisionTypeJourneyViaApi({
      appealType: appealData.appealType,
      decisionWithOrWithoutHearing: appealData.decisionWithOrWithoutHearing,
      payForAppealNowOrLater: appealData.payForAppealNowOrLater,
    });

    if (appealData.appealType !== 'Deprivation of Citizenship' && appealData.appealType !== 'Revocation of Protection Status') {
      if (!appealData.whetherApplicantHasToPayAFee) {
        throw new Error('Fee support information is required for this appeal type.');
      }

      await this.submitFeeSupportJourneyViaApi({
        whetherApplicantHasToPayAFee: appealData.whetherApplicantHasToPayAFee,
      });
    }

    await this.submitCheckAndSendJourneyViaApi({ appealSubmissionType: appealData.appealSubmissionType });

    return applicantDetails;
  }
}
