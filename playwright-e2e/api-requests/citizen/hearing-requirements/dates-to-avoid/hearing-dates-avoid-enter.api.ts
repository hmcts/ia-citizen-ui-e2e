import { APIRequestContext } from '@playwright/test';
import { getCsrfToken, postForm } from '../../../../utils/citizen-user.utils';

export class HearingDatesAvoidEnterApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(dateToAvoid: { day: number; month: number; year: number }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'hearing-dates-avoid-enter' });

    await postForm({
      apiContext: this.apiContext,
      path: 'hearing-dates-avoid-enter',
      form: {
        _csrf: csrfToken,
        day: dateToAvoid.day.toString(),
        month: dateToAvoid.month.toString(),
        year: dateToAvoid.year.toString(),
      },
    });
  }
}
