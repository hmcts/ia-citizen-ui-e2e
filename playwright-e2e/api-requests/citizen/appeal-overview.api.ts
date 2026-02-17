import { APIRequestContext, expect } from '@playwright/test';

export class AppealOverviewApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async get(): Promise<string> {
    let responseHtml: string;
    await expect(async () => {
      const response = await this.apiContext.get('appeal-overview');
      await expect(response).toBeOK();

      const html = await response.text();
      expect(html).toBeDefined();
      responseHtml = html;
    }).toPass({
      timeout: 20_000,
      intervals: [1_000],
    });

    return responseHtml!;
  }
}
