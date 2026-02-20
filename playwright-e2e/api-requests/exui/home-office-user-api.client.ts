import { APIRequestContext } from '@playwright/test';
import { BaseExuiApiClient } from './base-exui-api-client';
import { UploadHomeOfficeBundleEventType, UploadHomeOfficeAppealResponseEventType } from '../../exui-event-types';
import { UploadHomeOfficeBundleApi, UploadHomeOfficeAppealResponseApi } from './requests/index';

export class HomeOfficeUserApiClient extends BaseExuiApiClient {
  private uploadHomeOfficeBundleApi: UploadHomeOfficeBundleApi;
  private uploadHomeOfficeAppealResponseApi: UploadHomeOfficeAppealResponseApi;

  constructor(apiContext: APIRequestContext) {
    super(apiContext);
    this.uploadHomeOfficeBundleApi = new UploadHomeOfficeBundleApi(apiContext);
    this.uploadHomeOfficeAppealResponseApi = new UploadHomeOfficeAppealResponseApi(apiContext);
  }

  public async submitUploadHomeOfficeBundleEvent(options: UploadHomeOfficeBundleEventType): Promise<void> {
    await this.uploadHomeOfficeBundleApi.submitEvent(options);
  }

  public async submitUploadHomeOfficeAppealResponseEvent(options: UploadHomeOfficeAppealResponseEventType): Promise<void> {
    await this.uploadHomeOfficeAppealResponseApi.submitEvent(options);
  }
}
