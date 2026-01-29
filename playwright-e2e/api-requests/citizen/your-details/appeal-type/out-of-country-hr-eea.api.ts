import { APIRequestContext } from '@playwright/test';
import { YesOrNoType } from '../../../../types';
import { getCsrfToken, postForm } from '../../../../utils/citizen-user.utils';

export class OutOfCountryHrEeaApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { outsideUkWhenApplicationMade: YesOrNoType }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'ooc-hr-eea' });

    await postForm({
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
