import type * as Types from '../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type AddCodingStandardMutationVariables = Types.Exact<{
  payload: Types.CodingStandardInputType;
}>;


export type AddCodingStandardMutation = (
  { __typename?: 'Mutation' }
  & { createCodingStandard: (
    { __typename: 'CodingStandardType' }
    & Pick<Types.CodingStandardType, 'uid' | 'name' | 'description'>
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type EditCodingStandardMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.CodingStandardInputType;
}>;


export type EditCodingStandardMutation = (
  { __typename?: 'Mutation' }
  & { updateCodingStandard: (
    { __typename: 'CodingStandardType' }
    & Pick<Types.CodingStandardType, 'uid' | 'name' | 'description'>
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type AddSampleTypeMutationVariables = Types.Exact<{
  payload: Types.SampleTypeInputType;
}>;


export type AddSampleTypeMutation = (
  { __typename?: 'Mutation' }
  & { createSampleType: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'SampleTypeTyp' }
    & Pick<Types.SampleTypeTyp, 'uid' | 'name' | 'abbr' | 'description' | 'active'>
  ) }
);

export type EditSampleTypeMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.SampleTypeInputType;
}>;


export type EditSampleTypeMutation = (
  { __typename?: 'Mutation' }
  & { updateSampleType: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'SampleTypeTyp' }
    & Pick<Types.SampleTypeTyp, 'uid' | 'name' | 'abbr' | 'description' | 'active'>
  ) }
);

export type AddSampleTypeMappingMutationVariables = Types.Exact<{
  payload: Types.SampleTypeMappingInputType;
}>;


export type AddSampleTypeMappingMutation = (
  { __typename?: 'Mutation' }
  & { createSampleTypeMapping: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename?: 'SampleTypeMappingType' }
    & Pick<Types.SampleTypeMappingType, 'uid' | 'name' | 'description' | 'code' | 'codingStandardUid' | 'sampleTypeUid'>
    & { codingStandard?: Types.Maybe<(
      { __typename?: 'CodingStandardType' }
      & Pick<Types.CodingStandardType, 'name'>
    )> }
  ) }
);

export type EditSampleTypeMappingMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.SampleTypeMappingInputType;
}>;


export type EditSampleTypeMappingMutation = (
  { __typename?: 'Mutation' }
  & { updateSampleTypeMapping: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename?: 'SampleTypeMappingType' }
    & Pick<Types.SampleTypeMappingType, 'uid' | 'name' | 'description' | 'code' | 'codingStandardUid' | 'sampleTypeUid'>
    & { codingStandard?: Types.Maybe<(
      { __typename?: 'CodingStandardType' }
      & Pick<Types.CodingStandardType, 'name'>
    )> }
  ) }
);

export type ReInstateSamplesMutationVariables = Types.Exact<{
  samples: Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input'];
}>;


export type ReInstateSamplesMutation = (
  { __typename?: 'Mutation' }
  & { reInstateSamples: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'ResultedSampleListingType' }
    & { samples: Array<(
      { __typename?: 'SamplesWithResults' }
      & Pick<Types.SamplesWithResults, 'uid' | 'status'>
    )> }
  ) }
);

export type CloneSamplesMutationVariables = Types.Exact<{
  samples: Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input'];
}>;


export type CloneSamplesMutation = (
  { __typename?: 'Mutation' }
  & { cloneSamples: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'SampleListingType' }
    & { samples: Array<(
      { __typename?: 'SampleType' }
      & Pick<Types.SampleType, 'uid' | 'parentId' | 'sampleId' | 'priority' | 'status'>
      & { sampleType?: Types.Maybe<(
        { __typename?: 'SampleTypeTyp' }
        & Pick<Types.SampleTypeTyp, 'uid' | 'name'>
      )>, analyses?: Types.Maybe<Array<(
        { __typename?: 'AnalysisType' }
        & Pick<Types.AnalysisType, 'uid' | 'name' | 'sortKey'>
      )>>, profiles: Array<(
        { __typename?: 'ProfileType' }
        & Pick<Types.ProfileType, 'uid' | 'name'>
      )> }
    )> }
  ) }
);

export type CancelSamplesMutationVariables = Types.Exact<{
  samples: Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input'];
}>;


