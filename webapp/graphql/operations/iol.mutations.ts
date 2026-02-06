import type * as Types from '../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type ParseAnalyserMessageMutationVariables = Types.Exact<{
  message: Types.Scalars['String']['input'];
}>;


export type ParseAnalyserMessageMutation = (
  { __typename?: 'Mutation' }
  & { parseAnalyserMessage:
    | (
      { __typename: 'AnalyzerParsedMessageType' }
      & Pick<Types.AnalyzerParsedMessageType, 'message' | 'seperators'>
    )
    | (
      { __typename: 'OperationError' }
      & Pick<Types.OperationError, 'error' | 'suggestion'>
    )
   }
);

export type ExtractAnalyserMessageMutationVariables = Types.Exact<{
  message: Types.Scalars['String']['input'];
  driver: Types.Scalars['JSONScalar']['input'];
}>;


export type ExtractAnalyserMessageMutation = (
  { __typename?: 'Mutation' }
  & { extractAnalyserMessage:
    | (
      { __typename: 'AnalyzerExtractedMessageType' }
      & Pick<Types.AnalyzerExtractedMessageType, 'message'>
    )
    | (
      { __typename: 'OperationError' }
      & Pick<Types.OperationError, 'error' | 'suggestion'>
    )
   }
);


export const ParseAnalyserMessageDocument = gql`
    mutation ParseAnalyserMessage($message: String!) {
  parseAnalyserMessage(message: $message) {
    ... on AnalyzerParsedMessageType {
      __typename
      message
      seperators
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useParseAnalyserMessageMutation() {
  return Urql.useMutation<ParseAnalyserMessageMutation, ParseAnalyserMessageMutationVariables>(ParseAnalyserMessageDocument);
};
export const ExtractAnalyserMessageDocument = gql`
    mutation ExtractAnalyserMessage($message: String!, $driver: JSONScalar!) {
  extractAnalyserMessage(message: $message, driver: $driver) {
    ... on AnalyzerExtractedMessageType {
      __typename
      message
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useExtractAnalyserMessageMutation() {
  return Urql.useMutation<ExtractAnalyserMessageMutation, ExtractAnalyserMessageMutationVariables>(ExtractAnalyserMessageDocument);
};