import { APIRequestContext } from '@playwright/test';
import {
  HearingAnythingElseReasonsApi,
  HearingAnythingElseApi,
  HearingMultiMediaEvidenceEquipmentReasonsApi,
  HearingMultiMediaEvidenceEquipmentApi,
  HearingMultiMediaEvidenceApi,
  HearingPastExperiencesReasonsApi,
  HearingPastExperiencesApi,
  HearingPhysicalMentalHealthReasonsApi,
  HearingPhysicalMentalHealthApi,
  HearingPrivateReasonsApi,
  HearingPrivateApi,
  HearingSingleSexTypeReasonApi,
  HearingSingleSexTypeApi,
  HearingSingleSexApi,
  HearingVideoAppointmentReasonsApi,
  HearingVideoAppointmentApi,
} from '../../../../api-requests/citizen/index';
import { YesOrNoType, AllMaleOrFemaleHearingType, HearingRequestsFlowType } from '../../../../citizen-types';

export type HearingOtherNeedsFlowReturnType = {
  areYouAbleToJoinHearingViaVideoCall: YesOrNoType;
  willYouBringVideoOrAudioEvidence: YesOrNoType;
  willYouNeedAllFemaleOrMaleHearing: YesOrNoType;
  willYouNeedAPrivateHearing: YesOrNoType;
  anyPhysicalOrMentalHealthConditions: YesOrNoType;
  anyPastExperienceThatMayAffectHearing: YesOrNoType;
  needAnythingElse: YesOrNoType;
  reasonUnableToJoinVideoCall: string | undefined;
  willYouBringEquipmentToPlayEvidence: YesOrNoType | undefined;
  reasonUnableToBringEquipment: string | undefined;
  allMaleOrFemaleHearing: AllMaleOrFemaleHearingType | undefined;
  reasonForSingleSexHearing: string | undefined;
  reasonForPrivateHearing: string | undefined;
  howManyPhysicalOrMentalHealthConditions: string | undefined;
  reasonForPastExperiencesAffectingHearing: string | undefined;
  needAnythingElseDetails: string | undefined;
};

export class HearingOtherNeedsUserFlowApi {
  private cui_hearingAnythingElseReasonsApi: HearingAnythingElseReasonsApi;
  private cui_hearingAnythingElseApi: HearingAnythingElseApi;
  private cui_hearingMultiMediaEvidenceEquipmentReasonsApi: HearingMultiMediaEvidenceEquipmentReasonsApi;
  private cui_hearingMultiMediaEvidenceEquipmentApi: HearingMultiMediaEvidenceEquipmentApi;
  private cui_hearingMultiMediaEvidenceApi: HearingMultiMediaEvidenceApi;
  private cui_hearingPastExperiencesReasonsApi: HearingPastExperiencesReasonsApi;
  private cui_hearingPastExperiencesApi: HearingPastExperiencesApi;
  private cui_hearingPhysicalMentalHealthReasonsApi: HearingPhysicalMentalHealthReasonsApi;
  private cui_hearingPhysicalMentalHealthApi: HearingPhysicalMentalHealthApi;
  private cui_hearingPrivateReasonsApi: HearingPrivateReasonsApi;
  private cui_hearingPrivateApi: HearingPrivateApi;
  private cui_hearingSingleSexTypeReasonApi: HearingSingleSexTypeReasonApi;
  private cui_hearingSingleSexTypeApi: HearingSingleSexTypeApi;
  private cui_hearingSingleSexApi: HearingSingleSexApi;
  private cui_hearingVideoAppointmentReasonsApi: HearingVideoAppointmentReasonsApi;
  private cui_hearingVideoAppointmentApi: HearingVideoAppointmentApi;

