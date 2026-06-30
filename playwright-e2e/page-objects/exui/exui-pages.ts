import { Page } from '@playwright/test';
import {
  CaseOverviewPage,
  RecordRemissionDecisionPage,
  RecordRemissionDecisionDetailsPage,
  RecordRemissionDecisionSubmitPage,
  RecordRemissionDecisionConfirmPage,
  RequestRespondentEvidencePage,
  RequestRespondentEvidenceSubmitPage,
  RequestRespondentEvidenceConfirmPage,
  UploadHomeOfficeBundlePage,
  UploadHomeOfficeBundleSubmitPage,
  UploadHomeOfficeBundleConfirmPage,
  AipRequestAppealReasonsPage,
  AipRequestAppealReasonsSubmitPage,
  AipRequestAppealReasonsConfirmPage,
  RequestRespondentReviewPage,
  RequestRespondentReviewSubmitPage,
  RequestRespondentReviewConfirmPage,
  UploadHomeOfficeAppealResponseReviewOutcomePage,
  UploadHomeOfficeAppealResponsePage,
  UploadHomeOfficeAppealResponseSubmitPage,
  UploadHomeOfficeAppealResponseConfirmPage,
  ReviewHomeOfficeResponsePage,
  ReviewHomeOfficeResponseSubmitPage,
  ReviewHomeOfficeResponseConfirmPage,
  RequestHearingRequirementsPage,
  ReviewHearingRequirementsPage,
  ReviewHearingRequirementsRemoteHearingPage,
  ReviewHearingRequirementsPersonalVulnerabilitiesPage,
  ReviewHearingRequirementsMultimediaEvidencePage,
  ReviewHearingRequirementsSingleSexCourtPage,
  ReviewHearingRequirementsInCameraCourtPage,
  ReviewHearingRequirementsAddtionalRequirementsPage,
  ReviewHearingRequirementsHearingChannelPage,
  ReviewHearingRequirementsAppealSuitableToFloatPage,
  ReviewHearingRequirementsAdditionalIntructionsPage,
  ReviewHearingRequirementsSubmitPage,
  ReviewHearingRequirementsConfirmPage,
  HearingsPage,
  HearingRequirementsPage,
  HearingFacilitiesPage,
  HearingStagePage,
  HearingAttendancePage,
  HearingVenuePage,
  HearingWelshPage,
  HearingJudgePage,
  HearingPanelPage,
  HearingTimingPage,
  HearingLinkPage,
  HearingAdditionalInstructionsPage,
  HearingCreateEditSummaryPage,
  HearingConfirmationPage,
  ListCasePage,
  ListCaseSubmitPage,
  ListCaseConfirmPage,
  CreateCaseSummaryPage,
  CreateCaseSummarySubmitPage,
  CreateCaseSummaryConfirmPage,
  GenerateHearingBundlePage,
  GenerateHearingBundleConfirmPage,
  StartDecisionAndReasonsPage,
  DecisionAndReasonsStartedAppellantSummaryPage,
  DecisionAndReasonsStartedImmigrationHistoryPage,
  DecisionAndReasonsStartedScheduleOfIssuesPage,
  DecisionAndReasonsStartedSubmitPage,
  DecisionAndReasonsStartedConfirmPage,
  PrepareDecisionAndReasonsAnonymityOrderPage,
  PrepareDecisionAndReasonsLegalRepresentativesPage,
  PrepareDecisionAndReasonsSubmitPage,
  PrepareDecisionAndReasonsConfirmPage,
  CompleteDecisionAndReasonsPage,
  CompleteDecisionAndReasonsUploadDecisionPage,
  CompleteDecisionAndReasonsSubmitPage,
  CompleteDecisionAndReasonsConfirmPage,
  DecideFtpaApplicationPage,
  DecideFtpaApplicationAppellantOutcomeDecisionPage,
  DecideFtpaApplicationDecisionAndReasonsDocumentPage,
  DecideFtpaApplicationAppellantNoticeOfDecisionSetAsidePage,
  DecideFtpaApplicationAppellantDecisionReasonNotesPage,
  DecideFtpaApplicationSubmitPage,
  DecideFtpaApplicationConfirmPage,
  GenerateUpperTribunalBundleSubmitPage,
  GenerateUpperTribunalBundleConfirmPage,
  RequestHomeOfficeDataPage,
  RequestHomeOfficeDataSubmitPage,
  RequestHomeOfficeDataConfirmPage,
  ValidationPage,
} from './pages/index';

