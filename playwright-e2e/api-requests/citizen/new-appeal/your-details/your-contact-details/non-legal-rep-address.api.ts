import { APIRequestContext } from '@playwright/test';
import { cui_getCsrfToken, cui_postForm } from '../../../../../utils/api-requests-utils';

export class NonLegalRepAddressApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(options: {
    nonLegalRepAddress: string;
  }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'non-legal-rep-address' });

    await cui_postForm({
      apiContext: this.apiContext,
      path: 'non-legal-rep-address',
      form: {
        _csrf: csrfToken,
        'nlr-address': options.nonLegalRepAddress,
        saveAndContinue: '',
      },
    });
  }
}
