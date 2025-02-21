import{H as o}from"./index-fe6b305f.js";const t=o`
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
    `,a=o`
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
    `,r=o`
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
    `,n=o`
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
    `,i=o`
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
    `,p=o`
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
    `,d=o`
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
    `,s=o`
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
    `,m=o`
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
    `,S=o`
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
    `;export{t as A,a as E,S as R,m as S,r as a,n as b,i as c,p as d,d as e,s as f};
