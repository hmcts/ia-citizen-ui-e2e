import { APIRequestContext } from '@playwright/test';
import { YesOrNoType } from '../../../../citizen-types';
import { cui_getCsrfToken, cui_postForm } from '../../../../utils/api-requests-utils';

export class HearingOutsideUkApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { takePartInHearingOutsideUk: YesOrNoType }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'hearing-outside-uk' });

    await cui_postForm({
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
