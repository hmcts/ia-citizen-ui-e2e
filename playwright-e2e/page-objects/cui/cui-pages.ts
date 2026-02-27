import { Page } from '@playwright/test';

import {
  StartAppealPage,
  AppealOverviewPage,
  AboutAppealPage,
  InTheUkPage,
  OutOfCountryProtectionDepartureDatePage,
  OutOfCountryHrEeaPage,
  OutOfCountryHrInsidePage,
  AppealTypePage,
  HomeOfficeReferenceNumberPage,
  ApplicantNamePage,
  ApplicantDobPage,
  ApplicantNationalityPage,
  DecisionLetterSentPage,
  DecisionLetterReceivedPage,
  UploadDecisionLetterPage,
  DeportationOrderPage,
  ContactPreferencesPage,
  OutOfCountryAddressPage,
  ApplicantAddressPage,
  SelectAddressPage,
  ManualAddressPage,
  HasSponsorPage,
  SponsorNamePage,
  SponsorAddressPage,
  SponsorContactPreferencesPage,
  SponsorAuthorisationPage,
  DecisionTypePage,
  PayNowPage,
  EqualityAndDiversityStartPage,
  FeeSupportPage,
  AsylumSupportPage,
  FeeWaiverPage,
  LocalAuthorityLetterPage,
  HelpWithFeesPage,
  LateAppealPage,
  CheckAnswersPage,
  AppealDetailsSentPage,
  PaymentDetailsPage,
  ConfirmPaymentDetailsPage,
  ConfirmationOfPaymentPage,
} from './pages/index';

export class CuiPages {
  private readonly page: Page;

  public readonly startAppealPage: StartAppealPage;
  public readonly appealOverviewPage: AppealOverviewPage;
  public readonly aboutAppealPage: AboutAppealPage;
  public readonly inTheUkPage: InTheUkPage;
  public readonly outOfCountryProtectionDepartureDatePage: OutOfCountryProtectionDepartureDatePage;
  public readonly outOfCountryHrEeaPage: OutOfCountryHrEeaPage;
  public readonly outOfCountryHrInsidePage: OutOfCountryHrInsidePage;
  public readonly appealTypePage: AppealTypePage;
  public readonly homeOfficeReferenceNumberPage: HomeOfficeReferenceNumberPage;
  public readonly applicantNamePage: ApplicantNamePage;
  public readonly applicantDobPage: ApplicantDobPage;
  public readonly applicantNationalityPage: ApplicantNationalityPage;
  public readonly decisionLetterSentPage: DecisionLetterSentPage;
  public readonly decisionLetterReceivedPage: DecisionLetterReceivedPage;
  public readonly uploadDecisionLetterPage: UploadDecisionLetterPage;
  public readonly deportationOrderPage: DeportationOrderPage;
  public readonly contactPreferencesPage: ContactPreferencesPage;
  public readonly outOfCountryAddressPage: OutOfCountryAddressPage;
  public readonly applicantAddressPage: ApplicantAddressPage;
  public readonly selectAddressPage: SelectAddressPage;
  public readonly manualAddressPage: ManualAddressPage;
  public readonly hasSponsorPage: HasSponsorPage;
  public readonly sponsorNamePage: SponsorNamePage;
  public readonly sponsorAddressPage: SponsorAddressPage;
  public readonly sponsorContactPreferencesPage: SponsorContactPreferencesPage;
  public readonly sponsorAuthorisationPage: SponsorAuthorisationPage;
  public readonly decisionTypePage: DecisionTypePage;
  public readonly payNowPage: PayNowPage;
  public readonly equalityAndDiversityStartPage: EqualityAndDiversityStartPage;
  public readonly feeSupportPage: FeeSupportPage;
  public readonly asylumSupportPage: AsylumSupportPage;
  public readonly feeWaiverPage: FeeWaiverPage;
  public readonly localAuthorityLetterPage: LocalAuthorityLetterPage;
  public readonly helpWithFeesPage: HelpWithFeesPage;
  public readonly lateAppealPage: LateAppealPage;
  public readonly checkAnswersPage: CheckAnswersPage;
  public readonly appealDetailsSentPage: AppealDetailsSentPage;
  public readonly paymentDetailsPage: PaymentDetailsPage;
  public readonly confirmPaymentDetailsPage: ConfirmPaymentDetailsPage;
  public readonly confirmationOfPaymentPage: ConfirmationOfPaymentPage;

  constructor(page: Page) {
    this.page = page;

    this.startAppealPage = new StartAppealPage(page);
    this.appealOverviewPage = new AppealOverviewPage(page);
    this.aboutAppealPage = new AboutAppealPage(page);
    this.inTheUkPage = new InTheUkPage(page);
    this.outOfCountryProtectionDepartureDatePage = new OutOfCountryProtectionDepartureDatePage(page);
    this.outOfCountryHrEeaPage = new OutOfCountryHrEeaPage(page);
    this.outOfCountryHrInsidePage = new OutOfCountryHrInsidePage(page);
    this.appealTypePage = new AppealTypePage(page);
    this.homeOfficeReferenceNumberPage = new HomeOfficeReferenceNumberPage(page);
    this.applicantNamePage = new ApplicantNamePage(page);
    this.applicantDobPage = new ApplicantDobPage(page);
    this.applicantNationalityPage = new ApplicantNationalityPage(page);
    this.decisionLetterSentPage = new DecisionLetterSentPage(page);
    this.decisionLetterReceivedPage = new DecisionLetterReceivedPage(page);
    this.uploadDecisionLetterPage = new UploadDecisionLetterPage(page);
    this.deportationOrderPage = new DeportationOrderPage(page);
    this.contactPreferencesPage = new ContactPreferencesPage(page);
    this.outOfCountryAddressPage = new OutOfCountryAddressPage(page);
    this.applicantAddressPage = new ApplicantAddressPage(page);
    this.selectAddressPage = new SelectAddressPage(page);
    this.manualAddressPage = new ManualAddressPage(page);
    this.hasSponsorPage = new HasSponsorPage(page);
    this.sponsorNamePage = new SponsorNamePage(page);
    this.sponsorAddressPage = new SponsorAddressPage(page);
    this.sponsorContactPreferencesPage = new SponsorContactPreferencesPage(page);
    this.sponsorAuthorisationPage = new SponsorAuthorisationPage(page);
    this.decisionTypePage = new DecisionTypePage(page);
    this.payNowPage = new PayNowPage(page);
    this.equalityAndDiversityStartPage = new EqualityAndDiversityStartPage(page);
    this.feeSupportPage = new FeeSupportPage(page);
    this.asylumSupportPage = new AsylumSupportPage(page);
    this.feeWaiverPage = new FeeWaiverPage(page);
    this.localAuthorityLetterPage = new LocalAuthorityLetterPage(page);
    this.helpWithFeesPage = new HelpWithFeesPage(page);
    this.lateAppealPage = new LateAppealPage(page);
    this.checkAnswersPage = new CheckAnswersPage(page);
    this.appealDetailsSentPage = new AppealDetailsSentPage(page);
    this.paymentDetailsPage = new PaymentDetailsPage(page);
    this.confirmPaymentDetailsPage = new ConfirmPaymentDetailsPage(page);
    this.confirmationOfPaymentPage = new ConfirmationOfPaymentPage(page);
  }

  /**
   * Creates a new CuiPages instance bound to another browser context or tab.
   * Allows multi-tab testing.
   */
  public async newBrowserContext(options: { pageContext: Page }): Promise<CuiPages> {
    return new CuiPages(options.pageContext);
  }
}
