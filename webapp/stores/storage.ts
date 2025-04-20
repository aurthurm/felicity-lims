import { defineStore } from 'pinia';

import useApiUtil from '@/composables/api_util';
import useTreeStateComposable from '@/composables/tree-state';
import { IStorageContainer, IStorageLocation, IStorageSection, IStoreRoom } from '@/models/storage';
import { GetAllStorageContainersDocument, GetAllStorageContainersQuery, GetAllStorageContainersQueryVariables, GetAllStorageLocationsDocument, GetAllStorageLocationsQuery, GetAllStorageLocationsQueryVariables, GetAllStorageSectionsDocument, GetAllStorageSectionsQuery, GetAllStorageSectionsQueryVariables, GetAllStoreRoomsDocument, GetAllStoreRoomsQuery, GetAllStoreRoomsQueryVariables, GetSrorageContainerByUidDocument, GetStoreRoomsTreeDocument, GetStoreRoomsTreeQuery, GetStoreRoomsTreeQueryVariables } from '@/graphql/operations/storage.queries';
import { GetSamplesByStorageContainerUidDocument, GetSamplesByStorageContainerUidQuery, GetSamplesByStorageContainerUidQueryVariables } from '@/graphql/operations/analyses.queries';
import { GetSrorageContainerByUidQuery } from '@/types/gqlops';

const { withClientQuery } = useApiUtil();
const { setTree } = useTreeStateComposable();

