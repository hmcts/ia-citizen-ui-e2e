import { APIRequestContext } from '@playwright/test';
import { getCsrfToken, postForm } from '../../../../utils/citizen-user.utils';
import { WhoNeedsInterpretorType } from '../../../../citizen-types';

export class HearingInterpreterSupportAppellantWitnessesApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(options: { typeOfSupport: WhoNeedsInterpretorType }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'hearing-interpreter-support-appellant-Witnesses' });

    const form: Record<string, string> = {
      _csrf: csrfToken,
      saveAndContinue: '',
    };

    switch (options.typeOfSupport) {
      case 'Interpreter for applicant':
        form.selections = 'isInterpreterServicesNeeded';
        break;
      case 'Interpreter for one or more witness':
        form.selections = 'isAnyWitnessInterpreterRequired';
        break;
      case 'Interpretor for applicant and witness':
        (form as any).selections = ['isInterpreterServicesNeeded', 'isAnyWitnessInterpreterRequired'];
        break;
      case 'No interpretor required':
        form.selections = 'noInterpreterRequired';
        break;
      default:
        throw new Error(`Invalid type of support: ${options.typeOfSupport}`);
    }

    await postForm({
      apiContext: this.apiContext,
      path: 'hearing-interpreter-support-appellant-Witnesses',
      form,
    });
  }
}
