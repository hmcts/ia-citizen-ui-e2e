import { APIRequestContext } from '@playwright/test';
import { getCsrfToken, postForm } from '../../../../../utils/citizen-user.utils';

export class OutOfCountryProtectionDepartureDateApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(dateApplicantLeftUk: { day: number; month: number; year: number }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'ooc-protection-departure-date' });

    await postForm({
      apiContext: this.apiContext,
      path: 'ooc-protection-departure-date',
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
