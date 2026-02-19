import { APIRequestContext } from '@playwright/test';
import { cui_getCsrfToken, cui_postForm } from '../../../../../utils/api-requests-utils';

export class SponsorNameApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { givenNames: string | string[]; familyName: string }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'sponsor-name' });

    await cui_postForm({
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
