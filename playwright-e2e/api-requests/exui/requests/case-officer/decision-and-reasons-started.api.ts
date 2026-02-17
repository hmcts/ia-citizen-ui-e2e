import { APIRequestContext, expect } from '@playwright/test';
import { DecisionAndReasonsStartedEventType } from '../../../../exui-event-types';

export class DecisionAndReasonsStartedApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitEvent(options: DecisionAndReasonsStartedEventType): Promise<void> {
    await expect(async () => {
      const triggerResponse = await this.apiContext.get(
        `data/internal/cases/${options.caseId}/event-triggers/decisionAndReasonsStarted?ignore-warning=false`,
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

      expectedKeys.push(
        options.doYouAgreeWithImmigrationHistory === 'Yes' ? 'agreedImmigrationHistoryDescription' : 'immigrationHistoryDisagreementDescription',
        'respondentsImmigrationHistoryDescription',
      );

      expectedKeys.push(
        options.doYouAgreeWithscheduleOfIssuesAgreement === 'Yes'
          ? 'appellantsAgreedScheduleOfIssuesDescription'
          : 'appellantsDisputedScheduleOfIssuesDescription',
        'scheduleOfIssuesDisagreementDescription',
      );

      const rawCaseData = triggerBody.case_fields.reduce((acc: Record<string, any>, field: any) => {
        acc[field.id] = field.value;
        return acc;
      }, {});

      for (const key of expectedKeys) {
        if (!(key in rawCaseData)) {
          throw new Error(`Critical Error: Expected field '${key}' was not found in the case record for event 'decisionAndReasonsStarted'.`);
        }
      }

      const finalData = expectedKeys.reduce((acc: Record<string, any>, key) => {
        if (key === 'caseIntroductionDescription' && options.caseIntro) acc[key] = options.caseIntro;
        else if (key === 'appellantCaseSummaryDescription' && options.caseSummary) acc[key] = options.caseSummary;
        else if (key === 'immigrationHistoryAgreement') acc[key] = options.doYouAgreeWithImmigrationHistory;
        else if (key === 'scheduleOfIssuesAgreement') acc[key] = options.doYouAgreeWithscheduleOfIssuesAgreement;
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
          event: { id: 'decisionAndReasonsStarted', summary: '', description: '' },
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
