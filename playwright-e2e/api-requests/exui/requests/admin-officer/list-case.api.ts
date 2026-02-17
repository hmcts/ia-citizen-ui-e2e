import { APIRequestContext, expect } from '@playwright/test';
import { ListCaseEventType } from '../../../../exui-event-types';

export class ListCaseApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitEvent(options: ListCaseEventType): Promise<void> {
    await expect(async () => {
      const triggerResponse = await this.apiContext.get(`data/internal/cases/${options.caseId}/event-triggers/listCase?ignore-warning=false`, {
        headers: {
          accept: 'application/vnd.uk.gov.hmcts.ccd-data-store-api.ui-start-event-trigger.v2+json;charset=UTF-8',
          experimental: 'true',
        },
      });

      await expect(triggerResponse).toBeOK();
      const triggerBody = await triggerResponse.json();
      const eventToken = triggerBody.event_token;
      expect(eventToken).toBeDefined();

      const expectedKeys = [
        'ariaListingReference',
        'isCaseUsingLocationRefData',
        'isIntegrated',
        'isRemoteHearing',
        'listCaseHearingCentreAddress',
        'listCaseHearingDate',
        'listingLength',
        'listingLocation',
      ];

      const rawCaseData = triggerBody.case_fields.reduce((acc: Record<string, any>, field: any) => {
        acc[field.id] = field.value;
        return acc;
      }, {});

      for (const key of expectedKeys) {
        if (!(key in rawCaseData)) {
          throw new Error(`Critical Error: Expected field '${key}' was not found in the case record for event 'listCase'.`);
        }
      }

      const finalData = expectedKeys.reduce((acc: Record<string, any>, key) => {
        if (key === 'ariaListingReference') acc[key] = options.hearingId;
        else if (key === 'isRemoteHearing') acc[key] = options.isRemoteHearing;
        else if (key === 'listCaseHearingDate') {
          const { day, month, year, hour, minute } = options.hearingDateAndTime;
          acc[key] =
            `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T${hour ? hour.toString().padStart(2, '0') : '00'}:${minute ? minute.toString().padStart(2, '0') : '00'}:00.000`;
        } else acc[key] = rawCaseData[key];
        return acc;
      }, {});

      const submissionResponse = await this.apiContext.post(`data/cases/${options.caseId}/events`, {
        headers: {
          accept: 'application/vnd.uk.gov.hmcts.ccd-data-store-api.create-event.v2+json;charset=UTF-8',
          experimental: 'true',
        },
        data: {
          data: finalData,
          event: { id: 'listCase', summary: '', description: '' },
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
