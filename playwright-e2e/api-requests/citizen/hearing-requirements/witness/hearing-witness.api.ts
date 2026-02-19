import { APIRequestContext } from '@playwright/test';
import { YesOrNoType } from '../../../../citizen-types';
import { cui_getCsrfToken, cui_postForm } from '../../../../utils/api-requests-utils';

export class HearingWitnessApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { doesApplicantHaveAWitness: YesOrNoType }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'hearing-witnesses' });

    await cui_postForm({
      apiContext: this.apiContext,
      path: 'hearing-witnesses',
      form: {
        _csrf: csrfToken,
        answer: option.doesApplicantHaveAWitness.toLowerCase(),
        saveAndContinue: '',
      },
    });
  }
}
