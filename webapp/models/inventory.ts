import { IUser } from './auth';
import { IDepartment } from './setup';


export interface IStockItem {
    uid: string;
    name: string;
    description: string;
    categoryUid: string;
    category: IStockCategory;
    hazardUid: string;
    hazard: IHazard;
    maximumLevel: number;
    minimumLevel: number;
    variants: IStockItemVariant[];
    createdAt: Date;
    createdByUid: string;
    createdBy: IUser;
    updatedAt: Date;
    updatedByUid: string;
    updatedBy: IUser;
}

export interface IStockItemVariant {
    uid: string;
    name: string;
    description: string;
    stockItemUid: string;
    stockItem: IStockItem;
    minimumLevel: number;
    maximumLevel: number;
    createdAt: Date;
    createdByUid: string;
    createdBy: IUser;
    updatedAt: Date;
    updatedByUid: string;
    updatedBy: IUser;
}

export interface IStockCategory {
    uid: string;
    name: string;
    description: string;
    createdAt: Date;
    createdByUid: string;
    createdBy: IUser;
    updatedAt: Date;
    updatedByUid: string;
    updatedBy: IUser;
}

export interface IHazard {
    uid: string;
    name: string;
    description: string;
    createdAt: Date;
    createdByUid: string;
    createdBy: IUser;
    updatedAt: Date;
    updatedByUid: string;
    updatedBy: IUser;
}

export interface IStockUnit {
    uid: string;
    name: string;
    description: string;
    synonyms: string;
    createdAt: Date;
    createdByUid: string;
    createdBy: IUser;
    updatedAt: Date;
    updatedByUid: string;
    updatedBy: IUser;
}

export interface IStockLot {
    uid: string;
    productUid: string;
    lotNumber: string;
    expiryDate: string;
    remarks: string;
    quantity: number
}

export interface IStockProduct {
    uid: string;
    name: string;
    description: string;
    remaining: string;
    stockItemUid: string;
    stockItem: IStockItem;
    stockItemVariantUid: string;
    stockItemVariant: IStockItemVariant
    receivedByUid: string;
    receivedBy: IUser;
    createdAt: Date;
    createdByUid: string;
    createdBy: IUser;
    updatedAt: Date;
    updatedByUid: string;
    updatedBy: IUser;
}

export interface IStockReceive {
    stockItemVariantUid: string;
    receivedByUid: string;
    lotNumber: string;
    unitPrice: number;
    totalPrice: number;
    supplierUid: string;
    unitUid: string;
    singlesReceived: number;
    packagesReceived: number;
    packageFactor: number;
    quantityReceived: number;
    receiptType: string;
    receiptByUid: number;
    receiptDate: string;
    expiryDate: string;
    storeRoomUid: string;
}

export interface IStockProductInventory {
    uid: string;
    productUid: string;
    stockLotUid: string;
    quantity: number;
    remarks: string;
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
    stockLotUid: string;
    stockLot: IStockLot;
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

export interface IStockReceipt {
    uid: string;
    productUid: string;
    stockLotUid: string;
    unitPrice: string;
    totalPrice: string;
    supplierUid: string;
    unitUid: string;
    singlesReceived: number;
    packagesReceived: number;
    packageFactor: number;
    quantityReceived: number;
    receiptType: string;
    receiptByUid: string;
    receiptDate: Date;
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
    lotNumber: string;
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
