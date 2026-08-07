import { APIRequestContext } from '@playwright/test';
import { BaseExuiApiClient } from './base-exui-api-client';
import { StartAppealApi, StartAppealResponseDataType } from './requests/index';
import { AppealMasterPayload, AppealMasterPayloadOptionsType } from './new-appeal-payload-builder/appeal-master-payload';
import { DataUtils } from '../../utils/data.utils.js';

export class LegalRepApiClient extends BaseExuiApiClient {
  private startAppealApi: StartAppealApi;
  private appealMasterPayload = new AppealMasterPayload();
  private dataUtils = new DataUtils();

  constructor(apiContext: APIRequestContext) {
    super(apiContext);
    this.startAppealApi = new StartAppealApi(apiContext);
  }

  public async submitAppealMasterApplication(appealData: AppealMasterPayloadOptionsType): Promise<StartAppealResponseDataType> {
    const HomeOfficeReferenceNumber = `HOR${await this.dataUtils.generateRandomNumber({ digitLength: 7 })}`;
    let decisionDate: { day: number; month: number; year: number };

    if (appealData.isApplicationInTime === 'Yes') {
      const inTimeDecisionDate = await this.dataUtils.getDateFromToday({ dayOffset: -5 });
      decisionDate = {
        day: inTimeDecisionDate.day,
        month: inTimeDecisionDate.month,
        year: inTimeDecisionDate.year,
      };
    } else {
      const outOfTimeDecisionDate = await this.dataUtils.getDateFromToday({ monthOffset: -2 });
      decisionDate = {
        day: outOfTimeDecisionDate.day,
        month: outOfTimeDecisionDate.month,
        year: outOfTimeDecisionDate.year,
      };
    }

    const appealMasterPayload = await this.appealMasterPayload.buildAppealMasterPayload({
      ...appealData,
      homeOfficeReferenceNumber: HomeOfficeReferenceNumber,
      decisionDate: decisionDate,
    });

    const caseId = await this.startAppealApi.submitEvent({ caseType: 'Asylum', payloadToSubmit: appealMasterPayload });
    return caseId;
  }
}
