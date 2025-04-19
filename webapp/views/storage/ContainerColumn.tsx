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
            const idx = this.container.samples?.findIndex(sample => sample.storageSlotIndex === slotIndex);
            if (idx > -1) {
                return this.container.samples[idx];
            }
            return null;
        };

        return (
            <div class="max-h-[600px] overflow-y-auto">
                {[...Array(this.container?.slots ?? 0).keys()]?.map((slot, slotIdx) => {
                    return (
                        <div class="grid grid-cols-12 gap-x-2 w-1/2" key={slotIdx}>
                            <span class="col-span-1 my-1">{slotIdx + 1}:</span>
                            <span
                                class={[
                                    'col-span-5 my-1 p-1 text-primary-foreground flex justify-center border-2',
                                    { 'bg-muted': slotSample(slotIdx + 1) === null },
                                    { 'bg-emerald-400': slotSample(slotIdx + 1) !== null },
                                ]}
                            >
                                {slotSample(slotIdx + 1)?.sampleId}
                            </span>
                        </div>
                    );
                })}
            </div>
        );
    },
});
export { ContainerColumn };
export default ContainerColumn
