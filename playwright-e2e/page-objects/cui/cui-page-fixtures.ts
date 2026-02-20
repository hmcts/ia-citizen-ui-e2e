import { PageFixtures } from '../page.fixtures';
import { UtilsFixtures } from '../../utils';
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

export interface CuiPageFixtures {
  cui_startAppealPage: StartAppealPage;
  cui_appealOverviewPage: AppealOverviewPage;
  cui_aboutAppealPage: AboutAppealPage;
  cui_inTheUkPage: InTheUkPage;
  cui_outOfCountryProtectionDepartureDatePage: OutOfCountryProtectionDepartureDatePage;
  cui_outOfCountryHrEeaPage: OutOfCountryHrEeaPage;
  cui_outOfCountryHrInsidePage: OutOfCountryHrInsidePage;
  cui_appealTypePage: AppealTypePage;
  cui_homeOfficeReferenceNumberPage: HomeOfficeReferenceNumberPage;
  cui_applicantNamePage: ApplicantNamePage;
  cui_applicantDobPage: ApplicantDobPage;
  cui_applicantNationalityPage: ApplicantNationalityPage;
  cui_decisionLetterSentPage: DecisionLetterSentPage;
  cui_decisionLetterReceivedPage: DecisionLetterReceivedPage;
  cui_uploadDecisionLetterPage: UploadDecisionLetterPage;
  cui_deportationOrderPage: DeportationOrderPage;
  cui_contactPreferencesPage: ContactPreferencesPage;
  cui_outOfCountryAddressPage: OutOfCountryAddressPage;
  cui_applicantAddressPage: ApplicantAddressPage;
  cui_selectAddressPage: SelectAddressPage;
  cui_manualAddressPage: ManualAddressPage;
  cui_hasSponsorPage: HasSponsorPage;
  cui_sponsorNamePage: SponsorNamePage;
  cui_sponsorAddressPage: SponsorAddressPage;
  cui_sponsorContactPreferencesPage: SponsorContactPreferencesPage;
  cui_sponsorAuthorisationPage: SponsorAuthorisationPage;
  cui_decisionTypePage: DecisionTypePage;
  cui_payNowPage: PayNowPage;
  cui_equalityAndDiversityStartPage: EqualityAndDiversityStartPage;
  cui_feeSupportPage: FeeSupportPage;
  cui_asylumSupportPage: AsylumSupportPage;
  cui_feeWaiverPage: FeeWaiverPage;
  cui_localAuthorityLetterPage: LocalAuthorityLetterPage;
  cui_helpWithFeesPage: HelpWithFeesPage;
  cui_lateAppealPage: LateAppealPage;
  cui_checkAnswersPage: CheckAnswersPage;
  cui_appealDetailsSentPage: AppealDetailsSentPage;
  cui_paymentDetailsPage: PaymentDetailsPage;
  cui_confirmPaymentDetailsPage: ConfirmPaymentDetailsPage;
  cui_confirmationOfPaymentPage: ConfirmationOfPaymentPage;
  cui_login: (options: { email: string; password: string }) => Promise<void>;
}

/* Instantiates pages and provides page to the test via use()
 * can also contain steps before or after providing the page
 * this is the same behaviour as a beforeEach/afterEach hook
 */
