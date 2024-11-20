import type * as Types from '../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type AddStoreRoomMutationVariables = Types.Exact<{
  payload: Types.StoreRoomInputType;
}>;


export type AddStoreRoomMutation = (
  { __typename?: 'Mutation' }
  & { createStoreRoom: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'StoreRoomType' }
    & Pick<Types.StoreRoomType, 'uid' | 'name' | 'description'>
  ) }
);

export type EditStoreRoomMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.StoreRoomInputType;
}>;


export type EditStoreRoomMutation = (
  { __typename?: 'Mutation' }
  & { updateStoreRoom: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'StoreRoomType' }
    & Pick<Types.StoreRoomType, 'uid' | 'name' | 'description'>
  ) }
);

export type AddStorageLocationMutationVariables = Types.Exact<{
  payload: Types.StorageLocationInputType;
}>;


export type AddStorageLocationMutation = (
  { __typename?: 'Mutation' }
  & { createStorageLocation: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'StorageLocationType' }
    & Pick<Types.StorageLocationType, 'uid' | 'name' | 'description' | 'storeRoomUid'>
  ) }
);

export type EditStorageLocationMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.StorageLocationInputType;
}>;


export type EditStorageLocationMutation = (
  { __typename?: 'Mutation' }
  & { updateStorageLocation: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'StorageLocationType' }
    & Pick<Types.StorageLocationType, 'uid' | 'name' | 'description' | 'storeRoomUid'>
  ) }
);

export type AddStorageSectionMutationVariables = Types.Exact<{
  payload: Types.StorageSectionInputType;
}>;


export type AddStorageSectionMutation = (
  { __typename?: 'Mutation' }
  & { createStorageSection: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'StorageSectionType' }
    & Pick<Types.StorageSectionType, 'uid' | 'name' | 'description' | 'storageLocationUid'>
    & { storageLocation?: Types.Maybe<(
      { __typename?: 'StorageLocationType' }
      & Pick<Types.StorageLocationType, 'uid' | 'storeRoomUid'>
    )> }
  ) }
);

export type EditStorageSectionMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.StorageSectionInputType;
}>;


export type EditStorageSectionMutation = (
  { __typename?: 'Mutation' }
  & { updateStorageSection: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'StorageSectionType' }
    & Pick<Types.StorageSectionType, 'uid' | 'name' | 'description' | 'storageLocationUid'>
    & { storageLocation?: Types.Maybe<(
      { __typename?: 'StorageLocationType' }
      & Pick<Types.StorageLocationType, 'uid' | 'storeRoomUid'>
    )> }
  ) }
);

export type AddStorageContainerMutationVariables = Types.Exact<{
  payload: Types.StorageContainerInputType;
}>;


export type AddStorageContainerMutation = (
  { __typename?: 'Mutation' }
  & { createStorageContainer: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'StorageContainerType' }
    & Pick<Types.StorageContainerType, 'uid' | 'name' | 'description' | 'storageSectionUid' | 'grid' | 'rowWise' | 'cols' | 'rows' | 'slots'>
    & { storageSection?: Types.Maybe<(
      { __typename?: 'StorageSectionType' }
      & Pick<Types.StorageSectionType, 'uid' | 'storageLocationUid'>
      & { storageLocation?: Types.Maybe<(
        { __typename?: 'StorageLocationType' }
        & Pick<Types.StorageLocationType, 'uid' | 'storeRoomUid'>
      )> }
    )> }
  ) }
);

export type EditStorageContainerMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.StorageContainerInputType;
}>;


export type EditStorageContainerMutation = (
  { __typename?: 'Mutation' }
  & { updateStorageContainer: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'StorageContainerType' }
    & Pick<Types.StorageContainerType, 'uid' | 'name' | 'description' | 'storageSectionUid' | 'grid' | 'rowWise' | 'cols' | 'rows' | 'slots'>
    & { storageSection?: Types.Maybe<(
      { __typename?: 'StorageSectionType' }
      & Pick<Types.StorageSectionType, 'uid' | 'storageLocationUid'>
      & { storageLocation?: Types.Maybe<(
        { __typename?: 'StorageLocationType' }
        & Pick<Types.StorageLocationType, 'uid' | 'storeRoomUid'>
      )> }
    )> }
  ) }
);

export type StoreSamplesMutationVariables = Types.Exact<{
  payload: Array<Types.StoreSamplesInputType> | Types.StoreSamplesInputType;
}>;


export type StoreSamplesMutation = (
  { __typename?: 'Mutation' }
  & { storeSamples: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'StoredSamplesType' }
    & { samples: Array<(
      { __typename?: 'SampleType' }
      & Pick<Types.SampleType, 'uid' | 'sampleId' | 'priority' | 'status' | 'storageSlot' | 'storageContainerUid'>
    )> }
  ) }
);

export type RecoverSamplesMutationVariables = Types.Exact<{
  sampleUids: Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input'];
}>;


export type RecoverSamplesMutation = (
  { __typename?: 'Mutation' }
  & { recoverSamples: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'StoredSamplesType' }
    & { samples: Array<(
      { __typename?: 'SampleType' }
      & Pick<Types.SampleType, 'uid' | 'status' | 'storageSlot' | 'storageContainerUid'>
    )> }
  ) }
);


