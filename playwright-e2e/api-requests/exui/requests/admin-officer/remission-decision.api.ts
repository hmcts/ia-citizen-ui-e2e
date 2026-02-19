import { APIRequestContext } from '@playwright/test';
import { RemissionDecisionEventType } from '../../../../exui-event-types';
import { exui_triggerEvent, exui_submitEvent } from '../../../../utils/api-requests-utils';

export class RemissionDecisionApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  private readonly eventName = 'recordRemissionDecision';

  private formatMoney = (amount: number): string => {
    if (amount === 0) return '000';
    return (amount * 100).toString();
  };

  public async submitEvent(options: RemissionDecisionEventType): Promise<void> {
    if (options.decision !== 'rejected' && (options.amountRemitted === undefined || options.amountLeftToPay === undefined)) {
      throw new Error('amountRemitted and amountLeftToPay are required when decision is not rejected');
    } else if (options.decision !== 'approved' && (options.reason === undefined || options.reason.trim() === '')) {
      throw new Error('reason is required when decision is not approved');
    }

    const triggerResponse = await exui_triggerEvent({ apiContext: this.apiContext, caseId: options.caseId, eventName: this.eventName });

    const expectedKeysInEventPayload = [
      'remissionRejectedDatePlus14days',
      'appellantInDetention',
      'remissionDecision',
      'decisionHearingFeeOption',
      'feeWithHearing',
      'feeWithoutHearing',
      'paymentStatus',
      'appealType',
    ];

    switch (options.decision) {
      case 'approved':
        expectedKeysInEventPayload.push('amountRemitted', 'amountLeftToPay');
        break;
      case 'partiallyApproved':
        expectedKeysInEventPayload.push('remissionDecisionReason', 'amountRemitted', 'amountLeftToPay');
        break;
      case 'rejected':
        expectedKeysInEventPayload.push('remissionDecisionReason');
        break;
    }

    for (const key of expectedKeysInEventPayload) {
      if (!(key in triggerResponse.rawCaseData)) {
        throw new Error(`Critical Error: Expected field '${key}' was not found in the case record for event '${this.eventName}'.`);
      }
    }

    const finalData = expectedKeysInEventPayload.reduce((acc: Record<string, any>, key) => {
      if (key === 'remissionDecision') acc[key] = options.decision;
      else if (key === 'amountRemitted') acc[key] = this.formatMoney(options.amountRemitted!);
      else if (key === 'amountLeftToPay') acc[key] = this.formatMoney(options.amountLeftToPay!);
      else if (key === 'remissionDecisionReason') acc[key] = options.reason;
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