export class ExuiPages {
  private readonly page: Page;

  public readonly caseOverviewPage: CaseOverviewPage;
  public readonly recordRemissionDecisionPage: RecordRemissionDecisionPage;
  public readonly recordRemissionDecisionDetailsPage: RecordRemissionDecisionDetailsPage;
  public readonly recordRemissionDecisionSubmitPage: RecordRemissionDecisionSubmitPage;
  public readonly recordRemissionDecisionConfirmPage: RecordRemissionDecisionConfirmPage;
  public readonly requestRespondentEvidencePage: RequestRespondentEvidencePage;
  public readonly requestRespondentEvidenceSubmitPage: RequestRespondentEvidenceSubmitPage;
  public readonly requestRespondentEvidenceConfirmPage: RequestRespondentEvidenceConfirmPage;
  public readonly uploadHomeOfficeBundlePage: UploadHomeOfficeBundlePage;
  public readonly uploadHomeOfficeBundleSubmitPage: UploadHomeOfficeBundleSubmitPage;
  public readonly uploadHomeOfficeBundleConfirmPage: UploadHomeOfficeBundleConfirmPage;
  public readonly aipRequestAppealReasonsPage: AipRequestAppealReasonsPage;
  public readonly aipRequestAppealReasonsSubmitPage: AipRequestAppealReasonsSubmitPage;
  public readonly aipRequestAppealReasonsConfirmPage: AipRequestAppealReasonsConfirmPage;
  public readonly requestRespondentReviewPage: RequestRespondentReviewPage;
  public readonly requestRespondentReviewSubmitPage: RequestRespondentReviewSubmitPage;
  public readonly requestRespondentReviewConfirmPage: RequestRespondentReviewConfirmPage;
  public readonly uploadHomeOfficeAppealResponseReviewOutcomePage: UploadHomeOfficeAppealResponseReviewOutcomePage;
  public readonly uploadHomeOfficeAppealResponsePage: UploadHomeOfficeAppealResponsePage;
  public readonly uploadHomeOfficeAppealResponseSubmitPage: UploadHomeOfficeAppealResponseSubmitPage;
  public readonly uploadHomeOfficeAppealResponseConfirmPage: UploadHomeOfficeAppealResponseConfirmPage;
  public readonly reviewHomeOfficeResponsePage: ReviewHomeOfficeResponsePage;
  public readonly reviewHomeOfficeResponseSubmitPage: ReviewHomeOfficeResponseSubmitPage;
  public readonly reviewHomeOfficeResponseConfirmPage: ReviewHomeOfficeResponseConfirmPage;
  public readonly requestHearingRequirementsPage: RequestHearingRequirementsPage;
  public readonly reviewHearingRequirementsPage: ReviewHearingRequirementsPage;
  public readonly reviewHearingRequirementsRemoteHearingPage: ReviewHearingRequirementsRemoteHearingPage;
  public readonly reviewHearingRequirementsPersonalVulnerabilitiesPage: ReviewHearingRequirementsPersonalVulnerabilitiesPage;
  public readonly reviewHearingRequirementsMultimediaEvidencePage: ReviewHearingRequirementsMultimediaEvidencePage;
  public readonly reviewHearingRequirementsSingleSexCourtPage: ReviewHearingRequirementsSingleSexCourtPage;
  public readonly reviewHearingRequirementsInCameraCourtPage: ReviewHearingRequirementsInCameraCourtPage;
  public readonly reviewHearingRequirementsAddtionalRequirementsPage: ReviewHearingRequirementsAddtionalRequirementsPage;
  public readonly reviewHearingRequirementsHearingChannelPage: ReviewHearingRequirementsHearingChannelPage;
  public readonly reviewHearingRequirementsAppealSuitableToFloatPage: ReviewHearingRequirementsAppealSuitableToFloatPage;
  public readonly reviewHearingRequirementsAdditionalIntructionsPage: ReviewHearingRequirementsAdditionalIntructionsPage;
  public readonly reviewHearingRequirementsSubmitPage: ReviewHearingRequirementsSubmitPage;
  public readonly reviewHearingRequirementsConfirmPage: ReviewHearingRequirementsConfirmPage;
  public readonly hearingsPage: HearingsPage;
  public readonly hearingRequirementsPage: HearingRequirementsPage;
  public readonly hearingFacilitiesPage: HearingFacilitiesPage;
  public readonly hearingStagePage: HearingStagePage;
  public readonly hearingAttendancePage: HearingAttendancePage;
  public readonly hearingVenuePage: HearingVenuePage;
  public readonly hearingWelshPage: HearingWelshPage;
  public readonly hearingJudgePage: HearingJudgePage;
  public readonly hearingPanelPage: HearingPanelPage;
  public readonly hearingTimingPage: HearingTimingPage;
  public readonly hearingLinkPage: HearingLinkPage;
  public readonly hearingAdditionalInstructionsPage: HearingAdditionalInstructionsPage;
  public readonly hearingCreateEditSummaryPage: HearingCreateEditSummaryPage;
  public readonly hearingConfirmationPage: HearingConfirmationPage;
  public readonly listCasePage: ListCasePage;
  public readonly listCaseSubmitPage: ListCaseSubmitPage;
  public readonly listCaseConfirmPage: ListCaseConfirmPage;
  public readonly createCaseSummaryPage: CreateCaseSummaryPage;
  public readonly createCaseSummarySubmitPage: CreateCaseSummarySubmitPage;
  public readonly createCaseSummaryConfirmPage: CreateCaseSummaryConfirmPage;
  public readonly generateHearingBundlePage: GenerateHearingBundlePage;
  public readonly generateHearingBundleConfirmPage: GenerateHearingBundleConfirmPage;
  public readonly startDecisionAndReasonsPage: StartDecisionAndReasonsPage;
  public readonly decisionAndReasonsStartedAppellantSummaryPage: DecisionAndReasonsStartedAppellantSummaryPage;
  public readonly decisionAndReasonsStartedImmigrationHistoryPage: DecisionAndReasonsStartedImmigrationHistoryPage;
  public readonly decisionAndReasonsStartedScheduleOfIssuesPage: DecisionAndReasonsStartedScheduleOfIssuesPage;
  public readonly decisionAndReasonsStartedSubmitPage: DecisionAndReasonsStartedSubmitPage;
  public readonly decisionAndReasonsStartedConfirmPage: DecisionAndReasonsStartedConfirmPage;
  public readonly prepareDecisionAndReasonsAnonymityOrderPage: PrepareDecisionAndReasonsAnonymityOrderPage;
  public readonly prepareDecisionAndReasonsLegalRepresentativesPage: PrepareDecisionAndReasonsLegalRepresentativesPage;
  public readonly prepareDecisionAndReasonsSubmitPage: PrepareDecisionAndReasonsSubmitPage;
  public readonly prepareDecisionAndReasonsConfirmPage: PrepareDecisionAndReasonsConfirmPage;
  public readonly completeDecisionAndReasonsPage: CompleteDecisionAndReasonsPage;
  public readonly completeDecisionAndReasonsUploadDecisionPage: CompleteDecisionAndReasonsUploadDecisionPage;
  public readonly completeDecisionAndReasonsSubmitPage: CompleteDecisionAndReasonsSubmitPage;
  public readonly completeDecisionAndReasonsConfirmPage: CompleteDecisionAndReasonsConfirmPage;
  public readonly decideFtpaApplicationPage: DecideFtpaApplicationPage;
  public readonly decideFtpaApplicationAppellantOutcomeDecisionPage: DecideFtpaApplicationAppellantOutcomeDecisionPage;
  public readonly decideFtpaApplicationDecisionAndReasonsDocumentPage: DecideFtpaApplicationDecisionAndReasonsDocumentPage;
  public readonly decideFtpaApplicationAppellantNoticeOfDecisionSetAsidePage: DecideFtpaApplicationAppellantNoticeOfDecisionSetAsidePage;
  public readonly decideFtpaApplicationAppellantDecisionReasonNotesPage: DecideFtpaApplicationAppellantDecisionReasonNotesPage;
  public readonly decideFtpaApplicationSubmitPage: DecideFtpaApplicationSubmitPage;
  public readonly decideFtpaApplicationConfirmPage: DecideFtpaApplicationConfirmPage;
  public readonly generateUpperTribunalBundleSubmitPage: GenerateUpperTribunalBundleSubmitPage;
  public readonly generateUpperTribunalBundleConfirmPage: GenerateUpperTribunalBundleConfirmPage;
  public readonly requestHomeOfficeDataPage: RequestHomeOfficeDataPage;
  public readonly requestHomeOfficeDataSubmitPage: RequestHomeOfficeDataSubmitPage;
  public readonly requestHomeOfficeDataConfirmPage: RequestHomeOfficeDataConfirmPage;
  public readonly validationPage: ValidationPage;

