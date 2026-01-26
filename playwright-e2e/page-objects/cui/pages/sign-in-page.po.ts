import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../cui-base';

export class SignInPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    emailInput: this.page.locator('input[id="username"]'),
    passwordInput: this.page.locator('input[id="password"]'),
    signInButton: this.page.locator('input[class="button"][value="Sign in"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.locator('h1[class="heading-large"]', {
      hasText: 'Sign in or create an account',
    }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnSignInPage(): Promise<void> {
    await expect(this.$static.pageHeading).toBeVisible({ timeout: 15_000 });
  }

  public async signIn(email: string, password: string): Promise<void> {
    await this.$interactive.emailInput.fill(email);
    await this.$interactive.passwordInput.fill(password);

    this.navigationClick(this.$interactive.signInButton);
  }
}
