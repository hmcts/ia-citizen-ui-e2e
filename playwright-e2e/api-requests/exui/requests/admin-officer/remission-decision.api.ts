import { APIRequestContext, expect } from '@playwright/test';
import { RemissionDecisionEventType } from '../../../../exui-event-types';

export class RemissionDecisionApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

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

    await expect(async () => {
      const triggerResponse = await this.apiContext.get(
        `data/internal/cases/${options.caseId}/event-triggers/recordRemissionDecision?ignore-warning=false`,
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
          expectedKeys.push('amountRemitted', 'amountLeftToPay');
          break;
        case 'partiallyApproved':
          expectedKeys.push('remissionDecisionReason', 'amountRemitted', 'amountLeftToPay');
          break;
        case 'rejected':
          expectedKeys.push('remissionDecisionReason');
          break;
      }

      const rawCaseData = triggerBody.case_fields.reduce((acc: Record<string, any>, field: any) => {
        acc[field.id] = field.value;
        return acc;
      }, {});

      for (const key of expectedKeys) {
        if (!(key in rawCaseData)) {
          throw new Error(`Critical Error: Expected field '${key}' was not found in the case record for event 'recordRemissionDecision'.`);
        }
      }

      const finalData = expectedKeys.reduce((acc: Record<string, any>, key) => {
        if (key === 'remissionDecision') acc[key] = options.decision;
        else if (key === 'amountRemitted') acc[key] = this.formatMoney(options.amountRemitted!);
        else if (key === 'amountLeftToPay') acc[key] = this.formatMoney(options.amountLeftToPay!);
        else if (key === 'remissionDecisionReason') acc[key] = options.reason;
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
          event: { id: 'recordRemissionDecision', summary: '', description: '' },
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
