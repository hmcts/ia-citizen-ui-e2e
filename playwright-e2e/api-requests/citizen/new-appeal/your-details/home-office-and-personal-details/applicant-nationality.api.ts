import { APIRequestContext } from '@playwright/test';
import { Nationality } from '../../../../../citizen-types';
import { cui_getCsrfToken, cui_postForm } from '../../../../../utils/api-requests-utils';

export class ApplicantNationalityApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }
  private readonly nationalityToCountryCode = {
    Afghan: 'AF',
    Albanian: 'AL',
    Barbadian: 'BB',
    Belarusian: 'BY',
    Belgian: 'BE',
    Belizean: 'BZ',
    Beninese: 'BJ',
    Bermudian: 'BM',
    Bhutanese: 'BT',
    Bolivian: 'BO',
    'Citizen of Bosnia and Herzegovina': 'BA',
    English: 'GB',
    'Equatorial Guinean': 'GQ',
    Singaporean: 'SG',
    Slovak: 'SK',
    Slovenian: 'SI',
    'Solomon Islander': 'SB',
    Somali: 'SO',
    'South African': 'ZA',
    'South Korean': 'KR',
    'South Sudanese': 'SS',
    Spanish: 'ES',
    'Sri Lankan': 'LK',
    'St Helenian': 'SH',
    'St Lucian': 'LC',
    Sudanese: 'SD',
    Surinamese: 'SR',
    Swazi: 'SZ',
    Swedish: 'SE',
    Swiss: 'CH',
    Syrian: 'SY',
    Taiwanese: 'TW',
    Tajik: 'TJ',
    Tanzanian: 'TZ',
    Thai: 'TH',
  } as const satisfies Record<Nationality, string>;

  public async submitForm(options: { stateless: boolean; nationality?: Nationality }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'nationality' });

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

      const countryCode = this.nationalityToCountryCode[options.nationality];
      if (!countryCode) {
        throw new Error(`No ISO country code found for nationality: ${options.nationality}`);
      }

      form.nationality = countryCode;
    }

    await cui_postForm({
      apiContext: this.apiContext,
      path: 'nationality',
      form,
    });
  }
}
