import { Page } from '@playwright/test';
import { YourDetailsJourney } from '../../../types';
import {
  AboutAppealPage,
  InTheUkPage,
  OutOfCountryPage,
  AppealTypePage,
  HomeOfficeReferenceNumberPage,
  ApplicantNamePage,
  ApplicantDobPage,
  ApplicantNationalityPage,
  DecisionLetterSentPage,
  DecisionLetterReceivedPage,
  UploadDecisionLetterPage,
  DeportationOrderPage,
  ContactPreferencesPage,
  OutOfCountryAddressPage,
  ApplicantAddressPage,
  SelectAddressPage,
  ManualAddressPage,
  HasSponsorPage,
  SponsorNamePage,
  SponsorAddressPage,
  SponsorContactPreferencesPage,
  SponsorAuthorisationPage,
} from '../../../page-objects/cui/pages/index';
import { DataUtils } from '../../../utils/index';

export type ApplicantDetailsType = {
  homeOfficeReference: number;
  applicantDetails: {
    givenNames: string[];
    familyName: string;
    dob: string;
    dateLeftUk?: string;
    decisionLetterDate: string;
    address: string;
    email?: string;
    phoneNumber?: string;
  };
  sponsorDetails?: {
    givenNames: string[];
    familyName: string;
    address: string;
    email?: string;
    phoneNumber?: string;
  };
};

export class YourDetailsSectionOfAppealJourney {
  constructor(private readonly page: Page) {}
  private cui_aboutAppealPage = new AboutAppealPage(this.page);
  private cui_inTheUkPage = new InTheUkPage(this.page);
  private cui_outOfCountryPage = new OutOfCountryPage(this.page);
  private cui_appealTypePage = new AppealTypePage(this.page);
  private cui_homeOfficeReferenceNumberPage = new HomeOfficeReferenceNumberPage(this.page);
  private cui_applicantNamePage = new ApplicantNamePage(this.page);
  private cui_applicantDobPage = new ApplicantDobPage(this.page);
  private cui_applicantNationalityPage = new ApplicantNationalityPage(this.page);
  private cui_decisionLetterSentPage = new DecisionLetterSentPage(this.page);
  private cui_decisionLetterReceivedPage = new DecisionLetterReceivedPage(this.page);
  private cui_uploadDecisionLetterPage = new UploadDecisionLetterPage(this.page);
  private cui_deportationOrderPage = new DeportationOrderPage(this.page);
  private cui_contactPreferencesPage = new ContactPreferencesPage(this.page);
  private cui_outOfCountryAddressPage = new OutOfCountryAddressPage(this.page);
  private cui_applicantAddressPage = new ApplicantAddressPage(this.page);
  private cui_selectAddressPage = new SelectAddressPage(this.page);
  private cui_manualAddressPage = new ManualAddressPage(this.page);
  private cui_hasSponsorPage = new HasSponsorPage(this.page);
  private cui_sponsorNamePage = new SponsorNamePage(this.page);
  private cui_sponsorAddressPage = new SponsorAddressPage(this.page);
  private cui_sponsorContactPreferencesPage = new SponsorContactPreferencesPage(this.page);
  private cui_sponsorAuthorisationPage = new SponsorAuthorisationPage(this.page);
  private dataUtils = new DataUtils();

