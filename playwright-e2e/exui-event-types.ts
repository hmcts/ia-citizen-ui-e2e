import { YesOrNoType } from './citizen-types';

export type RemissionDecisionType = 'approved' | 'partiallyApproved' | 'rejected';
export type HomeOfficeAppealReviewOutcomeType = 'Decision maintained' | 'Decision withdrawn';
export type GrantedOrRefusedType = 'Granted' | 'Refused';
export type HearingChannelType = 'In Person' | 'Not in Attendance' | 'On the Papers' | 'Telephone' | 'Video';

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
  appealReviewOutcome: HomeOfficeAppealReviewOutcomeType;
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
  isRemoteHearingAllowed: GrantedOrRefusedType;
  grantOrRefuseAnyAdjustmentsRequested: GrantedOrRefusedType;
  isApplicationSuitableToFloat: YesOrNoType;
  anyAdditionalInstructions: YesOrNoType;
  hearingType: HearingChannelType;
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

export type ExuiCreateCaseType = 'Appeal* master' | 'Bail* master' | 'Appeal-864' | 'AppealDIAC-864-hmc-pre' | 'Asylum-hmc-int-spike';
export type DetentionFacilityType = 'Immigration removal centre' | 'Prison' | 'Other';
export type ImmigrationRemovalCentreNameType =
  | 'Brook House'
  | 'Campsfield House'
  | 'Colnbrook'
  | 'Derwentside'
  | 'Dungavel'
  | 'Harmondsworth'
  | 'Swinderby'
  | 'Tinsley House'
  | "Yarl's Wood";
export type PendingBailApplicationType = 'Yes' | 'Yes, but the bail application number was not provided' | 'No' | "I'm not sure";
export type ExuiAppealType =
  | 'Refusal of a human rights claim'
  | 'Refusal of application under the EEA regulations'
  | 'Deprivation of citizenship'
  | 'Refusal of protection claim'
  | 'Revocation of a protection status'
  | 'Refusal of application under the EU Settlement Scheme';
export type ExuiAppealGroundsHumanRightsRefusalType = 'The decision is unlawful under section 6 of the Human Rights Act 1998';
