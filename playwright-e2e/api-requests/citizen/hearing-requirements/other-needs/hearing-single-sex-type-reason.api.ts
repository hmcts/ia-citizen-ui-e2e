import { APIRequestContext } from '@playwright/test';
import { getCsrfToken, postForm } from '../../../../utils/citizen-user.utils';

export class HearingSingleSexTypeReasonApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(options: { typeOfHearing: 'male' | 'female'; reasonForSingleSextypeHearing: string }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: `hearing-single-sex-type-${options.typeOfHearing}` });

    await postForm({
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
