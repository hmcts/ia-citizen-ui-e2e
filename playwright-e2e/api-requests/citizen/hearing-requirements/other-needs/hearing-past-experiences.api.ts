import { APIRequestContext } from '@playwright/test';
import { YesOrNoType } from '../../../../citizen-types';
import { cui_getCsrfToken, cui_postForm } from '../../../../utils/api-requests-utils';

export class HearingPastExperiencesApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { anyPastExperienceThatMayAffectHearing: YesOrNoType }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'hearing-past-experiences' });

    await cui_postForm({
      apiContext: this.apiContext,
      path: 'hearing-past-experiences',
      form: {
        _csrf: csrfToken,
        answer: option.anyPastExperienceThatMayAffectHearing.toLowerCase(),
        saveAndContinue: '',
      },
    });
  }
}
