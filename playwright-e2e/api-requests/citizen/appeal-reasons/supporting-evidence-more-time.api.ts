import { APIRequestContext } from '@playwright/test';
import { YesOrNoType } from '../../../citizen-types';
import { cui_getCsrfToken, cui_postForm } from '../../../utils/api-requests-utils';

export class SupportingEvidenceMoreTimeApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { doYouWishToProvideSupportingEvidence: YesOrNoType }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'supporting-evidence-more-time' });

    await cui_postForm({
      apiContext: this.apiContext,
      path: 'supporting-evidence-more-time',
      form: {
        _csrf: csrfToken,
        answer: option.doYouWishToProvideSupportingEvidence,
      },
    });
  }
}
