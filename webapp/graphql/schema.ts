import { cacheExchange } from '@urql/exchange-graphcache';
import type { Resolver as GraphCacheResolver, UpdateResolver as GraphCacheUpdateResolver, OptimisticMutationResolver as GraphCacheOptimisticMutationResolver } from '@urql/exchange-graphcache';

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BytesScalar: { input: never; output: never; }
  DateTime: { input: never; output: never; }
  JSONScalar: { input: never; output: never; }
};

export type ArResultInputType = {
  laboratoryInstrumentUid: Scalars['String']['input'];
  methodUid: Scalars['String']['input'];
  reportable?: InputMaybe<Scalars['Boolean']['input']>;
  result: Scalars['String']['input'];
  uid: Scalars['String']['input'];
};

export type ArSampleInputType = {
  analyses: Array<Scalars['String']['input']>;
  dateCollected: Scalars['String']['input'];
  profiles: Array<Scalars['String']['input']>;
  sampleType: Scalars['String']['input'];
};

export type ActivityFeedType = {
  __typename?: 'ActivityFeedType';
  name: Scalars['String']['output'];
  subscribers?: Maybe<Array<UserType>>;
  uid: Scalars['String']['output'];
};

export type ActivityProcessType = {
  __typename?: 'ActivityProcessType';
  objectType: Scalars['String']['output'];
  status: Scalars['String']['output'];
  uid: Scalars['String']['output'];
};

export type ActivityStreamType = {
  __typename?: 'ActivityStreamType';
  actionObject: WorkSheetTypeSampleTypeAnalysisResultTypeReportMetaTypeUnknownObjectType;
  actionObjectType?: Maybe<Scalars['String']['output']>;
  actionObjectUid?: Maybe<Scalars['String']['output']>;
  actor: UserType;
  actorUid?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  feeds?: Maybe<Array<ActivityFeedType>>;
  target?: Maybe<Scalars['String']['output']>;
  targetUid?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
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
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  department?: Maybe<DepartmentType>;
  departmentUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
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
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  factor: Scalars['Float']['output'];
  instrumentUid: Scalars['String']['output'];
  methodUid: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
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
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  instrumentUid: Scalars['String']['output'];
  lowerLimit: Scalars['Float']['output'];
  methodUid: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  upperLimit: Scalars['Float']['output'];
};

export type AnalysisDiscountResponse = AnalysisDiscountType | OperationError;

export type AnalysisDiscountType = {
  __typename?: 'AnalysisDiscountType';
  analysis: AnalysisType;
  analysisUid: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  discountType: Scalars['String']['output'];
  endDate: Scalars['DateTime']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  startDate: Scalars['DateTime']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  valueAmount: Scalars['Float']['output'];
  valuePercent: Scalars['Float']['output'];
  valueType: Scalars['String']['output'];
  voucher?: Maybe<VoucherType>;
  voucherUid?: Maybe<Scalars['String']['output']>;
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
  precision?: InputMaybe<Scalars['Int']['input']>;
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
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  instrumentUid: Scalars['String']['output'];
  key: Scalars['Int']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
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
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type AnalysisPriceResponse = AnalysisPriceType | OperationError;

export type AnalysisPriceType = {
  __typename?: 'AnalysisPriceType';
  amount: Scalars['Float']['output'];
  analysis: AnalysisType;
  analysisUid: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
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
  client?: Maybe<ClientType>;
  clientRequestId: Scalars['String']['output'];
  clientUid: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  internalUse: Scalars['Boolean']['output'];
  metadataSnapshot?: Maybe<Scalars['JSONScalar']['output']>;
  patient: PatientType;
  patientUid: Scalars['String']['output'];
  requestId: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type AnalysisRequestWithSamples = {
  __typename?: 'AnalysisRequestWithSamples';
  client?: Maybe<ClientType>;
  clientRequestId: Scalars['String']['output'];
  clientUid: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  internalUse: Scalars['Boolean']['output'];
  metadataSnapshot?: Maybe<Scalars['JSONScalar']['output']>;
  patient: PatientType;
  patientUid: Scalars['String']['output'];
  requestId: Scalars['String']['output'];
  samples?: Maybe<Array<SampleType>>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
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
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  dateCancelled?: Maybe<Scalars['DateTime']['output']>;
  dateInvalidated?: Maybe<Scalars['DateTime']['output']>;
  dateSubmitted?: Maybe<Scalars['DateTime']['output']>;
  dateVerified?: Maybe<Scalars['DateTime']['output']>;
  dueDate?: Maybe<Scalars['String']['output']>;
  invalidatedBy?: Maybe<UserType>;
  invalidatedByUid?: Maybe<Scalars['String']['output']>;
  laboratoryInstrument?: Maybe<LaboratoryInstrumentType>;
  laboratoryInstrumentUid?: Maybe<Scalars['String']['output']>;
  metadataSnapshot?: Maybe<Scalars['JSONScalar']['output']>;
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
  updatedAt?: Maybe<Scalars['String']['output']>;
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
  createdAt?: Maybe<Scalars['String']['output']>;
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
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  warnReport?: Maybe<Scalars['String']['output']>;
  warnValues?: Maybe<Scalars['String']['output']>;
};

export type AnalysisTemplateInputType = {
  departmentUid?: InputMaybe<Scalars['String']['input']>;
  description?: Scalars['String']['input'];
  name: Scalars['String']['input'];
  services?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** Union of possible outcomes */
export type AnalysisTemplateResponse = AnalysisTemplateType | OperationError;

export type AnalysisTemplateType = {
  __typename?: 'AnalysisTemplateType';
  analyses?: Maybe<Array<AnalysisType>>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  department?: Maybe<DepartmentType>;
  departmentUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type AnalysisType = {
  __typename?: 'AnalysisType';
  active?: Maybe<Scalars['Boolean']['output']>;
  category?: Maybe<AnalysisCategoryType>;
  categoryUid?: Maybe<Scalars['String']['output']>;
  correctionFactors?: Maybe<Array<AnalysisCorrectionFactorType>>;
  createdAt?: Maybe<Scalars['String']['output']>;
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
  resultType?: Maybe<Scalars['String']['output']>;
  sampleTypes?: Maybe<Array<SampleTypeTyp>>;
  selfVerification?: Maybe<Scalars['Boolean']['output']>;
  sortKey?: Maybe<Scalars['Int']['output']>;
  specifications?: Maybe<Array<AnalysisSpecificationType>>;
  tatLengthMinutes?: Maybe<Scalars['Int']['output']>;
  uid: Scalars['String']['output'];
  uncertainties?: Maybe<Array<AnalysisUncertaintyType>>;
  unit?: Maybe<UnitType>;
  unitUid?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
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
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  instrumentUid: Scalars['String']['output'];
  max: Scalars['Float']['output'];
  methodUid: Scalars['String']['output'];
  min: Scalars['Float']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
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
  createdAt?: Maybe<Scalars['String']['output']>;
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
  resultType?: Maybe<Scalars['String']['output']>;
  sampleTypes?: Maybe<Array<SampleTypeTyp>>;
  selfVerification?: Maybe<Scalars['Boolean']['output']>;
  sortKey?: Maybe<Scalars['Int']['output']>;
  specifications?: Maybe<Array<AnalysisSpecificationType>>;
  tatLengthMinutes?: Maybe<Scalars['Int']['output']>;
  uid: Scalars['String']['output'];
  uncertainties?: Maybe<Array<AnalysisUncertaintyType>>;
  unit?: Maybe<UnitType>;
  unitUid?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type ApplyVoucherInput = {
  customerUid: Scalars['String']['input'];
  testBillUid: Scalars['String']['input'];
  voucherCode: Scalars['String']['input'];
};

export type AuditLogType = {
  __typename?: 'AuditLogType';
  action?: Maybe<Scalars['Int']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  stateAfter?: Maybe<Scalars['JSONScalar']['output']>;
  stateBefore?: Maybe<Scalars['JSONScalar']['output']>;
  targetType?: Maybe<Scalars['String']['output']>;
  targetUid?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  userUid?: Maybe<Scalars['String']['output']>;
};

export type AuthenticatedData = {
  __typename?: 'AuthenticatedData';
  refresh: Scalars['String']['output'];
  token: Scalars['String']['output'];
  tokenType: Scalars['String']['output'];
  user: UserType;
};

export type AuthenticatedDataResponse = AuthenticatedData | OperationError;

export type BillTransactionInput = {
  amount: Scalars['Float']['input'];
  kind: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  testBillUid: Scalars['String']['input'];
};

export type CalibrationCertificateInput = {
  approvedBy?: InputMaybe<Scalars['String']['input']>;
  certificateCode?: InputMaybe<Scalars['String']['input']>;
  dateIssued?: InputMaybe<Scalars['DateTime']['input']>;
  internal?: Scalars['Boolean']['input'];
  issuer?: InputMaybe<Scalars['String']['input']>;
  laboratoryInstrumentUid: Scalars['String']['input'];
  performedBy?: InputMaybe<Scalars['String']['input']>;
  remarks?: InputMaybe<Scalars['String']['input']>;
  validFromDate?: InputMaybe<Scalars['String']['input']>;
  validToDate?: InputMaybe<Scalars['String']['input']>;
};

export type CalibrationCertificateResponse = CalibrationCertificateType | OperationError;

export type CalibrationCertificateType = {
  __typename?: 'CalibrationCertificateType';
  approvedBy: Scalars['String']['output'];
  certificateCode: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  dateIssued: Scalars['DateTime']['output'];
  internal: Scalars['Boolean']['output'];
  issuer: Scalars['String']['output'];
  laboratoryInstrument?: Maybe<LaboratoryInstrumentType>;
  laboratoryInstrumentUid: Scalars['String']['output'];
  performedBy: Scalars['String']['output'];
  remarks: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
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
  createdAt?: Maybe<Scalars['String']['output']>;
  creatorName?: Maybe<Scalars['String']['output']>;
  creatorUid?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  emailCc?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  mobilePhone?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
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
  contacts?: Maybe<Array<ClientContactType>>;
  createdAt?: Maybe<Scalars['String']['output']>;
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
  updatedAt?: Maybe<Scalars['String']['output']>;
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
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
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
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type CreateQcSetData = {
  __typename?: 'CreateQCSetData';
  qcSets: Array<QcSetWithSamples>;
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
  createdAt?: Maybe<Scalars['String']['output']>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
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
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  emailCc?: Maybe<Scalars['String']['output']>;
  mobilePhone?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  province?: Maybe<ProvinceType>;
  provinceUid?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
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
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<GroupType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  keyword?: Maybe<Scalars['String']['output']>;
  members?: Maybe<Array<UserType>>;
  name?: Maybe<Scalars['String']['output']>;
  pages?: Maybe<Scalars['String']['output']>;
  permissions?: Maybe<Array<PermissionType>>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<GroupType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
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
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type IdentificationResponse = IdentificationType | OperationError;

export type IdentificationType = {
  __typename?: 'IdentificationType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type InstrumentCalibrationInput = {
  calibrationId?: InputMaybe<Scalars['String']['input']>;
  dateReported?: InputMaybe<Scalars['DateTime']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  laboratoryInstrumentUid: Scalars['String']['input'];
  notesBefore?: InputMaybe<Scalars['String']['input']>;
  performedBy?: InputMaybe<Scalars['String']['input']>;
  remarks?: InputMaybe<Scalars['String']['input']>;
  reportId?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  workDone?: InputMaybe<Scalars['String']['input']>;
};

export type InstrumentCalibrationResponse = InstrumentCalibrationType | OperationError;

export type InstrumentCalibrationType = {
  __typename?: 'InstrumentCalibrationType';
  calibrationId: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  dateReported: Scalars['DateTime']['output'];
  endDate: Scalars['DateTime']['output'];
  laboratoryInstrument?: Maybe<LaboratoryInstrumentType>;
  laboratoryInstrumentUid: Scalars['String']['output'];
  notesBefore: Scalars['String']['output'];
  performedBy: Scalars['String']['output'];
  remarks: Scalars['String']['output'];
  reportId: Scalars['String']['output'];
  startDate: Scalars['DateTime']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  workDone: Scalars['String']['output'];
};

export type InstrumentCompetenceInput = {
  competence: Scalars['String']['input'];
  description: Scalars['String']['input'];
  expiryDate: Scalars['DateTime']['input'];
  instrumentUid: Scalars['String']['input'];
  internal: Scalars['Boolean']['input'];
  issueDate: Scalars['DateTime']['input'];
  userUid: Scalars['String']['input'];
};

export type InstrumentCompetenceResponse = InstrumentCompetenceType | OperationError;

export type InstrumentCompetenceType = {
  __typename?: 'InstrumentCompetenceType';
  competence?: Maybe<Scalars['BytesScalar']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description: Scalars['String']['output'];
  expiryDate: Scalars['DateTime']['output'];
  instrument?: Maybe<InstrumentType>;
  instrumentUid: Scalars['String']['output'];
  internal: Scalars['Boolean']['output'];
  issueDate: Scalars['DateTime']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  user?: Maybe<UserType>;
  userUid: Scalars['String']['output'];
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
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  instrumentType?: Maybe<InstrumentTypeType>;
  instrumentTypeUid?: Maybe<Scalars['String']['output']>;
  keyword?: Maybe<Scalars['String']['output']>;
  laboratoryInstruments?: Maybe<Array<LaboratoryInstrumentType>>;
  manufacturer?: Maybe<ManufacturerType>;
  manufacturerUid?: Maybe<Scalars['String']['output']>;
  methods?: Maybe<Array<MethodType>>;
  name?: Maybe<Scalars['String']['output']>;
  supplier?: Maybe<SupplierType>;
  supplierUid?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
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
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type LaboratoryInputType = {
  address?: InputMaybe<Scalars['String']['input']>;
  banking?: InputMaybe<Scalars['String']['input']>;
  businessPhone?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  emailCc?: InputMaybe<Scalars['String']['input']>;
  labManagerUid?: InputMaybe<Scalars['String']['input']>;
  labName: Scalars['String']['input'];
  logo?: InputMaybe<Scalars['String']['input']>;
  mobilePhone?: InputMaybe<Scalars['String']['input']>;
  qualityStatement?: InputMaybe<Scalars['String']['input']>;
  setupName?: Scalars['String']['input'];
  tagLine?: InputMaybe<Scalars['String']['input']>;
};

export type LaboratoryInstrumentCursorPage = {
  __typename?: 'LaboratoryInstrumentCursorPage';
  edges?: Maybe<Array<LaboratoryInstrumentEdge>>;
  items?: Maybe<Array<LaboratoryInstrumentType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type LaboratoryInstrumentEdge = {
  __typename?: 'LaboratoryInstrumentEdge';
  cursor: Scalars['String']['output'];
  node: LaboratoryInstrumentType;
};

export type LaboratoryInstrumentInputType = {
  dateCommissioned?: InputMaybe<Scalars['DateTime']['input']>;
  dateDecommissioned?: InputMaybe<Scalars['DateTime']['input']>;
  instrumentUid: Scalars['String']['input'];
  labName: Scalars['String']['input'];
  serialNumber?: InputMaybe<Scalars['String']['input']>;
};

export type LaboratoryInstrumentResponse = LaboratoryInstrumentType | OperationError;

export type LaboratoryInstrumentType = {
  __typename?: 'LaboratoryInstrumentType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  dateCommissioned?: Maybe<Scalars['DateTime']['output']>;
  dateDecommissioned?: Maybe<Scalars['DateTime']['output']>;
  instrument?: Maybe<InstrumentType>;
  instrumentUid?: Maybe<Scalars['String']['output']>;
  labName?: Maybe<Scalars['String']['output']>;
  serialNumber?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type LaboratoryResponse = LaboratoryType | OperationError;

export type LaboratorySettingInputType = {
  allowAutoBilling?: InputMaybe<Scalars['Boolean']['input']>;
  allowBilling?: InputMaybe<Scalars['Boolean']['input']>;
  allowPatientRegistration?: InputMaybe<Scalars['Boolean']['input']>;
  allowSampleRegistration?: InputMaybe<Scalars['Boolean']['input']>;
  allowSelfVerification?: InputMaybe<Scalars['Boolean']['input']>;
  allowWorksheetCreation?: InputMaybe<Scalars['Boolean']['input']>;
  autoReceiveSamples?: InputMaybe<Scalars['Boolean']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  defaultRoute?: InputMaybe<Scalars['String']['input']>;
  defaultTheme?: InputMaybe<Scalars['String']['input']>;
  inactivityLogOut?: InputMaybe<Scalars['Int']['input']>;
  laboratoryUid: Scalars['String']['input'];
  passwordLifetime?: InputMaybe<Scalars['Int']['input']>;
  paymentTermsDays?: InputMaybe<Scalars['Int']['input']>;
  stickerCopies?: InputMaybe<Scalars['Int']['input']>;
};

export type LaboratorySettingResponse = LaboratorySettingType | OperationError;

export type LaboratorySettingType = {
  __typename?: 'LaboratorySettingType';
  allowAutoBilling?: Maybe<Scalars['Boolean']['output']>;
  allowBilling?: Maybe<Scalars['Boolean']['output']>;
  allowPatientRegistration?: Maybe<Scalars['Boolean']['output']>;
  allowSampleRegistration?: Maybe<Scalars['Boolean']['output']>;
  allowSelfVerification?: Maybe<Scalars['Boolean']['output']>;
  allowWorksheetCreation?: Maybe<Scalars['Boolean']['output']>;
  autoReceiveSamples?: Maybe<Scalars['Boolean']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  defaultRoute?: Maybe<Scalars['String']['output']>;
  defaultTatMinutes?: Maybe<Scalars['Int']['output']>;
  defaultTheme?: Maybe<Scalars['String']['output']>;
  inactivityLogOut?: Maybe<Scalars['Int']['output']>;
  laboratory: LaboratoryType;
  laboratoryUid: Scalars['String']['output'];
  passwordLifetime?: Maybe<Scalars['Int']['output']>;
  paymentTermsDays?: Maybe<Scalars['Int']['output']>;
  stickerCopies?: Maybe<Scalars['Int']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type LaboratoryType = {
  __typename?: 'LaboratoryType';
  address?: Maybe<Scalars['String']['output']>;
  banking?: Maybe<Scalars['String']['output']>;
  businessPhone?: Maybe<Scalars['String']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  emailCc?: Maybe<Scalars['String']['output']>;
  labManager?: Maybe<UserType>;
  labManagerUid?: Maybe<Scalars['String']['output']>;
  labName: Scalars['String']['output'];
  logo?: Maybe<Scalars['String']['output']>;
  mobilePhone?: Maybe<Scalars['String']['output']>;
  qualityStatement?: Maybe<Scalars['String']['output']>;
  setupName: Scalars['String']['output'];
  tagLine?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
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

export type ManageAnalysisInputType = {
  add?: InputMaybe<Array<Scalars['String']['input']>>;
  cancel?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type ManufacturerInputType = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type ManufacturerResponse = ManufacturerType | OperationError;

export type ManufacturerType = {
  __typename?: 'ManufacturerType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

/** Union of possible outcomes when deleting some object */
export type MessageResponse = MessagesType | OperationError;

export type MessageThreadType = {
  __typename?: 'MessageThreadType';
  broadcast: Scalars['Boolean']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  deletedBy?: Maybe<Array<UserType>>;
  messages?: Maybe<Array<MessageType>>;
  recipients: Array<UserType>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type MessageType = {
  __typename?: 'MessageType';
  body: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
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
  updatedAt?: Maybe<Scalars['String']['output']>;
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
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  instruments?: Maybe<Array<InstrumentType>>;
  keyword?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  actionShipment: ShipmentResponse;
  actionWorksheets: WorkSheetsResponse;
  applyVoucher: TestBillTransactionResponse;
  approveStockOrder: StockOrderResponse;
  authenticateUser: AuthenticatedDataResponse;
  cancelAnalysisResults: AnalysisResultResponse;
  cancelSamples: ResultedSampleActionResponse;
  cloneSamples: SampleActionResponse;
  confirmTestBillTransaction: TestBillTransactionResponse;
  createAnalysis: ProfilesServiceResponse;
  createAnalysisCategory: AnalysisCategoryResponse;
  createAnalysisCorrectionFactor: AnalysisCorrectionFactorResponse;
  createAnalysisDetectionLimit: AnalysisDetectionLimitResponse;
  createAnalysisInterim: AnalysisInterimResponse;
  createAnalysisMapping: AnalysisMappingResponse;
  createAnalysisRequest: AnalysisRequestResponse;
  createAnalysisSpecification: AnalysisSpecificationResponse;
  createAnalysisTemplate: AnalysisTemplateResponse;
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
  createInstrumentCompetence: InstrumentCompetenceResponse;
  createInstrumentType: InstrumentTypeResponse;
  createLaboratoryInstrument: LaboratoryInstrumentResponse;
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
  createStockItemVariant: StockItemVariantResponse;
  createStockOrder: StockOrderResponse;
  createStockReceipt: StockItemVariantResponse;
  createStockUnit: StockUnitResponse;
  createStorageContainer: StorageContainerResponse;
  createStorageLocation: StorageLocationResponse;
  createStorageSection: StorageSectionResponse;
  createStoreRoom: StoreRoomResponse;
  createSupplier: SupplierResponse;
  createTestBillTransaction: TestBillTransactionResponse;
  createUnit: UnitResponse;
  createUser: UserResponse;
  createVoucher: VoucherResponse;
  createVoucherCode: VoucherCodeResponse;
  createWorksheet: WorkSheetsResponse;
  createWorksheetTemplate: WorkSheetTemplateResponse;
  deleteClientContact: DeleteContactResponse;
  deleteMessage: DeleteResponse;
  deleteNotice: DeleteResponse;
  deleteReflexBrain: DeletedItem;
  deleteStockOrder: StockOrderResponse;
  deleteThread: DeleteResponse;
  invalidateSamples: SampleActionResponse;
  issueStockOrder: StockOrderResponse;
  manageAnalyses: ResultedSampleActionResponse;
  printSamples: SampleActionResponse;
  publishSamples: SuccessErrorResponse;
  reInstateAnalysisResults: AnalysisResultResponse;
  reInstateSamples: ResultedSampleActionResponse;
  receiveSamples: ResultedSampleActionResponse;
  recoverSamples: StoreSampleResponse;
  refresh: AuthenticatedDataResponse;
  rejectSamples: SampleActionResponse;
  replyMessage: MessageResponse;
  requestPasswordReset: MessageResponse;
  resetPassword: MessageResponse;
  retestAnalysisResults: AnalysisResultResponse;
  retractAnalysisResults: AnalysisResultResponse;
  samplesApplyTemplate: ResultedSampleActionResponse;
  sendMessage: MessageResponse;
  shipmentManageSamples: ShipmentResponse;
  storeSamples: StoreSampleResponse;
  submitAnalysisResults: AnalysisResultSubmitResponse;
  submitStockOrder: StockOrderResponse;
  updateAnalysis: ProfilesServiceResponse;
  updateAnalysisCategory: AnalysisCategoryResponse;
  updateAnalysisCorrectionFactor: AnalysisCorrectionFactorResponse;
  updateAnalysisDetectionLimit: AnalysisDetectionLimitResponse;
  updateAnalysisDiscount: AnalysisDiscountResponse;
  updateAnalysisInterim: AnalysisInterimResponse;
  updateAnalysisMapping: AnalysisMappingResponse;
  updateAnalysisPrice: AnalysisPriceResponse;
  updateAnalysisSpecification: AnalysisSpecificationResponse;
  updateAnalysisTemplate: AnalysisTemplateResponse;
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
  updateInstrumentCompetence: InstrumentCompetenceResponse;
  updateInstrumentType: InstrumentTypeResponse;
  updateLaboratory: LaboratoryResponse;
  updateLaboratoryInstrument: LaboratoryInstrumentResponse;
  updateLaboratorySetting: LaboratorySettingResponse;
  updateManufacturer: ManufacturerResponse;
  updateMethod: MethodResponse;
  updateNotice: NoticeResponse;
  updatePatient: PatientResponse;
  updateProfile: AnalysisProfileResponse;
  updateProfileDiscount: ProfileDiscountResponse;
  updateProfileMapping: ProfileMappingResponse;
  updateProfilePrice: ProfilePriceResponse;
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
  updateStockItemVariant: StockItemVariantResponse;
  updateStockOrder: StockOrderResponse;
  updateStockUnit: StockUnitResponse;
  updateStorageContainer: StorageContainerResponse;
  updateStorageLocation: StorageLocationResponse;
  updateStorageSection: StorageSectionResponse;
  updateStoreRoom: StoreRoomResponse;
  updateSupplier: SupplierResponse;
  updateUnit: UnitResponse;
  updateUser: UserResponse;
  updateVoucher: VoucherResponse;
  updateVoucherCode: VoucherCodeResponse;
  updateWorksheet: WorkSheetResponse;
  updateWorksheetApplyTemplate: WorkSheetResponse;
  updateWorksheetManualAssign: WorkSheetResponse;
  updateWorksheetTemplate: WorkSheetTemplateResponse;
  validatePasswordResetToken: PasswordResetValidityResponse;
  verifyAnalysisResults: AnalysisResultSubmitResponse;
  verifySamples: SampleActionResponse;
  viewMessage: MessageResponse;
  viewNotice: NoticeType;
};


export type MutationActionShipmentArgs = {
  action: Scalars['String']['input'];
  uid: Scalars['String']['input'];
};


export type MutationActionWorksheetsArgs = {
  action: Scalars['String']['input'];
  uids: Array<Scalars['String']['input']>;
};


export type MutationApplyVoucherArgs = {
  payload: ApplyVoucherInput;
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


export type MutationConfirmTestBillTransactionArgs = {
  notes?: InputMaybe<Scalars['String']['input']>;
  uid: Scalars['String']['input'];
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


export type MutationCreateAnalysisTemplateArgs = {
  payload: AnalysisTemplateInputType;
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


export type MutationCreateInstrumentCompetenceArgs = {
  payload: InstrumentCompetenceInput;
};


export type MutationCreateInstrumentTypeArgs = {
  payload: InstrumentTypeInputType;
};


export type MutationCreateLaboratoryInstrumentArgs = {
  payload: LaboratoryInstrumentInputType;
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


export type MutationCreateStockItemVariantArgs = {
  payload: StockItemVariantInputType;
  stockItemUid: Scalars['String']['input'];
};


export type MutationCreateStockOrderArgs = {
  payload: StockOrderInputType;
};


export type MutationCreateStockReceiptArgs = {
  payload: StockReceiptInputType;
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


export type MutationCreateTestBillTransactionArgs = {
  payload: BillTransactionInput;
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
  password: Scalars['String']['input'];
  passwordc: Scalars['String']['input'];
  userName: Scalars['String']['input'];
};


export type MutationCreateVoucherArgs = {
  payload: VoucherInput;
};


export type MutationCreateVoucherCodeArgs = {
  payload: VoucherCodeInput;
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


export type MutationDeleteReflexBrainArgs = {
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


export type MutationManageAnalysesArgs = {
  payload: ManageAnalysisInputType;
  sampleUid: Scalars['String']['input'];
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


export type MutationRecoverSamplesArgs = {
  sampleUids: Array<Scalars['String']['input']>;
};


export type MutationRefreshArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationRejectSamplesArgs = {
  samples: Array<SampleRejectInputType>;
};


export type MutationReplyMessageArgs = {
  body: Scalars['String']['input'];
  threadUid: Scalars['String']['input'];
};


export type MutationRequestPasswordResetArgs = {
  email: Scalars['String']['input'];
};


export type MutationResetPasswordArgs = {
  password: Scalars['String']['input'];
  passwordc: Scalars['String']['input'];
  userUid: Scalars['String']['input'];
};


export type MutationRetestAnalysisResultsArgs = {
  analyses: Array<Scalars['String']['input']>;
};


export type MutationRetractAnalysisResultsArgs = {
  analyses: Array<Scalars['String']['input']>;
};


export type MutationSamplesApplyTemplateArgs = {
  analysisTemplateUid: Scalars['String']['input'];
  uid: Scalars['String']['input'];
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


export type MutationUpdateAnalysisDiscountArgs = {
  payload: PriceDiscountInput;
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


export type MutationUpdateAnalysisPriceArgs = {
  payload: PriceInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateAnalysisSpecificationArgs = {
  payload: AnalysisSpecificationInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateAnalysisTemplateArgs = {
  payload: AnalysisTemplateInputType;
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


export type MutationUpdateInstrumentCompetenceArgs = {
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


export type MutationUpdateLaboratoryInstrumentArgs = {
  payload: LaboratoryInstrumentInputType;
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


export type MutationUpdateProfileDiscountArgs = {
  payload: PriceDiscountInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateProfileMappingArgs = {
  payload: ProfileMappingInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateProfilePriceArgs = {
  payload: PriceInput;
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


export type MutationUpdateStockItemVariantArgs = {
  payload: StockItemVariantInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateStockOrderArgs = {
  payload: StockOrderInputType;
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
  password?: InputMaybe<Scalars['String']['input']>;
  passwordc?: InputMaybe<Scalars['String']['input']>;
  userUid: Scalars['String']['input'];
};


export type MutationUpdateVoucherArgs = {
  payload: VoucherInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateVoucherCodeArgs = {
  payload: VoucherCodeInput;
  uid: Scalars['String']['input'];
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


export type MutationValidatePasswordResetTokenArgs = {
  token: Scalars['String']['input'];
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
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  departments?: Maybe<Array<DepartmentType>>;
  expiry: Scalars['String']['output'];
  groups?: Maybe<Array<GroupType>>;
  title: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  viewers?: Maybe<Array<UserType>>;
};

export type NotificationType = {
  __typename?: 'NotificationType';
  createdAt?: Maybe<Scalars['String']['output']>;
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

export type PasswordResetValidityResponse = OperationError | PasswordResetValidityType;

export type PasswordResetValidityType = {
  __typename?: 'PasswordResetValidityType';
  authUid: Scalars['String']['output'];
  username: Scalars['String']['output'];
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
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  identification?: Maybe<IdentificationType>;
  identificationUid: Scalars['String']['output'];
  patientUid: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
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
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  dateOfBirth?: Maybe<Scalars['DateTime']['output']>;
  district?: Maybe<DistrictType>;
  districtUid?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<Scalars['String']['output']>;
  identifications?: Maybe<Array<PatientIdentificationType>>;
  internalUse: Scalars['Boolean']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  metadataSnapshot?: Maybe<Scalars['JSONScalar']['output']>;
  middleName?: Maybe<Scalars['String']['output']>;
  patientId: Scalars['String']['output'];
  phoneHome?: Maybe<Scalars['String']['output']>;
  phoneMobile?: Maybe<Scalars['String']['output']>;
  province?: Maybe<ProvinceType>;
  provinceUid?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
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
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<PermissionType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  target?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<PermissionType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type PriceDiscountInput = {
  discountType: Scalars['String']['input'];
  endDate: Scalars['DateTime']['input'];
  isActive: Scalars['Boolean']['input'];
  startDate: Scalars['DateTime']['input'];
  valueAmount?: InputMaybe<Scalars['Float']['input']>;
  valuePercent?: InputMaybe<Scalars['Float']['input']>;
  valueType?: InputMaybe<Scalars['String']['input']>;
  voucherUid?: InputMaybe<Scalars['String']['input']>;
};

export type PriceInput = {
  amount: Scalars['Float']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
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

export type ProfileDiscountResponse = OperationError | ProfileDiscountType;

export type ProfileDiscountType = {
  __typename?: 'ProfileDiscountType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  discountType: Scalars['String']['output'];
  endDate: Scalars['DateTime']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  profile: ProfileType;
  profileUid: Scalars['String']['output'];
  startDate: Scalars['DateTime']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  valueAmount: Scalars['Float']['output'];
  valuePercent: Scalars['Float']['output'];
  valueType: Scalars['String']['output'];
  voucher?: Maybe<VoucherType>;
  voucherUid?: Maybe<Scalars['String']['output']>;
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
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  profile?: Maybe<ProfileType>;
  profileUid: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type ProfilePriceResponse = OperationError | ProfilePriceType;

export type ProfilePriceType = {
  __typename?: 'ProfilePriceType';
  amount: Scalars['Float']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  profile: ProfileType;
  profileUid: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type ProfileType = {
  __typename?: 'ProfileType';
  active: Scalars['Boolean']['output'];
  analyses?: Maybe<Array<AnalysisType>>;
  createdAt?: Maybe<Scalars['String']['output']>;
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
  updatedAt?: Maybe<Scalars['String']['output']>;
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
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  emailCc?: Maybe<Scalars['String']['output']>;
  mobilePhone?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type QcLevelResponse = OperationError | QcLevelType;

export type QcLevelType = {
  __typename?: 'QCLevelType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  level: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
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
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  note: Scalars['String']['output'];
  status: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type QcSetWithSamples = {
  __typename?: 'QCSetWithSamples';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  note: Scalars['String']['output'];
  samples?: Maybe<Array<SamplesWithResults>>;
  status: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type QcTemplateInputType = {
  departments?: InputMaybe<Array<Scalars['String']['input']>>;
  description?: Scalars['String']['input'];
  levels?: InputMaybe<Array<Scalars['String']['input']>>;
  name: Scalars['String']['input'];
};

export type QcTemplateResponse = OperationError | QcTemplateType;

export type QcTemplateType = {
  __typename?: 'QCTemplateType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  departments: Array<DepartmentType>;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  qcLevels: Array<QcLevelType>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
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
  analysisTemplateAll: Array<AnalysisTemplateType>;
  analysisTemplateByUid: AnalysisTemplateType;
  analysisUncertaintyAll: Array<AnalysisUncertaintyType>;
  analysisUncertaintyByUid: AnalysisUncertaintyType;
  analysisWithoutProfile: Array<AnalysisType>;
  auditLogsFilter?: Maybe<Array<AuditLogType>>;
  barcodeSamples?: Maybe<Array<Scalars['BytesScalar']['output']>>;
  billByUid?: Maybe<TestBillType>;
  billInvoice?: Maybe<TestBillInvoiceType>;
  billInvoiceCreate?: Maybe<Scalars['BytesScalar']['output']>;
  billInvoices?: Maybe<Array<TestBillInvoiceType>>;
  billTransactions?: Maybe<Array<TestBillTransactionType>>;
  bills: TestBillCursorPage;
  billsForClient?: Maybe<Array<TestBillType>>;
  billsForPatient?: Maybe<Array<TestBillType>>;
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
  discountForAnalysis?: Maybe<AnalysisDiscountType>;
  discountForProfile?: Maybe<ProfileDiscountType>;
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
  laboratoryInstrumentAll: LaboratoryInstrumentCursorPage;
  laboratoryInstrumentByUid: LaboratoryInstrumentType;
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
  priceForAnalysis?: Maybe<AnalysisPriceType>;
  priceForProfile?: Maybe<ProfilePriceType>;
  profileAll: Array<ProfileType>;
  profileByUid: ProfileType;
  profileMappingsByProfile: Array<ProfileMappingType>;
  provinceAll: ProvinceCursorPage;
  provinceByUid: ProvinceType;
  provincesByCountryUid: Array<ProvinceType>;
  qcChartData: Array<AnalysisResultType>;
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
  resultMutationByResultUid?: Maybe<ResultMutationType>;
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
  stockItemVariants: Array<StockItemVariantType>;
  stockLots: Array<StockLotType>;
  stockOrderAll: StockOrderCursorPage;
  stockOrderByUid?: Maybe<StockOrderType>;
  stockOrderProductAll: Array<StockOrderProductType>;
  stockOrderProductByUid?: Maybe<StockOrderProductType>;
  stockProductAll: StockItemVariantCursorPage;
  stockProductByUid?: Maybe<StockItemVariantType>;
  stockProductInventory?: Maybe<StockProductInventoryType>;
  stockReceipt: Array<StockReceiptType>;
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
  voucherAll?: Maybe<Array<VoucherType>>;
  voucherByUid?: Maybe<VoucherType>;
  voucherCodes?: Maybe<Array<VoucherCodeType>>;
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


export type QueryAnalysisTemplateByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAnalysisUncertaintyByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAuditLogsFilterArgs = {
  targetType: Scalars['String']['input'];
  targetUid: Scalars['String']['input'];
};


export type QueryBarcodeSamplesArgs = {
  sampleUids: Array<Scalars['String']['input']>;
};


export type QueryBillByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryBillInvoiceArgs = {
  invoiceUid: Scalars['String']['input'];
};


export type QueryBillInvoiceCreateArgs = {
  billUid: Scalars['String']['input'];
};


export type QueryBillInvoicesArgs = {
  billUid: Scalars['String']['input'];
};


export type QueryBillTransactionsArgs = {
  billUid: Scalars['String']['input'];
};


export type QueryBillsArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  clientUid?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  partial?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryBillsForClientArgs = {
  clientUid: Scalars['String']['input'];
};


export type QueryBillsForPatientArgs = {
  patientUid: Scalars['String']['input'];
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


export type QueryDiscountForAnalysisArgs = {
  analysisUid: Scalars['String']['input'];
};


export type QueryDiscountForProfileArgs = {
  profileUid: Scalars['String']['input'];
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
  sampleIds: Array<Scalars['String']['input']>;
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


export type QueryLaboratoryInstrumentAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryLaboratoryInstrumentByUidArgs = {
  uid: Scalars['String']['input'];
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


export type QueryPriceForAnalysisArgs = {
  analysisUid: Scalars['String']['input'];
};


export type QueryPriceForProfileArgs = {
  profileUid: Scalars['String']['input'];
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


export type QueryQcChartDataArgs = {
  analyses: Array<Scalars['String']['input']>;
  month: Scalars['Int']['input'];
  year: Scalars['Int']['input'];
};


export type QueryQcLevelByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryQcSetAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: Array<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
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


export type QueryResultMutationByResultUidArgs = {
  resultUid: Scalars['String']['input'];
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
  productUid?: InputMaybe<Scalars['String']['input']>;
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


export type QueryStockItemVariantsArgs = {
  stockItemUid: Scalars['String']['input'];
};


export type QueryStockLotsArgs = {
  productUid: Scalars['String']['input'];
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


export type QueryStockProductInventoryArgs = {
  productUid: Scalars['String']['input'];
  stockLotUid: Scalars['String']['input'];
};


export type QueryStockReceiptArgs = {
  productUid: Scalars['String']['input'];
  stockLotUid: Scalars['String']['input'];
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


export type QueryVoucherByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryVoucherCodesArgs = {
  voucherUid: Scalars['String']['input'];
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
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  isReference?: Maybe<Scalars['Boolean']['output']>;
  isReferral?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  password?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};

export type ReflexActionInput = {
  analyses: Array<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  level: Scalars['Int']['input'];
  reflexRuleUid: Scalars['String']['input'];
  sampleTypeUid?: InputMaybe<Scalars['String']['input']>;
};

export type ReflexActionResponse = OperationError | ReflexActionType;

export type ReflexActionType = {
  __typename?: 'ReflexActionType';
  analyses?: Maybe<Array<AnalysisType>>;
  brains?: Maybe<Array<ReflexBrainType>>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description: Scalars['String']['output'];
  level: Scalars['Int']['output'];
  reflexRule?: Maybe<ReflexRuleType>;
  reflexRuleUid: Scalars['String']['output'];
  sampleType?: Maybe<SampleTypeTyp>;
  sampleTypeUid?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type ReflexAddNewInput = {
  analysisUid: Scalars['String']['input'];
  count: Scalars['Int']['input'];
};

export type ReflexBrainActionInput = {
  addNew?: InputMaybe<Array<ReflexAddNewInput>>;
  finalise?: InputMaybe<Array<ReflexFinalInput>>;
};

export type ReflexBrainActionType = {
  __typename?: 'ReflexBrainActionType';
  addNew?: Maybe<Array<ReflexBrainAdditionType>>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description: Scalars['String']['output'];
  finalise?: Maybe<Array<ReflexBrainFinalType>>;
  priority: Scalars['Int']['output'];
  reflexBrain?: Maybe<ReflexBrainType>;
  reflexBrainUid: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type ReflexBrainAdditionType = {
  __typename?: 'ReflexBrainAdditionType';
  analysis?: Maybe<AnalysisType>;
  analysisUid: Scalars['String']['output'];
  count: Scalars['Int']['output'];
  reflexBrainAction?: Maybe<ReflexBrainActionType>;
  reflexBrainActionUid: Scalars['String']['output'];
};

export type ReflexBrainConditionCriteriaType = {
  __typename?: 'ReflexBrainConditionCriteriaType';
  analysis?: Maybe<AnalysisType>;
  analysisUid: Scalars['String']['output'];
  operator: Scalars['String']['output'];
  reflexBrainCondition?: Maybe<ReflexBrainConditionType>;
  reflexBrainConditionUid: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type ReflexBrainConditionInput = {
  criteria?: InputMaybe<Array<ReflexBrainCriteriaInput>>;
  description?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<Scalars['Int']['input']>;
};

export type ReflexBrainConditionType = {
  __typename?: 'ReflexBrainConditionType';
  criteria?: Maybe<Array<ReflexBrainConditionCriteriaType>>;
  description?: Maybe<Scalars['String']['output']>;
  priority: Scalars['Int']['output'];
  reflexBrain: ReflexBrainType;
  reflexBrainUid: Scalars['String']['output'];
  uid: Scalars['String']['output'];
};

export type ReflexBrainCriteriaInput = {
  analysisUid: Scalars['String']['input'];
  operator: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type ReflexBrainFinalType = {
  __typename?: 'ReflexBrainFinalType';
  analysis?: Maybe<AnalysisType>;
  analysisUid: Scalars['String']['output'];
  reflexBrainAction?: Maybe<ReflexBrainActionType>;
  reflexBrainActionUid: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type ReflexBrainInput = {
  actions?: InputMaybe<Array<ReflexBrainActionInput>>;
  conditions?: InputMaybe<Array<ReflexBrainConditionInput>>;
  description?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<Scalars['Int']['input']>;
  reflexActionUid: Scalars['String']['input'];
};

export type ReflexBrainResponse = OperationError | ReflexBrainType;

export type ReflexBrainType = {
  __typename?: 'ReflexBrainType';
  actions: Array<ReflexBrainActionType>;
  conditions: Array<ReflexBrainConditionType>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description: Scalars['String']['output'];
  priority: Scalars['Int']['output'];
  reflexAction?: Maybe<ReflexBrainType>;
  reflexActionUid: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
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
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type ReflexRuleResponse = OperationError | ReflexRuleType;

export type ReflexRuleType = {
  __typename?: 'ReflexRuleType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  priority: Scalars['Int']['output'];
  reflexActions?: Maybe<Array<ReflexActionType>>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type RejectionReasonResponse = OperationError | RejectionReasonType;

export type RejectionReasonType = {
  __typename?: 'RejectionReasonType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  reason: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type ReportImpressType = {
  __typename?: 'ReportImpressType';
  createdAt: Scalars['DateTime']['output'];
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  emailRequired?: Maybe<Scalars['Boolean']['output']>;
  emailSent?: Maybe<Scalars['Boolean']['output']>;
  generatedBy?: Maybe<UserType>;
  generatedByUid?: Maybe<Scalars['String']['output']>;
  jsonContent?: Maybe<Scalars['JSONScalar']['output']>;
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
  createdAt?: Maybe<Scalars['String']['output']>;
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
  updatedAt?: Maybe<Scalars['String']['output']>;
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

export type ResultMutationType = {
  __typename?: 'ResultMutationType';
  after: Scalars['String']['output'];
  before: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  date?: Maybe<Scalars['String']['output']>;
  mutation: Scalars['String']['output'];
  resultUid: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type ResultOptionInputType = {
  analysisUid: Scalars['String']['input'];
  optionKey: Scalars['Int']['input'];
  sampleTypes?: InputMaybe<Array<Scalars['String']['input']>>;
  value: Scalars['String']['input'];
};

export type ResultOptionResponse = OperationError | ResultOptionType;

export type ResultOptionType = {
  __typename?: 'ResultOptionType';
  analysisUid: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  optionKey: Scalars['Int']['output'];
  sampleTypes?: Maybe<Array<SampleTypeTyp>>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
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
  createdAt?: Maybe<Scalars['String']['output']>;
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
  dueDate?: Maybe<Scalars['String']['output']>;
  internalUse: Scalars['Boolean']['output'];
  invalidatedBy?: Maybe<UserType>;
  invalidatedByUid?: Maybe<Scalars['String']['output']>;
  metadataSnapshot?: Maybe<Scalars['JSONScalar']['output']>;
  parent?: Maybe<SampleType>;
  parentId?: Maybe<Scalars['String']['output']>;
  printed?: Maybe<Scalars['Boolean']['output']>;
  printedBy?: Maybe<UserType>;
  printedByUid?: Maybe<Scalars['String']['output']>;
  priority: Scalars['Int']['output'];
  profiles: Array<ProfileType>;
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
  updatedAt?: Maybe<Scalars['String']['output']>;
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
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  sampleType?: Maybe<SampleTypeTyp>;
  sampleTypeUid: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type SampleTypeResponse = OperationError | SampleTypeTyp;

export type SampleTypeTyp = {
  __typename?: 'SampleTypeTyp';
  abbr: Scalars['String']['output'];
  active: Scalars['Boolean']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  internalUse: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
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
  createdAt?: Maybe<Scalars['String']['output']>;
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
  dueDate?: Maybe<Scalars['String']['output']>;
  internalUse: Scalars['Boolean']['output'];
  invalidatedBy?: Maybe<UserType>;
  invalidatedByUid?: Maybe<Scalars['String']['output']>;
  metadataSnapshot?: Maybe<Scalars['JSONScalar']['output']>;
  parent?: Maybe<SampleType>;
  parentId?: Maybe<Scalars['String']['output']>;
  printed?: Maybe<Scalars['Boolean']['output']>;
  printedBy?: Maybe<UserType>;
  printedByUid?: Maybe<Scalars['String']['output']>;
  priority: Scalars['Int']['output'];
  profiles: Array<ProfileType>;
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
  updatedAt?: Maybe<Scalars['String']['output']>;
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
  createdAt?: Maybe<Scalars['String']['output']>;
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
  incoming: Scalars['Boolean']['output'];
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
  updatedAt?: Maybe<Scalars['String']['output']>;
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
  stockLotUid: Scalars['String']['input'];
};

export type StockAdjustmentResponse = OperationError | StockAdjustmentType;

export type StockAdjustmentType = {
  __typename?: 'StockAdjustmentType';
  adjust?: Maybe<Scalars['Int']['output']>;
  adjustmentBy?: Maybe<UserType>;
  adjustmentByUid?: Maybe<Scalars['String']['output']>;
  adjustmentDate?: Maybe<Scalars['String']['output']>;
  adjustmentFor?: Maybe<UserType>;
  adjustmentForUid?: Maybe<Scalars['String']['output']>;
  adjustmentType?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  product?: Maybe<StockItemVariantType>;
  productUid?: Maybe<Scalars['String']['output']>;
  remarks?: Maybe<Scalars['String']['output']>;
  stockLot?: Maybe<StockLotType>;
  stockLotUid?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
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
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
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
  categoryUid?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  hazardUid?: InputMaybe<Scalars['String']['input']>;
  maximumLevel?: InputMaybe<Scalars['Int']['input']>;
  minimumLevel?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
};

export type StockItemResponse = OperationError | StockItemType;

export type StockItemType = {
  __typename?: 'StockItemType';
  category?: Maybe<StockCategoryType>;
  categoryUid?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  hazard?: Maybe<HazardType>;
  hazardUid?: Maybe<Scalars['String']['output']>;
  maximumLevel?: Maybe<Scalars['Int']['output']>;
  minimumLevel?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  variants?: Maybe<Array<StockItemVariantType>>;
};

export type StockItemVariantCursorPage = {
  __typename?: 'StockItemVariantCursorPage';
  edges?: Maybe<Array<StockItemVariantType>>;
  items?: Maybe<Array<StockItemVariantType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type StockItemVariantEdge = {
  __typename?: 'StockItemVariantEdge';
  cursor: Scalars['String']['output'];
  node: StockItemVariantType;
};

export type StockItemVariantInputType = {
  description: Scalars['String']['input'];
  maximumLevel?: InputMaybe<Scalars['Int']['input']>;
  minimumLevel?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
};

export type StockItemVariantResponse = OperationError | StockItemVariantType;

export type StockItemVariantType = {
  __typename?: 'StockItemVariantType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  maximumLevel?: Maybe<Scalars['Int']['output']>;
  minimumLevel?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  quantity: Scalars['Int']['output'];
  stockItem?: Maybe<StockItemType>;
  stockItemUid?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type StockLotType = {
  __typename?: 'StockLotType';
  expiryDate: Scalars['DateTime']['output'];
  lotNumber: Scalars['String']['output'];
  product?: Maybe<StockItemVariantType>;
  productUid: Scalars['String']['output'];
  quantity: Scalars['Int']['output'];
  remarks?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
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
  price?: Scalars['Float']['input'];
  productUid: Scalars['String']['input'];
  quantity: Scalars['Int']['input'];
  remarks?: InputMaybe<Scalars['String']['input']>;
  stockLotUid: Scalars['String']['input'];
};

export type StockOrderProductType = {
  __typename?: 'StockOrderProductType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  order?: Maybe<StockOrderType>;
  orderUid?: Maybe<Scalars['String']['output']>;
  product?: Maybe<StockItemVariantType>;
  productUid?: Maybe<Scalars['String']['output']>;
  quantity?: Maybe<Scalars['Int']['output']>;
  stockLot?: Maybe<StockLotType>;
  stockLotUid: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type StockOrderResponse = OperationError | StockOrderLineType | StockOrderType;

export type StockOrderType = {
  __typename?: 'StockOrderType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  department?: Maybe<DepartmentType>;
  departmentUid?: Maybe<Scalars['String']['output']>;
  fulfilledBy?: Maybe<UserType>;
  fulfilledByUid?: Maybe<Scalars['String']['output']>;
  orderBy?: Maybe<UserType>;
  orderByUid?: Maybe<Scalars['String']['output']>;
  orderNumber?: Maybe<Scalars['String']['output']>;
  remarks?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type StockPackagingType = {
  __typename?: 'StockPackagingType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type StockProductInventoryType = {
  __typename?: 'StockProductInventoryType';
  product?: Maybe<StockItemVariantType>;
  productUid: Scalars['String']['output'];
  quantity: Scalars['Int']['output'];
  remarks?: Maybe<Scalars['String']['output']>;
  stockLot?: Maybe<StockLotType>;
  stockLotUid: Scalars['String']['output'];
  uid: Scalars['String']['output'];
};

export type StockReceiptInputType = {
  expiryDate?: InputMaybe<Scalars['DateTime']['input']>;
  lotNumber: Scalars['String']['input'];
  packageFactor: Scalars['Int']['input'];
  packagesReceived: Scalars['Int']['input'];
  productUid: Scalars['String']['input'];
  quantityReceived: Scalars['Int']['input'];
  receiptByUid: Scalars['String']['input'];
  receiptDate?: InputMaybe<Scalars['DateTime']['input']>;
  receiptType: Scalars['String']['input'];
  singlesReceived: Scalars['Int']['input'];
  supplierUid: Scalars['String']['input'];
  totalPrice?: InputMaybe<Scalars['Float']['input']>;
  unitPrice?: InputMaybe<Scalars['Float']['input']>;
  unitUid: Scalars['String']['input'];
};

export type StockReceiptType = {
  __typename?: 'StockReceiptType';
  packageFactor?: Maybe<Scalars['Int']['output']>;
  packagesReceived?: Maybe<Scalars['Int']['output']>;
  product?: Maybe<StockItemVariantType>;
  productUid?: Maybe<Scalars['String']['output']>;
  quantityReceived?: Maybe<Scalars['Int']['output']>;
  receiptBy?: Maybe<UserType>;
  receiptByUid: Scalars['String']['output'];
  receiptDate: Scalars['DateTime']['output'];
  receiptType: Scalars['String']['output'];
  singlesReceived?: Maybe<Scalars['Int']['output']>;
  stockLot?: Maybe<StockLotType>;
  stockLotUid?: Maybe<Scalars['String']['output']>;
  supplier?: Maybe<SupplierType>;
  supplierUid?: Maybe<Scalars['String']['output']>;
  totalPrice: Scalars['Float']['output'];
  uid: Scalars['String']['output'];
  unit?: Maybe<StockUnitType>;
  unitPrice: Scalars['Float']['output'];
  unitUid: Scalars['String']['output'];
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

export type StockTransactionType = {
  __typename?: 'StockTransactionType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  dateIssued?: Maybe<Scalars['DateTime']['output']>;
  department?: Maybe<DepartmentType>;
  departmentUid?: Maybe<Scalars['String']['output']>;
  issued?: Maybe<Scalars['Int']['output']>;
  issuedTo?: Maybe<UserType>;
  issuedToUid?: Maybe<Scalars['String']['output']>;
  product?: Maybe<StockItemVariantType>;
  productUid?: Maybe<Scalars['String']['output']>;
  transactionBy?: Maybe<UserType>;
  transactionByUid?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type StockUnitInputType = {
  name: Scalars['String']['input'];
};

export type StockUnitResponse = OperationError | StockUnitType;

export type StockUnitType = {
  __typename?: 'StockUnitType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description: Scalars['String']['output'];
  name: Scalars['String']['output'];
  synonyms: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
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
  createdAt?: Maybe<Scalars['String']['output']>;
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
  updatedAt?: Maybe<Scalars['String']['output']>;
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
  children?: Maybe<Array<StorageSectionType>>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  storeRoom?: Maybe<StoreRoomType>;
  storeRoomUid: Scalars['String']['output'];
  tag: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
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
  children?: Maybe<Array<StorageContainerType>>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  storageLocation?: Maybe<StorageLocationType>;
  storageLocationUid: Scalars['String']['output'];
  tag: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
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
  children?: Maybe<Array<StorageLocationType>>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  tag: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
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
  latestActivity: ActivityStreamType;
  streamAll: ActivityStreamType;
  streamProcesses: ActivityProcessType;
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
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type TestBillCursorPage = {
  __typename?: 'TestBillCursorPage';
  edges?: Maybe<Array<TestBillEdge>>;
  items?: Maybe<Array<TestBillType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type TestBillEdge = {
  __typename?: 'TestBillEdge';
  cursor: Scalars['String']['output'];
  node: TestBillType;
};

export type TestBillInvoiceType = {
  __typename?: 'TestBillInvoiceType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  jsonContent?: Maybe<Scalars['JSONScalar']['output']>;
  pdfContent?: Maybe<Scalars['BytesScalar']['output']>;
  testBill: TestBillType;
  testBillUid: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type TestBillTransactionResponse = OperationError | TestBillTransactionType;

export type TestBillTransactionType = {
  __typename?: 'TestBillTransactionType';
  actionMessage: Scalars['String']['output'];
  actionRequired: Scalars['Boolean']['output'];
  amount: Scalars['Float']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  isSuccess: Scalars['Boolean']['output'];
  kind: Scalars['String']['output'];
  message: Scalars['String']['output'];
  notes: Scalars['String']['output'];
  processed: Scalars['Boolean']['output'];
  testBill: TestBillType;
  testBillUid: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type TestBillType = {
  __typename?: 'TestBillType';
  billId: Scalars['String']['output'];
  client: ClientType;
  clientUid: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  jsonContent?: Maybe<Scalars['JSONScalar']['output']>;
  orders?: Maybe<Array<AnalysisRequestType>>;
  partial: Scalars['Boolean']['output'];
  patient: PatientType;
  patientUid: Scalars['String']['output'];
  toConfirm: Scalars['Boolean']['output'];
  totalCharged: Scalars['Float']['output'];
  totalPaid: Scalars['Float']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
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
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
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
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserPreferenceType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  departments?: Maybe<Array<DepartmentType>>;
  expandedMenu?: Maybe<Scalars['Boolean']['output']>;
  theme?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserPreferenceType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type UserResponse = OperationError | UserType;

export type UserType = {
  __typename?: 'UserType';
  avatar?: Maybe<Scalars['String']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  businessPhone?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  defaultRoute?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  groups?: Maybe<Array<GroupType>>;
  isActive: Scalars['Boolean']['output'];
  isBlocked: Scalars['Boolean']['output'];
  isSuperuser: Scalars['Boolean']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  loginRetry: Scalars['Int']['output'];
  mobilePhone?: Maybe<Scalars['String']['output']>;
  preference?: Maybe<UserPreferenceType>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  userName: Scalars['String']['output'];
};

export type VoucherCodeInput = {
  code: Scalars['String']['input'];
  isActive: Scalars['Boolean']['input'];
  usageLimit: Scalars['Int']['input'];
  voucherUid: Scalars['String']['input'];
};

export type VoucherCodeResponse = OperationError | VoucherCodeType;

export type VoucherCodeType = {
  __typename?: 'VoucherCodeType';
  code: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  uid: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  usageLimit: Scalars['Int']['output'];
  used: Scalars['Int']['output'];
  voucher: VoucherType;
  voucherUid: Scalars['String']['output'];
};

export type VoucherCustomerType = {
  __typename?: 'VoucherCustomerType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  patient: PatientType;
  patientUid: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  voucherCode: VoucherCodeType;
  voucherCodeUid: Scalars['String']['output'];
};

export type VoucherInput = {
  endDate: Scalars['DateTime']['input'];
  name: Scalars['String']['input'];
  oncePerCustomer: Scalars['Boolean']['input'];
  oncePerOrder: Scalars['Boolean']['input'];
  startDate: Scalars['DateTime']['input'];
  usageLimit: Scalars['Int']['input'];
};

export type VoucherResponse = OperationError | VoucherType;

export type VoucherType = {
  __typename?: 'VoucherType';
  codes?: Maybe<Array<VoucherCodeType>>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  endDate: Scalars['String']['output'];
  name: Scalars['String']['output'];
  oncePerCustomer: Scalars['Boolean']['output'];
  oncePerOrder: Scalars['Boolean']['output'];
  startDate: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  usageLimit: Scalars['Int']['output'];
  used: Scalars['Int']['output'];
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
  createdAt?: Maybe<Scalars['String']['output']>;
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
  updatedAt?: Maybe<Scalars['String']['output']>;
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
  createdAt?: Maybe<Scalars['String']['output']>;
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
  updatedAt?: Maybe<Scalars['String']['output']>;
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

export type WithTypename<T extends { __typename?: any }> = Partial<T> & { __typename: NonNullable<T['__typename']> };

export type GraphCacheKeysConfig = {
  ActivityFeedType?: (data: WithTypename<ActivityFeedType>) => null | string,
  ActivityProcessType?: (data: WithTypename<ActivityProcessType>) => null | string,
  ActivityStreamType?: (data: WithTypename<ActivityStreamType>) => null | string,
  AnalysisCategoryType?: (data: WithTypename<AnalysisCategoryType>) => null | string,
  AnalysisCorrectionFactorType?: (data: WithTypename<AnalysisCorrectionFactorType>) => null | string,
  AnalysisCursorPage?: (data: WithTypename<AnalysisCursorPage>) => null | string,
  AnalysisDetectionLimitType?: (data: WithTypename<AnalysisDetectionLimitType>) => null | string,
  AnalysisDiscountType?: (data: WithTypename<AnalysisDiscountType>) => null | string,
  AnalysisEdge?: (data: WithTypename<AnalysisEdge>) => null | string,
  AnalysisInterimType?: (data: WithTypename<AnalysisInterimType>) => null | string,
  AnalysisMappingType?: (data: WithTypename<AnalysisMappingType>) => null | string,
  AnalysisPriceType?: (data: WithTypename<AnalysisPriceType>) => null | string,
  AnalysisRequestCursorPage?: (data: WithTypename<AnalysisRequestCursorPage>) => null | string,
  AnalysisRequestEdge?: (data: WithTypename<AnalysisRequestEdge>) => null | string,
  AnalysisRequestType?: (data: WithTypename<AnalysisRequestType>) => null | string,
  AnalysisRequestWithSamples?: (data: WithTypename<AnalysisRequestWithSamples>) => null | string,
  AnalysisResultCursorPage?: (data: WithTypename<AnalysisResultCursorPage>) => null | string,
  AnalysisResultEdge?: (data: WithTypename<AnalysisResultEdge>) => null | string,
  AnalysisResultType?: (data: WithTypename<AnalysisResultType>) => null | string,
  AnalysisSpecificationType?: (data: WithTypename<AnalysisSpecificationType>) => null | string,
  AnalysisTemplateType?: (data: WithTypename<AnalysisTemplateType>) => null | string,
  AnalysisType?: (data: WithTypename<AnalysisType>) => null | string,
  AnalysisUncertaintyType?: (data: WithTypename<AnalysisUncertaintyType>) => null | string,
  AnalysisWithProfiles?: (data: WithTypename<AnalysisWithProfiles>) => null | string,
  AuditLogType?: (data: WithTypename<AuditLogType>) => null | string,
  AuthenticatedData?: (data: WithTypename<AuthenticatedData>) => null | string,
  CalibrationCertificateType?: (data: WithTypename<CalibrationCertificateType>) => null | string,
  ClientContactType?: (data: WithTypename<ClientContactType>) => null | string,
  ClientCursorPage?: (data: WithTypename<ClientCursorPage>) => null | string,
  ClientEdge?: (data: WithTypename<ClientEdge>) => null | string,
  ClientType?: (data: WithTypename<ClientType>) => null | string,
  CodingStandardType?: (data: WithTypename<CodingStandardType>) => null | string,
  CountryType?: (data: WithTypename<CountryType>) => null | string,
  CreateQCSetData?: (data: WithTypename<CreateQcSetData>) => null | string,
  DeletedItem?: (data: WithTypename<DeletedItem>) => null | string,
  DepartmentType?: (data: WithTypename<DepartmentType>) => null | string,
  DistrictCursorPage?: (data: WithTypename<DistrictCursorPage>) => null | string,
  DistrictEdge?: (data: WithTypename<DistrictEdge>) => null | string,
  DistrictType?: (data: WithTypename<DistrictType>) => null | string,
  GroupCount?: (data: WithTypename<GroupCount>) => null | string,
  GroupData?: (data: WithTypename<GroupData>) => null | string,
  GroupType?: (data: WithTypename<GroupType>) => null | string,
  GroupedCounts?: (data: WithTypename<GroupedCounts>) => null | string,
  GroupedData?: (data: WithTypename<GroupedData>) => null | string,
  HazardType?: (data: WithTypename<HazardType>) => null | string,
  IdentificationType?: (data: WithTypename<IdentificationType>) => null | string,
  InstrumentCalibrationType?: (data: WithTypename<InstrumentCalibrationType>) => null | string,
  InstrumentCompetenceType?: (data: WithTypename<InstrumentCompetenceType>) => null | string,
  InstrumentCursorPage?: (data: WithTypename<InstrumentCursorPage>) => null | string,
  InstrumentEdge?: (data: WithTypename<InstrumentEdge>) => null | string,
  InstrumentType?: (data: WithTypename<InstrumentType>) => null | string,
  InstrumentTypeCursorPage?: (data: WithTypename<InstrumentTypeCursorPage>) => null | string,
  InstrumentTypeEdge?: (data: WithTypename<InstrumentTypeEdge>) => null | string,
  InstrumentTypeType?: (data: WithTypename<InstrumentTypeType>) => null | string,
  LaboratoryInstrumentCursorPage?: (data: WithTypename<LaboratoryInstrumentCursorPage>) => null | string,
  LaboratoryInstrumentEdge?: (data: WithTypename<LaboratoryInstrumentEdge>) => null | string,
  LaboratoryInstrumentType?: (data: WithTypename<LaboratoryInstrumentType>) => null | string,
  LaboratorySettingType?: (data: WithTypename<LaboratorySettingType>) => null | string,
  LaboratoryType?: (data: WithTypename<LaboratoryType>) => null | string,
  LaggardCounts?: (data: WithTypename<LaggardCounts>) => null | string,
  LaggardData?: (data: WithTypename<LaggardData>) => null | string,
  LaggardStatistics?: (data: WithTypename<LaggardStatistics>) => null | string,
  ManufacturerType?: (data: WithTypename<ManufacturerType>) => null | string,
  MessageThreadType?: (data: WithTypename<MessageThreadType>) => null | string,
  MessageType?: (data: WithTypename<MessageType>) => null | string,
  MessagesType?: (data: WithTypename<MessagesType>) => null | string,
  MethodCursorPage?: (data: WithTypename<MethodCursorPage>) => null | string,
  MethodEdge?: (data: WithTypename<MethodEdge>) => null | string,
  MethodType?: (data: WithTypename<MethodType>) => null | string,
  Nothing?: (data: WithTypename<Nothing>) => null | string,
  NoticeType?: (data: WithTypename<NoticeType>) => null | string,
  NotificationType?: (data: WithTypename<NotificationType>) => null | string,
  OperationError?: (data: WithTypename<OperationError>) => null | string,
  OperationSuccess?: (data: WithTypename<OperationSuccess>) => null | string,
  PageInfo?: (data: WithTypename<PageInfo>) => null | string,
  PasswordResetValidityType?: (data: WithTypename<PasswordResetValidityType>) => null | string,
  PatientCursorPage?: (data: WithTypename<PatientCursorPage>) => null | string,
  PatientEdge?: (data: WithTypename<PatientEdge>) => null | string,
  PatientIdentificationType?: (data: WithTypename<PatientIdentificationType>) => null | string,
  PatientType?: (data: WithTypename<PatientType>) => null | string,
  PermissionType?: (data: WithTypename<PermissionType>) => null | string,
  ProcessCounts?: (data: WithTypename<ProcessCounts>) => null | string,
  ProcessData?: (data: WithTypename<ProcessData>) => null | string,
  ProcessStatistics?: (data: WithTypename<ProcessStatistics>) => null | string,
  ProfileDiscountType?: (data: WithTypename<ProfileDiscountType>) => null | string,
  ProfileMappingType?: (data: WithTypename<ProfileMappingType>) => null | string,
  ProfilePriceType?: (data: WithTypename<ProfilePriceType>) => null | string,
  ProfileType?: (data: WithTypename<ProfileType>) => null | string,
  ProvinceCursorPage?: (data: WithTypename<ProvinceCursorPage>) => null | string,
  ProvinceEdge?: (data: WithTypename<ProvinceEdge>) => null | string,
  ProvinceType?: (data: WithTypename<ProvinceType>) => null | string,
  QCLevelType?: (data: WithTypename<QcLevelType>) => null | string,
  QCSetCursorPage?: (data: WithTypename<QcSetCursorPage>) => null | string,
  QCSetEdge?: (data: WithTypename<QcSetEdge>) => null | string,
  QCSetType?: (data: WithTypename<QcSetType>) => null | string,
  QCSetWithSamples?: (data: WithTypename<QcSetWithSamples>) => null | string,
  QCTemplateType?: (data: WithTypename<QcTemplateType>) => null | string,
  ReferralLaboratoryType?: (data: WithTypename<ReferralLaboratoryType>) => null | string,
  ReflexActionType?: (data: WithTypename<ReflexActionType>) => null | string,
  ReflexBrainActionType?: (data: WithTypename<ReflexBrainActionType>) => null | string,
  ReflexBrainAdditionType?: (data: WithTypename<ReflexBrainAdditionType>) => null | string,
  ReflexBrainConditionCriteriaType?: (data: WithTypename<ReflexBrainConditionCriteriaType>) => null | string,
  ReflexBrainConditionType?: (data: WithTypename<ReflexBrainConditionType>) => null | string,
  ReflexBrainFinalType?: (data: WithTypename<ReflexBrainFinalType>) => null | string,
  ReflexBrainType?: (data: WithTypename<ReflexBrainType>) => null | string,
  ReflexRuleCursorPage?: (data: WithTypename<ReflexRuleCursorPage>) => null | string,
  ReflexRuleEdge?: (data: WithTypename<ReflexRuleEdge>) => null | string,
  ReflexRuleType?: (data: WithTypename<ReflexRuleType>) => null | string,
  RejectionReasonType?: (data: WithTypename<RejectionReasonType>) => null | string,
  ReportImpressType?: (data: WithTypename<ReportImpressType>) => null | string,
  ReportMetaType?: (data: WithTypename<ReportMetaType>) => null | string,
  ResultListingType?: (data: WithTypename<ResultListingType>) => null | string,
  ResultMutationType?: (data: WithTypename<ResultMutationType>) => null | string,
  ResultOptionType?: (data: WithTypename<ResultOptionType>) => null | string,
  ResultedSampleListingType?: (data: WithTypename<ResultedSampleListingType>) => null | string,
  SampleCursorPage?: (data: WithTypename<SampleCursorPage>) => null | string,
  SampleEdge?: (data: WithTypename<SampleEdge>) => null | string,
  SampleListingType?: (data: WithTypename<SampleListingType>) => null | string,
  SampleType?: (data: WithTypename<SampleType>) => null | string,
  SampleTypeMappingType?: (data: WithTypename<SampleTypeMappingType>) => null | string,
  SampleTypeTyp?: (data: WithTypename<SampleTypeTyp>) => null | string,
  SamplesWithResults?: (data: WithTypename<SamplesWithResults>) => null | string,
  ShipmentCursorPage?: (data: WithTypename<ShipmentCursorPage>) => null | string,
  ShipmentEdge?: (data: WithTypename<ShipmentEdge>) => null | string,
  ShipmentListingType?: (data: WithTypename<ShipmentListingType>) => null | string,
  ShipmentType?: (data: WithTypename<ShipmentType>) => null | string,
  ShippedSampleType?: (data: WithTypename<ShippedSampleType>) => null | string,
  StockAdjustmentCursorPage?: (data: WithTypename<StockAdjustmentCursorPage>) => null | string,
  StockAdjustmentEdge?: (data: WithTypename<StockAdjustmentEdge>) => null | string,
  StockAdjustmentType?: (data: WithTypename<StockAdjustmentType>) => null | string,
  StockCategoryType?: (data: WithTypename<StockCategoryType>) => null | string,
  StockItemCursorPage?: (data: WithTypename<StockItemCursorPage>) => null | string,
  StockItemEdge?: (data: WithTypename<StockItemEdge>) => null | string,
  StockItemType?: (data: WithTypename<StockItemType>) => null | string,
  StockItemVariantCursorPage?: (data: WithTypename<StockItemVariantCursorPage>) => null | string,
  StockItemVariantEdge?: (data: WithTypename<StockItemVariantEdge>) => null | string,
  StockItemVariantType?: (data: WithTypename<StockItemVariantType>) => null | string,
  StockLotType?: (data: WithTypename<StockLotType>) => null | string,
  StockOrderCursorPage?: (data: WithTypename<StockOrderCursorPage>) => null | string,
  StockOrderEdge?: (data: WithTypename<StockOrderEdge>) => null | string,
  StockOrderLineType?: (data: WithTypename<StockOrderLineType>) => null | string,
  StockOrderProductType?: (data: WithTypename<StockOrderProductType>) => null | string,
  StockOrderType?: (data: WithTypename<StockOrderType>) => null | string,
  StockPackagingType?: (data: WithTypename<StockPackagingType>) => null | string,
  StockProductInventoryType?: (data: WithTypename<StockProductInventoryType>) => null | string,
  StockReceiptType?: (data: WithTypename<StockReceiptType>) => null | string,
  StockTransactionCursorPage?: (data: WithTypename<StockTransactionCursorPage>) => null | string,
  StockTransactionEdge?: (data: WithTypename<StockTransactionEdge>) => null | string,
  StockTransactionType?: (data: WithTypename<StockTransactionType>) => null | string,
  StockUnitType?: (data: WithTypename<StockUnitType>) => null | string,
  StorageContainerType?: (data: WithTypename<StorageContainerType>) => null | string,
  StorageLocationType?: (data: WithTypename<StorageLocationType>) => null | string,
  StorageSectionType?: (data: WithTypename<StorageSectionType>) => null | string,
  StoreRoomType?: (data: WithTypename<StoreRoomType>) => null | string,
  StoredSamplesType?: (data: WithTypename<StoredSamplesType>) => null | string,
  SupplierType?: (data: WithTypename<SupplierType>) => null | string,
  TestBillCursorPage?: (data: WithTypename<TestBillCursorPage>) => null | string,
  TestBillEdge?: (data: WithTypename<TestBillEdge>) => null | string,
  TestBillInvoiceType?: (data: WithTypename<TestBillInvoiceType>) => null | string,
  TestBillTransactionType?: (data: WithTypename<TestBillTransactionType>) => null | string,
  TestBillType?: (data: WithTypename<TestBillType>) => null | string,
  UnitType?: (data: WithTypename<UnitType>) => null | string,
  UnknownObjectType?: (data: WithTypename<UnknownObjectType>) => null | string,
  UpdatedGroupPerms?: (data: WithTypename<UpdatedGroupPerms>) => null | string,
  UserCursorPage?: (data: WithTypename<UserCursorPage>) => null | string,
  UserEdge?: (data: WithTypename<UserEdge>) => null | string,
  UserPreferenceType?: (data: WithTypename<UserPreferenceType>) => null | string,
  UserType?: (data: WithTypename<UserType>) => null | string,
  VoucherCodeType?: (data: WithTypename<VoucherCodeType>) => null | string,
  VoucherCustomerType?: (data: WithTypename<VoucherCustomerType>) => null | string,
  VoucherType?: (data: WithTypename<VoucherType>) => null | string,
  WorkSheetCursorPage?: (data: WithTypename<WorkSheetCursorPage>) => null | string,
  WorkSheetEdge?: (data: WithTypename<WorkSheetEdge>) => null | string,
  WorkSheetTemplateType?: (data: WithTypename<WorkSheetTemplateType>) => null | string,
  WorkSheetType?: (data: WithTypename<WorkSheetType>) => null | string,
  WorksheetListingType?: (data: WithTypename<WorksheetListingType>) => null | string
}

export type GraphCacheResolvers = {
  Query?: {
    analysisAll?: GraphCacheResolver<WithTypename<Query>, QueryAnalysisAllArgs, WithTypename<AnalysisCursorPage> | string>,
    analysisByUid?: GraphCacheResolver<WithTypename<Query>, QueryAnalysisByUidArgs, WithTypename<AnalysisType> | string>,
    analysisCategoryAll?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, Array<WithTypename<AnalysisCategoryType> | string>>,
    analysisCategoryByUid?: GraphCacheResolver<WithTypename<Query>, QueryAnalysisCategoryByUidArgs, WithTypename<AnalysisCategoryType> | string>,
    analysisCorrectionFactorAll?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, Array<WithTypename<AnalysisCorrectionFactorType> | string>>,
    analysisCorrectionFactorByUid?: GraphCacheResolver<WithTypename<Query>, QueryAnalysisCorrectionFactorByUidArgs, WithTypename<AnalysisCorrectionFactorType> | string>,
    analysisDetectionLimitAll?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, Array<WithTypename<AnalysisDetectionLimitType> | string>>,
    analysisDetectionLimitByUid?: GraphCacheResolver<WithTypename<Query>, QueryAnalysisDetectionLimitByUidArgs, WithTypename<AnalysisDetectionLimitType> | string>,
    analysisInterimAll?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, Array<WithTypename<AnalysisInterimType> | string>>,
    analysisInterimByUid?: GraphCacheResolver<WithTypename<Query>, QueryAnalysisInterimByUidArgs, WithTypename<AnalysisInterimType> | string>,
    analysisMappingsByAnalysis?: GraphCacheResolver<WithTypename<Query>, QueryAnalysisMappingsByAnalysisArgs, Array<WithTypename<AnalysisMappingType> | string>>,
    analysisProcessPerformance?: GraphCacheResolver<WithTypename<Query>, QueryAnalysisProcessPerformanceArgs, WithTypename<ProcessStatistics> | string>,
    analysisRequestAll?: GraphCacheResolver<WithTypename<Query>, QueryAnalysisRequestAllArgs, WithTypename<AnalysisRequestCursorPage> | string>,
    analysisRequestByUid?: GraphCacheResolver<WithTypename<Query>, QueryAnalysisRequestByUidArgs, WithTypename<AnalysisRequestWithSamples> | string>,
    analysisRequestsByClientUid?: GraphCacheResolver<WithTypename<Query>, QueryAnalysisRequestsByClientUidArgs, Array<WithTypename<AnalysisRequestWithSamples> | string>>,
    analysisRequestsByPatientUid?: GraphCacheResolver<WithTypename<Query>, QueryAnalysisRequestsByPatientUidArgs, Array<WithTypename<AnalysisRequestWithSamples> | string>>,
    analysisResultBySampleUid?: GraphCacheResolver<WithTypename<Query>, QueryAnalysisResultBySampleUidArgs, Array<WithTypename<AnalysisResultType> | string>>,
    analysisResultByUid?: GraphCacheResolver<WithTypename<Query>, QueryAnalysisResultByUidArgs, WithTypename<AnalysisResultType> | string>,
    analysisResultsForWsAssign?: GraphCacheResolver<WithTypename<Query>, QueryAnalysisResultsForWsAssignArgs, WithTypename<AnalysisResultCursorPage> | string>,
    analysisSpecificationAll?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, Array<WithTypename<AnalysisSpecificationType> | string>>,
    analysisSpecificationUid?: GraphCacheResolver<WithTypename<Query>, QueryAnalysisSpecificationUidArgs, WithTypename<AnalysisSpecificationType> | string>,
    analysisTemplateAll?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, Array<WithTypename<AnalysisTemplateType> | string>>,
    analysisTemplateByUid?: GraphCacheResolver<WithTypename<Query>, QueryAnalysisTemplateByUidArgs, WithTypename<AnalysisTemplateType> | string>,
    analysisUncertaintyAll?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, Array<WithTypename<AnalysisUncertaintyType> | string>>,
    analysisUncertaintyByUid?: GraphCacheResolver<WithTypename<Query>, QueryAnalysisUncertaintyByUidArgs, WithTypename<AnalysisUncertaintyType> | string>,
    analysisWithoutProfile?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, Array<WithTypename<AnalysisType> | string>>,
    auditLogsFilter?: GraphCacheResolver<WithTypename<Query>, QueryAuditLogsFilterArgs, Array<WithTypename<AuditLogType> | string>>,
    barcodeSamples?: GraphCacheResolver<WithTypename<Query>, QueryBarcodeSamplesArgs, Array<Scalars['BytesScalar'] | string>>,
    billByUid?: GraphCacheResolver<WithTypename<Query>, QueryBillByUidArgs, WithTypename<TestBillType> | string>,
    billInvoice?: GraphCacheResolver<WithTypename<Query>, QueryBillInvoiceArgs, WithTypename<TestBillInvoiceType> | string>,
    billInvoiceCreate?: GraphCacheResolver<WithTypename<Query>, QueryBillInvoiceCreateArgs, Scalars['BytesScalar'] | string>,
    billInvoices?: GraphCacheResolver<WithTypename<Query>, QueryBillInvoicesArgs, Array<WithTypename<TestBillInvoiceType> | string>>,
    billTransactions?: GraphCacheResolver<WithTypename<Query>, QueryBillTransactionsArgs, Array<WithTypename<TestBillTransactionType> | string>>,
    bills?: GraphCacheResolver<WithTypename<Query>, QueryBillsArgs, WithTypename<TestBillCursorPage> | string>,
    billsForClient?: GraphCacheResolver<WithTypename<Query>, QueryBillsForClientArgs, Array<WithTypename<TestBillType> | string>>,
    billsForPatient?: GraphCacheResolver<WithTypename<Query>, QueryBillsForPatientArgs, Array<WithTypename<TestBillType> | string>>,
    clientAll?: GraphCacheResolver<WithTypename<Query>, QueryClientAllArgs, WithTypename<ClientCursorPage> | string>,
    clientByCode?: GraphCacheResolver<WithTypename<Query>, QueryClientByCodeArgs, WithTypename<ClientType> | string>,
    clientByUid?: GraphCacheResolver<WithTypename<Query>, QueryClientByUidArgs, WithTypename<ClientType> | string>,
    clientContactAll?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, Array<WithTypename<ClientContactType> | string>>,
    clientContactByClientUid?: GraphCacheResolver<WithTypename<Query>, QueryClientContactByClientUidArgs, Array<WithTypename<ClientContactType> | string>>,
    clientContactUid?: GraphCacheResolver<WithTypename<Query>, QueryClientContactUidArgs, WithTypename<ClientContactType> | string>,
    clientSearch?: GraphCacheResolver<WithTypename<Query>, QueryClientSearchArgs, Array<WithTypename<ClientType> | string>>,
    clientsByName?: GraphCacheResolver<WithTypename<Query>, QueryClientsByNameArgs, Array<WithTypename<ClientType> | string>>,
    codingStandardAll?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, Array<WithTypename<CodingStandardType> | string>>,
    countAnalyteGroupByInstrument?: GraphCacheResolver<WithTypename<Query>, QueryCountAnalyteGroupByInstrumentArgs, WithTypename<GroupedCounts> | string>,
    countAnalyteGroupByStatus?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, WithTypename<GroupedCounts> | string>,
    countExtrasGroupByStatus?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, WithTypename<GroupedCounts> | string>,
    countSampleGroupByAction?: GraphCacheResolver<WithTypename<Query>, QueryCountSampleGroupByActionArgs, WithTypename<GroupedData> | string>,
    countSampleGroupByStatus?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, WithTypename<GroupedCounts> | string>,
    countWorksheetGroupByStatus?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, WithTypename<GroupedCounts> | string>,
    countryAll?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, Array<WithTypename<CountryType> | string>>,
    countryByUid?: GraphCacheResolver<WithTypename<Query>, QueryCountryByUidArgs, WithTypename<CountryType> | string>,
    departmentAll?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, Array<WithTypename<DepartmentType> | string>>,
    departmentByUid?: GraphCacheResolver<WithTypename<Query>, QueryDepartmentByUidArgs, WithTypename<DepartmentType> | string>,
    discountForAnalysis?: GraphCacheResolver<WithTypename<Query>, QueryDiscountForAnalysisArgs, WithTypename<AnalysisDiscountType> | string>,
    discountForProfile?: GraphCacheResolver<WithTypename<Query>, QueryDiscountForProfileArgs, WithTypename<ProfileDiscountType> | string>,
    districtAll?: GraphCacheResolver<WithTypename<Query>, QueryDistrictAllArgs, WithTypename<DistrictCursorPage> | string>,
    districtByUid?: GraphCacheResolver<WithTypename<Query>, QueryDistrictByUidArgs, WithTypename<DistrictType> | string>,
    districtsByProvinceUid?: GraphCacheResolver<WithTypename<Query>, QueryDistrictsByProvinceUidArgs, Array<WithTypename<DistrictType> | string>>,
    groupAll?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, Array<WithTypename<GroupType> | string>>,
    groupByUid?: GraphCacheResolver<WithTypename<Query>, QueryGroupByUidArgs, WithTypename<GroupType> | string>,
    hazardAll?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, Array<WithTypename<HazardType> | string>>,
    hazardByUid?: GraphCacheResolver<WithTypename<Query>, QueryHazardByUidArgs, WithTypename<HazardType> | string>,
    identificationAll?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, Array<WithTypename<IdentificationType> | string>>,
    identificationByUid?: GraphCacheResolver<WithTypename<Query>, QueryIdentificationByUidArgs, WithTypename<IdentificationType> | string>,
    impressReportDownload?: GraphCacheResolver<WithTypename<Query>, QueryImpressReportDownloadArgs, Scalars['BytesScalar'] | string>,
    impressReportsDownload?: GraphCacheResolver<WithTypename<Query>, QueryImpressReportsDownloadArgs, Scalars['BytesScalar'] | string>,
    impressReportsMeta?: GraphCacheResolver<WithTypename<Query>, QueryImpressReportsMetaArgs, Array<WithTypename<ReportImpressType> | string>>,
    instrumentAll?: GraphCacheResolver<WithTypename<Query>, QueryInstrumentAllArgs, WithTypename<InstrumentCursorPage> | string>,
    instrumentByUid?: GraphCacheResolver<WithTypename<Query>, QueryInstrumentByUidArgs, WithTypename<InstrumentType> | string>,
    instrumentTypeAll?: GraphCacheResolver<WithTypename<Query>, QueryInstrumentTypeAllArgs, WithTypename<InstrumentTypeCursorPage> | string>,
    instrumentTypeByUid?: GraphCacheResolver<WithTypename<Query>, QueryInstrumentTypeByUidArgs, WithTypename<InstrumentTypeType> | string>,
    laboratory?: GraphCacheResolver<WithTypename<Query>, QueryLaboratoryArgs, WithTypename<LaboratoryType> | string>,
    laboratoryInstrumentAll?: GraphCacheResolver<WithTypename<Query>, QueryLaboratoryInstrumentAllArgs, WithTypename<LaboratoryInstrumentCursorPage> | string>,
    laboratoryInstrumentByUid?: GraphCacheResolver<WithTypename<Query>, QueryLaboratoryInstrumentByUidArgs, WithTypename<LaboratoryInstrumentType> | string>,
    laboratorySetting?: GraphCacheResolver<WithTypename<Query>, QueryLaboratorySettingArgs, WithTypename<LaboratorySettingType> | string>,
    manifestReportDownload?: GraphCacheResolver<WithTypename<Query>, QueryManifestReportDownloadArgs, Scalars['BytesScalar'] | string>,
    manufacturerAll?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, Array<WithTypename<ManufacturerType> | string>>,
    manufacturerByUid?: GraphCacheResolver<WithTypename<Query>, QueryManufacturerByUidArgs, WithTypename<ManufacturerType> | string>,
    methodAll?: GraphCacheResolver<WithTypename<Query>, QueryMethodAllArgs, WithTypename<MethodCursorPage> | string>,
    methodByUid?: GraphCacheResolver<WithTypename<Query>, QueryMethodByUidArgs, WithTypename<MethodType> | string>,
    noticeByUid?: GraphCacheResolver<WithTypename<Query>, QueryNoticeByUidArgs, WithTypename<NoticeType> | string>,
    noticeFilter?: GraphCacheResolver<WithTypename<Query>, QueryNoticeFilterArgs, Array<WithTypename<NoticeType> | string>>,
    noticesByCreator?: GraphCacheResolver<WithTypename<Query>, QueryNoticesByCreatorArgs, Array<WithTypename<NoticeType> | string>>,
    notificationByUid?: GraphCacheResolver<WithTypename<Query>, QueryNotificationByUidArgs, WithTypename<NotificationType> | string>,
    notificationFilter?: GraphCacheResolver<WithTypename<Query>, QueryNotificationFilterArgs, Array<WithTypename<NotificationType> | string>>,
    patientAll?: GraphCacheResolver<WithTypename<Query>, QueryPatientAllArgs, WithTypename<PatientCursorPage> | string>,
    patientByPatientId?: GraphCacheResolver<WithTypename<Query>, QueryPatientByPatientIdArgs, WithTypename<PatientType> | string>,
    patientByUid?: GraphCacheResolver<WithTypename<Query>, QueryPatientByUidArgs, WithTypename<PatientType> | string>,
    patientSearch?: GraphCacheResolver<WithTypename<Query>, QueryPatientSearchArgs, Array<WithTypename<PatientType> | string>>,
    permissionAll?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, Array<WithTypename<PermissionType> | string>>,
    permissionByUid?: GraphCacheResolver<WithTypename<Query>, QueryPermissionByUidArgs, WithTypename<PermissionType> | string>,
    priceForAnalysis?: GraphCacheResolver<WithTypename<Query>, QueryPriceForAnalysisArgs, WithTypename<AnalysisPriceType> | string>,
    priceForProfile?: GraphCacheResolver<WithTypename<Query>, QueryPriceForProfileArgs, WithTypename<ProfilePriceType> | string>,
    profileAll?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, Array<WithTypename<ProfileType> | string>>,
    profileByUid?: GraphCacheResolver<WithTypename<Query>, QueryProfileByUidArgs, WithTypename<ProfileType> | string>,
    profileMappingsByProfile?: GraphCacheResolver<WithTypename<Query>, QueryProfileMappingsByProfileArgs, Array<WithTypename<ProfileMappingType> | string>>,
    provinceAll?: GraphCacheResolver<WithTypename<Query>, QueryProvinceAllArgs, WithTypename<ProvinceCursorPage> | string>,
    provinceByUid?: GraphCacheResolver<WithTypename<Query>, QueryProvinceByUidArgs, WithTypename<ProvinceType> | string>,
    provincesByCountryUid?: GraphCacheResolver<WithTypename<Query>, QueryProvincesByCountryUidArgs, Array<WithTypename<ProvinceType> | string>>,
    qcChartData?: GraphCacheResolver<WithTypename<Query>, QueryQcChartDataArgs, Array<WithTypename<AnalysisResultType> | string>>,
    qcLevelAll?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, Array<WithTypename<QcLevelType> | string>>,
    qcLevelByUid?: GraphCacheResolver<WithTypename<Query>, QueryQcLevelByUidArgs, WithTypename<QcLevelType> | string>,
    qcSetAll?: GraphCacheResolver<WithTypename<Query>, QueryQcSetAllArgs, WithTypename<QcSetCursorPage> | string>,
    qcSetByUid?: GraphCacheResolver<WithTypename<Query>, QueryQcSetByUidArgs, WithTypename<QcSetWithSamples> | string>,
    qcTemplateAll?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, Array<WithTypename<QcTemplateType> | string>>,
    qcTemplateByUid?: GraphCacheResolver<WithTypename<Query>, QueryQcTemplateByUidArgs, WithTypename<QcTemplateType> | string>,
    referralLaboratoryAll?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, Array<WithTypename<ReferralLaboratoryType> | string>>,
    referralLaboratoryByCode?: GraphCacheResolver<WithTypename<Query>, QueryReferralLaboratoryByCodeArgs, WithTypename<ReferralLaboratoryType> | string>,
    referralLaboratoryByUid?: GraphCacheResolver<WithTypename<Query>, QueryReferralLaboratoryByUidArgs, WithTypename<ReferralLaboratoryType> | string>,
    reflexRuleAll?: GraphCacheResolver<WithTypename<Query>, QueryReflexRuleAllArgs, WithTypename<ReflexRuleCursorPage> | string>,
    reflexRuleByUid?: GraphCacheResolver<WithTypename<Query>, QueryReflexRuleByUidArgs, WithTypename<ReflexRuleType> | string>,
    rejectionReasonByUid?: GraphCacheResolver<WithTypename<Query>, QueryRejectionReasonByUidArgs, WithTypename<RejectionReasonType> | string>,
    rejectionReasonsAll?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, Array<WithTypename<RejectionReasonType> | string>>,
    resultMutationByResultUid?: GraphCacheResolver<WithTypename<Query>, QueryResultMutationByResultUidArgs, WithTypename<ResultMutationType> | string>,
    resultOptionsByAnalysisUid?: GraphCacheResolver<WithTypename<Query>, QueryResultOptionsByAnalysisUidArgs, WithTypename<ResultOptionType> | string>,
    sampleAll?: GraphCacheResolver<WithTypename<Query>, QuerySampleAllArgs, WithTypename<SampleCursorPage> | string>,
    sampleByParentId?: GraphCacheResolver<WithTypename<Query>, QuerySampleByParentIdArgs, Array<WithTypename<SampleType> | string>>,
    sampleByUid?: GraphCacheResolver<WithTypename<Query>, QuerySampleByUidArgs, WithTypename<SampleType> | string>,
    sampleCount?: GraphCacheResolver<WithTypename<Query>, QuerySampleCountArgs, Scalars['Int'] | string>,
    sampleLaggards?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, WithTypename<LaggardStatistics> | string>,
    sampleProcessPerformance?: GraphCacheResolver<WithTypename<Query>, QuerySampleProcessPerformanceArgs, WithTypename<ProcessStatistics> | string>,
    sampleSearch?: GraphCacheResolver<WithTypename<Query>, QuerySampleSearchArgs, Array<WithTypename<SampleType> | string>>,
    sampleTypeAll?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, Array<WithTypename<SampleTypeTyp> | string>>,
    sampleTypeByUid?: GraphCacheResolver<WithTypename<Query>, QuerySampleTypeByUidArgs, WithTypename<SampleTypeTyp> | string>,
    sampleTypeMappingsBySampleType?: GraphCacheResolver<WithTypename<Query>, QuerySampleTypeMappingsBySampleTypeArgs, Array<WithTypename<SampleTypeMappingType> | string>>,
    samplesByStorageContainerUid?: GraphCacheResolver<WithTypename<Query>, QuerySamplesByStorageContainerUidArgs, Array<WithTypename<SampleType> | string>>,
    samplesByUids?: GraphCacheResolver<WithTypename<Query>, QuerySamplesByUidsArgs, Array<WithTypename<SamplesWithResults> | string>>,
    samplesForShipmentAssign?: GraphCacheResolver<WithTypename<Query>, QuerySamplesForShipmentAssignArgs, WithTypename<SampleCursorPage> | string>,
    shipmentAll?: GraphCacheResolver<WithTypename<Query>, QueryShipmentAllArgs, WithTypename<ShipmentCursorPage> | string>,
    shipmentById?: GraphCacheResolver<WithTypename<Query>, QueryShipmentByIdArgs, WithTypename<ShipmentType> | string>,
    shipmentByStatus?: GraphCacheResolver<WithTypename<Query>, QueryShipmentByStatusArgs, Array<WithTypename<ShipmentType> | string>>,
    shipmentByUid?: GraphCacheResolver<WithTypename<Query>, QueryShipmentByUidArgs, WithTypename<ShipmentType> | string>,
    stockAdjustmentAll?: GraphCacheResolver<WithTypename<Query>, QueryStockAdjustmentAllArgs, WithTypename<StockAdjustmentCursorPage> | string>,
    stockAdjustmentByUid?: GraphCacheResolver<WithTypename<Query>, QueryStockAdjustmentByUidArgs, WithTypename<StockAdjustmentType> | string>,
    stockCategoryAll?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, Array<WithTypename<StockCategoryType> | string>>,
    stockCategoryByUid?: GraphCacheResolver<WithTypename<Query>, QueryStockCategoryByUidArgs, WithTypename<StockCategoryType> | string>,
    stockItemAll?: GraphCacheResolver<WithTypename<Query>, QueryStockItemAllArgs, WithTypename<StockItemCursorPage> | string>,
    stockItemByUid?: GraphCacheResolver<WithTypename<Query>, QueryStockItemByUidArgs, WithTypename<StockItemType> | string>,
    stockItemVariants?: GraphCacheResolver<WithTypename<Query>, QueryStockItemVariantsArgs, Array<WithTypename<StockItemVariantType> | string>>,
    stockLots?: GraphCacheResolver<WithTypename<Query>, QueryStockLotsArgs, Array<WithTypename<StockLotType> | string>>,
    stockOrderAll?: GraphCacheResolver<WithTypename<Query>, QueryStockOrderAllArgs, WithTypename<StockOrderCursorPage> | string>,
    stockOrderByUid?: GraphCacheResolver<WithTypename<Query>, QueryStockOrderByUidArgs, WithTypename<StockOrderType> | string>,
    stockOrderProductAll?: GraphCacheResolver<WithTypename<Query>, QueryStockOrderProductAllArgs, Array<WithTypename<StockOrderProductType> | string>>,
    stockOrderProductByUid?: GraphCacheResolver<WithTypename<Query>, QueryStockOrderProductByUidArgs, WithTypename<StockOrderProductType> | string>,
    stockProductAll?: GraphCacheResolver<WithTypename<Query>, QueryStockProductAllArgs, WithTypename<StockItemVariantCursorPage> | string>,
    stockProductByUid?: GraphCacheResolver<WithTypename<Query>, QueryStockProductByUidArgs, WithTypename<StockItemVariantType> | string>,
    stockProductInventory?: GraphCacheResolver<WithTypename<Query>, QueryStockProductInventoryArgs, WithTypename<StockProductInventoryType> | string>,
    stockReceipt?: GraphCacheResolver<WithTypename<Query>, QueryStockReceiptArgs, Array<WithTypename<StockReceiptType> | string>>,
    stockUnitAll?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, Array<WithTypename<StockUnitType> | string>>,
    stockUnitByUid?: GraphCacheResolver<WithTypename<Query>, QueryStockUnitByUidArgs, WithTypename<StockUnitType> | string>,
    storageContainerByUid?: GraphCacheResolver<WithTypename<Query>, QueryStorageContainerByUidArgs, WithTypename<StorageContainerType> | string>,
    storageContainers?: GraphCacheResolver<WithTypename<Query>, QueryStorageContainersArgs, Array<WithTypename<StorageContainerType> | string>>,
    storageLocationByUid?: GraphCacheResolver<WithTypename<Query>, QueryStorageLocationByUidArgs, WithTypename<StorageLocationType> | string>,
    storageLocations?: GraphCacheResolver<WithTypename<Query>, QueryStorageLocationsArgs, Array<WithTypename<StorageLocationType> | string>>,
    storageSectionByUid?: GraphCacheResolver<WithTypename<Query>, QueryStorageSectionByUidArgs, WithTypename<StorageSectionType> | string>,
    storageSections?: GraphCacheResolver<WithTypename<Query>, QueryStorageSectionsArgs, Array<WithTypename<StorageSectionType> | string>>,
    storeRoomAll?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, Array<WithTypename<StoreRoomType> | string>>,
    storeRoomByUid?: GraphCacheResolver<WithTypename<Query>, QueryStoreRoomByUidArgs, WithTypename<StoreRoomType> | string>,
    supplierAll?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, Array<WithTypename<SupplierType> | string>>,
    supplierByUid?: GraphCacheResolver<WithTypename<Query>, QuerySupplierByUidArgs, WithTypename<SupplierType> | string>,
    threadByUid?: GraphCacheResolver<WithTypename<Query>, QueryThreadByUidArgs, WithTypename<MessageThreadType> | string>,
    threadsForUser?: GraphCacheResolver<WithTypename<Query>, QueryThreadsForUserArgs, Array<WithTypename<MessageThreadType> | string>>,
    unitAll?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, Array<WithTypename<UnitType> | string>>,
    unitByUid?: GraphCacheResolver<WithTypename<Query>, QueryUnitByUidArgs, WithTypename<UnitType> | string>,
    userAll?: GraphCacheResolver<WithTypename<Query>, QueryUserAllArgs, WithTypename<UserCursorPage> | string>,
    userByEmail?: GraphCacheResolver<WithTypename<Query>, QueryUserByEmailArgs, WithTypename<UserType> | string>,
    userMe?: GraphCacheResolver<WithTypename<Query>, QueryUserMeArgs, WithTypename<UserType> | string>,
    voucherAll?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, Array<WithTypename<VoucherType> | string>>,
    voucherByUid?: GraphCacheResolver<WithTypename<Query>, QueryVoucherByUidArgs, WithTypename<VoucherType> | string>,
    voucherCodes?: GraphCacheResolver<WithTypename<Query>, QueryVoucherCodesArgs, Array<WithTypename<VoucherCodeType> | string>>,
    worksheetAll?: GraphCacheResolver<WithTypename<Query>, QueryWorksheetAllArgs, WithTypename<WorkSheetCursorPage> | string>,
    worksheetByAnalyst?: GraphCacheResolver<WithTypename<Query>, QueryWorksheetByAnalystArgs, Array<WithTypename<WorkSheetType> | string>>,
    worksheetById?: GraphCacheResolver<WithTypename<Query>, QueryWorksheetByIdArgs, WithTypename<WorkSheetType> | string>,
    worksheetByStatus?: GraphCacheResolver<WithTypename<Query>, QueryWorksheetByStatusArgs, Array<WithTypename<WorkSheetType> | string>>,
    worksheetByUid?: GraphCacheResolver<WithTypename<Query>, QueryWorksheetByUidArgs, WithTypename<WorkSheetType> | string>,
    worksheetTemplateAll?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, Array<WithTypename<WorkSheetTemplateType> | string>>,
    worksheetTemplateByUid?: GraphCacheResolver<WithTypename<Query>, QueryWorksheetTemplateByUidArgs, Array<WithTypename<WorkSheetType> | string>>
  },
  ActivityFeedType?: {
    name?: GraphCacheResolver<WithTypename<ActivityFeedType>, Record<string, never>, Scalars['String'] | string>,
    subscribers?: GraphCacheResolver<WithTypename<ActivityFeedType>, Record<string, never>, Array<WithTypename<UserType> | string>>,
    uid?: GraphCacheResolver<WithTypename<ActivityFeedType>, Record<string, never>, Scalars['String'] | string>
  },
  ActivityProcessType?: {
    objectType?: GraphCacheResolver<WithTypename<ActivityProcessType>, Record<string, never>, Scalars['String'] | string>,
    status?: GraphCacheResolver<WithTypename<ActivityProcessType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<ActivityProcessType>, Record<string, never>, Scalars['String'] | string>
  },
  ActivityStreamType?: {
    actionObject?: GraphCacheResolver<WithTypename<ActivityStreamType>, Record<string, never>, WithTypename<WorkSheetTypeSampleTypeAnalysisResultTypeReportMetaTypeUnknownObjectType> | string>,
    actionObjectType?: GraphCacheResolver<WithTypename<ActivityStreamType>, Record<string, never>, Scalars['String'] | string>,
    actionObjectUid?: GraphCacheResolver<WithTypename<ActivityStreamType>, Record<string, never>, Scalars['String'] | string>,
    actor?: GraphCacheResolver<WithTypename<ActivityStreamType>, Record<string, never>, WithTypename<UserType> | string>,
    actorUid?: GraphCacheResolver<WithTypename<ActivityStreamType>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<ActivityStreamType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<ActivityStreamType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<ActivityStreamType>, Record<string, never>, Scalars['String'] | string>,
    feeds?: GraphCacheResolver<WithTypename<ActivityStreamType>, Record<string, never>, Array<WithTypename<ActivityFeedType> | string>>,
    target?: GraphCacheResolver<WithTypename<ActivityStreamType>, Record<string, never>, Scalars['String'] | string>,
    targetUid?: GraphCacheResolver<WithTypename<ActivityStreamType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<ActivityStreamType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<ActivityStreamType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<ActivityStreamType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<ActivityStreamType>, Record<string, never>, Scalars['String'] | string>,
    verb?: GraphCacheResolver<WithTypename<ActivityStreamType>, Record<string, never>, Scalars['String'] | string>,
    viewers?: GraphCacheResolver<WithTypename<ActivityStreamType>, Record<string, never>, Array<WithTypename<UserType> | string>>
  },
  AnalysisCategoryType?: {
    active?: GraphCacheResolver<WithTypename<AnalysisCategoryType>, Record<string, never>, Scalars['Boolean'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<AnalysisCategoryType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<AnalysisCategoryType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<AnalysisCategoryType>, Record<string, never>, Scalars['String'] | string>,
    department?: GraphCacheResolver<WithTypename<AnalysisCategoryType>, Record<string, never>, WithTypename<DepartmentType> | string>,
    departmentUid?: GraphCacheResolver<WithTypename<AnalysisCategoryType>, Record<string, never>, Scalars['String'] | string>,
    description?: GraphCacheResolver<WithTypename<AnalysisCategoryType>, Record<string, never>, Scalars['String'] | string>,
    name?: GraphCacheResolver<WithTypename<AnalysisCategoryType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<AnalysisCategoryType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<AnalysisCategoryType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<AnalysisCategoryType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<AnalysisCategoryType>, Record<string, never>, Scalars['String'] | string>
  },
  AnalysisCorrectionFactorType?: {
    analysisUid?: GraphCacheResolver<WithTypename<AnalysisCorrectionFactorType>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<AnalysisCorrectionFactorType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<AnalysisCorrectionFactorType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<AnalysisCorrectionFactorType>, Record<string, never>, Scalars['String'] | string>,
    factor?: GraphCacheResolver<WithTypename<AnalysisCorrectionFactorType>, Record<string, never>, Scalars['Float'] | string>,
    instrumentUid?: GraphCacheResolver<WithTypename<AnalysisCorrectionFactorType>, Record<string, never>, Scalars['String'] | string>,
    methodUid?: GraphCacheResolver<WithTypename<AnalysisCorrectionFactorType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<AnalysisCorrectionFactorType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<AnalysisCorrectionFactorType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<AnalysisCorrectionFactorType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<AnalysisCorrectionFactorType>, Record<string, never>, Scalars['String'] | string>
  },
  AnalysisCursorPage?: {
    edges?: GraphCacheResolver<WithTypename<AnalysisCursorPage>, Record<string, never>, Array<WithTypename<AnalysisEdge> | string>>,
    items?: GraphCacheResolver<WithTypename<AnalysisCursorPage>, Record<string, never>, Array<WithTypename<AnalysisWithProfiles> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<AnalysisCursorPage>, Record<string, never>, WithTypename<PageInfo> | string>,
    totalCount?: GraphCacheResolver<WithTypename<AnalysisCursorPage>, Record<string, never>, Scalars['Int'] | string>
  },
  AnalysisDetectionLimitType?: {
    analysisUid?: GraphCacheResolver<WithTypename<AnalysisDetectionLimitType>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<AnalysisDetectionLimitType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<AnalysisDetectionLimitType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<AnalysisDetectionLimitType>, Record<string, never>, Scalars['String'] | string>,
    instrumentUid?: GraphCacheResolver<WithTypename<AnalysisDetectionLimitType>, Record<string, never>, Scalars['String'] | string>,
    lowerLimit?: GraphCacheResolver<WithTypename<AnalysisDetectionLimitType>, Record<string, never>, Scalars['Float'] | string>,
    methodUid?: GraphCacheResolver<WithTypename<AnalysisDetectionLimitType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<AnalysisDetectionLimitType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<AnalysisDetectionLimitType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<AnalysisDetectionLimitType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<AnalysisDetectionLimitType>, Record<string, never>, Scalars['String'] | string>,
    upperLimit?: GraphCacheResolver<WithTypename<AnalysisDetectionLimitType>, Record<string, never>, Scalars['Float'] | string>
  },
  AnalysisDiscountType?: {
    analysis?: GraphCacheResolver<WithTypename<AnalysisDiscountType>, Record<string, never>, WithTypename<AnalysisType> | string>,
    analysisUid?: GraphCacheResolver<WithTypename<AnalysisDiscountType>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<AnalysisDiscountType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<AnalysisDiscountType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<AnalysisDiscountType>, Record<string, never>, Scalars['String'] | string>,
    discountType?: GraphCacheResolver<WithTypename<AnalysisDiscountType>, Record<string, never>, Scalars['String'] | string>,
    endDate?: GraphCacheResolver<WithTypename<AnalysisDiscountType>, Record<string, never>, Scalars['DateTime'] | string>,
    isActive?: GraphCacheResolver<WithTypename<AnalysisDiscountType>, Record<string, never>, Scalars['Boolean'] | string>,
    name?: GraphCacheResolver<WithTypename<AnalysisDiscountType>, Record<string, never>, Scalars['String'] | string>,
    startDate?: GraphCacheResolver<WithTypename<AnalysisDiscountType>, Record<string, never>, Scalars['DateTime'] | string>,
    uid?: GraphCacheResolver<WithTypename<AnalysisDiscountType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<AnalysisDiscountType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<AnalysisDiscountType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<AnalysisDiscountType>, Record<string, never>, Scalars['String'] | string>,
    valueAmount?: GraphCacheResolver<WithTypename<AnalysisDiscountType>, Record<string, never>, Scalars['Float'] | string>,
    valuePercent?: GraphCacheResolver<WithTypename<AnalysisDiscountType>, Record<string, never>, Scalars['Float'] | string>,
    valueType?: GraphCacheResolver<WithTypename<AnalysisDiscountType>, Record<string, never>, Scalars['String'] | string>,
    voucher?: GraphCacheResolver<WithTypename<AnalysisDiscountType>, Record<string, never>, WithTypename<VoucherType> | string>,
    voucherUid?: GraphCacheResolver<WithTypename<AnalysisDiscountType>, Record<string, never>, Scalars['String'] | string>
  },
  AnalysisEdge?: {
    cursor?: GraphCacheResolver<WithTypename<AnalysisEdge>, Record<string, never>, Scalars['String'] | string>,
    node?: GraphCacheResolver<WithTypename<AnalysisEdge>, Record<string, never>, WithTypename<AnalysisWithProfiles> | string>
  },
  AnalysisInterimType?: {
    analysisUid?: GraphCacheResolver<WithTypename<AnalysisInterimType>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<AnalysisInterimType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<AnalysisInterimType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<AnalysisInterimType>, Record<string, never>, Scalars['String'] | string>,
    instrumentUid?: GraphCacheResolver<WithTypename<AnalysisInterimType>, Record<string, never>, Scalars['String'] | string>,
    key?: GraphCacheResolver<WithTypename<AnalysisInterimType>, Record<string, never>, Scalars['Int'] | string>,
    uid?: GraphCacheResolver<WithTypename<AnalysisInterimType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<AnalysisInterimType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<AnalysisInterimType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<AnalysisInterimType>, Record<string, never>, Scalars['String'] | string>,
    value?: GraphCacheResolver<WithTypename<AnalysisInterimType>, Record<string, never>, Scalars['String'] | string>
  },
  AnalysisMappingType?: {
    analysis?: GraphCacheResolver<WithTypename<AnalysisMappingType>, Record<string, never>, WithTypename<AnalysisType> | string>,
    analysisUid?: GraphCacheResolver<WithTypename<AnalysisMappingType>, Record<string, never>, Scalars['String'] | string>,
    code?: GraphCacheResolver<WithTypename<AnalysisMappingType>, Record<string, never>, Scalars['String'] | string>,
    codingStandard?: GraphCacheResolver<WithTypename<AnalysisMappingType>, Record<string, never>, WithTypename<CodingStandardType> | string>,
    codingStandardUid?: GraphCacheResolver<WithTypename<AnalysisMappingType>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<AnalysisMappingType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<AnalysisMappingType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<AnalysisMappingType>, Record<string, never>, Scalars['String'] | string>,
    description?: GraphCacheResolver<WithTypename<AnalysisMappingType>, Record<string, never>, Scalars['String'] | string>,
    name?: GraphCacheResolver<WithTypename<AnalysisMappingType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<AnalysisMappingType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<AnalysisMappingType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<AnalysisMappingType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<AnalysisMappingType>, Record<string, never>, Scalars['String'] | string>
  },
  AnalysisPriceType?: {
    amount?: GraphCacheResolver<WithTypename<AnalysisPriceType>, Record<string, never>, Scalars['Float'] | string>,
    analysis?: GraphCacheResolver<WithTypename<AnalysisPriceType>, Record<string, never>, WithTypename<AnalysisType> | string>,
    analysisUid?: GraphCacheResolver<WithTypename<AnalysisPriceType>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<AnalysisPriceType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<AnalysisPriceType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<AnalysisPriceType>, Record<string, never>, Scalars['String'] | string>,
    isActive?: GraphCacheResolver<WithTypename<AnalysisPriceType>, Record<string, never>, Scalars['Boolean'] | string>,
    uid?: GraphCacheResolver<WithTypename<AnalysisPriceType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<AnalysisPriceType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<AnalysisPriceType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<AnalysisPriceType>, Record<string, never>, Scalars['String'] | string>
  },
  AnalysisRequestCursorPage?: {
    edges?: GraphCacheResolver<WithTypename<AnalysisRequestCursorPage>, Record<string, never>, Array<WithTypename<AnalysisRequestEdge> | string>>,
    items?: GraphCacheResolver<WithTypename<AnalysisRequestCursorPage>, Record<string, never>, Array<WithTypename<AnalysisRequestWithSamples> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<AnalysisRequestCursorPage>, Record<string, never>, WithTypename<PageInfo> | string>,
    totalCount?: GraphCacheResolver<WithTypename<AnalysisRequestCursorPage>, Record<string, never>, Scalars['Int'] | string>
  },
  AnalysisRequestEdge?: {
    cursor?: GraphCacheResolver<WithTypename<AnalysisRequestEdge>, Record<string, never>, Scalars['String'] | string>,
    node?: GraphCacheResolver<WithTypename<AnalysisRequestEdge>, Record<string, never>, WithTypename<AnalysisRequestWithSamples> | string>
  },
  AnalysisRequestType?: {
    client?: GraphCacheResolver<WithTypename<AnalysisRequestType>, Record<string, never>, WithTypename<ClientType> | string>,
    clientRequestId?: GraphCacheResolver<WithTypename<AnalysisRequestType>, Record<string, never>, Scalars['String'] | string>,
    clientUid?: GraphCacheResolver<WithTypename<AnalysisRequestType>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<AnalysisRequestType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<AnalysisRequestType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<AnalysisRequestType>, Record<string, never>, Scalars['String'] | string>,
    internalUse?: GraphCacheResolver<WithTypename<AnalysisRequestType>, Record<string, never>, Scalars['Boolean'] | string>,
    metadataSnapshot?: GraphCacheResolver<WithTypename<AnalysisRequestType>, Record<string, never>, Scalars['JSONScalar'] | string>,
    patient?: GraphCacheResolver<WithTypename<AnalysisRequestType>, Record<string, never>, WithTypename<PatientType> | string>,
    patientUid?: GraphCacheResolver<WithTypename<AnalysisRequestType>, Record<string, never>, Scalars['String'] | string>,
    requestId?: GraphCacheResolver<WithTypename<AnalysisRequestType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<AnalysisRequestType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<AnalysisRequestType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<AnalysisRequestType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<AnalysisRequestType>, Record<string, never>, Scalars['String'] | string>
  },
  AnalysisRequestWithSamples?: {
    client?: GraphCacheResolver<WithTypename<AnalysisRequestWithSamples>, Record<string, never>, WithTypename<ClientType> | string>,
    clientRequestId?: GraphCacheResolver<WithTypename<AnalysisRequestWithSamples>, Record<string, never>, Scalars['String'] | string>,
    clientUid?: GraphCacheResolver<WithTypename<AnalysisRequestWithSamples>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<AnalysisRequestWithSamples>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<AnalysisRequestWithSamples>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<AnalysisRequestWithSamples>, Record<string, never>, Scalars['String'] | string>,
    internalUse?: GraphCacheResolver<WithTypename<AnalysisRequestWithSamples>, Record<string, never>, Scalars['Boolean'] | string>,
    metadataSnapshot?: GraphCacheResolver<WithTypename<AnalysisRequestWithSamples>, Record<string, never>, Scalars['JSONScalar'] | string>,
    patient?: GraphCacheResolver<WithTypename<AnalysisRequestWithSamples>, Record<string, never>, WithTypename<PatientType> | string>,
    patientUid?: GraphCacheResolver<WithTypename<AnalysisRequestWithSamples>, Record<string, never>, Scalars['String'] | string>,
    requestId?: GraphCacheResolver<WithTypename<AnalysisRequestWithSamples>, Record<string, never>, Scalars['String'] | string>,
    samples?: GraphCacheResolver<WithTypename<AnalysisRequestWithSamples>, Record<string, never>, Array<WithTypename<SampleType> | string>>,
    uid?: GraphCacheResolver<WithTypename<AnalysisRequestWithSamples>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<AnalysisRequestWithSamples>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<AnalysisRequestWithSamples>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<AnalysisRequestWithSamples>, Record<string, never>, Scalars['String'] | string>
  },
  AnalysisResultCursorPage?: {
    edges?: GraphCacheResolver<WithTypename<AnalysisResultCursorPage>, Record<string, never>, Array<WithTypename<AnalysisResultEdge> | string>>,
    items?: GraphCacheResolver<WithTypename<AnalysisResultCursorPage>, Record<string, never>, Array<WithTypename<AnalysisResultType> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<AnalysisResultCursorPage>, Record<string, never>, WithTypename<PageInfo> | string>,
    totalCount?: GraphCacheResolver<WithTypename<AnalysisResultCursorPage>, Record<string, never>, Scalars['Int'] | string>
  },
  AnalysisResultEdge?: {
    cursor?: GraphCacheResolver<WithTypename<AnalysisResultEdge>, Record<string, never>, Scalars['String'] | string>,
    node?: GraphCacheResolver<WithTypename<AnalysisResultEdge>, Record<string, never>, WithTypename<AnalysisResultType> | string>
  },
  AnalysisResultType?: {
    analysis?: GraphCacheResolver<WithTypename<AnalysisResultType>, Record<string, never>, WithTypename<AnalysisType> | string>,
    analysisUid?: GraphCacheResolver<WithTypename<AnalysisResultType>, Record<string, never>, Scalars['String'] | string>,
    analyst?: GraphCacheResolver<WithTypename<AnalysisResultType>, Record<string, never>, WithTypename<UserType> | string>,
    analystUid?: GraphCacheResolver<WithTypename<AnalysisResultType>, Record<string, never>, Scalars['String'] | string>,
    assigned?: GraphCacheResolver<WithTypename<AnalysisResultType>, Record<string, never>, Scalars['Boolean'] | string>,
    cancelledBy?: GraphCacheResolver<WithTypename<AnalysisResultType>, Record<string, never>, WithTypename<UserType> | string>,
    cancelledByUid?: GraphCacheResolver<WithTypename<AnalysisResultType>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<AnalysisResultType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<AnalysisResultType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<AnalysisResultType>, Record<string, never>, Scalars['String'] | string>,
    dateCancelled?: GraphCacheResolver<WithTypename<AnalysisResultType>, Record<string, never>, Scalars['DateTime'] | string>,
    dateInvalidated?: GraphCacheResolver<WithTypename<AnalysisResultType>, Record<string, never>, Scalars['DateTime'] | string>,
    dateSubmitted?: GraphCacheResolver<WithTypename<AnalysisResultType>, Record<string, never>, Scalars['DateTime'] | string>,
    dateVerified?: GraphCacheResolver<WithTypename<AnalysisResultType>, Record<string, never>, Scalars['DateTime'] | string>,
    dueDate?: GraphCacheResolver<WithTypename<AnalysisResultType>, Record<string, never>, Scalars['String'] | string>,
    invalidatedBy?: GraphCacheResolver<WithTypename<AnalysisResultType>, Record<string, never>, WithTypename<UserType> | string>,
    invalidatedByUid?: GraphCacheResolver<WithTypename<AnalysisResultType>, Record<string, never>, Scalars['String'] | string>,
    laboratoryInstrument?: GraphCacheResolver<WithTypename<AnalysisResultType>, Record<string, never>, WithTypename<LaboratoryInstrumentType> | string>,
    laboratoryInstrumentUid?: GraphCacheResolver<WithTypename<AnalysisResultType>, Record<string, never>, Scalars['String'] | string>,
    metadataSnapshot?: GraphCacheResolver<WithTypename<AnalysisResultType>, Record<string, never>, Scalars['JSONScalar'] | string>,
    method?: GraphCacheResolver<WithTypename<AnalysisResultType>, Record<string, never>, WithTypename<MethodType> | string>,
    methodUid?: GraphCacheResolver<WithTypename<AnalysisResultType>, Record<string, never>, Scalars['String'] | string>,
    parent?: GraphCacheResolver<WithTypename<AnalysisResultType>, Record<string, never>, WithTypename<AnalysisResultType> | string>,
    parentId?: GraphCacheResolver<WithTypename<AnalysisResultType>, Record<string, never>, Scalars['String'] | string>,
    reflexLevel?: GraphCacheResolver<WithTypename<AnalysisResultType>, Record<string, never>, Scalars['Int'] | string>,
    reportable?: GraphCacheResolver<WithTypename<AnalysisResultType>, Record<string, never>, Scalars['Boolean'] | string>,
    result?: GraphCacheResolver<WithTypename<AnalysisResultType>, Record<string, never>, Scalars['String'] | string>,
    retest?: GraphCacheResolver<WithTypename<AnalysisResultType>, Record<string, never>, Scalars['Boolean'] | string>,
    sample?: GraphCacheResolver<WithTypename<AnalysisResultType>, Record<string, never>, WithTypename<SampleType> | string>,
    sampleUid?: GraphCacheResolver<WithTypename<AnalysisResultType>, Record<string, never>, Scalars['String'] | string>,
    status?: GraphCacheResolver<WithTypename<AnalysisResultType>, Record<string, never>, Scalars['String'] | string>,
    submittedBy?: GraphCacheResolver<WithTypename<AnalysisResultType>, Record<string, never>, WithTypename<UserType> | string>,
    submittedByUid?: GraphCacheResolver<WithTypename<AnalysisResultType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<AnalysisResultType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<AnalysisResultType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<AnalysisResultType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<AnalysisResultType>, Record<string, never>, Scalars['String'] | string>,
    verifiedBy?: GraphCacheResolver<WithTypename<AnalysisResultType>, Record<string, never>, Array<WithTypename<UserType> | string>>,
    worksheetId?: GraphCacheResolver<WithTypename<AnalysisResultType>, Record<string, never>, Scalars['String'] | string>,
    worksheetPosition?: GraphCacheResolver<WithTypename<AnalysisResultType>, Record<string, never>, Scalars['Int'] | string>,
    worksheetUid?: GraphCacheResolver<WithTypename<AnalysisResultType>, Record<string, never>, Scalars['String'] | string>
  },
  AnalysisSpecificationType?: {
    ageMax?: GraphCacheResolver<WithTypename<AnalysisSpecificationType>, Record<string, never>, Scalars['Int'] | string>,
    ageMin?: GraphCacheResolver<WithTypename<AnalysisSpecificationType>, Record<string, never>, Scalars['Int'] | string>,
    analysisUid?: GraphCacheResolver<WithTypename<AnalysisSpecificationType>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<AnalysisSpecificationType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<AnalysisSpecificationType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<AnalysisSpecificationType>, Record<string, never>, Scalars['String'] | string>,
    gender?: GraphCacheResolver<WithTypename<AnalysisSpecificationType>, Record<string, never>, Scalars['String'] | string>,
    max?: GraphCacheResolver<WithTypename<AnalysisSpecificationType>, Record<string, never>, Scalars['Float'] | string>,
    maxReport?: GraphCacheResolver<WithTypename<AnalysisSpecificationType>, Record<string, never>, Scalars['String'] | string>,
    maxWarn?: GraphCacheResolver<WithTypename<AnalysisSpecificationType>, Record<string, never>, Scalars['Float'] | string>,
    methodUid?: GraphCacheResolver<WithTypename<AnalysisSpecificationType>, Record<string, never>, Scalars['String'] | string>,
    min?: GraphCacheResolver<WithTypename<AnalysisSpecificationType>, Record<string, never>, Scalars['Float'] | string>,
    minReport?: GraphCacheResolver<WithTypename<AnalysisSpecificationType>, Record<string, never>, Scalars['String'] | string>,
    minWarn?: GraphCacheResolver<WithTypename<AnalysisSpecificationType>, Record<string, never>, Scalars['Float'] | string>,
    uid?: GraphCacheResolver<WithTypename<AnalysisSpecificationType>, Record<string, never>, Scalars['String'] | string>,
    unit?: GraphCacheResolver<WithTypename<AnalysisSpecificationType>, Record<string, never>, WithTypename<UnitType> | string>,
    unitUid?: GraphCacheResolver<WithTypename<AnalysisSpecificationType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<AnalysisSpecificationType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<AnalysisSpecificationType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<AnalysisSpecificationType>, Record<string, never>, Scalars['String'] | string>,
    warnReport?: GraphCacheResolver<WithTypename<AnalysisSpecificationType>, Record<string, never>, Scalars['String'] | string>,
    warnValues?: GraphCacheResolver<WithTypename<AnalysisSpecificationType>, Record<string, never>, Scalars['String'] | string>
  },
  AnalysisTemplateType?: {
    analyses?: GraphCacheResolver<WithTypename<AnalysisTemplateType>, Record<string, never>, Array<WithTypename<AnalysisType> | string>>,
    createdAt?: GraphCacheResolver<WithTypename<AnalysisTemplateType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<AnalysisTemplateType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<AnalysisTemplateType>, Record<string, never>, Scalars['String'] | string>,
    department?: GraphCacheResolver<WithTypename<AnalysisTemplateType>, Record<string, never>, WithTypename<DepartmentType> | string>,
    departmentUid?: GraphCacheResolver<WithTypename<AnalysisTemplateType>, Record<string, never>, Scalars['String'] | string>,
    description?: GraphCacheResolver<WithTypename<AnalysisTemplateType>, Record<string, never>, Scalars['String'] | string>,
    name?: GraphCacheResolver<WithTypename<AnalysisTemplateType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<AnalysisTemplateType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<AnalysisTemplateType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<AnalysisTemplateType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<AnalysisTemplateType>, Record<string, never>, Scalars['String'] | string>
  },
  AnalysisType?: {
    active?: GraphCacheResolver<WithTypename<AnalysisType>, Record<string, never>, Scalars['Boolean'] | string>,
    category?: GraphCacheResolver<WithTypename<AnalysisType>, Record<string, never>, WithTypename<AnalysisCategoryType> | string>,
    categoryUid?: GraphCacheResolver<WithTypename<AnalysisType>, Record<string, never>, Scalars['String'] | string>,
    correctionFactors?: GraphCacheResolver<WithTypename<AnalysisType>, Record<string, never>, Array<WithTypename<AnalysisCorrectionFactorType> | string>>,
    createdAt?: GraphCacheResolver<WithTypename<AnalysisType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<AnalysisType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<AnalysisType>, Record<string, never>, Scalars['String'] | string>,
    department?: GraphCacheResolver<WithTypename<AnalysisType>, Record<string, never>, WithTypename<DepartmentType> | string>,
    departmentUid?: GraphCacheResolver<WithTypename<AnalysisType>, Record<string, never>, Scalars['String'] | string>,
    description?: GraphCacheResolver<WithTypename<AnalysisType>, Record<string, never>, Scalars['String'] | string>,
    detectionLimits?: GraphCacheResolver<WithTypename<AnalysisType>, Record<string, never>, Array<WithTypename<AnalysisDetectionLimitType> | string>>,
    hidden?: GraphCacheResolver<WithTypename<AnalysisType>, Record<string, never>, Scalars['Boolean'] | string>,
    instruments?: GraphCacheResolver<WithTypename<AnalysisType>, Record<string, never>, Array<WithTypename<InstrumentType> | string>>,
    interims?: GraphCacheResolver<WithTypename<AnalysisType>, Record<string, never>, Array<WithTypename<AnalysisInterimType> | string>>,
    internalUse?: GraphCacheResolver<WithTypename<AnalysisType>, Record<string, never>, Scalars['Boolean'] | string>,
    keyword?: GraphCacheResolver<WithTypename<AnalysisType>, Record<string, never>, Scalars['String'] | string>,
    methods?: GraphCacheResolver<WithTypename<AnalysisType>, Record<string, never>, Array<WithTypename<MethodType> | string>>,
    name?: GraphCacheResolver<WithTypename<AnalysisType>, Record<string, never>, Scalars['String'] | string>,
    precision?: GraphCacheResolver<WithTypename<AnalysisType>, Record<string, never>, Scalars['Int'] | string>,
    requiredVerifications?: GraphCacheResolver<WithTypename<AnalysisType>, Record<string, never>, Scalars['Int'] | string>,
    resultOptions?: GraphCacheResolver<WithTypename<AnalysisType>, Record<string, never>, Array<WithTypename<ResultOptionType> | string>>,
    resultType?: GraphCacheResolver<WithTypename<AnalysisType>, Record<string, never>, Scalars['String'] | string>,
    sampleTypes?: GraphCacheResolver<WithTypename<AnalysisType>, Record<string, never>, Array<WithTypename<SampleTypeTyp> | string>>,
    selfVerification?: GraphCacheResolver<WithTypename<AnalysisType>, Record<string, never>, Scalars['Boolean'] | string>,
    sortKey?: GraphCacheResolver<WithTypename<AnalysisType>, Record<string, never>, Scalars['Int'] | string>,
    specifications?: GraphCacheResolver<WithTypename<AnalysisType>, Record<string, never>, Array<WithTypename<AnalysisSpecificationType> | string>>,
    tatLengthMinutes?: GraphCacheResolver<WithTypename<AnalysisType>, Record<string, never>, Scalars['Int'] | string>,
    uid?: GraphCacheResolver<WithTypename<AnalysisType>, Record<string, never>, Scalars['String'] | string>,
    uncertainties?: GraphCacheResolver<WithTypename<AnalysisType>, Record<string, never>, Array<WithTypename<AnalysisUncertaintyType> | string>>,
    unit?: GraphCacheResolver<WithTypename<AnalysisType>, Record<string, never>, WithTypename<UnitType> | string>,
    unitUid?: GraphCacheResolver<WithTypename<AnalysisType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<AnalysisType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<AnalysisType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<AnalysisType>, Record<string, never>, Scalars['String'] | string>
  },
  AnalysisUncertaintyType?: {
    analysisUid?: GraphCacheResolver<WithTypename<AnalysisUncertaintyType>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<AnalysisUncertaintyType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<AnalysisUncertaintyType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<AnalysisUncertaintyType>, Record<string, never>, Scalars['String'] | string>,
    instrumentUid?: GraphCacheResolver<WithTypename<AnalysisUncertaintyType>, Record<string, never>, Scalars['String'] | string>,
    max?: GraphCacheResolver<WithTypename<AnalysisUncertaintyType>, Record<string, never>, Scalars['Float'] | string>,
    methodUid?: GraphCacheResolver<WithTypename<AnalysisUncertaintyType>, Record<string, never>, Scalars['String'] | string>,
    min?: GraphCacheResolver<WithTypename<AnalysisUncertaintyType>, Record<string, never>, Scalars['Float'] | string>,
    uid?: GraphCacheResolver<WithTypename<AnalysisUncertaintyType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<AnalysisUncertaintyType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<AnalysisUncertaintyType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<AnalysisUncertaintyType>, Record<string, never>, Scalars['String'] | string>,
    value?: GraphCacheResolver<WithTypename<AnalysisUncertaintyType>, Record<string, never>, Scalars['Float'] | string>
  },
  AnalysisWithProfiles?: {
    active?: GraphCacheResolver<WithTypename<AnalysisWithProfiles>, Record<string, never>, Scalars['Boolean'] | string>,
    category?: GraphCacheResolver<WithTypename<AnalysisWithProfiles>, Record<string, never>, WithTypename<AnalysisCategoryType> | string>,
    categoryUid?: GraphCacheResolver<WithTypename<AnalysisWithProfiles>, Record<string, never>, Scalars['String'] | string>,
    correctionFactors?: GraphCacheResolver<WithTypename<AnalysisWithProfiles>, Record<string, never>, Array<WithTypename<AnalysisCorrectionFactorType> | string>>,
    createdAt?: GraphCacheResolver<WithTypename<AnalysisWithProfiles>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<AnalysisWithProfiles>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<AnalysisWithProfiles>, Record<string, never>, Scalars['String'] | string>,
    department?: GraphCacheResolver<WithTypename<AnalysisWithProfiles>, Record<string, never>, WithTypename<DepartmentType> | string>,
    departmentUid?: GraphCacheResolver<WithTypename<AnalysisWithProfiles>, Record<string, never>, Scalars['String'] | string>,
    description?: GraphCacheResolver<WithTypename<AnalysisWithProfiles>, Record<string, never>, Scalars['String'] | string>,
    detectionLimits?: GraphCacheResolver<WithTypename<AnalysisWithProfiles>, Record<string, never>, Array<WithTypename<AnalysisDetectionLimitType> | string>>,
    hidden?: GraphCacheResolver<WithTypename<AnalysisWithProfiles>, Record<string, never>, Scalars['Boolean'] | string>,
    instruments?: GraphCacheResolver<WithTypename<AnalysisWithProfiles>, Record<string, never>, Array<WithTypename<InstrumentType> | string>>,
    interims?: GraphCacheResolver<WithTypename<AnalysisWithProfiles>, Record<string, never>, Array<WithTypename<AnalysisInterimType> | string>>,
    internalUse?: GraphCacheResolver<WithTypename<AnalysisWithProfiles>, Record<string, never>, Scalars['Boolean'] | string>,
    keyword?: GraphCacheResolver<WithTypename<AnalysisWithProfiles>, Record<string, never>, Scalars['String'] | string>,
    methods?: GraphCacheResolver<WithTypename<AnalysisWithProfiles>, Record<string, never>, Array<WithTypename<MethodType> | string>>,
    name?: GraphCacheResolver<WithTypename<AnalysisWithProfiles>, Record<string, never>, Scalars['String'] | string>,
    precision?: GraphCacheResolver<WithTypename<AnalysisWithProfiles>, Record<string, never>, Scalars['Int'] | string>,
    profiles?: GraphCacheResolver<WithTypename<AnalysisWithProfiles>, Record<string, never>, Array<WithTypename<ProfileType> | string>>,
    requiredVerifications?: GraphCacheResolver<WithTypename<AnalysisWithProfiles>, Record<string, never>, Scalars['Int'] | string>,
    resultOptions?: GraphCacheResolver<WithTypename<AnalysisWithProfiles>, Record<string, never>, Array<WithTypename<ResultOptionType> | string>>,
    resultType?: GraphCacheResolver<WithTypename<AnalysisWithProfiles>, Record<string, never>, Scalars['String'] | string>,
    sampleTypes?: GraphCacheResolver<WithTypename<AnalysisWithProfiles>, Record<string, never>, Array<WithTypename<SampleTypeTyp> | string>>,
    selfVerification?: GraphCacheResolver<WithTypename<AnalysisWithProfiles>, Record<string, never>, Scalars['Boolean'] | string>,
    sortKey?: GraphCacheResolver<WithTypename<AnalysisWithProfiles>, Record<string, never>, Scalars['Int'] | string>,
    specifications?: GraphCacheResolver<WithTypename<AnalysisWithProfiles>, Record<string, never>, Array<WithTypename<AnalysisSpecificationType> | string>>,
    tatLengthMinutes?: GraphCacheResolver<WithTypename<AnalysisWithProfiles>, Record<string, never>, Scalars['Int'] | string>,
    uid?: GraphCacheResolver<WithTypename<AnalysisWithProfiles>, Record<string, never>, Scalars['String'] | string>,
    uncertainties?: GraphCacheResolver<WithTypename<AnalysisWithProfiles>, Record<string, never>, Array<WithTypename<AnalysisUncertaintyType> | string>>,
    unit?: GraphCacheResolver<WithTypename<AnalysisWithProfiles>, Record<string, never>, WithTypename<UnitType> | string>,
    unitUid?: GraphCacheResolver<WithTypename<AnalysisWithProfiles>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<AnalysisWithProfiles>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<AnalysisWithProfiles>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<AnalysisWithProfiles>, Record<string, never>, Scalars['String'] | string>
  },
  AuditLogType?: {
    action?: GraphCacheResolver<WithTypename<AuditLogType>, Record<string, never>, Scalars['Int'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<AuditLogType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<AuditLogType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<AuditLogType>, Record<string, never>, Scalars['String'] | string>,
    stateAfter?: GraphCacheResolver<WithTypename<AuditLogType>, Record<string, never>, Scalars['JSONScalar'] | string>,
    stateBefore?: GraphCacheResolver<WithTypename<AuditLogType>, Record<string, never>, Scalars['JSONScalar'] | string>,
    targetType?: GraphCacheResolver<WithTypename<AuditLogType>, Record<string, never>, Scalars['String'] | string>,
    targetUid?: GraphCacheResolver<WithTypename<AuditLogType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<AuditLogType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<AuditLogType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<AuditLogType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<AuditLogType>, Record<string, never>, Scalars['String'] | string>,
    userUid?: GraphCacheResolver<WithTypename<AuditLogType>, Record<string, never>, Scalars['String'] | string>
  },
  AuthenticatedData?: {
    refresh?: GraphCacheResolver<WithTypename<AuthenticatedData>, Record<string, never>, Scalars['String'] | string>,
    token?: GraphCacheResolver<WithTypename<AuthenticatedData>, Record<string, never>, Scalars['String'] | string>,
    tokenType?: GraphCacheResolver<WithTypename<AuthenticatedData>, Record<string, never>, Scalars['String'] | string>,
    user?: GraphCacheResolver<WithTypename<AuthenticatedData>, Record<string, never>, WithTypename<UserType> | string>
  },
  CalibrationCertificateType?: {
    approvedBy?: GraphCacheResolver<WithTypename<CalibrationCertificateType>, Record<string, never>, Scalars['String'] | string>,
    certificateCode?: GraphCacheResolver<WithTypename<CalibrationCertificateType>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<CalibrationCertificateType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<CalibrationCertificateType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<CalibrationCertificateType>, Record<string, never>, Scalars['String'] | string>,
    dateIssued?: GraphCacheResolver<WithTypename<CalibrationCertificateType>, Record<string, never>, Scalars['DateTime'] | string>,
    internal?: GraphCacheResolver<WithTypename<CalibrationCertificateType>, Record<string, never>, Scalars['Boolean'] | string>,
    issuer?: GraphCacheResolver<WithTypename<CalibrationCertificateType>, Record<string, never>, Scalars['String'] | string>,
    laboratoryInstrument?: GraphCacheResolver<WithTypename<CalibrationCertificateType>, Record<string, never>, WithTypename<LaboratoryInstrumentType> | string>,
    laboratoryInstrumentUid?: GraphCacheResolver<WithTypename<CalibrationCertificateType>, Record<string, never>, Scalars['String'] | string>,
    performedBy?: GraphCacheResolver<WithTypename<CalibrationCertificateType>, Record<string, never>, Scalars['String'] | string>,
    remarks?: GraphCacheResolver<WithTypename<CalibrationCertificateType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<CalibrationCertificateType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<CalibrationCertificateType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<CalibrationCertificateType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<CalibrationCertificateType>, Record<string, never>, Scalars['String'] | string>,
    validFromDate?: GraphCacheResolver<WithTypename<CalibrationCertificateType>, Record<string, never>, Scalars['DateTime'] | string>,
    validToDate?: GraphCacheResolver<WithTypename<CalibrationCertificateType>, Record<string, never>, Scalars['DateTime'] | string>
  },
  ClientContactType?: {
    businessPhone?: GraphCacheResolver<WithTypename<ClientContactType>, Record<string, never>, Scalars['String'] | string>,
    client?: GraphCacheResolver<WithTypename<ClientContactType>, Record<string, never>, WithTypename<ClientType> | string>,
    clientUid?: GraphCacheResolver<WithTypename<ClientContactType>, Record<string, never>, Scalars['String'] | string>,
    consentSms?: GraphCacheResolver<WithTypename<ClientContactType>, Record<string, never>, Scalars['Boolean'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<ClientContactType>, Record<string, never>, Scalars['String'] | string>,
    creatorName?: GraphCacheResolver<WithTypename<ClientContactType>, Record<string, never>, Scalars['String'] | string>,
    creatorUid?: GraphCacheResolver<WithTypename<ClientContactType>, Record<string, never>, Scalars['String'] | string>,
    email?: GraphCacheResolver<WithTypename<ClientContactType>, Record<string, never>, Scalars['String'] | string>,
    emailCc?: GraphCacheResolver<WithTypename<ClientContactType>, Record<string, never>, Scalars['String'] | string>,
    firstName?: GraphCacheResolver<WithTypename<ClientContactType>, Record<string, never>, Scalars['String'] | string>,
    isActive?: GraphCacheResolver<WithTypename<ClientContactType>, Record<string, never>, Scalars['Boolean'] | string>,
    lastName?: GraphCacheResolver<WithTypename<ClientContactType>, Record<string, never>, Scalars['String'] | string>,
    mobilePhone?: GraphCacheResolver<WithTypename<ClientContactType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<ClientContactType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<ClientContactType>, Record<string, never>, Scalars['String'] | string>,
    updatorName?: GraphCacheResolver<WithTypename<ClientContactType>, Record<string, never>, Scalars['String'] | string>,
    updatorUid?: GraphCacheResolver<WithTypename<ClientContactType>, Record<string, never>, Scalars['String'] | string>
  },
  ClientCursorPage?: {
    edges?: GraphCacheResolver<WithTypename<ClientCursorPage>, Record<string, never>, Array<WithTypename<ClientEdge> | string>>,
    items?: GraphCacheResolver<WithTypename<ClientCursorPage>, Record<string, never>, Array<WithTypename<ClientType> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<ClientCursorPage>, Record<string, never>, WithTypename<PageInfo> | string>,
    totalCount?: GraphCacheResolver<WithTypename<ClientCursorPage>, Record<string, never>, Scalars['Int'] | string>
  },
  ClientEdge?: {
    cursor?: GraphCacheResolver<WithTypename<ClientEdge>, Record<string, never>, Scalars['String'] | string>,
    node?: GraphCacheResolver<WithTypename<ClientEdge>, Record<string, never>, WithTypename<ClientType> | string>
  },
  ClientType?: {
    active?: GraphCacheResolver<WithTypename<ClientType>, Record<string, never>, Scalars['Boolean'] | string>,
    code?: GraphCacheResolver<WithTypename<ClientType>, Record<string, never>, Scalars['String'] | string>,
    consentEmail?: GraphCacheResolver<WithTypename<ClientType>, Record<string, never>, Scalars['Boolean'] | string>,
    consentSms?: GraphCacheResolver<WithTypename<ClientType>, Record<string, never>, Scalars['Boolean'] | string>,
    contacts?: GraphCacheResolver<WithTypename<ClientType>, Record<string, never>, Array<WithTypename<ClientContactType> | string>>,
    createdAt?: GraphCacheResolver<WithTypename<ClientType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<ClientType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<ClientType>, Record<string, never>, Scalars['String'] | string>,
    district?: GraphCacheResolver<WithTypename<ClientType>, Record<string, never>, WithTypename<DistrictType> | string>,
    districtUid?: GraphCacheResolver<WithTypename<ClientType>, Record<string, never>, Scalars['String'] | string>,
    email?: GraphCacheResolver<WithTypename<ClientType>, Record<string, never>, Scalars['String'] | string>,
    emailCc?: GraphCacheResolver<WithTypename<ClientType>, Record<string, never>, Scalars['String'] | string>,
    internalUse?: GraphCacheResolver<WithTypename<ClientType>, Record<string, never>, Scalars['Boolean'] | string>,
    name?: GraphCacheResolver<WithTypename<ClientType>, Record<string, never>, Scalars['String'] | string>,
    phoneBusiness?: GraphCacheResolver<WithTypename<ClientType>, Record<string, never>, Scalars['String'] | string>,
    phoneMobile?: GraphCacheResolver<WithTypename<ClientType>, Record<string, never>, Scalars['String'] | string>,
    province?: GraphCacheResolver<WithTypename<ClientType>, Record<string, never>, WithTypename<ProvinceType> | string>,
    provinceUid?: GraphCacheResolver<WithTypename<ClientType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<ClientType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<ClientType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<ClientType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<ClientType>, Record<string, never>, Scalars['String'] | string>
  },
  CodingStandardType?: {
    createdAt?: GraphCacheResolver<WithTypename<CodingStandardType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<CodingStandardType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<CodingStandardType>, Record<string, never>, Scalars['String'] | string>,
    description?: GraphCacheResolver<WithTypename<CodingStandardType>, Record<string, never>, Scalars['String'] | string>,
    name?: GraphCacheResolver<WithTypename<CodingStandardType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<CodingStandardType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<CodingStandardType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<CodingStandardType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<CodingStandardType>, Record<string, never>, Scalars['String'] | string>
  },
  CountryType?: {
    active?: GraphCacheResolver<WithTypename<CountryType>, Record<string, never>, Scalars['String'] | string>,
    code?: GraphCacheResolver<WithTypename<CountryType>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<CountryType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<CountryType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<CountryType>, Record<string, never>, Scalars['String'] | string>,
    name?: GraphCacheResolver<WithTypename<CountryType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<CountryType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<CountryType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<CountryType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<CountryType>, Record<string, never>, Scalars['String'] | string>
  },
  CreateQCSetData?: {
    qcSets?: GraphCacheResolver<WithTypename<CreateQcSetData>, Record<string, never>, Array<WithTypename<QcSetWithSamples> | string>>
  },
  DeletedItem?: {
    uid?: GraphCacheResolver<WithTypename<DeletedItem>, Record<string, never>, Scalars['String'] | string>
  },
  DepartmentType?: {
    code?: GraphCacheResolver<WithTypename<DepartmentType>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<DepartmentType>, Record<string, never>, Scalars['String'] | string>,
    createdByUid?: GraphCacheResolver<WithTypename<DepartmentType>, Record<string, never>, Scalars['String'] | string>,
    description?: GraphCacheResolver<WithTypename<DepartmentType>, Record<string, never>, Scalars['String'] | string>,
    name?: GraphCacheResolver<WithTypename<DepartmentType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<DepartmentType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<DepartmentType>, Record<string, never>, Scalars['String'] | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<DepartmentType>, Record<string, never>, Scalars['String'] | string>
  },
  DistrictCursorPage?: {
    edges?: GraphCacheResolver<WithTypename<DistrictCursorPage>, Record<string, never>, Array<WithTypename<DistrictEdge> | string>>,
    items?: GraphCacheResolver<WithTypename<DistrictCursorPage>, Record<string, never>, Array<WithTypename<DistrictType> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<DistrictCursorPage>, Record<string, never>, WithTypename<PageInfo> | string>,
    totalCount?: GraphCacheResolver<WithTypename<DistrictCursorPage>, Record<string, never>, Scalars['Int'] | string>
  },
  DistrictEdge?: {
    cursor?: GraphCacheResolver<WithTypename<DistrictEdge>, Record<string, never>, Scalars['String'] | string>,
    node?: GraphCacheResolver<WithTypename<DistrictEdge>, Record<string, never>, WithTypename<DistrictType> | string>
  },
  DistrictType?: {
    active?: GraphCacheResolver<WithTypename<DistrictType>, Record<string, never>, Scalars['Boolean'] | string>,
    businessPhone?: GraphCacheResolver<WithTypename<DistrictType>, Record<string, never>, Scalars['String'] | string>,
    code?: GraphCacheResolver<WithTypename<DistrictType>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<DistrictType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<DistrictType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<DistrictType>, Record<string, never>, Scalars['String'] | string>,
    email?: GraphCacheResolver<WithTypename<DistrictType>, Record<string, never>, Scalars['String'] | string>,
    emailCc?: GraphCacheResolver<WithTypename<DistrictType>, Record<string, never>, Scalars['String'] | string>,
    mobilePhone?: GraphCacheResolver<WithTypename<DistrictType>, Record<string, never>, Scalars['String'] | string>,
    name?: GraphCacheResolver<WithTypename<DistrictType>, Record<string, never>, Scalars['String'] | string>,
    province?: GraphCacheResolver<WithTypename<DistrictType>, Record<string, never>, WithTypename<ProvinceType> | string>,
    provinceUid?: GraphCacheResolver<WithTypename<DistrictType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<DistrictType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<DistrictType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<DistrictType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<DistrictType>, Record<string, never>, Scalars['String'] | string>
  },
  GroupCount?: {
    count?: GraphCacheResolver<WithTypename<GroupCount>, Record<string, never>, Scalars['Int'] | string>,
    group?: GraphCacheResolver<WithTypename<GroupCount>, Record<string, never>, Scalars['String'] | string>
  },
  GroupData?: {
    counts?: GraphCacheResolver<WithTypename<GroupData>, Record<string, never>, Array<WithTypename<GroupCount> | string>>,
    group?: GraphCacheResolver<WithTypename<GroupData>, Record<string, never>, Scalars['String'] | string>
  },
  GroupType?: {
    active?: GraphCacheResolver<WithTypename<GroupType>, Record<string, never>, Scalars['Boolean'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<GroupType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<GroupType>, Record<string, never>, WithTypename<GroupType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<GroupType>, Record<string, never>, Scalars['String'] | string>,
    keyword?: GraphCacheResolver<WithTypename<GroupType>, Record<string, never>, Scalars['String'] | string>,
    members?: GraphCacheResolver<WithTypename<GroupType>, Record<string, never>, Array<WithTypename<UserType> | string>>,
    name?: GraphCacheResolver<WithTypename<GroupType>, Record<string, never>, Scalars['String'] | string>,
    pages?: GraphCacheResolver<WithTypename<GroupType>, Record<string, never>, Scalars['String'] | string>,
    permissions?: GraphCacheResolver<WithTypename<GroupType>, Record<string, never>, Array<WithTypename<PermissionType> | string>>,
    uid?: GraphCacheResolver<WithTypename<GroupType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<GroupType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<GroupType>, Record<string, never>, WithTypename<GroupType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<GroupType>, Record<string, never>, Scalars['String'] | string>
  },
  GroupedCounts?: {
    data?: GraphCacheResolver<WithTypename<GroupedCounts>, Record<string, never>, Array<WithTypename<GroupCount> | string>>
  },
  GroupedData?: {
    data?: GraphCacheResolver<WithTypename<GroupedData>, Record<string, never>, Array<WithTypename<GroupData> | string>>
  },
  HazardType?: {
    createdAt?: GraphCacheResolver<WithTypename<HazardType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<HazardType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<HazardType>, Record<string, never>, Scalars['String'] | string>,
    description?: GraphCacheResolver<WithTypename<HazardType>, Record<string, never>, Scalars['String'] | string>,
    name?: GraphCacheResolver<WithTypename<HazardType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<HazardType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<HazardType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<HazardType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<HazardType>, Record<string, never>, Scalars['String'] | string>
  },
  IdentificationType?: {
    createdAt?: GraphCacheResolver<WithTypename<IdentificationType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<IdentificationType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<IdentificationType>, Record<string, never>, Scalars['String'] | string>,
    name?: GraphCacheResolver<WithTypename<IdentificationType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<IdentificationType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<IdentificationType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<IdentificationType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<IdentificationType>, Record<string, never>, Scalars['String'] | string>
  },
  InstrumentCalibrationType?: {
    calibrationId?: GraphCacheResolver<WithTypename<InstrumentCalibrationType>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<InstrumentCalibrationType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<InstrumentCalibrationType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<InstrumentCalibrationType>, Record<string, never>, Scalars['String'] | string>,
    dateReported?: GraphCacheResolver<WithTypename<InstrumentCalibrationType>, Record<string, never>, Scalars['DateTime'] | string>,
    endDate?: GraphCacheResolver<WithTypename<InstrumentCalibrationType>, Record<string, never>, Scalars['DateTime'] | string>,
    laboratoryInstrument?: GraphCacheResolver<WithTypename<InstrumentCalibrationType>, Record<string, never>, WithTypename<LaboratoryInstrumentType> | string>,
    laboratoryInstrumentUid?: GraphCacheResolver<WithTypename<InstrumentCalibrationType>, Record<string, never>, Scalars['String'] | string>,
    notesBefore?: GraphCacheResolver<WithTypename<InstrumentCalibrationType>, Record<string, never>, Scalars['String'] | string>,
    performedBy?: GraphCacheResolver<WithTypename<InstrumentCalibrationType>, Record<string, never>, Scalars['String'] | string>,
    remarks?: GraphCacheResolver<WithTypename<InstrumentCalibrationType>, Record<string, never>, Scalars['String'] | string>,
    reportId?: GraphCacheResolver<WithTypename<InstrumentCalibrationType>, Record<string, never>, Scalars['String'] | string>,
    startDate?: GraphCacheResolver<WithTypename<InstrumentCalibrationType>, Record<string, never>, Scalars['DateTime'] | string>,
    uid?: GraphCacheResolver<WithTypename<InstrumentCalibrationType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<InstrumentCalibrationType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<InstrumentCalibrationType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<InstrumentCalibrationType>, Record<string, never>, Scalars['String'] | string>,
    workDone?: GraphCacheResolver<WithTypename<InstrumentCalibrationType>, Record<string, never>, Scalars['String'] | string>
  },
  InstrumentCompetenceType?: {
    competence?: GraphCacheResolver<WithTypename<InstrumentCompetenceType>, Record<string, never>, Scalars['BytesScalar'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<InstrumentCompetenceType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<InstrumentCompetenceType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<InstrumentCompetenceType>, Record<string, never>, Scalars['String'] | string>,
    description?: GraphCacheResolver<WithTypename<InstrumentCompetenceType>, Record<string, never>, Scalars['String'] | string>,
    expiryDate?: GraphCacheResolver<WithTypename<InstrumentCompetenceType>, Record<string, never>, Scalars['DateTime'] | string>,
    instrument?: GraphCacheResolver<WithTypename<InstrumentCompetenceType>, Record<string, never>, WithTypename<InstrumentType> | string>,
    instrumentUid?: GraphCacheResolver<WithTypename<InstrumentCompetenceType>, Record<string, never>, Scalars['String'] | string>,
    internal?: GraphCacheResolver<WithTypename<InstrumentCompetenceType>, Record<string, never>, Scalars['Boolean'] | string>,
    issueDate?: GraphCacheResolver<WithTypename<InstrumentCompetenceType>, Record<string, never>, Scalars['DateTime'] | string>,
    uid?: GraphCacheResolver<WithTypename<InstrumentCompetenceType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<InstrumentCompetenceType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<InstrumentCompetenceType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<InstrumentCompetenceType>, Record<string, never>, Scalars['String'] | string>,
    user?: GraphCacheResolver<WithTypename<InstrumentCompetenceType>, Record<string, never>, WithTypename<UserType> | string>,
    userUid?: GraphCacheResolver<WithTypename<InstrumentCompetenceType>, Record<string, never>, Scalars['String'] | string>
  },
  InstrumentCursorPage?: {
    edges?: GraphCacheResolver<WithTypename<InstrumentCursorPage>, Record<string, never>, Array<WithTypename<InstrumentEdge> | string>>,
    items?: GraphCacheResolver<WithTypename<InstrumentCursorPage>, Record<string, never>, Array<WithTypename<InstrumentType> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<InstrumentCursorPage>, Record<string, never>, WithTypename<PageInfo> | string>,
    totalCount?: GraphCacheResolver<WithTypename<InstrumentCursorPage>, Record<string, never>, Scalars['Int'] | string>
  },
  InstrumentEdge?: {
    cursor?: GraphCacheResolver<WithTypename<InstrumentEdge>, Record<string, never>, Scalars['String'] | string>,
    node?: GraphCacheResolver<WithTypename<InstrumentEdge>, Record<string, never>, WithTypename<InstrumentType> | string>
  },
  InstrumentType?: {
    createdAt?: GraphCacheResolver<WithTypename<InstrumentType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<InstrumentType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<InstrumentType>, Record<string, never>, Scalars['String'] | string>,
    description?: GraphCacheResolver<WithTypename<InstrumentType>, Record<string, never>, Scalars['String'] | string>,
    instrumentType?: GraphCacheResolver<WithTypename<InstrumentType>, Record<string, never>, WithTypename<InstrumentTypeType> | string>,
    instrumentTypeUid?: GraphCacheResolver<WithTypename<InstrumentType>, Record<string, never>, Scalars['String'] | string>,
    keyword?: GraphCacheResolver<WithTypename<InstrumentType>, Record<string, never>, Scalars['String'] | string>,
    laboratoryInstruments?: GraphCacheResolver<WithTypename<InstrumentType>, Record<string, never>, Array<WithTypename<LaboratoryInstrumentType> | string>>,
    manufacturer?: GraphCacheResolver<WithTypename<InstrumentType>, Record<string, never>, WithTypename<ManufacturerType> | string>,
    manufacturerUid?: GraphCacheResolver<WithTypename<InstrumentType>, Record<string, never>, Scalars['String'] | string>,
    methods?: GraphCacheResolver<WithTypename<InstrumentType>, Record<string, never>, Array<WithTypename<MethodType> | string>>,
    name?: GraphCacheResolver<WithTypename<InstrumentType>, Record<string, never>, Scalars['String'] | string>,
    supplier?: GraphCacheResolver<WithTypename<InstrumentType>, Record<string, never>, WithTypename<SupplierType> | string>,
    supplierUid?: GraphCacheResolver<WithTypename<InstrumentType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<InstrumentType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<InstrumentType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<InstrumentType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<InstrumentType>, Record<string, never>, Scalars['String'] | string>
  },
  InstrumentTypeCursorPage?: {
    edges?: GraphCacheResolver<WithTypename<InstrumentTypeCursorPage>, Record<string, never>, Array<WithTypename<InstrumentTypeEdge> | string>>,
    items?: GraphCacheResolver<WithTypename<InstrumentTypeCursorPage>, Record<string, never>, Array<WithTypename<InstrumentTypeType> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<InstrumentTypeCursorPage>, Record<string, never>, WithTypename<PageInfo> | string>,
    totalCount?: GraphCacheResolver<WithTypename<InstrumentTypeCursorPage>, Record<string, never>, Scalars['Int'] | string>
  },
  InstrumentTypeEdge?: {
    cursor?: GraphCacheResolver<WithTypename<InstrumentTypeEdge>, Record<string, never>, Scalars['String'] | string>,
    node?: GraphCacheResolver<WithTypename<InstrumentTypeEdge>, Record<string, never>, WithTypename<InstrumentTypeType> | string>
  },
  InstrumentTypeType?: {
    createdAt?: GraphCacheResolver<WithTypename<InstrumentTypeType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<InstrumentTypeType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<InstrumentTypeType>, Record<string, never>, Scalars['String'] | string>,
    description?: GraphCacheResolver<WithTypename<InstrumentTypeType>, Record<string, never>, Scalars['String'] | string>,
    name?: GraphCacheResolver<WithTypename<InstrumentTypeType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<InstrumentTypeType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<InstrumentTypeType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<InstrumentTypeType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<InstrumentTypeType>, Record<string, never>, Scalars['String'] | string>
  },
  LaboratoryInstrumentCursorPage?: {
    edges?: GraphCacheResolver<WithTypename<LaboratoryInstrumentCursorPage>, Record<string, never>, Array<WithTypename<LaboratoryInstrumentEdge> | string>>,
    items?: GraphCacheResolver<WithTypename<LaboratoryInstrumentCursorPage>, Record<string, never>, Array<WithTypename<LaboratoryInstrumentType> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<LaboratoryInstrumentCursorPage>, Record<string, never>, WithTypename<PageInfo> | string>,
    totalCount?: GraphCacheResolver<WithTypename<LaboratoryInstrumentCursorPage>, Record<string, never>, Scalars['Int'] | string>
  },
  LaboratoryInstrumentEdge?: {
    cursor?: GraphCacheResolver<WithTypename<LaboratoryInstrumentEdge>, Record<string, never>, Scalars['String'] | string>,
    node?: GraphCacheResolver<WithTypename<LaboratoryInstrumentEdge>, Record<string, never>, WithTypename<LaboratoryInstrumentType> | string>
  },
  LaboratoryInstrumentType?: {
    createdAt?: GraphCacheResolver<WithTypename<LaboratoryInstrumentType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<LaboratoryInstrumentType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<LaboratoryInstrumentType>, Record<string, never>, Scalars['String'] | string>,
    dateCommissioned?: GraphCacheResolver<WithTypename<LaboratoryInstrumentType>, Record<string, never>, Scalars['DateTime'] | string>,
    dateDecommissioned?: GraphCacheResolver<WithTypename<LaboratoryInstrumentType>, Record<string, never>, Scalars['DateTime'] | string>,
    instrument?: GraphCacheResolver<WithTypename<LaboratoryInstrumentType>, Record<string, never>, WithTypename<InstrumentType> | string>,
    instrumentUid?: GraphCacheResolver<WithTypename<LaboratoryInstrumentType>, Record<string, never>, Scalars['String'] | string>,
    labName?: GraphCacheResolver<WithTypename<LaboratoryInstrumentType>, Record<string, never>, Scalars['String'] | string>,
    serialNumber?: GraphCacheResolver<WithTypename<LaboratoryInstrumentType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<LaboratoryInstrumentType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<LaboratoryInstrumentType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<LaboratoryInstrumentType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<LaboratoryInstrumentType>, Record<string, never>, Scalars['String'] | string>
  },
  LaboratorySettingType?: {
    allowAutoBilling?: GraphCacheResolver<WithTypename<LaboratorySettingType>, Record<string, never>, Scalars['Boolean'] | string>,
    allowBilling?: GraphCacheResolver<WithTypename<LaboratorySettingType>, Record<string, never>, Scalars['Boolean'] | string>,
    allowPatientRegistration?: GraphCacheResolver<WithTypename<LaboratorySettingType>, Record<string, never>, Scalars['Boolean'] | string>,
    allowSampleRegistration?: GraphCacheResolver<WithTypename<LaboratorySettingType>, Record<string, never>, Scalars['Boolean'] | string>,
    allowSelfVerification?: GraphCacheResolver<WithTypename<LaboratorySettingType>, Record<string, never>, Scalars['Boolean'] | string>,
    allowWorksheetCreation?: GraphCacheResolver<WithTypename<LaboratorySettingType>, Record<string, never>, Scalars['Boolean'] | string>,
    autoReceiveSamples?: GraphCacheResolver<WithTypename<LaboratorySettingType>, Record<string, never>, Scalars['Boolean'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<LaboratorySettingType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<LaboratorySettingType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<LaboratorySettingType>, Record<string, never>, Scalars['String'] | string>,
    currency?: GraphCacheResolver<WithTypename<LaboratorySettingType>, Record<string, never>, Scalars['String'] | string>,
    defaultRoute?: GraphCacheResolver<WithTypename<LaboratorySettingType>, Record<string, never>, Scalars['String'] | string>,
    defaultTatMinutes?: GraphCacheResolver<WithTypename<LaboratorySettingType>, Record<string, never>, Scalars['Int'] | string>,
    defaultTheme?: GraphCacheResolver<WithTypename<LaboratorySettingType>, Record<string, never>, Scalars['String'] | string>,
    inactivityLogOut?: GraphCacheResolver<WithTypename<LaboratorySettingType>, Record<string, never>, Scalars['Int'] | string>,
    laboratory?: GraphCacheResolver<WithTypename<LaboratorySettingType>, Record<string, never>, WithTypename<LaboratoryType> | string>,
    laboratoryUid?: GraphCacheResolver<WithTypename<LaboratorySettingType>, Record<string, never>, Scalars['String'] | string>,
    passwordLifetime?: GraphCacheResolver<WithTypename<LaboratorySettingType>, Record<string, never>, Scalars['Int'] | string>,
    paymentTermsDays?: GraphCacheResolver<WithTypename<LaboratorySettingType>, Record<string, never>, Scalars['Int'] | string>,
    stickerCopies?: GraphCacheResolver<WithTypename<LaboratorySettingType>, Record<string, never>, Scalars['Int'] | string>,
    uid?: GraphCacheResolver<WithTypename<LaboratorySettingType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<LaboratorySettingType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<LaboratorySettingType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<LaboratorySettingType>, Record<string, never>, Scalars['String'] | string>
  },
  LaboratoryType?: {
    address?: GraphCacheResolver<WithTypename<LaboratoryType>, Record<string, never>, Scalars['String'] | string>,
    banking?: GraphCacheResolver<WithTypename<LaboratoryType>, Record<string, never>, Scalars['String'] | string>,
    businessPhone?: GraphCacheResolver<WithTypename<LaboratoryType>, Record<string, never>, Scalars['String'] | string>,
    code?: GraphCacheResolver<WithTypename<LaboratoryType>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<LaboratoryType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<LaboratoryType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<LaboratoryType>, Record<string, never>, Scalars['String'] | string>,
    email?: GraphCacheResolver<WithTypename<LaboratoryType>, Record<string, never>, Scalars['String'] | string>,
    emailCc?: GraphCacheResolver<WithTypename<LaboratoryType>, Record<string, never>, Scalars['String'] | string>,
    labManager?: GraphCacheResolver<WithTypename<LaboratoryType>, Record<string, never>, WithTypename<UserType> | string>,
    labManagerUid?: GraphCacheResolver<WithTypename<LaboratoryType>, Record<string, never>, Scalars['String'] | string>,
    labName?: GraphCacheResolver<WithTypename<LaboratoryType>, Record<string, never>, Scalars['String'] | string>,
    logo?: GraphCacheResolver<WithTypename<LaboratoryType>, Record<string, never>, Scalars['String'] | string>,
    mobilePhone?: GraphCacheResolver<WithTypename<LaboratoryType>, Record<string, never>, Scalars['String'] | string>,
    qualityStatement?: GraphCacheResolver<WithTypename<LaboratoryType>, Record<string, never>, Scalars['String'] | string>,
    setupName?: GraphCacheResolver<WithTypename<LaboratoryType>, Record<string, never>, Scalars['String'] | string>,
    tagLine?: GraphCacheResolver<WithTypename<LaboratoryType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<LaboratoryType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<LaboratoryType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<LaboratoryType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<LaboratoryType>, Record<string, never>, Scalars['String'] | string>
  },
  LaggardCounts?: {
    graterThanThirty?: GraphCacheResolver<WithTypename<LaggardCounts>, Record<string, never>, Scalars['Int'] | string>,
    lessThanTen?: GraphCacheResolver<WithTypename<LaggardCounts>, Record<string, never>, Scalars['Int'] | string>,
    tenToTwenty?: GraphCacheResolver<WithTypename<LaggardCounts>, Record<string, never>, Scalars['Int'] | string>,
    totalDelayed?: GraphCacheResolver<WithTypename<LaggardCounts>, Record<string, never>, Scalars['Int'] | string>,
    totalIncomplete?: GraphCacheResolver<WithTypename<LaggardCounts>, Record<string, never>, Scalars['Int'] | string>,
    totalNotDelayed?: GraphCacheResolver<WithTypename<LaggardCounts>, Record<string, never>, Scalars['Int'] | string>,
    twentyToThirty?: GraphCacheResolver<WithTypename<LaggardCounts>, Record<string, never>, Scalars['Int'] | string>
  },
  LaggardData?: {
    category?: GraphCacheResolver<WithTypename<LaggardData>, Record<string, never>, Scalars['String'] | string>,
    counts?: GraphCacheResolver<WithTypename<LaggardData>, Record<string, never>, WithTypename<LaggardCounts> | string>
  },
  LaggardStatistics?: {
    data?: GraphCacheResolver<WithTypename<LaggardStatistics>, Record<string, never>, Array<WithTypename<LaggardData> | string>>
  },
  ManufacturerType?: {
    createdAt?: GraphCacheResolver<WithTypename<ManufacturerType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<ManufacturerType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<ManufacturerType>, Record<string, never>, Scalars['String'] | string>,
    description?: GraphCacheResolver<WithTypename<ManufacturerType>, Record<string, never>, Scalars['String'] | string>,
    name?: GraphCacheResolver<WithTypename<ManufacturerType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<ManufacturerType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<ManufacturerType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<ManufacturerType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<ManufacturerType>, Record<string, never>, Scalars['String'] | string>
  },
  MessageThreadType?: {
    broadcast?: GraphCacheResolver<WithTypename<MessageThreadType>, Record<string, never>, Scalars['Boolean'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<MessageThreadType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<MessageThreadType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<MessageThreadType>, Record<string, never>, Scalars['String'] | string>,
    deletedBy?: GraphCacheResolver<WithTypename<MessageThreadType>, Record<string, never>, Array<WithTypename<UserType> | string>>,
    messages?: GraphCacheResolver<WithTypename<MessageThreadType>, Record<string, never>, Array<WithTypename<MessageType> | string>>,
    recipients?: GraphCacheResolver<WithTypename<MessageThreadType>, Record<string, never>, Array<WithTypename<UserType> | string>>,
    uid?: GraphCacheResolver<WithTypename<MessageThreadType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<MessageThreadType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<MessageThreadType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<MessageThreadType>, Record<string, never>, Scalars['String'] | string>
  },
  MessageType?: {
    body?: GraphCacheResolver<WithTypename<MessageType>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<MessageType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<MessageType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<MessageType>, Record<string, never>, Scalars['String'] | string>,
    deletedBy?: GraphCacheResolver<WithTypename<MessageType>, Record<string, never>, Array<WithTypename<UserType> | string>>,
    left?: GraphCacheResolver<WithTypename<MessageType>, Record<string, never>, Scalars['Int'] | string>,
    parent?: GraphCacheResolver<WithTypename<MessageType>, Record<string, never>, WithTypename<MessageType> | string>,
    parentId?: GraphCacheResolver<WithTypename<MessageType>, Record<string, never>, Scalars['String'] | string>,
    right?: GraphCacheResolver<WithTypename<MessageType>, Record<string, never>, Scalars['Int'] | string>,
    thread?: GraphCacheResolver<WithTypename<MessageType>, Record<string, never>, WithTypename<MessageThreadType> | string>,
    threadUid?: GraphCacheResolver<WithTypename<MessageType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<MessageType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<MessageType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<MessageType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<MessageType>, Record<string, never>, Scalars['String'] | string>,
    viewers?: GraphCacheResolver<WithTypename<MessageType>, Record<string, never>, Array<WithTypename<UserType> | string>>
  },
  MessagesType?: {
    message?: GraphCacheResolver<WithTypename<MessagesType>, Record<string, never>, Scalars['String'] | string>
  },
  MethodCursorPage?: {
    edges?: GraphCacheResolver<WithTypename<MethodCursorPage>, Record<string, never>, Array<WithTypename<MethodEdge> | string>>,
    items?: GraphCacheResolver<WithTypename<MethodCursorPage>, Record<string, never>, Array<WithTypename<MethodType> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<MethodCursorPage>, Record<string, never>, WithTypename<PageInfo> | string>,
    totalCount?: GraphCacheResolver<WithTypename<MethodCursorPage>, Record<string, never>, Scalars['Int'] | string>
  },
  MethodEdge?: {
    cursor?: GraphCacheResolver<WithTypename<MethodEdge>, Record<string, never>, Scalars['String'] | string>,
    node?: GraphCacheResolver<WithTypename<MethodEdge>, Record<string, never>, WithTypename<MethodType> | string>
  },
  MethodType?: {
    createdAt?: GraphCacheResolver<WithTypename<MethodType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<MethodType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<MethodType>, Record<string, never>, Scalars['String'] | string>,
    description?: GraphCacheResolver<WithTypename<MethodType>, Record<string, never>, Scalars['String'] | string>,
    instruments?: GraphCacheResolver<WithTypename<MethodType>, Record<string, never>, Array<WithTypename<InstrumentType> | string>>,
    keyword?: GraphCacheResolver<WithTypename<MethodType>, Record<string, never>, Scalars['String'] | string>,
    name?: GraphCacheResolver<WithTypename<MethodType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<MethodType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<MethodType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<MethodType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<MethodType>, Record<string, never>, Scalars['String'] | string>
  },
  Nothing?: {
    data?: GraphCacheResolver<WithTypename<Nothing>, Record<string, never>, Scalars['String'] | string>
  },
  NoticeType?: {
    body?: GraphCacheResolver<WithTypename<NoticeType>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<NoticeType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<NoticeType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<NoticeType>, Record<string, never>, Scalars['String'] | string>,
    departments?: GraphCacheResolver<WithTypename<NoticeType>, Record<string, never>, Array<WithTypename<DepartmentType> | string>>,
    expiry?: GraphCacheResolver<WithTypename<NoticeType>, Record<string, never>, Scalars['String'] | string>,
    groups?: GraphCacheResolver<WithTypename<NoticeType>, Record<string, never>, Array<WithTypename<GroupType> | string>>,
    title?: GraphCacheResolver<WithTypename<NoticeType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<NoticeType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<NoticeType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<NoticeType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<NoticeType>, Record<string, never>, Scalars['String'] | string>,
    viewers?: GraphCacheResolver<WithTypename<NoticeType>, Record<string, never>, Array<WithTypename<UserType> | string>>
  },
  NotificationType?: {
    createdAt?: GraphCacheResolver<WithTypename<NotificationType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<NotificationType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<NotificationType>, Record<string, never>, Scalars['String'] | string>,
    departments?: GraphCacheResolver<WithTypename<NotificationType>, Record<string, never>, WithTypename<DepartmentType> | string>,
    groups?: GraphCacheResolver<WithTypename<NotificationType>, Record<string, never>, WithTypename<GroupType> | string>,
    message?: GraphCacheResolver<WithTypename<NotificationType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<NotificationType>, Record<string, never>, Scalars['String'] | string>,
    users?: GraphCacheResolver<WithTypename<NotificationType>, Record<string, never>, WithTypename<UserType> | string>,
    viewers?: GraphCacheResolver<WithTypename<NotificationType>, Record<string, never>, WithTypename<UserType> | string>
  },
  OperationError?: {
    error?: GraphCacheResolver<WithTypename<OperationError>, Record<string, never>, Scalars['String'] | string>,
    suggestion?: GraphCacheResolver<WithTypename<OperationError>, Record<string, never>, Scalars['String'] | string>
  },
  OperationSuccess?: {
    message?: GraphCacheResolver<WithTypename<OperationSuccess>, Record<string, never>, Scalars['String'] | string>
  },
  PageInfo?: {
    endCursor?: GraphCacheResolver<WithTypename<PageInfo>, Record<string, never>, Scalars['String'] | string>,
    hasNextPage?: GraphCacheResolver<WithTypename<PageInfo>, Record<string, never>, Scalars['Boolean'] | string>,
    hasPreviousPage?: GraphCacheResolver<WithTypename<PageInfo>, Record<string, never>, Scalars['Boolean'] | string>,
    startCursor?: GraphCacheResolver<WithTypename<PageInfo>, Record<string, never>, Scalars['String'] | string>
  },
  PasswordResetValidityType?: {
    authUid?: GraphCacheResolver<WithTypename<PasswordResetValidityType>, Record<string, never>, Scalars['String'] | string>,
    username?: GraphCacheResolver<WithTypename<PasswordResetValidityType>, Record<string, never>, Scalars['String'] | string>
  },
  PatientCursorPage?: {
    edges?: GraphCacheResolver<WithTypename<PatientCursorPage>, Record<string, never>, Array<WithTypename<PatientEdge> | string>>,
    items?: GraphCacheResolver<WithTypename<PatientCursorPage>, Record<string, never>, Array<WithTypename<PatientType> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<PatientCursorPage>, Record<string, never>, WithTypename<PageInfo> | string>,
    totalCount?: GraphCacheResolver<WithTypename<PatientCursorPage>, Record<string, never>, Scalars['Int'] | string>
  },
  PatientEdge?: {
    cursor?: GraphCacheResolver<WithTypename<PatientEdge>, Record<string, never>, Scalars['String'] | string>,
    node?: GraphCacheResolver<WithTypename<PatientEdge>, Record<string, never>, WithTypename<PatientType> | string>
  },
  PatientIdentificationType?: {
    createdAt?: GraphCacheResolver<WithTypename<PatientIdentificationType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<PatientIdentificationType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<PatientIdentificationType>, Record<string, never>, Scalars['String'] | string>,
    identification?: GraphCacheResolver<WithTypename<PatientIdentificationType>, Record<string, never>, WithTypename<IdentificationType> | string>,
    identificationUid?: GraphCacheResolver<WithTypename<PatientIdentificationType>, Record<string, never>, Scalars['String'] | string>,
    patientUid?: GraphCacheResolver<WithTypename<PatientIdentificationType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<PatientIdentificationType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<PatientIdentificationType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<PatientIdentificationType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<PatientIdentificationType>, Record<string, never>, Scalars['String'] | string>,
    value?: GraphCacheResolver<WithTypename<PatientIdentificationType>, Record<string, never>, Scalars['String'] | string>
  },
  PatientType?: {
    active?: GraphCacheResolver<WithTypename<PatientType>, Record<string, never>, Scalars['Boolean'] | string>,
    age?: GraphCacheResolver<WithTypename<PatientType>, Record<string, never>, Scalars['Int'] | string>,
    ageDobEstimated?: GraphCacheResolver<WithTypename<PatientType>, Record<string, never>, Scalars['Boolean'] | string>,
    client?: GraphCacheResolver<WithTypename<PatientType>, Record<string, never>, WithTypename<ClientType> | string>,
    clientPatientId?: GraphCacheResolver<WithTypename<PatientType>, Record<string, never>, Scalars['String'] | string>,
    clientUid?: GraphCacheResolver<WithTypename<PatientType>, Record<string, never>, Scalars['String'] | string>,
    consentSms?: GraphCacheResolver<WithTypename<PatientType>, Record<string, never>, Scalars['Boolean'] | string>,
    country?: GraphCacheResolver<WithTypename<PatientType>, Record<string, never>, WithTypename<CountryType> | string>,
    countryUid?: GraphCacheResolver<WithTypename<PatientType>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<PatientType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<PatientType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<PatientType>, Record<string, never>, Scalars['String'] | string>,
    dateOfBirth?: GraphCacheResolver<WithTypename<PatientType>, Record<string, never>, Scalars['DateTime'] | string>,
    district?: GraphCacheResolver<WithTypename<PatientType>, Record<string, never>, WithTypename<DistrictType> | string>,
    districtUid?: GraphCacheResolver<WithTypename<PatientType>, Record<string, never>, Scalars['String'] | string>,
    email?: GraphCacheResolver<WithTypename<PatientType>, Record<string, never>, Scalars['String'] | string>,
    firstName?: GraphCacheResolver<WithTypename<PatientType>, Record<string, never>, Scalars['String'] | string>,
    gender?: GraphCacheResolver<WithTypename<PatientType>, Record<string, never>, Scalars['String'] | string>,
    identifications?: GraphCacheResolver<WithTypename<PatientType>, Record<string, never>, Array<WithTypename<PatientIdentificationType> | string>>,
    internalUse?: GraphCacheResolver<WithTypename<PatientType>, Record<string, never>, Scalars['Boolean'] | string>,
    lastName?: GraphCacheResolver<WithTypename<PatientType>, Record<string, never>, Scalars['String'] | string>,
    metadataSnapshot?: GraphCacheResolver<WithTypename<PatientType>, Record<string, never>, Scalars['JSONScalar'] | string>,
    middleName?: GraphCacheResolver<WithTypename<PatientType>, Record<string, never>, Scalars['String'] | string>,
    patientId?: GraphCacheResolver<WithTypename<PatientType>, Record<string, never>, Scalars['String'] | string>,
    phoneHome?: GraphCacheResolver<WithTypename<PatientType>, Record<string, never>, Scalars['String'] | string>,
    phoneMobile?: GraphCacheResolver<WithTypename<PatientType>, Record<string, never>, Scalars['String'] | string>,
    province?: GraphCacheResolver<WithTypename<PatientType>, Record<string, never>, WithTypename<ProvinceType> | string>,
    provinceUid?: GraphCacheResolver<WithTypename<PatientType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<PatientType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<PatientType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<PatientType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<PatientType>, Record<string, never>, Scalars['String'] | string>
  },
  PermissionType?: {
    action?: GraphCacheResolver<WithTypename<PermissionType>, Record<string, never>, Scalars['String'] | string>,
    active?: GraphCacheResolver<WithTypename<PermissionType>, Record<string, never>, Scalars['Boolean'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<PermissionType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<PermissionType>, Record<string, never>, WithTypename<PermissionType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<PermissionType>, Record<string, never>, Scalars['String'] | string>,
    target?: GraphCacheResolver<WithTypename<PermissionType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<PermissionType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<PermissionType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<PermissionType>, Record<string, never>, WithTypename<PermissionType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<PermissionType>, Record<string, never>, Scalars['String'] | string>
  },
  ProcessCounts?: {
    avgExtraDays?: GraphCacheResolver<WithTypename<ProcessCounts>, Record<string, never>, Scalars['Int'] | string>,
    processAverage?: GraphCacheResolver<WithTypename<ProcessCounts>, Record<string, never>, Scalars['Int'] | string>,
    service?: GraphCacheResolver<WithTypename<ProcessCounts>, Record<string, never>, Scalars['String'] | string>,
    totalLate?: GraphCacheResolver<WithTypename<ProcessCounts>, Record<string, never>, Scalars['Int'] | string>,
    totalNotLate?: GraphCacheResolver<WithTypename<ProcessCounts>, Record<string, never>, Scalars['Int'] | string>,
    totalSamples?: GraphCacheResolver<WithTypename<ProcessCounts>, Record<string, never>, Scalars['Int'] | string>
  },
  ProcessData?: {
    counts?: GraphCacheResolver<WithTypename<ProcessData>, Record<string, never>, WithTypename<ProcessCounts> | string>,
    groups?: GraphCacheResolver<WithTypename<ProcessData>, Record<string, never>, Array<WithTypename<ProcessCounts> | string>>,
    process?: GraphCacheResolver<WithTypename<ProcessData>, Record<string, never>, Scalars['String'] | string>
  },
  ProcessStatistics?: {
    data?: GraphCacheResolver<WithTypename<ProcessStatistics>, Record<string, never>, Array<WithTypename<ProcessData> | string>>
  },
  ProfileDiscountType?: {
    createdAt?: GraphCacheResolver<WithTypename<ProfileDiscountType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<ProfileDiscountType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<ProfileDiscountType>, Record<string, never>, Scalars['String'] | string>,
    discountType?: GraphCacheResolver<WithTypename<ProfileDiscountType>, Record<string, never>, Scalars['String'] | string>,
    endDate?: GraphCacheResolver<WithTypename<ProfileDiscountType>, Record<string, never>, Scalars['DateTime'] | string>,
    isActive?: GraphCacheResolver<WithTypename<ProfileDiscountType>, Record<string, never>, Scalars['Boolean'] | string>,
    name?: GraphCacheResolver<WithTypename<ProfileDiscountType>, Record<string, never>, Scalars['String'] | string>,
    profile?: GraphCacheResolver<WithTypename<ProfileDiscountType>, Record<string, never>, WithTypename<ProfileType> | string>,
    profileUid?: GraphCacheResolver<WithTypename<ProfileDiscountType>, Record<string, never>, Scalars['String'] | string>,
    startDate?: GraphCacheResolver<WithTypename<ProfileDiscountType>, Record<string, never>, Scalars['DateTime'] | string>,
    uid?: GraphCacheResolver<WithTypename<ProfileDiscountType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<ProfileDiscountType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<ProfileDiscountType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<ProfileDiscountType>, Record<string, never>, Scalars['String'] | string>,
    valueAmount?: GraphCacheResolver<WithTypename<ProfileDiscountType>, Record<string, never>, Scalars['Float'] | string>,
    valuePercent?: GraphCacheResolver<WithTypename<ProfileDiscountType>, Record<string, never>, Scalars['Float'] | string>,
    valueType?: GraphCacheResolver<WithTypename<ProfileDiscountType>, Record<string, never>, Scalars['String'] | string>,
    voucher?: GraphCacheResolver<WithTypename<ProfileDiscountType>, Record<string, never>, WithTypename<VoucherType> | string>,
    voucherUid?: GraphCacheResolver<WithTypename<ProfileDiscountType>, Record<string, never>, Scalars['String'] | string>
  },
  ProfileMappingType?: {
    code?: GraphCacheResolver<WithTypename<ProfileMappingType>, Record<string, never>, Scalars['String'] | string>,
    codingStandard?: GraphCacheResolver<WithTypename<ProfileMappingType>, Record<string, never>, WithTypename<CodingStandardType> | string>,
    codingStandardUid?: GraphCacheResolver<WithTypename<ProfileMappingType>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<ProfileMappingType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<ProfileMappingType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<ProfileMappingType>, Record<string, never>, Scalars['String'] | string>,
    description?: GraphCacheResolver<WithTypename<ProfileMappingType>, Record<string, never>, Scalars['String'] | string>,
    name?: GraphCacheResolver<WithTypename<ProfileMappingType>, Record<string, never>, Scalars['String'] | string>,
    profile?: GraphCacheResolver<WithTypename<ProfileMappingType>, Record<string, never>, WithTypename<ProfileType> | string>,
    profileUid?: GraphCacheResolver<WithTypename<ProfileMappingType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<ProfileMappingType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<ProfileMappingType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<ProfileMappingType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<ProfileMappingType>, Record<string, never>, Scalars['String'] | string>
  },
  ProfilePriceType?: {
    amount?: GraphCacheResolver<WithTypename<ProfilePriceType>, Record<string, never>, Scalars['Float'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<ProfilePriceType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<ProfilePriceType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<ProfilePriceType>, Record<string, never>, Scalars['String'] | string>,
    isActive?: GraphCacheResolver<WithTypename<ProfilePriceType>, Record<string, never>, Scalars['Boolean'] | string>,
    profile?: GraphCacheResolver<WithTypename<ProfilePriceType>, Record<string, never>, WithTypename<ProfileType> | string>,
    profileUid?: GraphCacheResolver<WithTypename<ProfilePriceType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<ProfilePriceType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<ProfilePriceType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<ProfilePriceType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<ProfilePriceType>, Record<string, never>, Scalars['String'] | string>
  },
  ProfileType?: {
    active?: GraphCacheResolver<WithTypename<ProfileType>, Record<string, never>, Scalars['Boolean'] | string>,
    analyses?: GraphCacheResolver<WithTypename<ProfileType>, Record<string, never>, Array<WithTypename<AnalysisType> | string>>,
    createdAt?: GraphCacheResolver<WithTypename<ProfileType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<ProfileType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<ProfileType>, Record<string, never>, Scalars['String'] | string>,
    department?: GraphCacheResolver<WithTypename<ProfileType>, Record<string, never>, WithTypename<DepartmentType> | string>,
    departmentUid?: GraphCacheResolver<WithTypename<ProfileType>, Record<string, never>, Scalars['String'] | string>,
    description?: GraphCacheResolver<WithTypename<ProfileType>, Record<string, never>, Scalars['String'] | string>,
    keyword?: GraphCacheResolver<WithTypename<ProfileType>, Record<string, never>, Scalars['String'] | string>,
    name?: GraphCacheResolver<WithTypename<ProfileType>, Record<string, never>, Scalars['String'] | string>,
    sampleTypes?: GraphCacheResolver<WithTypename<ProfileType>, Record<string, never>, Array<WithTypename<SampleTypeTyp> | string>>,
    tatLengthMinutes?: GraphCacheResolver<WithTypename<ProfileType>, Record<string, never>, Scalars['Int'] | string>,
    uid?: GraphCacheResolver<WithTypename<ProfileType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<ProfileType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<ProfileType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<ProfileType>, Record<string, never>, Scalars['String'] | string>
  },
  ProvinceCursorPage?: {
    edges?: GraphCacheResolver<WithTypename<ProvinceCursorPage>, Record<string, never>, Array<WithTypename<ProvinceEdge> | string>>,
    items?: GraphCacheResolver<WithTypename<ProvinceCursorPage>, Record<string, never>, Array<WithTypename<ProvinceType> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<ProvinceCursorPage>, Record<string, never>, WithTypename<PageInfo> | string>,
    totalCount?: GraphCacheResolver<WithTypename<ProvinceCursorPage>, Record<string, never>, Scalars['Int'] | string>
  },
  ProvinceEdge?: {
    cursor?: GraphCacheResolver<WithTypename<ProvinceEdge>, Record<string, never>, Scalars['String'] | string>,
    node?: GraphCacheResolver<WithTypename<ProvinceEdge>, Record<string, never>, WithTypename<ProvinceType> | string>
  },
  ProvinceType?: {
    active?: GraphCacheResolver<WithTypename<ProvinceType>, Record<string, never>, Scalars['Boolean'] | string>,
    businessPhone?: GraphCacheResolver<WithTypename<ProvinceType>, Record<string, never>, Scalars['String'] | string>,
    code?: GraphCacheResolver<WithTypename<ProvinceType>, Record<string, never>, Scalars['String'] | string>,
    country?: GraphCacheResolver<WithTypename<ProvinceType>, Record<string, never>, WithTypename<CountryType> | string>,
    countryUid?: GraphCacheResolver<WithTypename<ProvinceType>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<ProvinceType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<ProvinceType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<ProvinceType>, Record<string, never>, Scalars['String'] | string>,
    email?: GraphCacheResolver<WithTypename<ProvinceType>, Record<string, never>, Scalars['String'] | string>,
    emailCc?: GraphCacheResolver<WithTypename<ProvinceType>, Record<string, never>, Scalars['String'] | string>,
    mobilePhone?: GraphCacheResolver<WithTypename<ProvinceType>, Record<string, never>, Scalars['String'] | string>,
    name?: GraphCacheResolver<WithTypename<ProvinceType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<ProvinceType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<ProvinceType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<ProvinceType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<ProvinceType>, Record<string, never>, Scalars['String'] | string>
  },
  QCLevelType?: {
    createdAt?: GraphCacheResolver<WithTypename<QcLevelType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<QcLevelType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<QcLevelType>, Record<string, never>, Scalars['String'] | string>,
    level?: GraphCacheResolver<WithTypename<QcLevelType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<QcLevelType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<QcLevelType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<QcLevelType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<QcLevelType>, Record<string, never>, Scalars['String'] | string>
  },
  QCSetCursorPage?: {
    edges?: GraphCacheResolver<WithTypename<QcSetCursorPage>, Record<string, never>, Array<WithTypename<QcSetEdge> | string>>,
    items?: GraphCacheResolver<WithTypename<QcSetCursorPage>, Record<string, never>, Array<WithTypename<QcSetWithSamples> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<QcSetCursorPage>, Record<string, never>, WithTypename<PageInfo> | string>,
    totalCount?: GraphCacheResolver<WithTypename<QcSetCursorPage>, Record<string, never>, Scalars['Int'] | string>
  },
  QCSetEdge?: {
    cursor?: GraphCacheResolver<WithTypename<QcSetEdge>, Record<string, never>, Scalars['String'] | string>,
    node?: GraphCacheResolver<WithTypename<QcSetEdge>, Record<string, never>, WithTypename<QcSetWithSamples> | string>
  },
  QCSetType?: {
    createdAt?: GraphCacheResolver<WithTypename<QcSetType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<QcSetType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<QcSetType>, Record<string, never>, Scalars['String'] | string>,
    name?: GraphCacheResolver<WithTypename<QcSetType>, Record<string, never>, Scalars['String'] | string>,
    note?: GraphCacheResolver<WithTypename<QcSetType>, Record<string, never>, Scalars['String'] | string>,
    status?: GraphCacheResolver<WithTypename<QcSetType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<QcSetType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<QcSetType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<QcSetType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<QcSetType>, Record<string, never>, Scalars['String'] | string>
  },
  QCSetWithSamples?: {
    createdAt?: GraphCacheResolver<WithTypename<QcSetWithSamples>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<QcSetWithSamples>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<QcSetWithSamples>, Record<string, never>, Scalars['String'] | string>,
    name?: GraphCacheResolver<WithTypename<QcSetWithSamples>, Record<string, never>, Scalars['String'] | string>,
    note?: GraphCacheResolver<WithTypename<QcSetWithSamples>, Record<string, never>, Scalars['String'] | string>,
    samples?: GraphCacheResolver<WithTypename<QcSetWithSamples>, Record<string, never>, Array<WithTypename<SamplesWithResults> | string>>,
    status?: GraphCacheResolver<WithTypename<QcSetWithSamples>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<QcSetWithSamples>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<QcSetWithSamples>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<QcSetWithSamples>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<QcSetWithSamples>, Record<string, never>, Scalars['String'] | string>
  },
  QCTemplateType?: {
    createdAt?: GraphCacheResolver<WithTypename<QcTemplateType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<QcTemplateType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<QcTemplateType>, Record<string, never>, Scalars['String'] | string>,
    departments?: GraphCacheResolver<WithTypename<QcTemplateType>, Record<string, never>, Array<WithTypename<DepartmentType> | string>>,
    description?: GraphCacheResolver<WithTypename<QcTemplateType>, Record<string, never>, Scalars['String'] | string>,
    name?: GraphCacheResolver<WithTypename<QcTemplateType>, Record<string, never>, Scalars['String'] | string>,
    qcLevels?: GraphCacheResolver<WithTypename<QcTemplateType>, Record<string, never>, Array<WithTypename<QcLevelType> | string>>,
    uid?: GraphCacheResolver<WithTypename<QcTemplateType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<QcTemplateType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<QcTemplateType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<QcTemplateType>, Record<string, never>, Scalars['String'] | string>
  },
  ReferralLaboratoryType?: {
    code?: GraphCacheResolver<WithTypename<ReferralLaboratoryType>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<ReferralLaboratoryType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<ReferralLaboratoryType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<ReferralLaboratoryType>, Record<string, never>, Scalars['String'] | string>,
    isReference?: GraphCacheResolver<WithTypename<ReferralLaboratoryType>, Record<string, never>, Scalars['Boolean'] | string>,
    isReferral?: GraphCacheResolver<WithTypename<ReferralLaboratoryType>, Record<string, never>, Scalars['Boolean'] | string>,
    name?: GraphCacheResolver<WithTypename<ReferralLaboratoryType>, Record<string, never>, Scalars['String'] | string>,
    password?: GraphCacheResolver<WithTypename<ReferralLaboratoryType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<ReferralLaboratoryType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<ReferralLaboratoryType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<ReferralLaboratoryType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<ReferralLaboratoryType>, Record<string, never>, Scalars['String'] | string>,
    url?: GraphCacheResolver<WithTypename<ReferralLaboratoryType>, Record<string, never>, Scalars['String'] | string>,
    username?: GraphCacheResolver<WithTypename<ReferralLaboratoryType>, Record<string, never>, Scalars['String'] | string>
  },
  ReflexActionType?: {
    analyses?: GraphCacheResolver<WithTypename<ReflexActionType>, Record<string, never>, Array<WithTypename<AnalysisType> | string>>,
    brains?: GraphCacheResolver<WithTypename<ReflexActionType>, Record<string, never>, Array<WithTypename<ReflexBrainType> | string>>,
    createdAt?: GraphCacheResolver<WithTypename<ReflexActionType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<ReflexActionType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<ReflexActionType>, Record<string, never>, Scalars['String'] | string>,
    description?: GraphCacheResolver<WithTypename<ReflexActionType>, Record<string, never>, Scalars['String'] | string>,
    level?: GraphCacheResolver<WithTypename<ReflexActionType>, Record<string, never>, Scalars['Int'] | string>,
    reflexRule?: GraphCacheResolver<WithTypename<ReflexActionType>, Record<string, never>, WithTypename<ReflexRuleType> | string>,
    reflexRuleUid?: GraphCacheResolver<WithTypename<ReflexActionType>, Record<string, never>, Scalars['String'] | string>,
    sampleType?: GraphCacheResolver<WithTypename<ReflexActionType>, Record<string, never>, WithTypename<SampleTypeTyp> | string>,
    sampleTypeUid?: GraphCacheResolver<WithTypename<ReflexActionType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<ReflexActionType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<ReflexActionType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<ReflexActionType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<ReflexActionType>, Record<string, never>, Scalars['String'] | string>
  },
  ReflexBrainActionType?: {
    addNew?: GraphCacheResolver<WithTypename<ReflexBrainActionType>, Record<string, never>, Array<WithTypename<ReflexBrainAdditionType> | string>>,
    createdAt?: GraphCacheResolver<WithTypename<ReflexBrainActionType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<ReflexBrainActionType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<ReflexBrainActionType>, Record<string, never>, Scalars['String'] | string>,
    description?: GraphCacheResolver<WithTypename<ReflexBrainActionType>, Record<string, never>, Scalars['String'] | string>,
    finalise?: GraphCacheResolver<WithTypename<ReflexBrainActionType>, Record<string, never>, Array<WithTypename<ReflexBrainFinalType> | string>>,
    priority?: GraphCacheResolver<WithTypename<ReflexBrainActionType>, Record<string, never>, Scalars['Int'] | string>,
    reflexBrain?: GraphCacheResolver<WithTypename<ReflexBrainActionType>, Record<string, never>, WithTypename<ReflexBrainType> | string>,
    reflexBrainUid?: GraphCacheResolver<WithTypename<ReflexBrainActionType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<ReflexBrainActionType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<ReflexBrainActionType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<ReflexBrainActionType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<ReflexBrainActionType>, Record<string, never>, Scalars['String'] | string>
  },
  ReflexBrainAdditionType?: {
    analysis?: GraphCacheResolver<WithTypename<ReflexBrainAdditionType>, Record<string, never>, WithTypename<AnalysisType> | string>,
    analysisUid?: GraphCacheResolver<WithTypename<ReflexBrainAdditionType>, Record<string, never>, Scalars['String'] | string>,
    count?: GraphCacheResolver<WithTypename<ReflexBrainAdditionType>, Record<string, never>, Scalars['Int'] | string>,
    reflexBrainAction?: GraphCacheResolver<WithTypename<ReflexBrainAdditionType>, Record<string, never>, WithTypename<ReflexBrainActionType> | string>,
    reflexBrainActionUid?: GraphCacheResolver<WithTypename<ReflexBrainAdditionType>, Record<string, never>, Scalars['String'] | string>
  },
  ReflexBrainConditionCriteriaType?: {
    analysis?: GraphCacheResolver<WithTypename<ReflexBrainConditionCriteriaType>, Record<string, never>, WithTypename<AnalysisType> | string>,
    analysisUid?: GraphCacheResolver<WithTypename<ReflexBrainConditionCriteriaType>, Record<string, never>, Scalars['String'] | string>,
    operator?: GraphCacheResolver<WithTypename<ReflexBrainConditionCriteriaType>, Record<string, never>, Scalars['String'] | string>,
    reflexBrainCondition?: GraphCacheResolver<WithTypename<ReflexBrainConditionCriteriaType>, Record<string, never>, WithTypename<ReflexBrainConditionType> | string>,
    reflexBrainConditionUid?: GraphCacheResolver<WithTypename<ReflexBrainConditionCriteriaType>, Record<string, never>, Scalars['String'] | string>,
    value?: GraphCacheResolver<WithTypename<ReflexBrainConditionCriteriaType>, Record<string, never>, Scalars['String'] | string>
  },
  ReflexBrainConditionType?: {
    criteria?: GraphCacheResolver<WithTypename<ReflexBrainConditionType>, Record<string, never>, Array<WithTypename<ReflexBrainConditionCriteriaType> | string>>,
    description?: GraphCacheResolver<WithTypename<ReflexBrainConditionType>, Record<string, never>, Scalars['String'] | string>,
    priority?: GraphCacheResolver<WithTypename<ReflexBrainConditionType>, Record<string, never>, Scalars['Int'] | string>,
    reflexBrain?: GraphCacheResolver<WithTypename<ReflexBrainConditionType>, Record<string, never>, WithTypename<ReflexBrainType> | string>,
    reflexBrainUid?: GraphCacheResolver<WithTypename<ReflexBrainConditionType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<ReflexBrainConditionType>, Record<string, never>, Scalars['String'] | string>
  },
  ReflexBrainFinalType?: {
    analysis?: GraphCacheResolver<WithTypename<ReflexBrainFinalType>, Record<string, never>, WithTypename<AnalysisType> | string>,
    analysisUid?: GraphCacheResolver<WithTypename<ReflexBrainFinalType>, Record<string, never>, Scalars['String'] | string>,
    reflexBrainAction?: GraphCacheResolver<WithTypename<ReflexBrainFinalType>, Record<string, never>, WithTypename<ReflexBrainActionType> | string>,
    reflexBrainActionUid?: GraphCacheResolver<WithTypename<ReflexBrainFinalType>, Record<string, never>, Scalars['String'] | string>,
    value?: GraphCacheResolver<WithTypename<ReflexBrainFinalType>, Record<string, never>, Scalars['String'] | string>
  },
  ReflexBrainType?: {
    actions?: GraphCacheResolver<WithTypename<ReflexBrainType>, Record<string, never>, Array<WithTypename<ReflexBrainActionType> | string>>,
    conditions?: GraphCacheResolver<WithTypename<ReflexBrainType>, Record<string, never>, Array<WithTypename<ReflexBrainConditionType> | string>>,
    createdAt?: GraphCacheResolver<WithTypename<ReflexBrainType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<ReflexBrainType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<ReflexBrainType>, Record<string, never>, Scalars['String'] | string>,
    description?: GraphCacheResolver<WithTypename<ReflexBrainType>, Record<string, never>, Scalars['String'] | string>,
    priority?: GraphCacheResolver<WithTypename<ReflexBrainType>, Record<string, never>, Scalars['Int'] | string>,
    reflexAction?: GraphCacheResolver<WithTypename<ReflexBrainType>, Record<string, never>, WithTypename<ReflexBrainType> | string>,
    reflexActionUid?: GraphCacheResolver<WithTypename<ReflexBrainType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<ReflexBrainType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<ReflexBrainType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<ReflexBrainType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<ReflexBrainType>, Record<string, never>, Scalars['String'] | string>
  },
  ReflexRuleCursorPage?: {
    edges?: GraphCacheResolver<WithTypename<ReflexRuleCursorPage>, Record<string, never>, Array<WithTypename<ReflexRuleEdge> | string>>,
    items?: GraphCacheResolver<WithTypename<ReflexRuleCursorPage>, Record<string, never>, Array<WithTypename<ReflexRuleType> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<ReflexRuleCursorPage>, Record<string, never>, WithTypename<PageInfo> | string>,
    totalCount?: GraphCacheResolver<WithTypename<ReflexRuleCursorPage>, Record<string, never>, Scalars['Int'] | string>
  },
  ReflexRuleEdge?: {
    cursor?: GraphCacheResolver<WithTypename<ReflexRuleEdge>, Record<string, never>, Scalars['String'] | string>,
    node?: GraphCacheResolver<WithTypename<ReflexRuleEdge>, Record<string, never>, WithTypename<ReflexRuleType> | string>
  },
  ReflexRuleType?: {
    createdAt?: GraphCacheResolver<WithTypename<ReflexRuleType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<ReflexRuleType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<ReflexRuleType>, Record<string, never>, Scalars['String'] | string>,
    description?: GraphCacheResolver<WithTypename<ReflexRuleType>, Record<string, never>, Scalars['String'] | string>,
    isActive?: GraphCacheResolver<WithTypename<ReflexRuleType>, Record<string, never>, Scalars['Boolean'] | string>,
    name?: GraphCacheResolver<WithTypename<ReflexRuleType>, Record<string, never>, Scalars['String'] | string>,
    priority?: GraphCacheResolver<WithTypename<ReflexRuleType>, Record<string, never>, Scalars['Int'] | string>,
    reflexActions?: GraphCacheResolver<WithTypename<ReflexRuleType>, Record<string, never>, Array<WithTypename<ReflexActionType> | string>>,
    uid?: GraphCacheResolver<WithTypename<ReflexRuleType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<ReflexRuleType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<ReflexRuleType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<ReflexRuleType>, Record<string, never>, Scalars['String'] | string>
  },
  RejectionReasonType?: {
    createdAt?: GraphCacheResolver<WithTypename<RejectionReasonType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<RejectionReasonType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<RejectionReasonType>, Record<string, never>, Scalars['String'] | string>,
    reason?: GraphCacheResolver<WithTypename<RejectionReasonType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<RejectionReasonType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<RejectionReasonType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<RejectionReasonType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<RejectionReasonType>, Record<string, never>, Scalars['String'] | string>
  },
  ReportImpressType?: {
    createdAt?: GraphCacheResolver<WithTypename<ReportImpressType>, Record<string, never>, Scalars['DateTime'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<ReportImpressType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<ReportImpressType>, Record<string, never>, Scalars['String'] | string>,
    emailRequired?: GraphCacheResolver<WithTypename<ReportImpressType>, Record<string, never>, Scalars['Boolean'] | string>,
    emailSent?: GraphCacheResolver<WithTypename<ReportImpressType>, Record<string, never>, Scalars['Boolean'] | string>,
    generatedBy?: GraphCacheResolver<WithTypename<ReportImpressType>, Record<string, never>, WithTypename<UserType> | string>,
    generatedByUid?: GraphCacheResolver<WithTypename<ReportImpressType>, Record<string, never>, Scalars['String'] | string>,
    jsonContent?: GraphCacheResolver<WithTypename<ReportImpressType>, Record<string, never>, Scalars['JSONScalar'] | string>,
    sample?: GraphCacheResolver<WithTypename<ReportImpressType>, Record<string, never>, WithTypename<SampleType> | string>,
    sampleUid?: GraphCacheResolver<WithTypename<ReportImpressType>, Record<string, never>, Scalars['String'] | string>,
    smsRequired?: GraphCacheResolver<WithTypename<ReportImpressType>, Record<string, never>, Scalars['Boolean'] | string>,
    smsSent?: GraphCacheResolver<WithTypename<ReportImpressType>, Record<string, never>, Scalars['Boolean'] | string>,
    state?: GraphCacheResolver<WithTypename<ReportImpressType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<ReportImpressType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<ReportImpressType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<ReportImpressType>, Record<string, never>, Scalars['String'] | string>
  },
  ReportMetaType?: {
    analyses?: GraphCacheResolver<WithTypename<ReportMetaType>, Record<string, never>, Array<WithTypename<AnalysisType> | string>>,
    createdAt?: GraphCacheResolver<WithTypename<ReportMetaType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<ReportMetaType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<ReportMetaType>, Record<string, never>, Scalars['String'] | string>,
    dateColumn?: GraphCacheResolver<WithTypename<ReportMetaType>, Record<string, never>, Scalars['String'] | string>,
    location?: GraphCacheResolver<WithTypename<ReportMetaType>, Record<string, never>, Scalars['String'] | string>,
    periodEnd?: GraphCacheResolver<WithTypename<ReportMetaType>, Record<string, never>, Scalars['DateTime'] | string>,
    periodStart?: GraphCacheResolver<WithTypename<ReportMetaType>, Record<string, never>, Scalars['DateTime'] | string>,
    reportType?: GraphCacheResolver<WithTypename<ReportMetaType>, Record<string, never>, Scalars['String'] | string>,
    sampleStates?: GraphCacheResolver<WithTypename<ReportMetaType>, Record<string, never>, Scalars['String'] | string>,
    status?: GraphCacheResolver<WithTypename<ReportMetaType>, Record<string, never>, Scalars['String'] | string>,
    temp?: GraphCacheResolver<WithTypename<ReportMetaType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<ReportMetaType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<ReportMetaType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<ReportMetaType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<ReportMetaType>, Record<string, never>, Scalars['String'] | string>
  },
  ResultListingType?: {
    results?: GraphCacheResolver<WithTypename<ResultListingType>, Record<string, never>, Array<WithTypename<AnalysisResultType> | string>>
  },
  ResultMutationType?: {
    after?: GraphCacheResolver<WithTypename<ResultMutationType>, Record<string, never>, Scalars['String'] | string>,
    before?: GraphCacheResolver<WithTypename<ResultMutationType>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<ResultMutationType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<ResultMutationType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<ResultMutationType>, Record<string, never>, Scalars['String'] | string>,
    date?: GraphCacheResolver<WithTypename<ResultMutationType>, Record<string, never>, Scalars['String'] | string>,
    mutation?: GraphCacheResolver<WithTypename<ResultMutationType>, Record<string, never>, Scalars['String'] | string>,
    resultUid?: GraphCacheResolver<WithTypename<ResultMutationType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<ResultMutationType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<ResultMutationType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<ResultMutationType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<ResultMutationType>, Record<string, never>, Scalars['String'] | string>
  },
  ResultOptionType?: {
    analysisUid?: GraphCacheResolver<WithTypename<ResultOptionType>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<ResultOptionType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<ResultOptionType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<ResultOptionType>, Record<string, never>, Scalars['String'] | string>,
    optionKey?: GraphCacheResolver<WithTypename<ResultOptionType>, Record<string, never>, Scalars['Int'] | string>,
    sampleTypes?: GraphCacheResolver<WithTypename<ResultOptionType>, Record<string, never>, Array<WithTypename<SampleTypeTyp> | string>>,
    uid?: GraphCacheResolver<WithTypename<ResultOptionType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<ResultOptionType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<ResultOptionType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<ResultOptionType>, Record<string, never>, Scalars['String'] | string>,
    value?: GraphCacheResolver<WithTypename<ResultOptionType>, Record<string, never>, Scalars['String'] | string>
  },
  ResultedSampleListingType?: {
    samples?: GraphCacheResolver<WithTypename<ResultedSampleListingType>, Record<string, never>, Array<WithTypename<SamplesWithResults> | string>>
  },
  SampleCursorPage?: {
    edges?: GraphCacheResolver<WithTypename<SampleCursorPage>, Record<string, never>, Array<WithTypename<SampleEdge> | string>>,
    items?: GraphCacheResolver<WithTypename<SampleCursorPage>, Record<string, never>, Array<WithTypename<SamplesWithResults> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<SampleCursorPage>, Record<string, never>, WithTypename<PageInfo> | string>,
    totalCount?: GraphCacheResolver<WithTypename<SampleCursorPage>, Record<string, never>, Scalars['Int'] | string>
  },
  SampleEdge?: {
    cursor?: GraphCacheResolver<WithTypename<SampleEdge>, Record<string, never>, Scalars['String'] | string>,
    node?: GraphCacheResolver<WithTypename<SampleEdge>, Record<string, never>, WithTypename<SamplesWithResults> | string>
  },
  SampleListingType?: {
    samples?: GraphCacheResolver<WithTypename<SampleListingType>, Record<string, never>, Array<WithTypename<SampleType> | string>>
  },
  SampleType?: {
    analyses?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, Array<WithTypename<AnalysisType> | string>>,
    analysisRequest?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, WithTypename<AnalysisRequestType> | string>,
    analysisRequestUid?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, Scalars['String'] | string>,
    assigned?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, Scalars['Boolean'] | string>,
    cancelledBy?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, WithTypename<UserType> | string>,
    cancelledByUid?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, Scalars['String'] | string>,
    dateCancelled?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, Scalars['DateTime'] | string>,
    dateCollected?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, Scalars['DateTime'] | string>,
    dateInvalidated?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, Scalars['DateTime'] | string>,
    datePrinted?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, Scalars['DateTime'] | string>,
    datePublished?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, Scalars['DateTime'] | string>,
    dateReceived?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, Scalars['DateTime'] | string>,
    dateRetrievedFromStorage?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, Scalars['DateTime'] | string>,
    dateStored?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, Scalars['DateTime'] | string>,
    dateSubmitted?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, Scalars['DateTime'] | string>,
    dateVerified?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, Scalars['DateTime'] | string>,
    dueDate?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, Scalars['String'] | string>,
    internalUse?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, Scalars['Boolean'] | string>,
    invalidatedBy?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, WithTypename<UserType> | string>,
    invalidatedByUid?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, Scalars['String'] | string>,
    metadataSnapshot?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, Scalars['JSONScalar'] | string>,
    parent?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, WithTypename<SampleType> | string>,
    parentId?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, Scalars['String'] | string>,
    printed?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, Scalars['Boolean'] | string>,
    printedBy?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, WithTypename<UserType> | string>,
    printedByUid?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, Scalars['String'] | string>,
    priority?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, Scalars['Int'] | string>,
    profiles?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, Array<WithTypename<ProfileType> | string>>,
    publishedBy?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, WithTypename<UserType> | string>,
    publishedByUid?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, Scalars['String'] | string>,
    qcLevel?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, WithTypename<QcLevelType> | string>,
    qcLevelUid?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, Scalars['String'] | string>,
    qcSet?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, WithTypename<QcSetType> | string>,
    qcSetUid?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, Scalars['String'] | string>,
    receivedBy?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, WithTypename<UserType> | string>,
    receivedByUid?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, Scalars['String'] | string>,
    rejectionReasons?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, Array<WithTypename<RejectionReasonType> | string>>,
    sampleId?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, Scalars['String'] | string>,
    sampleType?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, WithTypename<SampleTypeTyp> | string>,
    sampleTypeUid?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, Scalars['String'] | string>,
    status?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, Scalars['String'] | string>,
    storageContainer?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, WithTypename<StorageContainerType> | string>,
    storageContainerUid?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, Scalars['String'] | string>,
    storageSlot?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, Scalars['String'] | string>,
    storageSlotIndex?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, Scalars['Int'] | string>,
    storedBy?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, WithTypename<UserType> | string>,
    storedByUid?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, Scalars['String'] | string>,
    submittedBy?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, WithTypename<UserType> | string>,
    submittedByUid?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, Scalars['String'] | string>,
    verifiedBy?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, WithTypename<UserType> | string>,
    verifiedByUid?: GraphCacheResolver<WithTypename<SampleType>, Record<string, never>, Scalars['String'] | string>
  },
  SampleTypeMappingType?: {
    code?: GraphCacheResolver<WithTypename<SampleTypeMappingType>, Record<string, never>, Scalars['String'] | string>,
    codingStandard?: GraphCacheResolver<WithTypename<SampleTypeMappingType>, Record<string, never>, WithTypename<CodingStandardType> | string>,
    codingStandardUid?: GraphCacheResolver<WithTypename<SampleTypeMappingType>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<SampleTypeMappingType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<SampleTypeMappingType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<SampleTypeMappingType>, Record<string, never>, Scalars['String'] | string>,
    description?: GraphCacheResolver<WithTypename<SampleTypeMappingType>, Record<string, never>, Scalars['String'] | string>,
    name?: GraphCacheResolver<WithTypename<SampleTypeMappingType>, Record<string, never>, Scalars['String'] | string>,
    sampleType?: GraphCacheResolver<WithTypename<SampleTypeMappingType>, Record<string, never>, WithTypename<SampleTypeTyp> | string>,
    sampleTypeUid?: GraphCacheResolver<WithTypename<SampleTypeMappingType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<SampleTypeMappingType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<SampleTypeMappingType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<SampleTypeMappingType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<SampleTypeMappingType>, Record<string, never>, Scalars['String'] | string>
  },
  SampleTypeTyp?: {
    abbr?: GraphCacheResolver<WithTypename<SampleTypeTyp>, Record<string, never>, Scalars['String'] | string>,
    active?: GraphCacheResolver<WithTypename<SampleTypeTyp>, Record<string, never>, Scalars['Boolean'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<SampleTypeTyp>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<SampleTypeTyp>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<SampleTypeTyp>, Record<string, never>, Scalars['String'] | string>,
    description?: GraphCacheResolver<WithTypename<SampleTypeTyp>, Record<string, never>, Scalars['String'] | string>,
    internalUse?: GraphCacheResolver<WithTypename<SampleTypeTyp>, Record<string, never>, Scalars['Boolean'] | string>,
    name?: GraphCacheResolver<WithTypename<SampleTypeTyp>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<SampleTypeTyp>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<SampleTypeTyp>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<SampleTypeTyp>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<SampleTypeTyp>, Record<string, never>, Scalars['String'] | string>
  },
  SamplesWithResults?: {
    analyses?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, Array<WithTypename<AnalysisType> | string>>,
    analysisRequest?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, WithTypename<AnalysisRequestType> | string>,
    analysisRequestUid?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, Scalars['String'] | string>,
    analysisResults?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, Array<WithTypename<AnalysisResultType> | string>>,
    assigned?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, Scalars['Boolean'] | string>,
    cancelledBy?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, WithTypename<UserType> | string>,
    cancelledByUid?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, Scalars['String'] | string>,
    dateCancelled?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, Scalars['DateTime'] | string>,
    dateCollected?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, Scalars['DateTime'] | string>,
    dateInvalidated?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, Scalars['DateTime'] | string>,
    datePrinted?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, Scalars['DateTime'] | string>,
    datePublished?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, Scalars['DateTime'] | string>,
    dateReceived?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, Scalars['DateTime'] | string>,
    dateRetrievedFromStorage?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, Scalars['DateTime'] | string>,
    dateStored?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, Scalars['DateTime'] | string>,
    dateSubmitted?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, Scalars['DateTime'] | string>,
    dateVerified?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, Scalars['DateTime'] | string>,
    dueDate?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, Scalars['String'] | string>,
    internalUse?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, Scalars['Boolean'] | string>,
    invalidatedBy?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, WithTypename<UserType> | string>,
    invalidatedByUid?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, Scalars['String'] | string>,
    metadataSnapshot?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, Scalars['JSONScalar'] | string>,
    parent?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, WithTypename<SampleType> | string>,
    parentId?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, Scalars['String'] | string>,
    printed?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, Scalars['Boolean'] | string>,
    printedBy?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, WithTypename<UserType> | string>,
    printedByUid?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, Scalars['String'] | string>,
    priority?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, Scalars['Int'] | string>,
    profiles?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, Array<WithTypename<ProfileType> | string>>,
    publishedBy?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, WithTypename<UserType> | string>,
    publishedByUid?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, Scalars['String'] | string>,
    qcLevel?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, WithTypename<QcLevelType> | string>,
    qcLevelUid?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, Scalars['String'] | string>,
    qcSet?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, WithTypename<QcSetType> | string>,
    qcSetUid?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, Scalars['String'] | string>,
    receivedBy?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, WithTypename<UserType> | string>,
    receivedByUid?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, Scalars['String'] | string>,
    rejectionReasons?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, Array<WithTypename<RejectionReasonType> | string>>,
    sampleId?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, Scalars['String'] | string>,
    sampleType?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, WithTypename<SampleTypeTyp> | string>,
    sampleTypeUid?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, Scalars['String'] | string>,
    status?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, Scalars['String'] | string>,
    storageContainer?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, WithTypename<StorageContainerType> | string>,
    storageContainerUid?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, Scalars['String'] | string>,
    storageSlot?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, Scalars['String'] | string>,
    storageSlotIndex?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, Scalars['Int'] | string>,
    storedBy?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, WithTypename<UserType> | string>,
    storedByUid?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, Scalars['String'] | string>,
    submittedBy?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, WithTypename<UserType> | string>,
    submittedByUid?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, Scalars['String'] | string>,
    verifiedBy?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, WithTypename<UserType> | string>,
    verifiedByUid?: GraphCacheResolver<WithTypename<SamplesWithResults>, Record<string, never>, Scalars['String'] | string>
  },
  ShipmentCursorPage?: {
    edges?: GraphCacheResolver<WithTypename<ShipmentCursorPage>, Record<string, never>, Array<WithTypename<ShipmentEdge> | string>>,
    items?: GraphCacheResolver<WithTypename<ShipmentCursorPage>, Record<string, never>, Array<WithTypename<ShipmentType> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<ShipmentCursorPage>, Record<string, never>, WithTypename<PageInfo> | string>,
    totalCount?: GraphCacheResolver<WithTypename<ShipmentCursorPage>, Record<string, never>, Scalars['Int'] | string>
  },
  ShipmentEdge?: {
    cursor?: GraphCacheResolver<WithTypename<ShipmentEdge>, Record<string, never>, Scalars['String'] | string>,
    node?: GraphCacheResolver<WithTypename<ShipmentEdge>, Record<string, never>, WithTypename<ShipmentType> | string>
  },
  ShipmentListingType?: {
    shipments?: GraphCacheResolver<WithTypename<ShipmentListingType>, Record<string, never>, Array<WithTypename<ShipmentType> | string>>
  },
  ShipmentType?: {
    assignedCount?: GraphCacheResolver<WithTypename<ShipmentType>, Record<string, never>, Scalars['Int'] | string>,
    comment?: GraphCacheResolver<WithTypename<ShipmentType>, Record<string, never>, Scalars['String'] | string>,
    courier?: GraphCacheResolver<WithTypename<ShipmentType>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<ShipmentType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<ShipmentType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<ShipmentType>, Record<string, never>, Scalars['String'] | string>,
    data?: GraphCacheResolver<WithTypename<ShipmentType>, Record<string, never>, Scalars['JSONScalar'] | string>,
    dateDispatched?: GraphCacheResolver<WithTypename<ShipmentType>, Record<string, never>, Scalars['DateTime'] | string>,
    dateFinalised?: GraphCacheResolver<WithTypename<ShipmentType>, Record<string, never>, Scalars['DateTime'] | string>,
    dateRecalled?: GraphCacheResolver<WithTypename<ShipmentType>, Record<string, never>, Scalars['DateTime'] | string>,
    dateReceived?: GraphCacheResolver<WithTypename<ShipmentType>, Record<string, never>, Scalars['DateTime'] | string>,
    dateRejected?: GraphCacheResolver<WithTypename<ShipmentType>, Record<string, never>, Scalars['DateTime'] | string>,
    dispatchedBy?: GraphCacheResolver<WithTypename<ShipmentType>, Record<string, never>, WithTypename<UserType> | string>,
    dispatchedByUid?: GraphCacheResolver<WithTypename<ShipmentType>, Record<string, never>, Scalars['String'] | string>,
    finalisedBy?: GraphCacheResolver<WithTypename<ShipmentType>, Record<string, never>, WithTypename<UserType> | string>,
    finalisedByUid?: GraphCacheResolver<WithTypename<ShipmentType>, Record<string, never>, Scalars['String'] | string>,
    incoming?: GraphCacheResolver<WithTypename<ShipmentType>, Record<string, never>, Scalars['Boolean'] | string>,
    jsonContent?: GraphCacheResolver<WithTypename<ShipmentType>, Record<string, never>, Scalars['JSONScalar'] | string>,
    laboratory?: GraphCacheResolver<WithTypename<ShipmentType>, Record<string, never>, WithTypename<ReferralLaboratoryType> | string>,
    laboratoryUid?: GraphCacheResolver<WithTypename<ShipmentType>, Record<string, never>, Scalars['String'] | string>,
    pdfContent?: GraphCacheResolver<WithTypename<ShipmentType>, Record<string, never>, Scalars['BytesScalar'] | string>,
    recalledBy?: GraphCacheResolver<WithTypename<ShipmentType>, Record<string, never>, WithTypename<UserType> | string>,
    recalledByUid?: GraphCacheResolver<WithTypename<ShipmentType>, Record<string, never>, Scalars['String'] | string>,
    receivedBy?: GraphCacheResolver<WithTypename<ShipmentType>, Record<string, never>, WithTypename<UserType> | string>,
    receivedByUid?: GraphCacheResolver<WithTypename<ShipmentType>, Record<string, never>, Scalars['String'] | string>,
    rejectedBy?: GraphCacheResolver<WithTypename<ShipmentType>, Record<string, never>, WithTypename<UserType> | string>,
    rejectedByUid?: GraphCacheResolver<WithTypename<ShipmentType>, Record<string, never>, Scalars['String'] | string>,
    samples?: GraphCacheResolver<WithTypename<ShipmentType>, Record<string, never>, Array<WithTypename<SampleType> | string>>,
    shipmentId?: GraphCacheResolver<WithTypename<ShipmentType>, Record<string, never>, Scalars['String'] | string>,
    shippedSamples?: GraphCacheResolver<WithTypename<ShipmentType>, Record<string, never>, Array<WithTypename<ShippedSampleType> | string>>,
    state?: GraphCacheResolver<WithTypename<ShipmentType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<ShipmentType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<ShipmentType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<ShipmentType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<ShipmentType>, Record<string, never>, Scalars['String'] | string>
  },
  ShippedSampleType?: {
    extSampleId?: GraphCacheResolver<WithTypename<ShippedSampleType>, Record<string, never>, Scalars['String'] | string>,
    extSampleUid?: GraphCacheResolver<WithTypename<ShippedSampleType>, Record<string, never>, Scalars['String'] | string>,
    resultNotified?: GraphCacheResolver<WithTypename<ShippedSampleType>, Record<string, never>, Scalars['Boolean'] | string>,
    sample?: GraphCacheResolver<WithTypename<ShippedSampleType>, Record<string, never>, WithTypename<SampleType> | string>,
    sampleUid?: GraphCacheResolver<WithTypename<ShippedSampleType>, Record<string, never>, Scalars['String'] | string>,
    shipment?: GraphCacheResolver<WithTypename<ShippedSampleType>, Record<string, never>, WithTypename<ShipmentType> | string>,
    shipmentUid?: GraphCacheResolver<WithTypename<ShippedSampleType>, Record<string, never>, Scalars['String'] | string>
  },
  StockAdjustmentCursorPage?: {
    edges?: GraphCacheResolver<WithTypename<StockAdjustmentCursorPage>, Record<string, never>, Array<WithTypename<StockAdjustmentEdge> | string>>,
    items?: GraphCacheResolver<WithTypename<StockAdjustmentCursorPage>, Record<string, never>, Array<WithTypename<StockAdjustmentType> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<StockAdjustmentCursorPage>, Record<string, never>, WithTypename<PageInfo> | string>,
    totalCount?: GraphCacheResolver<WithTypename<StockAdjustmentCursorPage>, Record<string, never>, Scalars['Int'] | string>
  },
  StockAdjustmentEdge?: {
    cursor?: GraphCacheResolver<WithTypename<StockAdjustmentEdge>, Record<string, never>, Scalars['String'] | string>,
    node?: GraphCacheResolver<WithTypename<StockAdjustmentEdge>, Record<string, never>, WithTypename<StockAdjustmentType> | string>
  },
  StockAdjustmentType?: {
    adjust?: GraphCacheResolver<WithTypename<StockAdjustmentType>, Record<string, never>, Scalars['Int'] | string>,
    adjustmentBy?: GraphCacheResolver<WithTypename<StockAdjustmentType>, Record<string, never>, WithTypename<UserType> | string>,
    adjustmentByUid?: GraphCacheResolver<WithTypename<StockAdjustmentType>, Record<string, never>, Scalars['String'] | string>,
    adjustmentDate?: GraphCacheResolver<WithTypename<StockAdjustmentType>, Record<string, never>, Scalars['String'] | string>,
    adjustmentFor?: GraphCacheResolver<WithTypename<StockAdjustmentType>, Record<string, never>, WithTypename<UserType> | string>,
    adjustmentForUid?: GraphCacheResolver<WithTypename<StockAdjustmentType>, Record<string, never>, Scalars['String'] | string>,
    adjustmentType?: GraphCacheResolver<WithTypename<StockAdjustmentType>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<StockAdjustmentType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<StockAdjustmentType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<StockAdjustmentType>, Record<string, never>, Scalars['String'] | string>,
    product?: GraphCacheResolver<WithTypename<StockAdjustmentType>, Record<string, never>, WithTypename<StockItemVariantType> | string>,
    productUid?: GraphCacheResolver<WithTypename<StockAdjustmentType>, Record<string, never>, Scalars['String'] | string>,
    remarks?: GraphCacheResolver<WithTypename<StockAdjustmentType>, Record<string, never>, Scalars['String'] | string>,
    stockLot?: GraphCacheResolver<WithTypename<StockAdjustmentType>, Record<string, never>, WithTypename<StockLotType> | string>,
    stockLotUid?: GraphCacheResolver<WithTypename<StockAdjustmentType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<StockAdjustmentType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<StockAdjustmentType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<StockAdjustmentType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<StockAdjustmentType>, Record<string, never>, Scalars['String'] | string>
  },
  StockCategoryType?: {
    createdAt?: GraphCacheResolver<WithTypename<StockCategoryType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<StockCategoryType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<StockCategoryType>, Record<string, never>, Scalars['String'] | string>,
    description?: GraphCacheResolver<WithTypename<StockCategoryType>, Record<string, never>, Scalars['String'] | string>,
    name?: GraphCacheResolver<WithTypename<StockCategoryType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<StockCategoryType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<StockCategoryType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<StockCategoryType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<StockCategoryType>, Record<string, never>, Scalars['String'] | string>
  },
  StockItemCursorPage?: {
    edges?: GraphCacheResolver<WithTypename<StockItemCursorPage>, Record<string, never>, Array<WithTypename<StockItemEdge> | string>>,
    items?: GraphCacheResolver<WithTypename<StockItemCursorPage>, Record<string, never>, Array<WithTypename<StockItemType> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<StockItemCursorPage>, Record<string, never>, WithTypename<PageInfo> | string>,
    totalCount?: GraphCacheResolver<WithTypename<StockItemCursorPage>, Record<string, never>, Scalars['Int'] | string>
  },
  StockItemEdge?: {
    cursor?: GraphCacheResolver<WithTypename<StockItemEdge>, Record<string, never>, Scalars['String'] | string>,
    node?: GraphCacheResolver<WithTypename<StockItemEdge>, Record<string, never>, WithTypename<StockItemType> | string>
  },
  StockItemType?: {
    category?: GraphCacheResolver<WithTypename<StockItemType>, Record<string, never>, WithTypename<StockCategoryType> | string>,
    categoryUid?: GraphCacheResolver<WithTypename<StockItemType>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<StockItemType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<StockItemType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<StockItemType>, Record<string, never>, Scalars['String'] | string>,
    description?: GraphCacheResolver<WithTypename<StockItemType>, Record<string, never>, Scalars['String'] | string>,
    hazard?: GraphCacheResolver<WithTypename<StockItemType>, Record<string, never>, WithTypename<HazardType> | string>,
    hazardUid?: GraphCacheResolver<WithTypename<StockItemType>, Record<string, never>, Scalars['String'] | string>,
    maximumLevel?: GraphCacheResolver<WithTypename<StockItemType>, Record<string, never>, Scalars['Int'] | string>,
    minimumLevel?: GraphCacheResolver<WithTypename<StockItemType>, Record<string, never>, Scalars['Int'] | string>,
    name?: GraphCacheResolver<WithTypename<StockItemType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<StockItemType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<StockItemType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<StockItemType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<StockItemType>, Record<string, never>, Scalars['String'] | string>,
    variants?: GraphCacheResolver<WithTypename<StockItemType>, Record<string, never>, Array<WithTypename<StockItemVariantType> | string>>
  },
  StockItemVariantCursorPage?: {
    edges?: GraphCacheResolver<WithTypename<StockItemVariantCursorPage>, Record<string, never>, Array<WithTypename<StockItemVariantType> | string>>,
    items?: GraphCacheResolver<WithTypename<StockItemVariantCursorPage>, Record<string, never>, Array<WithTypename<StockItemVariantType> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<StockItemVariantCursorPage>, Record<string, never>, WithTypename<PageInfo> | string>,
    totalCount?: GraphCacheResolver<WithTypename<StockItemVariantCursorPage>, Record<string, never>, Scalars['Int'] | string>
  },
  StockItemVariantEdge?: {
    cursor?: GraphCacheResolver<WithTypename<StockItemVariantEdge>, Record<string, never>, Scalars['String'] | string>,
    node?: GraphCacheResolver<WithTypename<StockItemVariantEdge>, Record<string, never>, WithTypename<StockItemVariantType> | string>
  },
  StockItemVariantType?: {
    createdAt?: GraphCacheResolver<WithTypename<StockItemVariantType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<StockItemVariantType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<StockItemVariantType>, Record<string, never>, Scalars['String'] | string>,
    description?: GraphCacheResolver<WithTypename<StockItemVariantType>, Record<string, never>, Scalars['String'] | string>,
    maximumLevel?: GraphCacheResolver<WithTypename<StockItemVariantType>, Record<string, never>, Scalars['Int'] | string>,
    minimumLevel?: GraphCacheResolver<WithTypename<StockItemVariantType>, Record<string, never>, Scalars['Int'] | string>,
    name?: GraphCacheResolver<WithTypename<StockItemVariantType>, Record<string, never>, Scalars['String'] | string>,
    quantity?: GraphCacheResolver<WithTypename<StockItemVariantType>, Record<string, never>, Scalars['Int'] | string>,
    stockItem?: GraphCacheResolver<WithTypename<StockItemVariantType>, Record<string, never>, WithTypename<StockItemType> | string>,
    stockItemUid?: GraphCacheResolver<WithTypename<StockItemVariantType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<StockItemVariantType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<StockItemVariantType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<StockItemVariantType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<StockItemVariantType>, Record<string, never>, Scalars['String'] | string>
  },
  StockLotType?: {
    expiryDate?: GraphCacheResolver<WithTypename<StockLotType>, Record<string, never>, Scalars['DateTime'] | string>,
    lotNumber?: GraphCacheResolver<WithTypename<StockLotType>, Record<string, never>, Scalars['String'] | string>,
    product?: GraphCacheResolver<WithTypename<StockLotType>, Record<string, never>, WithTypename<StockItemVariantType> | string>,
    productUid?: GraphCacheResolver<WithTypename<StockLotType>, Record<string, never>, Scalars['String'] | string>,
    quantity?: GraphCacheResolver<WithTypename<StockLotType>, Record<string, never>, Scalars['Int'] | string>,
    remarks?: GraphCacheResolver<WithTypename<StockLotType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<StockLotType>, Record<string, never>, Scalars['String'] | string>
  },
  StockOrderCursorPage?: {
    edges?: GraphCacheResolver<WithTypename<StockOrderCursorPage>, Record<string, never>, Array<WithTypename<StockOrderEdge> | string>>,
    items?: GraphCacheResolver<WithTypename<StockOrderCursorPage>, Record<string, never>, Array<WithTypename<StockOrderType> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<StockOrderCursorPage>, Record<string, never>, WithTypename<PageInfo> | string>,
    totalCount?: GraphCacheResolver<WithTypename<StockOrderCursorPage>, Record<string, never>, Scalars['Int'] | string>
  },
  StockOrderEdge?: {
    cursor?: GraphCacheResolver<WithTypename<StockOrderEdge>, Record<string, never>, Scalars['String'] | string>,
    node?: GraphCacheResolver<WithTypename<StockOrderEdge>, Record<string, never>, WithTypename<StockOrderType> | string>
  },
  StockOrderLineType?: {
    orderProducts?: GraphCacheResolver<WithTypename<StockOrderLineType>, Record<string, never>, Array<WithTypename<StockOrderProductType> | string>>,
    stockOrder?: GraphCacheResolver<WithTypename<StockOrderLineType>, Record<string, never>, WithTypename<StockOrderType> | string>
  },
  StockOrderProductType?: {
    createdAt?: GraphCacheResolver<WithTypename<StockOrderProductType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<StockOrderProductType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<StockOrderProductType>, Record<string, never>, Scalars['String'] | string>,
    order?: GraphCacheResolver<WithTypename<StockOrderProductType>, Record<string, never>, WithTypename<StockOrderType> | string>,
    orderUid?: GraphCacheResolver<WithTypename<StockOrderProductType>, Record<string, never>, Scalars['String'] | string>,
    product?: GraphCacheResolver<WithTypename<StockOrderProductType>, Record<string, never>, WithTypename<StockItemVariantType> | string>,
    productUid?: GraphCacheResolver<WithTypename<StockOrderProductType>, Record<string, never>, Scalars['String'] | string>,
    quantity?: GraphCacheResolver<WithTypename<StockOrderProductType>, Record<string, never>, Scalars['Int'] | string>,
    stockLot?: GraphCacheResolver<WithTypename<StockOrderProductType>, Record<string, never>, WithTypename<StockLotType> | string>,
    stockLotUid?: GraphCacheResolver<WithTypename<StockOrderProductType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<StockOrderProductType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<StockOrderProductType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<StockOrderProductType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<StockOrderProductType>, Record<string, never>, Scalars['String'] | string>
  },
  StockOrderType?: {
    createdAt?: GraphCacheResolver<WithTypename<StockOrderType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<StockOrderType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<StockOrderType>, Record<string, never>, Scalars['String'] | string>,
    department?: GraphCacheResolver<WithTypename<StockOrderType>, Record<string, never>, WithTypename<DepartmentType> | string>,
    departmentUid?: GraphCacheResolver<WithTypename<StockOrderType>, Record<string, never>, Scalars['String'] | string>,
    fulfilledBy?: GraphCacheResolver<WithTypename<StockOrderType>, Record<string, never>, WithTypename<UserType> | string>,
    fulfilledByUid?: GraphCacheResolver<WithTypename<StockOrderType>, Record<string, never>, Scalars['String'] | string>,
    orderBy?: GraphCacheResolver<WithTypename<StockOrderType>, Record<string, never>, WithTypename<UserType> | string>,
    orderByUid?: GraphCacheResolver<WithTypename<StockOrderType>, Record<string, never>, Scalars['String'] | string>,
    orderNumber?: GraphCacheResolver<WithTypename<StockOrderType>, Record<string, never>, Scalars['String'] | string>,
    remarks?: GraphCacheResolver<WithTypename<StockOrderType>, Record<string, never>, Scalars['String'] | string>,
    status?: GraphCacheResolver<WithTypename<StockOrderType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<StockOrderType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<StockOrderType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<StockOrderType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<StockOrderType>, Record<string, never>, Scalars['String'] | string>
  },
  StockPackagingType?: {
    createdAt?: GraphCacheResolver<WithTypename<StockPackagingType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<StockPackagingType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<StockPackagingType>, Record<string, never>, Scalars['String'] | string>,
    name?: GraphCacheResolver<WithTypename<StockPackagingType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<StockPackagingType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<StockPackagingType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<StockPackagingType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<StockPackagingType>, Record<string, never>, Scalars['String'] | string>
  },
  StockProductInventoryType?: {
    product?: GraphCacheResolver<WithTypename<StockProductInventoryType>, Record<string, never>, WithTypename<StockItemVariantType> | string>,
    productUid?: GraphCacheResolver<WithTypename<StockProductInventoryType>, Record<string, never>, Scalars['String'] | string>,
    quantity?: GraphCacheResolver<WithTypename<StockProductInventoryType>, Record<string, never>, Scalars['Int'] | string>,
    remarks?: GraphCacheResolver<WithTypename<StockProductInventoryType>, Record<string, never>, Scalars['String'] | string>,
    stockLot?: GraphCacheResolver<WithTypename<StockProductInventoryType>, Record<string, never>, WithTypename<StockLotType> | string>,
    stockLotUid?: GraphCacheResolver<WithTypename<StockProductInventoryType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<StockProductInventoryType>, Record<string, never>, Scalars['String'] | string>
  },
  StockReceiptType?: {
    packageFactor?: GraphCacheResolver<WithTypename<StockReceiptType>, Record<string, never>, Scalars['Int'] | string>,
    packagesReceived?: GraphCacheResolver<WithTypename<StockReceiptType>, Record<string, never>, Scalars['Int'] | string>,
    product?: GraphCacheResolver<WithTypename<StockReceiptType>, Record<string, never>, WithTypename<StockItemVariantType> | string>,
    productUid?: GraphCacheResolver<WithTypename<StockReceiptType>, Record<string, never>, Scalars['String'] | string>,
    quantityReceived?: GraphCacheResolver<WithTypename<StockReceiptType>, Record<string, never>, Scalars['Int'] | string>,
    receiptBy?: GraphCacheResolver<WithTypename<StockReceiptType>, Record<string, never>, WithTypename<UserType> | string>,
    receiptByUid?: GraphCacheResolver<WithTypename<StockReceiptType>, Record<string, never>, Scalars['String'] | string>,
    receiptDate?: GraphCacheResolver<WithTypename<StockReceiptType>, Record<string, never>, Scalars['DateTime'] | string>,
    receiptType?: GraphCacheResolver<WithTypename<StockReceiptType>, Record<string, never>, Scalars['String'] | string>,
    singlesReceived?: GraphCacheResolver<WithTypename<StockReceiptType>, Record<string, never>, Scalars['Int'] | string>,
    stockLot?: GraphCacheResolver<WithTypename<StockReceiptType>, Record<string, never>, WithTypename<StockLotType> | string>,
    stockLotUid?: GraphCacheResolver<WithTypename<StockReceiptType>, Record<string, never>, Scalars['String'] | string>,
    supplier?: GraphCacheResolver<WithTypename<StockReceiptType>, Record<string, never>, WithTypename<SupplierType> | string>,
    supplierUid?: GraphCacheResolver<WithTypename<StockReceiptType>, Record<string, never>, Scalars['String'] | string>,
    totalPrice?: GraphCacheResolver<WithTypename<StockReceiptType>, Record<string, never>, Scalars['Float'] | string>,
    uid?: GraphCacheResolver<WithTypename<StockReceiptType>, Record<string, never>, Scalars['String'] | string>,
    unit?: GraphCacheResolver<WithTypename<StockReceiptType>, Record<string, never>, WithTypename<StockUnitType> | string>,
    unitPrice?: GraphCacheResolver<WithTypename<StockReceiptType>, Record<string, never>, Scalars['Float'] | string>,
    unitUid?: GraphCacheResolver<WithTypename<StockReceiptType>, Record<string, never>, Scalars['String'] | string>
  },
  StockTransactionCursorPage?: {
    edges?: GraphCacheResolver<WithTypename<StockTransactionCursorPage>, Record<string, never>, Array<WithTypename<StockTransactionEdge> | string>>,
    items?: GraphCacheResolver<WithTypename<StockTransactionCursorPage>, Record<string, never>, Array<WithTypename<StockTransactionType> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<StockTransactionCursorPage>, Record<string, never>, WithTypename<PageInfo> | string>,
    totalCount?: GraphCacheResolver<WithTypename<StockTransactionCursorPage>, Record<string, never>, Scalars['Int'] | string>
  },
  StockTransactionEdge?: {
    cursor?: GraphCacheResolver<WithTypename<StockTransactionEdge>, Record<string, never>, Scalars['String'] | string>,
    node?: GraphCacheResolver<WithTypename<StockTransactionEdge>, Record<string, never>, WithTypename<StockTransactionType> | string>
  },
  StockTransactionType?: {
    createdAt?: GraphCacheResolver<WithTypename<StockTransactionType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<StockTransactionType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<StockTransactionType>, Record<string, never>, Scalars['String'] | string>,
    dateIssued?: GraphCacheResolver<WithTypename<StockTransactionType>, Record<string, never>, Scalars['DateTime'] | string>,
    department?: GraphCacheResolver<WithTypename<StockTransactionType>, Record<string, never>, WithTypename<DepartmentType> | string>,
    departmentUid?: GraphCacheResolver<WithTypename<StockTransactionType>, Record<string, never>, Scalars['String'] | string>,
    issued?: GraphCacheResolver<WithTypename<StockTransactionType>, Record<string, never>, Scalars['Int'] | string>,
    issuedTo?: GraphCacheResolver<WithTypename<StockTransactionType>, Record<string, never>, WithTypename<UserType> | string>,
    issuedToUid?: GraphCacheResolver<WithTypename<StockTransactionType>, Record<string, never>, Scalars['String'] | string>,
    product?: GraphCacheResolver<WithTypename<StockTransactionType>, Record<string, never>, WithTypename<StockItemVariantType> | string>,
    productUid?: GraphCacheResolver<WithTypename<StockTransactionType>, Record<string, never>, Scalars['String'] | string>,
    transactionBy?: GraphCacheResolver<WithTypename<StockTransactionType>, Record<string, never>, WithTypename<UserType> | string>,
    transactionByUid?: GraphCacheResolver<WithTypename<StockTransactionType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<StockTransactionType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<StockTransactionType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<StockTransactionType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<StockTransactionType>, Record<string, never>, Scalars['String'] | string>
  },
  StockUnitType?: {
    createdAt?: GraphCacheResolver<WithTypename<StockUnitType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<StockUnitType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<StockUnitType>, Record<string, never>, Scalars['String'] | string>,
    description?: GraphCacheResolver<WithTypename<StockUnitType>, Record<string, never>, Scalars['String'] | string>,
    name?: GraphCacheResolver<WithTypename<StockUnitType>, Record<string, never>, Scalars['String'] | string>,
    synonyms?: GraphCacheResolver<WithTypename<StockUnitType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<StockUnitType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<StockUnitType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<StockUnitType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<StockUnitType>, Record<string, never>, Scalars['String'] | string>
  },
  StorageContainerType?: {
    cols?: GraphCacheResolver<WithTypename<StorageContainerType>, Record<string, never>, Scalars['Int'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<StorageContainerType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<StorageContainerType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<StorageContainerType>, Record<string, never>, Scalars['String'] | string>,
    description?: GraphCacheResolver<WithTypename<StorageContainerType>, Record<string, never>, Scalars['String'] | string>,
    grid?: GraphCacheResolver<WithTypename<StorageContainerType>, Record<string, never>, Scalars['Boolean'] | string>,
    name?: GraphCacheResolver<WithTypename<StorageContainerType>, Record<string, never>, Scalars['String'] | string>,
    rowWise?: GraphCacheResolver<WithTypename<StorageContainerType>, Record<string, never>, Scalars['Boolean'] | string>,
    rows?: GraphCacheResolver<WithTypename<StorageContainerType>, Record<string, never>, Scalars['Int'] | string>,
    slots?: GraphCacheResolver<WithTypename<StorageContainerType>, Record<string, never>, Scalars['Int'] | string>,
    storageSection?: GraphCacheResolver<WithTypename<StorageContainerType>, Record<string, never>, WithTypename<StorageSectionType> | string>,
    storageSectionUid?: GraphCacheResolver<WithTypename<StorageContainerType>, Record<string, never>, Scalars['String'] | string>,
    storedCount?: GraphCacheResolver<WithTypename<StorageContainerType>, Record<string, never>, Scalars['Int'] | string>,
    tag?: GraphCacheResolver<WithTypename<StorageContainerType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<StorageContainerType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<StorageContainerType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<StorageContainerType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<StorageContainerType>, Record<string, never>, Scalars['String'] | string>
  },
  StorageLocationType?: {
    children?: GraphCacheResolver<WithTypename<StorageLocationType>, Record<string, never>, Array<WithTypename<StorageSectionType> | string>>,
    createdAt?: GraphCacheResolver<WithTypename<StorageLocationType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<StorageLocationType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<StorageLocationType>, Record<string, never>, Scalars['String'] | string>,
    description?: GraphCacheResolver<WithTypename<StorageLocationType>, Record<string, never>, Scalars['String'] | string>,
    name?: GraphCacheResolver<WithTypename<StorageLocationType>, Record<string, never>, Scalars['String'] | string>,
    storeRoom?: GraphCacheResolver<WithTypename<StorageLocationType>, Record<string, never>, WithTypename<StoreRoomType> | string>,
    storeRoomUid?: GraphCacheResolver<WithTypename<StorageLocationType>, Record<string, never>, Scalars['String'] | string>,
    tag?: GraphCacheResolver<WithTypename<StorageLocationType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<StorageLocationType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<StorageLocationType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<StorageLocationType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<StorageLocationType>, Record<string, never>, Scalars['String'] | string>
  },
  StorageSectionType?: {
    children?: GraphCacheResolver<WithTypename<StorageSectionType>, Record<string, never>, Array<WithTypename<StorageContainerType> | string>>,
    createdAt?: GraphCacheResolver<WithTypename<StorageSectionType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<StorageSectionType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<StorageSectionType>, Record<string, never>, Scalars['String'] | string>,
    description?: GraphCacheResolver<WithTypename<StorageSectionType>, Record<string, never>, Scalars['String'] | string>,
    name?: GraphCacheResolver<WithTypename<StorageSectionType>, Record<string, never>, Scalars['String'] | string>,
    storageLocation?: GraphCacheResolver<WithTypename<StorageSectionType>, Record<string, never>, WithTypename<StorageLocationType> | string>,
    storageLocationUid?: GraphCacheResolver<WithTypename<StorageSectionType>, Record<string, never>, Scalars['String'] | string>,
    tag?: GraphCacheResolver<WithTypename<StorageSectionType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<StorageSectionType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<StorageSectionType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<StorageSectionType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<StorageSectionType>, Record<string, never>, Scalars['String'] | string>
  },
  StoreRoomType?: {
    children?: GraphCacheResolver<WithTypename<StoreRoomType>, Record<string, never>, Array<WithTypename<StorageLocationType> | string>>,
    createdAt?: GraphCacheResolver<WithTypename<StoreRoomType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<StoreRoomType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<StoreRoomType>, Record<string, never>, Scalars['String'] | string>,
    description?: GraphCacheResolver<WithTypename<StoreRoomType>, Record<string, never>, Scalars['String'] | string>,
    name?: GraphCacheResolver<WithTypename<StoreRoomType>, Record<string, never>, Scalars['String'] | string>,
    tag?: GraphCacheResolver<WithTypename<StoreRoomType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<StoreRoomType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<StoreRoomType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<StoreRoomType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<StoreRoomType>, Record<string, never>, Scalars['String'] | string>
  },
  StoredSamplesType?: {
    samples?: GraphCacheResolver<WithTypename<StoredSamplesType>, Record<string, never>, Array<WithTypename<SampleType> | string>>
  },
  SupplierType?: {
    createdAt?: GraphCacheResolver<WithTypename<SupplierType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<SupplierType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<SupplierType>, Record<string, never>, Scalars['String'] | string>,
    description?: GraphCacheResolver<WithTypename<SupplierType>, Record<string, never>, Scalars['String'] | string>,
    name?: GraphCacheResolver<WithTypename<SupplierType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<SupplierType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<SupplierType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<SupplierType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<SupplierType>, Record<string, never>, Scalars['String'] | string>
  },
  TestBillCursorPage?: {
    edges?: GraphCacheResolver<WithTypename<TestBillCursorPage>, Record<string, never>, Array<WithTypename<TestBillEdge> | string>>,
    items?: GraphCacheResolver<WithTypename<TestBillCursorPage>, Record<string, never>, Array<WithTypename<TestBillType> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<TestBillCursorPage>, Record<string, never>, WithTypename<PageInfo> | string>,
    totalCount?: GraphCacheResolver<WithTypename<TestBillCursorPage>, Record<string, never>, Scalars['Int'] | string>
  },
  TestBillEdge?: {
    cursor?: GraphCacheResolver<WithTypename<TestBillEdge>, Record<string, never>, Scalars['String'] | string>,
    node?: GraphCacheResolver<WithTypename<TestBillEdge>, Record<string, never>, WithTypename<TestBillType> | string>
  },
  TestBillInvoiceType?: {
    createdAt?: GraphCacheResolver<WithTypename<TestBillInvoiceType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<TestBillInvoiceType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<TestBillInvoiceType>, Record<string, never>, Scalars['String'] | string>,
    jsonContent?: GraphCacheResolver<WithTypename<TestBillInvoiceType>, Record<string, never>, Scalars['JSONScalar'] | string>,
    pdfContent?: GraphCacheResolver<WithTypename<TestBillInvoiceType>, Record<string, never>, Scalars['BytesScalar'] | string>,
    testBill?: GraphCacheResolver<WithTypename<TestBillInvoiceType>, Record<string, never>, WithTypename<TestBillType> | string>,
    testBillUid?: GraphCacheResolver<WithTypename<TestBillInvoiceType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<TestBillInvoiceType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<TestBillInvoiceType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<TestBillInvoiceType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<TestBillInvoiceType>, Record<string, never>, Scalars['String'] | string>
  },
  TestBillTransactionType?: {
    actionMessage?: GraphCacheResolver<WithTypename<TestBillTransactionType>, Record<string, never>, Scalars['String'] | string>,
    actionRequired?: GraphCacheResolver<WithTypename<TestBillTransactionType>, Record<string, never>, Scalars['Boolean'] | string>,
    amount?: GraphCacheResolver<WithTypename<TestBillTransactionType>, Record<string, never>, Scalars['Float'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<TestBillTransactionType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<TestBillTransactionType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<TestBillTransactionType>, Record<string, never>, Scalars['String'] | string>,
    isSuccess?: GraphCacheResolver<WithTypename<TestBillTransactionType>, Record<string, never>, Scalars['Boolean'] | string>,
    kind?: GraphCacheResolver<WithTypename<TestBillTransactionType>, Record<string, never>, Scalars['String'] | string>,
    message?: GraphCacheResolver<WithTypename<TestBillTransactionType>, Record<string, never>, Scalars['String'] | string>,
    notes?: GraphCacheResolver<WithTypename<TestBillTransactionType>, Record<string, never>, Scalars['String'] | string>,
    processed?: GraphCacheResolver<WithTypename<TestBillTransactionType>, Record<string, never>, Scalars['Boolean'] | string>,
    testBill?: GraphCacheResolver<WithTypename<TestBillTransactionType>, Record<string, never>, WithTypename<TestBillType> | string>,
    testBillUid?: GraphCacheResolver<WithTypename<TestBillTransactionType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<TestBillTransactionType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<TestBillTransactionType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<TestBillTransactionType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<TestBillTransactionType>, Record<string, never>, Scalars['String'] | string>
  },
  TestBillType?: {
    billId?: GraphCacheResolver<WithTypename<TestBillType>, Record<string, never>, Scalars['String'] | string>,
    client?: GraphCacheResolver<WithTypename<TestBillType>, Record<string, never>, WithTypename<ClientType> | string>,
    clientUid?: GraphCacheResolver<WithTypename<TestBillType>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<TestBillType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<TestBillType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<TestBillType>, Record<string, never>, Scalars['String'] | string>,
    isActive?: GraphCacheResolver<WithTypename<TestBillType>, Record<string, never>, Scalars['Boolean'] | string>,
    jsonContent?: GraphCacheResolver<WithTypename<TestBillType>, Record<string, never>, Scalars['JSONScalar'] | string>,
    orders?: GraphCacheResolver<WithTypename<TestBillType>, Record<string, never>, Array<WithTypename<AnalysisRequestType> | string>>,
    partial?: GraphCacheResolver<WithTypename<TestBillType>, Record<string, never>, Scalars['Boolean'] | string>,
    patient?: GraphCacheResolver<WithTypename<TestBillType>, Record<string, never>, WithTypename<PatientType> | string>,
    patientUid?: GraphCacheResolver<WithTypename<TestBillType>, Record<string, never>, Scalars['String'] | string>,
    toConfirm?: GraphCacheResolver<WithTypename<TestBillType>, Record<string, never>, Scalars['Boolean'] | string>,
    totalCharged?: GraphCacheResolver<WithTypename<TestBillType>, Record<string, never>, Scalars['Float'] | string>,
    totalPaid?: GraphCacheResolver<WithTypename<TestBillType>, Record<string, never>, Scalars['Float'] | string>,
    uid?: GraphCacheResolver<WithTypename<TestBillType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<TestBillType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<TestBillType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<TestBillType>, Record<string, never>, Scalars['String'] | string>
  },
  UnitType?: {
    createdAt?: GraphCacheResolver<WithTypename<UnitType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<UnitType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<UnitType>, Record<string, never>, Scalars['String'] | string>,
    description?: GraphCacheResolver<WithTypename<UnitType>, Record<string, never>, Scalars['String'] | string>,
    name?: GraphCacheResolver<WithTypename<UnitType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<UnitType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<UnitType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<UnitType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<UnitType>, Record<string, never>, Scalars['String'] | string>
  },
  UnknownObjectType?: {
    message?: GraphCacheResolver<WithTypename<UnknownObjectType>, Record<string, never>, Scalars['String'] | string>
  },
  UpdatedGroupPerms?: {
    group?: GraphCacheResolver<WithTypename<UpdatedGroupPerms>, Record<string, never>, WithTypename<GroupType> | string>,
    permission?: GraphCacheResolver<WithTypename<UpdatedGroupPerms>, Record<string, never>, WithTypename<PermissionType> | string>
  },
  UserCursorPage?: {
    edges?: GraphCacheResolver<WithTypename<UserCursorPage>, Record<string, never>, Array<WithTypename<UserEdge> | string>>,
    items?: GraphCacheResolver<WithTypename<UserCursorPage>, Record<string, never>, Array<WithTypename<UserType> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<UserCursorPage>, Record<string, never>, WithTypename<PageInfo> | string>,
    totalCount?: GraphCacheResolver<WithTypename<UserCursorPage>, Record<string, never>, Scalars['Int'] | string>
  },
  UserEdge?: {
    cursor?: GraphCacheResolver<WithTypename<UserEdge>, Record<string, never>, Scalars['String'] | string>,
    node?: GraphCacheResolver<WithTypename<UserEdge>, Record<string, never>, WithTypename<UserType> | string>
  },
  UserPreferenceType?: {
    createdAt?: GraphCacheResolver<WithTypename<UserPreferenceType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<UserPreferenceType>, Record<string, never>, WithTypename<UserPreferenceType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<UserPreferenceType>, Record<string, never>, Scalars['String'] | string>,
    departments?: GraphCacheResolver<WithTypename<UserPreferenceType>, Record<string, never>, Array<WithTypename<DepartmentType> | string>>,
    expandedMenu?: GraphCacheResolver<WithTypename<UserPreferenceType>, Record<string, never>, Scalars['Boolean'] | string>,
    theme?: GraphCacheResolver<WithTypename<UserPreferenceType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<UserPreferenceType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<UserPreferenceType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<UserPreferenceType>, Record<string, never>, WithTypename<UserPreferenceType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<UserPreferenceType>, Record<string, never>, Scalars['String'] | string>
  },
  UserType?: {
    avatar?: GraphCacheResolver<WithTypename<UserType>, Record<string, never>, Scalars['String'] | string>,
    bio?: GraphCacheResolver<WithTypename<UserType>, Record<string, never>, Scalars['String'] | string>,
    businessPhone?: GraphCacheResolver<WithTypename<UserType>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<UserType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<UserType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<UserType>, Record<string, never>, Scalars['String'] | string>,
    defaultRoute?: GraphCacheResolver<WithTypename<UserType>, Record<string, never>, Scalars['String'] | string>,
    email?: GraphCacheResolver<WithTypename<UserType>, Record<string, never>, Scalars['String'] | string>,
    firstName?: GraphCacheResolver<WithTypename<UserType>, Record<string, never>, Scalars['String'] | string>,
    groups?: GraphCacheResolver<WithTypename<UserType>, Record<string, never>, Array<WithTypename<GroupType> | string>>,
    isActive?: GraphCacheResolver<WithTypename<UserType>, Record<string, never>, Scalars['Boolean'] | string>,
    isBlocked?: GraphCacheResolver<WithTypename<UserType>, Record<string, never>, Scalars['Boolean'] | string>,
    isSuperuser?: GraphCacheResolver<WithTypename<UserType>, Record<string, never>, Scalars['Boolean'] | string>,
    lastName?: GraphCacheResolver<WithTypename<UserType>, Record<string, never>, Scalars['String'] | string>,
    loginRetry?: GraphCacheResolver<WithTypename<UserType>, Record<string, never>, Scalars['Int'] | string>,
    mobilePhone?: GraphCacheResolver<WithTypename<UserType>, Record<string, never>, Scalars['String'] | string>,
    preference?: GraphCacheResolver<WithTypename<UserType>, Record<string, never>, WithTypename<UserPreferenceType> | string>,
    uid?: GraphCacheResolver<WithTypename<UserType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<UserType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<UserType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<UserType>, Record<string, never>, Scalars['String'] | string>,
    userName?: GraphCacheResolver<WithTypename<UserType>, Record<string, never>, Scalars['String'] | string>
  },
  VoucherCodeType?: {
    code?: GraphCacheResolver<WithTypename<VoucherCodeType>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<VoucherCodeType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<VoucherCodeType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<VoucherCodeType>, Record<string, never>, Scalars['String'] | string>,
    isActive?: GraphCacheResolver<WithTypename<VoucherCodeType>, Record<string, never>, Scalars['Boolean'] | string>,
    uid?: GraphCacheResolver<WithTypename<VoucherCodeType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<VoucherCodeType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<VoucherCodeType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<VoucherCodeType>, Record<string, never>, Scalars['String'] | string>,
    usageLimit?: GraphCacheResolver<WithTypename<VoucherCodeType>, Record<string, never>, Scalars['Int'] | string>,
    used?: GraphCacheResolver<WithTypename<VoucherCodeType>, Record<string, never>, Scalars['Int'] | string>,
    voucher?: GraphCacheResolver<WithTypename<VoucherCodeType>, Record<string, never>, WithTypename<VoucherType> | string>,
    voucherUid?: GraphCacheResolver<WithTypename<VoucherCodeType>, Record<string, never>, Scalars['String'] | string>
  },
  VoucherCustomerType?: {
    createdAt?: GraphCacheResolver<WithTypename<VoucherCustomerType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<VoucherCustomerType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<VoucherCustomerType>, Record<string, never>, Scalars['String'] | string>,
    patient?: GraphCacheResolver<WithTypename<VoucherCustomerType>, Record<string, never>, WithTypename<PatientType> | string>,
    patientUid?: GraphCacheResolver<WithTypename<VoucherCustomerType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<VoucherCustomerType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<VoucherCustomerType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<VoucherCustomerType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<VoucherCustomerType>, Record<string, never>, Scalars['String'] | string>,
    voucherCode?: GraphCacheResolver<WithTypename<VoucherCustomerType>, Record<string, never>, WithTypename<VoucherCodeType> | string>,
    voucherCodeUid?: GraphCacheResolver<WithTypename<VoucherCustomerType>, Record<string, never>, Scalars['String'] | string>
  },
  VoucherType?: {
    codes?: GraphCacheResolver<WithTypename<VoucherType>, Record<string, never>, Array<WithTypename<VoucherCodeType> | string>>,
    createdAt?: GraphCacheResolver<WithTypename<VoucherType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<VoucherType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<VoucherType>, Record<string, never>, Scalars['String'] | string>,
    endDate?: GraphCacheResolver<WithTypename<VoucherType>, Record<string, never>, Scalars['String'] | string>,
    name?: GraphCacheResolver<WithTypename<VoucherType>, Record<string, never>, Scalars['String'] | string>,
    oncePerCustomer?: GraphCacheResolver<WithTypename<VoucherType>, Record<string, never>, Scalars['Boolean'] | string>,
    oncePerOrder?: GraphCacheResolver<WithTypename<VoucherType>, Record<string, never>, Scalars['Boolean'] | string>,
    startDate?: GraphCacheResolver<WithTypename<VoucherType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<VoucherType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<VoucherType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<VoucherType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<VoucherType>, Record<string, never>, Scalars['String'] | string>,
    usageLimit?: GraphCacheResolver<WithTypename<VoucherType>, Record<string, never>, Scalars['Int'] | string>,
    used?: GraphCacheResolver<WithTypename<VoucherType>, Record<string, never>, Scalars['Int'] | string>
  },
  WorkSheetCursorPage?: {
    edges?: GraphCacheResolver<WithTypename<WorkSheetCursorPage>, Record<string, never>, Array<WithTypename<WorkSheetEdge> | string>>,
    items?: GraphCacheResolver<WithTypename<WorkSheetCursorPage>, Record<string, never>, Array<WithTypename<WorkSheetType> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<WorkSheetCursorPage>, Record<string, never>, WithTypename<PageInfo> | string>,
    totalCount?: GraphCacheResolver<WithTypename<WorkSheetCursorPage>, Record<string, never>, Scalars['Int'] | string>
  },
  WorkSheetEdge?: {
    cursor?: GraphCacheResolver<WithTypename<WorkSheetEdge>, Record<string, never>, Scalars['String'] | string>,
    node?: GraphCacheResolver<WithTypename<WorkSheetEdge>, Record<string, never>, WithTypename<WorkSheetType> | string>
  },
  WorkSheetTemplateType?: {
    analysis?: GraphCacheResolver<WithTypename<WorkSheetTemplateType>, Record<string, never>, WithTypename<AnalysisType> | string>,
    analysisUid?: GraphCacheResolver<WithTypename<WorkSheetTemplateType>, Record<string, never>, Scalars['String'] | string>,
    cols?: GraphCacheResolver<WithTypename<WorkSheetTemplateType>, Record<string, never>, Scalars['Int'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<WorkSheetTemplateType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<WorkSheetTemplateType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<WorkSheetTemplateType>, Record<string, never>, Scalars['String'] | string>,
    description?: GraphCacheResolver<WithTypename<WorkSheetTemplateType>, Record<string, never>, Scalars['String'] | string>,
    instrument?: GraphCacheResolver<WithTypename<WorkSheetTemplateType>, Record<string, never>, WithTypename<InstrumentType> | string>,
    instrumentUid?: GraphCacheResolver<WithTypename<WorkSheetTemplateType>, Record<string, never>, Scalars['String'] | string>,
    name?: GraphCacheResolver<WithTypename<WorkSheetTemplateType>, Record<string, never>, Scalars['String'] | string>,
    numberOfSamples?: GraphCacheResolver<WithTypename<WorkSheetTemplateType>, Record<string, never>, Scalars['Int'] | string>,
    qcLevels?: GraphCacheResolver<WithTypename<WorkSheetTemplateType>, Record<string, never>, Array<WithTypename<QcLevelType> | string>>,
    qcTemplate?: GraphCacheResolver<WithTypename<WorkSheetTemplateType>, Record<string, never>, WithTypename<QcTemplateType> | string>,
    qcTemplateUid?: GraphCacheResolver<WithTypename<WorkSheetTemplateType>, Record<string, never>, Scalars['String'] | string>,
    reserved?: GraphCacheResolver<WithTypename<WorkSheetTemplateType>, Record<string, never>, Scalars['JSONScalar'] | string>,
    rowWise?: GraphCacheResolver<WithTypename<WorkSheetTemplateType>, Record<string, never>, Scalars['Boolean'] | string>,
    rows?: GraphCacheResolver<WithTypename<WorkSheetTemplateType>, Record<string, never>, Scalars['Int'] | string>,
    sampleType?: GraphCacheResolver<WithTypename<WorkSheetTemplateType>, Record<string, never>, WithTypename<SampleTypeTyp> | string>,
    sampleTypeUid?: GraphCacheResolver<WithTypename<WorkSheetTemplateType>, Record<string, never>, Scalars['String'] | string>,
    state?: GraphCacheResolver<WithTypename<WorkSheetTemplateType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<WorkSheetTemplateType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<WorkSheetTemplateType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<WorkSheetTemplateType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<WorkSheetTemplateType>, Record<string, never>, Scalars['String'] | string>,
    worksheetType?: GraphCacheResolver<WithTypename<WorkSheetTemplateType>, Record<string, never>, Scalars['String'] | string>
  },
  WorkSheetType?: {
    analysis?: GraphCacheResolver<WithTypename<WorkSheetType>, Record<string, never>, WithTypename<AnalysisType> | string>,
    analysisResults?: GraphCacheResolver<WithTypename<WorkSheetType>, Record<string, never>, Array<WithTypename<AnalysisResultType> | string>>,
    analysisUid?: GraphCacheResolver<WithTypename<WorkSheetType>, Record<string, never>, Scalars['String'] | string>,
    analyst?: GraphCacheResolver<WithTypename<WorkSheetType>, Record<string, never>, WithTypename<UserType> | string>,
    analystUid?: GraphCacheResolver<WithTypename<WorkSheetType>, Record<string, never>, Scalars['String'] | string>,
    assignedCount?: GraphCacheResolver<WithTypename<WorkSheetType>, Record<string, never>, Scalars['Int'] | string>,
    cols?: GraphCacheResolver<WithTypename<WorkSheetType>, Record<string, never>, Scalars['Int'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<WorkSheetType>, Record<string, never>, Scalars['String'] | string>,
    createdBy?: GraphCacheResolver<WithTypename<WorkSheetType>, Record<string, never>, WithTypename<UserType> | string>,
    createdByUid?: GraphCacheResolver<WithTypename<WorkSheetType>, Record<string, never>, Scalars['String'] | string>,
    dateSubmitted?: GraphCacheResolver<WithTypename<WorkSheetType>, Record<string, never>, Scalars['DateTime'] | string>,
    dateVerified?: GraphCacheResolver<WithTypename<WorkSheetType>, Record<string, never>, Scalars['DateTime'] | string>,
    instrument?: GraphCacheResolver<WithTypename<WorkSheetType>, Record<string, never>, WithTypename<InstrumentType> | string>,
    instrumentUid?: GraphCacheResolver<WithTypename<WorkSheetType>, Record<string, never>, Scalars['String'] | string>,
    numberOfSamples?: GraphCacheResolver<WithTypename<WorkSheetType>, Record<string, never>, Scalars['Int'] | string>,
    reserved?: GraphCacheResolver<WithTypename<WorkSheetType>, Record<string, never>, Scalars['JSONScalar'] | string>,
    rowWise?: GraphCacheResolver<WithTypename<WorkSheetType>, Record<string, never>, Scalars['Boolean'] | string>,
    rows?: GraphCacheResolver<WithTypename<WorkSheetType>, Record<string, never>, Scalars['Int'] | string>,
    sampleType?: GraphCacheResolver<WithTypename<WorkSheetType>, Record<string, never>, WithTypename<SampleTypeTyp> | string>,
    sampleTypeUid?: GraphCacheResolver<WithTypename<WorkSheetType>, Record<string, never>, Scalars['String'] | string>,
    state?: GraphCacheResolver<WithTypename<WorkSheetType>, Record<string, never>, Scalars['String'] | string>,
    submittedBy?: GraphCacheResolver<WithTypename<WorkSheetType>, Record<string, never>, WithTypename<UserType> | string>,
    submittedByUid?: GraphCacheResolver<WithTypename<WorkSheetType>, Record<string, never>, Scalars['String'] | string>,
    template?: GraphCacheResolver<WithTypename<WorkSheetType>, Record<string, never>, WithTypename<WorkSheetTemplateType> | string>,
    templateUid?: GraphCacheResolver<WithTypename<WorkSheetType>, Record<string, never>, Scalars['String'] | string>,
    uid?: GraphCacheResolver<WithTypename<WorkSheetType>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<WorkSheetType>, Record<string, never>, Scalars['String'] | string>,
    updatedBy?: GraphCacheResolver<WithTypename<WorkSheetType>, Record<string, never>, WithTypename<UserType> | string>,
    updatedByUid?: GraphCacheResolver<WithTypename<WorkSheetType>, Record<string, never>, Scalars['String'] | string>,
    verifiedBy?: GraphCacheResolver<WithTypename<WorkSheetType>, Record<string, never>, WithTypename<UserType> | string>,
    verifiedByUid?: GraphCacheResolver<WithTypename<WorkSheetType>, Record<string, never>, Scalars['String'] | string>,
    worksheetId?: GraphCacheResolver<WithTypename<WorkSheetType>, Record<string, never>, Scalars['String'] | string>,
    worksheetType?: GraphCacheResolver<WithTypename<WorkSheetType>, Record<string, never>, Scalars['String'] | string>
  },
  WorksheetListingType?: {
    worksheets?: GraphCacheResolver<WithTypename<WorksheetListingType>, Record<string, never>, Array<WithTypename<WorkSheetType> | string>>
  }
};

export type GraphCacheOptimisticUpdaters = {
  actionShipment?: GraphCacheOptimisticMutationResolver<MutationActionShipmentArgs, WithTypename<ShipmentResponse>>,
  actionWorksheets?: GraphCacheOptimisticMutationResolver<MutationActionWorksheetsArgs, WithTypename<WorkSheetsResponse>>,
  applyVoucher?: GraphCacheOptimisticMutationResolver<MutationApplyVoucherArgs, WithTypename<TestBillTransactionResponse>>,
  approveStockOrder?: GraphCacheOptimisticMutationResolver<MutationApproveStockOrderArgs, WithTypename<StockOrderResponse>>,
  authenticateUser?: GraphCacheOptimisticMutationResolver<MutationAuthenticateUserArgs, WithTypename<AuthenticatedDataResponse>>,
  cancelAnalysisResults?: GraphCacheOptimisticMutationResolver<MutationCancelAnalysisResultsArgs, WithTypename<AnalysisResultResponse>>,
  cancelSamples?: GraphCacheOptimisticMutationResolver<MutationCancelSamplesArgs, WithTypename<ResultedSampleActionResponse>>,
  cloneSamples?: GraphCacheOptimisticMutationResolver<MutationCloneSamplesArgs, WithTypename<SampleActionResponse>>,
  confirmTestBillTransaction?: GraphCacheOptimisticMutationResolver<MutationConfirmTestBillTransactionArgs, WithTypename<TestBillTransactionResponse>>,
  createAnalysis?: GraphCacheOptimisticMutationResolver<MutationCreateAnalysisArgs, WithTypename<ProfilesServiceResponse>>,
  createAnalysisCategory?: GraphCacheOptimisticMutationResolver<MutationCreateAnalysisCategoryArgs, WithTypename<AnalysisCategoryResponse>>,
  createAnalysisCorrectionFactor?: GraphCacheOptimisticMutationResolver<MutationCreateAnalysisCorrectionFactorArgs, WithTypename<AnalysisCorrectionFactorResponse>>,
  createAnalysisDetectionLimit?: GraphCacheOptimisticMutationResolver<MutationCreateAnalysisDetectionLimitArgs, WithTypename<AnalysisDetectionLimitResponse>>,
  createAnalysisInterim?: GraphCacheOptimisticMutationResolver<MutationCreateAnalysisInterimArgs, WithTypename<AnalysisInterimResponse>>,
  createAnalysisMapping?: GraphCacheOptimisticMutationResolver<MutationCreateAnalysisMappingArgs, WithTypename<AnalysisMappingResponse>>,
  createAnalysisRequest?: GraphCacheOptimisticMutationResolver<MutationCreateAnalysisRequestArgs, WithTypename<AnalysisRequestResponse>>,
  createAnalysisSpecification?: GraphCacheOptimisticMutationResolver<MutationCreateAnalysisSpecificationArgs, WithTypename<AnalysisSpecificationResponse>>,
  createAnalysisTemplate?: GraphCacheOptimisticMutationResolver<MutationCreateAnalysisTemplateArgs, WithTypename<AnalysisTemplateResponse>>,
  createAnalysisUncertainty?: GraphCacheOptimisticMutationResolver<MutationCreateAnalysisUncertaintyArgs, WithTypename<AnalysisUncertaintyResponse>>,
  createCaliberationCertificate?: GraphCacheOptimisticMutationResolver<MutationCreateCaliberationCertificateArgs, WithTypename<CalibrationCertificateResponse>>,
  createClient?: GraphCacheOptimisticMutationResolver<MutationCreateClientArgs, WithTypename<ClientResponse>>,
  createClientContact?: GraphCacheOptimisticMutationResolver<MutationCreateClientContactArgs, WithTypename<ClientContactResponse>>,
  createCodingStandard?: GraphCacheOptimisticMutationResolver<MutationCreateCodingStandardArgs, WithTypename<CodingStandardResponse>>,
  createCountry?: GraphCacheOptimisticMutationResolver<MutationCreateCountryArgs, WithTypename<CountryResponse>>,
  createDepartment?: GraphCacheOptimisticMutationResolver<MutationCreateDepartmentArgs, WithTypename<DepartmentResponse>>,
  createDistrict?: GraphCacheOptimisticMutationResolver<MutationCreateDistrictArgs, WithTypename<DistrictResponse>>,
  createGroup?: GraphCacheOptimisticMutationResolver<MutationCreateGroupArgs, WithTypename<GroupResponse>>,
  createHazard?: GraphCacheOptimisticMutationResolver<MutationCreateHazardArgs, WithTypename<HazardResponse>>,
  createIdentification?: GraphCacheOptimisticMutationResolver<MutationCreateIdentificationArgs, WithTypename<IdentificationResponse>>,
  createInstrument?: GraphCacheOptimisticMutationResolver<MutationCreateInstrumentArgs, WithTypename<InstrumentResponse>>,
  createInstrumentCaliberation?: GraphCacheOptimisticMutationResolver<MutationCreateInstrumentCaliberationArgs, WithTypename<InstrumentCalibrationResponse>>,
  createInstrumentCompetence?: GraphCacheOptimisticMutationResolver<MutationCreateInstrumentCompetenceArgs, WithTypename<InstrumentCompetenceResponse>>,
  createInstrumentType?: GraphCacheOptimisticMutationResolver<MutationCreateInstrumentTypeArgs, WithTypename<InstrumentTypeResponse>>,
  createLaboratoryInstrument?: GraphCacheOptimisticMutationResolver<MutationCreateLaboratoryInstrumentArgs, WithTypename<LaboratoryInstrumentResponse>>,
  createManufacturer?: GraphCacheOptimisticMutationResolver<MutationCreateManufacturerArgs, WithTypename<ManufacturerResponse>>,
  createMethod?: GraphCacheOptimisticMutationResolver<MutationCreateMethodArgs, WithTypename<MethodResponse>>,
  createNotice?: GraphCacheOptimisticMutationResolver<MutationCreateNoticeArgs, WithTypename<NoticeResponse>>,
  createPatient?: GraphCacheOptimisticMutationResolver<MutationCreatePatientArgs, WithTypename<PatientResponse>>,
  createProfile?: GraphCacheOptimisticMutationResolver<MutationCreateProfileArgs, WithTypename<AnalysisProfileResponse>>,
  createProfileMapping?: GraphCacheOptimisticMutationResolver<MutationCreateProfileMappingArgs, WithTypename<ProfileMappingResponse>>,
  createProvince?: GraphCacheOptimisticMutationResolver<MutationCreateProvinceArgs, WithTypename<ProvinceResponse>>,
  createQcLevel?: GraphCacheOptimisticMutationResolver<MutationCreateQcLevelArgs, WithTypename<QcLevelResponse>>,
  createQcSet?: GraphCacheOptimisticMutationResolver<MutationCreateQcSetArgs, WithTypename<QcSetResponse>>,
  createQcTemplate?: GraphCacheOptimisticMutationResolver<MutationCreateQcTemplateArgs, WithTypename<QcTemplateResponse>>,
  createReferralLaboratory?: GraphCacheOptimisticMutationResolver<MutationCreateReferralLaboratoryArgs, WithTypename<ReferralLaboratoryResponse>>,
  createReflexAction?: GraphCacheOptimisticMutationResolver<MutationCreateReflexActionArgs, WithTypename<ReflexActionResponse>>,
  createReflexBrain?: GraphCacheOptimisticMutationResolver<MutationCreateReflexBrainArgs, WithTypename<ReflexBrainResponse>>,
  createReflexRule?: GraphCacheOptimisticMutationResolver<MutationCreateReflexRuleArgs, WithTypename<ReflexRuleResponse>>,
  createRejectionReason?: GraphCacheOptimisticMutationResolver<MutationCreateRejectionReasonArgs, WithTypename<RejectionReasonResponse>>,
  createResultOption?: GraphCacheOptimisticMutationResolver<MutationCreateResultOptionArgs, WithTypename<ResultOptionResponse>>,
  createSampleType?: GraphCacheOptimisticMutationResolver<MutationCreateSampleTypeArgs, WithTypename<SampleTypeResponse>>,
  createSampleTypeMapping?: GraphCacheOptimisticMutationResolver<MutationCreateSampleTypeMappingArgs, WithTypename<SampleTypeMappingResponse>>,
  createShipment?: GraphCacheOptimisticMutationResolver<MutationCreateShipmentArgs, WithTypename<ShipmentsResponse>>,
  createStockAdjustment?: GraphCacheOptimisticMutationResolver<MutationCreateStockAdjustmentArgs, WithTypename<StockAdjustmentResponse>>,
  createStockCategory?: GraphCacheOptimisticMutationResolver<MutationCreateStockCategoryArgs, WithTypename<StockCategoryResponse>>,
  createStockItem?: GraphCacheOptimisticMutationResolver<MutationCreateStockItemArgs, WithTypename<StockItemResponse>>,
  createStockItemVariant?: GraphCacheOptimisticMutationResolver<MutationCreateStockItemVariantArgs, WithTypename<StockItemVariantResponse>>,
  createStockOrder?: GraphCacheOptimisticMutationResolver<MutationCreateStockOrderArgs, WithTypename<StockOrderResponse>>,
  createStockReceipt?: GraphCacheOptimisticMutationResolver<MutationCreateStockReceiptArgs, WithTypename<StockItemVariantResponse>>,
  createStockUnit?: GraphCacheOptimisticMutationResolver<MutationCreateStockUnitArgs, WithTypename<StockUnitResponse>>,
  createStorageContainer?: GraphCacheOptimisticMutationResolver<MutationCreateStorageContainerArgs, WithTypename<StorageContainerResponse>>,
  createStorageLocation?: GraphCacheOptimisticMutationResolver<MutationCreateStorageLocationArgs, WithTypename<StorageLocationResponse>>,
  createStorageSection?: GraphCacheOptimisticMutationResolver<MutationCreateStorageSectionArgs, WithTypename<StorageSectionResponse>>,
  createStoreRoom?: GraphCacheOptimisticMutationResolver<MutationCreateStoreRoomArgs, WithTypename<StoreRoomResponse>>,
  createSupplier?: GraphCacheOptimisticMutationResolver<MutationCreateSupplierArgs, WithTypename<SupplierResponse>>,
  createTestBillTransaction?: GraphCacheOptimisticMutationResolver<MutationCreateTestBillTransactionArgs, WithTypename<TestBillTransactionResponse>>,
  createUnit?: GraphCacheOptimisticMutationResolver<MutationCreateUnitArgs, WithTypename<UnitResponse>>,
  createUser?: GraphCacheOptimisticMutationResolver<MutationCreateUserArgs, WithTypename<UserResponse>>,
  createVoucher?: GraphCacheOptimisticMutationResolver<MutationCreateVoucherArgs, WithTypename<VoucherResponse>>,
  createVoucherCode?: GraphCacheOptimisticMutationResolver<MutationCreateVoucherCodeArgs, WithTypename<VoucherCodeResponse>>,
  createWorksheet?: GraphCacheOptimisticMutationResolver<MutationCreateWorksheetArgs, WithTypename<WorkSheetsResponse>>,
  createWorksheetTemplate?: GraphCacheOptimisticMutationResolver<MutationCreateWorksheetTemplateArgs, WithTypename<WorkSheetTemplateResponse>>,
  deleteClientContact?: GraphCacheOptimisticMutationResolver<MutationDeleteClientContactArgs, WithTypename<DeleteContactResponse>>,
  deleteMessage?: GraphCacheOptimisticMutationResolver<MutationDeleteMessageArgs, WithTypename<DeleteResponse>>,
  deleteNotice?: GraphCacheOptimisticMutationResolver<MutationDeleteNoticeArgs, WithTypename<DeleteResponse>>,
  deleteReflexBrain?: GraphCacheOptimisticMutationResolver<MutationDeleteReflexBrainArgs, WithTypename<DeletedItem>>,
  deleteStockOrder?: GraphCacheOptimisticMutationResolver<MutationDeleteStockOrderArgs, WithTypename<StockOrderResponse>>,
  deleteThread?: GraphCacheOptimisticMutationResolver<MutationDeleteThreadArgs, WithTypename<DeleteResponse>>,
  invalidateSamples?: GraphCacheOptimisticMutationResolver<MutationInvalidateSamplesArgs, WithTypename<SampleActionResponse>>,
  issueStockOrder?: GraphCacheOptimisticMutationResolver<MutationIssueStockOrderArgs, WithTypename<StockOrderResponse>>,
  manageAnalyses?: GraphCacheOptimisticMutationResolver<MutationManageAnalysesArgs, WithTypename<ResultedSampleActionResponse>>,
  printSamples?: GraphCacheOptimisticMutationResolver<MutationPrintSamplesArgs, WithTypename<SampleActionResponse>>,
  publishSamples?: GraphCacheOptimisticMutationResolver<MutationPublishSamplesArgs, WithTypename<SuccessErrorResponse>>,
  reInstateAnalysisResults?: GraphCacheOptimisticMutationResolver<MutationReInstateAnalysisResultsArgs, WithTypename<AnalysisResultResponse>>,
  reInstateSamples?: GraphCacheOptimisticMutationResolver<MutationReInstateSamplesArgs, WithTypename<ResultedSampleActionResponse>>,
  receiveSamples?: GraphCacheOptimisticMutationResolver<MutationReceiveSamplesArgs, WithTypename<ResultedSampleActionResponse>>,
  recoverSamples?: GraphCacheOptimisticMutationResolver<MutationRecoverSamplesArgs, WithTypename<StoreSampleResponse>>,
  refresh?: GraphCacheOptimisticMutationResolver<MutationRefreshArgs, WithTypename<AuthenticatedDataResponse>>,
  rejectSamples?: GraphCacheOptimisticMutationResolver<MutationRejectSamplesArgs, WithTypename<SampleActionResponse>>,
  replyMessage?: GraphCacheOptimisticMutationResolver<MutationReplyMessageArgs, WithTypename<MessageResponse>>,
  requestPasswordReset?: GraphCacheOptimisticMutationResolver<MutationRequestPasswordResetArgs, WithTypename<MessageResponse>>,
  resetPassword?: GraphCacheOptimisticMutationResolver<MutationResetPasswordArgs, WithTypename<MessageResponse>>,
  retestAnalysisResults?: GraphCacheOptimisticMutationResolver<MutationRetestAnalysisResultsArgs, WithTypename<AnalysisResultResponse>>,
  retractAnalysisResults?: GraphCacheOptimisticMutationResolver<MutationRetractAnalysisResultsArgs, WithTypename<AnalysisResultResponse>>,
  samplesApplyTemplate?: GraphCacheOptimisticMutationResolver<MutationSamplesApplyTemplateArgs, WithTypename<ResultedSampleActionResponse>>,
  sendMessage?: GraphCacheOptimisticMutationResolver<MutationSendMessageArgs, WithTypename<MessageResponse>>,
  shipmentManageSamples?: GraphCacheOptimisticMutationResolver<MutationShipmentManageSamplesArgs, WithTypename<ShipmentResponse>>,
  storeSamples?: GraphCacheOptimisticMutationResolver<MutationStoreSamplesArgs, WithTypename<StoreSampleResponse>>,
  submitAnalysisResults?: GraphCacheOptimisticMutationResolver<MutationSubmitAnalysisResultsArgs, WithTypename<AnalysisResultSubmitResponse>>,
  submitStockOrder?: GraphCacheOptimisticMutationResolver<MutationSubmitStockOrderArgs, WithTypename<StockOrderResponse>>,
  updateAnalysis?: GraphCacheOptimisticMutationResolver<MutationUpdateAnalysisArgs, WithTypename<ProfilesServiceResponse>>,
  updateAnalysisCategory?: GraphCacheOptimisticMutationResolver<MutationUpdateAnalysisCategoryArgs, WithTypename<AnalysisCategoryResponse>>,
  updateAnalysisCorrectionFactor?: GraphCacheOptimisticMutationResolver<MutationUpdateAnalysisCorrectionFactorArgs, WithTypename<AnalysisCorrectionFactorResponse>>,
  updateAnalysisDetectionLimit?: GraphCacheOptimisticMutationResolver<MutationUpdateAnalysisDetectionLimitArgs, WithTypename<AnalysisDetectionLimitResponse>>,
  updateAnalysisDiscount?: GraphCacheOptimisticMutationResolver<MutationUpdateAnalysisDiscountArgs, WithTypename<AnalysisDiscountResponse>>,
  updateAnalysisInterim?: GraphCacheOptimisticMutationResolver<MutationUpdateAnalysisInterimArgs, WithTypename<AnalysisInterimResponse>>,
  updateAnalysisMapping?: GraphCacheOptimisticMutationResolver<MutationUpdateAnalysisMappingArgs, WithTypename<AnalysisMappingResponse>>,
  updateAnalysisPrice?: GraphCacheOptimisticMutationResolver<MutationUpdateAnalysisPriceArgs, WithTypename<AnalysisPriceResponse>>,
  updateAnalysisSpecification?: GraphCacheOptimisticMutationResolver<MutationUpdateAnalysisSpecificationArgs, WithTypename<AnalysisSpecificationResponse>>,
  updateAnalysisTemplate?: GraphCacheOptimisticMutationResolver<MutationUpdateAnalysisTemplateArgs, WithTypename<AnalysisTemplateResponse>>,
  updateAnalysisUncertainty?: GraphCacheOptimisticMutationResolver<MutationUpdateAnalysisUncertaintyArgs, WithTypename<AnalysisUncertaintyResponse>>,
  updateCaliberationCertificate?: GraphCacheOptimisticMutationResolver<MutationUpdateCaliberationCertificateArgs, WithTypename<CalibrationCertificateResponse>>,
  updateClient?: GraphCacheOptimisticMutationResolver<MutationUpdateClientArgs, WithTypename<ClientResponse>>,
  updateClientContact?: GraphCacheOptimisticMutationResolver<MutationUpdateClientContactArgs, WithTypename<ClientContactResponse>>,
  updateCodingStandard?: GraphCacheOptimisticMutationResolver<MutationUpdateCodingStandardArgs, WithTypename<CodingStandardResponse>>,
  updateCountry?: GraphCacheOptimisticMutationResolver<MutationUpdateCountryArgs, WithTypename<CountryResponse>>,
  updateDepartment?: GraphCacheOptimisticMutationResolver<MutationUpdateDepartmentArgs, WithTypename<DepartmentResponse>>,
  updateDistrict?: GraphCacheOptimisticMutationResolver<MutationUpdateDistrictArgs, WithTypename<DistrictResponse>>,
  updateGroup?: GraphCacheOptimisticMutationResolver<MutationUpdateGroupArgs, WithTypename<GroupResponse>>,
  updateGroupPermissions?: GraphCacheOptimisticMutationResolver<MutationUpdateGroupPermissionsArgs, WithTypename<UpdatedGroupPermsResponse>>,
  updateHazard?: GraphCacheOptimisticMutationResolver<MutationUpdateHazardArgs, WithTypename<HazardResponse>>,
  updateIdentification?: GraphCacheOptimisticMutationResolver<MutationUpdateIdentificationArgs, WithTypename<IdentificationResponse>>,
  updateInstrument?: GraphCacheOptimisticMutationResolver<MutationUpdateInstrumentArgs, WithTypename<InstrumentResponse>>,
  updateInstrumentCaliberation?: GraphCacheOptimisticMutationResolver<MutationUpdateInstrumentCaliberationArgs, WithTypename<InstrumentCalibrationResponse>>,
  updateInstrumentCompetence?: GraphCacheOptimisticMutationResolver<MutationUpdateInstrumentCompetenceArgs, WithTypename<InstrumentCompetenceResponse>>,
  updateInstrumentType?: GraphCacheOptimisticMutationResolver<MutationUpdateInstrumentTypeArgs, WithTypename<InstrumentTypeResponse>>,
  updateLaboratory?: GraphCacheOptimisticMutationResolver<MutationUpdateLaboratoryArgs, WithTypename<LaboratoryResponse>>,
  updateLaboratoryInstrument?: GraphCacheOptimisticMutationResolver<MutationUpdateLaboratoryInstrumentArgs, WithTypename<LaboratoryInstrumentResponse>>,
  updateLaboratorySetting?: GraphCacheOptimisticMutationResolver<MutationUpdateLaboratorySettingArgs, WithTypename<LaboratorySettingResponse>>,
  updateManufacturer?: GraphCacheOptimisticMutationResolver<MutationUpdateManufacturerArgs, WithTypename<ManufacturerResponse>>,
  updateMethod?: GraphCacheOptimisticMutationResolver<MutationUpdateMethodArgs, WithTypename<MethodResponse>>,
  updateNotice?: GraphCacheOptimisticMutationResolver<MutationUpdateNoticeArgs, WithTypename<NoticeResponse>>,
  updatePatient?: GraphCacheOptimisticMutationResolver<MutationUpdatePatientArgs, WithTypename<PatientResponse>>,
  updateProfile?: GraphCacheOptimisticMutationResolver<MutationUpdateProfileArgs, WithTypename<AnalysisProfileResponse>>,
  updateProfileDiscount?: GraphCacheOptimisticMutationResolver<MutationUpdateProfileDiscountArgs, WithTypename<ProfileDiscountResponse>>,
  updateProfileMapping?: GraphCacheOptimisticMutationResolver<MutationUpdateProfileMappingArgs, WithTypename<ProfileMappingResponse>>,
  updateProfilePrice?: GraphCacheOptimisticMutationResolver<MutationUpdateProfilePriceArgs, WithTypename<ProfilePriceResponse>>,
  updateProvince?: GraphCacheOptimisticMutationResolver<MutationUpdateProvinceArgs, WithTypename<ProvinceResponse>>,
  updateQcLevel?: GraphCacheOptimisticMutationResolver<MutationUpdateQcLevelArgs, WithTypename<QcLevelResponse>>,
  updateQcTemplate?: GraphCacheOptimisticMutationResolver<MutationUpdateQcTemplateArgs, WithTypename<QcTemplateResponse>>,
  updateReferralLaboratory?: GraphCacheOptimisticMutationResolver<MutationUpdateReferralLaboratoryArgs, WithTypename<ReferralLaboratoryResponse>>,
  updateReflexAction?: GraphCacheOptimisticMutationResolver<MutationUpdateReflexActionArgs, WithTypename<ReflexActionResponse>>,
  updateReflexBrain?: GraphCacheOptimisticMutationResolver<MutationUpdateReflexBrainArgs, WithTypename<ReflexBrainResponse>>,
  updateReflexRule?: GraphCacheOptimisticMutationResolver<MutationUpdateReflexRuleArgs, WithTypename<ReflexRuleResponse>>,
  updateRejectionReason?: GraphCacheOptimisticMutationResolver<MutationUpdateRejectionReasonArgs, WithTypename<RejectionReasonResponse>>,
  updateResultOption?: GraphCacheOptimisticMutationResolver<MutationUpdateResultOptionArgs, WithTypename<ResultOptionResponse>>,
  updateSampleType?: GraphCacheOptimisticMutationResolver<MutationUpdateSampleTypeArgs, WithTypename<SampleTypeResponse>>,
  updateSampleTypeMapping?: GraphCacheOptimisticMutationResolver<MutationUpdateSampleTypeMappingArgs, WithTypename<SampleTypeMappingResponse>>,
  updateShipment?: GraphCacheOptimisticMutationResolver<MutationUpdateShipmentArgs, WithTypename<ShipmentResponse>>,
  updateStockCategory?: GraphCacheOptimisticMutationResolver<MutationUpdateStockCategoryArgs, WithTypename<StockCategoryResponse>>,
  updateStockItem?: GraphCacheOptimisticMutationResolver<MutationUpdateStockItemArgs, WithTypename<StockItemResponse>>,
  updateStockItemVariant?: GraphCacheOptimisticMutationResolver<MutationUpdateStockItemVariantArgs, WithTypename<StockItemVariantResponse>>,
  updateStockOrder?: GraphCacheOptimisticMutationResolver<MutationUpdateStockOrderArgs, WithTypename<StockOrderResponse>>,
  updateStockUnit?: GraphCacheOptimisticMutationResolver<MutationUpdateStockUnitArgs, WithTypename<StockUnitResponse>>,
  updateStorageContainer?: GraphCacheOptimisticMutationResolver<MutationUpdateStorageContainerArgs, WithTypename<StorageContainerResponse>>,
  updateStorageLocation?: GraphCacheOptimisticMutationResolver<MutationUpdateStorageLocationArgs, WithTypename<StorageLocationResponse>>,
  updateStorageSection?: GraphCacheOptimisticMutationResolver<MutationUpdateStorageSectionArgs, WithTypename<StorageSectionResponse>>,
  updateStoreRoom?: GraphCacheOptimisticMutationResolver<MutationUpdateStoreRoomArgs, WithTypename<StoreRoomResponse>>,
  updateSupplier?: GraphCacheOptimisticMutationResolver<MutationUpdateSupplierArgs, WithTypename<SupplierResponse>>,
  updateUnit?: GraphCacheOptimisticMutationResolver<MutationUpdateUnitArgs, WithTypename<UnitResponse>>,
  updateUser?: GraphCacheOptimisticMutationResolver<MutationUpdateUserArgs, WithTypename<UserResponse>>,
  updateVoucher?: GraphCacheOptimisticMutationResolver<MutationUpdateVoucherArgs, WithTypename<VoucherResponse>>,
  updateVoucherCode?: GraphCacheOptimisticMutationResolver<MutationUpdateVoucherCodeArgs, WithTypename<VoucherCodeResponse>>,
  updateWorksheet?: GraphCacheOptimisticMutationResolver<MutationUpdateWorksheetArgs, WithTypename<WorkSheetResponse>>,
  updateWorksheetApplyTemplate?: GraphCacheOptimisticMutationResolver<MutationUpdateWorksheetApplyTemplateArgs, WithTypename<WorkSheetResponse>>,
  updateWorksheetManualAssign?: GraphCacheOptimisticMutationResolver<MutationUpdateWorksheetManualAssignArgs, WithTypename<WorkSheetResponse>>,
  updateWorksheetTemplate?: GraphCacheOptimisticMutationResolver<MutationUpdateWorksheetTemplateArgs, WithTypename<WorkSheetTemplateResponse>>,
  validatePasswordResetToken?: GraphCacheOptimisticMutationResolver<MutationValidatePasswordResetTokenArgs, WithTypename<PasswordResetValidityResponse>>,
  verifyAnalysisResults?: GraphCacheOptimisticMutationResolver<MutationVerifyAnalysisResultsArgs, WithTypename<AnalysisResultSubmitResponse>>,
  verifySamples?: GraphCacheOptimisticMutationResolver<MutationVerifySamplesArgs, WithTypename<SampleActionResponse>>,
  viewMessage?: GraphCacheOptimisticMutationResolver<MutationViewMessageArgs, WithTypename<MessageResponse>>,
  viewNotice?: GraphCacheOptimisticMutationResolver<MutationViewNoticeArgs, WithTypename<NoticeType>>
};

export type GraphCacheUpdaters = {
  Query?: {
    analysisAll?: GraphCacheUpdateResolver<{ analysisAll: WithTypename<AnalysisCursorPage> }, QueryAnalysisAllArgs>,
    analysisByUid?: GraphCacheUpdateResolver<{ analysisByUid: WithTypename<AnalysisType> }, QueryAnalysisByUidArgs>,
    analysisCategoryAll?: GraphCacheUpdateResolver<{ analysisCategoryAll: Array<WithTypename<AnalysisCategoryType>> }, Record<string, never>>,
    analysisCategoryByUid?: GraphCacheUpdateResolver<{ analysisCategoryByUid: WithTypename<AnalysisCategoryType> }, QueryAnalysisCategoryByUidArgs>,
    analysisCorrectionFactorAll?: GraphCacheUpdateResolver<{ analysisCorrectionFactorAll: Array<WithTypename<AnalysisCorrectionFactorType>> }, Record<string, never>>,
    analysisCorrectionFactorByUid?: GraphCacheUpdateResolver<{ analysisCorrectionFactorByUid: WithTypename<AnalysisCorrectionFactorType> }, QueryAnalysisCorrectionFactorByUidArgs>,
    analysisDetectionLimitAll?: GraphCacheUpdateResolver<{ analysisDetectionLimitAll: Array<WithTypename<AnalysisDetectionLimitType>> }, Record<string, never>>,
    analysisDetectionLimitByUid?: GraphCacheUpdateResolver<{ analysisDetectionLimitByUid: WithTypename<AnalysisDetectionLimitType> }, QueryAnalysisDetectionLimitByUidArgs>,
    analysisInterimAll?: GraphCacheUpdateResolver<{ analysisInterimAll: Array<WithTypename<AnalysisInterimType>> }, Record<string, never>>,
    analysisInterimByUid?: GraphCacheUpdateResolver<{ analysisInterimByUid: WithTypename<AnalysisInterimType> }, QueryAnalysisInterimByUidArgs>,
    analysisMappingsByAnalysis?: GraphCacheUpdateResolver<{ analysisMappingsByAnalysis: Array<WithTypename<AnalysisMappingType>> }, QueryAnalysisMappingsByAnalysisArgs>,
    analysisProcessPerformance?: GraphCacheUpdateResolver<{ analysisProcessPerformance: WithTypename<ProcessStatistics> }, QueryAnalysisProcessPerformanceArgs>,
    analysisRequestAll?: GraphCacheUpdateResolver<{ analysisRequestAll: WithTypename<AnalysisRequestCursorPage> }, QueryAnalysisRequestAllArgs>,
    analysisRequestByUid?: GraphCacheUpdateResolver<{ analysisRequestByUid: WithTypename<AnalysisRequestWithSamples> }, QueryAnalysisRequestByUidArgs>,
    analysisRequestsByClientUid?: GraphCacheUpdateResolver<{ analysisRequestsByClientUid: Array<WithTypename<AnalysisRequestWithSamples>> }, QueryAnalysisRequestsByClientUidArgs>,
    analysisRequestsByPatientUid?: GraphCacheUpdateResolver<{ analysisRequestsByPatientUid: Array<WithTypename<AnalysisRequestWithSamples>> }, QueryAnalysisRequestsByPatientUidArgs>,
    analysisResultBySampleUid?: GraphCacheUpdateResolver<{ analysisResultBySampleUid: Array<WithTypename<AnalysisResultType>> }, QueryAnalysisResultBySampleUidArgs>,
    analysisResultByUid?: GraphCacheUpdateResolver<{ analysisResultByUid: WithTypename<AnalysisResultType> }, QueryAnalysisResultByUidArgs>,
    analysisResultsForWsAssign?: GraphCacheUpdateResolver<{ analysisResultsForWsAssign: WithTypename<AnalysisResultCursorPage> }, QueryAnalysisResultsForWsAssignArgs>,
    analysisSpecificationAll?: GraphCacheUpdateResolver<{ analysisSpecificationAll: Array<WithTypename<AnalysisSpecificationType>> }, Record<string, never>>,
    analysisSpecificationUid?: GraphCacheUpdateResolver<{ analysisSpecificationUid: WithTypename<AnalysisSpecificationType> }, QueryAnalysisSpecificationUidArgs>,
    analysisTemplateAll?: GraphCacheUpdateResolver<{ analysisTemplateAll: Array<WithTypename<AnalysisTemplateType>> }, Record<string, never>>,
    analysisTemplateByUid?: GraphCacheUpdateResolver<{ analysisTemplateByUid: WithTypename<AnalysisTemplateType> }, QueryAnalysisTemplateByUidArgs>,
    analysisUncertaintyAll?: GraphCacheUpdateResolver<{ analysisUncertaintyAll: Array<WithTypename<AnalysisUncertaintyType>> }, Record<string, never>>,
    analysisUncertaintyByUid?: GraphCacheUpdateResolver<{ analysisUncertaintyByUid: WithTypename<AnalysisUncertaintyType> }, QueryAnalysisUncertaintyByUidArgs>,
    analysisWithoutProfile?: GraphCacheUpdateResolver<{ analysisWithoutProfile: Array<WithTypename<AnalysisType>> }, Record<string, never>>,
    auditLogsFilter?: GraphCacheUpdateResolver<{ auditLogsFilter: Maybe<Array<WithTypename<AuditLogType>>> }, QueryAuditLogsFilterArgs>,
    barcodeSamples?: GraphCacheUpdateResolver<{ barcodeSamples: Maybe<Array<Scalars['BytesScalar']>> }, QueryBarcodeSamplesArgs>,
    billByUid?: GraphCacheUpdateResolver<{ billByUid: Maybe<WithTypename<TestBillType>> }, QueryBillByUidArgs>,
    billInvoice?: GraphCacheUpdateResolver<{ billInvoice: Maybe<WithTypename<TestBillInvoiceType>> }, QueryBillInvoiceArgs>,
    billInvoiceCreate?: GraphCacheUpdateResolver<{ billInvoiceCreate: Maybe<Scalars['BytesScalar']> }, QueryBillInvoiceCreateArgs>,
    billInvoices?: GraphCacheUpdateResolver<{ billInvoices: Maybe<Array<WithTypename<TestBillInvoiceType>>> }, QueryBillInvoicesArgs>,
    billTransactions?: GraphCacheUpdateResolver<{ billTransactions: Maybe<Array<WithTypename<TestBillTransactionType>>> }, QueryBillTransactionsArgs>,
    bills?: GraphCacheUpdateResolver<{ bills: WithTypename<TestBillCursorPage> }, QueryBillsArgs>,
    billsForClient?: GraphCacheUpdateResolver<{ billsForClient: Maybe<Array<WithTypename<TestBillType>>> }, QueryBillsForClientArgs>,
    billsForPatient?: GraphCacheUpdateResolver<{ billsForPatient: Maybe<Array<WithTypename<TestBillType>>> }, QueryBillsForPatientArgs>,
    clientAll?: GraphCacheUpdateResolver<{ clientAll: WithTypename<ClientCursorPage> }, QueryClientAllArgs>,
    clientByCode?: GraphCacheUpdateResolver<{ clientByCode: WithTypename<ClientType> }, QueryClientByCodeArgs>,
    clientByUid?: GraphCacheUpdateResolver<{ clientByUid: WithTypename<ClientType> }, QueryClientByUidArgs>,
    clientContactAll?: GraphCacheUpdateResolver<{ clientContactAll: Array<WithTypename<ClientContactType>> }, Record<string, never>>,
    clientContactByClientUid?: GraphCacheUpdateResolver<{ clientContactByClientUid: Array<WithTypename<ClientContactType>> }, QueryClientContactByClientUidArgs>,
    clientContactUid?: GraphCacheUpdateResolver<{ clientContactUid: WithTypename<ClientContactType> }, QueryClientContactUidArgs>,
    clientSearch?: GraphCacheUpdateResolver<{ clientSearch: Array<WithTypename<ClientType>> }, QueryClientSearchArgs>,
    clientsByName?: GraphCacheUpdateResolver<{ clientsByName: Array<WithTypename<ClientType>> }, QueryClientsByNameArgs>,
    codingStandardAll?: GraphCacheUpdateResolver<{ codingStandardAll: Array<WithTypename<CodingStandardType>> }, Record<string, never>>,
    countAnalyteGroupByInstrument?: GraphCacheUpdateResolver<{ countAnalyteGroupByInstrument: WithTypename<GroupedCounts> }, QueryCountAnalyteGroupByInstrumentArgs>,
    countAnalyteGroupByStatus?: GraphCacheUpdateResolver<{ countAnalyteGroupByStatus: WithTypename<GroupedCounts> }, Record<string, never>>,
    countExtrasGroupByStatus?: GraphCacheUpdateResolver<{ countExtrasGroupByStatus: WithTypename<GroupedCounts> }, Record<string, never>>,
    countSampleGroupByAction?: GraphCacheUpdateResolver<{ countSampleGroupByAction: WithTypename<GroupedData> }, QueryCountSampleGroupByActionArgs>,
    countSampleGroupByStatus?: GraphCacheUpdateResolver<{ countSampleGroupByStatus: WithTypename<GroupedCounts> }, Record<string, never>>,
    countWorksheetGroupByStatus?: GraphCacheUpdateResolver<{ countWorksheetGroupByStatus: WithTypename<GroupedCounts> }, Record<string, never>>,
    countryAll?: GraphCacheUpdateResolver<{ countryAll: Array<WithTypename<CountryType>> }, Record<string, never>>,
    countryByUid?: GraphCacheUpdateResolver<{ countryByUid: WithTypename<CountryType> }, QueryCountryByUidArgs>,
    departmentAll?: GraphCacheUpdateResolver<{ departmentAll: Array<WithTypename<DepartmentType>> }, Record<string, never>>,
    departmentByUid?: GraphCacheUpdateResolver<{ departmentByUid: WithTypename<DepartmentType> }, QueryDepartmentByUidArgs>,
    discountForAnalysis?: GraphCacheUpdateResolver<{ discountForAnalysis: Maybe<WithTypename<AnalysisDiscountType>> }, QueryDiscountForAnalysisArgs>,
    discountForProfile?: GraphCacheUpdateResolver<{ discountForProfile: Maybe<WithTypename<ProfileDiscountType>> }, QueryDiscountForProfileArgs>,
    districtAll?: GraphCacheUpdateResolver<{ districtAll: WithTypename<DistrictCursorPage> }, QueryDistrictAllArgs>,
    districtByUid?: GraphCacheUpdateResolver<{ districtByUid: WithTypename<DistrictType> }, QueryDistrictByUidArgs>,
    districtsByProvinceUid?: GraphCacheUpdateResolver<{ districtsByProvinceUid: Array<WithTypename<DistrictType>> }, QueryDistrictsByProvinceUidArgs>,
    groupAll?: GraphCacheUpdateResolver<{ groupAll: Array<WithTypename<GroupType>> }, Record<string, never>>,
    groupByUid?: GraphCacheUpdateResolver<{ groupByUid: Maybe<WithTypename<GroupType>> }, QueryGroupByUidArgs>,
    hazardAll?: GraphCacheUpdateResolver<{ hazardAll: Array<WithTypename<HazardType>> }, Record<string, never>>,
    hazardByUid?: GraphCacheUpdateResolver<{ hazardByUid: Maybe<WithTypename<HazardType>> }, QueryHazardByUidArgs>,
    identificationAll?: GraphCacheUpdateResolver<{ identificationAll: Array<WithTypename<IdentificationType>> }, Record<string, never>>,
    identificationByUid?: GraphCacheUpdateResolver<{ identificationByUid: WithTypename<IdentificationType> }, QueryIdentificationByUidArgs>,
    impressReportDownload?: GraphCacheUpdateResolver<{ impressReportDownload: Maybe<Scalars['BytesScalar']> }, QueryImpressReportDownloadArgs>,
    impressReportsDownload?: GraphCacheUpdateResolver<{ impressReportsDownload: Maybe<Scalars['BytesScalar']> }, QueryImpressReportsDownloadArgs>,
    impressReportsMeta?: GraphCacheUpdateResolver<{ impressReportsMeta: Array<WithTypename<ReportImpressType>> }, QueryImpressReportsMetaArgs>,
    instrumentAll?: GraphCacheUpdateResolver<{ instrumentAll: WithTypename<InstrumentCursorPage> }, QueryInstrumentAllArgs>,
    instrumentByUid?: GraphCacheUpdateResolver<{ instrumentByUid: WithTypename<InstrumentType> }, QueryInstrumentByUidArgs>,
    instrumentTypeAll?: GraphCacheUpdateResolver<{ instrumentTypeAll: WithTypename<InstrumentTypeCursorPage> }, QueryInstrumentTypeAllArgs>,
    instrumentTypeByUid?: GraphCacheUpdateResolver<{ instrumentTypeByUid: WithTypename<InstrumentTypeType> }, QueryInstrumentTypeByUidArgs>,
    laboratory?: GraphCacheUpdateResolver<{ laboratory: WithTypename<LaboratoryType> }, QueryLaboratoryArgs>,
    laboratoryInstrumentAll?: GraphCacheUpdateResolver<{ laboratoryInstrumentAll: WithTypename<LaboratoryInstrumentCursorPage> }, QueryLaboratoryInstrumentAllArgs>,
    laboratoryInstrumentByUid?: GraphCacheUpdateResolver<{ laboratoryInstrumentByUid: WithTypename<LaboratoryInstrumentType> }, QueryLaboratoryInstrumentByUidArgs>,
    laboratorySetting?: GraphCacheUpdateResolver<{ laboratorySetting: WithTypename<LaboratorySettingType> }, QueryLaboratorySettingArgs>,
    manifestReportDownload?: GraphCacheUpdateResolver<{ manifestReportDownload: Maybe<Scalars['BytesScalar']> }, QueryManifestReportDownloadArgs>,
    manufacturerAll?: GraphCacheUpdateResolver<{ manufacturerAll: Array<WithTypename<ManufacturerType>> }, Record<string, never>>,
    manufacturerByUid?: GraphCacheUpdateResolver<{ manufacturerByUid: WithTypename<ManufacturerType> }, QueryManufacturerByUidArgs>,
    methodAll?: GraphCacheUpdateResolver<{ methodAll: WithTypename<MethodCursorPage> }, QueryMethodAllArgs>,
    methodByUid?: GraphCacheUpdateResolver<{ methodByUid: WithTypename<MethodType> }, QueryMethodByUidArgs>,
    noticeByUid?: GraphCacheUpdateResolver<{ noticeByUid: Maybe<WithTypename<NoticeType>> }, QueryNoticeByUidArgs>,
    noticeFilter?: GraphCacheUpdateResolver<{ noticeFilter: Array<WithTypename<NoticeType>> }, QueryNoticeFilterArgs>,
    noticesByCreator?: GraphCacheUpdateResolver<{ noticesByCreator: Maybe<Array<WithTypename<NoticeType>>> }, QueryNoticesByCreatorArgs>,
    notificationByUid?: GraphCacheUpdateResolver<{ notificationByUid: Maybe<WithTypename<NotificationType>> }, QueryNotificationByUidArgs>,
    notificationFilter?: GraphCacheUpdateResolver<{ notificationFilter: Array<WithTypename<NotificationType>> }, QueryNotificationFilterArgs>,
    patientAll?: GraphCacheUpdateResolver<{ patientAll: WithTypename<PatientCursorPage> }, QueryPatientAllArgs>,
    patientByPatientId?: GraphCacheUpdateResolver<{ patientByPatientId: Maybe<WithTypename<PatientType>> }, QueryPatientByPatientIdArgs>,
    patientByUid?: GraphCacheUpdateResolver<{ patientByUid: Maybe<WithTypename<PatientType>> }, QueryPatientByUidArgs>,
    patientSearch?: GraphCacheUpdateResolver<{ patientSearch: Array<WithTypename<PatientType>> }, QueryPatientSearchArgs>,
    permissionAll?: GraphCacheUpdateResolver<{ permissionAll: Array<WithTypename<PermissionType>> }, Record<string, never>>,
    permissionByUid?: GraphCacheUpdateResolver<{ permissionByUid: Maybe<WithTypename<PermissionType>> }, QueryPermissionByUidArgs>,
    priceForAnalysis?: GraphCacheUpdateResolver<{ priceForAnalysis: Maybe<WithTypename<AnalysisPriceType>> }, QueryPriceForAnalysisArgs>,
    priceForProfile?: GraphCacheUpdateResolver<{ priceForProfile: Maybe<WithTypename<ProfilePriceType>> }, QueryPriceForProfileArgs>,
    profileAll?: GraphCacheUpdateResolver<{ profileAll: Array<WithTypename<ProfileType>> }, Record<string, never>>,
    profileByUid?: GraphCacheUpdateResolver<{ profileByUid: WithTypename<ProfileType> }, QueryProfileByUidArgs>,
    profileMappingsByProfile?: GraphCacheUpdateResolver<{ profileMappingsByProfile: Array<WithTypename<ProfileMappingType>> }, QueryProfileMappingsByProfileArgs>,
    provinceAll?: GraphCacheUpdateResolver<{ provinceAll: WithTypename<ProvinceCursorPage> }, QueryProvinceAllArgs>,
    provinceByUid?: GraphCacheUpdateResolver<{ provinceByUid: WithTypename<ProvinceType> }, QueryProvinceByUidArgs>,
    provincesByCountryUid?: GraphCacheUpdateResolver<{ provincesByCountryUid: Array<WithTypename<ProvinceType>> }, QueryProvincesByCountryUidArgs>,
    qcChartData?: GraphCacheUpdateResolver<{ qcChartData: Array<WithTypename<AnalysisResultType>> }, QueryQcChartDataArgs>,
    qcLevelAll?: GraphCacheUpdateResolver<{ qcLevelAll: Array<WithTypename<QcLevelType>> }, Record<string, never>>,
    qcLevelByUid?: GraphCacheUpdateResolver<{ qcLevelByUid: WithTypename<QcLevelType> }, QueryQcLevelByUidArgs>,
    qcSetAll?: GraphCacheUpdateResolver<{ qcSetAll: WithTypename<QcSetCursorPage> }, QueryQcSetAllArgs>,
    qcSetByUid?: GraphCacheUpdateResolver<{ qcSetByUid: WithTypename<QcSetWithSamples> }, QueryQcSetByUidArgs>,
    qcTemplateAll?: GraphCacheUpdateResolver<{ qcTemplateAll: Array<WithTypename<QcTemplateType>> }, Record<string, never>>,
    qcTemplateByUid?: GraphCacheUpdateResolver<{ qcTemplateByUid: WithTypename<QcTemplateType> }, QueryQcTemplateByUidArgs>,
    referralLaboratoryAll?: GraphCacheUpdateResolver<{ referralLaboratoryAll: Array<WithTypename<ReferralLaboratoryType>> }, Record<string, never>>,
    referralLaboratoryByCode?: GraphCacheUpdateResolver<{ referralLaboratoryByCode: WithTypename<ReferralLaboratoryType> }, QueryReferralLaboratoryByCodeArgs>,
    referralLaboratoryByUid?: GraphCacheUpdateResolver<{ referralLaboratoryByUid: WithTypename<ReferralLaboratoryType> }, QueryReferralLaboratoryByUidArgs>,
    reflexRuleAll?: GraphCacheUpdateResolver<{ reflexRuleAll: WithTypename<ReflexRuleCursorPage> }, QueryReflexRuleAllArgs>,
    reflexRuleByUid?: GraphCacheUpdateResolver<{ reflexRuleByUid: Maybe<WithTypename<ReflexRuleType>> }, QueryReflexRuleByUidArgs>,
    rejectionReasonByUid?: GraphCacheUpdateResolver<{ rejectionReasonByUid: WithTypename<RejectionReasonType> }, QueryRejectionReasonByUidArgs>,
    rejectionReasonsAll?: GraphCacheUpdateResolver<{ rejectionReasonsAll: Array<WithTypename<RejectionReasonType>> }, Record<string, never>>,
    resultMutationByResultUid?: GraphCacheUpdateResolver<{ resultMutationByResultUid: Maybe<WithTypename<ResultMutationType>> }, QueryResultMutationByResultUidArgs>,
    resultOptionsByAnalysisUid?: GraphCacheUpdateResolver<{ resultOptionsByAnalysisUid: WithTypename<ResultOptionType> }, QueryResultOptionsByAnalysisUidArgs>,
    sampleAll?: GraphCacheUpdateResolver<{ sampleAll: WithTypename<SampleCursorPage> }, QuerySampleAllArgs>,
    sampleByParentId?: GraphCacheUpdateResolver<{ sampleByParentId: Array<WithTypename<SampleType>> }, QuerySampleByParentIdArgs>,
    sampleByUid?: GraphCacheUpdateResolver<{ sampleByUid: WithTypename<SampleType> }, QuerySampleByUidArgs>,
    sampleCount?: GraphCacheUpdateResolver<{ sampleCount: Scalars['Int'] }, QuerySampleCountArgs>,
    sampleLaggards?: GraphCacheUpdateResolver<{ sampleLaggards: WithTypename<LaggardStatistics> }, Record<string, never>>,
    sampleProcessPerformance?: GraphCacheUpdateResolver<{ sampleProcessPerformance: WithTypename<ProcessStatistics> }, QuerySampleProcessPerformanceArgs>,
    sampleSearch?: GraphCacheUpdateResolver<{ sampleSearch: Array<WithTypename<SampleType>> }, QuerySampleSearchArgs>,
    sampleTypeAll?: GraphCacheUpdateResolver<{ sampleTypeAll: Array<WithTypename<SampleTypeTyp>> }, Record<string, never>>,
    sampleTypeByUid?: GraphCacheUpdateResolver<{ sampleTypeByUid: WithTypename<SampleTypeTyp> }, QuerySampleTypeByUidArgs>,
    sampleTypeMappingsBySampleType?: GraphCacheUpdateResolver<{ sampleTypeMappingsBySampleType: Array<WithTypename<SampleTypeMappingType>> }, QuerySampleTypeMappingsBySampleTypeArgs>,
    samplesByStorageContainerUid?: GraphCacheUpdateResolver<{ samplesByStorageContainerUid: Array<WithTypename<SampleType>> }, QuerySamplesByStorageContainerUidArgs>,
    samplesByUids?: GraphCacheUpdateResolver<{ samplesByUids: Array<WithTypename<SamplesWithResults>> }, QuerySamplesByUidsArgs>,
    samplesForShipmentAssign?: GraphCacheUpdateResolver<{ samplesForShipmentAssign: WithTypename<SampleCursorPage> }, QuerySamplesForShipmentAssignArgs>,
    shipmentAll?: GraphCacheUpdateResolver<{ shipmentAll: WithTypename<ShipmentCursorPage> }, QueryShipmentAllArgs>,
    shipmentById?: GraphCacheUpdateResolver<{ shipmentById: WithTypename<ShipmentType> }, QueryShipmentByIdArgs>,
    shipmentByStatus?: GraphCacheUpdateResolver<{ shipmentByStatus: Array<WithTypename<ShipmentType>> }, QueryShipmentByStatusArgs>,
    shipmentByUid?: GraphCacheUpdateResolver<{ shipmentByUid: WithTypename<ShipmentType> }, QueryShipmentByUidArgs>,
    stockAdjustmentAll?: GraphCacheUpdateResolver<{ stockAdjustmentAll: WithTypename<StockAdjustmentCursorPage> }, QueryStockAdjustmentAllArgs>,
    stockAdjustmentByUid?: GraphCacheUpdateResolver<{ stockAdjustmentByUid: Maybe<WithTypename<StockAdjustmentType>> }, QueryStockAdjustmentByUidArgs>,
    stockCategoryAll?: GraphCacheUpdateResolver<{ stockCategoryAll: Array<WithTypename<StockCategoryType>> }, Record<string, never>>,
    stockCategoryByUid?: GraphCacheUpdateResolver<{ stockCategoryByUid: Maybe<WithTypename<StockCategoryType>> }, QueryStockCategoryByUidArgs>,
    stockItemAll?: GraphCacheUpdateResolver<{ stockItemAll: WithTypename<StockItemCursorPage> }, QueryStockItemAllArgs>,
    stockItemByUid?: GraphCacheUpdateResolver<{ stockItemByUid: Maybe<WithTypename<StockItemType>> }, QueryStockItemByUidArgs>,
    stockItemVariants?: GraphCacheUpdateResolver<{ stockItemVariants: Array<WithTypename<StockItemVariantType>> }, QueryStockItemVariantsArgs>,
    stockLots?: GraphCacheUpdateResolver<{ stockLots: Array<WithTypename<StockLotType>> }, QueryStockLotsArgs>,
    stockOrderAll?: GraphCacheUpdateResolver<{ stockOrderAll: WithTypename<StockOrderCursorPage> }, QueryStockOrderAllArgs>,
    stockOrderByUid?: GraphCacheUpdateResolver<{ stockOrderByUid: Maybe<WithTypename<StockOrderType>> }, QueryStockOrderByUidArgs>,
    stockOrderProductAll?: GraphCacheUpdateResolver<{ stockOrderProductAll: Array<WithTypename<StockOrderProductType>> }, QueryStockOrderProductAllArgs>,
    stockOrderProductByUid?: GraphCacheUpdateResolver<{ stockOrderProductByUid: Maybe<WithTypename<StockOrderProductType>> }, QueryStockOrderProductByUidArgs>,
    stockProductAll?: GraphCacheUpdateResolver<{ stockProductAll: WithTypename<StockItemVariantCursorPage> }, QueryStockProductAllArgs>,
    stockProductByUid?: GraphCacheUpdateResolver<{ stockProductByUid: Maybe<WithTypename<StockItemVariantType>> }, QueryStockProductByUidArgs>,
    stockProductInventory?: GraphCacheUpdateResolver<{ stockProductInventory: Maybe<WithTypename<StockProductInventoryType>> }, QueryStockProductInventoryArgs>,
    stockReceipt?: GraphCacheUpdateResolver<{ stockReceipt: Array<WithTypename<StockReceiptType>> }, QueryStockReceiptArgs>,
    stockUnitAll?: GraphCacheUpdateResolver<{ stockUnitAll: Array<WithTypename<StockUnitType>> }, Record<string, never>>,
    stockUnitByUid?: GraphCacheUpdateResolver<{ stockUnitByUid: Maybe<WithTypename<StockUnitType>> }, QueryStockUnitByUidArgs>,
    storageContainerByUid?: GraphCacheUpdateResolver<{ storageContainerByUid: Maybe<WithTypename<StorageContainerType>> }, QueryStorageContainerByUidArgs>,
    storageContainers?: GraphCacheUpdateResolver<{ storageContainers: Array<WithTypename<StorageContainerType>> }, QueryStorageContainersArgs>,
    storageLocationByUid?: GraphCacheUpdateResolver<{ storageLocationByUid: Maybe<WithTypename<StorageLocationType>> }, QueryStorageLocationByUidArgs>,
    storageLocations?: GraphCacheUpdateResolver<{ storageLocations: Array<WithTypename<StorageLocationType>> }, QueryStorageLocationsArgs>,
    storageSectionByUid?: GraphCacheUpdateResolver<{ storageSectionByUid: Maybe<WithTypename<StorageSectionType>> }, QueryStorageSectionByUidArgs>,
    storageSections?: GraphCacheUpdateResolver<{ storageSections: Array<WithTypename<StorageSectionType>> }, QueryStorageSectionsArgs>,
    storeRoomAll?: GraphCacheUpdateResolver<{ storeRoomAll: Array<WithTypename<StoreRoomType>> }, Record<string, never>>,
    storeRoomByUid?: GraphCacheUpdateResolver<{ storeRoomByUid: Maybe<WithTypename<StoreRoomType>> }, QueryStoreRoomByUidArgs>,
    supplierAll?: GraphCacheUpdateResolver<{ supplierAll: Array<WithTypename<SupplierType>> }, Record<string, never>>,
    supplierByUid?: GraphCacheUpdateResolver<{ supplierByUid: WithTypename<SupplierType> }, QuerySupplierByUidArgs>,
    threadByUid?: GraphCacheUpdateResolver<{ threadByUid: Maybe<WithTypename<MessageThreadType>> }, QueryThreadByUidArgs>,
    threadsForUser?: GraphCacheUpdateResolver<{ threadsForUser: Maybe<Array<WithTypename<MessageThreadType>>> }, QueryThreadsForUserArgs>,
    unitAll?: GraphCacheUpdateResolver<{ unitAll: Array<WithTypename<UnitType>> }, Record<string, never>>,
    unitByUid?: GraphCacheUpdateResolver<{ unitByUid: WithTypename<UnitType> }, QueryUnitByUidArgs>,
    userAll?: GraphCacheUpdateResolver<{ userAll: WithTypename<UserCursorPage> }, QueryUserAllArgs>,
    userByEmail?: GraphCacheUpdateResolver<{ userByEmail: Maybe<WithTypename<UserType>> }, QueryUserByEmailArgs>,
    userMe?: GraphCacheUpdateResolver<{ userMe: Maybe<WithTypename<UserType>> }, QueryUserMeArgs>,
    voucherAll?: GraphCacheUpdateResolver<{ voucherAll: Maybe<Array<WithTypename<VoucherType>>> }, Record<string, never>>,
    voucherByUid?: GraphCacheUpdateResolver<{ voucherByUid: Maybe<WithTypename<VoucherType>> }, QueryVoucherByUidArgs>,
    voucherCodes?: GraphCacheUpdateResolver<{ voucherCodes: Maybe<Array<WithTypename<VoucherCodeType>>> }, QueryVoucherCodesArgs>,
    worksheetAll?: GraphCacheUpdateResolver<{ worksheetAll: WithTypename<WorkSheetCursorPage> }, QueryWorksheetAllArgs>,
    worksheetByAnalyst?: GraphCacheUpdateResolver<{ worksheetByAnalyst: Array<WithTypename<WorkSheetType>> }, QueryWorksheetByAnalystArgs>,
    worksheetById?: GraphCacheUpdateResolver<{ worksheetById: WithTypename<WorkSheetType> }, QueryWorksheetByIdArgs>,
    worksheetByStatus?: GraphCacheUpdateResolver<{ worksheetByStatus: Array<WithTypename<WorkSheetType>> }, QueryWorksheetByStatusArgs>,
    worksheetByUid?: GraphCacheUpdateResolver<{ worksheetByUid: WithTypename<WorkSheetType> }, QueryWorksheetByUidArgs>,
    worksheetTemplateAll?: GraphCacheUpdateResolver<{ worksheetTemplateAll: Array<WithTypename<WorkSheetTemplateType>> }, Record<string, never>>,
    worksheetTemplateByUid?: GraphCacheUpdateResolver<{ worksheetTemplateByUid: Array<WithTypename<WorkSheetType>> }, QueryWorksheetTemplateByUidArgs>
  },
  Mutation?: {
    actionShipment?: GraphCacheUpdateResolver<{ actionShipment: WithTypename<ShipmentResponse> }, MutationActionShipmentArgs>,
    actionWorksheets?: GraphCacheUpdateResolver<{ actionWorksheets: WithTypename<WorkSheetsResponse> }, MutationActionWorksheetsArgs>,
    applyVoucher?: GraphCacheUpdateResolver<{ applyVoucher: WithTypename<TestBillTransactionResponse> }, MutationApplyVoucherArgs>,
    approveStockOrder?: GraphCacheUpdateResolver<{ approveStockOrder: WithTypename<StockOrderResponse> }, MutationApproveStockOrderArgs>,
    authenticateUser?: GraphCacheUpdateResolver<{ authenticateUser: WithTypename<AuthenticatedDataResponse> }, MutationAuthenticateUserArgs>,
    cancelAnalysisResults?: GraphCacheUpdateResolver<{ cancelAnalysisResults: WithTypename<AnalysisResultResponse> }, MutationCancelAnalysisResultsArgs>,
    cancelSamples?: GraphCacheUpdateResolver<{ cancelSamples: WithTypename<ResultedSampleActionResponse> }, MutationCancelSamplesArgs>,
    cloneSamples?: GraphCacheUpdateResolver<{ cloneSamples: WithTypename<SampleActionResponse> }, MutationCloneSamplesArgs>,
    confirmTestBillTransaction?: GraphCacheUpdateResolver<{ confirmTestBillTransaction: WithTypename<TestBillTransactionResponse> }, MutationConfirmTestBillTransactionArgs>,
    createAnalysis?: GraphCacheUpdateResolver<{ createAnalysis: WithTypename<ProfilesServiceResponse> }, MutationCreateAnalysisArgs>,
    createAnalysisCategory?: GraphCacheUpdateResolver<{ createAnalysisCategory: WithTypename<AnalysisCategoryResponse> }, MutationCreateAnalysisCategoryArgs>,
    createAnalysisCorrectionFactor?: GraphCacheUpdateResolver<{ createAnalysisCorrectionFactor: WithTypename<AnalysisCorrectionFactorResponse> }, MutationCreateAnalysisCorrectionFactorArgs>,
    createAnalysisDetectionLimit?: GraphCacheUpdateResolver<{ createAnalysisDetectionLimit: WithTypename<AnalysisDetectionLimitResponse> }, MutationCreateAnalysisDetectionLimitArgs>,
    createAnalysisInterim?: GraphCacheUpdateResolver<{ createAnalysisInterim: WithTypename<AnalysisInterimResponse> }, MutationCreateAnalysisInterimArgs>,
    createAnalysisMapping?: GraphCacheUpdateResolver<{ createAnalysisMapping: WithTypename<AnalysisMappingResponse> }, MutationCreateAnalysisMappingArgs>,
    createAnalysisRequest?: GraphCacheUpdateResolver<{ createAnalysisRequest: WithTypename<AnalysisRequestResponse> }, MutationCreateAnalysisRequestArgs>,
    createAnalysisSpecification?: GraphCacheUpdateResolver<{ createAnalysisSpecification: WithTypename<AnalysisSpecificationResponse> }, MutationCreateAnalysisSpecificationArgs>,
    createAnalysisTemplate?: GraphCacheUpdateResolver<{ createAnalysisTemplate: WithTypename<AnalysisTemplateResponse> }, MutationCreateAnalysisTemplateArgs>,
    createAnalysisUncertainty?: GraphCacheUpdateResolver<{ createAnalysisUncertainty: WithTypename<AnalysisUncertaintyResponse> }, MutationCreateAnalysisUncertaintyArgs>,
    createCaliberationCertificate?: GraphCacheUpdateResolver<{ createCaliberationCertificate: WithTypename<CalibrationCertificateResponse> }, MutationCreateCaliberationCertificateArgs>,
    createClient?: GraphCacheUpdateResolver<{ createClient: WithTypename<ClientResponse> }, MutationCreateClientArgs>,
    createClientContact?: GraphCacheUpdateResolver<{ createClientContact: WithTypename<ClientContactResponse> }, MutationCreateClientContactArgs>,
    createCodingStandard?: GraphCacheUpdateResolver<{ createCodingStandard: WithTypename<CodingStandardResponse> }, MutationCreateCodingStandardArgs>,
    createCountry?: GraphCacheUpdateResolver<{ createCountry: WithTypename<CountryResponse> }, MutationCreateCountryArgs>,
    createDepartment?: GraphCacheUpdateResolver<{ createDepartment: WithTypename<DepartmentResponse> }, MutationCreateDepartmentArgs>,
    createDistrict?: GraphCacheUpdateResolver<{ createDistrict: WithTypename<DistrictResponse> }, MutationCreateDistrictArgs>,
    createGroup?: GraphCacheUpdateResolver<{ createGroup: WithTypename<GroupResponse> }, MutationCreateGroupArgs>,
    createHazard?: GraphCacheUpdateResolver<{ createHazard: WithTypename<HazardResponse> }, MutationCreateHazardArgs>,
    createIdentification?: GraphCacheUpdateResolver<{ createIdentification: WithTypename<IdentificationResponse> }, MutationCreateIdentificationArgs>,
    createInstrument?: GraphCacheUpdateResolver<{ createInstrument: WithTypename<InstrumentResponse> }, MutationCreateInstrumentArgs>,
    createInstrumentCaliberation?: GraphCacheUpdateResolver<{ createInstrumentCaliberation: WithTypename<InstrumentCalibrationResponse> }, MutationCreateInstrumentCaliberationArgs>,
    createInstrumentCompetence?: GraphCacheUpdateResolver<{ createInstrumentCompetence: WithTypename<InstrumentCompetenceResponse> }, MutationCreateInstrumentCompetenceArgs>,
    createInstrumentType?: GraphCacheUpdateResolver<{ createInstrumentType: WithTypename<InstrumentTypeResponse> }, MutationCreateInstrumentTypeArgs>,
    createLaboratoryInstrument?: GraphCacheUpdateResolver<{ createLaboratoryInstrument: WithTypename<LaboratoryInstrumentResponse> }, MutationCreateLaboratoryInstrumentArgs>,
    createManufacturer?: GraphCacheUpdateResolver<{ createManufacturer: WithTypename<ManufacturerResponse> }, MutationCreateManufacturerArgs>,
    createMethod?: GraphCacheUpdateResolver<{ createMethod: WithTypename<MethodResponse> }, MutationCreateMethodArgs>,
    createNotice?: GraphCacheUpdateResolver<{ createNotice: WithTypename<NoticeResponse> }, MutationCreateNoticeArgs>,
    createPatient?: GraphCacheUpdateResolver<{ createPatient: WithTypename<PatientResponse> }, MutationCreatePatientArgs>,
    createProfile?: GraphCacheUpdateResolver<{ createProfile: WithTypename<AnalysisProfileResponse> }, MutationCreateProfileArgs>,
    createProfileMapping?: GraphCacheUpdateResolver<{ createProfileMapping: WithTypename<ProfileMappingResponse> }, MutationCreateProfileMappingArgs>,
    createProvince?: GraphCacheUpdateResolver<{ createProvince: WithTypename<ProvinceResponse> }, MutationCreateProvinceArgs>,
    createQcLevel?: GraphCacheUpdateResolver<{ createQcLevel: WithTypename<QcLevelResponse> }, MutationCreateQcLevelArgs>,
    createQcSet?: GraphCacheUpdateResolver<{ createQcSet: WithTypename<QcSetResponse> }, MutationCreateQcSetArgs>,
    createQcTemplate?: GraphCacheUpdateResolver<{ createQcTemplate: WithTypename<QcTemplateResponse> }, MutationCreateQcTemplateArgs>,
    createReferralLaboratory?: GraphCacheUpdateResolver<{ createReferralLaboratory: WithTypename<ReferralLaboratoryResponse> }, MutationCreateReferralLaboratoryArgs>,
    createReflexAction?: GraphCacheUpdateResolver<{ createReflexAction: WithTypename<ReflexActionResponse> }, MutationCreateReflexActionArgs>,
    createReflexBrain?: GraphCacheUpdateResolver<{ createReflexBrain: WithTypename<ReflexBrainResponse> }, MutationCreateReflexBrainArgs>,
    createReflexRule?: GraphCacheUpdateResolver<{ createReflexRule: WithTypename<ReflexRuleResponse> }, MutationCreateReflexRuleArgs>,
    createRejectionReason?: GraphCacheUpdateResolver<{ createRejectionReason: WithTypename<RejectionReasonResponse> }, MutationCreateRejectionReasonArgs>,
    createResultOption?: GraphCacheUpdateResolver<{ createResultOption: WithTypename<ResultOptionResponse> }, MutationCreateResultOptionArgs>,
    createSampleType?: GraphCacheUpdateResolver<{ createSampleType: WithTypename<SampleTypeResponse> }, MutationCreateSampleTypeArgs>,
    createSampleTypeMapping?: GraphCacheUpdateResolver<{ createSampleTypeMapping: WithTypename<SampleTypeMappingResponse> }, MutationCreateSampleTypeMappingArgs>,
    createShipment?: GraphCacheUpdateResolver<{ createShipment: WithTypename<ShipmentsResponse> }, MutationCreateShipmentArgs>,
    createStockAdjustment?: GraphCacheUpdateResolver<{ createStockAdjustment: WithTypename<StockAdjustmentResponse> }, MutationCreateStockAdjustmentArgs>,
    createStockCategory?: GraphCacheUpdateResolver<{ createStockCategory: WithTypename<StockCategoryResponse> }, MutationCreateStockCategoryArgs>,
    createStockItem?: GraphCacheUpdateResolver<{ createStockItem: WithTypename<StockItemResponse> }, MutationCreateStockItemArgs>,
    createStockItemVariant?: GraphCacheUpdateResolver<{ createStockItemVariant: WithTypename<StockItemVariantResponse> }, MutationCreateStockItemVariantArgs>,
    createStockOrder?: GraphCacheUpdateResolver<{ createStockOrder: WithTypename<StockOrderResponse> }, MutationCreateStockOrderArgs>,
    createStockReceipt?: GraphCacheUpdateResolver<{ createStockReceipt: WithTypename<StockItemVariantResponse> }, MutationCreateStockReceiptArgs>,
    createStockUnit?: GraphCacheUpdateResolver<{ createStockUnit: WithTypename<StockUnitResponse> }, MutationCreateStockUnitArgs>,
    createStorageContainer?: GraphCacheUpdateResolver<{ createStorageContainer: WithTypename<StorageContainerResponse> }, MutationCreateStorageContainerArgs>,
    createStorageLocation?: GraphCacheUpdateResolver<{ createStorageLocation: WithTypename<StorageLocationResponse> }, MutationCreateStorageLocationArgs>,
    createStorageSection?: GraphCacheUpdateResolver<{ createStorageSection: WithTypename<StorageSectionResponse> }, MutationCreateStorageSectionArgs>,
    createStoreRoom?: GraphCacheUpdateResolver<{ createStoreRoom: WithTypename<StoreRoomResponse> }, MutationCreateStoreRoomArgs>,
    createSupplier?: GraphCacheUpdateResolver<{ createSupplier: WithTypename<SupplierResponse> }, MutationCreateSupplierArgs>,
    createTestBillTransaction?: GraphCacheUpdateResolver<{ createTestBillTransaction: WithTypename<TestBillTransactionResponse> }, MutationCreateTestBillTransactionArgs>,
    createUnit?: GraphCacheUpdateResolver<{ createUnit: WithTypename<UnitResponse> }, MutationCreateUnitArgs>,
    createUser?: GraphCacheUpdateResolver<{ createUser: WithTypename<UserResponse> }, MutationCreateUserArgs>,
    createVoucher?: GraphCacheUpdateResolver<{ createVoucher: WithTypename<VoucherResponse> }, MutationCreateVoucherArgs>,
    createVoucherCode?: GraphCacheUpdateResolver<{ createVoucherCode: WithTypename<VoucherCodeResponse> }, MutationCreateVoucherCodeArgs>,
    createWorksheet?: GraphCacheUpdateResolver<{ createWorksheet: WithTypename<WorkSheetsResponse> }, MutationCreateWorksheetArgs>,
    createWorksheetTemplate?: GraphCacheUpdateResolver<{ createWorksheetTemplate: WithTypename<WorkSheetTemplateResponse> }, MutationCreateWorksheetTemplateArgs>,
    deleteClientContact?: GraphCacheUpdateResolver<{ deleteClientContact: WithTypename<DeleteContactResponse> }, MutationDeleteClientContactArgs>,
    deleteMessage?: GraphCacheUpdateResolver<{ deleteMessage: WithTypename<DeleteResponse> }, MutationDeleteMessageArgs>,
    deleteNotice?: GraphCacheUpdateResolver<{ deleteNotice: WithTypename<DeleteResponse> }, MutationDeleteNoticeArgs>,
    deleteReflexBrain?: GraphCacheUpdateResolver<{ deleteReflexBrain: WithTypename<DeletedItem> }, MutationDeleteReflexBrainArgs>,
    deleteStockOrder?: GraphCacheUpdateResolver<{ deleteStockOrder: WithTypename<StockOrderResponse> }, MutationDeleteStockOrderArgs>,
    deleteThread?: GraphCacheUpdateResolver<{ deleteThread: WithTypename<DeleteResponse> }, MutationDeleteThreadArgs>,
    invalidateSamples?: GraphCacheUpdateResolver<{ invalidateSamples: WithTypename<SampleActionResponse> }, MutationInvalidateSamplesArgs>,
    issueStockOrder?: GraphCacheUpdateResolver<{ issueStockOrder: WithTypename<StockOrderResponse> }, MutationIssueStockOrderArgs>,
    manageAnalyses?: GraphCacheUpdateResolver<{ manageAnalyses: WithTypename<ResultedSampleActionResponse> }, MutationManageAnalysesArgs>,
    printSamples?: GraphCacheUpdateResolver<{ printSamples: WithTypename<SampleActionResponse> }, MutationPrintSamplesArgs>,
    publishSamples?: GraphCacheUpdateResolver<{ publishSamples: WithTypename<SuccessErrorResponse> }, MutationPublishSamplesArgs>,
    reInstateAnalysisResults?: GraphCacheUpdateResolver<{ reInstateAnalysisResults: WithTypename<AnalysisResultResponse> }, MutationReInstateAnalysisResultsArgs>,
    reInstateSamples?: GraphCacheUpdateResolver<{ reInstateSamples: WithTypename<ResultedSampleActionResponse> }, MutationReInstateSamplesArgs>,
    receiveSamples?: GraphCacheUpdateResolver<{ receiveSamples: WithTypename<ResultedSampleActionResponse> }, MutationReceiveSamplesArgs>,
    recoverSamples?: GraphCacheUpdateResolver<{ recoverSamples: WithTypename<StoreSampleResponse> }, MutationRecoverSamplesArgs>,
    refresh?: GraphCacheUpdateResolver<{ refresh: WithTypename<AuthenticatedDataResponse> }, MutationRefreshArgs>,
    rejectSamples?: GraphCacheUpdateResolver<{ rejectSamples: WithTypename<SampleActionResponse> }, MutationRejectSamplesArgs>,
    replyMessage?: GraphCacheUpdateResolver<{ replyMessage: WithTypename<MessageResponse> }, MutationReplyMessageArgs>,
    requestPasswordReset?: GraphCacheUpdateResolver<{ requestPasswordReset: WithTypename<MessageResponse> }, MutationRequestPasswordResetArgs>,
    resetPassword?: GraphCacheUpdateResolver<{ resetPassword: WithTypename<MessageResponse> }, MutationResetPasswordArgs>,
    retestAnalysisResults?: GraphCacheUpdateResolver<{ retestAnalysisResults: WithTypename<AnalysisResultResponse> }, MutationRetestAnalysisResultsArgs>,
    retractAnalysisResults?: GraphCacheUpdateResolver<{ retractAnalysisResults: WithTypename<AnalysisResultResponse> }, MutationRetractAnalysisResultsArgs>,
    samplesApplyTemplate?: GraphCacheUpdateResolver<{ samplesApplyTemplate: WithTypename<ResultedSampleActionResponse> }, MutationSamplesApplyTemplateArgs>,
    sendMessage?: GraphCacheUpdateResolver<{ sendMessage: WithTypename<MessageResponse> }, MutationSendMessageArgs>,
    shipmentManageSamples?: GraphCacheUpdateResolver<{ shipmentManageSamples: WithTypename<ShipmentResponse> }, MutationShipmentManageSamplesArgs>,
    storeSamples?: GraphCacheUpdateResolver<{ storeSamples: WithTypename<StoreSampleResponse> }, MutationStoreSamplesArgs>,
    submitAnalysisResults?: GraphCacheUpdateResolver<{ submitAnalysisResults: WithTypename<AnalysisResultSubmitResponse> }, MutationSubmitAnalysisResultsArgs>,
    submitStockOrder?: GraphCacheUpdateResolver<{ submitStockOrder: WithTypename<StockOrderResponse> }, MutationSubmitStockOrderArgs>,
    updateAnalysis?: GraphCacheUpdateResolver<{ updateAnalysis: WithTypename<ProfilesServiceResponse> }, MutationUpdateAnalysisArgs>,
    updateAnalysisCategory?: GraphCacheUpdateResolver<{ updateAnalysisCategory: WithTypename<AnalysisCategoryResponse> }, MutationUpdateAnalysisCategoryArgs>,
    updateAnalysisCorrectionFactor?: GraphCacheUpdateResolver<{ updateAnalysisCorrectionFactor: WithTypename<AnalysisCorrectionFactorResponse> }, MutationUpdateAnalysisCorrectionFactorArgs>,
    updateAnalysisDetectionLimit?: GraphCacheUpdateResolver<{ updateAnalysisDetectionLimit: WithTypename<AnalysisDetectionLimitResponse> }, MutationUpdateAnalysisDetectionLimitArgs>,
    updateAnalysisDiscount?: GraphCacheUpdateResolver<{ updateAnalysisDiscount: WithTypename<AnalysisDiscountResponse> }, MutationUpdateAnalysisDiscountArgs>,
    updateAnalysisInterim?: GraphCacheUpdateResolver<{ updateAnalysisInterim: WithTypename<AnalysisInterimResponse> }, MutationUpdateAnalysisInterimArgs>,
    updateAnalysisMapping?: GraphCacheUpdateResolver<{ updateAnalysisMapping: WithTypename<AnalysisMappingResponse> }, MutationUpdateAnalysisMappingArgs>,
    updateAnalysisPrice?: GraphCacheUpdateResolver<{ updateAnalysisPrice: WithTypename<AnalysisPriceResponse> }, MutationUpdateAnalysisPriceArgs>,
    updateAnalysisSpecification?: GraphCacheUpdateResolver<{ updateAnalysisSpecification: WithTypename<AnalysisSpecificationResponse> }, MutationUpdateAnalysisSpecificationArgs>,
    updateAnalysisTemplate?: GraphCacheUpdateResolver<{ updateAnalysisTemplate: WithTypename<AnalysisTemplateResponse> }, MutationUpdateAnalysisTemplateArgs>,
    updateAnalysisUncertainty?: GraphCacheUpdateResolver<{ updateAnalysisUncertainty: WithTypename<AnalysisUncertaintyResponse> }, MutationUpdateAnalysisUncertaintyArgs>,
    updateCaliberationCertificate?: GraphCacheUpdateResolver<{ updateCaliberationCertificate: WithTypename<CalibrationCertificateResponse> }, MutationUpdateCaliberationCertificateArgs>,
    updateClient?: GraphCacheUpdateResolver<{ updateClient: WithTypename<ClientResponse> }, MutationUpdateClientArgs>,
    updateClientContact?: GraphCacheUpdateResolver<{ updateClientContact: WithTypename<ClientContactResponse> }, MutationUpdateClientContactArgs>,
    updateCodingStandard?: GraphCacheUpdateResolver<{ updateCodingStandard: WithTypename<CodingStandardResponse> }, MutationUpdateCodingStandardArgs>,
    updateCountry?: GraphCacheUpdateResolver<{ updateCountry: WithTypename<CountryResponse> }, MutationUpdateCountryArgs>,
    updateDepartment?: GraphCacheUpdateResolver<{ updateDepartment: WithTypename<DepartmentResponse> }, MutationUpdateDepartmentArgs>,
    updateDistrict?: GraphCacheUpdateResolver<{ updateDistrict: WithTypename<DistrictResponse> }, MutationUpdateDistrictArgs>,
    updateGroup?: GraphCacheUpdateResolver<{ updateGroup: WithTypename<GroupResponse> }, MutationUpdateGroupArgs>,
    updateGroupPermissions?: GraphCacheUpdateResolver<{ updateGroupPermissions: WithTypename<UpdatedGroupPermsResponse> }, MutationUpdateGroupPermissionsArgs>,
    updateHazard?: GraphCacheUpdateResolver<{ updateHazard: WithTypename<HazardResponse> }, MutationUpdateHazardArgs>,
    updateIdentification?: GraphCacheUpdateResolver<{ updateIdentification: WithTypename<IdentificationResponse> }, MutationUpdateIdentificationArgs>,
    updateInstrument?: GraphCacheUpdateResolver<{ updateInstrument: WithTypename<InstrumentResponse> }, MutationUpdateInstrumentArgs>,
    updateInstrumentCaliberation?: GraphCacheUpdateResolver<{ updateInstrumentCaliberation: WithTypename<InstrumentCalibrationResponse> }, MutationUpdateInstrumentCaliberationArgs>,
    updateInstrumentCompetence?: GraphCacheUpdateResolver<{ updateInstrumentCompetence: WithTypename<InstrumentCompetenceResponse> }, MutationUpdateInstrumentCompetenceArgs>,
    updateInstrumentType?: GraphCacheUpdateResolver<{ updateInstrumentType: WithTypename<InstrumentTypeResponse> }, MutationUpdateInstrumentTypeArgs>,
    updateLaboratory?: GraphCacheUpdateResolver<{ updateLaboratory: WithTypename<LaboratoryResponse> }, MutationUpdateLaboratoryArgs>,
    updateLaboratoryInstrument?: GraphCacheUpdateResolver<{ updateLaboratoryInstrument: WithTypename<LaboratoryInstrumentResponse> }, MutationUpdateLaboratoryInstrumentArgs>,
    updateLaboratorySetting?: GraphCacheUpdateResolver<{ updateLaboratorySetting: WithTypename<LaboratorySettingResponse> }, MutationUpdateLaboratorySettingArgs>,
    updateManufacturer?: GraphCacheUpdateResolver<{ updateManufacturer: WithTypename<ManufacturerResponse> }, MutationUpdateManufacturerArgs>,
    updateMethod?: GraphCacheUpdateResolver<{ updateMethod: WithTypename<MethodResponse> }, MutationUpdateMethodArgs>,
    updateNotice?: GraphCacheUpdateResolver<{ updateNotice: WithTypename<NoticeResponse> }, MutationUpdateNoticeArgs>,
    updatePatient?: GraphCacheUpdateResolver<{ updatePatient: WithTypename<PatientResponse> }, MutationUpdatePatientArgs>,
    updateProfile?: GraphCacheUpdateResolver<{ updateProfile: WithTypename<AnalysisProfileResponse> }, MutationUpdateProfileArgs>,
    updateProfileDiscount?: GraphCacheUpdateResolver<{ updateProfileDiscount: WithTypename<ProfileDiscountResponse> }, MutationUpdateProfileDiscountArgs>,
    updateProfileMapping?: GraphCacheUpdateResolver<{ updateProfileMapping: WithTypename<ProfileMappingResponse> }, MutationUpdateProfileMappingArgs>,
    updateProfilePrice?: GraphCacheUpdateResolver<{ updateProfilePrice: WithTypename<ProfilePriceResponse> }, MutationUpdateProfilePriceArgs>,
    updateProvince?: GraphCacheUpdateResolver<{ updateProvince: WithTypename<ProvinceResponse> }, MutationUpdateProvinceArgs>,
    updateQcLevel?: GraphCacheUpdateResolver<{ updateQcLevel: WithTypename<QcLevelResponse> }, MutationUpdateQcLevelArgs>,
    updateQcTemplate?: GraphCacheUpdateResolver<{ updateQcTemplate: WithTypename<QcTemplateResponse> }, MutationUpdateQcTemplateArgs>,
    updateReferralLaboratory?: GraphCacheUpdateResolver<{ updateReferralLaboratory: WithTypename<ReferralLaboratoryResponse> }, MutationUpdateReferralLaboratoryArgs>,
    updateReflexAction?: GraphCacheUpdateResolver<{ updateReflexAction: WithTypename<ReflexActionResponse> }, MutationUpdateReflexActionArgs>,
    updateReflexBrain?: GraphCacheUpdateResolver<{ updateReflexBrain: WithTypename<ReflexBrainResponse> }, MutationUpdateReflexBrainArgs>,
    updateReflexRule?: GraphCacheUpdateResolver<{ updateReflexRule: WithTypename<ReflexRuleResponse> }, MutationUpdateReflexRuleArgs>,
    updateRejectionReason?: GraphCacheUpdateResolver<{ updateRejectionReason: WithTypename<RejectionReasonResponse> }, MutationUpdateRejectionReasonArgs>,
    updateResultOption?: GraphCacheUpdateResolver<{ updateResultOption: WithTypename<ResultOptionResponse> }, MutationUpdateResultOptionArgs>,
    updateSampleType?: GraphCacheUpdateResolver<{ updateSampleType: WithTypename<SampleTypeResponse> }, MutationUpdateSampleTypeArgs>,
    updateSampleTypeMapping?: GraphCacheUpdateResolver<{ updateSampleTypeMapping: WithTypename<SampleTypeMappingResponse> }, MutationUpdateSampleTypeMappingArgs>,
    updateShipment?: GraphCacheUpdateResolver<{ updateShipment: WithTypename<ShipmentResponse> }, MutationUpdateShipmentArgs>,
    updateStockCategory?: GraphCacheUpdateResolver<{ updateStockCategory: WithTypename<StockCategoryResponse> }, MutationUpdateStockCategoryArgs>,
    updateStockItem?: GraphCacheUpdateResolver<{ updateStockItem: WithTypename<StockItemResponse> }, MutationUpdateStockItemArgs>,
    updateStockItemVariant?: GraphCacheUpdateResolver<{ updateStockItemVariant: WithTypename<StockItemVariantResponse> }, MutationUpdateStockItemVariantArgs>,
    updateStockOrder?: GraphCacheUpdateResolver<{ updateStockOrder: WithTypename<StockOrderResponse> }, MutationUpdateStockOrderArgs>,
    updateStockUnit?: GraphCacheUpdateResolver<{ updateStockUnit: WithTypename<StockUnitResponse> }, MutationUpdateStockUnitArgs>,
    updateStorageContainer?: GraphCacheUpdateResolver<{ updateStorageContainer: WithTypename<StorageContainerResponse> }, MutationUpdateStorageContainerArgs>,
    updateStorageLocation?: GraphCacheUpdateResolver<{ updateStorageLocation: WithTypename<StorageLocationResponse> }, MutationUpdateStorageLocationArgs>,
    updateStorageSection?: GraphCacheUpdateResolver<{ updateStorageSection: WithTypename<StorageSectionResponse> }, MutationUpdateStorageSectionArgs>,
    updateStoreRoom?: GraphCacheUpdateResolver<{ updateStoreRoom: WithTypename<StoreRoomResponse> }, MutationUpdateStoreRoomArgs>,
    updateSupplier?: GraphCacheUpdateResolver<{ updateSupplier: WithTypename<SupplierResponse> }, MutationUpdateSupplierArgs>,
    updateUnit?: GraphCacheUpdateResolver<{ updateUnit: WithTypename<UnitResponse> }, MutationUpdateUnitArgs>,
    updateUser?: GraphCacheUpdateResolver<{ updateUser: WithTypename<UserResponse> }, MutationUpdateUserArgs>,
    updateVoucher?: GraphCacheUpdateResolver<{ updateVoucher: WithTypename<VoucherResponse> }, MutationUpdateVoucherArgs>,
    updateVoucherCode?: GraphCacheUpdateResolver<{ updateVoucherCode: WithTypename<VoucherCodeResponse> }, MutationUpdateVoucherCodeArgs>,
    updateWorksheet?: GraphCacheUpdateResolver<{ updateWorksheet: WithTypename<WorkSheetResponse> }, MutationUpdateWorksheetArgs>,
    updateWorksheetApplyTemplate?: GraphCacheUpdateResolver<{ updateWorksheetApplyTemplate: WithTypename<WorkSheetResponse> }, MutationUpdateWorksheetApplyTemplateArgs>,
    updateWorksheetManualAssign?: GraphCacheUpdateResolver<{ updateWorksheetManualAssign: WithTypename<WorkSheetResponse> }, MutationUpdateWorksheetManualAssignArgs>,
    updateWorksheetTemplate?: GraphCacheUpdateResolver<{ updateWorksheetTemplate: WithTypename<WorkSheetTemplateResponse> }, MutationUpdateWorksheetTemplateArgs>,
    validatePasswordResetToken?: GraphCacheUpdateResolver<{ validatePasswordResetToken: WithTypename<PasswordResetValidityResponse> }, MutationValidatePasswordResetTokenArgs>,
    verifyAnalysisResults?: GraphCacheUpdateResolver<{ verifyAnalysisResults: WithTypename<AnalysisResultSubmitResponse> }, MutationVerifyAnalysisResultsArgs>,
    verifySamples?: GraphCacheUpdateResolver<{ verifySamples: WithTypename<SampleActionResponse> }, MutationVerifySamplesArgs>,
    viewMessage?: GraphCacheUpdateResolver<{ viewMessage: WithTypename<MessageResponse> }, MutationViewMessageArgs>,
    viewNotice?: GraphCacheUpdateResolver<{ viewNotice: WithTypename<NoticeType> }, MutationViewNoticeArgs>
  },
  Subscription?: {
    latestActivity?: GraphCacheUpdateResolver<{ latestActivity: WithTypename<ActivityStreamType> }, Record<string, never>>,
    streamAll?: GraphCacheUpdateResolver<{ streamAll: WithTypename<ActivityStreamType> }, Record<string, never>>,
    streamProcesses?: GraphCacheUpdateResolver<{ streamProcesses: WithTypename<ActivityProcessType> }, Record<string, never>>
  },
  ActivityFeedType?: {
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<ActivityFeedType>>, Record<string, never>>,
    subscribers?: GraphCacheUpdateResolver<Maybe<WithTypename<ActivityFeedType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<ActivityFeedType>>, Record<string, never>>
  },
  ActivityProcessType?: {
    objectType?: GraphCacheUpdateResolver<Maybe<WithTypename<ActivityProcessType>>, Record<string, never>>,
    status?: GraphCacheUpdateResolver<Maybe<WithTypename<ActivityProcessType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<ActivityProcessType>>, Record<string, never>>
  },
  ActivityStreamType?: {
    actionObject?: GraphCacheUpdateResolver<Maybe<WithTypename<ActivityStreamType>>, Record<string, never>>,
    actionObjectType?: GraphCacheUpdateResolver<Maybe<WithTypename<ActivityStreamType>>, Record<string, never>>,
    actionObjectUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ActivityStreamType>>, Record<string, never>>,
    actor?: GraphCacheUpdateResolver<Maybe<WithTypename<ActivityStreamType>>, Record<string, never>>,
    actorUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ActivityStreamType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<ActivityStreamType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<ActivityStreamType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ActivityStreamType>>, Record<string, never>>,
    feeds?: GraphCacheUpdateResolver<Maybe<WithTypename<ActivityStreamType>>, Record<string, never>>,
    target?: GraphCacheUpdateResolver<Maybe<WithTypename<ActivityStreamType>>, Record<string, never>>,
    targetUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ActivityStreamType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<ActivityStreamType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<ActivityStreamType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<ActivityStreamType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ActivityStreamType>>, Record<string, never>>,
    verb?: GraphCacheUpdateResolver<Maybe<WithTypename<ActivityStreamType>>, Record<string, never>>,
    viewers?: GraphCacheUpdateResolver<Maybe<WithTypename<ActivityStreamType>>, Record<string, never>>
  },
  AnalysisCategoryType?: {
    active?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisCategoryType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisCategoryType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisCategoryType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisCategoryType>>, Record<string, never>>,
    department?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisCategoryType>>, Record<string, never>>,
    departmentUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisCategoryType>>, Record<string, never>>,
    description?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisCategoryType>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisCategoryType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisCategoryType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisCategoryType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisCategoryType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisCategoryType>>, Record<string, never>>
  },
  AnalysisCorrectionFactorType?: {
    analysisUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisCorrectionFactorType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisCorrectionFactorType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisCorrectionFactorType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisCorrectionFactorType>>, Record<string, never>>,
    factor?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisCorrectionFactorType>>, Record<string, never>>,
    instrumentUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisCorrectionFactorType>>, Record<string, never>>,
    methodUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisCorrectionFactorType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisCorrectionFactorType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisCorrectionFactorType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisCorrectionFactorType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisCorrectionFactorType>>, Record<string, never>>
  },
  AnalysisCursorPage?: {
    edges?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisCursorPage>>, Record<string, never>>,
    items?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisCursorPage>>, Record<string, never>>,
    pageInfo?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisCursorPage>>, Record<string, never>>,
    totalCount?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisCursorPage>>, Record<string, never>>
  },
  AnalysisDetectionLimitType?: {
    analysisUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisDetectionLimitType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisDetectionLimitType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisDetectionLimitType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisDetectionLimitType>>, Record<string, never>>,
    instrumentUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisDetectionLimitType>>, Record<string, never>>,
    lowerLimit?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisDetectionLimitType>>, Record<string, never>>,
    methodUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisDetectionLimitType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisDetectionLimitType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisDetectionLimitType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisDetectionLimitType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisDetectionLimitType>>, Record<string, never>>,
    upperLimit?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisDetectionLimitType>>, Record<string, never>>
  },
  AnalysisDiscountType?: {
    analysis?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisDiscountType>>, Record<string, never>>,
    analysisUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisDiscountType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisDiscountType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisDiscountType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisDiscountType>>, Record<string, never>>,
    discountType?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisDiscountType>>, Record<string, never>>,
    endDate?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisDiscountType>>, Record<string, never>>,
    isActive?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisDiscountType>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisDiscountType>>, Record<string, never>>,
    startDate?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisDiscountType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisDiscountType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisDiscountType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisDiscountType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisDiscountType>>, Record<string, never>>,
    valueAmount?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisDiscountType>>, Record<string, never>>,
    valuePercent?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisDiscountType>>, Record<string, never>>,
    valueType?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisDiscountType>>, Record<string, never>>,
    voucher?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisDiscountType>>, Record<string, never>>,
    voucherUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisDiscountType>>, Record<string, never>>
  },
  AnalysisEdge?: {
    cursor?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisEdge>>, Record<string, never>>,
    node?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisEdge>>, Record<string, never>>
  },
  AnalysisInterimType?: {
    analysisUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisInterimType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisInterimType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisInterimType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisInterimType>>, Record<string, never>>,
    instrumentUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisInterimType>>, Record<string, never>>,
    key?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisInterimType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisInterimType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisInterimType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisInterimType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisInterimType>>, Record<string, never>>,
    value?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisInterimType>>, Record<string, never>>
  },
  AnalysisMappingType?: {
    analysis?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisMappingType>>, Record<string, never>>,
    analysisUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisMappingType>>, Record<string, never>>,
    code?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisMappingType>>, Record<string, never>>,
    codingStandard?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisMappingType>>, Record<string, never>>,
    codingStandardUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisMappingType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisMappingType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisMappingType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisMappingType>>, Record<string, never>>,
    description?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisMappingType>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisMappingType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisMappingType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisMappingType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisMappingType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisMappingType>>, Record<string, never>>
  },
  AnalysisPriceType?: {
    amount?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisPriceType>>, Record<string, never>>,
    analysis?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisPriceType>>, Record<string, never>>,
    analysisUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisPriceType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisPriceType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisPriceType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisPriceType>>, Record<string, never>>,
    isActive?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisPriceType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisPriceType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisPriceType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisPriceType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisPriceType>>, Record<string, never>>
  },
  AnalysisRequestCursorPage?: {
    edges?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisRequestCursorPage>>, Record<string, never>>,
    items?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisRequestCursorPage>>, Record<string, never>>,
    pageInfo?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisRequestCursorPage>>, Record<string, never>>,
    totalCount?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisRequestCursorPage>>, Record<string, never>>
  },
  AnalysisRequestEdge?: {
    cursor?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisRequestEdge>>, Record<string, never>>,
    node?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisRequestEdge>>, Record<string, never>>
  },
  AnalysisRequestType?: {
    client?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisRequestType>>, Record<string, never>>,
    clientRequestId?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisRequestType>>, Record<string, never>>,
    clientUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisRequestType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisRequestType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisRequestType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisRequestType>>, Record<string, never>>,
    internalUse?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisRequestType>>, Record<string, never>>,
    metadataSnapshot?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisRequestType>>, Record<string, never>>,
    patient?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisRequestType>>, Record<string, never>>,
    patientUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisRequestType>>, Record<string, never>>,
    requestId?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisRequestType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisRequestType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisRequestType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisRequestType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisRequestType>>, Record<string, never>>
  },
  AnalysisRequestWithSamples?: {
    client?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisRequestWithSamples>>, Record<string, never>>,
    clientRequestId?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisRequestWithSamples>>, Record<string, never>>,
    clientUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisRequestWithSamples>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisRequestWithSamples>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisRequestWithSamples>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisRequestWithSamples>>, Record<string, never>>,
    internalUse?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisRequestWithSamples>>, Record<string, never>>,
    metadataSnapshot?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisRequestWithSamples>>, Record<string, never>>,
    patient?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisRequestWithSamples>>, Record<string, never>>,
    patientUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisRequestWithSamples>>, Record<string, never>>,
    requestId?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisRequestWithSamples>>, Record<string, never>>,
    samples?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisRequestWithSamples>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisRequestWithSamples>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisRequestWithSamples>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisRequestWithSamples>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisRequestWithSamples>>, Record<string, never>>
  },
  AnalysisResultCursorPage?: {
    edges?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisResultCursorPage>>, Record<string, never>>,
    items?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisResultCursorPage>>, Record<string, never>>,
    pageInfo?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisResultCursorPage>>, Record<string, never>>,
    totalCount?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisResultCursorPage>>, Record<string, never>>
  },
  AnalysisResultEdge?: {
    cursor?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisResultEdge>>, Record<string, never>>,
    node?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisResultEdge>>, Record<string, never>>
  },
  AnalysisResultType?: {
    analysis?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisResultType>>, Record<string, never>>,
    analysisUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisResultType>>, Record<string, never>>,
    analyst?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisResultType>>, Record<string, never>>,
    analystUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisResultType>>, Record<string, never>>,
    assigned?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisResultType>>, Record<string, never>>,
    cancelledBy?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisResultType>>, Record<string, never>>,
    cancelledByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisResultType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisResultType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisResultType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisResultType>>, Record<string, never>>,
    dateCancelled?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisResultType>>, Record<string, never>>,
    dateInvalidated?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisResultType>>, Record<string, never>>,
    dateSubmitted?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisResultType>>, Record<string, never>>,
    dateVerified?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisResultType>>, Record<string, never>>,
    dueDate?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisResultType>>, Record<string, never>>,
    invalidatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisResultType>>, Record<string, never>>,
    invalidatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisResultType>>, Record<string, never>>,
    laboratoryInstrument?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisResultType>>, Record<string, never>>,
    laboratoryInstrumentUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisResultType>>, Record<string, never>>,
    metadataSnapshot?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisResultType>>, Record<string, never>>,
    method?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisResultType>>, Record<string, never>>,
    methodUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisResultType>>, Record<string, never>>,
    parent?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisResultType>>, Record<string, never>>,
    parentId?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisResultType>>, Record<string, never>>,
    reflexLevel?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisResultType>>, Record<string, never>>,
    reportable?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisResultType>>, Record<string, never>>,
    result?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisResultType>>, Record<string, never>>,
    retest?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisResultType>>, Record<string, never>>,
    sample?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisResultType>>, Record<string, never>>,
    sampleUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisResultType>>, Record<string, never>>,
    status?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisResultType>>, Record<string, never>>,
    submittedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisResultType>>, Record<string, never>>,
    submittedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisResultType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisResultType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisResultType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisResultType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisResultType>>, Record<string, never>>,
    verifiedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisResultType>>, Record<string, never>>,
    worksheetId?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisResultType>>, Record<string, never>>,
    worksheetPosition?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisResultType>>, Record<string, never>>,
    worksheetUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisResultType>>, Record<string, never>>
  },
  AnalysisSpecificationType?: {
    ageMax?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisSpecificationType>>, Record<string, never>>,
    ageMin?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisSpecificationType>>, Record<string, never>>,
    analysisUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisSpecificationType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisSpecificationType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisSpecificationType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisSpecificationType>>, Record<string, never>>,
    gender?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisSpecificationType>>, Record<string, never>>,
    max?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisSpecificationType>>, Record<string, never>>,
    maxReport?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisSpecificationType>>, Record<string, never>>,
    maxWarn?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisSpecificationType>>, Record<string, never>>,
    methodUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisSpecificationType>>, Record<string, never>>,
    min?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisSpecificationType>>, Record<string, never>>,
    minReport?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisSpecificationType>>, Record<string, never>>,
    minWarn?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisSpecificationType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisSpecificationType>>, Record<string, never>>,
    unit?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisSpecificationType>>, Record<string, never>>,
    unitUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisSpecificationType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisSpecificationType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisSpecificationType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisSpecificationType>>, Record<string, never>>,
    warnReport?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisSpecificationType>>, Record<string, never>>,
    warnValues?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisSpecificationType>>, Record<string, never>>
  },
  AnalysisTemplateType?: {
    analyses?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisTemplateType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisTemplateType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisTemplateType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisTemplateType>>, Record<string, never>>,
    department?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisTemplateType>>, Record<string, never>>,
    departmentUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisTemplateType>>, Record<string, never>>,
    description?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisTemplateType>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisTemplateType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisTemplateType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisTemplateType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisTemplateType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisTemplateType>>, Record<string, never>>
  },
  AnalysisType?: {
    active?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisType>>, Record<string, never>>,
    category?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisType>>, Record<string, never>>,
    categoryUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisType>>, Record<string, never>>,
    correctionFactors?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisType>>, Record<string, never>>,
    department?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisType>>, Record<string, never>>,
    departmentUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisType>>, Record<string, never>>,
    description?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisType>>, Record<string, never>>,
    detectionLimits?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisType>>, Record<string, never>>,
    hidden?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisType>>, Record<string, never>>,
    instruments?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisType>>, Record<string, never>>,
    interims?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisType>>, Record<string, never>>,
    internalUse?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisType>>, Record<string, never>>,
    keyword?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisType>>, Record<string, never>>,
    methods?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisType>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisType>>, Record<string, never>>,
    precision?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisType>>, Record<string, never>>,
    requiredVerifications?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisType>>, Record<string, never>>,
    resultOptions?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisType>>, Record<string, never>>,
    resultType?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisType>>, Record<string, never>>,
    sampleTypes?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisType>>, Record<string, never>>,
    selfVerification?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisType>>, Record<string, never>>,
    sortKey?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisType>>, Record<string, never>>,
    specifications?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisType>>, Record<string, never>>,
    tatLengthMinutes?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisType>>, Record<string, never>>,
    uncertainties?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisType>>, Record<string, never>>,
    unit?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisType>>, Record<string, never>>,
    unitUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisType>>, Record<string, never>>
  },
  AnalysisUncertaintyType?: {
    analysisUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisUncertaintyType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisUncertaintyType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisUncertaintyType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisUncertaintyType>>, Record<string, never>>,
    instrumentUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisUncertaintyType>>, Record<string, never>>,
    max?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisUncertaintyType>>, Record<string, never>>,
    methodUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisUncertaintyType>>, Record<string, never>>,
    min?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisUncertaintyType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisUncertaintyType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisUncertaintyType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisUncertaintyType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisUncertaintyType>>, Record<string, never>>,
    value?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisUncertaintyType>>, Record<string, never>>
  },
  AnalysisWithProfiles?: {
    active?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisWithProfiles>>, Record<string, never>>,
    category?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisWithProfiles>>, Record<string, never>>,
    categoryUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisWithProfiles>>, Record<string, never>>,
    correctionFactors?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisWithProfiles>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisWithProfiles>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisWithProfiles>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisWithProfiles>>, Record<string, never>>,
    department?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisWithProfiles>>, Record<string, never>>,
    departmentUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisWithProfiles>>, Record<string, never>>,
    description?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisWithProfiles>>, Record<string, never>>,
    detectionLimits?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisWithProfiles>>, Record<string, never>>,
    hidden?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisWithProfiles>>, Record<string, never>>,
    instruments?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisWithProfiles>>, Record<string, never>>,
    interims?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisWithProfiles>>, Record<string, never>>,
    internalUse?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisWithProfiles>>, Record<string, never>>,
    keyword?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisWithProfiles>>, Record<string, never>>,
    methods?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisWithProfiles>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisWithProfiles>>, Record<string, never>>,
    precision?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisWithProfiles>>, Record<string, never>>,
    profiles?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisWithProfiles>>, Record<string, never>>,
    requiredVerifications?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisWithProfiles>>, Record<string, never>>,
    resultOptions?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisWithProfiles>>, Record<string, never>>,
    resultType?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisWithProfiles>>, Record<string, never>>,
    sampleTypes?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisWithProfiles>>, Record<string, never>>,
    selfVerification?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisWithProfiles>>, Record<string, never>>,
    sortKey?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisWithProfiles>>, Record<string, never>>,
    specifications?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisWithProfiles>>, Record<string, never>>,
    tatLengthMinutes?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisWithProfiles>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisWithProfiles>>, Record<string, never>>,
    uncertainties?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisWithProfiles>>, Record<string, never>>,
    unit?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisWithProfiles>>, Record<string, never>>,
    unitUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisWithProfiles>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisWithProfiles>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisWithProfiles>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AnalysisWithProfiles>>, Record<string, never>>
  },
  AuditLogType?: {
    action?: GraphCacheUpdateResolver<Maybe<WithTypename<AuditLogType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<AuditLogType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<AuditLogType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AuditLogType>>, Record<string, never>>,
    stateAfter?: GraphCacheUpdateResolver<Maybe<WithTypename<AuditLogType>>, Record<string, never>>,
    stateBefore?: GraphCacheUpdateResolver<Maybe<WithTypename<AuditLogType>>, Record<string, never>>,
    targetType?: GraphCacheUpdateResolver<Maybe<WithTypename<AuditLogType>>, Record<string, never>>,
    targetUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AuditLogType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<AuditLogType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<AuditLogType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<AuditLogType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AuditLogType>>, Record<string, never>>,
    userUid?: GraphCacheUpdateResolver<Maybe<WithTypename<AuditLogType>>, Record<string, never>>
  },
  AuthenticatedData?: {
    refresh?: GraphCacheUpdateResolver<Maybe<WithTypename<AuthenticatedData>>, Record<string, never>>,
    token?: GraphCacheUpdateResolver<Maybe<WithTypename<AuthenticatedData>>, Record<string, never>>,
    tokenType?: GraphCacheUpdateResolver<Maybe<WithTypename<AuthenticatedData>>, Record<string, never>>,
    user?: GraphCacheUpdateResolver<Maybe<WithTypename<AuthenticatedData>>, Record<string, never>>
  },
  CalibrationCertificateType?: {
    approvedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<CalibrationCertificateType>>, Record<string, never>>,
    certificateCode?: GraphCacheUpdateResolver<Maybe<WithTypename<CalibrationCertificateType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<CalibrationCertificateType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<CalibrationCertificateType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<CalibrationCertificateType>>, Record<string, never>>,
    dateIssued?: GraphCacheUpdateResolver<Maybe<WithTypename<CalibrationCertificateType>>, Record<string, never>>,
    internal?: GraphCacheUpdateResolver<Maybe<WithTypename<CalibrationCertificateType>>, Record<string, never>>,
    issuer?: GraphCacheUpdateResolver<Maybe<WithTypename<CalibrationCertificateType>>, Record<string, never>>,
    laboratoryInstrument?: GraphCacheUpdateResolver<Maybe<WithTypename<CalibrationCertificateType>>, Record<string, never>>,
    laboratoryInstrumentUid?: GraphCacheUpdateResolver<Maybe<WithTypename<CalibrationCertificateType>>, Record<string, never>>,
    performedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<CalibrationCertificateType>>, Record<string, never>>,
    remarks?: GraphCacheUpdateResolver<Maybe<WithTypename<CalibrationCertificateType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<CalibrationCertificateType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<CalibrationCertificateType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<CalibrationCertificateType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<CalibrationCertificateType>>, Record<string, never>>,
    validFromDate?: GraphCacheUpdateResolver<Maybe<WithTypename<CalibrationCertificateType>>, Record<string, never>>,
    validToDate?: GraphCacheUpdateResolver<Maybe<WithTypename<CalibrationCertificateType>>, Record<string, never>>
  },
  ClientContactType?: {
    businessPhone?: GraphCacheUpdateResolver<Maybe<WithTypename<ClientContactType>>, Record<string, never>>,
    client?: GraphCacheUpdateResolver<Maybe<WithTypename<ClientContactType>>, Record<string, never>>,
    clientUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ClientContactType>>, Record<string, never>>,
    consentSms?: GraphCacheUpdateResolver<Maybe<WithTypename<ClientContactType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<ClientContactType>>, Record<string, never>>,
    creatorName?: GraphCacheUpdateResolver<Maybe<WithTypename<ClientContactType>>, Record<string, never>>,
    creatorUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ClientContactType>>, Record<string, never>>,
    email?: GraphCacheUpdateResolver<Maybe<WithTypename<ClientContactType>>, Record<string, never>>,
    emailCc?: GraphCacheUpdateResolver<Maybe<WithTypename<ClientContactType>>, Record<string, never>>,
    firstName?: GraphCacheUpdateResolver<Maybe<WithTypename<ClientContactType>>, Record<string, never>>,
    isActive?: GraphCacheUpdateResolver<Maybe<WithTypename<ClientContactType>>, Record<string, never>>,
    lastName?: GraphCacheUpdateResolver<Maybe<WithTypename<ClientContactType>>, Record<string, never>>,
    mobilePhone?: GraphCacheUpdateResolver<Maybe<WithTypename<ClientContactType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<ClientContactType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<ClientContactType>>, Record<string, never>>,
    updatorName?: GraphCacheUpdateResolver<Maybe<WithTypename<ClientContactType>>, Record<string, never>>,
    updatorUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ClientContactType>>, Record<string, never>>
  },
  ClientCursorPage?: {
    edges?: GraphCacheUpdateResolver<Maybe<WithTypename<ClientCursorPage>>, Record<string, never>>,
    items?: GraphCacheUpdateResolver<Maybe<WithTypename<ClientCursorPage>>, Record<string, never>>,
    pageInfo?: GraphCacheUpdateResolver<Maybe<WithTypename<ClientCursorPage>>, Record<string, never>>,
    totalCount?: GraphCacheUpdateResolver<Maybe<WithTypename<ClientCursorPage>>, Record<string, never>>
  },
  ClientEdge?: {
    cursor?: GraphCacheUpdateResolver<Maybe<WithTypename<ClientEdge>>, Record<string, never>>,
    node?: GraphCacheUpdateResolver<Maybe<WithTypename<ClientEdge>>, Record<string, never>>
  },
  ClientType?: {
    active?: GraphCacheUpdateResolver<Maybe<WithTypename<ClientType>>, Record<string, never>>,
    code?: GraphCacheUpdateResolver<Maybe<WithTypename<ClientType>>, Record<string, never>>,
    consentEmail?: GraphCacheUpdateResolver<Maybe<WithTypename<ClientType>>, Record<string, never>>,
    consentSms?: GraphCacheUpdateResolver<Maybe<WithTypename<ClientType>>, Record<string, never>>,
    contacts?: GraphCacheUpdateResolver<Maybe<WithTypename<ClientType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<ClientType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<ClientType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ClientType>>, Record<string, never>>,
    district?: GraphCacheUpdateResolver<Maybe<WithTypename<ClientType>>, Record<string, never>>,
    districtUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ClientType>>, Record<string, never>>,
    email?: GraphCacheUpdateResolver<Maybe<WithTypename<ClientType>>, Record<string, never>>,
    emailCc?: GraphCacheUpdateResolver<Maybe<WithTypename<ClientType>>, Record<string, never>>,
    internalUse?: GraphCacheUpdateResolver<Maybe<WithTypename<ClientType>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<ClientType>>, Record<string, never>>,
    phoneBusiness?: GraphCacheUpdateResolver<Maybe<WithTypename<ClientType>>, Record<string, never>>,
    phoneMobile?: GraphCacheUpdateResolver<Maybe<WithTypename<ClientType>>, Record<string, never>>,
    province?: GraphCacheUpdateResolver<Maybe<WithTypename<ClientType>>, Record<string, never>>,
    provinceUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ClientType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<ClientType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<ClientType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<ClientType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ClientType>>, Record<string, never>>
  },
  CodingStandardType?: {
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<CodingStandardType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<CodingStandardType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<CodingStandardType>>, Record<string, never>>,
    description?: GraphCacheUpdateResolver<Maybe<WithTypename<CodingStandardType>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<CodingStandardType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<CodingStandardType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<CodingStandardType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<CodingStandardType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<CodingStandardType>>, Record<string, never>>
  },
  CountryType?: {
    active?: GraphCacheUpdateResolver<Maybe<WithTypename<CountryType>>, Record<string, never>>,
    code?: GraphCacheUpdateResolver<Maybe<WithTypename<CountryType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<CountryType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<CountryType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<CountryType>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<CountryType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<CountryType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<CountryType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<CountryType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<CountryType>>, Record<string, never>>
  },
  CreateQCSetData?: {
    qcSets?: GraphCacheUpdateResolver<Maybe<WithTypename<CreateQcSetData>>, Record<string, never>>
  },
  DeletedItem?: {
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<DeletedItem>>, Record<string, never>>
  },
  DepartmentType?: {
    code?: GraphCacheUpdateResolver<Maybe<WithTypename<DepartmentType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<DepartmentType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<DepartmentType>>, Record<string, never>>,
    description?: GraphCacheUpdateResolver<Maybe<WithTypename<DepartmentType>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<DepartmentType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<DepartmentType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<DepartmentType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<DepartmentType>>, Record<string, never>>
  },
  DistrictCursorPage?: {
    edges?: GraphCacheUpdateResolver<Maybe<WithTypename<DistrictCursorPage>>, Record<string, never>>,
    items?: GraphCacheUpdateResolver<Maybe<WithTypename<DistrictCursorPage>>, Record<string, never>>,
    pageInfo?: GraphCacheUpdateResolver<Maybe<WithTypename<DistrictCursorPage>>, Record<string, never>>,
    totalCount?: GraphCacheUpdateResolver<Maybe<WithTypename<DistrictCursorPage>>, Record<string, never>>
  },
  DistrictEdge?: {
    cursor?: GraphCacheUpdateResolver<Maybe<WithTypename<DistrictEdge>>, Record<string, never>>,
    node?: GraphCacheUpdateResolver<Maybe<WithTypename<DistrictEdge>>, Record<string, never>>
  },
  DistrictType?: {
    active?: GraphCacheUpdateResolver<Maybe<WithTypename<DistrictType>>, Record<string, never>>,
    businessPhone?: GraphCacheUpdateResolver<Maybe<WithTypename<DistrictType>>, Record<string, never>>,
    code?: GraphCacheUpdateResolver<Maybe<WithTypename<DistrictType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<DistrictType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<DistrictType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<DistrictType>>, Record<string, never>>,
    email?: GraphCacheUpdateResolver<Maybe<WithTypename<DistrictType>>, Record<string, never>>,
    emailCc?: GraphCacheUpdateResolver<Maybe<WithTypename<DistrictType>>, Record<string, never>>,
    mobilePhone?: GraphCacheUpdateResolver<Maybe<WithTypename<DistrictType>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<DistrictType>>, Record<string, never>>,
    province?: GraphCacheUpdateResolver<Maybe<WithTypename<DistrictType>>, Record<string, never>>,
    provinceUid?: GraphCacheUpdateResolver<Maybe<WithTypename<DistrictType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<DistrictType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<DistrictType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<DistrictType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<DistrictType>>, Record<string, never>>
  },
  GroupCount?: {
    count?: GraphCacheUpdateResolver<Maybe<WithTypename<GroupCount>>, Record<string, never>>,
    group?: GraphCacheUpdateResolver<Maybe<WithTypename<GroupCount>>, Record<string, never>>
  },
  GroupData?: {
    counts?: GraphCacheUpdateResolver<Maybe<WithTypename<GroupData>>, Record<string, never>>,
    group?: GraphCacheUpdateResolver<Maybe<WithTypename<GroupData>>, Record<string, never>>
  },
  GroupType?: {
    active?: GraphCacheUpdateResolver<Maybe<WithTypename<GroupType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<GroupType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<GroupType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<GroupType>>, Record<string, never>>,
    keyword?: GraphCacheUpdateResolver<Maybe<WithTypename<GroupType>>, Record<string, never>>,
    members?: GraphCacheUpdateResolver<Maybe<WithTypename<GroupType>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<GroupType>>, Record<string, never>>,
    pages?: GraphCacheUpdateResolver<Maybe<WithTypename<GroupType>>, Record<string, never>>,
    permissions?: GraphCacheUpdateResolver<Maybe<WithTypename<GroupType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<GroupType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<GroupType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<GroupType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<GroupType>>, Record<string, never>>
  },
  GroupedCounts?: {
    data?: GraphCacheUpdateResolver<Maybe<WithTypename<GroupedCounts>>, Record<string, never>>
  },
  GroupedData?: {
    data?: GraphCacheUpdateResolver<Maybe<WithTypename<GroupedData>>, Record<string, never>>
  },
  HazardType?: {
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<HazardType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<HazardType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<HazardType>>, Record<string, never>>,
    description?: GraphCacheUpdateResolver<Maybe<WithTypename<HazardType>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<HazardType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<HazardType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<HazardType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<HazardType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<HazardType>>, Record<string, never>>
  },
  IdentificationType?: {
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<IdentificationType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<IdentificationType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<IdentificationType>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<IdentificationType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<IdentificationType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<IdentificationType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<IdentificationType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<IdentificationType>>, Record<string, never>>
  },
  InstrumentCalibrationType?: {
    calibrationId?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentCalibrationType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentCalibrationType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentCalibrationType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentCalibrationType>>, Record<string, never>>,
    dateReported?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentCalibrationType>>, Record<string, never>>,
    endDate?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentCalibrationType>>, Record<string, never>>,
    laboratoryInstrument?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentCalibrationType>>, Record<string, never>>,
    laboratoryInstrumentUid?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentCalibrationType>>, Record<string, never>>,
    notesBefore?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentCalibrationType>>, Record<string, never>>,
    performedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentCalibrationType>>, Record<string, never>>,
    remarks?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentCalibrationType>>, Record<string, never>>,
    reportId?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentCalibrationType>>, Record<string, never>>,
    startDate?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentCalibrationType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentCalibrationType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentCalibrationType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentCalibrationType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentCalibrationType>>, Record<string, never>>,
    workDone?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentCalibrationType>>, Record<string, never>>
  },
  InstrumentCompetenceType?: {
    competence?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentCompetenceType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentCompetenceType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentCompetenceType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentCompetenceType>>, Record<string, never>>,
    description?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentCompetenceType>>, Record<string, never>>,
    expiryDate?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentCompetenceType>>, Record<string, never>>,
    instrument?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentCompetenceType>>, Record<string, never>>,
    instrumentUid?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentCompetenceType>>, Record<string, never>>,
    internal?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentCompetenceType>>, Record<string, never>>,
    issueDate?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentCompetenceType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentCompetenceType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentCompetenceType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentCompetenceType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentCompetenceType>>, Record<string, never>>,
    user?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentCompetenceType>>, Record<string, never>>,
    userUid?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentCompetenceType>>, Record<string, never>>
  },
  InstrumentCursorPage?: {
    edges?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentCursorPage>>, Record<string, never>>,
    items?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentCursorPage>>, Record<string, never>>,
    pageInfo?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentCursorPage>>, Record<string, never>>,
    totalCount?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentCursorPage>>, Record<string, never>>
  },
  InstrumentEdge?: {
    cursor?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentEdge>>, Record<string, never>>,
    node?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentEdge>>, Record<string, never>>
  },
  InstrumentType?: {
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentType>>, Record<string, never>>,
    description?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentType>>, Record<string, never>>,
    instrumentType?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentType>>, Record<string, never>>,
    instrumentTypeUid?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentType>>, Record<string, never>>,
    keyword?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentType>>, Record<string, never>>,
    laboratoryInstruments?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentType>>, Record<string, never>>,
    manufacturer?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentType>>, Record<string, never>>,
    manufacturerUid?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentType>>, Record<string, never>>,
    methods?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentType>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentType>>, Record<string, never>>,
    supplier?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentType>>, Record<string, never>>,
    supplierUid?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentType>>, Record<string, never>>
  },
  InstrumentTypeCursorPage?: {
    edges?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentTypeCursorPage>>, Record<string, never>>,
    items?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentTypeCursorPage>>, Record<string, never>>,
    pageInfo?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentTypeCursorPage>>, Record<string, never>>,
    totalCount?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentTypeCursorPage>>, Record<string, never>>
  },
  InstrumentTypeEdge?: {
    cursor?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentTypeEdge>>, Record<string, never>>,
    node?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentTypeEdge>>, Record<string, never>>
  },
  InstrumentTypeType?: {
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentTypeType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentTypeType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentTypeType>>, Record<string, never>>,
    description?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentTypeType>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentTypeType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentTypeType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentTypeType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentTypeType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<InstrumentTypeType>>, Record<string, never>>
  },
  LaboratoryInstrumentCursorPage?: {
    edges?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratoryInstrumentCursorPage>>, Record<string, never>>,
    items?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratoryInstrumentCursorPage>>, Record<string, never>>,
    pageInfo?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratoryInstrumentCursorPage>>, Record<string, never>>,
    totalCount?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratoryInstrumentCursorPage>>, Record<string, never>>
  },
  LaboratoryInstrumentEdge?: {
    cursor?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratoryInstrumentEdge>>, Record<string, never>>,
    node?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratoryInstrumentEdge>>, Record<string, never>>
  },
  LaboratoryInstrumentType?: {
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratoryInstrumentType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratoryInstrumentType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratoryInstrumentType>>, Record<string, never>>,
    dateCommissioned?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratoryInstrumentType>>, Record<string, never>>,
    dateDecommissioned?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratoryInstrumentType>>, Record<string, never>>,
    instrument?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratoryInstrumentType>>, Record<string, never>>,
    instrumentUid?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratoryInstrumentType>>, Record<string, never>>,
    labName?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratoryInstrumentType>>, Record<string, never>>,
    serialNumber?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratoryInstrumentType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratoryInstrumentType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratoryInstrumentType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratoryInstrumentType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratoryInstrumentType>>, Record<string, never>>
  },
  LaboratorySettingType?: {
    allowAutoBilling?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratorySettingType>>, Record<string, never>>,
    allowBilling?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratorySettingType>>, Record<string, never>>,
    allowPatientRegistration?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratorySettingType>>, Record<string, never>>,
    allowSampleRegistration?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratorySettingType>>, Record<string, never>>,
    allowSelfVerification?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratorySettingType>>, Record<string, never>>,
    allowWorksheetCreation?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratorySettingType>>, Record<string, never>>,
    autoReceiveSamples?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratorySettingType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratorySettingType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratorySettingType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratorySettingType>>, Record<string, never>>,
    currency?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratorySettingType>>, Record<string, never>>,
    defaultRoute?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratorySettingType>>, Record<string, never>>,
    defaultTatMinutes?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratorySettingType>>, Record<string, never>>,
    defaultTheme?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratorySettingType>>, Record<string, never>>,
    inactivityLogOut?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratorySettingType>>, Record<string, never>>,
    laboratory?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratorySettingType>>, Record<string, never>>,
    laboratoryUid?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratorySettingType>>, Record<string, never>>,
    passwordLifetime?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratorySettingType>>, Record<string, never>>,
    paymentTermsDays?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratorySettingType>>, Record<string, never>>,
    stickerCopies?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratorySettingType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratorySettingType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratorySettingType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratorySettingType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratorySettingType>>, Record<string, never>>
  },
  LaboratoryType?: {
    address?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratoryType>>, Record<string, never>>,
    banking?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratoryType>>, Record<string, never>>,
    businessPhone?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratoryType>>, Record<string, never>>,
    code?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratoryType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratoryType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratoryType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratoryType>>, Record<string, never>>,
    email?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratoryType>>, Record<string, never>>,
    emailCc?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratoryType>>, Record<string, never>>,
    labManager?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratoryType>>, Record<string, never>>,
    labManagerUid?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratoryType>>, Record<string, never>>,
    labName?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratoryType>>, Record<string, never>>,
    logo?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratoryType>>, Record<string, never>>,
    mobilePhone?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratoryType>>, Record<string, never>>,
    qualityStatement?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratoryType>>, Record<string, never>>,
    setupName?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratoryType>>, Record<string, never>>,
    tagLine?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratoryType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratoryType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratoryType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratoryType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<LaboratoryType>>, Record<string, never>>
  },
  LaggardCounts?: {
    graterThanThirty?: GraphCacheUpdateResolver<Maybe<WithTypename<LaggardCounts>>, Record<string, never>>,
    lessThanTen?: GraphCacheUpdateResolver<Maybe<WithTypename<LaggardCounts>>, Record<string, never>>,
    tenToTwenty?: GraphCacheUpdateResolver<Maybe<WithTypename<LaggardCounts>>, Record<string, never>>,
    totalDelayed?: GraphCacheUpdateResolver<Maybe<WithTypename<LaggardCounts>>, Record<string, never>>,
    totalIncomplete?: GraphCacheUpdateResolver<Maybe<WithTypename<LaggardCounts>>, Record<string, never>>,
    totalNotDelayed?: GraphCacheUpdateResolver<Maybe<WithTypename<LaggardCounts>>, Record<string, never>>,
    twentyToThirty?: GraphCacheUpdateResolver<Maybe<WithTypename<LaggardCounts>>, Record<string, never>>
  },
  LaggardData?: {
    category?: GraphCacheUpdateResolver<Maybe<WithTypename<LaggardData>>, Record<string, never>>,
    counts?: GraphCacheUpdateResolver<Maybe<WithTypename<LaggardData>>, Record<string, never>>
  },
  LaggardStatistics?: {
    data?: GraphCacheUpdateResolver<Maybe<WithTypename<LaggardStatistics>>, Record<string, never>>
  },
  ManufacturerType?: {
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<ManufacturerType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<ManufacturerType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ManufacturerType>>, Record<string, never>>,
    description?: GraphCacheUpdateResolver<Maybe<WithTypename<ManufacturerType>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<ManufacturerType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<ManufacturerType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<ManufacturerType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<ManufacturerType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ManufacturerType>>, Record<string, never>>
  },
  MessageThreadType?: {
    broadcast?: GraphCacheUpdateResolver<Maybe<WithTypename<MessageThreadType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<MessageThreadType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<MessageThreadType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<MessageThreadType>>, Record<string, never>>,
    deletedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<MessageThreadType>>, Record<string, never>>,
    messages?: GraphCacheUpdateResolver<Maybe<WithTypename<MessageThreadType>>, Record<string, never>>,
    recipients?: GraphCacheUpdateResolver<Maybe<WithTypename<MessageThreadType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<MessageThreadType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<MessageThreadType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<MessageThreadType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<MessageThreadType>>, Record<string, never>>
  },
  MessageType?: {
    body?: GraphCacheUpdateResolver<Maybe<WithTypename<MessageType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<MessageType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<MessageType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<MessageType>>, Record<string, never>>,
    deletedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<MessageType>>, Record<string, never>>,
    left?: GraphCacheUpdateResolver<Maybe<WithTypename<MessageType>>, Record<string, never>>,
    parent?: GraphCacheUpdateResolver<Maybe<WithTypename<MessageType>>, Record<string, never>>,
    parentId?: GraphCacheUpdateResolver<Maybe<WithTypename<MessageType>>, Record<string, never>>,
    right?: GraphCacheUpdateResolver<Maybe<WithTypename<MessageType>>, Record<string, never>>,
    thread?: GraphCacheUpdateResolver<Maybe<WithTypename<MessageType>>, Record<string, never>>,
    threadUid?: GraphCacheUpdateResolver<Maybe<WithTypename<MessageType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<MessageType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<MessageType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<MessageType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<MessageType>>, Record<string, never>>,
    viewers?: GraphCacheUpdateResolver<Maybe<WithTypename<MessageType>>, Record<string, never>>
  },
  MessagesType?: {
    message?: GraphCacheUpdateResolver<Maybe<WithTypename<MessagesType>>, Record<string, never>>
  },
  MethodCursorPage?: {
    edges?: GraphCacheUpdateResolver<Maybe<WithTypename<MethodCursorPage>>, Record<string, never>>,
    items?: GraphCacheUpdateResolver<Maybe<WithTypename<MethodCursorPage>>, Record<string, never>>,
    pageInfo?: GraphCacheUpdateResolver<Maybe<WithTypename<MethodCursorPage>>, Record<string, never>>,
    totalCount?: GraphCacheUpdateResolver<Maybe<WithTypename<MethodCursorPage>>, Record<string, never>>
  },
  MethodEdge?: {
    cursor?: GraphCacheUpdateResolver<Maybe<WithTypename<MethodEdge>>, Record<string, never>>,
    node?: GraphCacheUpdateResolver<Maybe<WithTypename<MethodEdge>>, Record<string, never>>
  },
  MethodType?: {
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<MethodType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<MethodType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<MethodType>>, Record<string, never>>,
    description?: GraphCacheUpdateResolver<Maybe<WithTypename<MethodType>>, Record<string, never>>,
    instruments?: GraphCacheUpdateResolver<Maybe<WithTypename<MethodType>>, Record<string, never>>,
    keyword?: GraphCacheUpdateResolver<Maybe<WithTypename<MethodType>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<MethodType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<MethodType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<MethodType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<MethodType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<MethodType>>, Record<string, never>>
  },
  Nothing?: {
    data?: GraphCacheUpdateResolver<Maybe<WithTypename<Nothing>>, Record<string, never>>
  },
  NoticeType?: {
    body?: GraphCacheUpdateResolver<Maybe<WithTypename<NoticeType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<NoticeType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<NoticeType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<NoticeType>>, Record<string, never>>,
    departments?: GraphCacheUpdateResolver<Maybe<WithTypename<NoticeType>>, Record<string, never>>,
    expiry?: GraphCacheUpdateResolver<Maybe<WithTypename<NoticeType>>, Record<string, never>>,
    groups?: GraphCacheUpdateResolver<Maybe<WithTypename<NoticeType>>, Record<string, never>>,
    title?: GraphCacheUpdateResolver<Maybe<WithTypename<NoticeType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<NoticeType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<NoticeType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<NoticeType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<NoticeType>>, Record<string, never>>,
    viewers?: GraphCacheUpdateResolver<Maybe<WithTypename<NoticeType>>, Record<string, never>>
  },
  NotificationType?: {
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<NotificationType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<NotificationType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<NotificationType>>, Record<string, never>>,
    departments?: GraphCacheUpdateResolver<Maybe<WithTypename<NotificationType>>, Record<string, never>>,
    groups?: GraphCacheUpdateResolver<Maybe<WithTypename<NotificationType>>, Record<string, never>>,
    message?: GraphCacheUpdateResolver<Maybe<WithTypename<NotificationType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<NotificationType>>, Record<string, never>>,
    users?: GraphCacheUpdateResolver<Maybe<WithTypename<NotificationType>>, Record<string, never>>,
    viewers?: GraphCacheUpdateResolver<Maybe<WithTypename<NotificationType>>, Record<string, never>>
  },
  OperationError?: {
    error?: GraphCacheUpdateResolver<Maybe<WithTypename<OperationError>>, Record<string, never>>,
    suggestion?: GraphCacheUpdateResolver<Maybe<WithTypename<OperationError>>, Record<string, never>>
  },
  OperationSuccess?: {
    message?: GraphCacheUpdateResolver<Maybe<WithTypename<OperationSuccess>>, Record<string, never>>
  },
  PageInfo?: {
    endCursor?: GraphCacheUpdateResolver<Maybe<WithTypename<PageInfo>>, Record<string, never>>,
    hasNextPage?: GraphCacheUpdateResolver<Maybe<WithTypename<PageInfo>>, Record<string, never>>,
    hasPreviousPage?: GraphCacheUpdateResolver<Maybe<WithTypename<PageInfo>>, Record<string, never>>,
    startCursor?: GraphCacheUpdateResolver<Maybe<WithTypename<PageInfo>>, Record<string, never>>
  },
  PasswordResetValidityType?: {
    authUid?: GraphCacheUpdateResolver<Maybe<WithTypename<PasswordResetValidityType>>, Record<string, never>>,
    username?: GraphCacheUpdateResolver<Maybe<WithTypename<PasswordResetValidityType>>, Record<string, never>>
  },
  PatientCursorPage?: {
    edges?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientCursorPage>>, Record<string, never>>,
    items?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientCursorPage>>, Record<string, never>>,
    pageInfo?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientCursorPage>>, Record<string, never>>,
    totalCount?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientCursorPage>>, Record<string, never>>
  },
  PatientEdge?: {
    cursor?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientEdge>>, Record<string, never>>,
    node?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientEdge>>, Record<string, never>>
  },
  PatientIdentificationType?: {
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientIdentificationType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientIdentificationType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientIdentificationType>>, Record<string, never>>,
    identification?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientIdentificationType>>, Record<string, never>>,
    identificationUid?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientIdentificationType>>, Record<string, never>>,
    patientUid?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientIdentificationType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientIdentificationType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientIdentificationType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientIdentificationType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientIdentificationType>>, Record<string, never>>,
    value?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientIdentificationType>>, Record<string, never>>
  },
  PatientType?: {
    active?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientType>>, Record<string, never>>,
    age?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientType>>, Record<string, never>>,
    ageDobEstimated?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientType>>, Record<string, never>>,
    client?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientType>>, Record<string, never>>,
    clientPatientId?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientType>>, Record<string, never>>,
    clientUid?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientType>>, Record<string, never>>,
    consentSms?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientType>>, Record<string, never>>,
    country?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientType>>, Record<string, never>>,
    countryUid?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientType>>, Record<string, never>>,
    dateOfBirth?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientType>>, Record<string, never>>,
    district?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientType>>, Record<string, never>>,
    districtUid?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientType>>, Record<string, never>>,
    email?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientType>>, Record<string, never>>,
    firstName?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientType>>, Record<string, never>>,
    gender?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientType>>, Record<string, never>>,
    identifications?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientType>>, Record<string, never>>,
    internalUse?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientType>>, Record<string, never>>,
    lastName?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientType>>, Record<string, never>>,
    metadataSnapshot?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientType>>, Record<string, never>>,
    middleName?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientType>>, Record<string, never>>,
    patientId?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientType>>, Record<string, never>>,
    phoneHome?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientType>>, Record<string, never>>,
    phoneMobile?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientType>>, Record<string, never>>,
    province?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientType>>, Record<string, never>>,
    provinceUid?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<PatientType>>, Record<string, never>>
  },
  PermissionType?: {
    action?: GraphCacheUpdateResolver<Maybe<WithTypename<PermissionType>>, Record<string, never>>,
    active?: GraphCacheUpdateResolver<Maybe<WithTypename<PermissionType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<PermissionType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<PermissionType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<PermissionType>>, Record<string, never>>,
    target?: GraphCacheUpdateResolver<Maybe<WithTypename<PermissionType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<PermissionType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<PermissionType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<PermissionType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<PermissionType>>, Record<string, never>>
  },
  ProcessCounts?: {
    avgExtraDays?: GraphCacheUpdateResolver<Maybe<WithTypename<ProcessCounts>>, Record<string, never>>,
    processAverage?: GraphCacheUpdateResolver<Maybe<WithTypename<ProcessCounts>>, Record<string, never>>,
    service?: GraphCacheUpdateResolver<Maybe<WithTypename<ProcessCounts>>, Record<string, never>>,
    totalLate?: GraphCacheUpdateResolver<Maybe<WithTypename<ProcessCounts>>, Record<string, never>>,
    totalNotLate?: GraphCacheUpdateResolver<Maybe<WithTypename<ProcessCounts>>, Record<string, never>>,
    totalSamples?: GraphCacheUpdateResolver<Maybe<WithTypename<ProcessCounts>>, Record<string, never>>
  },
  ProcessData?: {
    counts?: GraphCacheUpdateResolver<Maybe<WithTypename<ProcessData>>, Record<string, never>>,
    groups?: GraphCacheUpdateResolver<Maybe<WithTypename<ProcessData>>, Record<string, never>>,
    process?: GraphCacheUpdateResolver<Maybe<WithTypename<ProcessData>>, Record<string, never>>
  },
  ProcessStatistics?: {
    data?: GraphCacheUpdateResolver<Maybe<WithTypename<ProcessStatistics>>, Record<string, never>>
  },
  ProfileDiscountType?: {
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileDiscountType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileDiscountType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileDiscountType>>, Record<string, never>>,
    discountType?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileDiscountType>>, Record<string, never>>,
    endDate?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileDiscountType>>, Record<string, never>>,
    isActive?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileDiscountType>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileDiscountType>>, Record<string, never>>,
    profile?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileDiscountType>>, Record<string, never>>,
    profileUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileDiscountType>>, Record<string, never>>,
    startDate?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileDiscountType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileDiscountType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileDiscountType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileDiscountType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileDiscountType>>, Record<string, never>>,
    valueAmount?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileDiscountType>>, Record<string, never>>,
    valuePercent?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileDiscountType>>, Record<string, never>>,
    valueType?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileDiscountType>>, Record<string, never>>,
    voucher?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileDiscountType>>, Record<string, never>>,
    voucherUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileDiscountType>>, Record<string, never>>
  },
  ProfileMappingType?: {
    code?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileMappingType>>, Record<string, never>>,
    codingStandard?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileMappingType>>, Record<string, never>>,
    codingStandardUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileMappingType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileMappingType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileMappingType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileMappingType>>, Record<string, never>>,
    description?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileMappingType>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileMappingType>>, Record<string, never>>,
    profile?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileMappingType>>, Record<string, never>>,
    profileUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileMappingType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileMappingType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileMappingType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileMappingType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileMappingType>>, Record<string, never>>
  },
  ProfilePriceType?: {
    amount?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfilePriceType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfilePriceType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfilePriceType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfilePriceType>>, Record<string, never>>,
    isActive?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfilePriceType>>, Record<string, never>>,
    profile?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfilePriceType>>, Record<string, never>>,
    profileUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfilePriceType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfilePriceType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfilePriceType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfilePriceType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfilePriceType>>, Record<string, never>>
  },
  ProfileType?: {
    active?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileType>>, Record<string, never>>,
    analyses?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileType>>, Record<string, never>>,
    department?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileType>>, Record<string, never>>,
    departmentUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileType>>, Record<string, never>>,
    description?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileType>>, Record<string, never>>,
    keyword?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileType>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileType>>, Record<string, never>>,
    sampleTypes?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileType>>, Record<string, never>>,
    tatLengthMinutes?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ProfileType>>, Record<string, never>>
  },
  ProvinceCursorPage?: {
    edges?: GraphCacheUpdateResolver<Maybe<WithTypename<ProvinceCursorPage>>, Record<string, never>>,
    items?: GraphCacheUpdateResolver<Maybe<WithTypename<ProvinceCursorPage>>, Record<string, never>>,
    pageInfo?: GraphCacheUpdateResolver<Maybe<WithTypename<ProvinceCursorPage>>, Record<string, never>>,
    totalCount?: GraphCacheUpdateResolver<Maybe<WithTypename<ProvinceCursorPage>>, Record<string, never>>
  },
  ProvinceEdge?: {
    cursor?: GraphCacheUpdateResolver<Maybe<WithTypename<ProvinceEdge>>, Record<string, never>>,
    node?: GraphCacheUpdateResolver<Maybe<WithTypename<ProvinceEdge>>, Record<string, never>>
  },
  ProvinceType?: {
    active?: GraphCacheUpdateResolver<Maybe<WithTypename<ProvinceType>>, Record<string, never>>,
    businessPhone?: GraphCacheUpdateResolver<Maybe<WithTypename<ProvinceType>>, Record<string, never>>,
    code?: GraphCacheUpdateResolver<Maybe<WithTypename<ProvinceType>>, Record<string, never>>,
    country?: GraphCacheUpdateResolver<Maybe<WithTypename<ProvinceType>>, Record<string, never>>,
    countryUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ProvinceType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<ProvinceType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<ProvinceType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ProvinceType>>, Record<string, never>>,
    email?: GraphCacheUpdateResolver<Maybe<WithTypename<ProvinceType>>, Record<string, never>>,
    emailCc?: GraphCacheUpdateResolver<Maybe<WithTypename<ProvinceType>>, Record<string, never>>,
    mobilePhone?: GraphCacheUpdateResolver<Maybe<WithTypename<ProvinceType>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<ProvinceType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<ProvinceType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<ProvinceType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<ProvinceType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ProvinceType>>, Record<string, never>>
  },
  QCLevelType?: {
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<QcLevelType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<QcLevelType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<QcLevelType>>, Record<string, never>>,
    level?: GraphCacheUpdateResolver<Maybe<WithTypename<QcLevelType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<QcLevelType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<QcLevelType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<QcLevelType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<QcLevelType>>, Record<string, never>>
  },
  QCSetCursorPage?: {
    edges?: GraphCacheUpdateResolver<Maybe<WithTypename<QcSetCursorPage>>, Record<string, never>>,
    items?: GraphCacheUpdateResolver<Maybe<WithTypename<QcSetCursorPage>>, Record<string, never>>,
    pageInfo?: GraphCacheUpdateResolver<Maybe<WithTypename<QcSetCursorPage>>, Record<string, never>>,
    totalCount?: GraphCacheUpdateResolver<Maybe<WithTypename<QcSetCursorPage>>, Record<string, never>>
  },
  QCSetEdge?: {
    cursor?: GraphCacheUpdateResolver<Maybe<WithTypename<QcSetEdge>>, Record<string, never>>,
    node?: GraphCacheUpdateResolver<Maybe<WithTypename<QcSetEdge>>, Record<string, never>>
  },
  QCSetType?: {
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<QcSetType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<QcSetType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<QcSetType>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<QcSetType>>, Record<string, never>>,
    note?: GraphCacheUpdateResolver<Maybe<WithTypename<QcSetType>>, Record<string, never>>,
    status?: GraphCacheUpdateResolver<Maybe<WithTypename<QcSetType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<QcSetType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<QcSetType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<QcSetType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<QcSetType>>, Record<string, never>>
  },
  QCSetWithSamples?: {
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<QcSetWithSamples>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<QcSetWithSamples>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<QcSetWithSamples>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<QcSetWithSamples>>, Record<string, never>>,
    note?: GraphCacheUpdateResolver<Maybe<WithTypename<QcSetWithSamples>>, Record<string, never>>,
    samples?: GraphCacheUpdateResolver<Maybe<WithTypename<QcSetWithSamples>>, Record<string, never>>,
    status?: GraphCacheUpdateResolver<Maybe<WithTypename<QcSetWithSamples>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<QcSetWithSamples>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<QcSetWithSamples>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<QcSetWithSamples>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<QcSetWithSamples>>, Record<string, never>>
  },
  QCTemplateType?: {
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<QcTemplateType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<QcTemplateType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<QcTemplateType>>, Record<string, never>>,
    departments?: GraphCacheUpdateResolver<Maybe<WithTypename<QcTemplateType>>, Record<string, never>>,
    description?: GraphCacheUpdateResolver<Maybe<WithTypename<QcTemplateType>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<QcTemplateType>>, Record<string, never>>,
    qcLevels?: GraphCacheUpdateResolver<Maybe<WithTypename<QcTemplateType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<QcTemplateType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<QcTemplateType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<QcTemplateType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<QcTemplateType>>, Record<string, never>>
  },
  ReferralLaboratoryType?: {
    code?: GraphCacheUpdateResolver<Maybe<WithTypename<ReferralLaboratoryType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<ReferralLaboratoryType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<ReferralLaboratoryType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ReferralLaboratoryType>>, Record<string, never>>,
    isReference?: GraphCacheUpdateResolver<Maybe<WithTypename<ReferralLaboratoryType>>, Record<string, never>>,
    isReferral?: GraphCacheUpdateResolver<Maybe<WithTypename<ReferralLaboratoryType>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<ReferralLaboratoryType>>, Record<string, never>>,
    password?: GraphCacheUpdateResolver<Maybe<WithTypename<ReferralLaboratoryType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<ReferralLaboratoryType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<ReferralLaboratoryType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<ReferralLaboratoryType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ReferralLaboratoryType>>, Record<string, never>>,
    url?: GraphCacheUpdateResolver<Maybe<WithTypename<ReferralLaboratoryType>>, Record<string, never>>,
    username?: GraphCacheUpdateResolver<Maybe<WithTypename<ReferralLaboratoryType>>, Record<string, never>>
  },
  ReflexActionType?: {
    analyses?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexActionType>>, Record<string, never>>,
    brains?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexActionType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexActionType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexActionType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexActionType>>, Record<string, never>>,
    description?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexActionType>>, Record<string, never>>,
    level?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexActionType>>, Record<string, never>>,
    reflexRule?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexActionType>>, Record<string, never>>,
    reflexRuleUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexActionType>>, Record<string, never>>,
    sampleType?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexActionType>>, Record<string, never>>,
    sampleTypeUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexActionType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexActionType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexActionType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexActionType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexActionType>>, Record<string, never>>
  },
  ReflexBrainActionType?: {
    addNew?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainActionType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainActionType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainActionType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainActionType>>, Record<string, never>>,
    description?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainActionType>>, Record<string, never>>,
    finalise?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainActionType>>, Record<string, never>>,
    priority?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainActionType>>, Record<string, never>>,
    reflexBrain?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainActionType>>, Record<string, never>>,
    reflexBrainUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainActionType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainActionType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainActionType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainActionType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainActionType>>, Record<string, never>>
  },
  ReflexBrainAdditionType?: {
    analysis?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainAdditionType>>, Record<string, never>>,
    analysisUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainAdditionType>>, Record<string, never>>,
    count?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainAdditionType>>, Record<string, never>>,
    reflexBrainAction?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainAdditionType>>, Record<string, never>>,
    reflexBrainActionUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainAdditionType>>, Record<string, never>>
  },
  ReflexBrainConditionCriteriaType?: {
    analysis?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainConditionCriteriaType>>, Record<string, never>>,
    analysisUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainConditionCriteriaType>>, Record<string, never>>,
    operator?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainConditionCriteriaType>>, Record<string, never>>,
    reflexBrainCondition?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainConditionCriteriaType>>, Record<string, never>>,
    reflexBrainConditionUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainConditionCriteriaType>>, Record<string, never>>,
    value?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainConditionCriteriaType>>, Record<string, never>>
  },
  ReflexBrainConditionType?: {
    criteria?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainConditionType>>, Record<string, never>>,
    description?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainConditionType>>, Record<string, never>>,
    priority?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainConditionType>>, Record<string, never>>,
    reflexBrain?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainConditionType>>, Record<string, never>>,
    reflexBrainUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainConditionType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainConditionType>>, Record<string, never>>
  },
  ReflexBrainFinalType?: {
    analysis?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainFinalType>>, Record<string, never>>,
    analysisUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainFinalType>>, Record<string, never>>,
    reflexBrainAction?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainFinalType>>, Record<string, never>>,
    reflexBrainActionUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainFinalType>>, Record<string, never>>,
    value?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainFinalType>>, Record<string, never>>
  },
  ReflexBrainType?: {
    actions?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainType>>, Record<string, never>>,
    conditions?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainType>>, Record<string, never>>,
    description?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainType>>, Record<string, never>>,
    priority?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainType>>, Record<string, never>>,
    reflexAction?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainType>>, Record<string, never>>,
    reflexActionUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexBrainType>>, Record<string, never>>
  },
  ReflexRuleCursorPage?: {
    edges?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexRuleCursorPage>>, Record<string, never>>,
    items?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexRuleCursorPage>>, Record<string, never>>,
    pageInfo?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexRuleCursorPage>>, Record<string, never>>,
    totalCount?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexRuleCursorPage>>, Record<string, never>>
  },
  ReflexRuleEdge?: {
    cursor?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexRuleEdge>>, Record<string, never>>,
    node?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexRuleEdge>>, Record<string, never>>
  },
  ReflexRuleType?: {
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexRuleType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexRuleType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexRuleType>>, Record<string, never>>,
    description?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexRuleType>>, Record<string, never>>,
    isActive?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexRuleType>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexRuleType>>, Record<string, never>>,
    priority?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexRuleType>>, Record<string, never>>,
    reflexActions?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexRuleType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexRuleType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexRuleType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexRuleType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ReflexRuleType>>, Record<string, never>>
  },
  RejectionReasonType?: {
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<RejectionReasonType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<RejectionReasonType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<RejectionReasonType>>, Record<string, never>>,
    reason?: GraphCacheUpdateResolver<Maybe<WithTypename<RejectionReasonType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<RejectionReasonType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<RejectionReasonType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<RejectionReasonType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<RejectionReasonType>>, Record<string, never>>
  },
  ReportImpressType?: {
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<ReportImpressType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<ReportImpressType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ReportImpressType>>, Record<string, never>>,
    emailRequired?: GraphCacheUpdateResolver<Maybe<WithTypename<ReportImpressType>>, Record<string, never>>,
    emailSent?: GraphCacheUpdateResolver<Maybe<WithTypename<ReportImpressType>>, Record<string, never>>,
    generatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<ReportImpressType>>, Record<string, never>>,
    generatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ReportImpressType>>, Record<string, never>>,
    jsonContent?: GraphCacheUpdateResolver<Maybe<WithTypename<ReportImpressType>>, Record<string, never>>,
    sample?: GraphCacheUpdateResolver<Maybe<WithTypename<ReportImpressType>>, Record<string, never>>,
    sampleUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ReportImpressType>>, Record<string, never>>,
    smsRequired?: GraphCacheUpdateResolver<Maybe<WithTypename<ReportImpressType>>, Record<string, never>>,
    smsSent?: GraphCacheUpdateResolver<Maybe<WithTypename<ReportImpressType>>, Record<string, never>>,
    state?: GraphCacheUpdateResolver<Maybe<WithTypename<ReportImpressType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<ReportImpressType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<ReportImpressType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ReportImpressType>>, Record<string, never>>
  },
  ReportMetaType?: {
    analyses?: GraphCacheUpdateResolver<Maybe<WithTypename<ReportMetaType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<ReportMetaType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<ReportMetaType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ReportMetaType>>, Record<string, never>>,
    dateColumn?: GraphCacheUpdateResolver<Maybe<WithTypename<ReportMetaType>>, Record<string, never>>,
    location?: GraphCacheUpdateResolver<Maybe<WithTypename<ReportMetaType>>, Record<string, never>>,
    periodEnd?: GraphCacheUpdateResolver<Maybe<WithTypename<ReportMetaType>>, Record<string, never>>,
    periodStart?: GraphCacheUpdateResolver<Maybe<WithTypename<ReportMetaType>>, Record<string, never>>,
    reportType?: GraphCacheUpdateResolver<Maybe<WithTypename<ReportMetaType>>, Record<string, never>>,
    sampleStates?: GraphCacheUpdateResolver<Maybe<WithTypename<ReportMetaType>>, Record<string, never>>,
    status?: GraphCacheUpdateResolver<Maybe<WithTypename<ReportMetaType>>, Record<string, never>>,
    temp?: GraphCacheUpdateResolver<Maybe<WithTypename<ReportMetaType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<ReportMetaType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<ReportMetaType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<ReportMetaType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ReportMetaType>>, Record<string, never>>
  },
  ResultListingType?: {
    results?: GraphCacheUpdateResolver<Maybe<WithTypename<ResultListingType>>, Record<string, never>>
  },
  ResultMutationType?: {
    after?: GraphCacheUpdateResolver<Maybe<WithTypename<ResultMutationType>>, Record<string, never>>,
    before?: GraphCacheUpdateResolver<Maybe<WithTypename<ResultMutationType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<ResultMutationType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<ResultMutationType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ResultMutationType>>, Record<string, never>>,
    date?: GraphCacheUpdateResolver<Maybe<WithTypename<ResultMutationType>>, Record<string, never>>,
    mutation?: GraphCacheUpdateResolver<Maybe<WithTypename<ResultMutationType>>, Record<string, never>>,
    resultUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ResultMutationType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<ResultMutationType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<ResultMutationType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<ResultMutationType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ResultMutationType>>, Record<string, never>>
  },
  ResultOptionType?: {
    analysisUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ResultOptionType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<ResultOptionType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<ResultOptionType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ResultOptionType>>, Record<string, never>>,
    optionKey?: GraphCacheUpdateResolver<Maybe<WithTypename<ResultOptionType>>, Record<string, never>>,
    sampleTypes?: GraphCacheUpdateResolver<Maybe<WithTypename<ResultOptionType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<ResultOptionType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<ResultOptionType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<ResultOptionType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ResultOptionType>>, Record<string, never>>,
    value?: GraphCacheUpdateResolver<Maybe<WithTypename<ResultOptionType>>, Record<string, never>>
  },
  ResultedSampleListingType?: {
    samples?: GraphCacheUpdateResolver<Maybe<WithTypename<ResultedSampleListingType>>, Record<string, never>>
  },
  SampleCursorPage?: {
    edges?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleCursorPage>>, Record<string, never>>,
    items?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleCursorPage>>, Record<string, never>>,
    pageInfo?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleCursorPage>>, Record<string, never>>,
    totalCount?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleCursorPage>>, Record<string, never>>
  },
  SampleEdge?: {
    cursor?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleEdge>>, Record<string, never>>,
    node?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleEdge>>, Record<string, never>>
  },
  SampleListingType?: {
    samples?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleListingType>>, Record<string, never>>
  },
  SampleType?: {
    analyses?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    analysisRequest?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    analysisRequestUid?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    assigned?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    cancelledBy?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    cancelledByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    dateCancelled?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    dateCollected?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    dateInvalidated?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    datePrinted?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    datePublished?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    dateReceived?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    dateRetrievedFromStorage?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    dateStored?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    dateSubmitted?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    dateVerified?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    dueDate?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    internalUse?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    invalidatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    invalidatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    metadataSnapshot?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    parent?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    parentId?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    printed?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    printedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    printedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    priority?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    profiles?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    publishedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    publishedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    qcLevel?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    qcLevelUid?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    qcSet?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    qcSetUid?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    receivedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    receivedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    rejectionReasons?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    sampleId?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    sampleType?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    sampleTypeUid?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    status?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    storageContainer?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    storageContainerUid?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    storageSlot?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    storageSlotIndex?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    storedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    storedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    submittedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    submittedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    verifiedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>,
    verifiedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleType>>, Record<string, never>>
  },
  SampleTypeMappingType?: {
    code?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleTypeMappingType>>, Record<string, never>>,
    codingStandard?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleTypeMappingType>>, Record<string, never>>,
    codingStandardUid?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleTypeMappingType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleTypeMappingType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleTypeMappingType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleTypeMappingType>>, Record<string, never>>,
    description?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleTypeMappingType>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleTypeMappingType>>, Record<string, never>>,
    sampleType?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleTypeMappingType>>, Record<string, never>>,
    sampleTypeUid?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleTypeMappingType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleTypeMappingType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleTypeMappingType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleTypeMappingType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleTypeMappingType>>, Record<string, never>>
  },
  SampleTypeTyp?: {
    abbr?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleTypeTyp>>, Record<string, never>>,
    active?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleTypeTyp>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleTypeTyp>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleTypeTyp>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleTypeTyp>>, Record<string, never>>,
    description?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleTypeTyp>>, Record<string, never>>,
    internalUse?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleTypeTyp>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleTypeTyp>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleTypeTyp>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleTypeTyp>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleTypeTyp>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<SampleTypeTyp>>, Record<string, never>>
  },
  SamplesWithResults?: {
    analyses?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    analysisRequest?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    analysisRequestUid?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    analysisResults?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    assigned?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    cancelledBy?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    cancelledByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    dateCancelled?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    dateCollected?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    dateInvalidated?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    datePrinted?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    datePublished?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    dateReceived?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    dateRetrievedFromStorage?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    dateStored?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    dateSubmitted?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    dateVerified?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    dueDate?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    internalUse?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    invalidatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    invalidatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    metadataSnapshot?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    parent?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    parentId?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    printed?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    printedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    printedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    priority?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    profiles?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    publishedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    publishedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    qcLevel?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    qcLevelUid?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    qcSet?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    qcSetUid?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    receivedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    receivedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    rejectionReasons?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    sampleId?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    sampleType?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    sampleTypeUid?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    status?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    storageContainer?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    storageContainerUid?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    storageSlot?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    storageSlotIndex?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    storedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    storedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    submittedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    submittedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    verifiedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>,
    verifiedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<SamplesWithResults>>, Record<string, never>>
  },
  ShipmentCursorPage?: {
    edges?: GraphCacheUpdateResolver<Maybe<WithTypename<ShipmentCursorPage>>, Record<string, never>>,
    items?: GraphCacheUpdateResolver<Maybe<WithTypename<ShipmentCursorPage>>, Record<string, never>>,
    pageInfo?: GraphCacheUpdateResolver<Maybe<WithTypename<ShipmentCursorPage>>, Record<string, never>>,
    totalCount?: GraphCacheUpdateResolver<Maybe<WithTypename<ShipmentCursorPage>>, Record<string, never>>
  },
  ShipmentEdge?: {
    cursor?: GraphCacheUpdateResolver<Maybe<WithTypename<ShipmentEdge>>, Record<string, never>>,
    node?: GraphCacheUpdateResolver<Maybe<WithTypename<ShipmentEdge>>, Record<string, never>>
  },
  ShipmentListingType?: {
    shipments?: GraphCacheUpdateResolver<Maybe<WithTypename<ShipmentListingType>>, Record<string, never>>
  },
  ShipmentType?: {
    assignedCount?: GraphCacheUpdateResolver<Maybe<WithTypename<ShipmentType>>, Record<string, never>>,
    comment?: GraphCacheUpdateResolver<Maybe<WithTypename<ShipmentType>>, Record<string, never>>,
    courier?: GraphCacheUpdateResolver<Maybe<WithTypename<ShipmentType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<ShipmentType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<ShipmentType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ShipmentType>>, Record<string, never>>,
    data?: GraphCacheUpdateResolver<Maybe<WithTypename<ShipmentType>>, Record<string, never>>,
    dateDispatched?: GraphCacheUpdateResolver<Maybe<WithTypename<ShipmentType>>, Record<string, never>>,
    dateFinalised?: GraphCacheUpdateResolver<Maybe<WithTypename<ShipmentType>>, Record<string, never>>,
    dateRecalled?: GraphCacheUpdateResolver<Maybe<WithTypename<ShipmentType>>, Record<string, never>>,
    dateReceived?: GraphCacheUpdateResolver<Maybe<WithTypename<ShipmentType>>, Record<string, never>>,
    dateRejected?: GraphCacheUpdateResolver<Maybe<WithTypename<ShipmentType>>, Record<string, never>>,
    dispatchedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<ShipmentType>>, Record<string, never>>,
    dispatchedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ShipmentType>>, Record<string, never>>,
    finalisedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<ShipmentType>>, Record<string, never>>,
    finalisedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ShipmentType>>, Record<string, never>>,
    incoming?: GraphCacheUpdateResolver<Maybe<WithTypename<ShipmentType>>, Record<string, never>>,
    jsonContent?: GraphCacheUpdateResolver<Maybe<WithTypename<ShipmentType>>, Record<string, never>>,
    laboratory?: GraphCacheUpdateResolver<Maybe<WithTypename<ShipmentType>>, Record<string, never>>,
    laboratoryUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ShipmentType>>, Record<string, never>>,
    pdfContent?: GraphCacheUpdateResolver<Maybe<WithTypename<ShipmentType>>, Record<string, never>>,
    recalledBy?: GraphCacheUpdateResolver<Maybe<WithTypename<ShipmentType>>, Record<string, never>>,
    recalledByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ShipmentType>>, Record<string, never>>,
    receivedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<ShipmentType>>, Record<string, never>>,
    receivedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ShipmentType>>, Record<string, never>>,
    rejectedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<ShipmentType>>, Record<string, never>>,
    rejectedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ShipmentType>>, Record<string, never>>,
    samples?: GraphCacheUpdateResolver<Maybe<WithTypename<ShipmentType>>, Record<string, never>>,
    shipmentId?: GraphCacheUpdateResolver<Maybe<WithTypename<ShipmentType>>, Record<string, never>>,
    shippedSamples?: GraphCacheUpdateResolver<Maybe<WithTypename<ShipmentType>>, Record<string, never>>,
    state?: GraphCacheUpdateResolver<Maybe<WithTypename<ShipmentType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<ShipmentType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<ShipmentType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<ShipmentType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ShipmentType>>, Record<string, never>>
  },
  ShippedSampleType?: {
    extSampleId?: GraphCacheUpdateResolver<Maybe<WithTypename<ShippedSampleType>>, Record<string, never>>,
    extSampleUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ShippedSampleType>>, Record<string, never>>,
    resultNotified?: GraphCacheUpdateResolver<Maybe<WithTypename<ShippedSampleType>>, Record<string, never>>,
    sample?: GraphCacheUpdateResolver<Maybe<WithTypename<ShippedSampleType>>, Record<string, never>>,
    sampleUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ShippedSampleType>>, Record<string, never>>,
    shipment?: GraphCacheUpdateResolver<Maybe<WithTypename<ShippedSampleType>>, Record<string, never>>,
    shipmentUid?: GraphCacheUpdateResolver<Maybe<WithTypename<ShippedSampleType>>, Record<string, never>>
  },
  StockAdjustmentCursorPage?: {
    edges?: GraphCacheUpdateResolver<Maybe<WithTypename<StockAdjustmentCursorPage>>, Record<string, never>>,
    items?: GraphCacheUpdateResolver<Maybe<WithTypename<StockAdjustmentCursorPage>>, Record<string, never>>,
    pageInfo?: GraphCacheUpdateResolver<Maybe<WithTypename<StockAdjustmentCursorPage>>, Record<string, never>>,
    totalCount?: GraphCacheUpdateResolver<Maybe<WithTypename<StockAdjustmentCursorPage>>, Record<string, never>>
  },
  StockAdjustmentEdge?: {
    cursor?: GraphCacheUpdateResolver<Maybe<WithTypename<StockAdjustmentEdge>>, Record<string, never>>,
    node?: GraphCacheUpdateResolver<Maybe<WithTypename<StockAdjustmentEdge>>, Record<string, never>>
  },
  StockAdjustmentType?: {
    adjust?: GraphCacheUpdateResolver<Maybe<WithTypename<StockAdjustmentType>>, Record<string, never>>,
    adjustmentBy?: GraphCacheUpdateResolver<Maybe<WithTypename<StockAdjustmentType>>, Record<string, never>>,
    adjustmentByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockAdjustmentType>>, Record<string, never>>,
    adjustmentDate?: GraphCacheUpdateResolver<Maybe<WithTypename<StockAdjustmentType>>, Record<string, never>>,
    adjustmentFor?: GraphCacheUpdateResolver<Maybe<WithTypename<StockAdjustmentType>>, Record<string, never>>,
    adjustmentForUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockAdjustmentType>>, Record<string, never>>,
    adjustmentType?: GraphCacheUpdateResolver<Maybe<WithTypename<StockAdjustmentType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<StockAdjustmentType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<StockAdjustmentType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockAdjustmentType>>, Record<string, never>>,
    product?: GraphCacheUpdateResolver<Maybe<WithTypename<StockAdjustmentType>>, Record<string, never>>,
    productUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockAdjustmentType>>, Record<string, never>>,
    remarks?: GraphCacheUpdateResolver<Maybe<WithTypename<StockAdjustmentType>>, Record<string, never>>,
    stockLot?: GraphCacheUpdateResolver<Maybe<WithTypename<StockAdjustmentType>>, Record<string, never>>,
    stockLotUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockAdjustmentType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockAdjustmentType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<StockAdjustmentType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<StockAdjustmentType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockAdjustmentType>>, Record<string, never>>
  },
  StockCategoryType?: {
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<StockCategoryType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<StockCategoryType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockCategoryType>>, Record<string, never>>,
    description?: GraphCacheUpdateResolver<Maybe<WithTypename<StockCategoryType>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<StockCategoryType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockCategoryType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<StockCategoryType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<StockCategoryType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockCategoryType>>, Record<string, never>>
  },
  StockItemCursorPage?: {
    edges?: GraphCacheUpdateResolver<Maybe<WithTypename<StockItemCursorPage>>, Record<string, never>>,
    items?: GraphCacheUpdateResolver<Maybe<WithTypename<StockItemCursorPage>>, Record<string, never>>,
    pageInfo?: GraphCacheUpdateResolver<Maybe<WithTypename<StockItemCursorPage>>, Record<string, never>>,
    totalCount?: GraphCacheUpdateResolver<Maybe<WithTypename<StockItemCursorPage>>, Record<string, never>>
  },
  StockItemEdge?: {
    cursor?: GraphCacheUpdateResolver<Maybe<WithTypename<StockItemEdge>>, Record<string, never>>,
    node?: GraphCacheUpdateResolver<Maybe<WithTypename<StockItemEdge>>, Record<string, never>>
  },
  StockItemType?: {
    category?: GraphCacheUpdateResolver<Maybe<WithTypename<StockItemType>>, Record<string, never>>,
    categoryUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockItemType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<StockItemType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<StockItemType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockItemType>>, Record<string, never>>,
    description?: GraphCacheUpdateResolver<Maybe<WithTypename<StockItemType>>, Record<string, never>>,
    hazard?: GraphCacheUpdateResolver<Maybe<WithTypename<StockItemType>>, Record<string, never>>,
    hazardUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockItemType>>, Record<string, never>>,
    maximumLevel?: GraphCacheUpdateResolver<Maybe<WithTypename<StockItemType>>, Record<string, never>>,
    minimumLevel?: GraphCacheUpdateResolver<Maybe<WithTypename<StockItemType>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<StockItemType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockItemType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<StockItemType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<StockItemType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockItemType>>, Record<string, never>>,
    variants?: GraphCacheUpdateResolver<Maybe<WithTypename<StockItemType>>, Record<string, never>>
  },
  StockItemVariantCursorPage?: {
    edges?: GraphCacheUpdateResolver<Maybe<WithTypename<StockItemVariantCursorPage>>, Record<string, never>>,
    items?: GraphCacheUpdateResolver<Maybe<WithTypename<StockItemVariantCursorPage>>, Record<string, never>>,
    pageInfo?: GraphCacheUpdateResolver<Maybe<WithTypename<StockItemVariantCursorPage>>, Record<string, never>>,
    totalCount?: GraphCacheUpdateResolver<Maybe<WithTypename<StockItemVariantCursorPage>>, Record<string, never>>
  },
  StockItemVariantEdge?: {
    cursor?: GraphCacheUpdateResolver<Maybe<WithTypename<StockItemVariantEdge>>, Record<string, never>>,
    node?: GraphCacheUpdateResolver<Maybe<WithTypename<StockItemVariantEdge>>, Record<string, never>>
  },
  StockItemVariantType?: {
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<StockItemVariantType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<StockItemVariantType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockItemVariantType>>, Record<string, never>>,
    description?: GraphCacheUpdateResolver<Maybe<WithTypename<StockItemVariantType>>, Record<string, never>>,
    maximumLevel?: GraphCacheUpdateResolver<Maybe<WithTypename<StockItemVariantType>>, Record<string, never>>,
    minimumLevel?: GraphCacheUpdateResolver<Maybe<WithTypename<StockItemVariantType>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<StockItemVariantType>>, Record<string, never>>,
    quantity?: GraphCacheUpdateResolver<Maybe<WithTypename<StockItemVariantType>>, Record<string, never>>,
    stockItem?: GraphCacheUpdateResolver<Maybe<WithTypename<StockItemVariantType>>, Record<string, never>>,
    stockItemUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockItemVariantType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockItemVariantType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<StockItemVariantType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<StockItemVariantType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockItemVariantType>>, Record<string, never>>
  },
  StockLotType?: {
    expiryDate?: GraphCacheUpdateResolver<Maybe<WithTypename<StockLotType>>, Record<string, never>>,
    lotNumber?: GraphCacheUpdateResolver<Maybe<WithTypename<StockLotType>>, Record<string, never>>,
    product?: GraphCacheUpdateResolver<Maybe<WithTypename<StockLotType>>, Record<string, never>>,
    productUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockLotType>>, Record<string, never>>,
    quantity?: GraphCacheUpdateResolver<Maybe<WithTypename<StockLotType>>, Record<string, never>>,
    remarks?: GraphCacheUpdateResolver<Maybe<WithTypename<StockLotType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockLotType>>, Record<string, never>>
  },
  StockOrderCursorPage?: {
    edges?: GraphCacheUpdateResolver<Maybe<WithTypename<StockOrderCursorPage>>, Record<string, never>>,
    items?: GraphCacheUpdateResolver<Maybe<WithTypename<StockOrderCursorPage>>, Record<string, never>>,
    pageInfo?: GraphCacheUpdateResolver<Maybe<WithTypename<StockOrderCursorPage>>, Record<string, never>>,
    totalCount?: GraphCacheUpdateResolver<Maybe<WithTypename<StockOrderCursorPage>>, Record<string, never>>
  },
  StockOrderEdge?: {
    cursor?: GraphCacheUpdateResolver<Maybe<WithTypename<StockOrderEdge>>, Record<string, never>>,
    node?: GraphCacheUpdateResolver<Maybe<WithTypename<StockOrderEdge>>, Record<string, never>>
  },
  StockOrderLineType?: {
    orderProducts?: GraphCacheUpdateResolver<Maybe<WithTypename<StockOrderLineType>>, Record<string, never>>,
    stockOrder?: GraphCacheUpdateResolver<Maybe<WithTypename<StockOrderLineType>>, Record<string, never>>
  },
  StockOrderProductType?: {
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<StockOrderProductType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<StockOrderProductType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockOrderProductType>>, Record<string, never>>,
    order?: GraphCacheUpdateResolver<Maybe<WithTypename<StockOrderProductType>>, Record<string, never>>,
    orderUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockOrderProductType>>, Record<string, never>>,
    product?: GraphCacheUpdateResolver<Maybe<WithTypename<StockOrderProductType>>, Record<string, never>>,
    productUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockOrderProductType>>, Record<string, never>>,
    quantity?: GraphCacheUpdateResolver<Maybe<WithTypename<StockOrderProductType>>, Record<string, never>>,
    stockLot?: GraphCacheUpdateResolver<Maybe<WithTypename<StockOrderProductType>>, Record<string, never>>,
    stockLotUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockOrderProductType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockOrderProductType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<StockOrderProductType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<StockOrderProductType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockOrderProductType>>, Record<string, never>>
  },
  StockOrderType?: {
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<StockOrderType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<StockOrderType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockOrderType>>, Record<string, never>>,
    department?: GraphCacheUpdateResolver<Maybe<WithTypename<StockOrderType>>, Record<string, never>>,
    departmentUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockOrderType>>, Record<string, never>>,
    fulfilledBy?: GraphCacheUpdateResolver<Maybe<WithTypename<StockOrderType>>, Record<string, never>>,
    fulfilledByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockOrderType>>, Record<string, never>>,
    orderBy?: GraphCacheUpdateResolver<Maybe<WithTypename<StockOrderType>>, Record<string, never>>,
    orderByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockOrderType>>, Record<string, never>>,
    orderNumber?: GraphCacheUpdateResolver<Maybe<WithTypename<StockOrderType>>, Record<string, never>>,
    remarks?: GraphCacheUpdateResolver<Maybe<WithTypename<StockOrderType>>, Record<string, never>>,
    status?: GraphCacheUpdateResolver<Maybe<WithTypename<StockOrderType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockOrderType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<StockOrderType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<StockOrderType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockOrderType>>, Record<string, never>>
  },
  StockPackagingType?: {
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<StockPackagingType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<StockPackagingType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockPackagingType>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<StockPackagingType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockPackagingType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<StockPackagingType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<StockPackagingType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockPackagingType>>, Record<string, never>>
  },
  StockProductInventoryType?: {
    product?: GraphCacheUpdateResolver<Maybe<WithTypename<StockProductInventoryType>>, Record<string, never>>,
    productUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockProductInventoryType>>, Record<string, never>>,
    quantity?: GraphCacheUpdateResolver<Maybe<WithTypename<StockProductInventoryType>>, Record<string, never>>,
    remarks?: GraphCacheUpdateResolver<Maybe<WithTypename<StockProductInventoryType>>, Record<string, never>>,
    stockLot?: GraphCacheUpdateResolver<Maybe<WithTypename<StockProductInventoryType>>, Record<string, never>>,
    stockLotUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockProductInventoryType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockProductInventoryType>>, Record<string, never>>
  },
  StockReceiptType?: {
    packageFactor?: GraphCacheUpdateResolver<Maybe<WithTypename<StockReceiptType>>, Record<string, never>>,
    packagesReceived?: GraphCacheUpdateResolver<Maybe<WithTypename<StockReceiptType>>, Record<string, never>>,
    product?: GraphCacheUpdateResolver<Maybe<WithTypename<StockReceiptType>>, Record<string, never>>,
    productUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockReceiptType>>, Record<string, never>>,
    quantityReceived?: GraphCacheUpdateResolver<Maybe<WithTypename<StockReceiptType>>, Record<string, never>>,
    receiptBy?: GraphCacheUpdateResolver<Maybe<WithTypename<StockReceiptType>>, Record<string, never>>,
    receiptByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockReceiptType>>, Record<string, never>>,
    receiptDate?: GraphCacheUpdateResolver<Maybe<WithTypename<StockReceiptType>>, Record<string, never>>,
    receiptType?: GraphCacheUpdateResolver<Maybe<WithTypename<StockReceiptType>>, Record<string, never>>,
    singlesReceived?: GraphCacheUpdateResolver<Maybe<WithTypename<StockReceiptType>>, Record<string, never>>,
    stockLot?: GraphCacheUpdateResolver<Maybe<WithTypename<StockReceiptType>>, Record<string, never>>,
    stockLotUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockReceiptType>>, Record<string, never>>,
    supplier?: GraphCacheUpdateResolver<Maybe<WithTypename<StockReceiptType>>, Record<string, never>>,
    supplierUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockReceiptType>>, Record<string, never>>,
    totalPrice?: GraphCacheUpdateResolver<Maybe<WithTypename<StockReceiptType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockReceiptType>>, Record<string, never>>,
    unit?: GraphCacheUpdateResolver<Maybe<WithTypename<StockReceiptType>>, Record<string, never>>,
    unitPrice?: GraphCacheUpdateResolver<Maybe<WithTypename<StockReceiptType>>, Record<string, never>>,
    unitUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockReceiptType>>, Record<string, never>>
  },
  StockTransactionCursorPage?: {
    edges?: GraphCacheUpdateResolver<Maybe<WithTypename<StockTransactionCursorPage>>, Record<string, never>>,
    items?: GraphCacheUpdateResolver<Maybe<WithTypename<StockTransactionCursorPage>>, Record<string, never>>,
    pageInfo?: GraphCacheUpdateResolver<Maybe<WithTypename<StockTransactionCursorPage>>, Record<string, never>>,
    totalCount?: GraphCacheUpdateResolver<Maybe<WithTypename<StockTransactionCursorPage>>, Record<string, never>>
  },
  StockTransactionEdge?: {
    cursor?: GraphCacheUpdateResolver<Maybe<WithTypename<StockTransactionEdge>>, Record<string, never>>,
    node?: GraphCacheUpdateResolver<Maybe<WithTypename<StockTransactionEdge>>, Record<string, never>>
  },
  StockTransactionType?: {
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<StockTransactionType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<StockTransactionType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockTransactionType>>, Record<string, never>>,
    dateIssued?: GraphCacheUpdateResolver<Maybe<WithTypename<StockTransactionType>>, Record<string, never>>,
    department?: GraphCacheUpdateResolver<Maybe<WithTypename<StockTransactionType>>, Record<string, never>>,
    departmentUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockTransactionType>>, Record<string, never>>,
    issued?: GraphCacheUpdateResolver<Maybe<WithTypename<StockTransactionType>>, Record<string, never>>,
    issuedTo?: GraphCacheUpdateResolver<Maybe<WithTypename<StockTransactionType>>, Record<string, never>>,
    issuedToUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockTransactionType>>, Record<string, never>>,
    product?: GraphCacheUpdateResolver<Maybe<WithTypename<StockTransactionType>>, Record<string, never>>,
    productUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockTransactionType>>, Record<string, never>>,
    transactionBy?: GraphCacheUpdateResolver<Maybe<WithTypename<StockTransactionType>>, Record<string, never>>,
    transactionByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockTransactionType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockTransactionType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<StockTransactionType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<StockTransactionType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockTransactionType>>, Record<string, never>>
  },
  StockUnitType?: {
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<StockUnitType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<StockUnitType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockUnitType>>, Record<string, never>>,
    description?: GraphCacheUpdateResolver<Maybe<WithTypename<StockUnitType>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<StockUnitType>>, Record<string, never>>,
    synonyms?: GraphCacheUpdateResolver<Maybe<WithTypename<StockUnitType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockUnitType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<StockUnitType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<StockUnitType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StockUnitType>>, Record<string, never>>
  },
  StorageContainerType?: {
    cols?: GraphCacheUpdateResolver<Maybe<WithTypename<StorageContainerType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<StorageContainerType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<StorageContainerType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StorageContainerType>>, Record<string, never>>,
    description?: GraphCacheUpdateResolver<Maybe<WithTypename<StorageContainerType>>, Record<string, never>>,
    grid?: GraphCacheUpdateResolver<Maybe<WithTypename<StorageContainerType>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<StorageContainerType>>, Record<string, never>>,
    rowWise?: GraphCacheUpdateResolver<Maybe<WithTypename<StorageContainerType>>, Record<string, never>>,
    rows?: GraphCacheUpdateResolver<Maybe<WithTypename<StorageContainerType>>, Record<string, never>>,
    slots?: GraphCacheUpdateResolver<Maybe<WithTypename<StorageContainerType>>, Record<string, never>>,
    storageSection?: GraphCacheUpdateResolver<Maybe<WithTypename<StorageContainerType>>, Record<string, never>>,
    storageSectionUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StorageContainerType>>, Record<string, never>>,
    storedCount?: GraphCacheUpdateResolver<Maybe<WithTypename<StorageContainerType>>, Record<string, never>>,
    tag?: GraphCacheUpdateResolver<Maybe<WithTypename<StorageContainerType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<StorageContainerType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<StorageContainerType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<StorageContainerType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StorageContainerType>>, Record<string, never>>
  },
  StorageLocationType?: {
    children?: GraphCacheUpdateResolver<Maybe<WithTypename<StorageLocationType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<StorageLocationType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<StorageLocationType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StorageLocationType>>, Record<string, never>>,
    description?: GraphCacheUpdateResolver<Maybe<WithTypename<StorageLocationType>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<StorageLocationType>>, Record<string, never>>,
    storeRoom?: GraphCacheUpdateResolver<Maybe<WithTypename<StorageLocationType>>, Record<string, never>>,
    storeRoomUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StorageLocationType>>, Record<string, never>>,
    tag?: GraphCacheUpdateResolver<Maybe<WithTypename<StorageLocationType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<StorageLocationType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<StorageLocationType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<StorageLocationType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StorageLocationType>>, Record<string, never>>
  },
  StorageSectionType?: {
    children?: GraphCacheUpdateResolver<Maybe<WithTypename<StorageSectionType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<StorageSectionType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<StorageSectionType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StorageSectionType>>, Record<string, never>>,
    description?: GraphCacheUpdateResolver<Maybe<WithTypename<StorageSectionType>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<StorageSectionType>>, Record<string, never>>,
    storageLocation?: GraphCacheUpdateResolver<Maybe<WithTypename<StorageSectionType>>, Record<string, never>>,
    storageLocationUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StorageSectionType>>, Record<string, never>>,
    tag?: GraphCacheUpdateResolver<Maybe<WithTypename<StorageSectionType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<StorageSectionType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<StorageSectionType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<StorageSectionType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StorageSectionType>>, Record<string, never>>
  },
  StoreRoomType?: {
    children?: GraphCacheUpdateResolver<Maybe<WithTypename<StoreRoomType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<StoreRoomType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<StoreRoomType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StoreRoomType>>, Record<string, never>>,
    description?: GraphCacheUpdateResolver<Maybe<WithTypename<StoreRoomType>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<StoreRoomType>>, Record<string, never>>,
    tag?: GraphCacheUpdateResolver<Maybe<WithTypename<StoreRoomType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<StoreRoomType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<StoreRoomType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<StoreRoomType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<StoreRoomType>>, Record<string, never>>
  },
  StoredSamplesType?: {
    samples?: GraphCacheUpdateResolver<Maybe<WithTypename<StoredSamplesType>>, Record<string, never>>
  },
  SupplierType?: {
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<SupplierType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<SupplierType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<SupplierType>>, Record<string, never>>,
    description?: GraphCacheUpdateResolver<Maybe<WithTypename<SupplierType>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<SupplierType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<SupplierType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<SupplierType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<SupplierType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<SupplierType>>, Record<string, never>>
  },
  TestBillCursorPage?: {
    edges?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillCursorPage>>, Record<string, never>>,
    items?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillCursorPage>>, Record<string, never>>,
    pageInfo?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillCursorPage>>, Record<string, never>>,
    totalCount?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillCursorPage>>, Record<string, never>>
  },
  TestBillEdge?: {
    cursor?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillEdge>>, Record<string, never>>,
    node?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillEdge>>, Record<string, never>>
  },
  TestBillInvoiceType?: {
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillInvoiceType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillInvoiceType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillInvoiceType>>, Record<string, never>>,
    jsonContent?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillInvoiceType>>, Record<string, never>>,
    pdfContent?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillInvoiceType>>, Record<string, never>>,
    testBill?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillInvoiceType>>, Record<string, never>>,
    testBillUid?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillInvoiceType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillInvoiceType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillInvoiceType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillInvoiceType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillInvoiceType>>, Record<string, never>>
  },
  TestBillTransactionType?: {
    actionMessage?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillTransactionType>>, Record<string, never>>,
    actionRequired?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillTransactionType>>, Record<string, never>>,
    amount?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillTransactionType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillTransactionType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillTransactionType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillTransactionType>>, Record<string, never>>,
    isSuccess?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillTransactionType>>, Record<string, never>>,
    kind?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillTransactionType>>, Record<string, never>>,
    message?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillTransactionType>>, Record<string, never>>,
    notes?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillTransactionType>>, Record<string, never>>,
    processed?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillTransactionType>>, Record<string, never>>,
    testBill?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillTransactionType>>, Record<string, never>>,
    testBillUid?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillTransactionType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillTransactionType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillTransactionType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillTransactionType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillTransactionType>>, Record<string, never>>
  },
  TestBillType?: {
    billId?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillType>>, Record<string, never>>,
    client?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillType>>, Record<string, never>>,
    clientUid?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillType>>, Record<string, never>>,
    isActive?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillType>>, Record<string, never>>,
    jsonContent?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillType>>, Record<string, never>>,
    orders?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillType>>, Record<string, never>>,
    partial?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillType>>, Record<string, never>>,
    patient?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillType>>, Record<string, never>>,
    patientUid?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillType>>, Record<string, never>>,
    toConfirm?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillType>>, Record<string, never>>,
    totalCharged?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillType>>, Record<string, never>>,
    totalPaid?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<TestBillType>>, Record<string, never>>
  },
  UnitType?: {
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<UnitType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<UnitType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<UnitType>>, Record<string, never>>,
    description?: GraphCacheUpdateResolver<Maybe<WithTypename<UnitType>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<UnitType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<UnitType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<UnitType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<UnitType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<UnitType>>, Record<string, never>>
  },
  UnknownObjectType?: {
    message?: GraphCacheUpdateResolver<Maybe<WithTypename<UnknownObjectType>>, Record<string, never>>
  },
  UpdatedGroupPerms?: {
    group?: GraphCacheUpdateResolver<Maybe<WithTypename<UpdatedGroupPerms>>, Record<string, never>>,
    permission?: GraphCacheUpdateResolver<Maybe<WithTypename<UpdatedGroupPerms>>, Record<string, never>>
  },
  UserCursorPage?: {
    edges?: GraphCacheUpdateResolver<Maybe<WithTypename<UserCursorPage>>, Record<string, never>>,
    items?: GraphCacheUpdateResolver<Maybe<WithTypename<UserCursorPage>>, Record<string, never>>,
    pageInfo?: GraphCacheUpdateResolver<Maybe<WithTypename<UserCursorPage>>, Record<string, never>>,
    totalCount?: GraphCacheUpdateResolver<Maybe<WithTypename<UserCursorPage>>, Record<string, never>>
  },
  UserEdge?: {
    cursor?: GraphCacheUpdateResolver<Maybe<WithTypename<UserEdge>>, Record<string, never>>,
    node?: GraphCacheUpdateResolver<Maybe<WithTypename<UserEdge>>, Record<string, never>>
  },
  UserPreferenceType?: {
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<UserPreferenceType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<UserPreferenceType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<UserPreferenceType>>, Record<string, never>>,
    departments?: GraphCacheUpdateResolver<Maybe<WithTypename<UserPreferenceType>>, Record<string, never>>,
    expandedMenu?: GraphCacheUpdateResolver<Maybe<WithTypename<UserPreferenceType>>, Record<string, never>>,
    theme?: GraphCacheUpdateResolver<Maybe<WithTypename<UserPreferenceType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<UserPreferenceType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<UserPreferenceType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<UserPreferenceType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<UserPreferenceType>>, Record<string, never>>
  },
  UserType?: {
    avatar?: GraphCacheUpdateResolver<Maybe<WithTypename<UserType>>, Record<string, never>>,
    bio?: GraphCacheUpdateResolver<Maybe<WithTypename<UserType>>, Record<string, never>>,
    businessPhone?: GraphCacheUpdateResolver<Maybe<WithTypename<UserType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<UserType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<UserType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<UserType>>, Record<string, never>>,
    defaultRoute?: GraphCacheUpdateResolver<Maybe<WithTypename<UserType>>, Record<string, never>>,
    email?: GraphCacheUpdateResolver<Maybe<WithTypename<UserType>>, Record<string, never>>,
    firstName?: GraphCacheUpdateResolver<Maybe<WithTypename<UserType>>, Record<string, never>>,
    groups?: GraphCacheUpdateResolver<Maybe<WithTypename<UserType>>, Record<string, never>>,
    isActive?: GraphCacheUpdateResolver<Maybe<WithTypename<UserType>>, Record<string, never>>,
    isBlocked?: GraphCacheUpdateResolver<Maybe<WithTypename<UserType>>, Record<string, never>>,
    isSuperuser?: GraphCacheUpdateResolver<Maybe<WithTypename<UserType>>, Record<string, never>>,
    lastName?: GraphCacheUpdateResolver<Maybe<WithTypename<UserType>>, Record<string, never>>,
    loginRetry?: GraphCacheUpdateResolver<Maybe<WithTypename<UserType>>, Record<string, never>>,
    mobilePhone?: GraphCacheUpdateResolver<Maybe<WithTypename<UserType>>, Record<string, never>>,
    preference?: GraphCacheUpdateResolver<Maybe<WithTypename<UserType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<UserType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<UserType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<UserType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<UserType>>, Record<string, never>>,
    userName?: GraphCacheUpdateResolver<Maybe<WithTypename<UserType>>, Record<string, never>>
  },
  VoucherCodeType?: {
    code?: GraphCacheUpdateResolver<Maybe<WithTypename<VoucherCodeType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<VoucherCodeType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<VoucherCodeType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<VoucherCodeType>>, Record<string, never>>,
    isActive?: GraphCacheUpdateResolver<Maybe<WithTypename<VoucherCodeType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<VoucherCodeType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<VoucherCodeType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<VoucherCodeType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<VoucherCodeType>>, Record<string, never>>,
    usageLimit?: GraphCacheUpdateResolver<Maybe<WithTypename<VoucherCodeType>>, Record<string, never>>,
    used?: GraphCacheUpdateResolver<Maybe<WithTypename<VoucherCodeType>>, Record<string, never>>,
    voucher?: GraphCacheUpdateResolver<Maybe<WithTypename<VoucherCodeType>>, Record<string, never>>,
    voucherUid?: GraphCacheUpdateResolver<Maybe<WithTypename<VoucherCodeType>>, Record<string, never>>
  },
  VoucherCustomerType?: {
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<VoucherCustomerType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<VoucherCustomerType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<VoucherCustomerType>>, Record<string, never>>,
    patient?: GraphCacheUpdateResolver<Maybe<WithTypename<VoucherCustomerType>>, Record<string, never>>,
    patientUid?: GraphCacheUpdateResolver<Maybe<WithTypename<VoucherCustomerType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<VoucherCustomerType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<VoucherCustomerType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<VoucherCustomerType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<VoucherCustomerType>>, Record<string, never>>,
    voucherCode?: GraphCacheUpdateResolver<Maybe<WithTypename<VoucherCustomerType>>, Record<string, never>>,
    voucherCodeUid?: GraphCacheUpdateResolver<Maybe<WithTypename<VoucherCustomerType>>, Record<string, never>>
  },
  VoucherType?: {
    codes?: GraphCacheUpdateResolver<Maybe<WithTypename<VoucherType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<VoucherType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<VoucherType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<VoucherType>>, Record<string, never>>,
    endDate?: GraphCacheUpdateResolver<Maybe<WithTypename<VoucherType>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<VoucherType>>, Record<string, never>>,
    oncePerCustomer?: GraphCacheUpdateResolver<Maybe<WithTypename<VoucherType>>, Record<string, never>>,
    oncePerOrder?: GraphCacheUpdateResolver<Maybe<WithTypename<VoucherType>>, Record<string, never>>,
    startDate?: GraphCacheUpdateResolver<Maybe<WithTypename<VoucherType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<VoucherType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<VoucherType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<VoucherType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<VoucherType>>, Record<string, never>>,
    usageLimit?: GraphCacheUpdateResolver<Maybe<WithTypename<VoucherType>>, Record<string, never>>,
    used?: GraphCacheUpdateResolver<Maybe<WithTypename<VoucherType>>, Record<string, never>>
  },
  WorkSheetCursorPage?: {
    edges?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetCursorPage>>, Record<string, never>>,
    items?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetCursorPage>>, Record<string, never>>,
    pageInfo?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetCursorPage>>, Record<string, never>>,
    totalCount?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetCursorPage>>, Record<string, never>>
  },
  WorkSheetEdge?: {
    cursor?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetEdge>>, Record<string, never>>,
    node?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetEdge>>, Record<string, never>>
  },
  WorkSheetTemplateType?: {
    analysis?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetTemplateType>>, Record<string, never>>,
    analysisUid?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetTemplateType>>, Record<string, never>>,
    cols?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetTemplateType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetTemplateType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetTemplateType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetTemplateType>>, Record<string, never>>,
    description?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetTemplateType>>, Record<string, never>>,
    instrument?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetTemplateType>>, Record<string, never>>,
    instrumentUid?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetTemplateType>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetTemplateType>>, Record<string, never>>,
    numberOfSamples?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetTemplateType>>, Record<string, never>>,
    qcLevels?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetTemplateType>>, Record<string, never>>,
    qcTemplate?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetTemplateType>>, Record<string, never>>,
    qcTemplateUid?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetTemplateType>>, Record<string, never>>,
    reserved?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetTemplateType>>, Record<string, never>>,
    rowWise?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetTemplateType>>, Record<string, never>>,
    rows?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetTemplateType>>, Record<string, never>>,
    sampleType?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetTemplateType>>, Record<string, never>>,
    sampleTypeUid?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetTemplateType>>, Record<string, never>>,
    state?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetTemplateType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetTemplateType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetTemplateType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetTemplateType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetTemplateType>>, Record<string, never>>,
    worksheetType?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetTemplateType>>, Record<string, never>>
  },
  WorkSheetType?: {
    analysis?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetType>>, Record<string, never>>,
    analysisResults?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetType>>, Record<string, never>>,
    analysisUid?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetType>>, Record<string, never>>,
    analyst?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetType>>, Record<string, never>>,
    analystUid?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetType>>, Record<string, never>>,
    assignedCount?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetType>>, Record<string, never>>,
    cols?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetType>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetType>>, Record<string, never>>,
    createdBy?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetType>>, Record<string, never>>,
    createdByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetType>>, Record<string, never>>,
    dateSubmitted?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetType>>, Record<string, never>>,
    dateVerified?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetType>>, Record<string, never>>,
    instrument?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetType>>, Record<string, never>>,
    instrumentUid?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetType>>, Record<string, never>>,
    numberOfSamples?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetType>>, Record<string, never>>,
    reserved?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetType>>, Record<string, never>>,
    rowWise?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetType>>, Record<string, never>>,
    rows?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetType>>, Record<string, never>>,
    sampleType?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetType>>, Record<string, never>>,
    sampleTypeUid?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetType>>, Record<string, never>>,
    state?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetType>>, Record<string, never>>,
    submittedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetType>>, Record<string, never>>,
    submittedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetType>>, Record<string, never>>,
    template?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetType>>, Record<string, never>>,
    templateUid?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetType>>, Record<string, never>>,
    uid?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetType>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetType>>, Record<string, never>>,
    updatedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetType>>, Record<string, never>>,
    updatedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetType>>, Record<string, never>>,
    verifiedBy?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetType>>, Record<string, never>>,
    verifiedByUid?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetType>>, Record<string, never>>,
    worksheetId?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetType>>, Record<string, never>>,
    worksheetType?: GraphCacheUpdateResolver<Maybe<WithTypename<WorkSheetType>>, Record<string, never>>
  },
  WorksheetListingType?: {
    worksheets?: GraphCacheUpdateResolver<Maybe<WithTypename<WorksheetListingType>>, Record<string, never>>
  },
};

export type GraphCacheConfig = Parameters<typeof cacheExchange>[0] & {
  updates?: GraphCacheUpdaters,
  keys?: GraphCacheKeysConfig,
  optimistic?: GraphCacheOptimisticUpdaters,
  resolvers?: GraphCacheResolvers,
};