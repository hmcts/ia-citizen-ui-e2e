import { APIRequestContext } from '@playwright/test';
import { GenerateDecisionAndReasonsEventType } from '../../../../exui-event-types';
import { exui_triggerEvent, exui_submitEvent } from '../../../../utils/api-requests-utils';

export class GenerateDecisionAndReasonsApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  private readonly eventName = 'generateDecisionAndReasons';

  public async submitEvent(options: GenerateDecisionAndReasonsEventType): Promise<void> {
    const triggerResponse = await exui_triggerEvent({ apiContext: this.apiContext, caseId: options.caseId, eventName: this.eventName });

    const expectedKeysInEventPayload = ['anonymityOrder', 'appellantInDetention', 'appellantRepresentative', 'respondentRepresentative'];

    for (const key of expectedKeysInEventPayload) {
      if (!(key in triggerResponse.rawCaseData)) {
        throw new Error(`Critical Error: Expected field '${key}' was not found in the case record for event '${this.eventName}'.`);
      }
    }

    const finalData = expectedKeysInEventPayload.reduce((acc: Record<string, any>, key) => {
      if (key === 'anonymityOrder') acc[key] = options.anonymityOrder;
      else if (key === 'appellantRepresentative' && options.appellantRepresentative) acc[key] = options.appellantRepresentative;
      else if (key === 'respondentRepresentative' && options.respondentRepresentative) acc[key] = options.respondentRepresentative;
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
