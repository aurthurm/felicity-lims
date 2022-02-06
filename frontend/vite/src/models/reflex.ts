import { IAnalysisService, ISampleType } from "./analysis";
import { IUser } from "./auth";

export interface IReflexRule {
  uid?: number,
  name?: string,
  description?: string,
  reflexActions: IReflexAction[],
  createdByUid?: number,
  createdBy?: IUser,
  createdAt?: string,
  }

export interface IReflexBrainCriteria {
  analysisUid?: number,
  analysis?: IAnalysisService
  reflexBrainUid?: number,
  reflexBrain?: IReflexBrain,
  operator?: string,
  value?: number,
}

export interface IReflexBrainAddition {
  analysisUid?: number,
  analysis?: IAnalysisService
  reflexBrainUid?: number,
  reflexBrain?: IReflexBrain,
  count?: number,
}

export interface IReflexBrainFinal {
  analysisUid?: number,
  analysis?: IAnalysisService
  reflexBrainUid?: number,
  reflexBrain?: IReflexBrain,
  value?: number,
}

export interface IReflexBrain {
    uid?: number,
    reflexActionUid?: number,
    reflexAction?: IReflexBrain
    description?: string,
    analysesValues?: IReflexBrainCriteria[],
    addNew?: IReflexBrainAddition[],
    finalise?: IReflexBrainFinal[],
    createdByUid?: number,
    createdBy?: IUser,
    createdAt?: string,
}

export interface IReflexAction {
    uid?: number,
    level?: number,
    description?: string,
    analysisUid?: number,
    analyses?: IAnalysisService[],
    sampleTypeUid?: number,
    sampleType?: ISampleType,
    reflexRuleUid?: number,
    reflexRule?: IReflexRule,
    brains?: IReflexBrain[],
    createdByUid?: number,
    createdBy?: IUser,
    createdAt?: string,
}