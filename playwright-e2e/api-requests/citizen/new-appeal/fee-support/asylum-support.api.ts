import { APIRequestContext } from '@playwright/test';
import { cui_getCsrfToken, cui_postForm } from '../../../../utils/api-requests-utils';

export class AsylumSupportApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { asylumSupportRefNumber: number }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'asylum-support' });

    await cui_postForm({
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
