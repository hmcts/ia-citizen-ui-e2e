import { APIRequestContext } from '@playwright/test';
import { cui_getCsrfToken, cui_postForm } from '../../../../utils/api-requests-utils';

export class FeeWaiverApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'fee-waiver' });

    await cui_postForm({
      apiContext: this.apiContext,
      path: 'fee-waiver',
      form: {
        _csrf: csrfToken,
      },
    });
  }
}
