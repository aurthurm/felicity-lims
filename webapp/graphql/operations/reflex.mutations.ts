import type * as Types from '../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type AddReflexRMutationVariables = Types.Exact<{
  payload: Types.ReflexRuleInput;
}>;


export type AddReflexRMutation = (
  { __typename?: 'Mutation' }
  & { createReflexRule: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'ReflexRuleType' }
    & Pick<Types.ReflexRuleType, 'uid' | 'name' | 'description' | 'createdByUid' | 'createdAt'>
  ) }
);

export type EditReflexRMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.ReflexRuleInput;
}>;


export type EditReflexRMutation = (
  { __typename?: 'Mutation' }
  & { updateReflexRule: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'ReflexRuleType' }
    & Pick<Types.ReflexRuleType, 'uid' | 'name' | 'description' | 'createdByUid' | 'createdAt'>
  ) }
);

export type AddReflexAMutationVariables = Types.Exact<{
  payload: Types.ReflexActionInput;
}>;


export type AddReflexAMutation = (
  { __typename?: 'Mutation' }
  & { createReflexAction: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'ReflexActionType' }
    & Pick<Types.ReflexActionType, 'uid' | 'description' | 'level'>
    & { analyses?: Types.Maybe<Array<(
      { __typename?: 'AnalysisType' }
      & Pick<Types.AnalysisType, 'uid' | 'name'>
    )>>, reflexRule?: Types.Maybe<(
      { __typename?: 'ReflexRuleType' }
      & Pick<Types.ReflexRuleType, 'uid' | 'name'>
    )> }
  ) }
);

export type EditReflexAMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.ReflexActionInput;
}>;


export type EditReflexAMutation = (
  { __typename?: 'Mutation' }
  & { updateReflexAction: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'ReflexActionType' }
    & Pick<Types.ReflexActionType, 'uid' | 'description' | 'level'>
    & { analyses?: Types.Maybe<Array<(
      { __typename?: 'AnalysisType' }
      & Pick<Types.AnalysisType, 'uid' | 'name'>
    )>>, reflexRule?: Types.Maybe<(
      { __typename?: 'ReflexRuleType' }
      & Pick<Types.ReflexRuleType, 'uid' | 'name'>
    )> }
  ) }
);

export type AddReflexBMutationVariables = Types.Exact<{
  payload: Types.ReflexBrainInput;
}>;


export type AddReflexBMutation = (
  { __typename?: 'Mutation' }
  & { createReflexBrain: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'ReflexBrainType' }
    & Pick<Types.ReflexBrainType, 'uid' | 'description'>
    & { conditions: Array<(
      { __typename?: 'ReflexBrainConditionType' }
      & Pick<Types.ReflexBrainConditionType, 'description' | 'priority'>
      & { criteria?: Types.Maybe<Array<(
        { __typename: 'ReflexBrainConditionCriteriaType' }
        & Pick<Types.ReflexBrainConditionCriteriaType, 'analysisUid' | 'operator' | 'value'>
        & { analysis?: Types.Maybe<(
          { __typename: 'AnalysisType' }
          & Pick<Types.AnalysisType, 'uid' | 'name'>
          & { resultOptions?: Types.Maybe<Array<(
            { __typename: 'ResultOptionType' }
            & Pick<Types.ResultOptionType, 'optionKey' | 'value'>
          )>> }
        )> }
      )>> }
    )>, actions: Array<(
      { __typename: 'ReflexBrainActionType' }
      & { addNew?: Types.Maybe<Array<(
        { __typename: 'ReflexBrainAdditionType' }
        & Pick<Types.ReflexBrainAdditionType, 'analysisUid' | 'count'>
        & { analysis?: Types.Maybe<(
          { __typename: 'AnalysisType' }
          & Pick<Types.AnalysisType, 'uid' | 'name'>
          & { resultOptions?: Types.Maybe<Array<(
            { __typename: 'ResultOptionType' }
            & Pick<Types.ResultOptionType, 'optionKey' | 'value'>
          )>> }
        )> }
      )>>, finalise?: Types.Maybe<Array<(
        { __typename: 'ReflexBrainFinalType' }
        & Pick<Types.ReflexBrainFinalType, 'analysisUid' | 'value'>
        & { analysis?: Types.Maybe<(
          { __typename: 'AnalysisType' }
          & Pick<Types.AnalysisType, 'name'>
          & { resultOptions?: Types.Maybe<Array<(
            { __typename: 'ResultOptionType' }
            & Pick<Types.ResultOptionType, 'optionKey' | 'value'>
          )>> }
        )> }
      )>> }
    )> }
  ) }
);

