import { APIRequestContext } from '@playwright/test';
import { cui_getCsrfToken, cui_postForm } from '../../../../utils/api-requests-utils';

export class HearingPastExperiencesReasonsApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { howManyPastExpereincesThatMayAffectHearing: string }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'hearing-past-experiences-reasons' });

    await cui_postForm({
      apiContext: this.apiContext,
      path: 'hearing-past-experiences-reasons',
      form: {
        _csrf: csrfToken,
        reason: option.howManyPastExpereincesThatMayAffectHearing,
        saveAndContinue: '',
      },
    });
  }
}
