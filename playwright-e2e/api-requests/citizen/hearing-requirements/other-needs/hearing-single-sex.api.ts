import { APIRequestContext } from '@playwright/test';
import { YesOrNoType } from '../../../../citizen-types';
import { getCsrfToken, postForm } from '../../../../utils/citizen-user.utils';

export class HearingSingleSexApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { willYouNeedAllFemaleOrMaleHearing: YesOrNoType }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'hearing-single-sex' });

    await postForm({
      apiContext: this.apiContext,
      path: 'hearing-single-sex',
      form: {
        _csrf: csrfToken,
        answer: option.willYouNeedAllFemaleOrMaleHearing.toLowerCase(),
        saveAndContinue: '',
      },
    });
  }
}
