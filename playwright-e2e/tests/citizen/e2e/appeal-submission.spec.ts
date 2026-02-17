import { test, expect } from '../../../fixtures.js';

test.describe('Set of tests to verify user is able to submit an appeal via citizen ui', () => {
  test.beforeEach(async ({ citizenUser, cui_login }) => {
    await cui_login(citizenUser.email, citizenUser.password);
  });

  test('Verify user is able to submit a paid appeal of type protection', async ({
    cui_appealOverviewPage,
    cui_aboutAppealPage,
    cui_inTheUkPage,
    cui_appealTypePage,
    cui_homeOfficeReferenceNumberPage,
    cui_applicantNamePage,
    cui_applicantDobPage,
    cui_applicantNationalityPage,
    cui_decisionLetterSentPage,
    cui_uploadDecisionLetterPage,
    cui_deportationOrderPage,
    cui_contactPreferencesPage,
    cui_applicantAddressPage,
    cui_selectAddressPage,
    cui_manualAddressPage,
    cui_hasSponsorPage,
    dataUtils,
  }) => {
    const homeOfficeReference = await dataUtils.generateRandomNumber({ digitLength: 9 });
    const applicantName = await dataUtils.generateRandomFirstAndLastNames({ countOfFirstNamesToGenerate: 1, countOfLastNamesToGenerate: 1 });
    const applicantDob = await dataUtils.getDateFromToday({ yearOffset: -30 });
    const decisionLetterSentDate = await dataUtils.getDateFromToday({ monthOffset: -2 });
    const applicantContactDetails = await dataUtils.generateContactDetails('Email and Phone');
    let applicantAddress: string;

    await test.step('Navigate to about appeal page', async () => {
      await cui_appealOverviewPage.navigationClick(cui_appealOverviewPage.$interactive.continueButton);
      await cui_aboutAppealPage.verifyUserIsOnPage();
    });

    await test.step('Select and answer appeal type section', async () => {
      await cui_aboutAppealPage.navigationClick(cui_aboutAppealPage.$interactive.appealTypeLink);

      await cui_inTheUkPage.verifyUserIsOnPage();
      await cui_inTheUkPage.completePageAndContinue({ isUserInTheUk: 'Yes' });

      await cui_appealTypePage.verifyUserIsOnPage();
      await cui_appealTypePage.completePageAndContinue({ appealType: 'Protection' });

      await cui_aboutAppealPage.verifyUserIsOnPage();
    });

    await test.step('Verify appeal type answers have been saved and completed', async () => {
      await expect(cui_aboutAppealPage.$static.appealTypeStatus).toHaveText('Saved');
    });

    await test.step('Select and answer your home office and personal details section', async () => {
      await cui_aboutAppealPage.navigationClick(cui_aboutAppealPage.$interactive.homeOfficeAndPersonalDetailsLink);

      await cui_homeOfficeReferenceNumberPage.verifyUserIsOnPage();
      await cui_homeOfficeReferenceNumberPage.completePageAndContinue({ homeOfficeReference: homeOfficeReference });

      await cui_applicantNamePage.verifyUserIsOnPage();
      await cui_applicantNamePage.completePageAndContinue({ givenNames: applicantName.firstNames[0], familyName: applicantName.lastNames[0] });

      await cui_applicantDobPage.verifyUserIsOnPage();
      await cui_applicantDobPage.completePageAndContinue({ day: applicantDob.day, month: applicantDob.month, year: applicantDob.year });

      await cui_applicantNationalityPage.verifyUserIsOnPage();
      await cui_applicantNationalityPage.completePageAndContinue({ stateless: false, nationality: 'China' });

      await cui_decisionLetterSentPage.verifyUserIsOnPage();
      await cui_decisionLetterSentPage.completePageAndContinue({
        day: decisionLetterSentDate.day,
        month: decisionLetterSentDate.month,
        year: decisionLetterSentDate.year,
      });

      await cui_uploadDecisionLetterPage.verifyUserIsOnPage();
      await cui_uploadDecisionLetterPage.completePageAndContinue({});

      await cui_deportationOrderPage.verifyUserIsOnPage();
      await cui_deportationOrderPage.completePageAndContinue({ deportationOrderReceived: 'Yes' });

      await cui_aboutAppealPage.verifyUserIsOnPage();
    });

    await test.step('Verify home office and personal details answers have been saved and completed', async () => {
      await expect(cui_aboutAppealPage.$static.homeOfficeAndPersonalDetailsStatus).toHaveText('Saved');
    });

    await test.step('Select and answer your contact details section', async () => {
      await cui_aboutAppealPage.navigationClick(cui_aboutAppealPage.$interactive.yourContactDetailsLink);

      await cui_contactPreferencesPage.verifyUserIsOnPage();
      await cui_contactPreferencesPage.completePageAndContinue({
        contactPreference: 'Email and Phone',
        applicantEmail: applicantContactDetails.email,
        applicantPhoneNumber: applicantContactDetails.phone,
      });

      await cui_applicantAddressPage.verifyUserIsOnPage();
      await cui_applicantAddressPage.completePageAndContinue({ addressPreference: 'Post Code Search', postCode: 'NW1 9BX' });

      await cui_selectAddressPage.verifyUserIsOnPage();
      applicantAddress = await cui_selectAddressPage.completePageAndContinue({ preference: 'Select Address At Random' });

      await cui_manualAddressPage.verifyUserIsOnPage();
      await cui_manualAddressPage.completePageAndContinue({
        preference: 'Address selected via postcode search',
        postCode: 'NW1 9BX',
      });

      await cui_hasSponsorPage.verifyUserIsOnPage();
      await cui_hasSponsorPage.completePageAndContinue({ doesApplicantHaveASponsor: 'Yes' });
    });
  });
});
