import { expect } from '@playwright/test';
import { ApiContext } from '../api-context';
import {
  YourDetailsJourney,
  DecisionTypeJourney,
  FeeSupportJourney,
  CheckAndSendJourney,
  AppealData,
  AppealReasonsFlowType,
  HearingRequestsFlowType,
} from '../../citizen-types';
import { ApplicantDetailsType } from '../../user-flows/citizen/api';
import { AppealOverviewApi, HearingCheckAnswersApi } from './index';

import {
  YourDetailsUserFlowApi,
  DecisionTypeUserFlowApi,
  FeeSupportUserFlowApi,
  CheckAndSendUserFlowApi,
  AppealReasonsUserFlowApi,
  HearingWitnessUserFlowApi,
  HearingWitnessFlowReturnType,
  HearingAccessNeedsUserFlowApi,
  HearingAccessNeedsFlowReturnType,
  HearingOtherNeedsUserFlowApi,
  HearingOtherNeedsFlowReturnType,
  HearingDatesToAvoidUserFlowApi,
  HearingDatesToAvoidFlowReturnType,
} from '../../user-flows/citizen/api';

export class CitizenApiClient {
  private readonly apiContext: ApiContext;

  private cui_yourDetailsUserFlowApi!: YourDetailsUserFlowApi;
  private cui_decisionTypeUserFlowApi!: DecisionTypeUserFlowApi;
  private cui_feeSupportUserFlowApi!: FeeSupportUserFlowApi;
  private cui_checkAndSendUserFlowApi!: CheckAndSendUserFlowApi;
  private cui_appealReasonsFlowApi!: AppealReasonsUserFlowApi;
  private cui_appealOverviewApi!: AppealOverviewApi;
  private cui_hearingWitnessUserFlowApi!: HearingWitnessUserFlowApi;
  private cui_hearingAccessNeedsUserFlowApi!: HearingAccessNeedsUserFlowApi;
  private cui_hearingOtherNeedsUserFlowApi!: HearingOtherNeedsUserFlowApi;
  private cui_hearingDatesToAvoidUserFlowApi!: HearingDatesToAvoidUserFlowApi;
  private cui_hearingCheckAnswersApi!: HearingCheckAnswersApi;

  constructor(
    private readonly username: string,
    private readonly password: string,
  ) {
    this.apiContext = new ApiContext();
  }

  public async init(): Promise<void> {
    const apiContext = await this.apiContext.createCitizenSiteApiContext({
      userName: this.username,
      password: this.password,
    });

    this.cui_yourDetailsUserFlowApi = new YourDetailsUserFlowApi(apiContext);
    this.cui_decisionTypeUserFlowApi = new DecisionTypeUserFlowApi(apiContext);
    this.cui_feeSupportUserFlowApi = new FeeSupportUserFlowApi(apiContext);
    this.cui_checkAndSendUserFlowApi = new CheckAndSendUserFlowApi(apiContext);
    this.cui_appealReasonsFlowApi = new AppealReasonsUserFlowApi(apiContext);
    this.cui_appealOverviewApi = new AppealOverviewApi(apiContext);
    this.cui_hearingWitnessUserFlowApi = new HearingWitnessUserFlowApi(apiContext);
    this.cui_hearingAccessNeedsUserFlowApi = new HearingAccessNeedsUserFlowApi(apiContext);
    this.cui_hearingOtherNeedsUserFlowApi = new HearingOtherNeedsUserFlowApi(apiContext);
    this.cui_hearingDatesToAvoidUserFlowApi = new HearingDatesToAvoidUserFlowApi(apiContext);
    this.cui_hearingCheckAnswersApi = new HearingCheckAnswersApi(apiContext);
  }

  public async submitYourDetailsUserFlowViaApi(appealData: YourDetailsJourney): Promise<ApplicantDetailsType> {
    return this.cui_yourDetailsUserFlowApi.submitYourDetailsFlowViaApi(appealData);
  }

