import { APIRequestContext, expect } from '@playwright/test';
import { getCsrfToken, postForm } from '../../../utils/citizen-user.utils';
import path from 'path';
import fs from 'fs';
import mime from 'mime-types';

export class LateAppealApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(options: { reasonForLateAppeal: string; nameOfFileToUpload?: string }): Promise<void> {
    const csrfToken = await getCsrfToken({
      apiContext: this.apiContext,
      path: 'late-appeal',
    });

    const fileName = options.nameOfFileToUpload ?? 'Upload_Document_Test_1.txt';
    const filePath = path.join(process.cwd(), 'playwright-e2e', 'fixtures', 'documents', fileName);
    const fileBuffer = fs.readFileSync(filePath);
    const mimeType = mime.lookup(filePath) || 'application/octet-stream';

    await expect(async () => {
      const response = await this.apiContext.post(`late-appeal?_csrf=${csrfToken}`, {
        headers: {
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        multipart: {
          _csrf: csrfToken,
          'appeal-late': options.reasonForLateAppeal,
          uploadFile: '',
          'file-upload': {
            name: fileName,
            mimeType: mimeType,
            buffer: fileBuffer,
          },
          saveAndContinue: '',
        },
      });

      expect(response.status()).toBeLessThan(400);
    }).toPass({
      timeout: 17_000,
      intervals: [2_000],
    });
  }
}
