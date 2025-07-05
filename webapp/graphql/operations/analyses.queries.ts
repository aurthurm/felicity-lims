import type * as Types from '../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetAllCodingStandardsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAllCodingStandardsQuery = (
  { __typename?: 'Query' }
  & { codingStandardAll: Array<(
    { __typename?: 'CodingStandardType' }
    & Pick<Types.CodingStandardType, 'uid' | 'name' | 'description'>
  )> }
);

export type GetAllSampleTypesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAllSampleTypesQuery = (
  { __typename?: 'Query' }
  & { sampleTypeAll: Array<(
    { __typename?: 'SampleTypeTyp' }
    & Pick<Types.SampleTypeTyp, 'uid' | 'name' | 'abbr' | 'description' | 'active'>
  )> }
);

export type GeSampleTypeMappingsBySampleTypeUidQueryVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type GeSampleTypeMappingsBySampleTypeUidQuery = (
  { __typename?: 'Query' }
  & { sampleTypeMappingsBySampleType: Array<(
    { __typename?: 'SampleTypeMappingType' }
    & Pick<Types.SampleTypeMappingType, 'uid' | 'sampleTypeUid' | 'codingStandardUid' | 'name' | 'code' | 'description'>
    & { codingStandard?: Types.Maybe<(
      { __typename?: 'CodingStandardType' }
      & Pick<Types.CodingStandardType, 'name'>
    )> }
  )> }
);

export type GetAllAnalysesServicesQueryVariables = Types.Exact<{
  first?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  after?: Types.InputMaybe<Types.Scalars['String']['input']>;
  text?: Types.InputMaybe<Types.Scalars['String']['input']>;
  sortBy?: Types.InputMaybe<Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input']>;
}>;


export type GetAllAnalysesServicesQuery = (
  { __typename?: 'Query' }
  & { analysisAll: (
    { __typename?: 'AnalysisCursorPage' }
    & { items?: Types.Maybe<Array<(
      { __typename?: 'AnalysisWithProfiles' }
      & Pick<Types.AnalysisWithProfiles, 'uid' | 'name' | 'keyword' | 'active' | 'sortKey' | 'tatLengthMinutes' | 'precision' | 'requiredVerifications' | 'selfVerification' | 'description' | 'categoryUid' | 'departmentUid' | 'unitUid'>
      & { unit?: Types.Maybe<(
        { __typename?: 'UnitType' }
        & Pick<Types.UnitType, 'uid' | 'name'>
      )>, sampleTypes?: Types.Maybe<Array<(
        { __typename?: 'SampleTypeTyp' }
        & Pick<Types.SampleTypeTyp, 'uid' | 'name'>
      )>>, specifications?: Types.Maybe<Array<(
        { __typename?: 'AnalysisSpecificationType' }
        & Pick<Types.AnalysisSpecificationType, 'uid' | 'analysisUid' | 'unitUid' | 'min' | 'max' | 'minWarn' | 'maxWarn' | 'minReport' | 'maxReport' | 'warnValues' | 'warnReport' | 'gender' | 'ageMin' | 'ageMax' | 'methodUid'>
        & { unit?: Types.Maybe<(
          { __typename?: 'UnitType' }
          & Pick<Types.UnitType, 'uid' | 'name' | 'description'>
        )> }
      )>>, uncertainties?: Types.Maybe<Array<(
        { __typename?: 'AnalysisUncertaintyType' }
        & Pick<Types.AnalysisUncertaintyType, 'uid' | 'min' | 'max' | 'value' | 'analysisUid' | 'instrumentUid' | 'methodUid'>
      )>>, detectionLimits?: Types.Maybe<Array<(
        { __typename?: 'AnalysisDetectionLimitType' }
        & Pick<Types.AnalysisDetectionLimitType, 'uid' | 'lowerLimit' | 'upperLimit' | 'analysisUid' | 'instrumentUid' | 'methodUid'>
      )>>, correctionFactors?: Types.Maybe<Array<(
        { __typename?: 'AnalysisCorrectionFactorType' }
        & Pick<Types.AnalysisCorrectionFactorType, 'uid' | 'factor' | 'analysisUid' | 'instrumentUid' | 'methodUid'>
      )>>, interims?: Types.Maybe<Array<(
        { __typename?: 'AnalysisInterimType' }
        & Pick<Types.AnalysisInterimType, 'uid' | 'key' | 'value' | 'analysisUid' | 'instrumentUid'>
      )>>, instruments?: Types.Maybe<Array<(
        { __typename?: 'InstrumentType' }
        & Pick<Types.InstrumentType, 'uid' | 'name' | 'keyword'>
      )>>, methods?: Types.Maybe<Array<(
        { __typename?: 'MethodType' }
        & Pick<Types.MethodType, 'uid' | 'name' | 'keyword' | 'description'>
        & { instruments?: Types.Maybe<Array<(
          { __typename?: 'InstrumentType' }
          & Pick<Types.InstrumentType, 'uid' | 'name' | 'keyword' | 'description'>
        )>> }
      )>>, resultOptions?: Types.Maybe<Array<(
        { __typename?: 'ResultOptionType' }
        & Pick<Types.ResultOptionType, 'uid' | 'optionKey' | 'value'>
        & { sampleTypes?: Types.Maybe<Array<(
          { __typename?: 'SampleTypeTyp' }
          & Pick<Types.SampleTypeTyp, 'uid' | 'name'>
        )>> }
      )>>, category?: Types.Maybe<(
        { __typename?: 'AnalysisCategoryType' }
        & Pick<Types.AnalysisCategoryType, 'uid' | 'name'>
      )>, profiles?: Types.Maybe<Array<(
        { __typename?: 'ProfileType' }
        & Pick<Types.ProfileType, 'uid' | 'name'>
      )>> }
    )>> }
  ) }
);

export type GetAnalysesServicesByUidQueryVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type GetAnalysesServicesByUidQuery = (
  { __typename?: 'Query' }
  & { analysisByUid: (
    { __typename?: 'AnalysisType' }
    & Pick<Types.AnalysisType, 'uid' | 'name' | 'keyword' | 'description'>
    & { unit?: Types.Maybe<(
      { __typename?: 'UnitType' }
      & Pick<Types.UnitType, 'uid' | 'name'>
    )>, category?: Types.Maybe<(
      { __typename?: 'AnalysisCategoryType' }
      & Pick<Types.AnalysisCategoryType, 'uid' | 'name'>
    )> }
  ) }
);

export type GetAllAnalysesProfilesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAllAnalysesProfilesQuery = (
  { __typename?: 'Query' }
  & { profileAll: Array<(
    { __typename?: 'ProfileType' }
    & Pick<Types.ProfileType, 'uid' | 'name' | 'description' | 'keyword' | 'active' | 'departmentUid'>
    & { sampleTypes?: Types.Maybe<Array<(
      { __typename?: 'SampleTypeTyp' }
      & Pick<Types.SampleTypeTyp, 'uid' | 'name'>
    )>>, analyses?: Types.Maybe<Array<(
      { __typename?: 'AnalysisType' }
      & Pick<Types.AnalysisType, 'name' | 'keyword' | 'active' | 'sortKey'>
    )>> }
  )> }
);

export type GetAllAnalysesTemplatesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAllAnalysesTemplatesQuery = (
  { __typename?: 'Query' }
  & { analysisTemplateAll: Array<(
    { __typename?: 'AnalysisTemplateType' }
    & Pick<Types.AnalysisTemplateType, 'uid' | 'name' | 'description' | 'departmentUid'>
    & { analyses?: Types.Maybe<Array<(
      { __typename?: 'AnalysisType' }
      & Pick<Types.AnalysisType, 'uid'>
    )>> }
  )> }
);

export type GetAnalysisMappingsByAnalysisUidQueryVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type GetAnalysisMappingsByAnalysisUidQuery = (
  { __typename?: 'Query' }
  & { analysisMappingsByAnalysis: Array<(
    { __typename?: 'AnalysisMappingType' }
    & Pick<Types.AnalysisMappingType, 'uid' | 'analysisUid' | 'codingStandardUid' | 'name' | 'code' | 'description'>
    & { codingStandard?: Types.Maybe<(
      { __typename?: 'CodingStandardType' }
      & Pick<Types.CodingStandardType, 'name'>
    )> }
  )> }
);

export type GetAllProfilesAndServicesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAllProfilesAndServicesQuery = (
  { __typename?: 'Query' }
  & { profileAll: Array<(
    { __typename?: 'ProfileType' }
    & Pick<Types.ProfileType, 'uid' | 'name' | 'description' | 'keyword' | 'active' | 'departmentUid'>
    & { sampleTypes?: Types.Maybe<Array<(
      { __typename?: 'SampleTypeTyp' }
      & Pick<Types.SampleTypeTyp, 'uid' | 'name'>
    )>>, analyses?: Types.Maybe<Array<(
      { __typename?: 'AnalysisType' }
      & Pick<Types.AnalysisType, 'uid' | 'name' | 'keyword' | 'sortKey' | 'active'>
    )>> }
  )>, analysisAll: (
    { __typename?: 'AnalysisCursorPage' }
    & { items?: Types.Maybe<Array<(
      { __typename?: 'AnalysisWithProfiles' }
      & Pick<Types.AnalysisWithProfiles, 'uid' | 'name' | 'keyword' | 'active' | 'description' | 'sortKey' | 'tatLengthMinutes' | 'precision' | 'requiredVerifications' | 'selfVerification' | 'categoryUid' | 'departmentUid' | 'unitUid'>
      & { unit?: Types.Maybe<(
        { __typename?: 'UnitType' }
        & Pick<Types.UnitType, 'uid' | 'name'>
      )>, sampleTypes?: Types.Maybe<Array<(
        { __typename?: 'SampleTypeTyp' }
        & Pick<Types.SampleTypeTyp, 'uid' | 'name'>
      )>>, specifications?: Types.Maybe<Array<(
        { __typename?: 'AnalysisSpecificationType' }
        & Pick<Types.AnalysisSpecificationType, 'uid' | 'analysisUid' | 'unitUid' | 'min' | 'max' | 'minWarn' | 'maxWarn' | 'minReport' | 'maxReport' | 'warnValues' | 'warnReport' | 'gender' | 'ageMin' | 'ageMax' | 'methodUid'>
        & { unit?: Types.Maybe<(
          { __typename?: 'UnitType' }
          & Pick<Types.UnitType, 'uid' | 'name' | 'description'>
        )> }
      )>>, uncertainties?: Types.Maybe<Array<(
        { __typename?: 'AnalysisUncertaintyType' }
        & Pick<Types.AnalysisUncertaintyType, 'uid' | 'min' | 'max' | 'value' | 'analysisUid' | 'instrumentUid' | 'methodUid'>
      )>>, detectionLimits?: Types.Maybe<Array<(
        { __typename?: 'AnalysisDetectionLimitType' }
        & Pick<Types.AnalysisDetectionLimitType, 'uid' | 'lowerLimit' | 'upperLimit' | 'analysisUid' | 'instrumentUid' | 'methodUid'>
      )>>, correctionFactors?: Types.Maybe<Array<(
        { __typename?: 'AnalysisCorrectionFactorType' }
        & Pick<Types.AnalysisCorrectionFactorType, 'uid' | 'factor' | 'analysisUid' | 'instrumentUid' | 'methodUid'>
      )>>, interims?: Types.Maybe<Array<(
        { __typename?: 'AnalysisInterimType' }
        & Pick<Types.AnalysisInterimType, 'uid' | 'key' | 'value' | 'analysisUid' | 'instrumentUid'>
      )>>, instruments?: Types.Maybe<Array<(
        { __typename?: 'InstrumentType' }
        & Pick<Types.InstrumentType, 'uid' | 'name' | 'keyword' | 'description'>
      )>>, methods?: Types.Maybe<Array<(
        { __typename?: 'MethodType' }
        & Pick<Types.MethodType, 'uid' | 'name' | 'keyword' | 'description'>
      )>>, resultOptions?: Types.Maybe<Array<(
        { __typename?: 'ResultOptionType' }
        & Pick<Types.ResultOptionType, 'uid' | 'optionKey' | 'value'>
        & { sampleTypes?: Types.Maybe<Array<(
          { __typename?: 'SampleTypeTyp' }
          & Pick<Types.SampleTypeTyp, 'uid' | 'name'>
        )>> }
      )>>, category?: Types.Maybe<(
        { __typename?: 'AnalysisCategoryType' }
        & Pick<Types.AnalysisCategoryType, 'uid' | 'name'>
      )>, profiles?: Types.Maybe<Array<(
        { __typename?: 'ProfileType' }
        & Pick<Types.ProfileType, 'uid' | 'name'>
      )>> }
    )>> }
  ) }
);

export type GetProfileMappingsByProfileUidQueryVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type GetProfileMappingsByProfileUidQuery = (
  { __typename?: 'Query' }
  & { profileMappingsByProfile: Array<(
    { __typename?: 'ProfileMappingType' }
    & Pick<Types.ProfileMappingType, 'uid' | 'profileUid' | 'codingStandardUid' | 'name' | 'code' | 'description'>
    & { codingStandard?: Types.Maybe<(
      { __typename?: 'CodingStandardType' }
      & Pick<Types.CodingStandardType, 'name'>
    )> }
  )> }
);

export type GetAllAnalysesCategoriesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAllAnalysesCategoriesQuery = (
  { __typename?: 'Query' }
  & { analysisCategoryAll: Array<(
    { __typename?: 'AnalysisCategoryType' }
    & Pick<Types.AnalysisCategoryType, 'uid' | 'name' | 'description' | 'active' | 'departmentUid'>
    & { department?: Types.Maybe<(
      { __typename?: 'DepartmentType' }
      & Pick<Types.DepartmentType, 'uid' | 'name'>
    )> }
  )> }
);

export type GetAllSamplesQueryVariables = Types.Exact<{
  first: Types.Scalars['Int']['input'];
  after?: Types.InputMaybe<Types.Scalars['String']['input']>;
  before?: Types.InputMaybe<Types.Scalars['String']['input']>;
  status: Types.Scalars['String']['input'];
  text: Types.Scalars['String']['input'];
  clientUid: Types.Scalars['String']['input'];
  sortBy?: Types.InputMaybe<Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input']>;
}>;


export type GetAllSamplesQuery = (
  { __typename?: 'Query' }
  & { sampleAll: (
    { __typename?: 'SampleCursorPage' }
    & Pick<Types.SampleCursorPage, 'totalCount'>
    & { pageInfo: (
      { __typename?: 'PageInfo' }
      & Pick<Types.PageInfo, 'hasNextPage' | 'hasPreviousPage' | 'endCursor' | 'startCursor'>
    ), items?: Types.Maybe<Array<(
      { __typename?: 'SamplesWithResults' }
      & Pick<Types.SamplesWithResults, 'uid' | 'createdByUid' | 'createdAt' | 'dateCollected' | 'dateReceived' | 'dateSubmitted' | 'dateVerified' | 'datePublished' | 'datePrinted' | 'dateStored' | 'printed' | 'dueDate' | 'sampleId' | 'priority' | 'status' | 'storageSlot' | 'storageContainerUid'>
      & { createdBy?: Types.Maybe<(
        { __typename?: 'UserType' }
        & Pick<Types.UserType, 'firstName' | 'lastName' | 'userName'>
      )>, analysisRequest?: Types.Maybe<(
        { __typename?: 'AnalysisRequestType' }
        & Pick<Types.AnalysisRequestType, 'uid' | 'clientRequestId'>
        & { patient: (
          { __typename?: 'PatientType' }
          & Pick<Types.PatientType, 'uid' | 'firstName' | 'lastName' | 'clientPatientId' | 'gender' | 'dateOfBirth' | 'age' | 'ageDobEstimated' | 'consentSms'>
        ), client?: Types.Maybe<(
          { __typename?: 'ClientType' }
          & Pick<Types.ClientType, 'uid' | 'name' | 'code'>
          & { district?: Types.Maybe<(
            { __typename?: 'DistrictType' }
            & Pick<Types.DistrictType, 'name'>
            & { province?: Types.Maybe<(
              { __typename?: 'ProvinceType' }
              & Pick<Types.ProvinceType, 'name'>
            )> }
          )> }
        )> }
      )>, sampleType?: Types.Maybe<(
        { __typename?: 'SampleTypeTyp' }
        & Pick<Types.SampleTypeTyp, 'uid' | 'name'>
      )>, storageContainer?: Types.Maybe<(
        { __typename?: 'StorageContainerType' }
        & Pick<Types.StorageContainerType, 'uid' | 'name'>
        & { storageSection?: Types.Maybe<(
          { __typename?: 'StorageSectionType' }
          & Pick<Types.StorageSectionType, 'uid' | 'name'>
          & { storageLocation?: Types.Maybe<(
            { __typename?: 'StorageLocationType' }
            & Pick<Types.StorageLocationType, 'uid' | 'name'>
            & { storeRoom?: Types.Maybe<(
              { __typename?: 'StoreRoomType' }
              & Pick<Types.StoreRoomType, 'uid' | 'name'>
            )> }
          )> }
        )> }
      )>, analyses?: Types.Maybe<Array<(
        { __typename?: 'AnalysisType' }
        & Pick<Types.AnalysisType, 'uid' | 'name' | 'sortKey'>
      )>>, profiles: Array<(
        { __typename?: 'ProfileType' }
        & Pick<Types.ProfileType, 'uid' | 'name'>
      )>, rejectionReasons?: Types.Maybe<Array<(
        { __typename?: 'RejectionReasonType' }
        & Pick<Types.RejectionReasonType, 'uid' | 'reason'>
      )>> }
    )>> }
  ) }
);

export type GetSamplesForShipmentAssignQueryVariables = Types.Exact<{
  first: Types.Scalars['Int']['input'];
  after?: Types.InputMaybe<Types.Scalars['String']['input']>;
  text: Types.Scalars['String']['input'];
  sortBy?: Types.InputMaybe<Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input']>;
  analysisUid?: Types.InputMaybe<Types.Scalars['String']['input']>;
  sampleTypeUid: Types.Scalars['String']['input'];
}>;


export type GetSamplesForShipmentAssignQuery = (
  { __typename?: 'Query' }
  & { samplesForShipmentAssign: (
    { __typename?: 'SampleCursorPage' }
    & Pick<Types.SampleCursorPage, 'totalCount'>
    & { pageInfo: (
      { __typename?: 'PageInfo' }
      & Pick<Types.PageInfo, 'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'>
    ), items?: Types.Maybe<Array<(
      { __typename?: 'SamplesWithResults' }
      & Pick<Types.SamplesWithResults, 'uid' | 'sampleId' | 'status' | 'createdAt' | 'dateReceived'>
      & { sampleType?: Types.Maybe<(
        { __typename?: 'SampleTypeTyp' }
        & Pick<Types.SampleTypeTyp, 'name'>
      )>, analysisRequest?: Types.Maybe<(
        { __typename?: 'AnalysisRequestType' }
        & Pick<Types.AnalysisRequestType, 'clientRequestId'>
      )>, analysisResults?: Types.Maybe<Array<(
        { __typename?: 'AnalysisResultType' }
        & Pick<Types.AnalysisResultType, 'uid' | 'assigned' | 'status'>
        & { analysis?: Types.Maybe<(
          { __typename?: 'AnalysisType' }
          & Pick<Types.AnalysisType, 'name'>
        )> }
      )>> }
    )>> }
  ) }
);

