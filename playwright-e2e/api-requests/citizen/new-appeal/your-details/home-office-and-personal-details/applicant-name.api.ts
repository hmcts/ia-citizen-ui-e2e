import { APIRequestContext } from '@playwright/test';
import { getCsrfToken, postForm } from '../../../../../utils/citizen-user.utils';

export class ApplicantNameApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { givenNames: string | string[]; familyName: string }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'name' });

    await postForm({
      apiContext: this.apiContext,
      path: 'name',
      form: {
        _csrf: csrfToken,
        givenNames: Array.isArray(option.givenNames) ? option.givenNames.join(' ') : option.givenNames,
        familyName: option.familyName,
        saveAndContinue: '',
      },
    });
  }
}
