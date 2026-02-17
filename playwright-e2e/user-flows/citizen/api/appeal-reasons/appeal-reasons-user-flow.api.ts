import { APIRequestContext } from '@playwright/test';
import { AppealReasonsFlowType } from '../../../../citizen-types';
import {
  HomeOfficeDecisionWrongApi,
  SupportingEvidenceApi,
  ProvideSupportingEvidenceApi,
  CheckAnswerApi,
  AskForMoreTimeApi,
  SupportingEvidenceMoreTimeApi,
  ProvideSupportingEvidenceMoreTimeApi,
  CheckAnswersMoreTimeApi,
} from '../../../../api-requests/citizen/index';

export class AppealReasonsUserFlowApi {
  private homeOfficeDecisionWrongApi: HomeOfficeDecisionWrongApi;
  private supportingEvidenceApi: SupportingEvidenceApi;
  private provideSupportingEvidenceApi: ProvideSupportingEvidenceApi;
  private checkAnswerApi: CheckAnswerApi;
  private askForMoreTimeApi: AskForMoreTimeApi;
  private supportingEvidenceMoreTimeApi: SupportingEvidenceMoreTimeApi;
  private provideSupportingEvidenceMoreTimeApi: ProvideSupportingEvidenceMoreTimeApi;
  private checkAnswersMoreTimeApi: CheckAnswersMoreTimeApi;

  constructor(apiContext: APIRequestContext) {
    this.homeOfficeDecisionWrongApi = new HomeOfficeDecisionWrongApi(apiContext);
    this.supportingEvidenceApi = new SupportingEvidenceApi(apiContext);
    this.provideSupportingEvidenceApi = new ProvideSupportingEvidenceApi(apiContext);
    this.checkAnswerApi = new CheckAnswerApi(apiContext);
    this.askForMoreTimeApi = new AskForMoreTimeApi(apiContext);
    this.supportingEvidenceMoreTimeApi = new SupportingEvidenceMoreTimeApi(apiContext);
    this.provideSupportingEvidenceMoreTimeApi = new ProvideSupportingEvidenceMoreTimeApi(apiContext);
    this.checkAnswersMoreTimeApi = new CheckAnswersMoreTimeApi(apiContext);
  }

  public async submitAppealReasonsFlowViaApi(applicantData: AppealReasonsFlowType): Promise<void> {
    if (applicantData.doesApplicantRequireMoreTimeToSubmitAppealReasons && !applicantData.askForMoreTime) {
      throw new Error('askForMoreTime data must be provided if applicant requires more time to submit appeal reasons');
    } else if (!applicantData.doesApplicantRequireMoreTimeToSubmitAppealReasons && !applicantData.appealReasons) {
      throw new Error('appealReasons data must be provided if applicant does not require more time to submit appeal reasons');
    }

    if (applicantData.doesApplicantRequireMoreTimeToSubmitAppealReasons) {
      await this.askForMoreTimeApi.submitForm({ howMuchAndWhyMoreTimeNeeded: applicantData.askForMoreTime!.howMuchAndWhyMoreTimeNeeded });

      await this.supportingEvidenceMoreTimeApi.submitForm({
        doYouWishToProvideSupportingEvidence: applicantData.askForMoreTime!.doYouWishToProvideSupportingEvidence,
      });

      if (applicantData.askForMoreTime!.doYouWishToProvideSupportingEvidence === 'Yes') {
        await this.provideSupportingEvidenceMoreTimeApi.submitForm({});
      }

      await this.checkAnswersMoreTimeApi.submitForm();
    } else {
      await this.homeOfficeDecisionWrongApi.submitForm({
        reasonWhyHomeOfficeDecisionIsWrong: applicantData.appealReasons!.reasonWhyHomeOfficeDecisionIsWrong,
      });

      await this.supportingEvidenceApi.submitForm({
        doYouWishToProvideSupportingEvidence: applicantData.appealReasons!.doYouWishToProvideSupportingEvidence,
      });

      if (applicantData.appealReasons!.doYouWishToProvideSupportingEvidence === 'Yes') {
        await this.provideSupportingEvidenceApi.submitForm({});
      }

      await this.checkAnswerApi.submitForm();
    }
  }
}
