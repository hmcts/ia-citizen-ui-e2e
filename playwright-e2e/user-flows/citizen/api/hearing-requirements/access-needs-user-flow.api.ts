import { APIRequestContext } from '@playwright/test';
import {
  HearingInterpreterSignLanguageSelectionApi,
  HearingInterpreterSpokenLanguageSelectionApi,
  HearingInterpreterSupportAppellantWitnessesApi,
  HearingInterpreterTypesApi,
  HearingLoopApi,
  HearingStepFreeAccessApi,
} from '../../../../api-requests/citizen/index';
import {
  WhoNeedsInterpretorType,
  InterpretorSupportType,
  LanguagesType,
  SignLanguagesType,
  YesOrNoType,
  HearingRequestsFlowType,
} from '../../../../citizen-types';

export type HearingAccessNeedsFlowReturnType = {
  doesApplicantOrWitnessRequireInterpretor: WhoNeedsInterpretorType;
  willYouOrWitnessRequireStepFreeAccess: YesOrNoType;
  willYouOrWitnessNeedHearingLoop: YesOrNoType;
  typeOfInterpretorSupport?: {
    typeOfInterpretorSupportForApplicant: InterpretorSupportType;
    applicantSpokenInterpretorLanguage: LanguagesType;
    applicantSignInterpretorLanguage: SignLanguagesType;
    typeOfInterpretorSupportForWitness: InterpretorSupportType;
    witnessSpokenInterpretorLanguage: LanguagesType;
    witnessSignInterpretorLanguage: SignLanguagesType;
  };
};

export class HearingAccessNeedsUserFlowApi {
  private cui_hearingInterpreterSignLanguageSelectionApi: HearingInterpreterSignLanguageSelectionApi;
  private cui_hearingInterpreterSpokenLanguageSelectionApi: HearingInterpreterSpokenLanguageSelectionApi;
  private cui_hearingInterpreterSupportAppellantWitnessesApi: HearingInterpreterSupportAppellantWitnessesApi;
  private cui_hearingInterpreterTypesApi: HearingInterpreterTypesApi;
  private cui_hearingLoopApi: HearingLoopApi;
  private cui_hearingStepFreeAccessApi: HearingStepFreeAccessApi;

  constructor(apiContext: APIRequestContext) {
    this.cui_hearingInterpreterSignLanguageSelectionApi = new HearingInterpreterSignLanguageSelectionApi(apiContext);
    this.cui_hearingInterpreterSpokenLanguageSelectionApi = new HearingInterpreterSpokenLanguageSelectionApi(apiContext);
    this.cui_hearingInterpreterSupportAppellantWitnessesApi = new HearingInterpreterSupportAppellantWitnessesApi(apiContext);
    this.cui_hearingInterpreterTypesApi = new HearingInterpreterTypesApi(apiContext);
    this.cui_hearingLoopApi = new HearingLoopApi(apiContext);
    this.cui_hearingStepFreeAccessApi = new HearingStepFreeAccessApi(apiContext);
  }