  public async submitDecisionTypeUserFlowViaApi(appealData: DecisionTypeJourney): Promise<void> {
    await this.cui_decisionTypeUserFlowApi.submitDecisionTypeFlowViaApi(appealData);
  }

  public async submitFeeSupportUserFlowViaApi(appealData: FeeSupportJourney): Promise<void> {
    await this.cui_feeSupportUserFlowApi.submitFeeSupportFlowViaApi(appealData);
  }

  public async submitCheckAndSendUserFlowViaApi(appealData: CheckAndSendJourney): Promise<void> {
    await this.cui_checkAndSendUserFlowApi.submitCheckAndSendFlowViaApi(appealData);
  }

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

  public async submitAppealReasonsFlowViaApi(appealReasonsFlowData: AppealReasonsFlowType): Promise<void> {
    await expect(async () => {
      await this.init();
      const appealOverviewResponse = await this.cui_appealOverviewApi.get();

      expect(appealOverviewResponse, { message: 'Verify upon re-intialising user login, applicant is able to view next steps' }).toContain(
        'Tell us why you think the Home Office decision to refuse your claim is wrong.',
      );
    }).toPass({
      timeout: 30_000,
      intervals: [1_000],
    });

    await this.cui_appealReasonsFlowApi.submitAppealReasonsFlowViaApi(appealReasonsFlowData);
  }

  public async submitHearingWitnessFlowViaApi(options: HearingRequestsFlowType): Promise<HearingWitnessFlowReturnType> {
    await expect(async () => {
      await this.init();
      const appealOverviewResponse = await this.cui_appealOverviewApi.get();

      expect(appealOverviewResponse, { message: 'Verify upon re-intialising user login, applicant is able to view next steps' }).toContain(
        'Your appeal is going to hearing',
      );
    }).toPass({
      timeout: 30_000,
      intervals: [1_000],
    });

    return this.cui_hearingWitnessUserFlowApi.submitHearingWitnessFlowViaApi(options);
  }

  public async submitHearingAccessNeedsFlowViaApi(options: HearingRequestsFlowType): Promise<HearingAccessNeedsFlowReturnType> {
    return this.cui_hearingAccessNeedsUserFlowApi.submitHearingAccessNeedsFlowViaApi(options);
  }

  public async submitHearingOtherNeedsFlowViaApi(options: HearingRequestsFlowType): Promise<HearingOtherNeedsFlowReturnType> {
    return this.cui_hearingOtherNeedsUserFlowApi.submitHearingOtherNeedsFlowViaApi(options);
  }

  public async submitHearingDatesToAvoidFlowViaApi(options: HearingRequestsFlowType): Promise<HearingDatesToAvoidFlowReturnType> {
    return this.cui_hearingDatesToAvoidUserFlowApi.submitHearingDatesToAvoidFlowViaApi(options);
  }

  public async commpleteAndSubmitHearingRequirementsJourneyViaApi(options: HearingRequestsFlowType): Promise<{
    hearingWitnessFlow: HearingWitnessFlowReturnType;
    hearingAccessNeedsFlow: HearingAccessNeedsFlowReturnType;
    hearingOtherNeedsFlow: HearingOtherNeedsFlowReturnType;
    hearingDatesToAvoidFlow: HearingDatesToAvoidFlowReturnType;
  }> {
    const hearingWitnessFlow = await this.submitHearingWitnessFlowViaApi(options);
    const hearingAccessNeedsFlow = await this.submitHearingAccessNeedsFlowViaApi(options);
    const hearingOtherNeedsFlow = await this.submitHearingOtherNeedsFlowViaApi(options);
    const hearingDatesToAvoidFlow = await this.submitHearingDatesToAvoidFlowViaApi(options);
    await this.cui_hearingCheckAnswersApi.submitForm();

    return {
      hearingWitnessFlow,
      hearingAccessNeedsFlow,
      hearingOtherNeedsFlow,
      hearingDatesToAvoidFlow,
    };
  }
}
