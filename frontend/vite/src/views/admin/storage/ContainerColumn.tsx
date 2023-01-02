import { defineComponent, computed } from 'vue';
import { useStorageStore } from '../../../stores';

const ContainerColumn = defineComponent({
    name:"container-column-view",  
    setup(props,){
        const storageStore = useStorageStore()
        const container =  computed(() => storageStore.getStorageContainer)
        return { container }
    },
    render(){
        return (
            <div class="max-h-[600px] overflow-y-auto">
            {this.container?.storageSlots?.map(slot =>{
                return (
                    <div class="grid grid-cols-12 gap-x-2 w-1/2">
                        <span class="col-span-1 my-1">{ slot?.position }:</span>
                        <span class={[
                            'col-span-5 my-1 p-1 text-white flex justify-center border-2',
                            { 'bg-slate-400': slot?.sample === null },
                            { 'bg-emerald-400': slot.sample !== null },
                        ]}
                        >{ slot?.sample ? slot?.sample?.sampleId : ''}</span>
                  </div>
                )
            })}
            </div>
        )
    }
});
export { ContainerColumn }