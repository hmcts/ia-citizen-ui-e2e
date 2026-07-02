import { test, expect } from '../../fixtures.js';
import { config } from '../../utils/config.utils.js';

test.describe('Set of tests to verify case officer is able to review hearing requirements on exui manage cases', () => {
  test.use({ storageState: config.exuiUsers.caseOfficer.sessionFile });

  test.beforeEach(async ({ exui_caseOfficerApiClient, cui_apiClient, exui_pages, exui_homeOfficeUserApiClient }) => {
    const appealDetails = await test.step('Citizen Api: Submit a new paid appeal', async () => {
      const appealDetails = await cui_apiClient.completeAndSubmitNewAppealJourneyViaApi({
        appealType: 'European Economic Area',
        hasApplicantReceivedADeportationOrder: 'No',
        isApplicantStateless: false,
        nationality: 'Tanzanian',
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
    });

    await test.step(`Case Officer: Navigate to case overview page on exui`, async () => {
      await exui_pages.caseOverviewPage.goTo({ caseId: caseId });
    });
  });

  test('Verify case officer is able to review hearing requirements', async ({ exui_pages, cui_apiClient }) => {
    const hearingRequirementDetails = await cui_apiClient.getHearingRequirementDetails();

    await test.step('Verify correct next steps are displayed on case overview page', async () => {
      await Promise.all([
        expect(exui_pages.caseOverviewPage.$static.doThisNextHeading).toBeVisible(),
        expect(exui_pages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toContainText(
          'You can view the hearing requirements and any requests for additional adjustments in the Hearing and appointment tab.',
        ),
        expect(exui_pages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toContainText(
          'If you need more information, direct the appellant to answer clarifying questions.',
        ),
        expect(exui_pages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toContainText(
          'If you do not need more information, review and record the hearing requirements and any additional adjustments.',
        ),
        expect(exui_pages.caseOverviewPage.$static.doThisNextParagraph.nth(0)).toBeVisible(),
      ]);
    });

    await test.step('Select review hearing requirements from next steps dropdown and verify details of review hearing requirements page', async () => {
      await exui_pages.caseOverviewPage.selectEventFromDropdown({ eventToSelect: 'Review hearing requirements' });

      await exui_pages.reviewHearingRequirementsPage.verifyUserIsOnPage();

      await expect(async () => {
        await Promise.all([
          expect(exui_pages.reviewHearingRequirementsPage.$questionLocator('willTheAppellantAttendTheHearing')).toBeHidden(),
          expect(exui_pages.reviewHearingRequirementsPage.$questionValueLocator('willTheAppellantAttendTheHearing')).toBeHidden(),

          expect(exui_pages.reviewHearingRequirementsPage.$questionLocator('willAppellantGiveOralEvidence')).toBeHidden(),
          expect(exui_pages.reviewHearingRequirementsPage.$questionValueLocator('willAppellantGiveOralEvidence')).toBeHidden(),
        ]);
      }).toFail({ bugId: 'To be raised' });

      await Promise.all([
        expect(exui_pages.reviewHearingRequirementsPage.$static.caseRecordHeading).toBeVisible(),

        expect(exui_pages.reviewHearingRequirementsPage.$static.hearingrequirementsDescription).toHaveText(
          "Review the appellant's hearing requirements and select length of hearing.",
        ),
        expect(exui_pages.reviewHearingRequirementsPage.$static.hearingrequirementsDescription).toBeVisible(),

        expect(exui_pages.reviewHearingRequirementsPage.$questionLocator('willAnyWitnessesAttendTheHearing')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsPage.$questionValueLocator('willAnyWitnessesAttendTheHearing')).toHaveText('Yes'),

        expect(exui_pages.reviewHearingRequirementsPage.$questionLocator('witnessDetails')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsPage.$questionValueLocator('witnessDetails')).toHaveText(
          `Name		${hearingRequirementDetails.hearingWitnessFlow.witnessName}`,
        ),

        expect(exui_pages.reviewHearingRequirementsPage.$questionLocator('willApellantOrAnyOneElseGiveOralEvidenceOutsideUk')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsPage.$questionValueLocator('willApellantOrAnyOneElseGiveOralEvidenceOutsideUk')).toHaveText('Yes'),

        expect(exui_pages.reviewHearingRequirementsPage.$questionLocator('doYouNeedAnyInterpreterServices')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsPage.$questionValueLocator('doYouNeedAnyInterpreterServices')).toHaveText('Yes'),

        exui_pages.reviewHearingRequirementsPage.verifyAppellantAndOrWitnessesInterpreterRequirements({
          appellantSignLanguage: hearingRequirementDetails.hearingAccessNeedsFlow.typeOfInterpretorSupport?.applicantSignInterpretorLanguage,
          appellantSpokenLanguage: hearingRequirementDetails.hearingAccessNeedsFlow.typeOfInterpretorSupport?.applicantSpokenInterpretorLanguage,
          witnessNames: hearingRequirementDetails.hearingWitnessFlow.witnessName,
          witnessSignLanguage: hearingRequirementDetails.hearingAccessNeedsFlow.typeOfInterpretorSupport?.witnessSignInterpretorLanguage,
          witnessSpokenlanguage: hearingRequirementDetails.hearingAccessNeedsFlow.typeOfInterpretorSupport?.witnessSpokenInterpretorLanguage,
        }),

        expect(exui_pages.reviewHearingRequirementsPage.$questionLocator('willAnyWitnessesRequireInterpreterServices')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsPage.$questionValueLocator('willAnyWitnessesRequireInterpreterServices')).toHaveText('Yes'),

        expect(exui_pages.reviewHearingRequirementsPage.$questionLocator('doYouNeedRoomWithStepFreeAccess')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsPage.$questionValueLocator('doYouNeedRoomWithStepFreeAccess')).toHaveText('Yes'),

        expect(exui_pages.reviewHearingRequirementsPage.$questionLocator('doYouNeedHearingLoop')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsPage.$questionValueLocator('doYouNeedHearingLoop')).toHaveText('Yes'),

        expect(exui_pages.reviewHearingRequirementsPage.$static.listingLengthHeading).toBeVisible(),

        expect(exui_pages.reviewHearingRequirementsPage.$static.listingLengthHoursLabel).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsPage.$static.listingLengthHoursLabel).toHaveText('Hours'),

        expect(exui_pages.reviewHearingRequirementsPage.$inputs.listingLengthHoursInput).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsPage.$inputs.listingLengthHoursInput).toHaveValue('2'),

        expect(exui_pages.reviewHearingRequirementsPage.$static.listingLengthMinutesLabel).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsPage.$static.listingLengthMinutesLabel).toHaveText('Minutes'),

        expect(exui_pages.reviewHearingRequirementsPage.$inputs.listingLengthMinutesInput).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsPage.$inputs.listingLengthMinutesInput).toHaveValue('0'),

        expect(exui_pages.reviewHearingRequirementsPage.$static.continueToSeeAddtionalAdjustmentsText).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsPage.$static.continueToSeeAddtionalAdjustmentsText).toHaveText(
          'Continue to see requests for additional adjustments.',
        ),
      ]);

      await exui_pages.reviewHearingRequirementsPage.continueOntoNextPage();
    });

    await test.step('Verify details of remote hearing page', async () => {
      await exui_pages.reviewHearingRequirementsRemoteHearingPage.verifyUserIsOnPage();
      await exui_pages.reviewHearingRequirementsRemoteHearingPage.verifyAllTextAndAnswersOnPage({
        anythingForTribunalToConsider: 'No',
      });
      await exui_pages.reviewHearingRequirementsRemoteHearingPage.completePageAndContinue({
        isRemoteHearingAllowed: 'Granted',
        description: 'Granted request for remote hearing',
      });
    });

    await test.step('Verify details of personal vulnerabilities page', async () => {
      await exui_pages.reviewHearingRequirementsPersonalVulnerabilitiesPage.verifyUserIsOnPage();
      await exui_pages.reviewHearingRequirementsPersonalVulnerabilitiesPage.verifyAllTextAndAnswersOnPage({
        doesAppellantHavePhysicalOrMentalHealthIssues: 'Yes',
        detailOfRequest: hearingRequirementDetails.hearingOtherNeedsFlow.howManyPhysicalOrMentalHealthConditions,
      });
      await exui_pages.reviewHearingRequirementsPersonalVulnerabilitiesPage.completePageAndContinue({
        isVulnerabilitiesAllowed: 'Granted',
        description: 'Granted request for vulnerabilities',
      });
    });

    await test.step('Verify details of multi media evidence page', async () => {
      await exui_pages.reviewHearingRequirementsMultimediaEvidencePage.verifyUserIsOnPage();
      await exui_pages.reviewHearingRequirementsMultimediaEvidencePage.verifyAllTextAndAnswersOnPage({
        doYouHaveMultimediaEvidence: 'Yes',
        detailOfRequest: hearingRequirementDetails.hearingOtherNeedsFlow.reasonUnableToBringEquipment,
      });
      await exui_pages.reviewHearingRequirementsMultimediaEvidencePage.completePageAndContinue({
        isMultimediaAllowed: 'Granted',
        description: 'Granted request for multimedia evidence',
      });
    });

    await test.step('Verify details of single sex court page', async () => {
      await exui_pages.reviewHearingRequirementsSingleSexCourtPage.verifyUserIsOnPage();
      await exui_pages.reviewHearingRequirementsSingleSexCourtPage.verifyAllTextAndAnswersOnPage({
        doesAppellantNeedSingleSexCourt: 'Yes',
        typeOfCourt: hearingRequirementDetails.hearingOtherNeedsFlow.allMaleOrFemaleHearing!,
        detailOfRequest: hearingRequirementDetails.hearingOtherNeedsFlow.reasonForSingleSexHearing,
      });
      await exui_pages.reviewHearingRequirementsSingleSexCourtPage.completePageAndContinue({
        isSingleSexCourtAllowed: 'Granted',
        description: 'Granted request for single sex court',
      });
    });

    await test.step('Verify details of in camera court page', async () => {
      await exui_pages.reviewHearingRequirementsInCameraCourtPage.verifyUserIsOnPage();
      await exui_pages.reviewHearingRequirementsInCameraCourtPage.verifyAllTextAndAnswersOnPage({
        doesAppellantNeedInCameraCourt: 'Yes',
        detailOfRequest: hearingRequirementDetails.hearingOtherNeedsFlow.reasonForPrivateHearing,
      });
      await exui_pages.reviewHearingRequirementsInCameraCourtPage.completePageAndContinue({
        isInCameraCourtAllowed: 'Granted',
        description: 'Granted request for in camera court',
      });
    });

    await test.step('Verify details of addtional requirements page', async () => {
      await exui_pages.reviewHearingRequirementsAddtionalRequirementsPage.verifyUserIsOnPage();
      await exui_pages.reviewHearingRequirementsAddtionalRequirementsPage.verifyAllTextAndAnswersOnPage({
        wouldYouLikeToRequestAddtionalRequirements: 'Yes',
        detailOfRequest: hearingRequirementDetails.hearingOtherNeedsFlow.needAnythingElseDetails,
      });
      await exui_pages.reviewHearingRequirementsAddtionalRequirementsPage.completePageAndContinue({
        isAdditionalAdjustmentAllowed: 'Granted',
        description: 'Granted request for additional requirements',
      });
    });

    await test.step('Verify details of hearing channel page', async () => {
      await exui_pages.reviewHearingRequirementsHearingChannelPage.verifyUserIsOnPage();
      await exui_pages.reviewHearingRequirementsHearingChannelPage.verifyAllTextOnPage();
      await exui_pages.reviewHearingRequirementsHearingChannelPage.completePageAndContinue({ hearingChannel: 'Video' });
    });

    await test.step('Verify details of appeal suitable to float page', async () => {
      await exui_pages.reviewHearingRequirementsAppealSuitableToFloatPage.verifyUserIsOnPage();
      await exui_pages.reviewHearingRequirementsAppealSuitableToFloatPage.verifyAllTextOnPage();
      await exui_pages.reviewHearingRequirementsAppealSuitableToFloatPage.completePageAndContinue({
        isAppealSuitableToFloat: 'Yes',
      });
    });

    await test.step('Verify details of addtional instructions page', async () => {
      await exui_pages.reviewHearingRequirementsAdditionalIntructionsPage.verifyUserIsOnPage();
      await exui_pages.reviewHearingRequirementsAdditionalIntructionsPage.verifyAllTextOnPage();
      await exui_pages.reviewHearingRequirementsAdditionalIntructionsPage.completePageAndContinue({
        anyAddtionalIntructions: 'Yes',
        instruction: 'Please ensure the hearing is listed in a building with step free access',
      });
    });

    await test.step('Verify details of submission page and submit event', async () => {
      await exui_pages.reviewHearingRequirementsSubmitPage.verifyUserIsOnPage();
      await Promise.all([
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$static.caseRecordHeading).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$static.listingLengthTableHeading).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$static.hoursLabel).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$static.hoursValue).toHaveText('2'),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$static.hoursValue).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$static.minutesLabel).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$static.minutesValue).toHaveText('0'),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$static.minutesValue).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Listing length')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Listing length')).toHaveText('Change'),

        expect(exui_pages.reviewHearingRequirementsSubmitPage.$questionLocator('Remote hearing decision')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Remote hearing decision')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Remote hearing decision')).toHaveText('Granted'),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Remote hearing decision')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Remote hearing decision')).toHaveText('Change'),

        expect(exui_pages.reviewHearingRequirementsSubmitPage.$questionLocator('Remote hearing')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Remote hearing')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Remote hearing')).toHaveText(
          'Granted request for remote hearing',
        ),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Remote hearing')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Remote hearing')).toHaveText('Change'),

        expect(exui_pages.reviewHearingRequirementsSubmitPage.$questionLocator('Vulnerabilities decision')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Vulnerabilities decision')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Vulnerabilities decision')).toHaveText('Granted'),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Vulnerabilities decision')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Vulnerabilities decision')).toHaveText('Change'),

        expect(exui_pages.reviewHearingRequirementsSubmitPage.$questionLocator('Adjustments to accommodate vulnerabilities')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Adjustments to accommodate vulnerabilities')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Adjustments to accommodate vulnerabilities')).toHaveText(
          'Granted request for vulnerabilities',
        ),
        expect(
          exui_pages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Adjustments to accommodate vulnerabilities'),
        ).toBeVisible(),
        expect(
          exui_pages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Adjustments to accommodate vulnerabilities'),
        ).toHaveText('Change'),

        expect(exui_pages.reviewHearingRequirementsSubmitPage.$questionLocator('Multimedia decision')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Multimedia decision')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Multimedia decision')).toHaveText('Granted'),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Multimedia decision')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Multimedia decision')).toHaveText('Change'),

        expect(exui_pages.reviewHearingRequirementsSubmitPage.$questionLocator('Multimedia equipment')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Multimedia equipment')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Multimedia equipment')).toHaveText(
          'Granted request for multimedia evidence',
        ),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Multimedia equipment')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Multimedia equipment')).toHaveText('Change'),

        expect(exui_pages.reviewHearingRequirementsSubmitPage.$questionLocator('Single-sex court decision')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Single-sex court decision')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Single-sex court decision')).toHaveText('Granted'),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Single-sex court decision')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Single-sex court decision')).toHaveText('Change'),

        expect(exui_pages.reviewHearingRequirementsSubmitPage.$questionLocator('Single-sex court')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Single-sex court')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Single-sex court')).toHaveText(
          'Granted request for single sex court',
        ),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Single-sex court')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Single-sex court')).toHaveText('Change'),

        expect(exui_pages.reviewHearingRequirementsSubmitPage.$questionLocator('In camera court decision')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$questionValueLocator('In camera court decision')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$questionValueLocator('In camera court decision')).toHaveText('Granted'),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('In camera court decision')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('In camera court decision')).toHaveText('Change'),

        expect(exui_pages.reviewHearingRequirementsSubmitPage.$questionLocator('In camera court')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$questionValueLocator('In camera court')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$questionValueLocator('In camera court')).toHaveText(
          'Granted request for in camera court',
        ),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('In camera court')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('In camera court')).toHaveText('Change'),

        expect(exui_pages.reviewHearingRequirementsSubmitPage.$questionLocator('Other adjustments decision')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Other adjustments decision')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Other adjustments decision')).toHaveText('Granted'),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Other adjustments decision')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Other adjustments decision')).toHaveText('Change'),

        expect(exui_pages.reviewHearingRequirementsSubmitPage.$questionLocator('Other adjustments')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Other adjustments')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Other adjustments')).toHaveText(
          'Granted request for additional requirements',
        ),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Other adjustments')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Other adjustments')).toHaveText('Change'),

        expect(exui_pages.reviewHearingRequirementsSubmitPage.$questionLocator('What type of hearing is required?')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$questionValueLocator('What type of hearing is required?')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$questionValueLocator('What type of hearing is required?')).toHaveText('Video'),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('What type of hearing is required?')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('What type of hearing is required?')).toHaveText(
          'Change',
        ),

        expect(exui_pages.reviewHearingRequirementsSubmitPage.$questionLocator('Is the appeal suitable to float?')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Is the appeal suitable to float?')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Is the appeal suitable to float?')).toHaveText('Yes'),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Is the appeal suitable to float?')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Is the appeal suitable to float?')).toHaveText(
          'Change',
        ),

        expect(
          exui_pages.reviewHearingRequirementsSubmitPage.$questionLocator('Are there any additional instructions for the hearing?'),
        ).toBeVisible(),
        expect(
          exui_pages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Are there any additional instructions for the hearing?'),
        ).toBeVisible(),
        expect(
          exui_pages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Are there any additional instructions for the hearing?'),
        ).toHaveText('Yes'),
        expect(
          exui_pages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Are there any additional instructions for the hearing?'),
        ).toBeVisible(),
        expect(
          exui_pages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Are there any additional instructions for the hearing?'),
        ).toHaveText('Change'),

        expect(exui_pages.reviewHearingRequirementsSubmitPage.$questionLocator('Additional Instructions')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Additional Instructions')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$questionValueLocator('Additional Instructions')).toHaveText(
          'Please ensure the hearing is listed in a building with step free access',
        ),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Additional Instructions')).toBeVisible(),
        expect(exui_pages.reviewHearingRequirementsSubmitPage.$changeAnswerToQuestionLocator('Additional Instructions')).toHaveText('Change'),
      ]);

      await exui_pages.reviewHearingRequirementsSubmitPage.submitEvent();

      await exui_pages.reviewHearingRequirementsConfirmPage.verifyUserIsOnPage();
      await exui_pages.reviewHearingRequirementsConfirmPage.verifyAllTextOnPage();
      await exui_pages.reviewHearingRequirementsConfirmPage.returnToCaseDetails();
    });

    await test.step('Verify correct next steps are displayed once event has been submitted', async () => {
      await exui_pages.caseOverviewPage.verifyUserIsOnPage({});
      await exui_pages.caseOverviewPage.verifyAlertMessageAfterSubmittingEvent({ eventSubmitted: 'Review hearing requirements' });

      await Promise.all([
        expect(exui_pages.caseOverviewPage.$static.whatHappensNextHeading).toBeVisible(),
        expect(exui_pages.caseOverviewPage.$static.whatHappensNextParagraph.nth(0)).toContainText(
          'The agreed hearing requirements and adjustments have been recorded.',
        ),
        expect(exui_pages.caseOverviewPage.$static.whatHappensNextParagraph.nth(0)).toContainText('The listing team will now list the case.'),
        expect(exui_pages.caseOverviewPage.$static.whatHappensNextParagraph.nth(0)).toBeVisible(),
      ]);
    });
  });
});
