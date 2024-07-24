import { IAnalysisService, ISampleType } from './analysis';
import { IUser }                         from './auth';


export interface IReflexRule {
    uid?: string;
    name?: string;
    description?: string;
    reflexActions: IReflexAction[];
    createdByUid?: string;
    createdBy?: IUser;
    createdAt?: string;
}

export interface IReflexBrainCriteria {
    analysisUid?: string;
    analysis?: IAnalysisService;
    reflexBrainUid?: string;
    reflexBrain?: IReflexBrain;
    operator?: string;
    value?: number;
}

export interface IReflexBrainAddition {
    analysisUid?: string;
    analysis?: IAnalysisService;
    reflexBrainUid?: string;
    reflexBrain?: IReflexBrain;
    count?: number;
}

export interface IReflexBrainFinal {
    analysisUid?: string;
    analysis?: IAnalysisService;
    reflexBrainUid?: string;
    reflexBrain?: IReflexBrain;
    value?: string;
}

export interface IReflexBrain {
    uid?: string;
    reflexActionUid?: string;
    reflexAction?: IReflexBrain;
    description?: string;
    analysesValues?: IReflexBrainCriteria[];
    addNew?: IReflexBrainAddition[];
    finalise?: IReflexBrainFinal[];
    createdByUid?: string;
    createdBy?: IUser;
    createdAt?: string;
}

export interface IReflexAction {
    uid?: string;
    level?: number;
    description?: string;
    analysisUid?: string;
    analyses?: IAnalysisService[];
    sampleTypeUid?: string;
    sampleType?: ISampleType;
    reflexRuleUid?: string;
    reflexRule?: IReflexRule;
    brains?: IReflexBrain[];
    createdByUid?: string;
    createdBy?: IUser;
    createdAt?: string;
}
