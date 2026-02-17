import { APIRequestContext } from '@playwright/test';
import { getCsrfToken, postForm } from '../../../../utils/citizen-user.utils';

export class HearingDatesAvoidReasonsApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { reasonForAvoidingDate: string }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'hearing-dates-avoid-reasons' });

    await postForm({
      apiContext: this.apiContext,
      path: 'hearing-dates-avoid-reasons',
      form: {
        _csrf: csrfToken,
        reason: option.reasonForAvoidingDate,
        saveAndContinue: '',
      },
    });
  }
}
