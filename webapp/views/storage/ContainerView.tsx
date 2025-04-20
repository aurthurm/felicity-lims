import React from 'react';
import { defineComponent, computed, ref, defineAsyncComponent } from 'vue';
import { useStorageStore } from '@/stores/storage';

const ContainerColumn = defineAsyncComponent(
    () => import("./ContainerColumn")
)
const ContainerGrid = defineAsyncComponent(
    () => import("./ContainerGrid")
)

const ContainerView = defineComponent({
    name: 'contaner-view',
    setup(props, ctx) {
        const storageStore = useStorageStore();

        let currentTab = ref('column-view');

        const tabs = computed(() => {
            const cont = storageStore.getStorageContainer;
            return cont?.grid ? ['column-view', 'grid-view'] : ['column-view'];
        });

        return {
            currentTab,
            tabs,
            storageContainer: computed(() => storageStore.getStorageContainer),
        };
    },
    render() {
        return (
            <>
                <div class="space-y-6">
                    <div class="grid grid-cols-2 gap-6">
                        <div class="col-span-1 space-y-4">
                            <div class="flex items-center">
                                <span class="text-foreground text-md font-bold w-52">Name:</span>
                                <span class="text-foreground text-md">{this.storageContainer?.name}</span>
                            </div>
                            <div class="flex items-center">
                                <span class="text-foreground text-md font-bold w-52">Layout:</span>
                                <span class="text-foreground text-md">{this.storageContainer?.grid ? 'grid' : 'column'}</span>
                                {this.storageContainer?.grid ? (
                                    <span class="ml-2 text-foreground text-md italic bg-muted px-2 py-1 rounded-md">
                                        {this.storageContainer?.rowWise ? 'by-row' : 'by-column'}
                                    </span>
                                ) : null}
                            </div>
                        </div>
                        <div class="col-span-1 space-y-4">
                            <div class="flex items-center">
                                <span class="text-foreground text-md font-bold w-52">Slots:</span>
                                <span class="text-foreground text-md">{this.storageContainer?.slots}</span>
                            </div>
                            <div class="flex items-center">
                                <span class="text-foreground text-md font-bold w-52">Empty Slots:</span>
                                <span class="text-foreground text-md">
                                    {(this.storageContainer?.slots ?? 0) - (this.storageContainer?.samples?.length ?? 0)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="mt-6">
                        <div class="bg-background border rounded-lg shadow-sm" role="tablist">
                            <div class="flex">
                                {this.tabs.map(tab => {
                                    const isSelected = this.currentTab === tab;
                                    return (
                                        <button
                                            key={tab}
                                            class={[
                                                'flex-1 text-center py-3 px-4 text-sm font-medium transition-colors',
                                                'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                                                isSelected
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                            ]}
                                            onClick={() => (this.currentTab = tab)}
                                            role="tab"
                                            aria-selected={isSelected ? "true" : "false"}
                                            aria-controls={`${tab}-panel`}
                                        >
                                            {tab}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <div class="mt-4" role="tabpanel" id={`${this.currentTab}-panel`}>
                            {this.currentTab === 'column-view' ? <ContainerColumn /> : null}
                            {this.currentTab === 'grid-view' ? <ContainerGrid /> : null}
                        </div>
                    </div>
                </div>
            </>
        );
    },
});

export { ContainerView };
export default ContainerView