  constructor(apiContext: APIRequestContext) {
    this.cui_hearingAnythingElseReasonsApi = new HearingAnythingElseReasonsApi(apiContext);
    this.cui_hearingAnythingElseApi = new HearingAnythingElseApi(apiContext);
    this.cui_hearingMultiMediaEvidenceEquipmentReasonsApi = new HearingMultiMediaEvidenceEquipmentReasonsApi(apiContext);
    this.cui_hearingMultiMediaEvidenceEquipmentApi = new HearingMultiMediaEvidenceEquipmentApi(apiContext);
    this.cui_hearingMultiMediaEvidenceApi = new HearingMultiMediaEvidenceApi(apiContext);
    this.cui_hearingPastExperiencesReasonsApi = new HearingPastExperiencesReasonsApi(apiContext);
    this.cui_hearingPastExperiencesApi = new HearingPastExperiencesApi(apiContext);
    this.cui_hearingPhysicalMentalHealthReasonsApi = new HearingPhysicalMentalHealthReasonsApi(apiContext);
    this.cui_hearingPhysicalMentalHealthApi = new HearingPhysicalMentalHealthApi(apiContext);
    this.cui_hearingPrivateReasonsApi = new HearingPrivateReasonsApi(apiContext);
    this.cui_hearingPrivateApi = new HearingPrivateApi(apiContext);
    this.cui_hearingSingleSexTypeReasonApi = new HearingSingleSexTypeReasonApi(apiContext);
    this.cui_hearingSingleSexTypeApi = new HearingSingleSexTypeApi(apiContext);
    this.cui_hearingSingleSexApi = new HearingSingleSexApi(apiContext);
    this.cui_hearingVideoAppointmentReasonsApi = new HearingVideoAppointmentReasonsApi(apiContext);
    this.cui_hearingVideoAppointmentApi = new HearingVideoAppointmentApi(apiContext);
  }

