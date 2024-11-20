import type * as Types from '../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetAllStoreRoomsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAllStoreRoomsQuery = (
  { __typename?: 'Query' }
  & { storeRoomAll: Array<(
    { __typename?: 'StoreRoomType' }
    & Pick<Types.StoreRoomType, 'uid' | 'name' | 'description'>
  )> }
);

export type GetStoreRoomByUidQueryVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type GetStoreRoomByUidQuery = (
  { __typename?: 'Query' }
  & { storeRoomByUid?: Types.Maybe<(
    { __typename?: 'StoreRoomType' }
    & Pick<Types.StoreRoomType, 'uid' | 'name' | 'description'>
  )> }
);

export type GetAllStorageLocationsQueryVariables = Types.Exact<{
  storeRoomUid: Types.Scalars['String']['input'];
}>;


export type GetAllStorageLocationsQuery = (
  { __typename?: 'Query' }
  & { storageLocations: Array<(
    { __typename?: 'StorageLocationType' }
    & Pick<Types.StorageLocationType, 'uid' | 'name' | 'description' | 'storeRoomUid'>
  )> }
);

export type GetStorageLocationByUidQueryVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type GetStorageLocationByUidQuery = (
  { __typename?: 'Query' }
  & { storageLocationByUid?: Types.Maybe<(
    { __typename?: 'StorageLocationType' }
    & Pick<Types.StorageLocationType, 'uid' | 'name' | 'description' | 'storeRoomUid'>
  )> }
);

export type GetAllStorageSectionsQueryVariables = Types.Exact<{
  storageLocationUid: Types.Scalars['String']['input'];
}>;


export type GetAllStorageSectionsQuery = (
  { __typename?: 'Query' }
  & { storageSections: Array<(
    { __typename?: 'StorageSectionType' }
    & Pick<Types.StorageSectionType, 'uid' | 'name' | 'description' | 'storageLocationUid'>
  )> }
);

export type GetStorageSectionByUidQueryVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type GetStorageSectionByUidQuery = (
  { __typename?: 'Query' }
  & { storageSectionByUid?: Types.Maybe<(
    { __typename?: 'StorageSectionType' }
    & Pick<Types.StorageSectionType, 'uid' | 'name' | 'description' | 'storageLocationUid'>
  )> }
);

export type GetAllStorageContainersQueryVariables = Types.Exact<{
  storageSectionUid: Types.Scalars['String']['input'];
}>;


export type GetAllStorageContainersQuery = (
  { __typename?: 'Query' }
  & { storageContainers: Array<(
    { __typename?: 'StorageContainerType' }
    & Pick<Types.StorageContainerType, 'uid' | 'name' | 'description' | 'storageSectionUid' | 'grid' | 'rowWise' | 'cols' | 'rows' | 'slots'>
  )> }
);

export type GetSrorageContainerByUidQueryVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type GetSrorageContainerByUidQuery = (
  { __typename?: 'Query' }
  & { storageContainerByUid?: Types.Maybe<(
    { __typename?: 'StorageContainerType' }
    & Pick<Types.StorageContainerType, 'uid' | 'name' | 'description' | 'storageSectionUid' | 'grid' | 'rowWise' | 'cols' | 'rows' | 'slots' | 'storedCount'>
  )> }
);

export type GetStoreRoomsTreeQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetStoreRoomsTreeQuery = (
  { __typename?: 'Query' }
  & { storeRoomAll: Array<(
    { __typename?: 'StoreRoomType' }
    & Pick<Types.StoreRoomType, 'uid' | 'name' | 'description' | 'tag'>
    & { children?: Types.Maybe<Array<(
      { __typename?: 'StorageLocationType' }
      & Pick<Types.StorageLocationType, 'uid' | 'name' | 'description' | 'tag'>
      & { children?: Types.Maybe<Array<(
        { __typename?: 'StorageSectionType' }
        & Pick<Types.StorageSectionType, 'uid' | 'name' | 'description' | 'tag'>
        & { children?: Types.Maybe<Array<(
          { __typename?: 'StorageContainerType' }
          & Pick<Types.StorageContainerType, 'uid' | 'name' | 'description' | 'tag'>
        )>> }
      )>> }
    )>> }
  )> }
);