export type CancelSamplesMutation = (
  { __typename?: 'Mutation' }
  & { cancelSamples: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'ResultedSampleListingType' }
    & { samples: Array<(
      { __typename?: 'SamplesWithResults' }
      & Pick<Types.SamplesWithResults, 'uid' | 'status'>
    )> }
  ) }
);

export type ReceiveSamplesMutationVariables = Types.Exact<{
  samples: Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input'];
}>;


export type ReceiveSamplesMutation = (
  { __typename?: 'Mutation' }
  & { receiveSamples: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'ResultedSampleListingType' }
    & { samples: Array<(
      { __typename?: 'SamplesWithResults' }
      & Pick<Types.SamplesWithResults, 'uid' | 'status'>
    )> }
  ) }
);

export type PublishSamplesMutationVariables = Types.Exact<{
  samples: Array<Types.SamplePublishInputType> | Types.SamplePublishInputType;
}>;


export type PublishSamplesMutation = (
  { __typename?: 'Mutation' }
  & { publishSamples: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'OperationSuccess' }
    & Pick<Types.OperationSuccess, 'message'>
  ) }
);

export type PrintSamplesMutationVariables = Types.Exact<{
  samples: Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input'];
}>;


export type PrintSamplesMutation = (
  { __typename?: 'Mutation' }
  & { printSamples: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'SampleListingType' }
    & { samples: Array<(
      { __typename?: 'SampleType' }
      & Pick<Types.SampleType, 'uid' | 'status'>
    )> }
  ) }
);

export type InvalidateSamplesMutationVariables = Types.Exact<{
  samples: Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input'];
}>;


export type InvalidateSamplesMutation = (
  { __typename?: 'Mutation' }
  & { invalidateSamples: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'SampleListingType' }
    & { samples: Array<(
      { __typename?: 'SampleType' }
      & Pick<Types.SampleType, 'uid' | 'status'>
    )> }
  ) }
);

export type VerifySamplesMutationVariables = Types.Exact<{
  samples: Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input'];
}>;


export type VerifySamplesMutation = (
  { __typename?: 'Mutation' }
  & { verifySamples: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'SampleListingType' }
    & { samples: Array<(
      { __typename?: 'SampleType' }
      & Pick<Types.SampleType, 'uid' | 'status'>
    )> }
  ) }
);

export type RejectSamplesMutationVariables = Types.Exact<{
  samples: Array<Types.SampleRejectInputType> | Types.SampleRejectInputType;
}>;


export type RejectSamplesMutation = (
  { __typename?: 'Mutation' }
  & { rejectSamples: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'SampleListingType' }
    & { samples: Array<(
      { __typename?: 'SampleType' }
      & Pick<Types.SampleType, 'uid' | 'status'>
      & { rejectionReasons?: Types.Maybe<Array<(
        { __typename?: 'RejectionReasonType' }
        & Pick<Types.RejectionReasonType, 'uid' | 'reason'>
      )>> }
    )> }
  ) }
);

export type AddResultOptionMutationVariables = Types.Exact<{
  payload: Types.ResultOptionInputType;
}>;


export type AddResultOptionMutation = (
  { __typename?: 'Mutation' }
  & { createResultOption: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename?: 'ResultOptionType' }
    & Pick<Types.ResultOptionType, 'uid' | 'optionKey' | 'value' | 'analysisUid'>
    & { sampleTypes?: Types.Maybe<Array<(
      { __typename?: 'SampleTypeTyp' }
      & Pick<Types.SampleTypeTyp, 'uid' | 'name'>
    )>> }
  ) }
);

export type EditResultOptionMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.ResultOptionInputType;
}>;


export type EditResultOptionMutation = (
  { __typename?: 'Mutation' }
  & { updateResultOption: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename?: 'ResultOptionType' }
    & Pick<Types.ResultOptionType, 'uid' | 'optionKey' | 'value' | 'analysisUid'>
    & { sampleTypes?: Types.Maybe<Array<(
      { __typename?: 'SampleTypeTyp' }
      & Pick<Types.SampleTypeTyp, 'uid' | 'name'>
    )>> }
  ) }
);

export type AddAnalysisInterimMutationVariables = Types.Exact<{
  payload: Types.AnalysisInterimInput;
}>;


