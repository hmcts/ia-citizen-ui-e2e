import { APIRequestContext } from '@playwright/test';
import { cui_getCsrfToken, cui_postForm } from '../../../../utils/api-requests-utils';

export class HearingAnythingElseReasonsApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { whatAndWhyYouNeedIt: string }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'hearing-anything-else-reasons' });

    await cui_postForm({
      apiContext: this.apiContext,
      path: 'hearing-anything-else-reasons',
      form: {
        _csrf: csrfToken,
        reason: option.whatAndWhyYouNeedIt,
        saveAndContinue: '',
      },
    });
  }
}
