import { APIRequestContext } from '@playwright/test';
import { CreateCaseSummaryEventType } from '../../../../exui-event-types';
import { exui_triggerEvent, exui_uploadDocument, exui_submitEvent } from '../../../../utils/api-requests-utils';

export class CreateCaseSummaryApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  private readonly eventName = 'createCaseSummary';

  public async submitEvent(options: CreateCaseSummaryEventType): Promise<void> {
    const triggerResponse = await exui_triggerEvent({ apiContext: this.apiContext, caseId: options.caseId, eventName: this.eventName });

    const expectedKeysInEventPayload = ['caseSummaryDescription', 'caseSummaryDocument'];

    for (const key of expectedKeysInEventPayload) {
      if (!(key in triggerResponse.rawCaseData)) {
        throw new Error(`Critical Error: Expected field '${key}' not found in case record for createCaseSummary event.`);
      }
    }

    const fileName = options.nameOfFileToUpload ?? 'Create_Case_Summary.txt';

    const documentUploadResponse = await exui_uploadDocument({
      apiContext: this.apiContext,
      fileName: fileName,
      eventName: this.eventName,
    });

    const finalData = expectedKeysInEventPayload.reduce((acc: Record<string, any>, key) => {
      if (key === 'caseSummaryDescription' && options.description) acc[key] = options.description;
      else if (key === 'caseSummaryDocument') {
        acc[key] = {
          document_url: documentUploadResponse.documentUrl,
          document_binary_url: documentUploadResponse.documentBinaryUrl,
          document_filename: documentUploadResponse.documentFilename,
          document_hash: documentUploadResponse.documentHash,
        };
      } else {
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
