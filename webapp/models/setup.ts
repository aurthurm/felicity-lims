import { IAnalysisService } from './analysis';
import { IUser } from './auth';
import { IGenericLocation } from './location';

export interface ILaboratory extends IGenericLocation {
    labName?: string;
    labManagerUid?: string;
    labManager?: IUser;
    logo?: string;
    address?: string;
}

export interface ILaboratorySetting {
    uid?: string;
    laboratoryUid?: string;
    laboratory?: ILaboratory;
    allowSelfVerification: boolean;
    allowPatientRegistration: boolean;
    allowSampleRegistration: boolean;
    allowWorksheetCreation: boolean;
    defaultRoute?: string;
    passwordLifetime?: number;
    inactivityLogOut?: number;
    defaultTheme?: string;
    autoReceiveSamples: boolean;
    stickerCopies?: number;
}

export interface ISupplier {
    uid?: string;
    name?: string;
    description?: string;
}

export interface IManufacturer {
    uid?: string;
    name?: string;
    description?: string;
}

export interface IDepartment {
    uid?: string;
    name?: string;
    description?: string;
}

export interface IInstrumentType {
    uid?: string;
    name?: string;
    description?: string;
}

export interface IInstrument {
    uid?: string;
    name?: string;
    keyword?: string;
    description?: string;
    supplierUid?: string;
    supplier?: ISupplier;
    manufacturerUid?: string;
    manufacturer?: IManufacturer;
    instrumentTypeUid?: string;
    instrumentType?: IInstrumentType;
}

export interface IMethod {
    uid?: string;
    name?: string;
    keyword?: string;
    description?: string;
    instruments?: number[] | IInstrument[];
    analyses?: number[] | IAnalysisService[];
}

export interface IDepartment {
    uid?: string;
    name?: string;
    description?: string;
}

export interface IUnit {
    uid?: string;
    name?: string;
    isSiUnit?: boolean;
}
