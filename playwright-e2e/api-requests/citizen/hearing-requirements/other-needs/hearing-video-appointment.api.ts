import { APIRequestContext } from '@playwright/test';
import { YesOrNoType } from '../../../../citizen-types';
import { cui_getCsrfToken, cui_postForm } from '../../../../utils/api-requests-utils';

export class HearingVideoAppointmentApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { areYouAbleToJoinHearingViaVideoCall: YesOrNoType }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({ apiContext: this.apiContext, path: 'hearing-video-appointment' });

    await cui_postForm({
      apiContext: this.apiContext,
      path: 'hearing-video-appointment',
      form: {
        _csrf: csrfToken,
        answer: option.areYouAbleToJoinHearingViaVideoCall.toLowerCase(),
        saveAndContinue: '',
      },
    });
  }
}
