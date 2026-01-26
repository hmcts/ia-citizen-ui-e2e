import { APIRequestContext } from '@playwright/test';
import { getCsrfToken, postForm } from '../../../utils/citizen-user.utils';

export class CheckAnswersApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'check-answers' });

    await postForm({
      apiContext: this.apiContext,
      path: 'check-answers',
      form: {
        _csrf: csrfToken,
        statement: 'acceptance',
      },
    });
  }
}
