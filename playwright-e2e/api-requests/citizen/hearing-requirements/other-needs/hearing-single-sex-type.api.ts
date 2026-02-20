import { APIRequestContext } from '@playwright/test';
import { cui_getCsrfToken, cui_postForm } from '../../../../utils/api-requests-utils';
import { AllMaleOrFemaleHearingType } from '../../../../citizen-types';

export class HearingSingleSexTypeApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(options: { typeOfHearing: AllMaleOrFemaleHearingType }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'hearing-single-sex-type' });

    const form: Record<string, string> = {
      _csrf: csrfToken,
      saveAndContinue: '',
    };

    if (options.typeOfHearing === 'All male') {
      form.answer = 'yes';
    } else {
      form.answer = 'no';
    }

    await cui_postForm({
      apiContext: this.apiContext,
      path: 'hearing-single-sex-type',
      form: form,
    });
  }
}
