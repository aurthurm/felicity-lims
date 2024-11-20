import type * as Types from '../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type AddReflexRuleMutationVariables = Types.Exact<{
  payload: Types.ReflexRuleInput;
}>;


export type AddReflexRuleMutation = (
  { __typename?: 'Mutation' }
  & { createReflexRule: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'ReflexRuleType' }
    & Pick<Types.ReflexRuleType, 'uid' | 'name' | 'description' | 'createdByUid' | 'createdAt'>
  ) }
);

export type EditReflexRuleMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.ReflexRuleInput;
}>;


export type EditReflexRuleMutation = (
  { __typename?: 'Mutation' }
  & { updateReflexRule: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'ReflexRuleType' }
    & Pick<Types.ReflexRuleType, 'uid' | 'name' | 'description' | 'createdByUid' | 'createdAt'>
  ) }
);

export type AddReflexActionMutationVariables = Types.Exact<{
  payload: Types.ReflexActionInput;
}>;


export type AddReflexActionMutation = (
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

export type EditReflexActionMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.ReflexActionInput;
}>;


export type EditReflexActionMutation = (
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

export type AddReflexBrainMutationVariables = Types.Exact<{
  payload: Types.ReflexBrainInput;
}>;


export type AddReflexBrainMutation = (
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

export type EditReflexBrainMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.ReflexBrainInput;
}>;


export type EditReflexBrainMutation = (
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


export const AddReflexRuleDocument = gql`
    mutation AddReflexRule($payload: ReflexRuleInput!) {
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

export function useAddReflexRuleMutation() {
  return Urql.useMutation<AddReflexRuleMutation, AddReflexRuleMutationVariables>(AddReflexRuleDocument);
};
export const EditReflexRuleDocument = gql`
    mutation EditReflexRule($uid: String!, $payload: ReflexRuleInput!) {
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

export function useEditReflexRuleMutation() {
  return Urql.useMutation<EditReflexRuleMutation, EditReflexRuleMutationVariables>(EditReflexRuleDocument);
};
export const AddReflexActionDocument = gql`
    mutation AddReflexAction($payload: ReflexActionInput!) {
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

export function useAddReflexActionMutation() {
  return Urql.useMutation<AddReflexActionMutation, AddReflexActionMutationVariables>(AddReflexActionDocument);
};
export const EditReflexActionDocument = gql`
    mutation editReflexAction($uid: String!, $payload: ReflexActionInput!) {
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

export function useEditReflexActionMutation() {
  return Urql.useMutation<EditReflexActionMutation, EditReflexActionMutationVariables>(EditReflexActionDocument);
};
export const AddReflexBrainDocument = gql`
    mutation AddReflexBrain($payload: ReflexBrainInput!) {
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

export function useAddReflexBrainMutation() {
  return Urql.useMutation<AddReflexBrainMutation, AddReflexBrainMutationVariables>(AddReflexBrainDocument);
};
export const EditReflexBrainDocument = gql`
    mutation editReflexBrain($uid: String!, $payload: ReflexBrainInput!) {
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

export function useEditReflexBrainMutation() {
  return Urql.useMutation<EditReflexBrainMutation, EditReflexBrainMutationVariables>(EditReflexBrainDocument);
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