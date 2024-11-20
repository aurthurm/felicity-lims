import type * as Types from '../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetAllSuppliersQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAllSuppliersQuery = (
  { __typename?: 'Query' }
  & { supplierAll: Array<(
    { __typename?: 'SupplierType' }
    & Pick<Types.SupplierType, 'uid' | 'name' | 'description'>
  )> }
);

export type GetAllManufacturersQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAllManufacturersQuery = (
  { __typename?: 'Query' }
  & { manufacturerAll: Array<(
    { __typename?: 'ManufacturerType' }
    & Pick<Types.ManufacturerType, 'uid' | 'name' | 'description'>
  )> }
);

export type GetAllInstrumentTypesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAllInstrumentTypesQuery = (
  { __typename?: 'Query' }
  & { instrumentTypeAll: (
    { __typename?: 'InstrumentTypeCursorPage' }
    & Pick<Types.InstrumentTypeCursorPage, 'totalCount'>
    & { pageInfo: (
      { __typename?: 'PageInfo' }
      & Pick<Types.PageInfo, 'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'>
    ), items?: Types.Maybe<Array<(
      { __typename?: 'InstrumentTypeType' }
      & Pick<Types.InstrumentTypeType, 'uid' | 'name' | 'description'>
    )>> }
  ) }
);

export type GetAllInstrumentsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAllInstrumentsQuery = (
  { __typename?: 'Query' }
  & { instrumentAll: (
    { __typename?: 'InstrumentCursorPage' }
    & Pick<Types.InstrumentCursorPage, 'totalCount'>
    & { pageInfo: (
      { __typename?: 'PageInfo' }
      & Pick<Types.PageInfo, 'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'>
    ), items?: Types.Maybe<Array<(
      { __typename?: 'InstrumentType' }
      & Pick<Types.InstrumentType, 'uid' | 'name' | 'description' | 'keyword' | 'supplierUid' | 'manufacturerUid' | 'instrumentTypeUid'>
      & { supplier?: Types.Maybe<(
        { __typename?: 'SupplierType' }
        & Pick<Types.SupplierType, 'uid' | 'name'>
      )>, manufacturer?: Types.Maybe<(
        { __typename?: 'ManufacturerType' }
        & Pick<Types.ManufacturerType, 'uid' | 'name'>
      )>, instrumentType?: Types.Maybe<(
        { __typename?: 'InstrumentTypeType' }
        & Pick<Types.InstrumentTypeType, 'uid' | 'name'>
      )> }
    )>> }
  ) }
);

export type GetAllLaboratoryInstrumentsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAllLaboratoryInstrumentsQuery = (
  { __typename?: 'Query' }
  & { laboratoryInstrumentAll: (
    { __typename?: 'LaboratoryInstrumentCursorPage' }
    & Pick<Types.LaboratoryInstrumentCursorPage, 'totalCount'>
    & { pageInfo: (
      { __typename?: 'PageInfo' }
      & Pick<Types.PageInfo, 'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'>
    ), items?: Types.Maybe<Array<(
      { __typename?: 'LaboratoryInstrumentType' }
      & Pick<Types.LaboratoryInstrumentType, 'uid' | 'labName' | 'serialNumber' | 'instrumentUid' | 'dateCommissioned' | 'dateDecommissioned'>
      & { instrument?: Types.Maybe<(
        { __typename?: 'InstrumentType' }
        & Pick<Types.InstrumentType, 'uid' | 'name'>
      )> }
    )>> }
  ) }
);

export type GetAllMethodsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAllMethodsQuery = (
  { __typename?: 'Query' }
  & { methodAll: (
    { __typename?: 'MethodCursorPage' }
    & Pick<Types.MethodCursorPage, 'totalCount'>
    & { pageInfo: (
      { __typename?: 'PageInfo' }
      & Pick<Types.PageInfo, 'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'>
    ), items?: Types.Maybe<Array<(
      { __typename?: 'MethodType' }
      & Pick<Types.MethodType, 'uid' | 'name' | 'description' | 'keyword'>
      & { instruments?: Types.Maybe<Array<(
        { __typename?: 'InstrumentType' }
        & Pick<Types.InstrumentType, 'uid' | 'name' | 'description'>
      )>> }
    )>> }
  ) }
);

export type GetAllUnitsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAllUnitsQuery = (
  { __typename?: 'Query' }
  & { unitAll: Array<(
    { __typename?: 'UnitType' }
    & Pick<Types.UnitType, 'uid' | 'name'>
  )> }
);


export const GetAllSuppliersDocument = gql`
    query getAllSuppliers {
  supplierAll {
    uid
    name
    description
  }
}
    `;

export function useGetAllSuppliersQuery(options: Omit<Urql.UseQueryArgs<never, GetAllSuppliersQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllSuppliersQuery>({ query: GetAllSuppliersDocument, ...options });
};
export const GetAllManufacturersDocument = gql`
    query getAllManufacturers {
  manufacturerAll {
    uid
    name
    description
  }
}
    `;

export function useGetAllManufacturersQuery(options: Omit<Urql.UseQueryArgs<never, GetAllManufacturersQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllManufacturersQuery>({ query: GetAllManufacturersDocument, ...options });
};
export const GetAllInstrumentTypesDocument = gql`
    query getAllInstrumentTypes {
  instrumentTypeAll {
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
      description
    }
  }
}
    `;

export function useGetAllInstrumentTypesQuery(options: Omit<Urql.UseQueryArgs<never, GetAllInstrumentTypesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllInstrumentTypesQuery>({ query: GetAllInstrumentTypesDocument, ...options });
};
export const GetAllInstrumentsDocument = gql`
    query getAllInstruments {
  instrumentAll {
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
      description
      keyword
      supplierUid
      supplier {
        uid
        name
      }
      manufacturerUid
      manufacturer {
        uid
        name
      }
      instrumentTypeUid
      instrumentType {
        uid
        name
      }
    }
  }
}
    `;

export function useGetAllInstrumentsQuery(options: Omit<Urql.UseQueryArgs<never, GetAllInstrumentsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllInstrumentsQuery>({ query: GetAllInstrumentsDocument, ...options });
};
export const GetAllLaboratoryInstrumentsDocument = gql`
    query getAllLaboratoryInstruments {
  laboratoryInstrumentAll {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    items {
      uid
      labName
      serialNumber
      instrumentUid
      instrument {
        uid
        name
      }
      dateCommissioned
      dateDecommissioned
    }
  }
}
    `;

export function useGetAllLaboratoryInstrumentsQuery(options: Omit<Urql.UseQueryArgs<never, GetAllLaboratoryInstrumentsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllLaboratoryInstrumentsQuery>({ query: GetAllLaboratoryInstrumentsDocument, ...options });
};
export const GetAllMethodsDocument = gql`
    query getAllMethods {
  methodAll {
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
      description
      keyword
      instruments {
        uid
        name
        description
      }
    }
  }
}
    `;

export function useGetAllMethodsQuery(options: Omit<Urql.UseQueryArgs<never, GetAllMethodsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllMethodsQuery>({ query: GetAllMethodsDocument, ...options });
};
export const GetAllUnitsDocument = gql`
    query getAllUnits {
  unitAll {
    uid
    name
  }
}
    `;

export function useGetAllUnitsQuery(options: Omit<Urql.UseQueryArgs<never, GetAllUnitsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllUnitsQuery>({ query: GetAllUnitsDocument, ...options });
};