import { ISample } from "./analysis"
import { IUser } from "./auth"

export interface IStoreRoom {
    uid?: number;
    name?: String;
    description?: String;
    created_at?: Date;
    created_by_uid?: number;
    created_by?: IUser;
    updated_at?: Date;
    updated_by_uid?: number;
    updated_by?: IUser;
}


export interface IStorageLocation {
    uid?: number;
    name?: String;
    description?: String;
    store_room_uid?: number;
    store_room?: IStoreRoom;
    created_at?: Date;
    created_by_uid?: number;
    created_by?: IUser;
    updated_at?: Date;
    updated_by_uid?: number;
    updated_by?: IUser;
}


export interface IStorageSection {
    uid?: number;
    name?: String;
    description?: String;
    storage_location_uid?: number;
    storage_location?: IStorageLocation;
    created_at?: Date;
    created_by_uid?: number;
    created_by?: IUser;
    updated_at?: Date;
    updated_by_uid?: number;
    updated_by?: IUser;
}


export interface IStorageContainer {
    uid?: number;
    name?: String;
    description?: String;
    storage_section_uid?: number;
    storage_section?: IStorageSection;
    grid?: boolean;
    row_wise?: boolean;
    cols?: number;
    rows?: number;
    slots?: number;
    storage_slots?: IStorageSlot[];
    samples?: ISample[];
    created_at?: Date;
    created_by_uid?: number;
    created_by?: IUser;
    updated_at?: Date;
    updated_by_uid?: number;
    updated_by?: IUser;
}


export interface IStorageSlot {
    uid?: number;
    storage_container_uid?: number;
    storage_container?: IStorageContainer;
    position?: String;
    position_label?: String;
    sample?: ISample[];
    created_at?: Date;
    created_by_uid?: number;
    created_by?: IUser;
    updated_at?: Date;
    updated_by_uid?: number;
    updated_by?: IUser;
}