import { IInstrument, IMethod } from './setup';
import { IAnalysisService, IAnalysisResult, ISampleType } from './analysis';

export interface IReserved {
    position: number;
    levelUid: string;
    row: number;
    col: number;
    name: string;
    sampleUid: string;
}

export interface IWorkSheetTemplate {
    uid: string;
    name: string;
    qcTemplateUid: string;
    reserved: IReserved[];
    preview: IReserved[];
    numberOfSamples: number;
    rows: number | undefined;
    cols: number | undefined;
    rowWise: boolean;
    worksheetType: string;
    instrumentUid: string;
    instrument: IInstrument;
    sampleTypeUid: string;
    sampleType: ISampleType;
    description: string;
    analysisUid: string;
    analysis: IAnalysisService;
    state: string;
}

export interface IWorkSheet {
    uid: string;
    worksheetId: string;
    name: string;
    reserved: string[];
    plate: Map<string, string>;
    numberOfSamples: number;
    analysisResults: IAnalysisResult[];
    rows: number;
    cols: number;
    rowWise: Boolean;
    worksheetType: string;
    instrumentUid: string;
    instrument: IInstrument;
    description: string;
    analysisUid: string;
    analysis: IAnalysisService;
    state: string;
    assignedCount: number;
    analyst: any;
    priority: number;
    methodUid?: string;
    method?: IMethod;
    template?: IWorkSheetTemplate;
}

export interface IWorkSheetForm {
    analystUid: string;
    templateUid: string;
    instrumentUid: string;
    count: number;
}
