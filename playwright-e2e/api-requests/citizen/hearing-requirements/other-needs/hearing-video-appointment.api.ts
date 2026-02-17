import { APIRequestContext } from '@playwright/test';
import { YesOrNoType } from '../../../../citizen-types';
import { getCsrfToken, postForm } from '../../../../utils/citizen-user.utils';

export class HearingVideoAppointmentApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { areYouAbleToJoinHearingViaVideoCall: YesOrNoType }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'hearing-video-appointment' });

    await postForm({
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