  constructor(page: Page) {
    this.page = page;
    this.caseOverviewPage = new CaseOverviewPage(this.page);
    this.recordRemissionDecisionPage = new RecordRemissionDecisionPage(this.page);
    this.recordRemissionDecisionDetailsPage = new RecordRemissionDecisionDetailsPage(this.page);
    this.recordRemissionDecisionSubmitPage = new RecordRemissionDecisionSubmitPage(this.page);
    this.recordRemissionDecisionConfirmPage = new RecordRemissionDecisionConfirmPage(this.page);
    this.requestRespondentEvidencePage = new RequestRespondentEvidencePage(this.page);
    this.requestRespondentEvidenceSubmitPage = new RequestRespondentEvidenceSubmitPage(this.page);
    this.requestRespondentEvidenceConfirmPage = new RequestRespondentEvidenceConfirmPage(this.page);
    this.uploadHomeOfficeBundlePage = new UploadHomeOfficeBundlePage(this.page);
    this.uploadHomeOfficeBundleSubmitPage = new UploadHomeOfficeBundleSubmitPage(this.page);
    this.uploadHomeOfficeBundleConfirmPage = new UploadHomeOfficeBundleConfirmPage(this.page);
    this.aipRequestAppealReasonsPage = new AipRequestAppealReasonsPage(this.page);
    this.aipRequestAppealReasonsSubmitPage = new AipRequestAppealReasonsSubmitPage(this.page);
    this.aipRequestAppealReasonsConfirmPage = new AipRequestAppealReasonsConfirmPage(this.page);
    this.requestRespondentReviewPage = new RequestRespondentReviewPage(this.page);
    this.requestRespondentReviewSubmitPage = new RequestRespondentReviewSubmitPage(this.page);
    this.requestRespondentReviewConfirmPage = new RequestRespondentReviewConfirmPage(this.page);
    this.uploadHomeOfficeAppealResponseReviewOutcomePage = new UploadHomeOfficeAppealResponseReviewOutcomePage(this.page);
    this.uploadHomeOfficeAppealResponsePage = new UploadHomeOfficeAppealResponsePage(this.page);
    this.uploadHomeOfficeAppealResponseSubmitPage = new UploadHomeOfficeAppealResponseSubmitPage(this.page);
    this.uploadHomeOfficeAppealResponseConfirmPage = new UploadHomeOfficeAppealResponseConfirmPage(this.page);
    this.reviewHomeOfficeResponsePage = new ReviewHomeOfficeResponsePage(this.page);
    this.reviewHomeOfficeResponseSubmitPage = new ReviewHomeOfficeResponseSubmitPage(this.page);
    this.reviewHomeOfficeResponseConfirmPage = new ReviewHomeOfficeResponseConfirmPage(this.page);
    this.requestHearingRequirementsPage = new RequestHearingRequirementsPage(this.page);
    this.reviewHearingRequirementsPage = new ReviewHearingRequirementsPage(this.page);
    this.reviewHearingRequirementsRemoteHearingPage = new ReviewHearingRequirementsRemoteHearingPage(this.page);
    this.reviewHearingRequirementsPersonalVulnerabilitiesPage = new ReviewHearingRequirementsPersonalVulnerabilitiesPage(this.page);
    this.reviewHearingRequirementsMultimediaEvidencePage = new ReviewHearingRequirementsMultimediaEvidencePage(this.page);
    this.reviewHearingRequirementsSingleSexCourtPage = new ReviewHearingRequirementsSingleSexCourtPage(this.page);
    this.reviewHearingRequirementsInCameraCourtPage = new ReviewHearingRequirementsInCameraCourtPage(this.page);
    this.reviewHearingRequirementsAddtionalRequirementsPage = new ReviewHearingRequirementsAddtionalRequirementsPage(this.page);
    this.reviewHearingRequirementsHearingChannelPage = new ReviewHearingRequirementsHearingChannelPage(this.page);
    this.reviewHearingRequirementsAppealSuitableToFloatPage = new ReviewHearingRequirementsAppealSuitableToFloatPage(this.page);
    this.reviewHearingRequirementsAdditionalIntructionsPage = new ReviewHearingRequirementsAdditionalIntructionsPage(this.page);
    this.reviewHearingRequirementsSubmitPage = new ReviewHearingRequirementsSubmitPage(this.page);
    this.reviewHearingRequirementsConfirmPage = new ReviewHearingRequirementsConfirmPage(this.page);
    this.hearingsPage = new HearingsPage(this.page);
    this.hearingRequirementsPage = new HearingRequirementsPage(this.page);
    this.hearingFacilitiesPage = new HearingFacilitiesPage(this.page);
    this.hearingStagePage = new HearingStagePage(this.page);
    this.hearingAttendancePage = new HearingAttendancePage(this.page);
    this.hearingVenuePage = new HearingVenuePage(this.page);
    this.hearingWelshPage = new HearingWelshPage(this.page);
    this.hearingJudgePage = new HearingJudgePage(this.page);
    this.hearingPanelPage = new HearingPanelPage(this.page);
    this.hearingTimingPage = new HearingTimingPage(this.page);
    this.hearingLinkPage = new HearingLinkPage(this.page);
    this.hearingAdditionalInstructionsPage = new HearingAdditionalInstructionsPage(this.page);
    this.hearingCreateEditSummaryPage = new HearingCreateEditSummaryPage(this.page);
    this.hearingConfirmationPage = new HearingConfirmationPage(this.page);
    this.listCasePage = new ListCasePage(this.page);
    this.listCaseSubmitPage = new ListCaseSubmitPage(this.page);
    this.listCaseConfirmPage = new ListCaseConfirmPage(this.page);
    this.createCaseSummaryPage = new CreateCaseSummaryPage(this.page);
    this.createCaseSummarySubmitPage = new CreateCaseSummarySubmitPage(this.page);
    this.createCaseSummaryConfirmPage = new CreateCaseSummaryConfirmPage(this.page);
    this.generateHearingBundlePage = new GenerateHearingBundlePage(this.page);
    this.generateHearingBundleConfirmPage = new GenerateHearingBundleConfirmPage(this.page);
    this.startDecisionAndReasonsPage = new StartDecisionAndReasonsPage(this.page);
    this.decisionAndReasonsStartedAppellantSummaryPage = new DecisionAndReasonsStartedAppellantSummaryPage(this.page);
    this.decisionAndReasonsStartedImmigrationHistoryPage = new DecisionAndReasonsStartedImmigrationHistoryPage(this.page);
    this.decisionAndReasonsStartedScheduleOfIssuesPage = new DecisionAndReasonsStartedScheduleOfIssuesPage(this.page);
    this.decisionAndReasonsStartedSubmitPage = new DecisionAndReasonsStartedSubmitPage(this.page);
    this.decisionAndReasonsStartedConfirmPage = new DecisionAndReasonsStartedConfirmPage(this.page);
    this.prepareDecisionAndReasonsAnonymityOrderPage = new PrepareDecisionAndReasonsAnonymityOrderPage(this.page);
    this.prepareDecisionAndReasonsLegalRepresentativesPage = new PrepareDecisionAndReasonsLegalRepresentativesPage(this.page);
    this.prepareDecisionAndReasonsSubmitPage = new PrepareDecisionAndReasonsSubmitPage(this.page);
    this.prepareDecisionAndReasonsConfirmPage = new PrepareDecisionAndReasonsConfirmPage(this.page);
    this.completeDecisionAndReasonsPage = new CompleteDecisionAndReasonsPage(this.page);
    this.completeDecisionAndReasonsUploadDecisionPage = new CompleteDecisionAndReasonsUploadDecisionPage(this.page);
    this.completeDecisionAndReasonsSubmitPage = new CompleteDecisionAndReasonsSubmitPage(this.page);
    this.completeDecisionAndReasonsConfirmPage = new CompleteDecisionAndReasonsConfirmPage(this.page);
    this.decideFtpaApplicationPage = new DecideFtpaApplicationPage(this.page);
    this.decideFtpaApplicationAppellantOutcomeDecisionPage = new DecideFtpaApplicationAppellantOutcomeDecisionPage(this.page);
    this.decideFtpaApplicationDecisionAndReasonsDocumentPage = new DecideFtpaApplicationDecisionAndReasonsDocumentPage(this.page);
    this.decideFtpaApplicationAppellantNoticeOfDecisionSetAsidePage = new DecideFtpaApplicationAppellantNoticeOfDecisionSetAsidePage(this.page);
    this.decideFtpaApplicationAppellantDecisionReasonNotesPage = new DecideFtpaApplicationAppellantDecisionReasonNotesPage(this.page);
    this.decideFtpaApplicationSubmitPage = new DecideFtpaApplicationSubmitPage(this.page);
    this.decideFtpaApplicationConfirmPage = new DecideFtpaApplicationConfirmPage(this.page);
    this.generateUpperTribunalBundleSubmitPage = new GenerateUpperTribunalBundleSubmitPage(this.page);
    this.generateUpperTribunalBundleConfirmPage = new GenerateUpperTribunalBundleConfirmPage(this.page);
    this.requestHomeOfficeDataPage = new RequestHomeOfficeDataPage(this.page);
    this.requestHomeOfficeDataSubmitPage = new RequestHomeOfficeDataSubmitPage(this.page);
    this.requestHomeOfficeDataConfirmPage = new RequestHomeOfficeDataConfirmPage(this.page);
    this.validationPage = new ValidationPage(this.page);
  }

  /**
   * Creates a new ExuiPages instance bound to another browser context or tab.
   * Allows multi-tab testing.
   */
  public async newPageContext(options: { pageContext: Page }): Promise<ExuiPages> {
    return new ExuiPages(options.pageContext);
  }
}
