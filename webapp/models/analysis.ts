import { number } from 'yup';
import { IClient, IClientContact } from './client';
import { IPatient } from './patient';
import { IInstrument, IMethod, IUnit, IDepartment } from './setup';
import { IStorageContainer, IStorageSlot } from './storage';

export interface ISampleType {
    uid?: string;
    name?: string;
    abbr?: string;
    description?: string;
    active?: boolean;
}

export interface IAnalysisService {
    uid?: string;
    name?: string;
    keyword?: string;
    description?: string;
    unitUid?: string;
    unit?: IUnit;
    departmentUid?: string;
    sampleTypes?: ISampleType[] | number[];
    profiles?: IAnalysisProfile[];
    category?: IAnalysisCategory;
    resultOptions?: IResultOption[];
    interims?: IAnalysisInterim[];
    correctionFactors?: IAnalysisCorrectionFactor[];
    specifications?: IAnalysisSpecification[];
    detectionLimits?: IAnalysisDetectionLimit[];
    uncertainties?: IAnalysisUncertainty[];
    instruments?: IInstrument[];
    methods?: IMethod[] | number[];
    categoryUid?: string;
    sortKey?: number;
    active?: boolean;
    internalUse?: boolean;
    tatLengthMinutes: number;
    precision: number;
    requiredVerifications: number;
    selfVerification: boolean;
    checked?: boolean;
}

export interface IAnalysisResult {
    uid?: string;
    analysisUid?: string;
    analysis?: IAnalysisService;
    instrumentUid?: string;
    instrument?: IInstrument;
    methodUid?: string;
    method?: IMethod;
    analystUid?: string;
    analyst?: any;
    worksheetPosition?: number;
    sampleUid?: string;
    sample?: ISample;
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
    uid?: string;
    name?: string;
    description?: string;
    departmentUid?: string;
    department?: IDepartment;
    active?: boolean;
}

export interface IAnalysisProfile {
    uid?: string;
    name?: string;
    description?: string;
    keyword?: string;
    departmentUid?: string;
    analyses?: IAnalysisService[] | number[];
    sampleTypes?: ISampleType[] | number[];
    active?: boolean;
}

export interface IQCRequest {
    qcTemplateUid?: string;
    qcLevels?: string[]; // uids
    analysisProfiles?: string[]; // uids
    analysisServices?: string[]; // uids
}

export interface IQCLevel {
    uid?: string;
    level?: string;
}

export interface IQCTemplate {
    uid?: string;
    name?: string;
    description?: string;
    qcLevels?: IQCLevel[];
    departments?: any[];
    category?: string;
}

export interface IResultOption {
    uid?: string;
    analysisUid?: string;
    optionKey?: number;
    value?: string;
}

export interface ISample {
    uid?: string;
    sampleId?: string;
    sampleType?: ISampleType | undefined;
    profiles?: IAnalysisProfile[];
    analyses?: IAnalysisService[];
    assigned?: boolean;
    qcLevel?: IQCLevel;
    analysisRequest?: IAnalysisRequest;
    analysisResults?: IAnalysisResult[];
    rejectionReasons?: IRejectionReason[];
    status?: string;
    priority?: number;
    checked?: boolean;
    dateReceived?: string;
    storageContainerUid: number;
    storageContainer: IStorageContainer;
    storageSlotIndex: number;
    storageSlot: string;
    createdByUid?: string;
    createdBy?: any;
    createdAt?: string;
    updatedByUid?: string;
    updatedBy?: any;
    updatedAt?: string;
}

export interface IAnalysisRequest {
    uid?: string;
    clinicalData?: string;
    patient?: IPatient;
    cientUid?: string;
    client?: IClient;
    clientContactUid?: string;
    clientContact?: IClientContact;
    clientName?: string;
    samples?: ISample[];
    clientRequestId?: string;
    priority?: number;
    createdAt?: Date;
}

export interface IQCSet {
    uid?: string;
    name?: string;
    samples?: ISample[];
    analytes?: IAnalysisService;
    createdByUid?: string;
    createdBy?: any;
    createdAt?: string;
    updatedByUid?: string;
    updatedBy?: any;
    updatedAt?: string;
}

export interface IRejectionReason {
    uid?: string;
    reason?: string;
}

export interface IAnalysisInterim {
    uid?: string;
    key?: number;
    value?: string;
    analysisUid?: string;
    instrumentUid?: string;
}

export interface IAnalysisCorrectionFactor {
    uid?: string;
    factor?: string;
    analysisUid?: string;
    instrumentUid?: string;
    methodUid?: string;
}

export interface IAnalysisDetectionLimit {
    uid?: string;
    lowerLimit?: number;
    upperLimit?: number;
    analysisUid?: string;
    instrumentUid?: string;
    methodUid?: string;
}

export interface IAnalysisUncertainty {
    uid?: string;
    min?: number;
    max?: number;
    value?: number;
    analysisUid?: string;
    instrumentUid?: string;
    methodUid?: string;
}

export interface IAnalysisSpecification {
    uid?: string;
    analysisUid?: string;
    unitUid?: string;
    unit?: IUnit[];
    min?: number;
    max?: number;
    minWarn?: number;
    maxWarn?: number;
    minReport?: string;
    maxReport?: string;
    warnValues?: string;
    warnReport?: string;
    gender?: string;
    ageMin?: number;
    ageMax?: number;
    methodUid?: string;
}
