import { APIRequestContext } from '@playwright/test';
import { cui_getCsrfToken, cui_postForm } from '../../../../../utils/api-requests-utils';

export class ApplicantDobApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(dateOfBirth: { day: number; month: number; year: number }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'date-birth' });

    await cui_postForm({
      apiContext: this.apiContext,
      path: 'date-birth',
      form: {
        _csrf: csrfToken,
        day: dateOfBirth.day.toString(),
        month: dateOfBirth.month.toString(),
        year: dateOfBirth.year.toString(),
        saveAndContinue: '',
      },
    });
  }
}
