import { IAnalysisResult } from './analysis';
import {IUser} from './auth';

export interface IAbxGuideline {
    uid?: string;
    name: string;
    code?: string;
    description?: string;
    createdAt?: string;
    createdByUid?: string;
    createdBy?: IUser;
    updatedAt?: string;
    updatedByUid?: string;
    updatedBy?: IUser;
}

export interface IAbxAntibioticGuideline {
    uid: string;
    antibioticUid: string;
    antibiotic?: IAbxAntibiotic;
    guidelineUid: string;
    guideline?: IAbxGuideline;
    createdAt?: string;
    createdByUid?: string;
    createdBy?: IUser;
    updatedAt?: string;
    updatedByUid?: string;
    updatedBy?: IUser;
}

export interface IAbxAntibiotic {
    uid?: string;
    name: string;
    guidelines: IAbxGuideline[];
    whonetAbxCode?: string;
    whoCode?: string;
    dinCode?: string;
    jacCode?: string;
    eucastCode?: string;
    userCode?: string;
    abxNumber?: string;
    potency?: string;
    atcCode?: string;
    class?: string;
    subclass?: string;
    profClass?: string;
    ciaCategory?: string;
    clsiOrder?: string;
    eucastOrder?: string;
    human?: boolean;
    veterinary?: boolean;
    animalGp?: string;
    loinccomp?: string;
    loincgen?: string;
    loincdisk?: string;
    loincmic?: string;
    loincetest?: string;
    loincslow?: string;
    loincafb?: string;
    loincsbt?: string;
    loincmlc?: string;
    comments?: string;
    createdAt?: string;
    createdByUid?: string;
    createdBy?: IUser;
    updatedAt?: string;
    updatedByUid?: string;
    updatedBy?: IUser;
}

export interface IAbxKingdom {
    uid: string;
    name: string;
    createdAt?: string;
    createdByUid?: string;
    createdBy?: IUser;
    updatedAt?: string;
    updatedByUid?: string;
    updatedBy?: IUser;
}

export interface IAbxPhylum {
    uid: string;
    name: string;
    kingdomUid?: string;
    kingdom?: IAbxKingdom;
    createdAt?: string;
    createdByUid?: string;
    createdBy?: IUser;
    updatedAt?: string;
    updatedByUid?: string;
    updatedBy?: IUser;
}

export interface IAbxClass {
    uid: string;
    name: string;
    phylumUid?: string;
    phylum?: IAbxPhylum;
    createdAt?: string;
    createdByUid?: string;
    createdBy?: IUser;
    updatedAt?: string;
    updatedByUid?: string;
    updatedBy?: IUser;
}

export interface IAbxOrder {
    uid: string;
    name: string;
    classUid?: string;
    class_?: IAbxClass;
    createdAt?: string;
    createdByUid?: string;
    createdBy?: IUser;
    updatedAt?: string;
    updatedByUid?: string;
    updatedBy?: IUser;
}

export interface IAbxFamily {
    uid: string;
    name: string;
    orderUid?: string;
    order?: IAbxOrder;
    createdAt?: string;
    createdByUid?: string;
    createdBy?: IUser;
    updatedAt?: string;
    updatedByUid?: string;
    updatedBy?: IUser;
}

export interface IAbxGenus {
    uid: string;
    name: string;
    familyUid?: string;
    family?: IAbxFamily;
    createdAt?: string;
    createdByUid?: string;
    createdBy?: IUser;
    updatedAt?: string;
    updatedByUid?: string;
    updatedBy?: IUser;
}

export interface IAbxOrganism {
    uid: string;
    name: string;
    whonetOrgCode?: string;
    replacedBy?: string;
    taxonomicStatus?: string;
    common?: string;
    organismType?: string;
    anaerobe?: boolean;
    morphology?: string;
    subkingdomCode?: string;
    familyCode?: string;
    genusGroup?: string;
    genusCode?: string;
    speciesGroup?: string;
    serovarGroup?: string;
    msfGrpClin?: string;
    sctCode?: string;
    sctText?: string;
    gbifTaxonId?: string;
    gbifDatasetId?: string;
    gbifTaxonomicStatus?: string;
    kingdomUid?: string;
    kingdom?: IAbxKingdom;
    guideline?: IAbxGuideline;
    phylumUid?: string;
    phylum?: IAbxPhylum;
    classUid?: string;
    class?: IAbxClass;
    orderUid?: string;
    order?: IAbxOrder;
    familyUid?: string;
    family?: IAbxFamily;
    genusUid?: string;
    genus?: IAbxGenus;
    comments?: string;
    createdAt?: string;
    createdByUid?: string;
    createdBy?: IUser;
    updatedAt?: string;
    updatedByUid?: string;
    updatedBy?: IUser;
}

export interface IAbxOrganismSerotype {
    uid: string;
    organismUid: string;
    organism?: IAbxOrganism;
    serotype: string;
    serogroup?: string;
    subspecies?: string;
    oAntigens?: string;
    hPhase1?: string;
    hPhase2?: string;
    x997Check?: string;
    fate?: string;
    createdAt?: string;
    createdByUid?: string;
    createdBy?: IUser;
    updatedAt?: string;
    updatedByUid?: string;
    updatedBy?: IUser;
}

