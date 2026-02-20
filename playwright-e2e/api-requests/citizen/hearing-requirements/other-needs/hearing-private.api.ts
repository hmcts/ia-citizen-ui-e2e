import { APIRequestContext } from '@playwright/test';
import { YesOrNoType } from '../../../../citizen-types';
import { cui_getCsrfToken, cui_postForm } from '../../../../utils/api-requests-utils';

export class HearingPrivateApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { willYouNeedAPrivateHearing: YesOrNoType }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'hearing-private' });

    await cui_postForm({
      apiContext: this.apiContext,
      path: 'hearing-private',
      form: {
        _csrf: csrfToken,
        answer: option.willYouNeedAPrivateHearing.toLowerCase(),
        saveAndContinue: '',
      },
    });
  }
}
