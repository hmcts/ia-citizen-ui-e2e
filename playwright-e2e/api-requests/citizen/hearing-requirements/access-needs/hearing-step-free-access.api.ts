import { APIRequestContext } from '@playwright/test';
import { YesOrNoType } from '../../../../citizen-types';
import { cui_getCsrfToken, cui_postForm } from '../../../../utils/api-requests-utils';

export class HearingStepFreeAccessApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { willYouOrWitnessRequireStepFreeAccess: YesOrNoType }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'hearing-step-free-access' });

    await cui_postForm({
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
