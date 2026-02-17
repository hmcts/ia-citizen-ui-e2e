import { APIRequestContext } from '@playwright/test';
import { YesOrNoType } from '../../../../citizen-types';
import { getCsrfToken, postForm } from '../../../../utils/citizen-user.utils';

export class HearingStepFreeAccessApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { willYouOrWitnessRequireStepFreeAccess: YesOrNoType }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'hearing-step-free-access' });

    await postForm({
      apiContext: this.apiContext,
      path: 'hearing-step-free-access',
      form: {
        _csrf: csrfToken,
        answer: option.willYouOrWitnessRequireStepFreeAccess.toLowerCase(),
        saveAndContinue: '',
      },
    });
  }
}
