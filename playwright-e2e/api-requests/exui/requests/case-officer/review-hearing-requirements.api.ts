import { APIRequestContext, expect } from '@playwright/test';
import { ReviewHearingRequirementsEventType } from '../../../../exui-event-types';

export class ReviewHearingRequirementsApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitEvent(options: ReviewHearingRequirementsEventType): Promise<void> {
    await expect(async () => {
      const triggerResponse = await this.apiContext.get(
        `data/internal/cases/${options.caseId}/event-triggers/reviewHearingRequirements?ignore-warning=false`,
        {
          headers: {
            accept: 'application/vnd.uk.gov.hmcts.ccd-data-store-api.ui-start-event-trigger.v2+json;charset=UTF-8',
            experimental: 'true',
          },
        },
      );

      await expect(triggerResponse).toBeOK();
      const triggerBody = await triggerResponse.json();
      const eventToken = triggerBody.event_token;
      expect(eventToken).toBeDefined();

      const expectedKeys = [
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
        'inCameraCourt',
        'inCameraCourtDescription',
        'additionalRequests',
        'additionalRequestsDescription',
        'hearingChannel',
        'isAppealSuitableToFloat',
        'isAdditionalInstructionAllowed',
        'additionalInstructionsTribunalResponse',
      ];

      const rawCaseData = triggerBody.case_fields.reduce((acc: Record<string, any>, field: any) => {
        acc[field.id] = field.value;
        return acc;
      }, {});

      for (const key of expectedKeys) {
        if (!(key in rawCaseData)) {
          throw new Error(`Critical Error: Expected field '${key}' was not found in the case record for event 'reviewHearingRequirements'.`);
        }
      }

      if (rawCaseData.physicalOrMentalHealthIssues === 'Yes') expectedKeys.push('isVulnerabilitiesAllowed', 'vulnerabilitiesTribunalResponse');
      else if (rawCaseData.multimediaEvidence === 'Yes') expectedKeys.push('isMultimediaAllowed', 'multimediaTribunalResponse');
      else if (rawCaseData.singleSexCourt === 'Yes') expectedKeys.push('isSingleSexCourtAllowed', 'singleSexCourtTribunalResponse');
      else if (rawCaseData.inCameraCourt === 'Yes') expectedKeys.push('isInCameraCourtAllowed', 'inCameraCourtTribunalResponse');
      else if (rawCaseData.additionalRequests === 'Yes') expectedKeys.push('isAdditionalAdjustmentsAllowed', 'additionalTribunalResponse');

      const finalData = expectedKeys.reduce((acc: Record<string, any>, key) => {
        if (key === 'isRemoteHearingAllowed') acc[key] = options.isRemoteHearingAllowed;
        else if (key === 'remoteVideoCallTribunalResponse') acc[key] = `${options.isRemoteHearingAllowed} request for remote hearing`;
        else if (key === 'isVulnerabilitiesAllowed') acc[key] = options.grantOrRefuseAnyAdjustmentsRequested;
        else if (key === 'vulnerabilitiesTribunalResponse')
          acc[key] =
            `${options.grantOrRefuseAnyAdjustmentsRequested} request to accommodate vulnerabilities as a result of physical or mental health issues`;
        else if (key === 'isMultimediaAllowed') acc[key] = options.grantOrRefuseAnyAdjustmentsRequested;
        else if (key === 'multimediaTribunalResponse')
          acc[key] = `${options.grantOrRefuseAnyAdjustmentsRequested} request for multi media adjustment`;
        else if (key === 'isSingleSexCourtAllowed') acc[key] = options.grantOrRefuseAnyAdjustmentsRequested;
        else if (key === 'singleSexCourtTribunalResponse')
          acc[key] = `${options.grantOrRefuseAnyAdjustmentsRequested} request for single sex court adjustment`;
        else if (key === 'isInCameraCourtAllowed') acc[key] = options.grantOrRefuseAnyAdjustmentsRequested;
        else if (key === 'inCameraCourtTribunalResponse')
          acc[key] = `${options.grantOrRefuseAnyAdjustmentsRequested} request for in camera court adjustment`;
        else if (key === 'isAdditionalAdjustmentsAllowed') acc[key] = options.grantOrRefuseAnyAdjustmentsRequested;
        else if (key === 'additionalTribunalResponse') acc[key] = `${options.grantOrRefuseAnyAdjustmentsRequested} request for additional adjustment`;
        else acc[key] = rawCaseData[key];
        return acc;
      }, {});

      const submissionResponse = await this.apiContext.post(`data/cases/${options.caseId}/events`, {
        headers: {
          accept: 'application/vnd.uk.gov.hmcts.ccd-data-store-api.create-event.v2+json;charset=UTF-8',
          experimental: 'true',
        },
        data: {
          data: finalData,
          event: { id: 'reviewHearingRequirements', summary: '', description: '' },
          event_token: eventToken,
          ignore_warning: false,
        },
      });

      await expect(submissionResponse).toBeOK();
    }).toPass({
      timeout: 30_000,
      intervals: [1_000],
    });
  }
}
