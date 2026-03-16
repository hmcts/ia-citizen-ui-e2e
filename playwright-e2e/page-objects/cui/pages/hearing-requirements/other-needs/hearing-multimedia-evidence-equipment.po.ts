import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';
import { YesOrNoType } from '../../../../../citizen-types';

export class HearingMultimediaEvidenceEquipmentPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly pageForm = this.page.locator('body:has(form[action="/hearing-multimedia-evidence-equipment"])');

  public readonly $interactive = {
    saveAndContinueButton: this.pageForm.getByRole('button', { name: 'Save and continue', exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.pageForm.getByRole('heading', { name: 'Will you bring the equipment to play this evidence?', level: 1, exact: true }),
    evidenceEquipmentHintText: this.pageForm.locator('div[id="answer-hint"]'),
    yesLabel: this.pageForm.locator('input[type="radio"][value="yes"] + label'),
    noLabel: this.pageForm.locator('input[type="radio"][value="no"] + label'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'hearing-multimedia-evidence-equipment', pageHeading: this.$static.pageHeading });
  }

  private async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.evidenceEquipmentHintText).toHaveText('For example, a laptop computer or DVD player'),
      expect(this.$static.evidenceEquipmentHintText).toBeVisible(),

      expect(this.$static.yesLabel).toHaveText('Yes'),
      expect(this.$static.yesLabel).toBeVisible(),

      expect(this.$static.noLabel).toHaveText('No'),
      expect(this.$static.noLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(option: { willYouBringEquipmentToPlayEvidence: YesOrNoType; verifyAllTextOnPage?: boolean }): Promise<void> {
    if (option.verifyAllTextOnPage) {
      await this.verifyAllTextOnPage();
    }

    const element = this.pageForm.locator(`input[type="radio"][value="${option.willYouBringEquipmentToPlayEvidence.toLowerCase()}"]`);
    await element.check();
    await expect(element).toBeChecked();

    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
