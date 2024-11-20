import type * as Types from '../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetAllCountriesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAllCountriesQuery = (
  { __typename?: 'Query' }
  & { countryAll: Array<(
    { __typename?: 'CountryType' }
    & Pick<Types.CountryType, 'uid' | 'name' | 'code'>
  )> }
);

export type GetAllProvincesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAllProvincesQuery = (
  { __typename?: 'Query' }
  & { provinceAll: (
    { __typename?: 'ProvinceCursorPage' }
    & Pick<Types.ProvinceCursorPage, 'totalCount'>
    & { pageInfo: (
      { __typename?: 'PageInfo' }
      & Pick<Types.PageInfo, 'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'>
    ), items?: Types.Maybe<Array<(
      { __typename?: 'ProvinceType' }
      & Pick<Types.ProvinceType, 'uid' | 'name' | 'code' | 'email' | 'emailCc' | 'businessPhone' | 'mobilePhone' | 'countryUid'>
    )>> }
  ) }
);

export type FilterProvincesByCountryQueryVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type FilterProvincesByCountryQuery = (
  { __typename?: 'Query' }
  & { provincesByCountryUid: Array<(
    { __typename?: 'ProvinceType' }
    & Pick<Types.ProvinceType, 'name' | 'uid' | 'code' | 'countryUid'>
  )> }
);

export type GetAllDistrictsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAllDistrictsQuery = (
  { __typename?: 'Query' }
  & { districtAll: (
    { __typename?: 'DistrictCursorPage' }
    & Pick<Types.DistrictCursorPage, 'totalCount'>
    & { pageInfo: (
      { __typename?: 'PageInfo' }
      & Pick<Types.PageInfo, 'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'>
    ), items?: Types.Maybe<Array<(
      { __typename?: 'DistrictType' }
      & Pick<Types.DistrictType, 'uid' | 'name' | 'code' | 'email' | 'emailCc' | 'businessPhone' | 'mobilePhone' | 'provinceUid'>
    )>> }
  ) }
);

export type FilterDistrictsByProvinceQueryVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type FilterDistrictsByProvinceQuery = (
  { __typename?: 'Query' }
  & { districtsByProvinceUid: Array<(
    { __typename?: 'DistrictType' }
    & Pick<Types.DistrictType, 'name' | 'uid' | 'code' | 'provinceUid'>
  )> }
);


export const GetAllCountriesDocument = gql`
    query getAllCountries {
  countryAll {
    uid
    name
    code
  }
}
    `;

export function useGetAllCountriesQuery(options: Omit<Urql.UseQueryArgs<never, GetAllCountriesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllCountriesQuery>({ query: GetAllCountriesDocument, ...options });
};
export const GetAllProvincesDocument = gql`
    query getAllProvinces {
  provinceAll {
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
      email
      emailCc
      businessPhone
      mobilePhone
      countryUid
    }
  }
}
    `;

export function useGetAllProvincesQuery(options: Omit<Urql.UseQueryArgs<never, GetAllProvincesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllProvincesQuery>({ query: GetAllProvincesDocument, ...options });
};
export const FilterProvincesByCountryDocument = gql`
    query filterProvincesByCountry($uid: String!) {
  provincesByCountryUid(uid: $uid) {
    name
    uid
    code
    countryUid
  }
}
    `;

export function useFilterProvincesByCountryQuery(options: Omit<Urql.UseQueryArgs<never, FilterProvincesByCountryQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<FilterProvincesByCountryQuery>({ query: FilterProvincesByCountryDocument, ...options });
};
export const GetAllDistrictsDocument = gql`
    query getAllDistricts {
  districtAll {
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
      email
      emailCc
      businessPhone
      mobilePhone
      provinceUid
    }
  }
}
    `;

export function useGetAllDistrictsQuery(options: Omit<Urql.UseQueryArgs<never, GetAllDistrictsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllDistrictsQuery>({ query: GetAllDistrictsDocument, ...options });
};
export const FilterDistrictsByProvinceDocument = gql`
    query filterDistrictsByProvince($uid: String!) {
  districtsByProvinceUid(uid: $uid) {
    name
    uid
    code
    provinceUid
  }
}
    `;

export function useFilterDistrictsByProvinceQuery(options: Omit<Urql.UseQueryArgs<never, FilterDistrictsByProvinceQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<FilterDistrictsByProvinceQuery>({ query: FilterDistrictsByProvinceDocument, ...options });
};