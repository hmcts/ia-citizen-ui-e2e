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

    const form = new FormData();

    form.append('_csrf', csrfToken);
    form.append('saveAndContinue', '');

    switch (options.typeOfSupport) {
      case 'Interpreter for applicant':
        form.append('selections', 'isInterpreterServicesNeeded');
        break;

      case 'Interpreter for one or more witness':
        form.append('selections', 'isAnyWitnessInterpreterRequired');
        break;

      case 'Interpretor for applicant and witness':
        form.append('selections', 'isInterpreterServicesNeeded');
        form.append('selections', 'isAnyWitnessInterpreterRequired');
        break;

      case 'No interpretor required':
        form.append('selections', 'noInterpreterRequired');
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
