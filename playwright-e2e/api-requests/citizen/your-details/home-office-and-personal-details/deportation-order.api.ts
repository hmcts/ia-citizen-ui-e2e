import { APIRequestContext } from '@playwright/test';
import { YesOrNoType } from '../../../../types';
import { getCsrfToken, postForm } from '../../../../utils/citizen-user.utils';

export class DeportationOrderApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { deportationOrderReceived: YesOrNoType }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'deportation-order' });

    await postForm({
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
