import { APIRequestContext } from '@playwright/test';
import {
  HearingDatesAvoidApi,
  HearingDatesAvoidEnterApi,
  HearingDatesAvoidReasonsApi,
  HearingDatesAvoidNewApi,
} from '../../../../api-requests/citizen/index';
import { DataUtils } from '../../../../utils';
import { YesOrNoType, HearingRequestsFlowType } from '../../../../citizen-types';

export type HearingDatesToAvoidFlowReturnType = {
  anyDatesToAvoid: YesOrNoType;
  firstDateToAvoid: { day: number; month: number; year: number } | undefined;
  reasonForAvoidingFirstDate: string | undefined;
  anyFurtherDatesToAvoid: YesOrNoType | undefined;
  secondDateToAvoid: { day: number; month: number; year: number } | undefined;
  reasonForAvoidingSecondDate: string | undefined;
};

export class HearingDatesToAvoidUserFlowApi {
  private cui_hearingDatesAvoidApi: HearingDatesAvoidApi;
  private cui_hearingDatesAvoidEnterApi: HearingDatesAvoidEnterApi;
  private cui_hearingDatesAvoidReasonsApi: HearingDatesAvoidReasonsApi;
  private cui_hearingDatesAvoidNewApi: HearingDatesAvoidNewApi;
  private dataUtils = new DataUtils();

  constructor(apiContext: APIRequestContext) {
    this.cui_hearingDatesAvoidApi = new HearingDatesAvoidApi(apiContext);
    this.cui_hearingDatesAvoidEnterApi = new HearingDatesAvoidEnterApi(apiContext);
    this.cui_hearingDatesAvoidReasonsApi = new HearingDatesAvoidReasonsApi(apiContext);
    this.cui_hearingDatesAvoidNewApi = new HearingDatesAvoidNewApi(apiContext);
  }

  public async submitHearingDatesToAvoidFlowViaApi(options: HearingRequestsFlowType): Promise<HearingDatesToAvoidFlowReturnType> {
    let anyDatesToAvoid: YesOrNoType;
    let firstDateToAvoid: { day: number; month: number; year: number } | undefined;
    let reasonForAvoidingFirstDate: string | undefined;
    let anyFurtherDatesToAvoid: YesOrNoType | undefined;
    let secondDateToAvoid: { day: number; month: number; year: number } | undefined;
    let reasonForAvoidingSecondDate: string | undefined;

    switch (options.pathToTake) {
      case 'Minimal Path':
        anyDatesToAvoid = 'No';

        await this.cui_hearingDatesAvoidApi.submitForm({ anyDatesToAvoid: anyDatesToAvoid });
        break;
      case 'Maximum Path':
        anyDatesToAvoid = 'Yes';
        firstDateToAvoid = await this.dataUtils.getDateFromToday({ dayOffset: 15 });
        reasonForAvoidingFirstDate = 'I am not available on this date because I have a prior commitment.';
        anyFurtherDatesToAvoid = 'Yes';
        secondDateToAvoid = await this.dataUtils.getDateFromToday({ dayOffset: 16 });
        reasonForAvoidingSecondDate = 'I am not available on this date because I have a medical appointment.';

        await this.cui_hearingDatesAvoidApi.submitForm({ anyDatesToAvoid: anyDatesToAvoid });
        await this.cui_hearingDatesAvoidEnterApi.submitForm({
          day: firstDateToAvoid.day,
          month: firstDateToAvoid.month,
          year: firstDateToAvoid.year,
        });
        await this.cui_hearingDatesAvoidReasonsApi.submitForm({ reasonForAvoidingDate: reasonForAvoidingFirstDate });

        await this.cui_hearingDatesAvoidNewApi.submitForm({ anyFurtherDatesToAvoid: anyFurtherDatesToAvoid });
        await this.cui_hearingDatesAvoidEnterApi.submitForm({
          day: secondDateToAvoid!.day,
          month: secondDateToAvoid!.month,
          year: secondDateToAvoid!.year,
        });
        await this.cui_hearingDatesAvoidReasonsApi.submitForm({ reasonForAvoidingDate: reasonForAvoidingSecondDate });
        break;
      default:
        throw new Error(`Unknown pathToTake value: ${options.pathToTake}`);
    }

    return {
      anyDatesToAvoid: anyDatesToAvoid,
      firstDateToAvoid: firstDateToAvoid,
      reasonForAvoidingFirstDate: reasonForAvoidingFirstDate,
      anyFurtherDatesToAvoid: anyFurtherDatesToAvoid,
      secondDateToAvoid: secondDateToAvoid,
      reasonForAvoidingSecondDate: reasonForAvoidingSecondDate,
    };
  }
}
