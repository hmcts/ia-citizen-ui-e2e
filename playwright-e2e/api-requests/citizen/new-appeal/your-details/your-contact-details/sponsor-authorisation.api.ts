import { APIRequestContext } from '@playwright/test';
import { YesOrNoType } from '../../../../../citizen-types';
import { cui_getCsrfToken, cui_postForm } from '../../../../../utils/api-requests-utils';

export class SponsorAuthorisationApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { allowSponsorToSeeAppealInformation: YesOrNoType }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'sponsor-authorisation' });

    await cui_postForm({
      apiContext: this.apiContext,
      path: 'sponsor-authorisation',
      form: {
        _csrf: csrfToken,
        questionId: '',
        answer: option.allowSponsorToSeeAppealInformation,
        continue: '',
      },
    });
  }
}
