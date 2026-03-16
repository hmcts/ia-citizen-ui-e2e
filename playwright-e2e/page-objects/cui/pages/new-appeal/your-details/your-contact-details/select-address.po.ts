import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../../cui-base';

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
    changeAddressLink: this.pageForm.getByRole('link', { name: 'Change', exact: true }),
    cantFindMyAddressLink: this.pageForm.getByRole('link', { name: 'I cant find my address in the list', exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.pageForm.locator('h1', {
      hasText: 'What is your address?',
    }),
    postCodeText: this.pageForm.getByText('Postcode', { exact: true }),
    selectAddressLabel: this.pageForm.locator('label[for="address"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'select-address', pageHeading: this.$static.pageHeading });
  }

  private async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.postCodeText).toBeVisible(),

      expect(this.$interactive.changeAddressLink).toBeVisible(),

      expect(this.$static.selectAddressLabel).toHaveText('Select an address'),
      expect(this.$static.selectAddressLabel).toBeVisible(),

      expect(this.$interactive.cantFindMyAddressLink).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: {
    preference: 'Select Address At Random' | 'Select Specific Address';
    houseNumber?: number;
    street?: string;
    verifyAllTextOnPage?: boolean;
  }): Promise<string> {
    if (options.verifyAllTextOnPage) {
      await this.verifyAllTextOnPage();
    }

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
