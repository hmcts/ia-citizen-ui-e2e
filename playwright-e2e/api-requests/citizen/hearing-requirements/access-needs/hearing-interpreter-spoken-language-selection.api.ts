import { APIRequestContext } from '@playwright/test';
import { LanguagesType, LANGUAGE_NAME_TO_CODE } from '../../../../citizen-types';
import { cui_getCsrfToken, cui_postForm } from '../../../../utils/api-requests-utils';

export class HearingInterpreterSpokenLanguageSelectionApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(options: { applicantOrWitness: 'Applicant' | 'Witness'; languageToInterpret: LanguagesType }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({
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

    await cui_postForm({
      apiContext: this.apiContext,
      path: 'hearing-interpreter-spoken-language-selection',
      form: form,
    });
  }
}
