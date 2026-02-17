import { APIRequestContext } from '@playwright/test';
import { getCsrfToken, postForm } from '../../../../utils/citizen-user.utils';

export class HearingAnythingElseReasonsApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { whatAndWhyYouNeedIt: string }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'hearing-anything-else-reasons' });

    await postForm({
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
