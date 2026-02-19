import { APIRequestContext } from '@playwright/test';
import { YesOrNoType } from '../../../../../citizen-types';
import { cui_getCsrfToken, cui_postForm } from '../../../../../utils/api-requests-utils';

export class HasSponsorApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { doesApplicantHaveASponsor: YesOrNoType }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'has-sponsor' });

    await cui_postForm({
      apiContext: this.apiContext,
      path: 'has-sponsor',
      form: {
        _csrf: csrfToken,
        questionId: '',
        answer: option.doesApplicantHaveASponsor,
        continue: '',
      },
    });
  }
}
