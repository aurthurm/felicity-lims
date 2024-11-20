import type * as Types from '../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type AddCountryMutationVariables = Types.Exact<{
  payload: Types.CountryInputType;
}>;


export type AddCountryMutation = (
  { __typename?: 'Mutation' }
  & { createCountry: (
    { __typename: 'CountryType' }
    & Pick<Types.CountryType, 'uid' | 'name' | 'code'>
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type EditCountryMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.CountryInputType;
}>;


export type EditCountryMutation = (
  { __typename?: 'Mutation' }
  & { updateCountry: (
    { __typename: 'CountryType' }
    & Pick<Types.CountryType, 'uid' | 'name' | 'code'>
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type AddProvinceMutationVariables = Types.Exact<{
  payload: Types.ProvinceInputType;
}>;


export type AddProvinceMutation = (
  { __typename?: 'Mutation' }
  & { createProvince: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'ProvinceType' }
    & Pick<Types.ProvinceType, 'uid' | 'name' | 'code' | 'countryUid'>
  ) }
);

export type EditProvinceMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.ProvinceInputType;
}>;


export type EditProvinceMutation = (
  { __typename?: 'Mutation' }
  & { updateProvince: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'ProvinceType' }
    & Pick<Types.ProvinceType, 'uid' | 'name' | 'code' | 'countryUid'>
  ) }
);

export type AddDistrictMutationVariables = Types.Exact<{
  payload: Types.DistrictInputType;
}>;


export type AddDistrictMutation = (
  { __typename?: 'Mutation' }
  & { createDistrict: (
    { __typename: 'DistrictType' }
    & Pick<Types.DistrictType, 'uid' | 'name' | 'code' | 'provinceUid'>
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type EditDistrictMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.DistrictInputType;
}>;


export type EditDistrictMutation = (
  { __typename?: 'Mutation' }
  & { updateDistrict: (
    { __typename: 'DistrictType' }
    & Pick<Types.DistrictType, 'uid' | 'name' | 'code' | 'provinceUid'>
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);


export const AddCountryDocument = gql`
    mutation AddCountry($payload: CountryInputType!) {
  createCountry(payload: $payload) {
    ... on CountryType {
      __typename
      uid
      name
      code
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddCountryMutation() {
  return Urql.useMutation<AddCountryMutation, AddCountryMutationVariables>(AddCountryDocument);
};
export const EditCountryDocument = gql`
    mutation EditCountry($uid: String!, $payload: CountryInputType!) {
  updateCountry(uid: $uid, payload: $payload) {
    ... on CountryType {
      __typename
      uid
      name
      code
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditCountryMutation() {
  return Urql.useMutation<EditCountryMutation, EditCountryMutationVariables>(EditCountryDocument);
};
export const AddProvinceDocument = gql`
    mutation AddProvince($payload: ProvinceInputType!) {
  createProvince(payload: $payload) {
    ... on ProvinceType {
      __typename
      uid
      name
      code
      countryUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddProvinceMutation() {
  return Urql.useMutation<AddProvinceMutation, AddProvinceMutationVariables>(AddProvinceDocument);
};
export const EditProvinceDocument = gql`
    mutation EditProvince($uid: String!, $payload: ProvinceInputType!) {
  updateProvince(uid: $uid, payload: $payload) {
    ... on ProvinceType {
      __typename
      uid
      name
      code
      countryUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditProvinceMutation() {
  return Urql.useMutation<EditProvinceMutation, EditProvinceMutationVariables>(EditProvinceDocument);
};
export const AddDistrictDocument = gql`
    mutation AddDistrict($payload: DistrictInputType!) {
  createDistrict(payload: $payload) {
    ... on DistrictType {
      __typename
      uid
      name
      code
      provinceUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddDistrictMutation() {
  return Urql.useMutation<AddDistrictMutation, AddDistrictMutationVariables>(AddDistrictDocument);
};
export const EditDistrictDocument = gql`
    mutation EditDistrict($uid: String!, $payload: DistrictInputType!) {
  updateDistrict(uid: $uid, payload: $payload) {
    ... on DistrictType {
      __typename
      uid
      name
      code
      provinceUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditDistrictMutation() {
  return Urql.useMutation<EditDistrictMutation, EditDistrictMutationVariables>(EditDistrictDocument);
};