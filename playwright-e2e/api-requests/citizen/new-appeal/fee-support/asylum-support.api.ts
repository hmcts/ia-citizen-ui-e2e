import { APIRequestContext } from '@playwright/test';
import { getCsrfToken, postForm } from '../../../../utils/citizen-user.utils';

export class AsylumSupportApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { asylumSupportRefNumber: number }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'asylum-support' });

    await postForm({
      apiContext: this.apiContext,
      path: 'asylum-support',
      form: {
        _csrf: csrfToken,
        asylumSupportRefNumber: option.asylumSupportRefNumber.toString(),
        saveAndContinue: '',
      },
    });
  }
}
