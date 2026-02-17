import { APIRequestContext } from '@playwright/test';
import { getCsrfToken, postForm } from '../../../utils/citizen-user.utils';

export class CheckAnswersMoreTimeApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(): Promise<void> {
    const csrfToken = await getCsrfToken({
      apiContext: this.apiContext,
      path: 'check-answer-more-time',
    });

    await postForm({
      apiContext: this.apiContext,
      path: 'check-answer-more-time',
      form: {
        _csrf: csrfToken,
      },
    });
  }
}
