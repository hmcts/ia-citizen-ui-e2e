import { APIRequestContext } from '@playwright/test';
import { ReviewHearingRequirementsEventType } from '../../../../exui-event-types';
import { exui_triggerEvent, exui_submitEvent } from '../../../../utils/api-requests-utils';

export class ReviewHearingRequirementsApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  private readonly eventName = 'reviewHearingRequirements';

  public async submitEvent(options: ReviewHearingRequirementsEventType): Promise<void> {
    const triggerResponse = await exui_triggerEvent({ apiContext: this.apiContext, caseId: options.caseId, eventName: this.eventName });

    const hearingChannelCode: Record<ReviewHearingRequirementsEventType['hearingType'], string> = {
      'In Person': 'INTER"',
      'Not in Attendance': 'NA',
      'On the Papers': 'ONPPRS',
      Telephone: 'TEL',
      Video: 'VID',
    };

    const expectedKeysInEventPayload = [
      'appealOutOfCountry',
      'witness2InterpreterLanguageCategory',
      'witness5InterpreterLanguageCategory',
      'appellantInDetention',
      'witness4InterpreterLanguageCategory',
      'witness6InterpreterLanguageCategory',
      'witness9InterpreterLanguageCategory',
      'appellantInterpreterLanguageCategory',
      'witness10InterpreterLanguageCategory',
      'witness7InterpreterLanguageCategory',
      'autoHearingRequestEnabled',
      'witness8InterpreterLanguageCategory',
      'isIntegrated',
      'witness3InterpreterLanguageCategory',
      'witness1InterpreterLanguageCategory',
      'isEvidenceFromOutsideUkOoc',
      'isAppellantAttendingTheHearing',
      'isAppellantGivingOralEvidence',
      'isWitnessesAttending',
      'witnessDetailsReadonly',
      'isEvidenceFromOutsideUkInCountry',
      'isInterpreterServicesNeeded',
      'interpreterLanguageReadonly',
      'appellantInterpreterSpokenLanguage',
      'appellantInterpreterSignLanguage',
      'isAnyWitnessInterpreterRequired',
      'witness1InterpreterSpokenLanguage',
      'witness1InterpreterSignLanguage',
      'witness2InterpreterSpokenLanguage',
      'witness2InterpreterSignLanguage',
      'witness3InterpreterSpokenLanguage',
      'witness3InterpreterSignLanguage',
      'witness4InterpreterSpokenLanguage',
      'witness4InterpreterSignLanguage',
      'witness5InterpreterSpokenLanguage',
      'witness5InterpreterSignLanguage',
      'witness6InterpreterSpokenLanguage',
      'witness6InterpreterSignLanguage',
      'witness7InterpreterSpokenLanguage',
      'witness7InterpreterSignLanguage',
      'witness8InterpreterSpokenLanguage',
      'witness8InterpreterSignLanguage',
      'witness9InterpreterSpokenLanguage',
      'witness9InterpreterSignLanguage',
      'witness10InterpreterSpokenLanguage',
      'witness10InterpreterSignLanguage',
      'isHearingRoomNeeded',
      'isHearingLoopNeeded',
      'listingLength',
      'isOutOfCountryEnabled',
      'remoteVideoCall',
      'remoteVideoCallDescription',
      'isRemoteHearingAllowed',
      'remoteVideoCallTribunalResponse',
      'physicalOrMentalHealthIssues',
      'physicalOrMentalHealthIssuesDescription',
      'multimediaEvidence',
      'multimediaEvidenceDescription',
      'singleSexCourt',
      'singleSexCourtType',
      'singleSexCourtTypeDescription',
      'inCameraCourt',
      'inCameraCourtDescription',
      'additionalRequests',
      'additionalRequestsDescription',
      'hearingChannel',
      'isAppealSuitableToFloat',
      'isAdditionalInstructionAllowed',
    ];

    const rawCaseData = triggerResponse.rawCaseData;
    for (const key of expectedKeysInEventPayload) {
      if (!(key in rawCaseData)) {
        throw new Error(`Critical Error: Expected field '${key}' was not found in the case record for event '${this.eventName}'.`);
      }
    }

    if (rawCaseData.physicalOrMentalHealthIssues === 'Yes')
      expectedKeysInEventPayload.push('isVulnerabilitiesAllowed', 'vulnerabilitiesTribunalResponse');
    if (rawCaseData.multimediaEvidence === 'Yes') expectedKeysInEventPayload.push('isMultimediaAllowed', 'multimediaTribunalResponse');
    if (rawCaseData.singleSexCourt === 'Yes') expectedKeysInEventPayload.push('isSingleSexCourtAllowed', 'singleSexCourtTribunalResponse');
    if (rawCaseData.inCameraCourt === 'Yes') expectedKeysInEventPayload.push('isInCameraCourtAllowed', 'inCameraCourtTribunalResponse');
    if (rawCaseData.additionalRequests === 'Yes') expectedKeysInEventPayload.push('isAdditionalAdjustmentsAllowed', 'additionalTribunalResponse');
    if (options.anyAdditionalInstructions === 'Yes') expectedKeysInEventPayload.push('additionalInstructionsTribunalResponse');

    const finalData = expectedKeysInEventPayload.reduce((acc: Record<string, string | object>, key) => {
      if (key === 'isRemoteHearingAllowed') acc[key] = options.isRemoteHearingAllowed;
      else if (key === 'remoteVideoCallTribunalResponse') acc[key] = `${options.isRemoteHearingAllowed} request for remote hearing`;
      else if (key === 'isVulnerabilitiesAllowed') acc[key] = options.grantOrRefuseAnyAdjustmentsRequested;
      else if (key === 'vulnerabilitiesTribunalResponse')
        acc[key] =
          `${options.grantOrRefuseAnyAdjustmentsRequested} request to accommodate vulnerabilities as a result of physical or mental health issues`;
      else if (key === 'isMultimediaAllowed') acc[key] = options.grantOrRefuseAnyAdjustmentsRequested;
      else if (key === 'multimediaTribunalResponse') acc[key] = `${options.grantOrRefuseAnyAdjustmentsRequested} request for multi media adjustment`;
      else if (key === 'isSingleSexCourtAllowed') acc[key] = options.grantOrRefuseAnyAdjustmentsRequested;
      else if (key === 'singleSexCourtTribunalResponse')
        acc[key] = `${options.grantOrRefuseAnyAdjustmentsRequested} request for single sex court adjustment`;
      else if (key === 'isInCameraCourtAllowed') acc[key] = options.grantOrRefuseAnyAdjustmentsRequested;
      else if (key === 'inCameraCourtTribunalResponse')
        acc[key] = `${options.grantOrRefuseAnyAdjustmentsRequested} request for in camera court adjustment`;
      else if (key === 'isAdditionalAdjustmentsAllowed') acc[key] = options.grantOrRefuseAnyAdjustmentsRequested;
      else if (key === 'additionalTribunalResponse') acc[key] = `${options.grantOrRefuseAnyAdjustmentsRequested} request for additional adjustment`;
      else if (key === 'hearingChannel') {
        acc[key] = { value: { code: hearingChannelCode[options.hearingType], label: options.hearingType } };
      } else if (key === 'isAppealSuitableToFloat') acc[key] = options.isApplicationSuitableToFloat;
      else if (key === 'isAdditionalInstructionAllowed') acc[key] = options.anyAdditionalInstructions;
      else if (key === 'additionalInstructionsTribunalResponse') acc[key] = 'Please ensure the hearing is listed in a building with step free access';
      else acc[key] = rawCaseData[key];
      return acc;
    }, {});

    await exui_submitEvent({
      apiContext: this.apiContext,
      caseId: options.caseId,
      eventName: this.eventName,
      eventToken: triggerResponse.eventToken,
      payload: finalData,
    });
  }
}
