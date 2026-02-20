import { APIRequestContext } from '@playwright/test';
import { cui_getCsrfToken, cui_postForm } from '../../../../utils/api-requests-utils';

export class HearingVideoAppointmentReasonsApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { reasonUnableToJoinVideoCall: string }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'hearing-video-appointment-reasons' });

    await cui_postForm({
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