  public async submitHearingOtherNeedsFlowViaApi(options: HearingRequestsFlowType): Promise<HearingOtherNeedsFlowReturnType> {
    let areYouAbleToJoinHearingViaVideoCall: YesOrNoType;
    let willYouBringVideoOrAudioEvidence: YesOrNoType;
    let willYouNeedAllFemaleOrMaleHearing: YesOrNoType;
    let willYouNeedAPrivateHearing: YesOrNoType;
    let anyPhysicalOrMentalHealthConditions: YesOrNoType;
    let anyPastExperienceThatMayAffectHearing: YesOrNoType;
    let needAnythingElse: YesOrNoType;
    let reasonUnableToJoinVideoCall: string | undefined;
    let willYouBringEquipmentToPlayEvidence: YesOrNoType | undefined;
    let reasonUnableToBringEquipment: string | undefined;
    let allMaleOrFemaleHearing: AllMaleOrFemaleHearingType | undefined;
    let reasonForSingleSexHearing: string | undefined;
    let reasonForPrivateHearing: string | undefined;
    let howManyPhysicalOrMentalHealthConditions: string | undefined;
    let reasonForPastExperiencesAffectingHearing: string | undefined;
    let needAnythingElseDetails: string | undefined;

    switch (options.pathToTake) {
      case 'Minimal Path':
        areYouAbleToJoinHearingViaVideoCall = 'Yes';
        willYouBringVideoOrAudioEvidence = 'No';
        willYouNeedAllFemaleOrMaleHearing = 'No';
        willYouNeedAPrivateHearing = 'No';
        anyPhysicalOrMentalHealthConditions = 'No';
        anyPastExperienceThatMayAffectHearing = 'No';
        needAnythingElse = 'No';

        await this.cui_hearingVideoAppointmentApi.submitForm({ areYouAbleToJoinHearingViaVideoCall: areYouAbleToJoinHearingViaVideoCall });
        await this.cui_hearingMultiMediaEvidenceApi.submitForm({ willYouBringVideoOrAudioEvidence: willYouBringVideoOrAudioEvidence });
        await this.cui_hearingSingleSexApi.submitForm({ willYouNeedAllFemaleOrMaleHearing: willYouNeedAllFemaleOrMaleHearing });
        await this.cui_hearingPrivateApi.submitForm({ willYouNeedAPrivateHearing: willYouNeedAPrivateHearing });
        await this.cui_hearingPhysicalMentalHealthApi.submitForm({ anyPhysicalOrMentalHealthConditions: anyPhysicalOrMentalHealthConditions });
        await this.cui_hearingPastExperiencesApi.submitForm({ anyPastExperienceThatMayAffectHearing: anyPastExperienceThatMayAffectHearing });
        await this.cui_hearingAnythingElseApi.submitForm({ needAnythingElse: needAnythingElse });
        break;
      case 'Maximum Path':
        areYouAbleToJoinHearingViaVideoCall = 'No';
        reasonUnableToJoinVideoCall = 'I do not have access to a device that can join a video call';
        willYouBringVideoOrAudioEvidence = 'Yes';
        willYouBringEquipmentToPlayEvidence = 'No';
        reasonUnableToBringEquipment = 'I do not have access to the equipment needed to play the evidence at the hearing';
        willYouNeedAllFemaleOrMaleHearing = 'Yes';
        allMaleOrFemaleHearing = 'All male';
        reasonForSingleSexHearing = 'I have experienced trauma and would feel uncomfortable in a mixed sex hearing';
        willYouNeedAPrivateHearing = 'Yes';
        reasonForPrivateHearing = 'I have experienced trauma and would feel uncomfortable in a public hearing';
        anyPhysicalOrMentalHealthConditions = 'Yes';
        howManyPhysicalOrMentalHealthConditions = 'I have 2 physical or mental health conditions';
        anyPastExperienceThatMayAffectHearing = 'Yes';
        reasonForPastExperiencesAffectingHearing = 'I have experienced trauma that may affect my hearing';
        needAnythingElse = 'Yes';
        needAnythingElseDetails = 'I have a dog that I need to bring to the hearing';

        await this.cui_hearingVideoAppointmentApi.submitForm({ areYouAbleToJoinHearingViaVideoCall: areYouAbleToJoinHearingViaVideoCall });
        await this.cui_hearingVideoAppointmentReasonsApi.submitForm({ reasonUnableToJoinVideoCall: reasonUnableToJoinVideoCall });
        await this.cui_hearingMultiMediaEvidenceApi.submitForm({ willYouBringVideoOrAudioEvidence: willYouBringVideoOrAudioEvidence });
        await this.cui_hearingMultiMediaEvidenceEquipmentApi.submitForm({ willYouBringEquipmentToPlayEvidence: willYouBringEquipmentToPlayEvidence });
        await this.cui_hearingMultiMediaEvidenceEquipmentReasonsApi.submitForm({ reasonUnableToBringEquipment: reasonUnableToBringEquipment });
        await this.cui_hearingSingleSexApi.submitForm({ willYouNeedAllFemaleOrMaleHearing: willYouNeedAllFemaleOrMaleHearing });
        await this.cui_hearingSingleSexTypeApi.submitForm({ typeOfHearing: allMaleOrFemaleHearing });
        await this.cui_hearingSingleSexTypeReasonApi.submitForm({ typeOfHearing: 'male', reasonForSingleSextypeHearing: reasonForSingleSexHearing });
        await this.cui_hearingPrivateApi.submitForm({ willYouNeedAPrivateHearing: willYouNeedAPrivateHearing });
        await this.cui_hearingPrivateReasonsApi.submitForm({ reasonForPrivateHearing: reasonForPrivateHearing });
        await this.cui_hearingPhysicalMentalHealthApi.submitForm({ anyPhysicalOrMentalHealthConditions: anyPhysicalOrMentalHealthConditions });
        await this.cui_hearingPhysicalMentalHealthReasonsApi.submitForm({
          howManyPhysicalOrMentalHealthConditions: howManyPhysicalOrMentalHealthConditions,
        });
        await this.cui_hearingPastExperiencesApi.submitForm({ anyPastExperienceThatMayAffectHearing: anyPastExperienceThatMayAffectHearing });
        await this.cui_hearingPastExperiencesReasonsApi.submitForm({
          howManyPastExpereincesThatMayAffectHearing: reasonForPastExperiencesAffectingHearing,
        });
        await this.cui_hearingAnythingElseApi.submitForm({ needAnythingElse: needAnythingElse });
        await this.cui_hearingAnythingElseReasonsApi.submitForm({ whatAndWhyYouNeedIt: needAnythingElseDetails });
        break;
      default:
        throw new Error(`Unknown pathToTake value: ${options.pathToTake}`);
    }

    return {
      areYouAbleToJoinHearingViaVideoCall: areYouAbleToJoinHearingViaVideoCall,
      willYouBringVideoOrAudioEvidence: willYouBringVideoOrAudioEvidence,
      willYouNeedAllFemaleOrMaleHearing: willYouNeedAllFemaleOrMaleHearing,
      willYouNeedAPrivateHearing: willYouNeedAPrivateHearing,
      anyPhysicalOrMentalHealthConditions: anyPhysicalOrMentalHealthConditions,
      anyPastExperienceThatMayAffectHearing: anyPastExperienceThatMayAffectHearing,
      needAnythingElse: needAnythingElse,
      reasonUnableToJoinVideoCall: reasonUnableToJoinVideoCall,
      willYouBringEquipmentToPlayEvidence: willYouBringEquipmentToPlayEvidence,
      reasonUnableToBringEquipment: reasonUnableToBringEquipment,
      allMaleOrFemaleHearing: allMaleOrFemaleHearing,
      reasonForSingleSexHearing: reasonForSingleSexHearing,
      reasonForPrivateHearing: reasonForPrivateHearing,
      howManyPhysicalOrMentalHealthConditions: howManyPhysicalOrMentalHealthConditions,
      reasonForPastExperiencesAffectingHearing: reasonForPastExperiencesAffectingHearing,
      needAnythingElseDetails: needAnythingElseDetails,
    };
  }
}
