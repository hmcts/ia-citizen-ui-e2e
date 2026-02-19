import { APIRequestContext } from '@playwright/test';
import { cui_getCsrfToken, cui_postForm } from '../../../../utils/api-requests-utils';

export class HearingDatesAvoidReasonsApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { reasonForAvoidingDate: string }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'hearing-dates-avoid-reasons' });

    await cui_postForm({
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
