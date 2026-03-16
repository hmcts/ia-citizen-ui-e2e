import { Page, Locator } from '@playwright/test';
import { CuiBase } from '../../../cui-base';

export class HearingCheckAnswersPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly pageForm = this.page.locator('body:has(form[action*="/hearing-check-answers"])');

  private readonly listOfQuestions = {
    willAnyWitnessesComeToHearing: 'Will any witnesses come to the hearing?',
    witnessesNames: 'Witnesses names',
    willYouOrWitnessAttendOutsideUk: 'Will you or any witnesses take part in the hearing from outside the UK?',
    willYouNeedanInterpreter: 'Will you need an interpreter at the hearing?',
    whoAreYouRequestingInterpreterSupportFor: 'Who are you requesting support for?',
    whatKindOfInterpreterWillApplicantNeed: 'What kind of interpreter do you need to request?',
    applicantSpokenLanguageRequirement: 'Tell us about your language requirements',
    applicantSignLanguageRequirement: 'Tell us about your sign language requirements',
    whatKindOfInterpreterWillWitnessNeed: /What kind of interpreter will .+ need\?/,
    witnessSpokenLanguageRequirement: /Which spoken language interpreter does .+ need\?/,
    witnessSignLanguageRequirement: /Which sign language interpreter does .+ need\?/,
    willYouOrWitnessNeedStepFreeAccess: 'Will you or any witnesses need step-free access?',
    willYouOrWitnessRequireHearingLoop: 'Will you or any witnesses need a hearing loop?',
    willYouBringVideoOrAudioEvidence: 'Will you bring any video or audio evidence to the hearing?',
    willYouBringEquipmentToPlayEvidence: 'Will you bring the equipment to play this evidence?',
    whyUnableToBringEquipmentToPlayEvidence:
      'Tell us why it is not possible to bring the equipment to play this evidence and what you will need to play it',
    willYouNeedAllFemaleOrMaleHearing: 'Will you need an all-female or all-male hearing?',
    whatTypeOfHearingDoYouNeed: 'What type of hearing will you need?',
    whyYouNeedAllMaleHearing: 'Tell us why you need an all-male hearing',
    willYouNeedAPrivateHearing: 'Will you need a private hearing?',
    whyYouNeedAPrivateHearing: 'Tell us why you need a private hearing',
    doYouHaveAnyPhysicalOrMentalHealthConditions: 'Do you have any physical or mental health conditions that may affect you at the hearing?',
    howManyPhysicalOrMentalHealthConditionsDoYouHave: 'Tell us how any physical or mental health conditions you have may affect you at the hearing',
    haveYouHadAnyPastExperiences: 'Have you had any past experiences that may affect you at the hearing?',
    tellUsAboutYourPastExperiences: 'Tell us how any past experiences may affect you at the hearing',
    willYouNeedAnythingElseAtHearing: 'Will you need anything else at the hearing?',
    tellUsWhatAndWhyYouNeedIt: 'Tell us what you will need and why you need it',
    areThereAnyDatesYouCannotAttend: 'Are there any dates you cannot go to the appointment?',
  } as const satisfies Record<string, string | RegExp>;

  public readonly $interactive = {
    sendButton: this.pageForm.getByRole('button', { name: 'Send', exact: true }),
    changeAnswerForWillAnyWitnessesComeToHearingLink: this.pageForm.locator('a[href="/hearing-witnesses?edit"]', { hasText: 'Change' }),
    changeWitnessesNamesLink: this.pageForm.locator('a[href="/hearing-witness-names"]', { hasText: 'Change' }),
    changeWillYouOrWitnessAttendOutsideUklink: this.pageForm.locator('a[href="/hearing-outside-uk?edit"]', { hasText: 'Change' }),
    changeWillYouNeedanInterpreterLink: this.pageForm.locator('a[href="/hearing-interpreter?edit"]', { hasText: 'Change' }),
    changeWhoAreYouRequestingInterpreterSupportForLink: this.pageForm.locator('a[href="/hearing-interpreter-support-appellant-Witnesses"]', {
      hasText: 'Change',
    }),
    changeWhatKindOfInterpreterWillApplicantNeedLink: this.pageForm.locator('a[href="/hearing-interpreter-types"]', { hasText: 'Change' }),
    changeApplicantSpokenLanguageRequirementLink: this.pageForm.locator('a[href="/hearing-interpreter-spoken-language-selection"]', {
      hasText: 'Change',
    }),
    changeApplicantSignLanguageRequirementLink: this.pageForm.locator('a[href="/hearing-interpreter-sign-language-selection"]', {
      hasText: 'Change',
    }),
    changeWhatKindOfInterpreterWillWitnessNeedLink: this.pageForm.locator('a[href*="/hearing-interpreter-types?selectedWitnesses="]', {
      hasText: 'Change',
    }),
    changeWitnessSpokenLanguageRequirementLink: this.pageForm.locator(
      'a[href*="/hearing-interpreter-spoken-language-selection?selectedWitnesses="]',
      { hasText: 'Change' },
    ),
    changeWitnessSignLanguageRequirementLink: this.pageForm.locator('a[href*="/hearing-interpreter-sign-language-selection?selectedWitnesses="]', {
      hasText: 'Change',
    }),
    changeWillYouOrWitnessNeedStepFreeAccessLink: this.pageForm.locator('a[href="/hearing-step-free-access?edit"]', { hasText: 'Change' }),
    changeWillYouOrWitnessRequireHearingLoopLink: this.pageForm.locator('a[href="/hearing-hearing-loop?edit"]', { hasText: 'Change' }),
    changeWillYouBringVideoOrAudioEvidenceLink: this.pageForm.locator('a[href="/hearing-multimedia-evidence?edit"]', { hasText: 'Change' }),
    changeWillYouBringEquipmentToPlayEvidenceLink: this.pageForm.locator('a[href="/hearing-multimedia-evidence-equipment?edit"]', {
      hasText: 'Change',
    }),
    changeWhyUnableToBringEquipmentToPlayEvidenceLink: this.pageForm.locator('a[href="/hearing-multimedia-evidence-equipment-reasons?edit"]', {
      hasText: 'Change',
    }),
    changeWillYouNeedAllFemaleOrMaleHearingLink: this.pageForm.locator('a[href="/hearing-single-sex?edit"]', { hasText: 'Change' }),
    changeWhatTypeOfHearingDoYouNeedLink: this.pageForm.locator('a[href="/hearing-single-sex-type?edit"]', { hasText: 'Change' }),
    changeWhyYouNeedAllMaleHearingLink: this.pageForm.locator('a[href="/hearing-single-sex-type-male?edit"]', { hasText: 'Change' }),
    changeWillYouNeedAPrivateHearingLink: this.pageForm.locator('a[href="/hearing-private?edit"]', { hasText: 'Change' }),
    changeWhyYouNeedAPrivateHearingLink: this.pageForm.locator('a[href="/hearing-private-reason?edit"]', { hasText: 'Change' }),
    changeDoYouHaveAnyPhysicalOrMentalHealthConditionsLink: this.pageForm.locator('a[href="/hearing-physical-mental-health?edit"]', {
      hasText: 'Change',
    }),
    changeHowManyPhysicalOrMentalHealthConditionsDoYouHaveLink: this.pageForm.locator('a[href="/hearing-physical-mental-health-reasons?edit"]', {
      hasText: 'Change',
    }),
    changeHaveYouHadAnyPastExperiencesLink: this.pageForm.locator('a[href="/hearing-past-experiences?edit"]', { hasText: 'Change' }),
    changeTellUsAboutYourPastExperiencesLink: this.pageForm.locator('a[href="/hearing-past-experiences-reasons?edit"]', { hasText: 'Change' }),
    changeWillYouNeedAnythingElseAtHearingLink: this.pageForm.locator('a[href="/hearing-anything-else?edit"]', { hasText: 'Change' }),
    changeTellUsWhatAndWhyYouNeedItLink: this.pageForm.locator('a[href="/hearing-anything-else-reasons?edit"]', { hasText: 'Change' }),
    changeAreThereAnyDatesYouCannotAttendLink: this.pageForm.locator('a[href="/hearing-dates-avoid?edit"]', { hasText: 'Change' }),
    changeDateToAvoidLink: this.pageForm.locator('a[href*="/hearing-dates-avoid-enter/"]', { hasText: 'Change' }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.pageForm.getByRole('heading', { level: 1, name: 'Check your answers', exact: true }),
    questionLabel: this.pageForm.locator('dt', { hasText: 'Question' }),
    answerLabel: this.pageForm.locator('dt', { hasText: 'Answer' }),
    witnessesHeadingLevel2: this.pageForm.getByRole('heading', { level: 2, name: '1. Witnesses', exact: true }),
    witnessesHeadingLevel3: this.pageForm.getByRole('heading', { level: 3, name: 'Witnesses', exact: true }),
    accessNeedsHeadingLevel2: this.pageForm.getByRole('heading', { level: 2, name: '2. Access needs', exact: true }),
    interpreterHeadingLevel3: this.pageForm.getByRole('heading', { level: 3, name: 'Interpreter', exact: true }),
    stepFreeAccessHeadingLevel3: this.pageForm.getByRole('heading', { level: 3, name: 'Step-free access', exact: true }),
    hearingLoopHeadingLevel3: this.pageForm.getByRole('heading', { level: 3, name: 'Hearing loop', exact: true }),
    otherNeedsLevel2Heading: this.pageForm.getByRole('heading', { level: 2, name: '3. Other needs', exact: true }),
    multiMediaEvidenceLevel3Heading: this.pageForm.getByRole('heading', { level: 3, name: 'Multimedia evidence', exact: true }),
    allFemaleOrMaleLevel3Heading: this.pageForm.getByRole('heading', { level: 3, name: 'All-female or all-male appointment', exact: true }),
    privateHearingLevel3Heading: this.pageForm.getByRole('heading', { level: 3, name: 'Private appointment', exact: true }),
    physicalOrMentalHealthLevel3Heading: this.pageForm.getByRole('heading', { level: 3, name: 'Physical or mental health conditions', exact: true }),
    pastExperiencesLevel3Heading: this.pageForm.getByRole('heading', { level: 3, name: 'Past experiences', exact: true }),
    anythingElseLevel3Heading: this.pageForm.getByRole('heading', { level: 3, name: 'Anything else', exact: true }),
    datesToAvoidLevel2Heading: this.pageForm.getByRole('heading', { level: 2, name: '4. Dates to avoid', exact: true }),
    datesToAvoidLabel: this.pageForm.locator('dt', { hasText: 'Dates to avoid' }),
    dateLabel: this.pageForm.locator('dd[class="govuk-summary-list__value"] b', { hasText: 'Date' }),
    dateValue: this.pageForm.locator('dd[class="govuk-summary-list__value"] b', { hasText: 'Date' }).locator('+ br + pre'),
    dateReasonLabel: this.pageForm.locator('dd[class="govuk-summary-list__value"] b', { hasText: 'Reason' }),
    dateReasonValue: this.pageForm.locator('dd[class="govuk-summary-list__value"] b', { hasText: 'Reason' }).locator('+ br + pre'),
  } as const satisfies Record<string, Locator>;

  public $questionLocator = (questionKey: keyof typeof this.listOfQuestions): Locator => {
    const question = this.listOfQuestions[questionKey];
    return this.pageForm.getByText(question, { exact: !(question instanceof RegExp) });
  };

  public $questionValueLocator(questionKey: keyof typeof this.listOfQuestions): Locator {
    const question = this.listOfQuestions[questionKey];
    return this.pageForm.locator('div', { hasText: question }).last().locator('+ div dd[class="govuk-summary-list__value"]');
  }

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'hearing-check-answers', pageHeading: this.$static.pageHeading });
  }

  public async submitAnswers(): Promise<void> {
    await this.navigationClick(this.$interactive.sendButton);
  }
}
