import { APIRequestContext } from '@playwright/test';
import { AppealType } from '../../../../../citizen-types';
import { cui_getCsrfToken, cui_postForm } from '../../../../../utils/api-requests-utils';

export class AppealTypeApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { appealType: AppealType }): Promise<void> {
    const appealTypeApiMap: Record<AppealType, string> = {
      Protection: 'protection',
      'Human Rights': 'refusalOfHumanRights',
      'European Economic Area': 'refusalOfEu',
      'Revocation of Protection Status': 'revocationOfProtection',
      'Deprivation of Citizenship': 'deprivation',
      'EU Settlement Scheme': 'euSettlementScheme',
    };

    const appealTypeApiValue = appealTypeApiMap[option.appealType];
    if (!appealTypeApiValue) {
      throw new Error(`No API mapping defined for appeal type "${option.appealType}"`);
    }

    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'appeal-type' });

    await cui_postForm({
      apiContext: this.apiContext,
      path: 'appeal-type',
      form: {
        _csrf: csrfToken,
        appealType: appealTypeApiValue,
        saveAndContinue: '',
      },
    });
  }
}
