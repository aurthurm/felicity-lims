import { toRefs, reactive } from 'vue';
import { IStorageContainer, IStorageLocation, IStorageSection, IStoreRoom, ITreeData } from '../models/storage';
const tags = {
  storeRoom: "store-room",
  storageLocation: "storage-location",
  storageSection: "storage-section",
  storageContainer: "storage-container",
  containerView: "container-view",
}

const state = reactive<ITreeData>({
    treeData: [],
    activePath: {
        room: undefined,
        location: undefined,
        section: undefined,
        container: undefined,
    }, 
    activeTree: {} as any
});

export default function useTreeStateComposable() {

    const setTree = (treeData: IStoreRoom[]): void => {
      state.treeData = treeData
    };

    const resetActiveTree =() => {
      state.activeTree = {};
      state.activePath = {};
    }

    const setActiveTree = (activeTree: IStoreRoom | IStorageLocation | IStorageSection | IStorageContainer): void => {
      state.activeTree = activeTree;


      if (activeTree.tag === tags.storeRoom) {
        state.activePath = {...state.activePath, room: activeTree.uid, location: undefined, section: undefined, container: undefined}
      }
      if (activeTree.tag === tags.storageLocation) {
        state.activePath = {...state.activePath, location: activeTree.uid, section: undefined, container: undefined}
      }
      if (activeTree.tag === tags.storageSection) {
        state.activePath = {...state.activePath, section: activeTree.uid, container: undefined}
      }
      if (activeTree.tag === tags.storageContainer) {
        state.activePath = {...state.activePath, container: activeTree.uid}
      }
      _openTree(activeTree)
    }
    
    const _openTree = (activeTree: IStoreRoom | IStorageLocation | IStorageSection | IStorageContainer): void => {
      if (activeTree.tag === tags.storeRoom) {
        console.log(tags.storeRoom, activeTree.uid, state.treeData)
        state.treeData = [...state.treeData.map(room => {
          if(room.uid !== activeTree.uid){
            room = {...room, children: room.children?.map(location => {              
              return {...location, children: location.children?.map(section => ({...section, isOpen: false})), isOpen: false}
            }), isOpen: false}
          } else {
            room ={...room, isOpen: !room?.isOpen }
          }
          return room;
        })]
      }
      if (activeTree.tag === tags.storageLocation) {
        console.log(tags.storageLocation, activeTree.uid, state.treeData)
        state.treeData = [...state.treeData.map(room => ({...room, children: room.children?.map(location => {
          if(location.uid !== activeTree.uid){
            location = {...location, children: location.children?.map(section => ({...section, isOpen: false})), isOpen: false}
          } else {
            location = {...location, isOpen: !location.isOpen}
          }
          return location;
        })}))]
      }
      if(activeTree.tag === tags.storageSection){
        console.log(tags.storageSection, activeTree.uid, state.treeData)
        state.treeData = [...state.treeData.map(room => ({...room, children: room.children?.map(location => ({...location, children: location.children?.map(section => {
          if(section.uid !== activeTree.uid){
            section = {...section, isOpen: false }
          } else {
            section = {...section, isOpen: !section.isOpen }            
          }
          return section;
        })}))}))]
      }
    }

    const newStoreRoom = (room: IStoreRoom): void => {
      state.treeData.push({...room, tag: tags.storeRoom });
    }

    const newStorageLocation = (location: IStorageLocation): void => {
      const index =  state.treeData.findIndex(x => x.uid == location.storeRoomUid)
      if(index >= -1){
        state.treeData[index].children = [...(state.treeData[index].children ?? []), {...location, tag: tags.storageLocation }]
      }
    }

    const newStorageSection = (section: IStorageSection): void => {
      const roomIndex =  state.treeData.findIndex(x => x.uid == section.storageLocation?.storeRoomUid)
      if(roomIndex >= -1){
        const index =  state.treeData[roomIndex]?.children?.findIndex(x => x.uid == section.storageLocationUid) ?? -1 
        if(index > -1){
          state.treeData[roomIndex].children![index].children = [
            ...(state.treeData[roomIndex].children![index].children ?? []),
            {...section, tag: tags.storageSection }
          ]
        }      
      }
    }

    const newStorageContainer = (container: IStorageContainer): void => {
      const roomIndex =  state.treeData.findIndex(x => x.uid == container.storageSection?.storageLocation?.storeRoomUid)
      if(roomIndex >= -1){
        const locationIndex =  state.treeData[roomIndex]!.children?.findIndex(x => x.uid == container.storageSection?.storageLocationUid) ?? -1 
        if(locationIndex > -1){
          const index =  state.treeData[roomIndex].children![locationIndex].children?.findIndex(x => x.uid == container.storageSectionUid) ?? -1 
          if(index > -1){
            state.treeData[roomIndex].children![locationIndex].children![index].children = [
              ...(state.treeData[roomIndex].children![locationIndex].children![index].children ?? []),
              {...container, tag: tags.storageContainer }
            ]
          }
        }      
      }
    }

    return {
      ...toRefs(state),
      tags,
      setTree,
      setActiveTree,
      resetActiveTree,
      newStoreRoom,
      newStorageLocation,
      newStorageSection,
      newStorageContainer
    }
}

const exampleExpectedtree = [
  { uid: 1, name: 'Store Room 1', tag: "store-room" },
  { uid: 2, name: 'Store Room 2', tag: "store-room" },
  {
    uid: 3,
    name: 'Store Room 3',
    children: [
      {
        uid: 1,
        name: 'Freezer A',
        children: [
          {uid:3,  name: 'Rack 1',tag: "storage-section" }, 
          {
            uid:5,  
            name: 'Rack 2',
            children: [
              {uid:1,  name: 'Container SW', tag: "storage-container" },
              {uid:2,  name: 'Container DER', tag: "storage-container" },
            ],
            tag: "storage-section" 
          }
      ],
        tag: "storage-location"
      },
      {  uid: 2,name: 'Freezer B', tag: "storage-location" },
      { uid: 3, name: 'CupBoard X',  tag: "storage-location" },
      {
        uid: 4,
        name: 'CupBoard Y',
        children: [
          {uid: 1, name: 'Shelve 1',tag: "storage-section" }, 
          {uid: 2, name: 'Shelve 2',tag: "storage-section" }
        ],
        tag: "storage-location"
      }
    ], 
    tag: "store-room"
  }
]