import { APIRequestContext } from '@playwright/test';
import { FeeSupportJourney } from '../../../../citizen-types';
import { FeeSupportApi, AsylumSupportApi, FeeWaiverApi, LocalAuthorityLetterApi, HelpWithFeesApi } from '../../../../api-requests/citizen/index';
import { DataUtils } from '../../../../utils/data.utils';

export class FeeSupportUserFlowApi {
  private cui_feeSupportApi: FeeSupportApi;
  private cui_asylumSupportApi: AsylumSupportApi;
  private cui_feeWaiverApi: FeeWaiverApi;
  private cui_localAuthorityLetterApi: LocalAuthorityLetterApi;
  private cui_helpWithFeesApi: HelpWithFeesApi;
  private dataUtils: DataUtils = new DataUtils();

  constructor(apiContext: APIRequestContext) {
    this.cui_feeSupportApi = new FeeSupportApi(apiContext);
    this.cui_asylumSupportApi = new AsylumSupportApi(apiContext);
    this.cui_feeWaiverApi = new FeeWaiverApi(apiContext);
    this.cui_localAuthorityLetterApi = new LocalAuthorityLetterApi(apiContext);
    this.cui_helpWithFeesApi = new HelpWithFeesApi(apiContext);
  }

  public async submitFeeSupportFlowViaApi(appealData: FeeSupportJourney): Promise<void> {
    await this.cui_feeSupportApi.submitForm({
      whetherApplicantHasToPayAFee: appealData.whetherApplicantHasToPayAFee,
    });

    switch (appealData.whetherApplicantHasToPayAFee) {
      case 'I get asylum support from the Home Office':
        const asylumSupportRefNumber = await this.dataUtils.generateRandomNumber({ digitLength: 10 });
        await this.cui_asylumSupportApi.submitForm({ asylumSupportRefNumber: asylumSupportRefNumber });
        break;
      case 'I got a fee waiver from the Home Office for my application to stay in the UK':
        await this.cui_feeWaiverApi.submitForm();
        break;
      case 'I am under 18 and get housing or other support from the local authority':
        await this.cui_localAuthorityLetterApi.submitForm({});
        break;
      case 'I am the parent, guardian or sponsor of someone under 18 who gets housing or other support from the local authority':
        await this.cui_localAuthorityLetterApi.submitForm({});
        break;
      case 'None of these statements apply to me':
        await this.cui_helpWithFeesApi.submitForm({ helpWithFees: 'willPayForAppeal' });
        break;
      default:
        throw new Error(`Unhandled Fee Support Type: ${appealData.whetherApplicantHasToPayAFee}`);
    }
  }
}
