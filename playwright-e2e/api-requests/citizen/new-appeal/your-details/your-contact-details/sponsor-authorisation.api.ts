import { APIRequestContext } from '@playwright/test';
import { YesOrNoType } from '../../../../../citizen-types';
import { getCsrfToken, postForm } from '../../../../../utils/citizen-user.utils';

export class SponsorAuthorisationApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { allowSponsorToSeeAppealInformation: YesOrNoType }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'sponsor-authorisation' });

    await postForm({
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
