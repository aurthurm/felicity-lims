import { IAnalysisProfile, IAnalysisRequest, IAnalysisService } from './analysis';
import { IUser }                                                from './auth';
import { IClient }                                              from './client';
import { IPatient }                                             from './patient';


export interface IAnalysisPrice {
    uid: string;
    analysisUid: string;
    analysis: IAnalysisService;
    isActive: boolean;
    amount: number;
    createdAt?: string
    createdByUid?: string;
    createdBy?: IUser;
    updatedAt?: string
    updatedByUid?: string;
    updatedBy?: IUser;
}

export interface IProfilePrice {
    uid: string;
    profileUid: string;
    profile: IAnalysisProfile;
    isActive: boolean;
    amount: number;
    createdAt?: string;
    createdByUid?: string;
    createdBy?: IUser;
    updatedAt?: string;
    updatedByUid?: string;
    updatedBy?: IUser;
}

export interface IAnalysisDiscount {
    uid: string;
    analysisUid: string;
    analysis: IAnalysisService;
    name: string;
    discountType: string;
    valueType: string;
    startDate: string;
    endDate: string;
    voucherUid: string;
    voucher: IVoucher;
    valuePercent: number;
    valueAmount: number;
    isActive: boolean;
    createdAt?: string;
    createdByUid?: string;
    createdBy?: IUser;
    updatedAt?: string;
    updatedByUid?: string;
    updatedBy?: IUser;
}

export interface IProfileDiscount {
    uid: string;
    profileUid: string;
    profile: IAnalysisProfile;
    name: string;
    discountType: string;
    valueType: string;
    startDate: string;
    endDate: string;
    voucherUid: string;
    voucher: IVoucher;
    valuePercent: number;
    valueAmount: number;
    isActive: boolean;
    createdAt?: string;
    createdByUid?: string;
    createdBy?: IUser;
    updatedAt?: string;
    updatedByUid?: string;
    updatedBy?: IUser;
    }

export interface IVoucher {
    uid?: string;
    name: string;
    usageLimit: number;
    used?: number;
    startDate: string;
    endDate: string;
    oncePerCustomer: boolean;
    oncePerOrder: boolean;
    codes: IVoucherCode[];
    createdAt?: string;
    createdByUid?: string;
    createdBy?: IUser;
    updatedAt?: string;
    updatedByUid?: string;
    updatedBy?: IUser;
}

export interface IVoucherCode {
    uid?: string;
    code: string;
    voucherUid: string;
    voucher: IVoucher;
    usageLimit: number;
    used?: number;
    isActive: boolean;
    createdAt?: string;
    createdByUid?: string;
    createdBy?: IUser;
    updatedAt?: string;
    updatedByUid?: string;
    updatedBy?: IUser;
}

export interface IVoucherCustomer {
    uid: string;
    patientUid: string;
    patient: IPatient;
    voucherCodeUid: string;
    voucherCode: IVoucherCode;
    createdAt?: string;
    createdByUid?: string;
    createdBy?: IUser;
    updatedAt?: string;
    updatedByUid?: string;
    updatedBy?: IUser;
}

export interface ITestBill {
    uid: string;
    billId: string;
    patientUid: string;
    patient: IPatient;
    clientUid: string;
    client: IClient;
    isActive: boolean;
    toConfirm: boolean;
    partial: boolean;
    totalCharged: number;
    totalPaid: number;
    jsonContent?: any;
    createdAt?: string;
    createdByUid?: string;
    createdBy?: IUser;
    updatedAt?: string;
    updatedByUid?: string;
    updatedBy?: IUser;
    orders: IAnalysisRequest[]
}

export interface ITestBillTransaction {
    uid: string;
    testBillUid: string;
    testBill: ITestBill;
    kind: string;
    amount: number;
    isSuccess: boolean;
    actionRequired: boolean;
    processed: boolean;
    notes: string;
    message: string
    actionMessage: string
    createdAt?: string;
    createdByUid?: string;
    createdBy?: IUser;
    updatedAt?: string;
    updatedByUid?: string;
    updatedBy?: IUser;
}

export interface ITestBillInvoice {
    uid: string;
    testBillUid: string;
    testBill: ITestBill
    jsonContent?: any;
    pdfContent?: any;
    createdAt?: string;
    createdByUid?: string;
    createdBy?: IUser;
    updatedAt?: string
    updatedByUid?: string;
    updatedBy?: IUser;
}