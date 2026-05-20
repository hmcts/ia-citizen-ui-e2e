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
        const appealDetails = await cui_apiClient.completeAndSubmitAppealJourneyViaApi({
          appealType: 'EU Settlement Scheme',
          hasApplicantReceivedADeportationOrder: 'No',
          isApplicantStateless: true,
          nationality: 'Belgium',
          isUserInTheUk: 'Yes',
          doesApplicantHaveASponsor: 'No',
          decisionWithOrWithoutHearing: 'decisionWithHearing',
          isApplicationInTime: true,
          whetherApplicantHasToPayAFee: 'I got a fee waiver from the Home Office for my application to stay in the UK',
          appealSubmissionType: 'Non-Pay Appeal',
        });
        return appealDetails;
      });

      const caseId = await exui_adminOfficerApiClient.fetchCaseId({ homeOfficeReferenceNumber: appealDetails.homeOfficeReference.toString() });

      const adminOfficerExuiPages =
        await test.step('Admin User: Navigate to exui application overview page and verify correct next steps displayed', async () => {
          const adminOfficerNewBrowserContextAndPage = await newBrowserContextAndPage({ user: 'adminOfficer' });
          const adminOfficerExuiPages = await exui_pages.newBrowserContext({ pageContext: adminOfficerNewBrowserContextAndPage });

          await adminOfficerExuiPages.caseOverviewPage.goTo({ caseId: caseId });

          await Promise.all([
            expect(adminOfficerExuiPages.caseOverviewPage.$static.doThisNextHeading).toBeVisible(),
            expect(adminOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toHaveText(
              'An appeal has been submitted with a remission application. You need to review the remission details in the appeal tab.',
            ),
            expect(adminOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toBeVisible(),
            expect(adminOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(1)).toHaveText(
              'If you need more information to make a decision, you can contact the appellant.',
            ),
            expect(adminOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(1)).toBeVisible(),
            expect(adminOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(2)).toHaveText(
              'You then need to record your remission decision.',
            ),
            expect(adminOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(2)).toBeVisible(),
          ]);
          return adminOfficerExuiPages;
        });

      await test.step('Admin User: Select record remission decision from next steps dropdown and approve fee remission', async () => {
        await adminOfficerExuiPages.caseOverviewPage.selectEventFromDropdown({ eventToSelect: 'Record remission decision' });

        await adminOfficerExuiPages.recordRemissionDecisionPage.verifyUserIsOnPage();
        await adminOfficerExuiPages.recordRemissionDecisionPage.completePageAndContinue({ remissionDecision: 'approved' });

        await adminOfficerExuiPages.recordRemissionDecisionDetailsPage.verifyUserIsOnPage();
        await adminOfficerExuiPages.recordRemissionDecisionDetailsPage.completePageAndContinue({ amountRemitted: 140, amountLeftToPay: 0 });

        await adminOfficerExuiPages.recordRemissionDecisionSubmitPage.verifyUserIsOnPage();
        await adminOfficerExuiPages.recordRemissionDecisionSubmitPage.verifyCorrectInformationIsDisplayed({
          remissionDecision: 'approved',
          amountRemitted: 140,
          amountLeftToPay: 0,
        });
        await adminOfficerExuiPages.recordRemissionDecisionSubmitPage.submitRecordDecision();

        await adminOfficerExuiPages.recordRemissionDecisionConfirmPage.verifyUserIsOnPage();
        await adminOfficerExuiPages.recordRemissionDecisionConfirmPage.verifyAllTextOnPage({ remissionDecision: 'approved' });
        await adminOfficerExuiPages.recordRemissionDecisionConfirmPage.returnToCaseDetails();

        await adminOfficerExuiPages.caseOverviewPage.verifyUserIsOnPage({});
        await adminOfficerExuiPages.caseOverviewPage.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Record remission decision' });

        await Promise.all([
          expect(adminOfficerExuiPages.caseOverviewPage.$static.whatHappensNextHeading).toBeVisible(),
          expect(adminOfficerExuiPages.caseOverviewPage.$static.whatHappensNextParagraph.nth(0)).toHaveText(
            "The Tribunal Caseworker will review the appeal and decide if it's valid.",
          ),
          expect(adminOfficerExuiPages.caseOverviewPage.$static.whatHappensNextParagraph.nth(0)).toBeVisible(),
        ]);
      });

      const caseOfficerExuiPages =
        await test.step('Case Officer: Navigate to exui application overview page and verify correct next steps displayed', async () => {
          const caseOfficerExuiPages = exui_pages;
          await caseOfficerExuiPages.caseOverviewPage.page.bringToFront();
          await caseOfficerExuiPages.caseOverviewPage.goTo({ caseId: caseId });

          await Promise.all([
            expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextHeading).toBeVisible(),

            expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toHaveText(
              'You must review the appeal in the documents tab. If the appeal looks valid, you must tell the respondent to supply their evidence.',
            ),
            expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toBeVisible(),

            expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(1)).toHaveText('Request respondent evidence.'),
            expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(1)).toBeVisible(),
          ]);

          return caseOfficerExuiPages;
        });

      await test.step('Case Officer: Select request respondent evidence from next steps dropdown and submit event', async () => {
        await caseOfficerExuiPages.caseOverviewPage.selectEventFromDropdown({ eventToSelect: 'Request respondent evidence' });

        await caseOfficerExuiPages.requestRespondentEvidencePage.verifyUserIsOnPage();
        await caseOfficerExuiPages.requestRespondentEvidencePage.continueOnToNextPage();

        await caseOfficerExuiPages.requestRespondentEvidenceSubmitPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.requestRespondentEvidenceSubmitPage.sendDirection();

        await caseOfficerExuiPages.requestRespondentEvidenceConfirmPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.requestRespondentEvidenceConfirmPage.verifyAllTextOnPage();
        await caseOfficerExuiPages.requestRespondentEvidenceConfirmPage.returnToCaseDetails();

        await caseOfficerExuiPages.caseOverviewPage.verifyUserIsOnPage({});
        await caseOfficerExuiPages.caseOverviewPage.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Request respondent evidence' });

        await Promise.all([
          expect(caseOfficerExuiPages.caseOverviewPage.$static.whatHappensNextHeading).toBeVisible(),
          expect(caseOfficerExuiPages.caseOverviewPage.$static.whatHappensNextParagraph.nth(0)).toHaveText(
            'The Home Office will prepare their bundle.',
          ),
          expect(caseOfficerExuiPages.caseOverviewPage.$static.whatHappensNextParagraph.nth(0)).toBeVisible(),
        ]);
      });

      const homeOfficeUserExuiPages =
        await test.step('Home Office User: Navigate to exui application overview page and verify correct next steps displayed', async () => {
          const homeOfficeUserNewBrowserContextAndPage = await newBrowserContextAndPage({ user: 'homeOfficeUser' });
          const homeOfficeUserExuiPages = await exui_pages.newBrowserContext({ pageContext: homeOfficeUserNewBrowserContextAndPage });

          await homeOfficeUserExuiPages.caseOverviewPage.goTo({ caseId: caseId });

          await Promise.all([
            expect(homeOfficeUserExuiPages.caseOverviewPage.$static.doThisNextHeading).toBeVisible(),
            expect(homeOfficeUserExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toHaveText(
              'An appeal against the Home Office decision in this case has been submitted. You can view the appeal form in the documents tab.',
            ),
            expect(homeOfficeUserExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toBeVisible(),
            expect(homeOfficeUserExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(1)).toHaveText(
              'If you accept that there is a right of appeal you should upload the Home Office bundle.',
            ),
            expect(homeOfficeUserExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(1)).toBeVisible(),
            expect(homeOfficeUserExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(2)).toHaveText(
              'If you consider the appeal is not valid, you should contact the Tribunal and the appellant with your reasons.',
            ),
            expect(homeOfficeUserExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(2)).toBeVisible(),
          ]);
          return homeOfficeUserExuiPages;
        });

      await test.step('Home Office User: Select upload home office bundle from next steps dropdown and submit event', async () => {
        await homeOfficeUserExuiPages.caseOverviewPage.selectEventFromDropdown({ eventToSelect: 'Upload Home Office bundle' });

        await homeOfficeUserExuiPages.uploadHomeOfficeBundlePage.verifyUserIsOnPage();
        await homeOfficeUserExuiPages.uploadHomeOfficeBundlePage.completePageAndContinue({ description: 'Test upload of Home Office bundle' });

        await homeOfficeUserExuiPages.uploadHomeOfficeBundleSubmitPage.verifyUserIsOnPage();
        await homeOfficeUserExuiPages.uploadHomeOfficeBundleSubmitPage.verifyCorrectInformationIsDisplayed({
          fileDescription: 'Test upload of Home Office bundle',
        });
        await homeOfficeUserExuiPages.uploadHomeOfficeBundleSubmitPage.submitEvent();

        await homeOfficeUserExuiPages.uploadHomeOfficeBundleConfirmPage.verifyUserIsOnPage();
        await homeOfficeUserExuiPages.uploadHomeOfficeBundleConfirmPage.verifyAllTextOnPage();
        await homeOfficeUserExuiPages.uploadHomeOfficeBundleConfirmPage.returnToCaseDetails();

        await homeOfficeUserExuiPages.caseOverviewPage.verifyUserIsOnPage({});
        await homeOfficeUserExuiPages.caseOverviewPage.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Upload Home Office bundle' });

        await Promise.all([
          expect(homeOfficeUserExuiPages.caseOverviewPage.$static.doThisNextHeading).toBeVisible(),

          expect(homeOfficeUserExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toHaveText('The Tribunal will:'),
          expect(homeOfficeUserExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toBeVisible(),

          expect(homeOfficeUserExuiPages.caseOverviewPage.$static.doThisNextBulletPoint.nth(0)).toHaveText(
            'check that the bundle complies with the Procedural Rules and Practice Directions',
          ),
          expect(homeOfficeUserExuiPages.caseOverviewPage.$static.doThisNextBulletPoint.nth(0)).toBeVisible(),

          expect(homeOfficeUserExuiPages.caseOverviewPage.$static.doThisNextBulletPoint.nth(1)).toHaveText('inform you of any issues'),
          expect(homeOfficeUserExuiPages.caseOverviewPage.$static.doThisNextBulletPoint.nth(1)).toBeVisible(),

          expect(homeOfficeUserExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(1)).toHaveText(
            'The Home Office will be notified when the Appeal Skeleton Argument is ready to review.',
          ),
          expect(homeOfficeUserExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(1)).toBeVisible(),
        ]);
      });

      await test.step('Case Officer: Refresh application overview page and verify correct next steps are displayed', async () => {
        await caseOfficerExuiPages.caseOverviewPage.page.bringToFront();
        await caseOfficerExuiPages.caseOverviewPage.refreshPageUntilExpectedTextIsVisible({
          expectedText: 'The respondent has submitted their evidence.',
          caseId: caseId,
        });

        await Promise.all([
          expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextHeading).toBeVisible(),

          expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toHaveText('The respondent has submitted their evidence.'),
          expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toBeVisible(),

          expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(1)).toHaveText(
            'If it complies with the procedure rules and practice directions, direct the appellant to submit their Appeal Reasons.',
          ),
          expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(1)).toBeVisible(),

          expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(2)).toHaveText(
            'If it does not comply, direct the respondent to make the appropriate changes.',
          ),
          expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(2)).toBeVisible(),
        ]);
      });

      await test.step('Case Officer: Select Aip - request appeal reasons from next steps dropdown and submit event ', async () => {
        await caseOfficerExuiPages.caseOverviewPage.selectEventFromDropdown({ eventToSelect: 'AiP - Request Appeal Reasons' });

        await caseOfficerExuiPages.aipRequestAppealReasonsPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.aipRequestAppealReasonsPage.continueOnToNextPage();

        await caseOfficerExuiPages.aipRequestAppealReasonsSubmitPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.aipRequestAppealReasonsSubmitPage.sendDirection();

        await caseOfficerExuiPages.aipRequestAppealReasonsConfirmPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.aipRequestAppealReasonsConfirmPage.verifyAllTextOnPage();
        await caseOfficerExuiPages.aipRequestAppealReasonsConfirmPage.returnToCaseDetails();

        await caseOfficerExuiPages.caseOverviewPage.verifyUserIsOnPage({});
        await caseOfficerExuiPages.caseOverviewPage.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'AiP - Request Appeal Reasons' });

        await Promise.all([
          expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextHeading).toBeVisible(),

          expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toHaveText(
            'The appellant has been directed to submit their Appeal Reasons. You will be notified when it is ready to review.',
          ),
          expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toBeVisible(),
        ]);
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

      await test.step('Case Officer: Refresh application overview page and verify correct next steps are displayed', async () => {
        await caseOfficerExuiPages.caseOverviewPage.refreshPageUntilExpectedTextIsVisible({
          expectedText: "Review the appellant's case in the appeal tab.",
          caseId: caseId,
        });

        await Promise.all([
          expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextHeading).toBeVisible(),

          expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toHaveText(
            "Review the appellant's case in the appeal tab.",
          ),
          expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toBeVisible(),

          expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(1)).toHaveText(
            'If you believe the case is ready to proceed you should direct the respondent to review it.',
          ),
          expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(1)).toBeVisible(),

          expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(2)).toHaveText(
            "If you don't think it is ready, you should direct the appellant to answer clarifying questions or attend a case management appointment.",
          ),
          expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(2)).toBeVisible(),

          expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(3)).toHaveText('You can do this from the directions tab.'),
          expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(3)).toBeVisible(),
        ]);
      });

      await test.step('Case Officer: Select request respondent review from next steps dropdown and submit event', async () => {
        await caseOfficerExuiPages.caseOverviewPage.selectEventFromDropdown({ eventToSelect: 'Request respondent review' });

        await caseOfficerExuiPages.requestRespondentReviewPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.requestRespondentReviewPage.continueOnToNextPage();

        await caseOfficerExuiPages.requestRespondentReviewSubmitPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.requestRespondentReviewSubmitPage.sendDirection();

        await caseOfficerExuiPages.requestRespondentReviewConfirmPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.requestRespondentReviewConfirmPage.verifyAllTextOnPage();
        await caseOfficerExuiPages.requestRespondentReviewConfirmPage.returnToCaseDetails();

        await caseOfficerExuiPages.caseOverviewPage.verifyUserIsOnPage({});
        await caseOfficerExuiPages.caseOverviewPage.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Request respondent review' });

        await Promise.all([
          expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextHeading).toBeVisible(),

          expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toHaveText(
            "The respondent is reviewing the case, you'll be notified when their response has been uploaded.",
          ),
          expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toBeVisible(),
        ]);
      });

      await test.step('Home Office User: Refresh application overview page and verify correct next steps are displayed', async () => {
        await homeOfficeUserExuiPages.caseOverviewPage.page.bringToFront();
        await homeOfficeUserExuiPages.caseOverviewPage.refreshPageUntilExpectedTextIsVisible({
          expectedText: 'The Appeal Skeleton Argument is ready to view in the documents tab.',
          caseId: caseId,
        });

        await Promise.all([
          expect(homeOfficeUserExuiPages.caseOverviewPage.$static.doThisNextHeading).toBeVisible(),
          expect(homeOfficeUserExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toHaveText(
            'The Appeal Skeleton Argument is ready to view in the documents tab.',
          ),
          expect(homeOfficeUserExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toBeVisible(),
          expect(homeOfficeUserExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(1)).toHaveText(
            "Review the documents and add the Home Office's response, or make an application to withdraw.",
          ),
          expect(homeOfficeUserExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(1)).toBeVisible(),
        ]);
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
        await homeOfficeUserExuiPages.uploadHomeOfficeAppealResponseSubmitPage.verifyCorrectInformationIsDisplayed({
          appealReviewOutcome: 'Decision maintained',
        });
        await homeOfficeUserExuiPages.uploadHomeOfficeAppealResponseSubmitPage.submitEvent();

        await homeOfficeUserExuiPages.uploadHomeOfficeAppealResponseConfirmPage.verifyUserIsOnPage();
        await homeOfficeUserExuiPages.uploadHomeOfficeAppealResponseConfirmPage.verifyAllTextOnPage();
        await homeOfficeUserExuiPages.uploadHomeOfficeAppealResponseConfirmPage.returnToCaseDetails();

        await homeOfficeUserExuiPages.caseOverviewPage.verifyUserIsOnPage({});
        await homeOfficeUserExuiPages.caseOverviewPage.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Upload the appeal response' });

        await Promise.all([
          expect(homeOfficeUserExuiPages.caseOverviewPage.$static.doThisNextHeading).toBeVisible(),

          expect(homeOfficeUserExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toHaveText('The Tribunal will:'),
          expect(homeOfficeUserExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toBeVisible(),
          expect(homeOfficeUserExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(1)).toHaveText(
            '• check that the Home Office response complies with the Procedure Rules and Practice Directions',
          ),
          expect(homeOfficeUserExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(1)).toBeVisible(),
          expect(homeOfficeUserExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(2)).toHaveText('• inform you of any issues'),
          expect(homeOfficeUserExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(2)).toBeVisible(),
          expect(homeOfficeUserExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(3)).toHaveText(
            'Providing there are no issues, the response will be shared with the appellant.',
          ),
          expect(homeOfficeUserExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(3)).toBeVisible(),
          expect(homeOfficeUserExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(4)).toHaveText(
            'All parties will be notified when the Hearing Notice is ready.',
          ),
          expect(homeOfficeUserExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(4)).toBeVisible(),
        ]);
      });

      await test.step('Case Officer: Refresh application overview page and verify correct next steps are displayed', async () => {
        await caseOfficerExuiPages.caseOverviewPage.page.bringToFront();
        await caseOfficerExuiPages.caseOverviewPage.refreshPageUntilExpectedTextIsVisible({
          expectedText: 'Check the response uploaded by the respondent.',
          caseId: caseId,
        });

        await Promise.all([
          expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextHeading).toBeVisible(),

          expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toHaveText(
            'Check the response uploaded by the respondent.',
          ),
          expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toBeVisible(),

          expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(1)).toHaveText(
            'If it complies with the Procedure Rules and Practice Directions, direct the appellant to review the Home Office response.',
          ),
          expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(1)).toBeVisible(),

          expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(2)).toHaveText(
            'If it does not comply, direct the respondent to make the appropriate changes.',
          ),
          expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(2)).toBeVisible(),
        ]);
      });

      await test.step('Case Officer: Select review home office response from next steps dropdown and submit event', async () => {
        await caseOfficerExuiPages.caseOverviewPage.selectEventFromDropdown({ eventToSelect: 'Review Home Office response' });

        await caseOfficerExuiPages.reviewHomeOfficeResponsePage.verifyUserIsOnPage();
        await caseOfficerExuiPages.reviewHomeOfficeResponsePage.continueOnToNextPage();

        await caseOfficerExuiPages.reviewHomeOfficeResponseSubmitPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.reviewHomeOfficeResponseSubmitPage.submitEvent();

        await caseOfficerExuiPages.reviewHomeOfficeResponseConfirmPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.reviewHomeOfficeResponseConfirmPage.verifyAllTextOnPage();
        await caseOfficerExuiPages.reviewHomeOfficeResponseConfirmPage.returnToCaseDetails();

        await caseOfficerExuiPages.caseOverviewPage.verifyUserIsOnPage({});
        await caseOfficerExuiPages.caseOverviewPage.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Review Home Office response' });

        await Promise.all([
          expect(caseOfficerExuiPages.caseOverviewPage.$static.whatHappensNextHeading).toBeVisible(),
          expect(caseOfficerExuiPages.caseOverviewPage.$static.whatHappensNextParagraph.nth(0)).toHaveText(
            'The appellant has been directed to review the Home Office response.',
          ),
          expect(caseOfficerExuiPages.caseOverviewPage.$static.whatHappensNextParagraph.nth(0)).toBeVisible(),
          expect(caseOfficerExuiPages.caseOverviewPage.$static.whatHappensNextParagraph.nth(1)).toHaveText(
            'If they do not respond by the direction due date, the case automatically proceeds to a hearing.',
          ),
          expect(caseOfficerExuiPages.caseOverviewPage.$static.whatHappensNextParagraph.nth(1)).toBeVisible(),
        ]);
      });

      await test.step('Case Officer: Select request hearing requirements from next steps dropdown and submit event', async () => {
        await caseOfficerExuiPages.caseOverviewPage.selectEventFromDropdown({ eventToSelect: 'Request hearing requirements' });

        await caseOfficerExuiPages.requestHearingRequirementsPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.requestHearingRequirementsPage.submitEvent();

        await caseOfficerExuiPages.caseOverviewPage.verifyUserIsOnPage({});
        await caseOfficerExuiPages.caseOverviewPage.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Request hearing requirements' });

        await Promise.all([
          expect(caseOfficerExuiPages.caseOverviewPage.$static.whatHappensNextHeading).toBeVisible(),
          expect(caseOfficerExuiPages.caseOverviewPage.$static.whatHappensNextParagraph.nth(0)).toHaveText(
            'The appellant has been directed to submit their hearing requirements.',
          ),
          expect(caseOfficerExuiPages.caseOverviewPage.$static.whatHappensNextParagraph.nth(0)).toBeVisible(),
          expect(caseOfficerExuiPages.caseOverviewPage.$static.whatHappensNextParagraph.nth(1)).toHaveText(
            'If the appellant does not comply by the date indicated in the direction, you can proceed to a hearing without requirements.',
          ),
          expect(caseOfficerExuiPages.caseOverviewPage.$static.whatHappensNextParagraph.nth(1)).toBeVisible(),
        ]);
      });

      const hearingRequirementDetails = await test.step('Citizen Api: Submit hearing requirements', async () => {
        const hearingDetails = await cui_apiClient.commpleteAndSubmitHearingRequirementsJourneyViaApi({ pathToTake: 'Maximum Path' });
        return hearingDetails;
      });

      await test.step('Case Officer: Refresh application overview page and verify correct next steps are displayed', async () => {
        await caseOfficerExuiPages.caseOverviewPage.refreshPageUntilExpectedTextIsVisible({
          expectedText: 'You can view the hearing requirements and any requests for additional adjustments in the Hearing and appointment tab.',
          caseId: caseId,
        });

        await Promise.all([
          expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextHeading).toBeVisible(),
          expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toContainText(
            'You can view the hearing requirements and any requests for additional adjustments in the Hearing and appointment tab.',
          ),
          expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toContainText(
            'If you need more information, direct the appellant to answer clarifying questions.',
          ),
          expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toContainText(
            'If you do not need more information, review and record the hearing requirements and any additional adjustments.',
          ),
          expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toBeVisible(),
        ]);
      });

      await test.step('Case Officer: Select review hearing requirements from next steps dropdown and verify the correct information is displayed on page', async () => {
        await caseOfficerExuiPages.caseOverviewPage.selectEventFromDropdown({ eventToSelect: 'Review hearing requirements' });

        await caseOfficerExuiPages.reviewHearingRequirementsPage.verifyUserIsOnPage();

        await expect(async () => {
          await Promise.all([
            expect(caseOfficerExuiPages.reviewHearingRequirementsPage.$questionLocator('willTheAppellantAttendTheHearing')).not.toBeVisible(),
            expect(caseOfficerExuiPages.reviewHearingRequirementsPage.$questionValueLocator('willTheAppellantAttendTheHearing')).not.toBeVisible(),

            expect(caseOfficerExuiPages.reviewHearingRequirementsPage.$questionLocator('willAppellantGiveOralEvidence')).not.toBeVisible(),
            expect(caseOfficerExuiPages.reviewHearingRequirementsPage.$questionValueLocator('willAppellantGiveOralEvidence')).not.toBeVisible(),
          ]);
        }).toFail({ bugId: 'To be raised' });

        await Promise.all([
          expect(caseOfficerExuiPages.reviewHearingRequirementsPage.$static.caseRecordHeading).toBeVisible(),

          expect(caseOfficerExuiPages.reviewHearingRequirementsPage.$static.hearingrequirementsDescription).toHaveText(
            "Review the appellant's hearing requirements and select length of hearing.",
          ),
          expect(caseOfficerExuiPages.reviewHearingRequirementsPage.$static.hearingrequirementsDescription).toBeVisible(),

          expect(caseOfficerExuiPages.reviewHearingRequirementsPage.$questionLocator('willAnyWitnessesAttendTheHearing')).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsPage.$questionValueLocator('willAnyWitnessesAttendTheHearing')).toHaveText('Yes'),

          expect(caseOfficerExuiPages.reviewHearingRequirementsPage.$questionLocator('witnessDetails')).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsPage.$questionValueLocator('witnessDetails')).toHaveText(
            `Name		${hearingRequirementDetails.hearingWitnessFlow.witnessName}`,
          ),

          expect(
            caseOfficerExuiPages.reviewHearingRequirementsPage.$questionLocator('willApellantOrAnyOneElseGiveOralEvidenceOutsideUk'),
          ).toBeVisible(),
          expect(
            caseOfficerExuiPages.reviewHearingRequirementsPage.$questionValueLocator('willApellantOrAnyOneElseGiveOralEvidenceOutsideUk'),
          ).toHaveText('Yes'),

          expect(caseOfficerExuiPages.reviewHearingRequirementsPage.$questionLocator('doYouNeedAnyInterpreterServices')).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsPage.$questionValueLocator('doYouNeedAnyInterpreterServices')).toHaveText('Yes'),

          caseOfficerExuiPages.reviewHearingRequirementsPage.verifyAppellantAndOrWitnessesInterpreterRequirements({
            appellantSignLanguage: hearingRequirementDetails.hearingAccessNeedsFlow.typeOfInterpretorSupport?.applicantSignInterpretorLanguage,
            appellantSpokenLanguage: hearingRequirementDetails.hearingAccessNeedsFlow.typeOfInterpretorSupport?.applicantSpokenInterpretorLanguage,
            witnessNames: hearingRequirementDetails.hearingWitnessFlow.witnessName,
            witnessSignLanguage: hearingRequirementDetails.hearingAccessNeedsFlow.typeOfInterpretorSupport?.witnessSignInterpretorLanguage,
            witnessSpokenlanguage: hearingRequirementDetails.hearingAccessNeedsFlow.typeOfInterpretorSupport?.witnessSpokenInterpretorLanguage,
          }),

          expect(caseOfficerExuiPages.reviewHearingRequirementsPage.$questionLocator('willAnyWitnessesRequireInterpreterServices')).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsPage.$questionValueLocator('willAnyWitnessesRequireInterpreterServices')).toHaveText(
            'Yes',
          ),

          expect(caseOfficerExuiPages.reviewHearingRequirementsPage.$questionLocator('doYouNeedRoomWithStepFreeAccess')).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsPage.$questionValueLocator('doYouNeedRoomWithStepFreeAccess')).toHaveText('Yes'),

          expect(caseOfficerExuiPages.reviewHearingRequirementsPage.$questionLocator('doYouNeedHearingLoop')).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsPage.$questionValueLocator('doYouNeedHearingLoop')).toHaveText('Yes'),

          expect(caseOfficerExuiPages.reviewHearingRequirementsPage.$static.listingLengthHeading).toBeVisible(),

          expect(caseOfficerExuiPages.reviewHearingRequirementsPage.$static.listingLengthHoursLabel).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsPage.$static.listingLengthHoursLabel).toHaveText('Hours'),

          expect(caseOfficerExuiPages.reviewHearingRequirementsPage.$inputs.listingLengthHoursInput).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsPage.$inputs.listingLengthHoursInput).toHaveValue('2'),

          expect(caseOfficerExuiPages.reviewHearingRequirementsPage.$static.listingLengthMinutesLabel).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsPage.$static.listingLengthMinutesLabel).toHaveText('Minutes'),

          expect(caseOfficerExuiPages.reviewHearingRequirementsPage.$inputs.listingLengthMinutesInput).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsPage.$inputs.listingLengthMinutesInput).toHaveValue('0'),

          expect(caseOfficerExuiPages.reviewHearingRequirementsPage.$static.continueToSeeAddtionalAdjustmentsText).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsPage.$static.continueToSeeAddtionalAdjustmentsText).toHaveText(
            'Continue to see requests for additional adjustments.',
          ),
        ]);
      });

      await test.step('Case Officer: Continue through remaining pages in order to approve hearing requirements and submit event', async () => {
        await caseOfficerExuiPages.reviewHearingRequirementsPage.continueOntoNextPage();

        await caseOfficerExuiPages.reviewHearingRequirementsRemoteHearingPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.reviewHearingRequirementsRemoteHearingPage.verifyAllTextAndAnswersOnPage({ anythingForTribunalToConsider: 'No' });
        await caseOfficerExuiPages.reviewHearingRequirementsRemoteHearingPage.completePageAndContinue({
          isRemoteHearingAllowed: 'Granted',
          description: 'Granted request for remote hearing',
        });

        await caseOfficerExuiPages.reviewHearingRequirementsPersonalVulnerabilitiesPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.reviewHearingRequirementsPersonalVulnerabilitiesPage.verifyAllTextAndAnswersOnPage({
          doesAppellantHavePhysicalOrMentalHealthIssues: 'Yes',
          detailOfRequest: hearingRequirementDetails.hearingOtherNeedsFlow.howManyPhysicalOrMentalHealthConditions,
        });
        await caseOfficerExuiPages.reviewHearingRequirementsPersonalVulnerabilitiesPage.completePageAndContinue({
          isVulnerabilitiesAllowed: 'Granted',
          description: 'Granted request for vulnerabilities',
        });

        await caseOfficerExuiPages.reviewHearingRequirementsMultimediaEvidencePage.verifyUserIsOnPage();
        await caseOfficerExuiPages.reviewHearingRequirementsMultimediaEvidencePage.verifyAllTextAndAnswersOnPage({
          doYouHaveMultimediaEvidence: 'Yes',
          detailOfRequest: hearingRequirementDetails.hearingOtherNeedsFlow.reasonUnableToBringEquipment,
        });
        await caseOfficerExuiPages.reviewHearingRequirementsMultimediaEvidencePage.completePageAndContinue({
          isMultimediaAllowed: 'Granted',
          description: 'Granted request for multimedia evidence',
        });

        await caseOfficerExuiPages.reviewHearingRequirementsSingleSexCourtPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.reviewHearingRequirementsSingleSexCourtPage.verifyAllTextAndAnswersOnPage({
          doesAppellantNeedSingleSexCourt: 'Yes',
          typeOfCourt: hearingRequirementDetails.hearingOtherNeedsFlow.allMaleOrFemaleHearing!,
          detailOfRequest: hearingRequirementDetails.hearingOtherNeedsFlow.reasonForSingleSexHearing,
        });
        await caseOfficerExuiPages.reviewHearingRequirementsSingleSexCourtPage.completePageAndContinue({
          isSingleSexCourtAllowed: 'Granted',
          description: 'Granted request for single sex court',
        });

        await caseOfficerExuiPages.reviewHearingRequirementsInCameraCourtPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.reviewHearingRequirementsInCameraCourtPage.verifyAllTextAndAnswersOnPage({
          doesAppellantNeedInCameraCourt: 'Yes',
          detailOfRequest: hearingRequirementDetails.hearingOtherNeedsFlow.reasonForPrivateHearing,
        });
        await caseOfficerExuiPages.reviewHearingRequirementsInCameraCourtPage.completePageAndContinue({
          isInCameraCourtAllowed: 'Granted',
          description: 'Granted request for in camera court',
        });

        await caseOfficerExuiPages.reviewHearingRequirementsAddtionalRequirementsPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.reviewHearingRequirementsAddtionalRequirementsPage.verifyAllTextAndAnswersOnPage({
          wouldYouLikeToRequestAddtionalRequirements: 'Yes',
          detailOfRequest: hearingRequirementDetails.hearingOtherNeedsFlow.needAnythingElseDetails,
        });
        await caseOfficerExuiPages.reviewHearingRequirementsAddtionalRequirementsPage.completePageAndContinue({
          isAdditionalAdjustmentAllowed: 'Granted',
          description: 'Granted request for additional requirements',
        });

        await caseOfficerExuiPages.reviewHearingRequirementsHearingChannelPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.reviewHearingRequirementsHearingChannelPage.completePageAndContinue({ hearingChannel: 'Video' });

        await caseOfficerExuiPages.reviewHearingRequirementsAppealSuitableToFloatPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.reviewHearingRequirementsAppealSuitableToFloatPage.completePageAndContinue({
          isAppealSuitableToFloat: 'Yes',
        });

        await caseOfficerExuiPages.reviewHearingRequirementsAdditionalIntructionsPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.reviewHearingRequirementsAdditionalIntructionsPage.completePageAndContinue({
          anyAddtionalIntructions: 'Yes',
          instruction: 'Please ensure the hearing is listed in a building with step free access',
        });

        await caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.verifyUserIsOnPage();
        await Promise.all([
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$static.caseRecordHeading).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$static.listingLengthTableHeading).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$static.hoursLabel).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$static.hoursValue).toHaveText('2'),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$static.hoursValue).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$static.minutesLabel).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$static.minutesValue).toHaveText('0'),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$static.minutesValue).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Listing length')).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Listing length')).toHaveText('Change'),

          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionLocator('Remote hearing decision')).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Remote hearing decision')).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Remote hearing decision')).toHaveText('Granted'),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Remote hearing decision')).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Remote hearing decision')).toHaveText(
            'Change',
          ),

          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionLocator('Remote hearing')).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Remote hearing')).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Remote hearing')).toHaveText(
            'Granted request for remote hearing',
          ),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Remote hearing')).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Remote hearing')).toHaveText('Change'),

          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionLocator('Vulnerabilities decision')).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Vulnerabilities decision')).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Vulnerabilities decision')).toHaveText('Granted'),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Vulnerabilities decision')).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Vulnerabilities decision')).toHaveText(
            'Change',
          ),

          expect(
            caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionLocator('Adjustments to accommodate vulnerabilities'),
          ).toBeVisible(),
          expect(
            caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Adjustments to accommodate vulnerabilities'),
          ).toBeVisible(),
          expect(
            caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Adjustments to accommodate vulnerabilities'),
          ).toHaveText('Granted request for vulnerabilities'),
          expect(
            caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Adjustments to accommodate vulnerabilities'),
          ).toBeVisible(),
          expect(
            caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Adjustments to accommodate vulnerabilities'),
          ).toHaveText('Change'),

          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionLocator('Multimedia decision')).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Multimedia decision')).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Multimedia decision')).toHaveText('Granted'),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Multimedia decision')).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Multimedia decision')).toHaveText('Change'),

          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionLocator('Multimedia equipment')).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Multimedia equipment')).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Multimedia equipment')).toHaveText(
            'Granted request for multimedia evidence',
          ),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Multimedia equipment')).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Multimedia equipment')).toHaveText(
            'Change',
          ),

          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionLocator('Single-sex court decision')).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Single-sex court decision')).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Single-sex court decision')).toHaveText('Granted'),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Single-sex court decision')).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Single-sex court decision')).toHaveText(
            'Change',
          ),

          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionLocator('Single-sex court')).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Single-sex court')).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Single-sex court')).toHaveText(
            'Granted request for single sex court',
          ),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Single-sex court')).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Single-sex court')).toHaveText('Change'),

          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionLocator('In camera court decision')).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionValueLocator('In camera court decision')).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionValueLocator('In camera court decision')).toHaveText('Granted'),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('In camera court decision')).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('In camera court decision')).toHaveText(
            'Change',
          ),

          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionLocator('In camera court')).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionValueLocator('In camera court')).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionValueLocator('In camera court')).toHaveText(
            'Granted request for in camera court',
          ),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('In camera court')).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('In camera court')).toHaveText('Change'),

          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionLocator('Other adjustments decision')).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Other adjustments decision')).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Other adjustments decision')).toHaveText('Granted'),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Other adjustments decision')).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Other adjustments decision')).toHaveText(
            'Change',
          ),

          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionLocator('Other adjustments')).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Other adjustments')).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Other adjustments')).toHaveText(
            'Granted request for additional requirements',
          ),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Other adjustments')).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Other adjustments')).toHaveText('Change'),

          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionLocator('What type of hearing is required?')).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionValueLocator('What type of hearing is required?')).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionValueLocator('What type of hearing is required?')).toHaveText(
            'Video',
          ),
          expect(
            caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('What type of hearing is required?'),
          ).toBeVisible(),
          expect(
            caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('What type of hearing is required?'),
          ).toHaveText('Change'),

          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionLocator('Is the appeal suitable to float?')).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Is the appeal suitable to float?')).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Is the appeal suitable to float?')).toHaveText(
            'Yes',
          ),
          expect(
            caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Is the appeal suitable to float?'),
          ).toBeVisible(),
          expect(
            caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Is the appeal suitable to float?'),
          ).toHaveText('Change'),

          expect(
            caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionLocator('Are there any additional instructions for the hearing?'),
          ).toBeVisible(),
          expect(
            caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Are there any additional instructions for the hearing?'),
          ).toBeVisible(),
          expect(
            caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Are there any additional instructions for the hearing?'),
          ).toHaveText('Yes'),
          expect(
            caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator(
              'Are there any additional instructions for the hearing?',
            ),
          ).toBeVisible(),
          expect(
            caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator(
              'Are there any additional instructions for the hearing?',
            ),
          ).toHaveText('Change'),

          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionLocator('Additional Instructions')).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Additional Instructions')).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Additional Instructions')).toHaveText(
            'Please ensure the hearing is listed in a building with step free access',
          ),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Additional Instructions')).toBeVisible(),
          expect(caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Additional Instructions')).toHaveText(
            'Change',
          ),
        ]);

        await caseOfficerExuiPages.reviewHearingRequirementsSubmitPage.submitEvent();

        await caseOfficerExuiPages.reviewHearingRequirementsConfirmPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.reviewHearingRequirementsConfirmPage.verifyAllTextOnPage();
        await caseOfficerExuiPages.reviewHearingRequirementsConfirmPage.returnToCaseDetails();

        await caseOfficerExuiPages.caseOverviewPage.verifyUserIsOnPage({});
        await caseOfficerExuiPages.caseOverviewPage.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Review hearing requirements' });

        await Promise.all([
          expect(caseOfficerExuiPages.caseOverviewPage.$static.whatHappensNextHeading).toBeVisible(),
          expect(caseOfficerExuiPages.caseOverviewPage.$static.whatHappensNextParagraph.nth(0)).toContainText(
            'The agreed hearing requirements and adjustments have been recorded.',
          ),
          expect(caseOfficerExuiPages.caseOverviewPage.$static.whatHappensNextParagraph.nth(0)).toContainText(
            'The listing team will now list the case.',
          ),
          expect(caseOfficerExuiPages.caseOverviewPage.$static.whatHappensNextParagraph.nth(0)).toBeVisible(),
        ]);
      });

      await test.step('Admin User: Refresh application overview page and verify correct next steps are displayed', async () => {
        await adminOfficerExuiPages.caseOverviewPage.page.bringToFront();
        await adminOfficerExuiPages.caseOverviewPage.refreshPageUntilExpectedTextIsVisible({
          expectedText: 'The agreed hearing requirements and dates to avoid are available to view',
          caseId: caseId,
        });

        await Promise.all([
          await expect(adminOfficerExuiPages.caseOverviewPage.$static.doThisNextHeading).toBeVisible(),
          await expect(adminOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toContainText(
            'The agreed hearing requirements and dates to avoid are available to view in the Hearing and appointment tab. You should request a hearing from the Hearings tab.',
          ),
          await expect(adminOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toBeVisible(),
        ]);
      });

      /*       await test.step('Admin User: Request a hearing from the hearings tab', async () => {
        await adminOfficerExuiPages.caseOverviewPage.navigateToTab({ tabToSelect: 'Hearings' });
        await adminOfficerExuiPages.hearingsPage.verifyUserIsOnPage();
        await adminOfficerExuiPages.hearingsPage.navigateToRequestHearingPage();

        await adminOfficerExuiPages.hearingRequirementsPage.verifyUserIsOnPage();
        const applicantName = `${appealDetails.applicantDetails.givenNames} ${appealDetails.applicantDetails.familyName}`;
        const witnessName = hearingRequirementDetails.hearingWitnessFlow.witnessName;
        if (witnessName === undefined) {
          throw new Error('Witness can not be undefined for the assertions included in this test step');
        }

        await adminOfficerExuiPages.hearingRequirementsPage.verifyTextForApplicant({ applicantName: applicantName });
        await adminOfficerExuiPages.hearingRequirementsPage.verifyTableHeadingsForIndividual({ name: applicantName });
        await adminOfficerExuiPages.hearingRequirementsPage.verifyTableHeadingsForIndividual({ name: witnessName });

        await adminOfficerExuiPages.hearingRequirementsPage.verifyRequirementRequestedByIndividual({
          name: applicantName,
          requirementRequested: 'Step free / wheelchair access',
          flagStatus: 'ACTIVE',
        });

        await adminOfficerExuiPages.hearingRequirementsPage.verifyRequirementRequestedByIndividual({
          name: applicantName,
          requirementRequested: 'Hearing loop (hearing enhancement system)',
          flagStatus: 'ACTIVE',
        });

        await adminOfficerExuiPages.hearingRequirementsPage.verifyRequirementRequestedByIndividual({
          name: applicantName,
          requirementRequested: 'Sign Language Interpreter',
          comments: hearingRequirementDetails.hearingAccessNeedsFlow.typeOfInterpretorSupport?.applicantSignInterpretorLanguage,
          flagStatus: 'ACTIVE',
        });

        await adminOfficerExuiPages.hearingRequirementsPage.verifyRequirementRequestedByIndividual({
          name: applicantName,
          requirementRequested: 'Language Interpreter',
          comments: hearingRequirementDetails.hearingAccessNeedsFlow.typeOfInterpretorSupport?.applicantSpokenInterpretorLanguage,
          flagStatus: 'ACTIVE',
        });

        await adminOfficerExuiPages.hearingRequirementsPage.verifyRequirementRequestedByIndividual({
          name: witnessName,
          requirementRequested: 'Sign Language Interpreter',
          comments: hearingRequirementDetails.hearingAccessNeedsFlow.typeOfInterpretorSupport?.witnessSignInterpretorLanguage,
          flagStatus: 'ACTIVE',
        });

        await adminOfficerExuiPages.hearingRequirementsPage.verifyRequirementRequestedByIndividual({
          name: witnessName,
          requirementRequested: 'Language Interpreter',
          comments: hearingRequirementDetails.hearingAccessNeedsFlow.typeOfInterpretorSupport?.witnessSpokenInterpretorLanguage,
          flagStatus: 'ACTIVE',
        });

        await adminOfficerExuiPages.hearingRequirementsPage.continueOnToNextPage();

        await adminOfficerExuiPages.hearingFacilitiesPage.verifyUserIsOnPage();
        await adminOfficerExuiPages.hearingFacilitiesPage.verifyTextForApplicant({ applicantName: applicantName });
        await adminOfficerExuiPages.hearingFacilitiesPage.verifyTableHeadingsForApplicant({ applicantName: applicantName });
        await adminOfficerExuiPages.hearingFacilitiesPage.verifyRequirementsRequestedByApplicant({
          applicantName: applicantName,
          requirementRequested: 'Evidence given in private',
          flagStatus: 'ACTIVE',
        });

        await adminOfficerExuiPages.hearingFacilitiesPage.verifyRequirementsRequestedByApplicant({
          applicantName: applicantName,
          requirementRequested: 'Audio/Video Evidence',
          flagStatus: 'ACTIVE',
        });

        await adminOfficerExuiPages.hearingFacilitiesPage.continueOnToNextPage();

        await adminOfficerExuiPages.hearingStagePage.verifyUserIsOnPage();
        await adminOfficerExuiPages.hearingStagePage.verifyAllTextForApplicant({ applicantName: applicantName });
        await adminOfficerExuiPages.hearingStagePage.completePageAndContinue({ hearingStage: 'Substantive' });

        await adminOfficerExuiPages.hearingAttendancePage.verifyUserIsOnPage();
        await adminOfficerExuiPages.hearingAttendancePage.completePageAndContinue({
          applicantName: applicantName,
          witnessNames: [witnessName],
          howWillEachParticipantAttend: 'Video',
          numberOfPeopleAttendingInPerson: 4,
        });

        await adminOfficerExuiPages.hearingVenuePage.verifyUserIsOnPage();
        await adminOfficerExuiPages.hearingVenuePage.completePageAndContinue({ applicantName: applicantName, location: 'Newport' });

        await adminOfficerExuiPages.hearingWelshPage.verifyUserIsOnPage();
        await adminOfficerExuiPages.hearingWelshPage.completePageAndContinue({ applicantName: applicantName, isWelshHearingRequired: 'No' });

        await adminOfficerExuiPages.hearingJudgePage.verifyUserIsOnPage();
        await expect(adminOfficerExuiPages.hearingJudgePage.page.getByRole('radio', { name: 'No' })).toBeChecked();
        await expect(adminOfficerExuiPages.hearingJudgePage.page.getByRole('checkbox', { name: 'Tribunal Judge' })).toBeChecked();
        await adminOfficerExuiPages.hearingJudgePage.completePageAndContinue({
          applicantName: applicantName,
        });

        await adminOfficerExuiPages.hearingPanelPage.verifyUserIsOnPage();
        await adminOfficerExuiPages.hearingPanelPage.completePageAndContinue({ doYouRequireAPanel: 'No' });

        await adminOfficerExuiPages.hearingTimingPage.verifyUserIsOnPage();
        await adminOfficerExuiPages.hearingTimingPage.completePageAndContinue({ hearingNeedsSpecificDate: 'No' });

        await adminOfficerExuiPages.hearingLinkPage.verifyUserIsOnPage();
        await adminOfficerExuiPages.hearingLinkPage.completePageAndContinue({ willThisHearingBeLinkedToOthers: 'No' });

        await adminOfficerExuiPages.hearingAdditionalInstructionsPage.verifyUserIsOnPage();
        await adminOfficerExuiPages.hearingAdditionalInstructionsPage.completePageAndContinue({});

        await adminOfficerExuiPages.hearingCreateEditSummaryPage.verifyUserIsOnPage();
        await adminOfficerExuiPages.hearingCreateEditSummaryPage.submitRequest();

        await adminOfficerExuiPages.hearingConfirmationPage.verifyUserIsOnPage();
        await adminOfficerExuiPages.hearingConfirmationPage.clickViewStatusOfHearingInHearingsTabLink();

        await adminOfficerExuiPages.hearingsPage.verifyUserIsOnPage();
        await expect(adminOfficerExuiPages.hearingsPage.$static.currentAndUpcommingHearingsTableRow).toHaveCount(1);
      }); */

      await test.step('Admin user: Select list case from next steps dropdown and submit event', async () => {
        await adminOfficerExuiPages.caseOverviewPage.selectEventFromDropdown({ eventToSelect: 'List the case' });

        await adminOfficerExuiPages.listCasePage.verifyUserIsOnPage();
        const listingReference = await adminOfficerExuiPages.listCasePage.completePageAndContinue({
          listingLocation: 'Newport Tribunal Centre - Columbus House',
          remoteHearing: 'Yes',
          dateToSet: 'tomorrow',
          hourToSet: 13,
        });

        const expectedDate = (await dataUtils.getDateFromToday({ dayOffset: 1 })).full;
        await adminOfficerExuiPages.listCaseSubmitPage.verifyUserIsOnPage();
        await Promise.all([
          expect(adminOfficerExuiPages.listCaseSubmitPage.$static.caseRecordHeading).toBeVisible(),
          expect(adminOfficerExuiPages.listCaseSubmitPage.$static.checkYouAnswersHeading).toBeVisible(),
          expect(adminOfficerExuiPages.listCaseSubmitPage.$static.checkInformationCarefullyText).toBeVisible(),
          expect(adminOfficerExuiPages.listCaseSubmitPage.$questionLocator('Listing reference')).toBeVisible(),
          expect(adminOfficerExuiPages.listCaseSubmitPage.$questionValueLocator('Listing reference')).toHaveText(listingReference),
          expect(adminOfficerExuiPages.listCaseSubmitPage.$questionLocator('Listing location')).toBeVisible(),
          expect(adminOfficerExuiPages.listCaseSubmitPage.$questionValueLocator('Listing location')).toHaveText(
            'Newport Tribunal Centre - Columbus House',
          ),
          expect(adminOfficerExuiPages.listCaseSubmitPage.$questionLocator('Will the hearing be held remotely?')).toBeVisible(),
          expect(adminOfficerExuiPages.listCaseSubmitPage.$questionValueLocator('Will the hearing be held remotely?')).toHaveText('Yes'),
          expect(adminOfficerExuiPages.listCaseSubmitPage.$static.listingLengthText).toBeVisible(),
          expect(adminOfficerExuiPages.listCaseSubmitPage.$static.listingLengthTableHeading).toBeVisible(),
          expect(adminOfficerExuiPages.listCaseSubmitPage.$static.hoursLabel).toBeVisible(),
          expect(adminOfficerExuiPages.listCaseSubmitPage.$static.hoursValue).toHaveText('2'),
          expect(adminOfficerExuiPages.listCaseSubmitPage.$static.hoursValue).toBeVisible(),
          expect(adminOfficerExuiPages.listCaseSubmitPage.$static.minutesLabel).toBeVisible(),
          expect(adminOfficerExuiPages.listCaseSubmitPage.$static.minutesValue).toHaveText('0'),
          expect(adminOfficerExuiPages.listCaseSubmitPage.$static.minutesValue).toBeVisible(),
          expect(adminOfficerExuiPages.listCaseSubmitPage.$questionLocator('Date and time')).toBeVisible(),
          expect(adminOfficerExuiPages.listCaseSubmitPage.$questionValueLocator('Date and time')).toHaveText(`${expectedDate}, 1:00:00 PM`),
        ]);
        await adminOfficerExuiPages.listCaseSubmitPage.listCase();

        await adminOfficerExuiPages.listCaseConfirmPage.verifyUserIsOnPage();
        await adminOfficerExuiPages.listCaseConfirmPage.verifyAllTextOnPage();
        await adminOfficerExuiPages.listCaseConfirmPage.returnToCaseDetails();

        await adminOfficerExuiPages.caseOverviewPage.verifyUserIsOnPage({});
        await adminOfficerExuiPages.caseOverviewPage.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'List the case' });
        await Promise.all([
          await expect(adminOfficerExuiPages.caseOverviewPage.$static.whatHappensNextHeading).toBeVisible(),
          await expect(adminOfficerExuiPages.caseOverviewPage.$static.whatHappensNextParagraph.nth(0)).toBeVisible(),
          await expect(adminOfficerExuiPages.caseOverviewPage.$static.whatHappensNextParagraph.nth(0)).toHaveText(
            'The Notice of Hearing will be sent to all parties.',
          ),
        ]);
      });

      await test.step('Case Officer: Refresh application overview page and verify correct next steps are displayed', async () => {
        await caseOfficerExuiPages.caseOverviewPage.page.bringToFront();
        await caseOfficerExuiPages.caseOverviewPage.refreshPageUntilExpectedTextIsVisible({
          expectedText: 'You must create a case summary for the judge to use at the hearing.',
          caseId: caseId,
        });

        await Promise.all([
          expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextHeading).toBeVisible(),
          expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toHaveText(
            'You must create a case summary for the judge to use at the hearing.',
          ),
          expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toBeVisible(),
          expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(1)).toHaveText('Create case summary'),
          expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(1)).toBeVisible(),
        ]);
      });

      await test.step('Case Officer: Select Create case summary from next steps dropdown and submit event', async () => {
        await caseOfficerExuiPages.caseOverviewPage.selectEventFromDropdown({ eventToSelect: 'Create case summary' });
        await caseOfficerExuiPages.createCaseSummaryPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.createCaseSummaryPage.completePageAndContinue({ description: 'This is a test case summary description' });

        await caseOfficerExuiPages.createCaseSummarySubmitPage.verifyUserIsOnPage();
        await Promise.all([
          await expect(caseOfficerExuiPages.createCaseSummarySubmitPage.$static.caseRecordHeading).toBeVisible(),
          await expect(caseOfficerExuiPages.createCaseSummarySubmitPage.$static.checkYouAnswersHeading).toBeVisible(),
          await expect(caseOfficerExuiPages.createCaseSummarySubmitPage.$static.checkInformationCarefullyText).toBeVisible(),
          await expect(caseOfficerExuiPages.createCaseSummarySubmitPage.$questionLocator('Case summary document')).toBeVisible(),
          await expect(caseOfficerExuiPages.createCaseSummarySubmitPage.$questionValueLocator('Case summary document')).toBeVisible(),
          await expect(caseOfficerExuiPages.createCaseSummarySubmitPage.$questionValueLocator('Case summary document')).toHaveText(
            'Create_Case_Summary.txt',
          ),
          await expect(caseOfficerExuiPages.createCaseSummarySubmitPage.$changeAnswerToQuestionLocator('Case summary document')).toBeVisible(),
          await expect(caseOfficerExuiPages.createCaseSummarySubmitPage.$questionLocator('Describe the document')).toBeVisible(),
          await expect(caseOfficerExuiPages.createCaseSummarySubmitPage.$questionValueLocator('Describe the document')).toBeVisible(),
          await expect(caseOfficerExuiPages.createCaseSummarySubmitPage.$questionValueLocator('Describe the document')).toHaveText(
            'This is a test case summary description',
          ),
          await expect(caseOfficerExuiPages.createCaseSummarySubmitPage.$changeAnswerToQuestionLocator('Describe the document')).toBeVisible(),
        ]);
        await caseOfficerExuiPages.createCaseSummarySubmitPage.uploadDocument();

        await caseOfficerExuiPages.createCaseSummaryConfirmPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.createCaseSummaryConfirmPage.verifyAllTextOnPage();
        await caseOfficerExuiPages.createCaseSummaryConfirmPage.returnToCaseDetails();

        await caseOfficerExuiPages.caseOverviewPage.verifyUserIsOnPage({});
        await caseOfficerExuiPages.caseOverviewPage.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Create case summary' });
        await Promise.all([
          await expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextHeading).toBeVisible(),
          await expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toBeVisible(),
          await expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toHaveText(
            'You must create a hearing bundle for all parties to use in the hearing. You should first review the documents in the documents tab.',
          ),
          await expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(1)).toBeVisible(),
          await expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(1)).toHaveText(
            'If you happy with the documents, generate the hearing bundle.',
          ),
          await expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(2)).toBeVisible(),
          await expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(2)).toHaveText(
            'If you want to add or remove any documents, you can customise hearing bundle',
          ),
        ]);
      });

      await test.step('Case Officer: Select Generate hearing bundle from next steps dropdown and submit event', async () => {
        await caseOfficerExuiPages.caseOverviewPage.selectEventFromDropdown({ eventToSelect: 'Generate hearing bundle' });

        await caseOfficerExuiPages.generateHearingBundlePage.verifyUserIsOnPage();
        await caseOfficerExuiPages.generateHearingBundlePage.submitGenerateHearingBundleEvent();

        await caseOfficerExuiPages.generateHearingBundleConfirmPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.generateHearingBundleConfirmPage.verifyAllTextOnPage();
        await caseOfficerExuiPages.generateHearingBundleConfirmPage.returnToCaseDetails();

        await caseOfficerExuiPages.caseOverviewPage.verifyUserIsOnPage({});
        await caseOfficerExuiPages.caseOverviewPage.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Generate hearing bundle' });
        await Promise.all([
          expect(caseOfficerExuiPages.caseOverviewPage.$static.whatToDoNextHeading).toBeVisible(),
          expect(caseOfficerExuiPages.caseOverviewPage.$static.whatToDoNextParagraph.nth(0)).toBeVisible(),
          expect(caseOfficerExuiPages.caseOverviewPage.$static.whatToDoNextParagraph.nth(0)).toHaveText(
            'The hearing bundle is being generated. You will soon be able to view the hearing bundle in the documents tab.',
          ),
          expect(caseOfficerExuiPages.caseOverviewPage.$static.whatToDoNextParagraph.nth(1)).toBeVisible(),
          expect(caseOfficerExuiPages.caseOverviewPage.$static.whatToDoNextParagraph.nth(1)).toHaveText(
            'You and the other parties will be notified when the hearing bundle is available.',
          ),
          expect(caseOfficerExuiPages.caseOverviewPage.$static.whatToDoNextParagraph.nth(2)).toBeVisible(),
          expect(caseOfficerExuiPages.caseOverviewPage.$static.whatToDoNextParagraph.nth(2)).toHaveText(
            'If the bundle fails to generate, you will be notified and need to generate the bundle again.',
          ),
        ]);
      });

      await test.step('Case Officer: Refresh application overview page and verify correct next steps are displayed', async () => {
        await caseOfficerExuiPages.caseOverviewPage.refreshPageUntilExpectedTextIsVisible({
          caseId: caseId,
          expectedText: 'You can start to create the decision and reasons document.',
          timeoutInSeconds: 90_000,
        });

        await Promise.all([
          expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextHeading).toBeVisible(),
          expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toBeVisible(),
          expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toHaveText(
            'You can start to create the decision and reasons document.',
          ),
          expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(1)).toBeVisible(),
          expect(caseOfficerExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(1)).toHaveText('Start decision and reasons'),
        ]);
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
        await Promise.all([
          expect(caseOfficerExuiPages.decisionAndReasonsStartedSubmitPage.$static.caseRecordHeading).toBeVisible(),
          expect(caseOfficerExuiPages.decisionAndReasonsStartedSubmitPage.$static.checkYouAnswersHeading).toBeVisible(),
          expect(caseOfficerExuiPages.decisionAndReasonsStartedSubmitPage.$static.checkInformationCarefullyText).toBeVisible(),
          expect(caseOfficerExuiPages.decisionAndReasonsStartedSubmitPage.$questionLocator('Introduction')).toBeVisible(),
          expect(caseOfficerExuiPages.decisionAndReasonsStartedSubmitPage.$questionValueLocator('Introduction')).toHaveText(
            'This is a test case introduction',
          ),
          expect(caseOfficerExuiPages.decisionAndReasonsStartedSubmitPage.$changeAnswerToQuestionLocator('Introduction')).toBeVisible(),
          expect(caseOfficerExuiPages.decisionAndReasonsStartedSubmitPage.$questionLocator("Appellant's case summary")).toBeVisible(),
          expect(caseOfficerExuiPages.decisionAndReasonsStartedSubmitPage.$questionValueLocator("Appellant's case summary")).toHaveText(
            'This is a test appellant case summary',
          ),
          expect(caseOfficerExuiPages.decisionAndReasonsStartedSubmitPage.$changeAnswerToQuestionLocator("Appellant's case summary")).toBeVisible(),
          expect(
            caseOfficerExuiPages.decisionAndReasonsStartedSubmitPage.$questionLocator('Do both parties agree the immigration history?'),
          ).toBeVisible(),
          expect(
            caseOfficerExuiPages.decisionAndReasonsStartedSubmitPage.$questionValueLocator('Do both parties agree the immigration history?'),
          ).toHaveText('Yes'),
          expect(
            caseOfficerExuiPages.decisionAndReasonsStartedSubmitPage.$changeAnswerToQuestionLocator('Do both parties agree the immigration history?'),
          ).toBeVisible(),
          expect(
            caseOfficerExuiPages.decisionAndReasonsStartedSubmitPage.$questionLocator('Do both parties agree the schedule of issues?'),
          ).toBeVisible(),
          expect(
            caseOfficerExuiPages.decisionAndReasonsStartedSubmitPage.$questionValueLocator('Do both parties agree the schedule of issues?'),
          ).toHaveText('Yes'),
          expect(
            caseOfficerExuiPages.decisionAndReasonsStartedSubmitPage.$changeAnswerToQuestionLocator('Do both parties agree the schedule of issues?'),
          ).toBeVisible(),
        ]);
        await caseOfficerExuiPages.decisionAndReasonsStartedSubmitPage.saveCase();

        await caseOfficerExuiPages.decisionAndReasonsStartedConfirmPage.verifyUserIsOnPage();
        await caseOfficerExuiPages.decisionAndReasonsStartedConfirmPage.verifyAllTextOnPage();
        await caseOfficerExuiPages.decisionAndReasonsStartedConfirmPage.returnToCaseDetails();

        await caseOfficerExuiPages.caseOverviewPage.verifyUserIsOnPage({});
        await caseOfficerExuiPages.caseOverviewPage.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Start decision and reasons' });
        await Promise.all([
          expect(caseOfficerExuiPages.caseOverviewPage.$static.whatHappensNextHeading).toBeVisible(),
          expect(caseOfficerExuiPages.caseOverviewPage.$static.whatHappensNextParagraph.nth(0)).toBeVisible(),
          expect(caseOfficerExuiPages.caseOverviewPage.$static.whatHappensNextParagraph.nth(0)).toHaveText(
            'The judge will complete the Decision and Reasons document and upload it to the service.',
          ),
          expect(caseOfficerExuiPages.caseOverviewPage.$static.whatHappensNextParagraph.nth(1)).toBeVisible(),
          expect(caseOfficerExuiPages.caseOverviewPage.$static.whatHappensNextParagraph.nth(1)).toHaveText(
            "Both parties will be notified when it's available to view and download from the Documents tab.",
          ),
        ]);
      });

      const judgeUserExuiPages =
        await test.step('Judge User: Navigate to exui application overview page and verify correct next steps displayed', async () => {
          const juedgeUserNewBrowserContextAndPage = await newBrowserContextAndPage({ user: 'judgeUser' });
          const judgeUserExuiPages = await exui_pages.newBrowserContext({ pageContext: juedgeUserNewBrowserContextAndPage });

          await judgeUserExuiPages.caseOverviewPage.goTo({ caseId: caseId });

          await Promise.all([
            expect(judgeUserExuiPages.caseOverviewPage.$static.doThisNextHeading).toBeVisible(),
            expect(judgeUserExuiPages.caseOverviewPage.$static.doThisNextParagraph).toHaveText('Prepare the Decision and Reasons document'),
            expect(judgeUserExuiPages.caseOverviewPage.$static.doThisNextParagraph).toBeVisible(),
          ]);
          return judgeUserExuiPages;
        });

      await test.step('Judge User: Select Prepare Decision and Reasons from next steps dropdown and submit event', async () => {
        await judgeUserExuiPages.caseOverviewPage.selectEventFromDropdown({ eventToSelect: 'Prepare Decision and Reasons' });

        await judgeUserExuiPages.prepareDecisionAndReasonsAnonymityOrderPage.verifyUserIsOnPage();
        await judgeUserExuiPages.prepareDecisionAndReasonsAnonymityOrderPage.completePageAndContinue({ anonymityOrderDirection: 'Yes' });

        const AppellantRepresentative = await dataUtils.generateRandomFirstAndLastNames({
          countOfFirstNamesToGenerate: 1,
          countOfLastNamesToGenerate: 1,
        });
        const RespondentRepresentative = await dataUtils.generateRandomFirstAndLastNames({
          countOfFirstNamesToGenerate: 1,
          countOfLastNamesToGenerate: 1,
        });

        await judgeUserExuiPages.prepareDecisionAndReasonsLegalRepresentativesPage.verifyUserIsOnPage();
        await judgeUserExuiPages.prepareDecisionAndReasonsLegalRepresentativesPage.completePageAndContinue({
          appellantRepresentative: `${AppellantRepresentative.firstNames[0]} ${AppellantRepresentative.lastNames[0]}`,
          respondentRepresentative: `${RespondentRepresentative.firstNames[0]} ${RespondentRepresentative.lastNames[0]}`,
        });

        await judgeUserExuiPages.prepareDecisionAndReasonsSubmitPage.verifyUserIsOnPage();
        await Promise.all([
          expect(judgeUserExuiPages.prepareDecisionAndReasonsSubmitPage.$static.caseRecordHeading).toBeVisible(),
          expect(judgeUserExuiPages.prepareDecisionAndReasonsSubmitPage.$static.checkYouAnswersHeading).toBeVisible(),
          expect(judgeUserExuiPages.prepareDecisionAndReasonsSubmitPage.$static.checkInformationCarefullyText).toBeVisible(),
          expect(judgeUserExuiPages.prepareDecisionAndReasonsSubmitPage.$static.anonymityDirectionHeading).toBeVisible(),
          expect(judgeUserExuiPages.prepareDecisionAndReasonsSubmitPage.$static.legalRepresentativesHeading).toBeVisible(),
          expect(judgeUserExuiPages.prepareDecisionAndReasonsSubmitPage.$questionLocator('Anonymity direction')).toBeVisible(),
          expect(judgeUserExuiPages.prepareDecisionAndReasonsSubmitPage.$questionValueLocator('Anonymity direction')).toHaveText('Yes'),
          expect(judgeUserExuiPages.prepareDecisionAndReasonsSubmitPage.$changeAnswerToQuestionLocator('Anonymity direction')).toBeVisible(),
          expect(judgeUserExuiPages.prepareDecisionAndReasonsSubmitPage.$questionLocator('Legal representative for the appellant')).toBeVisible(),
          expect(judgeUserExuiPages.prepareDecisionAndReasonsSubmitPage.$questionValueLocator('Legal representative for the appellant')).toHaveText(
            `${AppellantRepresentative.firstNames[0]} ${AppellantRepresentative.lastNames[0]}`,
          ),
          expect(
            judgeUserExuiPages.prepareDecisionAndReasonsSubmitPage.$changeAnswerToQuestionLocator('Legal representative for the appellant'),
          ).toBeVisible(),
          expect(judgeUserExuiPages.prepareDecisionAndReasonsSubmitPage.$questionLocator('Legal representative for the respondent')).toBeVisible(),
          expect(judgeUserExuiPages.prepareDecisionAndReasonsSubmitPage.$questionValueLocator('Legal representative for the respondent')).toHaveText(
            `${RespondentRepresentative.firstNames[0]} ${RespondentRepresentative.lastNames[0]}`,
          ),
          expect(
            judgeUserExuiPages.prepareDecisionAndReasonsSubmitPage.$changeAnswerToQuestionLocator('Legal representative for the respondent'),
          ).toBeVisible(),
        ]);
        await judgeUserExuiPages.prepareDecisionAndReasonsSubmitPage.generateDecisionAndReasons();

        await judgeUserExuiPages.prepareDecisionAndReasonsConfirmPage.verifyUserIsOnPage();
        await judgeUserExuiPages.prepareDecisionAndReasonsConfirmPage.verifyAllTextOnPage();
        await judgeUserExuiPages.prepareDecisionAndReasonsConfirmPage.returnToCaseDetails();

        await judgeUserExuiPages.caseOverviewPage.verifyUserIsOnPage({});
        await judgeUserExuiPages.caseOverviewPage.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Prepare Decision and Reasons' });
        await Promise.all([
          expect(judgeUserExuiPages.caseOverviewPage.$static.doThisNextHeading).toBeVisible(),
          expect(judgeUserExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toBeVisible(),
          expect(judgeUserExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toHaveText(
            'Go to the Documents tab to download and complete the Decision and Reasons document.',
          ),
          expect(judgeUserExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(1)).toBeVisible(),
          expect(judgeUserExuiPages.caseOverviewPage.$static.doThisNextParagraph.nth(1)).toHaveText(
            'You should then upload and send the completed document.',
          ),
        ]);
      });

      await test.step('Judge User: Select Complete decision and reasons from next steps dropdown and submit event', async () => {
        await judgeUserExuiPages.caseOverviewPage.selectEventFromDropdown({ eventToSelect: 'Complete decision and reasons' });

        await judgeUserExuiPages.completeDecisionAndReasonsPage.verifyUserIsOnPage();
        await judgeUserExuiPages.completeDecisionAndReasonsPage.completePageAndContinue({ decision: 'Allowed' });

        await judgeUserExuiPages.completeDecisionAndReasonsUploadDecisionPage.verifyUserIsOnPage();
        await judgeUserExuiPages.completeDecisionAndReasonsUploadDecisionPage.completePageAndContinue({});

        await judgeUserExuiPages.completeDecisionAndReasonsSubmitPage.verifyUserIsOnPage();
        await Promise.all([
          expect(judgeUserExuiPages.completeDecisionAndReasonsSubmitPage.$static.caseRecordHeading).toBeVisible(),
          expect(judgeUserExuiPages.completeDecisionAndReasonsSubmitPage.$static.checkYouAnswersHeading).toBeVisible(),
          expect(judgeUserExuiPages.completeDecisionAndReasonsSubmitPage.$static.checkInformationCarefullyText).toBeVisible(),
          expect(judgeUserExuiPages.completeDecisionAndReasonsSubmitPage.$questionLocator('Decision')).toBeVisible(),
          expect(judgeUserExuiPages.completeDecisionAndReasonsSubmitPage.$questionValueLocator('Decision')).toBeVisible(),
          expect(judgeUserExuiPages.completeDecisionAndReasonsSubmitPage.$questionValueLocator('Decision')).toHaveText('Allowed'),
          expect(judgeUserExuiPages.completeDecisionAndReasonsSubmitPage.$changeAnswerToQuestionLocator('Decision')).toBeVisible(),
          expect(judgeUserExuiPages.completeDecisionAndReasonsSubmitPage.$questionLocator('Decision and reasons')).toBeVisible(),
          expect(judgeUserExuiPages.completeDecisionAndReasonsSubmitPage.$questionValueLocator('Decision and reasons')).toBeVisible(),
          expect(judgeUserExuiPages.completeDecisionAndReasonsSubmitPage.$questionValueLocator('Decision and reasons')).toHaveText(
            'SendDecisionAndReasons.pdf',
          ),
          expect(judgeUserExuiPages.completeDecisionAndReasonsSubmitPage.$changeAnswerToQuestionLocator('Decision and reasons')).toBeVisible(),
        ]);
        await judgeUserExuiPages.completeDecisionAndReasonsSubmitPage.uploadDecisionAndReasons();

        await judgeUserExuiPages.completeDecisionAndReasonsConfirmPage.verifyUserIsOnPage();
        await judgeUserExuiPages.completeDecisionAndReasonsConfirmPage.verifyAllTextOnPage();
        await judgeUserExuiPages.completeDecisionAndReasonsConfirmPage.returnToCaseDetails();

        await judgeUserExuiPages.caseOverviewPage.verifyUserIsOnPage({});
        await judgeUserExuiPages.caseOverviewPage.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Complete decision and reasons' });
        await Promise.all([
          expect(judgeUserExuiPages.caseOverviewPage.$static.whatHappensNextHeading).toBeVisible(),
          expect(judgeUserExuiPages.caseOverviewPage.$static.whatHappensNextParagraph).toBeVisible(),
          expect(judgeUserExuiPages.caseOverviewPage.$static.whatHappensNextParagraph).toHaveText('No further action required.'),
        ]);
      });
    },
  );
});
