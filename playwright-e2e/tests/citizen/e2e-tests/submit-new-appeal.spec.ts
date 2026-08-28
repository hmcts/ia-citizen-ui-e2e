import { test, expect } from '../../../fixtures.js';

test.describe('Set of tests to verify user is able to submit an appeal via the UI', { tag: ['@e2e'] }, () => {
  test.beforeEach(async ({ citizenUser, cui_login }) => {
    await cui_login({ email: citizenUser.email, password: citizenUser.password });
  });

  // The following test covers a late appeal that also has a sponsor and fee support.
  test('Verify user is able to submit a paid appeal via the UI', { tag: ['@crossBrowser'] }, async ({ cui_pages, dataUtils }) => {
    await test.step('Navigate to appeal overview page', async () => {
      await cui_pages.caseList.createNewAppeal();
      await cui_pages.appealOverview.verifyUserIsOnPage();
    });

    await test.step('Navigate to about appeals page', async () => {
      await cui_pages.appealOverview.navigationClick(cui_pages.appealOverview.$interactive.continueButton);

      await cui_pages.aboutAppeal.verifyUserIsOnPage();
    });

    await test.step('Complete appeal type section of journey', async () => {
      await cui_pages.aboutAppeal.navigationClick(cui_pages.aboutAppeal.$interactive.appealTypeLink);

      await cui_pages.inTheUk.verifyUserIsOnPage();
      await cui_pages.inTheUk.completePageAndContinue({ isUserInTheUk: 'No' });

      await cui_pages.appealType.verifyUserIsOnPage();
      await cui_pages.appealType.verifyAllTextOnPage();
      await cui_pages.appealType.completePageAndContinue({ appealType: 'Human Rights' });

      await cui_pages.outOfCountryHrEea.verifyUserIsOnPage();
      await cui_pages.outOfCountryHrEea.completePageAndContinue({ outsideUkWhenApplicationMade: 'No' });

      await cui_pages.outOfCountryHrInside.verifyUserIsOnPage();
      await cui_pages.outOfCountryHrInside.verifyAllTextOnPage();
      const dateLeftUk = await dataUtils.getDateFromToday({ yearOffset: -4 });
      await cui_pages.outOfCountryHrInside.completePageAndContinue({
        day: dateLeftUk.day,
        month: dateLeftUk.month,
        year: dateLeftUk.year,
      });

      await cui_pages.aboutAppeal.verifyUserIsOnPage();
    });

    await test.step('Complete your home office and details section of journey', async () => {
      await cui_pages.aboutAppeal.navigationClick(cui_pages.aboutAppeal.$interactive.homeOfficeAndPersonalDetailsLink);

      await cui_pages.homeOfficeReferenceNumber.verifyUserIsOnPage();
      await cui_pages.homeOfficeReferenceNumber.verifyAllTextOnPage();
      const homeOfficeReference = await dataUtils.generateRandomNumber({ digitLength: 9 });
      await cui_pages.homeOfficeReferenceNumber.completePageAndContinue({ homeOfficeReference: homeOfficeReference });

      await cui_pages.applicantName.verifyUserIsOnPage();
      await cui_pages.applicantName.verifyAllTextOnPage();
      const applicantName = await dataUtils.generateRandomFirstAndLastNames({ countOfFirstNamesToGenerate: 1, countOfLastNamesToGenerate: 1 });
      await cui_pages.applicantName.completePageAndContinue({
        givenNames: applicantName.firstNames[0],
        familyName: applicantName.lastNames[0],
      });

      await cui_pages.applicantDob.verifyUserIsOnPage();
      await cui_pages.applicantDob.verifyAllTextOnPage();
      const applicantDob = await dataUtils.getDateFromToday({ yearOffset: -30 });
      await cui_pages.applicantDob.completePageAndContinue({
        day: applicantDob.day,
        month: applicantDob.month,
        year: applicantDob.year,
      });

      await cui_pages.applicantNationality.verifyUserIsOnPage();
      await cui_pages.applicantNationality.verifyAllTextOnPage();
      await cui_pages.applicantNationality.completePageAndContinue({ nationality: 'Singaporean', stateless: false });

      await cui_pages.decisionLetterReceived.verifyUserIsOnPage();
      await cui_pages.decisionLetterReceived.verifyAllTextOnPage();
      const dateLetterReceived = await dataUtils.getDateFromToday({ monthOffset: -2 });
      await cui_pages.decisionLetterReceived.completePageAndContinue({
        day: dateLetterReceived.day,
        month: dateLetterReceived.month,
        year: dateLetterReceived.year,
      });

      await cui_pages.uploadDecisionLetter.verifyUserIsOnPage();
      await cui_pages.uploadDecisionLetter.verifyAllTextOnPage();
      await cui_pages.uploadDecisionLetter.completePageAndContinue({});

      await cui_pages.deportationOrder.verifyUserIsOnPage();
      await cui_pages.deportationOrder.verifyAllTextOnPage();
      await cui_pages.deportationOrder.completePageAndContinue({ deportationOrderReceived: 'Yes' });

      await cui_pages.aboutAppeal.verifyUserIsOnPage();
    });

    await test.step('Complete your contact details section of journey', async () => {
      await cui_pages.aboutAppeal.navigationClick(cui_pages.aboutAppeal.$interactive.yourContactDetailsLink);

      await cui_pages.contactPreferences.verifyUserIsOnPage();
      await cui_pages.contactPreferences.verifyAllTextOnPage();
      const contactDetails = await dataUtils.generateContactDetails('Email and Phone');
      await cui_pages.contactPreferences.completePageAndContinue({
        contactPreference: 'Email and Phone',
        applicantEmail: contactDetails.email,
        applicantPhoneNumber: contactDetails.phone,
      });

      await cui_pages.outOfCountryAddress.verifyUserIsOnPage();
      await cui_pages.outOfCountryAddress.completePageAndContinue({
        applicantAddress: 'Flat 1, 1 Test Street, Test Town, TE1 1ST, United Kingdom',
      });

      await cui_pages.hasSponsor.verifyUserIsOnPage();
      await cui_pages.hasSponsor.verifyAllTextOnPage();
      await cui_pages.hasSponsor.completePageAndContinue({ doesApplicantHaveASponsor: 'Yes' });

      await cui_pages.sponsorName.verifyUserIsOnPage();
      await cui_pages.sponsorName.verifyAllTextOnPage();
      const sponsorName = await dataUtils.generateRandomFirstAndLastNames({ countOfFirstNamesToGenerate: 1, countOfLastNamesToGenerate: 1 });
      await cui_pages.sponsorName.completePageAndContinue({
        givenNames: sponsorName.firstNames[0],
        familyName: sponsorName.lastNames[0],
      });

      await cui_pages.sponsorAddress.verifyUserIsOnPage();
      await cui_pages.sponsorAddress.verifyAllTextOnPage();
      await cui_pages.sponsorAddress.completePageAndContinue({
        addressLine1: '123 Fake Street',
        townOrCity: 'Faketown',
        postCode: 'FK1 1FK',
      });

      await cui_pages.sponsorContactPreferences.verifyUserIsOnPage();
      await cui_pages.sponsorContactPreferences.verifyAllTextOnPage();
      const sponsorContactDetails = await dataUtils.generateContactDetails('Email and Phone');
      await cui_pages.sponsorContactPreferences.completePageAndContinue({
        contactPreference: 'Email and Phone',
        sponsorEmail: sponsorContactDetails.email,
        sponsorPhoneNumber: sponsorContactDetails.phone,
      });

      await cui_pages.sponsorAuthorisation.verifyUserIsOnPage();
      await cui_pages.sponsorAuthorisation.completePageAndContinue({ allowSponsorToSeeAppealInformation: 'Yes' });

      await cui_pages.aboutAppeal.verifyUserIsOnPage();
    });

    await test.step('Complete decision with or without a hearing section of joruney', async () => {
      await cui_pages.aboutAppeal.navigationClick(cui_pages.aboutAppeal.$interactive.decisionWithOrWithoutHearingLink);

      await cui_pages.decisionType.verifyUserIsOnPage();
      await cui_pages.decisionType.verifyAllTextOnPage();
      await cui_pages.decisionType.completePageAndContinue({ decisionWithOrWithoutHearing: 'decisionWithHearing' });

      await cui_pages.equalityAndDiversityStart.verifyUserIsOnPage();
      await cui_pages.equalityAndDiversityStart.verifyAllTextOnPage();
      await cui_pages.equalityAndDiversityStart.completePageAndContinue();

      await cui_pages.aboutAppeal.verifyUserIsOnPage();
    });

    await test.step('Complete fee support section of journey', async () => {
      await cui_pages.aboutAppeal.navigationClick(cui_pages.aboutAppeal.$interactive.supportToPayTheFeeLink);

      await cui_pages.feeSupport.verifyUserIsOnPage();
      await cui_pages.feeSupport.verifyAllTextOnPage();
      await cui_pages.feeSupport.completePageAndContinue({
        whetherApplicantHasToPayAFee: 'I get asylum support from the Home Office',
      });

      await cui_pages.asylumSupport.verifyUserIsOnPage();
      await cui_pages.asylumSupport.verifyAllTextOnPage();
      const asylumSupportRefNumber = await dataUtils.generateRandomNumber({ digitLength: 8 });
      await cui_pages.asylumSupport.completePageAndContinue({ asylumSupportRefNumber: asylumSupportRefNumber });

      await cui_pages.aboutAppeal.verifyUserIsOnPage();
    });

    await test.step('Complete check and send section of journey', async () => {
      await cui_pages.aboutAppeal.navigationClick(cui_pages.aboutAppeal.$interactive.checkAndSendYourAppealDetailsLink);

      await cui_pages.lateAppeal.verifyUserIsOnPage();
      await cui_pages.lateAppeal.verifyAllTextOnPage();
      await cui_pages.lateAppeal.completePageAndContinue({
        reasonForLateAppeal: 'Apologies for the late appeal submission',
      });

      await cui_pages.newAppealCheckAnswers.verifyUserIsOnPage();
      await cui_pages.newAppealCheckAnswers.submitApplication();
    });

    await test.step('Verify application has successfully been submitted', async () => {
      await cui_pages.appealDetailsSent.verifyUserIsOnPage();

      await expect(cui_pages.appealDetailsSent.$static.pageHeading).toHaveText('Your late appeal details have been sent');
      await expect(cui_pages.appealDetailsSent.$static.whatHappensNextHeading).toBeVisible();
      await expect(
        cui_pages.appealDetailsSent.page.getByText(
          'You have sent a late appeal and have told the Tribunal you believe you do not have to pay some or all the fee',
          { exact: true },
        ),
      ).toBeVisible();
      await expect(
        cui_pages.appealDetailsSent.page.getByText(
          'The Tribunal will first check the information you sent about the fee and let you know if you need to pay',
          { exact: true },
        ),
      ).toBeVisible();

      const expectedDate = (await dataUtils.getDateFromToday({ dayOffset: 28 })).full;
      await expect(
        cui_pages.appealDetailsSent.page.getByText(`This should be by ${expectedDate} but it might take longer than that`, { exact: true }),
      ).toBeVisible();

      await expect(
        cui_pages.appealDetailsSent.page.getByText(
          'The Tribunal will then look at the reasons your appeal was late and let you know what will happen next',
          { exact: true },
        ),
      ).toBeVisible();

      await expect(cui_pages.appealDetailsSent.$static.thingsYouCanDoNowHeading).toBeVisible();
      await expect(cui_pages.appealDetailsSent.$interactive.readMoreAboutAppealingAsylumDecisionLink).toBeVisible();
      await expect(cui_pages.appealDetailsSent.$interactive.findOrganisationsThatCanHelpLink).toBeVisible();
    });

    await test.step('Pay for appeal', async () => {
      await cui_pages.appealDetailsSent.navigationClick(cui_pages.appealDetailsSent.$interactive.seeYourAppealProgressButton);

      await cui_pages.appealOverview.verifyUserIsOnPage();
      await cui_pages.appealOverview.navigationClick(cui_pages.appealOverview.$interactive.payForAppealLink);

      await cui_pages.cardPaymentDetails.verifyUserIsOnPage();
      await cui_pages.cardPaymentDetails.autoPopulateAndSubmitPaymentDetailsForm();

      await cui_pages.cardPaymentConfirmDetails.verifyUserIsOnPage();
      await cui_pages.cardPaymentConfirmDetails.navigationClick(cui_pages.cardPaymentConfirmDetails.$interactive.confirmPaymentButton);
    });

    await test.step('Verify application has successfully been paid for', async () => {
      await cui_pages.confirmationOfPayment.verifyUserIsOnPage();

      await expect(cui_pages.confirmationOfPayment.$static.pageHeading).toHaveText('Your late appeal details have been sent');
      await expect(cui_pages.confirmationOfPayment.$static.whatHappensNextHeading).toBeVisible();
      await expect(
        cui_pages.confirmationOfPayment.page.getByText(
          'A Legal Officer will look at the reasons your appeal was late and decide if your appeal can continue',
          { exact: true },
        ),
      ).toBeVisible();
      await expect(
        cui_pages.confirmationOfPayment.page.getByText(
          'You will be sent a notification to tell you what the Tribunal has decided and what you can do next',
          { exact: true },
        ),
      ).toBeVisible();

      const expectedDate = (await dataUtils.getDateFromToday({ dayOffset: 5 })).full;
      await expect(
        cui_pages.confirmationOfPayment.page.getByText(`This should be by ${expectedDate} but it might be later than that`, { exact: true }),
      ).toBeVisible();

      await expect(cui_pages.confirmationOfPayment.$static.thingsYouCanDoNowHeading).toBeVisible();
      await expect(cui_pages.confirmationOfPayment.$interactive.readMoreAboutAppealingAsylumDecisionLink).toBeVisible();
      await expect(cui_pages.confirmationOfPayment.$interactive.findOrganisationsThatCanHelpLink).toBeVisible();
    });
  });

  // The following test covers an alternative path i.e an application that is in time and does not require any payment nor has a sponsor
  test('Verify user is able to submit a non paid appeal via the UI', async ({ cui_pages, dataUtils }) => {
    await test.step('Navigate to appeal overview page', async () => {
      await cui_pages.caseList.createNewAppeal();
      await cui_pages.appealOverview.verifyUserIsOnPage();
    });

    await test.step('Navigate to about appeals page', async () => {
      await cui_pages.appealOverview.navigationClick(cui_pages.appealOverview.$interactive.continueButton);

      await cui_pages.aboutAppeal.verifyUserIsOnPage();
    });

    await test.step('Complete appeal type section of journey', async () => {
      await cui_pages.aboutAppeal.navigationClick(cui_pages.aboutAppeal.$interactive.appealTypeLink);

      await cui_pages.inTheUk.verifyUserIsOnPage();
      await cui_pages.inTheUk.completePageAndContinue({ isUserInTheUk: 'Yes' });

      await cui_pages.appealType.verifyUserIsOnPage();
      await cui_pages.appealType.completePageAndContinue({ appealType: 'Deprivation of Citizenship' });

      await cui_pages.aboutAppeal.verifyUserIsOnPage();
    });

    await test.step('Complete your home office and details section of journey', async () => {
      await cui_pages.aboutAppeal.navigationClick(cui_pages.aboutAppeal.$interactive.homeOfficeAndPersonalDetailsLink);

      await cui_pages.homeOfficeReferenceNumber.verifyUserIsOnPage();
      const homeOfficeReference = await dataUtils.generateRandomNumber({ digitLength: 9 });
      await cui_pages.homeOfficeReferenceNumber.completePageAndContinue({ homeOfficeReference: homeOfficeReference });

      await cui_pages.applicantName.verifyUserIsOnPage();
      const applicantName = await dataUtils.generateRandomFirstAndLastNames({ countOfFirstNamesToGenerate: 1, countOfLastNamesToGenerate: 1 });
      await cui_pages.applicantName.completePageAndContinue({
        givenNames: applicantName.firstNames[0],
        familyName: applicantName.lastNames[0],
      });

      await cui_pages.applicantDob.verifyUserIsOnPage();
      const applicantDob = await dataUtils.getDateFromToday({ yearOffset: -30 });
      await cui_pages.applicantDob.completePageAndContinue({
        day: applicantDob.day,
        month: applicantDob.month,
        year: applicantDob.year,
      });

      await cui_pages.applicantNationality.verifyUserIsOnPage();
      await cui_pages.applicantNationality.completePageAndContinue({ stateless: true });

      await cui_pages.decisionLetterSent.verifyUserIsOnPage();
      await cui_pages.decisionLetterSent.verifyAllTextOnPage();
      const dateLetterSent = await dataUtils.getDateFromToday({ dayOffset: -10 });
      await cui_pages.decisionLetterSent.completePageAndContinue({
        day: dateLetterSent.day,
        month: dateLetterSent.month,
        year: dateLetterSent.year,
      });

      await cui_pages.uploadDecisionLetter.verifyUserIsOnPage();
      await cui_pages.uploadDecisionLetter.completePageAndContinue({});

      await cui_pages.deportationOrder.verifyUserIsOnPage();
      await cui_pages.deportationOrder.completePageAndContinue({ deportationOrderReceived: 'No' });

      await cui_pages.aboutAppeal.verifyUserIsOnPage();
    });

    await test.step('Complete your contact details section of journey', async () => {
      await cui_pages.aboutAppeal.navigationClick(cui_pages.aboutAppeal.$interactive.yourContactDetailsLink);

      await cui_pages.contactPreferences.verifyUserIsOnPage();
      const contactDetails = await dataUtils.generateContactDetails('Email and Phone');
      await cui_pages.contactPreferences.completePageAndContinue({
        contactPreference: 'Email and Phone',
        applicantEmail: contactDetails.email,
        applicantPhoneNumber: contactDetails.phone,
      });

      await cui_pages.applicantAddress.verifyUserIsOnPage();
      await cui_pages.applicantAddress.verifyAllTextOnPage();
      await cui_pages.applicantAddress.completePageAndContinue({
        addressPreference: 'Post Code Search',
        postCode: 'N1 7DA',
      });

      await cui_pages.selectAddress.verifyUserIsOnPage();
      await cui_pages.selectAddress.verifyAllTextOnPage();
      await cui_pages.selectAddress.completePageAndContinue({ preference: 'Select Address At Random' });

      await cui_pages.manualAddress.verifyUserIsOnPage();
      await cui_pages.manualAddress.verifyAllTextOnPage();
      await cui_pages.manualAddress.completePageAndContinue({
        preference: 'Address selected via postcode search',
        postCode: 'N1 7DA',
      });

      await cui_pages.hasSponsor.verifyUserIsOnPage();
      await cui_pages.hasSponsor.completePageAndContinue({ doesApplicantHaveASponsor: 'No' });

      await cui_pages.aboutAppeal.verifyUserIsOnPage();
    });

    await test.step('Complete decision with or without a hearing section of joruney', async () => {
      await cui_pages.aboutAppeal.navigationClick(cui_pages.aboutAppeal.$interactive.decisionWithOrWithoutHearingLink);

      await cui_pages.decisionType.verifyUserIsOnPage();
      await cui_pages.decisionType.completePageAndContinue({ decisionWithOrWithoutHearing: 'decisionWithoutHearing' });

      await cui_pages.equalityAndDiversityStart.verifyUserIsOnPage();
      await cui_pages.equalityAndDiversityStart.completePageAndContinue();

      await cui_pages.aboutAppeal.verifyUserIsOnPage();
    });

    await test.step('Complete check and send section of journey', async () => {
      await cui_pages.aboutAppeal.navigationClick(cui_pages.aboutAppeal.$interactive.checkAndSendYourAppealDetailsLink);

      await cui_pages.newAppealCheckAnswers.verifyUserIsOnPage();
      await cui_pages.newAppealCheckAnswers.submitApplication();
    });

    await test.step('Verify application has successfully been submitted', async () => {
      await cui_pages.appealDetailsSent.verifyUserIsOnPage();

      await expect(cui_pages.appealDetailsSent.$static.pageHeading).toHaveText('Your appeal details have been sent');
      await expect(cui_pages.appealDetailsSent.$static.whatHappensNextHeading).toBeVisible();
      await expect(
        cui_pages.appealDetailsSent.page.getByText(
          'A Legal Officer will ask the Home Office to send any documents it has about your case to the Tribunal',
          { exact: true },
        ),
      ).toBeVisible();
      await expect(
        cui_pages.appealDetailsSent.page.getByText(
          'A Legal Officer will check the Home Office documents and then contact you to tell you what to do next',
          { exact: true },
        ),
      ).toBeVisible();

      const expectedDate = (await dataUtils.getDateFromToday({ dayOffset: 5 })).full;
      await expect(
        cui_pages.appealDetailsSent.page.getByText(`This should be by ${expectedDate} but it might take longer than that`, { exact: true }),
      ).toBeVisible();

      await expect(cui_pages.appealDetailsSent.$static.thingsYouCanDoNowHeading).toBeVisible();
      await expect(cui_pages.appealDetailsSent.$interactive.readMoreAboutAppealingAsylumDecisionLink).toBeVisible();
      await expect(cui_pages.appealDetailsSent.$interactive.findOrganisationsThatCanHelpLink).toBeVisible();
    });
  });
});
