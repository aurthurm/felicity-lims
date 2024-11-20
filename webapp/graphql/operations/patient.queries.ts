import type * as Types from '../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetAllPatientsQueryVariables = Types.Exact<{
  first: Types.Scalars['Int']['input'];
  after?: Types.InputMaybe<Types.Scalars['String']['input']>;
  before?: Types.InputMaybe<Types.Scalars['String']['input']>;
  text: Types.Scalars['String']['input'];
  sortBy?: Types.InputMaybe<Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input']>;
}>;


export type GetAllPatientsQuery = (
  { __typename?: 'Query' }
  & { patientAll: (
    { __typename?: 'PatientCursorPage' }
    & Pick<Types.PatientCursorPage, 'totalCount'>
    & { pageInfo: (
      { __typename?: 'PageInfo' }
      & Pick<Types.PageInfo, 'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'>
    ), items?: Types.Maybe<Array<(
      { __typename?: 'PatientType' }
      & Pick<Types.PatientType, 'uid' | 'clientPatientId' | 'patientId' | 'firstName' | 'middleName' | 'lastName' | 'age' | 'gender' | 'dateOfBirth' | 'ageDobEstimated' | 'clientUid' | 'phoneHome' | 'phoneMobile' | 'consentSms' | 'countryUid' | 'provinceUid' | 'districtUid'>
      & { client?: Types.Maybe<(
        { __typename?: 'ClientType' }
        & Pick<Types.ClientType, 'uid' | 'name'>
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
    )>> }
  ) }
);

export type SearchPatientsQueryVariables = Types.Exact<{
  queryString: Types.Scalars['String']['input'];
}>;


export type SearchPatientsQuery = (
  { __typename?: 'Query' }
  & { patientSearch: Array<(
    { __typename?: 'PatientType' }
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
  )> }
);

export type GetPatientByUidQueryVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type GetPatientByUidQuery = (
  { __typename?: 'Query' }
  & { patientByUid?: Types.Maybe<(
    { __typename?: 'PatientType' }
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
  )> }
);

export type IdentificationTypesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type IdentificationTypesQuery = (
  { __typename?: 'Query' }
  & { identificationAll: Array<(
    { __typename?: 'IdentificationType' }
    & Pick<Types.IdentificationType, 'uid' | 'name'>
  )> }
);


export const GetAllPatientsDocument = gql`
    query getAllPatients($first: Int!, $after: String, $before: String, $text: String!, $sortBy: [String!] = ["uid"]) {
  patientAll(
    pageSize: $first
    afterCursor: $after
    beforeCursor: $before
    text: $text
    sortBy: $sortBy
  ) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    items {
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
      clientUid
      client {
        uid
        name
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
  }
}
    `;

export function useGetAllPatientsQuery(options: Omit<Urql.UseQueryArgs<never, GetAllPatientsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllPatientsQuery>({ query: GetAllPatientsDocument, ...options });
};
export const SearchPatientsDocument = gql`
    query searchPatients($queryString: String!) {
  patientSearch(queryString: $queryString) {
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
}
    `;

export function useSearchPatientsQuery(options: Omit<Urql.UseQueryArgs<never, SearchPatientsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<SearchPatientsQuery>({ query: SearchPatientsDocument, ...options });
};
export const GetPatientByUidDocument = gql`
    query getPatientByUid($uid: String!) {
  patientByUid(uid: $uid) {
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
}
    `;

export function useGetPatientByUidQuery(options: Omit<Urql.UseQueryArgs<never, GetPatientByUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetPatientByUidQuery>({ query: GetPatientByUidDocument, ...options });
};
export const IdentificationTypesDocument = gql`
    query identificationTypes {
  identificationAll {
    uid
    name
  }
}
    `;

export function useIdentificationTypesQuery(options: Omit<Urql.UseQueryArgs<never, IdentificationTypesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<IdentificationTypesQuery>({ query: IdentificationTypesDocument, ...options });
};