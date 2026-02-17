import { APIRequestContext } from '@playwright/test';
import { getCsrfToken, postForm } from '../../../../../utils/citizen-user.utils';

export class SponsorNameApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { givenNames: string | string[]; familyName: string }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'sponsor-name' });

    await postForm({
      apiContext: this.apiContext,
      path: 'sponsor-name',
      form: {
        _csrf: csrfToken,
        sponsorGivenNames: Array.isArray(option.givenNames) ? option.givenNames.join(' ') : option.givenNames,
        sponsorFamilyName: option.familyName,
        saveAndContinue: '',
      },
    });
  }
}
