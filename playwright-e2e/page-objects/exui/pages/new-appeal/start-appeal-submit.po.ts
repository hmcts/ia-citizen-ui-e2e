import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';
import { ExuiAppealGroundsHumanRightsRefusalType } from '../../../../exui-event-types';
import { Nationality } from '../../../../citizen-types';

type StartAppealComplexQuestionsType = 'Nationality' | 'The grounds of your appeal' | 'Notice of Decision' | 'Address';
type StartAppealSubmitQuestionsType =
  | 'Is the appellant currently living in the United Kingdom?'
  | 'Is the appellant currently in detention?'
  | 'Detention facility'
  | 'Immigration removal centre name'
  | 'Does the appellant have a pending bail application?'
  | "What is the appellant's bail application number?"
  | 'Home Office UAN or GWF reference'
  | 'Title'
  | 'Given names'
  | 'Family name'
  | 'Date of birth'
  | 'Type of appeal'
  | 'Home Office decision date'
  | 'Does the appellant have a sponsor?'
  | 'Contact details'
  | 'Mobile phone number'
  | 'Does the appellant give authorisation for the sponsor to access information relating to the appeal?'
  | 'Has a deportation order been made against the appellant?'
  | 'Are removal directions currently set for the appellant?'
  | 'Are there any reasons the appellant wishes to remain in the UK or any new grounds on which they should be permitted to stay?'
  | 'Explain these new matters and their relevance to the appeal'
  | 'Has the appellant appealed against any other UK immigration decision?'
  | 'Company'
  | 'Contact number'
  | 'Own reference'
  | 'How do you want the appeal to be decided?'
  | 'Choose one of the following statements';

