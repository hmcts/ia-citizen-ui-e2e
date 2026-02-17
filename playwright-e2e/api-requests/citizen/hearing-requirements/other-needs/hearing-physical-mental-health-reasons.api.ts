import { APIRequestContext } from '@playwright/test';
import { getCsrfToken, postForm } from '../../../../utils/citizen-user.utils';

export class HearingPhysicalMentalHealthReasonsApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { howManyPhysicalOrMentalHealthConditions: string }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'hearing-physical-mental-health-reasons' });

    await postForm({
      apiContext: this.apiContext,
      path: 'hearing-physical-mental-health-reasons',
      form: {
        _csrf: csrfToken,
        reason: option.howManyPhysicalOrMentalHealthConditions,
        saveAndContinue: '',
      },
    });
  }
}
