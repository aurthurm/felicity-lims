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
    & {
      pageInfo: (
        { __typename?: 'PageInfo' }
        & Pick<
          Types.PageInfo,
          | 'hasNextPage'
          | 'hasPreviousPage'
          | 'startCursor'
          | 'endCursor'
        >
      ),
      items?: Types.Maybe<Array<(
        { __typename?: 'InstrumentTypeType' }
        & Pick<Types.InstrumentTypeType, 'uid' | 'name' | 'description'>
      )>>,
    }
  ) }
);

export type GetAllInstrumentsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAllInstrumentsQuery = (
  { __typename?: 'Query' }
  & { instrumentAll: (
    { __typename?: 'InstrumentCursorPage' }
    & Pick<Types.InstrumentCursorPage, 'totalCount'>
    & {
      pageInfo: (
        { __typename?: 'PageInfo' }
        & Pick<
          Types.PageInfo,
          | 'hasNextPage'
          | 'hasPreviousPage'
          | 'startCursor'
          | 'endCursor'
        >
      ),
      items?: Types.Maybe<Array<(
        { __typename?: 'InstrumentType' }
        & Pick<
          Types.InstrumentType,
          | 'uid'
          | 'name'
          | 'description'
          | 'keyword'
          | 'supplierUid'
          | 'manufacturerUid'
          | 'instrumentTypeUid'
        >
        & {
          supplier?: Types.Maybe<(
            { __typename?: 'SupplierType' }
            & Pick<Types.SupplierType, 'uid' | 'name'>
          )>,
          manufacturer?: Types.Maybe<(
            { __typename?: 'ManufacturerType' }
            & Pick<Types.ManufacturerType, 'uid' | 'name'>
          )>,
          instrumentType?: Types.Maybe<(
            { __typename?: 'InstrumentTypeType' }
            & Pick<Types.InstrumentTypeType, 'uid' | 'name'>
          )>,
        }
      )>>,
    }
  ) }
);

export type GetAllLaboratoryInstrumentsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAllLaboratoryInstrumentsQuery = (
  { __typename?: 'Query' }
  & { laboratoryInstrumentAll: (
    { __typename?: 'LaboratoryInstrumentCursorPage' }
    & Pick<Types.LaboratoryInstrumentCursorPage, 'totalCount'>
    & {
      pageInfo: (
        { __typename?: 'PageInfo' }
        & Pick<
          Types.PageInfo,
          | 'hasNextPage'
          | 'hasPreviousPage'
          | 'startCursor'
          | 'endCursor'
        >
      ),
      items?: Types.Maybe<Array<(
        { __typename?: 'LaboratoryInstrumentType' }
        & Pick<
          Types.LaboratoryInstrumentType,
          | 'uid'
          | 'labName'
          | 'serialNumber'
          | 'instrumentUid'
          | 'dateCommissioned'
          | 'dateDecommissioned'
        >
        & { instrument?: Types.Maybe<(
          { __typename?: 'InstrumentType' }
          & Pick<Types.InstrumentType, 'uid' | 'name'>
        )> }
      )>>,
    }
  ) }
);

export type GetInstrumentInterfacesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetInstrumentInterfacesQuery = (
  { __typename?: 'Query' }
  & { instrumentInterfaces: Array<(
    { __typename?: 'InstrumentInterfaceType' }
    & Pick<
      Types.InstrumentInterfaceType,
      | 'uid'
      | 'laboratoryInstrumentUid'
      | 'isActive'
      | 'host'
      | 'port'
      | 'autoReconnect'
      | 'protocolType'
      | 'socketType'
      | 'connection'
      | 'transmission'
      | 'syncUnits'
      | 'driverMapping'
    >
    & { laboratoryInstrument?: Types.Maybe<(
      { __typename?: 'LaboratoryInstrumentType' }
      & Pick<Types.LaboratoryInstrumentType, 'uid' | 'labName'>
      & { instrument?: Types.Maybe<(
        { __typename?: 'InstrumentType' }
        & Pick<Types.InstrumentType, 'uid' | 'name'>
      )> }
    )> }
  )> }
);

