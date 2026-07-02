import { test, expect } from '../../fixtures.js';
import { config } from '../../utils/config.utils.js';

test.describe('Set of tests to verify admin user is able to record a remission decision on exui manage cases', () => {
  test.use({ storageState: config.exuiUsers.adminOfficer.sessionFile });

  test.beforeEach(async ({ exui_adminOfficerApiClient, cui_apiClient, exui_pages }) => {
    const appealDetails = await test.step('Citizen Api: Submit a new appeal with fee remission', async () => {
      const appealDetails = await cui_apiClient.completeAndSubmitNewAppealJourneyViaApi({
        appealType: 'EU Settlement Scheme',
        hasApplicantReceivedADeportationOrder: 'No',
        isApplicantStateless: false,
        nationality: 'Belgian',
        isUserInTheUk: 'Yes',
        doesApplicantHaveASponsor: 'No',
        decisionWithOrWithoutHearing: 'decisionWithHearing',
        isApplicationInTime: true,
        whetherApplicantHasToPayAFee: 'I got a fee waiver from the Home Office for my application to stay in the UK',
        appealSubmissionType: 'Non-Pay Appeal',
      });
      return appealDetails;
    });

    await test.step(`Admin officer: Navigate to case overview page on exui`, async () => {
      const caseId = await exui_adminOfficerApiClient.fetchCaseId({ homeOfficeReferenceNumber: appealDetails.homeOfficeReference.toString() });
      await exui_pages.caseOverviewPage.goTo({ caseId: caseId });
    });
  });

  test('Verify admin officer is able to approve a remission decision', async ({ exui_pages }) => {
    await test.step('Verify correct next steps are displayed on case overview page', async () => {
      await Promise.all([
        expect(exui_pages.caseOverviewPage.$static.doThisNextHeading).toBeVisible(),
        expect(exui_pages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toHaveText(
          'An appeal has been submitted with a remission application. You need to review the remission details in the appeal tab.',
        ),
        expect(exui_pages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toBeVisible(),
        expect(exui_pages.caseOverviewPage.$static.doThisNextParagraph.nth(1)).toHaveText(
          'If you need more information to make a decision, you can contact the appellant.',
        ),
        expect(exui_pages.caseOverviewPage.$static.doThisNextParagraph.nth(1)).toBeVisible(),
        expect(exui_pages.caseOverviewPage.$static.doThisNextParagraph.nth(2)).toHaveText('You then need to record your remission decision.'),
        expect(exui_pages.caseOverviewPage.$static.doThisNextParagraph.nth(2)).toBeVisible(),
      ]);
    });

    await test.step('Select record remission decision from next steps dropdown and approve fee remission', async () => {
      await exui_pages.caseOverviewPage.selectEventFromDropdown({ eventToSelect: 'Record remission decision' });

      await exui_pages.recordRemissionDecisionPage.verifyUserIsOnPage();
      await exui_pages.recordRemissionDecisionPage.verifyAllTextOnPage();
      await exui_pages.recordRemissionDecisionPage.completePageAndContinue({ remissionDecision: 'approved' });

      await exui_pages.recordRemissionDecisionDetailsPage.verifyUserIsOnPage();
      await exui_pages.recordRemissionDecisionDetailsPage.verifyAllTextOnPage();
      await exui_pages.recordRemissionDecisionDetailsPage.completePageAndContinue({ amountRemitted: 140, amountLeftToPay: 0 });

      await exui_pages.recordRemissionDecisionSubmitPage.verifyUserIsOnPage();
      await Promise.all([
        await expect(exui_pages.recordRemissionDecisionSubmitPage.$static.caseRecordHeading).toBeVisible(),
        await expect(exui_pages.recordRemissionDecisionSubmitPage.$static.checkYourAnswersHeading).toBeVisible(),
        await expect(exui_pages.recordRemissionDecisionSubmitPage.$static.checkInformationText).toBeVisible(),
        // Verify decision question and answer are displayed correctly on check your answers page
        await expect(exui_pages.recordRemissionDecisionSubmitPage.$questionLocator('Decision')).toBeVisible(),
        await expect(exui_pages.recordRemissionDecisionSubmitPage.$questionValueLocator('Decision')).toHaveText('Approved'),
        await expect(exui_pages.recordRemissionDecisionSubmitPage.$questionValueLocator('Decision')).toBeVisible(),
        await expect(exui_pages.recordRemissionDecisionSubmitPage.$changeAnswerToQuestionLocator('Decision')).toHaveText('Change'),
        await expect(exui_pages.recordRemissionDecisionSubmitPage.$changeAnswerToQuestionLocator('Decision')).toBeVisible(),
        // Verify amount remitted question and answer are displayed correctly on check your answers page
        await expect(exui_pages.recordRemissionDecisionSubmitPage.$questionLocator('Amount remitted')).toBeVisible(),
        await expect(exui_pages.recordRemissionDecisionSubmitPage.$questionValueLocator('Amount remitted')).toHaveText('£140.00'),
        await expect(exui_pages.recordRemissionDecisionSubmitPage.$questionValueLocator('Amount remitted')).toBeVisible(),
        await expect(exui_pages.recordRemissionDecisionSubmitPage.$changeAnswerToQuestionLocator('Amount remitted')).toHaveText('Change'),
        await expect(exui_pages.recordRemissionDecisionSubmitPage.$changeAnswerToQuestionLocator('Amount remitted')).toBeVisible(),
        // Verify amount left to pay question and answer are displayed correctly on check your answers page
        await expect(exui_pages.recordRemissionDecisionSubmitPage.$questionLocator('Amount left to pay')).toBeVisible(),
        await expect(exui_pages.recordRemissionDecisionSubmitPage.$questionValueLocator('Amount left to pay')).toHaveText('£0.00'),
        await expect(exui_pages.recordRemissionDecisionSubmitPage.$questionValueLocator('Amount left to pay')).toBeVisible(),
        await expect(exui_pages.recordRemissionDecisionSubmitPage.$changeAnswerToQuestionLocator('Amount left to pay')).toHaveText('Change'),
        await expect(exui_pages.recordRemissionDecisionSubmitPage.$changeAnswerToQuestionLocator('Amount left to pay')).toBeVisible(),
      ]);

      await exui_pages.recordRemissionDecisionSubmitPage.submitRecordDecision();

      await exui_pages.recordRemissionDecisionConfirmPage.verifyUserIsOnPage();
      await exui_pages.recordRemissionDecisionConfirmPage.verifyAllTextOnPage({ remissionDecision: 'approved' });
      await exui_pages.recordRemissionDecisionConfirmPage.returnToCaseDetails();
    });

    await test.step('Verify correct next steps are displayed once event has been submitted', async () => {
      await exui_pages.caseOverviewPage.verifyUserIsOnPage({});
      await exui_pages.caseOverviewPage.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Record remission decision' });

      await Promise.all([
        expect(exui_pages.caseOverviewPage.$static.whatHappensNextHeading).toBeVisible(),
        expect(exui_pages.caseOverviewPage.$static.whatHappensNextParagraph.nth(0)).toHaveText(
          "The Tribunal Caseworker will review the appeal and decide if it's valid.",
        ),
        expect(exui_pages.caseOverviewPage.$static.whatHappensNextParagraph.nth(0)).toBeVisible(),
      ]);
    });
  });
});
