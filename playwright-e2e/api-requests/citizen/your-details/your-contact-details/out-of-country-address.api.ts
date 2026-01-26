import { APIRequestContext } from '@playwright/test';
import { getCsrfToken, postForm } from '../../../../utils/citizen-user.utils';

export class OutOfCountryAddressApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { applicantAddress: string }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'out-of-country-address' });

    await postForm({
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