export type GetAnalysesRequestsByPatientUidQueryVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type GetAnalysesRequestsByPatientUidQuery = (
  { __typename?: 'Query' }
  & { analysisRequestsByPatientUid: Array<(
    { __typename?: 'AnalysisRequestWithSamples' }
    & Pick<Types.AnalysisRequestWithSamples, 'uid' | 'clientRequestId' | 'requestId' | 'createdAt'>
    & { patient: (
      { __typename?: 'PatientType' }
      & Pick<Types.PatientType, 'uid' | 'firstName' | 'lastName' | 'clientPatientId' | 'gender' | 'dateOfBirth' | 'age' | 'ageDobEstimated' | 'consentSms'>
    ), client?: Types.Maybe<(
      { __typename?: 'ClientType' }
      & Pick<Types.ClientType, 'uid' | 'name'>
    )>, samples?: Types.Maybe<Array<(
      { __typename?: 'SampleType' }
      & Pick<Types.SampleType, 'uid' | 'createdByUid' | 'createdAt' | 'sampleId' | 'priority' | 'status' | 'storageSlot' | 'storageContainerUid'>
      & { createdBy?: Types.Maybe<(
        { __typename?: 'UserType' }
        & Pick<Types.UserType, 'firstName' | 'lastName' | 'userName'>
      )>, sampleType?: Types.Maybe<(
        { __typename?: 'SampleTypeTyp' }
        & Pick<Types.SampleTypeTyp, 'uid' | 'name'>
      )>, storageContainer?: Types.Maybe<(
        { __typename?: 'StorageContainerType' }
        & Pick<Types.StorageContainerType, 'uid' | 'name'>
        & { storageSection?: Types.Maybe<(
          { __typename?: 'StorageSectionType' }
          & Pick<Types.StorageSectionType, 'uid' | 'name'>
          & { storageLocation?: Types.Maybe<(
            { __typename?: 'StorageLocationType' }
            & Pick<Types.StorageLocationType, 'uid' | 'name'>
            & { storeRoom?: Types.Maybe<(
              { __typename?: 'StoreRoomType' }
              & Pick<Types.StoreRoomType, 'uid' | 'name'>
            )> }
          )> }
        )> }
      )>, analyses?: Types.Maybe<Array<(
        { __typename?: 'AnalysisType' }
        & Pick<Types.AnalysisType, 'uid' | 'name' | 'sortKey'>
      )>>, rejectionReasons?: Types.Maybe<Array<(
        { __typename?: 'RejectionReasonType' }
        & Pick<Types.RejectionReasonType, 'uid' | 'reason'>
      )>>, profiles: Array<(
        { __typename?: 'ProfileType' }
        & Pick<Types.ProfileType, 'uid' | 'name'>
      )> }
    )>> }
  )> }
);

export type GetAnalysesRequestsByClientUidQueryVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type GetAnalysesRequestsByClientUidQuery = (
  { __typename?: 'Query' }
  & { analysisRequestsByClientUid: Array<(
    { __typename?: 'AnalysisRequestWithSamples' }
    & Pick<Types.AnalysisRequestWithSamples, 'uid' | 'clientRequestId' | 'createdAt'>
    & { patient: (
      { __typename?: 'PatientType' }
      & Pick<Types.PatientType, 'uid' | 'firstName' | 'lastName' | 'clientPatientId' | 'gender' | 'dateOfBirth' | 'age' | 'ageDobEstimated' | 'consentSms'>
    ), client?: Types.Maybe<(
      { __typename?: 'ClientType' }
      & Pick<Types.ClientType, 'uid' | 'name'>
    )>, samples?: Types.Maybe<Array<(
      { __typename?: 'SampleType' }
      & Pick<Types.SampleType, 'uid' | 'createdByUid' | 'createdAt' | 'sampleId' | 'priority' | 'status' | 'storageSlot' | 'storageContainerUid'>
      & { createdBy?: Types.Maybe<(
        { __typename?: 'UserType' }
        & Pick<Types.UserType, 'firstName' | 'lastName' | 'userName'>
      )>, sampleType?: Types.Maybe<(
        { __typename?: 'SampleTypeTyp' }
        & Pick<Types.SampleTypeTyp, 'uid' | 'name'>
      )>, storageContainer?: Types.Maybe<(
        { __typename?: 'StorageContainerType' }
        & Pick<Types.StorageContainerType, 'uid' | 'name'>
        & { storageSection?: Types.Maybe<(
          { __typename?: 'StorageSectionType' }
          & Pick<Types.StorageSectionType, 'uid' | 'name'>
          & { storageLocation?: Types.Maybe<(
            { __typename?: 'StorageLocationType' }
            & Pick<Types.StorageLocationType, 'uid' | 'name'>
            & { storeRoom?: Types.Maybe<(
              { __typename?: 'StoreRoomType' }
              & Pick<Types.StoreRoomType, 'uid' | 'name'>
            )> }
          )> }
        )> }
      )>, rejectionReasons?: Types.Maybe<Array<(
        { __typename?: 'RejectionReasonType' }
        & Pick<Types.RejectionReasonType, 'uid' | 'reason'>
      )>>, analyses?: Types.Maybe<Array<(
        { __typename?: 'AnalysisType' }
        & Pick<Types.AnalysisType, 'uid' | 'name' | 'sortKey'>
      )>>, profiles: Array<(
        { __typename?: 'ProfileType' }
        & Pick<Types.ProfileType, 'uid' | 'name'>
      )> }
    )>> }
  )> }
);

