import { toRefs, reactive } from 'vue';
const tags = {
  storeRoom: "store-room",
  storageLocation: "storage-location",
  storageSection: "storage-section",
  storageContainer: "storage-container",
}

const state = reactive({
    treeData: [
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
                      {uid:1,  name: 'Container SW',tag: "storage-container" },
                      {uid:2,  name: 'Container DER',tag: "storage-container" },
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
    ],
    activePath: {
        room: null,
        location: null,
        section: null,
        conatiner: null,
    }, 
    activeTree: {} as any
});

export default function useTreeStateComposable(){

    return {
      ...toRefs(state),
      tags,
    }
}
