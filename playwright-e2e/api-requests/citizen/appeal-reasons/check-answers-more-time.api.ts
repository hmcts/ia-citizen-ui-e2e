import { APIRequestContext } from '@playwright/test';
import { cui_getCsrfToken, cui_postForm } from '../../../utils/api-requests-utils';

export class CheckAnswersMoreTimeApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(): Promise<void> {
    const csrfToken = await cui_getCsrfToken({
      apiContext: this.apiContext,
      path: 'check-answer-more-time',
    });

    await cui_postForm({
      apiContext: this.apiContext,
      path: 'check-answer-more-time',
      form: {
        _csrf: csrfToken,
      },
    });
  }
}
