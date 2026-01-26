import { APIRequestContext } from '@playwright/test';
import { getCsrfToken, postForm } from '../../../../utils/citizen-user.utils';

export class HomeOfficeReferenceNumberApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { homeOfficeReference: number }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'home-office-reference-number' });

    await postForm({
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
