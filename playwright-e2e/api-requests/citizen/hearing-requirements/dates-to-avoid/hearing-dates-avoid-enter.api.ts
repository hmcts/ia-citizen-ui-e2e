import { APIRequestContext } from '@playwright/test';
import { cui_getCsrfToken, cui_postForm } from '../../../../utils/api-requests-utils';

export class HearingDatesAvoidEnterApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(dateToAvoid: { day: number; month: number; year: number }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'hearing-dates-avoid-enter' });

    await cui_postForm({
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
