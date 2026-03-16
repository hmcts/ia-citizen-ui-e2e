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
  NewAppealCheckAnswersPage,
  AppealDetailsSentPage,
  PaymentDetailsPage,
  ConfirmPaymentDetailsPage,
  ConfirmationOfPaymentPage,
  HomeOfficeDecisionWrongPage,
  SupportingEvidencePage,
  ProvideSupportingEvidencePage,
  AppealReasonsCheckAnswersPage,
  AppealReasonsAnswerSentPage,
  AskForMoreTimePage,
  SupportingEvidenceMoreTimePage,
  ProvideSupportingEvidenceMoreTimePage,
  RequestMoreTimeSentPage,
  HearingNeedsPage,
  HearingWitnessesPage,
  HearingWitnessNamesPage,
  HearingOutsideUKPage,
  HearingAccessNeedsPage,
  HearingInterpreterPage,
  HearingInterpreterSupportAppellantWitnessesPage,
  HearingInterpreterTypesPage,
  HearingInterpreterSpokenLanguageSelectionPage,
  HearingInterpreterSignLanguageSelectionPage,
  HearingInterpreterTypesWitnessPage,
  HearingInterpreterSpokenLanguageSelectionWitnessPage,
  HearingInterpreterSignLanguageSelectionWitnessPage,
  HearingStepFreeAccessPage,
  HearingLoopPage,
  HearingOtherNeedsPage,
  HearingVideoAppointmentPage,
  HearingVideoAppointmentReasonsPage,
  HearingMultimediaEvidencePage,
  HearingMultimediaEvidenceEquipmentPage,
  HearingMultimediaEvidenceEquipmentReasonsPage,
  HearingSingleSexPage,
  HearingSingleSexTypePage,
  HearingSingleSexTypeMalePage,
  HearingSingleSexTypeFemalePage,
  HearingPrivatePage,
  HearingPrivateReasonPage,
  HearingPhysicalMentalHealthPage,
  HearingPhysicalMentalHealthReasonsPage,
  HearingPastExperiencesPage,
  HearingAnythingElseReasonsPage,
  HearingAnythingElsePage,
  HearingPastExperiencesReasonsPage,
  HearingDatesAvoidPage,
  HearingDatesAvoidEnterPage,
  HearingDatesAvoidReasonsPage,
  HearingCheckAnswersPage,
  HearingSuccessPage,
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
  public readonly newAppealCheckAnswersPage: NewAppealCheckAnswersPage;
  public readonly appealDetailsSentPage: AppealDetailsSentPage;
  public readonly paymentDetailsPage: PaymentDetailsPage;
  public readonly confirmPaymentDetailsPage: ConfirmPaymentDetailsPage;
  public readonly confirmationOfPaymentPage: ConfirmationOfPaymentPage;
  public readonly homeOfficeDecisionWrongPage: HomeOfficeDecisionWrongPage;
  public readonly supportingEvidencePage: SupportingEvidencePage;
  public readonly provideSupportingEvidencePage: ProvideSupportingEvidencePage;
  public readonly appealReasonsCheckAnswersPage: AppealReasonsCheckAnswersPage;
  public readonly appealReasonsAnswerSentPage: AppealReasonsAnswerSentPage;
  public readonly askForMoreTimePage: AskForMoreTimePage;
  public readonly supportingEvidenceMoreTimePage: SupportingEvidenceMoreTimePage;
  public readonly provideSupportingEvidenceMoreTimePage: ProvideSupportingEvidenceMoreTimePage;
  public readonly requestMoreTimeSentPage: RequestMoreTimeSentPage;
  public readonly hearingNeedsPage: HearingNeedsPage;
  public readonly hearingWitnessesPage: HearingWitnessesPage;
  public readonly hearingWitnessNamesPage: HearingWitnessNamesPage;
  public readonly hearingOutsideUKPage: HearingOutsideUKPage;
  public readonly hearingAccessNeedsPage: HearingAccessNeedsPage;
  public readonly hearingInterpreterPage: HearingInterpreterPage;
  public readonly hearingInterpreterSupportAppellantWitnessesPage: HearingInterpreterSupportAppellantWitnessesPage;
  public readonly hearingInterpreterTypesPage: HearingInterpreterTypesPage;
  public readonly hearingInterpreterSpokenLanguageSelectionPage: HearingInterpreterSpokenLanguageSelectionPage;
  public readonly hearingInterpreterSignLanguageSelectionPage: HearingInterpreterSignLanguageSelectionPage;
  public readonly hearingInterpreterTypesWitnessPage: HearingInterpreterTypesWitnessPage;
  public readonly hearingInterpreterSpokenLanguageSelectionWitnessPage: HearingInterpreterSpokenLanguageSelectionWitnessPage;
  public readonly hearingInterpreterSignLanguageSelectionWitnessPage: HearingInterpreterSignLanguageSelectionWitnessPage;
  public readonly hearingStepFreeAccessPage: HearingStepFreeAccessPage;
  public readonly hearingLoopPage: HearingLoopPage;
  public readonly hearingOtherNeedsPage: HearingOtherNeedsPage;
  public readonly hearingVideoAppointmentPage: HearingVideoAppointmentPage;
  public readonly hearingVideoAppointmentReasonsPage: HearingVideoAppointmentReasonsPage;
  public readonly hearingMultimediaEvidencePage: HearingMultimediaEvidencePage;
  public readonly hearingMultimediaEvidenceEquipmentPage: HearingMultimediaEvidenceEquipmentPage;
  public readonly hearingMultimediaEvidenceEquipmentReasonsPage: HearingMultimediaEvidenceEquipmentReasonsPage;
  public readonly hearingSingleSexPage: HearingSingleSexPage;
  public readonly hearingSingleSexTypePage: HearingSingleSexTypePage;
  public readonly hearingSingleSexTypeMalePage: HearingSingleSexTypeMalePage;
  public readonly hearingSingleSexTypeFemalePage: HearingSingleSexTypeFemalePage;
  public readonly hearingPrivatePage: HearingPrivatePage;
  public readonly hearingPrivateReasonPage: HearingPrivateReasonPage;
  public readonly hearingPhysicalMentalHealthPage: HearingPhysicalMentalHealthPage;
  public readonly hearingPhysicalMentalHealthReasonsPage: HearingPhysicalMentalHealthReasonsPage;
  public readonly hearingPastExperiencesPage: HearingPastExperiencesPage;
  public readonly hearingAnythingElsePage: HearingAnythingElsePage;
  public readonly hearingAnythingElseReasonsPage: HearingAnythingElseReasonsPage;
  public readonly hearingPastExperiencesReasonsPage: HearingPastExperiencesReasonsPage;
  public readonly hearingDatesAvoidPage: HearingDatesAvoidPage;
  public readonly hearingDatesAvoidEnterPage: HearingDatesAvoidEnterPage;
  public readonly hearingDatesAvoidReasonsPage: HearingDatesAvoidReasonsPage;
  public readonly hearingCheckAnswersPage: HearingCheckAnswersPage;
  public readonly hearingSuccessPage: HearingSuccessPage;

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
    this.newAppealCheckAnswersPage = new NewAppealCheckAnswersPage(page);
    this.appealDetailsSentPage = new AppealDetailsSentPage(page);
    this.paymentDetailsPage = new PaymentDetailsPage(page);
    this.confirmPaymentDetailsPage = new ConfirmPaymentDetailsPage(page);
    this.confirmationOfPaymentPage = new ConfirmationOfPaymentPage(page);
    this.homeOfficeDecisionWrongPage = new HomeOfficeDecisionWrongPage(page);
    this.supportingEvidencePage = new SupportingEvidencePage(page);
    this.provideSupportingEvidencePage = new ProvideSupportingEvidencePage(page);
    this.appealReasonsCheckAnswersPage = new AppealReasonsCheckAnswersPage(page);
    this.appealReasonsAnswerSentPage = new AppealReasonsAnswerSentPage(page);
    this.askForMoreTimePage = new AskForMoreTimePage(page);
    this.supportingEvidenceMoreTimePage = new SupportingEvidenceMoreTimePage(page);
    this.provideSupportingEvidenceMoreTimePage = new ProvideSupportingEvidenceMoreTimePage(page);
    this.requestMoreTimeSentPage = new RequestMoreTimeSentPage(page);
    this.hearingNeedsPage = new HearingNeedsPage(page);
    this.hearingWitnessesPage = new HearingWitnessesPage(page);
    this.hearingWitnessNamesPage = new HearingWitnessNamesPage(page);
    this.hearingOutsideUKPage = new HearingOutsideUKPage(page);
    this.hearingAccessNeedsPage = new HearingAccessNeedsPage(page);
    this.hearingInterpreterPage = new HearingInterpreterPage(page);
    this.hearingInterpreterSupportAppellantWitnessesPage = new HearingInterpreterSupportAppellantWitnessesPage(page);
    this.hearingInterpreterTypesPage = new HearingInterpreterTypesPage(page);
    this.hearingInterpreterSpokenLanguageSelectionPage = new HearingInterpreterSpokenLanguageSelectionPage(page);
    this.hearingInterpreterSignLanguageSelectionPage = new HearingInterpreterSignLanguageSelectionPage(page);
    this.hearingInterpreterTypesWitnessPage = new HearingInterpreterTypesWitnessPage(page);
    this.hearingInterpreterSpokenLanguageSelectionWitnessPage = new HearingInterpreterSpokenLanguageSelectionWitnessPage(page);
    this.hearingInterpreterSignLanguageSelectionWitnessPage = new HearingInterpreterSignLanguageSelectionWitnessPage(page);
    this.hearingStepFreeAccessPage = new HearingStepFreeAccessPage(page);
    this.hearingLoopPage = new HearingLoopPage(page);
    this.hearingOtherNeedsPage = new HearingOtherNeedsPage(page);
    this.hearingVideoAppointmentPage = new HearingVideoAppointmentPage(page);
    this.hearingVideoAppointmentReasonsPage = new HearingVideoAppointmentReasonsPage(page);
    this.hearingMultimediaEvidencePage = new HearingMultimediaEvidencePage(page);
    this.hearingMultimediaEvidenceEquipmentPage = new HearingMultimediaEvidenceEquipmentPage(page);
    this.hearingMultimediaEvidenceEquipmentReasonsPage = new HearingMultimediaEvidenceEquipmentReasonsPage(page);
    this.hearingSingleSexPage = new HearingSingleSexPage(page);
    this.hearingSingleSexTypePage = new HearingSingleSexTypePage(page);
    this.hearingSingleSexTypeMalePage = new HearingSingleSexTypeMalePage(page);
    this.hearingSingleSexTypeFemalePage = new HearingSingleSexTypeFemalePage(page);
    this.hearingPrivatePage = new HearingPrivatePage(page);
    this.hearingPrivateReasonPage = new HearingPrivateReasonPage(page);
    this.hearingPhysicalMentalHealthPage = new HearingPhysicalMentalHealthPage(page);
    this.hearingPhysicalMentalHealthReasonsPage = new HearingPhysicalMentalHealthReasonsPage(page);
    this.hearingPastExperiencesPage = new HearingPastExperiencesPage(page);
    this.hearingAnythingElsePage = new HearingAnythingElsePage(page);
    this.hearingAnythingElseReasonsPage = new HearingAnythingElseReasonsPage(page);
    this.hearingPastExperiencesReasonsPage = new HearingPastExperiencesReasonsPage(page);
    this.hearingDatesAvoidPage = new HearingDatesAvoidPage(page);
    this.hearingDatesAvoidEnterPage = new HearingDatesAvoidEnterPage(page);
    this.hearingDatesAvoidReasonsPage = new HearingDatesAvoidReasonsPage(page);
    this.hearingCheckAnswersPage = new HearingCheckAnswersPage(page);
    this.hearingSuccessPage = new HearingSuccessPage(page);
  }

  /**
   * Creates a new CuiPages instance bound to another browser context or tab.
   * Allows multi-tab testing.
   */
  public async newBrowserContext(options: { pageContext: Page }): Promise<CuiPages> {
    return new CuiPages(options.pageContext);
  }
}
