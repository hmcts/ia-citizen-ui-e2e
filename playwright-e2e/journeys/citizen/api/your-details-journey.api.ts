import { APIRequestContext } from '@playwright/test';
import { YourDetailsJourney } from '../../../types';
import { ApplicantDetailsType } from '../ui';
import { DataUtils } from '../../../utils';
import {
  InTheUkApi,
  OutOfCountryApi,
  AppealTypeApi,
  HomeOfficeReferenceNumberApi,
  ApplicantNameApi,
  ApplicantDobApi,
  ApplicantNationalityApi,
  DecisionLetterSentApi,
  DecisionLetterReceivedApi,
  UploadDecisionLetterApi,
  DeportationOrderApi,
  ContactPreferencesApi,
  OutOfCountryAddressApi,
  ManualAddressApi,
  HasSponsorApi,
  SponsorNameApi,
  SponsorAddressApi,
  SponsorContactPreferencesApi,
  SponsorAuthorisationApi,
} from '../../../api-requests/citizen/index';

export class YourDetailsJourneyApi {
  private cui_inTheUkApi: InTheUkApi;
  private cui_outOfCountryApi: OutOfCountryApi;
  private cui_appealTypeApi: AppealTypeApi;
  private cui_homeOfficeReferenceNumberApi: HomeOfficeReferenceNumberApi;
  private cui_applicantNameApi: ApplicantNameApi;
  private cui_applicantDobApi: ApplicantDobApi;
  private cui_applicantNationalityApi: ApplicantNationalityApi;
  private cui_decisionLetterSentApi: DecisionLetterSentApi;
  private cui_decisionLetterReceivedApi: DecisionLetterReceivedApi;
  private cui_uploadDecisionLetterApi: UploadDecisionLetterApi;
  private cui_deportationOrderApi: DeportationOrderApi;
  private cui_contactPreferencesApi: ContactPreferencesApi;
  private cui_outOfCountryAddressApi: OutOfCountryAddressApi;
  private cui_manualAddressApi: ManualAddressApi;
  private cui_hasSponsorApi: HasSponsorApi;
  private cui_sponsorNameApi: SponsorNameApi;
  private cui_sponsorAddressApi: SponsorAddressApi;
  private cui_sponsorContactPreferencesApi: SponsorContactPreferencesApi;
  private cui_sponsorAuthorisationApi: SponsorAuthorisationApi;
  private dataUtils = new DataUtils();

  constructor(apiContext: APIRequestContext) {
    this.cui_inTheUkApi = new InTheUkApi(apiContext);
    this.cui_outOfCountryApi = new OutOfCountryApi(apiContext);
    this.cui_appealTypeApi = new AppealTypeApi(apiContext);
    this.cui_homeOfficeReferenceNumberApi = new HomeOfficeReferenceNumberApi(apiContext);
    this.cui_applicantNameApi = new ApplicantNameApi(apiContext);
    this.cui_applicantDobApi = new ApplicantDobApi(apiContext);
    this.cui_applicantNationalityApi = new ApplicantNationalityApi(apiContext);
    this.cui_decisionLetterSentApi = new DecisionLetterSentApi(apiContext);
    this.cui_decisionLetterReceivedApi = new DecisionLetterReceivedApi(apiContext);
    this.cui_uploadDecisionLetterApi = new UploadDecisionLetterApi(apiContext);
    this.cui_deportationOrderApi = new DeportationOrderApi(apiContext);
    this.cui_contactPreferencesApi = new ContactPreferencesApi(apiContext);
    this.cui_outOfCountryAddressApi = new OutOfCountryAddressApi(apiContext);
    this.cui_manualAddressApi = new ManualAddressApi(apiContext);
    this.cui_hasSponsorApi = new HasSponsorApi(apiContext);
    this.cui_sponsorNameApi = new SponsorNameApi(apiContext);
    this.cui_sponsorAddressApi = new SponsorAddressApi(apiContext);
    this.cui_sponsorContactPreferencesApi = new SponsorContactPreferencesApi(apiContext);
    this.cui_sponsorAuthorisationApi = new SponsorAuthorisationApi(apiContext);
  }

