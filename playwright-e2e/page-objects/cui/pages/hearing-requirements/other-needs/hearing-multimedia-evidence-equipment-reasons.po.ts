import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';

export class HearingMultimediaEvidenceEquipmentReasonsPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    reasonUnableToBringEquipmentTextarea: this.page.locator('textarea[name="reason"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    saveAndContinueButton: this.page.getByRole('button', { name: 'Save and continue', exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', {
      name: 'Tell us why it is not possible to bring the equipment to play this evidence and what you will need to play it',
      level: 1,
      exact: true,
    }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'hearing-multimedia-evidence-equipment-reasons', pageHeading: this.$static.pageHeading });
  }

  public async completePageAndContinue(option: { reasonUnableToBringEquipment: string }): Promise<void> {
    await this.$inputs.reasonUnableToBringEquipmentTextarea.fill(option.reasonUnableToBringEquipment);
    await expect(this.$inputs.reasonUnableToBringEquipmentTextarea).toHaveValue(option.reasonUnableToBringEquipment);

    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
