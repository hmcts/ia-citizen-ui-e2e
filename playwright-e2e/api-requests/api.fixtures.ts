import { ApiClient } from './api-client';
import { ApiContext } from './api-context';
import { UtilsFixtures } from '../utils';
import { APIRequestContext } from 'playwright-core';

export interface ApiFixtures {
  cui_apiContext: APIRequestContext;
  cui_apiClient: ApiClient;
}

export const apiFixtures = {
  cui_apiContext: async ({ citizenUser }: UtilsFixtures, use) => {
    const immigrationApiContext = await new ApiContext().createCitizenSiteApiContext({
      userName: citizenUser.email,
      password: citizenUser.password,
    });
    await use(immigrationApiContext);
  },
  cui_apiClient: async ({ cui_apiContext }: ApiFixtures, use) => {
    const apiClient = new ApiClient(cui_apiContext);
    await use(apiClient);
  },
};
