import type * as Types from '../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetAllClientsQueryVariables = Types.Exact<{
  first?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  after?: Types.InputMaybe<Types.Scalars['String']['input']>;
  text?: Types.InputMaybe<Types.Scalars['String']['input']>;
  sortBy?: Types.InputMaybe<Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input']>;
}>;


export type GetAllClientsQuery = (
  { __typename?: 'Query' }
  & { clientAll: (
    { __typename?: 'ClientCursorPage' }
    & Pick<Types.ClientCursorPage, 'totalCount'>
    & { pageInfo: (
      { __typename?: 'PageInfo' }
      & Pick<Types.PageInfo, 'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'>
    ), items?: Types.Maybe<Array<(
      { __typename?: 'ClientType' }
      & Pick<Types.ClientType, 'uid' | 'name' | 'code'>
      & { contacts?: Types.Maybe<Array<(
        { __typename?: 'ClientContactType' }
        & Pick<Types.ClientContactType, 'uid' | 'firstName' | 'lastName' | 'email' | 'mobilePhone' | 'consentSms'>
      )>>, district?: Types.Maybe<(
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
    )>> }
  ) }
);

export type SearchClientsQueryVariables = Types.Exact<{
  queryString: Types.Scalars['String']['input'];
}>;


export type SearchClientsQuery = (
  { __typename?: 'Query' }
  & { clientSearch: Array<(
    { __typename?: 'ClientType' }
    & Pick<Types.ClientType, 'uid' | 'name' | 'code'>
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
  )> }
);

export type GetClientContactsByClientUidQueryVariables = Types.Exact<{
  clientUid: Types.Scalars['String']['input'];
}>;


export type GetClientContactsByClientUidQuery = (
  { __typename?: 'Query' }
  & { clientContactByClientUid: Array<(
    { __typename?: 'ClientContactType' }
    & Pick<Types.ClientContactType, 'uid' | 'firstName' | 'lastName' | 'email' | 'mobilePhone' | 'consentSms'>
  )> }
);

export type GetClientByUidQueryVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type GetClientByUidQuery = (
  { __typename?: 'Query' }
  & { clientByUid: (
    { __typename?: 'ClientType' }
    & Pick<Types.ClientType, 'uid' | 'name' | 'code' | 'districtUid'>
    & { district?: Types.Maybe<(
      { __typename?: 'DistrictType' }
      & Pick<Types.DistrictType, 'uid' | 'name' | 'provinceUid'>
      & { province?: Types.Maybe<(
        { __typename?: 'ProvinceType' }
        & Pick<Types.ProvinceType, 'uid' | 'name' | 'countryUid'>
        & { country?: Types.Maybe<(
          { __typename?: 'CountryType' }
          & Pick<Types.CountryType, 'uid' | 'name'>
        )> }
      )> }
    )> }
  ) }
);


export const GetAllClientsDocument = gql`
    query getAllClients($first: Int, $after: String, $text: String, $sortBy: [String!] = ["uid"]) {
  clientAll(pageSize: $first, afterCursor: $after, text: $text, sortBy: $sortBy) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    items {
      uid
      name
      code
      contacts {
        uid
        firstName
        lastName
        email
        mobilePhone
        consentSms
      }
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
  }
}
    `;

export function useGetAllClientsQuery(options: Omit<Urql.UseQueryArgs<never, GetAllClientsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllClientsQuery>({ query: GetAllClientsDocument, ...options });
};
export const SearchClientsDocument = gql`
    query searchClients($queryString: String!) {
  clientSearch(queryString: $queryString) {
    uid
    name
    code
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
}
    `;

export function useSearchClientsQuery(options: Omit<Urql.UseQueryArgs<never, SearchClientsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<SearchClientsQuery>({ query: SearchClientsDocument, ...options });
};
export const GetClientContactsByClientUidDocument = gql`
    query getClientContactsByClientUid($clientUid: String!) {
  clientContactByClientUid(clientUid: $clientUid) {
    uid
    firstName
    lastName
    email
    mobilePhone
    consentSms
  }
}
    `;

export function useGetClientContactsByClientUidQuery(options: Omit<Urql.UseQueryArgs<never, GetClientContactsByClientUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetClientContactsByClientUidQuery>({ query: GetClientContactsByClientUidDocument, ...options });
};
export const GetClientByUidDocument = gql`
    query getClientByUid($uid: String!) {
  clientByUid(uid: $uid) {
    uid
    name
    code
    districtUid
    district {
      uid
      name
      provinceUid
      province {
        uid
        name
        countryUid
        country {
          uid
          name
        }
      }
    }
  }
}
    `;

export function useGetClientByUidQuery(options: Omit<Urql.UseQueryArgs<never, GetClientByUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetClientByUidQuery>({ query: GetClientByUidDocument, ...options });
};