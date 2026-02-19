import { APIRequestContext } from '@playwright/test';
import { cui_getCsrfToken, cui_postForm } from '../../../../../utils/api-requests-utils';

export class ManualAddressApi {
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
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'manual-address' });

    await cui_postForm({
      apiContext: this.apiContext,
      path: 'manual-address',
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
