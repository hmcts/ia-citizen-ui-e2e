import { APIRequestContext, expect } from '@playwright/test';

export class CaseDataApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async fetchCaseData(options: { caseId: string }): Promise<JSON> {
    let responseBody: JSON | undefined;

    await expect(async () => {
      const response = await this.apiContext.get(`data/internal/cases/${options.caseId}`, {
        headers: {
          accept: 'application/vnd.uk.gov.hmcts.ccd-data-store-api.ui-case-view.v2+json',
          experimental: 'true',
        },
      });

      await expect(response).toBeOK();

      responseBody = await response.json();
      expect(responseBody).toBeDefined();
    }).toPass({
      timeout: 20_000,
      intervals: [1_000],
    });

    if (!responseBody) {
      throw new Error(`Failed to fetch case data for caseId: ${options.caseId}`);
    }

    return responseBody;
  }
}
