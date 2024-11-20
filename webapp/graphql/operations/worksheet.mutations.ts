import type * as Types from '../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type AddWorkSheetTemplateMutationVariables = Types.Exact<{
  payload: Types.WorksheetTemplateInputType;
}>;


export type AddWorkSheetTemplateMutation = (
  { __typename?: 'Mutation' }
  & { createWorksheetTemplate: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'WorkSheetTemplateType' }
    & Pick<Types.WorkSheetTemplateType, 'uid' | 'name' | 'reserved' | 'numberOfSamples' | 'rows' | 'cols' | 'rowWise' | 'worksheetType' | 'instrumentUid' | 'sampleTypeUid' | 'description' | 'analysisUid' | 'state'>
    & { instrument?: Types.Maybe<(
      { __typename?: 'InstrumentType' }
      & Pick<Types.InstrumentType, 'uid' | 'name'>
    )>, sampleType?: Types.Maybe<(
      { __typename?: 'SampleTypeTyp' }
      & Pick<Types.SampleTypeTyp, 'uid' | 'name'>
    )>, qcTemplate?: Types.Maybe<(
      { __typename?: 'QCTemplateType' }
      & Pick<Types.QcTemplateType, 'uid' | 'name' | 'description'>
      & { qcLevels: Array<(
        { __typename?: 'QCLevelType' }
        & Pick<Types.QcLevelType, 'uid' | 'level'>
      )> }
    )>, qcLevels?: Types.Maybe<Array<(
      { __typename?: 'QCLevelType' }
      & Pick<Types.QcLevelType, 'uid' | 'level'>
    )>>, analysis?: Types.Maybe<(
      { __typename?: 'AnalysisType' }
      & Pick<Types.AnalysisType, 'uid' | 'name'>
    )> }
  ) }
);

export type EditWorkSheetTemplateMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.WorksheetTemplateInputType;
}>;


export type EditWorkSheetTemplateMutation = (
  { __typename?: 'Mutation' }
  & { updateWorksheetTemplate: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'WorkSheetTemplateType' }
    & Pick<Types.WorkSheetTemplateType, 'uid' | 'name' | 'reserved' | 'numberOfSamples' | 'rows' | 'cols' | 'rowWise' | 'worksheetType' | 'instrumentUid' | 'sampleTypeUid' | 'description' | 'analysisUid' | 'state'>
    & { instrument?: Types.Maybe<(
      { __typename?: 'InstrumentType' }
      & Pick<Types.InstrumentType, 'uid' | 'name'>
    )>, sampleType?: Types.Maybe<(
      { __typename?: 'SampleTypeTyp' }
      & Pick<Types.SampleTypeTyp, 'uid' | 'name'>
    )>, qcTemplate?: Types.Maybe<(
      { __typename?: 'QCTemplateType' }
      & Pick<Types.QcTemplateType, 'uid' | 'name' | 'description'>
      & { qcLevels: Array<(
        { __typename?: 'QCLevelType' }
        & Pick<Types.QcLevelType, 'uid' | 'level'>
      )> }
    )>, qcLevels?: Types.Maybe<Array<(
      { __typename?: 'QCLevelType' }
      & Pick<Types.QcLevelType, 'uid' | 'level'>
    )>>, analysis?: Types.Maybe<(
      { __typename?: 'AnalysisType' }
      & Pick<Types.AnalysisType, 'uid' | 'name'>
    )> }
  ) }
);

export type AddWorkSheetMutationVariables = Types.Exact<{
  analystUid: Types.Scalars['String']['input'];
  templateUid: Types.Scalars['String']['input'];
  count?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;


export type AddWorkSheetMutation = (
  { __typename?: 'Mutation' }
  & { createWorksheet: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'WorksheetListingType' }
    & { worksheets?: Types.Maybe<Array<(
      { __typename?: 'WorkSheetType' }
      & Pick<Types.WorkSheetType, 'uid' | 'worksheetId' | 'numberOfSamples' | 'assignedCount' | 'instrumentUid' | 'analysisUid' | 'state' | 'createdAt'>
      & { analyst?: Types.Maybe<(
        { __typename?: 'UserType' }
        & Pick<Types.UserType, 'uid' | 'userName' | 'firstName' | 'lastName'>
      )>, instrument?: Types.Maybe<(
        { __typename?: 'InstrumentType' }
        & Pick<Types.InstrumentType, 'uid' | 'name'>
      )>, analysis?: Types.Maybe<(
        { __typename?: 'AnalysisType' }
        & Pick<Types.AnalysisType, 'uid' | 'name'>
      )> }
    )>> }
  ) }
);

