import { APIRequestContext } from '@playwright/test';
import { cui_getCsrfToken, cui_postForm } from '../../../../utils/api-requests-utils';
import { payForAppealNowOrLaterType } from '../../../../citizen-types';

export class PayNowApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { payNowOrLater: payForAppealNowOrLaterType }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'pay-now' });

    await cui_postForm({
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
