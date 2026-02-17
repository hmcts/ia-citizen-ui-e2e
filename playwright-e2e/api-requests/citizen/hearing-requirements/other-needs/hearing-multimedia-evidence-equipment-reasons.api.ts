import { APIRequestContext } from '@playwright/test';
import { getCsrfToken, postForm } from '../../../../utils/citizen-user.utils';

export class HearingMultiMediaEvidenceEquipmentReasonsApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { reasonUnableToBringEquipment: string }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'hearing-multimedia-evidence-equipment-reasons' });

    await postForm({
      apiContext: this.apiContext,
      path: 'hearing-multimedia-evidence-equipment-reasons',
      form: {
        _csrf: csrfToken,
        reason: option.reasonUnableToBringEquipment,
        saveAndContinue: '',
      },
    });
  }
}
