import { APIRequestContext } from '@playwright/test';
import { YesOrNoType } from '../../../citizen-types';
import { getCsrfToken, postForm } from '../../../utils/citizen-user.utils';

export class SupportingEvidenceMoreTimeApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { doYouWishToProvideSupportingEvidence: YesOrNoType }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'supporting-evidence-more-time' });

    await postForm({
      apiContext: this.apiContext,
      path: 'supporting-evidence-more-time',
      form: {
        _csrf: csrfToken,
        answer: option.doYouWishToProvideSupportingEvidence,
      },
    });
  }
}