export type GetAnalysesResultsBySampleUidQueryVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type GetAnalysesResultsBySampleUidQuery = (
  { __typename?: 'Query' }
  & { analysisResultBySampleUid: Array<(
    { __typename?: 'AnalysisResultType' }
    & Pick<Types.AnalysisResultType, 'uid' | 'status' | 'sampleUid' | 'result' | 'analysisUid' | 'retest' | 'reportable' | 'dateSubmitted' | 'dueDate' | 'dateVerified' | 'createdAt' | 'createdByUid' | 'updatedAt' | 'updatedByUid' | 'worksheetUid' | 'worksheetId'>
    & { method?: Types.Maybe<(
      { __typename?: 'MethodType' }
      & Pick<Types.MethodType, 'uid' | 'name'>
    )>, laboratoryInstrument?: Types.Maybe<(
      { __typename?: 'LaboratoryInstrumentType' }
      & Pick<Types.LaboratoryInstrumentType, 'uid' | 'labName'>
      & { instrument?: Types.Maybe<(
        { __typename?: 'InstrumentType' }
        & Pick<Types.InstrumentType, 'uid' | 'name'>
      )> }
    )>, sample: (
      { __typename?: 'SampleType' }
      & Pick<Types.SampleType, 'uid' | 'sampleId' | 'status'>
      & { rejectionReasons?: Types.Maybe<Array<(
        { __typename?: 'RejectionReasonType' }
        & Pick<Types.RejectionReasonType, 'uid' | 'reason'>
      )>> }
    ), analysis?: Types.Maybe<(
      { __typename?: 'AnalysisType' }
      & Pick<Types.AnalysisType, 'uid' | 'name' | 'unitUid' | 'sortKey'>
      & { unit?: Types.Maybe<(
        { __typename?: 'UnitType' }
        & Pick<Types.UnitType, 'uid' | 'name'>
      )>, interims?: Types.Maybe<Array<(
        { __typename?: 'AnalysisInterimType' }
        & Pick<Types.AnalysisInterimType, 'uid' | 'key' | 'value' | 'analysisUid' | 'instrumentUid'>
      )>>, resultOptions?: Types.Maybe<Array<(
        { __typename?: 'ResultOptionType' }
        & Pick<Types.ResultOptionType, 'uid' | 'optionKey' | 'value'>
        & { sampleTypes?: Types.Maybe<Array<(
          { __typename?: 'SampleTypeTyp' }
          & Pick<Types.SampleTypeTyp, 'uid' | 'name'>
        )>> }
      )>>, instruments?: Types.Maybe<Array<(
        { __typename?: 'InstrumentType' }
        & Pick<Types.InstrumentType, 'uid' | 'name'>
        & { laboratoryInstruments?: Types.Maybe<Array<(
          { __typename?: 'LaboratoryInstrumentType' }
          & Pick<Types.LaboratoryInstrumentType, 'uid' | 'labName' | 'serialNumber'>
        )>> }
      )>>, methods?: Types.Maybe<Array<(
        { __typename?: 'MethodType' }
        & Pick<Types.MethodType, 'uid' | 'name'>
      )>> }
    )>, submittedBy?: Types.Maybe<(
      { __typename?: 'UserType' }
      & Pick<Types.UserType, 'uid' | 'firstName' | 'lastName' | 'userName'>
    )>, verifiedBy?: Types.Maybe<Array<(
      { __typename?: 'UserType' }
      & Pick<Types.UserType, 'uid' | 'firstName' | 'lastName' | 'userName'>
    )>> }
  )> }
);

export type GetAnalysesResultsForWsAssignQueryVariables = Types.Exact<{
  first: Types.Scalars['Int']['input'];
  after?: Types.InputMaybe<Types.Scalars['String']['input']>;
  text: Types.Scalars['String']['input'];
  sortBy?: Types.InputMaybe<Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input']>;
  analysisUid: Types.Scalars['String']['input'];
  sampleTypeUid: Types.Scalars['String']['input'];
}>;


export type GetAnalysesResultsForWsAssignQuery = (
  { __typename?: 'Query' }
  & { analysisResultsForWsAssign: (
    { __typename?: 'AnalysisResultCursorPage' }
    & Pick<Types.AnalysisResultCursorPage, 'totalCount'>
    & { pageInfo: (
      { __typename?: 'PageInfo' }
      & Pick<Types.PageInfo, 'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'>
    ), items?: Types.Maybe<Array<(
      { __typename?: 'AnalysisResultType' }
      & Pick<Types.AnalysisResultType, 'uid' | 'assigned' | 'sampleUid' | 'status' | 'analysisUid'>
      & { sample: (
        { __typename?: 'SampleType' }
        & Pick<Types.SampleType, 'sampleId' | 'priority' | 'status' | 'dateReceived' | 'createdAt'>
        & { sampleType?: Types.Maybe<(
          { __typename?: 'SampleTypeTyp' }
          & Pick<Types.SampleTypeTyp, 'name'>
        )> }
      ), analysis?: Types.Maybe<(
        { __typename?: 'AnalysisType' }
        & Pick<Types.AnalysisType, 'name'>
      )> }
    )>> }
  ) }
);

export type GetAnalysisResultMutationQueryVariables = Types.Exact<{
  resultUid: Types.Scalars['String']['input'];
}>;


export type GetAnalysisResultMutationQuery = (
  { __typename?: 'Query' }
  & { resultMutationByResultUid?: Types.Maybe<(
    { __typename?: 'ResultMutationType' }
    & Pick<Types.ResultMutationType, 'uid' | 'resultUid' | 'before' | 'after' | 'mutation' | 'date' | 'createdByUid'>
    & { createdBy?: Types.Maybe<(
      { __typename?: 'UserType' }
      & Pick<Types.UserType, 'uid' | 'firstName' | 'lastName' | 'userName'>
    )> }
  )> }
);

export type GetSampleByUidQueryVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type GetSampleByUidQuery = (
  { __typename?: 'Query' }
  & { sampleByUid: (
    { __typename?: 'SampleType' }
    & Pick<Types.SampleType, 'uid' | 'createdByUid' | 'createdAt' | 'dateReceived' | 'receivedByUid' | 'dateCollected' | 'dateSubmitted' | 'submittedByUid' | 'dateVerified' | 'verifiedByUid' | 'datePublished' | 'datePrinted' | 'printedByUid' | 'dateInvalidated' | 'invalidatedByUid' | 'dateCancelled' | 'cancelledByUid' | 'dueDate' | 'sampleId' | 'priority' | 'status' | 'dateStored' | 'storageSlot' | 'storageContainerUid'>
    & { createdBy?: Types.Maybe<(
      { __typename?: 'UserType' }
      & Pick<Types.UserType, 'firstName' | 'lastName' | 'userName'>
    )>, analysisRequest?: Types.Maybe<(
      { __typename?: 'AnalysisRequestType' }
      & Pick<Types.AnalysisRequestType, 'uid' | 'clientRequestId'>
      & { patient: (
        { __typename?: 'PatientType' }
        & Pick<Types.PatientType, 'uid' | 'firstName' | 'lastName' | 'clientPatientId' | 'gender' | 'dateOfBirth' | 'age' | 'ageDobEstimated' | 'consentSms'>
      ), client?: Types.Maybe<(
        { __typename?: 'ClientType' }
        & Pick<Types.ClientType, 'uid' | 'name'>
      )> }
    )>, sampleType?: Types.Maybe<(
      { __typename?: 'SampleTypeTyp' }
      & Pick<Types.SampleTypeTyp, 'uid' | 'name'>
    )>, storageContainer?: Types.Maybe<(
      { __typename?: 'StorageContainerType' }
      & Pick<Types.StorageContainerType, 'uid' | 'name'>
      & { storageSection?: Types.Maybe<(
        { __typename?: 'StorageSectionType' }
        & Pick<Types.StorageSectionType, 'uid' | 'name'>
        & { storageLocation?: Types.Maybe<(
          { __typename?: 'StorageLocationType' }
          & Pick<Types.StorageLocationType, 'uid' | 'name'>
          & { storeRoom?: Types.Maybe<(
            { __typename?: 'StoreRoomType' }
            & Pick<Types.StoreRoomType, 'uid' | 'name'>
          )> }
        )> }
      )> }
    )>, analyses?: Types.Maybe<Array<(
      { __typename?: 'AnalysisType' }
      & Pick<Types.AnalysisType, 'uid' | 'name'>
    )>>, profiles: Array<(
      { __typename?: 'ProfileType' }
      & Pick<Types.ProfileType, 'uid' | 'name'>
    )>, rejectionReasons?: Types.Maybe<Array<(
      { __typename?: 'RejectionReasonType' }
      & Pick<Types.RejectionReasonType, 'uid' | 'reason'>
    )>> }
  ) }
);

