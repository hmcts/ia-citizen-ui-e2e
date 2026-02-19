import { test, expect } from '../../../fixtures.js';

test.describe('Set of tests to verify functionality of citizen UI using Api fixtures', () => {
  test('Verify application overview page displays correct information for a paid application that has not received any payment', async ({
    cui_apiClient,
    citizenUser,
    cui_login,
    cui_appealOverviewPage,
    dataUtils,
  }) => {
    await test.step('Submit an appeal via api', async () => {
      await cui_apiClient.completeAndSubmitAppealJourneyViaApi({
        isUserInTheUk: 'Yes',
        appealType: 'Human Rights',
        isApplicantStateless: false,
        isApplicationInTime: true,
        nationality: 'China',
        hasApplicantReceivedADeportationOrder: 'No',
        doesApplicantHaveASponsor: 'No',
        decisionWithOrWithoutHearing: 'decisionWithHearing',
        whetherApplicantHasToPayAFee: 'I got a fee waiver from the Home Office for my application to stay in the UK',
        appealSubmissionType: 'Non-Pay Appeal',
      });
    });

    await test.step('Navigate to citizen UI and login', async () => {
      await cui_login({ email: citizenUser.email, password: citizenUser.password });
    });

    await test.step('Verify applicant no longer has anything remaining to fulfil on their application', async () => {
      await expect(cui_appealOverviewPage.$static.nothingToDoNextHeading).toBeVisible();
    });

    await test.step('Verify text on application overview page has been updated to reflect details have been sent', async () => {
      await expect(cui_appealOverviewPage.$yourCaseInformation.detailsSentToTribunalParagraph).toBeVisible();
      await expect(cui_appealOverviewPage.$yourCaseInformation.thereIsAFeeForThisAppealParagraph).toBeVisible();
      await expect(cui_appealOverviewPage.$yourCaseInformation.tribunalWillCheckInformationSentParagraph).toBeVisible();
      const formattedExpectedDate = (await dataUtils.getDateFromToday({ dayOffset: 14 })).full;
      await expect(
        cui_appealOverviewPage.page.getByText(`This should be by ${formattedExpectedDate} but it might take longer than that.`, { exact: true }),
      ).toBeVisible();
    });

    await test.step('Verify appeal details section of appeal overview page', async () => {
      await expect(cui_appealOverviewPage.$static.completedHeading).toBeVisible();
      await expect(cui_appealOverviewPage.$yourAppealDetails.yourAppealDetailsHeading).toBeVisible();
      const formattedTodaysDate = (await dataUtils.getDateFromToday({})).full;
      await expect(
        cui_appealOverviewPage.page.getByText(`${formattedTodaysDate} - You sent your appeal details to the Tribunal.`, { exact: true }),
      ).toBeVisible();
      await expect(cui_appealOverviewPage.$yourAppealDetails.whatYouSentHeading).toBeVisible();
      await expect(cui_appealOverviewPage.$yourAppealDetails.yourAppealDetailsLink).toBeVisible();
      await expect(cui_appealOverviewPage.$yourAppealDetails.helpfulInformationHeading).toBeVisible();
      await expect(cui_appealOverviewPage.$yourAppealDetails.whatIsATribunalCaseWorkerLink).toBeVisible();
    });
  });

  test('Verify application overview page displays correct information for a paid application', async ({
    cui_apiClient,
    citizenUser,
    cui_login,
    cui_appealOverviewPage,
    dataUtils,
  }) => {
    await test.step('Submit an appeal via api', async () => {
      await cui_apiClient.completeAndSubmitAppealJourneyViaApi({
        isUserInTheUk: 'Yes',
        appealType: 'Protection',
        isApplicantStateless: false,
        isApplicationInTime: true,
        nationality: 'China',
        payForAppealNowOrLater: 'payNow',
        hasApplicantReceivedADeportationOrder: 'No',
        doesApplicantHaveASponsor: 'No',
        decisionWithOrWithoutHearing: 'decisionWithoutHearing',
        whetherApplicantHasToPayAFee: 'None of these statements apply to me',
        appealSubmissionType: 'Pay Appeal',
      });
    });

    await test.step('Navigate to citizen UI and login', async () => {
      await cui_login({ email: citizenUser.email, password: citizenUser.password });
    });

    await test.step('Verify applicant no longer has anything remaining to fulfil on their application', async () => {
      await expect(cui_appealOverviewPage.$static.nothingToDoNextHeading).toBeVisible();
    });

    await test.step('Verify text on application overview page has been updated to reflect details have been sent', async () => {
      await expect(cui_appealOverviewPage.$yourCaseInformation.detailsSentToTribunalParagraph).toBeVisible();
      const formattedExpectedDate = (await dataUtils.getDateFromToday({ dayOffset: 14 })).full;
      await expect(
        cui_appealOverviewPage.page.getByText(
          `A Tribunal Caseworker will contact you to tell you what happens next. This should be by ${formattedExpectedDate}  but it might take longer than that.`,
          { exact: true },
        ),
      ).toBeVisible();
      await expect(cui_appealOverviewPage.$yourCaseInformation.helpfulInformationHeading).toBeVisible();
      await expect(cui_appealOverviewPage.$yourCaseInformation.whatIsATribunalCaseWorkerLink).toBeVisible();
    });

    await test.step('Verify appeal argument section of appeal overview page', async () => {
      await expect(cui_appealOverviewPage.$yourAppealArgument.yourAppealArgumentHeading).toBeVisible();
      const formattedTodaysDate = (await dataUtils.getDateFromToday({})).full;
      await expect(cui_appealOverviewPage.page.getByText(`${formattedTodaysDate} - You paid for your appeal`, { exact: true })).toBeVisible();
      await expect(cui_appealOverviewPage.$yourAppealArgument.whatYouSentHeading).toBeVisible();
      await expect(cui_appealOverviewPage.$yourAppealArgument.yourAppealDetailsLink).toBeVisible();
    });

    await test.step('Verify appeal details section of appeal overview page', async () => {
      await expect(cui_appealOverviewPage.$static.completedHeading).toBeVisible();
      await expect(cui_appealOverviewPage.$yourAppealDetails.yourAppealDetailsHeading).toBeVisible();
      const formattedTodaysDate = (await dataUtils.getDateFromToday({})).full;
      await expect(
        cui_appealOverviewPage.page.getByText(`${formattedTodaysDate} - You sent your appeal details to the Tribunal.`, { exact: true }),
      ).toBeVisible();
      await expect(cui_appealOverviewPage.$yourAppealDetails.whatYouSentHeading).toBeVisible();
      await expect(cui_appealOverviewPage.$yourAppealDetails.yourAppealDetailsLink).toBeVisible();
      await expect(cui_appealOverviewPage.$yourAppealDetails.helpfulInformationHeading).toBeVisible();
      await expect(cui_appealOverviewPage.$yourAppealDetails.whatIsATribunalCaseWorkerLink).toBeVisible();
    });
  });

  test('Verify application overview page displays correct information for an application that does not require any payment', async ({
    cui_apiClient,
    citizenUser,
    cui_login,
    cui_appealOverviewPage,
    dataUtils,
  }) => {
    await test.step('Submit an appeal via api', async () => {
      await cui_apiClient.completeAndSubmitAppealJourneyViaApi({
        isUserInTheUk: 'Yes',
        appealType: 'Deprivation of Citizenship',
        isApplicantStateless: false,
        isApplicationInTime: true,
        nationality: 'China',
        hasApplicantReceivedADeportationOrder: 'No',
        doesApplicantHaveASponsor: 'No',
        decisionWithOrWithoutHearing: 'decisionWithHearing',
        appealSubmissionType: 'Non-Pay Appeal',
      });
    });

    await test.step('Navigate to citizen UI and login', async () => {
      await cui_login({ email: citizenUser.email, password: citizenUser.password });
    });

    await test.step('Verify applicant no longer has anything remaining to fulfil on their application', async () => {
      await expect(cui_appealOverviewPage.$static.nothingToDoNextHeading).toBeVisible();
    });

    await test.step('Verify text on application overview page has been updated to reflect details have been sent', async () => {
      await expect(cui_appealOverviewPage.$yourCaseInformation.detailsSentToTribunalParagraph).toBeVisible();
      const formattedExpectedDate = (await dataUtils.getDateFromToday({ dayOffset: 14 })).full;
      await expect(
        cui_appealOverviewPage.page.getByText(
          `A Tribunal Caseworker will contact you to tell you what happens next. This should be by ${formattedExpectedDate}  but it might take longer than that.`,
          { exact: true },
        ),
      ).toBeVisible();
      await expect(cui_appealOverviewPage.$yourCaseInformation.helpfulInformationHeading).toBeVisible();
      await expect(cui_appealOverviewPage.$yourCaseInformation.whatIsATribunalCaseWorkerLink).toBeVisible();
    });

    await test.step('Verify appeal details section of appeal overview page', async () => {
      await expect(cui_appealOverviewPage.$static.completedHeading).toBeVisible();
      await expect(cui_appealOverviewPage.$yourAppealDetails.yourAppealDetailsHeading).toBeVisible();
      const formattedTodaysDate = (await dataUtils.getDateFromToday({})).full;
      await expect(
        cui_appealOverviewPage.page.getByText(`${formattedTodaysDate} - You sent your appeal details to the Tribunal.`, { exact: true }),
      ).toBeVisible();
      await expect(cui_appealOverviewPage.$yourAppealDetails.whatYouSentHeading).toBeVisible();
      await expect(cui_appealOverviewPage.$yourAppealDetails.yourAppealDetailsLink).toBeVisible();
      await expect(cui_appealOverviewPage.$yourAppealDetails.helpfulInformationHeading).toBeVisible();
      await expect(cui_appealOverviewPage.$yourAppealDetails.whatIsATribunalCaseWorkerLink).toBeVisible();
    });
  });

  test('Verify check and send screen displays correct information', async ({
    cui_apiClient,
    citizenUser,
    cui_login,
    cui_appealOverviewPage,
    cui_aboutAppealPage,
  }) => {
    let applicantDetails;
    await test.step('Fill in your details section of journey via api', async () => {
      applicantDetails = await cui_apiClient.submitYourDetailsUserFlowViaApi({
        isUserInTheUk: 'No',
        appealType: 'Human Rights',
        isApplicantStateless: false,
        isApplicationInTime: false,
        nationality: 'Turkey',
        hasApplicantReceivedADeportationOrder: 'No',
        doesApplicantHaveASponsor: 'Yes',
      });
    });

    await test.step('Fill in decision type section of journey via api', async () => {
      await cui_apiClient.submitDecisionTypeUserFlowViaApi({
        appealType: 'Protection',
        decisionWithOrWithoutHearing: 'decisionWithHearing',
        payForAppealNowOrLater: 'payNow',
      });
    });

    await test.step('Fill in fee support section of journey via api', async () => {
      await cui_apiClient.submitFeeSupportUserFlowViaApi({
        whetherApplicantHasToPayAFee: 'None of these statements apply to me',
      });
    });

    await test.step('Navigate to citizen UI and login', async () => {
      await cui_login({ email: citizenUser.email, password: citizenUser.password });
    });

    await test.step('Navigate to about appeal page', async () => {
      await cui_appealOverviewPage.navigationClick(cui_appealOverviewPage.$interactive.continueButton);
      await cui_aboutAppealPage.verifyUserIsOnPage();
    });
    console.log(applicantDetails);
    // WIP - continue from here to verify check and send page details
  });
});
