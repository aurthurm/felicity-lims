import { defineComponent, computed, reactive, toRefs, ref, watch, defineAsyncComponent } from 'vue';
import { Checkbox } from '@/components/ui/checkbox';
import useTreeStateComposable from '@/composables/tree-state';
import Modal from '@/components/ui/Modal.vue';
import {
    StorageContainerInputType,
    StorageContainerType,
    StorageLocationInputType,
    StorageLocationType,
    StorageSectionInputType,
    StorageSectionType,
    StoreRoomInputType,
    StoreRoomType,
} from '@/types/gql';
import {
    AddStoreRoomDocument,
    AddStoreRoomMutationVariables,
    AddStoreRoomMutation,
    EditStoreRoomDocument,
    EditStoreRoomMutationVariables,
    EditStoreRoomMutation,
    AddStorageLocationDocument,
    AddStorageLocationMutationVariables,
    AddStorageLocationMutation,
    EditStorageLocationDocument,
    EditStorageLocationMutationVariables,
    EditStorageLocationMutation,
    AddStorageSectionDocument,
    AddStorageSectionMutationVariables,
    AddStorageSectionMutation,
    EditStorageSectionDocument,
    EditStorageSectionMutationVariables,
    EditStorageSectionMutation,
    AddStorageContainerDocument,
    AddStorageContainerMutationVariables,
    AddStorageContainerMutation,
    EditStorageContainerDocument,
    EditStorageContainerMutationVariables,
    EditStorageContainerMutation,
} from '@/graphql/operations/storage.mutations';
import { useStorageStore } from '@/stores/storage';
import useApiUtil from '@/composables/api_util';
import { useRouter } from 'vue-router';
import PageHeading from '@/components/common/PageHeading.vue';
const ContainerView = defineAsyncComponent(() => import('./ContainerView'));
const TreeItem = defineAsyncComponent(() => import('@/components/storage/TreeItem.vue'));

