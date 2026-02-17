import { APIRequestContext } from '@playwright/test';
import { getCsrfToken, postForm } from '../../../../../utils/citizen-user.utils';

export class DecisionLetterSentApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(dateDecisionLetterSent: { day: number; month: number; year: number }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'date-letter-sent' });

    await postForm({
      apiContext: this.apiContext,
      path: 'date-letter-sent',
      form: {
        _csrf: csrfToken,
        day: dateDecisionLetterSent.day.toString(),
        month: dateDecisionLetterSent.month.toString(),
        year: dateDecisionLetterSent.year.toString(),
        saveAndContinue: '',
      },
    });
  }
}
