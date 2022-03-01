import { IAnalysisService } from "./analysis";


export interface ISupplier {
  uid: number;
  name: string;
  description: string;
}

export interface IManufacturer {
  uid: number;
  name: string;
  description: string;
}

export interface IDepartment {
  uid: number;
  name: string;
  description: string;
}

export interface IInstrumentType {
  uid: number;
  name: string;
  description: string;
}


export interface IInstrument {
  uid: number;
  name: string;
  keyword: string;
  description: string;
  supplierUid: number;
  supplier: ISupplier;
  manufacturerUid: number;
  manufacturer: IManufacturer;
  instrumentTypeUid: number;
  instrumentType: IInstrumentType;
}
  
export interface IMethod {
  uid: number;
  name: string;
  keyword: string;
  description: string;
  instruments: number[] | IInstrument[];
  analyses: number[] | IAnalysisService[];
}

export interface IDepartment {
  uid: number;
  name: string;
  description: string;
}

export interface IUnit {
  uid: number,
  name: string,
  isSiUnit: boolean;
}