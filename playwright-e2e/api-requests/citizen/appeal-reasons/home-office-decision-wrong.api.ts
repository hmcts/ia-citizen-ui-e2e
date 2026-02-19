import { APIRequestContext } from '@playwright/test';
import { cui_getCsrfToken, cui_postForm } from '../../../utils/api-requests-utils';

export class HomeOfficeDecisionWrongApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(options: { reasonWhyHomeOfficeDecisionIsWrong: string }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({
      apiContext: this.apiContext,
      path: 'case-building/home-office-decision-wrong',
    });

    await cui_postForm({
      apiContext: this.apiContext,
      path: 'case-building/home-office-decision-wrong',
      form: {
        _csrf: csrfToken,
        applicationReason: options.reasonWhyHomeOfficeDecisionIsWrong,
        saveAndContinue: '',
      },
    });
  }
}
