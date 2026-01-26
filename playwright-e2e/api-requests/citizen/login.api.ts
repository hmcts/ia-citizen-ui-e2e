import { APIRequestContext, expect } from '@playwright/test';

export class LoginApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async login(username: string, password: string): Promise<void> {
    await expect(async () => {
      const startLoginResponse = await this.apiContext.get('login');
      await expect(startLoginResponse).toBeOK();

      const idamHtml = await startLoginResponse.text();
      const idamUrl = startLoginResponse.url();

      const idamCsrf = idamHtml.match(/name="_csrf" value="([^"]+)"/)?.[1];
      if (!idamCsrf) {
        throw new Error('Could not extract CSRF token from IDAM login page');
      }

      const postCredentialsResponse = await this.apiContext.post(idamUrl, {
        form: {
          username: username,
          password: password,
          selfRegistrationEnabled: 'true',
          _csrf: idamCsrf,
        },
      });

      await expect(postCredentialsResponse).toBeOK();

      const cookies = await this.apiContext.storageState();
      const hasAuthToken = cookies.cookies.some((c) => c.name === '__auth-token');

      if (!hasAuthToken) {
        throw new Error('Login failed: __auth-token cookie not found after redirect chain');
      }
    }).toPass({
      timeout: 30_000,
      intervals: [1_000],
    });
  }
}
