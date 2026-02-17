import { APIRequestContext } from '@playwright/test';
import { YesOrNoType } from '../../../../citizen-types';
import { getCsrfToken, postForm } from '../../../../utils/citizen-user.utils';

export class HearingDatesAvoidApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { anyDatesToAvoid: YesOrNoType }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'hearing-dates-avoid' });

    await postForm({
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
