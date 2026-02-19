import { APIRequestContext } from '@playwright/test';
import { cui_getCsrfToken, cui_postForm } from '../../../../utils/api-requests-utils';

export class HearingCheckAnswersApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'hearing-check-answers' });

    await cui_postForm({
      apiContext: this.apiContext,
      path: 'hearing-check-answers',
      form: {
        _csrf: csrfToken,
        send: '',
      },
    });
  }
}
