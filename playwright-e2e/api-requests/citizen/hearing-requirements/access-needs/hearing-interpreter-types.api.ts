import { APIRequestContext } from '@playwright/test';
import { getCsrfToken, postForm } from '../../../../utils/citizen-user.utils';
import { InterpretorSupportType } from '../../../../citizen-types';

export class HearingInterpreterTypesApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(options: { applicantOrWitness: 'Applicant' | 'Witness'; typeOfInterpretor: InterpretorSupportType }): Promise<void> {
    const csrfToken = await getCsrfToken({
      apiContext: this.apiContext,
      path: 'hearing-interpreter-types',
      params: options.applicantOrWitness === 'Witness' ? { selectedWitnesses: '0' } : undefined,
    });

    const form: Record<string, string> = {
      _csrf: csrfToken,
      saveAndContinue: '',
    };

    switch (options.typeOfInterpretor) {
      case 'Spoken language interpreter':
        form.selections = 'spokenLanguageInterpreter';
        break;
      case 'Sign language interpreter':
        form.selections = 'signLanguageInterpreter';
        break;
      case 'Spoken and sign language interpretor':
        (form as any).selections = ['spokenLanguageInterpreter', 'signLanguageInterpreter'];
        break;
      default:
        throw new Error(`Invalid type of interpretor: ${options.typeOfInterpretor}`);
    }

    if (options.applicantOrWitness === 'Witness') {
      form.selectedWitnessesList = '0';
    } else {
      form.selectedWitnessesList = '';
    }

    await postForm({
      apiContext: this.apiContext,
      path: 'hearing-interpreter-types',
      form,
    });
  }
}
