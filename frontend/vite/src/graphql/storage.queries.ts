import gql from 'graphql-tag'

// store room
export const GET_ALL_STORE_ROOMS = gql`
    query getAllStoreRooms {
      storeRoomAll {
        uid
        name
        description
      }
  }`;


export const GET_STORE_ROOM_BY_UID = gql`
  query getStoreRoomByUid($uid: Int!) {
    storeRoomByUid(uid: $uid){
        uid
        name
        description
    }
}`;


// storage location
export const GET_ALL_STORAGE_LOCATIONS = gql`
    query getAllStorageLocations($storeRoomUid: Int!) {
      storageLocations(storeRoomUid: $storeRoomUid) {
        uid
        name
        description
        storeRoomUid
      }
  }`;


export const GET_STORAGE_LOCATION_BY_UID = gql`
  query getStorageLocationByUid($uid: Int!) {
    storageLocationByUid(uid: $uid){
        uid
        name
        description
        storeRoomUid
    }
}`;


// storage section
export const GET_ALL_STORAGE_SECTIONS = gql`
    query getAllStorageSections($storageLocationUid: Int!) {
      storageSections(storageLocationUid: $storageLocationUid) {
        uid
        name
        description
        storageLocationUid
      }
  }`;


export const GET_STORAGE_SECTION_BY_UID = gql`
  query getStorageSectionByUid($uid: Int!) {
    storageSectionByUid(uid: $uid){
        uid
        name
        description
        storageLocationUid
    }
}`;


// storage container
export const GET_ALL_STORAGE_CONTAINERS = gql`
    query getAllStorageContainers($storageSectionUid: Int!) {
      storageContainers(storageSectionUid: $storageSectionUid) {
        uid
        name
        description
        storageSectionUid
        grid
        row_wise
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
  }`;


export const GET_STORAGE_CONTAINER_BY_UID = gql`
  query getSrorageContainerByUid($uid: Int!) {
    storageContainerByUid(uid: $uid){
        uid
        name
        description
        storageSectionUid
        grid
        row_wise
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
}`;


// storage slots
export const GET_ALL_STORAGE_SLOTS = gql`
    query getAllStorageSlots($storageContainerUid: Int!) {
      storageSlotAll(storageContainerUid: $storageContainerUid) {
        uid  
        storageContainerUid
        position
        positionLabel
        sample {
            uid
            sampleId
        }
      }
  }`;


export const GET_STORAGE_SLOT_BY_UID = gql`
  query getStorageSlotByUid($uid: Int!) {
    storageSlotByUid(uid: $uid){
        uid  
        storageContainerUid
        position
        positionLabel
        sample {
            uid
            sampleId
        }
    }
}`;