  public async complete(appealData: YourDetailsJourney): Promise<ApplicantDetailsType> {
    await this.cui_aboutAppealPage.verifyUserIsOnAboutAppealPage();
    await this.cui_aboutAppealPage.navigationClick(this.cui_aboutAppealPage.$interactive.appealTypeLink);

    await this.cui_inTheUkPage.verifyUserIsOnInTheUkPage();
    await this.cui_inTheUkPage.completePageAndContinue({
      isUserInTheUk: appealData.isUserInTheUk,
    });

    await this.cui_appealTypePage.verifyUserIsOnAppealTypePage();
    await this.cui_appealTypePage.completePageAndContinue({
      appealType: appealData.appealType,
    });

    let dateLeftUk;
    if (appealData.isUserInTheUk === 'No') {
      await this.cui_outOfCountryPage.verifyUserIsOnOutOfCountryPage();
      dateLeftUk = await this.dataUtils.getDateFromToday({ yearOffset: -2 });

      await this.cui_outOfCountryPage.completePageAndContinue({
        day: dateLeftUk.day,
        month: dateLeftUk.month,
        year: dateLeftUk.year,
      });
    }

    await this.cui_aboutAppealPage.verifyUserIsOnAboutAppealPage();
    await this.cui_aboutAppealPage.navigationClick(this.cui_aboutAppealPage.$interactive.homeOfficeAndPersonalDetailsLink);

    await this.cui_homeOfficeReferenceNumberPage.verifyUserIsOnHomeOfficeReferenceNumberPage();
    const homeOfficeReference = await this.dataUtils.generateRandomNumber({ digitLength: 9 });

    await this.cui_homeOfficeReferenceNumberPage.completePageAndContinue({
      homeOfficeReference,
    });

    const ApplicantName = await this.dataUtils.generateRandomFirstAndLastNames({
      countOfFirstNamesToGenerate: 1,
      countOfLastNamesToGenerate: 1,
    });

    await this.cui_applicantNamePage.verifyUserIsOnApplicantNamePage();
    await this.cui_applicantNamePage.completePageAndContinue({
      givenNames: ApplicantName.firstNames,
      familyName: ApplicantName.lastNames[0],
    });

    await this.cui_applicantDobPage.verifyUserIsOnApplicantDobPage();
    const applicantDob = await this.dataUtils.getDateFromToday({ yearOffset: -35 });
    await this.cui_applicantDobPage.completePageAndContinue({
      day: applicantDob.day,
      month: applicantDob.month,
      year: applicantDob.year,
    });

    await this.cui_applicantNationalityPage.verifyUserIsOnApplicantNationalityPage();

    if (appealData.isApplicantStateless) {
      await this.cui_applicantNationalityPage.completePageAndContinue({
        stateless: appealData.isApplicantStateless,
      });
    } else {
      if (!appealData.nationality) {
        throw new Error('Nationality is required when applicant is not stateless');
      }
      await this.cui_applicantNationalityPage.completePageAndContinue({
        stateless: appealData.isApplicantStateless,
        nationality: appealData.nationality,
      });
    }

    const decisionLetterDate = await this.dataUtils.getDateFromToday({
      dayOffset: -13,
    });

    switch (appealData.isUserInTheUk) {
      case 'Yes':
        await this.cui_decisionLetterSentPage.verifyUserIsOnDecisionLetterSentPage();
        await this.cui_decisionLetterSentPage.completePageAndContinue({
          day: decisionLetterDate.day,
          month: decisionLetterDate.month,
          year: decisionLetterDate.year,
        });
        break;

      case 'No':
        await this.cui_decisionLetterReceivedPage.verifyUserIsOnDecisionLetterReceivedPage();
        await this.cui_decisionLetterReceivedPage.completePageAndContinue({
          day: decisionLetterDate.day,
          month: decisionLetterDate.month,
          year: decisionLetterDate.year,
        });
        break;

      default:
        throw new Error(`Invalid isUserInTheUk value: ${appealData.isUserInTheUk}`);
    }

    await this.cui_uploadDecisionLetterPage.verifyUserIsOnUploadDecisionLetterPage();
    await this.cui_uploadDecisionLetterPage.completePageAndContinue({});

    await this.cui_deportationOrderPage.verifyUserIsOnDeportationOrderPage();
    await this.cui_deportationOrderPage.completePageAndContinue({
      deportationOrderReceived: appealData.hasApplicantReceivedADeportationOrder,
    });

    await this.cui_aboutAppealPage.verifyUserIsOnAboutAppealPage();
    await this.cui_aboutAppealPage.navigationClick(this.cui_aboutAppealPage.$interactive.yourContactDetailsLink);

    await this.cui_contactPreferencesPage.verifyUserIsOnContactPreferencesPage();
    const applicantContactDetails = await this.dataUtils.generateContactDetails('Email and Phone');

    await this.cui_contactPreferencesPage.completePageAndContinue({
      contactPreference: 'Email and Phone',
      applicantEmail: applicantContactDetails.email,
      applicantPhoneNumber: applicantContactDetails.phone,
    });

    let applicantAddress: string;
    switch (appealData.isUserInTheUk) {
      case 'Yes':
        await this.cui_applicantAddressPage.verifyUserIsOnAddressPage();
        await this.cui_applicantAddressPage.completePageAndContinue({
          addressPreference: 'Post Code Search',
          postCode: 'NW5 3QB',
        });

        await this.cui_selectAddressPage.verifyUserIsOnSelectAddressPage();
        const addressSelected = await this.cui_selectAddressPage.completePageAndContinue({
          preference: 'Select Address At Random',
        });

        applicantAddress = addressSelected;

        await this.cui_manualAddressPage.verifyUserIsOnManualAddressPage();
        await this.cui_manualAddressPage.completePageAndContinue({
          preference: 'Address selected via postcode search',
          postCode: 'NW5 3QB',
        });
        break;

      case 'No':
        const address = '123 International St, Global City, Countryland, GL1 2AB';

        await this.cui_outOfCountryAddressPage.verifyUserIsOnOutOfCountryAddressPage();
        await this.cui_outOfCountryAddressPage.completePageAndContinue({
          applicantAddress: address,
        });

        applicantAddress = address;
        break;

      default:
        throw new Error(`Invalid isUserInTheUk value: ${appealData.isUserInTheUk}`);
    }

    await this.cui_hasSponsorPage.verifyUserIsOnHasSponsorPage();
    await this.cui_hasSponsorPage.completePageAndContinue({
      doesApplicantHaveASponsor: appealData.doesApplicantHaveASponsor,
    });

    const sponsorName = await this.dataUtils.generateRandomFirstAndLastNames({
      countOfFirstNamesToGenerate: 1,
      countOfLastNamesToGenerate: 1,
    });

    const sponsorAddress = '123 Fake Street, Faketown, FK1 2AB';
    const sponsorContactDetails = await this.dataUtils.generateContactDetails('Email and Phone');

    if (appealData.doesApplicantHaveASponsor === 'Yes') {
      await this.cui_sponsorNamePage.verifyUserIsOnSponsorNamePage();
      await this.cui_sponsorNamePage.completePageAndContinue({
        givenNames: sponsorName.firstNames,
        familyName: sponsorName.lastNames[0],
      });

      await this.cui_sponsorAddressPage.verifyUserIsOnSponsorAddressPage();
      const address = sponsorAddress.split(', ');
      await this.cui_sponsorAddressPage.completePageAndContinue({
        addressLine1: address[0],
        townOrCity: address[1],
        postCode: address[2],
      });

      await this.cui_sponsorContactPreferencesPage.verifyUserIsOnSponsorContactPreferencesPage();
      await this.cui_sponsorContactPreferencesPage.completePageAndContinue({
        contactPreference: 'Email and Phone',
        sponsorEmail: sponsorContactDetails.email,
        sponsorPhoneNumber: sponsorContactDetails.phone,
      });

      await this.cui_sponsorAuthorisationPage.verifyUserIsOnSponsorAuthorisationPage();
      await this.cui_sponsorAuthorisationPage.completePageAndContinue({
        allowSponsorToSeeAppealInformation: 'Yes',
      });
    }

    await this.cui_aboutAppealPage.verifyUserIsOnAboutAppealPage();

    return {
      homeOfficeReference,
      applicantDetails: {
        givenNames: ApplicantName.firstNames,
        familyName: ApplicantName.lastNames[0],
        dob: `${applicantDob.day}/${applicantDob.month}/${applicantDob.year}`,
        dateLeftUk: appealData.isUserInTheUk === 'No' && dateLeftUk ? `${dateLeftUk.day}/${dateLeftUk.month}/${dateLeftUk.year}` : undefined,
        decisionLetterDate: `${decisionLetterDate.day}/${decisionLetterDate.month}/${decisionLetterDate.year}`,
        address: applicantAddress,
        email: applicantContactDetails.email,
        phoneNumber: applicantContactDetails.phone,
      },
      sponsorDetails:
        appealData.doesApplicantHaveASponsor === 'Yes'
          ? {
              givenNames: sponsorName.firstNames,
              familyName: sponsorName.lastNames[0],
              address: sponsorAddress,
              email: sponsorContactDetails.email,
              phoneNumber: sponsorContactDetails.phone,
            }
          : undefined,
    };
  }
}
