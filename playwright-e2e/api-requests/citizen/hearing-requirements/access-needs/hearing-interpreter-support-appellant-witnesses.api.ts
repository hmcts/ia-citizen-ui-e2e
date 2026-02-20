import { APIRequestContext } from '@playwright/test';
import { cui_getCsrfToken, cui_postForm } from '../../../../utils/api-requests-utils';
import { WhoNeedsInterpretorType } from '../../../../citizen-types';

export class HearingInterpreterSupportAppellantWitnessesApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(options: { typeOfSupport: WhoNeedsInterpretorType }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'hearing-interpreter-support-appellant-Witnesses' });

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

    await cui_postForm({
      apiContext: this.apiContext,
      path: 'hearing-interpreter-support-appellant-Witnesses',
      form,
    });
  }
}
