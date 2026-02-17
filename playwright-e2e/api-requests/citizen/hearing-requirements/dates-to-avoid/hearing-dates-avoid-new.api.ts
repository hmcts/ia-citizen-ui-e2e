import { APIRequestContext } from '@playwright/test';
import { YesOrNoType } from '../../../../citizen-types';
import { getCsrfToken, postForm } from '../../../../utils/citizen-user.utils';

export class HearingDatesAvoidNewApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { anyFurtherDatesToAvoid: YesOrNoType }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'hearing-dates-avoid-new' });

    await postForm({
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
