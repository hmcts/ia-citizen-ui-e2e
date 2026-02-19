import { APIRequestContext } from '@playwright/test';
import { cui_getCsrfToken, cui_postForm } from '../../../utils/api-requests-utils';

export class AskForMoreTimeApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(options: { howMuchAndWhyMoreTimeNeeded: string }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({
      apiContext: this.apiContext,
      path: 'ask-for-more-time',
    });

    await cui_postForm({
      apiContext: this.apiContext,
      path: 'ask-for-more-time',
      form: {
        _csrf: csrfToken,
        askForMoreTime: options.howMuchAndWhyMoreTimeNeeded,
      },
    });
  }
}
