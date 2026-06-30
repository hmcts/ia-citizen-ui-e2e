import { test, expect } from '../../../fixtures.js';

test.describe('Set of tests to verify user is able to submit answers to appeal reasons via UI', () => {
  test.beforeEach(async ({ citizenUser, cui_login, cui_apiClient, exui_caseOfficerApiClient, exui_homeOfficeUserApiClient }) => {
    const detailsOfNewAppeal = await test.step('Submit a new appeal via Api', async () => {
      const appealDetails = await cui_apiClient.completeAndSubmitNewAppealJourneyViaApi({
        appealType: 'European Economic Area',
        hasApplicantReceivedADeportationOrder: 'No',
        isApplicantStateless: false,
        nationality: 'Belgian',
        isUserInTheUk: 'Yes',
        doesApplicantHaveASponsor: 'No',
        decisionWithOrWithoutHearing: 'decisionWithHearing',
        isApplicationInTime: true,
        whetherApplicantHasToPayAFee: 'None of these statements apply to me',
        appealSubmissionType: 'Pay Appeal',
      });
      return appealDetails;
    });

    await test.step('Progress journey via exui api calls in order to allow appellant to submit their appeal reasons', async () => {
      const caseId = await exui_caseOfficerApiClient.fetchCaseId({ homeOfficeReferenceNumber: detailsOfNewAppeal.homeOfficeReference.toString() });

      await exui_caseOfficerApiClient.submitRequestRespondentEvidenceEvent({ caseId: caseId });

      await exui_homeOfficeUserApiClient.submitUploadHomeOfficeBundleEvent({
        caseId: caseId,
        description: 'Test home office bundle upload via api 1',
      });

      await exui_caseOfficerApiClient.submitRequestReasonsForAppealEvent({ caseId: caseId });
    });

    await test.step('Verify application is in the correct state to submit response to appeal reasons before logging in', async () => {
      await cui_apiClient.verifyAppealIsInExpectedStateViaAppealOverviewApi({
        expectedTextToBeOnAppealOverview: 'Tell us why you think the Home Office decision to refuse your claim is wrong.',
      });
    });

    await test.step('Navigate to citizen UI and login', async () => {
      await cui_login({ email: citizenUser.email, password: citizenUser.password });
    });
  });

  test('Verify user is able to submit answers to appeal reasons via the UI', { tag: ['@e2e'] }, async ({ cui_pages, dataUtils }) => {
    await test.step('Provide a response to appeal reasons', async () => {
      await cui_pages.appealOverviewPage.navigationClick(cui_pages.appealOverviewPage.$interactive.continueButton);

      await cui_pages.homeOfficeDecisionWrongPage.verifyUserIsOnPage();
      await cui_pages.homeOfficeDecisionWrongPage.completePageAndContinue({
        reasonWhyHomeOfficeDecisionIsWrong: 'The home office is wrong test reason',
        verifyAllTextOnPage: true,
      });

      await cui_pages.supportingEvidencePage.verifyUserIsOnPage();
      await cui_pages.supportingEvidencePage.completePageAndContinue({ doYouWishToProvideSupportingEvidence: 'Yes', verifyAllTextOnPage: true });

      await cui_pages.provideSupportingEvidencePage.verifyUserIsOnPage();
      await cui_pages.provideSupportingEvidencePage.completePageAndContinue({ verifyAllTextOnPage: true });
    });

    await test.step('Verify user is able to see their answers on the check your answers page', async () => {
      await cui_pages.appealReasonsCheckAnswersPage.verifyUserIsOnPage({ urlPath: 'check-answer' });

      await Promise.all([
        expect(cui_pages.appealReasonsCheckAnswersPage.$static.questionTableRowLabel).toHaveText('Question'),
        expect(cui_pages.appealReasonsCheckAnswersPage.$static.questionTableRowLabel).toBeVisible(),

        expect(cui_pages.appealReasonsCheckAnswersPage.$static.questionTableRowValue).toHaveText(
          'Why do you think the Home Office decision is wrong?',
        ),
        expect(cui_pages.appealReasonsCheckAnswersPage.$static.questionTableRowValue).toBeVisible(),

        expect(cui_pages.appealReasonsCheckAnswersPage.$static.answerTableRowLabel).toHaveText('Answer'),
        expect(cui_pages.appealReasonsCheckAnswersPage.$static.answerTableRowLabel).toBeVisible(),

        expect(cui_pages.appealReasonsCheckAnswersPage.$static.answerTableRowValue).toHaveText('The home office is wrong test reason'),
        expect(cui_pages.appealReasonsCheckAnswersPage.$static.answerTableRowValue).toBeVisible(),

        expect(cui_pages.appealReasonsCheckAnswersPage.$interactive.changeAnswerLink).toContainText('Change'),
        expect(cui_pages.appealReasonsCheckAnswersPage.$interactive.changeAnswerLink).toBeVisible(),

        expect(cui_pages.appealReasonsCheckAnswersPage.$static.supportingEvidenceTableRowLabel).toHaveText('Supporting evidence'),
        expect(cui_pages.appealReasonsCheckAnswersPage.$static.supportingEvidenceTableRowLabel).toBeVisible(),

        expect(cui_pages.appealReasonsCheckAnswersPage.$static.supportingEvidenceTableRowValue).toHaveText('Provide_Supporting_Evidence.txt'),
        expect(cui_pages.appealReasonsCheckAnswersPage.$static.supportingEvidenceTableRowValue).toBeVisible(),

        expect(cui_pages.appealReasonsCheckAnswersPage.$interactive.changeSupportingEvidenceLink).toContainText('Change'),
        expect(cui_pages.appealReasonsCheckAnswersPage.$interactive.changeSupportingEvidenceLink).toBeVisible(),
      ]);
    });

    await test.step('Verify user is able to submit their appeal reasons answers successfully', async () => {
      await cui_pages.appealReasonsCheckAnswersPage.submitAnswer();
      await cui_pages.appealReasonsAnswerSentPage.verifyUserIsOnPage();

      const expectedDate = (await dataUtils.getDateFromToday({ dayOffset: 14 })).full;

      await Promise.all([
        expect(cui_pages.appealReasonsAnswerSentPage.$static.whatHappensNextHeading).toBeVisible(),

        expect(cui_pages.appealReasonsAnswerSentPage.$static.whatHappensNextFirstBulletPoint).toHaveText(
          'A Tribunal Caseworker will look at your answer and contact you to tell you what to do next',
        ),
        expect(cui_pages.appealReasonsAnswerSentPage.$static.whatHappensNextFirstBulletPoint).toBeVisible(),

        expect(cui_pages.appealReasonsAnswerSentPage.$static.whatHappensNextSecondBulletPoint).toHaveText(
          `This should be by ${expectedDate} but it may take longer than that`,
        ),
        expect(cui_pages.appealReasonsAnswerSentPage.$static.whatHappensNextSecondBulletPoint).toBeVisible(),

        expect(cui_pages.appealReasonsAnswerSentPage.$static.ifYouHaveQuestionsParagraph).toHaveText(
          'If you have any questions about the appeal process, call the Tribunal on 0300 123 1711 or email contactia@justice.gov.uk',
        ),
        expect(cui_pages.appealReasonsAnswerSentPage.$static.ifYouHaveQuestionsParagraph).toBeVisible(),
      ]);
    });
  });

  test('Verify user is able to ask for time when responding to appeal reasons', { tag: ['@e2e'] }, async ({ cui_pages }) => {
    await test.step('Ask for more time for appeal reasons', async () => {
      await cui_pages.appealOverviewPage.navigationClick(cui_pages.appealOverviewPage.$interactive.askForMoreTimeLink);

      await cui_pages.askForMoreTimePage.verifyUserIsOnPage();
      await cui_pages.askForMoreTimePage.completePageAndContinue({
        howMuchAndWhyMoreTimeNeeded: 'Test reason for why more time is needed and how much time is needed.',
        verifyAllTextOnPage: true,
      });

      await cui_pages.supportingEvidenceMoreTimePage.verifyUserIsOnPage();
      await cui_pages.supportingEvidenceMoreTimePage.completePageAndContinue({ doYouWishToProvideSupportingEvidence: 'Yes' });

      await cui_pages.provideSupportingEvidenceMoreTimePage.verifyUserIsOnPage();
      await cui_pages.provideSupportingEvidenceMoreTimePage.completePageAndContinue({ verifyAllTextOnPage: true });
    });

    await test.step('Verify user is able to see their request for more time answer on the check your answers page', async () => {
      await cui_pages.appealReasonsCheckAnswersPage.verifyUserIsOnPage({ urlPath: 'check-answer-more-time' });

      await Promise.all([
        expect(cui_pages.appealReasonsCheckAnswersPage.$static.questionTableRowLabel).toHaveText('Question'),
        expect(cui_pages.appealReasonsCheckAnswersPage.$static.questionTableRowLabel).toBeVisible(),

        expect(cui_pages.appealReasonsCheckAnswersPage.$static.questionTableRowValue).toHaveText('How much time do you need and why do you need it?'),
        expect(cui_pages.appealReasonsCheckAnswersPage.$static.questionTableRowValue).toBeVisible(),

        expect(cui_pages.appealReasonsCheckAnswersPage.$static.answerTableRowLabel).toHaveText('Answer'),
        expect(cui_pages.appealReasonsCheckAnswersPage.$static.answerTableRowLabel).toBeVisible(),

        expect(cui_pages.appealReasonsCheckAnswersPage.$static.answerTableRowValue).toHaveText(
          'Test reason for why more time is needed and how much time is needed.',
        ),
        expect(cui_pages.appealReasonsCheckAnswersPage.$static.answerTableRowValue).toBeVisible(),

        expect(cui_pages.appealReasonsCheckAnswersPage.$interactive.changeAnswerLink).toContainText('Change'),
        expect(cui_pages.appealReasonsCheckAnswersPage.$interactive.changeAnswerLink).toBeVisible(),

        expect(cui_pages.appealReasonsCheckAnswersPage.$static.supportingEvidenceTableRowLabel).toHaveText('Supporting evidence'),
        expect(cui_pages.appealReasonsCheckAnswersPage.$static.supportingEvidenceTableRowLabel).toBeVisible(),

        expect(cui_pages.appealReasonsCheckAnswersPage.$static.supportingEvidenceTableRowValue).toHaveText(
          'Provide_Supporting_Evidence_For_More_Time.txt',
        ),
        expect(cui_pages.appealReasonsCheckAnswersPage.$static.supportingEvidenceTableRowValue).toBeVisible(),

        expect(cui_pages.appealReasonsCheckAnswersPage.$interactive.changeSupportingEvidenceLink).toContainText('Change'),
        expect(cui_pages.appealReasonsCheckAnswersPage.$interactive.changeSupportingEvidenceLink).toBeVisible(),
      ]);
    });

    await test.step('Verify user is able to submit request for more time successfully', async () => {
      await cui_pages.appealReasonsCheckAnswersPage.submitAnswer();
      await cui_pages.requestMoreTimeSentPage.verifyUserIsOnPage();

      await Promise.all([
        expect(cui_pages.requestMoreTimeSentPage.$static.whatHappensNextHeading).toBeVisible(),

        expect(cui_pages.requestMoreTimeSentPage.$static.whatHappensNextBulletPoint1).toHaveText(
          'A Tribunal Caseworker should contact you within five working days to tell you if you have more time but it might take longer than that',
        ),
        expect(cui_pages.requestMoreTimeSentPage.$static.whatHappensNextBulletPoint1).toBeVisible(),

        expect(cui_pages.requestMoreTimeSentPage.$static.whatHappensNextBulletPoint2).toHaveText(
          'You might not get more time. You should still respond to the Tribunal by the date you were given if you can',
        ),
        expect(cui_pages.requestMoreTimeSentPage.$static.whatHappensNextBulletPoint2).toBeVisible(),

        expect(cui_pages.requestMoreTimeSentPage.$static.thingsYouCanNowDoHeading).toBeVisible(),

        expect(cui_pages.requestMoreTimeSentPage.$static.thingsYouCanNowDoBulletPoint1).toHaveText(
          'Read more about appealing an immigration or asylum decision',
        ),
        expect(cui_pages.requestMoreTimeSentPage.$static.thingsYouCanNowDoBulletPoint1).toBeVisible(),

        expect(cui_pages.requestMoreTimeSentPage.$static.thingsYouCanNowDoBulletPoint2).toHaveText(
          'Find organisations that can help you with your appeal',
        ),
        expect(cui_pages.requestMoreTimeSentPage.$static.thingsYouCanNowDoBulletPoint2).toBeVisible(),
      ]);
    });
  });

  test('Verify user is able to submit answers to appeal reasons after requesting for more time', { tag: ['@e2e'] }, async ({ cui_pages }) => {
    await test.step('Ask for more time for appeal reasons', async () => {
      await cui_pages.appealOverviewPage.navigationClick(cui_pages.appealOverviewPage.$interactive.askForMoreTimeLink);

      await cui_pages.askForMoreTimePage.verifyUserIsOnPage();
      await cui_pages.askForMoreTimePage.completePageAndContinue({
        howMuchAndWhyMoreTimeNeeded: 'Test reason for why more time is needed and how much time is needed.',
      });

      await cui_pages.supportingEvidenceMoreTimePage.verifyUserIsOnPage();
      await cui_pages.supportingEvidenceMoreTimePage.completePageAndContinue({ doYouWishToProvideSupportingEvidence: 'No' });
    });

    await test.step('Verify user is able to see their request for more time answer on the check your answers page', async () => {
      await cui_pages.appealReasonsCheckAnswersPage.verifyUserIsOnPage({ urlPath: 'check-answer-more-time' });

      await Promise.all([
        expect(cui_pages.appealReasonsCheckAnswersPage.$static.questionTableRowLabel).toHaveText('Question'),
        expect(cui_pages.appealReasonsCheckAnswersPage.$static.questionTableRowLabel).toBeVisible(),

        expect(cui_pages.appealReasonsCheckAnswersPage.$static.questionTableRowValue).toHaveText('How much time do you need and why do you need it?'),
        expect(cui_pages.appealReasonsCheckAnswersPage.$static.questionTableRowValue).toBeVisible(),

        expect(cui_pages.appealReasonsCheckAnswersPage.$static.answerTableRowLabel).toHaveText('Answer'),
        expect(cui_pages.appealReasonsCheckAnswersPage.$static.answerTableRowLabel).toBeVisible(),

        expect(cui_pages.appealReasonsCheckAnswersPage.$static.answerTableRowValue).toHaveText(
          'Test reason for why more time is needed and how much time is needed.',
        ),
        expect(cui_pages.appealReasonsCheckAnswersPage.$static.answerTableRowValue).toBeVisible(),

        expect(cui_pages.appealReasonsCheckAnswersPage.$interactive.changeAnswerLink).toContainText('Change'),
        expect(cui_pages.appealReasonsCheckAnswersPage.$interactive.changeAnswerLink).toBeVisible(),

        expect(cui_pages.appealReasonsCheckAnswersPage.$static.supportingEvidenceTableRowLabel).toBeHidden(),
        expect(cui_pages.appealReasonsCheckAnswersPage.$static.supportingEvidenceTableRowValue).toBeHidden(),
        expect(cui_pages.appealReasonsCheckAnswersPage.$interactive.changeSupportingEvidenceLink).toBeHidden(),
      ]);
    });

    await test.step('Submit request for more time and return to appeal overview page', async () => {
      await cui_pages.appealReasonsCheckAnswersPage.submitAnswer();

      await cui_pages.requestMoreTimeSentPage.verifyUserIsOnPage();
      await cui_pages.requestMoreTimeSentPage.navigationClick(cui_pages.requestMoreTimeSentPage.$interactive.seeYourAppealProgressButton);

      await cui_pages.appealOverviewPage.verifyUserIsOnPage();
    });

    await test.step('Provide a response to appeal reasons', async () => {
      await cui_pages.appealOverviewPage.navigationClick(cui_pages.appealOverviewPage.$interactive.continueButton);

      await cui_pages.homeOfficeDecisionWrongPage.verifyUserIsOnPage();
      await cui_pages.homeOfficeDecisionWrongPage.completePageAndContinue({
        reasonWhyHomeOfficeDecisionIsWrong: 'The home office is wrong test reason',
      });

      await cui_pages.supportingEvidencePage.verifyUserIsOnPage();
      await cui_pages.supportingEvidencePage.completePageAndContinue({ doYouWishToProvideSupportingEvidence: 'No' });
    });

    await test.step('Verify user is able to see their answers on the check your answers page', async () => {
      await cui_pages.appealReasonsCheckAnswersPage.verifyUserIsOnPage({ urlPath: 'check-answer' });

      await Promise.all([
        expect(cui_pages.appealReasonsCheckAnswersPage.$static.questionTableRowLabel).toHaveText('Question'),
        expect(cui_pages.appealReasonsCheckAnswersPage.$static.questionTableRowLabel).toBeVisible(),

        expect(cui_pages.appealReasonsCheckAnswersPage.$static.questionTableRowValue).toHaveText(
          'Why do you think the Home Office decision is wrong?',
        ),
        expect(cui_pages.appealReasonsCheckAnswersPage.$static.questionTableRowValue).toBeVisible(),

        expect(cui_pages.appealReasonsCheckAnswersPage.$static.answerTableRowLabel).toHaveText('Answer'),
        expect(cui_pages.appealReasonsCheckAnswersPage.$static.answerTableRowLabel).toBeVisible(),

        expect(cui_pages.appealReasonsCheckAnswersPage.$static.answerTableRowValue).toHaveText('The home office is wrong test reason'),
        expect(cui_pages.appealReasonsCheckAnswersPage.$static.answerTableRowValue).toBeVisible(),

        expect(cui_pages.appealReasonsCheckAnswersPage.$interactive.changeAnswerLink).toContainText('Change'),
        expect(cui_pages.appealReasonsCheckAnswersPage.$interactive.changeAnswerLink).toBeVisible(),

        expect(cui_pages.appealReasonsCheckAnswersPage.$static.supportingEvidenceTableRowLabel).toBeHidden(),
        expect(cui_pages.appealReasonsCheckAnswersPage.$static.supportingEvidenceTableRowValue).toBeHidden(),
        expect(cui_pages.appealReasonsCheckAnswersPage.$interactive.changeSupportingEvidenceLink).toBeHidden(),
      ]);
    });

    await test.step('Verify user is able to submit their appeal reasons answers successfully', async () => {
      await cui_pages.appealReasonsCheckAnswersPage.submitAnswer();
      await cui_pages.appealReasonsAnswerSentPage.verifyUserIsOnPage();
    });
  });
});
