import { IUser } from "./auth"
import { IDepartment, ISupplier } from "./setup"
import { IStoreRoom } from "./storage";

export interface IStockItem {
    uid?: number;
    name?: String;
    departmentUid?: number;
    department?: IDepartment;
    description?: String;
    createdAt?: Date;
    createdByUid?: number;
    createdBy?: IUser;
    updatedAt?: Date;
    updatedByUid?: number;
    updatedBy?: IUser;
}

export interface IStockCategory {
    uid?: number;
    name?: String;
    description?: String;
    createdAt?: Date;
    createdByUid?: number;
    createdBy?: IUser;
    updatedAt?: Date;
    updatedByUid?: number;
    updatedBy?: IUser;
}

export interface IHazard {
    uid?: number;
    name?: String;
    description?: String;
    createdAt?: Date;
    createdByUid?: number;
    createdBy?: IUser;
    updatedAt?: Date;
    updatedByUid?: number;
    updatedBy?: IUser;
}

export interface IStockUnit {
    uid?: number;
    name?: String;
    createdAt?: Date;
    createdByUid?: number;
    createdBy?: IUser;
    updatedAt?: Date;
    updatedByUid?: number;
    updatedBy?: IUser;
}

export interface IStockPackaging {
    uid?: number;
    name?: String;
    createdAt?: Date;
    createdByUid?: number;
    createdBy?: IUser;
    updatedAt?: Date;
    updatedByUid?: number;
    updatedBy?: IUser;
}

export interface IStockProduct {
    uid?: number;
    name?: String;
    departmentUid?: number;
    department?: IDepartment;
    supplierUid?: number;
    supplier?: ISupplier;
    categoryUid?: number;
    category?: IStockCategory;
    hazardUid?: number;
    hazard?: IHazard;
    storeRoomUid?: number;
    storeRoom?: IStoreRoom;
    lotNumber?: String;
    batch?: String;
    size?: number;
    unitUid?: number;
    unit?: IStockUnit;
    packagingUid?: number;
    packaging?: IStockPackaging;
    price?: number;
    quantityReceived?: number;
    minimumLevel?: number;
    remaining?: number;
    dateReceived?: Date;
    expiryDate?: Date;
    receivedByUid?: number;
    receivedBy?: IUser;
    createdAt?: Date;
    createdByUid?: number;
    createdBy?: IUser;
    updatedAt?: Date;
    updatedByUid?: number;
    updatedBy?: IUser;
}

export interface IStockOrder {
    uid?: number;
    orderByUid?: number;
    orderBy?: IUser;
    departmentUid?: number;
    department?: IDepartment;
    status?: String;
    remarks?: String;
    orderNumber?: String;
    createdAt?: Date;
    createdByUid?: number;
    createdBy?: IUser;
    updatedAt?: Date;
    updatedByUid?: number;
    updatedBy?: IUser;
}

export interface IStockOrderProduct {
    uid?: number;
    productUid?: number;
    product?: IStockProduct;
    orderUid?: number;
    order?: IStockOrder;
    price?: number;
    quantity?: number;
    createdAt?: Date;
    createdByUid?: number;
    createdBy?: IUser;
    updatedAt?: Date;
    updatedByUid?: number;
    updatedBy?: IUser;
}

export interface IStockTransaction {
    uid?: number;
    productUid?: number;
    product?: IStockProduct;
    issued?: number;
    departmentUid?: number;
    department?: IDepartment;
    dateIssued?: Date;
    transactionByUid?: number;
    transactionBy?: IUser;
    createdAt?: Date;
    createdByUid?: number;
    createdBy?: IUser;
    updatedAt?: Date;
    updatedByUid?: number;
    updatedBy?: IUser;
}

export interface IStockAdjustment {
    uid?: number;
    productUid?: number;
    product?: IStockProduct;
    adjustmentType?: String;
    adjust?: number;
    adjustmentDate?: Date;
    remarks?: String;
    adjustmentByUid?: number;
    adjustmentBy?: IUser;
    createdAt?: Date;
    createdByUid?: number;
    createdBy?: IUser;
    updatedAt?: Date;
    updatedByUid?: number;
    updatedBy?: IUser;
}
