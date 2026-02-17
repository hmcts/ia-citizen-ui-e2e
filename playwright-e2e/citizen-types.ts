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
  | 'Afghanistan'
  | 'Aland Islands'
  | 'Albania'
  | 'Algeria'
  | 'American Samoa'
  | 'Andorra'
  | 'Angola'
  | 'Anguilla'
  | 'Antarctica'
  | 'Antigua and Barbuda'
  | 'Argentina'
  | 'Armenia'
  | 'Aruba'
  | 'Australia'
  | 'Austria'
  | 'Azerbaijan'
  | 'Bahamas'
  | 'Bahrain'
  | 'Bangladesh'
  | 'Barbados'
  | 'Belarus'
  | 'Belgium'
  | 'Belize'
  | 'Benin'
  | 'Bermuda'
  | 'Bhutan'
  | 'Bolivia'
  | 'Bonaire, Sint Eustatius and Saba'
  | 'Bosnia and Herzegovina'
  | 'Botswana'
  | 'Bouvet Island'
  | 'Brazil'
  | 'British Overseas Citizen'
  | 'British Virgin Islands'
  | 'British Indian Ocean Territory'
  | 'Brunei Darussalam'
  | 'Bulgaria'
  | 'Burkina Faso'
  | 'Burundi'
  | 'Cambodia'
  | 'Cameroon'
  | 'Canada'
  | 'Cape Verde'
  | 'Cayman Islands'
  | 'Central African Republic'
  | 'Chad'
  | 'Chile'
  | 'China'
  | 'Hong Kong, Special Administrative Region of China'
  | 'Macao, Special Administrative Region of China'
  | 'Christmas Island'
  | 'Cocos (Keeling) Islands'
  | 'Colombia'
  | 'Comoros'
  | 'Congo (Brazzaville)'
  | 'Congo, Democratic Republic of the'
  | 'Cook Islands'
  | 'Costa Rica'
  | "Côte d'Ivoire"
  | 'Croatia'
  | 'Cuba'
  | 'Curaçao'
  | 'Cyprus'
  | 'Czech Republic'
  | 'Denmark'
  | 'Djibouti'
  | 'Dominica'
  | 'Dominican Republic'
  | 'Ecuador'
  | 'Egypt'
  | 'El Salvador'
  | 'Equatorial Guinea'
  | 'Eritrea'
  | 'Estonia'
  | 'Ethiopia'
  | 'Falkland Islands (Malvinas)'
  | 'Faroe Islands'
  | 'Fiji'
  | 'Finland'
  | 'France'
  | 'French Guiana'
  | 'French Polynesia'
  | 'French Southern Territories'
  | 'Gabon'
  | 'Gambia'
  | 'Georgia'
  | 'Germany'
  | 'Ghana'
  | 'Gibraltar'
  | 'Greece'
  | 'Greenland'
  | 'Grenada'
  | 'Guadeloupe'
  | 'Guam'
  | 'Guatemala'
  | 'Guernsey'
  | 'Guinea'
  | 'Guinea-Bissau'
  | 'Guyana'
  | 'Haiti'
  | 'Heard Island and Mcdonald Islands'
  | 'Holy See (Vatican City State)'
  | 'Honduras'
  | 'Hungary'
  | 'Iceland'
  | 'India'
  | 'Indonesia'
  | 'Iran, Islamic Republic of'
  | 'Iraq'
  | 'Ireland'
  | 'Isle of Man'
  | 'Israel'
  | 'Italy'
  | 'Jamaica'
  | 'Japan'
  | 'Jersey'
  | 'Jordan'
  | 'Kazakhstan'
  | 'Kenya'
  | 'Kiribati'
  | "Korea, Democratic People's Republic of"
  | 'Korea, Republic of'
  | 'Kosovo'
  | 'Kuwait'
  | 'Kyrgyzstan'
  | 'Lao PDR'
  | 'Latvia'
  | 'Lebanon'
  | 'Lesotho'
  | 'Liberia'
  | 'Libya'
  | 'Liechtenstein'
  | 'Lithuania'
  | 'Luxembourg'
  | 'Macedonia, Republic of'
  | 'Madagascar'
  | 'Malawi'
  | 'Malaysia'
  | 'Maldives'
  | 'Mali'
  | 'Malta'
  | 'Marshall Islands'
  | 'Martinique'
  | 'Mauritania'
  | 'Mauritius'
  | 'Mayotte'
  | 'Mexico'
  | 'Micronesia, Federated States of'
  | 'Moldova'
  | 'Monaco'
  | 'Mongolia'
  | 'Montenegro'
  | 'Montserrat'
  | 'Morocco'
  | 'Mozambique'
  | 'Myanmar'
  | 'Namibia'
  | 'Nauru'
  | 'Nepal'
  | 'Netherlands'
  | 'Netherlands Antilles'
  | 'New Caledonia'
  | 'New Zealand'
  | 'Nicaragua'
  | 'Niger'
  | 'Nigeria'
  | 'Niue'
  | 'Norfolk Island'
  | 'Northern Mariana Islands'
  | 'Norway'
  | 'Oman'
  | 'Pakistan'
  | 'Palau'
  | 'Palestinian Territory, Occupied'
  | 'Panama'
  | 'Papua New Guinea'
  | 'Paraguay'
  | 'Peru'
  | 'Philippines'
  | 'Pitcairn'
  | 'Poland'
  | 'Portugal'
  | 'Puerto Rico'
  | 'Qatar'
  | 'Réunion'
  | 'Romania'
  | 'Russian Federation'
  | 'Rwanda'
  | 'Saint-Barthélemy'
  | 'Saint Helena'
  | 'Saint Kitts and Nevis'
  | 'Saint Lucia'
  | 'Saint-Martin (French part)'
  | 'Saint Pierre and Miquelon'
  | 'Saint Vincent and Grenadines'
  | 'Samoa'
  | 'San Marino'
  | 'Sao Tome and Principe'
  | 'Saudi Arabia'
  | 'Senegal'
  | 'Serbia'
  | 'Seychelles'
  | 'Sierra Leone'
  | 'Singapore'
  | 'Sint Maarten (Dutch part)'
  | 'Slovakia'
  | 'Slovenia'
  | 'Solomon Islands'
  | 'Somalia'
  | 'South Africa'
  | 'South Georgia and the South Sandwich Islands'
  | 'South Sudan'
  | 'Spain'
  | 'Sri Lanka'
  | 'Sudan'
  | 'Suriname'
  | 'Svalbard and Jan Mayen Islands'
  | 'Swaziland'
  | 'Sweden'
  | 'Switzerland'
  | 'Syrian Arab Republic (Syria)'
  | 'Taiwan'
  | 'Tajikistan'
  | 'Tanzania, United Republic of'
  | 'Thailand'
  | 'Timor-Leste'
  | 'Togo'
  | 'Tokelau'
  | 'Tonga'
  | 'Trinidad and Tobago'
  | 'Tunisia'
  | 'Turkey'
  | 'Turkmenistan'
  | 'Turks and Caicos Islands'
  | 'Tuvalu'
  | 'Uganda'
  | 'Ukraine'
  | 'United Arab Emirates'
  | 'United Kingdom'
  | 'United States of America'
  | 'United States Minor Outlying Islands'
  | 'Uruguay'
  | 'Uzbekistan'
  | 'Vanuatu'
  | 'Venezuela (Bolivarian Republic of)'
  | 'Viet Nam'
  | 'Virgin Islands, US'
  | 'Wallis and Futuna Islands'
  | 'Western Sahara'
  | 'Yemen'
  | 'Zambia'
  | 'Zimbabwe';

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