export type GetSampleParentIdQueryVariables = Types.Exact<{
  parentId: Types.Scalars['String']['input'];
  text?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type GetSampleParentIdQuery = (
  { __typename?: 'Query' }
  & { sampleByParentId: Array<(
    { __typename?: 'SampleType' }
    & Pick<Types.SampleType, 'uid' | 'sampleId' | 'status'>
  )> }
);

export type GetSamplesByStorageContainerUidQueryVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type GetSamplesByStorageContainerUidQuery = (
  { __typename?: 'Query' }
  & { samplesByStorageContainerUid: Array<(
    { __typename?: 'SampleType' }
    & Pick<Types.SampleType, 'uid' | 'sampleId' | 'storageSlot' | 'storageSlotIndex' | 'storageContainerUid' | 'status'>
    & { analysisRequest?: Types.Maybe<(
      { __typename?: 'AnalysisRequestType' }
      & Pick<Types.AnalysisRequestType, 'clientRequestId'>
    )> }
  )> }
);

export type GetAllQcLevelsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAllQcLevelsQuery = (
  { __typename?: 'Query' }
  & { qcLevelAll: Array<(
    { __typename?: 'QCLevelType' }
    & Pick<Types.QcLevelType, 'uid' | 'level'>
  )> }
);

export type GetAllQcTemplatesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAllQcTemplatesQuery = (
  { __typename?: 'Query' }
  & { qcTemplateAll: Array<(
    { __typename?: 'QCTemplateType' }
    & Pick<Types.QcTemplateType, 'uid' | 'name' | 'description'>
    & { qcLevels: Array<(
      { __typename?: 'QCLevelType' }
      & Pick<Types.QcLevelType, 'uid' | 'level'>
    )>, departments: Array<(
      { __typename?: 'DepartmentType' }
      & Pick<Types.DepartmentType, 'uid' | 'name'>
    )> }
  )> }
);

export type GetQcSeTsQueryVariables = Types.Exact<{
  first: Types.Scalars['Int']['input'];
  after?: Types.InputMaybe<Types.Scalars['String']['input']>;
  status: Types.Scalars['String']['input'];
  sortBy?: Types.InputMaybe<Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input']>;
}>;


export type GetQcSeTsQuery = (
  { __typename?: 'Query' }
  & { qcSetAll: (
    { __typename?: 'QCSetCursorPage' }
    & Pick<Types.QcSetCursorPage, 'totalCount'>
    & { pageInfo: (
      { __typename?: 'PageInfo' }
      & Pick<Types.PageInfo, 'hasNextPage' | 'hasPreviousPage' | 'endCursor' | 'startCursor'>
    ), items?: Types.Maybe<Array<(
      { __typename?: 'QCSetWithSamples' }
      & Pick<Types.QcSetWithSamples, 'uid' | 'name' | 'note' | 'status' | 'createdAt'>
      & { samples?: Types.Maybe<Array<(
        { __typename?: 'SamplesWithResults' }
        & Pick<Types.SamplesWithResults, 'uid' | 'sampleId' | 'status' | 'createdByUid' | 'createdAt' | 'updatedAt' | 'assigned'>
        & { createdBy?: Types.Maybe<(
          { __typename?: 'UserType' }
          & Pick<Types.UserType, 'firstName' | 'lastName' | 'userName'>
        )>, qcLevel?: Types.Maybe<(
          { __typename?: 'QCLevelType' }
          & Pick<Types.QcLevelType, 'uid' | 'level'>
        )>, analysisResults?: Types.Maybe<Array<(
          { __typename?: 'AnalysisResultType' }
          & Pick<Types.AnalysisResultType, 'uid' | 'status' | 'sampleUid' | 'result' | 'analysisUid' | 'retest' | 'reportable'>
          & { analysis?: Types.Maybe<(
            { __typename?: 'AnalysisType' }
            & Pick<Types.AnalysisType, 'uid' | 'name' | 'sortKey'>
            & { resultOptions?: Types.Maybe<Array<(
              { __typename?: 'ResultOptionType' }
              & Pick<Types.ResultOptionType, 'uid' | 'optionKey' | 'value'>
              & { sampleTypes?: Types.Maybe<Array<(
                { __typename?: 'SampleTypeTyp' }
                & Pick<Types.SampleTypeTyp, 'uid' | 'name'>
              )>> }
            )>> }
          )>, method?: Types.Maybe<(
            { __typename?: 'MethodType' }
            & Pick<Types.MethodType, 'uid' | 'name'>
          )>, laboratoryInstrument?: Types.Maybe<(
            { __typename?: 'LaboratoryInstrumentType' }
            & Pick<Types.LaboratoryInstrumentType, 'uid' | 'labName'>
            & { instrument?: Types.Maybe<(
              { __typename?: 'InstrumentType' }
              & Pick<Types.InstrumentType, 'uid' | 'name'>
            )> }
          )> }
        )>>, analyses?: Types.Maybe<Array<(
          { __typename?: 'AnalysisType' }
          & Pick<Types.AnalysisType, 'uid' | 'name' | 'unitUid'>
          & { unit?: Types.Maybe<(
            { __typename?: 'UnitType' }
            & Pick<Types.UnitType, 'uid' | 'name'>
          )>, resultOptions?: Types.Maybe<Array<(
            { __typename?: 'ResultOptionType' }
            & Pick<Types.ResultOptionType, 'uid' | 'optionKey' | 'value'>
            & { sampleTypes?: Types.Maybe<Array<(
              { __typename?: 'SampleTypeTyp' }
              & Pick<Types.SampleTypeTyp, 'uid' | 'name'>
            )>> }
          )>> }
        )>>, profiles: Array<(
          { __typename?: 'ProfileType' }
          & Pick<Types.ProfileType, 'uid' | 'name'>
        )> }
      )>> }
    )>> }
  ) }
);

export type GetQcSetByUidQueryVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type GetQcSetByUidQuery = (
  { __typename?: 'Query' }
  & { qcSetByUid: (
    { __typename?: 'QCSetWithSamples' }
    & Pick<Types.QcSetWithSamples, 'uid' | 'name' | 'note' | 'createdAt'>
    & { samples?: Types.Maybe<Array<(
      { __typename?: 'SamplesWithResults' }
      & Pick<Types.SamplesWithResults, 'uid' | 'sampleId' | 'status' | 'createdAt' | 'updatedAt' | 'assigned'>
      & { qcLevel?: Types.Maybe<(
        { __typename?: 'QCLevelType' }
        & Pick<Types.QcLevelType, 'uid' | 'level'>
      )>, analysisResults?: Types.Maybe<Array<(
        { __typename?: 'AnalysisResultType' }
        & Pick<Types.AnalysisResultType, 'uid' | 'status' | 'sampleUid' | 'result' | 'analysisUid' | 'retest' | 'reportable' | 'dateSubmitted' | 'dateVerified'>
        & { analysis?: Types.Maybe<(
          { __typename?: 'AnalysisType' }
          & Pick<Types.AnalysisType, 'uid' | 'name' | 'sortKey'>
          & { interims?: Types.Maybe<Array<(
            { __typename?: 'AnalysisInterimType' }
            & Pick<Types.AnalysisInterimType, 'uid' | 'key' | 'value'>
          )>>, resultOptions?: Types.Maybe<Array<(
            { __typename?: 'ResultOptionType' }
            & Pick<Types.ResultOptionType, 'uid' | 'optionKey' | 'value'>
            & { sampleTypes?: Types.Maybe<Array<(
              { __typename?: 'SampleTypeTyp' }
              & Pick<Types.SampleTypeTyp, 'uid' | 'name'>
            )>> }
          )>>, instruments?: Types.Maybe<Array<(
            { __typename?: 'InstrumentType' }
            & Pick<Types.InstrumentType, 'uid' | 'name'>
            & { laboratoryInstruments?: Types.Maybe<Array<(
              { __typename?: 'LaboratoryInstrumentType' }
              & Pick<Types.LaboratoryInstrumentType, 'uid' | 'labName' | 'serialNumber'>
            )>> }
          )>>, methods?: Types.Maybe<Array<(
            { __typename?: 'MethodType' }
            & Pick<Types.MethodType, 'uid' | 'name'>
          )>> }
        )>, laboratoryInstrument?: Types.Maybe<(
          { __typename?: 'LaboratoryInstrumentType' }
          & Pick<Types.LaboratoryInstrumentType, 'uid' | 'labName'>
          & { instrument?: Types.Maybe<(
            { __typename?: 'InstrumentType' }
            & Pick<Types.InstrumentType, 'uid' | 'name'>
          )> }
        )>, method?: Types.Maybe<(
          { __typename?: 'MethodType' }
          & Pick<Types.MethodType, 'uid' | 'name'>
        )>, submittedBy?: Types.Maybe<(
          { __typename?: 'UserType' }
          & Pick<Types.UserType, 'uid' | 'userName' | 'firstName' | 'lastName'>
        )>, verifiedBy?: Types.Maybe<Array<(
          { __typename?: 'UserType' }
          & Pick<Types.UserType, 'uid' | 'userName' | 'firstName' | 'lastName'>
        )>> }
      )>> }
    )>> }
  ) }
);

export type GetReferenceRunsQueryVariables = Types.Exact<{
  analyses: Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input'];
  month: Types.Scalars['Int']['input'];
  year: Types.Scalars['Int']['input'];
}>;


export type GetReferenceRunsQuery = (
  { __typename?: 'Query' }
  & { qcChartData: Array<(
    { __typename?: 'AnalysisResultType' }
    & Pick<Types.AnalysisResultType, 'result' | 'dateVerified'>
    & { analysis?: Types.Maybe<(
      { __typename?: 'AnalysisType' }
      & Pick<Types.AnalysisType, 'uid' | 'name'>
    )>, sample: (
      { __typename?: 'SampleType' }
      & { qcLevel?: Types.Maybe<(
        { __typename?: 'QCLevelType' }
        & Pick<Types.QcLevelType, 'level'>
      )> }
    ) }
  )> }
);

export type ResultOptionsByAnalysisUidQueryVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type ResultOptionsByAnalysisUidQuery = (
  { __typename?: 'Query' }
  & { resultOptionsByAnalysisUid: Array<(
    { __typename?: 'ResultOptionType' }
    & Pick<Types.ResultOptionType, 'uid' | 'optionKey' | 'value' | 'analysisUid'>
    & { sampleTypes?: Types.Maybe<Array<(
      { __typename?: 'SampleTypeTyp' }
      & Pick<Types.SampleTypeTyp, 'uid' | 'name'>
    )>> }
  )> }
);

export type GetAllRejectionReasonsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAllRejectionReasonsQuery = (
  { __typename?: 'Query' }
  & { rejectionReasonsAll: Array<(
    { __typename?: 'RejectionReasonType' }
    & Pick<Types.RejectionReasonType, 'uid' | 'reason'>
  )> }
);

export type ImpressSamplesMetaQueryVariables = Types.Exact<{
  uids: Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input'];
}>;


export type ImpressSamplesMetaQuery = (
  { __typename?: 'Query' }
  & { impressReportsMeta: Array<(
    { __typename?: 'ReportImpressType' }
    & Pick<Types.ReportImpressType, 'uid' | 'state' | 'sampleUid' | 'jsonContent' | 'emailRequired' | 'emailSent' | 'smsRequired' | 'smsSent' | 'generatedByUid' | 'createdAt'>
    & { sample?: Types.Maybe<(
      { __typename?: 'SampleType' }
      & Pick<Types.SampleType, 'sampleId'>
    )>, generatedBy?: Types.Maybe<(
      { __typename?: 'UserType' }
      & Pick<Types.UserType, 'firstName' | 'lastName'>
    )> }
  )> }
);

export type ImpressSampleReportsQueryVariables = Types.Exact<{
  sampleIds: Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input'];
}>;


export type ImpressSampleReportsQuery = (
  { __typename?: 'Query' }
  & Pick<Types.Query, 'impressReportsDownload'>
);

export type ImpressSampleReportQueryVariables = Types.Exact<{
  impressUid: Types.Scalars['String']['input'];
}>;


export type ImpressSampleReportQuery = (
  { __typename?: 'Query' }
  & Pick<Types.Query, 'impressReportDownload'>
);

export type BarcodeSamplesQueryVariables = Types.Exact<{
  sampleUids: Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input'];
}>;


export type BarcodeSamplesQuery = (
  { __typename?: 'Query' }
  & Pick<Types.Query, 'barcodeSamples'>
);


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
          description
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
        sampleTypes {
          uid
          name
        }
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
export const GetAnalysesServicesByUidDocument = gql`
    query getAnalysesServicesByUid($uid: String!) {
  analysisByUid(uid: $uid) {
    uid
    name
    keyword
    description
    unit {
      uid
      name
    }
    category {
      uid
      name
    }
  }
}
    `;

export function useGetAnalysesServicesByUidQuery(options: Omit<Urql.UseQueryArgs<never, GetAnalysesServicesByUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAnalysesServicesByUidQuery>({ query: GetAnalysesServicesByUidDocument, ...options });
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
export const GetAllAnalysesTemplatesDocument = gql`
    query getAllAnalysesTemplates {
  analysisTemplateAll {
    uid
    name
    description
    departmentUid
    analyses {
      uid
    }
  }
}
    `;

export function useGetAllAnalysesTemplatesQuery(options: Omit<Urql.UseQueryArgs<never, GetAllAnalysesTemplatesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllAnalysesTemplatesQuery>({ query: GetAllAnalysesTemplatesDocument, ...options });
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
          description
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
        sampleTypes {
          uid
          name
        }
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
        userName
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
    requestId
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
        userName
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
        userName
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
    laboratoryInstrument {
      uid
      labName
      instrument {
        uid
        name
      }
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
        sampleTypes {
          uid
          name
        }
      }
      instruments {
        uid
        name
        laboratoryInstruments {
          uid
          labName
          serialNumber
        }
      }
      methods {
        uid
        name
      }
    }
    retest
    reportable
    submittedBy {
      uid
      firstName
      lastName
      userName
    }
    dateSubmitted
    dueDate
    verifiedBy {
      uid
      firstName
      lastName
      userName
    }
    dateVerified
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
export const GetAnalysisResultMutationDocument = gql`
    query getAnalysisResultMutation($resultUid: String!) {
  resultMutationByResultUid(resultUid: $resultUid) {
    uid
    resultUid
    before
    after
    mutation
    date
    createdBy {
      uid
      firstName
      lastName
      userName
    }
    createdByUid
  }
}
    `;

export function useGetAnalysisResultMutationQuery(options: Omit<Urql.UseQueryArgs<never, GetAnalysisResultMutationQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAnalysisResultMutationQuery>({ query: GetAnalysisResultMutationDocument, ...options });
};
export const GetSampleByUidDocument = gql`
    query getSampleByUid($uid: String!) {
  sampleByUid(uid: $uid) {
    uid
    createdByUid
    createdBy {
      firstName
      lastName
      userName
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
    query getQCSeTs($first: Int!, $after: String, $status: String!, $sortBy: [String!] = ["uid"]) {
  qcSetAll(
    pageSize: $first
    afterCursor: $after
    status: $status
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
      name
      note
      status
      createdAt
      samples {
        uid
        sampleId
        status
        createdByUid
        createdBy {
          firstName
          lastName
          userName
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
              sampleTypes {
                uid
                name
              }
            }
          }
          method {
            uid
            name
          }
          laboratoryInstrument {
            uid
            labName
            instrument {
              uid
              name
            }
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
            sampleTypes {
              uid
              name
            }
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
          interims {
            uid
            key
            value
          }
          resultOptions {
            uid
            optionKey
            value
            sampleTypes {
              uid
              name
            }
          }
          instruments {
            uid
            name
            laboratoryInstruments {
              uid
              labName
              serialNumber
            }
          }
          methods {
            uid
            name
          }
        }
        laboratoryInstrument {
          uid
          labName
          instrument {
            uid
            name
          }
        }
        method {
          uid
          name
        }
        submittedBy {
          uid
          userName
          firstName
          lastName
        }
        dateSubmitted
        verifiedBy {
          uid
          userName
          firstName
          lastName
        }
        dateVerified
      }
    }
  }
}
    `;

export function useGetQcSetByUidQuery(options: Omit<Urql.UseQueryArgs<never, GetQcSetByUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetQcSetByUidQuery>({ query: GetQcSetByUidDocument, ...options });
};
export const GetReferenceRunsDocument = gql`
    query GetReferenceRuns($analyses: [String!]!, $month: Int!, $year: Int!) {
  qcChartData(analyses: $analyses, month: $month, year: $year) {
    result
    dateVerified
    analysis {
      uid
      name
    }
    sample {
      qcLevel {
        level
      }
    }
  }
}
    `;

export function useGetReferenceRunsQuery(options: Omit<Urql.UseQueryArgs<never, GetReferenceRunsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetReferenceRunsQuery>({ query: GetReferenceRunsDocument, ...options });
};
export const ResultOptionsByAnalysisUidDocument = gql`
    query resultOptionsByAnalysisUid($uid: String!) {
  resultOptionsByAnalysisUid(uid: $uid) {
    uid
    optionKey
    value
    analysisUid
    sampleTypes {
      uid
      name
    }
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
export const ImpressSamplesMetaDocument = gql`
    query ImpressSamplesMeta($uids: [String!]!) {
  impressReportsMeta(uids: $uids) {
    uid
    state
    sampleUid
    sample {
      sampleId
    }
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
    createdAt
  }
}
    `;

export function useImpressSamplesMetaQuery(options: Omit<Urql.UseQueryArgs<never, ImpressSamplesMetaQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<ImpressSamplesMetaQuery>({ query: ImpressSamplesMetaDocument, ...options });
};
export const ImpressSampleReportsDocument = gql`
    query impressSampleReports($sampleIds: [String!]!) {
  impressReportsDownload(sampleIds: $sampleIds)
}
    `;

export function useImpressSampleReportsQuery(options: Omit<Urql.UseQueryArgs<never, ImpressSampleReportsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<ImpressSampleReportsQuery>({ query: ImpressSampleReportsDocument, ...options });
};
export const ImpressSampleReportDocument = gql`
    query impressSampleReport($impressUid: String!) {
  impressReportDownload(uid: $impressUid)
}
    `;

export function useImpressSampleReportQuery(options: Omit<Urql.UseQueryArgs<never, ImpressSampleReportQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<ImpressSampleReportQuery>({ query: ImpressSampleReportDocument, ...options });
};
export const BarcodeSamplesDocument = gql`
    query barcodeSamples($sampleUids: [String!]!) {
  barcodeSamples(sampleUids: $sampleUids)
}
    `;

export function useBarcodeSamplesQuery(options: Omit<Urql.UseQueryArgs<never, BarcodeSamplesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<BarcodeSamplesQuery>({ query: BarcodeSamplesDocument, ...options });
};