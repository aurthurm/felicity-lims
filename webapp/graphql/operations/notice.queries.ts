import type * as Types from '../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetNoticesByCreatorUidQueryVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type GetNoticesByCreatorUidQuery = (
  { __typename?: 'Query' }
  & { noticesByCreator?: Types.Maybe<Array<(
    { __typename?: 'NoticeType' }
    & Pick<Types.NoticeType, 'uid' | 'title' | 'body' | 'expiry' | 'createdByUid'>
    & { departments?: Types.Maybe<Array<(
      { __typename?: 'DepartmentType' }
      & Pick<Types.DepartmentType, 'uid' | 'name'>
    )>>, groups?: Types.Maybe<Array<(
      { __typename?: 'GroupType' }
      & Pick<Types.GroupType, 'uid' | 'name'>
    )>> }
  )>> }
);


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