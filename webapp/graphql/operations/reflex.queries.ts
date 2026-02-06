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
    & Pick<
      Types.ReflexRuleType,
      | 'uid'
      | 'name'
      | 'description'
      | 'isActive'
      | 'priority'
      | 'createdAt'
      | 'updatedAt'
    >
    & {
      reflexTriggers?: Types.Maybe<Array<(
        { __typename?: 'ReflexTriggerType' }
        & Pick<
          Types.ReflexTriggerType,
          | 'uid'
          | 'level'
          | 'description'
          | 'sampleTypeUid'
          | 'posX'
          | 'posY'
        >
        & {
          sampleType?: Types.Maybe<(
            { __typename?: 'SampleTypeTyp' }
            & Pick<Types.SampleTypeTyp, 'uid' | 'name'>
          )>,
          analyses?: Types.Maybe<Array<(
            { __typename?: 'AnalysisType' }
            & Pick<Types.AnalysisType, 'uid' | 'name'>
            & { resultOptions?: Types.Maybe<Array<(
              { __typename?: 'ResultOptionType' }
              & Pick<Types.ResultOptionType, 'optionKey' | 'value'>
            )>> }
          )>>,
          decisions?: Types.Maybe<Array<(
            { __typename?: 'ReflexDecisionType' }
            & Pick<
              Types.ReflexDecisionType,
              | 'uid'
              | 'description'
              | 'priority'
              | 'posX'
              | 'posY'
            >
            & {
              ruleGroups?: Types.Maybe<Array<(
                { __typename?: 'ReflexRuleGroupType' }
                & Pick<
                  Types.ReflexRuleGroupType,
                  | 'uid'
                  | 'description'
                  | 'priority'
                  | 'posX'
                  | 'posY'
                >
                & { rules?: Types.Maybe<Array<(
                  { __typename?: 'ReflexRuleCriteriaType' }
                  & Pick<
                    Types.ReflexRuleCriteriaType,
                    | 'uid'
                    | 'analysisUid'
                    | 'operator'
                    | 'value'
                    | 'priority'
                  >
                  & { analysis?: Types.Maybe<(
                    { __typename?: 'AnalysisType' }
                    & Pick<Types.AnalysisType, 'uid' | 'name'>
                    & { resultOptions?: Types.Maybe<Array<(
                      { __typename?: 'ResultOptionType' }
                      & Pick<Types.ResultOptionType, 'optionKey' | 'value'>
                    )>> }
                  )> }
                )>> }
              )>>,
              addAnalyses?: Types.Maybe<Array<(
                { __typename?: 'ReflexAddAnalysisType' }
                & Pick<
                  Types.ReflexAddAnalysisType,
                  | 'uid'
                  | 'analysisUid'
                  | 'count'
                  | 'posX'
                  | 'posY'
                >
                & { analysis?: Types.Maybe<(
                  { __typename?: 'AnalysisType' }
                  & Pick<Types.AnalysisType, 'uid' | 'name'>
                )> }
              )>>,
              finalizeAnalyses?: Types.Maybe<Array<(
                { __typename?: 'ReflexFinalizeAnalysisType' }
                & Pick<
                  Types.ReflexFinalizeAnalysisType,
                  | 'uid'
                  | 'analysisUid'
                  | 'value'
                  | 'posX'
                  | 'posY'
                >
                & { analysis?: Types.Maybe<(
                  { __typename?: 'AnalysisType' }
                  & Pick<Types.AnalysisType, 'uid' | 'name'>
                )> }
              )>>,
            }
          )>>,
        }
      )>>,
      createdBy?: Types.Maybe<(
        { __typename?: 'UserType' }
        & Pick<Types.UserType, 'uid' | 'firstName' | 'lastName'>
      )>,
      updatedBy?: Types.Maybe<(
        { __typename?: 'UserType' }
        & Pick<Types.UserType, 'uid' | 'firstName' | 'lastName'>
      )>,
    }
  )> }
);

export type GetAllReflexTriggersQueryVariables = Types.Exact<{
  reflexRuleUid?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type GetAllReflexTriggersQuery = (
  { __typename?: 'Query' }
  & { reflexTriggerAll: Array<(
    { __typename?: 'ReflexTriggerType' }
    & Pick<
      Types.ReflexTriggerType,
      | 'uid'
      | 'reflexRuleUid'
      | 'level'
      | 'description'
      | 'sampleTypeUid'
    >
    & {
      analyses?: Types.Maybe<Array<(
        { __typename?: 'AnalysisType' }
        & Pick<Types.AnalysisType, 'uid' | 'name'>
      )>>,
      decisions?: Types.Maybe<Array<(
        { __typename?: 'ReflexDecisionType' }
        & Pick<Types.ReflexDecisionType, 'uid' | 'description' | 'priority'>
      )>>,
    }
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

export function useGetAllReflexRulesQuery(options?: Omit<Urql.UseQueryArgs<never, GetAllReflexRulesQueryVariables | undefined>, 'query'>) {
  return Urql.useQuery<GetAllReflexRulesQuery, GetAllReflexRulesQueryVariables | undefined>({ query: GetAllReflexRulesDocument, variables: undefined, ...options });
};
export const GetReflexRuleByUidDocument = gql`
    query getReflexRuleByUid($uid: String!) {
  reflexRuleByUid(uid: $uid) {
    uid
    name
    description
    isActive
    priority
    reflexTriggers {
      uid
      level
      description
      sampleTypeUid
      posX
      posY
      sampleType {
        uid
        name
      }
      analyses {
        uid
        name
        resultOptions {
          optionKey
          value
        }
      }
      decisions {
        uid
        description
        priority
        posX
        posY
        ruleGroups {
          uid
          description
          priority
          posX
          posY
          rules {
            uid
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
            priority
          }
        }
        addAnalyses {
          uid
          analysisUid
          analysis {
            uid
            name
          }
          count
          posX
          posY
        }
        finalizeAnalyses {
          uid
          analysisUid
          analysis {
            uid
            name
          }
          value
          posX
          posY
        }
      }
    }
    createdBy {
      uid
      firstName
      lastName
    }
    createdAt
    updatedBy {
      uid
      firstName
      lastName
    }
    updatedAt
  }
}
    `;

export function useGetReflexRuleByUidQuery(options?: Omit<Urql.UseQueryArgs<never, GetReflexRuleByUidQueryVariables | undefined>, 'query'>) {
  return Urql.useQuery<GetReflexRuleByUidQuery, GetReflexRuleByUidQueryVariables | undefined>({ query: GetReflexRuleByUidDocument, variables: undefined, ...options });
};
export const GetAllReflexTriggersDocument = gql`
    query getAllReflexTriggers($reflexRuleUid: String) {
  reflexTriggerAll(reflexRuleUid: $reflexRuleUid) {
    uid
    reflexRuleUid
    level
    description
    sampleTypeUid
    analyses {
      uid
      name
    }
    decisions {
      uid
      description
      priority
    }
  }
}
    `;

export function useGetAllReflexTriggersQuery(options?: Omit<Urql.UseQueryArgs<never, GetAllReflexTriggersQueryVariables | undefined>, 'query'>) {
  return Urql.useQuery<GetAllReflexTriggersQuery, GetAllReflexTriggersQueryVariables | undefined>({ query: GetAllReflexTriggersDocument, variables: undefined, ...options });
};