export const GetAllStoreRoomsDocument = gql`
    query getAllStoreRooms {
  storeRoomAll {
    uid
    name
    description
  }
}
    `;

export function useGetAllStoreRoomsQuery(options: Omit<Urql.UseQueryArgs<never, GetAllStoreRoomsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllStoreRoomsQuery>({ query: GetAllStoreRoomsDocument, ...options });
};
export const GetStoreRoomByUidDocument = gql`
    query getStoreRoomByUid($uid: String!) {
  storeRoomByUid(uid: $uid) {
    uid
    name
    description
  }
}
    `;

export function useGetStoreRoomByUidQuery(options: Omit<Urql.UseQueryArgs<never, GetStoreRoomByUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetStoreRoomByUidQuery>({ query: GetStoreRoomByUidDocument, ...options });
};
export const GetAllStorageLocationsDocument = gql`
    query getAllStorageLocations($storeRoomUid: String!) {
  storageLocations(storeRoomUid: $storeRoomUid) {
    uid
    name
    description
    storeRoomUid
  }
}
    `;

export function useGetAllStorageLocationsQuery(options: Omit<Urql.UseQueryArgs<never, GetAllStorageLocationsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllStorageLocationsQuery>({ query: GetAllStorageLocationsDocument, ...options });
};
export const GetStorageLocationByUidDocument = gql`
    query getStorageLocationByUid($uid: String!) {
  storageLocationByUid(uid: $uid) {
    uid
    name
    description
    storeRoomUid
  }
}
    `;

export function useGetStorageLocationByUidQuery(options: Omit<Urql.UseQueryArgs<never, GetStorageLocationByUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetStorageLocationByUidQuery>({ query: GetStorageLocationByUidDocument, ...options });
};
export const GetAllStorageSectionsDocument = gql`
    query getAllStorageSections($storageLocationUid: String!) {
  storageSections(storageLocationUid: $storageLocationUid) {
    uid
    name
    description
    storageLocationUid
  }
}
    `;

export function useGetAllStorageSectionsQuery(options: Omit<Urql.UseQueryArgs<never, GetAllStorageSectionsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllStorageSectionsQuery>({ query: GetAllStorageSectionsDocument, ...options });
};
export const GetStorageSectionByUidDocument = gql`
    query getStorageSectionByUid($uid: String!) {
  storageSectionByUid(uid: $uid) {
    uid
    name
    description
    storageLocationUid
  }
}
    `;

export function useGetStorageSectionByUidQuery(options: Omit<Urql.UseQueryArgs<never, GetStorageSectionByUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetStorageSectionByUidQuery>({ query: GetStorageSectionByUidDocument, ...options });
};
export const GetAllStorageContainersDocument = gql`
    query getAllStorageContainers($storageSectionUid: String!) {
  storageContainers(storageSectionUid: $storageSectionUid) {
    uid
    name
    description
    storageSectionUid
    grid
    rowWise
    cols
    rows
    slots
  }
}
    `;

export function useGetAllStorageContainersQuery(options: Omit<Urql.UseQueryArgs<never, GetAllStorageContainersQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllStorageContainersQuery>({ query: GetAllStorageContainersDocument, ...options });
};
export const GetSrorageContainerByUidDocument = gql`
    query getSrorageContainerByUid($uid: String!) {
  storageContainerByUid(uid: $uid) {
    uid
    name
    description
    storageSectionUid
    grid
    rowWise
    cols
    rows
    slots
    storedCount
  }
}
    `;

export function useGetSrorageContainerByUidQuery(options: Omit<Urql.UseQueryArgs<never, GetSrorageContainerByUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetSrorageContainerByUidQuery>({ query: GetSrorageContainerByUidDocument, ...options });
};
export const GetStoreRoomsTreeDocument = gql`
    query getStoreRoomsTree {
  storeRoomAll {
    uid
    name
    description
    tag
    children {
      uid
      name
      description
      tag
      children {
        uid
        name
        description
        tag
        children {
          uid
          name
          description
          tag
        }
      }
    }
  }
}
    `;

export function useGetStoreRoomsTreeQuery(options: Omit<Urql.UseQueryArgs<never, GetStoreRoomsTreeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetStoreRoomsTreeQuery>({ query: GetStoreRoomsTreeDocument, ...options });
};