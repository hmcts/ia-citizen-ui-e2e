import { APIRequestContext } from '@playwright/test';
import { cui_getCsrfToken, cui_postForm } from '../../../../utils/api-requests-utils';

export class HearingMultiMediaEvidenceEquipmentReasonsApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { reasonUnableToBringEquipment: string }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'hearing-multimedia-evidence-equipment-reasons' });

    await cui_postForm({
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
