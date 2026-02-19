import { APIRequestContext } from '@playwright/test';
import { YesOrNoType } from '../../../../../citizen-types';
import { cui_getCsrfToken, cui_postForm } from '../../../../../utils/api-requests-utils';

export class DeportationOrderApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { deportationOrderReceived: YesOrNoType }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'deportation-order' });

    await cui_postForm({
      apiContext: this.apiContext,
      path: 'deportation-order',
      form: {
        _csrf: csrfToken,
        answer: option.deportationOrderReceived,
        saveAndContinue: '',
      },
    });
  }
}