export type UpdateWorkSheetMutationVariables = Types.Exact<{
  worksheetUid: Types.Scalars['String']['input'];
  analystUid?: Types.InputMaybe<Types.Scalars['String']['input']>;
  instrumentUid?: Types.InputMaybe<Types.Scalars['String']['input']>;
  methodUid?: Types.InputMaybe<Types.Scalars['String']['input']>;
  action?: Types.InputMaybe<Types.Scalars['String']['input']>;
  samples?: Types.InputMaybe<Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input']>;
}>;


export type UpdateWorkSheetMutation = (
  { __typename?: 'Mutation' }
  & { updateWorksheet: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'WorkSheetType' }
    & Pick<Types.WorkSheetType, 'uid' | 'numberOfSamples' | 'sampleTypeUid' | 'instrumentUid' | 'templateUid'>
    & { sampleType?: Types.Maybe<(
      { __typename?: 'SampleTypeTyp' }
      & Pick<Types.SampleTypeTyp, 'name'>
    )>, instrument?: Types.Maybe<(
      { __typename?: 'InstrumentType' }
      & Pick<Types.InstrumentType, 'uid' | 'name'>
    )>, template?: Types.Maybe<(
      { __typename?: 'WorkSheetTemplateType' }
      & Pick<Types.WorkSheetTemplateType, 'uid' | 'name'>
    )> }
  ) }
);

export type EditWorkSheetApplyTemplateMutationVariables = Types.Exact<{
  worksheetUid: Types.Scalars['String']['input'];
  templateUid: Types.Scalars['String']['input'];
}>;


export type EditWorkSheetApplyTemplateMutation = (
  { __typename?: 'Mutation' }
  & { updateWorksheetApplyTemplate: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'WorkSheetType' }
    & Pick<Types.WorkSheetType, 'uid' | 'numberOfSamples' | 'sampleTypeUid' | 'instrumentUid' | 'templateUid'>
    & { sampleType?: Types.Maybe<(
      { __typename?: 'SampleTypeTyp' }
      & Pick<Types.SampleTypeTyp, 'name'>
    )>, instrument?: Types.Maybe<(
      { __typename?: 'InstrumentType' }
      & Pick<Types.InstrumentType, 'uid' | 'name'>
    )>, template?: Types.Maybe<(
      { __typename?: 'WorkSheetTemplateType' }
      & Pick<Types.WorkSheetTemplateType, 'uid' | 'name'>
    )> }
  ) }
);

export type ManualyAssignWorsheetMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  qcTemplateUid?: Types.InputMaybe<Types.Scalars['String']['input']>;
  analysesUids: Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input'];
}>;


export type ManualyAssignWorsheetMutation = (
  { __typename?: 'Mutation' }
  & { updateWorksheetManualAssign: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'WorkSheetType' }
    & Pick<Types.WorkSheetType, 'uid' | 'numberOfSamples' | 'sampleTypeUid' | 'instrumentUid' | 'templateUid'>
    & { sampleType?: Types.Maybe<(
      { __typename?: 'SampleTypeTyp' }
      & Pick<Types.SampleTypeTyp, 'name'>
    )>, instrument?: Types.Maybe<(
      { __typename?: 'InstrumentType' }
      & Pick<Types.InstrumentType, 'uid' | 'name'>
    )>, template?: Types.Maybe<(
      { __typename?: 'WorkSheetTemplateType' }
      & Pick<Types.WorkSheetTemplateType, 'uid' | 'name'>
    )> }
  ) }
);

export type ActionAssignWorsheetMutationVariables = Types.Exact<{
  uids: Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input'];
  action: Types.Scalars['String']['input'];
}>;


export type ActionAssignWorsheetMutation = (
  { __typename?: 'Mutation' }
  & { actionWorksheets: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'WorksheetListingType' }
    & { worksheets?: Types.Maybe<Array<(
      { __typename?: 'WorkSheetType' }
      & Pick<Types.WorkSheetType, 'uid' | 'state'>
    )>> }
  ) }
);


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
          userName
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
    mutation ManualyAssignWorsheet($uid: String!, $qcTemplateUid: String, $analysesUids: [String!]!) {
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
export const ActionAssignWorsheetDocument = gql`
    mutation ActionAssignWorsheet($uids: [String!]!, $action: String!) {
  actionWorksheets(uids: $uids, action: $action) {
    ... on WorksheetListingType {
      __typename
      worksheets {
        uid
        state
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

export function useActionAssignWorsheetMutation() {
  return Urql.useMutation<ActionAssignWorsheetMutation, ActionAssignWorsheetMutationVariables>(ActionAssignWorsheetDocument);
};