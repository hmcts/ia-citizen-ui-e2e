import { APIRequestContext } from '@playwright/test';
import { getCsrfToken, postForm } from '../../../../utils/citizen-user.utils';
import { decisionWithOrWithoutHearingType } from '../../../../citizen-types';

export class DecisionTypeApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { decisionWithOrWithoutHearing: decisionWithOrWithoutHearingType }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'decision-type' });

    await postForm({
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
