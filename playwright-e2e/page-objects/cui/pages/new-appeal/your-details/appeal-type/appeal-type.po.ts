import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../../cui-base';
import { AppealType } from '../../../../../../citizen-types';

export class AppealTypePage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    saveAndContinueButton: this.page.locator('button', {
      hasText: 'Save and continue',
    }),
    reasonsToSelectProtectionAppealTypeLink: this.page.getByText('Reasons to select Protection', { exact: true }),
    reasonsToSelectHumanRightsAppealTypeLink: this.page.getByText('Reasons to select Human Rights', { exact: true }),
    reasonsToSelectEuropeanEconomicAreaAppealTypeLink: this.page.getByText('Reasons to select European Economic Area', { exact: true }),
    reasonsToSelectRevocationOfProtectionAppealTypeLink: this.page.getByText('Reasons to select Revocation of Protection Status', {
      exact: true,
    }),
    reasonsToSelectDeprivationOfCitizenshipAppealTypeLink: this.page.getByText('Reasons to select Deprivation of Citizenship', { exact: true }),
    reasonsToSelectEuSettlementSchemeAppealTypeLink: this.page.getByText('Reasons to select EU Settlement Scheme', { exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.locator('h1', {
      hasText: 'What is your appeal type?',
    }),
    appealTypeHintFirstParagraph: this.page.locator('div[id="appealType-hint"] p').nth(0),
    appealTypeHintSecondParagraph: this.page.locator('div[id="appealType-hint"] p').nth(1),
    protectionAppealTypeLabel: this.page.locator('label', { hasText: /^\s*Protection/i }),
    protectionAppealTypeSummary: this.page.locator('details', { hasText: 'Reasons to select Protection' }).locator('div.govuk-details__text'),
    humanRightsAppealTypeLabel: this.page.locator('label', { hasText: /^\s*Human Rights/i }),
    humanRightsAppealTypeSummary: this.page.locator('details', { hasText: 'Reasons to select Human Rights' }).locator('div.govuk-details__text'),
    europeanEconomicAreaAppealTypeLabel: this.page.locator('label', { hasText: /^\s*European Economic Area/i }),
    europeanEconomicAreaAppealTypeSummary: this.page
      .locator('details', { hasText: 'Reasons to select European Economic Area' })
      .locator('div.govuk-details__text'),
    revocationOfProtectionAppealTypeLabel: this.page.locator('label', { hasText: /^\s*Revocation of Protection/i }),
    revocationOfProtectionAppealTypeSummary: this.page
      .locator('details', { hasText: 'Reasons to select Revocation of Protection Status' })
      .locator('div.govuk-details__text'),
    deprivationOfCitizenshipAppealTypeLabel: this.page.locator('label', { hasText: /^\s*Deprivation of Citizenship/i }),
    deprivationOfCitizenshipAppealTypeSummary: this.page
      .locator('details', { hasText: 'Reasons to select Deprivation of Citizenship' })
      .locator('div.govuk-details__text'),
    eUSettlementSchemeAppealTypeLabel: this.page.locator('label', { hasText: /^\s*EU Settlement Scheme/i }),
    eUSettlementSchemeAppealTypeSummary: this.page
      .locator('details', { hasText: 'Reasons to select EU Settlement Scheme' })
      .locator('div.govuk-details__text'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'appeal-type', pageHeading: this.$static.pageHeading });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      // Verify appeal type hint text is correct and visible to the user
      expect(this.$static.appealTypeHintFirstParagraph).toHaveText(
        'Select one appeal type. If you are unsure, the first page of your decision letter should include the type of decision you are appealing.',
      ),
      expect(this.$static.appealTypeHintFirstParagraph).toBeVisible(),

      expect(this.$static.appealTypeHintSecondParagraph).toHaveText(
        'If you think more than one appeal type applies to your appeal, you will have the chance to tell us about that later.',
      ),
      expect(this.$static.appealTypeHintSecondParagraph).toBeVisible(),

      // Verify Protection appeal type label text is correct and visible to the user
      expect(this.$static.protectionAppealTypeLabel).toHaveText(
        'Protection (You will be persecuted or harmed in some way if you are returned to your home country)',
      ),
      expect(this.$static.protectionAppealTypeLabel).toBeVisible(),
      expect(this.$interactive.reasonsToSelectProtectionAppealTypeLink).toBeVisible(),
      expect(this.$static.protectionAppealTypeSummary).toHaveText(
        'You might be afraid of the government, police or other groups in your home country because of your nationality, race, religion, political opinion or other reason.',
      ),
      expect(this.$static.protectionAppealTypeSummary).toBeHidden(),

      // Verify Human Rights appeal type label text is correct and visible to the user
      expect(this.$static.humanRightsAppealTypeLabel).toHaveText(
        'Human Rights (You have a family and/or private life in the UK, or a serious medical condition)',
      ),
      expect(this.$static.humanRightsAppealTypeLabel).toBeVisible(),
      expect(this.$interactive.reasonsToSelectHumanRightsAppealTypeLink).toBeVisible(),
      expect(this.$static.humanRightsAppealTypeSummary).toHaveText(
        'You might have a partner or children living in the UK, have lived or worked in the UK for a long time or have serious medical needs.',
      ),
      expect(this.$static.humanRightsAppealTypeSummary).toBeHidden(),

      // Verify European Economic Area appeal type label text is correct and visible to the user
      expect(this.$static.europeanEconomicAreaAppealTypeLabel).toHaveText(
        'European Economic Area (EEA) (You are, or a family member is, an EEA/Swiss national)',
      ),
      expect(this.$static.europeanEconomicAreaAppealTypeLabel).toBeVisible(),
      expect(this.$interactive.reasonsToSelectEuropeanEconomicAreaAppealTypeLink).toBeVisible(),
      expect(this.$static.europeanEconomicAreaAppealTypeSummary).toHaveText(
        'You might be, or have been, a family member or carer of an EEA/Swiss national, or have lived in another EEA country with a British family member, and want to either come to or stay in the UK.',
      ),
      expect(this.$static.europeanEconomicAreaAppealTypeSummary).toBeHidden(),

      // Verify Revocation of Protection appeal type label text is correct and visible to the user
      expect(this.$static.revocationOfProtectionAppealTypeLabel).toHaveText(
        'Revocation of Protection Status (Your protection status was taken away)',
      ),
      expect(this.$static.revocationOfProtectionAppealTypeLabel).toBeVisible(),
      expect(this.$interactive.reasonsToSelectRevocationOfProtectionAppealTypeLink).toBeVisible(),
      expect(this.$static.revocationOfProtectionAppealTypeSummary).toHaveText(
        'Your protection status might have been taken away if it is believed you no longer need it, you didn’t tell the truth in your claim or you have committed a serious crime.',
      ),
      expect(this.$static.revocationOfProtectionAppealTypeSummary).toBeHidden(),

      // Verify Deprivation of Citizenship appeal type label text is correct and visible to the user
      expect(this.$static.deprivationOfCitizenshipAppealTypeLabel).toHaveText('Deprivation of Citizenship (Your British citizenship was taken away)'),
      expect(this.$static.deprivationOfCitizenshipAppealTypeLabel).toBeVisible(),
      expect(this.$interactive.reasonsToSelectDeprivationOfCitizenshipAppealTypeLink).toBeVisible(),
      expect(this.$static.deprivationOfCitizenshipAppealTypeSummary).toHaveText(
        `Your British citizenship might have been taken away because it is believed you didn't tell the truth when claiming citizenship or have been involved in behaviours such as terrorism or serious organised crime.`,
      ),
      expect(this.$static.deprivationOfCitizenshipAppealTypeSummary).toBeHidden(),

      // Verify EU Settlement Scheme appeal type label text is correct and visible to the user
      expect(this.$static.eUSettlementSchemeAppealTypeLabel).toHaveText(
        'EU Settlement Scheme (You have been refused an application under the EUSS, or a decision made under the EUSS has later been changed or cancelled)',
      ),
      expect(this.$static.eUSettlementSchemeAppealTypeLabel).toBeVisible(),
      expect(this.$interactive.reasonsToSelectEuSettlementSchemeAppealTypeLink).toBeVisible(),
      expect(this.$static.eUSettlementSchemeAppealTypeSummary).toHaveText(
        'You have applied for settled status, or a family or travel permit, so that you can either remain within or enter the UK, and it has been refused. A decision has been made to change or cancel your settled status, or your family or travel permit, including a deportation order that requires you to leave the UK.',
      ),
      expect(this.$static.eUSettlementSchemeAppealTypeSummary).toBeHidden(),
    ]);
  }

  public async completePageAndContinue(options: { appealType: AppealType }): Promise<void> {
    const optionToSelect = options.appealType;
    const element = this.page.getByRole('radio', { name: new RegExp(`^${optionToSelect}`, 'i') });

    await element.check();
    await expect(element).toBeChecked();
    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