export type GetAllMethodsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAllMethodsQuery = (
  { __typename?: 'Query' }
  & { methodAll: (
    { __typename?: 'MethodCursorPage' }
    & Pick<Types.MethodCursorPage, 'totalCount'>
    & {
      pageInfo: (
        { __typename?: 'PageInfo' }
        & Pick<
          Types.PageInfo,
          | 'hasNextPage'
          | 'hasPreviousPage'
          | 'startCursor'
          | 'endCursor'
        >
      ),
      items?: Types.Maybe<Array<(
        { __typename?: 'MethodType' }
        & Pick<
          Types.MethodType,
          | 'uid'
          | 'name'
          | 'description'
          | 'keyword'
        >
        & { instruments?: Types.Maybe<Array<(
          { __typename?: 'InstrumentType' }
          & Pick<Types.InstrumentType, 'uid' | 'name' | 'description'>
        )>> }
      )>>,
    }
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

export type ParseMessageQueryVariables = Types.Exact<{
  rawMessage: Types.Scalars['String']['input'];
}>;


export type ParseMessageQuery = (
  { __typename?: 'Query' }
  & { parseMessage: (
    { __typename?: 'ParseMessageResult' }
    & Pick<Types.ParseMessageResult, 'success' | 'parsedMessage' | 'error'>
  ) }
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

export function useGetAllSuppliersQuery(options?: Omit<Urql.UseQueryArgs<never, GetAllSuppliersQueryVariables | undefined>, 'query'>) {
  return Urql.useQuery<GetAllSuppliersQuery, GetAllSuppliersQueryVariables | undefined>({ query: GetAllSuppliersDocument, variables: undefined, ...options });
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

export function useGetAllManufacturersQuery(options?: Omit<Urql.UseQueryArgs<never, GetAllManufacturersQueryVariables | undefined>, 'query'>) {
  return Urql.useQuery<GetAllManufacturersQuery, GetAllManufacturersQueryVariables | undefined>({ query: GetAllManufacturersDocument, variables: undefined, ...options });
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

export function useGetAllInstrumentTypesQuery(options?: Omit<Urql.UseQueryArgs<never, GetAllInstrumentTypesQueryVariables | undefined>, 'query'>) {
  return Urql.useQuery<GetAllInstrumentTypesQuery, GetAllInstrumentTypesQueryVariables | undefined>({ query: GetAllInstrumentTypesDocument, variables: undefined, ...options });
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

export function useGetAllInstrumentsQuery(options?: Omit<Urql.UseQueryArgs<never, GetAllInstrumentsQueryVariables | undefined>, 'query'>) {
  return Urql.useQuery<GetAllInstrumentsQuery, GetAllInstrumentsQueryVariables | undefined>({ query: GetAllInstrumentsDocument, variables: undefined, ...options });
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

export function useGetAllLaboratoryInstrumentsQuery(options?: Omit<Urql.UseQueryArgs<never, GetAllLaboratoryInstrumentsQueryVariables | undefined>, 'query'>) {
  return Urql.useQuery<GetAllLaboratoryInstrumentsQuery, GetAllLaboratoryInstrumentsQueryVariables | undefined>({ query: GetAllLaboratoryInstrumentsDocument, variables: undefined, ...options });
};
export const GetInstrumentInterfacesDocument = gql`
    query getInstrumentInterfaces {
  instrumentInterfaces {
    uid
    laboratoryInstrumentUid
    laboratoryInstrument {
      uid
      labName
      instrument {
        uid
        name
      }
    }
    isActive
    host
    port
    autoReconnect
    protocolType
    socketType
    connection
    transmission
    syncUnits
    driverMapping
  }
}
    `;

export function useGetInstrumentInterfacesQuery(options?: Omit<Urql.UseQueryArgs<never, GetInstrumentInterfacesQueryVariables | undefined>, 'query'>) {
  return Urql.useQuery<GetInstrumentInterfacesQuery, GetInstrumentInterfacesQueryVariables | undefined>({ query: GetInstrumentInterfacesDocument, variables: undefined, ...options });
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

export function useGetAllMethodsQuery(options?: Omit<Urql.UseQueryArgs<never, GetAllMethodsQueryVariables | undefined>, 'query'>) {
  return Urql.useQuery<GetAllMethodsQuery, GetAllMethodsQueryVariables | undefined>({ query: GetAllMethodsDocument, variables: undefined, ...options });
};
export const GetAllUnitsDocument = gql`
    query getAllUnits {
  unitAll {
    uid
    name
  }
}
    `;

export function useGetAllUnitsQuery(options?: Omit<Urql.UseQueryArgs<never, GetAllUnitsQueryVariables | undefined>, 'query'>) {
  return Urql.useQuery<GetAllUnitsQuery, GetAllUnitsQueryVariables | undefined>({ query: GetAllUnitsDocument, variables: undefined, ...options });
};
export const ParseMessageDocument = gql`
    query parseMessage($rawMessage: String!) {
  parseMessage(rawMessage: $rawMessage) {
    success
    parsedMessage
    error
  }
}
    `;

export function useParseMessageQuery(options?: Omit<Urql.UseQueryArgs<never, ParseMessageQueryVariables | undefined>, 'query'>) {
  return Urql.useQuery<ParseMessageQuery, ParseMessageQueryVariables | undefined>({ query: ParseMessageDocument, variables: undefined, ...options });
};