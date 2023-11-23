import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BytesScalar: { input: any; output: any; }
  DateTime: { input: any; output: any; }
  JSONScalar: { input: any; output: any; }
};

export type ArResultInputType = {
  reportable?: InputMaybe<Scalars['Boolean']['input']>;
  result: Scalars['String']['input'];
  uid: Scalars['String']['input'];
};

export type ArSampleInputType = {
  analyses: Array<Scalars['String']['input']>;
  profiles: Array<Scalars['String']['input']>;
  sampleType: Scalars['String']['input'];
};

export type ActivityFeedType = {
  __typename?: 'ActivityFeedType';
  name: Scalars['String']['output'];
  subscribers?: Maybe<Array<UserType>>;
  uid: Scalars['String']['output'];
};

export type ActivityStreamType = {
  __typename?: 'ActivityStreamType';
  actionObject: WorkSheetTypeSampleTypeAnalysisResultTypeReportMetaTypeUnknownObjectType;
  actionObjectType?: Maybe<Scalars['String']['output']>;
  actionObjectUid?: Maybe<Scalars['String']['output']>;
  actor?: Maybe<UserType>;
  actorUid?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  feeds?: Maybe<Array<ActivityFeedType>>;
  target?: Maybe<Scalars['String']['output']>;
  targetUid?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  verb?: Maybe<Scalars['String']['output']>;
  viewers?: Maybe<Array<UserType>>;
};

export type AnalysisCategoryInputType = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  departmentUid?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

/** Union of possible outcomes when adding a new notice */
export type AnalysisCategoryResponse = AnalysisCategoryType | OperationError;

export type AnalysisCategoryType = {
  __typename?: 'AnalysisCategoryType';
  active: Scalars['Boolean']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  department?: Maybe<DepartmentType>;
  departmentUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type AnalysisCorrectionFactorInput = {
  analysisUid: Scalars['String']['input'];
  factor: Scalars['Float']['input'];
  instrumentUid: Scalars['String']['input'];
  methodUid: Scalars['String']['input'];
};

export type AnalysisCorrectionFactorResponse = AnalysisCorrectionFactorType | OperationError;

export type AnalysisCorrectionFactorType = {
  __typename?: 'AnalysisCorrectionFactorType';
  analysisUid: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  factor: Scalars['Float']['output'];
  instrumentUid: Scalars['String']['output'];
  methodUid: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type AnalysisCursorPage = {
  __typename?: 'AnalysisCursorPage';
  edges?: Maybe<Array<AnalysisEdge>>;
  items?: Maybe<Array<AnalysisWithProfiles>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type AnalysisDetectionLimitInput = {
  analysisUid: Scalars['String']['input'];
  instrumentUid: Scalars['String']['input'];
  lowerLimit: Scalars['Float']['input'];
  methodUid: Scalars['String']['input'];
  upperLimit: Scalars['Float']['input'];
};

export type AnalysisDetectionLimitResponse = AnalysisDetectionLimitType | OperationError;

export type AnalysisDetectionLimitType = {
  __typename?: 'AnalysisDetectionLimitType';
  analysisUid: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  instrumentUid: Scalars['String']['output'];
  lowerLimit: Scalars['Float']['output'];
  methodUid: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  upperLimit: Scalars['Float']['output'];
};

export type AnalysisEdge = {
  __typename?: 'AnalysisEdge';
  cursor: Scalars['String']['output'];
  node: AnalysisWithProfiles;
};

export type AnalysisInputType = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  categoryUid?: InputMaybe<Scalars['String']['input']>;
  departmentUid?: InputMaybe<Scalars['String']['input']>;
  description?: Scalars['String']['input'];
  internalUse?: InputMaybe<Scalars['Boolean']['input']>;
  keyword: Scalars['String']['input'];
  methods?: InputMaybe<Array<Scalars['String']['input']>>;
  name: Scalars['String']['input'];
  precision: Scalars['Int']['input'];
  requiredVerifications?: Scalars['Int']['input'];
  sampleTypes?: InputMaybe<Array<Scalars['String']['input']>>;
  selfVerification?: InputMaybe<Scalars['Boolean']['input']>;
  sortKey: Scalars['Int']['input'];
  tatLengthMinutes: Scalars['Int']['input'];
  unitUid?: InputMaybe<Scalars['String']['input']>;
};

export type AnalysisInterimInput = {
  analysisUid: Scalars['String']['input'];
  instrumentUid: Scalars['String']['input'];
  key: Scalars['Int']['input'];
  value: Scalars['String']['input'];
};

export type AnalysisInterimResponse = AnalysisInterimType | OperationError;

export type AnalysisInterimType = {
  __typename?: 'AnalysisInterimType';
  analysisUid: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  instrumentUid: Scalars['String']['output'];
  key: Scalars['Int']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  value: Scalars['String']['output'];
};

export type AnalysisMappingInputType = {
  analysisUid: Scalars['String']['input'];
  code: Scalars['String']['input'];
  codingStandardUid: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

/** Union of possible outcomes when adding a new notice */
export type AnalysisMappingResponse = AnalysisMappingType | OperationError;

export type AnalysisMappingType = {
  __typename?: 'AnalysisMappingType';
  analysis?: Maybe<AnalysisType>;
  analysisUid: Scalars['String']['output'];
  code: Scalars['String']['output'];
  codingStandard?: Maybe<CodingStandardType>;
  codingStandardUid: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

/** Union of possible outcomes when adding a new notice */
export type AnalysisProfileResponse = OperationError | ProfileType;

export type AnalysisRequestCursorPage = {
  __typename?: 'AnalysisRequestCursorPage';
  edges?: Maybe<Array<AnalysisRequestEdge>>;
  items?: Maybe<Array<AnalysisRequestWithSamples>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type AnalysisRequestEdge = {
  __typename?: 'AnalysisRequestEdge';
  cursor: Scalars['String']['output'];
  node: AnalysisRequestWithSamples;
};

export type AnalysisRequestInputType = {
  clientContactUid: Scalars['String']['input'];
  clientRequestId?: InputMaybe<Scalars['String']['input']>;
  clientUid: Scalars['String']['input'];
  clinicalData?: InputMaybe<Scalars['String']['input']>;
  internalUse?: InputMaybe<Scalars['Boolean']['input']>;
  patientUid: Scalars['String']['input'];
  priority?: Scalars['Int']['input'];
  samples: Array<ArSampleInputType>;
};

/** Union of possible outcomes when adding/editing analysis requests  */
export type AnalysisRequestResponse = AnalysisRequestWithSamples | OperationError;

export type AnalysisRequestType = {
  __typename?: 'AnalysisRequestType';
  client: ClientType;
  clientRequestId: Scalars['String']['output'];
  clientUid: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  internalUse: Scalars['Boolean']['output'];
  patient: PatientType;
  patientUid: Scalars['String']['output'];
  requestId: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type AnalysisRequestWithSamples = {
  __typename?: 'AnalysisRequestWithSamples';
  client: ClientType;
  clientRequestId: Scalars['String']['output'];
  clientUid: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  internalUse: Scalars['Boolean']['output'];
  patient: PatientType;
  patientUid: Scalars['String']['output'];
  requestId: Scalars['String']['output'];
  samples?: Maybe<Array<SampleType>>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type AnalysisResultCursorPage = {
  __typename?: 'AnalysisResultCursorPage';
  edges?: Maybe<Array<AnalysisResultEdge>>;
  items?: Maybe<Array<AnalysisResultType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type AnalysisResultEdge = {
  __typename?: 'AnalysisResultEdge';
  cursor: Scalars['String']['output'];
  node: AnalysisResultType;
};

/** Union of possible outcomes when actioning samples */
export type AnalysisResultResponse = OperationError | ResultListingType;

/** Union of possible outcomes when submitting/verifying results */
export type AnalysisResultSubmitResponse = OperationError | OperationSuccess;

export type AnalysisResultType = {
  __typename?: 'AnalysisResultType';
  analysis?: Maybe<AnalysisType>;
  analysisUid?: Maybe<Scalars['String']['output']>;
  analyst?: Maybe<UserType>;
  analystUid?: Maybe<Scalars['String']['output']>;
  assigned: Scalars['Boolean']['output'];
  cancelledBy?: Maybe<UserType>;
  cancelledByUid?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  dateCancelled?: Maybe<Scalars['DateTime']['output']>;
  dateInvalidated?: Maybe<Scalars['DateTime']['output']>;
  dateSubmitted?: Maybe<Scalars['DateTime']['output']>;
  dateVerified?: Maybe<Scalars['DateTime']['output']>;
  dueDate?: Maybe<Scalars['DateTime']['output']>;
  instrument?: Maybe<InstrumentType>;
  instrumentUid?: Maybe<Scalars['String']['output']>;
  invalidatedBy?: Maybe<UserType>;
  invalidatedByUid?: Maybe<Scalars['String']['output']>;
  method?: Maybe<MethodType>;
  methodUid?: Maybe<Scalars['String']['output']>;
  parent?: Maybe<AnalysisResultType>;
  parentId?: Maybe<Scalars['String']['output']>;
  reflexLevel?: Maybe<Scalars['Int']['output']>;
  reportable: Scalars['Boolean']['output'];
  result?: Maybe<Scalars['String']['output']>;
  retest: Scalars['Boolean']['output'];
  sample: SampleType;
  sampleUid: Scalars['String']['output'];
  status?: Maybe<Scalars['String']['output']>;
  submittedBy?: Maybe<UserType>;
  submittedByUid?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  verifiedBy?: Maybe<Array<UserType>>;
  worksheetId?: Maybe<Scalars['String']['output']>;
  worksheetPosition?: Maybe<Scalars['Int']['output']>;
  worksheetUid?: Maybe<Scalars['String']['output']>;
};

export type AnalysisSpecificationInput = {
  ageMax?: InputMaybe<Scalars['Int']['input']>;
  ageMin?: InputMaybe<Scalars['Int']['input']>;
  analysisUid: Scalars['String']['input'];
  gender?: InputMaybe<Scalars['String']['input']>;
  max?: InputMaybe<Scalars['Float']['input']>;
  maxReport?: InputMaybe<Scalars['String']['input']>;
  maxWarn?: InputMaybe<Scalars['Float']['input']>;
  methodUid?: InputMaybe<Scalars['String']['input']>;
  min?: InputMaybe<Scalars['Float']['input']>;
  minReport?: InputMaybe<Scalars['String']['input']>;
  minWarn?: InputMaybe<Scalars['Float']['input']>;
  unitUid?: InputMaybe<Scalars['String']['input']>;
  warnReport?: InputMaybe<Scalars['String']['input']>;
  warnValues?: InputMaybe<Scalars['String']['input']>;
};

export type AnalysisSpecificationResponse = AnalysisSpecificationType | OperationError;

export type AnalysisSpecificationType = {
  __typename?: 'AnalysisSpecificationType';
  ageMax?: Maybe<Scalars['Int']['output']>;
  ageMin?: Maybe<Scalars['Int']['output']>;
  analysisUid: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<Scalars['String']['output']>;
  max?: Maybe<Scalars['Float']['output']>;
  maxReport?: Maybe<Scalars['String']['output']>;
  maxWarn?: Maybe<Scalars['Float']['output']>;
  methodUid?: Maybe<Scalars['String']['output']>;
  min?: Maybe<Scalars['Float']['output']>;
  minReport?: Maybe<Scalars['String']['output']>;
  minWarn?: Maybe<Scalars['Float']['output']>;
  uid: Scalars['String']['output'];
  unit?: Maybe<UnitType>;
  unitUid?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  warnReport?: Maybe<Scalars['String']['output']>;
  warnValues?: Maybe<Scalars['String']['output']>;
};

export type AnalysisType = {
  __typename?: 'AnalysisType';
  active?: Maybe<Scalars['Boolean']['output']>;
  category?: Maybe<AnalysisCategoryType>;
  categoryUid?: Maybe<Scalars['String']['output']>;
  correctionFactors?: Maybe<Array<AnalysisCorrectionFactorType>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  department?: Maybe<DepartmentType>;
  departmentUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  detectionLimits?: Maybe<Array<AnalysisDetectionLimitType>>;
  hidden?: Maybe<Scalars['Boolean']['output']>;
  instruments?: Maybe<Array<InstrumentType>>;
  interims?: Maybe<Array<AnalysisInterimType>>;
  internalUse?: Maybe<Scalars['Boolean']['output']>;
  keyword?: Maybe<Scalars['String']['output']>;
  methods?: Maybe<Array<MethodType>>;
  name: Scalars['String']['output'];
  precision?: Maybe<Scalars['Int']['output']>;
  requiredVerifications?: Maybe<Scalars['Int']['output']>;
  resultOptions?: Maybe<Array<ResultOptionType>>;
  sampleTypes?: Maybe<Array<SampleTypeTyp>>;
  selfVerification?: Maybe<Scalars['Boolean']['output']>;
  sortKey?: Maybe<Scalars['Int']['output']>;
  specifications?: Maybe<Array<AnalysisSpecificationType>>;
  tatLengthMinutes?: Maybe<Scalars['Int']['output']>;
  uid: Scalars['String']['output'];
  uncertainties?: Maybe<Array<AnalysisUncertaintyType>>;
  unit?: Maybe<UnitType>;
  unitUid?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type AnalysisUncertaintyInput = {
  analysisUid: Scalars['String']['input'];
  instrumentUid: Scalars['String']['input'];
  max: Scalars['Float']['input'];
  methodUid: Scalars['String']['input'];
  min: Scalars['Float']['input'];
  value: Scalars['Float']['input'];
};

export type AnalysisUncertaintyResponse = AnalysisUncertaintyType | OperationError;

export type AnalysisUncertaintyType = {
  __typename?: 'AnalysisUncertaintyType';
  analysisUid: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  instrumentUid: Scalars['String']['output'];
  max: Scalars['Float']['output'];
  methodUid: Scalars['String']['output'];
  min: Scalars['Float']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  value: Scalars['Float']['output'];
};

export type AnalysisWithProfiles = {
  __typename?: 'AnalysisWithProfiles';
  active?: Maybe<Scalars['Boolean']['output']>;
  category?: Maybe<AnalysisCategoryType>;
  categoryUid?: Maybe<Scalars['String']['output']>;
  correctionFactors?: Maybe<Array<AnalysisCorrectionFactorType>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  department?: Maybe<DepartmentType>;
  departmentUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  detectionLimits?: Maybe<Array<AnalysisDetectionLimitType>>;
  hidden?: Maybe<Scalars['Boolean']['output']>;
  instruments?: Maybe<Array<InstrumentType>>;
  interims?: Maybe<Array<AnalysisInterimType>>;
  internalUse?: Maybe<Scalars['Boolean']['output']>;
  keyword?: Maybe<Scalars['String']['output']>;
  methods?: Maybe<Array<MethodType>>;
  name: Scalars['String']['output'];
  precision?: Maybe<Scalars['Int']['output']>;
  profiles?: Maybe<Array<ProfileType>>;
  requiredVerifications?: Maybe<Scalars['Int']['output']>;
  resultOptions?: Maybe<Array<ResultOptionType>>;
  sampleTypes?: Maybe<Array<SampleTypeTyp>>;
  selfVerification?: Maybe<Scalars['Boolean']['output']>;
  sortKey?: Maybe<Scalars['Int']['output']>;
  specifications?: Maybe<Array<AnalysisSpecificationType>>;
  tatLengthMinutes?: Maybe<Scalars['Int']['output']>;
  uid: Scalars['String']['output'];
  uncertainties?: Maybe<Array<AnalysisUncertaintyType>>;
  unit?: Maybe<UnitType>;
  unitUid?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type AuditLogType = {
  __typename?: 'AuditLogType';
  action?: Maybe<Scalars['Int']['output']>;
  stateAfter?: Maybe<Scalars['String']['output']>;
  stateBefore?: Maybe<Scalars['String']['output']>;
  targetId?: Maybe<Scalars['String']['output']>;
  targetType?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  userId?: Maybe<Scalars['String']['output']>;
};

export type AuthenticatedData = {
  __typename?: 'AuthenticatedData';
  token: Scalars['String']['output'];
  tokenType: Scalars['String']['output'];
  user: UserType;
};

export type AuthenticatedDataResponse = AuthenticatedData | OperationError;

export type CalibrationCertificateInput = {
  approvedBy?: InputMaybe<Scalars['String']['input']>;
  certificateCode?: InputMaybe<Scalars['String']['input']>;
  dateIssued?: InputMaybe<Scalars['DateTime']['input']>;
  instrumentUid: Scalars['String']['input'];
  internal?: Scalars['Boolean']['input'];
  issuer?: InputMaybe<Scalars['String']['input']>;
  performedBy?: InputMaybe<Scalars['String']['input']>;
  remarks?: InputMaybe<Scalars['String']['input']>;
  validFromDate?: InputMaybe<Scalars['DateTime']['input']>;
  validToDate?: InputMaybe<Scalars['DateTime']['input']>;
};

export type CalibrationCertificateResponse = CalibrationCertificateType | OperationError;

export type CalibrationCertificateType = {
  __typename?: 'CalibrationCertificateType';
  approvedBy: Scalars['String']['output'];
  certificateCode: Scalars['String']['output'];
  dateIssued: Scalars['DateTime']['output'];
  instrument?: Maybe<InstrumentType>;
  instrumentUid: Scalars['String']['output'];
  internal: Scalars['Boolean']['output'];
  issuer: Scalars['String']['output'];
  performedBy: Scalars['String']['output'];
  remarks: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  validFromDate: Scalars['DateTime']['output'];
  validToDate: Scalars['DateTime']['output'];
};

export type ClientContactInputType = {
  clientUid: Scalars['String']['input'];
  consentSms?: InputMaybe<Scalars['Boolean']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  emailCc?: InputMaybe<Scalars['String']['input']>;
  firstName: Scalars['String']['input'];
  isActive?: Scalars['Boolean']['input'];
  lastName?: InputMaybe<Scalars['String']['input']>;
  mobilePhone?: InputMaybe<Scalars['String']['input']>;
};

export type ClientContactResponse = ClientContactType | OperationError;

export type ClientContactType = {
  __typename?: 'ClientContactType';
  businessPhone?: Maybe<Scalars['String']['output']>;
  client?: Maybe<ClientType>;
  clientUid: Scalars['String']['output'];
  consentSms: Scalars['Boolean']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  creatorName?: Maybe<Scalars['String']['output']>;
  creatorUid?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  emailCc?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  mobilePhone?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatorName?: Maybe<Scalars['String']['output']>;
  updatorUid?: Maybe<Scalars['String']['output']>;
};

export type ClientCursorPage = {
  __typename?: 'ClientCursorPage';
  edges?: Maybe<Array<ClientEdge>>;
  items?: Maybe<Array<ClientType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ClientEdge = {
  __typename?: 'ClientEdge';
  cursor: Scalars['String']['output'];
  node: ClientType;
};

export type ClientInputType = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  code: Scalars['String']['input'];
  consentEmail?: InputMaybe<Scalars['Boolean']['input']>;
  consentSms?: InputMaybe<Scalars['Boolean']['input']>;
  districtUid?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  emailCc?: InputMaybe<Scalars['String']['input']>;
  internalUse?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  phoneBusiness?: InputMaybe<Scalars['String']['input']>;
  phoneMobile?: InputMaybe<Scalars['String']['input']>;
};

export type ClientResponse = ClientType | OperationError;

export type ClientType = {
  __typename?: 'ClientType';
  active: Scalars['Boolean']['output'];
  code: Scalars['String']['output'];
  consentEmail: Scalars['Boolean']['output'];
  consentSms: Scalars['Boolean']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  district?: Maybe<DistrictType>;
  districtUid?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  emailCc?: Maybe<Scalars['String']['output']>;
  internalUse: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  phoneBusiness?: Maybe<Scalars['String']['output']>;
  phoneMobile?: Maybe<Scalars['String']['output']>;
  province?: Maybe<ProvinceType>;
  provinceUid?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type CodingStandardInputType = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CodingStandardResponse = CodingStandardType | OperationError;

export type CodingStandardType = {
  __typename?: 'CodingStandardType';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type CountryInputType = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  code: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type CountryResponse = CountryType | OperationError;

export type CountryType = {
  __typename?: 'CountryType';
  active?: Maybe<Scalars['String']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type CreateQcSetData = {
  __typename?: 'CreateQCSetData';
  qcSets: Array<QcSetType>;
  samples: Array<SampleType>;
};

export type DeleteContactResponse = DeletedItem | OperationError;

/** Union of possible outcomes when deleting some object */
export type DeleteResponse = DeletedItem | OperationError;

export type DeletedItem = {
  __typename?: 'DeletedItem';
  uid: Scalars['String']['output'];
};

export type DepartmentInputType = {
  code?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type DepartmentResponse = DepartmentType | OperationError;

export type DepartmentType = {
  __typename?: 'DepartmentType';
  code?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type DistrictCursorPage = {
  __typename?: 'DistrictCursorPage';
  edges?: Maybe<Array<DistrictEdge>>;
  items?: Maybe<Array<DistrictType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type DistrictEdge = {
  __typename?: 'DistrictEdge';
  cursor: Scalars['String']['output'];
  node: DistrictType;
};

export type DistrictInputType = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  businessPhone?: InputMaybe<Scalars['String']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  emailCc?: InputMaybe<Scalars['String']['input']>;
  mobilePhone?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  provinceUid?: InputMaybe<Scalars['String']['input']>;
};

export type DistrictResponse = DistrictType | OperationError;

export type DistrictType = {
  __typename?: 'DistrictType';
  active?: Maybe<Scalars['Boolean']['output']>;
  businessPhone?: Maybe<Scalars['String']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  emailCc?: Maybe<Scalars['String']['output']>;
  mobilePhone?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  province?: Maybe<ProvinceType>;
  provinceUid?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type GroupCount = {
  __typename?: 'GroupCount';
  count?: Maybe<Scalars['Int']['output']>;
  group: Scalars['String']['output'];
};

export type GroupData = {
  __typename?: 'GroupData';
  counts?: Maybe<Array<GroupCount>>;
  group: Scalars['String']['output'];
};

export type GroupInputType = {
  active?: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  pages: Scalars['String']['input'];
};

export type GroupResponse = GroupType | OperationError;

export type GroupType = {
  __typename?: 'GroupType';
  active?: Maybe<Scalars['Boolean']['output']>;
  keyword?: Maybe<Scalars['String']['output']>;
  members?: Maybe<Array<UserType>>;
  name?: Maybe<Scalars['String']['output']>;
  pages?: Maybe<Scalars['String']['output']>;
  permissions?: Maybe<Array<PermissionType>>;
  uid: Scalars['String']['output'];
};

export type GroupedCounts = {
  __typename?: 'GroupedCounts';
  data: Array<GroupCount>;
};

export type GroupedData = {
  __typename?: 'GroupedData';
  data: Array<GroupData>;
};

export type HazardInputType = {
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type HazardResponse = HazardType | OperationError;

export type HazardType = {
  __typename?: 'HazardType';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type IdentificationResponse = IdentificationType | OperationError;

export type IdentificationType = {
  __typename?: 'IdentificationType';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type InstrumentCalibrationInput = {
  calibrationId?: InputMaybe<Scalars['String']['input']>;
  dateReported?: InputMaybe<Scalars['DateTime']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  instrumentUid: Scalars['String']['input'];
  notesBefore?: InputMaybe<Scalars['String']['input']>;
  performedBy?: InputMaybe<Scalars['String']['input']>;
  remarks?: InputMaybe<Scalars['String']['input']>;
  reportId?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  workDone?: InputMaybe<Scalars['String']['input']>;
};

export type InstrumentCalibrationResponse = InstrumentCalibrationType | OperationError;

export type InstrumentCalibrationType = {
  __typename?: 'InstrumentCalibrationType';
  calibrationId: Scalars['String']['output'];
  dateReported: Scalars['DateTime']['output'];
  endDate: Scalars['DateTime']['output'];
  instrument?: Maybe<InstrumentType>;
  instrumentUid: Scalars['String']['output'];
  notesBefore: Scalars['String']['output'];
  performedBy: Scalars['String']['output'];
  remarks: Scalars['String']['output'];
  reportId: Scalars['String']['output'];
  startDate: Scalars['DateTime']['output'];
  uid: Scalars['String']['output'];
  workDone: Scalars['String']['output'];
};

export type InstrumentCursorPage = {
  __typename?: 'InstrumentCursorPage';
  edges?: Maybe<Array<InstrumentEdge>>;
  items?: Maybe<Array<InstrumentType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type InstrumentEdge = {
  __typename?: 'InstrumentEdge';
  cursor: Scalars['String']['output'];
  node: InstrumentType;
};

export type InstrumentInputType = {
  description?: InputMaybe<Scalars['String']['input']>;
  instrumentTypeUid?: InputMaybe<Scalars['String']['input']>;
  keyword: Scalars['String']['input'];
  manufacturerUid?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  supplierUid?: InputMaybe<Scalars['String']['input']>;
};

export type InstrumentResponse = InstrumentType | OperationError;

export type InstrumentType = {
  __typename?: 'InstrumentType';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  instrumentType?: Maybe<InstrumentTypeType>;
  instrumentTypeUid?: Maybe<Scalars['String']['output']>;
  keyword?: Maybe<Scalars['String']['output']>;
  manufacturer?: Maybe<ManufacturerType>;
  manufacturerUid?: Maybe<Scalars['String']['output']>;
  methods?: Maybe<Array<MethodType>>;
  name?: Maybe<Scalars['String']['output']>;
  supplier?: Maybe<SupplierType>;
  supplierUid?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type InstrumentTypeCursorPage = {
  __typename?: 'InstrumentTypeCursorPage';
  edges?: Maybe<Array<InstrumentTypeEdge>>;
  items?: Maybe<Array<InstrumentTypeType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type InstrumentTypeEdge = {
  __typename?: 'InstrumentTypeEdge';
  cursor: Scalars['String']['output'];
  node: InstrumentTypeType;
};

export type InstrumentTypeInputType = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type InstrumentTypeResponse = InstrumentTypeType | OperationError;

export type InstrumentTypeType = {
  __typename?: 'InstrumentTypeType';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type LaboratoryInputType = {
  address?: InputMaybe<Scalars['String']['input']>;
  businessPhone?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  emailCc?: InputMaybe<Scalars['String']['input']>;
  labManagerUid?: InputMaybe<Scalars['String']['input']>;
  labName: Scalars['String']['input'];
  logo?: InputMaybe<Scalars['String']['input']>;
  mobilePhone?: InputMaybe<Scalars['String']['input']>;
  setupName?: Scalars['String']['input'];
};

export type LaboratoryResponse = LaboratoryType | OperationError;

export type LaboratorySettingInputType = {
  allowPatientRegistration?: InputMaybe<Scalars['Boolean']['input']>;
  allowSampleRegistration?: InputMaybe<Scalars['Boolean']['input']>;
  allowSelfVerification?: InputMaybe<Scalars['Boolean']['input']>;
  allowWorksheetCreation?: InputMaybe<Scalars['Boolean']['input']>;
  autoReceiveSamples?: InputMaybe<Scalars['Boolean']['input']>;
  defaultRoute?: InputMaybe<Scalars['String']['input']>;
  defaultTheme?: InputMaybe<Scalars['String']['input']>;
  inactivityLogOut?: InputMaybe<Scalars['Int']['input']>;
  laboratoryUid: Scalars['String']['input'];
  passwordLifetime?: InputMaybe<Scalars['Int']['input']>;
  stickerCopies?: InputMaybe<Scalars['Int']['input']>;
};

export type LaboratorySettingResponse = LaboratorySettingType | OperationError;

export type LaboratorySettingType = {
  __typename?: 'LaboratorySettingType';
  allowPatientRegistration?: Maybe<Scalars['Boolean']['output']>;
  allowSampleRegistration?: Maybe<Scalars['Boolean']['output']>;
  allowSelfVerification?: Maybe<Scalars['Boolean']['output']>;
  allowWorksheetCreation?: Maybe<Scalars['Boolean']['output']>;
  autoReceiveSamples?: Maybe<Scalars['Boolean']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  defaultRoute?: Maybe<Scalars['String']['output']>;
  defaultTatMinutes?: Maybe<Scalars['Int']['output']>;
  defaultTheme?: Maybe<Scalars['String']['output']>;
  inactivityLogOut?: Maybe<Scalars['Int']['output']>;
  laboratory: LaboratoryType;
  laboratoryUid: Scalars['String']['output'];
  passwordLifetime?: Maybe<Scalars['Int']['output']>;
  stickerCopies?: Maybe<Scalars['Int']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type LaboratoryType = {
  __typename?: 'LaboratoryType';
  address?: Maybe<Scalars['String']['output']>;
  businessPhone?: Maybe<Scalars['String']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  emailCc?: Maybe<Scalars['String']['output']>;
  labManager?: Maybe<UserType>;
  labManagerUid?: Maybe<Scalars['String']['output']>;
  labName: Scalars['String']['output'];
  logo?: Maybe<Scalars['String']['output']>;
  mobilePhone?: Maybe<Scalars['String']['output']>;
  setupName: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type LaggardCounts = {
  __typename?: 'LaggardCounts';
  graterThanThirty?: Maybe<Scalars['Int']['output']>;
  lessThanTen?: Maybe<Scalars['Int']['output']>;
  tenToTwenty?: Maybe<Scalars['Int']['output']>;
  totalDelayed?: Maybe<Scalars['Int']['output']>;
  totalIncomplete?: Maybe<Scalars['Int']['output']>;
  totalNotDelayed?: Maybe<Scalars['Int']['output']>;
  twentyToThirty?: Maybe<Scalars['Int']['output']>;
};

export type LaggardData = {
  __typename?: 'LaggardData';
  category: Scalars['String']['output'];
  counts?: Maybe<LaggardCounts>;
};

export type LaggardStatistics = {
  __typename?: 'LaggardStatistics';
  data: Array<LaggardData>;
};

export type ManufacturerInputType = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type ManufacturerResponse = ManufacturerType | OperationError;

export type ManufacturerType = {
  __typename?: 'ManufacturerType';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

/** Union of possible outcomes when deleting some object */
export type MessageResponse = MessagesType | OperationError;

export type MessageThreadType = {
  __typename?: 'MessageThreadType';
  broadcast: Scalars['Boolean']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  deletedBy?: Maybe<Array<UserType>>;
  messages?: Maybe<Array<MessageType>>;
  recipients: Array<UserType>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type MessageType = {
  __typename?: 'MessageType';
  body: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  deletedBy?: Maybe<Array<UserType>>;
  left: Scalars['Int']['output'];
  parent?: Maybe<MessageType>;
  parentId: Scalars['String']['output'];
  right: Scalars['Int']['output'];
  thread?: Maybe<MessageThreadType>;
  threadUid: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  viewers?: Maybe<Array<UserType>>;
};

export type MessagesType = {
  __typename?: 'MessagesType';
  message: Scalars['String']['output'];
};

export type MethodCursorPage = {
  __typename?: 'MethodCursorPage';
  edges?: Maybe<Array<MethodEdge>>;
  items?: Maybe<Array<MethodType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type MethodEdge = {
  __typename?: 'MethodEdge';
  cursor: Scalars['String']['output'];
  node: MethodType;
};

export type MethodInputType = {
  analyses?: InputMaybe<Array<Scalars['String']['input']>>;
  description?: InputMaybe<Scalars['String']['input']>;
  instruments?: InputMaybe<Array<Scalars['String']['input']>>;
  keyword?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type MethodResponse = MethodType | OperationError;

export type MethodType = {
  __typename?: 'MethodType';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  instruments?: Maybe<Array<InstrumentType>>;
  keyword?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  actionShipment: ShipmentResponse;
  approveStockOrder: StockOrderResponse;
  authenticateUser: AuthenticatedDataResponse;
  cancelAnalysisResults: AnalysisResultResponse;
  cancelSamples: ResultedSampleActionResponse;
  cloneSamples: SampleActionResponse;
  createAnalysis: ProfilesServiceResponse;
  createAnalysisCategory: AnalysisCategoryResponse;
  createAnalysisCorrectionFactor: AnalysisCorrectionFactorResponse;
  createAnalysisDetectionLimit: AnalysisDetectionLimitResponse;
  createAnalysisInterim: AnalysisInterimResponse;
  createAnalysisMapping: AnalysisMappingResponse;
  createAnalysisRequest: AnalysisRequestResponse;
  createAnalysisSpecification: AnalysisSpecificationResponse;
  createAnalysisUncertainty: AnalysisUncertaintyResponse;
  createCaliberationCertificate: CalibrationCertificateResponse;
  createClient: ClientResponse;
  createClientContact: ClientContactResponse;
  createCodingStandard: CodingStandardResponse;
  createCountry: CountryResponse;
  createDepartment: DepartmentResponse;
  createDistrict: DistrictResponse;
  createGroup: GroupResponse;
  createHazard: HazardResponse;
  createIdentification: IdentificationResponse;
  createInstrument: InstrumentResponse;
  createInstrumentCaliberation: InstrumentCalibrationResponse;
  createInstrumentType: InstrumentTypeResponse;
  createManufacturer: ManufacturerResponse;
  createMethod: MethodResponse;
  createNotice: NoticeResponse;
  createPatient: PatientResponse;
  createProfile: AnalysisProfileResponse;
  createProfileMapping: ProfileMappingResponse;
  createProvince: ProvinceResponse;
  createQcLevel: QcLevelResponse;
  createQcSet: QcSetResponse;
  createQcTemplate: QcTemplateResponse;
  createReferralLaboratory: ReferralLaboratoryResponse;
  createReflexAction: ReflexActionResponse;
  createReflexBrain: ReflexBrainResponse;
  createReflexRule: ReflexRuleResponse;
  createRejectionReason: RejectionReasonResponse;
  createResultOption: ResultOptionResponse;
  createSampleType: SampleTypeResponse;
  createSampleTypeMapping: SampleTypeMappingResponse;
  createShipment: ShipmentsResponse;
  createStockAdjustment: StockAdjustmentResponse;
  createStockCategory: StockCategoryResponse;
  createStockItem: StockItemResponse;
  createStockOrder: StockOrderResponse;
  createStockPackaging: StockPackagingResponse;
  createStockProduct: StockProductResponse;
  createStockTransaction: StockTransactionResponse;
  createStockUnit: StockUnitResponse;
  createStorageContainer: StorageContainerResponse;
  createStorageLocation: StorageLocationResponse;
  createStorageSection: StorageSectionResponse;
  createStoreRoom: StoreRoomResponse;
  createSupplier: SupplierResponse;
  createUnit: UnitResponse;
  createUser: UserResponse;
  createUserAuth: UserResponse;
  createWorksheet: WorkSheetsResponse;
  createWorksheetTemplate: WorkSheetTemplateResponse;
  deleteClientContact: DeleteContactResponse;
  deleteMessage: DeleteResponse;
  deleteNotice: DeleteResponse;
  deleteStockOrder: StockOrderResponse;
  deleteThread: DeleteResponse;
  invalidateSamples: SampleActionResponse;
  issueStockOrder: StockOrderResponse;
  printSamples: SampleActionResponse;
  publishSamples: SuccessErrorResponse;
  reInstateAnalysisResults: AnalysisResultResponse;
  reInstateSamples: ResultedSampleActionResponse;
  receiveSamples: ResultedSampleActionResponse;
  recoverPassword: MessageResponse;
  recoverSamples: StoreSampleResponse;
  rejectSamples: SampleActionResponse;
  replyMessage: MessageResponse;
  retestAnalysisResults: AnalysisResultResponse;
  retractAnalysisResults: AnalysisResultResponse;
  sendMessage: MessageResponse;
  shipmentManageSamples: ShipmentResponse;
  storeSamples: StoreSampleResponse;
  submitAnalysisResults: AnalysisResultSubmitResponse;
  submitStockOrder: StockOrderResponse;
  unlinkUserAuth: UserResponse;
  updateAnalysis: ProfilesServiceResponse;
  updateAnalysisCategory: AnalysisCategoryResponse;
  updateAnalysisCorrectionFactor: AnalysisCorrectionFactorResponse;
  updateAnalysisDetectionLimit: AnalysisDetectionLimitResponse;
  updateAnalysisInterim: AnalysisInterimResponse;
  updateAnalysisMapping: AnalysisMappingResponse;
  updateAnalysisSpecification: AnalysisSpecificationResponse;
  updateAnalysisUncertainty: AnalysisUncertaintyResponse;
  updateCaliberationCertificate: CalibrationCertificateResponse;
  updateClient: ClientResponse;
  updateClientContact: ClientContactResponse;
  updateCodingStandard: CodingStandardResponse;
  updateCountry: CountryResponse;
  updateDepartment: DepartmentResponse;
  updateDistrict: DistrictResponse;
  updateGroup: GroupResponse;
  updateGroupPermissions: UpdatedGroupPermsResponse;
  updateHazard: HazardResponse;
  updateIdentification: IdentificationResponse;
  updateInstrument: InstrumentResponse;
  updateInstrumentCaliberation: InstrumentCalibrationResponse;
  updateInstrumentType: InstrumentTypeResponse;
  updateLaboratory: LaboratoryResponse;
  updateLaboratorySetting: LaboratorySettingResponse;
  updateManufacturer: ManufacturerResponse;
  updateMethod: MethodResponse;
  updateNotice: NoticeResponse;
  updatePatient: PatientResponse;
  updateProfile: AnalysisProfileResponse;
  updateProfileMapping: ProfileMappingResponse;
  updateProvince: ProvinceResponse;
  updateQcLevel: QcLevelResponse;
  updateQcTemplate: QcTemplateResponse;
  updateReferralLaboratory: ReferralLaboratoryResponse;
  updateReflexAction: ReflexActionResponse;
  updateReflexBrain: ReflexBrainResponse;
  updateReflexRule: ReflexRuleResponse;
  updateRejectionReason: RejectionReasonResponse;
  updateResultOption: ResultOptionResponse;
  updateSampleType: SampleTypeResponse;
  updateSampleTypeMapping: SampleTypeMappingResponse;
  updateShipment: ShipmentResponse;
  updateStockCategory: StockCategoryResponse;
  updateStockItem: StockItemResponse;
  updateStockOrder: StockOrderResponse;
  updateStockPackaging: StockPackagingResponse;
  updateStockProduct: StockProductResponse;
  updateStockUnit: StockUnitResponse;
  updateStorageContainer: StorageContainerResponse;
  updateStorageLocation: StorageLocationResponse;
  updateStorageSection: StorageSectionResponse;
  updateStoreRoom: StoreRoomResponse;
  updateSupplier: SupplierResponse;
  updateUnit: UnitResponse;
  updateUser: UserResponse;
  updateUserAuth: UserResponse;
  updateWorksheet: WorkSheetResponse;
  updateWorksheetApplyTemplate: WorkSheetResponse;
  updateWorksheetManualAssign: WorkSheetResponse;
  updateWorksheetTemplate: WorkSheetTemplateResponse;
  verifyAnalysisResults: AnalysisResultSubmitResponse;
  verifySamples: SampleActionResponse;
  viewMessage: MessageResponse;
  viewNotice: NoticeType;
};


export type MutationActionShipmentArgs = {
  action: Scalars['String']['input'];
  uid: Scalars['String']['input'];
};


export type MutationApproveStockOrderArgs = {
  payload: StockOrderApprovalInputType;
  uid: Scalars['String']['input'];
};


export type MutationAuthenticateUserArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationCancelAnalysisResultsArgs = {
  analyses: Array<Scalars['String']['input']>;
};


export type MutationCancelSamplesArgs = {
  samples: Array<Scalars['String']['input']>;
};


export type MutationCloneSamplesArgs = {
  samples: Array<Scalars['String']['input']>;
};


export type MutationCreateAnalysisArgs = {
  payload: AnalysisInputType;
};


export type MutationCreateAnalysisCategoryArgs = {
  payload: AnalysisCategoryInputType;
};


export type MutationCreateAnalysisCorrectionFactorArgs = {
  payload: AnalysisCorrectionFactorInput;
};


export type MutationCreateAnalysisDetectionLimitArgs = {
  payload: AnalysisDetectionLimitInput;
};


export type MutationCreateAnalysisInterimArgs = {
  payload: AnalysisInterimInput;
};


export type MutationCreateAnalysisMappingArgs = {
  payload: AnalysisMappingInputType;
};


export type MutationCreateAnalysisRequestArgs = {
  payload: AnalysisRequestInputType;
};


export type MutationCreateAnalysisSpecificationArgs = {
  payload: AnalysisSpecificationInput;
};


export type MutationCreateAnalysisUncertaintyArgs = {
  payload: AnalysisUncertaintyInput;
};


export type MutationCreateCaliberationCertificateArgs = {
  payload: CalibrationCertificateInput;
};


export type MutationCreateClientArgs = {
  payload: ClientInputType;
};


export type MutationCreateClientContactArgs = {
  payload: ClientContactInputType;
};


export type MutationCreateCodingStandardArgs = {
  payload: CodingStandardInputType;
};


export type MutationCreateCountryArgs = {
  payload: CountryInputType;
};


export type MutationCreateDepartmentArgs = {
  payload: DepartmentInputType;
};


export type MutationCreateDistrictArgs = {
  payload: DistrictInputType;
};


export type MutationCreateGroupArgs = {
  payload: GroupInputType;
};


export type MutationCreateHazardArgs = {
  payload: HazardInputType;
};


export type MutationCreateIdentificationArgs = {
  name: Scalars['String']['input'];
};


export type MutationCreateInstrumentArgs = {
  payload: InstrumentInputType;
};


export type MutationCreateInstrumentCaliberationArgs = {
  payload: InstrumentCalibrationInput;
};


export type MutationCreateInstrumentTypeArgs = {
  payload: InstrumentTypeInputType;
};


export type MutationCreateManufacturerArgs = {
  payload: ManufacturerInputType;
};


export type MutationCreateMethodArgs = {
  payload: MethodInputType;
};


export type MutationCreateNoticeArgs = {
  payload: NoticeInputType;
};


export type MutationCreatePatientArgs = {
  payload: PatientInputType;
};


export type MutationCreateProfileArgs = {
  payload: ProfileInputType;
};


export type MutationCreateProfileMappingArgs = {
  payload: ProfileMappingInputType;
};


export type MutationCreateProvinceArgs = {
  payload: ProvinceInputType;
};


export type MutationCreateQcLevelArgs = {
  level: Scalars['String']['input'];
};


export type MutationCreateQcSetArgs = {
  samples: Array<QcSetInputType>;
};


export type MutationCreateQcTemplateArgs = {
  payload: QcTemplateInputType;
};


export type MutationCreateReferralLaboratoryArgs = {
  payload: ReferralLaboratoryInputType;
};


export type MutationCreateReflexActionArgs = {
  payload: ReflexActionInput;
};


export type MutationCreateReflexBrainArgs = {
  payload: ReflexBrainInput;
};


export type MutationCreateReflexRuleArgs = {
  payload: ReflexRuleInput;
};


export type MutationCreateRejectionReasonArgs = {
  reason: Scalars['String']['input'];
};


export type MutationCreateResultOptionArgs = {
  payload: ResultOptionInputType;
};


export type MutationCreateSampleTypeArgs = {
  payload: SampleTypeInputType;
};


export type MutationCreateSampleTypeMappingArgs = {
  payload: SampleTypeMappingInputType;
};


export type MutationCreateShipmentArgs = {
  payload: ShipmentInputType;
};


export type MutationCreateStockAdjustmentArgs = {
  payload: StockAdjustmentInputType;
};


export type MutationCreateStockCategoryArgs = {
  payload: StockCategoryInputType;
};


export type MutationCreateStockItemArgs = {
  payload: StockItemInputType;
};


export type MutationCreateStockOrderArgs = {
  payload: StockOrderInputType;
};


export type MutationCreateStockPackagingArgs = {
  payload: StockPackagingInputType;
};


export type MutationCreateStockProductArgs = {
  payload: StockProductInputType;
};


export type MutationCreateStockTransactionArgs = {
  payload: StockTransactionInputType;
};


export type MutationCreateStockUnitArgs = {
  payload: StockUnitInputType;
};


export type MutationCreateStorageContainerArgs = {
  payload: StorageContainerInputType;
};


export type MutationCreateStorageLocationArgs = {
  payload: StorageLocationInputType;
};


export type MutationCreateStorageSectionArgs = {
  payload: StorageSectionInputType;
};


export type MutationCreateStoreRoomArgs = {
  payload: StoreRoomInputType;
};


export type MutationCreateSupplierArgs = {
  payload: SupplierInputType;
};


export type MutationCreateUnitArgs = {
  payload: UnitInputType;
};


export type MutationCreateUserArgs = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  groupUid?: InputMaybe<Scalars['String']['input']>;
  lastName: Scalars['String']['input'];
  openReg?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationCreateUserAuthArgs = {
  password: Scalars['String']['input'];
  passwordc: Scalars['String']['input'];
  userName: Scalars['String']['input'];
  userUid: Scalars['String']['input'];
};


export type MutationCreateWorksheetArgs = {
  analystUid: Scalars['String']['input'];
  count?: InputMaybe<Scalars['Int']['input']>;
  templateUid: Scalars['String']['input'];
};


export type MutationCreateWorksheetTemplateArgs = {
  payload: WorksheetTemplateInputType;
};


export type MutationDeleteClientContactArgs = {
  uid: Scalars['String']['input'];
};


export type MutationDeleteMessageArgs = {
  uid: Scalars['String']['input'];
};


export type MutationDeleteNoticeArgs = {
  uid: Scalars['String']['input'];
};


export type MutationDeleteStockOrderArgs = {
  uid: Scalars['String']['input'];
};


export type MutationDeleteThreadArgs = {
  uid: Scalars['String']['input'];
};


export type MutationInvalidateSamplesArgs = {
  samples: Array<Scalars['String']['input']>;
};


export type MutationIssueStockOrderArgs = {
  payload: Array<StockOrderProductLineInputType>;
  uid: Scalars['String']['input'];
};


export type MutationPrintSamplesArgs = {
  samples: Array<Scalars['String']['input']>;
};


export type MutationPublishSamplesArgs = {
  samples: Array<SamplePublishInputType>;
};


export type MutationReInstateAnalysisResultsArgs = {
  analyses: Array<Scalars['String']['input']>;
};


export type MutationReInstateSamplesArgs = {
  samples: Array<Scalars['String']['input']>;
};


export type MutationReceiveSamplesArgs = {
  samples: Array<Scalars['String']['input']>;
};


export type MutationRecoverPasswordArgs = {
  username: Scalars['String']['input'];
};


export type MutationRecoverSamplesArgs = {
  sampleUids: Array<Scalars['String']['input']>;
};


export type MutationRejectSamplesArgs = {
  samples: Array<SampleRejectInputType>;
};


export type MutationReplyMessageArgs = {
  body: Scalars['String']['input'];
  threadUid: Scalars['String']['input'];
};


export type MutationRetestAnalysisResultsArgs = {
  analyses: Array<Scalars['String']['input']>;
};


export type MutationRetractAnalysisResultsArgs = {
  analyses: Array<Scalars['String']['input']>;
};


export type MutationSendMessageArgs = {
  body: Scalars['String']['input'];
  recipients: Array<Scalars['String']['input']>;
};


export type MutationShipmentManageSamplesArgs = {
  payload: ShipmentManageSamplesInput;
  uid: Scalars['String']['input'];
};


export type MutationStoreSamplesArgs = {
  payload: Array<StoreSamplesInputType>;
};


export type MutationSubmitAnalysisResultsArgs = {
  analysisResults: Array<ArResultInputType>;
  sourceObject: Scalars['String']['input'];
  sourceObjectUid: Scalars['String']['input'];
};


export type MutationSubmitStockOrderArgs = {
  uid: Scalars['String']['input'];
};


export type MutationUnlinkUserAuthArgs = {
  userUid: Scalars['String']['input'];
};


export type MutationUpdateAnalysisArgs = {
  payload: AnalysisInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateAnalysisCategoryArgs = {
  payload: AnalysisCategoryInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateAnalysisCorrectionFactorArgs = {
  payload: AnalysisCorrectionFactorInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateAnalysisDetectionLimitArgs = {
  payload: AnalysisDetectionLimitInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateAnalysisInterimArgs = {
  payload: AnalysisInterimInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateAnalysisMappingArgs = {
  payload: AnalysisMappingInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateAnalysisSpecificationArgs = {
  payload: AnalysisSpecificationInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateAnalysisUncertaintyArgs = {
  payload: AnalysisUncertaintyInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateCaliberationCertificateArgs = {
  payload: CalibrationCertificateInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateClientArgs = {
  payload: ClientInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateClientContactArgs = {
  payload: ClientContactInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateCodingStandardArgs = {
  payload: CodingStandardInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateCountryArgs = {
  payload: CountryInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateDepartmentArgs = {
  payload: DepartmentInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateDistrictArgs = {
  payload: DistrictInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateGroupArgs = {
  payload: GroupInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateGroupPermissionsArgs = {
  groupUid: Scalars['String']['input'];
  permissionUid: Scalars['String']['input'];
};


export type MutationUpdateHazardArgs = {
  payload: HazardInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateIdentificationArgs = {
  name: Scalars['String']['input'];
  uid: Scalars['String']['input'];
};


export type MutationUpdateInstrumentArgs = {
  payload: InstrumentInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateInstrumentCaliberationArgs = {
  payload: InstrumentInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateInstrumentTypeArgs = {
  payload: InstrumentTypeInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateLaboratoryArgs = {
  payload: LaboratoryInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateLaboratorySettingArgs = {
  payload: LaboratorySettingInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateManufacturerArgs = {
  payload: ManufacturerInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateMethodArgs = {
  payload: MethodInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateNoticeArgs = {
  payload: NoticeInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdatePatientArgs = {
  payload: PatientInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateProfileArgs = {
  payload: ProfileInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateProfileMappingArgs = {
  payload: ProfileMappingInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateProvinceArgs = {
  payload: ProvinceInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateQcLevelArgs = {
  level: Scalars['String']['input'];
  uid: Scalars['String']['input'];
};


export type MutationUpdateQcTemplateArgs = {
  payload: QcTemplateInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateReferralLaboratoryArgs = {
  payload: ReferralLaboratoryInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateReflexActionArgs = {
  payload: ReflexActionInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateReflexBrainArgs = {
  payload: ReflexBrainInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateReflexRuleArgs = {
  payload: ReflexRuleInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateRejectionReasonArgs = {
  reason: Scalars['String']['input'];
  uid: Scalars['String']['input'];
};


export type MutationUpdateResultOptionArgs = {
  payload: ResultOptionInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateSampleTypeArgs = {
  payload: SampleTypeInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateSampleTypeMappingArgs = {
  payload: SampleTypeMappingInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateShipmentArgs = {
  payload: ShipmentUpdateInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateStockCategoryArgs = {
  payload: StockCategoryInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateStockItemArgs = {
  payload: StockItemInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateStockOrderArgs = {
  payload: StockOrderInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateStockPackagingArgs = {
  payload: StockPackagingInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateStockProductArgs = {
  payload: StockProductInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateStockUnitArgs = {
  payload: StockUnitInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateStorageContainerArgs = {
  payload: StorageContainerInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateStorageLocationArgs = {
  payload: StorageLocationInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateStorageSectionArgs = {
  payload: StorageSectionInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateStoreRoomArgs = {
  payload: StoreRoomInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateSupplierArgs = {
  payload: SupplierInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateUnitArgs = {
  payload: UnitInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateUserArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  groupUid?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  mobilePhone?: InputMaybe<Scalars['String']['input']>;
  userUid: Scalars['String']['input'];
};


export type MutationUpdateUserAuthArgs = {
  password?: InputMaybe<Scalars['String']['input']>;
  passwordc?: InputMaybe<Scalars['String']['input']>;
  userName?: InputMaybe<Scalars['String']['input']>;
  userUid: Scalars['String']['input'];
};


export type MutationUpdateWorksheetArgs = {
  action?: InputMaybe<Scalars['String']['input']>;
  analystUid?: InputMaybe<Scalars['String']['input']>;
  instrumentUid?: InputMaybe<Scalars['String']['input']>;
  methodUid?: InputMaybe<Scalars['String']['input']>;
  samples?: InputMaybe<Array<Scalars['String']['input']>>;
  worksheetUid: Scalars['String']['input'];
};


export type MutationUpdateWorksheetApplyTemplateArgs = {
  templateUid: Scalars['String']['input'];
  worksheetUid: Scalars['String']['input'];
};


export type MutationUpdateWorksheetManualAssignArgs = {
  analysesUids: Array<Scalars['String']['input']>;
  qcTemplateUid?: InputMaybe<Scalars['String']['input']>;
  uid: Scalars['String']['input'];
};


export type MutationUpdateWorksheetTemplateArgs = {
  payload: WorksheetTemplateInputType;
  uid: Scalars['String']['input'];
};


export type MutationVerifyAnalysisResultsArgs = {
  analyses: Array<Scalars['String']['input']>;
  sourceObject: Scalars['String']['input'];
  sourceObjectUid: Scalars['String']['input'];
};


export type MutationVerifySamplesArgs = {
  samples: Array<Scalars['String']['input']>;
};


export type MutationViewMessageArgs = {
  uid: Scalars['String']['input'];
};


export type MutationViewNoticeArgs = {
  uid: Scalars['String']['input'];
  viewer: Scalars['String']['input'];
};

export type Nothing = {
  __typename?: 'Nothing';
  data?: Maybe<Scalars['String']['output']>;
};

export type NoticeInputType = {
  body: Scalars['String']['input'];
  departments?: InputMaybe<Array<Scalars['String']['input']>>;
  expiry: Scalars['String']['input'];
  groups?: InputMaybe<Array<Scalars['String']['input']>>;
  title: Scalars['String']['input'];
};

/** Union of possible outcomes when adding a new notice */
export type NoticeResponse = NoticeType | OperationError;

export type NoticeType = {
  __typename?: 'NoticeType';
  body: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  departments?: Maybe<Array<DepartmentType>>;
  expiry: Scalars['String']['output'];
  groups?: Maybe<Array<GroupType>>;
  title: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  viewers?: Maybe<Array<UserType>>;
};

export type NotificationType = {
  __typename?: 'NotificationType';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  departments?: Maybe<DepartmentType>;
  groups?: Maybe<GroupType>;
  message: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  users?: Maybe<UserType>;
  viewers?: Maybe<UserType>;
};

export type OperationError = {
  __typename?: 'OperationError';
  error: Scalars['String']['output'];
  suggestion?: Maybe<Scalars['String']['output']>;
};

export type OperationSuccess = {
  __typename?: 'OperationSuccess';
  message: Scalars['String']['output'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type PatientCursorPage = {
  __typename?: 'PatientCursorPage';
  edges?: Maybe<Array<PatientEdge>>;
  items?: Maybe<Array<PatientType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type PatientEdge = {
  __typename?: 'PatientEdge';
  cursor: Scalars['String']['output'];
  node: PatientType;
};

export type PatientIdentificationType = {
  __typename?: 'PatientIdentificationType';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  identification?: Maybe<IdentificationType>;
  identificationUid: Scalars['String']['output'];
  patientUid: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  value: Scalars['String']['output'];
};

export type PatientInputType = {
  age?: InputMaybe<Scalars['Int']['input']>;
  ageDobEstimated?: InputMaybe<Scalars['Boolean']['input']>;
  clientPatientId: Scalars['String']['input'];
  clientUid: Scalars['String']['input'];
  consentSms?: InputMaybe<Scalars['Boolean']['input']>;
  countryUid?: InputMaybe<Scalars['String']['input']>;
  dateOfBirth?: InputMaybe<Scalars['DateTime']['input']>;
  districtUid?: InputMaybe<Scalars['String']['input']>;
  firstName: Scalars['String']['input'];
  gender: Scalars['String']['input'];
  identifications?: InputMaybe<Array<PatientidentificationInput>>;
  internalUse?: InputMaybe<Scalars['Boolean']['input']>;
  lastName: Scalars['String']['input'];
  middleName?: InputMaybe<Scalars['String']['input']>;
  phoneHome?: InputMaybe<Scalars['String']['input']>;
  phoneMobile?: InputMaybe<Scalars['String']['input']>;
  provinceUid?: InputMaybe<Scalars['String']['input']>;
};

export type PatientResponse = OperationError | PatientType;

export type PatientType = {
  __typename?: 'PatientType';
  active: Scalars['Boolean']['output'];
  age?: Maybe<Scalars['Int']['output']>;
  ageDobEstimated: Scalars['Boolean']['output'];
  client?: Maybe<ClientType>;
  clientPatientId: Scalars['String']['output'];
  clientUid: Scalars['String']['output'];
  consentSms: Scalars['Boolean']['output'];
  country?: Maybe<CountryType>;
  countryUid?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  dateOfBirth?: Maybe<Scalars['DateTime']['output']>;
  district?: Maybe<DistrictType>;
  districtUid?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<Scalars['String']['output']>;
  identifications: Array<Maybe<PatientIdentificationType>>;
  internalUse: Scalars['Boolean']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  middleName?: Maybe<Scalars['String']['output']>;
  patientId: Scalars['String']['output'];
  phoneHome?: Maybe<Scalars['String']['output']>;
  phoneMobile?: Maybe<Scalars['String']['output']>;
  province?: Maybe<ProvinceType>;
  provinceUid?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type PatientidentificationInput = {
  identificationUid: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type PermissionType = {
  __typename?: 'PermissionType';
  action?: Maybe<Scalars['String']['output']>;
  active?: Maybe<Scalars['Boolean']['output']>;
  target?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
};

export type ProcessCounts = {
  __typename?: 'ProcessCounts';
  avgExtraDays?: Maybe<Scalars['Int']['output']>;
  processAverage?: Maybe<Scalars['Int']['output']>;
  service?: Maybe<Scalars['String']['output']>;
  totalLate?: Maybe<Scalars['Int']['output']>;
  totalNotLate?: Maybe<Scalars['Int']['output']>;
  totalSamples?: Maybe<Scalars['Int']['output']>;
};

export type ProcessData = {
  __typename?: 'ProcessData';
  counts?: Maybe<ProcessCounts>;
  groups?: Maybe<Array<ProcessCounts>>;
  process: Scalars['String']['output'];
};

export type ProcessStatistics = {
  __typename?: 'ProcessStatistics';
  data: Array<ProcessData>;
};

export type ProfileInputType = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  departmentUid?: InputMaybe<Scalars['String']['input']>;
  description?: Scalars['String']['input'];
  keyword?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  sampleTypes?: InputMaybe<Array<Scalars['String']['input']>>;
  services?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type ProfileMappingInputType = {
  code: Scalars['String']['input'];
  codingStandardUid: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  profileUid: Scalars['String']['input'];
};

/** Union of possible outcomes when adding a new notice */
export type ProfileMappingResponse = OperationError | ProfileMappingType;

export type ProfileMappingType = {
  __typename?: 'ProfileMappingType';
  code: Scalars['String']['output'];
  codingStandard?: Maybe<CodingStandardType>;
  codingStandardUid: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  profile?: Maybe<ProfileType>;
  profileUid: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type ProfileType = {
  __typename?: 'ProfileType';
  active: Scalars['Boolean']['output'];
  analyses?: Maybe<Array<AnalysisType>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  department?: Maybe<DepartmentType>;
  departmentUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  keyword?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  sampleTypes?: Maybe<Array<SampleTypeTyp>>;
  tatLengthMinutes?: Maybe<Scalars['Int']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type ProfilesServiceResponse = AnalysisWithProfiles | OperationError;

export type ProvinceCursorPage = {
  __typename?: 'ProvinceCursorPage';
  edges?: Maybe<Array<ProvinceEdge>>;
  items?: Maybe<Array<ProvinceType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ProvinceEdge = {
  __typename?: 'ProvinceEdge';
  cursor: Scalars['String']['output'];
  node: ProvinceType;
};

export type ProvinceInputType = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  businessPhone?: InputMaybe<Scalars['String']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  countryUid?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  emailCc?: InputMaybe<Scalars['String']['input']>;
  mobilePhone?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type ProvinceResponse = OperationError | ProvinceType;

export type ProvinceType = {
  __typename?: 'ProvinceType';
  active?: Maybe<Scalars['Boolean']['output']>;
  businessPhone?: Maybe<Scalars['String']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  country?: Maybe<CountryType>;
  countryUid?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  emailCc?: Maybe<Scalars['String']['output']>;
  mobilePhone?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type QcLevelResponse = OperationError | QcLevelType;

export type QcLevelType = {
  __typename?: 'QCLevelType';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  level: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type QcSetCursorPage = {
  __typename?: 'QCSetCursorPage';
  edges?: Maybe<Array<QcSetEdge>>;
  items?: Maybe<Array<QcSetWithSamples>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type QcSetEdge = {
  __typename?: 'QCSetEdge';
  cursor: Scalars['String']['output'];
  node: QcSetWithSamples;
};

export type QcSetInputType = {
  analysisProfiles: Array<Scalars['String']['input']>;
  analysisServices: Array<Scalars['String']['input']>;
  qcLevels: Array<Scalars['String']['input']>;
  qcTemplateUid?: InputMaybe<Scalars['String']['input']>;
};

export type QcSetResponse = CreateQcSetData | OperationError;

export type QcSetType = {
  __typename?: 'QCSetType';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  note: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type QcSetWithSamples = {
  __typename?: 'QCSetWithSamples';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  note: Scalars['String']['output'];
  samples?: Maybe<Array<SamplesWithResults>>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type QcTemplateInputType = {
  departments?: InputMaybe<Array<Scalars['String']['input']>>;
  description?: Scalars['String']['input'];
  levels: Array<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type QcTemplateResponse = OperationError | QcTemplateType;

export type QcTemplateType = {
  __typename?: 'QCTemplateType';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  departments: Array<DepartmentType>;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  qcLevels: Array<QcLevelType>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  analysisAll: AnalysisCursorPage;
  analysisByUid: AnalysisType;
  analysisCategoryAll: Array<AnalysisCategoryType>;
  analysisCategoryByUid: AnalysisCategoryType;
  analysisCorrectionFactorAll: Array<AnalysisCorrectionFactorType>;
  analysisCorrectionFactorByUid: AnalysisCorrectionFactorType;
  analysisDetectionLimitAll: Array<AnalysisDetectionLimitType>;
  analysisDetectionLimitByUid: AnalysisDetectionLimitType;
  analysisInterimAll: Array<AnalysisInterimType>;
  analysisInterimByUid: AnalysisInterimType;
  analysisMappingsByAnalysis: Array<AnalysisMappingType>;
  analysisProcessPerformance: ProcessStatistics;
  analysisRequestAll: AnalysisRequestCursorPage;
  analysisRequestByUid: AnalysisRequestWithSamples;
  analysisRequestsByClientUid: Array<AnalysisRequestWithSamples>;
  analysisRequestsByPatientUid: Array<AnalysisRequestWithSamples>;
  analysisResultBySampleUid: Array<AnalysisResultType>;
  analysisResultByUid: AnalysisResultType;
  analysisResultsForWsAssign: AnalysisResultCursorPage;
  analysisSpecificationAll: Array<AnalysisSpecificationType>;
  analysisSpecificationUid: AnalysisSpecificationType;
  analysisUncertaintyAll: Array<AnalysisUncertaintyType>;
  analysisUncertaintyByUid: AnalysisUncertaintyType;
  analysisWithoutProfile: Array<AnalysisType>;
  auditLogsFilter: Array<AuditLogType>;
  clientAll: ClientCursorPage;
  clientByCode: ClientType;
  clientByUid: ClientType;
  clientContactAll: Array<ClientContactType>;
  clientContactByClientUid: Array<ClientContactType>;
  clientContactUid: ClientContactType;
  clientSearch: Array<ClientType>;
  clientsByName: Array<ClientType>;
  codingStandardAll: Array<CodingStandardType>;
  countAnalyteGroupByInstrument: GroupedCounts;
  countAnalyteGroupByStatus: GroupedCounts;
  countExtrasGroupByStatus: GroupedCounts;
  countSampleGroupByAction: GroupedData;
  countSampleGroupByStatus: GroupedCounts;
  countWorksheetGroupByStatus: GroupedCounts;
  countryAll: Array<CountryType>;
  countryByUid: CountryType;
  departmentAll: Array<DepartmentType>;
  departmentByUid: DepartmentType;
  districtAll: DistrictCursorPage;
  districtByUid: DistrictType;
  districtsByProvinceUid: Array<DistrictType>;
  groupAll: Array<GroupType>;
  groupByUid?: Maybe<GroupType>;
  hazardAll: Array<HazardType>;
  hazardByUid?: Maybe<HazardType>;
  identificationAll: Array<IdentificationType>;
  identificationByUid: IdentificationType;
  impressReportDownload?: Maybe<Scalars['BytesScalar']['output']>;
  impressReportsDownload?: Maybe<Scalars['BytesScalar']['output']>;
  impressReportsMeta: Array<ReportImpressType>;
  instrumentAll: InstrumentCursorPage;
  instrumentByUid: InstrumentType;
  instrumentTypeAll: InstrumentTypeCursorPage;
  instrumentTypeByUid: InstrumentTypeType;
  laboratory: LaboratoryType;
  laboratorySetting: LaboratorySettingType;
  manifestReportDownload?: Maybe<Scalars['BytesScalar']['output']>;
  manufacturerAll: Array<ManufacturerType>;
  manufacturerByUid: ManufacturerType;
  methodAll: MethodCursorPage;
  methodByUid: MethodType;
  noticeByUid?: Maybe<NoticeType>;
  noticeFilter: Array<NoticeType>;
  noticesByCreator?: Maybe<Array<NoticeType>>;
  notificationByUid?: Maybe<NotificationType>;
  notificationFilter: Array<NotificationType>;
  patientAll: PatientCursorPage;
  patientByPatientId?: Maybe<PatientType>;
  patientByUid?: Maybe<PatientType>;
  patientSearch: Array<PatientType>;
  permissionAll: Array<PermissionType>;
  permissionByUid?: Maybe<PermissionType>;
  profileAll: Array<ProfileType>;
  profileByUid: ProfileType;
  profileMappingsByProfile: Array<ProfileMappingType>;
  provinceAll: ProvinceCursorPage;
  provinceByUid: ProvinceType;
  provincesByCountryUid: Array<ProvinceType>;
  qcLevelAll: Array<QcLevelType>;
  qcLevelByUid: QcLevelType;
  qcSetAll: QcSetCursorPage;
  qcSetByUid: QcSetWithSamples;
  qcTemplateAll: Array<QcTemplateType>;
  qcTemplateByUid: QcTemplateType;
  referralLaboratoryAll: Array<ReferralLaboratoryType>;
  referralLaboratoryByCode: ReferralLaboratoryType;
  referralLaboratoryByUid: ReferralLaboratoryType;
  reflexRuleAll: ReflexRuleCursorPage;
  reflexRuleByUid?: Maybe<ReflexRuleType>;
  rejectionReasonByUid: RejectionReasonType;
  rejectionReasonsAll: Array<RejectionReasonType>;
  resultOptionsByAnalysisUid: ResultOptionType;
  sampleAll: SampleCursorPage;
  sampleByParentId: Array<SampleType>;
  sampleByUid: SampleType;
  sampleCount: Scalars['Int']['output'];
  sampleLaggards: LaggardStatistics;
  sampleProcessPerformance: ProcessStatistics;
  sampleSearch: Array<SampleType>;
  sampleTypeAll: Array<SampleTypeTyp>;
  sampleTypeByUid: SampleTypeTyp;
  sampleTypeMappingsBySampleType: Array<SampleTypeMappingType>;
  samplesByStorageContainerUid: Array<SampleType>;
  samplesByUids: Array<SamplesWithResults>;
  samplesForShipmentAssign: SampleCursorPage;
  shipmentAll: ShipmentCursorPage;
  shipmentById: ShipmentType;
  shipmentByStatus: Array<ShipmentType>;
  shipmentByUid: ShipmentType;
  stockAdjustmentAll: StockAdjustmentCursorPage;
  stockAdjustmentByUid?: Maybe<StockAdjustmentType>;
  stockCategoryAll: Array<StockCategoryType>;
  stockCategoryByUid?: Maybe<StockCategoryType>;
  stockItemAll: StockItemCursorPage;
  stockItemByUid?: Maybe<StockItemType>;
  stockOrderAll: StockOrderCursorPage;
  stockOrderByUid?: Maybe<StockOrderType>;
  stockOrderProductAll: Array<StockOrderProductType>;
  stockOrderProductByUid?: Maybe<StockOrderProductType>;
  stockPackagingAll: Array<StockPackagingType>;
  stockPackagingByUid?: Maybe<StockPackagingType>;
  stockProductAll: StockProductCursorPage;
  stockProductByUid?: Maybe<StockProductType>;
  stockTransactionAll: StockTransactionCursorPage;
  stockTransactionByUid?: Maybe<StockTransactionType>;
  stockUnitAll: Array<StockUnitType>;
  stockUnitByUid?: Maybe<StockUnitType>;
  storageContainerByUid?: Maybe<StorageContainerType>;
  storageContainers: Array<StorageContainerType>;
  storageLocationByUid?: Maybe<StorageLocationType>;
  storageLocations: Array<StorageLocationType>;
  storageSectionByUid?: Maybe<StorageSectionType>;
  storageSections: Array<StorageSectionType>;
  storeRoomAll: Array<StoreRoomType>;
  storeRoomByUid?: Maybe<StoreRoomType>;
  supplierAll: Array<SupplierType>;
  supplierByUid: SupplierType;
  threadByUid?: Maybe<MessageThreadType>;
  threadsForUser?: Maybe<Array<MessageThreadType>>;
  unitAll: Array<UnitType>;
  unitByUid: UnitType;
  userAll: UserCursorPage;
  userByEmail?: Maybe<UserType>;
  userMe?: Maybe<UserType>;
  worksheetAll: WorkSheetCursorPage;
  worksheetByAnalyst: Array<WorkSheetType>;
  worksheetById: WorkSheetType;
  worksheetByStatus: Array<WorkSheetType>;
  worksheetByUid: WorkSheetType;
  worksheetTemplateAll: Array<WorkSheetTemplateType>;
  worksheetTemplateByUid: Array<WorkSheetType>;
};


export type QueryAnalysisAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  qcOnly?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryAnalysisByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAnalysisCategoryByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAnalysisCorrectionFactorByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAnalysisDetectionLimitByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAnalysisInterimByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAnalysisMappingsByAnalysisArgs = {
  analysisUid: Scalars['String']['input'];
};


export type QueryAnalysisProcessPerformanceArgs = {
  endDate: Scalars['String']['input'];
  process: Scalars['String']['input'];
  startDate: Scalars['String']['input'];
};


export type QueryAnalysisRequestAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryAnalysisRequestByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAnalysisRequestsByClientUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAnalysisRequestsByPatientUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAnalysisResultBySampleUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAnalysisResultByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAnalysisResultsForWsAssignArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  analysisUid?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sampleTypeUid?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryAnalysisSpecificationUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAnalysisUncertaintyByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAuditLogsFilterArgs = {
  targetId: Scalars['String']['input'];
  targetType: Scalars['String']['input'];
};


export type QueryClientAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryClientByCodeArgs = {
  code: Scalars['String']['input'];
};


export type QueryClientByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryClientContactByClientUidArgs = {
  clientUid: Scalars['String']['input'];
};


export type QueryClientContactUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryClientSearchArgs = {
  queryString: Scalars['String']['input'];
};


export type QueryClientsByNameArgs = {
  name: Scalars['String']['input'];
};


export type QueryCountAnalyteGroupByInstrumentArgs = {
  endDate?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCountSampleGroupByActionArgs = {
  endDate?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCountryByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryDepartmentByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryDistrictAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryDistrictByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryDistrictsByProvinceUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryGroupByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryHazardByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryIdentificationByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryImpressReportDownloadArgs = {
  uid: Scalars['String']['input'];
};


export type QueryImpressReportsDownloadArgs = {
  uids: Array<Scalars['String']['input']>;
};


export type QueryImpressReportsMetaArgs = {
  uids: Array<Scalars['String']['input']>;
};


export type QueryInstrumentAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryInstrumentByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryInstrumentTypeAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryInstrumentTypeByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryLaboratoryArgs = {
  setupName: Scalars['String']['input'];
};


export type QueryLaboratorySettingArgs = {
  setupName: Scalars['String']['input'];
};


export type QueryManifestReportDownloadArgs = {
  uid: Scalars['String']['input'];
};


export type QueryManufacturerByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryMethodAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryMethodByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryNoticeByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryNoticeFilterArgs = {
  departmentUid?: InputMaybe<Scalars['String']['input']>;
  groupUid?: InputMaybe<Scalars['String']['input']>;
};


export type QueryNoticesByCreatorArgs = {
  uid: Scalars['String']['input'];
};


export type QueryNotificationByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryNotificationFilterArgs = {
  departmentUid?: InputMaybe<Scalars['String']['input']>;
  groupUid?: InputMaybe<Scalars['String']['input']>;
  userUid?: InputMaybe<Scalars['String']['input']>;
};


export type QueryPatientAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryPatientByPatientIdArgs = {
  patientId: Scalars['String']['input'];
};


export type QueryPatientByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryPatientSearchArgs = {
  queryString: Scalars['String']['input'];
};


export type QueryPermissionByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryProfileByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryProfileMappingsByProfileArgs = {
  profileUid: Scalars['String']['input'];
};


export type QueryProvinceAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryProvinceByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryProvincesByCountryUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryQcLevelByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryQcSetAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryQcSetByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryQcTemplateByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryReferralLaboratoryByCodeArgs = {
  code: Scalars['String']['input'];
};


export type QueryReferralLaboratoryByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryReflexRuleAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryReflexRuleByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryRejectionReasonByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryResultOptionsByAnalysisUidArgs = {
  uid: Scalars['String']['input'];
};


export type QuerySampleAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  clientUid?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  status?: InputMaybe<Scalars['String']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySampleByParentIdArgs = {
  parentId: Scalars['String']['input'];
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySampleByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QuerySampleCountArgs = {
  clientUid: Scalars['String']['input'];
  status: Scalars['String']['input'];
  text: Scalars['String']['input'];
};


export type QuerySampleProcessPerformanceArgs = {
  endDate: Scalars['String']['input'];
  startDate: Scalars['String']['input'];
};


export type QuerySampleSearchArgs = {
  clientUid: Scalars['String']['input'];
  status: Scalars['String']['input'];
  text: Scalars['String']['input'];
};


export type QuerySampleTypeByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QuerySampleTypeMappingsBySampleTypeArgs = {
  sampleTypeUid: Scalars['String']['input'];
};


export type QuerySamplesByStorageContainerUidArgs = {
  uid: Scalars['String']['input'];
};


export type QuerySamplesByUidsArgs = {
  sampleUids?: Array<Scalars['String']['input']>;
};


export type QuerySamplesForShipmentAssignArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  analysisUid?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sampleTypeUid?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryShipmentAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  incoming?: Scalars['Boolean']['input'];
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  status?: InputMaybe<Scalars['String']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryShipmentByIdArgs = {
  shipmentId: Scalars['String']['input'];
};


export type QueryShipmentByStatusArgs = {
  shipmentStatus: Scalars['String']['input'];
};


export type QueryShipmentByUidArgs = {
  shipmentUid: Scalars['String']['input'];
};


export type QueryStockAdjustmentAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryStockAdjustmentByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryStockCategoryByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryStockItemAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryStockItemByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryStockOrderAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  status?: InputMaybe<Scalars['String']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryStockOrderByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryStockOrderProductAllArgs = {
  stockOrderUid: Scalars['String']['input'];
};


export type QueryStockOrderProductByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryStockPackagingByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryStockProductAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryStockProductByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryStockTransactionAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryStockTransactionByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryStockUnitByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryStorageContainerByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryStorageContainersArgs = {
  storageSectionUid: Scalars['String']['input'];
};


export type QueryStorageLocationByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryStorageLocationsArgs = {
  storeRoomUid: Scalars['String']['input'];
};


export type QueryStorageSectionByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryStorageSectionsArgs = {
  storageLocationUid: Scalars['String']['input'];
};


export type QueryStoreRoomByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QuerySupplierByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryThreadByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryThreadsForUserArgs = {
  uid: Scalars['String']['input'];
};


export type QueryUnitByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryUserAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryUserByEmailArgs = {
  email: Scalars['String']['input'];
};


export type QueryUserMeArgs = {
  token: Scalars['String']['input'];
};


export type QueryWorksheetAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  status?: InputMaybe<Scalars['String']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryWorksheetByAnalystArgs = {
  analystUid: Scalars['String']['input'];
};


export type QueryWorksheetByIdArgs = {
  worksheetId: Scalars['String']['input'];
};


export type QueryWorksheetByStatusArgs = {
  worksheetStatus: Scalars['String']['input'];
};


export type QueryWorksheetByUidArgs = {
  worksheetUid: Scalars['String']['input'];
};


export type QueryWorksheetTemplateByUidArgs = {
  worksheetUid: Scalars['String']['input'];
};

export type ReferenceSampleInput = {
  analyses: Array<Scalars['String']['input']>;
  sampleUid?: InputMaybe<Scalars['String']['input']>;
  shipedSampleUid?: InputMaybe<Scalars['String']['input']>;
};

export type ReferralLaboratoryInputType = {
  code: Scalars['String']['input'];
  isReference?: Scalars['Boolean']['input'];
  isReferral?: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  url: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type ReferralLaboratoryResponse = OperationError | ReferralLaboratoryType;

export type ReferralLaboratoryType = {
  __typename?: 'ReferralLaboratoryType';
  code?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  isReference?: Maybe<Scalars['Boolean']['output']>;
  isReferral?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  password?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};

export type ReflexActionInput = {
  analyses: Array<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  level: Scalars['Int']['input'];
  reflexRuleUid: Scalars['String']['input'];
  sampleTypeUid?: InputMaybe<Scalars['String']['input']>;
};

export type ReflexActionResponse = OperationError | ReflexActionType;

export type ReflexActionType = {
  __typename?: 'ReflexActionType';
  analyses?: Maybe<Array<AnalysisType>>;
  brains?: Maybe<Array<ReflexBrainType>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description: Scalars['String']['output'];
  level: Scalars['Int']['output'];
  reflexRule?: Maybe<ReflexRuleType>;
  reflexRuleUid: Scalars['String']['output'];
  sampleType?: Maybe<SampleTypeTyp>;
  sampleTypeUid?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type ReflexAddNewInput = {
  analysisUid: Scalars['String']['input'];
  count: Scalars['Int']['input'];
};

export type ReflexBrainAdditionType = {
  __typename?: 'ReflexBrainAdditionType';
  analysis?: Maybe<AnalysisType>;
  analysisUid: Scalars['String']['output'];
  count: Scalars['Int']['output'];
  reflexBrain?: Maybe<ReflexBrainType>;
  reflexBrainUid: Scalars['String']['output'];
};

export type ReflexBrainCriteriaType = {
  __typename?: 'ReflexBrainCriteriaType';
  analysis?: Maybe<AnalysisType>;
  analysisUid: Scalars['String']['output'];
  operator: Scalars['String']['output'];
  reflexBrain?: Maybe<ReflexBrainType>;
  reflexBrainUid: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type ReflexBrainFinalType = {
  __typename?: 'ReflexBrainFinalType';
  analysis?: Maybe<AnalysisType>;
  analysisUid: Scalars['String']['output'];
  reflexBrain?: Maybe<ReflexBrainType>;
  reflexBrainUid: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type ReflexBrainInput = {
  addNew?: InputMaybe<Array<ReflexAddNewInput>>;
  analysesValues?: InputMaybe<Array<ReflexCriteriaInput>>;
  description: Scalars['String']['input'];
  finalise?: InputMaybe<Array<ReflexFinalInput>>;
  reflexActionUid: Scalars['String']['input'];
};

export type ReflexBrainResponse = OperationError | ReflexBrainType;

export type ReflexBrainType = {
  __typename?: 'ReflexBrainType';
  addNew?: Maybe<Array<ReflexBrainAdditionType>>;
  analysesValues?: Maybe<Array<ReflexBrainCriteriaType>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description: Scalars['String']['output'];
  finalise?: Maybe<Array<ReflexBrainFinalType>>;
  reflexAction?: Maybe<ReflexBrainType>;
  reflexActionUid: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type ReflexCriteriaInput = {
  analysisUid: Scalars['String']['input'];
  operator: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type ReflexFinalInput = {
  analysisUid: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type ReflexRuleCursorPage = {
  __typename?: 'ReflexRuleCursorPage';
  edges?: Maybe<Array<ReflexRuleEdge>>;
  items?: Maybe<Array<ReflexRuleType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ReflexRuleEdge = {
  __typename?: 'ReflexRuleEdge';
  cursor: Scalars['String']['output'];
  node: ReflexRuleType;
};

export type ReflexRuleInput = {
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type ReflexRuleResponse = OperationError | ReflexRuleType;

export type ReflexRuleType = {
  __typename?: 'ReflexRuleType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description: Scalars['String']['output'];
  name: Scalars['String']['output'];
  reflexActions?: Maybe<Array<ReflexActionType>>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type RejectionReasonResponse = OperationError | RejectionReasonType;

export type RejectionReasonType = {
  __typename?: 'RejectionReasonType';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  reason: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type ReportImpressType = {
  __typename?: 'ReportImpressType';
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  dateGenerated?: Maybe<Scalars['DateTime']['output']>;
  emailRequired?: Maybe<Scalars['Boolean']['output']>;
  emailSent?: Maybe<Scalars['Boolean']['output']>;
  generatedBy?: Maybe<UserType>;
  generatedByUid?: Maybe<Scalars['String']['output']>;
  jsonContent?: Maybe<Scalars['JSONScalar']['output']>;
  pdfContent?: Maybe<Scalars['BytesScalar']['output']>;
  sample?: Maybe<SampleType>;
  sampleUid?: Maybe<Scalars['String']['output']>;
  smsRequired?: Maybe<Scalars['Boolean']['output']>;
  smsSent?: Maybe<Scalars['Boolean']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type ReportMetaType = {
  __typename?: 'ReportMetaType';
  analyses?: Maybe<Array<AnalysisType>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  dateColumn: Scalars['String']['output'];
  location?: Maybe<Scalars['String']['output']>;
  periodEnd: Scalars['DateTime']['output'];
  periodStart: Scalars['DateTime']['output'];
  reportType: Scalars['String']['output'];
  sampleStates?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  temp?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type ReservedInputType = {
  levelUid?: InputMaybe<Scalars['String']['input']>;
  position: Scalars['Int']['input'];
};

export type ResultListingType = {
  __typename?: 'ResultListingType';
  results: Array<AnalysisResultType>;
};

export type ResultOptionInputType = {
  analysisUid: Scalars['String']['input'];
  optionKey: Scalars['Int']['input'];
  value: Scalars['String']['input'];
};

export type ResultOptionResponse = OperationError | ResultOptionType;

export type ResultOptionType = {
  __typename?: 'ResultOptionType';
  analysisUid: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  optionKey: Scalars['Int']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  value: Scalars['String']['output'];
};

/** Union of possible outcomes when actioning samples */
export type ResultedSampleActionResponse = OperationError | ResultedSampleListingType;

export type ResultedSampleListingType = {
  __typename?: 'ResultedSampleListingType';
  samples: Array<SamplesWithResults>;
};

/** Union of possible outcomes when actioning samples */
export type SampleActionResponse = OperationError | SampleListingType;

export type SampleCursorPage = {
  __typename?: 'SampleCursorPage';
  edges?: Maybe<Array<SampleEdge>>;
  items?: Maybe<Array<SamplesWithResults>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type SampleEdge = {
  __typename?: 'SampleEdge';
  cursor: Scalars['String']['output'];
  node: SamplesWithResults;
};

export type SampleListingType = {
  __typename?: 'SampleListingType';
  samples: Array<SampleType>;
};

export type SamplePublishInputType = {
  action?: Scalars['String']['input'];
  uid: Scalars['String']['input'];
};

export type SampleRejectInputType = {
  other?: InputMaybe<Scalars['String']['input']>;
  reasons: Array<Scalars['String']['input']>;
  uid: Scalars['String']['input'];
};

export type SampleType = {
  __typename?: 'SampleType';
  analyses?: Maybe<Array<AnalysisType>>;
  analysisRequest?: Maybe<AnalysisRequestType>;
  analysisRequestUid: Scalars['String']['output'];
  assigned: Scalars['Boolean']['output'];
  cancelledBy?: Maybe<UserType>;
  cancelledByUid?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  dateCancelled?: Maybe<Scalars['DateTime']['output']>;
  dateCollected?: Maybe<Scalars['DateTime']['output']>;
  dateInvalidated?: Maybe<Scalars['DateTime']['output']>;
  datePrinted?: Maybe<Scalars['DateTime']['output']>;
  datePublished?: Maybe<Scalars['DateTime']['output']>;
  dateReceived?: Maybe<Scalars['DateTime']['output']>;
  dateRetrievedFromStorage?: Maybe<Scalars['DateTime']['output']>;
  dateStored?: Maybe<Scalars['DateTime']['output']>;
  dateSubmitted?: Maybe<Scalars['DateTime']['output']>;
  dateVerified?: Maybe<Scalars['DateTime']['output']>;
  dueDate?: Maybe<Scalars['DateTime']['output']>;
  internalUse: Scalars['Boolean']['output'];
  invalidatedBy?: Maybe<UserType>;
  invalidatedByUid?: Maybe<Scalars['String']['output']>;
  parent?: Maybe<SampleType>;
  parentId?: Maybe<Scalars['String']['output']>;
  printed?: Maybe<Scalars['Boolean']['output']>;
  printedBy?: Maybe<UserType>;
  printedByUid?: Maybe<Scalars['String']['output']>;
  priority: Scalars['Int']['output'];
  profiles?: Maybe<Array<ProfileType>>;
  publishedBy?: Maybe<UserType>;
  publishedByUid?: Maybe<Scalars['String']['output']>;
  qcLevel?: Maybe<QcLevelType>;
  qcLevelUid?: Maybe<Scalars['String']['output']>;
  qcSet?: Maybe<QcSetType>;
  qcSetUid?: Maybe<Scalars['String']['output']>;
  receivedBy?: Maybe<UserType>;
  receivedByUid?: Maybe<Scalars['String']['output']>;
  rejectionReasons?: Maybe<Array<RejectionReasonType>>;
  sampleId: Scalars['String']['output'];
  sampleType?: Maybe<SampleTypeTyp>;
  sampleTypeUid: Scalars['String']['output'];
  status?: Maybe<Scalars['String']['output']>;
  storageContainer?: Maybe<StorageContainerType>;
  storageContainerUid?: Maybe<Scalars['String']['output']>;
  storageSlot?: Maybe<Scalars['String']['output']>;
  storageSlotIndex?: Maybe<Scalars['Int']['output']>;
  storedBy?: Maybe<UserType>;
  storedByUid?: Maybe<Scalars['String']['output']>;
  submittedBy?: Maybe<UserType>;
  submittedByUid?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  verifiedBy?: Maybe<UserType>;
  verifiedByUid?: Maybe<Scalars['String']['output']>;
};

export type SampleTypeInputType = {
  abbr: Scalars['String']['input'];
  active?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  internalUse?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
};

export type SampleTypeMappingInputType = {
  code: Scalars['String']['input'];
  codingStandardUid: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  sampleTypeUid: Scalars['String']['input'];
};

/** Union of possible outcomes when adding a new notice */
export type SampleTypeMappingResponse = OperationError | SampleTypeMappingType;

export type SampleTypeMappingType = {
  __typename?: 'SampleTypeMappingType';
  code: Scalars['String']['output'];
  codingStandard?: Maybe<CodingStandardType>;
  codingStandardUid: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  sampleType?: Maybe<SampleTypeTyp>;
  sampleTypeUid: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type SampleTypeResponse = OperationError | SampleTypeTyp;

export type SampleTypeTyp = {
  __typename?: 'SampleTypeTyp';
  abbr: Scalars['String']['output'];
  active: Scalars['Boolean']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  internalUse: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type SamplesWithResults = {
  __typename?: 'SamplesWithResults';
  analyses?: Maybe<Array<AnalysisType>>;
  analysisRequest?: Maybe<AnalysisRequestType>;
  analysisRequestUid: Scalars['String']['output'];
  analysisResults?: Maybe<Array<AnalysisResultType>>;
  assigned: Scalars['Boolean']['output'];
  cancelledBy?: Maybe<UserType>;
  cancelledByUid?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  dateCancelled?: Maybe<Scalars['DateTime']['output']>;
  dateCollected?: Maybe<Scalars['DateTime']['output']>;
  dateInvalidated?: Maybe<Scalars['DateTime']['output']>;
  datePrinted?: Maybe<Scalars['DateTime']['output']>;
  datePublished?: Maybe<Scalars['DateTime']['output']>;
  dateReceived?: Maybe<Scalars['DateTime']['output']>;
  dateRetrievedFromStorage?: Maybe<Scalars['DateTime']['output']>;
  dateStored?: Maybe<Scalars['DateTime']['output']>;
  dateSubmitted?: Maybe<Scalars['DateTime']['output']>;
  dateVerified?: Maybe<Scalars['DateTime']['output']>;
  dueDate?: Maybe<Scalars['DateTime']['output']>;
  internalUse: Scalars['Boolean']['output'];
  invalidatedBy?: Maybe<UserType>;
  invalidatedByUid?: Maybe<Scalars['String']['output']>;
  parent?: Maybe<SampleType>;
  parentId?: Maybe<Scalars['String']['output']>;
  printed?: Maybe<Scalars['Boolean']['output']>;
  printedBy?: Maybe<UserType>;
  printedByUid?: Maybe<Scalars['String']['output']>;
  priority: Scalars['Int']['output'];
  profiles?: Maybe<Array<ProfileType>>;
  publishedBy?: Maybe<UserType>;
  publishedByUid?: Maybe<Scalars['String']['output']>;
  qcLevel?: Maybe<QcLevelType>;
  qcLevelUid?: Maybe<Scalars['String']['output']>;
  qcSet?: Maybe<QcSetType>;
  qcSetUid?: Maybe<Scalars['String']['output']>;
  receivedBy?: Maybe<UserType>;
  receivedByUid?: Maybe<Scalars['String']['output']>;
  rejectionReasons?: Maybe<Array<RejectionReasonType>>;
  sampleId: Scalars['String']['output'];
  sampleType?: Maybe<SampleTypeTyp>;
  sampleTypeUid: Scalars['String']['output'];
  status?: Maybe<Scalars['String']['output']>;
  storageContainer?: Maybe<StorageContainerType>;
  storageContainerUid?: Maybe<Scalars['String']['output']>;
  storageSlot?: Maybe<Scalars['String']['output']>;
  storageSlotIndex?: Maybe<Scalars['Int']['output']>;
  storedBy?: Maybe<UserType>;
  storedByUid?: Maybe<Scalars['String']['output']>;
  submittedBy?: Maybe<UserType>;
  submittedByUid?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  verifiedBy?: Maybe<UserType>;
  verifiedByUid?: Maybe<Scalars['String']['output']>;
};

export type ShipmentCursorPage = {
  __typename?: 'ShipmentCursorPage';
  edges?: Maybe<Array<ShipmentEdge>>;
  items?: Maybe<Array<ShipmentType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ShipmentEdge = {
  __typename?: 'ShipmentEdge';
  cursor: Scalars['String']['output'];
  node: ShipmentType;
};

export type ShipmentInputType = {
  comment?: InputMaybe<Scalars['String']['input']>;
  count?: InputMaybe<Scalars['Int']['input']>;
  courier: Scalars['String']['input'];
  laboratoryUid?: InputMaybe<Scalars['String']['input']>;
};

export type ShipmentListingType = {
  __typename?: 'ShipmentListingType';
  shipments?: Maybe<Array<ShipmentType>>;
};

export type ShipmentManageSamplesInput = {
  action: Scalars['String']['input'];
  samples: Array<ReferenceSampleInput>;
};

export type ShipmentResponse = OperationError | ShipmentType;

export type ShipmentType = {
  __typename?: 'ShipmentType';
  assignedCount?: Maybe<Scalars['Int']['output']>;
  comment?: Maybe<Scalars['String']['output']>;
  courier?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  data?: Maybe<Scalars['JSONScalar']['output']>;
  dateDispatched?: Maybe<Scalars['DateTime']['output']>;
  dateFinalised?: Maybe<Scalars['DateTime']['output']>;
  dateRecalled?: Maybe<Scalars['DateTime']['output']>;
  dateReceived?: Maybe<Scalars['DateTime']['output']>;
  dateRejected?: Maybe<Scalars['DateTime']['output']>;
  dispatchedBy?: Maybe<UserType>;
  dispatchedByUid?: Maybe<Scalars['String']['output']>;
  finalisedBy?: Maybe<UserType>;
  finalisedByUid?: Maybe<Scalars['String']['output']>;
  incoming?: Maybe<Scalars['Boolean']['output']>;
  jsonContent?: Maybe<Scalars['JSONScalar']['output']>;
  laboratory?: Maybe<ReferralLaboratoryType>;
  laboratoryUid?: Maybe<Scalars['String']['output']>;
  pdfContent?: Maybe<Scalars['BytesScalar']['output']>;
  recalledBy?: Maybe<UserType>;
  recalledByUid?: Maybe<Scalars['String']['output']>;
  receivedBy?: Maybe<UserType>;
  receivedByUid?: Maybe<Scalars['String']['output']>;
  rejectedBy?: Maybe<UserType>;
  rejectedByUid?: Maybe<Scalars['String']['output']>;
  samples?: Maybe<Array<SampleType>>;
  shipmentId?: Maybe<Scalars['String']['output']>;
  shippedSamples?: Maybe<Array<ShippedSampleType>>;
  state?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type ShipmentUpdateInputType = {
  comment?: InputMaybe<Scalars['String']['input']>;
  courier: Scalars['String']['input'];
  laboratoryUid?: InputMaybe<Scalars['String']['input']>;
};

export type ShipmentsResponse = OperationError | ShipmentListingType;

export type ShippedSampleType = {
  __typename?: 'ShippedSampleType';
  extSampleId?: Maybe<Scalars['String']['output']>;
  extSampleUid?: Maybe<Scalars['String']['output']>;
  resultNotified?: Maybe<Scalars['Boolean']['output']>;
  sample: SampleType;
  sampleUid: Scalars['String']['output'];
  shipment: ShipmentType;
  shipmentUid: Scalars['String']['output'];
};

export type StockAdjustmentCursorPage = {
  __typename?: 'StockAdjustmentCursorPage';
  edges?: Maybe<Array<StockAdjustmentEdge>>;
  items?: Maybe<Array<StockAdjustmentType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type StockAdjustmentEdge = {
  __typename?: 'StockAdjustmentEdge';
  cursor: Scalars['String']['output'];
  node: StockAdjustmentType;
};

export type StockAdjustmentInputType = {
  adjust: Scalars['Int']['input'];
  adjustmentType: Scalars['String']['input'];
  productUid: Scalars['String']['input'];
  remarks?: InputMaybe<Scalars['String']['input']>;
};

export type StockAdjustmentResponse = OperationError | StockAdjustmentType;

export type StockAdjustmentType = {
  __typename?: 'StockAdjustmentType';
  adjust?: Maybe<Scalars['Int']['output']>;
  adjustmentBy?: Maybe<UserType>;
  adjustmentByUid?: Maybe<Scalars['String']['output']>;
  adjustmentDate?: Maybe<Scalars['DateTime']['output']>;
  adjustmentType?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  product?: Maybe<StockProductType>;
  productUid?: Maybe<Scalars['String']['output']>;
  remarks?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type StockCategoryInputType = {
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type StockCategoryResponse = OperationError | StockCategoryType;

export type StockCategoryType = {
  __typename?: 'StockCategoryType';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type StockItemCursorPage = {
  __typename?: 'StockItemCursorPage';
  edges?: Maybe<Array<StockItemEdge>>;
  items?: Maybe<Array<StockItemType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type StockItemEdge = {
  __typename?: 'StockItemEdge';
  cursor: Scalars['String']['output'];
  node: StockItemType;
};

export type StockItemInputType = {
  departmentUid?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  maximumLevel?: InputMaybe<Scalars['Int']['input']>;
  minimumLevel?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
};

export type StockItemResponse = OperationError | StockItemType;

export type StockItemType = {
  __typename?: 'StockItemType';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  department?: Maybe<DepartmentType>;
  departmentUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  maximumLevel?: Maybe<Scalars['Int']['output']>;
  minimumLevel?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type StockOrderApprovalInputType = {
  remarks: Scalars['String']['input'];
  status: Scalars['String']['input'];
};

export type StockOrderCursorPage = {
  __typename?: 'StockOrderCursorPage';
  edges?: Maybe<Array<StockOrderEdge>>;
  items?: Maybe<Array<StockOrderType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type StockOrderEdge = {
  __typename?: 'StockOrderEdge';
  cursor: Scalars['String']['output'];
  node: StockOrderType;
};

export type StockOrderInputType = {
  departmentUid?: InputMaybe<Scalars['String']['input']>;
  orderProducts: Array<StockOrderProductLineInputType>;
};

export type StockOrderLineType = {
  __typename?: 'StockOrderLineType';
  orderProducts: Array<StockOrderProductType>;
  stockOrder: StockOrderType;
};

export type StockOrderProductLineInputType = {
  productUid: Scalars['String']['input'];
  quantity: Scalars['Int']['input'];
  remarks?: InputMaybe<Scalars['String']['input']>;
};

export type StockOrderProductType = {
  __typename?: 'StockOrderProductType';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  order?: Maybe<StockOrderType>;
  orderUid?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['Int']['output']>;
  product?: Maybe<StockProductType>;
  productUid?: Maybe<Scalars['String']['output']>;
  quantity?: Maybe<Scalars['Int']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type StockOrderResponse = OperationError | StockOrderLineType | StockOrderType;

export type StockOrderType = {
  __typename?: 'StockOrderType';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  department?: Maybe<DepartmentType>;
  departmentUid?: Maybe<Scalars['String']['output']>;
  fullfilledBy?: Maybe<UserType>;
  fullfilledByUid?: Maybe<Scalars['String']['output']>;
  orderBy?: Maybe<UserType>;
  orderByUid?: Maybe<Scalars['String']['output']>;
  orderNumber?: Maybe<Scalars['String']['output']>;
  remarks?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type StockPackagingInputType = {
  name: Scalars['String']['input'];
};

export type StockPackagingResponse = OperationError | StockPackagingType;

export type StockPackagingType = {
  __typename?: 'StockPackagingType';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type StockProductCursorPage = {
  __typename?: 'StockProductCursorPage';
  edges?: Maybe<Array<StockProductEdge>>;
  items?: Maybe<Array<StockProductType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type StockProductEdge = {
  __typename?: 'StockProductEdge';
  cursor: Scalars['String']['output'];
  node: StockProductType;
};

export type StockProductInputType = {
  batch?: InputMaybe<Scalars['String']['input']>;
  categoryUid?: InputMaybe<Scalars['String']['input']>;
  dateReceived?: InputMaybe<Scalars['DateTime']['input']>;
  departmentUid?: InputMaybe<Scalars['String']['input']>;
  expiryDate?: InputMaybe<Scalars['DateTime']['input']>;
  hazardUid?: InputMaybe<Scalars['String']['input']>;
  lotNumber?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  packagingUid?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Int']['input']>;
  quantityReceived?: InputMaybe<Scalars['Int']['input']>;
  receivedByUid?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  stockItemUid?: InputMaybe<Scalars['String']['input']>;
  storeRoomUid?: InputMaybe<Scalars['String']['input']>;
  supplierUid?: InputMaybe<Scalars['String']['input']>;
  unitUid?: InputMaybe<Scalars['String']['input']>;
};

export type StockProductResponse = OperationError | StockProductType;

export type StockProductType = {
  __typename?: 'StockProductType';
  batch?: Maybe<Scalars['String']['output']>;
  category?: Maybe<StockCategoryType>;
  categoryUid?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  dateReceived?: Maybe<Scalars['DateTime']['output']>;
  department?: Maybe<DepartmentType>;
  departmentUid?: Maybe<Scalars['String']['output']>;
  expiryDate?: Maybe<Scalars['DateTime']['output']>;
  hazard?: Maybe<HazardType>;
  hazardUid?: Maybe<Scalars['String']['output']>;
  lotNumber?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  packaging?: Maybe<StockPackagingType>;
  packagingUid?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['Int']['output']>;
  quantityReceived?: Maybe<Scalars['Int']['output']>;
  receivedBy?: Maybe<UserType>;
  receivedByUid?: Maybe<Scalars['String']['output']>;
  remaining?: Maybe<Scalars['Int']['output']>;
  size?: Maybe<Scalars['Int']['output']>;
  stockItem?: Maybe<StockItemType>;
  stockItemUid?: Maybe<Scalars['String']['output']>;
  storeRoom?: Maybe<StoreRoomType>;
  storeRoomUid?: Maybe<Scalars['String']['output']>;
  supplier?: Maybe<SupplierType>;
  supplierUid?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  unit?: Maybe<StockUnitType>;
  unitUid?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type StockTransactionCursorPage = {
  __typename?: 'StockTransactionCursorPage';
  edges?: Maybe<Array<StockTransactionEdge>>;
  items?: Maybe<Array<StockTransactionType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type StockTransactionEdge = {
  __typename?: 'StockTransactionEdge';
  cursor: Scalars['String']['output'];
  node: StockTransactionType;
};

export type StockTransactionInputType = {
  departmentUid?: InputMaybe<Scalars['String']['input']>;
  issued: Scalars['Int']['input'];
  issuedToUid: Scalars['String']['input'];
  productUid: Scalars['String']['input'];
};

export type StockTransactionResponse = OperationError | StockTransactionType;

export type StockTransactionType = {
  __typename?: 'StockTransactionType';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  dateIssued?: Maybe<Scalars['DateTime']['output']>;
  department?: Maybe<DepartmentType>;
  departmentUid?: Maybe<Scalars['String']['output']>;
  issued?: Maybe<Scalars['Int']['output']>;
  issuedTo?: Maybe<UserType>;
  issuedToUid?: Maybe<Scalars['String']['output']>;
  product?: Maybe<StockProductType>;
  productUid?: Maybe<Scalars['String']['output']>;
  transactionBy?: Maybe<UserType>;
  transactionByUid?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type StockUnitInputType = {
  name: Scalars['String']['input'];
};

export type StockUnitResponse = OperationError | StockUnitType;

export type StockUnitType = {
  __typename?: 'StockUnitType';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type StorageContainerInputType = {
  cols?: InputMaybe<Scalars['Int']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  grid?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  rowWise?: InputMaybe<Scalars['Boolean']['input']>;
  rows?: InputMaybe<Scalars['Int']['input']>;
  slots?: InputMaybe<Scalars['Int']['input']>;
  storageSectionUid: Scalars['String']['input'];
};

export type StorageContainerResponse = OperationError | StorageContainerType;

export type StorageContainerType = {
  __typename?: 'StorageContainerType';
  cols?: Maybe<Scalars['Int']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  grid?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  rowWise?: Maybe<Scalars['Boolean']['output']>;
  rows?: Maybe<Scalars['Int']['output']>;
  slots?: Maybe<Scalars['Int']['output']>;
  storageSection?: Maybe<StorageSectionType>;
  storageSectionUid: Scalars['String']['output'];
  storedCount?: Maybe<Scalars['Int']['output']>;
  tag: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type StorageLocationInputType = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  storeRoomUid: Scalars['String']['input'];
};

export type StorageLocationResponse = OperationError | StorageLocationType;

export type StorageLocationType = {
  __typename?: 'StorageLocationType';
  children: Array<Maybe<StorageSectionType>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  storeRoom?: Maybe<StoreRoomType>;
  storeRoomUid: Scalars['String']['output'];
  tag: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type StorageSectionInputType = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  storageLocationUid: Scalars['String']['input'];
};

export type StorageSectionResponse = OperationError | StorageSectionType;

export type StorageSectionType = {
  __typename?: 'StorageSectionType';
  children: Array<Maybe<StorageContainerType>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  storageLocation?: Maybe<StorageLocationType>;
  storageLocationUid: Scalars['String']['output'];
  tag: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type StoreRoomInputType = {
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type StoreRoomResponse = OperationError | StoreRoomType;

export type StoreRoomType = {
  __typename?: 'StoreRoomType';
  children: Array<Maybe<StorageLocationType>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  tag: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type StoreSampleResponse = OperationError | StoredSamplesType;

export type StoreSamplesInputType = {
  sampleUid: Scalars['String']['input'];
  storageContainerUid: Scalars['String']['input'];
  storageSlot: Scalars['String']['input'];
  storageSlotIndex: Scalars['Int']['input'];
};

export type StoredSamplesType = {
  __typename?: 'StoredSamplesType';
  samples: Array<SampleType>;
};

export type Subscription = {
  __typename?: 'Subscription';
  count: Scalars['Int']['output'];
  latestActivity: ActivityStreamType;
  streamAll: ActivityStreamType;
};


export type SubscriptionCountArgs = {
  target?: Scalars['Int']['input'];
};

/** Union of possible outcomes when deleting some object */
export type SuccessErrorResponse = OperationError | OperationSuccess;

export type SupplierInputType = {
  code?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type SupplierResponse = OperationError | SupplierType;

export type SupplierType = {
  __typename?: 'SupplierType';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type UnitInputType = {
  isSiUnit: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
};

export type UnitResponse = OperationError | UnitType;

export type UnitType = {
  __typename?: 'UnitType';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  isSiUnit: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type UnknownObjectType = {
  __typename?: 'UnknownObjectType';
  message: Scalars['String']['output'];
};

export type UpdatedGroupPerms = {
  __typename?: 'UpdatedGroupPerms';
  group: GroupType;
  permission: PermissionType;
};

export type UpdatedGroupPermsResponse = OperationError | UpdatedGroupPerms;

export type UserAuthType = {
  __typename?: 'UserAuthType';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  creatorName?: Maybe<Scalars['String']['output']>;
  creatorUid?: Maybe<Scalars['String']['output']>;
  isBlocked: Scalars['Boolean']['output'];
  loginRetry: Scalars['Int']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatorName?: Maybe<Scalars['String']['output']>;
  updatorUid?: Maybe<Scalars['String']['output']>;
  userName: Scalars['String']['output'];
  userType?: Maybe<Scalars['String']['output']>;
};

export type UserCursorPage = {
  __typename?: 'UserCursorPage';
  edges?: Maybe<Array<UserEdge>>;
  items?: Maybe<Array<UserType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type UserEdge = {
  __typename?: 'UserEdge';
  cursor: Scalars['String']['output'];
  node: UserType;
};

export type UserPreferenceType = {
  __typename?: 'UserPreferenceType';
  departments?: Maybe<Array<DepartmentType>>;
  expandedMenu?: Maybe<Scalars['Boolean']['output']>;
  theme?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
};

export type UserResponse = OperationError | UserType;

export type UserType = {
  __typename?: 'UserType';
  auth?: Maybe<UserAuthType>;
  authUid?: Maybe<Scalars['String']['output']>;
  avatar?: Maybe<Scalars['String']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  businessPhone?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  creatorName?: Maybe<Scalars['String']['output']>;
  creatorUid?: Maybe<Scalars['String']['output']>;
  defaultRoute?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  groups?: Maybe<Array<GroupType>>;
  isActive: Scalars['Boolean']['output'];
  isSuperuser: Scalars['Boolean']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  mobilePhone?: Maybe<Scalars['String']['output']>;
  preference?: Maybe<UserPreferenceType>;
  preferenceUid?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatorName?: Maybe<Scalars['String']['output']>;
  updatorUid?: Maybe<Scalars['String']['output']>;
};

export type WorkSheetCursorPage = {
  __typename?: 'WorkSheetCursorPage';
  edges?: Maybe<Array<WorkSheetEdge>>;
  items?: Maybe<Array<WorkSheetType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type WorkSheetEdge = {
  __typename?: 'WorkSheetEdge';
  cursor: Scalars['String']['output'];
  node: WorkSheetType;
};

export type WorkSheetResponse = OperationError | WorkSheetType;

export type WorkSheetTemplateResponse = OperationError | WorkSheetTemplateType;

export type WorkSheetTemplateType = {
  __typename?: 'WorkSheetTemplateType';
  analysis?: Maybe<AnalysisType>;
  analysisUid?: Maybe<Scalars['String']['output']>;
  cols?: Maybe<Scalars['Int']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  instrument?: Maybe<InstrumentType>;
  instrumentUid?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  numberOfSamples?: Maybe<Scalars['Int']['output']>;
  qcLevels?: Maybe<Array<QcLevelType>>;
  qcTemplate?: Maybe<QcTemplateType>;
  qcTemplateUid?: Maybe<Scalars['String']['output']>;
  reserved?: Maybe<Scalars['JSONScalar']['output']>;
  rowWise: Scalars['Boolean']['output'];
  rows?: Maybe<Scalars['Int']['output']>;
  sampleType?: Maybe<SampleTypeTyp>;
  sampleTypeUid?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  worksheetType: Scalars['String']['output'];
};

export type WorkSheetType = {
  __typename?: 'WorkSheetType';
  analysis?: Maybe<AnalysisType>;
  analysisResults?: Maybe<Array<AnalysisResultType>>;
  analysisUid?: Maybe<Scalars['String']['output']>;
  analyst?: Maybe<UserType>;
  analystUid?: Maybe<Scalars['String']['output']>;
  assignedCount: Scalars['Int']['output'];
  cols?: Maybe<Scalars['Int']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  dateSubmitted?: Maybe<Scalars['DateTime']['output']>;
  dateVerified?: Maybe<Scalars['DateTime']['output']>;
  instrument?: Maybe<InstrumentType>;
  instrumentUid?: Maybe<Scalars['String']['output']>;
  numberOfSamples?: Maybe<Scalars['Int']['output']>;
  reserved?: Maybe<Scalars['JSONScalar']['output']>;
  rowWise: Scalars['Boolean']['output'];
  rows?: Maybe<Scalars['Int']['output']>;
  sampleType?: Maybe<SampleTypeTyp>;
  sampleTypeUid?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  submittedBy?: Maybe<UserType>;
  submittedByUid?: Maybe<Scalars['String']['output']>;
  template?: Maybe<WorkSheetTemplateType>;
  templateUid?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  verifiedBy?: Maybe<UserType>;
  verifiedByUid?: Maybe<Scalars['String']['output']>;
  worksheetId: Scalars['String']['output'];
  worksheetType: Scalars['String']['output'];
};

export type WorkSheetTypeSampleTypeAnalysisResultTypeReportMetaTypeUnknownObjectType = AnalysisResultType | ReportMetaType | SampleType | UnknownObjectType | WorkSheetType;

export type WorkSheetsResponse = OperationError | WorksheetListingType;

export type WorksheetListingType = {
  __typename?: 'WorksheetListingType';
  worksheets?: Maybe<Array<WorkSheetType>>;
};

export type WorksheetTemplateInputType = {
  analysisUid?: InputMaybe<Scalars['String']['input']>;
  cols?: InputMaybe<Scalars['Int']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  instrumentUid?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  numberOfSamples?: InputMaybe<Scalars['Int']['input']>;
  profiles?: InputMaybe<Array<Scalars['String']['input']>>;
  qcTemplateUid?: InputMaybe<Scalars['String']['input']>;
  reserved?: InputMaybe<Array<ReservedInputType>>;
  rowWise?: InputMaybe<Scalars['Boolean']['input']>;
  rows?: InputMaybe<Scalars['Int']['input']>;
  sampleTypeUid: Scalars['String']['input'];
  worksheetType?: InputMaybe<Scalars['String']['input']>;
};

export type AuthenticateUserMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type AuthenticateUserMutation = { __typename?: 'Mutation', authenticateUser: { __typename: 'AuthenticatedData', token: string, tokenType: string, user: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null, preferenceUid?: string | null, groups?: Array<{ __typename?: 'GroupType', uid: string, name?: string | null, keyword?: string | null, pages?: string | null, permissions?: Array<{ __typename?: 'PermissionType', uid: string, action?: string | null, target?: string | null }> | null }> | null, preference?: { __typename?: 'UserPreferenceType', expandedMenu?: boolean | null, theme?: string | null, departments?: Array<{ __typename?: 'DepartmentType', uid: string, name?: string | null }> | null } | null } } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddUserMutationVariables = Exact<{
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  email: Scalars['String']['input'];
  groupUid?: InputMaybe<Scalars['String']['input']>;
}>;


export type AddUserMutation = { __typename?: 'Mutation', createUser: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null, email?: string | null, isActive: boolean, isSuperuser: boolean, mobilePhone?: string | null, auth?: { __typename?: 'UserAuthType', uid: string, userName: string, isBlocked: boolean, userType?: string | null } | null, groups?: Array<{ __typename?: 'GroupType', uid: string, name?: string | null, keyword?: string | null, pages?: string | null, permissions?: Array<{ __typename?: 'PermissionType', uid: string, action?: string | null, target?: string | null }> | null }> | null } };

export type EditUserMutationVariables = Exact<{
  userUid: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  groupUid?: InputMaybe<Scalars['String']['input']>;
  mobilePhone?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type EditUserMutation = { __typename?: 'Mutation', updateUser: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null, email?: string | null, isActive: boolean, isSuperuser: boolean, mobilePhone?: string | null, auth?: { __typename?: 'UserAuthType', uid: string, userName: string, isBlocked: boolean, userType?: string | null } | null, groups?: Array<{ __typename?: 'GroupType', uid: string, name?: string | null, keyword?: string | null, pages?: string | null, permissions?: Array<{ __typename?: 'PermissionType', uid: string, action?: string | null, target?: string | null }> | null }> | null } };

export type AddUserAuthMutationVariables = Exact<{
  userUid: Scalars['String']['input'];
  userName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  passwordc: Scalars['String']['input'];
}>;


export type AddUserAuthMutation = { __typename?: 'Mutation', createUserAuth: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null, email?: string | null, isActive: boolean, isSuperuser: boolean, mobilePhone?: string | null, auth?: { __typename?: 'UserAuthType', uid: string, userName: string, isBlocked: boolean, userType?: string | null } | null, groups?: Array<{ __typename?: 'GroupType', uid: string, name?: string | null, keyword?: string | null, pages?: string | null, permissions?: Array<{ __typename?: 'PermissionType', uid: string, action?: string | null, target?: string | null }> | null }> | null } };

export type EditUserAuthMutationVariables = Exact<{
  userUid: Scalars['String']['input'];
  userName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  passwordc: Scalars['String']['input'];
}>;


export type EditUserAuthMutation = { __typename?: 'Mutation', updateUserAuth: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null, email?: string | null, isActive: boolean, isSuperuser: boolean, mobilePhone?: string | null, auth?: { __typename?: 'UserAuthType', uid: string, userName: string, isBlocked: boolean, userType?: string | null } | null, groups?: Array<{ __typename?: 'GroupType', uid: string, name?: string | null, keyword?: string | null, pages?: string | null, permissions?: Array<{ __typename?: 'PermissionType', uid: string, action?: string | null, target?: string | null }> | null }> | null } };

export type AddGroupMutationVariables = Exact<{
  payload: GroupInputType;
}>;


export type AddGroupMutation = { __typename?: 'Mutation', createGroup: { __typename: 'GroupType', uid: string, name?: string | null, pages?: string | null, active?: boolean | null, permissions?: Array<{ __typename?: 'PermissionType', uid: string, action?: string | null, target?: string | null, active?: boolean | null }> | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditGroupMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: GroupInputType;
}>;


export type EditGroupMutation = { __typename?: 'Mutation', updateGroup: { __typename: 'GroupType', uid: string, name?: string | null, pages?: string | null, active?: boolean | null, permissions?: Array<{ __typename?: 'PermissionType', uid: string, action?: string | null, target?: string | null, active?: boolean | null }> | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type UpdateGroupsAndPermissionsMutationVariables = Exact<{
  groupUid: Scalars['String']['input'];
  permissionUid: Scalars['String']['input'];
}>;


export type UpdateGroupsAndPermissionsMutation = { __typename?: 'Mutation', updateGroupPermissions: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'UpdatedGroupPerms', group: { __typename?: 'GroupType', uid: string, name?: string | null, pages?: string | null, active?: boolean | null, permissions?: Array<{ __typename?: 'PermissionType', uid: string, action?: string | null, target?: string | null, active?: boolean | null }> | null }, permission: { __typename?: 'PermissionType', uid: string, action?: string | null, target?: string | null } } };

export type AddDepartmentMutationVariables = Exact<{
  payload: DepartmentInputType;
}>;


export type AddDepartmentMutation = { __typename?: 'Mutation', createDepartment: { __typename?: 'DepartmentType', uid: string, name?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditDepartmentMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: DepartmentInputType;
}>;


export type EditDepartmentMutation = { __typename?: 'Mutation', updateDepartment: { __typename?: 'DepartmentType', uid: string, name?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditLaboratoryMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: LaboratoryInputType;
}>;


export type EditLaboratoryMutation = { __typename?: 'Mutation', updateLaboratory: { __typename?: 'LaboratoryType', uid: string, setupName: string, labName: string, labManagerUid?: string | null, email?: string | null, emailCc?: string | null, mobilePhone?: string | null, businessPhone?: string | null, address?: string | null, logo?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditLaboratorySettingMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: LaboratorySettingInputType;
}>;


export type EditLaboratorySettingMutation = { __typename?: 'Mutation', updateLaboratorySetting: { __typename?: 'LaboratorySettingType', uid: string, laboratoryUid: string, allowSelfVerification?: boolean | null, allowPatientRegistration?: boolean | null, allowSampleRegistration?: boolean | null, allowWorksheetCreation?: boolean | null, defaultRoute?: string | null, passwordLifetime?: number | null, inactivityLogOut?: number | null, defaultTheme?: string | null, autoReceiveSamples?: boolean | null, stickerCopies?: number | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type GetLaboratoryQueryVariables = Exact<{
  setupName?: Scalars['String']['input'];
}>;


export type GetLaboratoryQuery = { __typename?: 'Query', laboratory: { __typename?: 'LaboratoryType', uid: string, setupName: string, labName: string, labManagerUid?: string | null, email?: string | null, emailCc?: string | null, mobilePhone?: string | null, businessPhone?: string | null, address?: string | null, logo?: string | null } };

export type GetLaboratorySettingQueryVariables = Exact<{
  setupName?: Scalars['String']['input'];
}>;


export type GetLaboratorySettingQuery = { __typename?: 'Query', laboratorySetting: { __typename?: 'LaboratorySettingType', uid: string, laboratoryUid: string, allowSelfVerification?: boolean | null, allowPatientRegistration?: boolean | null, allowSampleRegistration?: boolean | null, allowWorksheetCreation?: boolean | null, defaultRoute?: string | null, passwordLifetime?: number | null, inactivityLogOut?: number | null, defaultTheme?: string | null, autoReceiveSamples?: boolean | null, stickerCopies?: number | null } };

export type UserAllQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type UserAllQuery = { __typename?: 'Query', userAll: { __typename?: 'UserCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null, email?: string | null, isActive: boolean, isSuperuser: boolean, mobilePhone?: string | null, auth?: { __typename?: 'UserAuthType', uid: string, userName: string, isBlocked: boolean, userType?: string | null } | null, groups?: Array<{ __typename?: 'GroupType', uid: string, name?: string | null, keyword?: string | null, pages?: string | null, permissions?: Array<{ __typename?: 'PermissionType', uid: string, action?: string | null, target?: string | null }> | null }> | null }> | null } };

export type GroupsAndPermissionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GroupsAndPermissionsQuery = { __typename?: 'Query', groupAll: Array<{ __typename?: 'GroupType', uid: string, name?: string | null, keyword?: string | null, pages?: string | null, active?: boolean | null, permissions?: Array<{ __typename?: 'PermissionType', uid: string, action?: string | null, target?: string | null }> | null }>, permissionAll: Array<{ __typename?: 'PermissionType', uid: string, action?: string | null, target?: string | null }> };

export type GetAuditLogsQueryVariables = Exact<{
  targetType: Scalars['String']['input'];
  targetId: Scalars['String']['input'];
}>;


export type GetAuditLogsQuery = { __typename?: 'Query', auditLogsFilter: Array<{ __typename?: 'AuditLogType', uid: string, userId?: string | null, targetType?: string | null, targetId?: string | null, action?: number | null, stateBefore?: string | null, stateAfter?: string | null }> };

export type GetAllDepartmentsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllDepartmentsQuery = { __typename?: 'Query', departmentAll: Array<{ __typename?: 'DepartmentType', uid: string, name?: string | null, code?: string | null, description?: string | null }> };

export type AddCountryMutationVariables = Exact<{
  payload: CountryInputType;
}>;


export type AddCountryMutation = { __typename?: 'Mutation', createCountry: { __typename: 'CountryType', uid: string, name?: string | null, code?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditCountryMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: CountryInputType;
}>;


export type EditCountryMutation = { __typename?: 'Mutation', updateCountry: { __typename: 'CountryType', uid: string, name?: string | null, code?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddProvinceMutationVariables = Exact<{
  payload: ProvinceInputType;
}>;


export type AddProvinceMutation = { __typename?: 'Mutation', createProvince: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ProvinceType', uid: string, name?: string | null, code?: string | null, countryUid?: string | null } };

export type EditProvinceMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: ProvinceInputType;
}>;


export type EditProvinceMutation = { __typename?: 'Mutation', updateProvince: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ProvinceType', uid: string, name?: string | null, code?: string | null, countryUid?: string | null } };

export type AddDistrictMutationVariables = Exact<{
  payload: DistrictInputType;
}>;


export type AddDistrictMutation = { __typename?: 'Mutation', createDistrict: { __typename: 'DistrictType', uid: string, name?: string | null, code?: string | null, provinceUid?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditDistrictMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: DistrictInputType;
}>;


export type EditDistrictMutation = { __typename?: 'Mutation', updateDistrict: { __typename: 'DistrictType', uid: string, name?: string | null, code?: string | null, provinceUid?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type GetAllCountriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllCountriesQuery = { __typename?: 'Query', countryAll: Array<{ __typename?: 'CountryType', uid: string, name?: string | null, code?: string | null }> };

export type GetAllProvincesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllProvincesQuery = { __typename?: 'Query', provinceAll: { __typename?: 'ProvinceCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'ProvinceType', uid: string, name?: string | null, code?: string | null, email?: string | null, emailCc?: string | null, businessPhone?: string | null, mobilePhone?: string | null, countryUid?: string | null }> | null } };

export type FilterProvincesByCountryQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type FilterProvincesByCountryQuery = { __typename?: 'Query', provincesByCountryUid: Array<{ __typename?: 'ProvinceType', name?: string | null, uid: string, code?: string | null, countryUid?: string | null }> };

export type GetAllDistrictsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllDistrictsQuery = { __typename?: 'Query', districtAll: { __typename?: 'DistrictCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'DistrictType', uid: string, name?: string | null, code?: string | null, email?: string | null, emailCc?: string | null, businessPhone?: string | null, mobilePhone?: string | null, provinceUid?: string | null }> | null } };

export type FilterDistrictsByProvinceQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type FilterDistrictsByProvinceQuery = { __typename?: 'Query', districtsByProvinceUid: Array<{ __typename?: 'DistrictType', name?: string | null, uid: string, code?: string | null, provinceUid?: string | null }> };

export type AddCodingStandardMutationVariables = Exact<{
  payload: CodingStandardInputType;
}>;


export type AddCodingStandardMutation = { __typename?: 'Mutation', createCodingStandard: { __typename: 'CodingStandardType', uid: string, name: string, description?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditCodingStandardMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: CodingStandardInputType;
}>;


export type EditCodingStandardMutation = { __typename?: 'Mutation', updateCodingStandard: { __typename: 'CodingStandardType', uid: string, name: string, description?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddSampleTypeMutationVariables = Exact<{
  payload: SampleTypeInputType;
}>;


export type AddSampleTypeMutation = { __typename?: 'Mutation', createSampleType: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'SampleTypeTyp', uid: string, name: string, abbr: string, description?: string | null, active: boolean } };

export type EditSampleTypeMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: SampleTypeInputType;
}>;


export type EditSampleTypeMutation = { __typename?: 'Mutation', updateSampleType: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'SampleTypeTyp', uid: string, name: string, abbr: string, description?: string | null, active: boolean } };

export type AddSampleTypeMappingMutationVariables = Exact<{
  payload: SampleTypeMappingInputType;
}>;


export type AddSampleTypeMappingMutation = { __typename?: 'Mutation', createSampleTypeMapping: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'SampleTypeMappingType', uid: string, name?: string | null, description?: string | null, code: string, codingStandardUid: string, sampleTypeUid: string, codingStandard?: { __typename?: 'CodingStandardType', name: string } | null } };

export type EditSampleTypeMappingMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: SampleTypeMappingInputType;
}>;


export type EditSampleTypeMappingMutation = { __typename?: 'Mutation', updateSampleTypeMapping: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'SampleTypeMappingType', uid: string, name?: string | null, description?: string | null, code: string, codingStandardUid: string, sampleTypeUid: string, codingStandard?: { __typename?: 'CodingStandardType', name: string } | null } };

export type ReInstateSamplesMutationVariables = Exact<{
  samples: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type ReInstateSamplesMutation = { __typename?: 'Mutation', reInstateSamples: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ResultedSampleListingType', samples: Array<{ __typename?: 'SamplesWithResults', uid: string, status?: string | null }> } };

export type CloneSamplesMutationVariables = Exact<{
  samples: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type CloneSamplesMutation = { __typename?: 'Mutation', cloneSamples: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'SampleListingType', samples: Array<{ __typename?: 'SampleType', uid: string, parentId?: string | null, sampleId: string, priority: number, status?: string | null, sampleType?: { __typename?: 'SampleTypeTyp', uid: string, name: string } | null, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string, sortKey?: number | null }> | null, profiles?: Array<{ __typename?: 'ProfileType', uid: string, name: string }> | null }> } };

export type CancelSamplesMutationVariables = Exact<{
  samples: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type CancelSamplesMutation = { __typename?: 'Mutation', cancelSamples: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ResultedSampleListingType', samples: Array<{ __typename?: 'SamplesWithResults', uid: string, status?: string | null }> } };

export type ReceiveSamplesMutationVariables = Exact<{
  samples: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type ReceiveSamplesMutation = { __typename?: 'Mutation', receiveSamples: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ResultedSampleListingType', samples: Array<{ __typename?: 'SamplesWithResults', uid: string, status?: string | null }> } };

export type PublishSamplesMutationVariables = Exact<{
  samples: Array<SamplePublishInputType> | SamplePublishInputType;
}>;


export type PublishSamplesMutation = { __typename?: 'Mutation', publishSamples: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'OperationSuccess', message: string } };

export type PrintSamplesMutationVariables = Exact<{
  samples: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type PrintSamplesMutation = { __typename?: 'Mutation', printSamples: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'SampleListingType', samples: Array<{ __typename?: 'SampleType', uid: string, status?: string | null }> } };

export type InvalidateSamplesMutationVariables = Exact<{
  samples: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type InvalidateSamplesMutation = { __typename?: 'Mutation', invalidateSamples: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'SampleListingType', samples: Array<{ __typename?: 'SampleType', uid: string, status?: string | null }> } };

export type VerifySamplesMutationVariables = Exact<{
  samples: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type VerifySamplesMutation = { __typename?: 'Mutation', verifySamples: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'SampleListingType', samples: Array<{ __typename?: 'SampleType', uid: string, status?: string | null }> } };

export type RejectSamplesMutationVariables = Exact<{
  samples: Array<SampleRejectInputType> | SampleRejectInputType;
}>;


export type RejectSamplesMutation = { __typename?: 'Mutation', rejectSamples: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'SampleListingType', samples: Array<{ __typename?: 'SampleType', uid: string, status?: string | null, rejectionReasons?: Array<{ __typename?: 'RejectionReasonType', uid: string, reason: string }> | null }> } };

export type AddResultOptionMutationVariables = Exact<{
  payload: ResultOptionInputType;
}>;


export type AddResultOptionMutation = { __typename?: 'Mutation', createResultOption: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'ResultOptionType', uid: string, optionKey: number, value: string, analysisUid: string } };

export type EditResultOptionMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: ResultOptionInputType;
}>;


export type EditResultOptionMutation = { __typename?: 'Mutation', updateResultOption: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'ResultOptionType', uid: string, optionKey: number, value: string, analysisUid: string } };

export type AddAnalysisInterimMutationVariables = Exact<{
  payload: AnalysisInterimInput;
}>;


export type AddAnalysisInterimMutation = { __typename?: 'Mutation', createAnalysisInterim: { __typename?: 'AnalysisInterimType', uid: string, key: number, value: string, analysisUid: string, instrumentUid: string } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditAnalysisInterimMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AnalysisInterimInput;
}>;


export type EditAnalysisInterimMutation = { __typename?: 'Mutation', updateAnalysisInterim: { __typename?: 'AnalysisInterimType', uid: string, key: number, value: string, analysisUid: string, instrumentUid: string } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddAnalysisCorrectionFactorMutationVariables = Exact<{
  payload: AnalysisCorrectionFactorInput;
}>;


export type AddAnalysisCorrectionFactorMutation = { __typename?: 'Mutation', createAnalysisCorrectionFactor: { __typename?: 'AnalysisCorrectionFactorType', uid: string, factor: number, analysisUid: string, instrumentUid: string, methodUid: string } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditAnalysisCorrectionFactorMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AnalysisCorrectionFactorInput;
}>;


export type EditAnalysisCorrectionFactorMutation = { __typename?: 'Mutation', updateAnalysisCorrectionFactor: { __typename?: 'AnalysisCorrectionFactorType', uid: string, factor: number, analysisUid: string, instrumentUid: string, methodUid: string } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddAnalysisUncertaintyMutationVariables = Exact<{
  payload: AnalysisUncertaintyInput;
}>;


export type AddAnalysisUncertaintyMutation = { __typename?: 'Mutation', createAnalysisUncertainty: { __typename?: 'AnalysisUncertaintyType', uid: string, value: number, min: number, max: number, analysisUid: string, instrumentUid: string, methodUid: string } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditAnalysisUncertaintyMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AnalysisUncertaintyInput;
}>;


export type EditAnalysisUncertaintyMutation = { __typename?: 'Mutation', updateAnalysisUncertainty: { __typename?: 'AnalysisUncertaintyType', uid: string, value: number, min: number, max: number, analysisUid: string, instrumentUid: string, methodUid: string } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddAnalysisDetectionLimitMutationVariables = Exact<{
  payload: AnalysisDetectionLimitInput;
}>;


export type AddAnalysisDetectionLimitMutation = { __typename?: 'Mutation', createAnalysisDetectionLimit: { __typename?: 'AnalysisDetectionLimitType', uid: string, lowerLimit: number, upperLimit: number, analysisUid: string, instrumentUid: string, methodUid: string } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditAnalysisDetectionLimitMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AnalysisDetectionLimitInput;
}>;


export type EditAnalysisDetectionLimitMutation = { __typename?: 'Mutation', updateAnalysisDetectionLimit: { __typename?: 'AnalysisDetectionLimitType', uid: string, lowerLimit: number, upperLimit: number, analysisUid: string, instrumentUid: string, methodUid: string } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddAnalysisSpecificationMutationVariables = Exact<{
  payload: AnalysisSpecificationInput;
}>;


export type AddAnalysisSpecificationMutation = { __typename?: 'Mutation', createAnalysisSpecification: { __typename?: 'AnalysisSpecificationType', uid: string, analysisUid: string, min?: number | null, max?: number | null, minWarn?: number | null, maxWarn?: number | null, minReport?: string | null, maxReport?: string | null, warnValues?: string | null, warnReport?: string | null, gender?: string | null, ageMin?: number | null, ageMax?: number | null, methodUid?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditAnalysisSpecificationMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AnalysisSpecificationInput;
}>;


export type EditAnalysisSpecificationMutation = { __typename?: 'Mutation', updateAnalysisSpecification: { __typename?: 'AnalysisSpecificationType', uid: string, analysisUid: string, min?: number | null, max?: number | null, minWarn?: number | null, maxWarn?: number | null, minReport?: string | null, maxReport?: string | null, warnValues?: string | null, warnReport?: string | null, gender?: string | null, ageMin?: number | null, ageMax?: number | null, methodUid?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddAnalysisServiceMutationVariables = Exact<{
  payload: AnalysisInputType;
}>;


export type AddAnalysisServiceMutation = { __typename?: 'Mutation', createAnalysis: { __typename: 'AnalysisWithProfiles', uid: string, name: string, keyword?: string | null, sortKey?: number | null, tatLengthMinutes?: number | null, precision?: number | null, requiredVerifications?: number | null, selfVerification?: boolean | null, description?: string | null, categoryUid?: string | null, departmentUid?: string | null, unitUid?: string | null, unit?: { __typename?: 'UnitType', uid: string, name: string } | null, sampleTypes?: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string }> | null, methods?: Array<{ __typename?: 'MethodType', uid: string, name?: string | null }> | null, resultOptions?: Array<{ __typename?: 'ResultOptionType', uid: string, optionKey: number, value: string }> | null, category?: { __typename?: 'AnalysisCategoryType', uid: string, name: string } | null, profiles?: Array<{ __typename?: 'ProfileType', uid: string, name: string }> | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditAnalysisServiceMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AnalysisInputType;
}>;


export type EditAnalysisServiceMutation = { __typename?: 'Mutation', updateAnalysis: { __typename: 'AnalysisWithProfiles', uid: string, name: string, keyword?: string | null, sortKey?: number | null, tatLengthMinutes?: number | null, precision?: number | null, requiredVerifications?: number | null, selfVerification?: boolean | null, description?: string | null, categoryUid?: string | null, departmentUid?: string | null, unitUid?: string | null, unit?: { __typename?: 'UnitType', uid: string, name: string } | null, sampleTypes?: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string }> | null, methods?: Array<{ __typename?: 'MethodType', uid: string, name?: string | null }> | null, resultOptions?: Array<{ __typename?: 'ResultOptionType', uid: string, optionKey: number, value: string }> | null, category?: { __typename?: 'AnalysisCategoryType', uid: string, name: string } | null, profiles?: Array<{ __typename?: 'ProfileType', uid: string, name: string }> | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddAnalysisMappingMutationVariables = Exact<{
  payload: AnalysisMappingInputType;
}>;


export type AddAnalysisMappingMutation = { __typename?: 'Mutation', createAnalysisMapping: { __typename?: 'AnalysisMappingType', uid: string, name?: string | null, description?: string | null, code: string, codingStandardUid: string, analysisUid: string, codingStandard?: { __typename?: 'CodingStandardType', name: string } | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditAnalysisMappingMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AnalysisMappingInputType;
}>;


export type EditAnalysisMappingMutation = { __typename?: 'Mutation', updateAnalysisMapping: { __typename?: 'AnalysisMappingType', uid: string, name?: string | null, description?: string | null, code: string, codingStandardUid: string, analysisUid: string, codingStandard?: { __typename?: 'CodingStandardType', name: string } | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddAnalysisProfileMutationVariables = Exact<{
  payload: ProfileInputType;
}>;


export type AddAnalysisProfileMutation = { __typename?: 'Mutation', createProfile: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'ProfileType', uid: string, name: string, description?: string | null, keyword?: string | null, active: boolean, departmentUid?: string | null, sampleTypes?: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string }> | null, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string, keyword?: string | null, active?: boolean | null }> | null } };

export type EditAnalysisProfileMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: ProfileInputType;
}>;


export type EditAnalysisProfileMutation = { __typename?: 'Mutation', updateProfile: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'ProfileType', uid: string, name: string, description?: string | null, keyword?: string | null, active: boolean, departmentUid?: string | null, sampleTypes?: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string }> | null, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string, keyword?: string | null, active?: boolean | null }> | null } };

export type AddProfileMappingMutationVariables = Exact<{
  payload: ProfileMappingInputType;
}>;


export type AddProfileMappingMutation = { __typename?: 'Mutation', createProfileMapping: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'ProfileMappingType', uid: string, name?: string | null, description?: string | null, code: string, codingStandardUid: string, profileUid: string, codingStandard?: { __typename?: 'CodingStandardType', name: string } | null } };

export type EditProfileMappingMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: ProfileMappingInputType;
}>;


export type EditProfileMappingMutation = { __typename?: 'Mutation', updateProfileMapping: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'ProfileMappingType', uid: string, name?: string | null, description?: string | null, code: string, codingStandardUid: string, profileUid: string, codingStandard?: { __typename?: 'CodingStandardType', name: string } | null } };

export type AddAnalysisCategoryMutationVariables = Exact<{
  payload: AnalysisCategoryInputType;
}>;


export type AddAnalysisCategoryMutation = { __typename?: 'Mutation', createAnalysisCategory: { __typename?: 'AnalysisCategoryType', uid: string, name: string, active: boolean, description?: string | null, department?: { __typename?: 'DepartmentType', uid: string, name?: string | null } | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditAnalysisCategoryMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AnalysisCategoryInputType;
}>;


export type EditAnalysisCategoryMutation = { __typename?: 'Mutation', updateAnalysisCategory: { __typename?: 'AnalysisCategoryType', uid: string, name: string, active: boolean, description?: string | null, department?: { __typename?: 'DepartmentType', uid: string, name?: string | null } | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddAnalysisRequestMutationVariables = Exact<{
  payload: AnalysisRequestInputType;
}>;


export type AddAnalysisRequestMutation = { __typename?: 'Mutation', createAnalysisRequest: { __typename: 'AnalysisRequestWithSamples', uid: string, clientRequestId: string, createdAt?: any | null, patient: { __typename?: 'PatientType', uid: string, firstName?: string | null, lastName?: string | null, clientPatientId: string, gender?: string | null, dateOfBirth?: any | null, age?: number | null, ageDobEstimated: boolean, consentSms: boolean }, client: { __typename?: 'ClientType', uid: string, name: string }, samples?: Array<{ __typename?: 'SampleType', uid: string, sampleId: string, priority: number, status?: string | null, sampleType?: { __typename?: 'SampleTypeTyp', uid: string, name: string } | null, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string, sortKey?: number | null }> | null, profiles?: Array<{ __typename?: 'ProfileType', uid: string, name: string }> | null }> | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type SubmitAnalysisResultsMutationVariables = Exact<{
  analysisResults: Array<ArResultInputType> | ArResultInputType;
  sourceObject: Scalars['String']['input'];
  sourceObjectUid: Scalars['String']['input'];
}>;


export type SubmitAnalysisResultsMutation = { __typename?: 'Mutation', submitAnalysisResults: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'OperationSuccess', message: string } };

export type CancelAnalysisResultsMutationVariables = Exact<{
  analyses: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type CancelAnalysisResultsMutation = { __typename?: 'Mutation', cancelAnalysisResults: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'ResultListingType', results: Array<{ __typename?: 'AnalysisResultType', uid: string, status?: string | null }> } };

export type ReInstateAnalysisResultsMutationVariables = Exact<{
  analyses: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type ReInstateAnalysisResultsMutation = { __typename?: 'Mutation', reInstateAnalysisResults: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'ResultListingType', results: Array<{ __typename?: 'AnalysisResultType', uid: string, status?: string | null }> } };

export type VerifyAnalysisResultsMutationVariables = Exact<{
  analyses: Array<Scalars['String']['input']> | Scalars['String']['input'];
  sourceObject: Scalars['String']['input'];
  sourceObjectUid: Scalars['String']['input'];
}>;


export type VerifyAnalysisResultsMutation = { __typename?: 'Mutation', verifyAnalysisResults: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'OperationSuccess', message: string } };

export type RetractAnalysisResultsMutationVariables = Exact<{
  analyses: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type RetractAnalysisResultsMutation = { __typename?: 'Mutation', retractAnalysisResults: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'ResultListingType', results: Array<{ __typename?: 'AnalysisResultType', uid: string, status?: string | null, sampleUid: string, result?: string | null, analysisUid?: string | null, retest: boolean, reportable: boolean, createdAt?: any | null, createdByUid?: string | null, updatedAt?: any | null, updatedByUid?: string | null, sample: { __typename?: 'SampleType', uid: string, sampleId: string, status?: string | null, rejectionReasons?: Array<{ __typename?: 'RejectionReasonType', uid: string, reason: string }> | null }, analysis?: { __typename?: 'AnalysisType', uid: string, name: string, unitUid?: string | null, sortKey?: number | null, unit?: { __typename?: 'UnitType', uid: string, name: string } | null, interims?: Array<{ __typename?: 'AnalysisInterimType', uid: string, key: number, value: string, analysisUid: string, instrumentUid: string }> | null, resultOptions?: Array<{ __typename?: 'ResultOptionType', uid: string, optionKey: number, value: string }> | null } | null }> } };

export type RetestAnalysisResultsMutationVariables = Exact<{
  analyses: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type RetestAnalysisResultsMutation = { __typename?: 'Mutation', retestAnalysisResults: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'ResultListingType', results: Array<{ __typename?: 'AnalysisResultType', uid: string, status?: string | null, sampleUid: string, result?: string | null, analysisUid?: string | null, retest: boolean, reportable: boolean, createdAt?: any | null, createdByUid?: string | null, updatedAt?: any | null, updatedByUid?: string | null, sample: { __typename?: 'SampleType', uid: string, sampleId: string, status?: string | null, rejectionReasons?: Array<{ __typename?: 'RejectionReasonType', uid: string, reason: string }> | null }, analysis?: { __typename?: 'AnalysisType', uid: string, name: string, unitUid?: string | null, sortKey?: number | null, unit?: { __typename?: 'UnitType', uid: string, name: string } | null, interims?: Array<{ __typename?: 'AnalysisInterimType', uid: string, key: number, value: string, analysisUid: string, instrumentUid: string }> | null, resultOptions?: Array<{ __typename?: 'ResultOptionType', uid: string, optionKey: number, value: string }> | null } | null }> } };

export type AddQcLevelMutationVariables = Exact<{
  level: Scalars['String']['input'];
}>;


export type AddQcLevelMutation = { __typename?: 'Mutation', createQcLevel: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'QCLevelType', uid: string, level: string } };

export type EditQcLevelMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  level: Scalars['String']['input'];
}>;


export type EditQcLevelMutation = { __typename?: 'Mutation', updateQcLevel: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'QCLevelType', uid: string, level: string } };

export type AddQcTemplateMutationVariables = Exact<{
  payload: QcTemplateInputType;
}>;


export type AddQcTemplateMutation = { __typename?: 'Mutation', createQcTemplate: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'QCTemplateType', uid: string, name: string, description?: string | null, qcLevels: Array<{ __typename?: 'QCLevelType', uid: string, level: string }>, departments: Array<{ __typename?: 'DepartmentType', uid: string, name?: string | null }> } };

export type EditQcTemplateMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: QcTemplateInputType;
}>;


export type EditQcTemplateMutation = { __typename?: 'Mutation', updateQcTemplate: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'QCTemplateType', uid: string, name: string, description?: string | null, qcLevels: Array<{ __typename?: 'QCLevelType', uid: string, level: string }>, departments: Array<{ __typename?: 'DepartmentType', uid: string, name?: string | null }> } };

export type AddQcRequestMutationVariables = Exact<{
  samples: Array<QcSetInputType> | QcSetInputType;
}>;


export type AddQcRequestMutation = { __typename?: 'Mutation', createQcSet: { __typename: 'CreateQCSetData', samples: Array<{ __typename?: 'SampleType', uid: string, sampleId: string, status?: string | null, qcLevel?: { __typename?: 'QCLevelType', uid: string, level: string } | null, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string }> | null, profiles?: Array<{ __typename?: 'ProfileType', uid: string, name: string }> | null }>, qcSets: Array<{ __typename?: 'QCSetType', uid: string, name: string, note: string }> } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddRejectionReasonMutationVariables = Exact<{
  reason: Scalars['String']['input'];
}>;


export type AddRejectionReasonMutation = { __typename?: 'Mutation', createRejectionReason: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'RejectionReasonType', uid: string, reason: string } };

export type EditRejectionReasonMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  reason: Scalars['String']['input'];
}>;


export type EditRejectionReasonMutation = { __typename?: 'Mutation', updateRejectionReason: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'RejectionReasonType', uid: string, reason: string } };

export type GetAllCodingStandardsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllCodingStandardsQuery = { __typename?: 'Query', codingStandardAll: Array<{ __typename?: 'CodingStandardType', uid: string, name: string, description?: string | null }> };

export type GetAllSampleTypesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllSampleTypesQuery = { __typename?: 'Query', sampleTypeAll: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string, abbr: string, description?: string | null, active: boolean }> };

export type GeSampleTypeMappingsBySampleTypeUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GeSampleTypeMappingsBySampleTypeUidQuery = { __typename?: 'Query', sampleTypeMappingsBySampleType: Array<{ __typename?: 'SampleTypeMappingType', uid: string, sampleTypeUid: string, codingStandardUid: string, name?: string | null, code: string, description?: string | null, codingStandard?: { __typename?: 'CodingStandardType', name: string } | null }> };

export type GetAllAnalysesServicesQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetAllAnalysesServicesQuery = { __typename?: 'Query', analysisAll: { __typename?: 'AnalysisCursorPage', items?: Array<{ __typename?: 'AnalysisWithProfiles', uid: string, name: string, keyword?: string | null, active?: boolean | null, sortKey?: number | null, tatLengthMinutes?: number | null, precision?: number | null, requiredVerifications?: number | null, selfVerification?: boolean | null, description?: string | null, categoryUid?: string | null, departmentUid?: string | null, unitUid?: string | null, unit?: { __typename?: 'UnitType', uid: string, name: string } | null, sampleTypes?: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string }> | null, specifications?: Array<{ __typename?: 'AnalysisSpecificationType', uid: string, analysisUid: string, unitUid?: string | null, min?: number | null, max?: number | null, minWarn?: number | null, maxWarn?: number | null, minReport?: string | null, maxReport?: string | null, warnValues?: string | null, warnReport?: string | null, gender?: string | null, ageMin?: number | null, ageMax?: number | null, methodUid?: string | null, unit?: { __typename?: 'UnitType', uid: string, name: string, isSiUnit: boolean } | null }> | null, uncertainties?: Array<{ __typename?: 'AnalysisUncertaintyType', uid: string, min: number, max: number, value: number, analysisUid: string, instrumentUid: string, methodUid: string }> | null, detectionLimits?: Array<{ __typename?: 'AnalysisDetectionLimitType', uid: string, lowerLimit: number, upperLimit: number, analysisUid: string, instrumentUid: string, methodUid: string }> | null, correctionFactors?: Array<{ __typename?: 'AnalysisCorrectionFactorType', uid: string, factor: number, analysisUid: string, instrumentUid: string, methodUid: string }> | null, interims?: Array<{ __typename?: 'AnalysisInterimType', uid: string, key: number, value: string, analysisUid: string, instrumentUid: string }> | null, instruments?: Array<{ __typename?: 'InstrumentType', uid: string, name?: string | null, keyword?: string | null }> | null, methods?: Array<{ __typename?: 'MethodType', uid: string, name?: string | null, keyword?: string | null, description?: string | null, instruments?: Array<{ __typename?: 'InstrumentType', uid: string, name?: string | null, keyword?: string | null, description?: string | null }> | null }> | null, resultOptions?: Array<{ __typename?: 'ResultOptionType', uid: string, optionKey: number, value: string }> | null, category?: { __typename?: 'AnalysisCategoryType', uid: string, name: string } | null, profiles?: Array<{ __typename?: 'ProfileType', uid: string, name: string }> | null }> | null } };

export type GetAllAnalysesProfilesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllAnalysesProfilesQuery = { __typename?: 'Query', profileAll: Array<{ __typename?: 'ProfileType', uid: string, name: string, description?: string | null, keyword?: string | null, active: boolean, departmentUid?: string | null, sampleTypes?: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string }> | null, analyses?: Array<{ __typename?: 'AnalysisType', name: string, keyword?: string | null, active?: boolean | null, sortKey?: number | null }> | null }> };

export type GetAnalysisMappingsByAnalysisUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAnalysisMappingsByAnalysisUidQuery = { __typename?: 'Query', analysisMappingsByAnalysis: Array<{ __typename?: 'AnalysisMappingType', uid: string, analysisUid: string, codingStandardUid: string, name?: string | null, code: string, description?: string | null, codingStandard?: { __typename?: 'CodingStandardType', name: string } | null }> };

export type GetAllProfilesAndServicesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllProfilesAndServicesQuery = { __typename?: 'Query', profileAll: Array<{ __typename?: 'ProfileType', uid: string, name: string, description?: string | null, keyword?: string | null, active: boolean, departmentUid?: string | null, sampleTypes?: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string }> | null, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string, keyword?: string | null, sortKey?: number | null, active?: boolean | null }> | null }>, analysisAll: { __typename?: 'AnalysisCursorPage', items?: Array<{ __typename?: 'AnalysisWithProfiles', uid: string, name: string, keyword?: string | null, active?: boolean | null, description?: string | null, sortKey?: number | null, tatLengthMinutes?: number | null, precision?: number | null, requiredVerifications?: number | null, selfVerification?: boolean | null, categoryUid?: string | null, departmentUid?: string | null, unitUid?: string | null, unit?: { __typename?: 'UnitType', uid: string, name: string } | null, sampleTypes?: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string }> | null, specifications?: Array<{ __typename?: 'AnalysisSpecificationType', uid: string, analysisUid: string, unitUid?: string | null, min?: number | null, max?: number | null, minWarn?: number | null, maxWarn?: number | null, minReport?: string | null, maxReport?: string | null, warnValues?: string | null, warnReport?: string | null, gender?: string | null, ageMin?: number | null, ageMax?: number | null, methodUid?: string | null, unit?: { __typename?: 'UnitType', uid: string, name: string, isSiUnit: boolean } | null }> | null, uncertainties?: Array<{ __typename?: 'AnalysisUncertaintyType', uid: string, min: number, max: number, value: number, analysisUid: string, instrumentUid: string, methodUid: string }> | null, detectionLimits?: Array<{ __typename?: 'AnalysisDetectionLimitType', uid: string, lowerLimit: number, upperLimit: number, analysisUid: string, instrumentUid: string, methodUid: string }> | null, correctionFactors?: Array<{ __typename?: 'AnalysisCorrectionFactorType', uid: string, factor: number, analysisUid: string, instrumentUid: string, methodUid: string }> | null, interims?: Array<{ __typename?: 'AnalysisInterimType', uid: string, key: number, value: string, analysisUid: string, instrumentUid: string }> | null, instruments?: Array<{ __typename?: 'InstrumentType', uid: string, name?: string | null, keyword?: string | null, description?: string | null }> | null, methods?: Array<{ __typename?: 'MethodType', uid: string, name?: string | null, keyword?: string | null, description?: string | null }> | null, resultOptions?: Array<{ __typename?: 'ResultOptionType', uid: string, optionKey: number, value: string }> | null, category?: { __typename?: 'AnalysisCategoryType', uid: string, name: string } | null, profiles?: Array<{ __typename?: 'ProfileType', uid: string, name: string }> | null }> | null } };

export type GetProfileMappingsByProfileUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetProfileMappingsByProfileUidQuery = { __typename?: 'Query', profileMappingsByProfile: Array<{ __typename?: 'ProfileMappingType', uid: string, profileUid: string, codingStandardUid: string, name?: string | null, code: string, description?: string | null, codingStandard?: { __typename?: 'CodingStandardType', name: string } | null }> };

export type GetAllAnalysesCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllAnalysesCategoriesQuery = { __typename?: 'Query', analysisCategoryAll: Array<{ __typename?: 'AnalysisCategoryType', uid: string, name: string, description?: string | null, active: boolean, departmentUid?: string | null, department?: { __typename?: 'DepartmentType', uid: string, name?: string | null } | null }> };

export type GetAllSamplesQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  status: Scalars['String']['input'];
  text: Scalars['String']['input'];
  clientUid: Scalars['String']['input'];
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetAllSamplesQuery = { __typename?: 'Query', sampleAll: { __typename?: 'SampleCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, endCursor?: string | null, startCursor?: string | null }, items?: Array<{ __typename?: 'SamplesWithResults', uid: string, createdByUid?: string | null, createdAt?: any | null, dateCollected?: any | null, dateReceived?: any | null, dateSubmitted?: any | null, dateVerified?: any | null, datePublished?: any | null, datePrinted?: any | null, dateStored?: any | null, printed?: boolean | null, dueDate?: any | null, sampleId: string, priority: number, status?: string | null, storageSlot?: string | null, storageContainerUid?: string | null, createdBy?: { __typename?: 'UserType', firstName?: string | null, lastName?: string | null, auth?: { __typename?: 'UserAuthType', userName: string } | null } | null, analysisRequest?: { __typename?: 'AnalysisRequestType', uid: string, clientRequestId: string, patient: { __typename?: 'PatientType', uid: string, firstName?: string | null, lastName?: string | null, clientPatientId: string, gender?: string | null, dateOfBirth?: any | null, age?: number | null, ageDobEstimated: boolean, consentSms: boolean }, client: { __typename?: 'ClientType', uid: string, name: string, code: string, district?: { __typename?: 'DistrictType', name?: string | null, province?: { __typename?: 'ProvinceType', name?: string | null } | null } | null } } | null, sampleType?: { __typename?: 'SampleTypeTyp', uid: string, name: string } | null, storageContainer?: { __typename?: 'StorageContainerType', uid: string, name: string, storageSection?: { __typename?: 'StorageSectionType', uid: string, name: string, storageLocation?: { __typename?: 'StorageLocationType', uid: string, name: string, storeRoom?: { __typename?: 'StoreRoomType', uid: string, name: string } | null } | null } | null } | null, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string, sortKey?: number | null }> | null, profiles?: Array<{ __typename?: 'ProfileType', uid: string, name: string }> | null, rejectionReasons?: Array<{ __typename?: 'RejectionReasonType', uid: string, reason: string }> | null }> | null } };

export type GetSamplesForShipmentAssignQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  text: Scalars['String']['input'];
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  analysisUid?: InputMaybe<Scalars['String']['input']>;
  sampleTypeUid: Scalars['String']['input'];
}>;


export type GetSamplesForShipmentAssignQuery = { __typename?: 'Query', samplesForShipmentAssign: { __typename?: 'SampleCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'SamplesWithResults', uid: string, sampleId: string, status?: string | null, createdAt?: any | null, dateReceived?: any | null, sampleType?: { __typename?: 'SampleTypeTyp', name: string } | null, analysisRequest?: { __typename?: 'AnalysisRequestType', clientRequestId: string } | null, analysisResults?: Array<{ __typename?: 'AnalysisResultType', uid: string, assigned: boolean, status?: string | null, analysis?: { __typename?: 'AnalysisType', name: string } | null }> | null }> | null } };

export type GetAnalysesRequestsByPatientUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAnalysesRequestsByPatientUidQuery = { __typename?: 'Query', analysisRequestsByPatientUid: Array<{ __typename?: 'AnalysisRequestWithSamples', uid: string, clientRequestId: string, createdAt?: any | null, patient: { __typename?: 'PatientType', uid: string, firstName?: string | null, lastName?: string | null, clientPatientId: string, gender?: string | null, dateOfBirth?: any | null, age?: number | null, ageDobEstimated: boolean, consentSms: boolean }, client: { __typename?: 'ClientType', uid: string, name: string }, samples?: Array<{ __typename?: 'SampleType', uid: string, createdByUid?: string | null, createdAt?: any | null, sampleId: string, priority: number, status?: string | null, storageSlot?: string | null, storageContainerUid?: string | null, createdBy?: { __typename?: 'UserType', firstName?: string | null, lastName?: string | null, auth?: { __typename?: 'UserAuthType', userName: string } | null } | null, sampleType?: { __typename?: 'SampleTypeTyp', uid: string, name: string } | null, storageContainer?: { __typename?: 'StorageContainerType', uid: string, name: string, storageSection?: { __typename?: 'StorageSectionType', uid: string, name: string, storageLocation?: { __typename?: 'StorageLocationType', uid: string, name: string, storeRoom?: { __typename?: 'StoreRoomType', uid: string, name: string } | null } | null } | null } | null, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string, sortKey?: number | null }> | null, rejectionReasons?: Array<{ __typename?: 'RejectionReasonType', uid: string, reason: string }> | null, profiles?: Array<{ __typename?: 'ProfileType', uid: string, name: string }> | null }> | null }> };

export type GetAnalysesRequestsByClientUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAnalysesRequestsByClientUidQuery = { __typename?: 'Query', analysisRequestsByClientUid: Array<{ __typename?: 'AnalysisRequestWithSamples', uid: string, clientRequestId: string, createdAt?: any | null, patient: { __typename?: 'PatientType', uid: string, firstName?: string | null, lastName?: string | null, clientPatientId: string, gender?: string | null, dateOfBirth?: any | null, age?: number | null, ageDobEstimated: boolean, consentSms: boolean }, client: { __typename?: 'ClientType', uid: string, name: string }, samples?: Array<{ __typename?: 'SampleType', uid: string, createdByUid?: string | null, createdAt?: any | null, sampleId: string, priority: number, status?: string | null, storageSlot?: string | null, storageContainerUid?: string | null, createdBy?: { __typename?: 'UserType', firstName?: string | null, lastName?: string | null, auth?: { __typename?: 'UserAuthType', userName: string } | null } | null, sampleType?: { __typename?: 'SampleTypeTyp', uid: string, name: string } | null, storageContainer?: { __typename?: 'StorageContainerType', uid: string, name: string, storageSection?: { __typename?: 'StorageSectionType', uid: string, name: string, storageLocation?: { __typename?: 'StorageLocationType', uid: string, name: string, storeRoom?: { __typename?: 'StoreRoomType', uid: string, name: string } | null } | null } | null } | null, rejectionReasons?: Array<{ __typename?: 'RejectionReasonType', uid: string, reason: string }> | null, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string, sortKey?: number | null }> | null, profiles?: Array<{ __typename?: 'ProfileType', uid: string, name: string }> | null }> | null }> };

export type GetAnalysesResultsBySampleUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAnalysesResultsBySampleUidQuery = { __typename?: 'Query', analysisResultBySampleUid: Array<{ __typename?: 'AnalysisResultType', uid: string, status?: string | null, sampleUid: string, result?: string | null, analysisUid?: string | null, retest: boolean, reportable: boolean, createdAt?: any | null, createdByUid?: string | null, updatedAt?: any | null, updatedByUid?: string | null, worksheetUid?: string | null, worksheetId?: string | null, method?: { __typename?: 'MethodType', uid: string, name?: string | null } | null, instrument?: { __typename?: 'InstrumentType', uid: string, name?: string | null } | null, sample: { __typename?: 'SampleType', uid: string, sampleId: string, status?: string | null, rejectionReasons?: Array<{ __typename?: 'RejectionReasonType', uid: string, reason: string }> | null }, analysis?: { __typename?: 'AnalysisType', uid: string, name: string, unitUid?: string | null, sortKey?: number | null, unit?: { __typename?: 'UnitType', uid: string, name: string } | null, interims?: Array<{ __typename?: 'AnalysisInterimType', uid: string, key: number, value: string, analysisUid: string, instrumentUid: string }> | null, resultOptions?: Array<{ __typename?: 'ResultOptionType', uid: string, optionKey: number, value: string }> | null } | null }> };

export type GetAnalysesResultsForWsAssignQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  text: Scalars['String']['input'];
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  analysisUid: Scalars['String']['input'];
  sampleTypeUid: Scalars['String']['input'];
}>;


export type GetAnalysesResultsForWsAssignQuery = { __typename?: 'Query', analysisResultsForWsAssign: { __typename?: 'AnalysisResultCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'AnalysisResultType', uid: string, assigned: boolean, sampleUid: string, status?: string | null, analysisUid?: string | null, sample: { __typename?: 'SampleType', sampleId: string, priority: number, status?: string | null, dateReceived?: any | null, createdAt?: any | null, sampleType?: { __typename?: 'SampleTypeTyp', name: string } | null }, analysis?: { __typename?: 'AnalysisType', name: string } | null }> | null } };

export type GetSampleByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetSampleByUidQuery = { __typename?: 'Query', sampleByUid: { __typename?: 'SampleType', uid: string, createdByUid?: string | null, createdAt?: any | null, dateReceived?: any | null, receivedByUid?: string | null, dateCollected?: any | null, dateSubmitted?: any | null, submittedByUid?: string | null, dateVerified?: any | null, verifiedByUid?: string | null, datePublished?: any | null, datePrinted?: any | null, printedByUid?: string | null, dateInvalidated?: any | null, invalidatedByUid?: string | null, dateCancelled?: any | null, cancelledByUid?: string | null, dueDate?: any | null, sampleId: string, priority: number, status?: string | null, dateStored?: any | null, storageSlot?: string | null, storageContainerUid?: string | null, createdBy?: { __typename?: 'UserType', firstName?: string | null, lastName?: string | null, auth?: { __typename?: 'UserAuthType', userName: string } | null } | null, analysisRequest?: { __typename?: 'AnalysisRequestType', uid: string, clientRequestId: string, patient: { __typename?: 'PatientType', uid: string, firstName?: string | null, lastName?: string | null, clientPatientId: string, gender?: string | null, dateOfBirth?: any | null, age?: number | null, ageDobEstimated: boolean, consentSms: boolean }, client: { __typename?: 'ClientType', uid: string, name: string } } | null, sampleType?: { __typename?: 'SampleTypeTyp', uid: string, name: string } | null, storageContainer?: { __typename?: 'StorageContainerType', uid: string, name: string, storageSection?: { __typename?: 'StorageSectionType', uid: string, name: string, storageLocation?: { __typename?: 'StorageLocationType', uid: string, name: string, storeRoom?: { __typename?: 'StoreRoomType', uid: string, name: string } | null } | null } | null } | null, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string }> | null, profiles?: Array<{ __typename?: 'ProfileType', uid: string, name: string }> | null, rejectionReasons?: Array<{ __typename?: 'RejectionReasonType', uid: string, reason: string }> | null } };

export type GetSampleParentIdQueryVariables = Exact<{
  parentId: Scalars['String']['input'];
  text?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetSampleParentIdQuery = { __typename?: 'Query', sampleByParentId: Array<{ __typename?: 'SampleType', uid: string, sampleId: string, status?: string | null }> };

export type GetSamplesByStorageContainerUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetSamplesByStorageContainerUidQuery = { __typename?: 'Query', samplesByStorageContainerUid: Array<{ __typename?: 'SampleType', uid: string, sampleId: string, storageSlot?: string | null, storageSlotIndex?: number | null, storageContainerUid?: string | null, status?: string | null, analysisRequest?: { __typename?: 'AnalysisRequestType', clientRequestId: string } | null }> };

export type GetAllQcLevelsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllQcLevelsQuery = { __typename?: 'Query', qcLevelAll: Array<{ __typename?: 'QCLevelType', uid: string, level: string }> };

export type GetAllQcTemplatesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllQcTemplatesQuery = { __typename?: 'Query', qcTemplateAll: Array<{ __typename?: 'QCTemplateType', uid: string, name: string, description?: string | null, qcLevels: Array<{ __typename?: 'QCLevelType', uid: string, level: string }>, departments: Array<{ __typename?: 'DepartmentType', uid: string, name?: string | null }> }> };

export type GetQcSeTsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  text: Scalars['String']['input'];
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetQcSeTsQuery = { __typename?: 'Query', qcSetAll: { __typename?: 'QCSetCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, endCursor?: string | null, startCursor?: string | null }, items?: Array<{ __typename?: 'QCSetWithSamples', uid: string, name: string, note: string, createdAt?: any | null, samples?: Array<{ __typename?: 'SamplesWithResults', uid: string, sampleId: string, status?: string | null, createdByUid?: string | null, createdAt?: any | null, updatedAt?: any | null, assigned: boolean, createdBy?: { __typename?: 'UserType', firstName?: string | null, lastName?: string | null, auth?: { __typename?: 'UserAuthType', userName: string } | null } | null, qcLevel?: { __typename?: 'QCLevelType', uid: string, level: string } | null, analysisResults?: Array<{ __typename?: 'AnalysisResultType', uid: string, status?: string | null, sampleUid: string, result?: string | null, analysisUid?: string | null, retest: boolean, reportable: boolean, analysis?: { __typename?: 'AnalysisType', uid: string, name: string, sortKey?: number | null, resultOptions?: Array<{ __typename?: 'ResultOptionType', uid: string, optionKey: number, value: string }> | null } | null, method?: { __typename?: 'MethodType', uid: string, name?: string | null } | null, instrument?: { __typename?: 'InstrumentType', uid: string, name?: string | null } | null }> | null, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string, unitUid?: string | null, unit?: { __typename?: 'UnitType', uid: string, name: string } | null, resultOptions?: Array<{ __typename?: 'ResultOptionType', uid: string, optionKey: number, value: string }> | null }> | null, profiles?: Array<{ __typename?: 'ProfileType', uid: string, name: string }> | null }> | null }> | null } };

export type GetQcSetByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetQcSetByUidQuery = { __typename?: 'Query', qcSetByUid: { __typename?: 'QCSetWithSamples', uid: string, name: string, note: string, createdAt?: any | null, samples?: Array<{ __typename?: 'SamplesWithResults', uid: string, sampleId: string, status?: string | null, createdAt?: any | null, updatedAt?: any | null, assigned: boolean, qcLevel?: { __typename?: 'QCLevelType', uid: string, level: string } | null, analysisResults?: Array<{ __typename?: 'AnalysisResultType', uid: string, status?: string | null, sampleUid: string, result?: string | null, analysisUid?: string | null, retest: boolean, reportable: boolean, analysis?: { __typename?: 'AnalysisType', uid: string, name: string, sortKey?: number | null, resultOptions?: Array<{ __typename?: 'ResultOptionType', uid: string, optionKey: number, value: string }> | null } | null, method?: { __typename?: 'MethodType', uid: string, name?: string | null } | null, instrument?: { __typename?: 'InstrumentType', uid: string, name?: string | null } | null }> | null, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string, unitUid?: string | null, unit?: { __typename?: 'UnitType', uid: string, name: string } | null, resultOptions?: Array<{ __typename?: 'ResultOptionType', uid: string, optionKey: number, value: string }> | null }> | null, profiles?: Array<{ __typename?: 'ProfileType', uid: string, name: string }> | null }> | null } };

export type ResultOptionsByAnalysisUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type ResultOptionsByAnalysisUidQuery = { __typename?: 'Query', resultOptionsByAnalysisUid: { __typename?: 'ResultOptionType', uid: string, optionKey: number, value: string, analysisUid: string } };

export type GetAllRejectionReasonsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllRejectionReasonsQuery = { __typename?: 'Query', rejectionReasonsAll: Array<{ __typename?: 'RejectionReasonType', uid: string, reason: string }> };

export type ImpressMetaQueryVariables = Exact<{
  uids: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type ImpressMetaQuery = { __typename?: 'Query', impressReportsMeta: Array<{ __typename?: 'ReportImpressType', uid: string, state?: string | null, sampleUid?: string | null, jsonContent?: any | null, emailRequired?: boolean | null, emailSent?: boolean | null, smsRequired?: boolean | null, smsSent?: boolean | null, generatedByUid?: string | null, dateGenerated?: any | null, generatedBy?: { __typename?: 'UserType', firstName?: string | null, lastName?: string | null } | null }> };

export type ImpressReportsQueryVariables = Exact<{
  uids: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type ImpressReportsQuery = { __typename?: 'Query', impressReportsDownload?: any | null };

export type ImpressReportQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type ImpressReportQuery = { __typename?: 'Query', impressReportDownload?: any | null };

export type AddClientMutationVariables = Exact<{
  payload: ClientInputType;
}>;


export type AddClientMutation = { __typename?: 'Mutation', createClient: { __typename: 'ClientType', uid: string, name: string, code: string, districtUid?: string | null, district?: { __typename?: 'DistrictType', uid: string, name?: string | null, province?: { __typename?: 'ProvinceType', uid: string, name?: string | null, country?: { __typename?: 'CountryType', uid: string, name?: string | null } | null } | null } | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditClientMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: ClientInputType;
}>;


export type EditClientMutation = { __typename?: 'Mutation', updateClient: { __typename: 'ClientType', uid: string, name: string, code: string, districtUid?: string | null, district?: { __typename?: 'DistrictType', uid: string, name?: string | null, province?: { __typename?: 'ProvinceType', uid: string, name?: string | null, country?: { __typename?: 'CountryType', uid: string, name?: string | null } | null } | null } | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddClientContactMutationVariables = Exact<{
  payload: ClientContactInputType;
}>;


export type AddClientContactMutation = { __typename?: 'Mutation', createClientContact: { __typename: 'ClientContactType', uid: string, firstName?: string | null, lastName?: string | null, email?: string | null, mobilePhone?: string | null, consentSms: boolean } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditClientContactMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: ClientContactInputType;
}>;


export type EditClientContactMutation = { __typename?: 'Mutation', updateClientContact: { __typename: 'ClientContactType', uid: string, firstName?: string | null, lastName?: string | null, email?: string | null, mobilePhone?: string | null, consentSms: boolean } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type DeleteClientContactMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type DeleteClientContactMutation = { __typename?: 'Mutation', deleteClientContact: { __typename?: 'DeletedItem', uid: string } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type GetAllClientsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetAllClientsQuery = { __typename?: 'Query', clientAll: { __typename?: 'ClientCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'ClientType', uid: string, name: string, code: string, district?: { __typename?: 'DistrictType', uid: string, name?: string | null, province?: { __typename?: 'ProvinceType', uid: string, name?: string | null, country?: { __typename?: 'CountryType', uid: string, name?: string | null } | null } | null } | null }> | null } };

export type SearchClientsQueryVariables = Exact<{
  queryString: Scalars['String']['input'];
}>;


export type SearchClientsQuery = { __typename?: 'Query', clientSearch: Array<{ __typename?: 'ClientType', uid: string, name: string, code: string, district?: { __typename?: 'DistrictType', uid: string, name?: string | null, province?: { __typename?: 'ProvinceType', uid: string, name?: string | null, country?: { __typename?: 'CountryType', uid: string, name?: string | null } | null } | null } | null }> };

export type GetClientContactsByClientUidQueryVariables = Exact<{
  clientUid: Scalars['String']['input'];
}>;


export type GetClientContactsByClientUidQuery = { __typename?: 'Query', clientContactByClientUid: Array<{ __typename?: 'ClientContactType', uid: string, firstName?: string | null, lastName?: string | null, email?: string | null, mobilePhone?: string | null, consentSms: boolean }> };

export type GetClientByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetClientByUidQuery = { __typename?: 'Query', clientByUid: { __typename?: 'ClientType', uid: string, name: string, code: string, districtUid?: string | null, district?: { __typename?: 'DistrictType', uid: string, name?: string | null, provinceUid?: string | null, province?: { __typename?: 'ProvinceType', uid: string, name?: string | null, countryUid?: string | null, country?: { __typename?: 'CountryType', uid: string, name?: string | null } | null } | null } | null } };

export type GetSampleGroupByStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSampleGroupByStatusQuery = { __typename?: 'Query', countSampleGroupByStatus: { __typename?: 'GroupedCounts', data: Array<{ __typename: 'GroupCount', group: string, count?: number | null }> } };

export type GetExtrasGroupByStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type GetExtrasGroupByStatusQuery = { __typename?: 'Query', countExtrasGroupByStatus: { __typename?: 'GroupedCounts', data: Array<{ __typename: 'GroupCount', group: string, count?: number | null }> } };

export type GetAnalysisGroupByStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAnalysisGroupByStatusQuery = { __typename?: 'Query', countAnalyteGroupByStatus: { __typename?: 'GroupedCounts', data: Array<{ __typename: 'GroupCount', group: string, count?: number | null }> } };

export type GetWorksheetGroupByStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type GetWorksheetGroupByStatusQuery = { __typename?: 'Query', countWorksheetGroupByStatus: { __typename?: 'GroupedCounts', data: Array<{ __typename: 'GroupCount', group: string, count?: number | null }> } };

export type GetAnalysisGroupByInstrumentQueryVariables = Exact<{
  startDate: Scalars['String']['input'];
  endDate: Scalars['String']['input'];
}>;


export type GetAnalysisGroupByInstrumentQuery = { __typename?: 'Query', countAnalyteGroupByInstrument: { __typename?: 'GroupedCounts', data: Array<{ __typename: 'GroupCount', group: string, count?: number | null }> } };

export type SampleProcessPeformanceQueryVariables = Exact<{
  startDate: Scalars['String']['input'];
  endDate: Scalars['String']['input'];
}>;


export type SampleProcessPeformanceQuery = { __typename?: 'Query', sampleProcessPerformance: { __typename: 'ProcessStatistics', data: Array<{ __typename?: 'ProcessData', process: string, counts?: { __typename?: 'ProcessCounts', totalSamples?: number | null, totalLate?: number | null, totalNotLate?: number | null, processAverage?: number | null, avgExtraDays?: number | null } | null }> } };

export type GetAnalysisProcessPeformanceQueryVariables = Exact<{
  process: Scalars['String']['input'];
  startDate: Scalars['String']['input'];
  endDate: Scalars['String']['input'];
}>;


export type GetAnalysisProcessPeformanceQuery = { __typename?: 'Query', analysisProcessPerformance: { __typename: 'ProcessStatistics', data: Array<{ __typename?: 'ProcessData', process: string, groups?: Array<{ __typename?: 'ProcessCounts', totalSamples?: number | null, totalLate?: number | null, totalNotLate?: number | null, processAverage?: number | null, avgExtraDays?: number | null, service?: string | null }> | null }> } };

export type SampleGroupByActionQueryVariables = Exact<{
  startDate: Scalars['String']['input'];
  endDate: Scalars['String']['input'];
}>;


export type SampleGroupByActionQuery = { __typename?: 'Query', countSampleGroupByAction: { __typename: 'GroupedData', data: Array<{ __typename: 'GroupData', group: string, counts?: Array<{ __typename: 'GroupCount', group: string, count?: number | null }> | null }> } };

export type GetSampleLaggardsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSampleLaggardsQuery = { __typename?: 'Query', sampleLaggards: { __typename: 'LaggardStatistics', data: Array<{ __typename: 'LaggardData', category: string, counts?: { __typename: 'LaggardCounts', totalIncomplete?: number | null, totalDelayed?: number | null, totalNotDelayed?: number | null, lessThanTen?: number | null, tenToTwenty?: number | null, twentyToThirty?: number | null, graterThanThirty?: number | null } | null }> } };

export type AddSupplierMutationVariables = Exact<{
  payload: SupplierInputType;
}>;


export type AddSupplierMutation = { __typename?: 'Mutation', createSupplier: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'SupplierType', uid: string, name?: string | null, description?: string | null } };

export type EditSupplierMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: SupplierInputType;
}>;


export type EditSupplierMutation = { __typename?: 'Mutation', updateSupplier: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'SupplierType', uid: string, name?: string | null, description?: string | null } };

export type AddManufacturerMutationVariables = Exact<{
  payload: ManufacturerInputType;
}>;


export type AddManufacturerMutation = { __typename?: 'Mutation', createManufacturer: { __typename?: 'ManufacturerType', uid: string, name?: string | null, description?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditManufacturerMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: ManufacturerInputType;
}>;


export type EditManufacturerMutation = { __typename?: 'Mutation', updateManufacturer: { __typename?: 'ManufacturerType', uid: string, name?: string | null, description?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddInstrumentTypeMutationVariables = Exact<{
  payload: InstrumentTypeInputType;
}>;


export type AddInstrumentTypeMutation = { __typename?: 'Mutation', createInstrumentType: { __typename?: 'InstrumentTypeType', uid: string, name?: string | null, description?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditInstrumentTypeMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: InstrumentTypeInputType;
}>;


export type EditInstrumentTypeMutation = { __typename?: 'Mutation', updateInstrumentType: { __typename?: 'InstrumentTypeType', uid: string, name?: string | null, description?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddInstrumentMutationVariables = Exact<{
  payload: InstrumentInputType;
}>;


export type AddInstrumentMutation = { __typename?: 'Mutation', createInstrument: { __typename?: 'InstrumentType', uid: string, name?: string | null, description?: string | null, keyword?: string | null, instrumentType?: { __typename?: 'InstrumentTypeType', uid: string, name?: string | null } | null, manufacturer?: { __typename?: 'ManufacturerType', uid: string, name?: string | null } | null, supplier?: { __typename?: 'SupplierType', uid: string, name?: string | null } | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditInstrumentMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: InstrumentInputType;
}>;


export type EditInstrumentMutation = { __typename?: 'Mutation', updateInstrument: { __typename?: 'InstrumentType', uid: string, name?: string | null, description?: string | null, keyword?: string | null, instrumentType?: { __typename?: 'InstrumentTypeType', uid: string, name?: string | null } | null, manufacturer?: { __typename?: 'ManufacturerType', uid: string, name?: string | null } | null, supplier?: { __typename?: 'SupplierType', uid: string, name?: string | null } | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddMethodMutationVariables = Exact<{
  payload: MethodInputType;
}>;


export type AddMethodMutation = { __typename?: 'Mutation', createMethod: { __typename?: 'MethodType', uid: string, name?: string | null, description?: string | null, keyword?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditMethodMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: MethodInputType;
}>;


export type EditMethodMutation = { __typename?: 'Mutation', updateMethod: { __typename?: 'MethodType', uid: string, name?: string | null, description?: string | null, keyword?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddUnitMutationVariables = Exact<{
  payload: UnitInputType;
}>;


export type AddUnitMutation = { __typename?: 'Mutation', createUnit: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'UnitType', uid: string, name: string, isSiUnit: boolean } };

export type EditUnitMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: UnitInputType;
}>;


export type EditUnitMutation = { __typename?: 'Mutation', updateUnit: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'UnitType', uid: string, name: string, isSiUnit: boolean } };

export type GetAllSuppliersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllSuppliersQuery = { __typename?: 'Query', supplierAll: Array<{ __typename?: 'SupplierType', uid: string, name?: string | null, description?: string | null }> };

export type GetAllManufacturersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllManufacturersQuery = { __typename?: 'Query', manufacturerAll: Array<{ __typename?: 'ManufacturerType', uid: string, name?: string | null, description?: string | null }> };

export type GetAllInstrumentTypesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllInstrumentTypesQuery = { __typename?: 'Query', instrumentTypeAll: { __typename?: 'InstrumentTypeCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'InstrumentTypeType', uid: string, name?: string | null, description?: string | null }> | null } };

export type GetAllInstrumentsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllInstrumentsQuery = { __typename?: 'Query', instrumentAll: { __typename?: 'InstrumentCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'InstrumentType', uid: string, name?: string | null, description?: string | null, keyword?: string | null, supplierUid?: string | null, manufacturerUid?: string | null, instrumentTypeUid?: string | null, methods?: Array<{ __typename?: 'MethodType', uid: string, name?: string | null, description?: string | null }> | null, supplier?: { __typename?: 'SupplierType', uid: string, name?: string | null } | null, manufacturer?: { __typename?: 'ManufacturerType', uid: string, name?: string | null } | null, instrumentType?: { __typename?: 'InstrumentTypeType', uid: string, name?: string | null } | null }> | null } };

export type GetAllMethodsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllMethodsQuery = { __typename?: 'Query', methodAll: { __typename?: 'MethodCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'MethodType', uid: string, name?: string | null, description?: string | null, keyword?: string | null, instruments?: Array<{ __typename?: 'InstrumentType', uid: string, name?: string | null, description?: string | null }> | null }> | null } };

export type GetAllUnitsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllUnitsQuery = { __typename?: 'Query', unitAll: Array<{ __typename?: 'UnitType', uid: string, name: string, isSiUnit: boolean }> };

export type AddHazardMutationVariables = Exact<{
  payload: HazardInputType;
}>;


export type AddHazardMutation = { __typename?: 'Mutation', createHazard: { __typename: 'HazardType', uid: string, name: string, description?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditHazardMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: HazardInputType;
}>;


export type EditHazardMutation = { __typename?: 'Mutation', updateHazard: { __typename: 'HazardType', uid: string, name: string, description?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddStockCategoryMutationVariables = Exact<{
  payload: StockCategoryInputType;
}>;


export type AddStockCategoryMutation = { __typename?: 'Mutation', createStockCategory: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StockCategoryType', uid: string, name: string, description?: string | null } };

export type EditStockCategoryMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: StockCategoryInputType;
}>;


export type EditStockCategoryMutation = { __typename?: 'Mutation', updateStockCategory: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StockCategoryType', uid: string, name: string, description?: string | null } };

export type AddStockPackagingMutationVariables = Exact<{
  payload: StockPackagingInputType;
}>;


export type AddStockPackagingMutation = { __typename?: 'Mutation', createStockPackaging: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StockPackagingType', uid: string, name: string } };

export type EditStockPackagingMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: StockPackagingInputType;
}>;


export type EditStockPackagingMutation = { __typename?: 'Mutation', updateStockPackaging: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StockPackagingType', uid: string, name: string } };

export type AddStockUnitMutationVariables = Exact<{
  payload: StockUnitInputType;
}>;


export type AddStockUnitMutation = { __typename?: 'Mutation', createStockUnit: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StockUnitType', uid: string, name: string } };

export type EditStockUnitMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: StockUnitInputType;
}>;


export type EditStockUnitMutation = { __typename?: 'Mutation', updateStockUnit: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StockUnitType', uid: string, name: string } };

export type AddStockProductMutationVariables = Exact<{
  payload: StockProductInputType;
}>;


export type AddStockProductMutation = { __typename?: 'Mutation', createStockProduct: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StockProductType', uid: string, name: string, lotNumber?: string | null, batch?: string | null, size?: number | null, price?: number | null, quantityReceived?: number | null, remaining?: number | null, dateReceived?: any | null, expiryDate?: any | null, createdAt?: any | null, department?: { __typename?: 'DepartmentType', uid: string, name?: string | null } | null, supplier?: { __typename?: 'SupplierType', uid: string, name?: string | null } | null, category?: { __typename?: 'StockCategoryType', uid: string, name: string } | null, hazard?: { __typename?: 'HazardType', uid: string, name: string } | null, storeRoom?: { __typename?: 'StoreRoomType', uid: string, name: string } | null, unit?: { __typename?: 'StockUnitType', uid: string, name: string } | null, packaging?: { __typename?: 'StockPackagingType', uid: string, name: string } | null, receivedBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null, createdBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null } };

export type EditStockProductMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: StockProductInputType;
}>;


export type EditStockProductMutation = { __typename?: 'Mutation', updateStockProduct: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StockProductType', uid: string, name: string, lotNumber?: string | null, batch?: string | null, size?: number | null, price?: number | null, quantityReceived?: number | null, remaining?: number | null, dateReceived?: any | null, expiryDate?: any | null, createdAt?: any | null, updatedAt?: any | null, department?: { __typename?: 'DepartmentType', uid: string, name?: string | null } | null, supplier?: { __typename?: 'SupplierType', uid: string, name?: string | null } | null, category?: { __typename?: 'StockCategoryType', uid: string, name: string } | null, hazard?: { __typename?: 'HazardType', uid: string, name: string } | null, storeRoom?: { __typename?: 'StoreRoomType', uid: string, name: string } | null, unit?: { __typename?: 'StockUnitType', uid: string, name: string } | null, packaging?: { __typename?: 'StockPackagingType', uid: string, name: string } | null, receivedBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null, createdBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null, updatedBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null } };

export type AddStockItemMutationVariables = Exact<{
  payload: StockItemInputType;
}>;


export type AddStockItemMutation = { __typename?: 'Mutation', createStockItem: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StockItemType', uid: string, name: string, description?: string | null, departmentUid?: string | null, department?: { __typename?: 'DepartmentType', uid: string, name?: string | null } | null } };

export type EditStockItemMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: StockItemInputType;
}>;


export type EditStockItemMutation = { __typename?: 'Mutation', updateStockItem: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StockItemType', uid: string, name: string, description?: string | null, departmentUid?: string | null, department?: { __typename?: 'DepartmentType', uid: string, name?: string | null } | null } };

export type AddStockTransactionMutationVariables = Exact<{
  payload: StockTransactionInputType;
}>;


export type AddStockTransactionMutation = { __typename?: 'Mutation', createStockTransaction: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StockTransactionType', uid: string, productUid?: string | null, issued?: number | null, departmentUid?: string | null, dateIssued?: any | null, transactionByUid?: string | null, createdAt?: any | null, createdByUid?: string | null, updatedAt?: any | null, updatedByUid?: string | null } };

export type AddStockAdjustmentMutationVariables = Exact<{
  payload: StockAdjustmentInputType;
}>;


export type AddStockAdjustmentMutation = { __typename?: 'Mutation', createStockAdjustment: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StockAdjustmentType', uid: string, productUid?: string | null, adjustmentType?: string | null, adjust?: number | null, adjustmentDate?: any | null, remarks?: string | null, adjustmentByUid?: string | null, createdAt?: any | null, createdByUid?: string | null } };

export type AddStockOrderMutationVariables = Exact<{
  payload: StockOrderInputType;
}>;


export type AddStockOrderMutation = { __typename?: 'Mutation', createStockOrder: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StockOrderLineType', stockOrder: { __typename?: 'StockOrderType', uid: string, orderByUid?: string | null, departmentUid?: string | null, status?: string | null, orderNumber?: string | null }, orderProducts: Array<{ __typename?: 'StockOrderProductType', uid: string, productUid?: string | null, orderUid?: string | null, price?: number | null, quantity?: number | null }> } | { __typename?: 'StockOrderType' } };

export type EditStockOrderMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: StockOrderInputType;
}>;


export type EditStockOrderMutation = { __typename?: 'Mutation', updateStockOrder: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StockOrderLineType', stockOrder: { __typename?: 'StockOrderType', uid: string, orderByUid?: string | null, departmentUid?: string | null, status?: string | null, orderNumber?: string | null, remarks?: string | null }, orderProducts: Array<{ __typename?: 'StockOrderProductType', uid: string, productUid?: string | null, orderUid?: string | null, price?: number | null, quantity?: number | null }> } | { __typename?: 'StockOrderType' } };

export type SubmitStockOrderMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type SubmitStockOrderMutation = { __typename?: 'Mutation', submitStockOrder: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'StockOrderLineType' } | { __typename: 'StockOrderType', uid: string, status?: string | null, orderNumber?: string | null } };

export type ApproveStockOrderMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: StockOrderApprovalInputType;
}>;


export type ApproveStockOrderMutation = { __typename?: 'Mutation', approveStockOrder: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'StockOrderLineType' } | { __typename: 'StockOrderType', uid: string, orderByUid?: string | null, departmentUid?: string | null, status?: string | null, orderNumber?: string | null, remarks?: string | null } };

export type IssueStockOrderMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: Array<StockOrderProductLineInputType> | StockOrderProductLineInputType;
}>;


export type IssueStockOrderMutation = { __typename?: 'Mutation', issueStockOrder: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StockOrderLineType', stockOrder: { __typename?: 'StockOrderType', uid: string, orderByUid?: string | null, departmentUid?: string | null, status?: string | null, orderNumber?: string | null, remarks?: string | null }, orderProducts: Array<{ __typename?: 'StockOrderProductType', uid: string, orderUid?: string | null, price?: number | null, quantity?: number | null, product?: { __typename?: 'StockProductType', uid: string, remaining?: number | null } | null }> } | { __typename?: 'StockOrderType' } };

export type DeleteStockOrderMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type DeleteStockOrderMutation = { __typename?: 'Mutation', deleteStockOrder: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StockOrderLineType' } | { __typename?: 'StockOrderType' } };

export type GetAllHazardsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllHazardsQuery = { __typename?: 'Query', hazardAll: Array<{ __typename?: 'HazardType', uid: string, name: string, description?: string | null }> };

export type GetAllStockCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllStockCategoriesQuery = { __typename?: 'Query', stockCategoryAll: Array<{ __typename?: 'StockCategoryType', uid: string, name: string, description?: string | null }> };

export type GetAllStockPackagingQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllStockPackagingQuery = { __typename?: 'Query', stockPackagingAll: Array<{ __typename?: 'StockPackagingType', uid: string, name: string }> };

export type GetAllStockUnitsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllStockUnitsQuery = { __typename?: 'Query', stockUnitAll: Array<{ __typename?: 'StockUnitType', uid: string, name: string }> };

export type GetAllStockProductsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  text: Scalars['String']['input'];
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetAllStockProductsQuery = { __typename?: 'Query', stockProductAll: { __typename?: 'StockProductCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'StockProductType', uid: string, name: string, lotNumber?: string | null, batch?: string | null, size?: number | null, price?: number | null, quantityReceived?: number | null, remaining?: number | null, dateReceived?: any | null, expiryDate?: any | null, createdAt?: any | null, updatedAt?: any | null, department?: { __typename?: 'DepartmentType', uid: string, name?: string | null } | null, supplier?: { __typename?: 'SupplierType', uid: string, name?: string | null } | null, category?: { __typename?: 'StockCategoryType', uid: string, name: string } | null, hazard?: { __typename?: 'HazardType', uid: string, name: string } | null, storeRoom?: { __typename?: 'StoreRoomType', uid: string, name: string } | null, unit?: { __typename?: 'StockUnitType', uid: string, name: string } | null, packaging?: { __typename?: 'StockPackagingType', uid: string, name: string } | null, receivedBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null, createdBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null, updatedBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null }> | null } };

export type GetAllStockItemsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  text: Scalars['String']['input'];
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetAllStockItemsQuery = { __typename?: 'Query', stockItemAll: { __typename?: 'StockItemCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'StockItemType', uid: string, name: string, description?: string | null, departmentUid?: string | null, department?: { __typename?: 'DepartmentType', uid: string, name?: string | null } | null }> | null } };

export type GetAllStockOrdersQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  status: Scalars['String']['input'];
  text: Scalars['String']['input'];
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetAllStockOrdersQuery = { __typename?: 'Query', stockOrderAll: { __typename?: 'StockOrderCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'StockOrderType', uid: string, status?: string | null, orderNumber?: string | null, orderBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null, department?: { __typename?: 'DepartmentType', uid: string, name?: string | null } | null }> | null } };

export type GetAllStockOrderProductsQueryVariables = Exact<{
  stockOrderUid: Scalars['String']['input'];
}>;


export type GetAllStockOrderProductsQuery = { __typename?: 'Query', stockOrderProductAll: Array<{ __typename?: 'StockOrderProductType', uid: string, price?: number | null, quantity?: number | null, product?: { __typename?: 'StockProductType', uid: string, name: string, remaining?: number | null } | null }> };

export type GetAllStockTransactionsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  text: Scalars['String']['input'];
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetAllStockTransactionsQuery = { __typename?: 'Query', stockTransactionAll: { __typename?: 'StockTransactionCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'StockTransactionType', uid: string, issued?: number | null, issuedToUid?: string | null, dateIssued?: any | null, createdAt?: any | null, product?: { __typename?: 'StockProductType', uid: string, name: string } | null, issuedTo?: { __typename?: 'UserType', firstName?: string | null, lastName?: string | null } | null, department?: { __typename?: 'DepartmentType', uid: string, name?: string | null } | null, transactionBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null }> | null } };

export type GetAllStockAdustmentsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  text: Scalars['String']['input'];
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetAllStockAdustmentsQuery = { __typename?: 'Query', stockAdjustmentAll: { __typename?: 'StockAdjustmentCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'StockAdjustmentType', uid: string, productUid?: string | null, adjustmentType?: string | null, adjust?: number | null, adjustmentDate?: any | null, remarks?: string | null, adjustmentByUid?: string | null, createdAt?: any | null, createdByUid?: string | null, updatedAt?: any | null, updatedByUid?: string | null, product?: { __typename?: 'StockProductType', name: string } | null, adjustmentBy?: { __typename?: 'UserType', firstName?: string | null, lastName?: string | null } | null }> | null } };

export type AddNoticeMutationVariables = Exact<{
  payload: NoticeInputType;
}>;


export type AddNoticeMutation = { __typename?: 'Mutation', createNotice: { __typename: 'NoticeType', uid: string, title: string, body: string, expiry: string, createdByUid?: string | null, departments?: Array<{ __typename?: 'DepartmentType', uid: string, name?: string | null }> | null, groups?: Array<{ __typename?: 'GroupType', uid: string, name?: string | null }> | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditNoticeMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: NoticeInputType;
}>;


export type EditNoticeMutation = { __typename?: 'Mutation', updateNotice: { __typename: 'NoticeType', uid: string, title: string, body: string, expiry: string, createdByUid?: string | null, departments?: Array<{ __typename?: 'DepartmentType', uid: string, name?: string | null }> | null, groups?: Array<{ __typename?: 'GroupType', uid: string, name?: string | null }> | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type DeleteNoticeMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type DeleteNoticeMutation = { __typename?: 'Mutation', deleteNotice: { __typename: 'DeletedItem', uid: string } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type GetNoticesByCreatorUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetNoticesByCreatorUidQuery = { __typename?: 'Query', noticesByCreator?: Array<{ __typename?: 'NoticeType', uid: string, title: string, body: string, expiry: string, createdByUid?: string | null, departments?: Array<{ __typename?: 'DepartmentType', uid: string, name?: string | null }> | null, groups?: Array<{ __typename?: 'GroupType', uid: string, name?: string | null }> | null }> | null };

export type AddIdentificationMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type AddIdentificationMutation = { __typename?: 'Mutation', createIdentification: { __typename: 'IdentificationType', uid: string, name: string } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditIdentificationMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  name: Scalars['String']['input'];
}>;


export type EditIdentificationMutation = { __typename?: 'Mutation', updateIdentification: { __typename: 'IdentificationType', uid: string, name: string } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddPatientMutationVariables = Exact<{
  payload: PatientInputType;
}>;


export type AddPatientMutation = { __typename?: 'Mutation', createPatient: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'PatientType', uid: string, clientPatientId: string, patientId: string, firstName?: string | null, middleName?: string | null, lastName?: string | null, age?: number | null, gender?: string | null, dateOfBirth?: any | null, ageDobEstimated: boolean, phoneHome?: string | null, phoneMobile?: string | null, consentSms: boolean, countryUid?: string | null, provinceUid?: string | null, districtUid?: string | null, client?: { __typename?: 'ClientType', uid: string, name: string, district?: { __typename?: 'DistrictType', name?: string | null, province?: { __typename?: 'ProvinceType', name?: string | null } | null } | null } | null, identifications: Array<{ __typename?: 'PatientIdentificationType', uid: string, value: string, identificationUid: string, identification?: { __typename?: 'IdentificationType', uid: string, name: string } | null } | null>, country?: { __typename?: 'CountryType', uid: string, name?: string | null } | null, province?: { __typename?: 'ProvinceType', uid: string, name?: string | null } | null, district?: { __typename?: 'DistrictType', uid: string, name?: string | null } | null } };

export type EditPatientMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: PatientInputType;
}>;


export type EditPatientMutation = { __typename?: 'Mutation', updatePatient: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'PatientType', uid: string, clientPatientId: string, patientId: string, firstName?: string | null, middleName?: string | null, lastName?: string | null, age?: number | null, gender?: string | null, dateOfBirth?: any | null, ageDobEstimated: boolean, phoneHome?: string | null, phoneMobile?: string | null, consentSms: boolean, countryUid?: string | null, provinceUid?: string | null, districtUid?: string | null, client?: { __typename?: 'ClientType', uid: string, name: string, district?: { __typename?: 'DistrictType', name?: string | null, province?: { __typename?: 'ProvinceType', name?: string | null } | null } | null } | null, identifications: Array<{ __typename?: 'PatientIdentificationType', uid: string, value: string, identificationUid: string, identification?: { __typename?: 'IdentificationType', uid: string, name: string } | null } | null>, country?: { __typename?: 'CountryType', uid: string, name?: string | null } | null, province?: { __typename?: 'ProvinceType', uid: string, name?: string | null } | null, district?: { __typename?: 'DistrictType', uid: string, name?: string | null } | null } };

export type GetAllPatientsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  text: Scalars['String']['input'];
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetAllPatientsQuery = { __typename?: 'Query', patientAll: { __typename?: 'PatientCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'PatientType', uid: string, clientPatientId: string, patientId: string, firstName?: string | null, middleName?: string | null, lastName?: string | null, age?: number | null, gender?: string | null, dateOfBirth?: any | null, ageDobEstimated: boolean, clientUid: string, phoneHome?: string | null, phoneMobile?: string | null, consentSms: boolean, countryUid?: string | null, provinceUid?: string | null, districtUid?: string | null, client?: { __typename?: 'ClientType', uid: string, name: string, district?: { __typename?: 'DistrictType', uid: string, name?: string | null, province?: { __typename?: 'ProvinceType', uid: string, name?: string | null, country?: { __typename?: 'CountryType', uid: string, name?: string | null } | null } | null } | null } | null, identifications: Array<{ __typename?: 'PatientIdentificationType', uid: string, value: string, identificationUid: string, identification?: { __typename?: 'IdentificationType', uid: string, name: string } | null } | null>, country?: { __typename?: 'CountryType', uid: string, name?: string | null } | null, province?: { __typename?: 'ProvinceType', uid: string, name?: string | null } | null, district?: { __typename?: 'DistrictType', uid: string, name?: string | null } | null }> | null } };

export type SearchPatientsQueryVariables = Exact<{
  queryString: Scalars['String']['input'];
}>;


export type SearchPatientsQuery = { __typename?: 'Query', patientSearch: Array<{ __typename?: 'PatientType', uid: string, clientPatientId: string, patientId: string, firstName?: string | null, middleName?: string | null, lastName?: string | null, age?: number | null, gender?: string | null, dateOfBirth?: any | null, ageDobEstimated: boolean, phoneHome?: string | null, phoneMobile?: string | null, consentSms: boolean, countryUid?: string | null, provinceUid?: string | null, districtUid?: string | null, client?: { __typename?: 'ClientType', uid: string, name: string, district?: { __typename?: 'DistrictType', name?: string | null, province?: { __typename?: 'ProvinceType', name?: string | null } | null } | null } | null, identifications: Array<{ __typename?: 'PatientIdentificationType', uid: string, value: string, identificationUid: string, identification?: { __typename?: 'IdentificationType', uid: string, name: string } | null } | null>, country?: { __typename?: 'CountryType', uid: string, name?: string | null } | null, province?: { __typename?: 'ProvinceType', uid: string, name?: string | null } | null, district?: { __typename?: 'DistrictType', uid: string, name?: string | null } | null }> };

export type GetPatientByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetPatientByUidQuery = { __typename?: 'Query', patientByUid?: { __typename?: 'PatientType', uid: string, clientPatientId: string, patientId: string, firstName?: string | null, middleName?: string | null, lastName?: string | null, age?: number | null, gender?: string | null, dateOfBirth?: any | null, ageDobEstimated: boolean, phoneHome?: string | null, phoneMobile?: string | null, consentSms: boolean, countryUid?: string | null, provinceUid?: string | null, districtUid?: string | null, client?: { __typename?: 'ClientType', uid: string, name: string, district?: { __typename?: 'DistrictType', name?: string | null, province?: { __typename?: 'ProvinceType', name?: string | null } | null } | null } | null, identifications: Array<{ __typename?: 'PatientIdentificationType', uid: string, value: string, identificationUid: string, identification?: { __typename?: 'IdentificationType', uid: string, name: string } | null } | null>, country?: { __typename?: 'CountryType', uid: string, name?: string | null } | null, province?: { __typename?: 'ProvinceType', uid: string, name?: string | null } | null, district?: { __typename?: 'DistrictType', uid: string, name?: string | null } | null } | null };

export type IdentificationTypesQueryVariables = Exact<{ [key: string]: never; }>;


export type IdentificationTypesQuery = { __typename?: 'Query', identificationAll: Array<{ __typename?: 'IdentificationType', uid: string, name: string }> };

export type AddReflexRMutationVariables = Exact<{
  payload: ReflexRuleInput;
}>;


export type AddReflexRMutation = { __typename?: 'Mutation', createReflexRule: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ReflexRuleType', uid: string, name: string, description: string, createdByUid?: string | null, createdAt?: string | null } };

export type EditReflexRMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: ReflexRuleInput;
}>;


export type EditReflexRMutation = { __typename?: 'Mutation', updateReflexRule: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ReflexRuleType', uid: string, name: string, description: string, createdByUid?: string | null, createdAt?: string | null } };

export type AddReflexAMutationVariables = Exact<{
  payload: ReflexActionInput;
}>;


export type AddReflexAMutation = { __typename?: 'Mutation', createReflexAction: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ReflexActionType', uid: string, description: string, level: number, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string }> | null, reflexRule?: { __typename?: 'ReflexRuleType', uid: string, name: string } | null } };

export type EditReflexAMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: ReflexActionInput;
}>;


export type EditReflexAMutation = { __typename?: 'Mutation', updateReflexAction: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ReflexActionType', uid: string, description: string, level: number, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string }> | null, reflexRule?: { __typename?: 'ReflexRuleType', uid: string, name: string } | null } };

export type AddReflexBMutationVariables = Exact<{
  payload: ReflexBrainInput;
}>;


export type AddReflexBMutation = { __typename?: 'Mutation', createReflexBrain: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ReflexBrainType', uid: string, reflexActionUid: string, description: string, analysesValues?: Array<{ __typename?: 'ReflexBrainCriteriaType', analysisUid: string, operator: string, value: string, analysis?: { __typename?: 'AnalysisType', uid: string, name: string } | null }> | null, addNew?: Array<{ __typename?: 'ReflexBrainAdditionType', analysisUid: string, count: number, analysis?: { __typename?: 'AnalysisType', uid: string, name: string } | null }> | null, finalise?: Array<{ __typename?: 'ReflexBrainFinalType', analysisUid: string, value: string, analysis?: { __typename?: 'AnalysisType', uid: string, name: string } | null }> | null } };

export type EditReflexBMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: ReflexBrainInput;
}>;


export type EditReflexBMutation = { __typename?: 'Mutation', updateReflexBrain: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ReflexBrainType', uid: string, reflexActionUid: string, description: string, analysesValues?: Array<{ __typename?: 'ReflexBrainCriteriaType', analysisUid: string, operator: string, value: string, analysis?: { __typename?: 'AnalysisType', uid: string, name: string } | null }> | null, addNew?: Array<{ __typename?: 'ReflexBrainAdditionType', analysisUid: string, count: number, analysis?: { __typename?: 'AnalysisType', uid: string, name: string } | null }> | null, finalise?: Array<{ __typename?: 'ReflexBrainFinalType', analysisUid: string, value: string, analysis?: { __typename?: 'AnalysisType', uid: string, name: string } | null }> | null } };

export type GetAllReflexRulesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllReflexRulesQuery = { __typename?: 'Query', reflexRuleAll: { __typename?: 'ReflexRuleCursorPage', totalCount: number, items?: Array<{ __typename?: 'ReflexRuleType', uid: string, name: string, description: string, createdBy?: { __typename?: 'UserType', firstName?: string | null, lastName?: string | null } | null }> | null } };

export type GetReflexRuleByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetReflexRuleByUidQuery = { __typename?: 'Query', reflexRuleByUid?: { __typename?: 'ReflexRuleType', uid: string, name: string, description: string, reflexActions?: Array<{ __typename?: 'ReflexActionType', uid: string, level: number, description: string, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string }> | null, brains?: Array<{ __typename?: 'ReflexBrainType', description: string, analysesValues?: Array<{ __typename?: 'ReflexBrainCriteriaType', analysisUid: string, operator: string, value: string, analysis?: { __typename?: 'AnalysisType', uid: string, name: string, resultOptions?: Array<{ __typename?: 'ResultOptionType', optionKey: number, value: string }> | null } | null }> | null, addNew?: Array<{ __typename?: 'ReflexBrainAdditionType', analysisUid: string, count: number, analysis?: { __typename?: 'AnalysisType', uid: string, name: string, resultOptions?: Array<{ __typename?: 'ResultOptionType', optionKey: number, value: string }> | null } | null }> | null, finalise?: Array<{ __typename?: 'ReflexBrainFinalType', analysisUid: string, value: string, analysis?: { __typename?: 'AnalysisType', name: string, resultOptions?: Array<{ __typename?: 'ResultOptionType', optionKey: number, value: string }> | null } | null }> | null }> | null }> | null, createdBy?: { __typename?: 'UserType', firstName?: string | null, lastName?: string | null } | null } | null };

export type AddReferralLaboratoryMutationVariables = Exact<{
  payload: ReferralLaboratoryInputType;
}>;


export type AddReferralLaboratoryMutation = { __typename?: 'Mutation', createReferralLaboratory: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ReferralLaboratoryType', uid: string, name?: string | null, code?: string | null, url?: string | null, password?: string | null, username?: string | null, isReferral?: boolean | null, isReference?: boolean | null } };

export type EditReferralLaboratoryMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: ReferralLaboratoryInputType;
}>;


export type EditReferralLaboratoryMutation = { __typename?: 'Mutation', updateReferralLaboratory: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ReferralLaboratoryType', uid: string, name?: string | null, code?: string | null, url?: string | null, password?: string | null, username?: string | null, isReferral?: boolean | null, isReference?: boolean | null } };

export type AddShipmentMutationVariables = Exact<{
  payload: ShipmentInputType;
}>;


export type AddShipmentMutation = { __typename?: 'Mutation', createShipment: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ShipmentListingType', shipments?: Array<{ __typename?: 'ShipmentType', uid: string, shipmentId?: string | null, assignedCount?: number | null, state?: string | null, laboratoryUid?: string | null, createdAt?: any | null, laboratory?: { __typename?: 'ReferralLaboratoryType', name?: string | null } | null }> | null } };

export type UpdateShipmentMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: ShipmentUpdateInputType;
}>;


export type UpdateShipmentMutation = { __typename?: 'Mutation', updateShipment: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ShipmentType', uid: string, shipmentId?: string | null, assignedCount?: number | null, state?: string | null, incoming?: boolean | null, comment?: string | null, createdAt?: any | null, courier?: string | null, laboratory?: { __typename?: 'ReferralLaboratoryType', uid: string, name?: string | null } | null } };

export type ShipmentManageSamplesMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: ShipmentManageSamplesInput;
}>;


export type ShipmentManageSamplesMutation = { __typename?: 'Mutation', shipmentManageSamples: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ShipmentType', uid: string, shipmentId?: string | null, assignedCount?: number | null, state?: string | null, incoming?: boolean | null, comment?: string | null, createdAt?: any | null, courier?: string | null, laboratory?: { __typename?: 'ReferralLaboratoryType', uid: string, name?: string | null } | null, samples?: Array<{ __typename?: 'SampleType', uid: string, sampleId: string, status?: string | null, analysisRequest?: { __typename?: 'AnalysisRequestType', patient: { __typename?: 'PatientType', uid: string } } | null, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string, keyword?: string | null }> | null }> | null } };

export type ActionShipmentMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  action: Scalars['String']['input'];
}>;


export type ActionShipmentMutation = { __typename?: 'Mutation', actionShipment: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ShipmentType', uid: string, state?: string | null } };

export type GetAllReferralLaboratoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllReferralLaboratoriesQuery = { __typename?: 'Query', referralLaboratoryAll: Array<{ __typename?: 'ReferralLaboratoryType', uid: string, name?: string | null, code?: string | null, url?: string | null, password?: string | null, username?: string | null, isReferral?: boolean | null, isReference?: boolean | null }> };

export type GetAllShipmentsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  incoming: Scalars['Boolean']['input'];
  status: Scalars['String']['input'];
  text: Scalars['String']['input'];
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetAllShipmentsQuery = { __typename?: 'Query', shipmentAll: { __typename?: 'ShipmentCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'ShipmentType', uid: string, shipmentId?: string | null, assignedCount?: number | null, incoming?: boolean | null, state?: string | null, laboratoryUid?: string | null, courier?: string | null, createdAt?: any | null, laboratory?: { __typename?: 'ReferralLaboratoryType', name?: string | null } | null }> | null } };

export type GetShipmentByUidQueryVariables = Exact<{
  shipmentUid: Scalars['String']['input'];
}>;


export type GetShipmentByUidQuery = { __typename?: 'Query', shipmentByUid: { __typename?: 'ShipmentType', uid: string, shipmentId?: string | null, assignedCount?: number | null, state?: string | null, incoming?: boolean | null, comment?: string | null, createdAt?: any | null, courier?: string | null, jsonContent?: any | null, laboratory?: { __typename?: 'ReferralLaboratoryType', name?: string | null, url?: string | null, username?: string | null, password?: string | null } | null, shippedSamples?: Array<{ __typename?: 'ShippedSampleType', resultNotified?: boolean | null, extSampleId?: string | null, sample: { __typename?: 'SampleType', uid: string, sampleId: string, status?: string | null, analysisRequest?: { __typename?: 'AnalysisRequestType', clientRequestId: string, patient: { __typename?: 'PatientType', uid: string } } | null, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string, keyword?: string | null }> | null } }> | null } };

export type ManifestReportQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type ManifestReportQuery = { __typename?: 'Query', manifestReportDownload?: any | null };

export type AddStoreRoomMutationVariables = Exact<{
  payload: StoreRoomInputType;
}>;


export type AddStoreRoomMutation = { __typename?: 'Mutation', createStoreRoom: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StoreRoomType', uid: string, name: string, description?: string | null } };

export type EditStoreRoomMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: StoreRoomInputType;
}>;


export type EditStoreRoomMutation = { __typename?: 'Mutation', updateStoreRoom: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StoreRoomType', uid: string, name: string, description?: string | null } };

export type AddStorageLocationMutationVariables = Exact<{
  payload: StorageLocationInputType;
}>;


export type AddStorageLocationMutation = { __typename?: 'Mutation', createStorageLocation: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StorageLocationType', uid: string, name: string, description?: string | null, storeRoomUid: string } };

export type EditStorageLocationMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: StorageLocationInputType;
}>;


export type EditStorageLocationMutation = { __typename?: 'Mutation', updateStorageLocation: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StorageLocationType', uid: string, name: string, description?: string | null, storeRoomUid: string } };

export type AddStorageSectionMutationVariables = Exact<{
  payload: StorageSectionInputType;
}>;


export type AddStorageSectionMutation = { __typename?: 'Mutation', createStorageSection: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StorageSectionType', uid: string, name: string, description?: string | null, storageLocationUid: string, storageLocation?: { __typename?: 'StorageLocationType', uid: string, storeRoomUid: string } | null } };

export type EditStorageSectionMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: StorageSectionInputType;
}>;


export type EditStorageSectionMutation = { __typename?: 'Mutation', updateStorageSection: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StorageSectionType', uid: string, name: string, description?: string | null, storageLocationUid: string, storageLocation?: { __typename?: 'StorageLocationType', uid: string, storeRoomUid: string } | null } };

export type AddStorageContainerMutationVariables = Exact<{
  payload: StorageContainerInputType;
}>;


export type AddStorageContainerMutation = { __typename?: 'Mutation', createStorageContainer: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StorageContainerType', uid: string, name: string, description?: string | null, storageSectionUid: string, grid?: boolean | null, rowWise?: boolean | null, cols?: number | null, rows?: number | null, slots?: number | null, storageSection?: { __typename?: 'StorageSectionType', uid: string, storageLocationUid: string, storageLocation?: { __typename?: 'StorageLocationType', uid: string, storeRoomUid: string } | null } | null } };

export type EditStorageContainerMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: StorageContainerInputType;
}>;


export type EditStorageContainerMutation = { __typename?: 'Mutation', updateStorageContainer: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StorageContainerType', uid: string, name: string, description?: string | null, storageSectionUid: string, grid?: boolean | null, rowWise?: boolean | null, cols?: number | null, rows?: number | null, slots?: number | null, storageSection?: { __typename?: 'StorageSectionType', uid: string, storageLocationUid: string, storageLocation?: { __typename?: 'StorageLocationType', uid: string, storeRoomUid: string } | null } | null } };

export type StoreSamplesMutationVariables = Exact<{
  payload: Array<StoreSamplesInputType> | StoreSamplesInputType;
}>;


export type StoreSamplesMutation = { __typename?: 'Mutation', storeSamples: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StoredSamplesType', samples: Array<{ __typename?: 'SampleType', uid: string, sampleId: string, priority: number, status?: string | null, storageSlot?: string | null, storageContainerUid?: string | null }> } };

export type RecoverSamplesMutationVariables = Exact<{
  sampleUids: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type RecoverSamplesMutation = { __typename?: 'Mutation', recoverSamples: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StoredSamplesType', samples: Array<{ __typename?: 'SampleType', uid: string, status?: string | null, storageSlot?: string | null, storageContainerUid?: string | null }> } };

export type GetAllStoreRoomsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllStoreRoomsQuery = { __typename?: 'Query', storeRoomAll: Array<{ __typename?: 'StoreRoomType', uid: string, name: string, description?: string | null }> };

export type GetStoreRoomByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetStoreRoomByUidQuery = { __typename?: 'Query', storeRoomByUid?: { __typename?: 'StoreRoomType', uid: string, name: string, description?: string | null } | null };

export type GetAllStorageLocationsQueryVariables = Exact<{
  storeRoomUid: Scalars['String']['input'];
}>;


export type GetAllStorageLocationsQuery = { __typename?: 'Query', storageLocations: Array<{ __typename?: 'StorageLocationType', uid: string, name: string, description?: string | null, storeRoomUid: string }> };

export type GetStorageLocationByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetStorageLocationByUidQuery = { __typename?: 'Query', storageLocationByUid?: { __typename?: 'StorageLocationType', uid: string, name: string, description?: string | null, storeRoomUid: string } | null };

export type GetAllStorageSectionsQueryVariables = Exact<{
  storageLocationUid: Scalars['String']['input'];
}>;


export type GetAllStorageSectionsQuery = { __typename?: 'Query', storageSections: Array<{ __typename?: 'StorageSectionType', uid: string, name: string, description?: string | null, storageLocationUid: string }> };

export type GetStorageSectionByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetStorageSectionByUidQuery = { __typename?: 'Query', storageSectionByUid?: { __typename?: 'StorageSectionType', uid: string, name: string, description?: string | null, storageLocationUid: string } | null };

export type GetAllStorageContainersQueryVariables = Exact<{
  storageSectionUid: Scalars['String']['input'];
}>;


export type GetAllStorageContainersQuery = { __typename?: 'Query', storageContainers: Array<{ __typename?: 'StorageContainerType', uid: string, name: string, description?: string | null, storageSectionUid: string, grid?: boolean | null, rowWise?: boolean | null, cols?: number | null, rows?: number | null, slots?: number | null }> };

export type GetSrorageContainerByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetSrorageContainerByUidQuery = { __typename?: 'Query', storageContainerByUid?: { __typename?: 'StorageContainerType', uid: string, name: string, description?: string | null, storageSectionUid: string, grid?: boolean | null, rowWise?: boolean | null, cols?: number | null, rows?: number | null, slots?: number | null, storedCount?: number | null } | null };

export type GetStoreRoomsTreeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetStoreRoomsTreeQuery = { __typename?: 'Query', storeRoomAll: Array<{ __typename?: 'StoreRoomType', uid: string, name: string, description?: string | null, tag: string, children: Array<{ __typename?: 'StorageLocationType', uid: string, name: string, description?: string | null, tag: string, children: Array<{ __typename?: 'StorageSectionType', uid: string, name: string, description?: string | null, tag: string, children: Array<{ __typename?: 'StorageContainerType', uid: string, name: string, description?: string | null, tag: string } | null> } | null> } | null> }> };

export type GetSystemActivitySubscriptionVariables = Exact<{ [key: string]: never; }>;


export type GetSystemActivitySubscription = { __typename?: 'Subscription', latestActivity: { __typename?: 'ActivityStreamType', uid: string, actorUid?: string | null, actionObjectUid?: string | null, actionObjectType?: string | null, targetUid?: string | null, verb?: string | null, actor?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null, actionObject: { __typename: 'AnalysisResultType', uid: string, sampleUid: string, result?: string | null, status?: string | null } | { __typename: 'ReportMetaType', uid: string, status?: string | null, location?: string | null } | { __typename: 'SampleType', uid: string, sampleId: string, status?: string | null, analysisRequest?: { __typename?: 'AnalysisRequestType', patientUid: string } | null } | { __typename: 'UnknownObjectType' } | { __typename: 'WorkSheetType', uid: string, worksheetId: string, state?: string | null } } };

export type AddWorkSheetTemplateMutationVariables = Exact<{
  payload: WorksheetTemplateInputType;
}>;


export type AddWorkSheetTemplateMutation = { __typename?: 'Mutation', createWorksheetTemplate: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'WorkSheetTemplateType', uid: string, name: string, reserved?: any | null, numberOfSamples?: number | null, rows?: number | null, cols?: number | null, rowWise: boolean, worksheetType: string, instrumentUid?: string | null, sampleTypeUid?: string | null, description?: string | null, analysisUid?: string | null, state?: string | null, instrument?: { __typename?: 'InstrumentType', uid: string, name?: string | null } | null, sampleType?: { __typename?: 'SampleTypeTyp', uid: string, name: string } | null, qcTemplate?: { __typename?: 'QCTemplateType', uid: string, name: string, description?: string | null, qcLevels: Array<{ __typename?: 'QCLevelType', uid: string, level: string }> } | null, qcLevels?: Array<{ __typename?: 'QCLevelType', uid: string, level: string }> | null, analysis?: { __typename?: 'AnalysisType', uid: string, name: string } | null } };

export type EditWorkSheetTemplateMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: WorksheetTemplateInputType;
}>;


export type EditWorkSheetTemplateMutation = { __typename?: 'Mutation', updateWorksheetTemplate: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'WorkSheetTemplateType', uid: string, name: string, reserved?: any | null, numberOfSamples?: number | null, rows?: number | null, cols?: number | null, rowWise: boolean, worksheetType: string, instrumentUid?: string | null, sampleTypeUid?: string | null, description?: string | null, analysisUid?: string | null, state?: string | null, instrument?: { __typename?: 'InstrumentType', uid: string, name?: string | null } | null, sampleType?: { __typename?: 'SampleTypeTyp', uid: string, name: string } | null, qcTemplate?: { __typename?: 'QCTemplateType', uid: string, name: string, description?: string | null, qcLevels: Array<{ __typename?: 'QCLevelType', uid: string, level: string }> } | null, qcLevels?: Array<{ __typename?: 'QCLevelType', uid: string, level: string }> | null, analysis?: { __typename?: 'AnalysisType', uid: string, name: string } | null } };

export type AddWorkSheetMutationVariables = Exact<{
  analystUid: Scalars['String']['input'];
  templateUid: Scalars['String']['input'];
  count?: InputMaybe<Scalars['Int']['input']>;
}>;


export type AddWorkSheetMutation = { __typename?: 'Mutation', createWorksheet: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'WorksheetListingType', worksheets?: Array<{ __typename?: 'WorkSheetType', uid: string, worksheetId: string, numberOfSamples?: number | null, assignedCount: number, instrumentUid?: string | null, analysisUid?: string | null, state?: string | null, createdAt?: any | null, analyst?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null, auth?: { __typename?: 'UserAuthType', uid: string, userName: string } | null } | null, instrument?: { __typename?: 'InstrumentType', uid: string, name?: string | null } | null, analysis?: { __typename?: 'AnalysisType', uid: string, name: string } | null }> | null } };

export type UpdateWorkSheetMutationVariables = Exact<{
  worksheetUid: Scalars['String']['input'];
  analystUid?: InputMaybe<Scalars['String']['input']>;
  instrumentUid?: InputMaybe<Scalars['String']['input']>;
  methodUid?: InputMaybe<Scalars['String']['input']>;
  action?: InputMaybe<Scalars['String']['input']>;
  samples?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type UpdateWorkSheetMutation = { __typename?: 'Mutation', updateWorksheet: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'WorkSheetType', uid: string, numberOfSamples?: number | null, sampleTypeUid?: string | null, instrumentUid?: string | null, templateUid?: string | null, sampleType?: { __typename?: 'SampleTypeTyp', name: string } | null, instrument?: { __typename?: 'InstrumentType', uid: string, name?: string | null } | null, template?: { __typename?: 'WorkSheetTemplateType', uid: string, name: string } | null } };

export type EditWorkSheetApplyTemplateMutationVariables = Exact<{
  worksheetUid: Scalars['String']['input'];
  templateUid: Scalars['String']['input'];
}>;


export type EditWorkSheetApplyTemplateMutation = { __typename?: 'Mutation', updateWorksheetApplyTemplate: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'WorkSheetType', uid: string, numberOfSamples?: number | null, sampleTypeUid?: string | null, instrumentUid?: string | null, templateUid?: string | null, sampleType?: { __typename?: 'SampleTypeTyp', name: string } | null, instrument?: { __typename?: 'InstrumentType', uid: string, name?: string | null } | null, template?: { __typename?: 'WorkSheetTemplateType', uid: string, name: string } | null } };

export type ManualyAssignWorsheetMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  qcTemplateUid: Scalars['String']['input'];
  analysesUids: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type ManualyAssignWorsheetMutation = { __typename?: 'Mutation', updateWorksheetManualAssign: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'WorkSheetType', uid: string, numberOfSamples?: number | null, sampleTypeUid?: string | null, instrumentUid?: string | null, templateUid?: string | null, sampleType?: { __typename?: 'SampleTypeTyp', name: string } | null, instrument?: { __typename?: 'InstrumentType', uid: string, name?: string | null } | null, template?: { __typename?: 'WorkSheetTemplateType', uid: string, name: string } | null } };

export type GetAllWorksheetTemplatesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllWorksheetTemplatesQuery = { __typename?: 'Query', worksheetTemplateAll: Array<{ __typename?: 'WorkSheetTemplateType', uid: string, name: string, reserved?: any | null, numberOfSamples?: number | null, rows?: number | null, cols?: number | null, rowWise: boolean, worksheetType: string, instrumentUid?: string | null, sampleTypeUid?: string | null, description?: string | null, analysisUid?: string | null, state?: string | null, instrument?: { __typename?: 'InstrumentType', uid: string, name?: string | null } | null, sampleType?: { __typename?: 'SampleTypeTyp', uid: string, name: string } | null, analysis?: { __typename?: 'AnalysisType', uid: string, name: string } | null }> };

export type GetAllWorksheetsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  status: Scalars['String']['input'];
  text: Scalars['String']['input'];
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetAllWorksheetsQuery = { __typename?: 'Query', worksheetAll: { __typename?: 'WorkSheetCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'WorkSheetType', uid: string, worksheetId: string, numberOfSamples?: number | null, assignedCount: number, state?: string | null, createdAt?: any | null, analyst?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null, auth?: { __typename?: 'UserAuthType', uid: string, userName: string } | null } | null, instrument?: { __typename?: 'InstrumentType', uid: string, name?: string | null } | null, analysis?: { __typename?: 'AnalysisType', uid: string, name: string } | null }> | null } };

export type GetWorkSheetByUidQueryVariables = Exact<{
  worksheetUid: Scalars['String']['input'];
}>;


export type GetWorkSheetByUidQuery = { __typename?: 'Query', worksheetByUid: { __typename?: 'WorkSheetType', uid: string, worksheetId: string, numberOfSamples?: number | null, assignedCount: number, reserved?: any | null, state?: string | null, createdAt?: any | null, analyst?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null, auth?: { __typename?: 'UserAuthType', uid: string, userName: string } | null } | null, sampleType?: { __typename?: 'SampleTypeTyp', name: string } | null, instrument?: { __typename?: 'InstrumentType', uid: string, name?: string | null } | null, template?: { __typename?: 'WorkSheetTemplateType', uid: string, name: string } | null, analysis?: { __typename?: 'AnalysisType', uid: string, name: string } | null, analysisResults?: Array<{ __typename?: 'AnalysisResultType', uid: string, result?: string | null, status?: string | null, worksheetPosition?: number | null, retest: boolean, reportable: boolean, method?: { __typename?: 'MethodType', uid: string, name?: string | null } | null, instrument?: { __typename?: 'InstrumentType', uid: string, name?: string | null } | null, analysis?: { __typename?: 'AnalysisType', uid: string, name: string, unitUid?: string | null, unit?: { __typename?: 'UnitType', uid: string, name: string } | null, resultOptions?: Array<{ __typename?: 'ResultOptionType', uid: string, optionKey: number, value: string }> | null } | null, sample: { __typename?: 'SampleType', uid: string, sampleId: string, priority: number, analysisRequest?: { __typename?: 'AnalysisRequestType', uid: string, client: { __typename?: 'ClientType', uid: string, name: string }, patient: { __typename?: 'PatientType', uid: string, firstName?: string | null, lastName?: string | null, clientPatientId: string, patientId: string } } | null, qcLevel?: { __typename?: 'QCLevelType', uid: string, level: string } | null } }> | null } };


export const AuthenticateUserDocument = gql`
    mutation AuthenticateUser($username: String!, $password: String!) {
  authenticateUser(password: $password, username: $username) {
    ... on AuthenticatedData {
      __typename
      token
      tokenType
      user {
        uid
        firstName
        lastName
        groups {
          permissions {
            uid
            action
            target
          }
          uid
          name
          keyword
          pages
        }
        preferenceUid
        preference {
          expandedMenu
          theme
          departments {
            uid
            name
          }
        }
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAuthenticateUserMutation() {
  return Urql.useMutation<AuthenticateUserMutation, AuthenticateUserMutationVariables>(AuthenticateUserDocument);
};
export const AddUserDocument = gql`
    mutation addUser($firstName: String!, $lastName: String!, $email: String!, $groupUid: String) {
  createUser(
    firstName: $firstName
    lastName: $lastName
    email: $email
    groupUid: $groupUid
  ) {
    ... on UserType {
      uid
      firstName
      lastName
      email
      isActive
      isSuperuser
      mobilePhone
      auth {
        uid
        userName
        isBlocked
        userType
      }
      groups {
        permissions {
          uid
          action
          target
        }
        uid
        name
        keyword
        pages
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddUserMutation() {
  return Urql.useMutation<AddUserMutation, AddUserMutationVariables>(AddUserDocument);
};
export const EditUserDocument = gql`
    mutation editUser($userUid: String!, $firstName: String!, $lastName: String, $email: String, $groupUid: String, $mobilePhone: String, $isActive: Boolean) {
  updateUser(
    userUid: $userUid
    firstName: $firstName
    lastName: $lastName
    email: $email
    groupUid: $groupUid
    mobilePhone: $mobilePhone
    isActive: $isActive
  ) {
    ... on UserType {
      uid
      firstName
      lastName
      email
      isActive
      isSuperuser
      mobilePhone
      auth {
        uid
        userName
        isBlocked
        userType
      }
      groups {
        permissions {
          uid
          action
          target
        }
        uid
        name
        keyword
        pages
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditUserMutation() {
  return Urql.useMutation<EditUserMutation, EditUserMutationVariables>(EditUserDocument);
};
export const AddUserAuthDocument = gql`
    mutation addUserAuth($userUid: String!, $userName: String!, $password: String!, $passwordc: String!) {
  createUserAuth(
    userUid: $userUid
    userName: $userName
    password: $password
    passwordc: $passwordc
  ) {
    ... on UserType {
      uid
      firstName
      lastName
      email
      isActive
      isSuperuser
      mobilePhone
      auth {
        uid
        userName
        isBlocked
        userType
      }
      groups {
        permissions {
          uid
          action
          target
        }
        uid
        name
        keyword
        pages
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddUserAuthMutation() {
  return Urql.useMutation<AddUserAuthMutation, AddUserAuthMutationVariables>(AddUserAuthDocument);
};
export const EditUserAuthDocument = gql`
    mutation editUserAuth($userUid: String!, $userName: String!, $password: String!, $passwordc: String!) {
  updateUserAuth(
    userUid: $userUid
    userName: $userName
    password: $password
    passwordc: $passwordc
  ) {
    ... on UserType {
      uid
      firstName
      lastName
      email
      isActive
      isSuperuser
      mobilePhone
      auth {
        uid
        userName
        isBlocked
        userType
      }
      groups {
        permissions {
          uid
          action
          target
        }
        uid
        name
        keyword
        pages
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditUserAuthMutation() {
  return Urql.useMutation<EditUserAuthMutation, EditUserAuthMutationVariables>(EditUserAuthDocument);
};
export const AddGroupDocument = gql`
    mutation addGroup($payload: GroupInputType!) {
  createGroup(payload: $payload) {
    ... on GroupType {
      __typename
      uid
      name
      pages
      permissions {
        uid
        action
        target
        active
      }
      active
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddGroupMutation() {
  return Urql.useMutation<AddGroupMutation, AddGroupMutationVariables>(AddGroupDocument);
};
export const EditGroupDocument = gql`
    mutation editGroup($uid: String!, $payload: GroupInputType!) {
  updateGroup(uid: $uid, payload: $payload) {
    ... on GroupType {
      __typename
      uid
      name
      pages
      permissions {
        uid
        action
        target
        active
      }
      active
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditGroupMutation() {
  return Urql.useMutation<EditGroupMutation, EditGroupMutationVariables>(EditGroupDocument);
};
export const UpdateGroupsAndPermissionsDocument = gql`
    mutation updateGroupsAndPermissions($groupUid: String!, $permissionUid: String!) {
  updateGroupPermissions(groupUid: $groupUid, permissionUid: $permissionUid) {
    ... on UpdatedGroupPerms {
      group {
        uid
        name
        pages
        permissions {
          uid
          action
          target
          active
        }
        active
      }
      permission {
        uid
        action
        target
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useUpdateGroupsAndPermissionsMutation() {
  return Urql.useMutation<UpdateGroupsAndPermissionsMutation, UpdateGroupsAndPermissionsMutationVariables>(UpdateGroupsAndPermissionsDocument);
};
export const AddDepartmentDocument = gql`
    mutation addDepartment($payload: DepartmentInputType!) {
  createDepartment(payload: $payload) {
    ... on DepartmentType {
      uid
      name
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddDepartmentMutation() {
  return Urql.useMutation<AddDepartmentMutation, AddDepartmentMutationVariables>(AddDepartmentDocument);
};
export const EditDepartmentDocument = gql`
    mutation editDepartment($uid: String!, $payload: DepartmentInputType!) {
  updateDepartment(uid: $uid, payload: $payload) {
    ... on DepartmentType {
      uid
      name
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditDepartmentMutation() {
  return Urql.useMutation<EditDepartmentMutation, EditDepartmentMutationVariables>(EditDepartmentDocument);
};
export const EditLaboratoryDocument = gql`
    mutation editLaboratory($uid: String!, $payload: LaboratoryInputType!) {
  updateLaboratory(uid: $uid, payload: $payload) {
    ... on LaboratoryType {
      uid
      setupName
      labName
      labManagerUid
      email
      emailCc
      mobilePhone
      businessPhone
      address
      logo
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditLaboratoryMutation() {
  return Urql.useMutation<EditLaboratoryMutation, EditLaboratoryMutationVariables>(EditLaboratoryDocument);
};
export const EditLaboratorySettingDocument = gql`
    mutation editLaboratorySetting($uid: String!, $payload: LaboratorySettingInputType!) {
  updateLaboratorySetting(uid: $uid, payload: $payload) {
    ... on LaboratorySettingType {
      uid
      laboratoryUid
      allowSelfVerification
      allowPatientRegistration
      allowSampleRegistration
      allowWorksheetCreation
      defaultRoute
      passwordLifetime
      inactivityLogOut
      defaultTheme
      autoReceiveSamples
      stickerCopies
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditLaboratorySettingMutation() {
  return Urql.useMutation<EditLaboratorySettingMutation, EditLaboratorySettingMutationVariables>(EditLaboratorySettingDocument);
};
export const GetLaboratoryDocument = gql`
    query getLaboratory($setupName: String! = "felicity") {
  laboratory(setupName: $setupName) {
    uid
    setupName
    labName
    labManagerUid
    email
    emailCc
    mobilePhone
    businessPhone
    address
    logo
  }
}
    `;

export function useGetLaboratoryQuery(options: Omit<Urql.UseQueryArgs<never, GetLaboratoryQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetLaboratoryQuery>({ query: GetLaboratoryDocument, ...options });
};
export const GetLaboratorySettingDocument = gql`
    query getLaboratorySetting($setupName: String! = "felicity") {
  laboratorySetting(setupName: $setupName) {
    uid
    laboratoryUid
    allowSelfVerification
    allowPatientRegistration
    allowSampleRegistration
    allowWorksheetCreation
    defaultRoute
    passwordLifetime
    inactivityLogOut
    defaultTheme
    autoReceiveSamples
    stickerCopies
  }
}
    `;

export function useGetLaboratorySettingQuery(options: Omit<Urql.UseQueryArgs<never, GetLaboratorySettingQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetLaboratorySettingQuery>({ query: GetLaboratorySettingDocument, ...options });
};
export const UserAllDocument = gql`
    query userAll($first: Int, $after: String, $text: String, $sortBy: [String!] = ["uid"]) {
  userAll(pageSize: $first, afterCursor: $after, text: $text, sortBy: $sortBy) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    items {
      uid
      firstName
      lastName
      email
      isActive
      isSuperuser
      mobilePhone
      auth {
        uid
        userName
        isBlocked
        userType
      }
      groups {
        uid
        name
        keyword
        pages
        permissions {
          uid
          action
          target
        }
      }
    }
  }
}
    `;

export function useUserAllQuery(options: Omit<Urql.UseQueryArgs<never, UserAllQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<UserAllQuery>({ query: UserAllDocument, ...options });
};
export const GroupsAndPermissionsDocument = gql`
    query groupsAndPermissions {
  groupAll {
    uid
    name
    keyword
    pages
    active
    permissions {
      uid
      action
      target
    }
  }
  permissionAll {
    uid
    action
    target
  }
}
    `;

export function useGroupsAndPermissionsQuery(options: Omit<Urql.UseQueryArgs<never, GroupsAndPermissionsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GroupsAndPermissionsQuery>({ query: GroupsAndPermissionsDocument, ...options });
};
export const GetAuditLogsDocument = gql`
    query getAuditLogs($targetType: String!, $targetId: String!) {
  auditLogsFilter(targetType: $targetType, targetId: $targetId) {
    uid
    userId
    targetType
    targetId
    action
    stateBefore
    stateAfter
  }
}
    `;

export function useGetAuditLogsQuery(options: Omit<Urql.UseQueryArgs<never, GetAuditLogsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAuditLogsQuery>({ query: GetAuditLogsDocument, ...options });
};
export const GetAllDepartmentsDocument = gql`
    query getAllDepartments {
  departmentAll {
    uid
    name
    code
    description
  }
}
    `;

export function useGetAllDepartmentsQuery(options: Omit<Urql.UseQueryArgs<never, GetAllDepartmentsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllDepartmentsQuery>({ query: GetAllDepartmentsDocument, ...options });
};
export const AddCountryDocument = gql`
    mutation AddCountry($payload: CountryInputType!) {
  createCountry(payload: $payload) {
    ... on CountryType {
      __typename
      uid
      name
      code
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddCountryMutation() {
  return Urql.useMutation<AddCountryMutation, AddCountryMutationVariables>(AddCountryDocument);
};
export const EditCountryDocument = gql`
    mutation editCountry($uid: String!, $payload: CountryInputType!) {
  updateCountry(uid: $uid, payload: $payload) {
    ... on CountryType {
      __typename
      uid
      name
      code
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditCountryMutation() {
  return Urql.useMutation<EditCountryMutation, EditCountryMutationVariables>(EditCountryDocument);
};
export const AddProvinceDocument = gql`
    mutation AddProvince($payload: ProvinceInputType!) {
  createProvince(payload: $payload) {
    ... on ProvinceType {
      __typename
      uid
      name
      code
      countryUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddProvinceMutation() {
  return Urql.useMutation<AddProvinceMutation, AddProvinceMutationVariables>(AddProvinceDocument);
};
export const EditProvinceDocument = gql`
    mutation editProvince($uid: String!, $payload: ProvinceInputType!) {
  updateProvince(uid: $uid, payload: $payload) {
    ... on ProvinceType {
      __typename
      uid
      name
      code
      countryUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditProvinceMutation() {
  return Urql.useMutation<EditProvinceMutation, EditProvinceMutationVariables>(EditProvinceDocument);
};
export const AddDistrictDocument = gql`
    mutation AddDistrict($payload: DistrictInputType!) {
  createDistrict(payload: $payload) {
    ... on DistrictType {
      __typename
      uid
      name
      code
      provinceUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddDistrictMutation() {
  return Urql.useMutation<AddDistrictMutation, AddDistrictMutationVariables>(AddDistrictDocument);
};
export const EditDistrictDocument = gql`
    mutation editDistrict($uid: String!, $payload: DistrictInputType!) {
  updateDistrict(uid: $uid, payload: $payload) {
    ... on DistrictType {
      __typename
      uid
      name
      code
      provinceUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditDistrictMutation() {
  return Urql.useMutation<EditDistrictMutation, EditDistrictMutationVariables>(EditDistrictDocument);
};
export const GetAllCountriesDocument = gql`
    query getAllCountries {
  countryAll {
    uid
    name
    code
  }
}
    `;

export function useGetAllCountriesQuery(options: Omit<Urql.UseQueryArgs<never, GetAllCountriesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllCountriesQuery>({ query: GetAllCountriesDocument, ...options });
};
export const GetAllProvincesDocument = gql`
    query getAllProvinces {
  provinceAll {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    items {
      uid
      name
      code
      email
      emailCc
      businessPhone
      mobilePhone
      countryUid
    }
  }
}
    `;

export function useGetAllProvincesQuery(options: Omit<Urql.UseQueryArgs<never, GetAllProvincesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllProvincesQuery>({ query: GetAllProvincesDocument, ...options });
};
export const FilterProvincesByCountryDocument = gql`
    query filterProvincesByCountry($uid: String!) {
  provincesByCountryUid(uid: $uid) {
    name
    uid
    code
    countryUid
  }
}
    `;

export function useFilterProvincesByCountryQuery(options: Omit<Urql.UseQueryArgs<never, FilterProvincesByCountryQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<FilterProvincesByCountryQuery>({ query: FilterProvincesByCountryDocument, ...options });
};
export const GetAllDistrictsDocument = gql`
    query getAllDistricts {
  districtAll {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    items {
      uid
      name
      code
      email
      emailCc
      businessPhone
      mobilePhone
      provinceUid
    }
  }
}
    `;

export function useGetAllDistrictsQuery(options: Omit<Urql.UseQueryArgs<never, GetAllDistrictsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllDistrictsQuery>({ query: GetAllDistrictsDocument, ...options });
};
export const FilterDistrictsByProvinceDocument = gql`
    query filterDistrictsByProvince($uid: String!) {
  districtsByProvinceUid(uid: $uid) {
    name
    uid
    code
    provinceUid
  }
}
    `;

export function useFilterDistrictsByProvinceQuery(options: Omit<Urql.UseQueryArgs<never, FilterDistrictsByProvinceQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<FilterDistrictsByProvinceQuery>({ query: FilterDistrictsByProvinceDocument, ...options });
};
export const AddCodingStandardDocument = gql`
    mutation AddCodingStandard($payload: CodingStandardInputType!) {
  createCodingStandard(payload: $payload) {
    ... on CodingStandardType {
      __typename
      uid
      name
      description
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddCodingStandardMutation() {
  return Urql.useMutation<AddCodingStandardMutation, AddCodingStandardMutationVariables>(AddCodingStandardDocument);
};
export const EditCodingStandardDocument = gql`
    mutation EditCodingStandard($uid: String!, $payload: CodingStandardInputType!) {
  updateCodingStandard(uid: $uid, payload: $payload) {
    ... on CodingStandardType {
      __typename
      uid
      name
      description
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditCodingStandardMutation() {
  return Urql.useMutation<EditCodingStandardMutation, EditCodingStandardMutationVariables>(EditCodingStandardDocument);
};
export const AddSampleTypeDocument = gql`
    mutation AddSampleType($payload: SampleTypeInputType!) {
  createSampleType(payload: $payload) {
    ... on SampleTypeTyp {
      __typename
      uid
      name
      abbr
      description
      active
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddSampleTypeMutation() {
  return Urql.useMutation<AddSampleTypeMutation, AddSampleTypeMutationVariables>(AddSampleTypeDocument);
};
export const EditSampleTypeDocument = gql`
    mutation EditSampleType($uid: String!, $payload: SampleTypeInputType!) {
  updateSampleType(uid: $uid, payload: $payload) {
    ... on SampleTypeTyp {
      __typename
      uid
      name
      abbr
      description
      active
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditSampleTypeMutation() {
  return Urql.useMutation<EditSampleTypeMutation, EditSampleTypeMutationVariables>(EditSampleTypeDocument);
};
export const AddSampleTypeMappingDocument = gql`
    mutation AddSampleTypeMapping($payload: SampleTypeMappingInputType!) {
  createSampleTypeMapping(payload: $payload) {
    ... on SampleTypeMappingType {
      uid
      name
      description
      code
      codingStandardUid
      codingStandard {
        name
      }
      sampleTypeUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddSampleTypeMappingMutation() {
  return Urql.useMutation<AddSampleTypeMappingMutation, AddSampleTypeMappingMutationVariables>(AddSampleTypeMappingDocument);
};
export const EditSampleTypeMappingDocument = gql`
    mutation EditSampleTypeMapping($uid: String!, $payload: SampleTypeMappingInputType!) {
  updateSampleTypeMapping(uid: $uid, payload: $payload) {
    ... on SampleTypeMappingType {
      uid
      name
      description
      code
      codingStandardUid
      codingStandard {
        name
      }
      sampleTypeUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditSampleTypeMappingMutation() {
  return Urql.useMutation<EditSampleTypeMappingMutation, EditSampleTypeMappingMutationVariables>(EditSampleTypeMappingDocument);
};
export const ReInstateSamplesDocument = gql`
    mutation ReInstateSamples($samples: [String!]!) {
  reInstateSamples(samples: $samples) {
    ... on ResultedSampleListingType {
      __typename
      samples {
        uid
        status
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useReInstateSamplesMutation() {
  return Urql.useMutation<ReInstateSamplesMutation, ReInstateSamplesMutationVariables>(ReInstateSamplesDocument);
};
export const CloneSamplesDocument = gql`
    mutation CloneSamples($samples: [String!]!) {
  cloneSamples(samples: $samples) {
    ... on SampleListingType {
      __typename
      samples {
        uid
        parentId
        sampleType {
          uid
          name
        }
        sampleId
        priority
        status
        analyses {
          uid
          name
          sortKey
        }
        profiles {
          uid
          name
        }
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useCloneSamplesMutation() {
  return Urql.useMutation<CloneSamplesMutation, CloneSamplesMutationVariables>(CloneSamplesDocument);
};
export const CancelSamplesDocument = gql`
    mutation CancelSamples($samples: [String!]!) {
  cancelSamples(samples: $samples) {
    ... on ResultedSampleListingType {
      __typename
      samples {
        uid
        status
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useCancelSamplesMutation() {
  return Urql.useMutation<CancelSamplesMutation, CancelSamplesMutationVariables>(CancelSamplesDocument);
};
export const ReceiveSamplesDocument = gql`
    mutation ReceiveSamples($samples: [String!]!) {
  receiveSamples(samples: $samples) {
    ... on ResultedSampleListingType {
      __typename
      samples {
        uid
        status
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useReceiveSamplesMutation() {
  return Urql.useMutation<ReceiveSamplesMutation, ReceiveSamplesMutationVariables>(ReceiveSamplesDocument);
};
export const PublishSamplesDocument = gql`
    mutation PublishSamples($samples: [SamplePublishInputType!]!) {
  publishSamples(samples: $samples) {
    ... on OperationSuccess {
      __typename
      message
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function usePublishSamplesMutation() {
  return Urql.useMutation<PublishSamplesMutation, PublishSamplesMutationVariables>(PublishSamplesDocument);
};
export const PrintSamplesDocument = gql`
    mutation PrintSamples($samples: [String!]!) {
  printSamples(samples: $samples) {
    ... on SampleListingType {
      __typename
      samples {
        uid
        status
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function usePrintSamplesMutation() {
  return Urql.useMutation<PrintSamplesMutation, PrintSamplesMutationVariables>(PrintSamplesDocument);
};
export const InvalidateSamplesDocument = gql`
    mutation InvalidateSamples($samples: [String!]!) {
  invalidateSamples(samples: $samples) {
    ... on SampleListingType {
      __typename
      samples {
        uid
        status
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useInvalidateSamplesMutation() {
  return Urql.useMutation<InvalidateSamplesMutation, InvalidateSamplesMutationVariables>(InvalidateSamplesDocument);
};
export const VerifySamplesDocument = gql`
    mutation VerifySamples($samples: [String!]!) {
  verifySamples(samples: $samples) {
    ... on SampleListingType {
      __typename
      samples {
        uid
        status
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useVerifySamplesMutation() {
  return Urql.useMutation<VerifySamplesMutation, VerifySamplesMutationVariables>(VerifySamplesDocument);
};
export const RejectSamplesDocument = gql`
    mutation RejectSamples($samples: [SampleRejectInputType!]!) {
  rejectSamples(samples: $samples) {
    ... on SampleListingType {
      __typename
      samples {
        uid
        status
        rejectionReasons {
          uid
          reason
        }
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useRejectSamplesMutation() {
  return Urql.useMutation<RejectSamplesMutation, RejectSamplesMutationVariables>(RejectSamplesDocument);
};
export const AddResultOptionDocument = gql`
    mutation AddResultOption($payload: ResultOptionInputType!) {
  createResultOption(payload: $payload) {
    ... on ResultOptionType {
      uid
      optionKey
      value
      analysisUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddResultOptionMutation() {
  return Urql.useMutation<AddResultOptionMutation, AddResultOptionMutationVariables>(AddResultOptionDocument);
};
export const EditResultOptionDocument = gql`
    mutation EditResultOption($uid: String!, $payload: ResultOptionInputType!) {
  updateResultOption(uid: $uid, payload: $payload) {
    ... on ResultOptionType {
      uid
      optionKey
      value
      analysisUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditResultOptionMutation() {
  return Urql.useMutation<EditResultOptionMutation, EditResultOptionMutationVariables>(EditResultOptionDocument);
};
export const AddAnalysisInterimDocument = gql`
    mutation AddAnalysisInterim($payload: AnalysisInterimInput!) {
  createAnalysisInterim(payload: $payload) {
    ... on AnalysisInterimType {
      uid
      key
      value
      analysisUid
      instrumentUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddAnalysisInterimMutation() {
  return Urql.useMutation<AddAnalysisInterimMutation, AddAnalysisInterimMutationVariables>(AddAnalysisInterimDocument);
};
export const EditAnalysisInterimDocument = gql`
    mutation EditAnalysisInterim($uid: String!, $payload: AnalysisInterimInput!) {
  updateAnalysisInterim(uid: $uid, payload: $payload) {
    ... on AnalysisInterimType {
      uid
      key
      value
      analysisUid
      instrumentUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditAnalysisInterimMutation() {
  return Urql.useMutation<EditAnalysisInterimMutation, EditAnalysisInterimMutationVariables>(EditAnalysisInterimDocument);
};
export const AddAnalysisCorrectionFactorDocument = gql`
    mutation AddAnalysisCorrectionFactor($payload: AnalysisCorrectionFactorInput!) {
  createAnalysisCorrectionFactor(payload: $payload) {
    ... on AnalysisCorrectionFactorType {
      uid
      factor
      analysisUid
      instrumentUid
      methodUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddAnalysisCorrectionFactorMutation() {
  return Urql.useMutation<AddAnalysisCorrectionFactorMutation, AddAnalysisCorrectionFactorMutationVariables>(AddAnalysisCorrectionFactorDocument);
};
export const EditAnalysisCorrectionFactorDocument = gql`
    mutation EditAnalysisCorrectionFactor($uid: String!, $payload: AnalysisCorrectionFactorInput!) {
  updateAnalysisCorrectionFactor(uid: $uid, payload: $payload) {
    ... on AnalysisCorrectionFactorType {
      uid
      factor
      analysisUid
      instrumentUid
      methodUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditAnalysisCorrectionFactorMutation() {
  return Urql.useMutation<EditAnalysisCorrectionFactorMutation, EditAnalysisCorrectionFactorMutationVariables>(EditAnalysisCorrectionFactorDocument);
};
export const AddAnalysisUncertaintyDocument = gql`
    mutation AddAnalysisUncertainty($payload: AnalysisUncertaintyInput!) {
  createAnalysisUncertainty(payload: $payload) {
    ... on AnalysisUncertaintyType {
      uid
      value
      min
      max
      analysisUid
      instrumentUid
      methodUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddAnalysisUncertaintyMutation() {
  return Urql.useMutation<AddAnalysisUncertaintyMutation, AddAnalysisUncertaintyMutationVariables>(AddAnalysisUncertaintyDocument);
};
export const EditAnalysisUncertaintyDocument = gql`
    mutation EditAnalysisUncertainty($uid: String!, $payload: AnalysisUncertaintyInput!) {
  updateAnalysisUncertainty(uid: $uid, payload: $payload) {
    ... on AnalysisUncertaintyType {
      uid
      value
      min
      max
      analysisUid
      instrumentUid
      methodUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditAnalysisUncertaintyMutation() {
  return Urql.useMutation<EditAnalysisUncertaintyMutation, EditAnalysisUncertaintyMutationVariables>(EditAnalysisUncertaintyDocument);
};
export const AddAnalysisDetectionLimitDocument = gql`
    mutation AddAnalysisDetectionLimit($payload: AnalysisDetectionLimitInput!) {
  createAnalysisDetectionLimit(payload: $payload) {
    ... on AnalysisDetectionLimitType {
      uid
      lowerLimit
      upperLimit
      analysisUid
      instrumentUid
      methodUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddAnalysisDetectionLimitMutation() {
  return Urql.useMutation<AddAnalysisDetectionLimitMutation, AddAnalysisDetectionLimitMutationVariables>(AddAnalysisDetectionLimitDocument);
};
export const EditAnalysisDetectionLimitDocument = gql`
    mutation EditAnalysisDetectionLimit($uid: String!, $payload: AnalysisDetectionLimitInput!) {
  updateAnalysisDetectionLimit(uid: $uid, payload: $payload) {
    ... on AnalysisDetectionLimitType {
      uid
      lowerLimit
      upperLimit
      analysisUid
      instrumentUid
      methodUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditAnalysisDetectionLimitMutation() {
  return Urql.useMutation<EditAnalysisDetectionLimitMutation, EditAnalysisDetectionLimitMutationVariables>(EditAnalysisDetectionLimitDocument);
};
export const AddAnalysisSpecificationDocument = gql`
    mutation AddAnalysisSpecification($payload: AnalysisSpecificationInput!) {
  createAnalysisSpecification(payload: $payload) {
    ... on AnalysisSpecificationType {
      uid
      analysisUid
      min
      max
      minWarn
      maxWarn
      minReport
      maxReport
      warnValues
      warnReport
      gender
      ageMin
      ageMax
      methodUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddAnalysisSpecificationMutation() {
  return Urql.useMutation<AddAnalysisSpecificationMutation, AddAnalysisSpecificationMutationVariables>(AddAnalysisSpecificationDocument);
};
export const EditAnalysisSpecificationDocument = gql`
    mutation EditAnalysisSpecification($uid: String!, $payload: AnalysisSpecificationInput!) {
  updateAnalysisSpecification(uid: $uid, payload: $payload) {
    ... on AnalysisSpecificationType {
      uid
      analysisUid
      min
      max
      minWarn
      maxWarn
      minReport
      maxReport
      warnValues
      warnReport
      gender
      ageMin
      ageMax
      methodUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditAnalysisSpecificationMutation() {
  return Urql.useMutation<EditAnalysisSpecificationMutation, EditAnalysisSpecificationMutationVariables>(EditAnalysisSpecificationDocument);
};
export const AddAnalysisServiceDocument = gql`
    mutation AddAnalysisService($payload: AnalysisInputType!) {
  createAnalysis(payload: $payload) {
    ... on AnalysisWithProfiles {
      __typename
      uid
      name
      keyword
      sortKey
      tatLengthMinutes
      precision
      requiredVerifications
      selfVerification
      description
      categoryUid
      departmentUid
      unitUid
      unit {
        uid
        name
      }
      sampleTypes {
        uid
        name
      }
      methods {
        uid
        name
      }
      resultOptions {
        uid
        optionKey
        value
      }
      category {
        uid
        name
      }
      profiles {
        uid
        name
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddAnalysisServiceMutation() {
  return Urql.useMutation<AddAnalysisServiceMutation, AddAnalysisServiceMutationVariables>(AddAnalysisServiceDocument);
};
export const EditAnalysisServiceDocument = gql`
    mutation EditAnalysisService($uid: String!, $payload: AnalysisInputType!) {
  updateAnalysis(uid: $uid, payload: $payload) {
    ... on AnalysisWithProfiles {
      __typename
      uid
      name
      keyword
      sortKey
      tatLengthMinutes
      precision
      requiredVerifications
      selfVerification
      description
      categoryUid
      departmentUid
      unitUid
      unit {
        uid
        name
      }
      sampleTypes {
        uid
        name
      }
      methods {
        uid
        name
      }
      resultOptions {
        uid
        optionKey
        value
      }
      category {
        uid
        name
      }
      profiles {
        uid
        name
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditAnalysisServiceMutation() {
  return Urql.useMutation<EditAnalysisServiceMutation, EditAnalysisServiceMutationVariables>(EditAnalysisServiceDocument);
};
export const AddAnalysisMappingDocument = gql`
    mutation AddAnalysisMapping($payload: AnalysisMappingInputType!) {
  createAnalysisMapping(payload: $payload) {
    ... on AnalysisMappingType {
      uid
      name
      description
      code
      codingStandardUid
      codingStandard {
        name
      }
      analysisUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddAnalysisMappingMutation() {
  return Urql.useMutation<AddAnalysisMappingMutation, AddAnalysisMappingMutationVariables>(AddAnalysisMappingDocument);
};
export const EditAnalysisMappingDocument = gql`
    mutation EditAnalysisMapping($uid: String!, $payload: AnalysisMappingInputType!) {
  updateAnalysisMapping(uid: $uid, payload: $payload) {
    ... on AnalysisMappingType {
      uid
      name
      description
      code
      codingStandardUid
      codingStandard {
        name
      }
      analysisUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditAnalysisMappingMutation() {
  return Urql.useMutation<EditAnalysisMappingMutation, EditAnalysisMappingMutationVariables>(EditAnalysisMappingDocument);
};
export const AddAnalysisProfileDocument = gql`
    mutation AddAnalysisProfile($payload: ProfileInputType!) {
  createProfile(payload: $payload) {
    ... on ProfileType {
      uid
      name
      description
      keyword
      active
      departmentUid
      sampleTypes {
        uid
        name
      }
      analyses {
        uid
        name
        keyword
        active
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddAnalysisProfileMutation() {
  return Urql.useMutation<AddAnalysisProfileMutation, AddAnalysisProfileMutationVariables>(AddAnalysisProfileDocument);
};
export const EditAnalysisProfileDocument = gql`
    mutation EditAnalysisProfile($uid: String!, $payload: ProfileInputType!) {
  updateProfile(uid: $uid, payload: $payload) {
    ... on ProfileType {
      uid
      name
      description
      keyword
      active
      departmentUid
      sampleTypes {
        uid
        name
      }
      analyses {
        uid
        name
        keyword
        active
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditAnalysisProfileMutation() {
  return Urql.useMutation<EditAnalysisProfileMutation, EditAnalysisProfileMutationVariables>(EditAnalysisProfileDocument);
};
export const AddProfileMappingDocument = gql`
    mutation AddProfileMapping($payload: ProfileMappingInputType!) {
  createProfileMapping(payload: $payload) {
    ... on ProfileMappingType {
      uid
      name
      description
      code
      codingStandardUid
      codingStandard {
        name
      }
      profileUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddProfileMappingMutation() {
  return Urql.useMutation<AddProfileMappingMutation, AddProfileMappingMutationVariables>(AddProfileMappingDocument);
};
export const EditProfileMappingDocument = gql`
    mutation EditProfileMapping($uid: String!, $payload: ProfileMappingInputType!) {
  updateProfileMapping(uid: $uid, payload: $payload) {
    ... on ProfileMappingType {
      uid
      name
      description
      code
      codingStandardUid
      codingStandard {
        name
      }
      profileUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditProfileMappingMutation() {
  return Urql.useMutation<EditProfileMappingMutation, EditProfileMappingMutationVariables>(EditProfileMappingDocument);
};
export const AddAnalysisCategoryDocument = gql`
    mutation AddAnalysisCategory($payload: AnalysisCategoryInputType!) {
  createAnalysisCategory(payload: $payload) {
    ... on AnalysisCategoryType {
      uid
      name
      active
      description
      department {
        uid
        name
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddAnalysisCategoryMutation() {
  return Urql.useMutation<AddAnalysisCategoryMutation, AddAnalysisCategoryMutationVariables>(AddAnalysisCategoryDocument);
};
export const EditAnalysisCategoryDocument = gql`
    mutation EditAnalysisCategory($uid: String!, $payload: AnalysisCategoryInputType!) {
  updateAnalysisCategory(uid: $uid, payload: $payload) {
    ... on AnalysisCategoryType {
      uid
      name
      active
      description
      department {
        uid
        name
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditAnalysisCategoryMutation() {
  return Urql.useMutation<EditAnalysisCategoryMutation, EditAnalysisCategoryMutationVariables>(EditAnalysisCategoryDocument);
};
export const AddAnalysisRequestDocument = gql`
    mutation AddAnalysisRequest($payload: AnalysisRequestInputType!) {
  createAnalysisRequest(payload: $payload) {
    ... on AnalysisRequestWithSamples {
      __typename
      uid
      clientRequestId
      createdAt
      patient {
        uid
        firstName
        lastName
        clientPatientId
        gender
        dateOfBirth
        age
        ageDobEstimated
        consentSms
      }
      client {
        uid
        name
      }
      samples {
        uid
        sampleType {
          uid
          name
        }
        sampleId
        priority
        status
        analyses {
          uid
          name
          sortKey
        }
        profiles {
          uid
          name
        }
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddAnalysisRequestMutation() {
  return Urql.useMutation<AddAnalysisRequestMutation, AddAnalysisRequestMutationVariables>(AddAnalysisRequestDocument);
};
export const SubmitAnalysisResultsDocument = gql`
    mutation SubmitAnalysisResults($analysisResults: [ARResultInputType!]!, $sourceObject: String!, $sourceObjectUid: String!) {
  submitAnalysisResults(
    analysisResults: $analysisResults
    sourceObject: $sourceObject
    sourceObjectUid: $sourceObjectUid
  ) {
    ... on OperationSuccess {
      message
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useSubmitAnalysisResultsMutation() {
  return Urql.useMutation<SubmitAnalysisResultsMutation, SubmitAnalysisResultsMutationVariables>(SubmitAnalysisResultsDocument);
};
export const CancelAnalysisResultsDocument = gql`
    mutation CancelAnalysisResults($analyses: [String!]!) {
  cancelAnalysisResults(analyses: $analyses) {
    ... on ResultListingType {
      results {
        uid
        status
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useCancelAnalysisResultsMutation() {
  return Urql.useMutation<CancelAnalysisResultsMutation, CancelAnalysisResultsMutationVariables>(CancelAnalysisResultsDocument);
};
export const ReInstateAnalysisResultsDocument = gql`
    mutation ReInstateAnalysisResults($analyses: [String!]!) {
  reInstateAnalysisResults(analyses: $analyses) {
    ... on ResultListingType {
      results {
        uid
        status
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useReInstateAnalysisResultsMutation() {
  return Urql.useMutation<ReInstateAnalysisResultsMutation, ReInstateAnalysisResultsMutationVariables>(ReInstateAnalysisResultsDocument);
};
export const VerifyAnalysisResultsDocument = gql`
    mutation VerifyAnalysisResults($analyses: [String!]!, $sourceObject: String!, $sourceObjectUid: String!) {
  verifyAnalysisResults(
    analyses: $analyses
    sourceObject: $sourceObject
    sourceObjectUid: $sourceObjectUid
  ) {
    ... on OperationSuccess {
      message
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useVerifyAnalysisResultsMutation() {
  return Urql.useMutation<VerifyAnalysisResultsMutation, VerifyAnalysisResultsMutationVariables>(VerifyAnalysisResultsDocument);
};
export const RetractAnalysisResultsDocument = gql`
    mutation RetractAnalysisResults($analyses: [String!]!) {
  retractAnalysisResults(analyses: $analyses) {
    ... on ResultListingType {
      results {
        uid
        status
        sampleUid
        result
        sample {
          uid
          sampleId
          status
          rejectionReasons {
            uid
            reason
          }
        }
        analysisUid
        analysis {
          uid
          name
          unitUid
          unit {
            uid
            name
          }
          sortKey
          interims {
            uid
            key
            value
            analysisUid
            instrumentUid
          }
          resultOptions {
            uid
            optionKey
            value
          }
        }
        retest
        reportable
        createdAt
        createdByUid
        updatedAt
        updatedByUid
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useRetractAnalysisResultsMutation() {
  return Urql.useMutation<RetractAnalysisResultsMutation, RetractAnalysisResultsMutationVariables>(RetractAnalysisResultsDocument);
};
export const RetestAnalysisResultsDocument = gql`
    mutation RetestAnalysisResults($analyses: [String!]!) {
  retestAnalysisResults(analyses: $analyses) {
    ... on ResultListingType {
      results {
        uid
        status
        sampleUid
        result
        sample {
          uid
          sampleId
          status
          rejectionReasons {
            uid
            reason
          }
        }
        analysisUid
        analysis {
          uid
          name
          unitUid
          unit {
            uid
            name
          }
          sortKey
          interims {
            uid
            key
            value
            analysisUid
            instrumentUid
          }
          resultOptions {
            uid
            optionKey
            value
          }
        }
        retest
        reportable
        createdAt
        createdByUid
        updatedAt
        updatedByUid
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useRetestAnalysisResultsMutation() {
  return Urql.useMutation<RetestAnalysisResultsMutation, RetestAnalysisResultsMutationVariables>(RetestAnalysisResultsDocument);
};
export const AddQcLevelDocument = gql`
    mutation AddQCLevel($level: String!) {
  createQcLevel(level: $level) {
    ... on QCLevelType {
      uid
      level
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddQcLevelMutation() {
  return Urql.useMutation<AddQcLevelMutation, AddQcLevelMutationVariables>(AddQcLevelDocument);
};
export const EditQcLevelDocument = gql`
    mutation EditQCLevel($uid: String!, $level: String!) {
  updateQcLevel(uid: $uid, level: $level) {
    ... on QCLevelType {
      uid
      level
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditQcLevelMutation() {
  return Urql.useMutation<EditQcLevelMutation, EditQcLevelMutationVariables>(EditQcLevelDocument);
};
export const AddQcTemplateDocument = gql`
    mutation AddQCTemplate($payload: QCTemplateInputType!) {
  createQcTemplate(payload: $payload) {
    ... on QCTemplateType {
      uid
      name
      description
      qcLevels {
        uid
        level
      }
      departments {
        uid
        name
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddQcTemplateMutation() {
  return Urql.useMutation<AddQcTemplateMutation, AddQcTemplateMutationVariables>(AddQcTemplateDocument);
};
export const EditQcTemplateDocument = gql`
    mutation EditQCTemplate($uid: String!, $payload: QCTemplateInputType!) {
  updateQcTemplate(uid: $uid, payload: $payload) {
    ... on QCTemplateType {
      uid
      name
      description
      qcLevels {
        uid
        level
      }
      departments {
        uid
        name
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditQcTemplateMutation() {
  return Urql.useMutation<EditQcTemplateMutation, EditQcTemplateMutationVariables>(EditQcTemplateDocument);
};
export const AddQcRequestDocument = gql`
    mutation AddQCRequest($samples: [QCSetInputType!]!) {
  createQcSet(samples: $samples) {
    ... on CreateQCSetData {
      __typename
      samples {
        uid
        sampleId
        status
        qcLevel {
          uid
          level
        }
        analyses {
          uid
          name
        }
        profiles {
          uid
          name
        }
      }
      qcSets {
        uid
        name
        note
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddQcRequestMutation() {
  return Urql.useMutation<AddQcRequestMutation, AddQcRequestMutationVariables>(AddQcRequestDocument);
};
export const AddRejectionReasonDocument = gql`
    mutation AddRejectionReason($reason: String!) {
  createRejectionReason(reason: $reason) {
    ... on RejectionReasonType {
      __typename
      uid
      reason
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddRejectionReasonMutation() {
  return Urql.useMutation<AddRejectionReasonMutation, AddRejectionReasonMutationVariables>(AddRejectionReasonDocument);
};
export const EditRejectionReasonDocument = gql`
    mutation EditRejectionReason($uid: String!, $reason: String!) {
  updateRejectionReason(uid: $uid, reason: $reason) {
    ... on RejectionReasonType {
      __typename
      uid
      reason
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditRejectionReasonMutation() {
  return Urql.useMutation<EditRejectionReasonMutation, EditRejectionReasonMutationVariables>(EditRejectionReasonDocument);
};
export const GetAllCodingStandardsDocument = gql`
    query getAllCodingStandards {
  codingStandardAll {
    uid
    name
    description
  }
}
    `;

export function useGetAllCodingStandardsQuery(options: Omit<Urql.UseQueryArgs<never, GetAllCodingStandardsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllCodingStandardsQuery>({ query: GetAllCodingStandardsDocument, ...options });
};
export const GetAllSampleTypesDocument = gql`
    query getAllSampleTypes {
  sampleTypeAll {
    uid
    name
    abbr
    description
    active
  }
}
    `;

export function useGetAllSampleTypesQuery(options: Omit<Urql.UseQueryArgs<never, GetAllSampleTypesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllSampleTypesQuery>({ query: GetAllSampleTypesDocument, ...options });
};
export const GeSampleTypeMappingsBySampleTypeUidDocument = gql`
    query geSampleTypeMappingsBySampleTypeUid($uid: String!) {
  sampleTypeMappingsBySampleType(sampleTypeUid: $uid) {
    uid
    sampleTypeUid
    codingStandardUid
    codingStandard {
      name
    }
    name
    code
    description
  }
}
    `;

export function useGeSampleTypeMappingsBySampleTypeUidQuery(options: Omit<Urql.UseQueryArgs<never, GeSampleTypeMappingsBySampleTypeUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GeSampleTypeMappingsBySampleTypeUidQuery>({ query: GeSampleTypeMappingsBySampleTypeUidDocument, ...options });
};
export const GetAllAnalysesServicesDocument = gql`
    query getAllAnalysesServices($first: Int, $after: String, $text: String, $sortBy: [String!] = ["name"]) {
  analysisAll(pageSize: $first, afterCursor: $after, text: $text, sortBy: $sortBy) {
    items {
      uid
      name
      keyword
      active
      sortKey
      tatLengthMinutes
      precision
      requiredVerifications
      selfVerification
      description
      categoryUid
      departmentUid
      unitUid
      unit {
        uid
        name
      }
      sampleTypes {
        uid
        name
      }
      specifications {
        uid
        analysisUid
        unitUid
        unit {
          uid
          name
          isSiUnit
        }
        min
        max
        minWarn
        maxWarn
        minReport
        maxReport
        warnValues
        warnReport
        gender
        ageMin
        ageMax
        methodUid
      }
      uncertainties {
        uid
        min
        max
        value
        analysisUid
        instrumentUid
        methodUid
      }
      detectionLimits {
        uid
        lowerLimit
        upperLimit
        analysisUid
        instrumentUid
        methodUid
      }
      correctionFactors {
        uid
        factor
        analysisUid
        instrumentUid
        methodUid
      }
      correctionFactors {
        uid
        factor
        analysisUid
        instrumentUid
        methodUid
      }
      interims {
        uid
        key
        value
        analysisUid
        instrumentUid
      }
      instruments {
        uid
        name
        keyword
      }
      methods {
        uid
        name
        keyword
        description
        instruments {
          uid
          name
          keyword
          description
        }
      }
      resultOptions {
        uid
        optionKey
        value
      }
      category {
        uid
        name
      }
      profiles {
        uid
        name
      }
    }
  }
}
    `;

export function useGetAllAnalysesServicesQuery(options: Omit<Urql.UseQueryArgs<never, GetAllAnalysesServicesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllAnalysesServicesQuery>({ query: GetAllAnalysesServicesDocument, ...options });
};
export const GetAllAnalysesProfilesDocument = gql`
    query getAllAnalysesProfiles {
  profileAll {
    uid
    name
    description
    keyword
    active
    departmentUid
    sampleTypes {
      uid
      name
    }
    analyses {
      name
      keyword
      active
      sortKey
    }
  }
}
    `;

export function useGetAllAnalysesProfilesQuery(options: Omit<Urql.UseQueryArgs<never, GetAllAnalysesProfilesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllAnalysesProfilesQuery>({ query: GetAllAnalysesProfilesDocument, ...options });
};
export const GetAnalysisMappingsByAnalysisUidDocument = gql`
    query getAnalysisMappingsByAnalysisUid($uid: String!) {
  analysisMappingsByAnalysis(analysisUid: $uid) {
    uid
    analysisUid
    codingStandardUid
    codingStandard {
      name
    }
    name
    code
    description
  }
}
    `;

export function useGetAnalysisMappingsByAnalysisUidQuery(options: Omit<Urql.UseQueryArgs<never, GetAnalysisMappingsByAnalysisUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAnalysisMappingsByAnalysisUidQuery>({ query: GetAnalysisMappingsByAnalysisUidDocument, ...options });
};
export const GetAllProfilesAndServicesDocument = gql`
    query getAllProfilesANDServices {
  profileAll {
    uid
    name
    description
    keyword
    active
    departmentUid
    sampleTypes {
      uid
      name
    }
    analyses {
      uid
      name
      keyword
      sortKey
      active
    }
  }
  analysisAll {
    items {
      uid
      name
      keyword
      active
      description
      sortKey
      tatLengthMinutes
      precision
      requiredVerifications
      selfVerification
      categoryUid
      departmentUid
      unitUid
      unit {
        uid
        name
      }
      sampleTypes {
        uid
        name
      }
      specifications {
        uid
        analysisUid
        unitUid
        unit {
          uid
          name
          isSiUnit
        }
        min
        max
        minWarn
        maxWarn
        minReport
        maxReport
        warnValues
        warnReport
        gender
        ageMin
        ageMax
        methodUid
      }
      uncertainties {
        uid
        min
        max
        value
        analysisUid
        instrumentUid
        methodUid
      }
      detectionLimits {
        uid
        lowerLimit
        upperLimit
        analysisUid
        instrumentUid
        methodUid
      }
      correctionFactors {
        uid
        factor
        analysisUid
        instrumentUid
        methodUid
      }
      correctionFactors {
        uid
        factor
        analysisUid
        instrumentUid
        methodUid
      }
      interims {
        uid
        key
        value
        analysisUid
        instrumentUid
      }
      instruments {
        uid
        name
        keyword
        description
      }
      methods {
        uid
        name
        keyword
        description
      }
      resultOptions {
        uid
        optionKey
        value
      }
      category {
        uid
        name
      }
      profiles {
        uid
        name
      }
    }
  }
}
    `;

export function useGetAllProfilesAndServicesQuery(options: Omit<Urql.UseQueryArgs<never, GetAllProfilesAndServicesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllProfilesAndServicesQuery>({ query: GetAllProfilesAndServicesDocument, ...options });
};
export const GetProfileMappingsByProfileUidDocument = gql`
    query getProfileMappingsByProfileUid($uid: String!) {
  profileMappingsByProfile(profileUid: $uid) {
    uid
    profileUid
    codingStandardUid
    codingStandard {
      name
    }
    name
    code
    description
  }
}
    `;

export function useGetProfileMappingsByProfileUidQuery(options: Omit<Urql.UseQueryArgs<never, GetProfileMappingsByProfileUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetProfileMappingsByProfileUidQuery>({ query: GetProfileMappingsByProfileUidDocument, ...options });
};
export const GetAllAnalysesCategoriesDocument = gql`
    query getAllAnalysesCategories {
  analysisCategoryAll {
    uid
    name
    description
    active
    departmentUid
    department {
      uid
      name
    }
  }
}
    `;

export function useGetAllAnalysesCategoriesQuery(options: Omit<Urql.UseQueryArgs<never, GetAllAnalysesCategoriesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllAnalysesCategoriesQuery>({ query: GetAllAnalysesCategoriesDocument, ...options });
};
export const GetAllSamplesDocument = gql`
    query getAllSamples($first: Int!, $after: String, $before: String, $status: String!, $text: String!, $clientUid: String!, $sortBy: [String!]) {
  sampleAll(
    pageSize: $first
    afterCursor: $after
    beforeCursor: $before
    status: $status
    text: $text
    clientUid: $clientUid
    sortBy: $sortBy
  ) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      endCursor
      startCursor
    }
    items {
      uid
      createdByUid
      createdBy {
        firstName
        lastName
        auth {
          userName
        }
      }
      createdAt
      dateCollected
      dateReceived
      dateSubmitted
      dateVerified
      datePublished
      datePrinted
      dateStored
      printed
      dueDate
      analysisRequest {
        uid
        clientRequestId
        patient {
          uid
          firstName
          lastName
          clientPatientId
          gender
          dateOfBirth
          age
          ageDobEstimated
          consentSms
        }
        client {
          uid
          name
          code
          district {
            name
            province {
              name
            }
          }
        }
      }
      sampleType {
        uid
        name
      }
      sampleId
      priority
      status
      storageSlot
      storageContainerUid
      storageContainer {
        uid
        name
        storageSection {
          uid
          name
          storageLocation {
            uid
            name
            storeRoom {
              uid
              name
            }
          }
        }
      }
      analyses {
        uid
        name
        sortKey
      }
      profiles {
        uid
        name
      }
      rejectionReasons {
        uid
        reason
      }
    }
  }
}
    `;

export function useGetAllSamplesQuery(options: Omit<Urql.UseQueryArgs<never, GetAllSamplesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllSamplesQuery>({ query: GetAllSamplesDocument, ...options });
};
export const GetSamplesForShipmentAssignDocument = gql`
    query getSamplesForShipmentAssign($first: Int!, $after: String, $text: String!, $sortBy: [String!], $analysisUid: String, $sampleTypeUid: String!) {
  samplesForShipmentAssign(
    pageSize: $first
    afterCursor: $after
    text: $text
    sortBy: $sortBy
    analysisUid: $analysisUid
    sampleTypeUid: $sampleTypeUid
  ) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    items {
      uid
      sampleId
      status
      createdAt
      dateReceived
      sampleType {
        name
      }
      analysisRequest {
        clientRequestId
      }
      analysisResults {
        uid
        assigned
        status
        analysis {
          name
        }
      }
    }
  }
}
    `;

export function useGetSamplesForShipmentAssignQuery(options: Omit<Urql.UseQueryArgs<never, GetSamplesForShipmentAssignQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetSamplesForShipmentAssignQuery>({ query: GetSamplesForShipmentAssignDocument, ...options });
};
export const GetAnalysesRequestsByPatientUidDocument = gql`
    query getAnalysesRequestsByPatientUid($uid: String!) {
  analysisRequestsByPatientUid(uid: $uid) {
    uid
    clientRequestId
    createdAt
    patient {
      uid
      firstName
      lastName
      clientPatientId
      gender
      dateOfBirth
      age
      ageDobEstimated
      consentSms
    }
    client {
      uid
      name
    }
    samples {
      uid
      createdByUid
      createdBy {
        firstName
        lastName
        auth {
          userName
        }
      }
      createdAt
      sampleType {
        uid
        name
      }
      sampleId
      priority
      status
      storageSlot
      storageContainerUid
      storageSlot
      storageContainerUid
      storageContainer {
        uid
        name
        storageSection {
          uid
          name
          storageLocation {
            uid
            name
            storeRoom {
              uid
              name
            }
          }
        }
      }
      analyses {
        uid
        name
        sortKey
      }
      rejectionReasons {
        uid
        reason
      }
      profiles {
        uid
        name
      }
    }
  }
}
    `;

export function useGetAnalysesRequestsByPatientUidQuery(options: Omit<Urql.UseQueryArgs<never, GetAnalysesRequestsByPatientUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAnalysesRequestsByPatientUidQuery>({ query: GetAnalysesRequestsByPatientUidDocument, ...options });
};
export const GetAnalysesRequestsByClientUidDocument = gql`
    query getAnalysesRequestsByClientUid($uid: String!) {
  analysisRequestsByClientUid(uid: $uid) {
    uid
    clientRequestId
    createdAt
    patient {
      uid
      firstName
      lastName
      clientPatientId
      gender
      dateOfBirth
      age
      ageDobEstimated
      consentSms
    }
    client {
      uid
      name
    }
    samples {
      uid
      createdByUid
      createdBy {
        firstName
        lastName
        auth {
          userName
        }
      }
      createdAt
      sampleType {
        uid
        name
      }
      sampleId
      priority
      status
      storageSlot
      storageContainerUid
      storageSlot
      storageContainerUid
      storageContainer {
        uid
        name
        storageSection {
          uid
          name
          storageLocation {
            uid
            name
            storeRoom {
              uid
              name
            }
          }
        }
      }
      rejectionReasons {
        uid
        reason
      }
      analyses {
        uid
        name
        sortKey
      }
      profiles {
        uid
        name
      }
    }
  }
}
    `;

export function useGetAnalysesRequestsByClientUidQuery(options: Omit<Urql.UseQueryArgs<never, GetAnalysesRequestsByClientUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAnalysesRequestsByClientUidQuery>({ query: GetAnalysesRequestsByClientUidDocument, ...options });
};
export const GetAnalysesResultsBySampleUidDocument = gql`
    query getAnalysesResultsBySampleUid($uid: String!) {
  analysisResultBySampleUid(uid: $uid) {
    uid
    status
    sampleUid
    result
    method {
      uid
      name
    }
    instrument {
      uid
      name
    }
    sample {
      uid
      sampleId
      status
      rejectionReasons {
        uid
        reason
      }
    }
    analysisUid
    analysis {
      uid
      name
      unitUid
      unit {
        uid
        name
      }
      sortKey
      interims {
        uid
        key
        value
        analysisUid
        instrumentUid
      }
      resultOptions {
        uid
        optionKey
        value
      }
    }
    retest
    reportable
    createdAt
    createdByUid
    updatedAt
    updatedByUid
    worksheetUid
    worksheetId
  }
}
    `;

export function useGetAnalysesResultsBySampleUidQuery(options: Omit<Urql.UseQueryArgs<never, GetAnalysesResultsBySampleUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAnalysesResultsBySampleUidQuery>({ query: GetAnalysesResultsBySampleUidDocument, ...options });
};
export const GetAnalysesResultsForWsAssignDocument = gql`
    query getAnalysesResultsForWsAssign($first: Int!, $after: String, $text: String!, $sortBy: [String!], $analysisUid: String!, $sampleTypeUid: String!) {
  analysisResultsForWsAssign(
    pageSize: $first
    afterCursor: $after
    text: $text
    sortBy: $sortBy
    analysisUid: $analysisUid
    sampleTypeUid: $sampleTypeUid
  ) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    items {
      uid
      assigned
      sampleUid
      sample {
        sampleId
        priority
        status
        dateReceived
        createdAt
        sampleType {
          name
        }
      }
      status
      analysisUid
      analysis {
        name
      }
    }
  }
}
    `;

export function useGetAnalysesResultsForWsAssignQuery(options: Omit<Urql.UseQueryArgs<never, GetAnalysesResultsForWsAssignQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAnalysesResultsForWsAssignQuery>({ query: GetAnalysesResultsForWsAssignDocument, ...options });
};
export const GetSampleByUidDocument = gql`
    query getSampleByUid($uid: String!) {
  sampleByUid(uid: $uid) {
    uid
    createdByUid
    createdBy {
      firstName
      lastName
      auth {
        userName
      }
    }
    createdAt
    dateReceived
    receivedByUid
    dateCollected
    dateSubmitted
    submittedByUid
    dateVerified
    verifiedByUid
    datePublished
    datePrinted
    printedByUid
    dateInvalidated
    invalidatedByUid
    dateCancelled
    cancelledByUid
    dueDate
    sampleId
    priority
    status
    analysisRequest {
      uid
      clientRequestId
      patient {
        uid
        firstName
        lastName
        clientPatientId
        gender
        dateOfBirth
        age
        ageDobEstimated
        consentSms
      }
      client {
        uid
        name
      }
    }
    sampleType {
      uid
      name
    }
    dateStored
    storageSlot
    storageContainerUid
    storageSlot
    storageContainerUid
    storageContainer {
      uid
      name
      storageSection {
        uid
        name
        storageLocation {
          uid
          name
          storeRoom {
            uid
            name
          }
        }
      }
    }
    analyses {
      uid
      name
    }
    profiles {
      uid
      name
    }
    rejectionReasons {
      uid
      reason
    }
  }
}
    `;

export function useGetSampleByUidQuery(options: Omit<Urql.UseQueryArgs<never, GetSampleByUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetSampleByUidQuery>({ query: GetSampleByUidDocument, ...options });
};
export const GetSampleParentIdDocument = gql`
    query getSampleParentId($parentId: String!, $text: String) {
  sampleByParentId(parentId: $parentId, text: $text) {
    uid
    sampleId
    status
  }
}
    `;

export function useGetSampleParentIdQuery(options: Omit<Urql.UseQueryArgs<never, GetSampleParentIdQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetSampleParentIdQuery>({ query: GetSampleParentIdDocument, ...options });
};
export const GetSamplesByStorageContainerUidDocument = gql`
    query getSamplesByStorageContainerUid($uid: String!) {
  samplesByStorageContainerUid(uid: $uid) {
    uid
    sampleId
    storageSlot
    storageSlotIndex
    storageContainerUid
    status
    analysisRequest {
      clientRequestId
    }
  }
}
    `;

export function useGetSamplesByStorageContainerUidQuery(options: Omit<Urql.UseQueryArgs<never, GetSamplesByStorageContainerUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetSamplesByStorageContainerUidQuery>({ query: GetSamplesByStorageContainerUidDocument, ...options });
};
export const GetAllQcLevelsDocument = gql`
    query getAllQCLevels {
  qcLevelAll {
    uid
    level
  }
}
    `;

export function useGetAllQcLevelsQuery(options: Omit<Urql.UseQueryArgs<never, GetAllQcLevelsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllQcLevelsQuery>({ query: GetAllQcLevelsDocument, ...options });
};
export const GetAllQcTemplatesDocument = gql`
    query getAllQCTemplates {
  qcTemplateAll {
    uid
    name
    description
    qcLevels {
      uid
      level
    }
    departments {
      uid
      name
    }
  }
}
    `;

export function useGetAllQcTemplatesQuery(options: Omit<Urql.UseQueryArgs<never, GetAllQcTemplatesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllQcTemplatesQuery>({ query: GetAllQcTemplatesDocument, ...options });
};
export const GetQcSeTsDocument = gql`
    query getQCSeTs($first: Int!, $after: String, $text: String!, $sortBy: [String!] = ["uid"]) {
  qcSetAll(pageSize: $first, afterCursor: $after, text: $text, sortBy: $sortBy) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      endCursor
      startCursor
    }
    items {
      uid
      name
      note
      createdAt
      samples {
        uid
        sampleId
        status
        createdByUid
        createdBy {
          firstName
          lastName
          auth {
            userName
          }
        }
        createdAt
        updatedAt
        assigned
        qcLevel {
          uid
          level
        }
        analysisResults {
          uid
          status
          sampleUid
          result
          analysisUid
          retest
          reportable
          analysis {
            uid
            name
            sortKey
            resultOptions {
              uid
              optionKey
              value
            }
          }
          method {
            uid
            name
          }
          instrument {
            uid
            name
          }
        }
        analyses {
          uid
          name
          unitUid
          unit {
            uid
            name
          }
          resultOptions {
            uid
            optionKey
            value
          }
        }
        profiles {
          uid
          name
        }
      }
    }
  }
}
    `;

export function useGetQcSeTsQuery(options: Omit<Urql.UseQueryArgs<never, GetQcSeTsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetQcSeTsQuery>({ query: GetQcSeTsDocument, ...options });
};
export const GetQcSetByUidDocument = gql`
    query getQCSetByUid($uid: String!) {
  qcSetByUid(uid: $uid) {
    uid
    name
    note
    createdAt
    samples {
      uid
      sampleId
      status
      createdAt
      updatedAt
      assigned
      qcLevel {
        uid
        level
      }
      analysisResults {
        uid
        status
        sampleUid
        result
        analysisUid
        retest
        reportable
        analysis {
          uid
          name
          sortKey
          resultOptions {
            uid
            optionKey
            value
          }
        }
        method {
          uid
          name
        }
        instrument {
          uid
          name
        }
      }
      analyses {
        uid
        name
        unitUid
        unit {
          uid
          name
        }
        resultOptions {
          uid
          optionKey
          value
        }
      }
      profiles {
        uid
        name
      }
    }
  }
}
    `;

export function useGetQcSetByUidQuery(options: Omit<Urql.UseQueryArgs<never, GetQcSetByUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetQcSetByUidQuery>({ query: GetQcSetByUidDocument, ...options });
};
export const ResultOptionsByAnalysisUidDocument = gql`
    query resultOptionsByAnalysisUid($uid: String!) {
  resultOptionsByAnalysisUid(uid: $uid) {
    uid
    optionKey
    value
    analysisUid
  }
}
    `;

export function useResultOptionsByAnalysisUidQuery(options: Omit<Urql.UseQueryArgs<never, ResultOptionsByAnalysisUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<ResultOptionsByAnalysisUidQuery>({ query: ResultOptionsByAnalysisUidDocument, ...options });
};
export const GetAllRejectionReasonsDocument = gql`
    query getAllRejectionReasons {
  rejectionReasonsAll {
    uid
    reason
  }
}
    `;

export function useGetAllRejectionReasonsQuery(options: Omit<Urql.UseQueryArgs<never, GetAllRejectionReasonsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllRejectionReasonsQuery>({ query: GetAllRejectionReasonsDocument, ...options });
};
export const ImpressMetaDocument = gql`
    query impressMeta($uids: [String!]!) {
  impressReportsMeta(uids: $uids) {
    uid
    state
    sampleUid
    jsonContent
    emailRequired
    emailSent
    smsRequired
    smsSent
    generatedByUid
    generatedBy {
      firstName
      lastName
    }
    dateGenerated
  }
}
    `;

export function useImpressMetaQuery(options: Omit<Urql.UseQueryArgs<never, ImpressMetaQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<ImpressMetaQuery>({ query: ImpressMetaDocument, ...options });
};
export const ImpressReportsDocument = gql`
    query impressReports($uids: [String!]!) {
  impressReportsDownload(uids: $uids)
}
    `;

export function useImpressReportsQuery(options: Omit<Urql.UseQueryArgs<never, ImpressReportsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<ImpressReportsQuery>({ query: ImpressReportsDocument, ...options });
};
export const ImpressReportDocument = gql`
    query impressReport($uid: String!) {
  impressReportDownload(uid: $uid)
}
    `;

export function useImpressReportQuery(options: Omit<Urql.UseQueryArgs<never, ImpressReportQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<ImpressReportQuery>({ query: ImpressReportDocument, ...options });
};
export const AddClientDocument = gql`
    mutation AddClient($payload: ClientInputType!) {
  createClient(payload: $payload) {
    ... on ClientType {
      __typename
      uid
      name
      code
      districtUid
      district {
        uid
        name
        province {
          uid
          name
          country {
            uid
            name
          }
        }
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddClientMutation() {
  return Urql.useMutation<AddClientMutation, AddClientMutationVariables>(AddClientDocument);
};
export const EditClientDocument = gql`
    mutation editClient($uid: String!, $payload: ClientInputType!) {
  updateClient(uid: $uid, payload: $payload) {
    ... on ClientType {
      __typename
      uid
      name
      code
      districtUid
      district {
        uid
        name
        province {
          uid
          name
          country {
            uid
            name
          }
        }
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditClientMutation() {
  return Urql.useMutation<EditClientMutation, EditClientMutationVariables>(EditClientDocument);
};
export const AddClientContactDocument = gql`
    mutation AddClientContact($payload: ClientContactInputType!) {
  createClientContact(payload: $payload) {
    ... on ClientContactType {
      __typename
      uid
      firstName
      lastName
      email
      mobilePhone
      consentSms
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddClientContactMutation() {
  return Urql.useMutation<AddClientContactMutation, AddClientContactMutationVariables>(AddClientContactDocument);
};
export const EditClientContactDocument = gql`
    mutation editClientContact($uid: String!, $payload: ClientContactInputType!) {
  updateClientContact(uid: $uid, payload: $payload) {
    ... on ClientContactType {
      __typename
      uid
      firstName
      lastName
      email
      mobilePhone
      consentSms
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditClientContactMutation() {
  return Urql.useMutation<EditClientContactMutation, EditClientContactMutationVariables>(EditClientContactDocument);
};
export const DeleteClientContactDocument = gql`
    mutation deleteClientContact($uid: String!) {
  deleteClientContact(uid: $uid) {
    ... on DeletedItem {
      uid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useDeleteClientContactMutation() {
  return Urql.useMutation<DeleteClientContactMutation, DeleteClientContactMutationVariables>(DeleteClientContactDocument);
};
export const GetAllClientsDocument = gql`
    query getAllClients($first: Int, $after: String, $text: String, $sortBy: [String!] = ["uid"]) {
  clientAll(pageSize: $first, afterCursor: $after, text: $text, sortBy: $sortBy) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    items {
      uid
      name
      code
      district {
        uid
        name
        province {
          uid
          name
          country {
            uid
            name
          }
        }
      }
    }
  }
}
    `;

export function useGetAllClientsQuery(options: Omit<Urql.UseQueryArgs<never, GetAllClientsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllClientsQuery>({ query: GetAllClientsDocument, ...options });
};
export const SearchClientsDocument = gql`
    query searchClients($queryString: String!) {
  clientSearch(queryString: $queryString) {
    uid
    name
    code
    district {
      uid
      name
      province {
        uid
        name
        country {
          uid
          name
        }
      }
    }
  }
}
    `;

export function useSearchClientsQuery(options: Omit<Urql.UseQueryArgs<never, SearchClientsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<SearchClientsQuery>({ query: SearchClientsDocument, ...options });
};
export const GetClientContactsByClientUidDocument = gql`
    query getClientContactsByClientUid($clientUid: String!) {
  clientContactByClientUid(clientUid: $clientUid) {
    uid
    firstName
    lastName
    email
    mobilePhone
    consentSms
  }
}
    `;

export function useGetClientContactsByClientUidQuery(options: Omit<Urql.UseQueryArgs<never, GetClientContactsByClientUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetClientContactsByClientUidQuery>({ query: GetClientContactsByClientUidDocument, ...options });
};
export const GetClientByUidDocument = gql`
    query getClientByUid($uid: String!) {
  clientByUid(uid: $uid) {
    uid
    name
    code
    districtUid
    district {
      uid
      name
      provinceUid
      province {
        uid
        name
        countryUid
        country {
          uid
          name
        }
      }
    }
  }
}
    `;

export function useGetClientByUidQuery(options: Omit<Urql.UseQueryArgs<never, GetClientByUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetClientByUidQuery>({ query: GetClientByUidDocument, ...options });
};
export const GetSampleGroupByStatusDocument = gql`
    query getSampleGroupByStatus {
  countSampleGroupByStatus {
    data {
      __typename
      group
      count
    }
  }
}
    `;

export function useGetSampleGroupByStatusQuery(options: Omit<Urql.UseQueryArgs<never, GetSampleGroupByStatusQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetSampleGroupByStatusQuery>({ query: GetSampleGroupByStatusDocument, ...options });
};
export const GetExtrasGroupByStatusDocument = gql`
    query getExtrasGroupByStatus {
  countExtrasGroupByStatus {
    data {
      __typename
      group
      count
    }
  }
}
    `;

export function useGetExtrasGroupByStatusQuery(options: Omit<Urql.UseQueryArgs<never, GetExtrasGroupByStatusQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetExtrasGroupByStatusQuery>({ query: GetExtrasGroupByStatusDocument, ...options });
};
export const GetAnalysisGroupByStatusDocument = gql`
    query getAnalysisGroupByStatus {
  countAnalyteGroupByStatus {
    data {
      __typename
      group
      count
    }
  }
}
    `;

export function useGetAnalysisGroupByStatusQuery(options: Omit<Urql.UseQueryArgs<never, GetAnalysisGroupByStatusQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAnalysisGroupByStatusQuery>({ query: GetAnalysisGroupByStatusDocument, ...options });
};
export const GetWorksheetGroupByStatusDocument = gql`
    query getWorksheetGroupByStatus {
  countWorksheetGroupByStatus {
    data {
      __typename
      group
      count
    }
  }
}
    `;

export function useGetWorksheetGroupByStatusQuery(options: Omit<Urql.UseQueryArgs<never, GetWorksheetGroupByStatusQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetWorksheetGroupByStatusQuery>({ query: GetWorksheetGroupByStatusDocument, ...options });
};
export const GetAnalysisGroupByInstrumentDocument = gql`
    query getAnalysisGroupByInstrument($startDate: String!, $endDate: String!) {
  countAnalyteGroupByInstrument(startDate: $startDate, endDate: $endDate) {
    data {
      __typename
      group
      count
    }
  }
}
    `;

export function useGetAnalysisGroupByInstrumentQuery(options: Omit<Urql.UseQueryArgs<never, GetAnalysisGroupByInstrumentQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAnalysisGroupByInstrumentQuery>({ query: GetAnalysisGroupByInstrumentDocument, ...options });
};
export const SampleProcessPeformanceDocument = gql`
    query sampleProcessPeformance($startDate: String!, $endDate: String!) {
  sampleProcessPerformance(startDate: $startDate, endDate: $endDate) {
    __typename
    data {
      process
      counts {
        totalSamples
        totalLate
        totalNotLate
        processAverage
        avgExtraDays
      }
    }
  }
}
    `;

export function useSampleProcessPeformanceQuery(options: Omit<Urql.UseQueryArgs<never, SampleProcessPeformanceQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<SampleProcessPeformanceQuery>({ query: SampleProcessPeformanceDocument, ...options });
};
export const GetAnalysisProcessPeformanceDocument = gql`
    query getAnalysisProcessPeformance($process: String!, $startDate: String!, $endDate: String!) {
  analysisProcessPerformance(
    process: $process
    startDate: $startDate
    endDate: $endDate
  ) {
    __typename
    data {
      process
      groups {
        totalSamples
        totalLate
        totalNotLate
        processAverage
        avgExtraDays
        service
      }
    }
  }
}
    `;

export function useGetAnalysisProcessPeformanceQuery(options: Omit<Urql.UseQueryArgs<never, GetAnalysisProcessPeformanceQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAnalysisProcessPeformanceQuery>({ query: GetAnalysisProcessPeformanceDocument, ...options });
};
export const SampleGroupByActionDocument = gql`
    query sampleGroupByAction($startDate: String!, $endDate: String!) {
  countSampleGroupByAction(startDate: $startDate, endDate: $endDate) {
    __typename
    data {
      __typename
      group
      counts {
        __typename
        group
        count
      }
    }
  }
}
    `;

export function useSampleGroupByActionQuery(options: Omit<Urql.UseQueryArgs<never, SampleGroupByActionQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<SampleGroupByActionQuery>({ query: SampleGroupByActionDocument, ...options });
};
export const GetSampleLaggardsDocument = gql`
    query getSampleLaggards {
  sampleLaggards {
    __typename
    data {
      __typename
      category
      counts {
        __typename
        totalIncomplete
        totalDelayed
        totalNotDelayed
        lessThanTen
        tenToTwenty
        twentyToThirty
        graterThanThirty
      }
    }
  }
}
    `;

export function useGetSampleLaggardsQuery(options: Omit<Urql.UseQueryArgs<never, GetSampleLaggardsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetSampleLaggardsQuery>({ query: GetSampleLaggardsDocument, ...options });
};
export const AddSupplierDocument = gql`
    mutation AddSupplier($payload: SupplierInputType!) {
  createSupplier(payload: $payload) {
    ... on SupplierType {
      uid
      name
      description
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddSupplierMutation() {
  return Urql.useMutation<AddSupplierMutation, AddSupplierMutationVariables>(AddSupplierDocument);
};
export const EditSupplierDocument = gql`
    mutation EditSupplier($uid: String!, $payload: SupplierInputType!) {
  updateSupplier(uid: $uid, payload: $payload) {
    ... on SupplierType {
      uid
      name
      description
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditSupplierMutation() {
  return Urql.useMutation<EditSupplierMutation, EditSupplierMutationVariables>(EditSupplierDocument);
};
export const AddManufacturerDocument = gql`
    mutation AddManufacturer($payload: ManufacturerInputType!) {
  createManufacturer(payload: $payload) {
    ... on ManufacturerType {
      uid
      name
      description
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddManufacturerMutation() {
  return Urql.useMutation<AddManufacturerMutation, AddManufacturerMutationVariables>(AddManufacturerDocument);
};
export const EditManufacturerDocument = gql`
    mutation EditManufacturer($uid: String!, $payload: ManufacturerInputType!) {
  updateManufacturer(uid: $uid, payload: $payload) {
    ... on ManufacturerType {
      uid
      name
      description
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditManufacturerMutation() {
  return Urql.useMutation<EditManufacturerMutation, EditManufacturerMutationVariables>(EditManufacturerDocument);
};
export const AddInstrumentTypeDocument = gql`
    mutation AddInstrumentType($payload: InstrumentTypeInputType!) {
  createInstrumentType(payload: $payload) {
    ... on InstrumentTypeType {
      uid
      name
      description
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddInstrumentTypeMutation() {
  return Urql.useMutation<AddInstrumentTypeMutation, AddInstrumentTypeMutationVariables>(AddInstrumentTypeDocument);
};
export const EditInstrumentTypeDocument = gql`
    mutation EditInstrumentType($uid: String!, $payload: InstrumentTypeInputType!) {
  updateInstrumentType(uid: $uid, payload: $payload) {
    ... on InstrumentTypeType {
      uid
      name
      description
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditInstrumentTypeMutation() {
  return Urql.useMutation<EditInstrumentTypeMutation, EditInstrumentTypeMutationVariables>(EditInstrumentTypeDocument);
};
export const AddInstrumentDocument = gql`
    mutation AddInstrument($payload: InstrumentInputType!) {
  createInstrument(payload: $payload) {
    ... on InstrumentType {
      uid
      name
      description
      keyword
      instrumentType {
        uid
        name
      }
      manufacturer {
        uid
        name
      }
      supplier {
        uid
        name
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddInstrumentMutation() {
  return Urql.useMutation<AddInstrumentMutation, AddInstrumentMutationVariables>(AddInstrumentDocument);
};
export const EditInstrumentDocument = gql`
    mutation EditInstrument($uid: String!, $payload: InstrumentInputType!) {
  updateInstrument(uid: $uid, payload: $payload) {
    ... on InstrumentType {
      uid
      name
      description
      keyword
      instrumentType {
        uid
        name
      }
      manufacturer {
        uid
        name
      }
      supplier {
        uid
        name
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditInstrumentMutation() {
  return Urql.useMutation<EditInstrumentMutation, EditInstrumentMutationVariables>(EditInstrumentDocument);
};
export const AddMethodDocument = gql`
    mutation AddMethod($payload: MethodInputType!) {
  createMethod(payload: $payload) {
    ... on MethodType {
      uid
      name
      description
      keyword
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddMethodMutation() {
  return Urql.useMutation<AddMethodMutation, AddMethodMutationVariables>(AddMethodDocument);
};
export const EditMethodDocument = gql`
    mutation EditMethod($uid: String!, $payload: MethodInputType!) {
  updateMethod(uid: $uid, payload: $payload) {
    ... on MethodType {
      uid
      name
      description
      keyword
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditMethodMutation() {
  return Urql.useMutation<EditMethodMutation, EditMethodMutationVariables>(EditMethodDocument);
};
export const AddUnitDocument = gql`
    mutation AddUnit($payload: UnitInputType!) {
  createUnit(payload: $payload) {
    ... on UnitType {
      uid
      name
      isSiUnit
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddUnitMutation() {
  return Urql.useMutation<AddUnitMutation, AddUnitMutationVariables>(AddUnitDocument);
};
export const EditUnitDocument = gql`
    mutation EditUnit($uid: String!, $payload: UnitInputType!) {
  updateUnit(uid: $uid, payload: $payload) {
    ... on UnitType {
      uid
      name
      isSiUnit
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditUnitMutation() {
  return Urql.useMutation<EditUnitMutation, EditUnitMutationVariables>(EditUnitDocument);
};
export const GetAllSuppliersDocument = gql`
    query getAllSuppliers {
  supplierAll {
    uid
    name
    description
  }
}
    `;

export function useGetAllSuppliersQuery(options: Omit<Urql.UseQueryArgs<never, GetAllSuppliersQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllSuppliersQuery>({ query: GetAllSuppliersDocument, ...options });
};
export const GetAllManufacturersDocument = gql`
    query getAllManufacturers {
  manufacturerAll {
    uid
    name
    description
  }
}
    `;

export function useGetAllManufacturersQuery(options: Omit<Urql.UseQueryArgs<never, GetAllManufacturersQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllManufacturersQuery>({ query: GetAllManufacturersDocument, ...options });
};
export const GetAllInstrumentTypesDocument = gql`
    query getAllInstrumentTypes {
  instrumentTypeAll {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    items {
      uid
      name
      description
    }
  }
}
    `;

export function useGetAllInstrumentTypesQuery(options: Omit<Urql.UseQueryArgs<never, GetAllInstrumentTypesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllInstrumentTypesQuery>({ query: GetAllInstrumentTypesDocument, ...options });
};
export const GetAllInstrumentsDocument = gql`
    query getAllInstruments {
  instrumentAll {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    items {
      uid
      name
      description
      keyword
      methods {
        uid
        name
        description
      }
      supplierUid
      supplier {
        uid
        name
      }
      manufacturerUid
      manufacturer {
        uid
        name
      }
      instrumentTypeUid
      instrumentType {
        uid
        name
      }
    }
  }
}
    `;

export function useGetAllInstrumentsQuery(options: Omit<Urql.UseQueryArgs<never, GetAllInstrumentsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllInstrumentsQuery>({ query: GetAllInstrumentsDocument, ...options });
};
export const GetAllMethodsDocument = gql`
    query getAllMethods {
  methodAll {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    items {
      uid
      name
      description
      keyword
      instruments {
        uid
        name
        description
      }
    }
  }
}
    `;

export function useGetAllMethodsQuery(options: Omit<Urql.UseQueryArgs<never, GetAllMethodsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllMethodsQuery>({ query: GetAllMethodsDocument, ...options });
};
export const GetAllUnitsDocument = gql`
    query getAllUnits {
  unitAll {
    uid
    name
    isSiUnit
  }
}
    `;

export function useGetAllUnitsQuery(options: Omit<Urql.UseQueryArgs<never, GetAllUnitsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllUnitsQuery>({ query: GetAllUnitsDocument, ...options });
};
export const AddHazardDocument = gql`
    mutation AddHazard($payload: HazardInputType!) {
  createHazard(payload: $payload) {
    ... on HazardType {
      __typename
      uid
      name
      description
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddHazardMutation() {
  return Urql.useMutation<AddHazardMutation, AddHazardMutationVariables>(AddHazardDocument);
};
export const EditHazardDocument = gql`
    mutation EditHazard($uid: String!, $payload: HazardInputType!) {
  updateHazard(uid: $uid, payload: $payload) {
    ... on HazardType {
      __typename
      uid
      name
      description
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditHazardMutation() {
  return Urql.useMutation<EditHazardMutation, EditHazardMutationVariables>(EditHazardDocument);
};
export const AddStockCategoryDocument = gql`
    mutation AddStockCategory($payload: StockCategoryInputType!) {
  createStockCategory(payload: $payload) {
    ... on StockCategoryType {
      __typename
      uid
      name
      description
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddStockCategoryMutation() {
  return Urql.useMutation<AddStockCategoryMutation, AddStockCategoryMutationVariables>(AddStockCategoryDocument);
};
export const EditStockCategoryDocument = gql`
    mutation EditStockCategory($uid: String!, $payload: StockCategoryInputType!) {
  updateStockCategory(uid: $uid, payload: $payload) {
    ... on StockCategoryType {
      __typename
      uid
      name
      description
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditStockCategoryMutation() {
  return Urql.useMutation<EditStockCategoryMutation, EditStockCategoryMutationVariables>(EditStockCategoryDocument);
};
export const AddStockPackagingDocument = gql`
    mutation AddStockPackaging($payload: StockPackagingInputType!) {
  createStockPackaging(payload: $payload) {
    ... on StockPackagingType {
      __typename
      uid
      name
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddStockPackagingMutation() {
  return Urql.useMutation<AddStockPackagingMutation, AddStockPackagingMutationVariables>(AddStockPackagingDocument);
};
export const EditStockPackagingDocument = gql`
    mutation editStockPackaging($uid: String!, $payload: StockPackagingInputType!) {
  updateStockPackaging(uid: $uid, payload: $payload) {
    ... on StockPackagingType {
      __typename
      uid
      name
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditStockPackagingMutation() {
  return Urql.useMutation<EditStockPackagingMutation, EditStockPackagingMutationVariables>(EditStockPackagingDocument);
};
export const AddStockUnitDocument = gql`
    mutation AddStockUnit($payload: StockUnitInputType!) {
  createStockUnit(payload: $payload) {
    ... on StockUnitType {
      __typename
      uid
      name
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddStockUnitMutation() {
  return Urql.useMutation<AddStockUnitMutation, AddStockUnitMutationVariables>(AddStockUnitDocument);
};
export const EditStockUnitDocument = gql`
    mutation editStockUnit($uid: String!, $payload: StockUnitInputType!) {
  updateStockUnit(uid: $uid, payload: $payload) {
    ... on StockUnitType {
      __typename
      uid
      name
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditStockUnitMutation() {
  return Urql.useMutation<EditStockUnitMutation, EditStockUnitMutationVariables>(EditStockUnitDocument);
};
export const AddStockProductDocument = gql`
    mutation AddStockProduct($payload: StockProductInputType!) {
  createStockProduct(payload: $payload) {
    ... on StockProductType {
      __typename
      uid
      name
      department {
        uid
        name
      }
      supplier {
        uid
        name
      }
      category {
        uid
        name
      }
      hazard {
        uid
        name
      }
      storeRoom {
        uid
        name
      }
      lotNumber
      batch
      size
      unit {
        uid
        name
      }
      packaging {
        uid
        name
      }
      price
      quantityReceived
      remaining
      dateReceived
      expiryDate
      receivedBy {
        uid
        firstName
        lastName
      }
      createdAt
      createdBy {
        uid
        firstName
        lastName
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddStockProductMutation() {
  return Urql.useMutation<AddStockProductMutation, AddStockProductMutationVariables>(AddStockProductDocument);
};
export const EditStockProductDocument = gql`
    mutation editStockProduct($uid: String!, $payload: StockProductInputType!) {
  updateStockProduct(uid: $uid, payload: $payload) {
    ... on StockProductType {
      __typename
      uid
      name
      department {
        uid
        name
      }
      supplier {
        uid
        name
      }
      category {
        uid
        name
      }
      hazard {
        uid
        name
      }
      storeRoom {
        uid
        name
      }
      lotNumber
      batch
      size
      unit {
        uid
        name
      }
      packaging {
        uid
        name
      }
      price
      quantityReceived
      remaining
      dateReceived
      expiryDate
      receivedBy {
        uid
        firstName
        lastName
      }
      createdAt
      createdBy {
        uid
        firstName
        lastName
      }
      updatedAt
      updatedBy {
        uid
        firstName
        lastName
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditStockProductMutation() {
  return Urql.useMutation<EditStockProductMutation, EditStockProductMutationVariables>(EditStockProductDocument);
};
export const AddStockItemDocument = gql`
    mutation AddStockItem($payload: StockItemInputType!) {
  createStockItem(payload: $payload) {
    ... on StockItemType {
      __typename
      uid
      name
      description
      departmentUid
      department {
        uid
        name
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddStockItemMutation() {
  return Urql.useMutation<AddStockItemMutation, AddStockItemMutationVariables>(AddStockItemDocument);
};
export const EditStockItemDocument = gql`
    mutation editStockItem($uid: String!, $payload: StockItemInputType!) {
  updateStockItem(uid: $uid, payload: $payload) {
    ... on StockItemType {
      __typename
      uid
      name
      description
      departmentUid
      department {
        uid
        name
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditStockItemMutation() {
  return Urql.useMutation<EditStockItemMutation, EditStockItemMutationVariables>(EditStockItemDocument);
};
export const AddStockTransactionDocument = gql`
    mutation AddStockTransaction($payload: StockTransactionInputType!) {
  createStockTransaction(payload: $payload) {
    ... on StockTransactionType {
      __typename
      uid
      productUid
      issued
      departmentUid
      dateIssued
      transactionByUid
      createdAt
      createdByUid
      updatedAt
      updatedByUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddStockTransactionMutation() {
  return Urql.useMutation<AddStockTransactionMutation, AddStockTransactionMutationVariables>(AddStockTransactionDocument);
};
export const AddStockAdjustmentDocument = gql`
    mutation AddStockAdjustment($payload: StockAdjustmentInputType!) {
  createStockAdjustment(payload: $payload) {
    ... on StockAdjustmentType {
      __typename
      uid
      productUid
      adjustmentType
      adjust
      adjustmentDate
      remarks
      adjustmentByUid
      createdAt
      createdByUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddStockAdjustmentMutation() {
  return Urql.useMutation<AddStockAdjustmentMutation, AddStockAdjustmentMutationVariables>(AddStockAdjustmentDocument);
};
export const AddStockOrderDocument = gql`
    mutation AddStockOrder($payload: StockOrderInputType!) {
  createStockOrder(payload: $payload) {
    ... on StockOrderLineType {
      __typename
      stockOrder {
        uid
        orderByUid
        departmentUid
        status
        orderNumber
      }
      orderProducts {
        uid
        productUid
        orderUid
        price
        quantity
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddStockOrderMutation() {
  return Urql.useMutation<AddStockOrderMutation, AddStockOrderMutationVariables>(AddStockOrderDocument);
};
export const EditStockOrderDocument = gql`
    mutation EditStockOrder($uid: String!, $payload: StockOrderInputType!) {
  updateStockOrder(uid: $uid, payload: $payload) {
    ... on StockOrderLineType {
      __typename
      stockOrder {
        uid
        orderByUid
        departmentUid
        status
        orderNumber
        remarks
      }
      orderProducts {
        uid
        productUid
        orderUid
        price
        quantity
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditStockOrderMutation() {
  return Urql.useMutation<EditStockOrderMutation, EditStockOrderMutationVariables>(EditStockOrderDocument);
};
export const SubmitStockOrderDocument = gql`
    mutation SubmitStockOrder($uid: String!) {
  submitStockOrder(uid: $uid) {
    ... on StockOrderType {
      __typename
      uid
      status
      orderNumber
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useSubmitStockOrderMutation() {
  return Urql.useMutation<SubmitStockOrderMutation, SubmitStockOrderMutationVariables>(SubmitStockOrderDocument);
};
export const ApproveStockOrderDocument = gql`
    mutation ApproveStockOrder($uid: String!, $payload: StockOrderApprovalInputType!) {
  approveStockOrder(uid: $uid, payload: $payload) {
    ... on StockOrderType {
      __typename
      uid
      orderByUid
      departmentUid
      status
      orderNumber
      remarks
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useApproveStockOrderMutation() {
  return Urql.useMutation<ApproveStockOrderMutation, ApproveStockOrderMutationVariables>(ApproveStockOrderDocument);
};
export const IssueStockOrderDocument = gql`
    mutation IssueStockOrder($uid: String!, $payload: [StockOrderProductLineInputType!]!) {
  issueStockOrder(uid: $uid, payload: $payload) {
    ... on StockOrderLineType {
      __typename
      stockOrder {
        uid
        orderByUid
        departmentUid
        status
        orderNumber
        remarks
      }
      orderProducts {
        uid
        product {
          uid
          remaining
        }
        orderUid
        price
        quantity
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useIssueStockOrderMutation() {
  return Urql.useMutation<IssueStockOrderMutation, IssueStockOrderMutationVariables>(IssueStockOrderDocument);
};
export const DeleteStockOrderDocument = gql`
    mutation DeleteStockOrder($uid: String!) {
  deleteStockOrder(uid: $uid) {
    ... on StockOrderLineType {
      __typename
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useDeleteStockOrderMutation() {
  return Urql.useMutation<DeleteStockOrderMutation, DeleteStockOrderMutationVariables>(DeleteStockOrderDocument);
};
export const GetAllHazardsDocument = gql`
    query getAllHazards {
  hazardAll {
    uid
    name
    description
  }
}
    `;

export function useGetAllHazardsQuery(options: Omit<Urql.UseQueryArgs<never, GetAllHazardsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllHazardsQuery>({ query: GetAllHazardsDocument, ...options });
};
export const GetAllStockCategoriesDocument = gql`
    query getAllStockCategories {
  stockCategoryAll {
    uid
    name
    description
  }
}
    `;

export function useGetAllStockCategoriesQuery(options: Omit<Urql.UseQueryArgs<never, GetAllStockCategoriesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllStockCategoriesQuery>({ query: GetAllStockCategoriesDocument, ...options });
};
export const GetAllStockPackagingDocument = gql`
    query getAllStockPackaging {
  stockPackagingAll {
    uid
    name
  }
}
    `;

export function useGetAllStockPackagingQuery(options: Omit<Urql.UseQueryArgs<never, GetAllStockPackagingQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllStockPackagingQuery>({ query: GetAllStockPackagingDocument, ...options });
};
export const GetAllStockUnitsDocument = gql`
    query getAllStockUnits {
  stockUnitAll {
    uid
    name
  }
}
    `;

export function useGetAllStockUnitsQuery(options: Omit<Urql.UseQueryArgs<never, GetAllStockUnitsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllStockUnitsQuery>({ query: GetAllStockUnitsDocument, ...options });
};
export const GetAllStockProductsDocument = gql`
    query getAllStockProducts($first: Int!, $after: String, $text: String!, $sortBy: [String!] = ["uid"]) {
  stockProductAll(
    pageSize: $first
    afterCursor: $after
    text: $text
    sortBy: $sortBy
  ) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    items {
      uid
      name
      department {
        uid
        name
      }
      supplier {
        uid
        name
      }
      category {
        uid
        name
      }
      hazard {
        uid
        name
      }
      storeRoom {
        uid
        name
      }
      lotNumber
      batch
      size
      unit {
        uid
        name
      }
      packaging {
        uid
        name
      }
      price
      quantityReceived
      remaining
      dateReceived
      expiryDate
      receivedBy {
        uid
        firstName
        lastName
      }
      createdAt
      createdBy {
        uid
        firstName
        lastName
      }
      updatedAt
      updatedBy {
        uid
        firstName
        lastName
      }
    }
  }
}
    `;

export function useGetAllStockProductsQuery(options: Omit<Urql.UseQueryArgs<never, GetAllStockProductsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllStockProductsQuery>({ query: GetAllStockProductsDocument, ...options });
};
export const GetAllStockItemsDocument = gql`
    query getAllStockItems($first: Int!, $after: String, $text: String!, $sortBy: [String!] = ["uid"]) {
  stockItemAll(
    pageSize: $first
    afterCursor: $after
    text: $text
    sortBy: $sortBy
  ) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    items {
      uid
      name
      description
      departmentUid
      department {
        uid
        name
      }
    }
  }
}
    `;

export function useGetAllStockItemsQuery(options: Omit<Urql.UseQueryArgs<never, GetAllStockItemsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllStockItemsQuery>({ query: GetAllStockItemsDocument, ...options });
};
export const GetAllStockOrdersDocument = gql`
    query getAllStockOrders($first: Int!, $after: String, $status: String!, $text: String!, $sortBy: [String!] = ["uid"]) {
  stockOrderAll(
    pageSize: $first
    afterCursor: $after
    status: $status
    text: $text
    sortBy: $sortBy
  ) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    items {
      uid
      orderBy {
        uid
        firstName
        lastName
      }
      department {
        uid
        name
      }
      status
      orderNumber
    }
  }
}
    `;

export function useGetAllStockOrdersQuery(options: Omit<Urql.UseQueryArgs<never, GetAllStockOrdersQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllStockOrdersQuery>({ query: GetAllStockOrdersDocument, ...options });
};
export const GetAllStockOrderProductsDocument = gql`
    query getAllStockOrderProducts($stockOrderUid: String!) {
  stockOrderProductAll(stockOrderUid: $stockOrderUid) {
    uid
    product {
      uid
      name
      remaining
    }
    price
    quantity
  }
}
    `;

export function useGetAllStockOrderProductsQuery(options: Omit<Urql.UseQueryArgs<never, GetAllStockOrderProductsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllStockOrderProductsQuery>({ query: GetAllStockOrderProductsDocument, ...options });
};
export const GetAllStockTransactionsDocument = gql`
    query getAllStockTransactions($first: Int!, $after: String, $text: String!, $sortBy: [String!] = ["uid"]) {
  stockTransactionAll(
    pageSize: $first
    afterCursor: $after
    text: $text
    sortBy: $sortBy
  ) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    items {
      uid
      product {
        uid
        name
      }
      issued
      issuedToUid
      issuedTo {
        firstName
        lastName
      }
      department {
        uid
        name
      }
      dateIssued
      transactionBy {
        uid
        firstName
        lastName
      }
      createdAt
    }
  }
}
    `;

export function useGetAllStockTransactionsQuery(options: Omit<Urql.UseQueryArgs<never, GetAllStockTransactionsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllStockTransactionsQuery>({ query: GetAllStockTransactionsDocument, ...options });
};
export const GetAllStockAdustmentsDocument = gql`
    query getAllStockAdustments($first: Int!, $after: String, $text: String!, $sortBy: [String!] = ["uid"]) {
  stockAdjustmentAll(
    pageSize: $first
    afterCursor: $after
    text: $text
    sortBy: $sortBy
  ) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    items {
      uid
      productUid
      product {
        name
      }
      adjustmentType
      adjust
      adjustmentDate
      remarks
      adjustmentByUid
      adjustmentBy {
        firstName
        lastName
      }
      createdAt
      createdByUid
      updatedAt
      updatedByUid
    }
  }
}
    `;

export function useGetAllStockAdustmentsQuery(options: Omit<Urql.UseQueryArgs<never, GetAllStockAdustmentsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllStockAdustmentsQuery>({ query: GetAllStockAdustmentsDocument, ...options });
};
export const AddNoticeDocument = gql`
    mutation AddNotice($payload: NoticeInputType!) {
  createNotice(payload: $payload) {
    ... on NoticeType {
      __typename
      uid
      title
      body
      expiry
      createdByUid
      departments {
        uid
        name
      }
      groups {
        uid
        name
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddNoticeMutation() {
  return Urql.useMutation<AddNoticeMutation, AddNoticeMutationVariables>(AddNoticeDocument);
};
export const EditNoticeDocument = gql`
    mutation editNotice($uid: String!, $payload: NoticeInputType!) {
  updateNotice(uid: $uid, payload: $payload) {
    ... on NoticeType {
      __typename
      uid
      title
      body
      expiry
      createdByUid
      departments {
        uid
        name
      }
      groups {
        uid
        name
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditNoticeMutation() {
  return Urql.useMutation<EditNoticeMutation, EditNoticeMutationVariables>(EditNoticeDocument);
};
export const DeleteNoticeDocument = gql`
    mutation deleteNotice($uid: String!) {
  deleteNotice(uid: $uid) {
    ... on DeletedItem {
      __typename
      uid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useDeleteNoticeMutation() {
  return Urql.useMutation<DeleteNoticeMutation, DeleteNoticeMutationVariables>(DeleteNoticeDocument);
};
export const GetNoticesByCreatorUidDocument = gql`
    query getNoticesByCreatorUid($uid: String!) {
  noticesByCreator(uid: $uid) {
    uid
    title
    body
    expiry
    createdByUid
    departments {
      uid
      name
    }
    groups {
      uid
      name
    }
  }
}
    `;

export function useGetNoticesByCreatorUidQuery(options: Omit<Urql.UseQueryArgs<never, GetNoticesByCreatorUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetNoticesByCreatorUidQuery>({ query: GetNoticesByCreatorUidDocument, ...options });
};
export const AddIdentificationDocument = gql`
    mutation AddIdentification($name: String!) {
  createIdentification(name: $name) {
    ... on IdentificationType {
      __typename
      uid
      name
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddIdentificationMutation() {
  return Urql.useMutation<AddIdentificationMutation, AddIdentificationMutationVariables>(AddIdentificationDocument);
};
export const EditIdentificationDocument = gql`
    mutation EditIdentification($uid: String!, $name: String!) {
  updateIdentification(uid: $uid, name: $name) {
    ... on IdentificationType {
      __typename
      uid
      name
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditIdentificationMutation() {
  return Urql.useMutation<EditIdentificationMutation, EditIdentificationMutationVariables>(EditIdentificationDocument);
};
export const AddPatientDocument = gql`
    mutation AddPatient($payload: PatientInputType!) {
  createPatient(payload: $payload) {
    ... on PatientType {
      __typename
      uid
      clientPatientId
      patientId
      firstName
      middleName
      lastName
      age
      gender
      dateOfBirth
      ageDobEstimated
      client {
        uid
        name
        district {
          name
          province {
            name
          }
        }
      }
      phoneHome
      phoneMobile
      consentSms
      identifications {
        uid
        value
        identificationUid
        identification {
          uid
          name
        }
      }
      countryUid
      country {
        uid
        name
      }
      provinceUid
      province {
        uid
        name
      }
      districtUid
      district {
        uid
        name
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddPatientMutation() {
  return Urql.useMutation<AddPatientMutation, AddPatientMutationVariables>(AddPatientDocument);
};
export const EditPatientDocument = gql`
    mutation EditPatient($uid: String!, $payload: PatientInputType!) {
  updatePatient(uid: $uid, payload: $payload) {
    ... on PatientType {
      __typename
      uid
      clientPatientId
      patientId
      firstName
      middleName
      lastName
      age
      gender
      dateOfBirth
      ageDobEstimated
      client {
        uid
        name
        district {
          name
          province {
            name
          }
        }
      }
      phoneHome
      phoneMobile
      consentSms
      identifications {
        uid
        value
        identificationUid
        identification {
          uid
          name
        }
      }
      countryUid
      country {
        uid
        name
      }
      provinceUid
      province {
        uid
        name
      }
      districtUid
      district {
        uid
        name
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditPatientMutation() {
  return Urql.useMutation<EditPatientMutation, EditPatientMutationVariables>(EditPatientDocument);
};
export const GetAllPatientsDocument = gql`
    query getAllPatients($first: Int!, $after: String, $before: String, $text: String!, $sortBy: [String!] = ["uid"]) {
  patientAll(
    pageSize: $first
    afterCursor: $after
    beforeCursor: $before
    text: $text
    sortBy: $sortBy
  ) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    items {
      uid
      clientPatientId
      patientId
      firstName
      middleName
      lastName
      age
      gender
      dateOfBirth
      ageDobEstimated
      clientUid
      client {
        uid
        name
        district {
          uid
          name
          province {
            uid
            name
            country {
              uid
              name
            }
          }
        }
      }
      phoneHome
      phoneMobile
      consentSms
      identifications {
        uid
        value
        identificationUid
        identification {
          uid
          name
        }
      }
      countryUid
      country {
        uid
        name
      }
      provinceUid
      province {
        uid
        name
      }
      districtUid
      district {
        uid
        name
      }
    }
  }
}
    `;

export function useGetAllPatientsQuery(options: Omit<Urql.UseQueryArgs<never, GetAllPatientsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllPatientsQuery>({ query: GetAllPatientsDocument, ...options });
};
export const SearchPatientsDocument = gql`
    query searchPatients($queryString: String!) {
  patientSearch(queryString: $queryString) {
    uid
    clientPatientId
    patientId
    firstName
    middleName
    lastName
    age
    gender
    dateOfBirth
    ageDobEstimated
    client {
      uid
      name
      district {
        name
        province {
          name
        }
      }
    }
    phoneHome
    phoneMobile
    consentSms
    identifications {
      uid
      value
      identificationUid
      identification {
        uid
        name
      }
    }
    countryUid
    country {
      uid
      name
    }
    provinceUid
    province {
      uid
      name
    }
    districtUid
    district {
      uid
      name
    }
  }
}
    `;

export function useSearchPatientsQuery(options: Omit<Urql.UseQueryArgs<never, SearchPatientsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<SearchPatientsQuery>({ query: SearchPatientsDocument, ...options });
};
export const GetPatientByUidDocument = gql`
    query getPatientByUid($uid: String!) {
  patientByUid(uid: $uid) {
    uid
    clientPatientId
    patientId
    firstName
    middleName
    lastName
    age
    gender
    dateOfBirth
    ageDobEstimated
    client {
      uid
      name
      district {
        name
        province {
          name
        }
      }
    }
    phoneHome
    phoneMobile
    consentSms
    identifications {
      uid
      value
      identificationUid
      identification {
        uid
        name
      }
    }
    countryUid
    country {
      uid
      name
    }
    provinceUid
    province {
      uid
      name
    }
    districtUid
    district {
      uid
      name
    }
  }
}
    `;

export function useGetPatientByUidQuery(options: Omit<Urql.UseQueryArgs<never, GetPatientByUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetPatientByUidQuery>({ query: GetPatientByUidDocument, ...options });
};
export const IdentificationTypesDocument = gql`
    query identificationTypes {
  identificationAll {
    uid
    name
  }
}
    `;

export function useIdentificationTypesQuery(options: Omit<Urql.UseQueryArgs<never, IdentificationTypesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<IdentificationTypesQuery>({ query: IdentificationTypesDocument, ...options });
};
export const AddReflexRDocument = gql`
    mutation AddReflexR($payload: ReflexRuleInput!) {
  createReflexRule(payload: $payload) {
    __typename
    ... on ReflexRuleType {
      uid
      name
      description
      createdByUid
      createdAt
    }
    ... on OperationError {
      error
      suggestion
    }
  }
}
    `;

export function useAddReflexRMutation() {
  return Urql.useMutation<AddReflexRMutation, AddReflexRMutationVariables>(AddReflexRDocument);
};
export const EditReflexRDocument = gql`
    mutation editReflexR($uid: String!, $payload: ReflexRuleInput!) {
  updateReflexRule(uid: $uid, payload: $payload) {
    __typename
    ... on ReflexRuleType {
      uid
      name
      description
      createdByUid
      createdAt
    }
    ... on OperationError {
      error
      suggestion
    }
  }
}
    `;

export function useEditReflexRMutation() {
  return Urql.useMutation<EditReflexRMutation, EditReflexRMutationVariables>(EditReflexRDocument);
};
export const AddReflexADocument = gql`
    mutation AddReflexA($payload: ReflexActionInput!) {
  createReflexAction(payload: $payload) {
    __typename
    ... on ReflexActionType {
      uid
      description
      level
      analyses {
        uid
        name
      }
      reflexRule {
        uid
        name
      }
    }
    ... on OperationError {
      error
      suggestion
    }
  }
}
    `;

export function useAddReflexAMutation() {
  return Urql.useMutation<AddReflexAMutation, AddReflexAMutationVariables>(AddReflexADocument);
};
export const EditReflexADocument = gql`
    mutation editReflexA($uid: String!, $payload: ReflexActionInput!) {
  updateReflexAction(uid: $uid, payload: $payload) {
    __typename
    ... on ReflexActionType {
      uid
      description
      level
      analyses {
        uid
        name
      }
      reflexRule {
        uid
        name
      }
    }
    ... on OperationError {
      error
      suggestion
    }
  }
}
    `;

export function useEditReflexAMutation() {
  return Urql.useMutation<EditReflexAMutation, EditReflexAMutationVariables>(EditReflexADocument);
};
export const AddReflexBDocument = gql`
    mutation AddReflexB($payload: ReflexBrainInput!) {
  createReflexBrain(payload: $payload) {
    __typename
    ... on ReflexBrainType {
      uid
      reflexActionUid
      description
      analysesValues {
        analysisUid
        analysis {
          uid
          name
        }
        operator
        value
      }
      addNew {
        analysisUid
        analysis {
          uid
          name
        }
        count
      }
      finalise {
        analysisUid
        analysis {
          uid
          name
        }
        value
      }
    }
    ... on OperationError {
      error
      suggestion
    }
  }
}
    `;

export function useAddReflexBMutation() {
  return Urql.useMutation<AddReflexBMutation, AddReflexBMutationVariables>(AddReflexBDocument);
};
export const EditReflexBDocument = gql`
    mutation editReflexB($uid: String!, $payload: ReflexBrainInput!) {
  updateReflexBrain(uid: $uid, payload: $payload) {
    __typename
    ... on ReflexBrainType {
      uid
      reflexActionUid
      description
      analysesValues {
        analysisUid
        analysis {
          uid
          name
        }
        operator
        value
      }
      addNew {
        analysisUid
        analysis {
          uid
          name
        }
        count
      }
      finalise {
        analysisUid
        analysis {
          uid
          name
        }
        value
      }
    }
    ... on OperationError {
      error
      suggestion
    }
  }
}
    `;

export function useEditReflexBMutation() {
  return Urql.useMutation<EditReflexBMutation, EditReflexBMutationVariables>(EditReflexBDocument);
};
export const GetAllReflexRulesDocument = gql`
    query getAllReflexRules {
  reflexRuleAll {
    totalCount
    items {
      uid
      name
      description
      createdBy {
        firstName
        lastName
      }
    }
  }
}
    `;

export function useGetAllReflexRulesQuery(options: Omit<Urql.UseQueryArgs<never, GetAllReflexRulesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllReflexRulesQuery>({ query: GetAllReflexRulesDocument, ...options });
};
export const GetReflexRuleByUidDocument = gql`
    query getReflexRuleByUid($uid: String!) {
  reflexRuleByUid(uid: $uid) {
    uid
    name
    description
    reflexActions {
      uid
      level
      description
      analyses {
        uid
        name
      }
      brains {
        description
        analysesValues {
          analysisUid
          analysis {
            uid
            name
            resultOptions {
              optionKey
              value
            }
          }
          operator
          value
        }
        addNew {
          analysisUid
          analysis {
            uid
            name
            resultOptions {
              optionKey
              value
            }
          }
          count
        }
        finalise {
          analysisUid
          analysis {
            name
            resultOptions {
              optionKey
              value
            }
          }
          value
        }
      }
    }
    createdBy {
      firstName
      lastName
    }
  }
}
    `;

export function useGetReflexRuleByUidQuery(options: Omit<Urql.UseQueryArgs<never, GetReflexRuleByUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetReflexRuleByUidQuery>({ query: GetReflexRuleByUidDocument, ...options });
};
export const AddReferralLaboratoryDocument = gql`
    mutation AddReferralLaboratory($payload: ReferralLaboratoryInputType!) {
  createReferralLaboratory(payload: $payload) {
    ... on ReferralLaboratoryType {
      __typename
      uid
      name
      code
      url
      password
      username
      isReferral
      isReference
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddReferralLaboratoryMutation() {
  return Urql.useMutation<AddReferralLaboratoryMutation, AddReferralLaboratoryMutationVariables>(AddReferralLaboratoryDocument);
};
export const EditReferralLaboratoryDocument = gql`
    mutation EditReferralLaboratory($uid: String!, $payload: ReferralLaboratoryInputType!) {
  updateReferralLaboratory(uid: $uid, payload: $payload) {
    ... on ReferralLaboratoryType {
      __typename
      uid
      name
      code
      url
      password
      username
      isReferral
      isReference
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditReferralLaboratoryMutation() {
  return Urql.useMutation<EditReferralLaboratoryMutation, EditReferralLaboratoryMutationVariables>(EditReferralLaboratoryDocument);
};
export const AddShipmentDocument = gql`
    mutation AddShipment($payload: ShipmentInputType!) {
  createShipment(payload: $payload) {
    ... on ShipmentListingType {
      __typename
      shipments {
        uid
        shipmentId
        assignedCount
        state
        laboratoryUid
        laboratory {
          name
        }
        createdAt
        laboratoryUid
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddShipmentMutation() {
  return Urql.useMutation<AddShipmentMutation, AddShipmentMutationVariables>(AddShipmentDocument);
};
export const UpdateShipmentDocument = gql`
    mutation UpdateShipment($uid: String!, $payload: ShipmentUpdateInputType!) {
  updateShipment(uid: $uid, payload: $payload) {
    ... on ShipmentType {
      __typename
      uid
      shipmentId
      assignedCount
      state
      incoming
      comment
      createdAt
      courier
      laboratory {
        uid
        name
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useUpdateShipmentMutation() {
  return Urql.useMutation<UpdateShipmentMutation, UpdateShipmentMutationVariables>(UpdateShipmentDocument);
};
export const ShipmentManageSamplesDocument = gql`
    mutation shipmentManageSamples($uid: String!, $payload: ShipmentManageSamplesInput!) {
  shipmentManageSamples(uid: $uid, payload: $payload) {
    ... on ShipmentType {
      __typename
      uid
      shipmentId
      assignedCount
      state
      incoming
      comment
      createdAt
      courier
      laboratory {
        uid
        name
      }
      samples {
        uid
        sampleId
        status
        analysisRequest {
          patient {
            uid
          }
        }
        analyses {
          uid
          name
          keyword
        }
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useShipmentManageSamplesMutation() {
  return Urql.useMutation<ShipmentManageSamplesMutation, ShipmentManageSamplesMutationVariables>(ShipmentManageSamplesDocument);
};
export const ActionShipmentDocument = gql`
    mutation actionShipment($uid: String!, $action: String!) {
  actionShipment(uid: $uid, action: $action) {
    ... on ShipmentType {
      __typename
      uid
      state
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useActionShipmentMutation() {
  return Urql.useMutation<ActionShipmentMutation, ActionShipmentMutationVariables>(ActionShipmentDocument);
};
export const GetAllReferralLaboratoriesDocument = gql`
    query getAllReferralLaboratories {
  referralLaboratoryAll {
    uid
    name
    code
    url
    password
    username
    isReferral
    isReference
  }
}
    `;

export function useGetAllReferralLaboratoriesQuery(options: Omit<Urql.UseQueryArgs<never, GetAllReferralLaboratoriesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllReferralLaboratoriesQuery>({ query: GetAllReferralLaboratoriesDocument, ...options });
};
export const GetAllShipmentsDocument = gql`
    query getAllShipments($first: Int!, $after: String, $before: String, $incoming: Boolean!, $status: String!, $text: String!, $sortBy: [String!] = ["-uid"]) {
  shipmentAll(
    pageSize: $first
    afterCursor: $after
    beforeCursor: $before
    incoming: $incoming
    status: $status
    text: $text
    sortBy: $sortBy
  ) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    items {
      uid
      shipmentId
      assignedCount
      incoming
      state
      laboratoryUid
      courier
      laboratory {
        name
      }
      createdAt
    }
  }
}
    `;

export function useGetAllShipmentsQuery(options: Omit<Urql.UseQueryArgs<never, GetAllShipmentsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllShipmentsQuery>({ query: GetAllShipmentsDocument, ...options });
};
export const GetShipmentByUidDocument = gql`
    query getShipmentByUid($shipmentUid: String!) {
  shipmentByUid(shipmentUid: $shipmentUid) {
    uid
    shipmentId
    assignedCount
    state
    incoming
    comment
    createdAt
    courier
    jsonContent
    laboratory {
      name
      url
      username
      password
    }
    shippedSamples {
      resultNotified
      extSampleId
      sample {
        uid
        sampleId
        status
        analysisRequest {
          clientRequestId
          patient {
            uid
          }
        }
        analyses {
          uid
          name
          keyword
        }
      }
    }
  }
}
    `;

export function useGetShipmentByUidQuery(options: Omit<Urql.UseQueryArgs<never, GetShipmentByUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetShipmentByUidQuery>({ query: GetShipmentByUidDocument, ...options });
};
export const ManifestReportDocument = gql`
    query manifestReport($uid: String!) {
  manifestReportDownload(uid: $uid)
}
    `;

export function useManifestReportQuery(options: Omit<Urql.UseQueryArgs<never, ManifestReportQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<ManifestReportQuery>({ query: ManifestReportDocument, ...options });
};
export const AddStoreRoomDocument = gql`
    mutation AddStoreRoom($payload: StoreRoomInputType!) {
  createStoreRoom(payload: $payload) {
    ... on StoreRoomType {
      __typename
      uid
      name
      description
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddStoreRoomMutation() {
  return Urql.useMutation<AddStoreRoomMutation, AddStoreRoomMutationVariables>(AddStoreRoomDocument);
};
export const EditStoreRoomDocument = gql`
    mutation EditStoreRoom($uid: String!, $payload: StoreRoomInputType!) {
  updateStoreRoom(uid: $uid, payload: $payload) {
    ... on StoreRoomType {
      __typename
      uid
      name
      description
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditStoreRoomMutation() {
  return Urql.useMutation<EditStoreRoomMutation, EditStoreRoomMutationVariables>(EditStoreRoomDocument);
};
export const AddStorageLocationDocument = gql`
    mutation AddStorageLocation($payload: StorageLocationInputType!) {
  createStorageLocation(payload: $payload) {
    ... on StorageLocationType {
      __typename
      uid
      name
      description
      storeRoomUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddStorageLocationMutation() {
  return Urql.useMutation<AddStorageLocationMutation, AddStorageLocationMutationVariables>(AddStorageLocationDocument);
};
export const EditStorageLocationDocument = gql`
    mutation EditStorageLocation($uid: String!, $payload: StorageLocationInputType!) {
  updateStorageLocation(uid: $uid, payload: $payload) {
    ... on StorageLocationType {
      __typename
      uid
      name
      description
      storeRoomUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditStorageLocationMutation() {
  return Urql.useMutation<EditStorageLocationMutation, EditStorageLocationMutationVariables>(EditStorageLocationDocument);
};
export const AddStorageSectionDocument = gql`
    mutation AddStorageSection($payload: StorageSectionInputType!) {
  createStorageSection(payload: $payload) {
    ... on StorageSectionType {
      __typename
      uid
      name
      description
      storageLocationUid
      storageLocation {
        uid
        storeRoomUid
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddStorageSectionMutation() {
  return Urql.useMutation<AddStorageSectionMutation, AddStorageSectionMutationVariables>(AddStorageSectionDocument);
};
export const EditStorageSectionDocument = gql`
    mutation EditStorageSection($uid: String!, $payload: StorageSectionInputType!) {
  updateStorageSection(uid: $uid, payload: $payload) {
    ... on StorageSectionType {
      __typename
      uid
      name
      description
      storageLocationUid
      storageLocation {
        uid
        storeRoomUid
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditStorageSectionMutation() {
  return Urql.useMutation<EditStorageSectionMutation, EditStorageSectionMutationVariables>(EditStorageSectionDocument);
};
export const AddStorageContainerDocument = gql`
    mutation AddStorageContainer($payload: StorageContainerInputType!) {
  createStorageContainer(payload: $payload) {
    ... on StorageContainerType {
      __typename
      uid
      name
      description
      storageSectionUid
      storageSection {
        uid
        storageLocationUid
        storageLocation {
          uid
          storeRoomUid
        }
      }
      grid
      rowWise
      cols
      rows
      slots
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddStorageContainerMutation() {
  return Urql.useMutation<AddStorageContainerMutation, AddStorageContainerMutationVariables>(AddStorageContainerDocument);
};
export const EditStorageContainerDocument = gql`
    mutation EditStorageContainer($uid: String!, $payload: StorageContainerInputType!) {
  updateStorageContainer(uid: $uid, payload: $payload) {
    ... on StorageContainerType {
      __typename
      uid
      name
      description
      storageSectionUid
      storageSection {
        uid
        storageLocationUid
        storageLocation {
          uid
          storeRoomUid
        }
      }
      grid
      rowWise
      cols
      rows
      slots
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditStorageContainerMutation() {
  return Urql.useMutation<EditStorageContainerMutation, EditStorageContainerMutationVariables>(EditStorageContainerDocument);
};
export const StoreSamplesDocument = gql`
    mutation StoreSamples($payload: [StoreSamplesInputType!]!) {
  storeSamples(payload: $payload) {
    ... on StoredSamplesType {
      __typename
      samples {
        uid
        sampleId
        priority
        status
        storageSlot
        storageContainerUid
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useStoreSamplesMutation() {
  return Urql.useMutation<StoreSamplesMutation, StoreSamplesMutationVariables>(StoreSamplesDocument);
};
export const RecoverSamplesDocument = gql`
    mutation RecoverSamples($sampleUids: [String!]!) {
  recoverSamples(sampleUids: $sampleUids) {
    ... on StoredSamplesType {
      __typename
      samples {
        uid
        status
        storageSlot
        storageContainerUid
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useRecoverSamplesMutation() {
  return Urql.useMutation<RecoverSamplesMutation, RecoverSamplesMutationVariables>(RecoverSamplesDocument);
};
export const GetAllStoreRoomsDocument = gql`
    query getAllStoreRooms {
  storeRoomAll {
    uid
    name
    description
  }
}
    `;

export function useGetAllStoreRoomsQuery(options: Omit<Urql.UseQueryArgs<never, GetAllStoreRoomsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllStoreRoomsQuery>({ query: GetAllStoreRoomsDocument, ...options });
};
export const GetStoreRoomByUidDocument = gql`
    query getStoreRoomByUid($uid: String!) {
  storeRoomByUid(uid: $uid) {
    uid
    name
    description
  }
}
    `;

export function useGetStoreRoomByUidQuery(options: Omit<Urql.UseQueryArgs<never, GetStoreRoomByUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetStoreRoomByUidQuery>({ query: GetStoreRoomByUidDocument, ...options });
};
export const GetAllStorageLocationsDocument = gql`
    query getAllStorageLocations($storeRoomUid: String!) {
  storageLocations(storeRoomUid: $storeRoomUid) {
    uid
    name
    description
    storeRoomUid
  }
}
    `;

export function useGetAllStorageLocationsQuery(options: Omit<Urql.UseQueryArgs<never, GetAllStorageLocationsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllStorageLocationsQuery>({ query: GetAllStorageLocationsDocument, ...options });
};
export const GetStorageLocationByUidDocument = gql`
    query getStorageLocationByUid($uid: String!) {
  storageLocationByUid(uid: $uid) {
    uid
    name
    description
    storeRoomUid
  }
}
    `;

export function useGetStorageLocationByUidQuery(options: Omit<Urql.UseQueryArgs<never, GetStorageLocationByUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetStorageLocationByUidQuery>({ query: GetStorageLocationByUidDocument, ...options });
};
export const GetAllStorageSectionsDocument = gql`
    query getAllStorageSections($storageLocationUid: String!) {
  storageSections(storageLocationUid: $storageLocationUid) {
    uid
    name
    description
    storageLocationUid
  }
}
    `;

export function useGetAllStorageSectionsQuery(options: Omit<Urql.UseQueryArgs<never, GetAllStorageSectionsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllStorageSectionsQuery>({ query: GetAllStorageSectionsDocument, ...options });
};
export const GetStorageSectionByUidDocument = gql`
    query getStorageSectionByUid($uid: String!) {
  storageSectionByUid(uid: $uid) {
    uid
    name
    description
    storageLocationUid
  }
}
    `;

export function useGetStorageSectionByUidQuery(options: Omit<Urql.UseQueryArgs<never, GetStorageSectionByUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetStorageSectionByUidQuery>({ query: GetStorageSectionByUidDocument, ...options });
};
export const GetAllStorageContainersDocument = gql`
    query getAllStorageContainers($storageSectionUid: String!) {
  storageContainers(storageSectionUid: $storageSectionUid) {
    uid
    name
    description
    storageSectionUid
    grid
    rowWise
    cols
    rows
    slots
  }
}
    `;

export function useGetAllStorageContainersQuery(options: Omit<Urql.UseQueryArgs<never, GetAllStorageContainersQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllStorageContainersQuery>({ query: GetAllStorageContainersDocument, ...options });
};
export const GetSrorageContainerByUidDocument = gql`
    query getSrorageContainerByUid($uid: String!) {
  storageContainerByUid(uid: $uid) {
    uid
    name
    description
    storageSectionUid
    grid
    rowWise
    cols
    rows
    slots
    storedCount
  }
}
    `;

export function useGetSrorageContainerByUidQuery(options: Omit<Urql.UseQueryArgs<never, GetSrorageContainerByUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetSrorageContainerByUidQuery>({ query: GetSrorageContainerByUidDocument, ...options });
};
export const GetStoreRoomsTreeDocument = gql`
    query getStoreRoomsTree {
  storeRoomAll {
    uid
    name
    description
    tag
    children {
      uid
      name
      description
      tag
      children {
        uid
        name
        description
        tag
        children {
          uid
          name
          description
          tag
        }
      }
    }
  }
}
    `;

export function useGetStoreRoomsTreeQuery(options: Omit<Urql.UseQueryArgs<never, GetStoreRoomsTreeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetStoreRoomsTreeQuery>({ query: GetStoreRoomsTreeDocument, ...options });
};
export const GetSystemActivityDocument = gql`
    subscription getSystemActivity {
  latestActivity {
    uid
    actorUid
    actor {
      uid
      firstName
      lastName
    }
    actionObjectUid
    actionObjectType
    actionObject {
      __typename
      ... on SampleType {
        uid
        sampleId
        status
        analysisRequest {
          patientUid
        }
      }
      ... on WorkSheetType {
        uid
        worksheetId
        state
      }
      ... on AnalysisResultType {
        uid
        sampleUid
        result
        status
      }
      ... on ReportMetaType {
        uid
        status
        location
      }
    }
    targetUid
    verb
  }
}
    `;

export function useGetSystemActivitySubscription<R = GetSystemActivitySubscription>(options: Omit<Urql.UseSubscriptionArgs<never, GetSystemActivitySubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandlerArg<GetSystemActivitySubscription, R>) {
  return Urql.useSubscription<GetSystemActivitySubscription, R, GetSystemActivitySubscriptionVariables>({ query: GetSystemActivityDocument, ...options }, handler);
};
export const AddWorkSheetTemplateDocument = gql`
    mutation AddWorkSheetTemplate($payload: WorksheetTemplateInputType!) {
  createWorksheetTemplate(payload: $payload) {
    ... on WorkSheetTemplateType {
      __typename
      uid
      name
      reserved
      numberOfSamples
      rows
      cols
      rowWise
      worksheetType
      instrumentUid
      instrument {
        uid
        name
      }
      sampleTypeUid
      sampleType {
        uid
        name
      }
      description
      qcTemplate {
        uid
        name
        description
        qcLevels {
          uid
          level
        }
      }
      qcLevels {
        uid
        level
      }
      analysisUid
      analysis {
        uid
        name
      }
      state
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddWorkSheetTemplateMutation() {
  return Urql.useMutation<AddWorkSheetTemplateMutation, AddWorkSheetTemplateMutationVariables>(AddWorkSheetTemplateDocument);
};
export const EditWorkSheetTemplateDocument = gql`
    mutation EditWorkSheetTemplate($uid: String!, $payload: WorksheetTemplateInputType!) {
  updateWorksheetTemplate(uid: $uid, payload: $payload) {
    ... on WorkSheetTemplateType {
      __typename
      uid
      name
      reserved
      numberOfSamples
      rows
      cols
      rowWise
      worksheetType
      instrumentUid
      instrument {
        uid
        name
      }
      sampleTypeUid
      sampleType {
        uid
        name
      }
      description
      qcTemplate {
        uid
        name
        description
        qcLevels {
          uid
          level
        }
      }
      qcLevels {
        uid
        level
      }
      analysisUid
      analysis {
        uid
        name
      }
      state
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditWorkSheetTemplateMutation() {
  return Urql.useMutation<EditWorkSheetTemplateMutation, EditWorkSheetTemplateMutationVariables>(EditWorkSheetTemplateDocument);
};
export const AddWorkSheetDocument = gql`
    mutation AddWorkSheet($analystUid: String!, $templateUid: String!, $count: Int) {
  createWorksheet(
    analystUid: $analystUid
    templateUid: $templateUid
    count: $count
  ) {
    ... on WorksheetListingType {
      __typename
      worksheets {
        uid
        worksheetId
        numberOfSamples
        assignedCount
        analyst {
          uid
          auth {
            uid
            userName
          }
          firstName
          lastName
        }
        instrumentUid
        instrument {
          uid
          name
        }
        analysisUid
        analysis {
          uid
          name
        }
        state
        createdAt
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddWorkSheetMutation() {
  return Urql.useMutation<AddWorkSheetMutation, AddWorkSheetMutationVariables>(AddWorkSheetDocument);
};
export const UpdateWorkSheetDocument = gql`
    mutation UpdateWorkSheet($worksheetUid: String!, $analystUid: String, $instrumentUid: String, $methodUid: String, $action: String, $samples: [String!]) {
  updateWorksheet(
    worksheetUid: $worksheetUid
    analystUid: $analystUid
    instrumentUid: $instrumentUid
    methodUid: $methodUid
    action: $action
    samples: $samples
  ) {
    ... on WorkSheetType {
      __typename
      uid
      numberOfSamples
      sampleTypeUid
      sampleType {
        name
        name
      }
      instrumentUid
      instrument {
        uid
        name
      }
      templateUid
      template {
        uid
        name
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useUpdateWorkSheetMutation() {
  return Urql.useMutation<UpdateWorkSheetMutation, UpdateWorkSheetMutationVariables>(UpdateWorkSheetDocument);
};
export const EditWorkSheetApplyTemplateDocument = gql`
    mutation EditWorkSheetApplyTemplate($worksheetUid: String!, $templateUid: String!) {
  updateWorksheetApplyTemplate(
    worksheetUid: $worksheetUid
    templateUid: $templateUid
  ) {
    ... on WorkSheetType {
      __typename
      uid
      numberOfSamples
      sampleTypeUid
      sampleType {
        name
        name
      }
      instrumentUid
      instrument {
        uid
        name
      }
      templateUid
      template {
        uid
        name
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditWorkSheetApplyTemplateMutation() {
  return Urql.useMutation<EditWorkSheetApplyTemplateMutation, EditWorkSheetApplyTemplateMutationVariables>(EditWorkSheetApplyTemplateDocument);
};
export const ManualyAssignWorsheetDocument = gql`
    mutation ManualyAssignWorsheet($uid: String!, $qcTemplateUid: String!, $analysesUids: [String!]!) {
  updateWorksheetManualAssign(
    uid: $uid
    qcTemplateUid: $qcTemplateUid
    analysesUids: $analysesUids
  ) {
    ... on WorkSheetType {
      __typename
      uid
      numberOfSamples
      sampleTypeUid
      sampleType {
        name
        name
      }
      instrumentUid
      instrument {
        uid
        name
      }
      templateUid
      template {
        uid
        name
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useManualyAssignWorsheetMutation() {
  return Urql.useMutation<ManualyAssignWorsheetMutation, ManualyAssignWorsheetMutationVariables>(ManualyAssignWorsheetDocument);
};
export const GetAllWorksheetTemplatesDocument = gql`
    query getAllWorksheetTemplates {
  worksheetTemplateAll {
    uid
    name
    reserved
    numberOfSamples
    rows
    cols
    rowWise
    worksheetType
    instrumentUid
    instrument {
      uid
      name
    }
    sampleTypeUid
    sampleType {
      uid
      name
    }
    description
    analysisUid
    analysis {
      uid
      name
    }
    state
  }
}
    `;

export function useGetAllWorksheetTemplatesQuery(options: Omit<Urql.UseQueryArgs<never, GetAllWorksheetTemplatesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllWorksheetTemplatesQuery>({ query: GetAllWorksheetTemplatesDocument, ...options });
};
export const GetAllWorksheetsDocument = gql`
    query getAllWorksheets($first: Int!, $after: String, $before: String, $status: String!, $text: String!, $sortBy: [String!] = ["-uid"]) {
  worksheetAll(
    pageSize: $first
    afterCursor: $after
    beforeCursor: $before
    status: $status
    text: $text
    sortBy: $sortBy
  ) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    items {
      uid
      worksheetId
      numberOfSamples
      assignedCount
      analyst {
        uid
        auth {
          uid
          userName
        }
        firstName
        lastName
      }
      instrument {
        uid
        name
      }
      analysis {
        uid
        name
      }
      state
      createdAt
    }
  }
}
    `;

export function useGetAllWorksheetsQuery(options: Omit<Urql.UseQueryArgs<never, GetAllWorksheetsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllWorksheetsQuery>({ query: GetAllWorksheetsDocument, ...options });
};
export const GetWorkSheetByUidDocument = gql`
    query getWorkSheetByUid($worksheetUid: String!) {
  worksheetByUid(worksheetUid: $worksheetUid) {
    uid
    worksheetId
    numberOfSamples
    assignedCount
    reserved
    state
    createdAt
    analyst {
      uid
      auth {
        uid
        userName
      }
      firstName
      lastName
    }
    sampleType {
      name
      name
    }
    instrument {
      uid
      name
    }
    template {
      uid
      name
    }
    analysis {
      uid
      name
    }
    analysisResults {
      uid
      result
      status
      worksheetPosition
      retest
      reportable
      method {
        uid
        name
      }
      instrument {
        uid
        name
      }
      analysis {
        uid
        name
        unitUid
        unit {
          uid
          name
        }
        resultOptions {
          uid
          optionKey
          value
        }
      }
      sample {
        uid
        sampleId
        priority
        analysisRequest {
          uid
          client {
            uid
            name
          }
          patient {
            uid
            firstName
            lastName
            clientPatientId
            patientId
          }
        }
        qcLevel {
          uid
          level
        }
      }
    }
  }
}
    `;

export function useGetWorkSheetByUidQuery(options: Omit<Urql.UseQueryArgs<never, GetWorkSheetByUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetWorkSheetByUidQuery>({ query: GetWorkSheetByUidDocument, ...options });
};