import { APIRequestContext } from '@playwright/test';
import { Nationality } from '../../../../../citizen-types';
import { getCsrfToken, postForm } from '../../../../../utils/citizen-user.utils';
import countries from 'i18n-iso-countries';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const en = require('i18n-iso-countries/langs/en.json');

countries.registerLocale(en);

export class ApplicantNationalityApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(options: { stateless: boolean; nationality?: Nationality }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'nationality' });

    const form: Record<string, string> = {
      _csrf: csrfToken,
      saveAndContinue: '',
    };

    if (options.stateless) {
      form.stateless = 'isStateless';
      form.nationality = '';
    } else {
      if (!options.nationality) {
        throw new Error('Nationality must be provided when stateless is false.');
      }

      const countryCode = countries.getAlpha2Code(options.nationality, 'en');
      if (!countryCode) {
        throw new Error(`No ISO country code found for nationality: ${options.nationality}`);
      }

      form.nationality = countryCode;
    }

    await postForm({
      apiContext: this.apiContext,
      path: 'nationality',
      form,
    });
  }
}
