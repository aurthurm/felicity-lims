import{aw as S,av as R,g,d as O,u as C,bi as A}from"./index-OdhKCqIc.js";const s={STORE_ROOM:"store-room",STORAGE_LOCATION:"storage-location",STORAGE_SECTION:"storage-section",STORAGE_CONTAINER:"storage-container",CONTAINER_VIEW:"container-view"},o=R({treeData:[],activePath:{room:void 0,location:void 0,section:void 0,container:void 0},activeTree:{}});function y(){const e=S(o).treeData,i=S(o).activePath,c=S(o).activeTree,l=t=>{o.treeData=t},f=()=>{o.activeTree={},o.activePath={room:void 0,location:void 0,section:void 0,container:void 0}},h=t=>{switch(o.activeTree=t,t.tag){case s.STORE_ROOM:o.activePath={room:t.uid,location:void 0,section:void 0,container:void 0};break;case s.STORAGE_LOCATION:o.activePath={...o.activePath,location:t.uid,section:void 0,container:void 0};break;case s.STORAGE_SECTION:o.activePath={...o.activePath,section:t.uid,container:void 0};break;case s.STORAGE_CONTAINER:o.activePath={...o.activePath,container:t.uid};break}m(t)},m=t=>{t.uid&&(o.treeData=o.treeData.map(r=>t.tag===s.STORE_ROOM?r.uid===t.uid?{...r,isOpen:!r.isOpen}:{...r,children:r.children?.map(n=>({...n,children:n.children?.map(a=>({...a,isOpen:!1})),isOpen:!1})),isOpen:!1}:{...r,children:r.children?.map(n=>t.tag===s.STORAGE_LOCATION?n.uid===t.uid?{...n,isOpen:!n.isOpen}:{...n,children:n.children?.map(a=>({...a,isOpen:!1})),isOpen:!1}:{...n,children:n.children?.map(a=>t.tag===s.STORAGE_SECTION?a.uid===t.uid?{...a,isOpen:!a.isOpen}:{...a,isOpen:!1}:a)})}))};return{treeData:e,activePath:i,activeTree:c,tags:s,setTree:l,resetActiveTree:f,setActiveTree:h,newStoreRoom:t=>{o.treeData.push({...t,tag:s.STORE_ROOM})},newStorageLocation:t=>{const r=o.treeData.findIndex(n=>n.uid===t.storeRoomUid);r>=0&&(o.treeData[r].children=[...o.treeData[r].children??[],{...t,tag:s.STORAGE_LOCATION}])},newStorageSection:t=>{const r=o.treeData.findIndex(n=>n.uid===t.storageLocation?.storeRoomUid);if(r>=0){const n=o.treeData[r].children?.findIndex(a=>a.uid===t.storageLocationUid)??-1;n>=0&&(o.treeData[r].children[n].children=[...o.treeData[r].children[n].children??[],{...t,tag:s.STORAGE_SECTION}])}},newStorageContainer:t=>{const r=o.treeData.findIndex(n=>n.uid===t.storageSection?.storageLocation?.storeRoomUid);if(r>=0){const n=o.treeData[r].children?.findIndex(a=>a.uid===t.storageSection?.storageLocationUid)??-1;if(n>=0){const a=o.treeData[r].children[n].children?.findIndex(d=>d.uid===t.storageSectionUid)??-1;a>=0&&(o.treeData[r].children[n].children[a].children=[...o.treeData[r].children[n].children[a].children??[],{...t,tag:s.STORAGE_CONTAINER}])}}},getNodeByPath:t=>{if(!t.room)return null;const r=o.treeData.find(d=>d.uid===t.room);if(!r||!t.location)return r;const n=r.children?.find(d=>d.uid===t.location);if(!n||!t.section)return n;const a=n.children?.find(d=>d.uid===t.section);return!a||!t.container?a:a.children?.find(d=>d.uid===t.container)??null},isNodeActive:t=>{switch(t.tag){case s.STORE_ROOM:return i.value.room===t.uid;case s.STORAGE_LOCATION:return i.value.location===t.uid;case s.STORAGE_SECTION:return i.value.section===t.uid;case s.STORAGE_CONTAINER:return i.value.container===t.uid;default:return!1}}}}const T=g`
    query getAllStoreRooms {
  storeRoomAll {
    uid
    name
    description
  }
}
    `;g`
    query getStoreRoomByUid($uid: String!) {
  storeRoomByUid(uid: $uid) {
    uid
    name
    description
  }
}
    `;const L=g`
    query getAllStorageLocations($storeRoomUid: String!) {
  storageLocations(storeRoomUid: $storeRoomUid) {
    uid
    name
    description
    storeRoomUid
  }
}
    `;g`
    query getStorageLocationByUid($uid: String!) {
  storageLocationByUid(uid: $uid) {
    uid
    name
    description
    storeRoomUid
  }
}
    `;const E=g`
    query getAllStorageSections($storageLocationUid: String!) {
  storageSections(storageLocationUid: $storageLocationUid) {
    uid
    name
    description
    storageLocationUid
  }
}
    `;g`
    query getStorageSectionByUid($uid: String!) {
  storageSectionByUid(uid: $uid) {
    uid
    name
    description
    storageLocationUid
  }
}
    `;const I=g`
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
    `,v=g`
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
    `,U=g`
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
    `,{withClientQuery:u}=C(),{setTree:p}=y(),$=O("storage",{state:()=>({tree:[],fetchingTree:!1,storeRooms:[],fetchingStoreRooms:!1,storageLocations:[],fetchingStorageLocations:!1,storageSections:[],fetchingStorageSections:!1,storageContainers:[],fetchingStorageContainers:!1,storageContainer:void 0,fetchingStorageContainer:!1,fetchingStorageContainerSamples:!1}),getters:{getStorageTree:e=>e.tree,getStoreRooms:e=>e.storeRooms,getStorageLocations:e=>e.storageLocations,getStorageSection:e=>e.storageSections,getStorageContainers:e=>e.storageContainers,getStorageContainer:e=>e.storageContainer},actions:{async fetchStorageTree(){try{this.fetchingTree=!0;const e=await u(U,{},"storeRoomAll");e&&Array.isArray(e)&&(this.tree=e,p(e))}catch{}finally{this.fetchingTree=!1}},async fetchStoreRooms(){try{this.fetchingStoreRooms=!0;const e=await u(T,{},"storeRoomAll");e&&Array.isArray(e)&&(this.storeRooms=e)}catch{}finally{this.fetchingStoreRooms=!1}},addStoreRoom(e){e?.uid&&this.storeRooms.unshift(e)},updateStoreRoom(e){if(!e?.uid)return;const i=this.storeRooms.findIndex(c=>c.uid===e.uid);i>-1&&(this.storeRooms[i]=e)},async fetchStorageLocations(e){if(e)try{this.fetchingStorageLocations=!0;const i=await u(L,{storeRoomUid:e},"storageLocations");i&&Array.isArray(i)&&(this.storageLocations=i)}catch{}finally{this.fetchingStorageLocations=!1}},addStorageLocation(e){e?.uid&&this.storageLocations.unshift(e)},updateStorageLocation(e){if(!e?.uid)return;const i=this.storageLocations.findIndex(c=>c.uid===e.uid);i>-1&&(this.storageLocations[i]=e)},async fetchStorageSections(e){if(e)try{this.fetchingStorageSections=!0;const i=await u(E,{storageLocationUid:e},"storageSections");i&&Array.isArray(i)&&(this.storageSections=i)}catch{}finally{this.fetchingStorageSections=!1}},addStorageSection(e){e?.uid&&this.storageSections.unshift(e)},updateStorageSection(e){if(!e?.uid)return;const i=this.storageSections.findIndex(c=>c.uid===e.uid);i>-1&&(this.storageSections[i]=e)},async fetchStorageContainers(e){if(e)try{this.fetchingStorageContainers=!0;const i=await u(I,{storageSectionUid:e},"storageContainers");i&&Array.isArray(i)&&(this.storageContainers=i)}catch{}finally{this.fetchingStorageContainers=!1}},addStorageContainer(e){e?.uid&&this.storageContainers.unshift(e)},updateStorageContainer(e){if(!e?.uid)return;const i=this.storageContainers.findIndex(c=>c.uid===e.uid);i>-1&&(this.storageContainers[i]=e)},async fetchStorageContainer(e){if(e)try{this.fetchingStorageContainer=!0;const i=await u(v,{uid:e},"storageContainerByUid","network-only");i&&(this.storageContainer=i,await this.fetchStorageContainerSamples(e))}catch{}finally{this.fetchingStorageContainer=!1}},resetStorageContainer(){this.storageContainer=void 0},async fetchStorageContainerSamples(e){if(e)try{this.fetchingStorageContainerSamples=!0;const i=await u(A,{uid:e},"samplesByStorageContainerUid","network-only");this.storageContainer&&i&&(this.storageContainer.samples=i)}catch{}finally{this.fetchingStorageContainerSamples=!1}}}});export{y as a,$ as u};