export class StartAppealSubmitPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public $questionLocator = (question: StartAppealSubmitQuestionsType | StartAppealComplexQuestionsType): Locator =>
    this.page.locator('tr').getByText(question, { exact: true });

  public $questionValueLocator(question: StartAppealSubmitQuestionsType): Locator {
    return this.page
      .locator('tr', { has: this.page.getByText(question, { exact: true }) })
      .locator('td ccd-field-read span, td ccd-field-read button')
      .last();
  }

  public $changeAnswerToQuestionLocator(question: StartAppealSubmitQuestionsType | StartAppealComplexQuestionsType): Locator {
    return this.page
      .locator('tr', { has: this.page.getByText(question, { exact: true }) })
      .locator('td[class*="change case-field"] span', { hasText: 'Change' })
      .last();
  }

  public async verifyAnswerToNationalityQuestion(options: { nationality: Nationality }): Promise<void> {
    const tableRowLocator = this.page.locator('tr', { has: this.page.getByText('Nationality', { exact: true }) });
    const nationalityValueHeadingLocator = tableRowLocator.locator('[class="complex-panel-title"] span');
    const nationalityTextLocator = tableRowLocator.locator('[id="complex-panel-simple-field-label"] span');
    const nationalityValueLocator = tableRowLocator.locator('ccd-field-read-label span').last();

    await Promise.all([
      expect(nationalityValueHeadingLocator).toBeVisible(),
      expect(nationalityValueHeadingLocator).toHaveText('Nationality 1'),
      expect(nationalityTextLocator).toBeVisible(),
      expect(nationalityTextLocator).toHaveText('Nationality'),
      expect(nationalityValueLocator).toBeVisible(),
      expect(nationalityValueLocator).toHaveText(options.nationality),
    ]);
  }

  public async verifyAnswerToTheGroundOfAppealQuestion(options: { groundOfAppeal: ExuiAppealGroundsHumanRightsRefusalType }): Promise<void> {
    const tableRowLocator = this.page.locator('tr', { has: this.page.getByText('The grounds of your appeal', { exact: true }) }).first();
    const groundOfAppealValueHeadingLocator = tableRowLocator.locator('[class="complex-panel-title"] span');
    const groundOfAppealValueLocator = tableRowLocator.locator('ccd-field-read-label span').last();

    await Promise.all([
      expect(groundOfAppealValueHeadingLocator).toBeVisible(),
      expect(groundOfAppealValueHeadingLocator).toHaveText('The grounds of your appeal'),
      expect(groundOfAppealValueLocator).toBeVisible(),
      expect(groundOfAppealValueLocator).toHaveText(options.groundOfAppeal),
    ]);
  }

  public async verifyAnswerToNoticeOfDecisionQuestion(options: {
    documentInformation: { nameOfDocument: string; descriptionOfDocument?: string }[];
  }): Promise<void> {
    const tableRowLocator = this.page.locator('tr', { has: this.page.getByText('Notice of Decision', { exact: true }) });

    for (const [index, document] of options.documentInformation.entries()) {
      const noticeOfDecisionValueHeadingLocator = tableRowLocator.locator('[class="complex-panel-title"] span').nth(index);
      const noticeOfDecisionDocumentTextLocator = tableRowLocator
        .locator('[id="complex-panel-simple-field-label"] span', { hasText: 'Document' })
        .nth(index);
      const noticeOfDecisionDescribeDocumentTextLocator = tableRowLocator
        .locator('[id="complex-panel-simple-field-label"] span', { hasText: 'Describe the document' })
        .nth(index);
      const noticeOfDecisionDocumentValueLocator = tableRowLocator
        .locator('tr[class="complex-panel-simple-field"]', { hasText: 'Document' })
        .nth(index)
        .locator('td ccd-read-document-field button');
      const noticeOfDecisionDescribeDocumentValueLocator = tableRowLocator
        .locator('tr[class="complex-panel-simple-field"]', { hasText: 'Describe the document' })
        .nth(index)
        .locator('td ccd-read-text-area-field span');

      await Promise.all([
        expect(noticeOfDecisionValueHeadingLocator).toBeVisible(),
        expect(noticeOfDecisionValueHeadingLocator).toHaveText(`Notice of Decision ${index + 1}`),
        expect(noticeOfDecisionDocumentTextLocator).toBeVisible(),
        expect(noticeOfDecisionDocumentTextLocator).toHaveText('Document'),
        expect(noticeOfDecisionDocumentValueLocator).toBeVisible(),
        expect(noticeOfDecisionDocumentValueLocator).toHaveText(document.nameOfDocument),
        expect(noticeOfDecisionDescribeDocumentTextLocator).toBeVisible(),
        expect(noticeOfDecisionDescribeDocumentTextLocator).toHaveText('Describe the document'),
        expect(noticeOfDecisionDescribeDocumentValueLocator).toBeVisible(),
        expect(noticeOfDecisionDescribeDocumentValueLocator).toHaveText(document.descriptionOfDocument || ''),
      ]);
    }
  }

  public async verifyAnswerToAddressQuestion(options: {
    buildingAndStreet: string;
    townOrCity: string;
    postCode: string;
    country: string;
  }): Promise<void> {
    const tableRowLocator = this.page.locator('tr', { has: this.page.getByText('Address', { exact: true }) });
    const addressValueHeadingLocator = tableRowLocator.locator('[class="complex-panel-title"] span');
    const buildingAndStreetTextLocator = tableRowLocator.locator('[id="complex-panel-simple-field-label"] span', { hasText: 'Building' });
    const townOrCityTextLocator = tableRowLocator.locator('[id="complex-panel-simple-field-label"] span', { hasText: 'Town' });
    const postCodeTextLocator = tableRowLocator.locator('[id="complex-panel-simple-field-label"] span', { hasText: 'Postcode' });
    const countryTextLocator = tableRowLocator.locator('[id="complex-panel-simple-field-label"] span', { hasText: 'Country' });

    const buildingAndStreetValueLocator = tableRowLocator
      .locator('tr[class="complex-panel-simple-field"]', { hasText: 'Building' })
      .locator('ccd-read-text-field span');
    const townOrCityValueLocator = tableRowLocator
      .locator('tr[class="complex-panel-simple-field"]', { hasText: 'Town' })
      .locator('td ccd-read-text-field span');
    const postCodeValueLocator = tableRowLocator
      .locator('tr[class="complex-panel-simple-field"]', { hasText: 'Postcode' })
      .locator('td ccd-read-text-field span');
    const countryValueLocator = tableRowLocator
      .locator('tr[class="complex-panel-simple-field"]', { hasText: 'Country' })
      .locator('td ccd-read-text-field span');

    await Promise.all([
      expect(addressValueHeadingLocator).toBeVisible(),
      expect(addressValueHeadingLocator).toHaveText('Address'),
      expect(buildingAndStreetTextLocator).toBeVisible(),
      expect(buildingAndStreetTextLocator).toHaveText('Building and Street'),
      expect(buildingAndStreetValueLocator).toBeVisible(),
      expect(buildingAndStreetValueLocator).toHaveText(options.buildingAndStreet),
      expect(townOrCityTextLocator).toBeVisible(),
      expect(townOrCityTextLocator).toHaveText('Town or City'),
      expect(townOrCityValueLocator).toBeVisible(),
      expect(townOrCityValueLocator).toHaveText(options.townOrCity),
      expect(postCodeTextLocator).toBeVisible(),
      expect(postCodeTextLocator).toHaveText('Postcode/Zipcode'),
      expect(postCodeValueLocator).toBeVisible(),
      expect(postCodeValueLocator).toHaveText(options.postCode),
      expect(countryTextLocator).toBeVisible(),
      expect(countryTextLocator).toHaveText('Country'),
      expect(countryValueLocator).toBeVisible(),
      expect(countryValueLocator).toHaveText(options.country),
    ]);
  }

  public readonly $interactive = {
    saveAndContinueButton: this.page.getByRole('button', { name: 'Save and continue', exact: true }),
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Start the appeal', exact: true }),
    checkYouAnswersHeading: this.page.getByRole('heading', { level: 2, name: 'Check your answers', exact: true }),
    checkInformationCarefullyText: this.page.getByText('Check the information below carefully.', { exact: true }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/submit',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async saveAndContinue(): Promise<void> {
    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
