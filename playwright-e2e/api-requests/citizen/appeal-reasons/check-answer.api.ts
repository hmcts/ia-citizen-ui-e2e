import { APIRequestContext } from '@playwright/test';
import { getCsrfToken, postForm } from '../../../utils/citizen-user.utils';

export class CheckAnswerApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(): Promise<void> {
    const csrfToken = await getCsrfToken({
      apiContext: this.apiContext,
      path: 'case-building/check-answer',
    });

    await postForm({
      apiContext: this.apiContext,
      path: 'case-building/check-answer',
      form: {
        _csrf: csrfToken,
        send: '',
      },
    });
  }
}
