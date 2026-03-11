import { test, expect } from '../../../fixtures.js';

test.describe('Set of tests to verify user is able to submit an appeal via the UI', () => {
  test.beforeEach(async ({ citizenUser, cui_login }) => {
    await cui_login({ email: citizenUser.email, password: citizenUser.password });
  });

  // The following test covers a late appeal that also has a sponsor and fee support.
  test('Verify user is able to submit a paid appeal via the UI', { tag: ['@e2e'] }, async ({ cui_pages, dataUtils }) => {
    await test.step('Navigate to about appeals page', async () => {
      await cui_pages.appealOverviewPage.verifyUserIsOnPage();
      await cui_pages.appealOverviewPage.navigationClick(cui_pages.appealOverviewPage.$interactive.continueButton);

      await cui_pages.aboutAppealPage.verifyUserIsOnPage();
    });

    await test.step('Complete appeal type section of journey', async () => {
      await cui_pages.aboutAppealPage.navigationClick(cui_pages.aboutAppealPage.$interactive.appealTypeLink);

      await cui_pages.inTheUkPage.verifyUserIsOnPage();
      await cui_pages.inTheUkPage.completePageAndContinue({ isUserInTheUk: 'No' });

      await cui_pages.appealTypePage.verifyUserIsOnPage();
      await cui_pages.appealTypePage.completePageAndContinue({ appealType: 'Human Rights', verifyAllTextOnPage: true });

      await cui_pages.outOfCountryHrEeaPage.verifyUserIsOnPage();
      await cui_pages.outOfCountryHrEeaPage.completePageAndContinue({ outsideUkWhenApplicationMade: 'No' });

      await cui_pages.outOfCountryHrInsidePage.verifyUserIsOnPage();
      const dateLeftUk = await dataUtils.getDateFromToday({ yearOffset: -4 });
      await cui_pages.outOfCountryHrInsidePage.completePageAndContinue({
        day: dateLeftUk.day,
        month: dateLeftUk.month,
        year: dateLeftUk.year,
        verifyAllTextOnPage: true,
      });

      await cui_pages.aboutAppealPage.verifyUserIsOnPage();
    });

    await test.step('Complete your home office and details section of journey', async () => {
      await cui_pages.aboutAppealPage.navigationClick(cui_pages.aboutAppealPage.$interactive.homeOfficeAndPersonalDetailsLink);

      await cui_pages.homeOfficeReferenceNumberPage.verifyUserIsOnPage();
      const homeOfficeReference = await dataUtils.generateRandomNumber({ digitLength: 9 });
      await cui_pages.homeOfficeReferenceNumberPage.completePageAndContinue({ homeOfficeReference: homeOfficeReference, verifyAllTextOnPage: true });

      await cui_pages.applicantNamePage.verifyUserIsOnPage();
      const applicantName = await dataUtils.generateRandomFirstAndLastNames({ countOfFirstNamesToGenerate: 1, countOfLastNamesToGenerate: 1 });
      await cui_pages.applicantNamePage.completePageAndContinue({
        givenNames: applicantName.firstNames[0],
        familyName: applicantName.lastNames[0],
        verifyAllTextOnPage: true,
      });

      await cui_pages.applicantDobPage.verifyUserIsOnPage();
      const applicantDob = await dataUtils.getDateFromToday({ yearOffset: -30 });
      await cui_pages.applicantDobPage.completePageAndContinue({
        day: applicantDob.day,
        month: applicantDob.month,
        year: applicantDob.year,
        verifyAllTextOnPage: true,
      });

      await cui_pages.applicantNationalityPage.verifyUserIsOnPage();
      await cui_pages.applicantNationalityPage.completePageAndContinue({ nationality: 'China', stateless: false, verifyAllTextOnPage: true });

      await cui_pages.decisionLetterReceivedPage.verifyUserIsOnPage();
      const dateLetterReceived = await dataUtils.getDateFromToday({ monthOffset: -2 });
      await cui_pages.decisionLetterReceivedPage.completePageAndContinue({
        day: dateLetterReceived.day,
        month: dateLetterReceived.month,
        year: dateLetterReceived.year,
        verifyAllTextOnPage: true,
      });

      await cui_pages.uploadDecisionLetterPage.verifyUserIsOnPage();
      await cui_pages.uploadDecisionLetterPage.completePageAndContinue({ verifyAllTextOnPage: true });

      await cui_pages.deportationOrderPage.verifyUserIsOnPage();
      await cui_pages.deportationOrderPage.completePageAndContinue({ deportationOrderReceived: 'Yes', verifyAllTextOnPage: true });

      await cui_pages.aboutAppealPage.verifyUserIsOnPage();
    });

    await test.step('Complete your contact details section of journey', async () => {
      await cui_pages.aboutAppealPage.navigationClick(cui_pages.aboutAppealPage.$interactive.yourContactDetailsLink);

      await cui_pages.contactPreferencesPage.verifyUserIsOnPage();
      const contactDetails = await dataUtils.generateContactDetails('Email and Phone');
      await cui_pages.contactPreferencesPage.completePageAndContinue({
        contactPreference: 'Email and Phone',
        applicantEmail: contactDetails.email,
        applicantPhoneNumber: contactDetails.phone,
        verifyAllTextOnPage: true,
      });

      await cui_pages.outOfCountryAddressPage.verifyUserIsOnPage();
      await cui_pages.outOfCountryAddressPage.completePageAndContinue({
        applicantAddress: 'Flat 1, 1 Test Street, Test Town, TE1 1ST, United Kingdom',
        verifyAllTextOnPage: true,
      });

      await cui_pages.hasSponsorPage.verifyUserIsOnPage();
      await cui_pages.hasSponsorPage.completePageAndContinue({ doesApplicantHaveASponsor: 'Yes', verifyAllTextOnPage: true });

      await cui_pages.sponsorNamePage.verifyUserIsOnPage();
      const sponsorName = await dataUtils.generateRandomFirstAndLastNames({ countOfFirstNamesToGenerate: 1, countOfLastNamesToGenerate: 1 });
      await cui_pages.sponsorNamePage.completePageAndContinue({
        givenNames: sponsorName.firstNames[0],
        familyName: sponsorName.lastNames[0],
        verifyAllTextOnPage: true,
      });

      await cui_pages.sponsorAddressPage.verifyUserIsOnPage();
      await cui_pages.sponsorAddressPage.completePageAndContinue({
        addressLine1: '123 Fake Street',
        townOrCity: 'Faketown',
        postCode: 'FK1 1FK',
        verifyAllTextOnPage: true,
      });

      await cui_pages.sponsorContactPreferencesPage.verifyUserIsOnPage();
      const sponsorContactDetails = await dataUtils.generateContactDetails('Email and Phone');
      await cui_pages.sponsorContactPreferencesPage.completePageAndContinue({
        contactPreference: 'Email and Phone',
        sponsorEmail: sponsorContactDetails.email,
        sponsorPhoneNumber: sponsorContactDetails.phone,
        verifyAllTextOnPage: true,
      });

      await cui_pages.sponsorAuthorisationPage.verifyUserIsOnPage();
      await cui_pages.sponsorAuthorisationPage.completePageAndContinue({ allowSponsorToSeeAppealInformation: 'Yes' });

      await cui_pages.aboutAppealPage.verifyUserIsOnPage();
    });

    await test.step('Complete decision with or without a hearing section of joruney', async () => {
      await cui_pages.aboutAppealPage.navigationClick(cui_pages.aboutAppealPage.$interactive.decisionWithOrWithoutHearingLink);

      await cui_pages.decisionTypePage.verifyUserIsOnPage();
      await cui_pages.decisionTypePage.completePageAndContinue({ decisionWithOrWithoutHearing: 'decisionWithHearing', verifyAllTextOnPage: true });

      await cui_pages.equalityAndDiversityStartPage.verifyUserIsOnPage();
      await cui_pages.equalityAndDiversityStartPage.completePageAndContinue({ verifyAllTextOnPage: true });

      await cui_pages.aboutAppealPage.verifyUserIsOnPage();
    });

    await test.step('Complete fee support section of journey', async () => {
      await cui_pages.aboutAppealPage.navigationClick(cui_pages.aboutAppealPage.$interactive.supportToPayTheFeeLink);

      await cui_pages.feeSupportPage.verifyUserIsOnPage();
      await cui_pages.feeSupportPage.completePageAndContinue({
        whetherApplicantHasToPayAFee: 'I get asylum support from the Home Office',
        verifyAllTextOnPage: true,
      });

      await cui_pages.asylumSupportPage.verifyUserIsOnPage();
      const asylumSupportRefNumber = await dataUtils.generateRandomNumber({ digitLength: 8 });
      await cui_pages.asylumSupportPage.completePageAndContinue({ asylumSupportRefNumber: asylumSupportRefNumber, verifyAllTextOnPage: true });

      await cui_pages.aboutAppealPage.verifyUserIsOnPage();
    });

    await test.step('Complete check and send section of journey', async () => {
      await cui_pages.aboutAppealPage.navigationClick(cui_pages.aboutAppealPage.$interactive.checkAndSendYourAppealDetailsLink);

      await cui_pages.lateAppealPage.verifyUserIsOnPage();
      await cui_pages.lateAppealPage.completePageAndContinue({
        reasonForLateAppeal: 'Apologies for the late appeal submission',
        verifyAllTextOnPage: true,
      });

      await cui_pages.newAppealCheckAnswersPage.verifyUserIsOnPage();
      await cui_pages.newAppealCheckAnswersPage.submitApplication();
    });

    await test.step('Verify application has successfully been submitted', async () => {
      await cui_pages.appealDetailsSentPage.verifyUserIsOnPage();

      await expect(cui_pages.appealDetailsSentPage.$static.pageHeading).toHaveText('Your late appeal details have been sent');
      await expect(cui_pages.appealDetailsSentPage.$static.whatHappensNextHeading).toBeVisible();
      await expect(
        cui_pages.appealDetailsSentPage.page.getByText(
          'You have sent a late appeal and have told the Tribunal you believe you do not have to pay some or all the fee',
          { exact: true },
        ),
      ).toBeVisible();
      await expect(
        cui_pages.appealDetailsSentPage.page.getByText(
          'The Tribunal will first check the information you sent about the fee and let you know if you need to pay',
          { exact: true },
        ),
      ).toBeVisible();

      const expectedDate = (await dataUtils.getDateFromToday({ dayOffset: 28 })).full;
      await expect(
        cui_pages.appealDetailsSentPage.page.getByText(`This should be by ${expectedDate} but it might take longer than that`, { exact: true }),
      ).toBeVisible();

      await expect(
        cui_pages.appealDetailsSentPage.page.getByText(
          'The Tribunal will then look at the reasons your appeal was late and let you know what will happen next',
          { exact: true },
        ),
      ).toBeVisible();

      await expect(cui_pages.appealDetailsSentPage.$static.thingsYouCanDoNowHeading).toBeVisible();
      await expect(cui_pages.appealDetailsSentPage.$interactive.readMoreAboutAppealingAsylumDecisionLink).toBeVisible();
      await expect(cui_pages.appealDetailsSentPage.$interactive.findOrganisationsThatCanHelpLink).toBeVisible();
    });

    await test.step('Pay for appeal', async () => {
      await cui_pages.appealDetailsSentPage.navigationClick(cui_pages.appealDetailsSentPage.$interactive.seeYourAppealProgressButton);

      await cui_pages.appealOverviewPage.verifyUserIsOnPage();
      await cui_pages.appealOverviewPage.navigationClick(cui_pages.appealOverviewPage.$interactive.payForAppealLink);

      await cui_pages.paymentDetailsPage.verifyUserIsOnPage();
      await cui_pages.paymentDetailsPage.autoPopulateAndSubmitPaymentDetailsForm();

      await cui_pages.confirmPaymentDetailsPage.verifyUserIsOnPage();
      await cui_pages.confirmPaymentDetailsPage.navigationClick(cui_pages.confirmPaymentDetailsPage.$interactive.confirmPaymentButton);
    });

    await test.step('Verify application has successfully been paid for', async () => {
      await cui_pages.confirmationOfPaymentPage.verifyUserIsOnPage();

      await expect(cui_pages.confirmationOfPaymentPage.$static.pageHeading).toHaveText('Your late appeal details have been sent');
      await expect(cui_pages.confirmationOfPaymentPage.$static.whatHappensNextHeading).toBeVisible();
      await expect(
        cui_pages.confirmationOfPaymentPage.page.getByText(
          'A Legal Officer will look at the reasons your appeal was late and decide if your appeal can continue',
          { exact: true },
        ),
      ).toBeVisible();
      await expect(
        cui_pages.confirmationOfPaymentPage.page.getByText(
          'You will be sent a notification to tell you what the Tribunal has decided and what you can do next',
          { exact: true },
        ),
      ).toBeVisible();

      const expectedDate = (await dataUtils.getDateFromToday({ dayOffset: 5 })).full;
      await expect(
        cui_pages.confirmationOfPaymentPage.page.getByText(`This should be by ${expectedDate} but it might be later than that`, { exact: true }),
      ).toBeVisible();

      await expect(cui_pages.confirmationOfPaymentPage.$static.thingsYouCanDoNowHeading).toBeVisible();
      await expect(cui_pages.confirmationOfPaymentPage.$interactive.readMoreAboutAppealingAsylumDecisionLink).toBeVisible();
      await expect(cui_pages.confirmationOfPaymentPage.$interactive.findOrganisationsThatCanHelpLink).toBeVisible();
    });
  });

  // The following test covers an alternative path i.e an application that is in time and does not require any payment nor has a sponsor
  test('Verify user is able to submit a non paid appeal via the UI', { tag: ['@e2e'] }, async ({ cui_pages, dataUtils }) => {
    await test.step('Navigate to about appeals page', async () => {
      await cui_pages.appealOverviewPage.verifyUserIsOnPage();
      await cui_pages.appealOverviewPage.navigationClick(cui_pages.appealOverviewPage.$interactive.continueButton);

      await cui_pages.aboutAppealPage.verifyUserIsOnPage();
    });

    await test.step('Complete appeal type section of journey', async () => {
      await cui_pages.aboutAppealPage.navigationClick(cui_pages.aboutAppealPage.$interactive.appealTypeLink);

      await cui_pages.inTheUkPage.verifyUserIsOnPage();
      await cui_pages.inTheUkPage.completePageAndContinue({ isUserInTheUk: 'Yes' });

      await cui_pages.appealTypePage.verifyUserIsOnPage();
      await cui_pages.appealTypePage.completePageAndContinue({ appealType: 'Deprivation of Citizenship' });

      await cui_pages.aboutAppealPage.verifyUserIsOnPage();
    });

    await test.step('Complete your home office and details section of journey', async () => {
      await cui_pages.aboutAppealPage.navigationClick(cui_pages.aboutAppealPage.$interactive.homeOfficeAndPersonalDetailsLink);

      await cui_pages.homeOfficeReferenceNumberPage.verifyUserIsOnPage();
      const homeOfficeReference = await dataUtils.generateRandomNumber({ digitLength: 9 });
      await cui_pages.homeOfficeReferenceNumberPage.completePageAndContinue({ homeOfficeReference: homeOfficeReference });

      await cui_pages.applicantNamePage.verifyUserIsOnPage();
      const applicantName = await dataUtils.generateRandomFirstAndLastNames({ countOfFirstNamesToGenerate: 1, countOfLastNamesToGenerate: 1 });
      await cui_pages.applicantNamePage.completePageAndContinue({
        givenNames: applicantName.firstNames[0],
        familyName: applicantName.lastNames[0],
      });

      await cui_pages.applicantDobPage.verifyUserIsOnPage();
      const applicantDob = await dataUtils.getDateFromToday({ yearOffset: -30 });
      await cui_pages.applicantDobPage.completePageAndContinue({
        day: applicantDob.day,
        month: applicantDob.month,
        year: applicantDob.year,
      });

      await cui_pages.applicantNationalityPage.verifyUserIsOnPage();
      await cui_pages.applicantNationalityPage.completePageAndContinue({ stateless: true });

      await cui_pages.decisionLetterSentPage.verifyUserIsOnPage();
      const dateLetterSent = await dataUtils.getDateFromToday({ dayOffset: -10 });
      await cui_pages.decisionLetterSentPage.completePageAndContinue({
        day: dateLetterSent.day,
        month: dateLetterSent.month,
        year: dateLetterSent.year,
        verifyAllTextOnPage: true,
      });

      await cui_pages.uploadDecisionLetterPage.verifyUserIsOnPage();
      await cui_pages.uploadDecisionLetterPage.completePageAndContinue({});

      await cui_pages.deportationOrderPage.verifyUserIsOnPage();
      await cui_pages.deportationOrderPage.completePageAndContinue({ deportationOrderReceived: 'No' });

      await cui_pages.aboutAppealPage.verifyUserIsOnPage();
    });

    await test.step('Complete your contact details section of journey', async () => {
      await cui_pages.aboutAppealPage.navigationClick(cui_pages.aboutAppealPage.$interactive.yourContactDetailsLink);

      await cui_pages.contactPreferencesPage.verifyUserIsOnPage();
      const contactDetails = await dataUtils.generateContactDetails('Email and Phone');
      await cui_pages.contactPreferencesPage.completePageAndContinue({
        contactPreference: 'Email and Phone',
        applicantEmail: contactDetails.email,
        applicantPhoneNumber: contactDetails.phone,
      });

      await cui_pages.applicantAddressPage.verifyUserIsOnPage();
      await cui_pages.applicantAddressPage.completePageAndContinue({
        addressPreference: 'Post Code Search',
        postCode: 'N1 7DA',
        verifyAllTextOnPage: true,
      });

      await cui_pages.selectAddressPage.verifyUserIsOnPage();
      await cui_pages.selectAddressPage.completePageAndContinue({ preference: 'Select Address At Random', verifyAllTextOnPage: true });

      await cui_pages.manualAddressPage.verifyUserIsOnPage();
      await cui_pages.manualAddressPage.completePageAndContinue({
        preference: 'Address selected via postcode search',
        postCode: 'N1 7DA',
        verifyAllTextOnPage: true,
      });

      await cui_pages.hasSponsorPage.verifyUserIsOnPage();
      await cui_pages.hasSponsorPage.completePageAndContinue({ doesApplicantHaveASponsor: 'No' });

      await cui_pages.aboutAppealPage.verifyUserIsOnPage();
    });

    await test.step('Complete decision with or without a hearing section of joruney', async () => {
      await cui_pages.aboutAppealPage.navigationClick(cui_pages.aboutAppealPage.$interactive.decisionWithOrWithoutHearingLink);

      await cui_pages.decisionTypePage.verifyUserIsOnPage();
      await cui_pages.decisionTypePage.completePageAndContinue({ decisionWithOrWithoutHearing: 'decisionWithoutHearing' });

      await cui_pages.equalityAndDiversityStartPage.verifyUserIsOnPage();
      await cui_pages.equalityAndDiversityStartPage.completePageAndContinue({});

      await cui_pages.aboutAppealPage.verifyUserIsOnPage();
    });

    await test.step('Complete check and send section of journey', async () => {
      await cui_pages.aboutAppealPage.navigationClick(cui_pages.aboutAppealPage.$interactive.checkAndSendYourAppealDetailsLink);

      await cui_pages.newAppealCheckAnswersPage.verifyUserIsOnPage();
      await cui_pages.newAppealCheckAnswersPage.submitApplication();
    });

    await test.step('Verify application has successfully been submitted', async () => {
      await cui_pages.appealDetailsSentPage.verifyUserIsOnPage();

      await expect(cui_pages.appealDetailsSentPage.$static.pageHeading).toHaveText('Your appeal details have been sent');
      await expect(cui_pages.appealDetailsSentPage.$static.whatHappensNextHeading).toBeVisible();
      await expect(
        cui_pages.appealDetailsSentPage.page.getByText(
          'A Legal Officer will ask the Home Office to send any documents it has about your case to the Tribunal',
          { exact: true },
        ),
      ).toBeVisible();
      await expect(
        cui_pages.appealDetailsSentPage.page.getByText(
          'A Legal Officer will check the Home Office documents and then contact you to tell you what to do next',
          { exact: true },
        ),
      ).toBeVisible();

      const expectedDate = (await dataUtils.getDateFromToday({ dayOffset: 5 })).full;
      await expect(
        cui_pages.appealDetailsSentPage.page.getByText(`This should be by ${expectedDate} but it might take longer than that`, { exact: true }),
      ).toBeVisible();

      await expect(cui_pages.appealDetailsSentPage.$static.thingsYouCanDoNowHeading).toBeVisible();
      await expect(cui_pages.appealDetailsSentPage.$interactive.readMoreAboutAppealingAsylumDecisionLink).toBeVisible();
      await expect(cui_pages.appealDetailsSentPage.$interactive.findOrganisationsThatCanHelpLink).toBeVisible();
    });
  });
});
