import { APIRequestContext } from '@playwright/test';
import { YesOrNoType } from '../../../../citizen-types';
import { getCsrfToken, postForm } from '../../../../utils/citizen-user.utils';

export class HearingPhysicalMentalHealthApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { anyPhysicalOrMentalHealthConditions: YesOrNoType }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'hearing-physical-mental-health' });

    await postForm({
      apiContext: this.apiContext,
      path: 'hearing-physical-mental-health',
      form: {
        _csrf: csrfToken,
        answer: option.anyPhysicalOrMentalHealthConditions.toLowerCase(),
        saveAndContinue: '',
      },
    });
  }
}
