import { APIRequestContext } from '@playwright/test';
import { getCsrfToken, postForm } from '../../../../utils/citizen-user.utils';

export class HearingVideoAppointmentReasonsApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { reasonUnableToJoinVideoCall: string }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'hearing-video-appointment-reasons' });

    await postForm({
      apiContext: this.apiContext,
      path: 'hearing-video-appointment-reasons',
      form: {
        _csrf: csrfToken,
        reason: option.reasonUnableToJoinVideoCall,
        saveAndContinue: '',
      },
    });
  }
}
