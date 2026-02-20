import { APIRequestContext } from '@playwright/test';
import { cui_getCsrfToken, cui_postForm } from '../../../../../utils/api-requests-utils';

export class OutOfCountryAddressApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { applicantAddress: string }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'out-of-country-address' });

    await cui_postForm({
      apiContext: this.apiContext,
      path: 'out-of-country-address',
      form: {
        _csrf: csrfToken,
        'outofcountry-address': option.applicantAddress,
        saveAndContinue: '',
      },
    });
  }
}
