import { APIRequestContext } from '@playwright/test';
import { HearingWitnessApi, HearingWitnessNamesApi, HearingOutsideUkApi } from '../../../../api-requests/citizen/index';
import { DataUtils } from '../../../../utils';
import { YesOrNoType, HearingRequestsFlowType } from '../../../../citizen-types';

export type HearingWitnessFlowReturnType = {
  doesApplicantHaveAWitness: YesOrNoType;
  takePartInHearingOutsideUk: YesOrNoType;
  witnessName?: string;
};

export class HearingWitnessUserFlowApi {
  private cui_hearingWitnessApi: HearingWitnessApi;
  private cui_hearingWitnessNamesApi: HearingWitnessNamesApi;
  private cui_hearingOutsideUkApi: HearingOutsideUkApi;
  private dataUtils = new DataUtils();

  constructor(apiContext: APIRequestContext) {
    this.cui_hearingWitnessApi = new HearingWitnessApi(apiContext);
    this.cui_hearingWitnessNamesApi = new HearingWitnessNamesApi(apiContext);
    this.cui_hearingOutsideUkApi = new HearingOutsideUkApi(apiContext);
  }

  public async submitHearingWitnessFlowViaApi(options: HearingRequestsFlowType): Promise<HearingWitnessFlowReturnType> {
    let doesApplicantHaveAWitness: YesOrNoType;
    let takePartInHearingOutsideUk: YesOrNoType;
    let witnessName: string | undefined;

    switch (options.pathToTake) {
      case 'Minimal Path':
        doesApplicantHaveAWitness = 'No';
        takePartInHearingOutsideUk = 'No';

        await this.cui_hearingWitnessApi.submitForm({ doesApplicantHaveAWitness: doesApplicantHaveAWitness });
        await this.cui_hearingOutsideUkApi.submitForm({ takePartInHearingOutsideUk: takePartInHearingOutsideUk });
        break;
      case 'Maximum Path':
        doesApplicantHaveAWitness = 'Yes';
        takePartInHearingOutsideUk = 'Yes';

        const generateRandomWitnessName = await this.dataUtils.generateRandomFirstAndLastNames({
          countOfFirstNamesToGenerate: 1,
          countOfLastNamesToGenerate: 1,
        });
        witnessName = generateRandomWitnessName.firstNames[0] + ' ' + generateRandomWitnessName.lastNames[0];

        await this.cui_hearingWitnessApi.submitForm({ doesApplicantHaveAWitness: doesApplicantHaveAWitness });

        await this.cui_hearingWitnessNamesApi.submitForm({
          givenNames: generateRandomWitnessName.firstNames[0],
          familyName: generateRandomWitnessName.lastNames[0],
        });

        await this.cui_hearingOutsideUkApi.submitForm({ takePartInHearingOutsideUk: takePartInHearingOutsideUk });
        break;
      default:
        throw new Error(`Unknown pathToTake value: ${options.pathToTake}`);
    }

    return {
      doesApplicantHaveAWitness: doesApplicantHaveAWitness,
      takePartInHearingOutsideUk: takePartInHearingOutsideUk,
      witnessName: options.pathToTake === 'Maximum Path' && witnessName ? witnessName : undefined,
    };
  }
}
