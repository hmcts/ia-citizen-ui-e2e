import { APIRequestContext } from '@playwright/test';
import { YesOrNoType } from '../../../../../citizen-types';
import { cui_getCsrfToken, cui_postForm } from '../../../../../utils/api-requests-utils';

export class InTheUkApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { isUserInTheUk: YesOrNoType }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'in-the-uk' });

    await cui_postForm({
      apiContext: this.apiContext,
      path: 'in-the-uk',
      form: {
        _csrf: csrfToken,
        questionId: '',
        answer: option.isUserInTheUk,
        continue: '',
      },
    });
  }
}
