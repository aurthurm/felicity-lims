import{t as u,h as R,g,f as O,d as C,aO as v}from"./index-3686e2f1.js";const s={STORE_ROOM:"store-room",STORAGE_LOCATION:"storage-location",STORAGE_SECTION:"storage-section",STORAGE_CONTAINER:"storage-container",CONTAINER_VIEW:"container-view"},r=R({treeData:[],activePath:{room:void 0,location:void 0,section:void 0,container:void 0},activeTree:{}});function A(){const e=u(r).treeData,t=u(r).activePath,c=u(r).activeTree,S=o=>{r.treeData=o},f=()=>{r.activeTree={},r.activePath={room:void 0,location:void 0,section:void 0,container:void 0}},h=o=>{switch(r.activeTree=o,o.tag){case s.STORE_ROOM:r.activePath={room:o.uid,location:void 0,section:void 0,container:void 0};break;case s.STORAGE_LOCATION:r.activePath={...r.activePath,location:o.uid,section:void 0,container:void 0};break;case s.STORAGE_SECTION:r.activePath={...r.activePath,section:o.uid,container:void 0};break;case s.STORAGE_CONTAINER:r.activePath={...r.activePath,container:o.uid};break}m(o)},m=o=>{o.uid&&(r.treeData=r.treeData.map(n=>o.tag===s.STORE_ROOM?n.uid===o.uid?{...n,isOpen:!n.isOpen}:{...n,children:n.children?.map(i=>({...i,children:i.children?.map(a=>({...a,isOpen:!1})),isOpen:!1})),isOpen:!1}:{...n,children:n.children?.map(i=>o.tag===s.STORAGE_LOCATION?i.uid===o.uid?{...i,isOpen:!i.isOpen}:{...i,children:i.children?.map(a=>({...a,isOpen:!1})),isOpen:!1}:{...i,children:i.children?.map(a=>o.tag===s.STORAGE_SECTION?a.uid===o.uid?{...a,isOpen:!a.isOpen}:{...a,isOpen:!1}:a)})}))};return{treeData:e,activePath:t,activeTree:c,tags:s,setTree:S,resetActiveTree:f,setActiveTree:h,newStoreRoom:o=>{r.treeData.push({...o,tag:s.STORE_ROOM})},newStorageLocation:o=>{const n=r.treeData.findIndex(i=>i.uid===o.storeRoomUid);n>=0&&(r.treeData[n].children=[...r.treeData[n].children??[],{...o,tag:s.STORAGE_LOCATION}])},newStorageSection:o=>{const n=r.treeData.findIndex(i=>i.uid===o.storageLocation?.storeRoomUid);if(n>=0){const i=r.treeData[n].children?.findIndex(a=>a.uid===o.storageLocationUid)??-1;i>=0&&(r.treeData[n].children[i].children=[...r.treeData[n].children[i].children??[],{...o,tag:s.STORAGE_SECTION}])}},newStorageContainer:o=>{const n=r.treeData.findIndex(i=>i.uid===o.storageSection?.storageLocation?.storeRoomUid);if(n>=0){const i=r.treeData[n].children?.findIndex(a=>a.uid===o.storageSection?.storageLocationUid)??-1;if(i>=0){const a=r.treeData[n].children[i].children?.findIndex(d=>d.uid===o.storageSectionUid)??-1;a>=0&&(r.treeData[n].children[i].children[a].children=[...r.treeData[n].children[i].children[a].children??[],{...o,tag:s.STORAGE_CONTAINER}])}}},getNodeByPath:o=>{if(!o.room)return null;const n=r.treeData.find(d=>d.uid===o.room);if(!n||!o.location)return n;const i=n.children?.find(d=>d.uid===o.location);if(!i||!o.section)return i;const a=i.children?.find(d=>d.uid===o.section);return!a||!o.container?a:a.children?.find(d=>d.uid===o.container)??null},isNodeActive:o=>{switch(o.tag){case s.STORE_ROOM:return t.value.room===o.uid;case s.STORAGE_LOCATION:return t.value.location===o.uid;case s.STORAGE_SECTION:return t.value.section===o.uid;case s.STORAGE_CONTAINER:return t.value.container===o.uid;default:return!1}}}}const I=g`
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
    `;const y=g`
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
    `;const T=g`
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
    `;const E=g`
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
    `,U=g`
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
    `,L=g`
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
    `,{withClientQuery:l}=O(),{setTree:D}=A(),B=C("storage",{state:()=>({tree:[],fetchingTree:!1,storeRooms:[],fetchingStoreRooms:!1,storageLocations:[],fetchingStorageLocations:!1,storageSections:[],fetchingStorageSections:!1,storageContainers:[],fetchingStorageContainers:!1,storageContainer:void 0,fetchingStorageContainer:!1,fetchingStorageContainerSamples:!1}),getters:{getStorageTree:e=>e.tree,getStoreRooms:e=>e.storeRooms,getStorageLocations:e=>e.storageLocations,getStorageSection:e=>e.storageSections,getStorageContainers:e=>e.storageContainers,getStorageContainer:e=>e.storageContainer},actions:{async fetchStorageTree(){try{this.fetchingTree=!0;const e=await l(L,{},"storeRoomAll");e&&Array.isArray(e)?(this.tree=e,D(e)):console.error("Invalid tree data received:",e)}catch(e){console.error("Error fetching storage tree:",e)}finally{this.fetchingTree=!1}},async fetchStoreRooms(){try{this.fetchingStoreRooms=!0;const e=await l(I,{},"storeRoomAll");e&&Array.isArray(e)?this.storeRooms=e:console.error("Invalid store rooms data received:",e)}catch(e){console.error("Error fetching store rooms:",e)}finally{this.fetchingStoreRooms=!1}},addStoreRoom(e){if(!e?.uid){console.error("Invalid store room payload:",e);return}this.storeRooms.unshift(e)},updateStoreRoom(e){if(!e?.uid){console.error("Invalid store room payload:",e);return}const t=this.storeRooms.findIndex(c=>c.uid===e.uid);t>-1&&(this.storeRooms[t]=e)},async fetchStorageLocations(e){if(!e){console.error("Store room UID is required");return}try{this.fetchingStorageLocations=!0;const t=await l(y,{storeRoomUid:e},"storageLocations");t&&Array.isArray(t)?this.storageLocations=t:console.error("Invalid storage locations data received:",t)}catch(t){console.error("Error fetching storage locations:",t)}finally{this.fetchingStorageLocations=!1}},addStorageLocation(e){if(!e?.uid){console.error("Invalid storage location payload:",e);return}this.storageLocations.unshift(e)},updateStorageLocation(e){if(!e?.uid){console.error("Invalid storage location payload:",e);return}const t=this.storageLocations.findIndex(c=>c.uid===e.uid);t>-1&&(this.storageLocations[t]=e)},async fetchStorageSections(e){if(!e){console.error("Storage location UID is required");return}try{this.fetchingStorageSections=!0;const t=await l(T,{storageLocationUid:e},"storageSections");t&&Array.isArray(t)?this.storageSections=t:console.error("Invalid storage sections data received:",t)}catch(t){console.error("Error fetching storage sections:",t)}finally{this.fetchingStorageSections=!1}},addStorageSection(e){if(!e?.uid){console.error("Invalid storage section payload:",e);return}this.storageSections.unshift(e)},updateStorageSection(e){if(!e?.uid){console.error("Invalid storage section payload:",e);return}const t=this.storageSections.findIndex(c=>c.uid===e.uid);t>-1&&(this.storageSections[t]=e)},async fetchStorageContainers(e){if(!e){console.error("Storage section UID is required");return}try{this.fetchingStorageContainers=!0;const t=await l(E,{storageSectionUid:e},"storageContainers");t&&Array.isArray(t)?this.storageContainers=t:console.error("Invalid storage containers data received:",t)}catch(t){console.error("Error fetching storage containers:",t)}finally{this.fetchingStorageContainers=!1}},addStorageContainer(e){if(!e?.uid){console.error("Invalid storage container payload:",e);return}this.storageContainers.unshift(e)},updateStorageContainer(e){if(!e?.uid){console.error("Invalid storage container payload:",e);return}const t=this.storageContainers.findIndex(c=>c.uid===e.uid);t>-1&&(this.storageContainers[t]=e)},async fetchStorageContainer(e){if(!e){console.error("Storage container UID is required");return}try{this.fetchingStorageContainer=!0;const t=await l(U,{uid:e},"storageContainerByUid","network-only");t?(this.storageContainer=t,await this.fetchStorageContainerSamples(e)):console.error("Invalid storage container data received:",t)}catch(t){console.error("Error fetching storage container:",t)}finally{this.fetchingStorageContainer=!1}},resetStorageContainer(){this.storageContainer=void 0},async fetchStorageContainerSamples(e){if(!e){console.error("Storage container UID is required");return}try{this.fetchingStorageContainerSamples=!0;const t=await l(v,{uid:e},"samplesByStorageContainerUid","network-only");this.storageContainer&&t?this.storageContainer.samples=t:console.error("Invalid storage container samples data received:",t)}catch(t){console.error("Error fetching storage container samples:",t)}finally{this.fetchingStorageContainerSamples=!1}}}});export{B as a,A as u};
