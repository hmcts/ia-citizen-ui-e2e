import { APIRequestContext } from '@playwright/test';
import { SignLanguagesType, SIGN_LANGUAGE_NAME_TO_CODE } from '../../../../citizen-types';
import { cui_getCsrfToken, cui_postForm } from '../../../../utils/api-requests-utils';

export class HearingInterpreterSignLanguageSelectionApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(options: { applicantOrWitness: 'Applicant' | 'Witness'; signLanguageToInterpret: SignLanguagesType }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({
      apiContext: this.apiContext,
      path: 'hearing-interpreter-sign-language-selection',
      params: options.applicantOrWitness === 'Witness' ? { selectedWitnesses: '0' } : undefined,
    });

    const form: Record<string, string> = {
      _csrf: csrfToken,
      languageRefData: SIGN_LANGUAGE_NAME_TO_CODE[options.signLanguageToInterpret],
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
      path: 'hearing-interpreter-sign-language-selection',
      form: form,
    });
  }
}
