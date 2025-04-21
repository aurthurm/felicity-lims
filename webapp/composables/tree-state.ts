import { toRefs, reactive, Ref } from 'vue';
import { IStorageContainer, IStorageLocation, IStorageSection, IStoreRoom, ITreeData } from '@/models/storage';

// Define tag constants
export const TREE_TAGS = {
    STORE_ROOM: 'store-room',
    STORAGE_LOCATION: 'storage-location',
    STORAGE_SECTION: 'storage-section',
    STORAGE_CONTAINER: 'storage-container',
    CONTAINER_VIEW: 'container-view',
} as const;

// Type for tree tags
export type TreeTag = typeof TREE_TAGS[keyof typeof TREE_TAGS];

// Type for tree node
export type TreeNode = IStoreRoom | IStorageLocation | IStorageSection | IStorageContainer;

// Type for active path
export interface IActivePath {
    room?: string;
    location?: string;
    section?: string;
    container?: string;
}

// Type for tree state
export interface ITreeState extends ITreeData {
    treeData: IStoreRoom[];
    activePath: IActivePath;
    activeTree: TreeNode;
}

const state = reactive<ITreeState>({
    treeData: [],
    activePath: {
        room: undefined,
        location: undefined,
        section: undefined,
        container: undefined,
    },
    activeTree: {} as TreeNode,
});