const StorageHome = defineComponent({
    name: 'storage-home',
    setup(props, ctx) {
        const { treeData, tags, activeTree, newStoreRoom, newStorageLocation, newStorageSection, newStorageContainer, setActiveTree } =
            useTreeStateComposable();
        const router = useRouter();
        const storageStore = useStorageStore();
        const { withClientMutation } = useApiUtil();

        storageStore.fetchStorageTree();
        watch(
            () => activeTree.value,
            (treeIn, _) => {
                if (!treeIn) return;
                if (treeIn.tag === tags.STORAGE_CONTAINER) {
                    storageStore.fetchStorageContainer(treeIn.uid!);
                }
            },
        );

        watch(
            () => treeData.value,
            (dataIn, _) => {
                if (!dataIn) return;
                const routerState = router?.options?.history?.state;
                if (routerState?.sample) {
                    const sample = JSON.parse(routerState?.sample as string);
                    const sc = sample?.storageContainer;
                    const ss = sc?.storageSection;
                    const sl = ss?.storageLocation;
                    const sr = sl?.storeRoom;
                    setActiveTree({ ...sr, tag: tags.STORE_ROOM });
                    setActiveTree({ ...sl, tag: tags.STORAGE_LOCATION });
                    setActiveTree({ ...ss, tag: tags.STORAGE_SECTION });
                    setActiveTree({ ...sc, tag: tags.STORAGE_CONTAINER });
                }
            },
        );

        const nextTreeType = computed(() => {
            if (activeTree.value?.tag === tags.STORE_ROOM) {
                return tags.STORAGE_LOCATION;
            }
            if (activeTree.value?.tag === tags.STORAGE_LOCATION) {
                return tags.STORAGE_SECTION;
            }
            if (activeTree.value?.tag === tags.STORAGE_SECTION) {
                return tags.STORAGE_CONTAINER;
            }
            if (activeTree.value?.tag === tags.STORAGE_CONTAINER) {
                return tags.CONTAINER_VIEW;
            }
            return null;
        });

        const state = reactive({
            roomModalShow: false,
            roomFormTitle: '',
            roomForm: {} as StoreRoomType,
            roomFormAction: true,
            locationModalShow: false,
            locationFormTitle: '',
            locationForm: {} as StorageLocationType,
            locationFormAction: true,
            sectionModalShow: false,
            sectionFormTitle: '',
            sectionForm: {} as StorageSectionType,
            sectionFormAction: true,
            containerModalShow: false,
            containerFormTitle: '',
            containerForm: {} as StorageContainerType,
            containerFormAction: true,
        });

        // Store Room
        function addStoreRoom(): void {
            const payload = { ...state.roomForm } as StoreRoomInputType;
            withClientMutation<AddStoreRoomMutation, AddStoreRoomMutationVariables>(
                AddStoreRoomDocument,
                { payload },
                'createStoreRoom',
            ).then(result => {
                storageStore.addStoreRoom(result);
                newStoreRoom(result);
            });
        }

        function editStoreRoom(): void {
            const payload = {
                name: state.roomForm.name,
                description: state.roomForm.description,
            } as StoreRoomInputType;
            withClientMutation<EditStoreRoomMutation, EditStoreRoomMutationVariables>(
                EditStoreRoomDocument,
                { uid: state.roomForm.uid, payload },
                'updateStoreRoom',
            ).then(result => storageStore.updateStoreRoom(result));
        }

        function roomFormManager(create: boolean, obj: StoreRoomType | null): void {
            state.roomFormAction = create;
            state.roomFormTitle = (create ? 'CREATE' : 'EDIT') + ' ' + 'A STORE ROOM';
            state.roomModalShow = true;
            if (create) {
                Object.assign(state.roomForm, {} as StoreRoomType);
            } else {
                Object.assign(state.roomForm, { ...obj });
            }
        }

        function saveStoreRoomForm(): void {
            if (state.roomFormAction === true) addStoreRoom();
            if (state.roomFormAction === false) editStoreRoom();
            state.roomModalShow = false;
        }

        // Storage Location
        function addStorageLocation(): void {
            const payload = { ...state.locationForm, storeRoomUid: activeTree.value.uid };
            withClientMutation<AddStorageLocationMutation, AddStorageLocationMutationVariables>(
                AddStorageLocationDocument,
                { payload },
                'createStorageLocation',
            ).then(result => {
                storageStore.addStorageLocation(result);
                newStorageLocation(result);
            });
        }

        function editStorageLocation(): void {
            const payload = {
                name: state.locationForm.name,
                description: state.locationForm.description,
            } as StorageLocationInputType;
            withClientMutation<EditStorageLocationMutation, EditStorageLocationMutationVariables>(
                EditStorageLocationDocument,
                { uid: state.locationForm.uid, payload },
                'updateStorageLocation',
            ).then(result => storageStore.updateStorageLocation(result));
        }

        function locationFormManager(create: boolean, obj: StorageLocationType | null): void {
            state.locationFormAction = create;
            state.locationFormTitle = (create ? 'CREATE' : 'EDIT') + ' ' + 'A STORAGE LOCATION';
            state.locationModalShow = true;
            if (create) {
                Object.assign(state.locationForm, {} as StorageLocationType);
            } else {
                Object.assign(state.locationForm, { ...obj });
            }
        }

        function saveLocationForm(): void {
            if (state.locationFormAction === true) addStorageLocation();
            if (state.locationFormAction === false) editStorageLocation();
            state.locationModalShow = false;
        }

        // Storage Section
        function addStorageSection(): void {
            const payload = { ...state.sectionForm, storageLocationUid: activeTree.value.uid };
            withClientMutation<AddStorageSectionMutation, AddStorageSectionMutationVariables>(
                AddStorageSectionDocument,
                { payload },
                'createStorageSection',
            ).then(result => {
                storageStore.addStorageSection(result);
                newStorageSection(result);
            });
        }

        function editStorageSection(): void {
            const payload = {
                name: state.sectionForm.name,
                description: state.sectionForm.description,
            } as StorageSectionInputType;
            withClientMutation<EditStorageSectionMutation, EditStorageSectionMutationVariables>(
                EditStorageSectionDocument,
                { uid: state.sectionForm.uid, payload },
                'updateStorageSection',
            ).then(result => storageStore.updateStorageSection(result));
        }

        function sectionFormManager(create: boolean, obj: StorageSectionType | null): void {
            state.sectionFormAction = create;
            state.sectionFormTitle = (create ? 'CREATE' : 'EDIT') + ' ' + 'A STORAGE SECTION';
            state.sectionModalShow = true;
            if (create) {
                Object.assign(state.sectionForm, {} as StorageSectionType);
            } else {
                Object.assign(state.sectionForm, { ...obj });
            }
        }

        function saveStorageSectionForm(): void {
            if (state.sectionFormAction === true) addStorageSection();
            if (state.sectionFormAction === false) editStorageSection();
            state.sectionModalShow = false;
        }

        // Storage Container
        function addStorageContainer(): void {
            const payload = { ...state.containerForm, storageSectionUid: activeTree.value.uid };
            withClientMutation<AddStorageContainerMutation, AddStorageContainerMutationVariables>(
                AddStorageContainerDocument,
                { payload },
                'createStorageContainer',
            ).then(result => {
                storageStore.addStorageContainer(result);
                newStorageContainer(result);
            });
        }

        function editStorageContainer(): void {
            const payload = {
                name: state.containerForm.name,
                description: state.containerForm.description,
            } as StorageContainerInputType;
            withClientMutation<EditStorageContainerMutation, EditStorageContainerMutationVariables>(
                EditStorageContainerDocument,
                { uid: state.containerForm.uid, payload },
                'updateStorageContainer',
            ).then(result => storageStore.updateStorageContainer(result));
        }

        function containerFormManager(create: boolean, obj: StorageContainerType | null): void {
            state.containerFormAction = create;
            state.containerFormTitle = (create ? 'CREATE' : 'EDIT') + ' ' + 'A STORAGE CONTAINER';
            state.containerModalShow = true;
            if (create) {
                Object.assign(state.containerForm, {} as StorageContainerType);
            } else {
                Object.assign(state.containerForm, { ...obj });
            }
        }

        function saveStorageContainerForm(): void {
            if (state.containerFormAction === true) addStorageContainer();
            if (state.containerFormAction === false) editStorageContainer();
            state.containerModalShow = false;
        }

        //
        function calculateRows(event): void {
            if (state.containerForm.grid === true) {
                state.containerForm.rows = Math.ceil(state.containerForm?.slots! / state.containerForm?.cols!);
            }
        }

        function changeContainerType(event): void {
            if (state.containerForm.grid == false) {
                state.containerForm.cols = undefined;
                state.containerForm.rows = undefined;
            }
        }

        return {
            ...toRefs(state),
            treeData,
            activeTree,
            nextTreeType,
            tags,
            saveStoreRoomForm,
            roomFormManager,
            locationFormManager,
            saveLocationForm,
            saveStorageSectionForm,
            sectionFormManager,
            saveStorageContainerForm,
            containerFormManager,
            calculateRows,
            changeContainerType,
        };
    },
    render() {
        return (
            <>
                <PageHeading title="Storage">
                    <button
                        onClick={() => this.roomFormManager(true, null)}
                        class="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary w-full rounded-md px-4 py-2 transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none"
                    >
                        Add Store Room
                    </button>
                </PageHeading>

                <div class="bg-background grid min-h-full grid-cols-12 gap-6 p-6">
                    <div class="col-span-2 space-y-4">
                        <ul class="space-y-2">
                            {this.treeData.map(_tree => (
                                <TreeItem tree={_tree} />
                            ))}
                        </ul>
                    </div>
                    {this.activeTree?.name && (
                        <div class="col-span-10 space-y-6">
                            <div class="text-foreground text-lg font-medium">Selected: {this.activeTree.name}</div>
                            <div class="border-border border-t" />
                            <div class="space-y-6">
                                {this.nextTreeType === this.tags.STORAGE_LOCATION ? (
                                    <button
                                        onClick={() => this.locationFormManager(true, null)}
                                        class="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary rounded-md px-4 py-2 transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none"
                                    >
                                        Add Storage Location
                                    </button>
                                ) : null}
                                {this.nextTreeType === this.tags.STORAGE_SECTION ? (
                                    <button
                                        onClick={() => this.sectionFormManager(true, null)}
                                        class="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary rounded-md px-4 py-2 transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none"
                                    >
                                        Add Storage Section
                                    </button>
                                ) : null}
                                {this.nextTreeType === this.tags.STORAGE_CONTAINER ? (
                                    <button
                                        onClick={() => this.containerFormManager(true, null)}
                                        class="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary rounded-md px-4 py-2 transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none"
                                    >
                                        Add Storage Container
                                    </button>
                                ) : null}
                                {this.nextTreeType === this.tags.CONTAINER_VIEW ? <ContainerView /> : null}
                            </div>
                            <div class="border-border border-t" />
                        </div>
                    )}
                </div>

                {/* Store Room Form Modal */}
                {this.roomModalShow ? (
                    <Modal onClose={() => (this.roomModalShow = false)} contentWidth="w-1/3">
                        {{
                            header: () => <h3 class="text-lg font-medium">{this.roomFormTitle}</h3>,
                            body: () => {
                                return (
                                    <form action="post" class="space-y-6 p-4">
                                        <div class="space-y-4">
                                            <label class="block space-y-2">
                                                <span class="text-sm font-medium">Store Room Name</span>
                                                <input
                                                    class="border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                                                    v-model={this.roomForm.name}
                                                    placeholder="Name ..."
                                                />
                                            </label>
                                            <label class="block space-y-2">
                                                <span class="text-sm font-medium">Description</span>
                                                <textarea
                                                    class="border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary min-h-[100px] w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                                                    v-model={this.roomForm.description}
                                                    placeholder="Description ..."
                                                />
                                            </label>
                                        </div>
                                        <div class="border-border border-t pt-4">
                                            <button
                                                type="button"
                                                onClick={() => this.saveStoreRoomForm()}
                                                class="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary w-full rounded-md px-4 py-2 transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none"
                                            >
                                                Save Form
                                            </button>
                                        </div>
                                    </form>
                                );
                            },
                        }}
                    </Modal>
                ) : null}

                {/* Storage Location Form Modal */}
                {this.locationModalShow ? (
                    <Modal onClose={() => (this.locationModalShow = false)} contentWidth="w-1/3">
                        {{
                            header: () => <h3 class="text-lg font-medium">{this.locationFormTitle}</h3>,
                            body: () => {
                                return (
                                    <form action="post" class="space-y-6 p-4">
                                        <div class="space-y-4">
                                            <label class="block space-y-2">
                                                <span class="text-sm font-medium">Storage Location Name</span>
                                                <input
                                                    class="border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                                                    v-model={this.locationForm.name}
                                                    placeholder="Name ..."
                                                />
                                            </label>
                                            <label class="block space-y-2">
                                                <span class="text-sm font-medium">Description</span>
                                                <textarea
                                                    class="border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary min-h-[100px] w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                                                    v-model={this.locationForm.description}
                                                    placeholder="Description ..."
                                                />
                                            </label>
                                        </div>
                                        <div class="border-border border-t pt-4">
                                            <button
                                                type="button"
                                                onClick={() => this.saveLocationForm()}
                                                class="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary w-full rounded-md px-4 py-2 transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none"
                                            >
                                                Save Form
                                            </button>
                                        </div>
                                    </form>
                                );
                            },
                        }}
                    </Modal>
                ) : null}

                {/* Storage Section Form Modal */}
                {this.sectionModalShow ? (
                    <Modal onClose={() => (this.sectionModalShow = false)} contentWidth="w-1/3">
                        {{
                            header: () => <h3 class="text-lg font-medium">{this.sectionFormTitle}</h3>,
                            body: () => {
                                return (
                                    <form action="post" class="space-y-6 p-4">
                                        <div class="space-y-4">
                                            <label class="block space-y-2">
                                                <span class="text-sm font-medium">Storage Section Name</span>
                                                <input
                                                    class="border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                                                    v-model={this.sectionForm.name}
                                                    placeholder="Name ..."
                                                />
                                            </label>
                                            <label class="block space-y-2">
                                                <span class="text-sm font-medium">Description</span>
                                                <textarea
                                                    class="border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary min-h-[100px] w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                                                    v-model={this.sectionForm.description}
                                                    placeholder="Description ..."
                                                />
                                            </label>
                                        </div>
                                        <div class="border-border border-t pt-4">
                                            <button
                                                type="button"
                                                onClick={() => this.saveStorageSectionForm()}
                                                class="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary w-full rounded-md px-4 py-2 transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none"
                                            >
                                                Save Form
                                            </button>
                                        </div>
                                    </form>
                                );
                            },
                        }}
                    </Modal>
                ) : null}

                {/* Storage Container Form Modal */}
                {this.containerModalShow ? (
                    <Modal onClose={() => (this.containerModalShow = false)} contentWidth="w-1/2">
                        {{
                            header: () => <h3 class="text-lg font-medium">{this.containerFormTitle}</h3>,
                            body: () => {
                                return (
                                    <form action="post" class="space-y-6 p-4">
                                        <div class="space-y-4">
                                            <label class="block space-y-2">
                                                <span class="text-sm font-medium">Storage Container Name</span>
                                                <input
                                                    class="border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                                                    v-model={this.containerForm.name}
                                                    placeholder="Name ..."
                                                />
                                            </label>
                                            <label class="block space-y-2">
                                                <span class="text-sm font-medium">Description</span>
                                                <textarea
                                                    class="border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary min-h-[100px] w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                                                    v-model={this.containerForm.description}
                                                    placeholder="Description ..."
                                                />
                                            </label>
                                            <label class="col-span-1 mb-2 block">
                                                <span class="text-sm font-medium">Number of Slots</span>
                                                <input
                                                    class="border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                                                    v-model={this.containerForm.slots}
                                                    placeholder="Slots ..."
                                                    type="number"
                                                />
                                            </label>
                                            <label class="col-span-1 mt-10 flex items-center justify-start gap-x-2">
                                                <Checkbox
                                                    checked={this.containerForm.grid}
                                                    onUpdate:checked={(value: boolean) => {
                                                        this.containerForm.grid = value;
                                                        this.changeContainerType({ target: { checked: value } } as any);
                                                    }}
                                                />
                                                <span class="text-sm font-medium">Add Grid View</span>
                                            </label>
                                        </div>

                                        <div class="mb-4 grid grid-cols-4 gap-x-4">
                                            {this.containerForm.grid ? (
                                                <>
                                                    <span class="col-span-3">
                                                        <div class="grid grid-cols-2 gap-x-4">
                                                            <label class="col-span-1 mb-2 block">
                                                                <span class="text-sm font-medium">Cols</span>
                                                                <input
                                                                    class="border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                                                                    v-model={this.containerForm.cols}
                                                                    onKeyup={e => this.calculateRows(e)}
                                                                    type="number"
                                                                />
                                                            </label>
                                                            <label class="col-span-1 mb-2 block">
                                                                <span class="text-sm font-medium">Rows</span>
                                                                <input
                                                                    class="border-input bg-muted text-foreground placeholder:text-muted-foreground focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                                                                    v-model={this.containerForm.rows}
                                                                    type="number"
                                                                    disabled
                                                                />
                                                            </label>
                                                            <label class="col-span-1 mt-2 block">
                                                                <div class="flex items-center gap-2">
                                                                    <Checkbox
                                                                        checked={this.containerForm.rowWise}
                                                                        onUpdate:checked={(value: boolean) => {
                                                                            this.containerForm.rowWise = value;
                                                                        }}
                                                                    />
                                                                    <span class="text-sm font-medium">Row Wise</span>
                                                                </div>
                                                            </label>
                                                        </div>
                                                    </span>
                                                </>
                                            ) : null}
                                        </div>

                                        <div class="border-border border-t pt-4">
                                            <button
                                                type="button"
                                                onClick={() => this.saveStorageContainerForm()}
                                                class="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary w-full rounded-md px-4 py-2 transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none"
                                            >
                                                Save Form
                                            </button>
                                        </div>
                                    </form>
                                );
                            },
                        }}
                    </Modal>
                ) : null}
            </>
        );
    },
});

export { StorageHome };
export default StorageHome;
