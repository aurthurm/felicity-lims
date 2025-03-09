import type * as Types from '../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type AddDocumentFolderMutationVariables = Types.Exact<{
  payload: Types.DocumentFolderInputType;
}>;


export type AddDocumentFolderMutation = (
  { __typename?: 'Mutation' }
  & { createDocumentFolder: (
    { __typename?: 'DocumentFolderType' }
    & Pick<Types.DocumentFolderType, 'uid' | 'name' | 'parentUid'>
  ) | (
    { __typename?: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type AddDocumentMutationVariables = Types.Exact<{
  payload: Types.DocumentInputType;
}>;


export type AddDocumentMutation = (
  { __typename?: 'Mutation' }
  & { createDocument: (
    { __typename?: 'DocumentType' }
    & Pick<Types.DocumentType, 'uid' | 'name' | 'documentId' | 'folderUid' | 'createdAt' | 'updatedAt'>
    & { latestVersion?: Types.Maybe<(
      { __typename?: 'DocumentVersionType' }
      & Pick<Types.DocumentVersionType, 'uid' | 'content' | 'editor' | 'thumbnail'>
    )>, createdBy?: Types.Maybe<(
      { __typename?: 'UserType' }
      & Pick<Types.UserType, 'firstName' | 'lastName'>
    )> }
  ) | (
    { __typename?: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type EditDocumentVersionMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.DocumentVersionUpdateInputType;
}>;


export type EditDocumentVersionMutation = (
  { __typename?: 'Mutation' }
  & { updateDocumentVersion: (
    { __typename?: 'DocumentVersionType' }
    & Pick<Types.DocumentVersionType, 'uid' | 'thumbnail'>
  ) | (
    { __typename?: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);


export const AddDocumentFolderDocument = gql`
    mutation AddDocumentFolder($payload: DocumentFolderInputType!) {
  createDocumentFolder(payload: $payload) {
    ... on DocumentFolderType {
      uid
      name
      parentUid
    }
    ... on OperationError {
      error
      suggestion
    }
  }
}
    `;

export function useAddDocumentFolderMutation() {
  return Urql.useMutation<AddDocumentFolderMutation, AddDocumentFolderMutationVariables>(AddDocumentFolderDocument);
};
export const AddDocumentDocument = gql`
    mutation AddDocument($payload: DocumentInputType!) {
  createDocument(payload: $payload) {
    ... on DocumentType {
      uid
      name
      documentId
      folderUid
      createdAt
      latestVersion {
        uid
        content
        editor
        thumbnail
      }
      createdBy {
        firstName
        lastName
      }
      updatedAt
    }
    ... on OperationError {
      error
      suggestion
    }
  }
}
    `;

export function useAddDocumentMutation() {
  return Urql.useMutation<AddDocumentMutation, AddDocumentMutationVariables>(AddDocumentDocument);
};
export const EditDocumentVersionDocument = gql`
    mutation EditDocumentVersion($uid: String!, $payload: DocumentVersionUpdateInputType!) {
  updateDocumentVersion(uid: $uid, payload: $payload) {
    ... on DocumentVersionType {
      uid
      thumbnail
    }
    ... on OperationError {
      error
      suggestion
    }
  }
}
    `;

export function useEditDocumentVersionMutation() {
  return Urql.useMutation<EditDocumentVersionMutation, EditDocumentVersionMutationVariables>(EditDocumentVersionDocument);
};