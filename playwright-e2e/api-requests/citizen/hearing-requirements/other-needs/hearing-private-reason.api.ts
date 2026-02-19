import { APIRequestContext } from '@playwright/test';
import { cui_getCsrfToken, cui_postForm } from '../../../../utils/api-requests-utils';

export class HearingPrivateReasonsApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { reasonForPrivateHearing: string }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'hearing-private-reason' });

    await cui_postForm({
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
