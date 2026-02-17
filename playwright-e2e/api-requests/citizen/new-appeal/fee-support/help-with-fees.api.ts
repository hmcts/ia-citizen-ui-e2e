import { APIRequestContext } from '@playwright/test';
import { getCsrfToken, postForm } from '../../../../utils/citizen-user.utils';

export class HelpWithFeesApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { helpWithFees: 'wantToApply' | 'alreadyApplied' | 'willPayForAppeal' }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'help-with-fees' });

    await postForm({
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
