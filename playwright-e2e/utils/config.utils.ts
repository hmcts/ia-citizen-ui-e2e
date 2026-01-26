import path from 'path';

export interface UserCredentials {
  username: string;
  password: string;
  sessionFile: string;
  cookieName?: string;
}

interface Urls {
  exuiDefaultUrl: string;
  citizenUrl: string;
  idamWebUrl: string;
  idamTestingSupportUrl: string;
  serviceAuthUrl: string;
}

export interface Config {
  users: {
    caseManager: UserCredentials;
    judge: UserCredentials;
  };
  urls: Urls;
}

export const config: Config = {
  users: {
    caseManager: {
      username: getEnvVar('CASEMANAGER_USERNAME'),
      password: getEnvVar('CASEMANAGER_PASSWORD'),
      sessionFile: pathToFile('.sessions/', `${getEnvVar('CASEMANAGER_USERNAME')}.json`),
      cookieName: 'xui-webapp',
    },
    judge: {
      username: getEnvVar('JUDGE_USERNAME'),
      password: getEnvVar('JUDGE_PASSWORD'),
      sessionFile: pathToFile('.sessions/', `${getEnvVar('JUDGE_USERNAME')}.json`),
      cookieName: 'xui-webapp',
    },
  },
  urls: {
    exuiDefaultUrl: 'https://manage-case.aat.platform.hmcts.net',
    citizenUrl: getEnvVar('CITIZEN_FRONTEND_BASE_URL'),
    idamWebUrl: getEnvVar('IDAM_WEB_URL'),
    idamTestingSupportUrl: getEnvVar('IDAM_TESTING_SUPPORT_URL'),
    serviceAuthUrl: getEnvVar('S2S_URL'),
  },
};

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Error: ${name} environment variable is not set`);
  }
  return value;
}

function pathToFile(expectedPath: string, nameOfFile: string): string {
  if (!expectedPath || !nameOfFile) {
    throw new Error('Folder path or name of file is not set');
  }

  const projectRoot = process.cwd();
  return path.join(projectRoot, './playwright-e2e/', expectedPath, nameOfFile);
}
