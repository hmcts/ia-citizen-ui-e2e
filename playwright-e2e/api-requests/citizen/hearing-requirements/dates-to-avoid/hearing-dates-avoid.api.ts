import { APIRequestContext } from '@playwright/test';
import { YesOrNoType } from '../../../../citizen-types';
import { cui_getCsrfToken, cui_postForm } from '../../../../utils/api-requests-utils';

export class HearingDatesAvoidApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { anyDatesToAvoid: YesOrNoType }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'hearing-dates-avoid' });

    await cui_postForm({
      apiContext: this.apiContext,
      path: 'hearing-dates-avoid',
      form: {
        _csrf: csrfToken,
        answer: option.anyDatesToAvoid.toLowerCase(),
        saveAndContinue: '',
      },
    });
  }
}
