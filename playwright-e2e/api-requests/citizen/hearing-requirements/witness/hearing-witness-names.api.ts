import { APIRequestContext } from '@playwright/test';
import { getCsrfToken, postForm } from '../../../../utils/citizen-user.utils';

export class HearingWitnessNamesApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { givenNames: string | string[]; familyName: string }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'hearing-witness-names' });

    await postForm({
      apiContext: this.apiContext,
      path: 'hearing-witness-names/add',
      form: {
        _csrf: csrfToken,
        witnessName: Array.isArray(option.givenNames) ? option.givenNames.join(' ') : option.givenNames,
        witnessFamilyName: option.familyName,
        addAnotherWitness: '',
      },
    });

    await postForm({
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
