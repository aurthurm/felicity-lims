import { ISample } from "./analysis"
import { IUser } from "./auth"

export interface IStoreRoom {
    uid?: number;
    name?: String;
    description?: String;
    createdAt?: Date;
    createdByUid?: number;
    createdBy?: IUser;
    updatedAt?: Date;
    updatedByUid?: number;
    updatedBy?: IUser;
    children?: IStorageLocation[];
    tag?: string;
    isOpen?: boolean;
    isFolder?: boolean;
}


export interface IStorageLocation {
    uid?: number;
    name?: String;
    description?: String;
    storeRoomUid?: number;
    storeRoom?: IStoreRoom;
    createdAt?: Date;
    createdByUid?: number;
    createdBy?: IUser;
    updatedAt?: Date;
    updatedByUid?: number;
    updatedBy?: IUser;
    children?: IStorageSection[], 
    tag?: string,
    isOpen?: boolean;
    isFolder?: boolean;
}


export interface IStorageSection {
    uid?: number;
    name?: String;
    description?: String;
    storageLocationUid?: number;
    storageLocation?: IStorageLocation;
    createdAt?: Date;
    createdByUid?: number;
    createdBy?: IUser;
    updatedAt?: Date;
    updatedByUid?: number;
    updatedBy?: IUser;
    children?: IStorageContainer[], 
    tag?: string,
    isOpen?: boolean;
    isFolder?: boolean;
}


export interface IStorageContainer {
    uid?: number;
    name?: String;
    description?: String;
    storageSectionUid?: number;
    storageSection?: IStorageSection;
    grid?: boolean;
    rowWise?: boolean;
    cols?: number;
    rows?: number;
    slots?: number;
    storageSlots?: IStorageSlot[];
    samples?: ISample[];
    createdAt?: Date;
    createdByUid?: number;
    createdBy?: IUser;
    updatedAt?: Date;
    updatedByUid?: number;
    updatedBy?: IUser;
    tag?: string,
    children: IStorageSlot[],
    isOpen?: boolean;
    isFolder?: boolean;
}


export interface IStorageSlot {
    uid?: number;
    storageContainerUid?: number;
    storageContainer?: IStorageContainer;
    position?: String;
    positionLabel?: String;
    sample?: ISample;
    createdAt?: Date;
    createdByUid?: number;
    createdBy?: IUser;
    updatedAt?: Date;
    updatedByUid?: number;
    updatedBy?: IUser;
}




interface IActivePath {
    room?: number,
    location?: number,
    section?: number,
    container?: number,
}

export interface ITreeData {
  treeData: IStoreRoom[]  
  activePath: IActivePath, 
  activeTree: IStoreRoom | IStorageLocation | IStorageSection | IStorageContainer
}