import { APIRequestContext } from '@playwright/test';
import { YesOrNoType } from '../../../../citizen-types';
import { getCsrfToken, postForm } from '../../../../utils/citizen-user.utils';

export class HearingMultiMediaEvidenceApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { willYouBringVideoOrAudioEvidence: YesOrNoType }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'hearing-multimedia-evidence' });

    await postForm({
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
