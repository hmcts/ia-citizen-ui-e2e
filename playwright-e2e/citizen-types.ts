export type YesOrNoType = 'Yes' | 'No';
export type decisionWithOrWithoutHearingType = 'decisionWithHearing' | 'decisionWithoutHearing';
export type payForAppealNowOrLaterType = 'payNow' | 'payLater';

export type YourDetailsJourney = {
  isUserInTheUk: YesOrNoType;
  appealType: AppealType;
  isApplicantStateless: boolean;
  isApplicationInTime: boolean;
  nationality?: Nationality;
  hasApplicantReceivedADeportationOrder: YesOrNoType;
  doesApplicantHaveASponsor: YesOrNoType;
};

export type DecisionTypeJourney = {
  appealType: AppealType;
  decisionWithOrWithoutHearing: decisionWithOrWithoutHearingType;
  payForAppealNowOrLater?: payForAppealNowOrLaterType;
};

export type FeeSupportJourney = {
  whetherApplicantHasToPayAFee: FeeSupportType;
};

export type CheckAndSendJourney = {
  isApplicationInTime: boolean;
  appealSubmissionType: 'Non-Pay Appeal' | 'Pay Appeal';
};

export type AppealData = YourDetailsJourney &
  DecisionTypeJourney &
  CheckAndSendJourney & {
    whetherApplicantHasToPayAFee?: FeeSupportType;
  };

export type AppealReasonsFlowType = {
  doesApplicantRequireMoreTimeToSubmitAppealReasons: boolean;
  appealReasons?: {
    reasonWhyHomeOfficeDecisionIsWrong: string;
    doYouWishToProvideSupportingEvidence: YesOrNoType;
  };
  askForMoreTime?: {
    howMuchAndWhyMoreTimeNeeded: string;
    doYouWishToProvideSupportingEvidence: YesOrNoType;
  };
};

export type HearingRequestsFlowType = {
  pathToTake: 'Minimal Path' | 'Maximum Path';
};

export type AppealType =
  | 'Protection'
  | 'Human Rights'
  | 'European Economic Area'
  | 'Revocation of Protection Status'
  | 'Deprivation of Citizenship'
  | 'EU Settlement Scheme';

