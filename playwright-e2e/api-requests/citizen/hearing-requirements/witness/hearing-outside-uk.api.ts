import { APIRequestContext } from '@playwright/test';
import { YesOrNoType } from '../../../../citizen-types';
import { getCsrfToken, postForm } from '../../../../utils/citizen-user.utils';

export class HearingOutsideUkApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { takePartInHearingOutsideUk: YesOrNoType }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'hearing-outside-uk' });

    await postForm({
      apiContext: this.apiContext,
      path: 'hearing-outside-uk',
      form: {
        _csrf: csrfToken,
        answer: option.takePartInHearingOutsideUk.toLowerCase(),
        saveAndContinue: '',
      },
    });
  }
}
