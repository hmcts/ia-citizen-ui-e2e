import { APIRequestContext } from '@playwright/test';
import { YesOrNoType } from '../../../../citizen-types';
import { cui_getCsrfToken, cui_postForm } from '../../../../utils/api-requests-utils';

export class HearingPhysicalMentalHealthApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { anyPhysicalOrMentalHealthConditions: YesOrNoType }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'hearing-physical-mental-health' });

    await cui_postForm({
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
