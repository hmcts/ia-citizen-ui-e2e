import { APIRequestContext } from '@playwright/test';
import { YesOrNoType } from '../../../../types';
import { getCsrfToken, postForm } from '../../../../utils/citizen-user.utils';

export class InTheUkApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { isUserInTheUk: YesOrNoType }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'in-the-uk' });

    await postForm({
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
