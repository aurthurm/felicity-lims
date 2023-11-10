import { IUser } from './auth';
import { IDepartment, ISupplier } from './setup';
import { IStoreRoom } from './storage';

export interface IStockItem {
    uid: string;
    name: String;
    departmentUid: string;
    department: IDepartment;
    description: string;
    maximumLevel: number;
    minimumLevel: number;
    createdAt: Date;
    createdByUid: string;
    createdBy: IUser;
    updatedAt: Date;
    updatedByUid: string;
    updatedBy: IUser;
}

export interface IStockCategory {
    uid: string;
    name: String;
    description: String;
    createdAt: Date;
    createdByUid: string;
    createdBy: IUser;
    updatedAt: Date;
    updatedByUid: string;
    updatedBy: IUser;
}

export interface IHazard {
    uid: string;
    name: String;
    description: String;
    createdAt: Date;
    createdByUid: string;
    createdBy: IUser;
    updatedAt: Date;
    updatedByUid: string;
    updatedBy: IUser;
}

export interface IStockUnit {
    uid: string;
    name: String;
    createdAt: Date;
    createdByUid: string;
    createdBy: IUser;
    updatedAt: Date;
    updatedByUid: string;
    updatedBy: IUser;
}

export interface IStockPackaging {
    uid: string;
    name: String;
    createdAt: Date;
    createdByUid: string;
    createdBy: IUser;
    updatedAt: Date;
    updatedByUid: string;
    updatedBy: IUser;
}

export interface IStockProduct {
    uid: string;
    name: string;
    stockItemUid: string;
    stockItem: IStockItem;
    departmentUid: string;
    department: IDepartment;
    supplierUid: string;
    supplier: ISupplier;
    categoryUid: string;
    category: IStockCategory;
    hazardUid: string;
    hazard: IHazard;
    storeRoomUid: string;
    storeRoom: IStoreRoom;
    lotNumber: String;
    batch: String;
    size: number;
    unitUid: string;
    unit: IStockUnit;
    packagingUid: string;
    packaging: IStockPackaging;
    price: number;
    quantityReceived: number;
    minimumLevel: number;
    remaining: number;
    dateReceived: Date;
    expiryDate: Date;
    receivedByUid: string;
    receivedBy: IUser;
    createdAt: Date;
    createdByUid: string;
    createdBy: IUser;
    updatedAt: Date;
    updatedByUid: string;
    updatedBy: IUser;
}

export interface IStockOrder {
    uid: string;
    orderByUid: string;
    orderBy: IUser;
    departmentUid: string;
    department: IDepartment;
    status: string;
    remarks: string;
    orderNumber: string;
    createdAt: Date;
    createdByUid: string;
    createdBy: IUser;
    updatedAt: Date;
    updatedByUid: string;
    updatedBy: IUser;
}

export interface IStockOrderProduct {
    uid: string;
    productUid: string;
    product: IStockProduct;
    orderUid: string;
    order: IStockOrder;
    price: number;
    quantity: number;
    issue: number;
    createdAt: Date;
    createdByUid: string;
    createdBy: IUser;
    updatedAt: Date;
    updatedByUid: string;
    updatedBy: IUser;
}

export interface IStockTransaction {
    uid: string;
    productUid: string;
    product: IStockProduct;
    issued: number;
    departmentUid: string;
    department: IDepartment;
    dateIssued: Date;
    transactionByUid: string;
    transactionBy: IUser;
    createdAt: Date;
    createdByUid: string;
    createdBy: IUser;
    updatedAt: Date;
    updatedByUid: string;
    updatedBy: IUser;
}

export interface IStockAdjustment {
    uid: string;
    productUid: string;
    product: IStockProduct;
    adjustmentType: String;
    adjust: number;
    adjustmentDate: Date;
    remarks: String;
    adjustmentByUid: string;
    adjustmentBy: IUser;
    createdAt: Date;
    createdByUid: string;
    createdBy: IUser;
    updatedAt: Date;
    updatedByUid: string;
    updatedBy: IUser;
}
