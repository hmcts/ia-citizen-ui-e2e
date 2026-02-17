import { APIRequestContext } from '@playwright/test';
import { YesOrNoType } from '../../../../citizen-types';
import { getCsrfToken, postForm } from '../../../../utils/citizen-user.utils';

export class HearingMultiMediaEvidenceEquipmentApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { willYouBringEquipmentToPlayEvidence: YesOrNoType }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'hearing-multimedia-evidence-equipment' });

    await postForm({
      apiContext: this.apiContext,
      path: 'hearing-multimedia-evidence-equipment',
      form: {
        _csrf: csrfToken,
        answer: option.willYouBringEquipmentToPlayEvidence.toLowerCase(),
        saveAndContinue: '',
      },
    });
  }
}
