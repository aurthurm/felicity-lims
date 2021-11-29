import { IClient, IClientContact } from "./client";
import { IPatient } from "./patient";
import { IInstrument, IMethod } from "./setup";

export interface ISampleType {
    uid: number;
    name: string;
    abbr: string;
    description: string;
    active: boolean;
}

export interface IAnalysisService {
    uid: number;
    name: string;
    keyword: string;
    description: string;
    unit: string;
    profiles: IAnalysisProfile[];
    category: IAnalysisCategory;
    resultoptions: IResultOption[],
    categoryUid: number,
    sortKey: number;
    active: boolean;
    internalUse: boolean;
    checked: boolean;
}

export interface IAnalysisResult {
    uid: number;
    analysisUid: number;
    analysis: IAnalysisService;
    instrumentUid: number;
    instrument: IInstrument;
    methodUid: number;
    method: IMethod;
    analystUid: number;
    analyst: any;
    worksheetPosition: number;
    sampleUid: number;
    sample: ISample;
    status: string;
    result: string;
    retest: boolean;
    reportable: boolean;
    editResult: string;
    createdAt: string;
    checked: boolean;
    editable: boolean;
}

export interface IAnalysisCategory {
    uid: number;
    name: string;
    description: string;
    active: boolean;
}
  
export interface IAnalysisProfile {
    uid: number;
    name: string;
    description: string;
    keyword: string,
    analyses: IAnalysisService[];
    active: boolean;
}

  
export interface IQCRequest {
    qcTemplateUid: string;
    qcLevels: string[]; // uids
    analysisProfiles: string[]; // uids
    analysisServices: string[]; // uids
}
  

export interface IQCLevel {
    uid: number;
    level: string; 
}
  
export interface IQCTemplate {
    uid: number;
    name: string; 
    description: string;  
    qcLevels: IQCLevel[];
    departments: any[];
}

  export interface IResultOption {
    uid: number;
    analysisUid: number;
    optionKey: number;
    value: string;
  }
  
  export interface ISample {
    uid: number;
    sampleId: string;
    sampletype: ISampleType | undefined; 
    profiles: IAnalysisProfile[];
    analyses: IAnalysisService[];
    assigned: boolean;
    qcLevel: IQCLevel;
    analysisrequest: IAnalysisRequest;
    analysisResults: IAnalysisResult[];
    status: string;
    priority: number;
    checked: boolean;
  }
  
  export interface IAnalysisRequest {
    clinicalData: string;
    patient: IPatient; 
    client: IClient; 
    clientContact?: IClientContact; 
    clientName?: string;
    samples: ISample[];
    clientRequestId: string;
    priority: number;
    createdAt: Date;
  }

  export interface IQCSet {
    uid: number;
    name: string; 
    samples: ISample[];
    analytes:IAnalysisService
    created_by_uid: number
    created_by: any
    created_at: string
    updated_by_uid: number
    updated_by: any
    updated_at: string
  }


  export interface IRejectionReason {
    uid: number;
    reason: string;
  }
