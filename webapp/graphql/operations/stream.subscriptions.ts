import type * as Types from '../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetSystemActivitySubscriptionVariables = Types.Exact<{ [key: string]: never; }>;


export type GetSystemActivitySubscription = (
  { __typename?: 'Subscription' }
  & { latestActivity: (
    { __typename?: 'ActivityStreamType' }
    & Pick<Types.ActivityStreamType, 'uid' | 'actorUid' | 'actionObjectUid' | 'actionObjectType' | 'targetUid' | 'verb'>
    & { actor: (
      { __typename?: 'UserType' }
      & Pick<Types.UserType, 'uid' | 'firstName' | 'lastName'>
    ), actionObject: (
      { __typename: 'AnalysisResultType' }
      & Pick<Types.AnalysisResultType, 'uid' | 'sampleUid' | 'result' | 'status'>
    ) | (
      { __typename: 'ReportMetaType' }
      & Pick<Types.ReportMetaType, 'uid' | 'status' | 'location'>
    ) | (
      { __typename: 'SampleType' }
      & Pick<Types.SampleType, 'uid' | 'sampleId' | 'status'>
      & { analysisRequest?: Types.Maybe<(
        { __typename?: 'AnalysisRequestType' }
        & Pick<Types.AnalysisRequestType, 'patientUid'>
      )> }
    ) | { __typename: 'UnknownObjectType' } | (
      { __typename: 'WorkSheetType' }
      & Pick<Types.WorkSheetType, 'uid' | 'worksheetId' | 'state'>
    ) }
  ) }
);


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