export type EditReflexBMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.ReflexBrainInput;
}>;


export type EditReflexBMutation = (
  { __typename?: 'Mutation' }
  & { updateReflexBrain: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'ReflexBrainType' }
    & Pick<Types.ReflexBrainType, 'uid' | 'description'>
    & { conditions: Array<(
      { __typename?: 'ReflexBrainConditionType' }
      & Pick<Types.ReflexBrainConditionType, 'description' | 'priority'>
      & { criteria?: Types.Maybe<Array<(
        { __typename: 'ReflexBrainConditionCriteriaType' }
        & Pick<Types.ReflexBrainConditionCriteriaType, 'analysisUid' | 'operator' | 'value'>
        & { analysis?: Types.Maybe<(
          { __typename: 'AnalysisType' }
          & Pick<Types.AnalysisType, 'uid' | 'name'>
          & { resultOptions?: Types.Maybe<Array<(
            { __typename: 'ResultOptionType' }
            & Pick<Types.ResultOptionType, 'optionKey' | 'value'>
          )>> }
        )> }
      )>> }
    )>, actions: Array<(
      { __typename: 'ReflexBrainActionType' }
      & { addNew?: Types.Maybe<Array<(
        { __typename: 'ReflexBrainAdditionType' }
        & Pick<Types.ReflexBrainAdditionType, 'analysisUid' | 'count'>
        & { analysis?: Types.Maybe<(
          { __typename: 'AnalysisType' }
          & Pick<Types.AnalysisType, 'uid' | 'name'>
          & { resultOptions?: Types.Maybe<Array<(
            { __typename: 'ResultOptionType' }
            & Pick<Types.ResultOptionType, 'optionKey' | 'value'>
          )>> }
        )> }
      )>>, finalise?: Types.Maybe<Array<(
        { __typename: 'ReflexBrainFinalType' }
        & Pick<Types.ReflexBrainFinalType, 'analysisUid' | 'value'>
        & { analysis?: Types.Maybe<(
          { __typename: 'AnalysisType' }
          & Pick<Types.AnalysisType, 'name'>
          & { resultOptions?: Types.Maybe<Array<(
            { __typename: 'ResultOptionType' }
            & Pick<Types.ResultOptionType, 'optionKey' | 'value'>
          )>> }
        )> }
      )>> }
    )> }
  ) }
);

export type DeleteReflexBrainMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type DeleteReflexBrainMutation = (
  { __typename?: 'Mutation' }
  & { deleteReflexBrain: (
    { __typename: 'DeletedItem' }
    & Pick<Types.DeletedItem, 'uid'>
  ) }
);


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
      description
      conditions {
        description
        priority
        criteria {
          analysisUid
          analysis {
            uid
            name
            resultOptions {
              optionKey
              value
              __typename
            }
            __typename
          }
          operator
          value
          __typename
        }
      }
      actions {
        addNew {
          analysisUid
          analysis {
            uid
            name
            resultOptions {
              optionKey
              value
              __typename
            }
            __typename
          }
          count
          __typename
        }
        finalise {
          analysisUid
          analysis {
            name
            resultOptions {
              optionKey
              value
              __typename
            }
            __typename
          }
          value
          __typename
        }
        __typename
      }
      __typename
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
      description
      conditions {
        description
        priority
        criteria {
          analysisUid
          analysis {
            uid
            name
            resultOptions {
              optionKey
              value
              __typename
            }
            __typename
          }
          operator
          value
          __typename
        }
      }
      actions {
        addNew {
          analysisUid
          analysis {
            uid
            name
            resultOptions {
              optionKey
              value
              __typename
            }
            __typename
          }
          count
          __typename
        }
        finalise {
          analysisUid
          analysis {
            name
            resultOptions {
              optionKey
              value
              __typename
            }
            __typename
          }
          value
          __typename
        }
        __typename
      }
      __typename
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
export const DeleteReflexBrainDocument = gql`
    mutation deleteReflexBrain($uid: String!) {
  deleteReflexBrain(uid: $uid) {
    __typename
    ... on DeletedItem {
      uid
    }
  }
}
    `;

export function useDeleteReflexBrainMutation() {
  return Urql.useMutation<DeleteReflexBrainMutation, DeleteReflexBrainMutationVariables>(DeleteReflexBrainDocument);
};