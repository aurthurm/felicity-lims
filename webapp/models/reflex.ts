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

export interface IReflexBrainCondition {
    uid?: string;
    reflexBrainUid?: string;
    reflexBrain?: IReflexBrain;
    description?: string;
    criteria?: IReflexBrainConditionCriteria[];
    priority?: number;
}

export interface IReflexBrainConditionCriteria {
    analysisUid?: string;
    analysis?: IAnalysisService;
    reflexBrainConditionUid?: string;
    reflexBrainCondition?: IReflexBrainCondition;
    operator?: string;
    value?: number;
}

export interface IReflexBrainAddition {
    analysisUid?: string;
    analysis?: IAnalysisService;
    reflexBrainActionUid?: string;
    reflexBrainAction?: IReflexBrainAction;
    count?: number;
}

export interface IReflexBrainFinal {
    analysisUid?: string;
    analysis?: IAnalysisService;
    reflexBrainActionUid?: string;
    reflexBrainAction?: IReflexBrainAction;
    value?: string;
}

export interface IReflexBrain {
    uid?: string;
    reflexActionUid?: string;
    reflexAction?: IReflexBrain;
    conditions?: IReflexBrainCondition[];
    actions?: IReflexBrainAction[];
    description?: string;
    priority?: number;
    createdByUid?: string;
    createdBy?: IUser;
    createdAt?: string;
}

export interface IReflexBrainAction {
    uid?: string;
    reflexBrainUid?: string;
    reflexBrain?: IReflexBrain;
    description?: string;
    addNew?: IReflexBrainAddition[];
    finalise?: IReflexBrainFinal[];
    priority?: number;
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

export interface IComplexCondition {
    conditionType: 'AND' | 'OR';
    subconditions: {
        analysisUid: string;
        operator: 'eq' | 'neq' | 'gt' | 'lt';
        value: string;
    }[];
}