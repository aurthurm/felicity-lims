import { defineStore } from 'pinia';

import useApiUtil from '@/composables/api_util';
import useTreeStateComposable from '@/composables/tree-state';
import { GetAllStorageContainersDocument, GetAllStorageContainersQuery, GetAllStorageContainersQueryVariables, GetAllStorageLocationsDocument, GetAllStorageLocationsQuery, GetAllStorageLocationsQueryVariables, GetAllStorageSectionsDocument, GetAllStorageSectionsQuery, GetAllStorageSectionsQueryVariables, GetAllStoreRoomsDocument, GetAllStoreRoomsQuery, GetAllStoreRoomsQueryVariables, GetSrorageContainerByUidDocument, GetStoreRoomsTreeDocument, GetStoreRoomsTreeQuery, GetStoreRoomsTreeQueryVariables } from '@/graphql/operations/storage.queries';
import { GetSamplesByStorageContainerUidDocument, GetSamplesByStorageContainerUidQuery, GetSamplesByStorageContainerUidQueryVariables } from '@/graphql/operations/analyses.queries';
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
                    console.error('Invalid tree data received:', result);
                }
            } catch (error) {
                console.error('Error fetching storage tree:', error);
            } finally {
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
                    console.error('Invalid store rooms data received:', result);
                }
            } catch (error) {
                console.error('Error fetching store rooms:', error);
            } finally {
                this.fetchingStoreRooms = false;
            }
        },

        addStoreRoom(payload: StoreRoomType): void {
            if (!payload?.uid) {
                console.error('Invalid store room payload:', payload);
                return;
            }
            this.storeRooms.unshift(payload);
        },

        updateStoreRoom(payload: StoreRoomType): void {
            if (!payload?.uid) {
                console.error('Invalid store room payload:', payload);
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
                console.error('Store room UID is required');
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
                    console.error('Invalid storage locations data received:', result);
                }
            } catch (error) {
                console.error('Error fetching storage locations:', error);
            } finally {
                this.fetchingStorageLocations = false;
            }
        },

        addStorageLocation(payload: StorageLocationType): void {
            if (!payload?.uid) {
                console.error('Invalid storage location payload:', payload);
                return;
            }
            this.storageLocations.unshift(payload);
        },

        updateStorageLocation(payload: StorageLocationType): void {
            if (!payload?.uid) {
                console.error('Invalid storage location payload:', payload);
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
                console.error('Storage location UID is required');
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
                    console.error('Invalid storage sections data received:', result);
                }
            } catch (error) {
                console.error('Error fetching storage sections:', error);
            } finally {
                this.fetchingStorageSections = false;
            }
        },

        addStorageSection(payload: StorageSectionType): void {
            if (!payload?.uid) {
                console.error('Invalid storage section payload:', payload);
                return;
            }
            this.storageSections.unshift(payload);
        },

        updateStorageSection(payload: StorageSectionType): void {
            if (!payload?.uid) {
                console.error('Invalid storage section payload:', payload);
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
                console.error('Storage section UID is required');
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
                    console.error('Invalid storage containers data received:', result);
                }
            } catch (error) {
                console.error('Error fetching storage containers:', error);
            } finally {
                this.fetchingStorageContainers = false;
            }
        },

        addStorageContainer(payload: StorageContainerType): void {
            if (!payload?.uid) {
                console.error('Invalid storage container payload:', payload);
                return;
            }
            this.storageContainers.unshift(payload);
        },

        updateStorageContainer(payload: StorageContainerType): void {
            if (!payload?.uid) {
                console.error('Invalid storage container payload:', payload);
                return;
            }
            const index = this.storageContainers.findIndex(item => item.uid === payload.uid);
            if (index > -1) {
                this.storageContainers[index] = payload;
            }
        },

        async fetchStorageContainer(uid: string): Promise<void> {
            if (!uid) {
                console.error('Storage container UID is required');
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
                    console.error('Invalid storage container data received:', result);
                }
            } catch (error) {
                console.error('Error fetching storage container:', error);
            } finally {
                this.fetchingStorageContainer = false;
            }
        },

        resetStorageContainer(): void {
            this.storageContainer = undefined;
        },

        async fetchStorageContainerSamples(uid: string): Promise<void> {
            if (!uid) {
                console.error('Storage container UID is required');
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
                    console.error('Invalid storage container samples data received:', result);
                }
            } catch (error) {
                console.error('Error fetching storage container samples:', error);
            } finally {
                this.fetchingStorageContainerSamples = false;
            }
        },
    },
});