export type Nationality =
  | 'Afghan'
  | 'Albanian'
  | 'Algerian'
  | 'American'
  | 'Andorran'
  | 'Angolan'
  | 'Anguillan'
  | 'Citizen of Antigua and Barbuda'
  | 'Argentine'
  | 'Armenian'
  | 'Australian'
  | 'Austrian'
  | 'Azerbaijani'
  | 'Bahamian'
  | 'Bahraini'
  | 'Bangladeshi'
  | 'Barbadian'
  | 'Belarusian'
  | 'Belgian'
  | 'Belizean'
  | 'Beninese'
  | 'Bermudian'
  | 'Bhutanese'
  | 'Bolivian'
  | 'Citizen of Bosnia and Herzegovina'
  | 'Botswanan'
  | 'Brazilian'
  | 'British'
  | 'British Virgin Islander'
  | 'Bruneian'
  | 'Bulgarian'
  | 'Burkinan'
  | 'Burmese'
  | 'Burundian'
  | 'Cambodian'
  | 'Cameroonian'
  | 'Canadian'
  | 'Cape Verdean'
  | 'Cayman Islander'
  | 'Central African'
  | 'Chadian'
  | 'Chilean'
  | 'Chinese'
  | 'Colombian'
  | 'Comoran'
  | 'Congolese (DRC)'
  | 'Congolese (Congo)'
  | 'Cook Islander'
  | 'Costa Rican'
  | 'Croatian'
  | 'Cuban'
  | 'Cymraes'
  | 'Cymro'
  | 'Cypriot'
  | 'Czech'
  | 'Danish'
  | 'Djiboutian'
  | 'Dominican'
  | 'Citizen of the Dominican Republic'
  | 'Dutch'
  | 'East Timorese'
  | 'Ecuadorean'
  | 'Egyptian'
  | 'Emirati'
  | 'English'
  | 'Equatorial Guinean'
  | 'Eritrean'
  | 'Estonian'
  | 'Ethiopian'
  | 'Faroese'
  | 'Fijian'
  | 'Filipino'
  | 'Finnish'
  | 'French'
  | 'Gabonese'
  | 'Gambian'
  | 'Georgian'
  | 'German'
  | 'Ghanaian'
  | 'Gibraltarian'
  | 'Greek'
  | 'Greenlandic'
  | 'Grenadian'
  | 'Guamanian'
  | 'Guatemalan'
  | 'Citizen of Guinea-Bissau'
  | 'Guinean'
  | 'Guyanese'
  | 'Haitian'
  | 'Honduran'
  | 'Hong Konger'
  | 'Hungarian'
  | 'Icelandic'
  | 'Indian'
  | 'Indonesian'
  | 'Iranian'
  | 'Iraqi'
  | 'Irish'
  | 'Israeli'
  | 'Italian'
  | 'Ivorian'
  | 'Jamaican'
  | 'Japanese'
  | 'Jordanian'
  | 'Kazakh'
  | 'Kenyan'
  | 'Kittitian'
  | 'Citizen of Kiribati'
  | 'Kosovan'
  | 'Kuwaiti'
  | 'Kyrgyz'
  | 'Lao'
  | 'Latvian'
  | 'Lebanese'
  | 'Liberian'
  | 'Libyan'
  | 'Liechtenstein citizen'
  | 'Lithuanian'
  | 'Luxembourger'
  | 'Macanese'
  | 'Macedonian'
  | 'Malagasy'
  | 'Malawian'
  | 'Malaysian'
  | 'Maldivian'
  | 'Malian'
  | 'Maltese'
  | 'Marshallese'
  | 'Martiniquais'
  | 'Mauritanian'
  | 'Mauritian'
  | 'Mexican'
  | 'Micronesian'
  | 'Moldovan'
  | 'Monegasque'
  | 'Mongolian'
  | 'Montenegrin'
  | 'Montserratian'
  | 'Moroccan'
  | 'Mosotho'
  | 'Mozambican'
  | 'Namibian'
  | 'Nauruan'
  | 'Nepalese'
  | 'New Zealander'
  | 'Nicaraguan'
  | 'Nigerian'
  | 'Nigerien'
  | 'Niuean'
  | 'North Korean'
  | 'Northern Irish'
  | 'Norwegian'
  | 'Omani'
  | 'Pakistani'
  | 'Palauan'
  | 'Palestinian'
  | 'Panamanian'
  | 'Papua New Guinean'
  | 'Paraguayan'
  | 'Peruvian'
  | 'Pitcairn islander'
  | 'Polish'
  | 'Portuguese'
  | 'Prydeinig'
  | 'Puerto Rican'
  | 'Qatari'
  | 'Romanian'
  | 'Russian'
  | 'Rwandan'
  | 'Salvadorean'
  | 'Sammarinese'
  | 'Samoan'
  | 'Sao Tomean'
  | 'Saudi Arabian'
  | 'Scottish'
  | 'Senegalese'
  | 'Serbian'
  | 'Citizen of Seychelles'
  | 'Sierra Leonean'
  | 'Singaporean'
  | 'Slovak'
  | 'Slovenian'
  | 'Solomon Islander'
  | 'Somali'
  | 'South African'
  | 'South Korean'
  | 'South Sudanese'
  | 'Spanish'
  | 'Sri Lankan'
  | 'St Helenian'
  | 'St Lucian'
  | 'Sudanese'
  | 'Surinamese'
  | 'Swazi'
  | 'Swedish'
  | 'Swiss'
  | 'Syrian'
  | 'Taiwanese'
  | 'Tajik'
  | 'Tanzanian'
  | 'Thai'
  | 'Togolese'
  | 'Tongan'
  | 'Trinidadian'
  | 'Tristanian'
  | 'Tunisian'
  | 'Turkish'
  | 'Turkmen'
  | 'Turks and Caicos Islander'
  | 'Tuvaluan'
  | 'Ugandan'
  | 'Ukrainian'
  | 'Uruguayan'
  | 'Uzbek'
  | 'Vatican citizen'
  | 'Citizen of Vanuatu'
  | 'Venezuelan'
  | 'Vietnamese'
  | 'Vincentian'
  | 'Wallisian'
  | 'Welsh'
  | 'Yemeni'
  | 'Zambian'
  | 'Zimbabwean';

export type FeeSupportType =
  | 'I get asylum support from the Home Office'
  | 'I got a fee waiver from the Home Office for my application to stay in the UK'
  | 'I am under 18 and get housing or other support from the local authority'
  | 'I am the parent, guardian or sponsor of someone under 18 who gets housing or other support from the local authority'
  | 'None of these statements apply to me';

export type WhoNeedsInterpretorType =
  | 'Interpreter for applicant'
  | 'Interpreter for one or more witness'
  | 'Interpretor for applicant and witness'
  | 'No interpretor required';

export type InterpretorSupportType = 'Spoken language interpreter' | 'Sign language interpreter' | 'Spoken and sign language interpretor';

export const LANGUAGE_NAME_TO_CODE = {
  English: 'eng',
  Arabic: 'ara',
  Urdu: 'urd',
  French: 'fra',
  Spanish: 'spa',
  Somali: 'som',
  Polish: 'pol',
  Portuguese: 'por',
  Bengali: 'ben',
  Mandarin: 'cmn',
} as const;

export type LanguagesType = keyof typeof LANGUAGE_NAME_TO_CODE;

export const SIGN_LANGUAGE_NAME_TO_CODE = {
  'American Sign Language (ASL)': 'ase',
  'British Sign Language (BSL)': 'bfi',
  'Deaf Relay': 'sign-dfr',
  'Deafblind manual alphabet': 'sign-dma',
  'Hands on signing': 'sign-hos',
  'International Sign (IS)': 'ils',
  Lipspeaker: 'sign-lps',
  Makaton: 'sign-mkn',
  Notetaker: 'sign-ntr',
  'Palantypist / Speech to text': 'sign-pst',
  'Speech Supported English (SSE)': 'sign-sse',
  'Visual frame signing': 'sign-vfs',
} as const;

export type SignLanguagesType = keyof typeof SIGN_LANGUAGE_NAME_TO_CODE;

export type AllMaleOrFemaleHearingType = 'All male' | 'All female';