export default function useTreeStateComposable() {
    // Get reactive refs
    const treeData = toRefs(state).treeData;
    const activePath = toRefs(state).activePath;
    const activeTree = toRefs(state).activeTree;

    // Set tree data
    const setTree = (treeData: IStoreRoom[]): void => {
        state.treeData = treeData;
    };

    // Reset active tree state
    const resetActiveTree = (): void => {
        state.activeTree = {} as TreeNode;
        state.activePath = {
            room: undefined,
            location: undefined,
            section: undefined,
            container: undefined,
        };
    };

    // Set active tree node
    const setActiveTree = (activeTree: TreeNode): void => {
        state.activeTree = activeTree;

        // Update active path based on node type
        switch (activeTree.tag) {
            case TREE_TAGS.STORE_ROOM:
                state.activePath = {
                    room: activeTree.uid,
                    location: undefined,
                    section: undefined,
                    container: undefined,
                };
                break;
            case TREE_TAGS.STORAGE_LOCATION:
                state.activePath = {
                    ...state.activePath,
                    location: activeTree.uid,
                    section: undefined,
                    container: undefined,
                };
                break;
            case TREE_TAGS.STORAGE_SECTION:
                state.activePath = {
                    ...state.activePath,
                    section: activeTree.uid,
                    container: undefined,
                };
                break;
            case TREE_TAGS.STORAGE_CONTAINER:
                state.activePath = {
                    ...state.activePath,
                    container: activeTree.uid,
                };
                break;
        }
        _openTree(activeTree);
    };

    // Helper to update tree open state
    const _openTree = (activeTree: TreeNode): void => {
        if (!activeTree.uid) return;

        state.treeData = state.treeData.map(room => {
            if (activeTree.tag === TREE_TAGS.STORE_ROOM) {
                return room.uid === activeTree.uid
                    ? { ...room, isOpen: !room.isOpen }
                    : {
                          ...room,
                          children: room.children?.map(location => ({
                              ...location,
                              children: location.children?.map(section => ({
                                  ...section,
                                  isOpen: false,
                              })),
                              isOpen: false,
                          })),
                          isOpen: false,
                      };
            }

            return {
                ...room,
                children: room.children?.map(location => {
                    if (activeTree.tag === TREE_TAGS.STORAGE_LOCATION) {
                        return location.uid === activeTree.uid
                            ? { ...location, isOpen: !location.isOpen }
                            : {
                                  ...location,
                                  children: location.children?.map(section => ({
                                      ...section,
                                      isOpen: false,
                                  })),
                                  isOpen: false,
                              };
                    }

                    return {
                        ...location,
                        children: location.children?.map(section => {
                            if (activeTree.tag === TREE_TAGS.STORAGE_SECTION) {
                                return section.uid === activeTree.uid
                                    ? { ...section, isOpen: !section.isOpen }
                                    : { ...section, isOpen: false };
                            }
                            return section;
                        }),
                    };
                }),
            };
        });
    };

    // Add new store room
    const newStoreRoom = (room: IStoreRoom): void => {
        state.treeData.push({ ...room, tag: TREE_TAGS.STORE_ROOM });
    };

    // Add new storage location
    const newStorageLocation = (location: IStorageLocation): void => {
        const roomIndex = state.treeData.findIndex(x => x.uid === location.storeRoomUid);
        if (roomIndex >= 0) {
            state.treeData[roomIndex].children = [
                ...(state.treeData[roomIndex].children ?? []),
                { ...location, tag: TREE_TAGS.STORAGE_LOCATION },
            ];
        }
    };

    // Add new storage section
    const newStorageSection = (section: IStorageSection): void => {
        const roomIndex = state.treeData.findIndex(x => x.uid === section.storageLocation?.storeRoomUid);
        if (roomIndex >= 0) {
            const locationIndex = state.treeData[roomIndex].children?.findIndex(
                x => x.uid === section.storageLocationUid
            ) ?? -1;
            if (locationIndex >= 0) {
                state.treeData[roomIndex].children![locationIndex].children = [
                    ...(state.treeData[roomIndex].children![locationIndex].children ?? []),
                    { ...section, tag: TREE_TAGS.STORAGE_SECTION },
                ];
            }
        }
    };

    // Add new storage container
    const newStorageContainer = (container: IStorageContainer): void => {
        const roomIndex = state.treeData.findIndex(
            x => x.uid === container.storageSection?.storageLocation?.storeRoomUid
        );
        if (roomIndex >= 0) {
            const locationIndex =
                state.treeData[roomIndex].children?.findIndex(
                    x => x.uid === container.storageSection?.storageLocationUid
                ) ?? -1;
            if (locationIndex >= 0) {
                const sectionIndex =
                    state.treeData[roomIndex].children![locationIndex].children?.findIndex(
                        x => x.uid === container.storageSectionUid
                    ) ?? -1;
                if (sectionIndex >= 0) {
                    state.treeData[roomIndex].children![locationIndex].children![sectionIndex].children = [
                        ...(state.treeData[roomIndex].children![locationIndex].children![sectionIndex].children ??
                            []),
                        { ...container, tag: TREE_TAGS.STORAGE_CONTAINER },
                    ];
                }
            }
        }
    };

    // Get node by path
    const getNodeByPath = (path: IActivePath): TreeNode | null => {
        if (!path.room) return null;

        const room = state.treeData.find(r => r.uid === path.room);
        if (!room || !path.location) return room;

        const location = room.children?.find(l => l.uid === path.location);
        if (!location || !path.section) return location;

        const section = location.children?.find(s => s.uid === path.section);
        if (!section || !path.container) return section;

        return section.children?.find(c => c.uid === path.container) ?? null;
    };

    // Check if node is active
    const isNodeActive = (node: TreeNode): boolean => {
        switch (node.tag) {
            case TREE_TAGS.STORE_ROOM:
                return activePath.value.room === node.uid;
            case TREE_TAGS.STORAGE_LOCATION:
                return activePath.value.location === node.uid;
            case TREE_TAGS.STORAGE_SECTION:
                return activePath.value.section === node.uid;
            case TREE_TAGS.STORAGE_CONTAINER:
                return activePath.value.container === node.uid;
            default:
                return false;
        }
    };

    return {
        treeData,
        activePath,
        activeTree,
        tags: TREE_TAGS,
        setTree,
        resetActiveTree,
        setActiveTree,
        newStoreRoom,
        newStorageLocation,
        newStorageSection,
        newStorageContainer,
        getNodeByPath,
        isNodeActive,
    };
}

const exampleExpectedtree = [
    { uid: 1, name: 'Store Room 1', tag: 'store-room' },
    { uid: 2, name: 'Store Room 2', tag: 'store-room' },
    {
        uid: 3,
        name: 'Store Room 3',
        children: [
            {
                uid: 1,
                name: 'Freezer A',
                children: [
                    { uid: 3, name: 'Rack 1', tag: 'storage-section' },
                    {
                        uid: 5,
                        name: 'Rack 2',
                        children: [
                            { uid: 1, name: 'Container SW', tag: 'storage-container' },
                            { uid: 2, name: 'Container DER', tag: 'storage-container' },
                        ],
                        tag: 'storage-section',
                    },
                ],
                tag: 'storage-location',
            },
            { uid: 2, name: 'Freezer B', tag: 'storage-location' },
            { uid: 3, name: 'CupBoard X', tag: 'storage-location' },
            {
                uid: 4,
                name: 'CupBoard Y',
                children: [
                    { uid: 1, name: 'Shelve 1', tag: 'storage-section' },
                    { uid: 2, name: 'Shelve 2', tag: 'storage-section' },
                ],
                tag: 'storage-location',
            },
        ],
        tag: 'store-room',
    },
];
