import type * as Types from '../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type AddNoticeMutationVariables = Types.Exact<{
  payload: Types.NoticeInputType;
}>;


export type AddNoticeMutation = (
  { __typename?: 'Mutation' }
  & { createNotice: (
    { __typename: 'NoticeType' }
    & Pick<Types.NoticeType, 'uid' | 'title' | 'body' | 'expiry' | 'createdByUid'>
    & { departments?: Types.Maybe<Array<(
      { __typename?: 'DepartmentType' }
      & Pick<Types.DepartmentType, 'uid' | 'name'>
    )>>, groups?: Types.Maybe<Array<(
      { __typename?: 'GroupType' }
      & Pick<Types.GroupType, 'uid' | 'name'>
    )>> }
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type EditNoticeMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.NoticeInputType;
}>;


export type EditNoticeMutation = (
  { __typename?: 'Mutation' }
  & { updateNotice: (
    { __typename: 'NoticeType' }
    & Pick<Types.NoticeType, 'uid' | 'title' | 'body' | 'expiry' | 'createdByUid'>
    & { departments?: Types.Maybe<Array<(
      { __typename?: 'DepartmentType' }
      & Pick<Types.DepartmentType, 'uid' | 'name'>
    )>>, groups?: Types.Maybe<Array<(
      { __typename?: 'GroupType' }
      & Pick<Types.GroupType, 'uid' | 'name'>
    )>> }
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type DeleteNoticeMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type DeleteNoticeMutation = (
  { __typename?: 'Mutation' }
  & { deleteNotice: (
    { __typename: 'DeletedItem' }
    & Pick<Types.DeletedItem, 'uid'>
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);


export const AddNoticeDocument = gql`
    mutation AddNotice($payload: NoticeInputType!) {
  createNotice(payload: $payload) {
    ... on NoticeType {
      __typename
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
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddNoticeMutation() {
  return Urql.useMutation<AddNoticeMutation, AddNoticeMutationVariables>(AddNoticeDocument);
};
export const EditNoticeDocument = gql`
    mutation editNotice($uid: String!, $payload: NoticeInputType!) {
  updateNotice(uid: $uid, payload: $payload) {
    ... on NoticeType {
      __typename
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
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditNoticeMutation() {
  return Urql.useMutation<EditNoticeMutation, EditNoticeMutationVariables>(EditNoticeDocument);
};
export const DeleteNoticeDocument = gql`
    mutation deleteNotice($uid: String!) {
  deleteNotice(uid: $uid) {
    ... on DeletedItem {
      __typename
      uid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useDeleteNoticeMutation() {
  return Urql.useMutation<DeleteNoticeMutation, DeleteNoticeMutationVariables>(DeleteNoticeDocument);
};