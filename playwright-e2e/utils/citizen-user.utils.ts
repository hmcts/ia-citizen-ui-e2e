import { expect, APIRequestContext } from '@playwright/test';
import { IdamUtils } from '@hmcts/playwright-common';
import { v4 as uuidv4 } from 'uuid';
import { DataUtils } from './data.utils';
import fs from 'fs';
import mime from 'mime-types';

const dataUtils = new DataUtils();

export type UserInfo = {
  email: string;
  password: string;
  forename: string;
  surname: string;
  id?: string;
  sessionFile?: string;
};

export class CitizenUserUtils {
  constructor(private idamUtils: IdamUtils) {}

  public async createUser(): Promise<UserInfo> {
    const token = process.env.CREATE_USER_BEARER_TOKEN as string;
    const password = process.env.IDAM_CITIZEN_USER_PASSWORD as string;
    const uniqueId = uuidv4();

    const email = `TEST_IA_USER_citizen.${uniqueId}@test.local`;
    const forename = 'fn_' + uniqueId.split('-')[0];
    const surname = 'sn_' + uniqueId.split('-')[1];

    const user = await this.idamUtils.createUser({
      bearerToken: token,
      password,
      user: {
        email,
        forename,
        surname,
        roleNames: ['citizen'],
      },
    });

    return {
      id: user.id,
      email: user.email,
      password: user.password,
      forename,
      surname,
    };
  }
}

export async function getCsrfToken(options: { apiContext: APIRequestContext; path: string; params?: Record<string, string> }): Promise<string> {
  let csrfToken: string | undefined;

  await expect(async () => {
    const response = await options.apiContext.get(options.path, {
      params: options.params,
    });
    await expect(response, { message: `Verify response is okay from ${options.path}` }).toBeOK();

    const html = await response.text();

    csrfToken = html.match(/<input[^>]*name="_csrf"[^>]*value="([^"]+)"/i)?.[1] ?? html.match(/[?&]_csrf=([^"&\s]+)/)?.[1];

    expect(csrfToken, { message: `Verify CSRF token for ${options.path}` }).toBeDefined();
  }).toPass({
    timeout: 20_000,
    intervals: [1_000],
  });

  return csrfToken!;
}

export async function postForm(options: { apiContext: APIRequestContext; path: string; form: Record<string, string> }): Promise<void> {
  await expect(async () => {
    const response = await options.apiContext.post(options.path, {
      form: options.form,
    });

    await expect(response, { message: `Verify response is okay from ${options.path}` }).toBeOK();
  }).toPass({
    timeout: 20_000,
    intervals: [1_000],
  });
}

export async function uploadDocument(options: {
  apiContext: APIRequestContext;
  path: string;
  addtionalFields: Record<string, string>;
  fileUploadFieldName: string;
  nameOfFileToUpload: string;
}): Promise<void> {
  await expect(async () => {
    const filePath = await dataUtils.fetchDocumentUploadPath(options.nameOfFileToUpload);
    const fileBuffer = fs.readFileSync(filePath);
    const mimeType = mime.lookup(filePath) || 'application/octet-stream';

    const response = await options.apiContext.post(options.path, {
      headers: {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      multipart: {
        ...options.addtionalFields,
        [options.fileUploadFieldName]: {
          name: options.nameOfFileToUpload,
          mimeType: mimeType,
          buffer: fileBuffer,
        },
      },
    });

    expect(response.status()).toBeLessThan(400);
  }).toPass({
    timeout: 20_000,
    intervals: [1_000],
  });
}
