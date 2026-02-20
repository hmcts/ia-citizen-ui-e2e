import { APIRequestContext } from '@playwright/test';
import { cui_getCsrfToken, cui_postForm } from '../../../../utils/api-requests-utils';
import { decisionWithOrWithoutHearingType } from '../../../../citizen-types';

export class DecisionTypeApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { decisionWithOrWithoutHearing: decisionWithOrWithoutHearingType }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'decision-type' });

    await cui_postForm({
      apiContext: this.apiContext,
      path: 'decision-type',
      form: {
        _csrf: csrfToken,
        answer: option.decisionWithOrWithoutHearing,
        saveAndContinue: '',
      },
    });
  }
}
