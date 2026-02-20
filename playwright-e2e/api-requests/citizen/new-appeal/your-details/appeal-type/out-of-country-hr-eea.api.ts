import { APIRequestContext } from '@playwright/test';
import { YesOrNoType } from '../../../../../citizen-types';
import { cui_getCsrfToken, cui_postForm } from '../../../../../utils/api-requests-utils';

export class OutOfCountryHrEeaApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { outsideUkWhenApplicationMade: YesOrNoType }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'ooc-hr-eea' });

    await cui_postForm({
      apiContext: this.apiContext,
      path: 'ooc-hr-eea',
      form: {
        _csrf: csrfToken,
        questionId: '',
        answer: option.outsideUkWhenApplicationMade,
        continue: '',
      },
    });
  }
}
