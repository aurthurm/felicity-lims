import { defineStore } from 'pinia';

import useApiUtil from '@/composables/api_util';
import useTreeStateComposable from '@/composables/tree-state';
import {
    GetAllStorageContainersDocument,
    GetAllStorageContainersQuery,
    GetAllStorageContainersQueryVariables,
    GetAllStorageLocationsDocument,
    GetAllStorageLocationsQuery,
    GetAllStorageLocationsQueryVariables,
    GetAllStorageSectionsDocument,
    GetAllStorageSectionsQuery,
    GetAllStorageSectionsQueryVariables,
    GetAllStoreRoomsDocument,
    GetAllStoreRoomsQuery,
    GetAllStoreRoomsQueryVariables,
    GetSrorageContainerByUidDocument,
    GetStoreRoomsTreeDocument,
    GetStoreRoomsTreeQuery,
    GetStoreRoomsTreeQueryVariables,
} from '@/graphql/operations/storage.queries';
import {
    GetSamplesByStorageContainerUidDocument,
    GetSamplesByStorageContainerUidQuery,
    GetSamplesByStorageContainerUidQueryVariables,
} from '@/graphql/operations/analyses.queries';
import { GetSrorageContainerByUidQuery, GetSrorageContainerByUidQueryVariables } from '@/types/gqlops';
import { StoreRoomType, StorageLocationType, StorageSectionType, StorageContainerType } from '@/types/gql';

const { withClientQuery } = useApiUtil();
const { setTree } = useTreeStateComposable();

interface StorageState {
    tree: StoreRoomType[];
    fetchingTree: boolean;
    storeRooms: StoreRoomType[];
    fetchingStoreRooms: boolean;
    storageLocations: StorageLocationType[];
    fetchingStorageLocations: boolean;
    storageSections: StorageSectionType[];
    fetchingStorageSections: boolean;
    storageContainers: StorageContainerType[];
    fetchingStorageContainers: boolean;
    storageContainer?: StorageContainerType;
    fetchingStorageContainer: boolean;
    fetchingStorageContainerSamples: boolean;
}

