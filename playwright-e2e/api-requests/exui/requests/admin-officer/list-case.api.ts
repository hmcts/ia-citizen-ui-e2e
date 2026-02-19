import { APIRequestContext } from '@playwright/test';
import { ListCaseEventType } from '../../../../exui-event-types';
import { exui_triggerEvent, exui_submitEvent } from '../../../../utils/api-requests-utils';

export class ListCaseApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  private readonly eventName = 'listCase';

  public async submitEvent(options: ListCaseEventType): Promise<void> {
    const triggerResponse = await exui_triggerEvent({ apiContext: this.apiContext, caseId: options.caseId, eventName: this.eventName });

    const expectedKeysInEventPayload = [
      'ariaListingReference',
      'isCaseUsingLocationRefData',
      'isIntegrated',
      'isRemoteHearing',
      'listCaseHearingCentreAddress',
      'listCaseHearingDate',
      'listingLength',
      'listingLocation',
    ];

    for (const key of expectedKeysInEventPayload) {
      if (!(key in triggerResponse.rawCaseData)) {
        throw new Error(`Critical Error: Expected field '${key}' was not found in the case record for event '${this.eventName}'.`);
      }
    }

    const finalData = expectedKeysInEventPayload.reduce((acc: Record<string, any>, key) => {
      if (key === 'ariaListingReference') acc[key] = options.hearingId;
      else if (key === 'isRemoteHearing') acc[key] = options.isRemoteHearing;
      else if (key === 'listCaseHearingDate') {
        const { day, month, year, hour, minute } = options.hearingDateAndTime;
        acc[key] =
          `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T${hour ? hour.toString().padStart(2, '0') : '00'}:${minute ? minute.toString().padStart(2, '0') : '00'}:00.000`;
      } else acc[key] = triggerResponse.rawCaseData[key];
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
