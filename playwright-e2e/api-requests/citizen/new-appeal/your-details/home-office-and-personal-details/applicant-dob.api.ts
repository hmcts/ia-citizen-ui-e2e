import { APIRequestContext } from '@playwright/test';
import { getCsrfToken, postForm } from '../../../../../utils/citizen-user.utils';

export class ApplicantDobApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(dateOfBirth: { day: number; month: number; year: number }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'date-birth' });

    await postForm({
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
