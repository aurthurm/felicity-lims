import { defineComponent, computed, watch } from 'vue';
import { useStorageStore } from '../../../stores';

const ContainerGrid = defineComponent({
    name:"container-grid-view",
    setup(props,){

        const storageStore = useStorageStore()
        const container =  computed(() => storageStore.getStorageContainer)
        return { container }
    },
    render(){
        if(this.container?.grid === false){
            return (<>
                <p>The selected container does not support grid view</p>
            </>)
        }
        return (
            <div class='overflow-auto'>
            {this.container?.rowWise ? (
                <>
                {[...Array(this.container?.rows ?? 0).keys()].map(row => {
                    return (
                        <div class={[true ? 'grid grid-cols-' + this.container?.cols ?? 0 : '', 'border-2']} key={row + '_x'}>
                            {[...Array(this.container?.cols ?? 0).keys()].map(col => {
                                return  (<>
                                    <div class={[
                                        'col-span-1 w-full border-l-2 p-1 text-gray-800 hover:opacity-70 hover:text-white hover:rounded-md',
                                        { 'bg-slate-400': this.container?.storageSlots![row * (this.container?.cols ?? 0) + col]?.sample === null },
                                        { 'bg-emerald-400': this.container?.storageSlots![row * (this.container?.cols ?? 0) + col]?.sample !== null },
                                    ]} key={col + '_y'}>
                                        <div class={['text-center w-full']}>
                                            { row * (this.container?.cols ?? 0) + col}
                                        </div>
                                        {this.container?.storageSlots![row * (this.container?.cols ?? 0) + col]?.sample ? (
                                            <div class="text-xs text-center">
                                                BP22-00645
                                            </div>
                                        ) : null}
                                       
                                    </div>
                                </>);
                            })}
                        </div>
                    );
                })}
                </>
            ) : (
                <>
                <div class={[true ? 'grid grid-cols-' + this.container?.cols ?? 0 : '', 'gap-2']}>
                    {[...Array(this.container?.cols ?? 0).keys()].map(col => {
                        return (
                            <div class="col-span-1" key={col + '_y'}>
                                {[...Array(this.container?.rows ?? 0).keys()].map(row => {
                                    return (
                                        <div key={row + '_x'}>
                                            <span class={['my-1 p-1 rounded-xl flex justify-center']}>
                                                ({ col * (this.container?.rows ?? 0) + row })
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
                </>
            )}
            </div>
        )
    }
});
export { ContainerGrid }


 