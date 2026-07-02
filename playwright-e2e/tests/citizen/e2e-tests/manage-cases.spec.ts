import { test, expect } from '../../../fixtures.js';
import { config } from '../../../utils/config.utils.js';

test.describe('Set of tests to verify user is able to carry out events on ExUI manage cases to progress the citizen journey to its end', () => {
  test.use({ storageState: config.exuiUsers.caseOfficer.sessionFile });

  test(
    'Verify user is able to progress citizen journey through to appeal being decided by a judge',
    { tag: ['@e2e'] },
    async ({ cui_apiClient, newBrowserContextAndPage, exui_pages, exui_adminOfficerApiClient, dataUtils }) => {
      test.setTimeout(7 * 60 * 1000);

      const appealDetails = await test.step('Citizen Api: Submit a new appeal with fee remission', async () => {
        const appealDetails = await cui_apiClient.completeAndSubmitNewAppealJourneyViaApi({
          appealType: 'EU Settlement Scheme',
          hasApplicantReceivedADeportationOrder: 'No',
          isApplicantStateless: false,
          nationality: 'Sri Lankan',
          isUserInTheUk: 'Yes',
          doesApplicantHaveASponsor: 'No',
          decisionWithOrWithoutHearing: 'decisionWithHearing',
          isApplicationInTime: true,
          whetherApplicantHasToPayAFee: 'None of these statements apply to me',
          appealSubmissionType: 'Pay Appeal',
        });
        return appealDetails;
      });

      const caseId = await exui_adminOfficerApiClient.fetchCaseId({ homeOfficeReferenceNumber: appealDetails.homeOfficeReference.toString() });

      const caseOfficerExuiPages =
        await test.step('Case Officer: Select request respondent evidence from next steps dropdown and submit event', async () => {
          const caseOfficerExuiPages = exui_pages;
          await caseOfficerExuiPages.caseOverviewPage.goTo({ caseId: caseId });

          await caseOfficerExuiPages.caseOverviewPage.selectEventFromDropdown({ eventToSelect: 'Request respondent evidence' });

          await caseOfficerExuiPages.requestRespondentEvidencePage.verifyUserIsOnPage();
          await caseOfficerExuiPages.requestRespondentEvidencePage.continueOnToNextPage();

          await caseOfficerExuiPages.requestRespondentEvidenceSubmitPage.verifyUserIsOnPage();
          await caseOfficerExuiPages.requestRespondentEvidenceSubmitPage.sendDirection();

          await caseOfficerExuiPages.requestRespondentEvidenceConfirmPage.verifyUserIsOnPage();
          await caseOfficerExuiPages.requestRespondentEvidenceConfirmPage.returnToCaseDetails();

          await caseOfficerExuiPages.caseOverviewPage.verifyUserIsOnPage({});
          await caseOfficerExuiPages.caseOverviewPage.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Request respondent evidence' });

          return caseOfficerExuiPages;
        });

      const homeOfficeUserExuiPages =
        await test.step('Home Office User: Select upload home office bundle from next steps dropdown and submit event', async () => {
          const homeOfficeUserNewBrowserContextAndPage = await newBrowserContextAndPage({ user: 'homeOfficeUser' });
          const homeOfficeUserExuiPages = await exui_pages.newPageContext({ pageContext: homeOfficeUserNewBrowserContextAndPage });

          await homeOfficeUserExuiPages.caseOverviewPage.goTo({ caseId: caseId });

          await homeOfficeUserExuiPages.caseOverviewPage.selectEventFromDropdown({ eventToSelect: 'Upload Home Office bundle' });

          await homeOfficeUserExuiPages.uploadHomeOfficeBundlePage.verifyUserIsOnPage();
          await homeOfficeUserExuiPages.uploadHomeOfficeBundlePage.completePageAndContinue({ description: 'Test upload of Home Office bundle' });

          await homeOfficeUserExuiPages.uploadHomeOfficeBundleSubmitPage.verifyUserIsOnPage();
          await homeOfficeUserExuiPages.uploadHomeOfficeBundleSubmitPage.submitEvent();

          await homeOfficeUserExuiPages.uploadHomeOfficeBundleConfirmPage.verifyUserIsOnPage();
          await homeOfficeUserExuiPages.uploadHomeOfficeBundleConfirmPage.returnToCaseDetails();

          await homeOfficeUserExuiPages.caseOverviewPage.verifyUserIsOnPage({});
          await homeOfficeUserExuiPages.caseOverviewPage.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Upload Home Office bundle' });

          return homeOfficeUserExuiPages;
        });

      await test.step('Case Officer: Refresh application overview page until expected next steps has been shown', async () => {
        await caseOfficerExuiPages.caseOverviewPage.page.bringToFront();
        await caseOfficerExuiPages.caseOverviewPage.refreshPageUntilExpectedTextIsVisible({
          expectedText: 'The respondent has submitted their evidence.',
          caseId: caseId,
        });
      });

      await test.step('Case Officer: Select Aip - request appeal reasons from next step dropdown and submit event', async () => {
        await caseOfficerExuiPages.caseOverviewPage.selectEventFromDropdown({ eventToSelect: 'AiP - Request Appeal Reasons' });

        await caseOfficerExuiPages.aipRequestAppealReasonsPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.aipRequestAppealReasonsPage.continueOnToNextPage();

        await caseOfficerExuiPages.aipRequestAppealReasonsSubmitPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.aipRequestAppealReasonsSubmitPage.sendDirection();

        await caseOfficerExuiPages.aipRequestAppealReasonsConfirmPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.aipRequestAppealReasonsConfirmPage.returnToCaseDetails();

        await caseOfficerExuiPages.caseOverviewPage.verifyUserIsOnPage({});
        await caseOfficerExuiPages.caseOverviewPage.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'AiP - Request Appeal Reasons' });
      });

      await test.step('Citizen Api: Submit appeal reasons', async () => {
        await cui_apiClient.completeAndSubmitAppealReasonsJourneyViaApi({
          doesApplicantRequireMoreTimeToSubmitAppealReasons: false,
          appealReasons: {
            reasonWhyHomeOfficeDecisionIsWrong: 'The home office decision is wrong test reason ',
            doYouWishToProvideSupportingEvidence: 'No',
          },
        });
      });

      await test.step('Case Officer: Refresh application overview page until expected next step has been shown', async () => {
        await caseOfficerExuiPages.caseOverviewPage.refreshPageUntilExpectedTextIsVisible({
          expectedText: "Review the appellant's case in the appeal tab.",
          caseId: caseId,
        });
      });

      await test.step('Case Officer: Select request respondent review from next steps dropdown and submit event', async () => {
        await caseOfficerExuiPages.caseOverviewPage.selectEventFromDropdown({ eventToSelect: 'Request respondent review' });

        await caseOfficerExuiPages.requestRespondentReviewPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.requestRespondentReviewPage.continueOnToNextPage();

        await caseOfficerExuiPages.requestRespondentReviewSubmitPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.requestRespondentReviewSubmitPage.sendDirection();

        await caseOfficerExuiPages.requestRespondentReviewConfirmPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.requestRespondentReviewConfirmPage.returnToCaseDetails();

        await caseOfficerExuiPages.caseOverviewPage.verifyUserIsOnPage({});
        await caseOfficerExuiPages.caseOverviewPage.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Request respondent review' });
      });

      await test.step('Home Office User: Refresh application overview page until expected next step is shown', async () => {
        await homeOfficeUserExuiPages.caseOverviewPage.page.bringToFront();
        await homeOfficeUserExuiPages.caseOverviewPage.refreshPageUntilExpectedTextIsVisible({
          expectedText: 'The Appeal Skeleton Argument is ready to view in the documents tab.',
          caseId: caseId,
        });
      });

      await test.step('Home Office User: Select upload the appeal response from next steps drop down and submit event', async () => {
        await homeOfficeUserExuiPages.caseOverviewPage.selectEventFromDropdown({ eventToSelect: 'Upload the appeal response' });

        await homeOfficeUserExuiPages.uploadHomeOfficeAppealResponseReviewOutcomePage.verifyUserIsOnPage();
        await homeOfficeUserExuiPages.uploadHomeOfficeAppealResponseReviewOutcomePage.completePageAndContinue({
          appealReviewOutcome: 'Decision maintained',
        });

        await homeOfficeUserExuiPages.uploadHomeOfficeAppealResponsePage.verifyUserIsOnPage();
        await homeOfficeUserExuiPages.uploadHomeOfficeAppealResponsePage.completePageAndContinue({});

        await homeOfficeUserExuiPages.uploadHomeOfficeAppealResponseSubmitPage.verifyUserIsOnPage();
        await homeOfficeUserExuiPages.uploadHomeOfficeAppealResponseSubmitPage.submitEvent();

        await homeOfficeUserExuiPages.uploadHomeOfficeAppealResponseConfirmPage.verifyUserIsOnPage();
        await homeOfficeUserExuiPages.uploadHomeOfficeAppealResponseConfirmPage.returnToCaseDetails();

        await homeOfficeUserExuiPages.caseOverviewPage.verifyUserIsOnPage({});
        await homeOfficeUserExuiPages.caseOverviewPage.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Upload the appeal response' });
      });

      await test.step('Case Officer: Refresh application overview page until expected next step is shown', async () => {
        await caseOfficerExuiPages.caseOverviewPage.page.bringToFront();
        await caseOfficerExuiPages.caseOverviewPage.refreshPageUntilExpectedTextIsVisible({
          expectedText: 'Check the response uploaded by the respondent.',
          caseId: caseId,
        });
      });

      await test.step('Case Officer: Select review home office response from next steps dropdown and submit event', async () => {
        await caseOfficerExuiPages.caseOverviewPage.selectEventFromDropdown({ eventToSelect: 'Review Home Office response' });

        await caseOfficerExuiPages.reviewHomeOfficeResponsePage.verifyUserIsOnPage();
        await caseOfficerExuiPages.reviewHomeOfficeResponsePage.continueOnToNextPage();

        await caseOfficerExuiPages.reviewHomeOfficeResponseSubmitPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.reviewHomeOfficeResponseSubmitPage.submitEvent();

        await caseOfficerExuiPages.reviewHomeOfficeResponseConfirmPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.reviewHomeOfficeResponseConfirmPage.returnToCaseDetails();

        await caseOfficerExuiPages.caseOverviewPage.verifyUserIsOnPage({});
        await caseOfficerExuiPages.caseOverviewPage.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Review Home Office response' });
      });

      await test.step('Case Officer: Select request hearing requirements from next steps dropdown and submit event', async () => {
        await caseOfficerExuiPages.caseOverviewPage.selectEventFromDropdown({ eventToSelect: 'Request hearing requirements' });

        await caseOfficerExuiPages.requestHearingRequirementsPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.requestHearingRequirementsPage.submitEvent();

        await caseOfficerExuiPages.caseOverviewPage.verifyUserIsOnPage({});
        await caseOfficerExuiPages.caseOverviewPage.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Request hearing requirements' });
      });

      await test.step('Citizen Api: Submit hearing requirements', async () => {
        await cui_apiClient.commpleteAndSubmitHearingRequirementsJourneyViaApi({ pathToTake: 'Minimal Path' });
      });

      await test.step('Case Officer: Refresh application overview page until expected next step is shown', async () => {
        await caseOfficerExuiPages.caseOverviewPage.refreshPageUntilExpectedTextIsVisible({
          expectedText: 'You can view the hearing requirements and any requests for additional adjustments in the Hearing and appointment tab.',
          caseId: caseId,
        });
      });

      await test.step('Case Officer: Select review hearing requirements from next steps dropdown and submit event', async () => {
        await caseOfficerExuiPages.caseOverviewPage.selectEventFromDropdown({ eventToSelect: 'Review hearing requirements' });

        await caseOfficerExuiPages.reviewHearingRequirementsPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.reviewHearingRequirementsPage.continueOntoNextPage();

        await caseOfficerExuiPages.reviewHearingRequirementsRemoteHearingPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.reviewHearingRequirementsRemoteHearingPage.completePageAndContinue({
          isRemoteHearingAllowed: 'Granted',
          description: 'Granted request for remote hearing',
        });

        await caseOfficerExuiPages.reviewHearingRequirementsPersonalVulnerabilitiesPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.reviewHearingRequirementsPersonalVulnerabilitiesPage.continueOntoNextPage();

        await caseOfficerExuiPages.reviewHearingRequirementsMultimediaEvidencePage.verifyUserIsOnPage();
        await caseOfficerExuiPages.reviewHearingRequirementsMultimediaEvidencePage.continueOntoNextPage();

        await caseOfficerExuiPages.reviewHearingRequirementsSingleSexCourtPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.reviewHearingRequirementsSingleSexCourtPage.continueOntoNextPage();

        await caseOfficerExuiPages.reviewHearingRequirementsInCameraCourtPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.reviewHearingRequirementsInCameraCourtPage.continueOntoNextPage();

        await caseOfficerExuiPages.reviewHearingRequirementsAddtionalRequirementsPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.reviewHearingRequirementsAddtionalRequirementsPage.continueOntoNextPage();

        await caseOfficerExuiPages.reviewHearingRequirementsHearingChannelPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.reviewHearingRequirementsHearingChannelPage.completePageAndContinue({ hearingChannel: 'Video' });

        await caseOfficerExuiPages.reviewHearingRequirementsAppealSuitableToFloatPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.reviewHearingRequirementsAppealSuitableToFloatPage.completePageAndContinue({
          isAppealSuitableToFloat: 'Yes',
        });

        await caseOfficerExuiPages.reviewHearingRequirementsAdditionalIntructionsPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.reviewHearingRequirementsAdditionalIntructionsPage.completePageAndContinue({
          anyAddtionalIntructions: 'No',
        });

        await caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.submitEvent();

        await caseOfficerExuiPages.reviewHearingRequirementsConfirmPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.reviewHearingRequirementsConfirmPage.returnToCaseDetails();

        await caseOfficerExuiPages.caseOverviewPage.verifyUserIsOnPage({});
        await caseOfficerExuiPages.caseOverviewPage.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Review hearing requirements' });
      });

      const adminOfficerExuiPages = await test.step('Admin user: Select list case from next steps dropdown and submit event', async () => {
        const adminOfficerNewBrowserContextAndPage = await newBrowserContextAndPage({ user: 'adminOfficer' });
        const adminOfficerExuiPages = await exui_pages.newPageContext({ pageContext: adminOfficerNewBrowserContextAndPage });

        await adminOfficerExuiPages.caseOverviewPage.goTo({ caseId: caseId });

        await adminOfficerExuiPages.caseOverviewPage.selectEventFromDropdown({ eventToSelect: 'List the case' });

        await adminOfficerExuiPages.listCasePage.verifyUserIsOnPage();
        await adminOfficerExuiPages.listCasePage.completePageAndContinue({
          listingLocation: 'Newport Tribunal Centre - Columbus House',
          remoteHearing: 'Yes',
          dateToSet: 'tomorrow',
          hourToSet: 13,
        });

        await adminOfficerExuiPages.listCaseSubmitPage.verifyUserIsOnPage();
        await adminOfficerExuiPages.listCaseSubmitPage.listCase();

        await adminOfficerExuiPages.listCaseConfirmPage.verifyUserIsOnPage();
        await adminOfficerExuiPages.listCaseConfirmPage.returnToCaseDetails();

        await adminOfficerExuiPages.caseOverviewPage.verifyUserIsOnPage({});
        await adminOfficerExuiPages.caseOverviewPage.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'List the case' });

        return adminOfficerExuiPages;
      });

      await test.step('Case Officer: Refresh application overview page until expected next step is shown', async () => {
        await caseOfficerExuiPages.caseOverviewPage.page.bringToFront();
        await caseOfficerExuiPages.caseOverviewPage.refreshPageUntilExpectedTextIsVisible({
          expectedText: 'You must create a case summary for the judge to use at the hearing.',
          caseId: caseId,
        });
      });

      await test.step('Case Officer: Select Create case summary from next steps dropdown and submit event', async () => {
        await caseOfficerExuiPages.caseOverviewPage.selectEventFromDropdown({ eventToSelect: 'Create case summary' });

        await caseOfficerExuiPages.createCaseSummaryPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.createCaseSummaryPage.completePageAndContinue({});

        await caseOfficerExuiPages.createCaseSummarySubmitPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.createCaseSummarySubmitPage.uploadDocument();

        await caseOfficerExuiPages.createCaseSummaryConfirmPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.createCaseSummaryConfirmPage.returnToCaseDetails();

        await caseOfficerExuiPages.caseOverviewPage.verifyUserIsOnPage({});
        await caseOfficerExuiPages.caseOverviewPage.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Create case summary' });
      });

      await test.step('Case Officer: Select Generate hearing bundle from next steps dropdown and submit event', async () => {
        await caseOfficerExuiPages.caseOverviewPage.selectEventFromDropdown({ eventToSelect: 'Generate hearing bundle' });

        await caseOfficerExuiPages.generateHearingBundlePage.verifyUserIsOnPage();
        await caseOfficerExuiPages.generateHearingBundlePage.submitGenerateHearingBundleEvent();

        await caseOfficerExuiPages.generateHearingBundleConfirmPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.generateHearingBundleConfirmPage.returnToCaseDetails();

        await caseOfficerExuiPages.caseOverviewPage.verifyUserIsOnPage({});
        await caseOfficerExuiPages.caseOverviewPage.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Generate hearing bundle' });
      });

      await test.step('Case Officer: Refresh application overview page until expected next step is shown', async () => {
        await caseOfficerExuiPages.caseOverviewPage.refreshPageUntilExpectedTextIsVisible({
          caseId: caseId,
          expectedText: 'You can start to create the decision and reasons document.',
          timeoutInSeconds: 90_000,
        });
      });

      await test.step('Case Officer: Select Start decision and reasons from next steps dropdown and submit event', async () => {
        await caseOfficerExuiPages.caseOverviewPage.selectEventFromDropdown({ eventToSelect: 'Start decision and reasons' });

        await caseOfficerExuiPages.startDecisionAndReasonsPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.startDecisionAndReasonsPage.completePageAndContinue({ caseIntroduction: 'This is a test case introduction' });

        await caseOfficerExuiPages.decisionAndReasonsStartedAppellantSummaryPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.decisionAndReasonsStartedAppellantSummaryPage.completePageAndContinue({
          appellantCaseSummary: 'This is a test appellant case summary',
        });

        await caseOfficerExuiPages.decisionAndReasonsStartedImmigrationHistoryPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.decisionAndReasonsStartedImmigrationHistoryPage.completePageAndContinue({ agreeToImmigrationHistory: 'Yes' });

        await caseOfficerExuiPages.decisionAndReasonsStartedScheduleOfIssuesPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.decisionAndReasonsStartedScheduleOfIssuesPage.completePageAndContinue({ agreeToScheduleOfIssues: 'Yes' });

        await caseOfficerExuiPages.decisionAndReasonsStartedSubmitPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.decisionAndReasonsStartedSubmitPage.saveCase();

        await caseOfficerExuiPages.decisionAndReasonsStartedConfirmPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.decisionAndReasonsStartedConfirmPage.returnToCaseDetails();

        await caseOfficerExuiPages.caseOverviewPage.verifyUserIsOnPage({});
        await caseOfficerExuiPages.caseOverviewPage.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Start decision and reasons' });
      });

      const judgeUserExuiPages =
        await test.step('Judge User: Select Prepare Decision and Reasons from next steps dropdown and submit event', async () => {
          const juedgeUserNewBrowserContextAndPage = await newBrowserContextAndPage({ user: 'judgeUser' });
          const judgeUserExuiPages = await exui_pages.newPageContext({ pageContext: juedgeUserNewBrowserContextAndPage });

          await judgeUserExuiPages.caseOverviewPage.goTo({ caseId: caseId });

          await judgeUserExuiPages.caseOverviewPage.selectEventFromDropdown({ eventToSelect: 'Prepare Decision and Reasons' });

          await judgeUserExuiPages.prepareDecisionAndReasonsAnonymityOrderPage.verifyUserIsOnPage();
          await judgeUserExuiPages.prepareDecisionAndReasonsAnonymityOrderPage.completePageAndContinue({ anonymityOrderDirection: 'Yes' });

          await judgeUserExuiPages.prepareDecisionAndReasonsLegalRepresentativesPage.verifyUserIsOnPage();
          await judgeUserExuiPages.prepareDecisionAndReasonsLegalRepresentativesPage.completePageAndContinue();

          await judgeUserExuiPages.prepareDecisionAndReasonsSubmitPage.verifyUserIsOnPage();
          await judgeUserExuiPages.prepareDecisionAndReasonsSubmitPage.generateDecisionAndReasons();

          await judgeUserExuiPages.prepareDecisionAndReasonsConfirmPage.verifyUserIsOnPage();
          await judgeUserExuiPages.prepareDecisionAndReasonsConfirmPage.returnToCaseDetails();

          await judgeUserExuiPages.caseOverviewPage.verifyUserIsOnPage({});
          await judgeUserExuiPages.caseOverviewPage.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Prepare Decision and Reasons' });

          return judgeUserExuiPages;
        });

      await test.step('Judge User: Select Complete decision and reasons from next steps dropdown and submit event', async () => {
        await judgeUserExuiPages.caseOverviewPage.selectEventFromDropdown({ eventToSelect: 'Complete decision and reasons' });

        await judgeUserExuiPages.completeDecisionAndReasonsPage.verifyUserIsOnPage();
        await judgeUserExuiPages.completeDecisionAndReasonsPage.completePageAndContinue({ decision: 'Allowed' });

        await judgeUserExuiPages.completeDecisionAndReasonsUploadDecisionPage.verifyUserIsOnPage();
        await judgeUserExuiPages.completeDecisionAndReasonsUploadDecisionPage.completePageAndContinue({});

        await judgeUserExuiPages.completeDecisionAndReasonsSubmitPage.verifyUserIsOnPage();
        await judgeUserExuiPages.completeDecisionAndReasonsSubmitPage.uploadDecisionAndReasons();

        await judgeUserExuiPages.completeDecisionAndReasonsConfirmPage.verifyUserIsOnPage();
        await judgeUserExuiPages.completeDecisionAndReasonsConfirmPage.returnToCaseDetails();

        await judgeUserExuiPages.caseOverviewPage.verifyUserIsOnPage({});
        await judgeUserExuiPages.caseOverviewPage.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Complete decision and reasons' });
      });
    },
  );
});
