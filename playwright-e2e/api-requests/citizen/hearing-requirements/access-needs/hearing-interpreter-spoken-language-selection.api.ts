import { APIRequestContext } from '@playwright/test';
import { LanguagesType, LANGUAGE_NAME_TO_CODE } from '../../../../citizen-types';
import { getCsrfToken, postForm } from '../../../../utils/citizen-user.utils';

export class HearingInterpreterSpokenLanguageSelectionApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(options: { applicantOrWitness: 'Applicant' | 'Witness'; languageToInterpret: LanguagesType }): Promise<void> {
    const csrfToken = await getCsrfToken({
      apiContext: this.apiContext,
      path: 'hearing-interpreter-spoken-language-selection',
      params: options.applicantOrWitness === 'Witness' ? { selectedWitnesses: '0' } : undefined,
    });

    const form: Record<string, string> = {
      _csrf: csrfToken,
      languageRefData: LANGUAGE_NAME_TO_CODE[options.languageToInterpret],
      languageManualEntryDescription: '',
      saveAndContinue: '',
    };

    if (options.applicantOrWitness === 'Witness') {
      form.selectedWitnessesList = '0';
    } else {
      form.selectedWitnessesList = '';
    }

    await postForm({
      apiContext: this.apiContext,
      path: 'hearing-interpreter-spoken-language-selection',
      form: form,
    });
  }
}
