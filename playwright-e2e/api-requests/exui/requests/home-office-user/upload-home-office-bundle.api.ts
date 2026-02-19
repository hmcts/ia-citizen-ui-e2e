import { APIRequestContext } from '@playwright/test';
import { UploadHomeOfficeBundleEventType } from '../../../../exui-event-types';
import { DataUtils } from '../../../../utils/data.utils';
import { exui_triggerEvent, exui_uploadDocument, exui_submitEvent } from '../../../../utils/api-requests-utils';

export class UploadHomeOfficeBundleApi {
  private apiContext: APIRequestContext;
  private readonly dataUtils = new DataUtils();

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  private readonly eventName = 'uploadHomeOfficeBundle';

  public async submitEvent(options: UploadHomeOfficeBundleEventType): Promise<void> {
    const triggerResponse = await exui_triggerEvent({ apiContext: this.apiContext, caseId: options.caseId, eventName: this.eventName });

    const expectedKeysInEventPayload = ['uploadedHomeOfficeBundleDocs', 'homeOfficeBundle', 'appellantInDetention'];

    for (const key of expectedKeysInEventPayload) {
      if (!(key in triggerResponse.rawCaseData)) {
        throw new Error(`Critical Error: Expected field '${key}' not found in case record for event '${this.eventName}'.`);
      }
    }

    const fileName = options.nameOfFileToUpload ?? 'Home_Office_Bundle.txt';
    const documentUploadResponse = await exui_uploadDocument({
      apiContext: this.apiContext,
      fileName: fileName,
      eventName: this.eventName,
    });

    const finalData = expectedKeysInEventPayload.reduce((acc: Record<string, any>, key) => {
      if (key === 'homeOfficeBundle') {
        acc[key] = [
          {
            id: null,
            value: {
              description: options.description,
              document: {
                document_url: documentUploadResponse.documentUrl,
                document_binary_url: documentUploadResponse.documentBinaryUrl,
                document_filename: documentUploadResponse.documentFilename,
                document_hash: documentUploadResponse.documentHash,
              },
            },
          },
        ];
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
