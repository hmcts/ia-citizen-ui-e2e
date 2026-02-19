import { APIRequestContext } from '@playwright/test';
import { UploadHomeOfficeAppealResponseEventType } from '../../../../exui-event-types';
import { DataUtils } from '../../../../utils/data.utils';
import { exui_triggerEvent, exui_uploadDocument, exui_submitEvent } from '../../../../utils/api-requests-utils';

export class UploadHomeOfficeAppealResponseApi {
  private apiContext: APIRequestContext;
  private readonly dataUtils = new DataUtils();

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  private readonly eventName = 'uploadHomeOfficeAppealResponse';

  public async submitEvent(options: UploadHomeOfficeAppealResponseEventType): Promise<void> {
    type AppealReviewOutcome = UploadHomeOfficeAppealResponseEventType['appealReviewOutcome'];

    const appealReviewOutcomeApiMap: Record<AppealReviewOutcome, string> = {
      'Decision maintained': 'decisionMaintained',
      'Decision withdrawn': 'decisionWithdrawn',
    };

    const triggerResponse = await exui_triggerEvent({ apiContext: this.apiContext, caseId: options.caseId, eventName: this.eventName });

    const expectedKeysInEventPayload = [
      'appealReviewOutcome',
      'appellantInDetention',
      'homeOfficeAppealResponseDescription',
      'homeOfficeAppealResponseDocument',
      'homeOfficeAppealResponseEvidence',
      'uploadedHomeOfficeAppealResponseDocs',
    ];
    for (const key of expectedKeysInEventPayload) {
      if (!(key in triggerResponse.rawCaseData)) {
        throw new Error(`Critical Error: Expected field '${key}' not found in case record for event '${this.eventName}'.`);
      }
    }

    const fileName = options.nameOfFileToUpload ?? 'Home_Office_Appeal_Reason.txt';

    const documentUploadResponse = await exui_uploadDocument({
      apiContext: this.apiContext,
      fileName: fileName,
      eventName: this.eventName,
    });

    const finalData = expectedKeysInEventPayload.reduce((acc: Record<string, any>, key) => {
      if (key === 'appealReviewOutcome') acc[key] = appealReviewOutcomeApiMap[options.appealReviewOutcome];
      else if (key === 'homeOfficeAppealResponseDocument') {
        acc[key] = {
          document_binary_url: documentUploadResponse.documentBinaryUrl,
          document_filename: documentUploadResponse.documentFilename,
          document_hash: documentUploadResponse.documentHash,
          document_url: documentUploadResponse.documentUrl,
        };
      } else if (key === 'homeOfficeAppealResponseDescription' && options.homeOfficeAppealResponseDescription)
        acc[key] = options.homeOfficeAppealResponseDescription;
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
