import { IInstrument } from './setup'
import { IAnalysisService, IAnalysisResult, ISampleType } from './analysis'

export interface IReserved {
    position: number;
    levelUid: number;
    row: number;
    col: number;
    name: string;
    sampleUid: number;
}

export interface IWorkSheetTemplate {
    uid: number;
    name: string;
    qcTemplateUid: number;
    reserved: IReserved[];
    preview: IReserved[];
    numberOfSamples: number;
    rows: number | undefined;
    cols: number | undefined;
    rowWise: boolean;
    worksheetType: string;
    instrument: IInstrument;
    sampleType: ISampleType;
    description: string;
    analyses: IAnalysisService[];
    state: string;
}

export interface IWorkSheet {
    uid: number;
    worksheetId: string;
    name: string;
    reserved: string[];
    plate: Map<string, string>;
    numberOfSamples: number;
    analysisResults: IAnalysisResult[],
    rows: number;
    cols: number;
    rowWise: Boolean;
    worksheetType: string;
    instrument: IInstrument;
    description: string;
    analyses: IAnalysisService[];
    state: string;
    assignedCount: number;
    analyst: any;
    priority: number

}
  
export interface IWorkSheetForm {
    analystUid: number;
    templateUid: number;
    instrumentUid: number;
    count: number;
}