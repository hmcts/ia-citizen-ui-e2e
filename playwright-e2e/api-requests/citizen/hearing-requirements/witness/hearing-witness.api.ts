import { APIRequestContext } from '@playwright/test';
import { YesOrNoType } from '../../../../citizen-types';
import { getCsrfToken, postForm } from '../../../../utils/citizen-user.utils';

export class HearingWitnessApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { doesApplicantHaveAWitness: YesOrNoType }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'hearing-witnesses' });

    await postForm({
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
