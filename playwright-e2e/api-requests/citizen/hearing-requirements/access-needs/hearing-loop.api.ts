import { APIRequestContext } from '@playwright/test';
import { YesOrNoType } from '../../../../citizen-types';
import { getCsrfToken, postForm } from '../../../../utils/citizen-user.utils';

export class HearingLoopApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { willYouOrWitnessNeedHearingLoop: YesOrNoType }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'hearing-hearing-loop' });

    await postForm({
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