export const useStorageStore = defineStore('storage', {
    state: () => {
        return {
            tree: [],
            fetchingTree: false,
            storeRooms: [],
            fetchingStoreRooms: false,
            storageLocations: [],
            fetchingStorageLocations: false,
            storageSections: [],
            fetchingStorageSections: false,
            storageContainers: [],
            fetchingStorageContainers: false,
            storageContainer: undefined,
            fetchingStorageContainer: false,
            fetchingStorageContainerSamples: false,
        } as {
            tree: IStoreRoom[];
            fetchingTree: boolean;
            storeRooms: IStoreRoom[];
            fetchingStoreRooms: boolean;
            storageLocations: IStorageLocation[];
            fetchingStorageLocations: boolean;
            storageSections: IStorageSection[];
            fetchingStorageSections: boolean;
            storageContainers: IStorageContainer[];
            fetchingStorageContainers: boolean;
            storageContainer?: IStorageContainer;
            fetchingStorageContainer: boolean;
            fetchingStorageContainerSamples: boolean;
        };
    },
    getters: {
        getStorageTree: state => state.tree,
        getStoreRooms: state => state.storeRooms,
        getStorageLocations: state => state.storageLocations,
        getStorageSection: state => state.storageSections,
        getStorageContainers: state => state.storageContainers,
        getStorageContainer: state => state.storageContainer,
    },
    actions: {
        // Tree
        async fetchStorageTree() {
            this.fetchingTree = true;
            await withClientQuery<GetStoreRoomsTreeQuery, GetStoreRoomsTreeQueryVariables>(GetStoreRoomsTreeDocument, {}, 'storeRoomAll')
                .then((tree: IStoreRoom[]) => {
                    this.fetchingTree = false;
                    this.tree = tree;
                    setTree(tree);
                })
                .catch(err => (this.fetchingTree = false));
        },

        // storeRooms
        async fetchStoreRooms() {
            this.fetchingStoreRooms = true;
            await withClientQuery<GetAllStoreRoomsQuery, GetAllStoreRoomsQueryVariables>(GetAllStoreRoomsDocument, {}, 'storeRoomAll')
                .then((storeRooms: IStoreRoom[]) => {
                    this.fetchingStoreRooms = false;
                    this.storeRooms = storeRooms;
                })
                .catch(err => (this.fetchingStoreRooms = false));
        },
        addStoreRoom(payload): void {
            this.storeRooms?.unshift(payload);
        },
        updateStoreRoom(payload: IStoreRoom): void {
            const index = this.storeRooms?.findIndex(item => item.uid === payload?.uid);
            if (index > -1) this.storeRooms[index] = payload;
        },

        // storageLocations
        async fetchStorageLocations(storeRoomUid: string) {
            this.fetchingStorageLocations = true;
            await withClientQuery<GetAllStorageLocationsQuery, GetAllStorageLocationsQueryVariables>(GetAllStorageLocationsDocument, { storeRoomUid }, 'storageLocationAll')
                .then((storageLocations: IStorageLocation[]) => {
                    this.fetchingStorageLocations = false;
                    this.storageLocations = storageLocations;
                })
                .catch(err => (this.fetchingStorageLocations = false));
        },
        addStorageLocation(payload): void {
            this.storageLocations?.unshift(payload);
        },
        updateStorageLocation(payload: IStorageLocation): void {
            const index = this.storageLocations?.findIndex(item => item.uid === payload?.uid);
            if (index > -1) this.storageLocations[index] = payload;
        },

        // storageSection
        async fetchStorageSections(storageSectionUid: string) {
            this.fetchingStorageSections = true;
            await withClientQuery<GetAllStorageSectionsQuery, GetAllStorageSectionsQueryVariables>(GetAllStorageSectionsDocument, { storageSectionUid }, 'storageSectionAll')
                .then((storageSections: IStorageSection[]) => {
                    this.fetchingStorageSections = false;
                    this.storageSections = storageSections;
                })
                .catch(err => (this.fetchingStorageSections = false));
        },
        addStorageSection(payload): void {
            this.storageSections?.unshift(payload);
        },
        updateStorageSection(payload: IStorageSection): void {
            const index = this.storageSections?.findIndex(item => item.uid === payload?.uid);
            if (index > -1) this.storageSections[index] = payload;
        },

        // storageContainers
        async fetchStorageContainers(storageContainerUid: string) {
            this.fetchingStorageContainers = true;
            await withClientQuery<GetAllStorageContainersQuery, GetAllStorageContainersQueryVariables>(GetAllStorageContainersDocument, { storageContainerUid }, 'storageContainerAll')
                .then((storageContainers: IStorageContainer[]) => {
                    this.fetchingStorageContainers = false;
                    this.storageContainers = storageContainers;
                })
                .catch(err => (this.fetchingStorageContainers = false));
        },
        addStorageContainer(payload): void {
            this.storageContainers?.unshift(payload);
        },
        updateStorageContainer(payload: IStorageContainer): void {
            const index = this.storageContainers?.findIndex(item => item.uid === payload?.uid);
            if (index > -1) this.storageContainers[index] = payload;
        },

        async fetchStorageContainer(uid: string) {
            if (!uid) return;
            this.fetchingStorageContainer = true;
            await withClientQuery<GetSrorageContainerByUidQuery, GetSrorageContainerByUidQuery>(GetSrorageContainerByUidDocument, { uid }, 'storageContainerByUid', 'network-only')
                .then(async payload => {
                    this.fetchingStorageContainer = false;
                    this.storageContainer = payload;
                    await this.fetchStorageContainerSamples(uid);
                })
                .catch(err => (this.fetchingStorageContainer = false));
        },

        resetStorageContainer(): void {
            this.storageContainer = undefined;
        },

        async fetchStorageContainerSamples(uid: string) {
            if (!uid) return;
            this.fetchingStorageContainerSamples = true;
            await withClientQuery<GetSamplesByStorageContainerUidQuery, GetSamplesByStorageContainerUidQueryVariables>(GetSamplesByStorageContainerUidDocument, { uid }, 'samplesByStorageContainerUid', 'network-only')
                .then(payload => {
                    this.fetchingStorageContainerSamples = false;
                    this.storageContainer = {
                        ...this.storageContainer,
                        samples: payload,
                    };
                })
                .catch(err => (this.fetchingStorageContainerSamples = false));
        },
    },
});
