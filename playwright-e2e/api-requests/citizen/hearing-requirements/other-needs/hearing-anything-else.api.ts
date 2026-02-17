import { APIRequestContext } from '@playwright/test';
import { YesOrNoType } from '../../../../citizen-types';
import { getCsrfToken, postForm } from '../../../../utils/citizen-user.utils';

export class HearingAnythingElseApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { needAnythingElse: YesOrNoType }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'hearing-anything-else' });

    await postForm({
      apiContext: this.apiContext,
      path: 'hearing-anything-else',
      form: {
        _csrf: csrfToken,
        answer: option.needAnythingElse.toLowerCase(),
        saveAndContinue: '',
      },
    });
  }
}
