import fs from 'fs';
import path from 'path';
import { test as setup, expect } from './fixtures';

const TOKEN_FILE = path.join(process.cwd(), '.sessions', 'create-user-token.json');

/**
 * Sets up test sessions for all required user roles and stores session data.
 *
 * This setup script can be reused for each user type individually.
 * Note: Manually signing out during tests will invalidate the stored session.
 * For EXUI users, sessions are currently valid for 8 hours.
 */
setup.describe('Set up users and retrieve tokens', () => {
  /**
   * Retrieves an IDAM bearer token at the beginning of the test run.
   *
   * This token is used to authorise user creation and is stored as an
   * environment variable (`CREATE_USER_BEARER_TOKEN`) for reuse across the test suite.
   */
  setup('Retrieve IDAM token for citizen user creation', async ({ idamUtils }) => {
    const token = await idamUtils.generateIdamToken({
      grantType: 'client_credentials',
      clientId: 'iac',
      clientSecret: process.env.IDAM_SECRET as string,
      scope: 'profile roles',
    });
    process.env.CREATE_USER_BEARER_TOKEN = token;
    fs.mkdirSync(path.dirname(TOKEN_FILE), { recursive: true });
    fs.writeFileSync(TOKEN_FILE, JSON.stringify({ token }));
  });
  /**
   * Signs in as a case officer and stores session data.
   * Skips login if a valid session already exists.
   */

  setup('Set up case officer user', async ({ page, config, idam_signInPage, SessionUtils, context }) => {
    const user = config.exuiUsers.caseOfficer;
    if (SessionUtils.isSessionValid(user.sessionFile, user.cookieName!)) return;
    try {
      await page.goto(config.urls.exuiDefaultUrl);
      await idam_signInPage.verifyUserIsOnPage();
      await idam_signInPage.signIn(user.username, user.password);
      await expect(page.locator('h3', { hasText: 'My work' })).toBeVisible({ timeout: 60_000 });
      await context.storageState({ path: user.sessionFile });
    } catch (error) {
      console.warn(`⚠️  Case officer session setup failed: ${error}. Tests requiring this session will fail.`);
    }
  });
  /**
   * Signs in as a admin officer and stores session data.
   * Skips login if a valid session already exists.
   */
  setup('Set up admin officer user', async ({ page, config, idam_signInPage, SessionUtils, context }) => {
    const user = config.exuiUsers.adminOfficer;
    if (SessionUtils.isSessionValid(user.sessionFile, user.cookieName!)) return;
    try {
      await page.goto(config.urls.exuiDefaultUrl);
      await idam_signInPage.verifyUserIsOnPage();
      await idam_signInPage.signIn(user.username, user.password);
      await expect(page.locator('h3', { hasText: 'My work' })).toBeVisible({ timeout: 60_000 });
      await context.storageState({ path: user.sessionFile });
    } catch (error) {
      console.warn(`⚠️  Admin officer session setup failed: ${error}. Tests requiring this session will fail.`);
    }
  });
  /**
   * Signs in as a home office user and stores session data.
   * Skips login if a valid session already exists.
   */
  setup('Set up home office user', async ({ page, config, idam_signInPage, SessionUtils, context }) => {
    const user = config.exuiUsers.homeOfficeUser;
    if (SessionUtils.isSessionValid(user.sessionFile, user.cookieName!)) return;
    try {
      await page.goto(config.urls.exuiDefaultUrl);
      await idam_signInPage.verifyUserIsOnPage();
      await idam_signInPage.signIn(user.username, user.password);
      await expect(page.locator('h1', { hasText: 'Case list' })).toBeVisible({ timeout: 60_000 });
      await context.storageState({ path: user.sessionFile });
    } catch (error) {
      console.warn(`⚠️  Home office user session setup failed: ${error}. Tests requiring this session will fail.`);
    }
  });

  /**
   * Signs in as a judge user and stores session data.
   * Skips login if a valid session already exists.
   */
  setup('Set up judge user', async ({ page, config, idam_signInPage, SessionUtils, context }) => {
    const user = config.exuiUsers.judgeUser;
    if (SessionUtils.isSessionValid(user.sessionFile, user.cookieName!)) return;
    try {
      await page.goto(config.urls.exuiDefaultUrl);
      await idam_signInPage.verifyUserIsOnPage();
      await idam_signInPage.signIn(user.username, user.password);
      await expect(page.locator('h3', { hasText: 'My work' })).toBeVisible({ timeout: 60_000 });
      await context.storageState({ path: user.sessionFile });
    } catch (error) {
      console.warn(`⚠️  Judge user session setup failed: ${error}. Tests requiring this session will fail.`);
    }
  });
});
