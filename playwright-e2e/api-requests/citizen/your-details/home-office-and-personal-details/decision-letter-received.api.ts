import { APIRequestContext } from '@playwright/test';
import { getCsrfToken, postForm } from '../../../../utils/citizen-user.utils';

export class DecisionLetterReceivedApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(dateDecisionLetterReceived: { day: number; month: number; year: number }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'date-letter-received' });

    await postForm({
      apiContext: this.apiContext,
      path: 'date-letter-received',
      form: {
        _csrf: csrfToken,
        day: dateDecisionLetterReceived.day.toString(),
        month: dateDecisionLetterReceived.month.toString(),
        year: dateDecisionLetterReceived.year.toString(),
        saveAndContinue: '',
      },
    });
  }
}