  public async submitYourDetailsJourneyViaApi(appealData: YourDetailsJourney): Promise<ApplicantDetailsType> {
    await this.cui_inTheUkApi.submitForm({ isUserInTheUk: appealData.isUserInTheUk });
    await this.cui_appealTypeApi.submitForm({ appealType: appealData.appealType });

    let dateLeftUk;
    if (appealData.isUserInTheUk === 'No') {
      dateLeftUk = await this.dataUtils.getDateFromToday({ yearOffset: -2 });
      await this.cui_outOfCountryApi.submitForm({ day: dateLeftUk.day, month: dateLeftUk.month, year: dateLeftUk.year });
    }

    const homeOfficeReference = await this.dataUtils.generateRandomNumber({ digitLength: 9 });
    await this.cui_homeOfficeReferenceNumberApi.submitForm({ homeOfficeReference: homeOfficeReference });

    const ApplicantName = await this.dataUtils.generateRandomFirstAndLastNames({
      countOfFirstNamesToGenerate: 1,
      countOfLastNamesToGenerate: 1,
    });
    await this.cui_applicantNameApi.submitForm({ givenNames: ApplicantName.firstNames, familyName: ApplicantName.lastNames[0] });

    const applicantDob = await this.dataUtils.getDateFromToday({ yearOffset: -35 });
    await this.cui_applicantDobApi.submitForm({ day: applicantDob.day, month: applicantDob.month, year: applicantDob.year });

    if (appealData.isApplicantStateless) {
      await this.cui_applicantNationalityApi.submitForm({ stateless: appealData.isApplicantStateless });
    } else {
      if (!appealData.nationality) {
        throw new Error('Nationality is required when applicant is not stateless');
      }
      await this.cui_applicantNationalityApi.submitForm({ stateless: false, nationality: appealData.nationality });
    }

    const decisionLetterDate = await this.dataUtils.getDateFromToday({
      dayOffset: -13,
    });

    switch (appealData.isUserInTheUk) {
      case 'Yes':
        await this.cui_decisionLetterSentApi.submitForm({
          day: decisionLetterDate.day,
          month: decisionLetterDate.month,
          year: decisionLetterDate.year,
        });
        break;

      case 'No':
        await this.cui_decisionLetterReceivedApi.submitForm({
          day: decisionLetterDate.day,
          month: decisionLetterDate.month,
          year: decisionLetterDate.year,
        });
        break;

      default:
        throw new Error(`Invalid isUserInTheUk value: ${appealData.isUserInTheUk}`);
    }

    await this.cui_uploadDecisionLetterApi.submitForm({});
    await this.cui_deportationOrderApi.submitForm({ deportationOrderReceived: appealData.hasApplicantReceivedADeportationOrder });

    const applicantContactDetails = await this.dataUtils.generateContactDetails('Email and Phone');
    await this.cui_contactPreferencesApi.submitForm({
      contactPreference: 'Email and Phone',
      applicantEmail: applicantContactDetails.email,
      applicantPhoneNumber: applicantContactDetails.phone,
    });

    const applicantAddress = '123 Example Street, Example Town, EX4 2PL';
    switch (appealData.isUserInTheUk) {
      case 'Yes':
        const manualAddress = applicantAddress.split(', ');
        await this.cui_manualAddressApi.submitForm({ addressLine1: manualAddress[0], townOrCity: manualAddress[1], postCode: manualAddress[2] });
        break;

      case 'No':
        await this.cui_outOfCountryAddressApi.submitForm({ applicantAddress: applicantAddress });
        break;

      default:
        throw new Error(`Invalid isUserInTheUk value: ${appealData.isUserInTheUk}`);
    }

    await this.cui_hasSponsorApi.submitForm({ doesApplicantHaveASponsor: appealData.doesApplicantHaveASponsor });

    const sponsorName = await this.dataUtils.generateRandomFirstAndLastNames({
      countOfFirstNamesToGenerate: 1,
      countOfLastNamesToGenerate: 1,
    });
    const sponsorAddress = '123 Fake Street, Faketown, FK1 2AB';
    const sponsorContactDetails = await this.dataUtils.generateContactDetails('Email and Phone');

    if (appealData.doesApplicantHaveASponsor === 'Yes') {
      await this.cui_sponsorNameApi.submitForm({ givenNames: sponsorName.firstNames, familyName: sponsorName.lastNames[0] });

      const address = sponsorAddress.split(', ');
      await this.cui_sponsorAddressApi.submitForm({ addressLine1: address[0], townOrCity: address[1], postCode: address[2] });

      await this.cui_sponsorContactPreferencesApi.submitForm({
        contactPreference: 'Email and Phone',
        sponsorEmail: sponsorContactDetails.email,
        sponsorPhoneNumber: sponsorContactDetails.phone,
      });

      await this.cui_sponsorAuthorisationApi.submitForm({ allowSponsorToSeeAppealInformation: 'Yes' });
    }

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
