import { defineComponent, computed } from 'vue';
import { useStorageStore } from '@/stores/storage';

const ContainerColumn = defineComponent({
    name: 'container-column-view',
    setup(props) {
        const storageStore = useStorageStore();
        const container = computed(() => storageStore.getStorageContainer);
        return { container };
    },
    render() {

        const slotSample = (slotIndex: number) => {
            if (!this.container?.samples) {
                console.log('Samples not found in container');
                return null;
            }
            const idx = this.container?.samples?.findIndex(sample => sample.storageSlotIndex === slotIndex);
            if (idx && idx > -1) {
                return this.container?.samples[idx];
            }
            return null;
        };

        return (
            <div class="max-h-[600px] overflow-y-auto p-4 bg-background rounded-lg shadow-sm">
                {[...Array(this.container?.slots ?? 0).keys()]?.map((slot, slotIdx) => {
                    return (
                        <div class="grid grid-cols-12 gap-x-4 w-full mb-2" key={slotIdx}>
                            <span class="col-span-1 my-1 text-sm font-medium text-muted-foreground">{slotIdx + 1}:</span>
                            <div
                                class={[
                                    'col-span-11 p-2 rounded-lg transition-colors duration-200',
                                    'hover:bg-muted/50 cursor-pointer',
                                    { 'bg-muted/30': slotSample(slotIdx + 1) === null },
                                    { 'bg-emerald-500/20 hover:bg-emerald-500/30': slotSample(slotIdx + 1) !== null },
                                ]}
                            >
                                <div class="text-sm font-medium">
                                    {slotSample(slotIdx + 1)?.sampleId || 'Empty'}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    },
});
export { ContainerColumn };
export default ContainerColumn
