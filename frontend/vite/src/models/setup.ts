import { IAnalysisService } from "./analysis";
import { IUser } from "./auth";
import { IGenericLocation } from "./location";

export interface ILaboratory extends IGenericLocation {
  labName?: string,
  labManagerUid?: number,
  labManager?: IUser,
  logo?: string,
  address?: string,
}

export interface ILaboratorySetting {
  uid?: number,
  laboratoryUid?: number,
  laboratory?: ILaboratory,
  allowSelfVerification: boolean,
  allowPatientRegistration: boolean,
  allowSampleRegistration: boolean,
  allowWorksheetCreation: boolean,
  defaultRoute?: string,
  passwordLifetime?: number,
  inactivityLogOut?: number,
  defaultTheme?: string,
  autoReceiveSamples: boolean,
  stickerCopies?: number,
}



export interface ISupplier {
  uid?: number;
  name?: string;
  description?: string;
}

export interface IManufacturer {
  uid?: number;
  name?: string;
  description?: string;
}

export interface IDepartment {
  uid?: number;
  name?: string;
  description?: string;
}

export interface IInstrumentType {
  uid?: number;
  name?: string;
  description?: string;
}


export interface IInstrument {
  uid?: number;
  name?: string;
  keyword?: string;
  description?: string;
  supplierUid?: number;
  supplier?: ISupplier;
  manufacturerUid?: number;
  manufacturer?: IManufacturer;
  instrumentTypeUid?: number;
  instrumentType?: IInstrumentType;
}
  
export interface IMethod {
  uid?: number;
  name?: string;
  keyword?: string;
  description?: string;
  instruments?: number[] | IInstrument[];
  analyses?: number[] | IAnalysisService[];
}

export interface IDepartment {
  uid?: number;
  name?: string;
  description?: string;
}

export interface IUnit {
  uid?: number,
  name?: string,
  isSiUnit?: boolean;
}