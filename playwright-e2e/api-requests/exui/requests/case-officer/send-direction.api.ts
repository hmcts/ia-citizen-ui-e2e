import { APIRequestContext } from '@playwright/test';
import { SendDirectionEventType } from '../../../../exui-event-types';
import { exui_triggerEvent, exui_submitEvent } from '../../../../utils/api-requests-utils';

export class SendDirectionApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  private readonly eventName = 'sendDirection';

  public async submitEvent(options: SendDirectionEventType): Promise<void> {
    type SendDirectionRecipient = SendDirectionEventType['whoToSendDirectionTo'];

    const sendDirectionRecipientApiMap: Record<SendDirectionRecipient, string> = {
      Appellant: 'appellant',
      'Appellant and Respondent': 'appellantAndRespondent',
      'Legal representative': 'legalRepresentative',
      'Legal representative and Respondent': 'both',
      Respondent: 'respondent',
    };

    const triggerResponse = await exui_triggerEvent({ apiContext: this.apiContext, caseId: options.caseId, eventName: this.eventName });

    const expectedKeysInEventPayload = ['appellantInDetention', 'sendDirectionDateDue', 'sendDirectionExplanation', 'sendDirectionParties'];

    for (const key of expectedKeysInEventPayload) {
      if (!(key in triggerResponse.rawCaseData)) {
        throw new Error(`Critical Error: Expected field '${key}' was not found in the case record for event '${this.eventName}'.`);
      }
    }

    const finalData = expectedKeysInEventPayload.reduce((acc: Record<string, any>, key) => {
      if (key === 'sendDirectionDateDue' && options.dateDirectionIsDue) {
        const { day, month, year } = options.dateDirectionIsDue;
        const yyyy = year.toString();
        const mm = month.toString().padStart(2, '0');
        const dd = day.toString().padStart(2, '0');

        acc[key] = `${yyyy}-${mm}-${dd}`;
      } else if (key === 'sendDirectionExplanation') acc[key] = options.explinationOfDirection;
      else if (key === 'sendDirectionParties') acc[key] = sendDirectionRecipientApiMap[options.whoToSendDirectionTo];
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
