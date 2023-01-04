import gql from 'graphql-tag'

// store room
export const ADD_STORE_ROOM= gql`
mutation AddStoreRoom ($payload: StoreRoomInputType!) {
  createStoreRoom(payload: $payload){
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

export const EDIT_STORE_ROOM= gql`
mutation EditStoreRoom ($uid: Int!, $payload: StoreRoomInputType!) {
  updateStoreRoom(uid: $uid, payload: $payload){
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
export const ADD_STORAGE_LOCATION= gql`
mutation AddStorageLocation ($payload: StorageLocationInputType!) {
  createStorageLocation(payload: $payload){
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

export const EDIT_STORAGE_LOCATION= gql`
mutation EditStorageLocation ($uid: Int!, $payload: StorageLocationInputType!) {
  updateStorageLocation(uid: $uid, payload: $payload){
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
export const ADD_STORAGE_SECTION= gql`
mutation AddStorageSection ($payload: StorageSectionInputType!) {
  createStorageSection(payload: $payload){
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

export const EDIT_STORAGE_SECTION= gql`
mutation EditStorageSection ($uid: Int!, $payload: StorageSectionInputType!) {
  updateStorageSection(uid: $uid, payload: $payload){
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
export const ADD_STORAGE_CONTAINER= gql`
mutation AddStorageContainer ($payload: StorageContainerInputType!) {
  createStorageContainer(payload: $payload){
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
        storageSlots{
            uid
            position
        }
        samples{
            uid
            sampleId
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

export const EDIT_STORAGE_CONTAINER= gql`
mutation EditStorageContainer ($uid: Int!, $payload: StorageContainerInputType!) {
  updateStorageContainer(uid: $uid, payload: $payload){
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
        storageSlots{
            uid
            position
        }
        samples{
            uid
            sampleId
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


// storage slots
export const ADD_STORAGE_SLOT= gql`
mutation AddStorageSlot ($payload: StorageSlotInputType!) {
  createStorageSlot(payload: $payload){
    ... on StorageSlotType {
        __typename    
        uid  
        storageContainerUid
        position
        positionLabel
        sample {
            uid
            sampleId
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

export const EDIT_STORAGE_SLOT= gql`
mutation EditStorageSlot ($uid: Int!, $payload: StorageSlotInputType!) {
  updateStorageSlot(uid: $uid, payload: $payload){
    ... on StorageSlotType {
        __typename    
        uid  
        storageContainerUid
        position
        positionLabel
        sample {
            uid
            sampleId
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


// sample storage
export const STORE_SAMPLES= gql`
mutation StoreSamples ($payload: StoreSamplesInputType!) {
  storeSamples(payload: $payload){
    ... on StoredSamplesType {
        __typename    
        samples {
            uid
            sampleId
            priority
            status
            storageSlotUid
            storageSlot {
              uid
              storageContainerUid
              position
              positionLabel              
            }
            storageContainerUid
        }
        storageContainer {
            uid
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