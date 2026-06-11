import { test, expect } from '../../../fixtures.js';
test.describe('Tests the allow the user to submit a response to a judges decision', () => {
  let caseIdFromBeforeEach: string;

  test.beforeEach(
    async ({
      citizenUser,
      cui_login,
      cui_apiClient,
      exui_caseOfficerApiClient,
      exui_adminOfficerApiClient,
      exui_homeOfficeUserApiClient,
      exui_judgeApiClient,
    }) => {
      const applicantDetails = await test.step('Submit a new appeal via citizen api', async () => {
        const applicantDetails = await cui_apiClient.completeAndSubmitAppealJourneyViaApi({
          appealType: 'EU Settlement Scheme',
          decisionWithOrWithoutHearing: 'decisionWithHearing',
          doesApplicantHaveASponsor: 'No',
          hasApplicantReceivedADeportationOrder: 'No',
          isApplicantStateless: false,
          nationality: 'Belgium',
          payForAppealNowOrLater: 'payNow',
          whetherApplicantHasToPayAFee: 'None of these statements apply to me',
          appealSubmissionType: 'Pay Appeal',
          isUserInTheUk: 'Yes',
          isApplicationInTime: true,
        });

        return applicantDetails;
      });

      const caseId = await exui_caseOfficerApiClient.fetchCaseId({ homeOfficeReferenceNumber: applicantDetails.homeOfficeReference.toString() });

      await test.step('Progress jounrey to the point the judge has made a decision', async () => {
        await exui_caseOfficerApiClient.submitRequestRespondentEvidenceEvent({
          caseId: caseId,
        });

        await exui_homeOfficeUserApiClient.submitUploadHomeOfficeBundleEvent({
          caseId: caseId,
          description: 'Home Office Bundle',
        });

        await exui_caseOfficerApiClient.submitRequestReasonsForAppealEvent({
          caseId: caseId,
        });

        await cui_apiClient.completeAndSubmitAppealReasonsJourneyViaApi({
          doesApplicantRequireMoreTimeToSubmitAppealReasons: false,
          appealReasons: {
            reasonWhyHomeOfficeDecisionIsWrong: 'Test reason',
            doYouWishToProvideSupportingEvidence: 'No',
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
          pathToTake: 'Maximum Path',
        });

        await exui_caseOfficerApiClient.submitReviewHearingRequirementsEvent({
          caseId: caseId,
          isRemoteHearingAllowed: 'Granted',
          grantOrRefuseAnyAdjustmentsRequested: 'Granted',
        });

        await exui_adminOfficerApiClient.submitListCaseEvent({
          caseId: caseId,
          hearingId: '',
          isRemoteHearing: 'Yes',
          hearingDateAndTime: {
            day: 21,
            month: 5,
            year: 2026,
          },
        });

        await exui_caseOfficerApiClient.submitCreateCaseSummaryEvent({
          caseId: caseId,
        });

        await exui_caseOfficerApiClient.submitGenerateHearingBundleEvent({
          caseId: caseId,
        });

        await exui_caseOfficerApiClient.submitDecisionAndReasonsStartedEvent({
          caseId: caseId,
          doYouAgreeWithImmigrationHistory: 'Yes',
          doYouAgreeWithscheduleOfIssuesAgreement: 'Yes',
        });

        await exui_judgeApiClient.submitGenerateDecisionAndReasonsEvent({
          caseId: caseId,
          anonymityOrder: 'Yes',
        });

        await exui_judgeApiClient.submitSendDecisionAndReasonsEvent({
          caseId: caseId,
          isDecisionAllowed: 'Dismissed',
        });
      });

      await test.step('Verify application is in the correct state to submit FTPA response before logging in', async () => {
        await cui_apiClient.verifyAppealIsInExpectedStateViaAppealOverviewApi({
          expectedTextToBeOnAppealOverview: 'A judge has dismissed your appeal.',
        });
      });

      await test.step('Navigate to citizen UI and login', async () => {
        await cui_login({ email: citizenUser.email, password: citizenUser.password });
      });

      caseIdFromBeforeEach = caseId;
    },
  );

  test(
    'Verify citizen user is able to provide response to FTPA reason',
    { tag: ['@e2e'] },
    async ({ cui_pages, dataUtils, newBrowserContextAndPage, exui_pages, cui_signOutAndBackIn, citizenUser, cui_apiClient }) => {
      await test.step('Citizen User: Verify application is in the correct state', async () => {
        const expectedDate = (await dataUtils.getDateFromToday({ dayOffset: 14 })).full;

        await Promise.all([
          expect(cui_pages.appealOverviewPage.$static.applicantInstructionsWindow).toBeVisible(),
          expect(cui_pages.appealOverviewPage.$static.applicantInstructionsWindow).toContainText('A judge has dismissed your appeal.'),
          expect(cui_pages.appealOverviewPage.$static.applicantInstructionsWindow).toContainText(
            'The Decision and Reasons document includes the reasons the judge made this decision. You should read it carefully.',
          ),
          expect(cui_pages.appealOverviewPage.$static.applicantInstructionsWindow).toContainText('Read the Decision and Reasons document'),
          expect(cui_pages.appealOverviewPage.$static.applicantInstructionsWindow).toContainText('Appeal Information'),
          /*         expect(cui_pages.appealOverviewPage.$static.applicantInstructionsWindow).toContainText(
          `If you disagree with this decision, you have until ${expectedDate} to apply for permission to appeal to the Upper Tribunal.`,
        ), */
          expect(cui_pages.appealOverviewPage.$static.applicantInstructionsWindow).toContainText(
            'Apply for permission to appeal to the Upper Tribunal',
          ),
        ]);

        await expect(async () => {
          await expect(cui_pages.appealOverviewPage.$static.applicantInstructionsWindow).toContainText(
            `If you disagree with this decision, you have until ${expectedDate} to apply for permission to appeal to the Upper Tribunal.`,
          );
        }).toFail({ bugId: 'To be raised' });
      });

      await test.step('Citizen User: Navigate to FTPA page and submit response', async () => {
        await cui_pages.appealOverviewPage.navigationClick(cui_pages.appealOverviewPage.$interactive.applyForPermissionToAppealUpperTribunalLink);

        await cui_pages.ftpaReasonPage.verifyUserIsOnPage();
        await cui_pages.ftpaReasonPage.completePageAndContinue({
          ftpaReason: 'Test reason for why the tribunal decision is wrong.',
        });

        await cui_pages.ftpaEvidenceQuestionPage.verifyUserIsOnPage();
        await cui_pages.ftpaEvidenceQuestionPage.completePageAndContinue({
          doesUserWantToProvideEvidence: 'Yes',
        });

        await cui_pages.ftpaEvidencePage.verifyUserIsOnPage();
        await cui_pages.ftpaEvidencePage.completePageAndContinue({});

        await cui_pages.ftpaCheckAnswersPage.verifyUserIsOnPage();
        await Promise.all([
          expect(cui_pages.ftpaCheckAnswersPage.$questionLocator("Why do you think the Tribunal's decision is wrong?")).toBeVisible(),
          expect(cui_pages.ftpaCheckAnswersPage.$questionValueLocator("Why do you think the Tribunal's decision is wrong?")).toBeVisible(),
          expect(cui_pages.ftpaCheckAnswersPage.$questionValueLocator("Why do you think the Tribunal's decision is wrong?")).toHaveText(
            'Test reason for why the tribunal decision is wrong.',
          ),
          expect(cui_pages.ftpaCheckAnswersPage.$changeAnswerToQuestionLocator("Why do you think the Tribunal's decision is wrong?")).toBeVisible(),
          expect(cui_pages.ftpaCheckAnswersPage.$changeAnswerToQuestionLocator("Why do you think the Tribunal's decision is wrong?")).toContainText(
            'Change',
          ),
          expect(cui_pages.ftpaCheckAnswersPage.$questionLocator('Supporting evidence')).toBeVisible(),
          expect(cui_pages.ftpaCheckAnswersPage.$questionValueLocator('Supporting evidence')).toBeVisible(),
          expect(cui_pages.ftpaCheckAnswersPage.$questionValueLocator('Supporting evidence')).toHaveText('Ftpa_Evidence_Reason.txt'),
          expect(cui_pages.ftpaCheckAnswersPage.$changeAnswerToQuestionLocator('Supporting evidence')).toBeVisible(),
          expect(cui_pages.ftpaCheckAnswersPage.$changeAnswerToQuestionLocator('Supporting evidence')).toContainText('Change'),
        ]);

        await cui_pages.ftpaCheckAnswersPage.confirmAndSend();

        await cui_pages.ftpaConfirmationPage.verifyUserIsOnPage();
        await cui_pages.ftpaConfirmationPage.verifyAllTextOnPage();
        await cui_pages.ftpaConfirmationPage.clickSeeYourAppealProgressButton();

        await cui_pages.appealOverviewPage.verifyUserIsOnPage();
        await Promise.all([
          expect(cui_pages.appealOverviewPage.$static.nothingToDoNextHeading).toBeVisible(),
          expect(cui_pages.appealOverviewPage.$static.applicantInstructionsWindow).toBeVisible(),
          expect(cui_pages.appealOverviewPage.$static.applicantInstructionsWindow).toContainText(
            'A judge will decide your application for permission to appeal to the Upper Tribunal.',
          ),
          expect(cui_pages.appealOverviewPage.$static.applicantInstructionsWindow).toContainText(
            'The Tribunal will contact you when the judge has made a decision.',
          ),
        ]);
      });

      const judgeExuiPages = await test.step('Judge user: Navigate to case overview page and verify the correct text is displayed', async () => {
        const judgeContext = await newBrowserContextAndPage({ user: 'judgeUser' });
        const judgeExuiPages = await exui_pages.newPageContext({ pageContext: judgeContext });

        await judgeExuiPages.caseOverviewPage.goTo({ caseId: caseIdFromBeforeEach });
        await judgeExuiPages.caseOverviewPage.verifyUserIsOnPage({});

        await Promise.all([
          expect(judgeExuiPages.caseOverviewPage.$static.doThisNextHeading).toBeVisible(),
          expect(judgeExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toBeVisible(),
          expect(judgeExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toHaveText(
            'Review the application for permission to appeal in the FTPA tab. When you are ready, record the application decision.',
          ),
          expect(judgeExuiPages.caseOverviewPage.$static.doThisNextHeadingsLevel2.nth(0)).toBeVisible(),
          expect(judgeExuiPages.caseOverviewPage.$static.doThisNextHeadingsLevel2.nth(0)).toHaveText(
            'If the application should be treated in a different way',
          ),
          expect(judgeExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(1)).toBeVisible(),
          expect(judgeExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(1)).toHaveText(
            'You can remove the case from the FTPA process when recording the application decision. A Judge will then update the Tribunal decision.',
          ),
          expect(judgeExuiPages.caseOverviewPage.$static.doThisNextHeadingsLevel2.nth(1)).toBeVisible(),
          expect(judgeExuiPages.caseOverviewPage.$static.doThisNextHeadingsLevel2.nth(1)).toHaveText(
            'If you are pursuing a rule 35 decision to be set aside',
          ),
          expect(judgeExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(2)).toBeVisible(),
          expect(judgeExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(2)).toHaveText(
            'This can only be done by a Resident Judge. You must send the Notice of Intention to Set Aside to both parties offline and await any objections before recording the application decision.',
          ),
        ]);

        return judgeExuiPages;
      });

      await test.step('Judge user: Select Decide FTPA application event from next steps drop down and submit event', async () => {
        await judgeExuiPages.caseOverviewPage.selectEventFromDropdown({ eventToSelect: 'Decide FTPA application' });

        await judgeExuiPages.decideFtpaApplicationPage.verifyUserIsOnPage();
        await judgeExuiPages.decideFtpaApplicationPage.completePageAndContinue({ applicantType: 'Appellant' });

        await judgeExuiPages.decideFtpaApplicationAppellantOutcomeDecisionPage.verifyUserIsOnPage();
        await judgeExuiPages.decideFtpaApplicationAppellantOutcomeDecisionPage.completePageAndContinue({
          ftpaDecisionOutcome: 'Permission granted',
        });

        await judgeExuiPages.decideFtpaApplicationDecisionAndReasonsDocumentPage.verifyUserIsOnPage();
        await judgeExuiPages.decideFtpaApplicationDecisionAndReasonsDocumentPage.completePageAndContinue({});

        await judgeExuiPages.decideFtpaApplicationAppellantNoticeOfDecisionSetAsidePage.verifyUserIsOnPage();
        await judgeExuiPages.decideFtpaApplicationAppellantNoticeOfDecisionSetAsidePage.completePageAndContinue({
          noticeOfIntentionToSetAside: 'Yes',
          anyObjections: 'Test reason to object draft notice of intention to set aside',
          uploadFile: true,
          optionallyProvideDescriptionOfDocumentToUpload: 'Test description of document uploaded for objections to notice of intention to set aside',
        });

        await judgeExuiPages.decideFtpaApplicationAppellantDecisionReasonNotesPage.verifyUserIsOnPage();
        await judgeExuiPages.decideFtpaApplicationAppellantDecisionReasonNotesPage.completePageAndContinue({
          optionalPointsApplicable: [
            "It's clear at this stage that the issue is likely to be used for giving country guidance",
            'There are special reasons, such as the need to request the First-tier Tribunal to provide observations on the grounds of appeal',
            'There is a point of special difficulty or importance',
          ],
          optionalInformationForUpperTribunal: 'Test information for upper tribunal',
        });

        await judgeExuiPages.decideFtpaApplicationSubmitPage.verifyUserIsOnPage();
        await Promise.all([
          expect(judgeExuiPages.decideFtpaApplicationSubmitPage.$static.caseRecordHeading).toBeVisible(),
          expect(judgeExuiPages.decideFtpaApplicationSubmitPage.$static.checkYouAnswersHeading).toBeVisible(),
          expect(judgeExuiPages.decideFtpaApplicationSubmitPage.$static.checkInformationCarefullyText).toBeVisible(),
          //Verify table row for Who made the application?
          expect(judgeExuiPages.decideFtpaApplicationSubmitPage.$questionLocator('Who made the application?')).toBeVisible(),
          expect(judgeExuiPages.decideFtpaApplicationSubmitPage.$questionValueLocator('Who made the application?')).toBeVisible(),
          expect(judgeExuiPages.decideFtpaApplicationSubmitPage.$questionValueLocator('Who made the application?')).toHaveText('Appellant'),
          expect(judgeExuiPages.decideFtpaApplicationSubmitPage.$changeAnswerToQuestionLocator('Who made the application?')).toBeVisible(),
          expect(judgeExuiPages.decideFtpaApplicationSubmitPage.$changeAnswerToQuestionLocator('Who made the application?')).toHaveText('Change'),
          //Verify table row for The outcome of the application
          expect(judgeExuiPages.decideFtpaApplicationSubmitPage.$questionLocator('The outcome of the application')).toBeVisible(),
          expect(judgeExuiPages.decideFtpaApplicationSubmitPage.$questionValueLocator('The outcome of the application')).toBeVisible(),
          expect(judgeExuiPages.decideFtpaApplicationSubmitPage.$questionValueLocator('The outcome of the application')).toHaveText(
            'Permission granted',
          ),
          expect(judgeExuiPages.decideFtpaApplicationSubmitPage.$changeAnswerToQuestionLocator('The outcome of the application')).toBeVisible(),
          expect(judgeExuiPages.decideFtpaApplicationSubmitPage.$changeAnswerToQuestionLocator('The outcome of the application')).toHaveText(
            'Change',
          ),
          //Verify table row for Document
          expect(judgeExuiPages.decideFtpaApplicationSubmitPage.$questionLocator('Document')).toBeVisible(),
          expect(judgeExuiPages.decideFtpaApplicationSubmitPage.$questionValueLocator('Document')).toBeVisible(),
          expect(judgeExuiPages.decideFtpaApplicationSubmitPage.$questionValueLocator('Document')).toHaveText('Ftpa_Decision_And_Reasons.txt'),
          expect(judgeExuiPages.decideFtpaApplicationSubmitPage.$changeAnswerToQuestionLocator('Document')).toBeVisible(),
          expect(judgeExuiPages.decideFtpaApplicationSubmitPage.$changeAnswerToQuestionLocator('Document')).toHaveText('Change'),
          //Verify table row for Notice of Intention to Set Aside sent?
          expect(judgeExuiPages.decideFtpaApplicationSubmitPage.$questionLocator('Notice of Intention to Set Aside sent?')).toBeVisible(),
          expect(judgeExuiPages.decideFtpaApplicationSubmitPage.$questionValueLocator('Notice of Intention to Set Aside sent?')).toBeVisible(),
          expect(judgeExuiPages.decideFtpaApplicationSubmitPage.$questionValueLocator('Notice of Intention to Set Aside sent?')).toHaveText('Yes'),
          expect(
            judgeExuiPages.decideFtpaApplicationSubmitPage.$changeAnswerToQuestionLocator('Notice of Intention to Set Aside sent?'),
          ).toBeVisible(),
          expect(judgeExuiPages.decideFtpaApplicationSubmitPage.$changeAnswerToQuestionLocator('Notice of Intention to Set Aside sent?')).toHaveText(
            'Change',
          ),
          //Verify table row for List any objections to the draft Notice from either party
          expect(
            judgeExuiPages.decideFtpaApplicationSubmitPage.$questionLocator('List any objections to the draft Notice from either party'),
          ).toBeVisible(),
          expect(
            judgeExuiPages.decideFtpaApplicationSubmitPage.$questionValueLocator('List any objections to the draft Notice from either party'),
          ).toBeVisible(),
          expect(
            judgeExuiPages.decideFtpaApplicationSubmitPage.$questionValueLocator('List any objections to the draft Notice from either party'),
          ).toHaveText('Test reason to object draft notice of intention to set aside'),
          expect(
            judgeExuiPages.decideFtpaApplicationSubmitPage.$changeAnswerToQuestionLocator(
              'List any objections to the draft Notice from either party',
            ),
          ).toBeVisible(),
          expect(
            judgeExuiPages.decideFtpaApplicationSubmitPage.$changeAnswerToQuestionLocator(
              'List any objections to the draft Notice from either party',
            ),
          ).toHaveText('Change'),
          //Verify table row for Notice communication
          expect(judgeExuiPages.decideFtpaApplicationSubmitPage.$questionLocator('Notice communication')).toBeVisible(),
          expect(judgeExuiPages.decideFtpaApplicationSubmitPage.$static.noticeComunicationTabeleHeading).toBeVisible(),
          expect(judgeExuiPages.decideFtpaApplicationSubmitPage.$static.noticeComunicationTabeleHeading).toHaveText('Notice communication 1'),
          expect(judgeExuiPages.decideFtpaApplicationSubmitPage.$static.noticeComunicationDocumentRow).toBeVisible(),
          expect(judgeExuiPages.decideFtpaApplicationSubmitPage.$static.noticeComunicationDocumentRow).toHaveText('Document'),
          expect(judgeExuiPages.decideFtpaApplicationSubmitPage.$static.noticeComunicationDocumentValue).toBeVisible(),
          expect(judgeExuiPages.decideFtpaApplicationSubmitPage.$static.noticeComunicationDocumentValue).toHaveText(
            'Ftpa_Notice_Of_Intention_To_Set_A_Side.txt',
          ),
          expect(judgeExuiPages.decideFtpaApplicationSubmitPage.$static.noticeComunicationDocumentDescriptionRow).toBeVisible(),
          expect(judgeExuiPages.decideFtpaApplicationSubmitPage.$static.noticeComunicationDocumentDescriptionRow).toHaveText('Describe the document'),
          expect(judgeExuiPages.decideFtpaApplicationSubmitPage.$static.noticeComunicationDocumentDescriptionValue).toBeVisible(),
          expect(judgeExuiPages.decideFtpaApplicationSubmitPage.$static.noticeComunicationDocumentDescriptionValue).toHaveText(
            'Test description of document uploaded for objections to notice of intention to set aside',
          ),
          expect(judgeExuiPages.decideFtpaApplicationSubmitPage.$changeAnswerToQuestionLocator('Notice communication')).toBeVisible(),
          expect(judgeExuiPages.decideFtpaApplicationSubmitPage.$changeAnswerToQuestionLocator('Notice communication')).toHaveText('Change'),
          //Verify table row for Tick any applicable points
          expect(judgeExuiPages.decideFtpaApplicationSubmitPage.$questionLocator('Tick any applicable points')).toBeVisible(),
          expect(judgeExuiPages.decideFtpaApplicationSubmitPage.$static.tickAnyPointsTabeleHeading).toBeVisible(),
          expect(judgeExuiPages.decideFtpaApplicationSubmitPage.$static.tickAnyPointsRowItem.nth(0)).toBeVisible(),
          expect(judgeExuiPages.decideFtpaApplicationSubmitPage.$static.tickAnyPointsRowItem.nth(0)).toHaveText(
            'There is a point of special difficulty or importance',
          ),
          expect(judgeExuiPages.decideFtpaApplicationSubmitPage.$static.tickAnyPointsRowItem.nth(1)).toBeVisible(),
          expect(judgeExuiPages.decideFtpaApplicationSubmitPage.$static.tickAnyPointsRowItem.nth(1)).toHaveText(
            'There are special reasons, such as the need to request the First-tier Tribunal to provide observations on the grounds of appeal',
          ),
          expect(judgeExuiPages.decideFtpaApplicationSubmitPage.$static.tickAnyPointsRowItem.nth(2)).toBeVisible(),
          expect(judgeExuiPages.decideFtpaApplicationSubmitPage.$static.tickAnyPointsRowItem.nth(2)).toHaveText(
            "It's clear at this stage that the issue is likely to be used for giving country guidance",
          ),
          expect(judgeExuiPages.decideFtpaApplicationSubmitPage.$changeAnswerToQuestionLocator('Tick any applicable points')).toBeVisible(),
          expect(judgeExuiPages.decideFtpaApplicationSubmitPage.$changeAnswerToQuestionLocator('Tick any applicable points')).toHaveText('Change'),
          //Verify table row for Provide any information that may be helpful to the Upper Tribunal judge
          expect(
            judgeExuiPages.decideFtpaApplicationSubmitPage.$questionLocator(
              'Provide any information that may be helpful to the Upper Tribunal judge',
            ),
          ).toBeVisible(),
          expect(
            judgeExuiPages.decideFtpaApplicationSubmitPage.$questionValueLocator(
              'Provide any information that may be helpful to the Upper Tribunal judge',
            ),
          ).toBeVisible(),
          expect(
            judgeExuiPages.decideFtpaApplicationSubmitPage.$questionValueLocator(
              'Provide any information that may be helpful to the Upper Tribunal judge',
            ),
          ).toHaveText('Test information for upper tribunal'),
          expect(
            judgeExuiPages.decideFtpaApplicationSubmitPage.$changeAnswerToQuestionLocator(
              'Provide any information that may be helpful to the Upper Tribunal judge',
            ),
          ).toBeVisible(),
          expect(
            judgeExuiPages.decideFtpaApplicationSubmitPage.$changeAnswerToQuestionLocator(
              'Provide any information that may be helpful to the Upper Tribunal judge',
            ),
          ).toHaveText('Change'),
        ]);
        await judgeExuiPages.decideFtpaApplicationSubmitPage.submitDecision();

        await judgeExuiPages.decideFtpaApplicationConfirmPage.verifyUserIsOnPage();
        await judgeExuiPages.decideFtpaApplicationConfirmPage.verifyAllTextOnPage();
        await judgeExuiPages.decideFtpaApplicationConfirmPage.returnToCaseDetails();

        await judgeExuiPages.caseOverviewPage.verifyUserIsOnPage({});
        await judgeExuiPages.caseOverviewPage.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Decide FTPA application' });

        await Promise.all([
          expect(judgeExuiPages.caseOverviewPage.$static.doThisNextHeading).toBeVisible(),
          expect(judgeExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toBeVisible(),
          expect(judgeExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toHaveText('You must create a bundle for the Upper Tribunal.'),
          expect(judgeExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(1)).toBeVisible(),
          expect(judgeExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(1)).toHaveText('Generate the Upper Tribunal bundle'),
        ]);
      });

      await test.step('Judge user: Select Generate Upper Tribunal bundle event from next steps drop down and submit event', async () => {
        await judgeExuiPages.caseOverviewPage.selectEventFromDropdown({ eventToSelect: 'Generate Upper Tribunal bundle' });

        await judgeExuiPages.generateUpperTribunalBundleSubmitPage.verifyUserIsOnPage();
        await judgeExuiPages.generateUpperTribunalBundleSubmitPage.submitGenerateUpperTribunalEvent();

        await judgeExuiPages.generateUpperTribunalBundleConfirmPage.verifyUserIsOnPage();
        await judgeExuiPages.generateUpperTribunalBundleConfirmPage.verifyAllTextOnPage();
        await judgeExuiPages.generateUpperTribunalBundleConfirmPage.returnToCaseDetails();

        await judgeExuiPages.caseOverviewPage.verifyUserIsOnPage({});
        await judgeExuiPages.caseOverviewPage.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Generate Upper Tribunal bundle' });
        await Promise.all([
          expect(judgeExuiPages.caseOverviewPage.$static.whatHappensNextHeading).toBeVisible(),
          expect(judgeExuiPages.caseOverviewPage.$static.whatHappensNextParagraph.nth(0)).toBeVisible(),
          expect(judgeExuiPages.caseOverviewPage.$static.whatHappensNextParagraph.nth(0)).toHaveText(
            'The Upper Tribunal bundle is being generated. You will soon be able to view the bundle in the documents tab.',
          ),
          expect(judgeExuiPages.caseOverviewPage.$static.whatHappensNextParagraph.nth(1)).toBeVisible(),
          expect(judgeExuiPages.caseOverviewPage.$static.whatHappensNextParagraph.nth(1)).toHaveText(
            'If the bundle fails to generate, you will be notified and will need to generate the bundle again.',
          ),
        ]);

        await judgeExuiPages.caseOverviewPage.refreshPageUntilExpectedTextIsVisible({
          caseId: caseIdFromBeforeEach,
          expectedText: 'The Upper Tribunal bundle has been generated',
        });

        await Promise.all([
          expect(judgeExuiPages.caseOverviewPage.$static.whatHappensNextHeading).toBeVisible(),
          expect(judgeExuiPages.caseOverviewPage.$static.whatHappensNextParagraph.nth(0)).toBeVisible(),
          expect(judgeExuiPages.caseOverviewPage.$static.whatHappensNextParagraph.nth(0)).toHaveText(
            'The Upper Tribunal bundle has been generated and is available to view and download in the documents tab.',
          ),
          expect(judgeExuiPages.caseOverviewPage.$static.whatHappensNextParagraph.nth(1)).toBeVisible(),
          expect(judgeExuiPages.caseOverviewPage.$static.whatHappensNextParagraph.nth(1)).toHaveText('There is no further action required.'),
        ]);
      });

      await test.step('Citizen user: Verify judge has granted permission for application', async () => {
        await cui_apiClient.verifyAppealIsInExpectedStateViaAppealOverviewApi({
          expectedTextToBeOnAppealOverview: 'A judge has granted your application',
        });

        await cui_pages.appealOverviewPage.page.bringToFront();
        await cui_signOutAndBackIn({ email: citizenUser.email, password: citizenUser.password });

        await Promise.all([
          expect(cui_pages.appealOverviewPage.$static.doThisNextHeading).toBeVisible(),
          expect(cui_pages.appealOverviewPage.$static.applicantInstructionsWindow).toBeVisible(),
          expect(cui_pages.appealOverviewPage.$static.applicantInstructionsWindow).toContainText(
            'A judge has granted your application for permission to appeal to the Upper Tribunal.',
          ),
          expect(cui_pages.appealOverviewPage.$static.applicantInstructionsWindow).toContainText(
            'The Decision and Reasons document includes the reasons the judge made this decision. You should read it carefully.',
          ),
          expect(cui_pages.appealOverviewPage.$static.applicantInstructionsWindow).toContainText('Read the Decision and Reasons document'),
          expect(cui_pages.appealOverviewPage.$static.applicantInstructionsWindow).toContainText('What happens next'),
          expect(cui_pages.appealOverviewPage.$static.applicantInstructionsWindow).toContainText(
            "The Upper Tribunal will decide if the Tribunal's decision was wrong. The Upper Tribunal will contact you soon to tell you what will happen next.",
          ),
        ]);
      });
    },
  );
});
