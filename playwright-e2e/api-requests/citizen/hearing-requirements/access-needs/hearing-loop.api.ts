import { APIRequestContext } from '@playwright/test';
import { YesOrNoType } from '../../../../citizen-types';
import { cui_getCsrfToken, cui_postForm } from '../../../../utils/api-requests-utils';

export class HearingLoopApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { willYouOrWitnessNeedHearingLoop: YesOrNoType }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'hearing-hearing-loop' });

    await cui_postForm({
      apiContext: this.apiContext,
      path: 'hearing-hearing-loop',
      form: {
        _csrf: csrfToken,
        answer: option.willYouOrWitnessNeedHearingLoop.toLowerCase(),
        saveAndContinue: '',
      },
    });
  }
}
