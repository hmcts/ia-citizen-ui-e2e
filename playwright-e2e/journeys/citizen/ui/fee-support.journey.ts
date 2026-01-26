import { Page } from '@playwright/test';
import { FeeSupportJourney } from '../../../types';
import {
  AboutAppealPage,
  FeeSupportPage,
  HelpWithFeesPage,
  AsylumSupportPage,
  FeeWaiverPage,
  LocalAuthorityLetterPage,
} from '../../../page-objects/cui/pages/index';
import { DataUtils } from '../../../utils';

export class FeeSupportSectionOfAppealJourney {
  constructor(private readonly page: Page) {}
  private cui_aboutAppealPage = new AboutAppealPage(this.page);
  private cui_feeSupportPage = new FeeSupportPage(this.page);
  private cui_helpWithFeesPage = new HelpWithFeesPage(this.page);
  private cui_asylumSupportPage = new AsylumSupportPage(this.page);
  private cui_feeWaiverPage = new FeeWaiverPage(this.page);
  private cui_localAuthorityLetterPage = new LocalAuthorityLetterPage(this.page);
  private dataUtils = new DataUtils();

  public async complete(appealData: FeeSupportJourney): Promise<void> {
    await this.cui_aboutAppealPage.verifyUserIsOnAboutAppealPage();
    await this.cui_aboutAppealPage.navigationClick(this.cui_aboutAppealPage.$interactive.supportToPayTheFeeLink);

    await this.cui_feeSupportPage.verifyUserIsOnFeeSupportPage();
    await this.cui_feeSupportPage.completePageAndContinue({ whetherApplicantHasToPayAFee: appealData.whetherApplicantHasToPayAFee });

    switch (appealData.whetherApplicantHasToPayAFee) {
      case 'I get asylum support from the Home Office':
        const asylumSupportRefNumber = await this.dataUtils.generateRandomNumber({ digitLength: 10 });
        await this.cui_asylumSupportPage.verifyUserIsOnAsylumSupportPage();
        await this.cui_asylumSupportPage.completePageAndContinue({ asylumSupportRefNumber: asylumSupportRefNumber });
        break;
      case 'I got a fee waiver from the Home Office for my application to stay in the UK':
        await this.cui_feeWaiverPage.verifyUserIsOnFeeWaiverPage();
        await this.cui_feeWaiverPage.navigationClick(this.cui_feeWaiverPage.$interactive.continueButton);
        break;
      case 'I am under 18 and get housing or other support from the local authority':
        await this.cui_localAuthorityLetterPage.verifyUserIsOnLocalAuthorityLetterPage();
        await this.cui_localAuthorityLetterPage.completePageAndContinue({});
        break;
      case 'I am the parent, guardian or sponsor of someone under 18 who gets housing or other support from the local authority':
        await this.cui_localAuthorityLetterPage.verifyUserIsOnLocalAuthorityLetterPage();
        await this.cui_localAuthorityLetterPage.completePageAndContinue({});
        break;
      case 'None of these statements apply to me':
        await this.cui_helpWithFeesPage.verifyUserIsOnHelpWithTheFeesPage();
        await this.cui_helpWithFeesPage.completePageAndContinue({ helpWithFees: 'willPayForAppeal' });
        break;
      default:
        throw new Error(`Unhandled Fee Support Type: ${appealData.whetherApplicantHasToPayAFee}`);
    }

    await this.cui_aboutAppealPage.verifyUserIsOnAboutAppealPage();
  }
}
