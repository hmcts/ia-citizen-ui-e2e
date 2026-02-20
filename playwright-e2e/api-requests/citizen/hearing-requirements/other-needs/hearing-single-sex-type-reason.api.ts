import { APIRequestContext } from '@playwright/test';
import { cui_getCsrfToken, cui_postForm } from '../../../../utils/api-requests-utils';

export class HearingSingleSexTypeReasonApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(options: { typeOfHearing: 'male' | 'female'; reasonForSingleSextypeHearing: string }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: `hearing-single-sex-type-${options.typeOfHearing}` });

    await cui_postForm({
      apiContext: this.apiContext,
      path: `hearing-single-sex-type-${options.typeOfHearing}`,
      form: {
        _csrf: csrfToken,
        reason: options.reasonForSingleSextypeHearing,
        saveAndContinue: '',
      },
    });
  }
}
