import { APIRequestContext } from '@playwright/test';
import { getCsrfToken, postForm } from '../../../utils/citizen-user.utils';

export class FeeWaiverApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'fee-waiver' });

    await postForm({
      apiContext: this.apiContext,
      path: 'fee-waiver',
      form: {
        _csrf: csrfToken,
      },
    });
  }
}
