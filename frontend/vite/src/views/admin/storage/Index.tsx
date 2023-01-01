import { defineComponent, computed } from 'vue'
import TreeItem from './TreeItem.vue'
import useTreeStateComposable from './tree-state'

const StorageHome = defineComponent({
  name: 'storage-home',
  setup(props, ctx) {
    const { treeData, tags, activeTree } = useTreeStateComposable()    
    const nextTreeType = computed(() => {
      if(activeTree.value?.tag === tags.storeRoom){
        return tags.storageLocation;
      }
      if(activeTree.value?.tag === tags.storageLocation){
        return tags.storageSection;
      }
      if(activeTree.value?.tag === tags.storageSection){
        return tags.storageContainer;
      }
      return null;
    })
    return { treeData, activeTree, nextTreeType, tags }
  },
  render() {
    return (
      <>
        <div class="grid grid-cols-12 gap-4 min-h-full bg-white">
          <div className="col-span-2 pt-4 pl-2">
            <ul>
              {this.treeData.map(_tree => <TreeItem tree={_tree} />)}
            </ul>
          </div>
          <div className="col-span-6 pt-4">
            <div class="mb-2">
              Selected: {this.activeTree.name}
            </div>
            <hr />
            <div class="my-4">
              {this.nextTreeType === this.tags.storageLocation ? (<>
                <button
                class="px-2 py-1 border-sky-800 border text-sky-800rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none">Add Storage Location</button>
                </>) : null}
              {this.nextTreeType === this.tags.storageSection ? (<>
                <button
                class="px-2 py-1 border-sky-800 border text-sky-800rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none">Add Storage Section</button>
                </>) : null}
              {this.nextTreeType === this.tags.storageContainer ? (<>
                <button
                class="px-2 py-1 border-sky-800 border text-sky-800rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none">Add Storage Container</button>
                </>) : null}
            </div>
            <hr />
          </div>
          <div className="col-span-4">
            properties of a selected container slot
            actions etc
          </div>
        </div>
      </>
    )
  }
})

export { StorageHome }