export interface IAbxTestMethod {
    uid: string;
    name: string;
    description?: string;
    createdAt?: string;
    createdByUid?: string;
    createdBy?: IUser;
    updatedAt?: string;
    updatedByUid?: string;
    updatedBy?: IUser;
}

export interface IAbxBreakpointType {
    uid: string;
    name: string;
    description?: string;
    createdAt?: string;
    createdByUid?: string;
    createdBy?: IUser;
    updatedAt?: string;
    updatedByUid?: string;
    updatedBy?: IUser;
}

export interface IAbxHost {
    uid: string;
    name: string;
    description?: string;
    createdAt?: string;
    createdByUid?: string;
    createdBy?: IUser;
    updatedAt?: string;
    updatedByUid?: string;
    updatedBy?: IUser;
}

export interface IAbxSiteOfInfection {
    uid: string;
    name: string;
    description?: string;
    createdAt?: string;
    createdByUid?: string;
    createdBy?: IUser;
    updatedAt?: string;
    updatedByUid?: string;
    updatedBy?: IUser;
}


export interface IAbxGuidelineYear {
    uid: string;
    guidelineUid: string;
    guideline?: IAbxGuideline;
    year: number;
    code: string;
    createdAt?: string;
    createdByUid?: string;
    createdBy?: IUser;
    updatedAt?: string;
    updatedByUid?: string;
    updatedBy?: IUser;
}

export interface IAbxBreakpoint {
    uid: string;
    guidelineYearUid: string;
    guidelineYear?: IAbxGuidelineYear;
    testMethod: string;
    potency?: string;
    organismCode: string;
    organismCodeType: string;
    breakpointTypeUid: string;
    breakpointType?: IAbxBreakpointType;
    hostUid?: string;
    host?: IAbxHost;
    siteOfInfectionUid?: string;
    siteOfInfection?: IAbxSiteOfInfection;
    referenceTable?: string;
    referenceSequence?: string;
    whonetAbxCode?: string;
    comments?: string;
    r?: string;
    i?: string;
    sdd?: string;
    s?: string;
    ecvEcoff?: string;
    ecvEcoffTentative?: string;
    createdAt?: string;
    createdByUid?: string;
    createdBy?: IUser;
    updatedAt?: string;
    updatedByUid?: string;
    updatedBy?: IUser;
}

export interface IAbxExpResPhenotype {
    uid: string;
    guidelineUid: string;
    guideline?: IAbxGuideline;
    referenceTable?: string;
    organismCode: string;
    organismCodeType: string;
    exceptionOrganismCode: string;
    exceptionOrganismCodeType: string;
    abxCode: string;
    abxCodeType: string;
    antibioticExceptions: string;
    comments?: string;
    createdAt?: string;
    createdByUid?: string;
    createdBy?: IUser;
    updatedAt?: string;
    updatedByUid?: string;
    updatedBy?: IUser;
}

export interface IAbxExpertInterpretationRule {
    uid: string;
    ruleCode: string;
    description?: string;
    organismCode: string;
    organismCodeType: string;
    ruleCriteria: string;
    affectedAntibiotics: string;
    antibioticExceptions: string;
    createdAt?: string;
    createdByUid?: string;
    createdBy?: IUser;
    updatedAt?: string;
    updatedByUid?: string;
    updatedBy?: IUser;
}

export interface IAbxMedium {
    uid: string;
    name: string;
    description?: string;
    createdAt?: string;
    createdByUid?: string;
    createdBy?: IUser;
    updatedAt?: string;
    updatedByUid?: string;
    updatedBy?: IUser;
}

export interface IAbxQCRange {
    uid: string;
    guidelineUid: string;
    guideline?: IAbxGuideline;
    year: number;
    strain: string;
    referenceTable: string;
    whonetOrgCode: string;
    antibiotic: string;
    abxTest: string;
    whonetAbxCode: string;
    method: string;
    mediumUid?: string;
    medium?: IAbxMedium;
    minimum?: string;
    maximum?: string;
    createdAt?: string;
    createdByUid?: string;
    createdBy?: IUser;
    updatedAt?: string;
    updatedByUid?: string;
    updatedBy?: IUser;
}

export interface IAbxASTPanel {
    uid: string;
    name: string;
    description?: string;
    organisms?: IAbxOrganism[];
    antibiotics?: IAbxAntibiotic[];
    active: boolean;
    createdAt?: string;
    createdByUid?: string;
    createdBy?: IUser;
    updatedAt?: string;
    updatedByUid?: string;
    updatedBy?: IUser;
}

export interface IAbxOrganismResult {
    uid: string;
    analysisResultUid: string;
    organismUid: string;
    organism: IAbxOrganism;
    isolateNumber: number;
    //
    astResults?: IAbxASTResult[];
  }

  export interface IAbxASTResult {
    uid: string;
    organismResultUid: string;
    analysisResultUid: string;
    analysisResult: IAnalysisResult;
    antibioticUid: string;
    antibiotic: IAbxAntibiotic;
    astMethodUid?: string;
    guidelineYearUid?: string;
    breakpointUid?: string;
    astMethod?: IAbxTestMethod
    astValue?: string;
    guideline?: string;
    createdAt: string;
    createdByUid: string;
  }