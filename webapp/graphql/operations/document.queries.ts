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