import { APIRequestContext } from '@playwright/test';
import { DecisionAndReasonsStartedEventType } from '../../../../exui-event-types';
import { exui_triggerEvent, exui_submitEvent } from '../../../../utils/api-requests-utils';

export class DecisionAndReasonsStartedApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  private readonly eventName = 'decisionAndReasonsStarted';

  public async submitEvent(options: DecisionAndReasonsStartedEventType): Promise<void> {
    const triggerResponse = await exui_triggerEvent({ apiContext: this.apiContext, caseId: options.caseId, eventName: this.eventName });

    const expectedKeysInEventPayload = [
      'appellantCaseSummaryDescription',
      'appellantInDetention',
      'autoHearingRequestEnabled',
      'caseIntroductionDescription',
      'immigrationHistoryAgreement',
      'isDecisionWithoutHearing',
      'isIntegrated',
      'listCaseHearingCentre',
      'scheduleOfIssuesAgreement',
    ];

    expectedKeysInEventPayload.push(
      options.doYouAgreeWithImmigrationHistory === 'Yes' ? 'agreedImmigrationHistoryDescription' : 'immigrationHistoryDisagreementDescription',
      'respondentsImmigrationHistoryDescription',
    );

    expectedKeysInEventPayload.push(
      options.doYouAgreeWithscheduleOfIssuesAgreement === 'Yes'
        ? 'appellantsAgreedScheduleOfIssuesDescription'
        : 'appellantsDisputedScheduleOfIssuesDescription',
      'scheduleOfIssuesDisagreementDescription',
    );

    for (const key of expectedKeysInEventPayload) {
      if (!(key in triggerResponse.rawCaseData)) {
        throw new Error(`Critical Error: Expected field '${key}' was not found in the case record for event '${this.eventName}'.`);
      }
    }

    const finalData = expectedKeysInEventPayload.reduce((acc: Record<string, any>, key) => {
      if (key === 'caseIntroductionDescription' && options.caseIntro) acc[key] = options.caseIntro;
      else if (key === 'appellantCaseSummaryDescription' && options.caseSummary) acc[key] = options.caseSummary;
      else if (key === 'immigrationHistoryAgreement') acc[key] = options.doYouAgreeWithImmigrationHistory;
      else if (key === 'scheduleOfIssuesAgreement') acc[key] = options.doYouAgreeWithscheduleOfIssuesAgreement;
      else acc[key] = triggerResponse.rawCaseData[key];
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
