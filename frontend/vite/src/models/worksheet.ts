import { IInstrument } from './setup'
import { IAnalysisService, IAnalysisResult } from './analysis'

export interface IReserved {
    position: number;
    levelUid?: string;
}

export interface IWorkSheetTemplate {
    uid?: number;
    name?: string;
    qcTemplateUid?: number;
    reserved?: IReserved[];
    preview?: IReserved[];
    numberOfSamples?: number;
    rows?: number;
    cols?: number;
    rowWise?: Boolean;
    worksheetType?: string;
    instrument?: IInstrument;
    description?: string;
    analyses?: IAnalysisService[];
    state?: string;
}

export interface IWorkSheet {
    uid?: number;
    name?: string;
    reserved?: string[];
    plate?: Map<string, string>;
    numberOfSamples?: number;
    analysisResults?: IAnalysisResult[],
    rows?: number;
    cols?: number;
    rowWise?: Boolean;
    worksheetType?: string;
    instrument?: IInstrument;
    description?: string;
    analyses?: IAnalysisService[];
    state?: string;
}
  