import { APIRequestContext, expect } from '@playwright/test';
import { DataUtils } from '../../../../utils/data.utils';
import { SendDecisionAndReasonsEventType } from '../../../../exui-event-types';
import * as fs from 'fs';
import mime from 'mime-types';
import { exui_triggerEvent, exui_uploadDocument, exui_submitEvent } from '../../../../utils/api-requests-utils';

export class sendDecisionAndReasonsApi {
  private apiContext: APIRequestContext;
  private readonly dataUtils = new DataUtils();

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  private readonly eventName = 'sendDecisionAndReasons';

  public async submitEvent(options: SendDecisionAndReasonsEventType): Promise<void> {
    const triggerResponse = await exui_triggerEvent({ apiContext: this.apiContext, caseId: options.caseId, eventName: this.eventName });

    const expectedKeysInSubmissionPayload = [
      'appellantInDetention',
      'finalDecisionAndReasonsDocument',
      'isAdmin',
      'isDecisionAllowed',
      'isDocumentSignedToday',
      'isFeeConsistentWithDecision',
    ];
    for (const key of expectedKeysInSubmissionPayload) {
      if (!(key in triggerResponse.rawCaseData)) {
        throw new Error(`Critical Error: Expected field '${key}' not found in case record for event '${this.eventName}'.`);
      }
    }

    const fileName = options.nameOfFileToUpload ?? 'SendDecisionAndReasons.pdf';
    const documentUploadResponse = await exui_uploadDocument({
      apiContext: this.apiContext,
      fileName: fileName,
      eventName: this.eventName,
    });

    const finalData = expectedKeysInSubmissionPayload.reduce((acc: Record<string, any>, key) => {
      if (key === 'finalDecisionAndReasonsDocument') {
        acc[key] = {
          document_binary_url: documentUploadResponse.documentBinaryUrl,
          document_filename: documentUploadResponse.documentFilename,
          document_hash: documentUploadResponse.documentHash,
          document_url: documentUploadResponse.documentUrl,
        };
      } else if (key === 'isDecisionAllowed') acc[key] = options.isDecisionAllowed.toLowerCase();
      else if (key === 'isDocumentSignedToday') acc[key] = { values: ['isDocumentSignedToday'] };
      else if (key === 'isFeeConsistentWithDecision') acc[key] = { values: ['isFeeConsistentWithDecision'] };
      else {
        acc[key] = triggerResponse.rawCaseData[key];
      }
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
