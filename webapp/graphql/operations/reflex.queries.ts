import type * as Types from '../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetAllReflexRulesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAllReflexRulesQuery = (
  { __typename?: 'Query' }
  & { reflexRuleAll: (
    { __typename?: 'ReflexRuleCursorPage' }
    & Pick<Types.ReflexRuleCursorPage, 'totalCount'>
    & { items?: Types.Maybe<Array<(
      { __typename?: 'ReflexRuleType' }
      & Pick<Types.ReflexRuleType, 'uid' | 'name' | 'description'>
      & { createdBy?: Types.Maybe<(
        { __typename?: 'UserType' }
        & Pick<Types.UserType, 'firstName' | 'lastName'>
      )> }
    )>> }
  ) }
);

export type GetReflexRuleByUidQueryVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type GetReflexRuleByUidQuery = (
  { __typename?: 'Query' }
  & { reflexRuleByUid?: Types.Maybe<(
    { __typename?: 'ReflexRuleType' }
    & Pick<Types.ReflexRuleType, 'uid' | 'name' | 'description'>
    & { reflexActions?: Types.Maybe<Array<(
      { __typename: 'ReflexActionType' }
      & Pick<Types.ReflexActionType, 'uid' | 'level' | 'description'>
      & { analyses?: Types.Maybe<Array<(
        { __typename: 'AnalysisType' }
        & Pick<Types.AnalysisType, 'uid' | 'name'>
      )>>, brains?: Types.Maybe<Array<(
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
      )>>, createdBy?: Types.Maybe<(
        { __typename: 'UserType' }
        & Pick<Types.UserType, 'firstName' | 'lastName'>
      )> }
    )>> }
  )> }
);


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
        __typename
      }
      brains {
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
      createdBy {
        firstName
        lastName
        __typename
      }
      __typename
    }
  }
}
    `;

export function useGetReflexRuleByUidQuery(options: Omit<Urql.UseQueryArgs<never, GetReflexRuleByUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetReflexRuleByUidQuery>({ query: GetReflexRuleByUidDocument, ...options });
};