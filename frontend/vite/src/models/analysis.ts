import { IClient } from "./client";
import { IPatient } from "./patient";

export interface ISampleType {
    uid?: number;
    name?: string;
}

export interface ISampleRequest extends ISample {
    uid?: number;
    sampleId?: string;
    priority?: string;
    status?: string;
    analysisRequest?: IAnalysisRequest;
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
    analysisUid?: string;
    analysis?: IAnalysisService;
    worksheetPosition?: number;
    sampleUid?: string;
    sample?: ISampleRequest;
    status?: string;
    result?: string;
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
    sampleType?: ISampleType | undefined; 
    profiles?: IAnalysisProfile[];
    analyses?: IAnalysisService[];
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
    sampleType?: ISampleType | undefined; 
    profiles?: IAnalysisProfile[];
    analyses?: IAnalysisService[];
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


  export interface IQCSet {}