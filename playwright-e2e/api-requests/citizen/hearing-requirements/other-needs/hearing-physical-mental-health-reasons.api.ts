import { APIRequestContext } from '@playwright/test';
import { cui_getCsrfToken, cui_postForm } from '../../../../utils/api-requests-utils';

export class HearingPhysicalMentalHealthReasonsApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { howManyPhysicalOrMentalHealthConditions: string }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'hearing-physical-mental-health-reasons' });

    await cui_postForm({
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
