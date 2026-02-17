import { APIRequestContext } from '@playwright/test';
import { getCsrfToken, postForm } from '../../../utils/citizen-user.utils';

export class AskForMoreTimeApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(options: { howMuchAndWhyMoreTimeNeeded: string }): Promise<void> {
    const csrfToken = await getCsrfToken({
      apiContext: this.apiContext,
      path: 'ask-for-more-time',
    });

    await postForm({
      apiContext: this.apiContext,
      path: 'ask-for-more-time',
      form: {
        _csrf: csrfToken,
        askForMoreTime: options.howMuchAndWhyMoreTimeNeeded,
      },
    });
  }
}
