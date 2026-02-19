import { APIRequestContext } from '@playwright/test';
import { YesOrNoType } from '../../../../citizen-types';
import { cui_getCsrfToken, cui_postForm } from '../../../../utils/api-requests-utils';

export class HearingDatesAvoidNewApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { anyFurtherDatesToAvoid: YesOrNoType }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'hearing-dates-avoid-new' });

    await cui_postForm({
      apiContext: this.apiContext,
      path: 'hearing-dates-avoid-new',
      form: {
        _csrf: csrfToken,
        answer: option.anyFurtherDatesToAvoid.toLowerCase(),
        saveAndContinue: '',
      },
    });
  }
}
