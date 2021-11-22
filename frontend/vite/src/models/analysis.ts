import { IClient } from "./client";
import { IPatient } from "./patient";
import { IInstrument, IMethod } from "./setup";

export interface ISampleType {
    uid?: number;
    name?: string;
}

export interface ISampleRequest extends ISample {
    uid?: number;
    sampleId?: string;
    priority?: number;
    status?: string;
    analysisrequest?: IAnalysisRequest;
    sampletype?: ISampleType;
}

export interface IAnalysisService {
    uid?: number;
    name?: string;
    keyword?: string;
    description?: string;
    unit?: string;
    profiles?: IAnalysisProfile[];
    category?: IAnalysisCategory;
    resultoptions?: IResultOption[],
    categoryUid?: number,
    sortKey?: number;
    active?: boolean;
    internalUse?: boolean;
    checked?: boolean;
}

export interface IAnalysisResult {
    uid?: number;
    analysisUid?: number;
    analysis?: IAnalysisService;
    instrumentUid?: number;
    instrument?: IInstrument;
    methodUid?: number;
    method?: IMethod;
    analystUid?: number;
    analyst?: any;
    worksheetPosition?: number;
    sampleUid?: number;
    sample?: ISampleRequest;
    status?: string;
    result?: string;
    retest?: boolean;
    reportable?: boolean;
    editResult?: string;
    createdAt?: string;
    checked?: boolean;
    editable?: boolean;
}

export interface IAnalysisCategory {
    uid?: number;
    name?: string;
    description?: string;
    active?: boolean;
}
  
  export interface IResultOption {
    uid?: number;
    analysisUid?: number;
    optionKey?: number;
    value?: string;
}
  
export interface IAnalysisService {
    uid?: number;
    name?: string;
    keyword?: string;
    description?: string;
    unit?: string;
    profiles?: IAnalysisProfile[];
    category?: IAnalysisCategory;
    resultoptions?: IResultOption[],
    categoryUid?: number,
    sortKey?: number;
    active?: boolean;
    internalUse?: boolean;
    checked?: boolean;
}
  
export interface IAnalysisProfile {
    uid?: number;
    name?: string;
    description?: string;
    keyword?: string,
    analyses?: IAnalysisService[];
    active?: boolean;
}
  
  
export interface ISample {
    uid?: number;
    sampleType?: ISampleType | undefined; 
    profiles?: IAnalysisProfile[];
    analyses?: IAnalysisService[];
}
  

export interface IAnalysisRequest {
    uid?: number;
    patient?: IPatient; 
    client?: IClient;  
    samples?: ISample[];
    clientRequestId?: string;
    priority?: number;
    createdAt?: Date;
}
  
  
export interface IQCRequest {
    qcTemplateUid?: string;
    qcLevels?: string[]; // uids
    analysisProfiles?: string[]; // uids
    analysisServices?: string[]; // uids
}
  

export interface IQCLevel {
    uid?: number;
    level?: string; 
}
  
export interface IQCTemplate {
    uid?: number;
    name?: string; 
    description?: string;  
    qcLevels?: IQCLevel[];
    departments?: any[];
}


export interface IAnalysisCategory {
    uid?: number;
    name?: string;
    description?: string;
    active?: boolean;
  }
  
  export interface IResultOption {
    uid?: number;
    analysisUid?: number;
    optionKey?: number;
    value?: string;
  }
  
  export interface IAnalysisService {
    uid?: number;
    name?: string;
    keyword?: string;
    description?: string;
    unit?: string;
    profiles?: IAnalysisProfile[];
    category?: IAnalysisCategory;
    resultoptions?: IResultOption[],
    categoryUid?: number,
    sortKey?: number;
    active?: boolean;
    internalUse?: boolean;
    checked?: boolean;
  }
  
  export interface IAnalysisProfile {
    uid?: number;
    name?: string;
    description?: string;
    keyword?: string,
    analyses?: IAnalysisService[];
    active?: boolean;
  }
  
  export interface ISample {
    uid?: number;
    sampleId?: string;
    sampleType?: ISampleType | undefined; 
    profiles?: IAnalysisProfile[];
    analyses?: IAnalysisService[];
    assigned?: boolean;
    qcLevel?: IQCLevel;
    analysisResults?: IAnalysisResult[];
    status?: string;
  }
  
  
  export interface IAnalysisRequest {
    patient?: IPatient; 
    client?: IClient;  
    samples?: ISample[];
    clientRequestId?: string;
    priority?: number;
    createdAt?: Date;
  }
  
  
  export interface IQCRequest {
    qcTemplateUid?: string;
    qcLevels?: string[]; // uids
    analysisProfiles?: string[]; // uids
    analysisServices?: string[]; // uids
  }
  
  export interface IQCLevel {
    uid?: number;
    level?: string; 
  }
  
  export interface IQCTemplate {
    uid?: number;
    name?: string; 
    description?: string;  
    qcLevels?: IQCLevel[];
    departments?: any[];
  }


  export interface IQCSet {
    uid?: number;
    name?: string; 
    samples?: ISample[];
    analytes?:IAnalysisService
    created_by_uid: number
    created_by: any
    created_at: string
    updated_by_uid: number
    updated_by: any
    updated_at: string
  }
