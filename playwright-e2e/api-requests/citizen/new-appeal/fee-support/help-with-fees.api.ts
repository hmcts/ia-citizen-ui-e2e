import { APIRequestContext } from '@playwright/test';
import { cui_getCsrfToken, cui_postForm } from '../../../../utils/api-requests-utils';

export class HelpWithFeesApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { helpWithFees: 'wantToApply' | 'alreadyApplied' | 'willPayForAppeal' }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'help-with-fees' });

    await cui_postForm({
      apiContext: this.apiContext,
      path: 'help-with-fees',
      form: {
        _csrf: csrfToken,
        answer: option.helpWithFees,
        saveAndContinue: '',
      },
    });
  }
}
