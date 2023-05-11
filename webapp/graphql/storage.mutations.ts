import gql from 'graphql-tag';

// store room
export const ADD_STORE_ROOM = gql`
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

export const EDIT_STORE_ROOM = gql`
    mutation EditStoreRoom($uid: str!, $payload: StoreRoomInputType!) {
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

// storage location
export const ADD_STORAGE_LOCATION = gql`
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

export const EDIT_STORAGE_LOCATION = gql`
    mutation EditStorageLocation($uid: str!, $payload: StorageLocationInputType!) {
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

// storage section
export const ADD_STORAGE_SECTION = gql`
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

export const EDIT_STORAGE_SECTION = gql`
    mutation EditStorageSection($uid: str!, $payload: StorageSectionInputType!) {
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

// storage container
export const ADD_STORAGE_CONTAINER = gql`
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

export const EDIT_STORAGE_CONTAINER = gql`
    mutation EditStorageContainer($uid: str!, $payload: StorageContainerInputType!) {
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

// sample storage
export const STORE_SAMPLES = gql`
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

export const RECOVER_SAMPLES = gql`
    mutation RecoverSamples($sampleUids: [str!]!) {
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
