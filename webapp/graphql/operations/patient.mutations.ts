import type * as Types from '../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type AddIdentificationMutationVariables = Types.Exact<{
  name: Types.Scalars['String']['input'];
}>;


export type AddIdentificationMutation = (
  { __typename?: 'Mutation' }
  & { createIdentification: (
    { __typename: 'IdentificationType' }
    & Pick<Types.IdentificationType, 'uid' | 'name'>
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type EditIdentificationMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  name: Types.Scalars['String']['input'];
}>;


export type EditIdentificationMutation = (
  { __typename?: 'Mutation' }
  & { updateIdentification: (
    { __typename: 'IdentificationType' }
    & Pick<Types.IdentificationType, 'uid' | 'name'>
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type AddPatientMutationVariables = Types.Exact<{
  payload: Types.PatientInputType;
}>;


export type AddPatientMutation = (
  { __typename?: 'Mutation' }
  & { createPatient: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'PatientType' }
    & Pick<Types.PatientType, 'uid' | 'clientPatientId' | 'patientId' | 'firstName' | 'middleName' | 'lastName' | 'age' | 'gender' | 'dateOfBirth' | 'ageDobEstimated' | 'phoneHome' | 'phoneMobile' | 'consentSms' | 'countryUid' | 'provinceUid' | 'districtUid'>
    & { client?: Types.Maybe<(
      { __typename?: 'ClientType' }
      & Pick<Types.ClientType, 'uid' | 'name'>
      & { district?: Types.Maybe<(
        { __typename?: 'DistrictType' }
        & Pick<Types.DistrictType, 'name'>
        & { province?: Types.Maybe<(
          { __typename?: 'ProvinceType' }
          & Pick<Types.ProvinceType, 'name'>
        )> }
      )> }
    )>, identifications?: Types.Maybe<Array<(
      { __typename?: 'PatientIdentificationType' }
      & Pick<Types.PatientIdentificationType, 'uid' | 'value' | 'identificationUid'>
      & { identification?: Types.Maybe<(
        { __typename?: 'IdentificationType' }
        & Pick<Types.IdentificationType, 'uid' | 'name'>
      )> }
    )>>, country?: Types.Maybe<(
      { __typename?: 'CountryType' }
      & Pick<Types.CountryType, 'uid' | 'name'>
    )>, province?: Types.Maybe<(
      { __typename?: 'ProvinceType' }
      & Pick<Types.ProvinceType, 'uid' | 'name'>
    )>, district?: Types.Maybe<(
      { __typename?: 'DistrictType' }
      & Pick<Types.DistrictType, 'uid' | 'name'>
    )> }
  ) }
);

export type EditPatientMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.PatientInputType;
}>;


export type EditPatientMutation = (
  { __typename?: 'Mutation' }
  & { updatePatient: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'PatientType' }
    & Pick<Types.PatientType, 'uid' | 'clientPatientId' | 'patientId' | 'firstName' | 'middleName' | 'lastName' | 'age' | 'gender' | 'dateOfBirth' | 'ageDobEstimated' | 'phoneHome' | 'phoneMobile' | 'consentSms' | 'countryUid' | 'provinceUid' | 'districtUid'>
    & { client?: Types.Maybe<(
      { __typename?: 'ClientType' }
      & Pick<Types.ClientType, 'uid' | 'name'>
      & { district?: Types.Maybe<(
        { __typename?: 'DistrictType' }
        & Pick<Types.DistrictType, 'name'>
        & { province?: Types.Maybe<(
          { __typename?: 'ProvinceType' }
          & Pick<Types.ProvinceType, 'name'>
        )> }
      )> }
    )>, identifications?: Types.Maybe<Array<(
      { __typename?: 'PatientIdentificationType' }
      & Pick<Types.PatientIdentificationType, 'uid' | 'value' | 'identificationUid'>
      & { identification?: Types.Maybe<(
        { __typename?: 'IdentificationType' }
        & Pick<Types.IdentificationType, 'uid' | 'name'>
      )> }
    )>>, country?: Types.Maybe<(
      { __typename?: 'CountryType' }
      & Pick<Types.CountryType, 'uid' | 'name'>
    )>, province?: Types.Maybe<(
      { __typename?: 'ProvinceType' }
      & Pick<Types.ProvinceType, 'uid' | 'name'>
    )>, district?: Types.Maybe<(
      { __typename?: 'DistrictType' }
      & Pick<Types.DistrictType, 'uid' | 'name'>
    )> }
  ) }
);


export const AddIdentificationDocument = gql`
    mutation AddIdentification($name: String!) {
  createIdentification(name: $name) {
    ... on IdentificationType {
      __typename
      uid
      name
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddIdentificationMutation() {
  return Urql.useMutation<AddIdentificationMutation, AddIdentificationMutationVariables>(AddIdentificationDocument);
};
export const EditIdentificationDocument = gql`
    mutation EditIdentification($uid: String!, $name: String!) {
  updateIdentification(uid: $uid, name: $name) {
    ... on IdentificationType {
      __typename
      uid
      name
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditIdentificationMutation() {
  return Urql.useMutation<EditIdentificationMutation, EditIdentificationMutationVariables>(EditIdentificationDocument);
};
export const AddPatientDocument = gql`
    mutation AddPatient($payload: PatientInputType!) {
  createPatient(payload: $payload) {
    ... on PatientType {
      __typename
      uid
      clientPatientId
      patientId
      firstName
      middleName
      lastName
      age
      gender
      dateOfBirth
      ageDobEstimated
      client {
        uid
        name
        district {
          name
          province {
            name
          }
        }
      }
      phoneHome
      phoneMobile
      consentSms
      identifications {
        uid
        value
        identificationUid
        identification {
          uid
          name
        }
      }
      countryUid
      country {
        uid
        name
      }
      provinceUid
      province {
        uid
        name
      }
      districtUid
      district {
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

export function useAddPatientMutation() {
  return Urql.useMutation<AddPatientMutation, AddPatientMutationVariables>(AddPatientDocument);
};
export const EditPatientDocument = gql`
    mutation EditPatient($uid: String!, $payload: PatientInputType!) {
  updatePatient(uid: $uid, payload: $payload) {
    ... on PatientType {
      __typename
      uid
      clientPatientId
      patientId
      firstName
      middleName
      lastName
      age
      gender
      dateOfBirth
      ageDobEstimated
      client {
        uid
        name
        district {
          name
          province {
            name
          }
        }
      }
      phoneHome
      phoneMobile
      consentSms
      identifications {
        uid
        value
        identificationUid
        identification {
          uid
          name
        }
      }
      countryUid
      country {
        uid
        name
      }
      provinceUid
      province {
        uid
        name
      }
      districtUid
      district {
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

export function useEditPatientMutation() {
  return Urql.useMutation<EditPatientMutation, EditPatientMutationVariables>(EditPatientDocument);
};