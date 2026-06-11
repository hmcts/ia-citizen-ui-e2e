import { Locator, Page, expect } from '@playwright/test';
import { DataUtils } from './data.utils';

export class UiDocumentUploadHelper {
  constructor(private readonly page: Page) {}

  private dataUtils = new DataUtils();

  public async uploadExuiDocument(options: {
    fileInputElement: Locator;
    nameOfFileToUpload: string;
    intervals?: number[];
    timeout?: number;
  }): Promise<void> {
    const filePath = await this.dataUtils.fetchDocumentUploadPath(options.nameOfFileToUpload);

    const uploadingText = this.page.locator('span[role="alert"]', {
      hasText: 'Uploading',
    });

    await expect(async () => {
      const currentFiles = await options.fileInputElement.evaluate((input: HTMLInputElement) => input.files?.length ?? 0);

      if (currentFiles > 0) {
        await options.fileInputElement.setInputFiles([]);
      }

      await Promise.all([
        this.interceptNetworkRequestToVerifyExuiUploadDocumentSucceeded({
          timeoutMs: 10_000,
        }),
        options.fileInputElement.setInputFiles(filePath),
        expect(uploadingText).toBeVisible({ timeout: 5_000 }),
      ]);
    }).toPass({
      intervals: options.intervals ?? [5_000],
      timeout: options.timeout ?? 60_000,
    });

    await expect(uploadingText).not.toBeVisible({ timeout: 5_000 });
    await expect(options.fileInputElement).toHaveValue(new RegExp(`${options.nameOfFileToUpload.replace('.', '\\.')}$`));
  }

  private async interceptNetworkRequestToVerifyExuiUploadDocumentSucceeded(options: { timeoutMs: number }): Promise<void> {
    const response = await this.page.waitForResponse((res) => res.request().method() === 'POST' && res.url().includes('documentsv2'), {
      timeout: options.timeoutMs,
    });

    const status = response.status();

    expect(status).toBeGreaterThanOrEqual(200);
    expect(status).toBeLessThan(400);
  }
}
