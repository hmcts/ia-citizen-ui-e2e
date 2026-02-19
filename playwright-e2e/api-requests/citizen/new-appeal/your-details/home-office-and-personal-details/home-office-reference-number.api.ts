import { APIRequestContext } from '@playwright/test';
import { cui_getCsrfToken, cui_postForm } from '../../../../../utils/api-requests-utils';

export class HomeOfficeReferenceNumberApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { homeOfficeReference: number }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'home-office-reference-number' });

    await cui_postForm({
      apiContext: this.apiContext,
      path: 'home-office-reference-number',
      form: {
        _csrf: csrfToken,
        homeOfficeRefNumber: option.homeOfficeReference.toString(),
        saveAndContinue: '',
      },
    });
  }
}
