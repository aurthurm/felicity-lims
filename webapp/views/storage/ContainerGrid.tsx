import { defineComponent, computed } from 'vue';
import { useStorageStore } from '@/stores/storage';

const ContainerGrid = defineComponent({
    name: 'container-grid-view',
    setup(props) {
        const storageStore = useStorageStore();
        const container = computed(() => storageStore.getStorageContainer);
        return { container };
    },
    render() {
        if (this.container?.grid === false) {
            return (
                <>
                    <p>The selected container does not support grid view</p>
                </>
            );
        }

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
            <div class="bg-background overflow-auto rounded-lg p-4 shadow-sm">
                {this.container?.rowWise ? (
                    <>
                        {[...Array(this.container?.rows ?? 0).keys()].map(row => {
                            return (
                                <div
                                    class={[
                                        true ? ('grid-cols- grid' + this.container?.cols ?? 0) : '',
                                        'border-border mb-2 rounded-lg border',
                                    ]}
                                    key={row + '_x'}
                                >
                                    {[...Array(this.container?.cols ?? 0).keys()].map(col => {
                                        return (
                                            <>
                                                <div
                                                    class={[
                                                        'border-border text-foreground col-span-1 w-full border-r p-2 transition-colors duration-200 last:border-r-0',
                                                        'hover:bg-muted/50 cursor-pointer',
                                                        {
                                                            'bg-muted/30': slotSample(row * (this.container?.cols ?? 0) + col + 1) === null,
                                                        },
                                                        {
                                                            'bg-emerald-500/20 hover:bg-emerald-500/30':
                                                                slotSample(row * (this.container?.cols ?? 0) + col + 1) !== null,
                                                        },
                                                    ]}
                                                    key={col + '_y'}
                                                >
                                                    <div class="text-center text-sm font-medium">
                                                        {row * (this.container?.cols ?? 0) + col + 1}
                                                    </div>
                                                    <div class="text-muted-foreground mt-1 text-center text-xs">
                                                        {slotSample(row * (this.container?.cols ?? 0) + col + 1)?.sampleId}
                                                    </div>
                                                </div>
                                            </>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </>
                ) : (
                    <>
                        <div class={[true ? ('grid-cols- grid' + this.container?.cols ?? 0) : '', 'gap-4']}>
                            {[...Array(this.container?.cols ?? 0).keys()].map(col => {
                                return (
                                    <div class="col-span-1 space-y-2" key={col + '_y'}>
                                        {[...Array(this.container?.rows ?? 0).keys()].map(row => {
                                            return (
                                                <div key={row + '_x'}>
                                                    <div
                                                        class={[
                                                            'rounded-lg p-2 text-center transition-colors duration-200',
                                                            'hover:bg-muted/50 cursor-pointer',
                                                            slotSample(col * (this.container?.rows ?? 0) + row + 1) === null
                                                                ? 'bg-muted/30'
                                                                : 'bg-emerald-500/20 hover:bg-emerald-500/30',
                                                        ]}
                                                    >
                                                        <span class="text-sm font-medium">
                                                            {col * (this.container?.rows ?? 0) + row + 1}
                                                        </span>
                                                        <div class="text-muted-foreground mt-1 text-xs">
                                                            {slotSample(col * (this.container?.rows ?? 0) + row + 1)?.sampleId}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        );
    },
});
export { ContainerGrid };
export default ContainerGrid;
