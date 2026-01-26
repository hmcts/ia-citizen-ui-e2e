import { APIRequestContext } from '@playwright/test';
import { YesOrNoType } from '../../../../types';
import { getCsrfToken, postForm } from '../../../../utils/citizen-user.utils';

export class HasSponsorApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { doesApplicantHaveASponsor: YesOrNoType }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'has-sponsor' });

    await postForm({
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
