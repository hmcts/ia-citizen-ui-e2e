import { APIRequestContext } from '@playwright/test';
import { cui_getCsrfToken, cui_postForm } from '../../../../utils/api-requests-utils';
import { InterpretorSupportType } from '../../../../citizen-types';

export class HearingInterpreterTypesApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(options: { applicantOrWitness: 'Applicant' | 'Witness'; typeOfInterpretor: InterpretorSupportType }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({
      apiContext: this.apiContext,
      path: 'hearing-interpreter-types',
      params: options.applicantOrWitness === 'Witness' ? { selectedWitnesses: '0' } : undefined,
    });

    const form = new FormData();

    form.append('_csrf', csrfToken);
    form.append('saveAndContinue', '');

    switch (options.typeOfInterpretor) {
      case 'Spoken language interpreter':
        form.append('selections', 'spokenLanguageInterpreter');
        break;

      case 'Sign language interpreter':
        form.append('selections', 'signLanguageInterpreter');
        break;

      case 'Spoken and sign language interpretor':
        form.append('selections', 'spokenLanguageInterpreter');
        form.append('selections', 'signLanguageInterpreter');
        break;

      default:
        throw new Error(`Invalid type of interpretor: ${options.typeOfInterpretor}`);
    }

    if (options.applicantOrWitness === 'Witness') {
      form.append('selectedWitnessesList', '0');
    } else {
      form.append('selectedWitnessesList', '');
    }

    await cui_postForm({
      apiContext: this.apiContext,
      path: 'hearing-interpreter-types',
      form,
    });
  }
}
