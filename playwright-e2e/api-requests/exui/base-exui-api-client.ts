import { APIRequestContext } from '@playwright/test';
import { CaseListApi, CaseDataApi } from './requests/index';

export abstract class BaseExuiApiClient {
  private exui_caseListApi: CaseListApi;
  private exui_caseDataApi: CaseDataApi;

  constructor(apiContext: APIRequestContext) {
    this.exui_caseListApi = new CaseListApi(apiContext);
    this.exui_caseDataApi = new CaseDataApi(apiContext);
  }

  public async fetchCaseId(option: { homeOfficeReferenceNumber: string }): Promise<string> {
    const caseId = await this.exui_caseListApi.fetchCaseId({ homeOfficeReferenceNumber: option.homeOfficeReferenceNumber });
    return caseId;
  }

  public async fetchCaseData(option: { caseId: string }): Promise<JSON> {
    const caseData = await this.exui_caseDataApi.fetchCaseData({ caseId: option.caseId });
    return caseData;
  }
}
