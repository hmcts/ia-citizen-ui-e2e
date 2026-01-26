import { test as setup } from './fixtures';

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
  //setup.beforeAll(
  setup('Retrieve IDAM token for citizen user creation', async ({ idamUtils }) => {
    const token = await idamUtils.generateIdamToken({
      grantType: 'client_credentials',
      clientId: 'iac',
      clientSecret: process.env.IDAM_SECRET as string,
      scope: 'profile roles',
    });
    process.env.CREATE_USER_BEARER_TOKEN = token;
  });
});
