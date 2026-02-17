import { APIRequestContext } from '@playwright/test';
import { YesOrNoType } from '../../../citizen-types';
import { getCsrfToken, postForm } from '../../../utils/citizen-user.utils';

export class SupportingEvidenceApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { doYouWishToProvideSupportingEvidence: YesOrNoType }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'case-building/supporting-evidence' });

    await postForm({
      apiContext: this.apiContext,
      path: 'case-building/supporting-evidence',
      form: {
        _csrf: csrfToken,
        answer: option.doYouWishToProvideSupportingEvidence.toLowerCase(),
      },
    });
  }
}
