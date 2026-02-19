import { APIRequestContext } from '@playwright/test';
import { YesOrNoType } from '../../../../citizen-types';
import { cui_getCsrfToken, cui_postForm } from '../../../../utils/api-requests-utils';

export class HearingAnythingElseApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { needAnythingElse: YesOrNoType }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'hearing-anything-else' });

    await cui_postForm({
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
