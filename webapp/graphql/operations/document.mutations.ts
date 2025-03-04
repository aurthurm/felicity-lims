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