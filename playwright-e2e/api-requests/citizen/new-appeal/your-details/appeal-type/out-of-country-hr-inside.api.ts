import { APIRequestContext } from '@playwright/test';
import { cui_getCsrfToken, cui_postForm } from '../../../../../utils/api-requests-utils';

export class OutOfCountryHrInsideApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(dateApplicantLeftUk: { day: number; month: number; year: number }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'ooc-hr-inside' });

    await cui_postForm({
      apiContext: this.apiContext,
      path: 'ooc-hr-inside',
      form: {
        _csrf: csrfToken,
        day: dateApplicantLeftUk.day.toString(),
        month: dateApplicantLeftUk.month.toString(),
        year: dateApplicantLeftUk.year.toString(),
        saveAndContinue: '',
      },
    });
  }
}