export type AddAnalysisInterimMutation = (
  { __typename?: 'Mutation' }
  & { createAnalysisInterim: (
    { __typename?: 'AnalysisInterimType' }
    & Pick<Types.AnalysisInterimType, 'uid' | 'key' | 'value' | 'analysisUid' | 'instrumentUid'>
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type EditAnalysisInterimMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.AnalysisInterimInput;
}>;


export type EditAnalysisInterimMutation = (
  { __typename?: 'Mutation' }
  & { updateAnalysisInterim: (
    { __typename?: 'AnalysisInterimType' }
    & Pick<Types.AnalysisInterimType, 'uid' | 'key' | 'value' | 'analysisUid' | 'instrumentUid'>
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type AddAnalysisCorrectionFactorMutationVariables = Types.Exact<{
  payload: Types.AnalysisCorrectionFactorInput;
}>;


export type AddAnalysisCorrectionFactorMutation = (
  { __typename?: 'Mutation' }
  & { createAnalysisCorrectionFactor: (
    { __typename?: 'AnalysisCorrectionFactorType' }
    & Pick<Types.AnalysisCorrectionFactorType, 'uid' | 'factor' | 'analysisUid' | 'instrumentUid' | 'methodUid'>
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type EditAnalysisCorrectionFactorMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.AnalysisCorrectionFactorInput;
}>;


export type EditAnalysisCorrectionFactorMutation = (
  { __typename?: 'Mutation' }
  & { updateAnalysisCorrectionFactor: (
    { __typename?: 'AnalysisCorrectionFactorType' }
    & Pick<Types.AnalysisCorrectionFactorType, 'uid' | 'factor' | 'analysisUid' | 'instrumentUid' | 'methodUid'>
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type AddAnalysisUncertaintyMutationVariables = Types.Exact<{
  payload: Types.AnalysisUncertaintyInput;
}>;


export type AddAnalysisUncertaintyMutation = (
  { __typename?: 'Mutation' }
  & { createAnalysisUncertainty: (
    { __typename?: 'AnalysisUncertaintyType' }
    & Pick<Types.AnalysisUncertaintyType, 'uid' | 'value' | 'min' | 'max' | 'analysisUid' | 'instrumentUid' | 'methodUid'>
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type EditAnalysisUncertaintyMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.AnalysisUncertaintyInput;
}>;


export type EditAnalysisUncertaintyMutation = (
  { __typename?: 'Mutation' }
  & { updateAnalysisUncertainty: (
    { __typename?: 'AnalysisUncertaintyType' }
    & Pick<Types.AnalysisUncertaintyType, 'uid' | 'value' | 'min' | 'max' | 'analysisUid' | 'instrumentUid' | 'methodUid'>
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type AddAnalysisDetectionLimitMutationVariables = Types.Exact<{
  payload: Types.AnalysisDetectionLimitInput;
}>;


export type AddAnalysisDetectionLimitMutation = (
  { __typename?: 'Mutation' }
  & { createAnalysisDetectionLimit: (
    { __typename?: 'AnalysisDetectionLimitType' }
    & Pick<Types.AnalysisDetectionLimitType, 'uid' | 'lowerLimit' | 'upperLimit' | 'analysisUid' | 'instrumentUid' | 'methodUid'>
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type EditAnalysisDetectionLimitMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.AnalysisDetectionLimitInput;
}>;


export type EditAnalysisDetectionLimitMutation = (
  { __typename?: 'Mutation' }
  & { updateAnalysisDetectionLimit: (
    { __typename?: 'AnalysisDetectionLimitType' }
    & Pick<Types.AnalysisDetectionLimitType, 'uid' | 'lowerLimit' | 'upperLimit' | 'analysisUid' | 'instrumentUid' | 'methodUid'>
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type AddAnalysisSpecificationMutationVariables = Types.Exact<{
  payload: Types.AnalysisSpecificationInput;
}>;


export type AddAnalysisSpecificationMutation = (
  { __typename?: 'Mutation' }
  & { createAnalysisSpecification: (
    { __typename?: 'AnalysisSpecificationType' }
    & Pick<Types.AnalysisSpecificationType, 'uid' | 'analysisUid' | 'min' | 'max' | 'minWarn' | 'maxWarn' | 'minReport' | 'maxReport' | 'warnValues' | 'warnReport' | 'gender' | 'ageMin' | 'ageMax' | 'methodUid'>
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type EditAnalysisSpecificationMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.AnalysisSpecificationInput;
}>;


export type EditAnalysisSpecificationMutation = (
  { __typename?: 'Mutation' }
  & { updateAnalysisSpecification: (
    { __typename?: 'AnalysisSpecificationType' }
    & Pick<Types.AnalysisSpecificationType, 'uid' | 'analysisUid' | 'min' | 'max' | 'minWarn' | 'maxWarn' | 'minReport' | 'maxReport' | 'warnValues' | 'warnReport' | 'gender' | 'ageMin' | 'ageMax' | 'methodUid'>
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type AddAnalysisServiceMutationVariables = Types.Exact<{
  payload: Types.AnalysisInputType;
}>;


export type AddAnalysisServiceMutation = (
  { __typename?: 'Mutation' }
  & { createAnalysis: (
    { __typename: 'AnalysisWithProfiles' }
    & Pick<Types.AnalysisWithProfiles, 'uid' | 'name' | 'keyword' | 'sortKey' | 'tatLengthMinutes' | 'precision' | 'requiredVerifications' | 'selfVerification' | 'description' | 'categoryUid' | 'departmentUid' | 'unitUid'>
    & { unit?: Types.Maybe<(
      { __typename?: 'UnitType' }
      & Pick<Types.UnitType, 'uid' | 'name'>
    )>, sampleTypes?: Types.Maybe<Array<(
      { __typename?: 'SampleTypeTyp' }
      & Pick<Types.SampleTypeTyp, 'uid' | 'name'>
    )>>, methods?: Types.Maybe<Array<(
      { __typename?: 'MethodType' }
      & Pick<Types.MethodType, 'uid' | 'name'>
    )>>, resultOptions?: Types.Maybe<Array<(
      { __typename?: 'ResultOptionType' }
      & Pick<Types.ResultOptionType, 'uid' | 'optionKey' | 'value'>
    )>>, category?: Types.Maybe<(
      { __typename?: 'AnalysisCategoryType' }
      & Pick<Types.AnalysisCategoryType, 'uid' | 'name'>
    )>, profiles?: Types.Maybe<Array<(
      { __typename?: 'ProfileType' }
      & Pick<Types.ProfileType, 'uid' | 'name'>
    )>> }
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type EditAnalysisServiceMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.AnalysisInputType;
}>;


export type EditAnalysisServiceMutation = (
  { __typename?: 'Mutation' }
  & { updateAnalysis: (
    { __typename: 'AnalysisWithProfiles' }
    & Pick<Types.AnalysisWithProfiles, 'uid' | 'name' | 'keyword' | 'sortKey' | 'tatLengthMinutes' | 'precision' | 'requiredVerifications' | 'selfVerification' | 'description' | 'categoryUid' | 'departmentUid' | 'unitUid'>
    & { unit?: Types.Maybe<(
      { __typename?: 'UnitType' }
      & Pick<Types.UnitType, 'uid' | 'name'>
    )>, sampleTypes?: Types.Maybe<Array<(
      { __typename?: 'SampleTypeTyp' }
      & Pick<Types.SampleTypeTyp, 'uid' | 'name'>
    )>>, methods?: Types.Maybe<Array<(
      { __typename?: 'MethodType' }
      & Pick<Types.MethodType, 'uid' | 'name'>
    )>>, resultOptions?: Types.Maybe<Array<(
      { __typename?: 'ResultOptionType' }
      & Pick<Types.ResultOptionType, 'uid' | 'optionKey' | 'value'>
    )>>, category?: Types.Maybe<(
      { __typename?: 'AnalysisCategoryType' }
      & Pick<Types.AnalysisCategoryType, 'uid' | 'name'>
    )>, profiles?: Types.Maybe<Array<(
      { __typename?: 'ProfileType' }
      & Pick<Types.ProfileType, 'uid' | 'name'>
    )>> }
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type AddAnalysisMappingMutationVariables = Types.Exact<{
  payload: Types.AnalysisMappingInputType;
}>;


export type AddAnalysisMappingMutation = (
  { __typename?: 'Mutation' }
  & { createAnalysisMapping: (
    { __typename?: 'AnalysisMappingType' }
    & Pick<Types.AnalysisMappingType, 'uid' | 'name' | 'description' | 'code' | 'codingStandardUid' | 'analysisUid'>
    & { codingStandard?: Types.Maybe<(
      { __typename?: 'CodingStandardType' }
      & Pick<Types.CodingStandardType, 'name'>
    )> }
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type EditAnalysisMappingMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.AnalysisMappingInputType;
}>;


export type EditAnalysisMappingMutation = (
  { __typename?: 'Mutation' }
  & { updateAnalysisMapping: (
    { __typename?: 'AnalysisMappingType' }
    & Pick<Types.AnalysisMappingType, 'uid' | 'name' | 'description' | 'code' | 'codingStandardUid' | 'analysisUid'>
    & { codingStandard?: Types.Maybe<(
      { __typename?: 'CodingStandardType' }
      & Pick<Types.CodingStandardType, 'name'>
    )> }
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type AddAnalysisProfileMutationVariables = Types.Exact<{
  payload: Types.ProfileInputType;
}>;


export type AddAnalysisProfileMutation = (
  { __typename?: 'Mutation' }
  & { createProfile: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename?: 'ProfileType' }
    & Pick<Types.ProfileType, 'uid' | 'name' | 'description' | 'keyword' | 'active' | 'departmentUid'>
    & { sampleTypes?: Types.Maybe<Array<(
      { __typename?: 'SampleTypeTyp' }
      & Pick<Types.SampleTypeTyp, 'uid' | 'name'>
    )>>, analyses?: Types.Maybe<Array<(
      { __typename?: 'AnalysisType' }
      & Pick<Types.AnalysisType, 'uid' | 'name' | 'keyword' | 'active'>
    )>> }
  ) }
);

export type EditAnalysisProfileMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.ProfileInputType;
}>;


export type EditAnalysisProfileMutation = (
  { __typename?: 'Mutation' }
  & { updateProfile: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename?: 'ProfileType' }
    & Pick<Types.ProfileType, 'uid' | 'name' | 'description' | 'keyword' | 'active' | 'departmentUid'>
    & { sampleTypes?: Types.Maybe<Array<(
      { __typename?: 'SampleTypeTyp' }
      & Pick<Types.SampleTypeTyp, 'uid' | 'name'>
    )>>, analyses?: Types.Maybe<Array<(
      { __typename?: 'AnalysisType' }
      & Pick<Types.AnalysisType, 'uid' | 'name' | 'keyword' | 'active'>
    )>> }
  ) }
);

export type AddProfileMappingMutationVariables = Types.Exact<{
  payload: Types.ProfileMappingInputType;
}>;


export type AddProfileMappingMutation = (
  { __typename?: 'Mutation' }
  & { createProfileMapping: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename?: 'ProfileMappingType' }
    & Pick<Types.ProfileMappingType, 'uid' | 'name' | 'description' | 'code' | 'codingStandardUid' | 'profileUid'>
    & { codingStandard?: Types.Maybe<(
      { __typename?: 'CodingStandardType' }
      & Pick<Types.CodingStandardType, 'name'>
    )> }
  ) }
);

export type EditProfileMappingMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.ProfileMappingInputType;
}>;


export type EditProfileMappingMutation = (
  { __typename?: 'Mutation' }
  & { updateProfileMapping: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename?: 'ProfileMappingType' }
    & Pick<Types.ProfileMappingType, 'uid' | 'name' | 'description' | 'code' | 'codingStandardUid' | 'profileUid'>
    & { codingStandard?: Types.Maybe<(
      { __typename?: 'CodingStandardType' }
      & Pick<Types.CodingStandardType, 'name'>
    )> }
  ) }
);

export type AddAnalysisTemplateMutationVariables = Types.Exact<{
  payload: Types.AnalysisTemplateInputType;
}>;


export type AddAnalysisTemplateMutation = (
  { __typename?: 'Mutation' }
  & { createAnalysisTemplate: (
    { __typename?: 'AnalysisTemplateType' }
    & Pick<Types.AnalysisTemplateType, 'uid' | 'name' | 'description' | 'departmentUid'>
    & { analyses?: Types.Maybe<Array<(
      { __typename?: 'AnalysisType' }
      & Pick<Types.AnalysisType, 'uid' | 'name' | 'keyword' | 'active'>
    )>> }
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type EditAnalysisTemplateMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.AnalysisTemplateInputType;
}>;


export type EditAnalysisTemplateMutation = (
  { __typename?: 'Mutation' }
  & { updateAnalysisTemplate: (
    { __typename?: 'AnalysisTemplateType' }
    & Pick<Types.AnalysisTemplateType, 'uid' | 'name' | 'description' | 'departmentUid'>
    & { analyses?: Types.Maybe<Array<(
      { __typename?: 'AnalysisType' }
      & Pick<Types.AnalysisType, 'uid' | 'name' | 'keyword' | 'active'>
    )>> }
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type EditSampleApplyTemplateMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  analysisTemplateUid: Types.Scalars['String']['input'];
}>;


export type EditSampleApplyTemplateMutation = (
  { __typename?: 'Mutation' }
  & { samplesApplyTemplate: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'ResultedSampleListingType' }
    & { samples: Array<(
      { __typename?: 'SamplesWithResults' }
      & Pick<Types.SamplesWithResults, 'uid'>
    )> }
  ) }
);

export type SampleManageAnalysisMutationVariables = Types.Exact<{
  sampleUid: Types.Scalars['String']['input'];
  payload: Types.ManageAnalysisInputType;
}>;


export type SampleManageAnalysisMutation = (
  { __typename?: 'Mutation' }
  & { manageAnalyses: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'ResultedSampleListingType' }
    & { samples: Array<(
      { __typename?: 'SamplesWithResults' }
      & Pick<Types.SamplesWithResults, 'uid'>
    )> }
  ) }
);

export type AddAnalysisCategoryMutationVariables = Types.Exact<{
  payload: Types.AnalysisCategoryInputType;
}>;


export type AddAnalysisCategoryMutation = (
  { __typename?: 'Mutation' }
  & { createAnalysisCategory: (
    { __typename?: 'AnalysisCategoryType' }
    & Pick<Types.AnalysisCategoryType, 'uid' | 'name' | 'active' | 'description'>
    & { department?: Types.Maybe<(
      { __typename?: 'DepartmentType' }
      & Pick<Types.DepartmentType, 'uid' | 'name'>
    )> }
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type EditAnalysisCategoryMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.AnalysisCategoryInputType;
}>;


export type EditAnalysisCategoryMutation = (
  { __typename?: 'Mutation' }
  & { updateAnalysisCategory: (
    { __typename?: 'AnalysisCategoryType' }
    & Pick<Types.AnalysisCategoryType, 'uid' | 'name' | 'active' | 'description'>
    & { department?: Types.Maybe<(
      { __typename?: 'DepartmentType' }
      & Pick<Types.DepartmentType, 'uid' | 'name'>
    )> }
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type AddAnalysisRequestMutationVariables = Types.Exact<{
  payload: Types.AnalysisRequestInputType;
}>;


export type AddAnalysisRequestMutation = (
  { __typename?: 'Mutation' }
  & { createAnalysisRequest: (
    { __typename: 'AnalysisRequestWithSamples' }
    & Pick<Types.AnalysisRequestWithSamples, 'uid' | 'clientRequestId' | 'createdAt'>
    & { patient: (
      { __typename?: 'PatientType' }
      & Pick<Types.PatientType, 'uid' | 'firstName' | 'lastName' | 'clientPatientId' | 'gender' | 'dateOfBirth' | 'age' | 'ageDobEstimated' | 'consentSms'>
    ), client?: Types.Maybe<(
      { __typename?: 'ClientType' }
      & Pick<Types.ClientType, 'uid' | 'name'>
    )>, samples?: Types.Maybe<Array<(
      { __typename?: 'SampleType' }
      & Pick<Types.SampleType, 'uid' | 'sampleId' | 'priority' | 'status'>
      & { sampleType?: Types.Maybe<(
        { __typename?: 'SampleTypeTyp' }
        & Pick<Types.SampleTypeTyp, 'uid' | 'name'>
      )>, analyses?: Types.Maybe<Array<(
        { __typename?: 'AnalysisType' }
        & Pick<Types.AnalysisType, 'uid' | 'name' | 'sortKey'>
      )>>, profiles: Array<(
        { __typename?: 'ProfileType' }
        & Pick<Types.ProfileType, 'uid' | 'name'>
      )> }
    )>> }
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type SubmitAnalysisResultsMutationVariables = Types.Exact<{
  analysisResults: Array<Types.ArResultInputType> | Types.ArResultInputType;
  sourceObject: Types.Scalars['String']['input'];
  sourceObjectUid: Types.Scalars['String']['input'];
}>;


export type SubmitAnalysisResultsMutation = (
  { __typename?: 'Mutation' }
  & { submitAnalysisResults: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename?: 'OperationSuccess' }
    & Pick<Types.OperationSuccess, 'message'>
  ) }
);

export type CancelAnalysisResultsMutationVariables = Types.Exact<{
  analyses: Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input'];
}>;


export type CancelAnalysisResultsMutation = (
  { __typename?: 'Mutation' }
  & { cancelAnalysisResults: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename?: 'ResultListingType' }
    & { results: Array<(
      { __typename?: 'AnalysisResultType' }
      & Pick<Types.AnalysisResultType, 'uid' | 'status'>
    )> }
  ) }
);

export type ReInstateAnalysisResultsMutationVariables = Types.Exact<{
  analyses: Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input'];
}>;


export type ReInstateAnalysisResultsMutation = (
  { __typename?: 'Mutation' }
  & { reInstateAnalysisResults: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename?: 'ResultListingType' }
    & { results: Array<(
      { __typename?: 'AnalysisResultType' }
      & Pick<Types.AnalysisResultType, 'uid' | 'status'>
    )> }
  ) }
);

export type VerifyAnalysisResultsMutationVariables = Types.Exact<{
  analyses: Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input'];
  sourceObject: Types.Scalars['String']['input'];
  sourceObjectUid: Types.Scalars['String']['input'];
}>;


export type VerifyAnalysisResultsMutation = (
  { __typename?: 'Mutation' }
  & { verifyAnalysisResults: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename?: 'OperationSuccess' }
    & Pick<Types.OperationSuccess, 'message'>
  ) }
);

export type RetractAnalysisResultsMutationVariables = Types.Exact<{
  analyses: Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input'];
}>;


export type RetractAnalysisResultsMutation = (
  { __typename?: 'Mutation' }
  & { retractAnalysisResults: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename?: 'ResultListingType' }
    & { results: Array<(
      { __typename?: 'AnalysisResultType' }
      & Pick<Types.AnalysisResultType, 'uid' | 'status' | 'sampleUid' | 'result' | 'analysisUid' | 'retest' | 'reportable' | 'createdAt' | 'createdByUid' | 'updatedAt' | 'updatedByUid'>
      & { sample: (
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
        )>> }
      )> }
    )> }
  ) }
);

export type RetestAnalysisResultsMutationVariables = Types.Exact<{
  analyses: Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input'];
}>;


export type RetestAnalysisResultsMutation = (
  { __typename?: 'Mutation' }
  & { retestAnalysisResults: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename?: 'ResultListingType' }
    & { results: Array<(
      { __typename?: 'AnalysisResultType' }
      & Pick<Types.AnalysisResultType, 'uid' | 'status' | 'sampleUid' | 'result' | 'analysisUid' | 'retest' | 'reportable' | 'createdAt' | 'createdByUid' | 'updatedAt' | 'updatedByUid'>
      & { sample: (
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
        )>> }
      )> }
    )> }
  ) }
);

export type AddQcLevelMutationVariables = Types.Exact<{
  level: Types.Scalars['String']['input'];
}>;


export type AddQcLevelMutation = (
  { __typename?: 'Mutation' }
  & { createQcLevel: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename?: 'QCLevelType' }
    & Pick<Types.QcLevelType, 'uid' | 'level'>
  ) }
);

export type EditQcLevelMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  level: Types.Scalars['String']['input'];
}>;


export type EditQcLevelMutation = (
  { __typename?: 'Mutation' }
  & { updateQcLevel: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename?: 'QCLevelType' }
    & Pick<Types.QcLevelType, 'uid' | 'level'>
  ) }
);

export type AddQcTemplateMutationVariables = Types.Exact<{
  payload: Types.QcTemplateInputType;
}>;


export type AddQcTemplateMutation = (
  { __typename?: 'Mutation' }
  & { createQcTemplate: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename?: 'QCTemplateType' }
    & Pick<Types.QcTemplateType, 'uid' | 'name' | 'description'>
    & { qcLevels: Array<(
      { __typename?: 'QCLevelType' }
      & Pick<Types.QcLevelType, 'uid' | 'level'>
    )>, departments: Array<(
      { __typename?: 'DepartmentType' }
      & Pick<Types.DepartmentType, 'uid' | 'name'>
    )> }
  ) }
);

export type EditQcTemplateMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.QcTemplateInputType;
}>;


export type EditQcTemplateMutation = (
  { __typename?: 'Mutation' }
  & { updateQcTemplate: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename?: 'QCTemplateType' }
    & Pick<Types.QcTemplateType, 'uid' | 'name' | 'description'>
    & { qcLevels: Array<(
      { __typename?: 'QCLevelType' }
      & Pick<Types.QcLevelType, 'uid' | 'level'>
    )>, departments: Array<(
      { __typename?: 'DepartmentType' }
      & Pick<Types.DepartmentType, 'uid' | 'name'>
    )> }
  ) }
);

export type AddQcRequestMutationVariables = Types.Exact<{
  samples: Array<Types.QcSetInputType> | Types.QcSetInputType;
}>;


export type AddQcRequestMutation = (
  { __typename?: 'Mutation' }
  & { createQcSet: (
    { __typename: 'CreateQCSetData' }
    & { qcSets: Array<(
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
    )> }
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type AddRejectionReasonMutationVariables = Types.Exact<{
  reason: Types.Scalars['String']['input'];
}>;


export type AddRejectionReasonMutation = (
  { __typename?: 'Mutation' }
  & { createRejectionReason: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'RejectionReasonType' }
    & Pick<Types.RejectionReasonType, 'uid' | 'reason'>
  ) }
);

export type EditRejectionReasonMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  reason: Types.Scalars['String']['input'];
}>;


export type EditRejectionReasonMutation = (
  { __typename?: 'Mutation' }
  & { updateRejectionReason: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'RejectionReasonType' }
    & Pick<Types.RejectionReasonType, 'uid' | 'reason'>
  ) }
);


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
      sampleTypes {
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
      sampleTypes {
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
export const AddAnalysisTemplateDocument = gql`
    mutation AddAnalysisTemplate($payload: AnalysisTemplateInputType!) {
  createAnalysisTemplate(payload: $payload) {
    ... on AnalysisTemplateType {
      uid
      name
      description
      departmentUid
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

export function useAddAnalysisTemplateMutation() {
  return Urql.useMutation<AddAnalysisTemplateMutation, AddAnalysisTemplateMutationVariables>(AddAnalysisTemplateDocument);
};
export const EditAnalysisTemplateDocument = gql`
    mutation EditAnalysisTemplate($uid: String!, $payload: AnalysisTemplateInputType!) {
  updateAnalysisTemplate(uid: $uid, payload: $payload) {
    ... on AnalysisTemplateType {
      uid
      name
      description
      departmentUid
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

export function useEditAnalysisTemplateMutation() {
  return Urql.useMutation<EditAnalysisTemplateMutation, EditAnalysisTemplateMutationVariables>(EditAnalysisTemplateDocument);
};
export const EditSampleApplyTemplateDocument = gql`
    mutation EditSampleApplyTemplate($uid: String!, $analysisTemplateUid: String!) {
  samplesApplyTemplate(uid: $uid, analysisTemplateUid: $analysisTemplateUid) {
    ... on ResultedSampleListingType {
      __typename
      samples {
        uid
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

export function useEditSampleApplyTemplateMutation() {
  return Urql.useMutation<EditSampleApplyTemplateMutation, EditSampleApplyTemplateMutationVariables>(EditSampleApplyTemplateDocument);
};
export const SampleManageAnalysisDocument = gql`
    mutation SampleManageAnalysis($sampleUid: String!, $payload: ManageAnalysisInputType!) {
  manageAnalyses(sampleUid: $sampleUid, payload: $payload) {
    ... on ResultedSampleListingType {
      __typename
      samples {
        uid
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

export function useSampleManageAnalysisMutation() {
  return Urql.useMutation<SampleManageAnalysisMutation, SampleManageAnalysisMutationVariables>(SampleManageAnalysisDocument);
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
      qcSets {
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