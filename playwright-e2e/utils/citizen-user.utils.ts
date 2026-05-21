import fs from 'fs';
import path from 'path';
import { IdamUtils } from '@hmcts/playwright-common';
import { v4 as uuidv4 } from 'uuid';

const TOKEN_FILE = path.join(process.cwd(), '.sessions', 'create-user-token.json');

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
    let token = process.env.CREATE_USER_BEARER_TOKEN;
    if (!token && fs.existsSync(TOKEN_FILE)) {
      token = (JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf-8')) as { token: string }).token;
    }
    if (!token) throw new Error('CREATE_USER_BEARER_TOKEN is not set. Ensure global setup ran successfully.');
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
      password: password,
      forename,
      surname,
    };
  }
}
