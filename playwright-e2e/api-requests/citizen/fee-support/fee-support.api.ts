import { APIRequestContext } from '@playwright/test';
import { getCsrfToken, postForm } from '../../../utils/citizen-user.utils';
import { FeeSupportType } from '../../../types';

export class FeeSupportApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(option: { whetherApplicantHasToPayAFee: FeeSupportType }): Promise<void> {
    const csrfToken = await getCsrfToken({ apiContext: this.apiContext, path: 'fee-support' });

    const feeSupportTypeApiMap: Record<FeeSupportType, string> = {
      'I get asylum support from the Home Office': 'asylumSupportFromHo',
      'I got a fee waiver from the Home Office for my application to stay in the UK': 'feeWaiverFromHo',
      'I am under 18 and get housing or other support from the local authority': 'under18GetSupportFromLocalAuthority',
      'I am the parent, guardian or sponsor of someone under 18 who gets housing or other support from the local authority':
        'parentGetSupportFromLocalAuthority',
      'None of these statements apply to me': 'noneOfTheseStatements',
    };

    const feeSupportTypeApiValue = feeSupportTypeApiMap[option.whetherApplicantHasToPayAFee];
    if (!feeSupportTypeApiValue) {
      throw new Error(`No API mapping defined for fee support type "${option.whetherApplicantHasToPayAFee}"`);
    }

    await postForm({
      apiContext: this.apiContext,
      path: 'fee-support',
      form: {
        _csrf: csrfToken,
        answer: feeSupportTypeApiValue,
        saveAndContinue: '',
      },
    });
  }
}
