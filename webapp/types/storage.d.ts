import type { StoreRoomType, StorageLocationType, StorageSectionType, StorageContainerType } from "./gql";


// Extended types with isOpen property
type ExtStoreRoomType = StoreRoomType & { isOpen?: boolean };
type ExtStorageLocationType = StorageLocationType & { isOpen?: boolean };
type ExtStorageSectionType = StorageSectionType & { isOpen?: boolean };
type ExtStorageContainerType = StorageContainerType & { isOpen?: boolean };


export type ActivePathType = {
    room?: string;
    location?: string;
    section?: string;
    container?: string;
};

export type TreeDataType = {
    treeData: ExtStoreRoomType[];
    activePath: ActivePathType;
    activeTree: 
    | ExtStoreRoomType
    | ExtStorageLocationType
    | ExtStorageSectionType
    | ExtStorageContainerType;
};


export type TreeNodeType = ExtStoreRoomType | ExtStorageLocationType | ExtStorageSectionType | ExtStorageContainerType;


export type TreeStateType = TreeDataType & {
    treeData: ExtStoreRoomType[];
    activePath: ActivePathType;
    activeTree: TreeNodeType;
};
