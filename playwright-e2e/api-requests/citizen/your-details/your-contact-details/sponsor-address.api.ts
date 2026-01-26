import { APIRequestContext } from '@playwright/test';
import { getCsrfToken, postForm } from '../../../../utils/citizen-user.utils';

export class SponsorAddressApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(options: {
    addressLine1: string;
    addressLine2?: string;
    townOrCity: string;
    county?: string;
    postCode: string;
  }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'sponsor-address' });

    await postForm({
      apiContext: this.apiContext,
      path: 'sponsor-address',
      form: {
        _csrf: csrfToken,
        'address-line-1': options.addressLine1,
        'address-line-2': options.addressLine2 || '',
        'address-town': options.townOrCity,
        'address-county': options.county || '',
        'address-postcode': options.postCode,
        saveAndContinue: '',
      },
    });
  }
}
