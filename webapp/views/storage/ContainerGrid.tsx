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
            <div class="overflow-auto p-4 bg-background rounded-lg shadow-sm">
                {this.container?.rowWise ? (
                    <>
                        {[...Array(this.container?.rows ?? 0).keys()].map(row => {
                            return (
                                <div class={[true ? 'grid grid-cols-' + this.container?.cols ?? 0 : '', 'border border-border rounded-lg mb-2']} key={row + '_x'}>
                                    {[...Array(this.container?.cols ?? 0).keys()].map(col => {
                                        return (
                                            <>
                                                <div
                                                    class={[
                                                        'col-span-1 w-full border-r border-border last:border-r-0 p-2 text-foreground transition-colors duration-200',
                                                        'hover:bg-muted/50 cursor-pointer',
                                                        {
                                                            'bg-muted/30':
                                                                slotSample(row * (this.container?.cols ?? 0) + col + 1) === null,
                                                        },
                                                        {
                                                            'bg-emerald-500/20 hover:bg-emerald-500/30':
                                                                slotSample(row * (this.container?.cols ?? 0) + col + 1) !== null,
                                                        },
                                                    ]}
                                                    key={col + '_y'}
                                                >
                                                    <div class="text-sm font-medium text-center">{row * (this.container?.cols ?? 0) + col + 1}</div>
                                                    <div class="text-xs text-center text-muted-foreground mt-1">
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
                        <div class={[true ? 'grid grid-cols-' + this.container?.cols ?? 0 : '', 'gap-4']}>
                            {[...Array(this.container?.cols ?? 0).keys()].map(col => {
                                return (
                                    <div class="col-span-1 space-y-2" key={col + '_y'}>
                                        {[...Array(this.container?.rows ?? 0).keys()].map(row => {
                                            return (
                                                <div key={row + '_x'}>
                                                    <div class={[
                                                        'p-2 rounded-lg text-center transition-colors duration-200',
                                                        'hover:bg-muted/50 cursor-pointer',
                                                        slotSample(col * (this.container?.rows ?? 0) + row + 1) === null 
                                                            ? 'bg-muted/30' 
                                                            : 'bg-emerald-500/20 hover:bg-emerald-500/30'
                                                    ]}>
                                                        <span class="text-sm font-medium">
                                                            {col * (this.container?.rows ?? 0) + row + 1}
                                                        </span>
                                                        <div class="text-xs text-muted-foreground mt-1">
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
export default ContainerGrid