  public async submitHearingAccessNeedsFlowViaApi(options: HearingRequestsFlowType): Promise<HearingAccessNeedsFlowReturnType> {
    let doesApplicantOrWitnessRequireInterpretor: WhoNeedsInterpretorType;
    let typeOfInterpretorSupportForApplicant: InterpretorSupportType;
    let typeOfInterpretorSupportForWitness: InterpretorSupportType;
    let applicantSpokenInterpretorLanguage: LanguagesType;
    let applicantSignInterpretorLanguage: SignLanguagesType;
    let witnessSpokenInterpretorLanguage: LanguagesType;
    let witnessSignInterpretorLanguage: SignLanguagesType;
    let willYouOrWitnessRequireStepFreeAccess: YesOrNoType;
    let willYouOrWitnessNeedHearingLoop: YesOrNoType;

    switch (options.pathToTake) {
      case 'Minimal Path':
        doesApplicantOrWitnessRequireInterpretor = 'No interpretor required';
        willYouOrWitnessRequireStepFreeAccess = 'No';
        willYouOrWitnessNeedHearingLoop = 'No';

        await this.cui_hearingInterpreterSupportAppellantWitnessesApi.submitForm({ typeOfSupport: doesApplicantOrWitnessRequireInterpretor });
        await this.cui_hearingStepFreeAccessApi.submitForm({ willYouOrWitnessRequireStepFreeAccess: willYouOrWitnessRequireStepFreeAccess });
        await this.cui_hearingLoopApi.submitForm({ willYouOrWitnessNeedHearingLoop: willYouOrWitnessNeedHearingLoop });
        break;
      case 'Maximum Path':
        doesApplicantOrWitnessRequireInterpretor = 'Interpretor for applicant and witness';
        typeOfInterpretorSupportForApplicant = 'Spoken and sign language interpretor';
        applicantSpokenInterpretorLanguage = 'Mandarin';
        applicantSignInterpretorLanguage = 'International Sign (IS)';
        typeOfInterpretorSupportForWitness = 'Spoken and sign language interpretor';
        witnessSpokenInterpretorLanguage = 'Portuguese';
        witnessSignInterpretorLanguage = 'Visual frame signing';
        willYouOrWitnessRequireStepFreeAccess = 'Yes';
        willYouOrWitnessNeedHearingLoop = 'Yes';

        await this.cui_hearingInterpreterSupportAppellantWitnessesApi.submitForm({ typeOfSupport: doesApplicantOrWitnessRequireInterpretor });
        await this.cui_hearingInterpreterTypesApi.submitForm({
          applicantOrWitness: 'Applicant',
          typeOfInterpretor: typeOfInterpretorSupportForApplicant,
        });
        await this.cui_hearingInterpreterSpokenLanguageSelectionApi.submitForm({
          applicantOrWitness: 'Applicant',
          languageToInterpret: applicantSpokenInterpretorLanguage,
        });
        await this.cui_hearingInterpreterSignLanguageSelectionApi.submitForm({
          applicantOrWitness: 'Applicant',
          signLanguageToInterpret: applicantSignInterpretorLanguage,
        });
        await this.cui_hearingInterpreterTypesApi.submitForm({
          applicantOrWitness: 'Witness',
          typeOfInterpretor: typeOfInterpretorSupportForWitness,
        });
        await this.cui_hearingInterpreterSpokenLanguageSelectionApi.submitForm({
          applicantOrWitness: 'Witness',
          languageToInterpret: witnessSpokenInterpretorLanguage,
        });
        await this.cui_hearingInterpreterSignLanguageSelectionApi.submitForm({
          applicantOrWitness: 'Witness',
          signLanguageToInterpret: witnessSignInterpretorLanguage,
        });
        await this.cui_hearingStepFreeAccessApi.submitForm({ willYouOrWitnessRequireStepFreeAccess: willYouOrWitnessRequireStepFreeAccess });
        await this.cui_hearingLoopApi.submitForm({ willYouOrWitnessNeedHearingLoop: willYouOrWitnessNeedHearingLoop });
        break;
      default:
        throw new Error(`Unknown pathToTake value: ${options.pathToTake}`);
    }

    return {
      doesApplicantOrWitnessRequireInterpretor: doesApplicantOrWitnessRequireInterpretor,
      willYouOrWitnessRequireStepFreeAccess: willYouOrWitnessRequireStepFreeAccess,
      willYouOrWitnessNeedHearingLoop: willYouOrWitnessNeedHearingLoop,
      typeOfInterpretorSupport:
        options.pathToTake === 'Maximum Path'
          ? {
              typeOfInterpretorSupportForApplicant: typeOfInterpretorSupportForApplicant!,
              applicantSpokenInterpretorLanguage: applicantSpokenInterpretorLanguage!,
              applicantSignInterpretorLanguage: applicantSignInterpretorLanguage!,
              typeOfInterpretorSupportForWitness: typeOfInterpretorSupportForWitness!,
              witnessSpokenInterpretorLanguage: witnessSpokenInterpretorLanguage!,
              witnessSignInterpretorLanguage: witnessSignInterpretorLanguage!,
            }
          : undefined,
    };
  }
}
