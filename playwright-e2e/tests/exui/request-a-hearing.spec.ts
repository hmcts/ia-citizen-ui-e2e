import { test, expect } from '../../fixtures.js';
import { config } from '../../utils/config.utils.js';

test.describe('Set of tests to verify admin user is able to request a hearing on exui manage cases', () => {
  test.use({ storageState: config.exuiUsers.adminOfficer.sessionFile });
  let caseIdFromBeforeEach: string;

  test.beforeEach(async ({ exui_caseOfficerApiClient, cui_apiClient, exui_pages, exui_homeOfficeUserApiClient }) => {
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
        pathToTake: 'Maximum Path',
      });

      await exui_caseOfficerApiClient.submitReviewHearingRequirementsEvent({
        caseId: caseId,
        isRemoteHearingAllowed: 'Granted',
        grantOrRefuseAnyAdjustmentsRequested: 'Granted',
        isApplicationSuitableToFloat: 'Yes',
        anyAdditionalInstructions: 'Yes',
        hearingType: 'Video',
      });
    });

    await test.step(`Admin User: Navigate to case overview page on exui`, async () => {
      await exui_pages.caseOverviewPage.goTo({ caseId: caseId });
    });

    caseIdFromBeforeEach = caseId;
  });

  test('Verify admin user is able to request a hearing', async ({ exui_pages, cui_apiClient }) => {
    const appealDetails = await cui_apiClient.getNewAppealDetails();
    const hearingRequirementDetails = await cui_apiClient.getHearingRequirementDetails();

    await test.step('Verify correct next steps are displayed on case overview page', async () => {
      await Promise.all([
        await expect(exui_pages.caseOverviewPage.$static.doThisNextHeading).toBeVisible(),
        await expect(exui_pages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toContainText(
          'The agreed hearing requirements and dates to avoid are available to view in the Hearing and appointment tab. You should request a hearing from the Hearings tab.',
        ),
        await expect(exui_pages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toBeVisible(),
      ]);
    });

    await test.step('Admin User: Request a hearing from the hearings tab', async () => {
      await exui_pages.caseOverviewPage.navigateToTab({ tabToSelect: 'Hearings' });

      await exui_pages.hearingsPage.verifyUserIsOnPage();
      await exui_pages.hearingsPage.navigateToRequestHearingPage();

      await exui_pages.hearingRequirementsPage.verifyUserIsOnPage();
      const applicantName = `${appealDetails.applicantDetails.givenNames} ${appealDetails.applicantDetails.familyName}`;
      const witnessName = hearingRequirementDetails.hearingWitnessFlow.witnessName;
      // eslint-disable-next-line playwright/no-conditional-in-test
      if (witnessName === undefined) {
        throw new Error('Witness can not be undefined for the assertions included in this test step');
      }

      await exui_pages.hearingRequirementsPage.verifyTextForApplicant({ applicantName: applicantName });
      await exui_pages.hearingRequirementsPage.verifyTableHeadingsForIndividual({ name: applicantName });
      await exui_pages.hearingRequirementsPage.verifyTableHeadingsForIndividual({ name: witnessName });

      await exui_pages.hearingRequirementsPage.verifyRequirementRequestedByIndividual({
        name: applicantName,
        requirementRequested: 'Step free / wheelchair access',
        flagStatus: 'ACTIVE',
      });

      await exui_pages.hearingRequirementsPage.verifyRequirementRequestedByIndividual({
        name: applicantName,
        requirementRequested: 'Hearing loop (hearing enhancement system)',
        flagStatus: 'ACTIVE',
      });

      await exui_pages.hearingRequirementsPage.verifyRequirementRequestedByIndividual({
        name: applicantName,
        requirementRequested: 'Sign Language Interpreter',
        comments: hearingRequirementDetails.hearingAccessNeedsFlow.typeOfInterpretorSupport?.applicantSignInterpretorLanguage,
        flagStatus: 'ACTIVE',
      });

      await exui_pages.hearingRequirementsPage.verifyRequirementRequestedByIndividual({
        name: applicantName,
        requirementRequested: 'Language Interpreter',
        comments: hearingRequirementDetails.hearingAccessNeedsFlow.typeOfInterpretorSupport?.applicantSpokenInterpretorLanguage,
        flagStatus: 'ACTIVE',
      });

      await exui_pages.hearingRequirementsPage.verifyRequirementRequestedByIndividual({
        name: witnessName,
        requirementRequested: 'Sign Language Interpreter',
        comments: hearingRequirementDetails.hearingAccessNeedsFlow.typeOfInterpretorSupport?.witnessSignInterpretorLanguage,
        flagStatus: 'ACTIVE',
      });

      await exui_pages.hearingRequirementsPage.verifyRequirementRequestedByIndividual({
        name: witnessName,
        requirementRequested: 'Language Interpreter',
        comments: hearingRequirementDetails.hearingAccessNeedsFlow.typeOfInterpretorSupport?.witnessSpokenInterpretorLanguage,
        flagStatus: 'ACTIVE',
      });

      await exui_pages.hearingRequirementsPage.continueOnToNextPage();

      await exui_pages.hearingFacilitiesPage.verifyUserIsOnPage();
      await exui_pages.hearingFacilitiesPage.verifyTextForApplicant({ applicantName: applicantName });
      await exui_pages.hearingFacilitiesPage.verifyTableHeadingsForApplicant({ applicantName: applicantName });
      await exui_pages.hearingFacilitiesPage.verifyRequirementsRequestedByApplicant({
        applicantName: applicantName,
        requirementRequested: 'Evidence given in private',
        flagStatus: 'ACTIVE',
      });

      await exui_pages.hearingFacilitiesPage.verifyRequirementsRequestedByApplicant({
        applicantName: applicantName,
        requirementRequested: 'Audio/Video Evidence',
        flagStatus: 'ACTIVE',
      });

      await exui_pages.hearingFacilitiesPage.continueOnToNextPage();

      await exui_pages.hearingStagePage.verifyUserIsOnPage();
      await exui_pages.hearingStagePage.verifyAllTextForApplicant({ applicantName: applicantName });
      await exui_pages.hearingStagePage.completePageAndContinue({ hearingStage: 'Substantive' });

      await exui_pages.hearingAttendancePage.verifyUserIsOnPage();
      await exui_pages.hearingAttendancePage.verifyAllTextOnPage({ applicantName: applicantName, witnessNames: [witnessName] });
      await exui_pages.hearingAttendancePage.completePageAndContinue({
        applicantName: applicantName,
        witnessNames: [witnessName],
        howWillEachParticipantAttend: 'Video',
        numberOfPeopleAttendingInPerson: 4,
      });

      await exui_pages.hearingVenuePage.verifyUserIsOnPage();
      await exui_pages.hearingVenuePage.verifyAllTextForApplicant({ applicantName: applicantName });
      await exui_pages.hearingVenuePage.completePageAndContinue({ location: 'Newport' });

      await exui_pages.hearingWelshPage.verifyUserIsOnPage();
      await exui_pages.hearingWelshPage.verifyAllTextForApplicant({ applicantName: applicantName });
      await exui_pages.hearingWelshPage.completePageAndContinue({ isWelshHearingRequired: 'No' });

      await exui_pages.hearingJudgePage.verifyUserIsOnPage();
      await exui_pages.hearingJudgePage.verifyAllTextForApplicant({ applicantName: applicantName });
      await expect(exui_pages.hearingJudgePage.page.getByRole('radio', { name: 'No' })).toBeChecked();
      await expect(exui_pages.hearingJudgePage.page.getByRole('checkbox', { name: 'Tribunal Judge' })).toBeChecked();
      await exui_pages.hearingJudgePage.completePageAndContinue({});

      await exui_pages.hearingPanelPage.verifyUserIsOnPage();
      await Promise.all([
        expect(exui_pages.hearingPanelPage.page.getByText(`Request a hearing for ${applicantName}`, { exact: true })).toBeVisible(),
        expect(exui_pages.hearingPanelPage.$static.yesLabel).toBeVisible(),
        expect(exui_pages.hearingPanelPage.$static.includeSpecificPanelMembersText).toBeVisible(),
        expect(exui_pages.hearingPanelPage.$static.orSelectAnyOtherRoleHeading).toBeVisible(),
        expect(exui_pages.hearingPanelPage.$static.tribunalJudgeLabel).toBeVisible(),
        expect(exui_pages.hearingPanelPage.$static.residentImmigrationJudgeLabel).toBeVisible(),
        expect(exui_pages.hearingPanelPage.$static.excludeSpecificPanelMembersText).toBeVisible(),
        expect(exui_pages.hearingPanelPage.$static.noLabel).toBeVisible(),
      ]);
      await exui_pages.hearingPanelPage.completePageAndContinue({ doYouRequireAPanel: 'No' });

      await exui_pages.hearingTimingPage.verifyUserIsOnPage();
      await exui_pages.hearingTimingPage.completePageAndContinue({ hearingNeedsSpecificDate: 'No' });

      await exui_pages.hearingLinkPage.verifyUserIsOnPage();
      await exui_pages.hearingLinkPage.completePageAndContinue({ willThisHearingBeLinkedToOthers: 'No' });

      await exui_pages.hearingAdditionalInstructionsPage.verifyUserIsOnPage();
      await exui_pages.hearingAdditionalInstructionsPage.completePageAndContinue({});

      await exui_pages.hearingCreateEditSummaryPage.verifyUserIsOnPage();
      const caseId = caseIdFromBeforeEach;
      const formattedCaseId = caseId.replace(/(.{4})(?=.)/g, '$1-');
      await Promise.all([
        await expect(exui_pages.hearingCreateEditSummaryPage.$questionLocator('Case name')).toBeVisible(),
        await expect(exui_pages.hearingCreateEditSummaryPage.$questionValueLocator('Case name')).toBeVisible(),
        await expect(exui_pages.hearingCreateEditSummaryPage.$questionValueLocator('Case name')).toHaveText(applicantName),

        await expect(exui_pages.hearingCreateEditSummaryPage.$questionLocator('Case reference')).toBeVisible(),
        await expect(exui_pages.hearingCreateEditSummaryPage.$questionValueLocator('Case reference')).toBeVisible(),
        await expect(exui_pages.hearingCreateEditSummaryPage.$questionValueLocator('Case reference')).toHaveText(formattedCaseId),

        await expect(exui_pages.hearingCreateEditSummaryPage.$questionLocator('Type')).toBeVisible(),
        await expect(exui_pages.hearingCreateEditSummaryPage.$questionValueLocator('Type')).toBeVisible(),
        await expect(exui_pages.hearingCreateEditSummaryPage.$questionValueLocator('Type')).toHaveText('EA - Float - EA - Float'),

        // Verify hearing requirements questions and answers are displayed correctly on check your answers page
        await expect(exui_pages.hearingCreateEditSummaryPage.$static.hearingRequirementsHeading).toBeVisible(),

        await expect(exui_pages.hearingCreateEditSummaryPage.$questionLocator('Reasonable adjustments')).toBeVisible(),
        await expect(exui_pages.hearingCreateEditSummaryPage.$questionValueLocator('Reasonable adjustments')).toBeVisible(),
        await expect(exui_pages.hearingCreateEditSummaryPage.$questionValueLocator('Reasonable adjustments')).toHaveText(
          `${applicantName}
          Step free / wheelchair access
          Hearing loop (hearing enhancement system)
          Sign Language Interpreter
          Evidence given in private
          ${witnessName}
          Sign Language Interpreter`,
          { useInnerText: true },
        ),
        await expect(exui_pages.hearingCreateEditSummaryPage.$changeAnswerToQuestionLocator('Reasonable adjustments')).toBeVisible(),

        // Verify additional facilities questions and answers are displayed correctly on check your answers page
        await expect(exui_pages.hearingCreateEditSummaryPage.$static.additionalFacilitiesHeading).toBeVisible(),

        await expect(exui_pages.hearingCreateEditSummaryPage.$questionLocator('Will additional security be required?')).toBeVisible(),
        await expect(exui_pages.hearingCreateEditSummaryPage.$questionValueLocator('Will additional security be required?')).toBeVisible(),
        await expect(exui_pages.hearingCreateEditSummaryPage.$questionValueLocator('Will additional security be required?')).toHaveText('No'),
        await expect(exui_pages.hearingCreateEditSummaryPage.$changeAnswerToQuestionLocator('Will additional security be required?')).toBeVisible(),

        await expect(exui_pages.hearingCreateEditSummaryPage.$questionLocator('Select any additional facilities required')).toBeVisible(),
        await expect(exui_pages.hearingCreateEditSummaryPage.$questionValueLocator('Select any additional facilities required')).toBeVisible(),
        await expect(exui_pages.hearingCreateEditSummaryPage.$questionValueLocator('Select any additional facilities required')).toBeEmpty(),
        await expect(
          exui_pages.hearingCreateEditSummaryPage.$changeAnswerToQuestionLocator('Select any additional facilities required'),
        ).toBeVisible(),

        // Verify stage questions and answers are displayed correctly on check your answers page
        await expect(exui_pages.hearingCreateEditSummaryPage.$static.stageHeading).toBeVisible(),

        await expect(exui_pages.hearingCreateEditSummaryPage.$questionLocator('What stage is this hearing at?')).toBeVisible(),
        await expect(exui_pages.hearingCreateEditSummaryPage.$questionValueLocator('What stage is this hearing at?')).toBeVisible(),
        await expect(exui_pages.hearingCreateEditSummaryPage.$questionValueLocator('What stage is this hearing at?')).toHaveText('Substantive'),
        await expect(exui_pages.hearingCreateEditSummaryPage.$changeAnswerToQuestionLocator('What stage is this hearing at?')).toBeVisible(),

        // Verify participant attendance questions and answers are displayed correctly on check your answers page
        await expect(exui_pages.hearingCreateEditSummaryPage.$static.participantAttendanceHeading).toBeVisible(),

        await expect(exui_pages.hearingCreateEditSummaryPage.$questionLocator('Will this be a paper hearing?')).toBeVisible(),
        await expect(exui_pages.hearingCreateEditSummaryPage.$questionValueLocator('Will this be a paper hearing?')).toBeVisible(),
        await expect(exui_pages.hearingCreateEditSummaryPage.$questionValueLocator('Will this be a paper hearing?')).toHaveText('No'),
        await expect(exui_pages.hearingCreateEditSummaryPage.$changeAnswerToQuestionLocator('Will this be a paper hearing?')).toBeVisible(),

        await expect(
          exui_pages.hearingCreateEditSummaryPage.$questionLocator('What will be the methods of attendance for this hearing?'),
        ).toBeVisible(),
        await expect(
          exui_pages.hearingCreateEditSummaryPage.$questionValueLocator('What will be the methods of attendance for this hearing?'),
        ).toBeVisible(),
        await expect(
          exui_pages.hearingCreateEditSummaryPage.$questionValueLocator('What will be the methods of attendance for this hearing?'),
        ).toHaveText('Video'),
        await expect(
          exui_pages.hearingCreateEditSummaryPage.$changeAnswerToQuestionLocator('What will be the methods of attendance for this hearing?'),
        ).toBeVisible(),

        await expect(exui_pages.hearingCreateEditSummaryPage.$questionLocator('How will each participant attend the hearing?')).toBeVisible(),
        await expect(exui_pages.hearingCreateEditSummaryPage.$questionValueLocator('How will each participant attend the hearing?')).toBeVisible(),
        await expect(exui_pages.hearingCreateEditSummaryPage.$questionValueLocator('How will each participant attend the hearing?')).toHaveText(
          `${applicantName} - Video ${witnessName} - Video`,
          { useInnerText: true },
        ),
        await expect(
          exui_pages.hearingCreateEditSummaryPage.$changeAnswerToQuestionLocator('How will each participant attend the hearing?'),
        ).toBeVisible(),

        await expect(exui_pages.hearingCreateEditSummaryPage.$questionLocator('How many people will attend the hearing in person?')).toBeVisible(),
        await expect(
          exui_pages.hearingCreateEditSummaryPage.$questionValueLocator('How many people will attend the hearing in person?'),
        ).toBeVisible(),
        await expect(exui_pages.hearingCreateEditSummaryPage.$questionValueLocator('How many people will attend the hearing in person?')).toHaveText(
          '4',
        ),
        await expect(
          exui_pages.hearingCreateEditSummaryPage.$changeAnswerToQuestionLocator('How many people will attend the hearing in person?'),
        ).toBeVisible(),

        // Verify hearing venue questions and answers are displayed correctly on check your answers page
        await expect(exui_pages.hearingCreateEditSummaryPage.$static.hearingVenueHeading).toBeVisible(),

        await expect(exui_pages.hearingCreateEditSummaryPage.$questionLocator('What are the hearing venue details?')).toBeVisible(),
        await expect(exui_pages.hearingCreateEditSummaryPage.$questionValueLocator('What are the hearing venue details?')).toBeVisible(),
        await expect(exui_pages.hearingCreateEditSummaryPage.$questionValueLocator('What are the hearing venue details?')).toHaveText(
          'Newport Tribunal Centre - Columbus House',
        ),
        await expect(exui_pages.hearingCreateEditSummaryPage.$changeAnswerToQuestionLocator('What are the hearing venue details?')).toBeVisible(),

        // Verify language requirements questions and answers are displayed correctly on check your answers page
        await expect(exui_pages.hearingCreateEditSummaryPage.$static.languageRequirementsheading).toBeVisible(),

        await expect(exui_pages.hearingCreateEditSummaryPage.$questionLocator('Does this hearing need to be in Welsh?')).toBeVisible(),
        await expect(exui_pages.hearingCreateEditSummaryPage.$questionValueLocator('Does this hearing need to be in Welsh?')).toBeVisible(),
        await expect(exui_pages.hearingCreateEditSummaryPage.$questionValueLocator('Does this hearing need to be in Welsh?')).toHaveText('No'),
        await expect(exui_pages.hearingCreateEditSummaryPage.$changeAnswerToQuestionLocator('Does this hearing need to be in Welsh?')).toBeVisible(),

        // Verify judge details questions and answers are displayed correctly on check your answers page
        await expect(exui_pages.hearingCreateEditSummaryPage.$static.judgeDetailsHeading).toBeVisible(),

        await expect(exui_pages.hearingCreateEditSummaryPage.$questionLocator('Do you want a specific judge?')).toBeVisible(),
        await expect(exui_pages.hearingCreateEditSummaryPage.$questionValueLocator('Do you want a specific judge?')).toBeVisible(),
        //await expect(exui_pages.hearingCreateEditSummaryPage.$questionValueLocator('Do you want a specific judge?')).toHaveText('No'),
        await expect(exui_pages.hearingCreateEditSummaryPage.$changeAnswerToQuestionLocator('Do you want a specific judge?')).toBeVisible(),

        // Verify panel details questions and answers are displayed correctly on check your answers page
        await expect(exui_pages.hearingCreateEditSummaryPage.$static.panelDetailsHeading).toBeVisible(),

        await expect(exui_pages.hearingCreateEditSummaryPage.$questionLocator('Do you require a panel for this hearing?')).toBeVisible(),
        await expect(exui_pages.hearingCreateEditSummaryPage.$questionValueLocator('Do you require a panel for this hearing?')).toBeVisible(),
        await expect(exui_pages.hearingCreateEditSummaryPage.$questionValueLocator('Do you require a panel for this hearing?')).toHaveText('No'),
        await expect(
          exui_pages.hearingCreateEditSummaryPage.$changeAnswerToQuestionLocator('Do you require a panel for this hearing?'),
        ).toBeVisible(),

        // Verify length, date and priority questions and answers are displayed correctly on check your answers page
        await expect(exui_pages.hearingCreateEditSummaryPage.$static.lengthDateAndPriorityHeading).toBeVisible(),

        await expect(exui_pages.hearingCreateEditSummaryPage.$questionLocator('Length of hearing')).toBeVisible(),
        await expect(exui_pages.hearingCreateEditSummaryPage.$questionValueLocator('Length of hearing')).toBeVisible(),
        await expect(exui_pages.hearingCreateEditSummaryPage.$questionValueLocator('Length of hearing')).toHaveText('2 Hours'),
        await expect(exui_pages.hearingCreateEditSummaryPage.$changeAnswerToQuestionLocator('Length of hearing')).toBeVisible(),

        await expect(
          exui_pages.hearingCreateEditSummaryPage.$questionLocator('Does the hearing need to take place on a specific date?'),
        ).toBeVisible(),
        await expect(
          exui_pages.hearingCreateEditSummaryPage.$questionValueLocator('Does the hearing need to take place on a specific date?'),
        ).toBeVisible(),
        await expect(
          exui_pages.hearingCreateEditSummaryPage.$questionValueLocator('Does the hearing need to take place on a specific date?'),
        ).toHaveText('No'),
        await expect(
          exui_pages.hearingCreateEditSummaryPage.$changeAnswerToQuestionLocator('Does the hearing need to take place on a specific date?'),
        ).toBeVisible(),

        await expect(exui_pages.hearingCreateEditSummaryPage.$questionLocator('What is the priority of this hearing?')).toBeVisible(),
        await expect(exui_pages.hearingCreateEditSummaryPage.$questionValueLocator('What is the priority of this hearing?')).toBeVisible(),
        await expect(exui_pages.hearingCreateEditSummaryPage.$questionValueLocator('What is the priority of this hearing?')).toHaveText('Standard'),
        await expect(exui_pages.hearingCreateEditSummaryPage.$changeAnswerToQuestionLocator('What is the priority of this hearing?')).toBeVisible(),

        // Verify linked hearing questions and answers are displayed correctly on check your answers page
        await expect(exui_pages.hearingCreateEditSummaryPage.$static.linkedHearingsHeading).toBeVisible(),

        await expect(
          exui_pages.hearingCreateEditSummaryPage.$questionLocator('Will this hearing need to be linked to other hearings?'),
        ).toBeVisible(),
        await expect(
          exui_pages.hearingCreateEditSummaryPage.$questionValueLocator('Will this hearing need to be linked to other hearings?'),
        ).toBeVisible(),
        await expect(
          exui_pages.hearingCreateEditSummaryPage.$questionValueLocator('Will this hearing need to be linked to other hearings?'),
        ).toHaveText('No'),
        await expect(
          exui_pages.hearingCreateEditSummaryPage.$changeAnswerToQuestionLocator('Will this hearing need to be linked to other hearings?'),
        ).toBeVisible(),

        // Verify additional instructions questions and answers are displayed correctly on check your answers page
        await expect(exui_pages.hearingCreateEditSummaryPage.$static.additionalInstructionsHeading).toBeVisible(),

        await expect(exui_pages.hearingCreateEditSummaryPage.$questionLocator('Enter any additional instructions for the hearing')).toBeVisible(),
        await expect(
          exui_pages.hearingCreateEditSummaryPage.$questionValueLocator('Enter any additional instructions for the hearing'),
        ).toBeVisible(),
        await expect(exui_pages.hearingCreateEditSummaryPage.$questionValueLocator('Enter any additional instructions for the hearing')).toHaveText(
          'Please ensure the hearing is listed in a building with step free access;Adjustments to accommodate vulnerabilities: Granted request to accommodate vulnerabilities as a result of physical or mental health issues;Multimedia equipment: Granted request for multi media adjustment;Other adjustments: Granted request for additional adjustment;',
        ),
        await expect(
          exui_pages.hearingCreateEditSummaryPage.$changeAnswerToQuestionLocator('Enter any additional instructions for the hearing'),
        ).toBeVisible(),
      ]);

      await expect(async () => {
        await expect(exui_pages.hearingCreateEditSummaryPage.$questionValueLocator('Do you want a specific judge?')).toHaveText('No', {
          timeout: 1_000,
        });
      }).toFail({ bugId: 'To be raised' });

      await exui_pages.hearingCreateEditSummaryPage.submitRequest();

      await exui_pages.hearingConfirmationPage.verifyUserIsOnPage();
      await exui_pages.hearingConfirmationPage.verifyAllTextOnPage();
      await exui_pages.hearingConfirmationPage.clickViewStatusOfHearingInHearingsTabLink();
    });

    await test.step('Verify a row has been added to current and upcomming hearings', async () => {
      await exui_pages.hearingsPage.verifyUserIsOnPage();
      await expect(exui_pages.hearingsPage.$static.currentAndUpcommingHearingsTableRow).toHaveCount(1);
    });
  });
});