export const cuiPageFixtures = {
  cui_startAppealPage: async ({ determinePage }: PageFixtures, use) => {
    const cui_startAppealPage = new StartAppealPage(determinePage);
    await use(cui_startAppealPage);
  },
  cui_appealOverviewPage: async ({ determinePage }: PageFixtures, use) => {
    const cui_appealOverviewPage = new AppealOverviewPage(determinePage);
    await use(cui_appealOverviewPage);
  },
  cui_aboutAppealPage: async ({ determinePage }: PageFixtures, use) => {
    const cui_aboutAppealPage = new AboutAppealPage(determinePage);
    await use(cui_aboutAppealPage);
  },
  cui_inTheUkPage: async ({ determinePage }: PageFixtures, use) => {
    const cui_inTheUkPage = new InTheUkPage(determinePage);
    await use(cui_inTheUkPage);
  },
  cui_outOfCountryProtectionDepartureDatePage: async ({ determinePage }: PageFixtures, use) => {
    const cui_outOfCountryProtectionDepartureDatePage = new OutOfCountryProtectionDepartureDatePage(determinePage);
    await use(cui_outOfCountryProtectionDepartureDatePage);
  },
  cui_outOfCountryHrEeaPage: async ({ determinePage }: PageFixtures, use) => {
    const cui_outOfCountryHrEeaPage = new OutOfCountryHrEeaPage(determinePage);
    await use(cui_outOfCountryHrEeaPage);
  },
  cui_outOfCountryHrInsidePage: async ({ determinePage }: PageFixtures, use) => {
    const cui_outOfCountryHrInsidePage = new OutOfCountryHrInsidePage(determinePage);
    await use(cui_outOfCountryHrInsidePage);
  },
  cui_appealTypePage: async ({ determinePage }: PageFixtures, use) => {
    const cui_appealTypePage = new AppealTypePage(determinePage);
    await use(cui_appealTypePage);
  },
  cui_homeOfficeReferenceNumberPage: async ({ determinePage }: PageFixtures, use) => {
    const cui_homeOfficeReferenceNumberPage = new HomeOfficeReferenceNumberPage(determinePage);
    await use(cui_homeOfficeReferenceNumberPage);
  },
  cui_applicantNamePage: async ({ determinePage }: PageFixtures, use) => {
    const cui_applicantNamePage = new ApplicantNamePage(determinePage);
    await use(cui_applicantNamePage);
  },
  cui_applicantDobPage: async ({ determinePage }: PageFixtures, use) => {
    const cui_applicantDobPage = new ApplicantDobPage(determinePage);
    await use(cui_applicantDobPage);
  },
  cui_applicantNationalityPage: async ({ determinePage }: PageFixtures, use) => {
    const cui_applicantNationalityPage = new ApplicantNationalityPage(determinePage);
    await use(cui_applicantNationalityPage);
  },
  cui_decisionLetterSentPage: async ({ determinePage }: PageFixtures, use) => {
    const cui_decisionLetterSentPage = new DecisionLetterSentPage(determinePage);
    await use(cui_decisionLetterSentPage);
  },
  cui_decisionLetterReceivedPage: async ({ determinePage }: PageFixtures, use) => {
    const cui_decisionLetterReceivedPage = new DecisionLetterReceivedPage(determinePage);
    await use(cui_decisionLetterReceivedPage);
  },
  cui_uploadDecisionLetterPage: async ({ determinePage }: PageFixtures, use) => {
    const cui_uploadDecisionLetterPage = new UploadDecisionLetterPage(determinePage);
    await use(cui_uploadDecisionLetterPage);
  },
  cui_deportationOrderPage: async ({ determinePage }: PageFixtures, use) => {
    const cui_deportationOrderPage = new DeportationOrderPage(determinePage);
    await use(cui_deportationOrderPage);
  },
  cui_contactPreferencesPage: async ({ determinePage }: PageFixtures, use) => {
    const cui_contactPreferencesPage = new ContactPreferencesPage(determinePage);
    await use(cui_contactPreferencesPage);
  },
  cui_outOfCountryAddressPage: async ({ determinePage }: PageFixtures, use) => {
    const cui_outOfCountryAddressPage = new OutOfCountryAddressPage(determinePage);
    await use(cui_outOfCountryAddressPage);
  },
  cui_applicantAddressPage: async ({ determinePage }: PageFixtures, use) => {
    const cui_applicantAddressPage = new ApplicantAddressPage(determinePage);
    await use(cui_applicantAddressPage);
  },
  cui_selectAddressPage: async ({ determinePage }: PageFixtures, use) => {
    const cui_selectAddressPage = new SelectAddressPage(determinePage);
    await use(cui_selectAddressPage);
  },
  cui_manualAddressPage: async ({ determinePage }: PageFixtures, use) => {
    const cui_manualAddressPage = new ManualAddressPage(determinePage);
    await use(cui_manualAddressPage);
  },
  cui_hasSponsorPage: async ({ determinePage }: PageFixtures, use) => {
    const cui_hasSponsorPage = new HasSponsorPage(determinePage);
    await use(cui_hasSponsorPage);
  },
  cui_sponsorNamePage: async ({ determinePage }: PageFixtures, use) => {
    const cui_sponsorNamePage = new SponsorNamePage(determinePage);
    await use(cui_sponsorNamePage);
  },
  cui_sponsorAddressPage: async ({ determinePage }: PageFixtures, use) => {
    const cui_sponsorAddressPage = new SponsorAddressPage(determinePage);
    await use(cui_sponsorAddressPage);
  },
  cui_sponsorContactPreferencesPage: async ({ determinePage }: PageFixtures, use) => {
    const cui_sponsorContactPreferencesPage = new SponsorContactPreferencesPage(determinePage);
    await use(cui_sponsorContactPreferencesPage);
  },
  cui_sponsorAuthorisationPage: async ({ determinePage }: PageFixtures, use) => {
    const cui_sponsorAuthorisationPage = new SponsorAuthorisationPage(determinePage);
    await use(cui_sponsorAuthorisationPage);
  },
  cui_decisionTypePage: async ({ determinePage }: PageFixtures, use) => {
    const cui_decisionTypePage = new DecisionTypePage(determinePage);
    await use(cui_decisionTypePage);
  },
  cui_payNowPage: async ({ determinePage }: PageFixtures, use) => {
    const cui_payNowPage = new PayNowPage(determinePage);
    await use(cui_payNowPage);
  },
  cui_equalityAndDiversityStartPage: async ({ determinePage }: PageFixtures, use) => {
    const cui_equalityAndDiversityStartPage = new EqualityAndDiversityStartPage(determinePage);
    await use(cui_equalityAndDiversityStartPage);
  },
  cui_feeSupportPage: async ({ determinePage }: PageFixtures, use) => {
    const cui_feeSupportPage = new FeeSupportPage(determinePage);
    await use(cui_feeSupportPage);
  },
  cui_asylumSupportPage: async ({ determinePage }: PageFixtures, use) => {
    const cui_asylumSupportPage = new AsylumSupportPage(determinePage);
    await use(cui_asylumSupportPage);
  },
  cui_feeWaiverPage: async ({ determinePage }: PageFixtures, use) => {
    const cui_feeWaiverPage = new FeeWaiverPage(determinePage);
    await use(cui_feeWaiverPage);
  },
  cui_localAuthorityLetterPage: async ({ determinePage }: PageFixtures, use) => {
    const cui_localAuthorityLetterPage = new LocalAuthorityLetterPage(determinePage);
    await use(cui_localAuthorityLetterPage);
  },
  cui_helpWithFeesPage: async ({ determinePage }: PageFixtures, use) => {
    const cui_helpWithFeesPage = new HelpWithFeesPage(determinePage);
    await use(cui_helpWithFeesPage);
  },
  cui_lateAppealPage: async ({ determinePage }: PageFixtures, use) => {
    const cui_lateAppealPage = new LateAppealPage(determinePage);
    await use(cui_lateAppealPage);
  },
  cui_checkAnswersPage: async ({ determinePage }: PageFixtures, use) => {
    const cui_checkAnswersPage = new CheckAnswersPage(determinePage);
    await use(cui_checkAnswersPage);
  },
  cui_appealDetailsSentPage: async ({ determinePage }: PageFixtures, use) => {
    const cui_appealDetailsSentPage = new AppealDetailsSentPage(determinePage);
    await use(cui_appealDetailsSentPage);
  },
  cui_paymentDetailsPage: async ({ determinePage }: PageFixtures, use) => {
    const cui_paymentDetailsPage = new PaymentDetailsPage(determinePage);
    await use(cui_paymentDetailsPage);
  },
  cui_confirmPaymentDetailsPage: async ({ determinePage }: PageFixtures, use) => {
    const cui_confirmPaymentDetailsPage = new ConfirmPaymentDetailsPage(determinePage);
    await use(cui_confirmPaymentDetailsPage);
  },
  cui_confirmationOfPaymentPage: async ({ determinePage }: PageFixtures, use) => {
    const cui_confirmationOfPaymentPage = new ConfirmationOfPaymentPage(determinePage);
    await use(cui_confirmationOfPaymentPage);
  },
  cui_login: async ({ cui_startAppealPage, idam_signInPage, cui_appealOverviewPage }: PageFixtures & UtilsFixtures, use) => {
    await use(async (options: { email: string; password: string }) => {
      await cui_startAppealPage.goTo();
      await cui_startAppealPage.verifyUserIsOnPage();
      await cui_startAppealPage.navigationClick(cui_startAppealPage.$interactive.signInLink);

      await idam_signInPage.verifyUserIsOnPage();
      await idam_signInPage.signIn(options.email, options.password);

      await cui_appealOverviewPage.verifyUserIsOnPage();
    });
  },
};
