import { APIRequestContext } from '@playwright/test';
import { getCsrfToken, postForm } from '../../../../utils/citizen-user.utils';

export class HearingPastExperiencesReasonsApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { howManyPastExpereincesThatMayAffectHearing: string }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'hearing-past-experiences-reasons' });

    await postForm({
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
