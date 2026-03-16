import { test, expect } from '../../../fixtures.js';

test.describe('Set of tests to verify user is able to submit answers to hearing requirements via UI', () => {
  test.beforeEach(async ({ citizenUser, cui_login, cui_apiClient, exui_caseOfficerApiClient, exui_homeOfficeUserApiClient }) => {
    console.log('Citizen user email:', citizenUser.email);
    const detailsOfNewAppeal = await test.step('Submit a new appeal via Api', async () => {
      const appealDetails = await cui_apiClient.completeAndSubmitAppealJourneyViaApi({
        appealType: 'European Economic Area',
        hasApplicantReceivedADeportationOrder: 'No',
        isApplicantStateless: true,
        nationality: 'Belgium',
        isUserInTheUk: 'Yes',
        doesApplicantHaveASponsor: 'No',
        decisionWithOrWithoutHearing: 'decisionWithHearing',
        isApplicationInTime: true,
        whetherApplicantHasToPayAFee: 'None of these statements apply to me',
        appealSubmissionType: 'Pay Appeal',
      });
      return appealDetails;
    });

    await test.step('Progress journey via citizen and exui api calls in order to allow appellant to submit their hearing requirements', async () => {
      const caseId = await exui_caseOfficerApiClient.fetchCaseId({ homeOfficeReferenceNumber: detailsOfNewAppeal.homeOfficeReference.toString() });
      console.log('Fetched Case ID:', caseId);

      await exui_caseOfficerApiClient.submitRequestRespondentEvidenceEvent({ caseId: caseId });

      await exui_homeOfficeUserApiClient.submitUploadHomeOfficeBundleEvent({
        caseId: caseId,
        description: 'Test home office bundle upload via api 1',
      });

      await exui_caseOfficerApiClient.submitRequestReasonsForAppealEvent({ caseId: caseId });

      await cui_apiClient.completeAndSubmitAppealReasonsJourneyViaApi({
        doesApplicantRequireMoreTimeToSubmitAppealReasons: false,
        appealReasons: {
          reasonWhyHomeOfficeDecisionIsWrong: 'Test reason why Home Office decision is wrong',
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
    });

    await test.step('Verify application is in the correct state to submit hearing requirements before logging in', async () => {
      await cui_apiClient.verifyAppealIsInExpectedStateViaAppealOverviewApi({
        expectedTextToBeOnAppealOverview: 'Your appeal is going to hearing',
      });
    });

    await test.step('Navigate to citizen UI and login', async () => {
      await cui_login({ email: citizenUser.email, password: citizenUser.password });
    });
  });

  test('Verify user is able to submit response to hearing requirements by taking shortest path', { tag: ['@e2e'] }, async ({ cui_pages }) => {
    await test.step('Provide response to hearing witness section of journey', async () => {
      await cui_pages.appealOverviewPage.navigationClick(cui_pages.appealOverviewPage.$interactive.continueButton);

      await cui_pages.hearingNeedsPage.verifyUserIsOnPage();
      await cui_pages.hearingNeedsPage.navigationClick(cui_pages.hearingNeedsPage.$interactive.witnessLink);

      await cui_pages.hearingWitnessesPage.verifyUserIsOnPage();
      await cui_pages.hearingWitnessesPage.completePageAndContinue({ doesApplicantHaveAWitness: 'No', verifyAllTextOnPage: true });

      await cui_pages.hearingOutsideUKPage.verifyUserIsOnPage();
      await cui_pages.hearingOutsideUKPage.completePageAndContinue({ doesApplicantHaveAWitness: 'No', verifyAllTextOnPage: true });

      await cui_pages.hearingNeedsPage.verifyUserIsOnPage();
    });

    await test.step('Provide response to access needs section of journey', async () => {
      await cui_pages.hearingNeedsPage.navigationClick(cui_pages.hearingNeedsPage.$interactive.accessNeedsLink);

      await cui_pages.hearingAccessNeedsPage.verifyUserIsOnPage();
      await cui_pages.hearingAccessNeedsPage.continueOnToNextPage({ verifyAllTextOnPage: true });

      await cui_pages.hearingInterpreterPage.verifyUserIsOnPage();
      await cui_pages.hearingInterpreterPage.completePageAndContinue({ doYouRequireAInterpreterAtHearing: 'No', verifyAllTextOnPage: true });

      await cui_pages.hearingStepFreeAccessPage.verifyUserIsOnPage();
      await cui_pages.hearingStepFreeAccessPage.completePageAndContinue({ willYouOrWitnessRequireStepFreeAccess: 'No', verifyAllTextOnPage: true });

      await cui_pages.hearingLoopPage.verifyUserIsOnPage();
      await cui_pages.hearingLoopPage.completePageAndContinue({ willYouOrWitnessNeedHearingLoop: 'No', verifyAllTextOnPage: true });

      await cui_pages.hearingNeedsPage.verifyUserIsOnPage();
    });

    await test.step('Provide response to other needs section of journey', async () => {
      await cui_pages.hearingNeedsPage.navigationClick(cui_pages.hearingNeedsPage.$interactive.otherNeedsLink);

      await cui_pages.hearingOtherNeedsPage.verifyUserIsOnPage();
      await cui_pages.hearingOtherNeedsPage.continueOnToNextPage({ verifyAllTextOnPage: true });

      await cui_pages.hearingVideoAppointmentPage.verifyUserIsOnPage();
      await cui_pages.hearingVideoAppointmentPage.completePageAndContinue({ areYouAbleToJoinHearingViaVideoCall: 'Yes', verifyAllTextOnPage: true });

      await cui_pages.hearingMultimediaEvidencePage.verifyUserIsOnPage();
      await cui_pages.hearingMultimediaEvidencePage.completePageAndContinue({ willYouBringVideoOrAudioEvidence: 'No', verifyAllTextOnPage: true });

      await cui_pages.hearingSingleSexPage.verifyUserIsOnPage();
      await cui_pages.hearingSingleSexPage.completePageAndContinue({ willYouNeedAllFemaleOrMaleHearing: 'No', verifyAllTextOnPage: true });

      await cui_pages.hearingPrivatePage.verifyUserIsOnPage();
      await cui_pages.hearingPrivatePage.completePageAndContinue({ willYouNeedAPrivateHearing: 'No', verifyAllTextOnPage: true });

      await cui_pages.hearingPhysicalMentalHealthPage.verifyUserIsOnPage();
      await cui_pages.hearingPhysicalMentalHealthPage.completePageAndContinue({
        anyPhysicalOrMentalHealthConditions: 'No',
        verifyAllTextOnPage: true,
      });

      await cui_pages.hearingPastExperiencesPage.verifyUserIsOnPage();
      await cui_pages.hearingPastExperiencesPage.completePageAndContinue({
        anyPastExperienceThatMayAffectHearing: 'No',
        verifyAllTextOnPage: true,
      });

      await cui_pages.hearingAnythingElsePage.verifyUserIsOnPage();
      await cui_pages.hearingAnythingElsePage.completePageAndContinue({ needAnythingElse: 'No', verifyAllTextOnPage: true });

      await cui_pages.hearingNeedsPage.verifyUserIsOnPage();
    });

    await test.step('Provide response to dates to avoid section of journey', async () => {
      await cui_pages.hearingNeedsPage.navigationClick(cui_pages.hearingNeedsPage.$interactive.datesToAvoidLink);

      await cui_pages.hearingDatesAvoidPage.verifyUserIsOnPage({ urlPath: 'hearing-dates-avoid' });
      await cui_pages.hearingDatesAvoidPage.completePageAndContinue({ anyDatesToAvoid: 'No', verifyAllTextOnPage: true });

      await cui_pages.hearingNeedsPage.verifyUserIsOnPage();
    });

    await test.step('Verify user is able to see their answers on check your answers page', async () => {
      await cui_pages.hearingNeedsPage.navigationClick(cui_pages.hearingNeedsPage.$interactive.checkAndSendLink);

      await cui_pages.hearingCheckAnswersPage.verifyUserIsOnPage();
      await Promise.all([
        // Verify correct number of question and answers
        expect(cui_pages.hearingCheckAnswersPage.$static.questionLabel).toHaveCount(12),
        ...Array.from({ length: 12 }, (_, i) => expect(cui_pages.hearingCheckAnswersPage.$static.questionLabel.nth(i)).toBeVisible()),
        expect(cui_pages.hearingCheckAnswersPage.$static.answerLabel).toHaveCount(12),
        ...Array.from({ length: 12 }, (_, i) => expect(cui_pages.hearingCheckAnswersPage.$static.answerLabel.nth(i)).toBeVisible()),

        // Verify witness section headings
        expect(cui_pages.hearingCheckAnswersPage.$static.witnessesHeadingLevel2).toBeVisible(),
        expect(cui_pages.hearingCheckAnswersPage.$static.witnessesHeadingLevel3).toBeVisible(),
        // Verify 1st question and answer pair within witness section
        expect(cui_pages.hearingCheckAnswersPage.$questionLocator('willAnyWitnessesComeToHearing')).toBeVisible(),
        expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('willAnyWitnessesComeToHearing')).toHaveText('No'),
        expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('willAnyWitnessesComeToHearing')).toBeVisible(),
        // Verify 2nd question and answer pair within witness section
        expect(cui_pages.hearingCheckAnswersPage.$questionLocator('willYouOrWitnessAttendOutsideUk')).toBeVisible(),
        expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('willYouOrWitnessAttendOutsideUk')).toHaveText('No'),
        expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('willYouOrWitnessAttendOutsideUk')).toBeVisible(),
        // Verify locator to change answer to both questions is visisble
        expect(cui_pages.hearingCheckAnswersPage.$interactive.changeAnswerForWillAnyWitnessesComeToHearingLink).toBeVisible(),
        expect(cui_pages.hearingCheckAnswersPage.$interactive.changeWillYouOrWitnessAttendOutsideUklink).toBeVisible(),

        /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

        // Verify access needs section
        expect(cui_pages.hearingCheckAnswersPage.$static.accessNeedsHeadingLevel2).toBeVisible(),

        // Verify interpreter support section
        expect(cui_pages.hearingCheckAnswersPage.$static.interpreterHeadingLevel3).toBeVisible(),
        // Verify question and answer pair within interpreter support section
        expect(cui_pages.hearingCheckAnswersPage.$questionLocator('willYouNeedanInterpreter')).toBeVisible(),
        expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('willYouNeedanInterpreter')).toHaveText('No'),
        expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('willYouNeedanInterpreter')).toBeVisible(),
        // Verify locator to change answer to interpreter support section
        expect(cui_pages.hearingCheckAnswersPage.$interactive.changeWillYouNeedanInterpreterLink).toBeVisible(),

        /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

        // Verify step free access heading
        expect(cui_pages.hearingCheckAnswersPage.$static.stepFreeAccessHeadingLevel3).toBeVisible(),
        // Verify question and answer pair within step free access section
        expect(cui_pages.hearingCheckAnswersPage.$questionLocator('willYouOrWitnessNeedStepFreeAccess')).toBeVisible(),
        expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('willYouOrWitnessNeedStepFreeAccess')).toHaveText('No'),
        expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('willYouOrWitnessNeedStepFreeAccess')).toBeVisible(),
        // Verify locator to change answer to step free access question is visible
        expect(cui_pages.hearingCheckAnswersPage.$interactive.changeWillYouOrWitnessNeedStepFreeAccessLink).toBeVisible(),

        /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

        // Verify hearing loop heading
        expect(cui_pages.hearingCheckAnswersPage.$static.hearingLoopHeadingLevel3).toBeVisible(),
        // Verify question and answer pair within hearing loop section
        expect(cui_pages.hearingCheckAnswersPage.$questionLocator('willYouOrWitnessRequireHearingLoop')).toBeVisible(),
        expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('willYouOrWitnessRequireHearingLoop')).toHaveText('No'),
        expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('willYouOrWitnessRequireHearingLoop')).toBeVisible(),
        // Verify locator to change answer to hearing loop question is visible
        expect(cui_pages.hearingCheckAnswersPage.$interactive.changeWillYouOrWitnessRequireHearingLoopLink).toBeVisible(),

        /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

        // Verify other needs section
        expect(cui_pages.hearingCheckAnswersPage.$static.otherNeedsLevel2Heading).toBeVisible(),

        // Verify multimedia evidence section
        expect(cui_pages.hearingCheckAnswersPage.$static.multiMediaEvidenceLevel3Heading).toBeVisible(),
        // Verify question and answer pair within multimedia evidence section
        expect(cui_pages.hearingCheckAnswersPage.$questionLocator('willYouBringVideoOrAudioEvidence')).toBeVisible(),
        expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('willYouBringVideoOrAudioEvidence')).toHaveText('No'),
        expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('willYouBringVideoOrAudioEvidence')).toBeVisible(),
        // Verify locator to change answer to multimedia evidence question is visible
        expect(cui_pages.hearingCheckAnswersPage.$interactive.changeWillYouBringVideoOrAudioEvidenceLink).toBeVisible(),

        /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

        // Verify all female or male section
        expect(cui_pages.hearingCheckAnswersPage.$static.allFemaleOrMaleLevel3Heading).toBeVisible(),
        // Verify question and answer pair within all female or male section
        expect(cui_pages.hearingCheckAnswersPage.$questionLocator('willYouNeedAllFemaleOrMaleHearing')).toBeVisible(),
        expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('willYouNeedAllFemaleOrMaleHearing')).toHaveText('No'),
        expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('willYouNeedAllFemaleOrMaleHearing')).toBeVisible(),
        // Verify locator to change answer to question within all female or male section is visible
        expect(cui_pages.hearingCheckAnswersPage.$interactive.changeWillYouNeedAllFemaleOrMaleHearingLink).toBeVisible(),

        /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

        // Verify private hearing section
        expect(cui_pages.hearingCheckAnswersPage.$static.privateHearingLevel3Heading).toBeVisible(),
        // Verify question and answer pair within private hearing section
        expect(cui_pages.hearingCheckAnswersPage.$questionLocator('willYouNeedAPrivateHearing')).toBeVisible(),
        expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('willYouNeedAPrivateHearing')).toHaveText('No'),
        expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('willYouNeedAPrivateHearing')).toBeVisible(),
        // Verify locator to change answer to question within private hearing section is visible
        expect(cui_pages.hearingCheckAnswersPage.$interactive.changeWillYouNeedAPrivateHearingLink).toBeVisible(),

        /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

        // Verify physical or mental health conditions section
        expect(cui_pages.hearingCheckAnswersPage.$static.physicalOrMentalHealthLevel3Heading).toBeVisible(),
        // Verify question and answer pair within physical or mental health conditions section
        expect(cui_pages.hearingCheckAnswersPage.$questionLocator('doYouHaveAnyPhysicalOrMentalHealthConditions')).toBeVisible(),
        expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('doYouHaveAnyPhysicalOrMentalHealthConditions')).toHaveText('No'),
        expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('doYouHaveAnyPhysicalOrMentalHealthConditions')).toBeVisible(),
        // Verify locator to change answer to question within physical or mental health conditions section is visible
        expect(cui_pages.hearingCheckAnswersPage.$interactive.changeDoYouHaveAnyPhysicalOrMentalHealthConditionsLink).toBeVisible(),

        /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

        // Verify past experience that may affect hearing section
        expect(cui_pages.hearingCheckAnswersPage.$static.pastExperiencesLevel3Heading).toBeVisible(),
        // Verify question and answer pair within past experience that may affect hearing section
        expect(cui_pages.hearingCheckAnswersPage.$questionLocator('haveYouHadAnyPastExperiences')).toBeVisible(),
        expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('haveYouHadAnyPastExperiences')).toHaveText('No'),
        expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('haveYouHadAnyPastExperiences')).toBeVisible(),
        // Verify locator to change answer to question within past experience that may affect hearing section is visible
        expect(cui_pages.hearingCheckAnswersPage.$interactive.changeHaveYouHadAnyPastExperiencesLink).toBeVisible(),

        /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

        // Verify anything else section
        expect(cui_pages.hearingCheckAnswersPage.$static.anythingElseLevel3Heading).toBeVisible(),
        // Verify question and answer pair within anything else section
        expect(cui_pages.hearingCheckAnswersPage.$questionLocator('willYouNeedAnythingElseAtHearing')).toBeVisible(),
        expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('willYouNeedAnythingElseAtHearing')).toHaveText('No'),
        expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('willYouNeedAnythingElseAtHearing')).toBeVisible(),
        // Verify locator to change answer to question within anything else section is visible
        expect(cui_pages.hearingCheckAnswersPage.$interactive.changeWillYouNeedAnythingElseAtHearingLink).toBeVisible(),

        /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

        // Verify dates to avoid section
        expect(cui_pages.hearingCheckAnswersPage.$static.datesToAvoidLevel2Heading).toBeVisible(),
        // Verify question and answer pair within dates to avoid section
        expect(cui_pages.hearingCheckAnswersPage.$questionLocator('areThereAnyDatesYouCannotAttend')).toBeVisible(),
        expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('areThereAnyDatesYouCannotAttend')).toHaveText('No'),
        expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('areThereAnyDatesYouCannotAttend')).toBeVisible(),
        // Verify locator to change answer to question within dates to avoid section is visible
        expect(cui_pages.hearingCheckAnswersPage.$interactive.changeAreThereAnyDatesYouCannotAttendLink).toBeVisible(),
      ]);
    });

    await test.step('Verify user is able to submit their hearing requirements', async () => {
      await cui_pages.hearingCheckAnswersPage.submitAnswers();

      await cui_pages.hearingSuccessPage.verifyUserIsOnPage();
      await cui_pages.hearingSuccessPage.verifyAllTextOnPage();
    });
  });

  test(
    'Verify user is able to submit response to hearing requirements by taking longest path',
    { tag: ['@e2e'] },
    async ({ cui_pages, dataUtils }) => {
      const witnessData = await test.step('Provide response to hearing witness section of journey', async () => {
        await cui_pages.appealOverviewPage.navigationClick(cui_pages.appealOverviewPage.$interactive.continueButton);

        await cui_pages.hearingNeedsPage.verifyUserIsOnPage();
        await cui_pages.hearingNeedsPage.navigationClick(cui_pages.hearingNeedsPage.$interactive.witnessLink);

        await cui_pages.hearingWitnessesPage.verifyUserIsOnPage();
        await cui_pages.hearingWitnessesPage.completePageAndContinue({ doesApplicantHaveAWitness: 'Yes' });

        const witnessName = await dataUtils.generateRandomFirstAndLastNames({ countOfFirstNamesToGenerate: 1, countOfLastNamesToGenerate: 1 });
        await cui_pages.hearingWitnessNamesPage.verifyUserIsOnPage();
        await cui_pages.hearingWitnessNamesPage.completePageAndContinue({
          givenNames: witnessName.firstNames[0],
          familyName: witnessName.lastNames[0],
          verifyAllTextOnPage: true,
        });

        await cui_pages.hearingOutsideUKPage.verifyUserIsOnPage();
        await cui_pages.hearingOutsideUKPage.completePageAndContinue({ doesApplicantHaveAWitness: 'Yes' });

        await cui_pages.hearingNeedsPage.verifyUserIsOnPage();
        return witnessName;
      });

      await test.step('Provide response to access needs section of journey', async () => {
        await cui_pages.hearingNeedsPage.navigationClick(cui_pages.hearingNeedsPage.$interactive.accessNeedsLink);

        await cui_pages.hearingAccessNeedsPage.verifyUserIsOnPage();
        await cui_pages.hearingAccessNeedsPage.continueOnToNextPage({});

        await cui_pages.hearingInterpreterSupportAppellantWitnessesPage.verifyUserIsOnPage();
        await cui_pages.hearingInterpreterSupportAppellantWitnessesPage.completePageAndContinue({
          typeOfSupport: 'Interpretor for applicant and witness',
          verifyAllTextOnPage: true,
        });

        await cui_pages.hearingInterpreterTypesPage.verifyUserIsOnPage();
        await cui_pages.hearingInterpreterTypesPage.completePageAndContinue({
          typeOfInterpretor: 'Spoken and sign language interpretor',
          verifyAllTextOnPage: true,
        });

        cui_pages.hearingInterpreterSpokenLanguageSelectionPage.verifyUserIsOnPage();
        await cui_pages.hearingInterpreterSpokenLanguageSelectionPage.completePageAndContinue({
          languageToInterpretPreference: 'Select language from dropdown',
          selectLanguageFromDropdown: 'Mandarin',
          verifyAllTextOnPage: true,
        });

        await cui_pages.hearingInterpreterSignLanguageSelectionPage.verifyUserIsOnPage();
        await cui_pages.hearingInterpreterSignLanguageSelectionPage.completePageAndContinue({
          languageToInterpretPreference: 'Select sign language from dropdown',
          selectSignLanguageFromDropdown: 'British Sign Language (BSL)',
          verifyAllTextOnPage: true,
        });

        await cui_pages.hearingInterpreterTypesWitnessPage.verifyUserIsOnPage();
        await cui_pages.hearingInterpreterTypesWitnessPage.completePageAndContinue({
          typeOfInterpretor: 'Spoken and sign language interpretor',
          verifyAllTextOnPage: true,
        });

        await cui_pages.hearingInterpreterSpokenLanguageSelectionWitnessPage.verifyUserIsOnPage();
        await cui_pages.hearingInterpreterSpokenLanguageSelectionWitnessPage.completePageAndContinue({
          languageToInterpretPreference: 'Select language from dropdown',
          selectLanguageFromDropdown: 'Portuguese',
          verifyAllTextOnPage: true,
        });

        await cui_pages.hearingInterpreterSignLanguageSelectionWitnessPage.verifyUserIsOnPage();
        await cui_pages.hearingInterpreterSignLanguageSelectionWitnessPage.completePageAndContinue({
          languageToInterpretPreference: 'Select sign language from dropdown',
          selectSignLanguageFromDropdown: 'Visual frame signing',
          verifyAllTextOnPage: true,
        });

        await cui_pages.hearingStepFreeAccessPage.verifyUserIsOnPage();
        await cui_pages.hearingStepFreeAccessPage.completePageAndContinue({ willYouOrWitnessRequireStepFreeAccess: 'Yes' });

        await cui_pages.hearingLoopPage.verifyUserIsOnPage();
        await cui_pages.hearingLoopPage.completePageAndContinue({ willYouOrWitnessNeedHearingLoop: 'Yes' });

        await cui_pages.hearingNeedsPage.verifyUserIsOnPage();
      });

      await test.step('Provide response to other needs section of journey', async () => {
        await cui_pages.hearingNeedsPage.navigationClick(cui_pages.hearingNeedsPage.$interactive.otherNeedsLink);

        await cui_pages.hearingOtherNeedsPage.verifyUserIsOnPage();
        await cui_pages.hearingOtherNeedsPage.continueOnToNextPage({});

        await cui_pages.hearingVideoAppointmentPage.verifyUserIsOnPage();
        await cui_pages.hearingVideoAppointmentPage.completePageAndContinue({ areYouAbleToJoinHearingViaVideoCall: 'No' });

        await cui_pages.hearingVideoAppointmentReasonsPage.verifyUserIsOnPage();
        await cui_pages.hearingVideoAppointmentReasonsPage.completePageAndContinue({
          reasonUnableToJoinVideoCall: 'I do not have access to a device that can join a video call',
        });

        await cui_pages.hearingMultimediaEvidencePage.verifyUserIsOnPage();
        await cui_pages.hearingMultimediaEvidencePage.completePageAndContinue({ willYouBringVideoOrAudioEvidence: 'Yes' });

        await cui_pages.hearingMultimediaEvidenceEquipmentPage.verifyUserIsOnPage();
        await cui_pages.hearingMultimediaEvidenceEquipmentPage.completePageAndContinue({
          willYouBringEquipmentToPlayEvidence: 'No',
          verifyAllTextOnPage: true,
        });

        await cui_pages.hearingMultimediaEvidenceEquipmentReasonsPage.verifyUserIsOnPage();
        await cui_pages.hearingMultimediaEvidenceEquipmentReasonsPage.completePageAndContinue({
          reasonUnableToBringEquipment: 'I do not have access to the equipment needed to play the evidence',
        });

        await cui_pages.hearingSingleSexPage.verifyUserIsOnPage();
        await cui_pages.hearingSingleSexPage.completePageAndContinue({ willYouNeedAllFemaleOrMaleHearing: 'Yes' });

        await cui_pages.hearingSingleSexTypePage.verifyUserIsOnPage();
        await cui_pages.hearingSingleSexTypePage.completePageAndContinue({ typeOfHearing: 'All male', verifyAllTextOnPage: true });

        await cui_pages.hearingSingleSexTypeMalePage.verifyUserIsOnPage();
        await cui_pages.hearingSingleSexTypeMalePage.completePageAndContinue({
          reasonForAllMaleHearing: 'Test reason for all male hearing.',
        });

        await cui_pages.hearingPrivatePage.verifyUserIsOnPage();
        await cui_pages.hearingPrivatePage.completePageAndContinue({ willYouNeedAPrivateHearing: 'Yes' });

        await cui_pages.hearingPrivateReasonPage.verifyUserIsOnPage();
        await cui_pages.hearingPrivateReasonPage.completePageAndContinue({
          reasonForPrivateHearing: 'Test reason for private hearing.',
        });

        await cui_pages.hearingPhysicalMentalHealthPage.verifyUserIsOnPage();
        await cui_pages.hearingPhysicalMentalHealthPage.completePageAndContinue({
          anyPhysicalOrMentalHealthConditions: 'Yes',
        });

        await cui_pages.hearingPhysicalMentalHealthReasonsPage.verifyUserIsOnPage();
        await cui_pages.hearingPhysicalMentalHealthReasonsPage.completePageAndContinue({
          howManyPhysicalOrMentalHealthConditions: 'Test reason for physical or mental health condition.',
        });

        await cui_pages.hearingPastExperiencesPage.verifyUserIsOnPage();
        await cui_pages.hearingPastExperiencesPage.completePageAndContinue({
          anyPastExperienceThatMayAffectHearing: 'Yes',
        });

        await cui_pages.hearingPastExperiencesReasonsPage.verifyUserIsOnPage();
        await cui_pages.hearingPastExperiencesReasonsPage.completePageAndContinue({
          howManyPastExpereincesThatMayAffectHearing: 'Test reason for past experience that may affect hearing.',
        });

        await cui_pages.hearingAnythingElsePage.verifyUserIsOnPage();
        await cui_pages.hearingAnythingElsePage.completePageAndContinue({ needAnythingElse: 'Yes' });

        await cui_pages.hearingAnythingElseReasonsPage.verifyUserIsOnPage();
        await cui_pages.hearingAnythingElseReasonsPage.completePageAndContinue({
          whatAndWhyYouNeedIt: 'Test reason for anything else.',
        });

        await cui_pages.hearingNeedsPage.verifyUserIsOnPage();
      });

      const dateToAvoid = await test.step('Provide response to dates to avoid section of journey', async () => {
        await cui_pages.hearingNeedsPage.navigationClick(cui_pages.hearingNeedsPage.$interactive.datesToAvoidLink);

        await cui_pages.hearingDatesAvoidPage.verifyUserIsOnPage({ urlPath: 'hearing-dates-avoid' });
        await cui_pages.hearingDatesAvoidPage.completePageAndContinue({ anyDatesToAvoid: 'Yes' });

        const dateToAvoid = await dataUtils.getDateFromToday({ dayOffset: 10 });
        await cui_pages.hearingDatesAvoidEnterPage.verifyUserIsOnPage();
        await cui_pages.hearingDatesAvoidEnterPage.completePageAndContinue({
          day: dateToAvoid.day,
          month: dateToAvoid.month,
          year: dateToAvoid.year,
          verifyAllTextOnPage: true,
        });

        await cui_pages.hearingDatesAvoidReasonsPage.verifyUserIsOnPage();
        await cui_pages.hearingDatesAvoidReasonsPage.completePageAndContinue({
          reasonForAvoidingDate: 'Test reason for avoiding date.',
        });

        await cui_pages.hearingDatesAvoidPage.verifyUserIsOnPage({ urlPath: 'hearing-dates-avoid-new' });
        await cui_pages.hearingDatesAvoidPage.completePageAndContinue({ anyDatesToAvoid: 'No' });

        await cui_pages.hearingNeedsPage.verifyUserIsOnPage();
        return dateToAvoid.full;
      });

      await test.step('Verify user is able to see their answers on check your answers page', async () => {
        await cui_pages.hearingNeedsPage.navigationClick(cui_pages.hearingNeedsPage.$interactive.checkAndSendLink);

        await cui_pages.hearingCheckAnswersPage.verifyUserIsOnPage();
        await Promise.all([
          // Verify correct number of question and answers
          expect(cui_pages.hearingCheckAnswersPage.$static.questionLabel).toHaveCount(27),
          ...Array.from({ length: 27 }, (_, i) => expect(cui_pages.hearingCheckAnswersPage.$static.questionLabel.nth(i)).toBeVisible()),
          expect(cui_pages.hearingCheckAnswersPage.$static.answerLabel).toHaveCount(27),
          ...Array.from({ length: 27 }, (_, i) => expect(cui_pages.hearingCheckAnswersPage.$static.answerLabel.nth(i)).toBeVisible()),

          // Verify witness section headings
          expect(cui_pages.hearingCheckAnswersPage.$static.witnessesHeadingLevel2).toBeVisible(),
          expect(cui_pages.hearingCheckAnswersPage.$static.witnessesHeadingLevel3).toBeVisible(),
          // Verify 1st question and answer pair within witness section
          expect(cui_pages.hearingCheckAnswersPage.$questionLocator('willAnyWitnessesComeToHearing')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('willAnyWitnessesComeToHearing')).toHaveText('Yes'),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('willAnyWitnessesComeToHearing')).toBeVisible(),
          // Verify 2nd question and answer pair within witness section
          expect(cui_pages.hearingCheckAnswersPage.$questionLocator('witnessesNames')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('witnessesNames')).toHaveText(
            `${witnessData.firstNames[0]} ${witnessData.lastNames[0]}`,
          ),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('witnessesNames')).toBeVisible(),
          // Verify 3rd question and answer pair within witness section
          expect(cui_pages.hearingCheckAnswersPage.$questionLocator('willYouOrWitnessAttendOutsideUk')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('willYouOrWitnessAttendOutsideUk')).toHaveText('Yes'),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('willYouOrWitnessAttendOutsideUk')).toBeVisible(),
          // Verify locator to change answer to all 3 questions is visisble
          expect(cui_pages.hearingCheckAnswersPage.$interactive.changeAnswerForWillAnyWitnessesComeToHearingLink).toBeVisible(),
          expect(cui_pages.hearingCheckAnswersPage.$interactive.changeWitnessesNamesLink).toBeVisible(),
          expect(cui_pages.hearingCheckAnswersPage.$interactive.changeWillYouOrWitnessAttendOutsideUklink).toBeVisible(),

          /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

          // Verify access needs section
          expect(cui_pages.hearingCheckAnswersPage.$static.accessNeedsHeadingLevel2).toBeVisible(),

          // Verify interpreter support section
          expect(cui_pages.hearingCheckAnswersPage.$static.interpreterHeadingLevel3).toBeVisible(),

          // Verify 1st question and answer pair within acesss needs section
          expect(cui_pages.hearingCheckAnswersPage.$questionLocator('whoAreYouRequestingInterpreterSupportFor')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('whoAreYouRequestingInterpreterSupportFor')).toHaveText(
            'Interpreter support for me personallyInterpreter support for one or more witnesses',
          ),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('whoAreYouRequestingInterpreterSupportFor')).toBeVisible(),
          // Verify 2nd question and answer pair within acesss needs section
          expect(cui_pages.hearingCheckAnswersPage.$questionLocator('whatKindOfInterpreterWillApplicantNeed')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('whatKindOfInterpreterWillApplicantNeed')).toHaveText(
            'Spoken language interpreterSign language interpreter',
          ),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('whatKindOfInterpreterWillApplicantNeed')).toBeVisible(),
          // Verify 3rd question and answer pair within acesss needs section
          expect(cui_pages.hearingCheckAnswersPage.$questionLocator('applicantSpokenLanguageRequirement')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('applicantSpokenLanguageRequirement')).toHaveText('Mandarin'),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('applicantSpokenLanguageRequirement')).toBeVisible(),
          // Verify 4th question and answer pair within acesss needs section
          expect(cui_pages.hearingCheckAnswersPage.$questionLocator('applicantSignLanguageRequirement')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('applicantSignLanguageRequirement')).toHaveText(
            'British Sign Language (BSL)',
          ),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('applicantSignLanguageRequirement')).toBeVisible(),
          // Verify 5th question and answer pair within acesss needs section
          expect(cui_pages.hearingCheckAnswersPage.$questionLocator('whatKindOfInterpreterWillWitnessNeed')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('whatKindOfInterpreterWillWitnessNeed')).toHaveText(
            'Spoken language interpreterSign language interpreter',
          ),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('whatKindOfInterpreterWillWitnessNeed')).toBeVisible(),
          // Verify 6th question and answer pair within acesss needs section
          expect(cui_pages.hearingCheckAnswersPage.$questionLocator('witnessSpokenLanguageRequirement')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('witnessSpokenLanguageRequirement')).toHaveText('Portuguese'),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('witnessSpokenLanguageRequirement')).toBeVisible(),
          // Verify 7th question and answer pair within acesss needs section
          expect(cui_pages.hearingCheckAnswersPage.$questionLocator('witnessSignLanguageRequirement')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('witnessSignLanguageRequirement')).toHaveText('Visual frame signing'),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('witnessSignLanguageRequirement')).toBeVisible(),
          // Verify locator to change answer to all 7 interpreter questions is visible
          expect(cui_pages.hearingCheckAnswersPage.$interactive.changeWhoAreYouRequestingInterpreterSupportForLink).toBeVisible(),
          expect(cui_pages.hearingCheckAnswersPage.$interactive.changeWhatKindOfInterpreterWillApplicantNeedLink).toBeVisible(),
          expect(cui_pages.hearingCheckAnswersPage.$interactive.changeApplicantSpokenLanguageRequirementLink).toBeVisible(),
          expect(cui_pages.hearingCheckAnswersPage.$interactive.changeApplicantSignLanguageRequirementLink).toBeVisible(),
          expect(cui_pages.hearingCheckAnswersPage.$interactive.changeWhatKindOfInterpreterWillWitnessNeedLink).toBeVisible(),
          expect(cui_pages.hearingCheckAnswersPage.$interactive.changeWitnessSpokenLanguageRequirementLink).toBeVisible(),
          expect(cui_pages.hearingCheckAnswersPage.$interactive.changeWitnessSignLanguageRequirementLink).toBeVisible(),

          /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

          // Verify step free access heading
          expect(cui_pages.hearingCheckAnswersPage.$static.stepFreeAccessHeadingLevel3).toBeVisible(),
          // Verify question and answer pair within step free access section
          expect(cui_pages.hearingCheckAnswersPage.$questionLocator('willYouOrWitnessNeedStepFreeAccess')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('willYouOrWitnessNeedStepFreeAccess')).toHaveText('Yes'),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('willYouOrWitnessNeedStepFreeAccess')).toBeVisible(),
          // Verify locator to change answer to step free access question is visible
          expect(cui_pages.hearingCheckAnswersPage.$interactive.changeWillYouOrWitnessNeedStepFreeAccessLink).toBeVisible(),

          /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

          // Verify hearing loop heading
          expect(cui_pages.hearingCheckAnswersPage.$static.hearingLoopHeadingLevel3).toBeVisible(),
          // Verify question and answer pair within hearing loop section
          expect(cui_pages.hearingCheckAnswersPage.$questionLocator('willYouOrWitnessRequireHearingLoop')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('willYouOrWitnessRequireHearingLoop')).toHaveText('Yes'),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('willYouOrWitnessRequireHearingLoop')).toBeVisible(),
          // Verify locator to change answer to hearing loop question is visible
          expect(cui_pages.hearingCheckAnswersPage.$interactive.changeWillYouOrWitnessRequireHearingLoopLink).toBeVisible(),

          /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

          // Verify other needs section
          expect(cui_pages.hearingCheckAnswersPage.$static.otherNeedsLevel2Heading).toBeVisible(),

          // Verify multimedia evidence section
          expect(cui_pages.hearingCheckAnswersPage.$static.multiMediaEvidenceLevel3Heading).toBeVisible(),
          // Verify 1st question and answer pair within multimedia evidence section
          expect(cui_pages.hearingCheckAnswersPage.$questionLocator('willYouBringVideoOrAudioEvidence')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('willYouBringVideoOrAudioEvidence')).toHaveText('Yes'),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('willYouBringVideoOrAudioEvidence')).toBeVisible(),
          // Verify 2nd question and answer pair within multimedia evidence section
          expect(cui_pages.hearingCheckAnswersPage.$questionLocator('willYouBringEquipmentToPlayEvidence')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('willYouBringEquipmentToPlayEvidence')).toHaveText('No'),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('willYouBringEquipmentToPlayEvidence')).toBeVisible(),
          // Verify 3rd question and answer pair within multimedia evidence section
          expect(cui_pages.hearingCheckAnswersPage.$questionLocator('whyUnableToBringEquipmentToPlayEvidence')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('whyUnableToBringEquipmentToPlayEvidence')).toHaveText(
            'I do not have access to the equipment needed to play the evidence',
          ),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('whyUnableToBringEquipmentToPlayEvidence')).toBeVisible(),
          // Verify locator to change answer to all three multimedia evidence questions is visible
          expect(cui_pages.hearingCheckAnswersPage.$interactive.changeWillYouBringVideoOrAudioEvidenceLink).toBeVisible(),
          expect(cui_pages.hearingCheckAnswersPage.$interactive.changeWillYouBringEquipmentToPlayEvidenceLink).toBeVisible(),
          expect(cui_pages.hearingCheckAnswersPage.$interactive.changeWhyUnableToBringEquipmentToPlayEvidenceLink).toBeVisible(),

          /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

          // Verify all female or male section
          expect(cui_pages.hearingCheckAnswersPage.$static.allFemaleOrMaleLevel3Heading).toBeVisible(),
          // Verify 1st question and answer pair within all female or male section
          expect(cui_pages.hearingCheckAnswersPage.$questionLocator('willYouNeedAllFemaleOrMaleHearing')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('willYouNeedAllFemaleOrMaleHearing')).toHaveText('Yes'),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('willYouNeedAllFemaleOrMaleHearing')).toBeVisible(),
          // Verify 2nd question and answer pair within all female or male section
          expect(cui_pages.hearingCheckAnswersPage.$questionLocator('whatTypeOfHearingDoYouNeed')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('whatTypeOfHearingDoYouNeed')).toHaveText('All male'),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('whatTypeOfHearingDoYouNeed')).toBeVisible(),
          // Verify 3rd question and answer pair within all female or male section
          expect(cui_pages.hearingCheckAnswersPage.$questionLocator('whyYouNeedAllMaleHearing')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('whyYouNeedAllMaleHearing')).toHaveText('Test reason for all male hearing.'),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('whyYouNeedAllMaleHearing')).toBeVisible(),
          // Verify locator to change answer to all three questions within all female or male section is visible
          expect(cui_pages.hearingCheckAnswersPage.$interactive.changeWillYouNeedAllFemaleOrMaleHearingLink).toBeVisible(),
          expect(cui_pages.hearingCheckAnswersPage.$interactive.changeWhatTypeOfHearingDoYouNeedLink).toBeVisible(),
          expect(cui_pages.hearingCheckAnswersPage.$interactive.changeWhyYouNeedAllMaleHearingLink).toBeVisible(),

          /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

          // Verify private hearing section
          expect(cui_pages.hearingCheckAnswersPage.$static.privateHearingLevel3Heading).toBeVisible(),
          // Verify 1st question and answer pair within private hearing section
          expect(cui_pages.hearingCheckAnswersPage.$questionLocator('willYouNeedAPrivateHearing')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('willYouNeedAPrivateHearing')).toHaveText('Yes'),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('willYouNeedAPrivateHearing')).toBeVisible(),
          // Verify 2nd question and answer pair within private hearing section
          expect(cui_pages.hearingCheckAnswersPage.$questionLocator('whyYouNeedAPrivateHearing')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('whyYouNeedAPrivateHearing')).toHaveText('Test reason for private hearing.'),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('whyYouNeedAPrivateHearing')).toBeVisible(),
          // Verify locator to change answer to both questions within private hearing section is visible
          expect(cui_pages.hearingCheckAnswersPage.$interactive.changeWillYouNeedAPrivateHearingLink).toBeVisible(),
          expect(cui_pages.hearingCheckAnswersPage.$interactive.changeWhyYouNeedAPrivateHearingLink).toBeVisible(),

          /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

          // Verify physical or mental health conditions section
          expect(cui_pages.hearingCheckAnswersPage.$static.physicalOrMentalHealthLevel3Heading).toBeVisible(),
          // Verify 1st question and answer pair within physical or mental health conditions section
          expect(cui_pages.hearingCheckAnswersPage.$questionLocator('doYouHaveAnyPhysicalOrMentalHealthConditions')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('doYouHaveAnyPhysicalOrMentalHealthConditions')).toHaveText('Yes'),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('doYouHaveAnyPhysicalOrMentalHealthConditions')).toBeVisible(),
          // Verify 2nd question and answer pair within physical or mental health conditions section
          expect(cui_pages.hearingCheckAnswersPage.$questionLocator('howManyPhysicalOrMentalHealthConditionsDoYouHave')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('howManyPhysicalOrMentalHealthConditionsDoYouHave')).toHaveText(
            'Test reason for physical or mental health condition.',
          ),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('howManyPhysicalOrMentalHealthConditionsDoYouHave')).toBeVisible(),
          // Verify locator to change answer to both questions within physical or mental health conditions section is visible
          expect(cui_pages.hearingCheckAnswersPage.$interactive.changeDoYouHaveAnyPhysicalOrMentalHealthConditionsLink).toBeVisible(),
          expect(cui_pages.hearingCheckAnswersPage.$interactive.changeHowManyPhysicalOrMentalHealthConditionsDoYouHaveLink).toBeVisible(),

          /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

          // Verify past experience that may affect hearing section
          expect(cui_pages.hearingCheckAnswersPage.$static.pastExperiencesLevel3Heading).toBeVisible(),
          // Verify 1st question and answer pair within past experience that may affect hearing section
          expect(cui_pages.hearingCheckAnswersPage.$questionLocator('haveYouHadAnyPastExperiences')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('haveYouHadAnyPastExperiences')).toHaveText('Yes'),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('haveYouHadAnyPastExperiences')).toBeVisible(),
          // Verify 2nd question and answer pair within past experience that may affect hearing section
          expect(cui_pages.hearingCheckAnswersPage.$questionLocator('tellUsAboutYourPastExperiences')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('tellUsAboutYourPastExperiences')).toHaveText(
            'Test reason for past experience that may affect hearing.',
          ),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('tellUsAboutYourPastExperiences')).toBeVisible(),
          // Verify locator to change answer to both questions within past experience that may affect hearing section is visible
          expect(cui_pages.hearingCheckAnswersPage.$interactive.changeHaveYouHadAnyPastExperiencesLink).toBeVisible(),
          expect(cui_pages.hearingCheckAnswersPage.$interactive.changeTellUsAboutYourPastExperiencesLink).toBeVisible(),

          /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

          // Verify anything else section
          expect(cui_pages.hearingCheckAnswersPage.$static.anythingElseLevel3Heading).toBeVisible(),
          // Verify 1st question and answer pair within anything else section
          expect(cui_pages.hearingCheckAnswersPage.$questionLocator('willYouNeedAnythingElseAtHearing')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('willYouNeedAnythingElseAtHearing')).toHaveText('Yes'),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('willYouNeedAnythingElseAtHearing')).toBeVisible(),
          // Verify 2nd question and answer pair within anything else section
          expect(cui_pages.hearingCheckAnswersPage.$questionLocator('tellUsWhatAndWhyYouNeedIt')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('tellUsWhatAndWhyYouNeedIt')).toHaveText('Test reason for anything else.'),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('tellUsWhatAndWhyYouNeedIt')).toBeVisible(),
          // Verify locator to change answer to both questions within anything else section is visible
          expect(cui_pages.hearingCheckAnswersPage.$interactive.changeWillYouNeedAnythingElseAtHearingLink).toBeVisible(),
          expect(cui_pages.hearingCheckAnswersPage.$interactive.changeTellUsWhatAndWhyYouNeedItLink).toBeVisible(),

          /* 
        ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        */

          // Verify dates to avoid section
          expect(cui_pages.hearingCheckAnswersPage.$static.datesToAvoidLevel2Heading).toBeVisible(),
          // Verify 1st question and answer pair within dates to avoid section
          expect(cui_pages.hearingCheckAnswersPage.$questionLocator('areThereAnyDatesYouCannotAttend')).toBeVisible(),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('areThereAnyDatesYouCannotAttend')).toHaveText('Yes'),
          expect(cui_pages.hearingCheckAnswersPage.$questionValueLocator('areThereAnyDatesYouCannotAttend')).toBeVisible(),
          // Verify 2nd question and answer pair within dates to avoid section
          expect(cui_pages.hearingCheckAnswersPage.$static.dateLabel).toBeVisible(),
          expect(cui_pages.hearingCheckAnswersPage.$static.dateValue).toHaveText(dateToAvoid),
          expect(cui_pages.hearingCheckAnswersPage.$static.dateValue).toBeVisible(),

          expect(cui_pages.hearingCheckAnswersPage.$static.dateReasonLabel).toBeVisible(),
          expect(cui_pages.hearingCheckAnswersPage.$static.dateReasonValue).toHaveText('Test reason for avoiding date.'),
          expect(cui_pages.hearingCheckAnswersPage.$static.dateReasonValue).toBeVisible(),
          // Verify locator to change answer to both questions within dates to avoid section is visible
          expect(cui_pages.hearingCheckAnswersPage.$interactive.changeAreThereAnyDatesYouCannotAttendLink).toBeVisible(),
          expect(cui_pages.hearingCheckAnswersPage.$interactive.changeDateToAvoidLink).toBeVisible(),
        ]);
      });

      await test.step('Verify user is able to submit their hearing requirements', async () => {
        await cui_pages.hearingCheckAnswersPage.submitAnswers();

        await cui_pages.hearingSuccessPage.verifyUserIsOnPage();
        await cui_pages.hearingSuccessPage.verifyAllTextOnPage();
      });
    },
  );
});
