import type * as Types from '../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetDocumentFolderAllQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetDocumentFolderAllQuery = (
  { __typename?: 'Query' }
  & { documentFolderAll: (
    { __typename?: 'DocumentFolderCursorPage' }
    & { items?: Types.Maybe<Array<(
      { __typename?: 'DocumentFolderType' }
      & Pick<Types.DocumentFolderType, 'uid' | 'name' | 'parentUid'>
    )>> }
  ) }
);

export type GetDocumentAllQueryVariables = Types.Exact<{
  first: Types.Scalars['Int']['input'];
  after?: Types.InputMaybe<Types.Scalars['String']['input']>;
  folderUid?: Types.InputMaybe<Types.Scalars['String']['input']>;
  categoryUid?: Types.InputMaybe<Types.Scalars['String']['input']>;
  tagUid?: Types.InputMaybe<Types.Scalars['String']['input']>;
  status?: Types.InputMaybe<Types.Scalars['String']['input']>;
  authorUid?: Types.InputMaybe<Types.Scalars['String']['input']>;
  readerUid?: Types.InputMaybe<Types.Scalars['String']['input']>;
  departmentUid?: Types.InputMaybe<Types.Scalars['String']['input']>;
  text: Types.Scalars['String']['input'];
  sortBy?: Types.InputMaybe<Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input']>;
}>;


export type GetDocumentAllQuery = (
  { __typename?: 'Query' }
  & { documentAll: (
    { __typename?: 'DocumentCursorPage' }
    & { items?: Types.Maybe<Array<(
      { __typename?: 'DocumentType' }
      & Pick<Types.DocumentType, 'uid' | 'name' | 'documentId' | 'folderUid' | 'createdAt' | 'updatedAt'>
      & { latestVersion?: Types.Maybe<(
        { __typename?: 'DocumentVersionType' }
        & Pick<Types.DocumentVersionType, 'uid' | 'content' | 'editor' | 'thumbnail'>
      )>, createdBy?: Types.Maybe<(
        { __typename?: 'UserType' }
        & Pick<Types.UserType, 'firstName' | 'lastName'>
      )> }
    )>> }
  ) }
);

export type GetDocumentVersionByBidQueryVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type GetDocumentVersionByBidQuery = (
  { __typename?: 'Query' }
  & { documentVersionByUid?: Types.Maybe<(
    { __typename?: 'DocumentVersionType' }
    & Pick<Types.DocumentVersionType, 'uid' | 'content' | 'editor' | 'versionNumber' | 'changeSummary' | 'thumbnail' | 'createdAt'>
    & { document?: Types.Maybe<(
      { __typename?: 'DocumentType' }
      & Pick<Types.DocumentType, 'uid' | 'name' | 'documentId' | 'createdAt' | 'updatedAt'>
      & { createdBy?: Types.Maybe<(
        { __typename?: 'UserType' }
        & Pick<Types.UserType, 'firstName' | 'lastName'>
      )>, updatedBy?: Types.Maybe<(
        { __typename?: 'UserType' }
        & Pick<Types.UserType, 'firstName' | 'lastName'>
      )> }
    )>, createdBy?: Types.Maybe<(
      { __typename?: 'UserType' }
      & Pick<Types.UserType, 'firstName' | 'lastName'>
    )> }
  )> }
);


export const GetDocumentFolderAllDocument = gql`
    query GetDocumentFolderAll {
  documentFolderAll {
    items {
      uid
      name
      parentUid
    }
  }
}
    `;

export function useGetDocumentFolderAllQuery(options: Omit<Urql.UseQueryArgs<never, GetDocumentFolderAllQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetDocumentFolderAllQuery>({ query: GetDocumentFolderAllDocument, ...options });
};
export const GetDocumentAllDocument = gql`
    query GetDocumentAll($first: Int!, $after: String, $folderUid: String, $categoryUid: String, $tagUid: String, $status: String, $authorUid: String, $readerUid: String, $departmentUid: String, $text: String!, $sortBy: [String!] = ["uid"]) {
  documentAll(
    pageSize: $first
    afterCursor: $after
    folderUid: $folderUid
    categoryUid: $categoryUid
    tagUid: $tagUid
    status: $status
    authorUid: $authorUid
    readerUid: $readerUid
    departmentUid: $departmentUid
    text: $text
    sortBy: $sortBy
  ) {
    items {
      uid
      name
      documentId
      folderUid
      latestVersion {
        uid
        content
        editor
        thumbnail
      }
      createdAt
      createdBy {
        firstName
        lastName
      }
      updatedAt
    }
  }
}
    `;

export function useGetDocumentAllQuery(options: Omit<Urql.UseQueryArgs<never, GetDocumentAllQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetDocumentAllQuery>({ query: GetDocumentAllDocument, ...options });
};
export const GetDocumentVersionByBidDocument = gql`
    query GetDocumentVersionByBid($uid: String!) {
  documentVersionByUid(uid: $uid) {
    uid
    content
    editor
    versionNumber
    changeSummary
    thumbnail
    document {
      uid
      name
      documentId
      createdAt
      createdBy {
        firstName
        lastName
      }
      updatedAt
      updatedBy {
        firstName
        lastName
      }
    }
    createdAt
    createdBy {
      firstName
      lastName
    }
  }
}
    `;

export function useGetDocumentVersionByBidQuery(options: Omit<Urql.UseQueryArgs<never, GetDocumentVersionByBidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetDocumentVersionByBidQuery>({ query: GetDocumentVersionByBidDocument, ...options });
};