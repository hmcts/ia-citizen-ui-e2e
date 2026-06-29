import { test, expect } from '../../fixtures.js';
import { config } from '../../utils/config.utils.js';

test.describe('Set of tests to verify citizen user is able to create a case summary and generate a hearing bundle whilst also submitting a decision and reasons event on exui manage cases', () => {
  test.use({ storageState: config.exuiUsers.caseOfficer.sessionFile });
  let caseIdFromBeforeEach: string;

  test.beforeEach(
    async ({ exui_caseOfficerApiClient, cui_apiClient, exui_pages, exui_homeOfficeUserApiClient, exui_adminOfficerApiClient, dataUtils }) => {
      const appealDetails = await test.step('Citizen Api: Submit a new paid appeal', async () => {
        const appealDetails = await cui_apiClient.completeAndSubmitNewAppealJourneyViaApi({
          appealType: 'European Economic Area',
          hasApplicantReceivedADeportationOrder: 'No',
          isApplicantStateless: false,
          nationality: 'Slovak',
          isUserInTheUk: 'Yes',
          doesApplicantHaveASponsor: 'No',
          decisionWithOrWithoutHearing: 'decisionWithHearing',
          isApplicationInTime: true,
          whetherApplicantHasToPayAFee: 'None of these statements apply to me',
          appealSubmissionType: 'Pay Appeal',
        });
        return appealDetails;
      });

      const caseId = await test.step(`Fetch exui case id via api call`, async () => {
        const caseId = await exui_caseOfficerApiClient.fetchCaseId({ homeOfficeReferenceNumber: appealDetails.homeOfficeReference.toString() });
        return caseId;
      });

      await test.step('Progress case via api', async () => {
        await exui_caseOfficerApiClient.submitRequestRespondentEvidenceEvent({
          caseId: caseId,
        });

        await exui_homeOfficeUserApiClient.submitUploadHomeOfficeBundleEvent({
          caseId: caseId,
          description: 'Test upload of Home Office bundle',
        });

        await exui_caseOfficerApiClient.submitRequestReasonsForAppealEvent({
          caseId: caseId,
        });

        await cui_apiClient.completeAndSubmitAppealReasonsJourneyViaApi({
          doesApplicantRequireMoreTimeToSubmitAppealReasons: false,
          appealReasons: {
            doYouWishToProvideSupportingEvidence: 'No',
            reasonWhyHomeOfficeDecisionIsWrong: 'Test reason why the Home Office decision is wrong',
          },
        });

        await exui_caseOfficerApiClient.submitRequestRespondentReviewEvent({
          caseId: caseId,
        });

        await exui_homeOfficeUserApiClient.submitUploadHomeOfficeAppealResponseEvent({
          caseId: caseId,
          appealReviewOutcome: 'Decision maintained',
        });

        await exui_caseOfficerApiClient.submitRequestResponseReviewEvent({
          caseId: caseId,
        });

        await exui_caseOfficerApiClient.submitRequestHearingRequirementsEvent({
          caseId: caseId,
        });

        await cui_apiClient.commpleteAndSubmitHearingRequirementsJourneyViaApi({
          pathToTake: 'Minimal Path',
        });

        await exui_caseOfficerApiClient.submitReviewHearingRequirementsEvent({
          caseId: caseId,
          isRemoteHearingAllowed: 'Granted',
          grantOrRefuseAnyAdjustmentsRequested: 'Granted',
          isApplicationSuitableToFloat: 'Yes',
          anyAdditionalInstructions: 'Yes',
          hearingType: 'Video',
        });

        const hearingDate = await dataUtils.getDateFromToday({ dayOffset: 1 });
        await exui_adminOfficerApiClient.submitListCaseEvent({
          caseId: caseId,
          hearingDateAndTime: {
            day: hearingDate.day,
            month: hearingDate.month,
            year: hearingDate.year,
          },
          isRemoteHearing: 'No',
        });
      });

      await test.step(`Case Officer: Navigate to case overview page on exui`, async () => {
        await exui_pages.caseOverviewPage.goTo({ caseId: caseId });
      });

      caseIdFromBeforeEach = caseId;
    },
  );

  test('Verify case officer is able to create a case summary, generate the hearing bundle and submit decision and reasons', async ({
    exui_pages,
  }) => {
    await test.step('Verify correct next steps are displayed on case overview page', async () => {
      await Promise.all([
        expect(exui_pages.caseOverviewPage.$static.doThisNextHeading).toBeVisible(),
        expect(exui_pages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toHaveText(
          'You must create a case summary for the judge to use at the hearing.',
        ),
        expect(exui_pages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toBeVisible(),
        expect(exui_pages.caseOverviewPage.$static.doThisNextParagraph.nth(1)).toHaveText('Create case summary'),
        expect(exui_pages.caseOverviewPage.$static.doThisNextParagraph.nth(1)).toBeVisible(),
      ]);
    });

    await test.step('Select Create case summary from next steps dropdown and submit event', async () => {
      await exui_pages.caseOverviewPage.selectEventFromDropdown({ eventToSelect: 'Create case summary' });

      await exui_pages.createCaseSummaryPage.verifyUserIsOnPage();
      await exui_pages.createCaseSummaryPage.verifyAllTextOnPage();
      await exui_pages.createCaseSummaryPage.completePageAndContinue({ description: 'This is a test case summary description' });

      await exui_pages.createCaseSummarySubmitPage.verifyUserIsOnPage();
      await Promise.all([
        await expect(exui_pages.createCaseSummarySubmitPage.$static.caseRecordHeading).toBeVisible(),
        await expect(exui_pages.createCaseSummarySubmitPage.$static.checkYouAnswersHeading).toBeVisible(),
        await expect(exui_pages.createCaseSummarySubmitPage.$static.checkInformationCarefullyText).toBeVisible(),
        await expect(exui_pages.createCaseSummarySubmitPage.$questionLocator('Case summary document')).toBeVisible(),
        await expect(exui_pages.createCaseSummarySubmitPage.$questionValueLocator('Case summary document')).toBeVisible(),
        await expect(exui_pages.createCaseSummarySubmitPage.$questionValueLocator('Case summary document')).toHaveText('Create_Case_Summary.txt'),
        await expect(exui_pages.createCaseSummarySubmitPage.$changeAnswerToQuestionLocator('Case summary document')).toBeVisible(),
        await expect(exui_pages.createCaseSummarySubmitPage.$questionLocator('Describe the document')).toBeVisible(),
        await expect(exui_pages.createCaseSummarySubmitPage.$questionValueLocator('Describe the document')).toBeVisible(),
        await expect(exui_pages.createCaseSummarySubmitPage.$questionValueLocator('Describe the document')).toHaveText(
          'This is a test case summary description',
        ),
        await expect(exui_pages.createCaseSummarySubmitPage.$changeAnswerToQuestionLocator('Describe the document')).toBeVisible(),
      ]);
      await exui_pages.createCaseSummarySubmitPage.uploadDocument();

      await exui_pages.createCaseSummaryConfirmPage.verifyUserIsOnPage();
      await exui_pages.createCaseSummaryConfirmPage.verifyAllTextOnPage();
      await exui_pages.createCaseSummaryConfirmPage.returnToCaseDetails();
    });

    await test.step('Verify correct next steps are displayed once create case summary event has been submitted', async () => {
      await exui_pages.caseOverviewPage.verifyUserIsOnPage({});
      await exui_pages.caseOverviewPage.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Create case summary' });
      await Promise.all([
        await expect(exui_pages.caseOverviewPage.$static.doThisNextHeading).toBeVisible(),
        await expect(exui_pages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toBeVisible(),
        await expect(exui_pages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toHaveText(
          'You must create a hearing bundle for all parties to use in the hearing. You should first review the documents in the documents tab.',
        ),
        await expect(exui_pages.caseOverviewPage.$static.doThisNextParagraph.nth(1)).toBeVisible(),
        await expect(exui_pages.caseOverviewPage.$static.doThisNextParagraph.nth(1)).toHaveText(
          'If you happy with the documents, generate the hearing bundle.',
        ),
        await expect(exui_pages.caseOverviewPage.$static.doThisNextParagraph.nth(2)).toBeVisible(),
        await expect(exui_pages.caseOverviewPage.$static.doThisNextParagraph.nth(2)).toHaveText(
          'If you want to add or remove any documents, you can customise hearing bundle',
        ),
      ]);
    });

    await test.step('Select Generate hearing bundle from next steps dropdown and submit event', async () => {
      await exui_pages.caseOverviewPage.selectEventFromDropdown({ eventToSelect: 'Generate hearing bundle' });

      await exui_pages.generateHearingBundlePage.verifyUserIsOnPage();
      await exui_pages.generateHearingBundlePage.submitGenerateHearingBundleEvent();

      await exui_pages.generateHearingBundleConfirmPage.verifyUserIsOnPage();
      await exui_pages.generateHearingBundleConfirmPage.verifyAllTextOnPage();
      await exui_pages.generateHearingBundleConfirmPage.returnToCaseDetails();
    });

    await test.step('Verify correct next steps are displayed once generate hearing bundle event has been submitted', async () => {
      await exui_pages.caseOverviewPage.verifyUserIsOnPage({});
      await exui_pages.caseOverviewPage.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Generate hearing bundle' });
      await Promise.all([
        expect(exui_pages.caseOverviewPage.$static.whatToDoNextHeading).toBeVisible(),
        expect(exui_pages.caseOverviewPage.$static.whatToDoNextParagraph.nth(0)).toBeVisible(),
        expect(exui_pages.caseOverviewPage.$static.whatToDoNextParagraph.nth(0)).toHaveText(
          'The hearing bundle is being generated. You will soon be able to view the hearing bundle in the documents tab.',
        ),
        expect(exui_pages.caseOverviewPage.$static.whatToDoNextParagraph.nth(1)).toBeVisible(),
        expect(exui_pages.caseOverviewPage.$static.whatToDoNextParagraph.nth(1)).toHaveText(
          'You and the other parties will be notified when the hearing bundle is available.',
        ),
        expect(exui_pages.caseOverviewPage.$static.whatToDoNextParagraph.nth(2)).toBeVisible(),
        expect(exui_pages.caseOverviewPage.$static.whatToDoNextParagraph.nth(2)).toHaveText(
          'If the bundle fails to generate, you will be notified and need to generate the bundle again.',
        ),
      ]);
    });

    await test.step('Case Officer: Refresh application overview page and verify correct next steps are displayed', async () => {
      await exui_pages.caseOverviewPage.refreshPageUntilExpectedTextIsVisible({
        caseId: caseIdFromBeforeEach,
        expectedText: 'You can start to create the decision and reasons document.',
        timeoutInSeconds: 90_000,
      });

      await Promise.all([
        expect(exui_pages.caseOverviewPage.$static.doThisNextHeading).toBeVisible(),
        expect(exui_pages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toBeVisible(),
        expect(exui_pages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toHaveText(
          'You can start to create the decision and reasons document.',
        ),
        expect(exui_pages.caseOverviewPage.$static.doThisNextParagraph.nth(1)).toBeVisible(),
        expect(exui_pages.caseOverviewPage.$static.doThisNextParagraph.nth(1)).toHaveText('Start decision and reasons'),
      ]);
    });

    await test.step('Case Officer: Select Start decision and reasons from next steps dropdown and submit event', async () => {
      await exui_pages.caseOverviewPage.selectEventFromDropdown({ eventToSelect: 'Start decision and reasons' });

      await exui_pages.startDecisionAndReasonsPage.verifyUserIsOnPage();
      await exui_pages.startDecisionAndReasonsPage.verifyAllTextOnPage();
      await exui_pages.startDecisionAndReasonsPage.completePageAndContinue({ caseIntroduction: 'This is a test case introduction' });

      await exui_pages.decisionAndReasonsStartedAppellantSummaryPage.verifyUserIsOnPage();
      await exui_pages.decisionAndReasonsStartedAppellantSummaryPage.verifyAllTextOnPage();
      await exui_pages.decisionAndReasonsStartedAppellantSummaryPage.completePageAndContinue({
        appellantCaseSummary: 'This is a test appellant case summary',
      });

      await exui_pages.decisionAndReasonsStartedImmigrationHistoryPage.verifyUserIsOnPage();
      await exui_pages.decisionAndReasonsStartedImmigrationHistoryPage.verifyAllTextOnPage();
      await exui_pages.decisionAndReasonsStartedImmigrationHistoryPage.completePageAndContinue({ agreeToImmigrationHistory: 'Yes' });

      await exui_pages.decisionAndReasonsStartedScheduleOfIssuesPage.verifyUserIsOnPage();
      await exui_pages.decisionAndReasonsStartedScheduleOfIssuesPage.verifyAllTextOnPage();
      await exui_pages.decisionAndReasonsStartedScheduleOfIssuesPage.completePageAndContinue({ agreeToScheduleOfIssues: 'Yes' });

      await exui_pages.decisionAndReasonsStartedSubmitPage.verifyUserIsOnPage();
      await Promise.all([
        expect(exui_pages.decisionAndReasonsStartedSubmitPage.$static.caseRecordHeading).toBeVisible(),
        expect(exui_pages.decisionAndReasonsStartedSubmitPage.$static.checkYouAnswersHeading).toBeVisible(),
        expect(exui_pages.decisionAndReasonsStartedSubmitPage.$static.checkInformationCarefullyText).toBeVisible(),
        expect(exui_pages.decisionAndReasonsStartedSubmitPage.$questionLocator('Introduction')).toBeVisible(),
        expect(exui_pages.decisionAndReasonsStartedSubmitPage.$questionValueLocator('Introduction')).toHaveText('This is a test case introduction'),
        expect(exui_pages.decisionAndReasonsStartedSubmitPage.$changeAnswerToQuestionLocator('Introduction')).toBeVisible(),
        expect(exui_pages.decisionAndReasonsStartedSubmitPage.$questionLocator("Appellant's case summary")).toBeVisible(),
        expect(exui_pages.decisionAndReasonsStartedSubmitPage.$questionValueLocator("Appellant's case summary")).toHaveText(
          'This is a test appellant case summary',
        ),
        expect(exui_pages.decisionAndReasonsStartedSubmitPage.$changeAnswerToQuestionLocator("Appellant's case summary")).toBeVisible(),
        expect(exui_pages.decisionAndReasonsStartedSubmitPage.$questionLocator('Do both parties agree the immigration history?')).toBeVisible(),
        expect(exui_pages.decisionAndReasonsStartedSubmitPage.$questionValueLocator('Do both parties agree the immigration history?')).toHaveText(
          'Yes',
        ),
        expect(
          exui_pages.decisionAndReasonsStartedSubmitPage.$changeAnswerToQuestionLocator('Do both parties agree the immigration history?'),
        ).toBeVisible(),
        expect(exui_pages.decisionAndReasonsStartedSubmitPage.$questionLocator('Do both parties agree the schedule of issues?')).toBeVisible(),
        expect(exui_pages.decisionAndReasonsStartedSubmitPage.$questionValueLocator('Do both parties agree the schedule of issues?')).toHaveText(
          'Yes',
        ),
        expect(
          exui_pages.decisionAndReasonsStartedSubmitPage.$changeAnswerToQuestionLocator('Do both parties agree the schedule of issues?'),
        ).toBeVisible(),
      ]);
      await exui_pages.decisionAndReasonsStartedSubmitPage.saveCase();

      await exui_pages.decisionAndReasonsStartedConfirmPage.verifyUserIsOnPage();
      await exui_pages.decisionAndReasonsStartedConfirmPage.verifyAllTextOnPage();
      await exui_pages.decisionAndReasonsStartedConfirmPage.returnToCaseDetails();
    });

    await test.step('Verify correct next steps are displayed once start decision and reasons event has been submitted', async () => {
      await exui_pages.caseOverviewPage.verifyUserIsOnPage({});
      await exui_pages.caseOverviewPage.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Start decision and reasons' });
      await Promise.all([
        expect(exui_pages.caseOverviewPage.$static.whatHappensNextHeading).toBeVisible(),
        expect(exui_pages.caseOverviewPage.$static.whatHappensNextParagraph.nth(0)).toBeVisible(),
        expect(exui_pages.caseOverviewPage.$static.whatHappensNextParagraph.nth(0)).toHaveText(
          'The judge will complete the Decision and Reasons document and upload it to the service.',
        ),
        expect(exui_pages.caseOverviewPage.$static.whatHappensNextParagraph.nth(1)).toBeVisible(),
        expect(exui_pages.caseOverviewPage.$static.whatHappensNextParagraph.nth(1)).toHaveText(
          "Both parties will be notified when it's available to view and download from the Documents tab.",
        ),
      ]);
    });
  });
});
