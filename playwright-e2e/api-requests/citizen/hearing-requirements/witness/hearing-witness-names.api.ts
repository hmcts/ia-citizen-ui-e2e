import { APIRequestContext } from '@playwright/test';
import { cui_getCsrfToken, cui_postForm } from '../../../../utils/api-requests-utils';

export class HearingWitnessNamesApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { givenNames: string | string[]; familyName: string }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'hearing-witness-names' });

    await cui_postForm({
      apiContext: this.apiContext,
      path: 'hearing-witness-names/add',
      form: {
        _csrf: csrfToken,
        witnessName: Array.isArray(option.givenNames) ? option.givenNames.join(' ') : option.givenNames,
        witnessFamilyName: option.familyName,
        addAnotherWitness: '',
      },
    });

    await cui_postForm({
      apiContext: this.apiContext,
      path: 'hearing-witness-names',
      form: {
        _csrf: csrfToken,
        witnessName: '',
        witnessFamilyName: '',
        saveAndContinue: '',
      },
    });
  }
}
