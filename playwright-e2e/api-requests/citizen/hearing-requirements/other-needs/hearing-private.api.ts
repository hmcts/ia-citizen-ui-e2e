import { APIRequestContext } from '@playwright/test';
import { YesOrNoType } from '../../../../citizen-types';
import { getCsrfToken, postForm } from '../../../../utils/citizen-user.utils';

export class HearingPrivateApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { willYouNeedAPrivateHearing: YesOrNoType }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'hearing-private' });

    await postForm({
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
