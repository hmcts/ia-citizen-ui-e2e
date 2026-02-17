import { APIRequestContext } from '@playwright/test';
import { getCsrfToken, postForm } from '../../../../utils/citizen-user.utils';

export class HearingPrivateReasonsApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { reasonForPrivateHearing: string }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'hearing-private-reason' });

    await postForm({
      apiContext: this.apiContext,
      path: 'hearing-private-reason',
      form: {
        _csrf: csrfToken,
        reason: option.reasonForPrivateHearing,
        saveAndContinue: '',
      },
    });
  }
}
