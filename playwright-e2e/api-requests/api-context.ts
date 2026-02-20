import { request, APIRequestContext } from '@playwright/test';
import { CuiLoginApi } from './citizen/login.api';
import { config } from '../utils/index';

export class ApiContext {
  /**
   *  Creates an authenticated API request context for citizen site.
   * @param options   Object containing userName and password for login.
   * @returns   A promise that resolves to an authenticated APIRequestContext.
   */
  public async createCitizenSiteApiContext(options: { userName: string; password: string }): Promise<APIRequestContext> {
    const context = await request.newContext({
      baseURL: config.urls.citizenUrl,
      timeout: 5_000,
    });

    const loginApi = new CuiLoginApi(context);
    await loginApi.login(options.userName, options.password);
    return context;
  }

  /**
   *  Creates an authenticated API request context for EXUI site.
   * @param options   Object containing userSessionFile for authentication.
   * @returns   A promise that resolves to an authenticated APIRequestContext.
   */
  public async createExuiApiContext(options: { userSessionFile: string }): Promise<APIRequestContext> {
    const context = await request.newContext({
      baseURL: config.urls.exuiDefaultUrl,
      storageState: options.userSessionFile,
      timeout: 5_000,
    });
    return context;
  }
}