export const useStorageStore = defineStore('storage', {
    state: (): StorageState => ({
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
    }),
    getters: {
        getStorageTree: (state): StoreRoomType[] => state.tree,
        getStoreRooms: (state): StoreRoomType[] => state.storeRooms,
        getStorageLocations: (state): StorageLocationType[] => state.storageLocations,
        getStorageSection: (state): StorageSectionType[] => state.storageSections,
        getStorageContainers: (state): StorageContainerType[] => state.storageContainers,
        getStorageContainer: (state): StorageContainerType | undefined => state.storageContainer,
    },
    actions: {
        // Tree
        async fetchStorageTree(): Promise<void> {
            try {
                this.fetchingTree = true;
                const result = await withClientQuery<GetStoreRoomsTreeQuery, GetStoreRoomsTreeQueryVariables>(
                    GetStoreRoomsTreeDocument,
                    {},
                    'storeRoomAll'
                );

                if (result && Array.isArray(result)) {
                    this.tree = result as StoreRoomType[];
                    setTree(result as StoreRoomType[]);
                } else {
                }
            } catch {} finally {
                this.fetchingTree = false;
            }
        },

        // Store Rooms
        async fetchStoreRooms(): Promise<void> {
            try {
                this.fetchingStoreRooms = true;
                const result = await withClientQuery<GetAllStoreRoomsQuery, GetAllStoreRoomsQueryVariables>(
                    GetAllStoreRoomsDocument,
                    {},
                    'storeRoomAll'
                );

                if (result && Array.isArray(result)) {
                    this.storeRooms = result as StoreRoomType[];
                } else {
                }
            } catch {} finally {
                this.fetchingStoreRooms = false;
            }
        },

        addStoreRoom(payload: StoreRoomType): void {
            if (!payload?.uid) {
                return;
            }
            this.storeRooms.unshift(payload);
        },

        updateStoreRoom(payload: StoreRoomType): void {
            if (!payload?.uid) {
                return;
            }
            const index = this.storeRooms.findIndex(item => item.uid === payload.uid);
            if (index > -1) {
                this.storeRooms[index] = payload;
            }
        },

        // Storage Locations
        async fetchStorageLocations(storeRoomUid: string): Promise<void> {
            if (!storeRoomUid) {
                return;
            }

            try {
                this.fetchingStorageLocations = true;
                const result = await withClientQuery<GetAllStorageLocationsQuery, GetAllStorageLocationsQueryVariables>(
                    GetAllStorageLocationsDocument,
                    { storeRoomUid },
                    'storageLocations'
                );

                if (result && Array.isArray(result)) {
                    this.storageLocations = result as StorageLocationType[];
                } else {
                }
            } catch {} finally {
                this.fetchingStorageLocations = false;
            }
        },

        addStorageLocation(payload: StorageLocationType): void {
            if (!payload?.uid) {
                return;
            }
            this.storageLocations.unshift(payload);
        },

        updateStorageLocation(payload: StorageLocationType): void {
            if (!payload?.uid) {
                return;
            }
            const index = this.storageLocations.findIndex(item => item.uid === payload.uid);
            if (index > -1) {
                this.storageLocations[index] = payload;
            }
        },

        // Storage Sections
        async fetchStorageSections(storageLocationUid: string): Promise<void> {
            if (!storageLocationUid) {
                return;
            }

            try {
                this.fetchingStorageSections = true;
                const result = await withClientQuery<GetAllStorageSectionsQuery, GetAllStorageSectionsQueryVariables>(
                    GetAllStorageSectionsDocument,
                    { storageLocationUid },
                    'storageSections'
                );

                if (result && Array.isArray(result)) {
                    this.storageSections = result as StorageSectionType[];
                } else {
                }
            } catch {} finally {
                this.fetchingStorageSections = false;
            }
        },

        addStorageSection(payload: StorageSectionType): void {
            if (!payload?.uid) {
                return;
            }
            this.storageSections.unshift(payload);
        },

        updateStorageSection(payload: StorageSectionType): void {
            if (!payload?.uid) {
                return;
            }
            const index = this.storageSections.findIndex(item => item.uid === payload.uid);
            if (index > -1) {
                this.storageSections[index] = payload;
            }
        },

        // Storage Containers
        async fetchStorageContainers(storageSectionUid: string): Promise<void> {
            if (!storageSectionUid) {
                return;
            }

            try {
                this.fetchingStorageContainers = true;
                const result = await withClientQuery<GetAllStorageContainersQuery, GetAllStorageContainersQueryVariables>(
                    GetAllStorageContainersDocument,
                    { storageSectionUid },
                    'storageContainers'
                );

                if (result && Array.isArray(result)) {
                    this.storageContainers = result as StorageContainerType[];
                } else {
                }
            } catch {} finally {
                this.fetchingStorageContainers = false;
            }
        },

        addStorageContainer(payload: StorageContainerType): void {
            if (!payload?.uid) {
                return;
            }
            this.storageContainers.unshift(payload);
        },

        updateStorageContainer(payload: StorageContainerType): void {
            if (!payload?.uid) {
                return;
            }
            const index = this.storageContainers.findIndex(item => item.uid === payload.uid);
            if (index > -1) {
                this.storageContainers[index] = payload;
            }
        },

        async fetchStorageContainer(uid: string): Promise<void> {
            if (!uid) {
                return;
            }

            try {
                this.fetchingStorageContainer = true;
                const result = await withClientQuery<GetSrorageContainerByUidQuery, GetSrorageContainerByUidQueryVariables>(
                    GetSrorageContainerByUidDocument,
                    { uid },
                    'storageContainerByUid',
                    'network-only'
                );

                if (result) {
                    this.storageContainer = result as StorageContainerType;
                    await this.fetchStorageContainerSamples(uid);
                } else {
                }
            } catch {} finally {
                this.fetchingStorageContainer = false;
            }
        },

        resetStorageContainer(): void {
            this.storageContainer = undefined;
        },

        async fetchStorageContainerSamples(uid: string): Promise<void> {
            if (!uid) {
                return;
            }

            try {
                this.fetchingStorageContainerSamples = true;
                const result = await withClientQuery<GetSamplesByStorageContainerUidQuery, GetSamplesByStorageContainerUidQueryVariables>(
                    GetSamplesByStorageContainerUidDocument,
                    { uid },
                    'samplesByStorageContainerUid',
                    'network-only'
                );

                if (this.storageContainer && result) {
                    // Use type assertion to handle the samples property
                    (this.storageContainer as any).samples = result;
                } else {
                }
            } catch {} finally {
                this.fetchingStorageContainerSamples = false;
            }
        },
    },
});
