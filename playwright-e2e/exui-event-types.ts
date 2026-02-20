import { YesOrNoType } from './citizen-types';

export type RemissionDecisionType = 'approved' | 'partiallyApproved' | 'rejected';

export type RemissionDecisionEventType = {
  caseId: string;
  decision: RemissionDecisionType;
  amountRemitted?: number;
  amountLeftToPay?: number;
  reason?: string;
};

export type RequestRespondentEvidenceEventType = {
  caseId: string;
  sendDirectionDateDue?: {
    day: number;
    month: number;
    year: number;
  };
  sendDirectionExplanation?: string;
};

export type RequestReasonsForAppealEventType = RequestRespondentEvidenceEventType;
export type RequestRespondentReviewEventType = RequestRespondentEvidenceEventType;
export type RequestResponseReviewEventType = RequestRespondentEvidenceEventType;

export type UploadHomeOfficeBundleEventType = {
  caseId: string;
  nameOfFileToUpload?: string;
  description: string;
};

export type UploadHomeOfficeAppealResponseEventType = {
  caseId: string;
  appealReviewOutcome: 'Decision maintained' | 'Decision withdrawn';
  nameOfFileToUpload?: string;
  homeOfficeAppealResponseDescription?: string;
};

export type CreateCaseSummaryEventType = {
  caseId: string;
  nameOfFileToUpload?: string;
  description?: string;
};

export type SendDirectionEventType = {
  caseId: string;
  explinationOfDirection: string;
  whoToSendDirectionTo: 'Legal representative' | 'Respondent' | 'Legal representative and Respondent' | 'Appellant' | 'Appellant and Respondent';
  dateDirectionIsDue: {
    day: number;
    month: number;
    year: number;
  };
};

export type ReviewHearingRequirementsEventType = {
  caseId: string;
  isRemoteHearingAllowed: 'Granted' | 'Refused';
  grantOrRefuseAnyAdjustmentsRequested: 'Granted' | 'Refused';
};

export type RequestAHearingEventType = {
  caseId: string;
  hearingType: 'Bail' | 'Case Management Review' | 'Costs' | 'Substantive';
  hearingChannel: 'In Person' | 'Telephone' | 'Video';
  courtLocation: 'Newport';
  numberOfPhysicalAttendees: number;
};

export type ListCaseEventType = {
  caseId: string;
  hearingId: string;
  isRemoteHearing: YesOrNoType;
  hearingDateAndTime: { day: number; month: number; year: number; hour?: number; minute?: number };
};

export type DecisionAndReasonsStartedEventType = {
  caseId: string;
  doYouAgreeWithImmigrationHistory: YesOrNoType;
  doYouAgreeWithscheduleOfIssuesAgreement: YesOrNoType;
  caseSummary?: string;
  caseIntro?: string;
};

export type GenerateDecisionAndReasonsEventType = {
  caseId: string;
  anonymityOrder: YesOrNoType;
  appellantRepresentative?: string;
  respondentRepresentative?: string;
};

export type SendDecisionAndReasonsEventType = {
  caseId: string;
  isDecisionAllowed: 'Allowed' | 'Dismissed';
  nameOfFileToUpload?: string;
};
