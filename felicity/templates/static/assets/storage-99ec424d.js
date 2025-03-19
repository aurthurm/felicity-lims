import{t as p,f as R,g,e as L,d as U,aV as h}from"./index-f86d8273.js";const s={storeRoom:"store-room",storageLocation:"storage-location",storageSection:"storage-section",storageContainer:"storage-container",containerView:"container-view"},o=R({treeData:[],activePath:{room:void 0,location:void 0,section:void 0,container:void 0},activeTree:{}});function y(){const t=e=>{o.treeData=e},n=()=>{o.activeTree={},o.activePath={}},c=e=>{o.activeTree=e,e.tag===s.storeRoom&&(o.activePath={...o.activePath,room:e.uid,location:void 0,section:void 0,container:void 0}),e.tag===s.storageLocation&&(o.activePath={...o.activePath,location:e.uid,section:void 0,container:void 0}),e.tag===s.storageSection&&(o.activePath={...o.activePath,section:e.uid,container:void 0}),e.tag===s.storageContainer&&(o.activePath={...o.activePath,container:e.uid}),S(e)},S=e=>{e.tag===s.storeRoom&&(o.treeData=[...o.treeData.map(i=>(i.uid!==e.uid?i={...i,children:i.children?.map(a=>({...a,children:a.children?.map(r=>({...r,isOpen:!1})),isOpen:!1})),isOpen:!1}:i={...i,isOpen:!i?.isOpen},i))]),e.tag===s.storageLocation&&(o.treeData=[...o.treeData.map(i=>({...i,children:i.children?.map(a=>(a.uid!==e.uid?a={...a,children:a.children?.map(r=>({...r,isOpen:!1})),isOpen:!1}:a={...a,isOpen:!a.isOpen},a))}))]),e.tag===s.storageSection&&(o.treeData=[...o.treeData.map(i=>({...i,children:i.children?.map(a=>({...a,children:a.children?.map(r=>(r.uid!==e.uid?r={...r,isOpen:!1}:r={...r,isOpen:!r.isOpen},r))}))}))])},f=e=>{o.treeData.push({...e,tag:s.storeRoom})},l=e=>{const i=o.treeData.findIndex(a=>a.uid==e.storeRoomUid);i>=-1&&(o.treeData[i].children=[...o.treeData[i].children??[],{...e,tag:s.storageLocation}])},u=e=>{const i=o.treeData.findIndex(a=>a.uid==e.storageLocation?.storeRoomUid);if(i>=-1){const a=o.treeData[i]?.children?.findIndex(r=>r.uid==e.storageLocationUid)??-1;a>-1&&(o.treeData[i].children[a].children=[...o.treeData[i].children[a].children??[],{...e,tag:s.storageSection}])}},m=e=>{const i=o.treeData.findIndex(a=>a.uid==e.storageSection?.storageLocation?.storeRoomUid);if(i>=-1){const a=o.treeData[i].children?.findIndex(r=>r.uid==e.storageSection?.storageLocationUid)??-1;if(a>-1){const r=o.treeData[i].children[a].children?.findIndex(C=>C.uid==e.storageSectionUid)??-1;r>-1&&(o.treeData[i].children[a].children[r].children=[...o.treeData[i].children[a].children[r].children??[],{...e,tag:s.storageContainer}])}}};return{...p(o),tags:s,setTree:t,setActiveTree:c,resetActiveTree:n,newStoreRoom:f,newStorageLocation:l,newStorageSection:u,newStorageContainer:m}}const D=g`
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
    `;const w=g`
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
    `;const x=g`
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
    `;const A=g`
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
    `;g`
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
    `;const v=g`
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
    `,{withClientQuery:d}=L(),{setTree:$}=y(),O=U("storage",{state:()=>({tree:[],fetchingTree:!1,storeRooms:[],fetchingStoreRooms:!1,storageLocations:[],fetchingStorageLocations:!1,storageSections:[],fetchingStorageSections:!1,storageContainers:[],fetchingStorageContainers:!1,storageContainer:void 0,fetchingStorageContainer:!1,fetchingStorageContainerSamples:!1}),getters:{getStorageTree:t=>t.tree,getStoreRooms:t=>t.storeRooms,getStorageLocations:t=>t.storageLocations,getStorageSection:t=>t.storageSections,getStorageContainers:t=>t.storageContainers,getStorageContainer:t=>t.storageContainer},actions:{async fetchStorageTree(){this.fetchingTree=!0,await d(v,{},"storeRoomAll").then(t=>{this.fetchingTree=!1,this.tree=t,$(t)}).catch(t=>this.fetchingTree=!1)},async fetchStoreRooms(){this.fetchingStoreRooms=!0,await d(D,{},"storeRoomAll").then(t=>{this.fetchingStoreRooms=!1,this.storeRooms=t}).catch(t=>this.fetchingStoreRooms=!1)},addStoreRoom(t){this.storeRooms?.unshift(t)},updateStoreRoom(t){const n=this.storeRooms?.findIndex(c=>c.uid===t?.uid);n>-1&&(this.storeRooms[n]=t)},async fetchStorageLocations(t){this.fetchingStorageLocations=!0,await d(w,{storeRoomUid:t},"storageLocationAll").then(n=>{this.fetchingStorageLocations=!1,this.storageLocations=n}).catch(n=>this.fetchingStorageLocations=!1)},addStorageLocation(t){this.storageLocations?.unshift(t)},updateStorageLocation(t){const n=this.storageLocations?.findIndex(c=>c.uid===t?.uid);n>-1&&(this.storageLocations[n]=t)},async fetchStorageSections(t){this.fetchingStorageSections=!0,await d(x,{storageSectionUid:t},"storageSectionAll").then(n=>{this.fetchingStorageSections=!1,this.storageSections=n}).catch(n=>this.fetchingStorageSections=!1)},addStorageSection(t){this.storageSections?.unshift(t)},updateStorageSection(t){const n=this.storageSections?.findIndex(c=>c.uid===t?.uid);n>-1&&(this.storageSections[n]=t)},async fetchStorageContainers(t){this.fetchingStorageContainers=!0,await d(A,{storageContainerUid:t},"storageContainerAll").then(n=>{this.fetchingStorageContainers=!1,this.storageContainers=n}).catch(n=>this.fetchingStorageContainers=!1)},addStorageContainer(t){this.storageContainers?.unshift(t)},updateStorageContainer(t){const n=this.storageContainers?.findIndex(c=>c.uid===t?.uid);n>-1&&(this.storageContainers[n]=t)},async fetchStorageContainer(t){t&&(this.fetchingStorageContainer=!0,await d(h,{uid:t},"storageContainerByUid","network-only").then(async n=>{this.fetchingStorageContainer=!1,this.storageContainer=n,await this.fetchStorageContainerSamples(t)}).catch(n=>this.fetchingStorageContainer=!1))},resetStorageContainer(){this.storageContainer=void 0},async fetchStorageContainerSamples(t){t&&(this.fetchingStorageContainerSamples=!0,await d(h,{uid:t},"samplesByStorageContainerUid","network-only").then(n=>{this.fetchingStorageContainerSamples=!1,this.storageContainer={...this.storageContainer,samples:n}}).catch(n=>this.fetchingStorageContainerSamples=!1))}}});export{O as a,y as u};
