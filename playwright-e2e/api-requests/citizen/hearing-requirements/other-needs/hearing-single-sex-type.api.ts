import { APIRequestContext } from '@playwright/test';
import { getCsrfToken, postForm } from '../../../../utils/citizen-user.utils';
import { AllMaleOrFemaleHearingType } from '../../../../citizen-types';

export class HearingSingleSexTypeApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(options: { typeOfHearing: AllMaleOrFemaleHearingType }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'hearing-single-sex-type' });

    const form: Record<string, string> = {
      _csrf: csrfToken,
      saveAndContinue: '',
    };

    if (options.typeOfHearing === 'All male') {
      form.answer = 'yes';
    } else {
      form.answer = 'no';
    }

    await postForm({
      apiContext: this.apiContext,
      path: 'hearing-single-sex-type',
      form: form,
    });
  }
}
