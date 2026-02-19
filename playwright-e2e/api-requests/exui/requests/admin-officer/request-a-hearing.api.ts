import { APIRequestContext, expect } from '@playwright/test';
import { RequestAHearingEventType } from '../../../../exui-event-types';

export class RequestAHearingApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitRequestForHearing(options: RequestAHearingEventType): Promise<string> {
    type HearingType = RequestAHearingEventType['hearingType'];
    const hearingTypeMap: Record<HearingType, string> = {
      Bail: 'BFA1-BAI',
      'Case Management Review': 'BFA1-CMR',
      Costs: 'BFA1-COS',
      Substantive: 'BFA1-SUB',
    };

    type HearingChannel = RequestAHearingEventType['hearingChannel'];
    const channelMap: Record<HearingChannel, string> = {
      'In Person': 'INTER',
      Telephone: 'TEL',
      Video: 'VID',
    };

    let hearingId: string | undefined;

    await expect(async () => {
      const locationRes = await this.apiContext.get('api/prd/location/getLocations', {
        params: { serviceIds: 'BFA1', locationType: 'hearing', searchTerm: options.courtLocation },
      });
      await expect(locationRes).toBeOK();
      const locations = await locationRes.json();
      const locationId = locations[0]?.epimms_id;
      if (!locationId) throw new Error(`Location not found: ${options.courtLocation}`);

      const fetchValuesResponse = await this.apiContext.post('api/hearings/loadServiceHearingValues', {
        params: { jurisdictionId: 'IA' },
        data: { caseReference: options.caseId },
      });
      await expect(fetchValuesResponse).toBeOK();
      const template = await fetchValuesResponse.json();

      const selectedChannelCode = channelMap[options.hearingChannel];

      const mappedParties = template.parties.map((party: any) => {
        if (party.partyType === 'IND') {
          const d = party.individualDetails || {};
          return {
            partyID: party.partyID,
            partyType: party.partyType,
            partyRole: party.partyRole,
            partyName: party.partyName,
            individualDetails: {
              firstName: d.firstName || null,
              lastName: d.lastName || null,
              preferredHearingChannel: selectedChannelCode,
              interpreterLanguage: d.interpreterLanguage || null,
              reasonableAdjustments: d.reasonableAdjustments || null,
              relatedParties: d.relatedParties || null,
              title: d.title || null,
              vulnerableFlag: d.vulnerableFlag !== undefined ? d.vulnerableFlag : null,
              vulnerabilityDetails: d.vulnerabilityDetails || null,
              hearingChannelEmail: d.hearingChannelEmail || null,
              hearingChannelPhone: d.hearingChannelPhone || null,
              custodyStatus: d.custodyStatus || null,
              otherReasonableAdjustmentDetails: d.otherReasonableAdjustmentDetails || null,
            },
            unavailabilityDOW: party.unavailabilityDOW ?? null,
            unavailabilityRanges: party.unavailabilityRanges ?? null,
          };
        }
        return party;
      });

      const payload = {
        hearingDetails: {
          duration: template.duration,
          hearingType: hearingTypeMap[options.hearingType],
          hearingLocations: [{ locationType: 'court', locationId: locationId }],
          hearingIsLinkedFlag: template.hearingIsLinkedFlag,
          hearingWindow: {
            dateRangeStart: template.hearingWindow.dateRangeStart.includes('T')
              ? template.hearingWindow.dateRangeStart
              : `${template.hearingWindow.dateRangeStart}T00:00:00.000Z`,
            dateRangeEnd: null,
          },
          privateHearingRequiredFlag: template.privateHearingRequiredFlag,
          panelRequirements: template.panelRequirements,
          autolistFlag: template.autoListFlag,
          hearingPriorityType: template.hearingPriorityType,
          numberOfPhysicalAttendees: options.numberOfPhysicalAttendees,
          hearingInWelshFlag: template.hearingInWelshFlag,
          facilitiesRequired: template.facilitiesRequired,
          listingComments: template.listingComments,
          hearingRequester: template.hearingRequester,
          leadJudgeContractType: template.leadJudgeContractType,
          amendReasonCodes: null,
          hearingChannels: [selectedChannelCode],
          listingAutoChangeReasonCode: 'user-added-comments',
          isPaperHearing: false,
        },
        caseDetails: {
          hmctsServiceCode: template.hmctsServiceID,
          caseRef: options.caseId,
          requestTimeStamp: null,
          hearingID: null,
          caseDeepLink: template.caseDeepLink,
          hmctsInternalCaseName: template.hmctsInternalCaseName,
          publicCaseName: template.publicCaseName,
          caseAdditionalSecurityFlag: template.caseAdditionalSecurityFlag,
          caseInterpreterRequiredFlag: template.caseInterpreterRequiredFlag,
          caseCategories: template.caseCategories,
          caseManagementLocationCode: locationId,
          caserestrictedFlag: template.caserestrictedFlag,
          caseSLAStartDate: template.caseSLAStartDate,
          externalCaseReference: template.externalCaseReference,
        },
        partyDetails: mappedParties,
      };

      const submissionResponse = await this.apiContext.post('api/hearings/submitHearingRequest', {
        headers: { accept: 'application/json, text/plain, */*' },
        data: payload,
      });

      await expect(submissionResponse).toBeOK();
      const responseJson = await submissionResponse.json();
      hearingId = responseJson.hearingRequestID.toString();
      expect(responseJson.hearingRequestID).toBeDefined();
    }).toPass({ timeout: 30_000, intervals: [2_000] });

    if (!hearingId) throw new Error('Hearing ID was not set after submission.');
    return hearingId;
  }
}
