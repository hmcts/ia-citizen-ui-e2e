import { APIRequestContext } from '@playwright/test';
import { YesOrNoType } from '../../../../citizen-types';
import { cui_getCsrfToken, cui_postForm } from '../../../../utils/api-requests-utils';

export class HearingMultiMediaEvidenceApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { willYouBringVideoOrAudioEvidence: YesOrNoType }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'hearing-multimedia-evidence' });

    await cui_postForm({
      apiContext: this.apiContext,
      path: 'hearing-multimedia-evidence',
      form: {
        _csrf: csrfToken,
        answer: option.willYouBringVideoOrAudioEvidence.toLowerCase(),
        saveAndContinue: '',
      },
    });
  }
}
