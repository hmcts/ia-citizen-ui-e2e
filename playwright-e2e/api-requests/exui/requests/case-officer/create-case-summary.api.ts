import { APIRequestContext, expect } from '@playwright/test';
import { CreateCaseSummaryEventType } from '../../../../exui-event-types';
import { DataUtils } from '../../../../utils/data.utils';
import * as fs from 'fs';
import mime from 'mime-types';

export class CreateCaseSummaryApi {
  private apiContext: APIRequestContext;
  private readonly dataUtils = new DataUtils();

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitEvent(options: CreateCaseSummaryEventType): Promise<void> {
    await expect(async () => {
      const triggerResponse = await this.apiContext.get(
        `data/internal/cases/${options.caseId}/event-triggers/createCaseSummary?ignore-warning=false`,
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

      const rawCaseData = triggerBody.case_fields.reduce((acc: Record<string, any>, field: any) => {
        acc[field.id] = field.value;
        return acc;
      }, {});

      const expectedKeys = ['caseSummaryDescription', 'caseSummaryDocument'];
      for (const key of expectedKeys) {
        if (!(key in rawCaseData)) {
          throw new Error(`Critical Error: Expected field '${key}' not found in case record for createCaseSummary event.`);
        }
      }

      const fileName = options.nameOfFileToUpload ?? 'Upload_Document_Test_1.txt';
      const filePath = await this.dataUtils.fetchDocumentUploadPath(fileName);
      const fileBuffer = fs.readFileSync(filePath);
      const mimeType = mime.lookup(filePath) || 'application/octet-stream';

      const uploadDocumentResponse = await this.apiContext.post('documentsv2', {
        multipart: {
          files: {
            name: fileName,
            mimeType: mimeType,
            buffer: fileBuffer,
          },
          classification: 'PUBLIC',
          caseTypeId: 'Asylum',
          jurisdictionId: 'IA',
        },
      });

      await expect(uploadDocumentResponse).toBeOK();
      const uploadDocumentBody = await uploadDocumentResponse.json();

      const docMetadata = uploadDocumentBody.documents[0];

      expect(docMetadata?._links?.self?.href, 'Document Store response missing self link').toBeDefined();
      expect(docMetadata?._links?.binary?.href, 'Document Store response missing binary link').toBeDefined();
      expect(docMetadata?.originalDocumentName, 'Document Store response missing filename').toBeDefined();
      expect(docMetadata?.hashToken, 'Document Store response missing hash token').toBeDefined();

      const finalData = expectedKeys.reduce((acc: Record<string, any>, key) => {
        if (key === 'caseSummaryDescription' && options.description) acc[key] = options.description;
        else if (key === 'caseSummaryDocument') {
          acc[key] = {
            document_url: docMetadata._links.self.href,
            document_binary_url: docMetadata._links.binary.href,
            document_filename: docMetadata.originalDocumentName,
            document_hash: docMetadata.hashToken,
          };
        } else {
          acc[key] = rawCaseData[key];
        }
        return acc;
      }, {});

      const submissionResponse = await this.apiContext.post(`data/cases/${options.caseId}/events`, {
        headers: {
          accept: 'application/vnd.uk.gov.hmcts.ccd-data-store-api.create-event.v2+json;charset=UTF-8',
          experimental: 'true',
        },
        data: {
          data: finalData,
          event: { id: 'createCaseSummary', summary: '', description: '' },
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