export const AddStoreRoomDocument = gql`
    mutation AddStoreRoom($payload: StoreRoomInputType!) {
  createStoreRoom(payload: $payload) {
    ... on StoreRoomType {
      __typename
      uid
      name
      description
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddStoreRoomMutation() {
  return Urql.useMutation<AddStoreRoomMutation, AddStoreRoomMutationVariables>(AddStoreRoomDocument);
};
export const EditStoreRoomDocument = gql`
    mutation EditStoreRoom($uid: String!, $payload: StoreRoomInputType!) {
  updateStoreRoom(uid: $uid, payload: $payload) {
    ... on StoreRoomType {
      __typename
      uid
      name
      description
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditStoreRoomMutation() {
  return Urql.useMutation<EditStoreRoomMutation, EditStoreRoomMutationVariables>(EditStoreRoomDocument);
};
export const AddStorageLocationDocument = gql`
    mutation AddStorageLocation($payload: StorageLocationInputType!) {
  createStorageLocation(payload: $payload) {
    ... on StorageLocationType {
      __typename
      uid
      name
      description
      storeRoomUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddStorageLocationMutation() {
  return Urql.useMutation<AddStorageLocationMutation, AddStorageLocationMutationVariables>(AddStorageLocationDocument);
};
export const EditStorageLocationDocument = gql`
    mutation EditStorageLocation($uid: String!, $payload: StorageLocationInputType!) {
  updateStorageLocation(uid: $uid, payload: $payload) {
    ... on StorageLocationType {
      __typename
      uid
      name
      description
      storeRoomUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditStorageLocationMutation() {
  return Urql.useMutation<EditStorageLocationMutation, EditStorageLocationMutationVariables>(EditStorageLocationDocument);
};
export const AddStorageSectionDocument = gql`
    mutation AddStorageSection($payload: StorageSectionInputType!) {
  createStorageSection(payload: $payload) {
    ... on StorageSectionType {
      __typename
      uid
      name
      description
      storageLocationUid
      storageLocation {
        uid
        storeRoomUid
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

export function useAddStorageSectionMutation() {
  return Urql.useMutation<AddStorageSectionMutation, AddStorageSectionMutationVariables>(AddStorageSectionDocument);
};
export const EditStorageSectionDocument = gql`
    mutation EditStorageSection($uid: String!, $payload: StorageSectionInputType!) {
  updateStorageSection(uid: $uid, payload: $payload) {
    ... on StorageSectionType {
      __typename
      uid
      name
      description
      storageLocationUid
      storageLocation {
        uid
        storeRoomUid
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

export function useEditStorageSectionMutation() {
  return Urql.useMutation<EditStorageSectionMutation, EditStorageSectionMutationVariables>(EditStorageSectionDocument);
};
export const AddStorageContainerDocument = gql`
    mutation AddStorageContainer($payload: StorageContainerInputType!) {
  createStorageContainer(payload: $payload) {
    ... on StorageContainerType {
      __typename
      uid
      name
      description
      storageSectionUid
      storageSection {
        uid
        storageLocationUid
        storageLocation {
          uid
          storeRoomUid
        }
      }
      grid
      rowWise
      cols
      rows
      slots
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddStorageContainerMutation() {
  return Urql.useMutation<AddStorageContainerMutation, AddStorageContainerMutationVariables>(AddStorageContainerDocument);
};
export const EditStorageContainerDocument = gql`
    mutation EditStorageContainer($uid: String!, $payload: StorageContainerInputType!) {
  updateStorageContainer(uid: $uid, payload: $payload) {
    ... on StorageContainerType {
      __typename
      uid
      name
      description
      storageSectionUid
      storageSection {
        uid
        storageLocationUid
        storageLocation {
          uid
          storeRoomUid
        }
      }
      grid
      rowWise
      cols
      rows
      slots
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditStorageContainerMutation() {
  return Urql.useMutation<EditStorageContainerMutation, EditStorageContainerMutationVariables>(EditStorageContainerDocument);
};
export const StoreSamplesDocument = gql`
    mutation StoreSamples($payload: [StoreSamplesInputType!]!) {
  storeSamples(payload: $payload) {
    ... on StoredSamplesType {
      __typename
      samples {
        uid
        sampleId
        priority
        status
        storageSlot
        storageContainerUid
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

export function useStoreSamplesMutation() {
  return Urql.useMutation<StoreSamplesMutation, StoreSamplesMutationVariables>(StoreSamplesDocument);
};
export const RecoverSamplesDocument = gql`
    mutation RecoverSamples($sampleUids: [String!]!) {
  recoverSamples(sampleUids: $sampleUids) {
    ... on StoredSamplesType {
      __typename
      samples {
        uid
        status
        storageSlot
        storageContainerUid
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

export function useRecoverSamplesMutation() {
  return Urql.useMutation<RecoverSamplesMutation, RecoverSamplesMutationVariables>(RecoverSamplesDocument);
};