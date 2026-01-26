import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';

export class SelectAddressPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly pageForm = this.page.locator('body:has(form[action="/select-address"])');

  public readonly $interactive = {
    selectAddressDropdown: this.pageForm.locator('select[id="address"]'),
    saveAndContinueButton: this.pageForm.locator('button', {
      hasText: 'Save and continue',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.pageForm.locator('h1', {
      hasText: 'What is your address?',
    }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnSelectAddressPage(): Promise<void> {
    await Promise.all([
      expect(async () => {
        expect(this.page.url().includes('select-address')).toBeTruthy();
      }).toPass({ intervals: [100], timeout: 15_000 }),

      expect(this.$static.pageHeading).toBeVisible({ timeout: 15_000 }),
    ]);
  }

  public async completePageAndContinue(options: {
    preference: 'Select Address At Random' | 'Select Specific Address';
    houseNumber?: number;
    street?: string;
  }): Promise<string> {
    switch (options.preference) {
      case 'Select Address At Random':
        const addressOptions = await this.$interactive.selectAddressDropdown.locator('option').all();
        const randomIndex = Math.floor(Math.random() * (addressOptions.length - 1)) + 1;
        const randomAddress = await addressOptions[randomIndex].textContent();
        if (!randomAddress) {
          throw new Error('No address options available to select at random');
        }
        const randomAddressValue = await addressOptions[randomIndex].getAttribute('value');
        await this.$interactive.selectAddressDropdown.selectOption({ index: randomIndex });
        await expect(this.$interactive.selectAddressDropdown).toHaveValue(randomAddressValue!);
        await this.navigationClick(this.$interactive.saveAndContinueButton);
        return randomAddress;
      case 'Select Specific Address':
        if (!options.houseNumber || !options.street) {
          throw new Error('House number and street must be provided for Select Specific Address option');
        }
        const specificAddress = `${options.houseNumber}, ${options.street.toUpperCase()}`;
        const optionToSelect = this.$interactive.selectAddressDropdown.locator('option').filter({ hasText: specificAddress }).first();
        const fullAddress = await optionToSelect.textContent();
        if (!fullAddress) {
          throw new Error(`Address "${specificAddress}" not found in the dropdown options`);
        }
        const fullAddressValue = await optionToSelect.getAttribute('value');
        await this.$interactive.selectAddressDropdown.selectOption({ label: fullAddress });
        await expect(this.$interactive.selectAddressDropdown).toHaveValue(fullAddressValue!);
        await this.navigationClick(this.$interactive.saveAndContinueButton);
        return fullAddress;

      default:
        throw new Error(`Unknown address preference: ${options.preference}`);
    }
  }
}
