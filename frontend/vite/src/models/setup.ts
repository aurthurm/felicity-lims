import { IAnalysisService } from "./analysis";

export interface IInstrument {
    uid: number;
    name: string;
    keyword: string;
    description: string;
    supplier: any;
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