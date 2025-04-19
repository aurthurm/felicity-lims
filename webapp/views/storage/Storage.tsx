import { defineComponent, computed, reactive, toRefs, ref, watch, defineAsyncComponent } from 'vue';
import useTreeStateComposable from '@/composables/tree-state';
import { IStorageContainer, IStorageLocation, IStorageSection, IStoreRoom } from '@/models/storage';
import {
    AddStoreRoomDocument, AddStoreRoomMutationVariables, AddStoreRoomMutation,             
    EditStoreRoomDocument, EditStoreRoomMutationVariables, EditStoreRoomMutation,
    AddStorageLocationDocument, AddStorageLocationMutationVariables, AddStorageLocationMutation,
    EditStorageLocationDocument, EditStorageLocationMutationVariables, EditStorageLocationMutation,
    AddStorageSectionDocument, AddStorageSectionMutationVariables, AddStorageSectionMutation,
    EditStorageSectionDocument, EditStorageSectionMutationVariables, EditStorageSectionMutation,
    AddStorageContainerDocument, AddStorageContainerMutationVariables, AddStorageContainerMutation,
    EditStorageContainerDocument, EditStorageContainerMutationVariables, EditStorageContainerMutation
} from '@/graphql/operations/storage.mutations';
import { useStorageStore } from '@/stores/storage';
import  useApiUtil  from '@/composables/api_util';
import { useRouter } from 'vue-router';
const Modal = defineAsyncComponent(
    () => import('@/components/ui/FelModal.vue')
)
const PageHeading = defineAsyncComponent(
    () => import('@/components/common/FelPageHeading.vue')
)
const ContainerView = defineAsyncComponent(
    () => import('./ContainerView')
)
const TreeItem = defineAsyncComponent(
    () => import('@/components/storage/FelTreeItem.vue')
)

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
                if (treeIn.tag === tags.storageContainer) {
                    storageStore.fetchStorageContainer(treeIn.uid!);
                }
            }
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
                    setActiveTree({ ...sr, tag: tags.storeRoom });
                    setActiveTree({ ...sl, tag: tags.storageLocation });
                    setActiveTree({ ...ss, tag: tags.storageSection });
                    setActiveTree({ ...sc, tag: tags.storageContainer });
                }
            }
        );

        const nextTreeType = computed(() => {
            if (activeTree.value?.tag === tags.storeRoom) {
                return tags.storageLocation;
            }
            if (activeTree.value?.tag === tags.storageLocation) {
                return tags.storageSection;
            }
            if (activeTree.value?.tag === tags.storageSection) {
                return tags.storageContainer;
            }
            if (activeTree.value?.tag === tags.storageContainer) {
                return tags.containerView;
            }
            return null;
        });

        const state = reactive({
            roomModalShow: false,
            roomFormTitle: '',
            roomForm: {} as IStoreRoom,
            roomFormAction: true,
            locationModalShow: false,
            locationFormTitle: '',
            locationForm: {} as IStorageLocation,
            locationFormAction: true,
            sectionModalShow: false,
            sectionFormTitle: '',
            sectionForm: {} as IStorageSection,
            sectionFormAction: true,
            containerModalShow: false,
            containerFormTitle: '',
            containerForm: {} as IStorageContainer,
            containerFormAction: true,
        });

        // Store Room
        function addStoreRoom(): void {
            const payload = { ...state.roomForm };
            withClientMutation<AddStoreRoomMutation, AddStoreRoomMutationVariables>(
                AddStoreRoomDocument,
                { payload },
                'createStoreRoom'
            ).then(result => {
                storageStore.addStoreRoom(result);
                newStoreRoom(result);
            });
        }

        function editStoreRoom(): void {
            const payload = {
                name: state.roomForm.name,
                description: state.roomForm.description,
            };
            withClientMutation<EditStoreRoomMutation, EditStoreRoomMutationVariables>(
                EditStoreRoomDocument,
                { uid: state.roomForm.uid, payload },
                'updateStoreRoom'
            ).then(result => storageStore.updateStoreRoom(result));
        }

        function roomFormManager(create: boolean, obj: IStoreRoom | null): void {
            state.roomFormAction = create;
            state.roomFormTitle = (create ? 'CREATE' : 'EDIT') + ' ' + 'A STORE ROOM';
            state.roomModalShow = true;
            if (create) {
                Object.assign(state.roomForm, {} as IStoreRoom);
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
                'createStorageLocation'
            ).then(result => {
                storageStore.addStorageLocation(result);
                newStorageLocation(result);
            });
        }

        function editStorageLocation(): void {
            const payload = {
                name: state.locationForm.name,
                description: state.locationForm.description,
            };
            withClientMutation<EditStorageLocationMutation, EditStorageLocationMutationVariables>(
                EditStorageLocationDocument,
                { uid: state.locationForm.uid, payload },
                'updateStorageLocation'
            ).then(result => storageStore.updateStorageLocation(result));
        }

        function locationFormManager(create: boolean, obj: IStorageLocation | null): void {
            state.locationFormAction = create;
            state.locationFormTitle = (create ? 'CREATE' : 'EDIT') + ' ' + 'A STORAGE LOCATION';
            state.locationModalShow = true;
            if (create) {
                Object.assign(state.locationForm, {} as IStorageLocation);
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
                'createStorageSection'
            ).then(result => {
                storageStore.addStorageSection(result);
                newStorageSection(result);
            });
        }

        function editStorageSection(): void {
            const payload = {
                name: state.sectionForm.name,
                description: state.sectionForm.description,
            };
            withClientMutation<EditStorageSectionMutation, EditStorageSectionMutationVariables>(
                EditStorageSectionDocument,
                { uid: state.sectionForm.uid, payload },
                'updateStorageSection'
            ).then(result => storageStore.updateStorageSection(result));
        }

        function sectionFormManager(create: boolean, obj: IStorageSection | null): void {
            state.sectionFormAction = create;
            state.sectionFormTitle = (create ? 'CREATE' : 'EDIT') + ' ' + 'A STORAGE SECTION';
            state.sectionModalShow = true;
            if (create) {
                Object.assign(state.sectionForm, {} as IStorageSection);
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
                'createStorageContainer'
            ).then(result => {
                storageStore.addStorageContainer(result);
                newStorageContainer(result);
            });
        }

        function editStorageContainer(): void {
            const payload = {
                name: state.containerForm.name,
                description: state.containerForm.description,
            };
            withClientMutation<EditStorageContainerMutation, EditStorageContainerMutationVariables>(
                EditStorageContainerDocument,
                { uid: state.containerForm.uid, payload },
                'updateStorageContainer'
            ).then(result => storageStore.updateStorageContainer(result));
        }

        function containerFormManager(create: boolean, obj: IStorageContainer | null): void {
            state.containerFormAction = create;
            state.containerFormTitle = (create ? 'CREATE' : 'EDIT') + ' ' + 'A STORAGE CONTAINER';
            state.containerModalShow = true;
            if (create) {
                Object.assign(state.containerForm, {} as IStorageContainer);
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
                <PageHeading title="Storage " />
                <div class="grid grid-cols-12 gap-4 min-h-full bg-background">
                    <div class="col-span-2 pt-4 pl-2">
                        <button
                            onClick={() => this.roomFormManager(true, null)}
                            class="px-2 py-1 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none"
                        >
                            Add Store Room
                        </button>
                        <hr class="mt-2 mb-4" />
                        <ul>
                            {this.treeData.map(_tree => (
                                <TreeItem tree={_tree} />
                            ))}
                        </ul>
                    </div>
                    {this.activeTree?.name && (
                        <div class="col-span-10 pt-4">
                            <div class="mb-2">Selected: {this.activeTree.name}</div>
                            <hr />
                            <div class="my-4">
                                {this.nextTreeType === this.tags.storageLocation ? (
                                    <>
                                        <button
                                            onClick={() => this.locationFormManager(true, null)}
                                            class="px-2 py-1 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none"
                                        >
                                            Add Storage Location
                                        </button>
                                    </>
                                ) : null}
                                {this.nextTreeType === this.tags.storageSection ? (
                                    <>
                                        <button
                                            onClick={() => this.sectionFormManager(true, null)}
                                            class="px-2 py-1 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none"
                                        >
                                            Add Storage Section
                                        </button>
                                    </>
                                ) : null}
                                {this.nextTreeType === this.tags.storageContainer ? (
                                    <>
                                        <button
                                            onClick={() => this.containerFormManager(true, null)}
                                            class="px-2 py-1 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none"
                                        >
                                            Add Storage Container
                                        </button>
                                    </>
                                ) : null}
                                {this.nextTreeType === this.tags.containerView ? <ContainerView /> : null}
                            </div>
                            <hr />
                        </div>
                    )} 
                </div>

                {/* Store Room Form Modal */}
                {this.roomModalShow ? (
                    <Modal onClose={() => (this.roomModalShow = false)} contentWidth="w-1/4">
                        {{
                            header: () => <h3>{this.roomFormTitle}</h3>,
                            body: () => {
                                return (
                                    <form action="post" class="p-1">
                                        <div class="grid grid-cols-2 gap-x-4 mb-4">
                                            <label class="block col-span-2 mb-2">
                                                <span class="text-foreground">Store Room Name</span>
                                                <input
                                                    class="form-input mt-1 block w-full"
                                                    v-model={this.roomForm.name}
                                                    placeholder="Name ..."
                                                />
                                            </label>
                                            <label class="block col-span-2 mb-2">
                                                <span class="text-foreground">Description</span>
                                                <textarea
                                                    cols="2"
                                                    class="form-input mt-1 block w-full"
                                                    v-model={this.roomForm.description}
                                                    placeholder="Description ..."
                                                />
                                            </label>
                                        </div>
                                        <hr />
                                        <button
                                            type="button"
                                            onClick={() => this.saveStoreRoomForm()}
                                            class="-mb-4 w-full border border-primary bg-primary text-primary-foreground rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-primary focus:outline-none focus:shadow-outline"
                                        >
                                            Save Form
                                        </button>
                                    </form>
                                );
                            },
                        }}
                    </Modal>
                ) : null}
                {/* Storage Location Form Modal */}
                {this.locationModalShow ? (
                    <Modal onClose={() => (this.locationModalShow = false)} contentWidth="w-1/4">
                        {{
                            header: () => <h3>{this.locationFormTitle}</h3>,
                            body: () => {
                                return (
                                    <form action="post" class="p-1">
                                        <div class="grid grid-cols-2 gap-x-4 mb-4">
                                            <label class="block col-span-2 mb-2">
                                                <span class="text-foreground">Storage Location Name</span>
                                                <input
                                                    class="form-input mt-1 block w-full"
                                                    v-model={this.locationForm.name}
                                                    placeholder="Name ..."
                                                />
                                            </label>
                                            <label class="block col-span-2 mb-2">
                                                <span class="text-foreground">Description</span>
                                                <textarea
                                                    cols="2"
                                                    class="form-input mt-1 block w-full"
                                                    v-model={this.locationForm.description}
                                                    placeholder="Description ..."
                                                />
                                            </label>
                                        </div>
                                        <hr />
                                        <button
                                            type="button"
                                            onClick={() => this.saveLocationForm()}
                                            class="-mb-4 w-full border border-primary bg-primary text-primary-foreground rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-primary focus:outline-none focus:shadow-outline"
                                        >
                                            Save Form
                                        </button>
                                    </form>
                                );
                            },
                        }}
                    </Modal>
                ) : null}
                {/* Storage Section Form Modal */}
                {this.sectionModalShow ? (
                    <Modal onClose={() => (this.sectionModalShow = false)} contentWidth="w-1/4">
                        {{
                            header: () => <h3>{this.sectionFormTitle}</h3>,
                            body: () => {
                                return (
                                    <form action="post" class="p-1">
                                        <div class="grid grid-cols-2 gap-x-4 mb-4">
                                            <label class="block col-span-2 mb-2">
                                                <span class="text-foreground">Storage Section Name</span>
                                                <input
                                                    class="form-input mt-1 block w-full"
                                                    v-model={this.sectionForm.name}
                                                    placeholder="Name ..."
                                                />
                                            </label>
                                            <label class="block col-span-2 mb-2">
                                                <span class="text-foreground">Description</span>
                                                <textarea
                                                    cols="2"
                                                    class="form-input mt-1 block w-full"
                                                    v-model={this.sectionForm.description}
                                                    placeholder="Description ..."
                                                />
                                            </label>
                                        </div>
                                        <hr />
                                        <button
                                            type="button"
                                            onClick={() => this.saveStorageSectionForm()}
                                            class="-mb-4 w-full border border-primary bg-primary text-primary-foreground rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-primary focus:outline-none focus:shadow-outline"
                                        >
                                            Save Form
                                        </button>
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
                            header: () => <h3>{this.containerFormTitle}</h3>,
                            body: () => {
                                return (
                                    <form action="post" class="p-1">
                                        <div class="grid grid-cols-2 gap-x-4 mb-4">
                                            <label class="block col-span-2 mb-2">
                                                <span class="text-foreground">Storage Location Name</span>
                                                <input
                                                    class="form-input mt-1 block w-full"
                                                    v-model={this.containerForm.name}
                                                    placeholder="Name ..."
                                                />
                                            </label>
                                            <label class="block col-span-2 mb-2">
                                                <span class="text-foreground">Description</span>
                                                <textarea
                                                    cols="2"
                                                    class="form-input mt-1 block w-full"
                                                    v-model={this.containerForm.description}
                                                    placeholder="Description ..."
                                                />
                                            </label>
                                            <label class="block col-span-1 mb-2">
                                                <span class="text-foreground">Number of Slots</span>
                                                <input
                                                    class="form-input mt-1 block w-full"
                                                    v-model={this.containerForm.slots}
                                                    placeholder="Slots ..."
                                                    type="number"
                                                />
                                            </label>
                                            <label class="block col-span-1 mt-10">
                                                <input
                                                    type="checkbox"
                                                    class=""
                                                    onChange={e => this.changeContainerType(e)}
                                                    v-model={this.containerForm.grid}
                                                />
                                                <span class="text-foreground ml-3">Add Grid View</span>
                                            </label>
                                        </div>
                                        <div class="grid grid-cols-4 gap-x-4 mb-4">
                                            {this.containerForm.grid ? (
                                                <>
                                                    <span class="col-span-3">
                                                        <div class="grid grid-cols-3 gap-x-4">
                                                            <label class="block col-span-1 mb-2">
                                                                <span class="text-foreground">Cols</span>
                                                                <input
                                                                    class="form-input mt-1 block w-full"
                                                                    v-model={this.containerForm.cols}
                                                                    onKeyup={e => this.calculateRows(e)}
                                                                    type="number"
                                                                />
                                                            </label>
                                                            <label class="block col-span-1 mb-2">
                                                                <span class="text-foreground">Rows</span>
                                                                <input
                                                                    class="form-input mt-1 block w-full bg-secondary"
                                                                    v-model={this.containerForm.rows}
                                                                    type="number"
                                                                    disabled
                                                                />
                                                            </label>
                                                            <label class="block col-span-1 mt-10">
                                                                <input type="checkbox" class="" v-model={this.containerForm.rowWise} />
                                                                <span class="text-foreground ml-3">Row Wise</span>
                                                            </label>
                                                        </div>
                                                    </span>
                                                </>
                                            ) : null}
                                        </div>
                                        <hr />
                                        <button
                                            type="button"
                                            onClick={() => this.saveStorageContainerForm()}
                                            class="-mb-4 w-full border border-primary bg-primary text-primary-foreground rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-primary focus:outline-none focus:shadow-outline"
                                        >
                                            Save Form
                                        </button>
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
export default StorageHome