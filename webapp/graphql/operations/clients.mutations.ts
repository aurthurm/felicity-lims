import type * as Types from '../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type AddClientMutationVariables = Types.Exact<{
  payload: Types.ClientInputType;
}>;


export type AddClientMutation = (
  { __typename?: 'Mutation' }
  & { createClient: (
    { __typename: 'ClientType' }
    & Pick<Types.ClientType, 'uid' | 'name' | 'code' | 'districtUid'>
    & { district?: Types.Maybe<(
      { __typename?: 'DistrictType' }
      & Pick<Types.DistrictType, 'uid' | 'name'>
      & { province?: Types.Maybe<(
        { __typename?: 'ProvinceType' }
        & Pick<Types.ProvinceType, 'uid' | 'name'>
        & { country?: Types.Maybe<(
          { __typename?: 'CountryType' }
          & Pick<Types.CountryType, 'uid' | 'name'>
        )> }
      )> }
    )> }
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type EditClientMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.ClientInputType;
}>;


export type EditClientMutation = (
  { __typename?: 'Mutation' }
  & { updateClient: (
    { __typename: 'ClientType' }
    & Pick<Types.ClientType, 'uid' | 'name' | 'code' | 'districtUid'>
    & { district?: Types.Maybe<(
      { __typename?: 'DistrictType' }
      & Pick<Types.DistrictType, 'uid' | 'name'>
      & { province?: Types.Maybe<(
        { __typename?: 'ProvinceType' }
        & Pick<Types.ProvinceType, 'uid' | 'name'>
        & { country?: Types.Maybe<(
          { __typename?: 'CountryType' }
          & Pick<Types.CountryType, 'uid' | 'name'>
        )> }
      )> }
    )> }
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type AddClientContactMutationVariables = Types.Exact<{
  payload: Types.ClientContactInputType;
}>;


export type AddClientContactMutation = (
  { __typename?: 'Mutation' }
  & { createClientContact: (
    { __typename: 'ClientContactType' }
    & Pick<Types.ClientContactType, 'uid' | 'firstName' | 'lastName' | 'email' | 'mobilePhone' | 'consentSms'>
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type EditClientContactMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.ClientContactInputType;
}>;


export type EditClientContactMutation = (
  { __typename?: 'Mutation' }
  & { updateClientContact: (
    { __typename: 'ClientContactType' }
    & Pick<Types.ClientContactType, 'uid' | 'firstName' | 'lastName' | 'email' | 'mobilePhone' | 'consentSms'>
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type DeleteClientContactMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type DeleteClientContactMutation = (
  { __typename?: 'Mutation' }
  & { deleteClientContact: (
    { __typename?: 'DeletedItem' }
    & Pick<Types.DeletedItem, 'uid'>
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);


export const AddClientDocument = gql`
    mutation AddClient($payload: ClientInputType!) {
  createClient(payload: $payload) {
    ... on ClientType {
      __typename
      uid
      name
      code
      districtUid
      district {
        uid
        name
        province {
          uid
          name
          country {
            uid
            name
          }
        }
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

export function useAddClientMutation() {
  return Urql.useMutation<AddClientMutation, AddClientMutationVariables>(AddClientDocument);
};
export const EditClientDocument = gql`
    mutation editClient($uid: String!, $payload: ClientInputType!) {
  updateClient(uid: $uid, payload: $payload) {
    ... on ClientType {
      __typename
      uid
      name
      code
      districtUid
      district {
        uid
        name
        province {
          uid
          name
          country {
            uid
            name
          }
        }
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

export function useEditClientMutation() {
  return Urql.useMutation<EditClientMutation, EditClientMutationVariables>(EditClientDocument);
};
export const AddClientContactDocument = gql`
    mutation AddClientContact($payload: ClientContactInputType!) {
  createClientContact(payload: $payload) {
    ... on ClientContactType {
      __typename
      uid
      firstName
      lastName
      email
      mobilePhone
      consentSms
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddClientContactMutation() {
  return Urql.useMutation<AddClientContactMutation, AddClientContactMutationVariables>(AddClientContactDocument);
};
export const EditClientContactDocument = gql`
    mutation editClientContact($uid: String!, $payload: ClientContactInputType!) {
  updateClientContact(uid: $uid, payload: $payload) {
    ... on ClientContactType {
      __typename
      uid
      firstName
      lastName
      email
      mobilePhone
      consentSms
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditClientContactMutation() {
  return Urql.useMutation<EditClientContactMutation, EditClientContactMutationVariables>(EditClientContactDocument);
};
export const DeleteClientContactDocument = gql`
    mutation deleteClientContact($uid: String!) {
  deleteClientContact(uid: $uid) {
    ... on DeletedItem {
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

export function useDeleteClientContactMutation() {
  return Urql.useMutation<DeleteClientContactMutation, DeleteClientContactMutationVariables>(DeleteClientContactDocument);
};