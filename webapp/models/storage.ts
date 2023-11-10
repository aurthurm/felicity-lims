import { ISample } from './analysis';
import { IUser } from './auth';

export interface IStoreRoom {
    uid?: string;
    name?: String;
    description?: String;
    createdAt?: Date;
    createdByUid?: string;
    createdBy?: IUser;
    updatedAt?: Date;
    updatedByUid?: string;
    updatedBy?: IUser;
    children?: IStorageLocation[];
    tag?: string;
    isOpen?: boolean;
    isFolder?: boolean;
}

export interface IStorageLocation {
    uid?: string;
    name?: String;
    description?: String;
    storeRoomUid?: string;
    storeRoom?: IStoreRoom;
    createdAt?: Date;
    createdByUid?: string;
    createdBy?: IUser;
    updatedAt?: Date;
    updatedByUid?: string;
    updatedBy?: IUser;
    children?: IStorageSection[];
    tag?: string;
    isOpen?: boolean;
    isFolder?: boolean;
}

export interface IStorageSection {
    uid?: string;
    name?: String;
    description?: String;
    storageLocationUid?: string;
    storageLocation?: IStorageLocation;
    createdAt?: Date;
    createdByUid?: string;
    createdBy?: IUser;
    updatedAt?: Date;
    updatedByUid?: string;
    updatedBy?: IUser;
    children?: IStorageContainer[];
    tag?: string;
    isOpen?: boolean;
    isFolder?: boolean;
}

export interface IStorageContainer {
    uid?: string;
    name?: String;
    description?: String;
    storageSectionUid?: string;
    storageSection?: IStorageSection;
    grid?: boolean;
    rowWise?: boolean;
    cols?: number;
    rows?: number;
    slots?: number;
    storedCount?: number;
    samples?: ISample[];
    createdAt?: Date;
    createdByUid?: string;
    createdBy?: IUser;
    updatedAt?: Date;
    updatedByUid?: string;
    updatedBy?: IUser;
    tag?: string;
    isOpen?: boolean;
    isFolder?: boolean;
}

interface IActivePath {
    room?: number;
    location?: number;
    section?: number;
    container?: number;
}

export interface ITreeData {
    treeData: IStoreRoom[];
    activePath: IActivePath;
    activeTree: IStoreRoom | IStorageLocation | IStorageSection | IStorageContainer;
}
