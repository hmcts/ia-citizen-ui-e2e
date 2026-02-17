import { APIRequestContext } from '@playwright/test';
import { getCsrfToken, postForm } from '../../../utils/citizen-user.utils';

export class HomeOfficeDecisionWrongApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(options: { reasonWhyHomeOfficeDecisionIsWrong: string }): Promise<void> {
    const csrfToken = await getCsrfToken({
      apiContext: this.apiContext,
      path: 'case-building/home-office-decision-wrong',
    });

    await postForm({
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
