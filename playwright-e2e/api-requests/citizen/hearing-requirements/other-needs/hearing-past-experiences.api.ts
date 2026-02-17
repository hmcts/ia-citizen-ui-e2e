import { APIRequestContext } from '@playwright/test';
import { YesOrNoType } from '../../../../citizen-types';
import { getCsrfToken, postForm } from '../../../../utils/citizen-user.utils';

export class HearingPastExperiencesApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { anyPastExperienceThatMayAffectHearing: YesOrNoType }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'hearing-past-experiences' });

    await postForm({
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
