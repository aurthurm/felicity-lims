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
                return null;
            }
            const idx = this.container?.samples?.findIndex(sample => sample.storageSlotIndex === slotIndex);
            if (idx && idx > -1) {
                return this.container?.samples[idx];
            }
            return null;
        };

        return (
            <div class="bg-background max-h-[600px] overflow-y-auto rounded-lg p-4 shadow-sm">
                {[...Array(this.container?.slots ?? 0).keys()]?.map((slot, slotIdx) => {
                    return (
                        <div class="mb-2 grid w-full grid-cols-12 gap-x-4" key={slotIdx}>
                            <span class="text-muted-foreground col-span-1 my-1 text-sm font-medium">{slotIdx + 1}:</span>
                            <div
                                class={[
                                    'col-span-11 rounded-lg p-2 transition-colors duration-200',
                                    'hover:bg-muted/50 cursor-pointer',
                                    { 'bg-muted/30': slotSample(slotIdx + 1) === null },
                                    { 'bg-emerald-500/20 hover:bg-emerald-500/30': slotSample(slotIdx + 1) !== null },
                                ]}
                            >
                                <div class="text-sm font-medium">{slotSample(slotIdx + 1)?.sampleId || 'Empty'}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    },
});
export { ContainerColumn };
export default ContainerColumn;
