import { APIRequestContext } from '@playwright/test';
import { getCsrfToken, postForm } from '../../../../utils/citizen-user.utils';
import { payForAppealNowOrLaterType } from '../../../../citizen-types';

export class PayNowApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { payNowOrLater: payForAppealNowOrLaterType }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'pay-now' });

    await postForm({
      apiContext: this.apiContext,
      path: 'pay-now',
      form: {
        _csrf: csrfToken,
        answer: option.payNowOrLater,
        saveAndContinue: '',
      },
    });
  }
}
