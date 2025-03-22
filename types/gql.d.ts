export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BytesScalar: { input: never; output: never; }
  DateTime: { input: never; output: never; }
  JSONScalar: { input: never; output: never; }
  Upload: { input: never; output: never; }
};

export type ArResultInputType = {
  laboratoryInstrumentUid: Scalars['String']['input'];
  methodUid: Scalars['String']['input'];
  reportable?: InputMaybe<Scalars['Boolean']['input']>;
  result: Scalars['String']['input'];
  uid: Scalars['String']['input'];
};

export type ArSampleInputType = {
  analyses: Array<Scalars['String']['input']>;
  dateCollected: Scalars['String']['input'];
  profiles: Array<Scalars['String']['input']>;
  sampleType: Scalars['String']['input'];
};

export type AbxAstPanelCursorPage = {
  __typename?: 'AbxASTPanelCursorPage';
  edges?: Maybe<Array<AbxAstPanelEdge>>;
  items?: Maybe<Array<AbxAstPanelType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type AbxAstPanelEdge = {
  __typename?: 'AbxASTPanelEdge';
  cursor: Scalars['String']['output'];
  node: AbxAstPanelType;
};

export type AbxAstPanelInputType = {
  active?: Scalars['Boolean']['input'];
  antibiotics: Array<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  organisms: Array<Scalars['String']['input']>;
};

export type AbxAstPanelResponse = AbxAstPanelType | OperationError;

export type AbxAstPanelType = {
  __typename?: 'AbxASTPanelType';
  active: Scalars['Boolean']['output'];
  antibiotics?: Maybe<Array<AbxAntibioticType>>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  organisms?: Maybe<Array<AbxOrganismType>>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type AbxAstResultResponse = AbxAstResultsType | OperationError;

export type AbxAstResultType = {
  __typename?: 'AbxASTResultType';
  analysisResult?: Maybe<AnalysisResultType>;
  analysisResultUid: Scalars['String']['output'];
  antibiotic?: Maybe<AbxAntibioticType>;
  antibioticUid: Scalars['String']['output'];
  astMethod?: Maybe<AbxTestMethodType>;
  astMethodUid?: Maybe<Scalars['String']['output']>;
  astValue?: Maybe<Scalars['String']['output']>;
  breakpoint?: Maybe<AbxBreakpointTyp>;
  breakpointUid?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  guidelineYear?: Maybe<AbxGuidelineYearType>;
  guidelineYearUid?: Maybe<Scalars['String']['output']>;
  organismResultUid: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type AbxAstResultUpdateInput = {
  astMethodUid?: InputMaybe<Scalars['String']['input']>;
  astValue?: InputMaybe<Scalars['String']['input']>;
  guidelineYearUid?: InputMaybe<Scalars['String']['input']>;
  reportable?: InputMaybe<Scalars['Boolean']['input']>;
  result?: InputMaybe<Scalars['String']['input']>;
  uid: Scalars['String']['input'];
};

export type AbxAstResultsType = {
  __typename?: 'AbxASTResultsType';
  astResults: Array<AbxAstResultType>;
};

export type AbxAstResultsUpdateInput = {
  results: Array<AbxAstResultUpdateInput>;
};

export type AbxAntibioticCursorPage = {
  __typename?: 'AbxAntibioticCursorPage';
  edges?: Maybe<Array<AbxAntibioticEdge>>;
  items?: Maybe<Array<AbxAntibioticType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type AbxAntibioticEdge = {
  __typename?: 'AbxAntibioticEdge';
  cursor: Scalars['String']['output'];
  node: AbxAntibioticType;
};

export type AbxAntibioticGuidelineType = {
  __typename?: 'AbxAntibioticGuidelineType';
  antibiotic?: Maybe<AbxAntibioticType>;
  antibioticUid: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  guideline?: Maybe<AbxGuidelineType>;
  guidelineUid: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type AbxAntibioticInputType = {
  abxNumber?: InputMaybe<Scalars['String']['input']>;
  animalGp?: InputMaybe<Scalars['String']['input']>;
  atcCode?: InputMaybe<Scalars['String']['input']>;
  ciaCategory?: InputMaybe<Scalars['String']['input']>;
  class_?: InputMaybe<Scalars['String']['input']>;
  clsiOrder?: InputMaybe<Scalars['String']['input']>;
  comments?: InputMaybe<Scalars['String']['input']>;
  dinCode?: InputMaybe<Scalars['String']['input']>;
  eucastCode?: InputMaybe<Scalars['String']['input']>;
  eucastOrder?: InputMaybe<Scalars['String']['input']>;
  guidelines: Array<Scalars['String']['input']>;
  human?: InputMaybe<Scalars['Boolean']['input']>;
  jacCode?: InputMaybe<Scalars['String']['input']>;
  loincafb?: InputMaybe<Scalars['String']['input']>;
  loinccomp?: InputMaybe<Scalars['String']['input']>;
  loincdisk?: InputMaybe<Scalars['String']['input']>;
  loincetest?: InputMaybe<Scalars['String']['input']>;
  loincgen?: InputMaybe<Scalars['String']['input']>;
  loincmic?: InputMaybe<Scalars['String']['input']>;
  loincmlc?: InputMaybe<Scalars['String']['input']>;
  loincsbt?: InputMaybe<Scalars['String']['input']>;
  loincslow?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  potency?: InputMaybe<Scalars['String']['input']>;
  profClass?: InputMaybe<Scalars['String']['input']>;
  subclass?: InputMaybe<Scalars['String']['input']>;
  userCode?: InputMaybe<Scalars['String']['input']>;
  veterinary?: InputMaybe<Scalars['Boolean']['input']>;
  whoCode?: InputMaybe<Scalars['String']['input']>;
  whonetAbxCode?: InputMaybe<Scalars['String']['input']>;
};

export type AbxAntibioticResponse = AbxAntibioticType | OperationError;

export type AbxAntibioticType = {
  __typename?: 'AbxAntibioticType';
  abxNumber?: Maybe<Scalars['String']['output']>;
  animalGp?: Maybe<Scalars['String']['output']>;
  atcCode?: Maybe<Scalars['String']['output']>;
  ciaCategory?: Maybe<Scalars['String']['output']>;
  class_?: Maybe<Scalars['String']['output']>;
  clsiOrder?: Maybe<Scalars['String']['output']>;
  comments?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  dinCode?: Maybe<Scalars['String']['output']>;
  eucastCode?: Maybe<Scalars['String']['output']>;
  eucastOrder?: Maybe<Scalars['String']['output']>;
  guidelines?: Maybe<Array<AbxGuidelineType>>;
  human?: Maybe<Scalars['Boolean']['output']>;
  jacCode?: Maybe<Scalars['String']['output']>;
  loincafb?: Maybe<Scalars['String']['output']>;
  loinccomp?: Maybe<Scalars['String']['output']>;
  loincdisk?: Maybe<Scalars['String']['output']>;
  loincetest?: Maybe<Scalars['String']['output']>;
  loincgen?: Maybe<Scalars['String']['output']>;
  loincmic?: Maybe<Scalars['String']['output']>;
  loincmlc?: Maybe<Scalars['String']['output']>;
  loincsbt?: Maybe<Scalars['String']['output']>;
  loincslow?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  potency?: Maybe<Scalars['String']['output']>;
  profClass?: Maybe<Scalars['String']['output']>;
  subclass?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  userCode?: Maybe<Scalars['String']['output']>;
  veterinary?: Maybe<Scalars['Boolean']['output']>;
  whoCode?: Maybe<Scalars['String']['output']>;
  whonetAbxCode?: Maybe<Scalars['String']['output']>;
};

export type AbxApplyAstPanelInput = {
  organismResultUid: Scalars['String']['input'];
  panelUid: Scalars['String']['input'];
  sampleUid: Scalars['String']['input'];
};

export type AbxBreakpointInputType = {
  breakpointTypeUid: Scalars['String']['input'];
  comments?: InputMaybe<Scalars['String']['input']>;
  ecvEcoff?: InputMaybe<Scalars['String']['input']>;
  ecvEcoffTentative?: InputMaybe<Scalars['String']['input']>;
  guidelineUid: Scalars['String']['input'];
  hostUid?: InputMaybe<Scalars['String']['input']>;
  i?: InputMaybe<Scalars['String']['input']>;
  organismCode: Scalars['String']['input'];
  organismCodeType: Scalars['String']['input'];
  potency?: InputMaybe<Scalars['String']['input']>;
  r?: InputMaybe<Scalars['String']['input']>;
  referenceSequence?: InputMaybe<Scalars['String']['input']>;
  referenceTable?: InputMaybe<Scalars['String']['input']>;
  s?: InputMaybe<Scalars['String']['input']>;
  sdd?: InputMaybe<Scalars['String']['input']>;
  siteOfInfectionUid?: InputMaybe<Scalars['String']['input']>;
  testMethod: Scalars['String']['input'];
  whonetAbxCode?: InputMaybe<Scalars['String']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};

export type AbxBreakpointResponse = AbxBreakpointTyp | OperationError;

export type AbxBreakpointTyp = {
  __typename?: 'AbxBreakpointTyp';
  breakpointType?: Maybe<AbxBreakpointTypeTyp>;
  breakpointTypeUid: Scalars['String']['output'];
  comments?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  ecvEcoff?: Maybe<Scalars['String']['output']>;
  ecvEcoffTentative?: Maybe<Scalars['String']['output']>;
  guidelineYear?: Maybe<AbxGuidelineYearType>;
  guidelineYearUid: Scalars['String']['output'];
  host?: Maybe<AbxHostType>;
  hostUid?: Maybe<Scalars['String']['output']>;
  i?: Maybe<Scalars['String']['output']>;
  organismCode: Scalars['String']['output'];
  organismCodeType: Scalars['String']['output'];
  potency?: Maybe<Scalars['String']['output']>;
  r?: Maybe<Scalars['String']['output']>;
  referenceSequence?: Maybe<Scalars['String']['output']>;
  referenceTable?: Maybe<Scalars['String']['output']>;
  s?: Maybe<Scalars['String']['output']>;
  sdd?: Maybe<Scalars['String']['output']>;
  siteOfInfection?: Maybe<AbxSiteOfInfectionType>;
  siteOfInfectionUid?: Maybe<Scalars['String']['output']>;
  testMethod?: Maybe<AbxTestMethodType>;
  testMethodUid: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  whonetAbxCode?: Maybe<Scalars['String']['output']>;
};

export type AbxBreakpointTypCursorPage = {
  __typename?: 'AbxBreakpointTypCursorPage';
  edges?: Maybe<Array<AbxBreakpointTypEdge>>;
  items?: Maybe<Array<AbxBreakpointTyp>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type AbxBreakpointTypEdge = {
  __typename?: 'AbxBreakpointTypEdge';
  cursor: Scalars['String']['output'];
  node: AbxBreakpointTyp;
};

export type AbxBreakpointTypeInputType = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type AbxBreakpointTypeResponse = AbxBreakpointTypeTyp | OperationError;

export type AbxBreakpointTypeTyp = {
  __typename?: 'AbxBreakpointTypeTyp';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type AbxClassInputType = {
  name: Scalars['String']['input'];
  phylumUid?: InputMaybe<Scalars['String']['input']>;
};

export type AbxClassResponse = AbxClassType | OperationError;

export type AbxClassType = {
  __typename?: 'AbxClassType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  phylum?: Maybe<AbxPhylumType>;
  phylumUid?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type AbxExpResPhenotypeCursorPage = {
  __typename?: 'AbxExpResPhenotypeCursorPage';
  edges?: Maybe<Array<AbxExpResPhenotypeEdge>>;
  items?: Maybe<Array<AbxExpResPhenotypeType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type AbxExpResPhenotypeEdge = {
  __typename?: 'AbxExpResPhenotypeEdge';
  cursor: Scalars['String']['output'];
  node: AbxExpResPhenotypeType;
};

export type AbxExpResPhenotypeInputType = {
  abxCode: Scalars['String']['input'];
  abxCodeType: Scalars['String']['input'];
  antibioticExceptions: Scalars['String']['input'];
  comments?: InputMaybe<Scalars['String']['input']>;
  exceptionOrganismCode: Scalars['String']['input'];
  exceptionOrganismCodeType: Scalars['String']['input'];
  guidelineUid: Scalars['String']['input'];
  organismCode: Scalars['String']['input'];
  organismCodeType: Scalars['String']['input'];
  referenceTable: Scalars['String']['input'];
};

export type AbxExpResPhenotypeResponse = AbxExpResPhenotypeType | OperationError;

export type AbxExpResPhenotypeType = {
  __typename?: 'AbxExpResPhenotypeType';
  abxCode: Scalars['String']['output'];
  abxCodeType: Scalars['String']['output'];
  antibioticExceptions: Scalars['String']['output'];
  comments?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  exceptionOrganismCode: Scalars['String']['output'];
  exceptionOrganismCodeType: Scalars['String']['output'];
  guideline?: Maybe<AbxGuidelineType>;
  guidelineUid: Scalars['String']['output'];
  organismCode: Scalars['String']['output'];
  organismCodeType: Scalars['String']['output'];
  referenceTable?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type AbxExpertInterpretationRuleCursorPage = {
  __typename?: 'AbxExpertInterpretationRuleCursorPage';
  edges?: Maybe<Array<AbxExpertInterpretationRuleEdge>>;
  items?: Maybe<Array<AbxExpertInterpretationRuleType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type AbxExpertInterpretationRuleEdge = {
  __typename?: 'AbxExpertInterpretationRuleEdge';
  cursor: Scalars['String']['output'];
  node: AbxExpertInterpretationRuleType;
};

export type AbxExpertInterpretationRuleInputType = {
  affectedAntibiotics: Scalars['String']['input'];
  antibioticExceptions: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  organismCode: Scalars['String']['input'];
  organismCodeType: Scalars['String']['input'];
  ruleCode: Scalars['String']['input'];
  ruleCriteria: Scalars['String']['input'];
};

export type AbxExpertInterpretationRuleResponse = AbxExpertInterpretationRuleType | OperationError;

export type AbxExpertInterpretationRuleType = {
  __typename?: 'AbxExpertInterpretationRuleType';
  affectedAntibiotics: Scalars['String']['output'];
  antibioticExceptions: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  organismCode: Scalars['String']['output'];
  organismCodeType: Scalars['String']['output'];
  ruleCode: Scalars['String']['output'];
  ruleCriteria: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type AbxFamilyInputType = {
  name: Scalars['String']['input'];
  orderUid?: InputMaybe<Scalars['String']['input']>;
};

export type AbxFamilyResponse = AbxFamilyType | OperationError;

export type AbxFamilyType = {
  __typename?: 'AbxFamilyType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  order?: Maybe<AbxOrderType>;
  orderUid?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type AbxGenusInputType = {
  familyUid?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type AbxGenusResponse = AbxGenusType | OperationError;

export type AbxGenusType = {
  __typename?: 'AbxGenusType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  family?: Maybe<AbxFamilyType>;
  familyUid?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type AbxGuidelineInputType = {
  code?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type AbxGuidelineResponse = AbxGuidelineType | OperationError;

export type AbxGuidelineType = {
  __typename?: 'AbxGuidelineType';
  code?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type AbxGuidelineYearType = {
  __typename?: 'AbxGuidelineYearType';
  code: Scalars['String']['output'];
  guideline?: Maybe<AbxGuidelineType>;
  guidelineUid: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  year: Scalars['Int']['output'];
};

export type AbxHostInputType = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type AbxHostResponse = AbxHostType | OperationError;

export type AbxHostType = {
  __typename?: 'AbxHostType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type AbxKingdomInputType = {
  name: Scalars['String']['input'];
};

export type AbxKingdomResponse = AbxKingdomType | OperationError;

export type AbxKingdomType = {
  __typename?: 'AbxKingdomType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type AbxMediumInputType = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type AbxMediumResponse = AbxMediumType | OperationError;

export type AbxMediumType = {
  __typename?: 'AbxMediumType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type AbxOrderInputType = {
  classUid?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type AbxOrderResponse = AbxOrderType | OperationError;

export type AbxOrderType = {
  __typename?: 'AbxOrderType';
  classUid?: Maybe<Scalars['String']['output']>;
  class_?: Maybe<AbxClassType>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type AbxOrganismCursorPage = {
  __typename?: 'AbxOrganismCursorPage';
  edges?: Maybe<Array<AbxOrganismEdge>>;
  items?: Maybe<Array<AbxOrganismType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type AbxOrganismEdge = {
  __typename?: 'AbxOrganismEdge';
  cursor: Scalars['String']['output'];
  node: AbxOrganismType;
};

export type AbxOrganismInputType = {
  anaerobe?: InputMaybe<Scalars['Boolean']['input']>;
  classUid?: InputMaybe<Scalars['String']['input']>;
  comments?: InputMaybe<Scalars['String']['input']>;
  common?: InputMaybe<Scalars['String']['input']>;
  familyUid?: InputMaybe<Scalars['String']['input']>;
  genusUid?: InputMaybe<Scalars['String']['input']>;
  kingdomUid?: InputMaybe<Scalars['String']['input']>;
  morphology?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  orderUid?: InputMaybe<Scalars['String']['input']>;
  organismType?: InputMaybe<Scalars['String']['input']>;
  phylumUid?: InputMaybe<Scalars['String']['input']>;
  replacedBy?: InputMaybe<Scalars['String']['input']>;
  taxonomicStatus?: InputMaybe<Scalars['String']['input']>;
  whonetOrgCode?: InputMaybe<Scalars['String']['input']>;
};

export type AbxOrganismResponse = AbxOrganismType | OperationError;

export type AbxOrganismResultType = {
  __typename?: 'AbxOrganismResultType';
  analysisResultUid: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  isolateNumber?: Maybe<Scalars['Int']['output']>;
  organism?: Maybe<AbxOrganismType>;
  organismUid?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type AbxOrganismSerotypeCursorPage = {
  __typename?: 'AbxOrganismSerotypeCursorPage';
  edges?: Maybe<Array<AbxOrganismSerotypeEdge>>;
  items?: Maybe<Array<AbxOrganismSerotypeType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type AbxOrganismSerotypeEdge = {
  __typename?: 'AbxOrganismSerotypeEdge';
  cursor: Scalars['String']['output'];
  node: AbxOrganismSerotypeType;
};

export type AbxOrganismSerotypeInputType = {
  fate?: InputMaybe<Scalars['String']['input']>;
  hPhase1?: InputMaybe<Scalars['String']['input']>;
  hPhase2?: InputMaybe<Scalars['String']['input']>;
  oAntigens?: InputMaybe<Scalars['String']['input']>;
  organismUid: Scalars['String']['input'];
  serogroup?: InputMaybe<Scalars['String']['input']>;
  serotype: Scalars['String']['input'];
  subspecies?: InputMaybe<Scalars['String']['input']>;
  x997Check?: InputMaybe<Scalars['String']['input']>;
};

export type AbxOrganismSerotypeResponse = AbxOrganismSerotypeType | OperationError;

export type AbxOrganismSerotypeType = {
  __typename?: 'AbxOrganismSerotypeType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  fate?: Maybe<Scalars['String']['output']>;
  hPhase1?: Maybe<Scalars['String']['output']>;
  hPhase2?: Maybe<Scalars['String']['output']>;
  oAntigens?: Maybe<Scalars['String']['output']>;
  organism?: Maybe<AbxOrganismType>;
  organismUid: Scalars['String']['output'];
  serogroup?: Maybe<Scalars['String']['output']>;
  serotype: Scalars['String']['output'];
  subspecies?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  x997Check?: Maybe<Scalars['String']['output']>;
};

export type AbxOrganismType = {
  __typename?: 'AbxOrganismType';
  anaerobe?: Maybe<Scalars['Boolean']['output']>;
  classUid?: Maybe<Scalars['String']['output']>;
  class_?: Maybe<AbxClassType>;
  comments?: Maybe<Scalars['String']['output']>;
  common?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  family?: Maybe<AbxFamilyType>;
  familyCode?: Maybe<Scalars['String']['output']>;
  familyUid?: Maybe<Scalars['String']['output']>;
  gbifDatasetId?: Maybe<Scalars['String']['output']>;
  gbifTaxonId?: Maybe<Scalars['String']['output']>;
  gbifTaxonomicStatus?: Maybe<Scalars['String']['output']>;
  genus?: Maybe<AbxGenusType>;
  genusCode?: Maybe<Scalars['String']['output']>;
  genusGroup?: Maybe<Scalars['String']['output']>;
  genusUid?: Maybe<Scalars['String']['output']>;
  kingdom?: Maybe<AbxKingdomType>;
  kingdomUid?: Maybe<Scalars['String']['output']>;
  morphology?: Maybe<Scalars['String']['output']>;
  msfGrpClin?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  order?: Maybe<AbxOrderType>;
  orderUid?: Maybe<Scalars['String']['output']>;
  organismType?: Maybe<Scalars['String']['output']>;
  phylum?: Maybe<AbxPhylumType>;
  phylumUid?: Maybe<Scalars['String']['output']>;
  replacedBy?: Maybe<Scalars['String']['output']>;
  sctCode?: Maybe<Scalars['String']['output']>;
  sctText?: Maybe<Scalars['String']['output']>;
  serovarGroup?: Maybe<Scalars['String']['output']>;
  speciesGroup?: Maybe<Scalars['String']['output']>;
  subkingdomCode?: Maybe<Scalars['String']['output']>;
  taxonomicStatus?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  whonetOrgCode?: Maybe<Scalars['String']['output']>;
};

export type AbxPhylumInputType = {
  kingdomUid?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type AbxPhylumResponse = AbxPhylumType | OperationError;

export type AbxPhylumType = {
  __typename?: 'AbxPhylumType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  kingdom?: Maybe<AbxKingdomType>;
  kingdomUid?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type AbxQcRangeCursorPage = {
  __typename?: 'AbxQCRangeCursorPage';
  edges?: Maybe<Array<AbxQcRangeEdge>>;
  items?: Maybe<Array<AbxQcRangeType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type AbxQcRangeEdge = {
  __typename?: 'AbxQCRangeEdge';
  cursor: Scalars['String']['output'];
  node: AbxQcRangeType;
};

export type AbxQcRangeInputType = {
  abxTest: Scalars['String']['input'];
  antibiotic: Scalars['String']['input'];
  guidelineUid: Scalars['String']['input'];
  maximum?: InputMaybe<Scalars['String']['input']>;
  mediumUid?: InputMaybe<Scalars['String']['input']>;
  method: Scalars['String']['input'];
  minimum?: InputMaybe<Scalars['String']['input']>;
  referenceTable: Scalars['String']['input'];
  strain: Scalars['String']['input'];
  whonetAbxCode: Scalars['String']['input'];
  whonetOrgCode: Scalars['String']['input'];
  year: Scalars['Int']['input'];
};

export type AbxQcRangeResponse = AbxQcRangeType | OperationError;

export type AbxQcRangeType = {
  __typename?: 'AbxQCRangeType';
  abxTest: Scalars['String']['output'];
  antibiotic: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  guideline?: Maybe<AbxGuidelineType>;
  guidelineUid: Scalars['String']['output'];
  maximum?: Maybe<Scalars['String']['output']>;
  medium?: Maybe<AbxMediumType>;
  mediumUid?: Maybe<Scalars['String']['output']>;
  method: Scalars['String']['output'];
  minimum?: Maybe<Scalars['String']['output']>;
  referenceTable: Scalars['String']['output'];
  strain: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  whonetAbxCode: Scalars['String']['output'];
  whonetOrgCode: Scalars['String']['output'];
  year: Scalars['Int']['output'];
};

export type AbxSiteOfInfectionInputType = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type AbxSiteOfInfectionResponse = AbxSiteOfInfectionType | OperationError;

export type AbxSiteOfInfectionType = {
  __typename?: 'AbxSiteOfInfectionType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type AbxTestMethodInputType = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type AbxTestMethodResponse = AbxTestMethodType | OperationError;

export type AbxTestMethodType = {
  __typename?: 'AbxTestMethodType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type ActivityFeedType = {
  __typename?: 'ActivityFeedType';
  name: Scalars['String']['output'];
  subscribers?: Maybe<Array<UserType>>;
  uid: Scalars['String']['output'];
};

export type ActivityProcessType = {
  __typename?: 'ActivityProcessType';
  objectType: Scalars['String']['output'];
  status: Scalars['String']['output'];
  uid: Scalars['String']['output'];
};

export type ActivityStreamType = {
  __typename?: 'ActivityStreamType';
  actionObject: WorkSheetTypeSampleTypeAnalysisResultTypeReportMetaTypeUnknownObjectType;
  actionObjectType?: Maybe<Scalars['String']['output']>;
  actionObjectUid?: Maybe<Scalars['String']['output']>;
  actor: UserType;
  actorUid?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  feeds?: Maybe<Array<ActivityFeedType>>;
  target?: Maybe<Scalars['String']['output']>;
  targetUid?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  verb?: Maybe<Scalars['String']['output']>;
  viewers?: Maybe<Array<UserType>>;
};

export type AnalysisCategoryInputType = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  departmentUid?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

/** Union of possible outcomes when adding a new notice */
export type AnalysisCategoryResponse = AnalysisCategoryType | OperationError;

export type AnalysisCategoryType = {
  __typename?: 'AnalysisCategoryType';
  active: Scalars['Boolean']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  department?: Maybe<DepartmentType>;
  departmentUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type AnalysisCorrectionFactorInput = {
  analysisUid: Scalars['String']['input'];
  factor: Scalars['Float']['input'];
  instrumentUid: Scalars['String']['input'];
  methodUid: Scalars['String']['input'];
};

export type AnalysisCorrectionFactorResponse = AnalysisCorrectionFactorType | OperationError;

export type AnalysisCorrectionFactorType = {
  __typename?: 'AnalysisCorrectionFactorType';
  analysisUid: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  factor: Scalars['Float']['output'];
  instrumentUid: Scalars['String']['output'];
  methodUid: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type AnalysisCursorPage = {
  __typename?: 'AnalysisCursorPage';
  edges?: Maybe<Array<AnalysisEdge>>;
  items?: Maybe<Array<AnalysisWithProfiles>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type AnalysisDetectionLimitInput = {
  analysisUid: Scalars['String']['input'];
  instrumentUid: Scalars['String']['input'];
  lowerLimit: Scalars['Float']['input'];
  methodUid: Scalars['String']['input'];
  upperLimit: Scalars['Float']['input'];
};

export type AnalysisDetectionLimitResponse = AnalysisDetectionLimitType | OperationError;

export type AnalysisDetectionLimitType = {
  __typename?: 'AnalysisDetectionLimitType';
  analysisUid: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  instrumentUid: Scalars['String']['output'];
  lowerLimit: Scalars['Float']['output'];
  methodUid: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  upperLimit: Scalars['Float']['output'];
};

export type AnalysisDiscountResponse = AnalysisDiscountType | OperationError;

export type AnalysisDiscountType = {
  __typename?: 'AnalysisDiscountType';
  analysis: AnalysisType;
  analysisUid: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  discountType: Scalars['String']['output'];
  endDate: Scalars['DateTime']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  startDate: Scalars['DateTime']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  valueAmount: Scalars['Float']['output'];
  valuePercent: Scalars['Float']['output'];
  valueType: Scalars['String']['output'];
  voucher?: Maybe<VoucherType>;
  voucherUid?: Maybe<Scalars['String']['output']>;
};

export type AnalysisEdge = {
  __typename?: 'AnalysisEdge';
  cursor: Scalars['String']['output'];
  node: AnalysisWithProfiles;
};

export type AnalysisInputType = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  categoryUid?: InputMaybe<Scalars['String']['input']>;
  departmentUid?: InputMaybe<Scalars['String']['input']>;
  description?: Scalars['String']['input'];
  internalUse?: InputMaybe<Scalars['Boolean']['input']>;
  keyword: Scalars['String']['input'];
  methods?: InputMaybe<Array<Scalars['String']['input']>>;
  name: Scalars['String']['input'];
  precision?: InputMaybe<Scalars['Int']['input']>;
  requiredVerifications?: Scalars['Int']['input'];
  sampleTypes?: InputMaybe<Array<Scalars['String']['input']>>;
  selfVerification?: InputMaybe<Scalars['Boolean']['input']>;
  sortKey: Scalars['Int']['input'];
  tatLengthMinutes: Scalars['Int']['input'];
  unitUid?: InputMaybe<Scalars['String']['input']>;
};

export type AnalysisInterimInput = {
  analysisUid: Scalars['String']['input'];
  instrumentUid: Scalars['String']['input'];
  key: Scalars['Int']['input'];
  value: Scalars['String']['input'];
};

export type AnalysisInterimResponse = AnalysisInterimType | OperationError;

export type AnalysisInterimType = {
  __typename?: 'AnalysisInterimType';
  analysisUid: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  instrumentUid: Scalars['String']['output'];
  key: Scalars['Int']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  value: Scalars['String']['output'];
};

export type AnalysisMappingInputType = {
  analysisUid: Scalars['String']['input'];
  code: Scalars['String']['input'];
  codingStandardUid: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

/** Union of possible outcomes when adding a new notice */
export type AnalysisMappingResponse = AnalysisMappingType | OperationError;

export type AnalysisMappingType = {
  __typename?: 'AnalysisMappingType';
  analysis?: Maybe<AnalysisType>;
  analysisUid: Scalars['String']['output'];
  code: Scalars['String']['output'];
  codingStandard?: Maybe<CodingStandardType>;
  codingStandardUid: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type AnalysisPriceResponse = AnalysisPriceType | OperationError;

export type AnalysisPriceType = {
  __typename?: 'AnalysisPriceType';
  amount: Scalars['Float']['output'];
  analysis: AnalysisType;
  analysisUid: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

/** Union of possible outcomes when adding a new notice */
export type AnalysisProfileResponse = OperationError | ProfileType;

export type AnalysisRequestCursorPage = {
  __typename?: 'AnalysisRequestCursorPage';
  edges?: Maybe<Array<AnalysisRequestEdge>>;
  items?: Maybe<Array<AnalysisRequestWithSamples>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type AnalysisRequestEdge = {
  __typename?: 'AnalysisRequestEdge';
  cursor: Scalars['String']['output'];
  node: AnalysisRequestWithSamples;
};

export type AnalysisRequestInputType = {
  clientContactUid: Scalars['String']['input'];
  clientRequestId?: InputMaybe<Scalars['String']['input']>;
  clientUid: Scalars['String']['input'];
  clinicalData?: InputMaybe<Scalars['String']['input']>;
  internalUse?: InputMaybe<Scalars['Boolean']['input']>;
  patientUid: Scalars['String']['input'];
  priority?: Scalars['Int']['input'];
  samples: Array<ArSampleInputType>;
};

/** Union of possible outcomes when adding/editing analysis requests  */
export type AnalysisRequestResponse = AnalysisRequestWithSamples | OperationError;

export type AnalysisRequestType = {
  __typename?: 'AnalysisRequestType';
  client?: Maybe<ClientType>;
  clientRequestId: Scalars['String']['output'];
  clientUid: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  internalUse: Scalars['Boolean']['output'];
  metadataSnapshot?: Maybe<Scalars['JSONScalar']['output']>;
  patient: PatientType;
  patientUid: Scalars['String']['output'];
  requestId: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type AnalysisRequestWithSamples = {
  __typename?: 'AnalysisRequestWithSamples';
  client?: Maybe<ClientType>;
  clientRequestId: Scalars['String']['output'];
  clientUid: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  internalUse: Scalars['Boolean']['output'];
  metadataSnapshot?: Maybe<Scalars['JSONScalar']['output']>;
  patient: PatientType;
  patientUid: Scalars['String']['output'];
  requestId: Scalars['String']['output'];
  samples?: Maybe<Array<SampleType>>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type AnalysisResultCursorPage = {
  __typename?: 'AnalysisResultCursorPage';
  edges?: Maybe<Array<AnalysisResultEdge>>;
  items?: Maybe<Array<AnalysisResultType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type AnalysisResultEdge = {
  __typename?: 'AnalysisResultEdge';
  cursor: Scalars['String']['output'];
  node: AnalysisResultType;
};

/** Union of possible outcomes when actioning samples */
export type AnalysisResultResponse = OperationError | ResultListingType;

/** Union of possible outcomes when submitting/verifying results */
export type AnalysisResultSubmitResponse = OperationError | OperationSuccess;

export type AnalysisResultType = {
  __typename?: 'AnalysisResultType';
  analysis?: Maybe<AnalysisType>;
  analysisUid?: Maybe<Scalars['String']['output']>;
  analyst?: Maybe<UserType>;
  analystUid?: Maybe<Scalars['String']['output']>;
  assigned: Scalars['Boolean']['output'];
  cancelledBy?: Maybe<UserType>;
  cancelledByUid?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  dateCancelled?: Maybe<Scalars['DateTime']['output']>;
  dateInvalidated?: Maybe<Scalars['DateTime']['output']>;
  dateSubmitted?: Maybe<Scalars['DateTime']['output']>;
  dateVerified?: Maybe<Scalars['DateTime']['output']>;
  dueDate?: Maybe<Scalars['String']['output']>;
  invalidatedBy?: Maybe<UserType>;
  invalidatedByUid?: Maybe<Scalars['String']['output']>;
  laboratoryInstrument?: Maybe<LaboratoryInstrumentType>;
  laboratoryInstrumentUid?: Maybe<Scalars['String']['output']>;
  metadataSnapshot?: Maybe<Scalars['JSONScalar']['output']>;
  method?: Maybe<MethodType>;
  methodUid?: Maybe<Scalars['String']['output']>;
  parent?: Maybe<AnalysisResultType>;
  parentId?: Maybe<Scalars['String']['output']>;
  reflexLevel?: Maybe<Scalars['Int']['output']>;
  reportable: Scalars['Boolean']['output'];
  result?: Maybe<Scalars['String']['output']>;
  retest: Scalars['Boolean']['output'];
  sample: SampleType;
  sampleUid: Scalars['String']['output'];
  status?: Maybe<Scalars['String']['output']>;
  submittedBy?: Maybe<UserType>;
  submittedByUid?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  verifiedBy?: Maybe<Array<UserType>>;
  worksheetId?: Maybe<Scalars['String']['output']>;
  worksheetPosition?: Maybe<Scalars['Int']['output']>;
  worksheetUid?: Maybe<Scalars['String']['output']>;
};

export type AnalysisSpecificationInput = {
  ageMax?: InputMaybe<Scalars['Int']['input']>;
  ageMin?: InputMaybe<Scalars['Int']['input']>;
  analysisUid: Scalars['String']['input'];
  gender?: InputMaybe<Scalars['String']['input']>;
  max?: InputMaybe<Scalars['Float']['input']>;
  maxReport?: InputMaybe<Scalars['String']['input']>;
  maxWarn?: InputMaybe<Scalars['Float']['input']>;
  methodUid?: InputMaybe<Scalars['String']['input']>;
  min?: InputMaybe<Scalars['Float']['input']>;
  minReport?: InputMaybe<Scalars['String']['input']>;
  minWarn?: InputMaybe<Scalars['Float']['input']>;
  unitUid?: InputMaybe<Scalars['String']['input']>;
  warnReport?: InputMaybe<Scalars['String']['input']>;
  warnValues?: InputMaybe<Scalars['String']['input']>;
};

export type AnalysisSpecificationResponse = AnalysisSpecificationType | OperationError;

export type AnalysisSpecificationType = {
  __typename?: 'AnalysisSpecificationType';
  ageMax?: Maybe<Scalars['Int']['output']>;
  ageMin?: Maybe<Scalars['Int']['output']>;
  analysisUid: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<Scalars['String']['output']>;
  max?: Maybe<Scalars['Float']['output']>;
  maxReport?: Maybe<Scalars['String']['output']>;
  maxWarn?: Maybe<Scalars['Float']['output']>;
  methodUid?: Maybe<Scalars['String']['output']>;
  min?: Maybe<Scalars['Float']['output']>;
  minReport?: Maybe<Scalars['String']['output']>;
  minWarn?: Maybe<Scalars['Float']['output']>;
  uid: Scalars['String']['output'];
  unit?: Maybe<UnitType>;
  unitUid?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  warnReport?: Maybe<Scalars['String']['output']>;
  warnValues?: Maybe<Scalars['String']['output']>;
};

export type AnalysisTemplateInputType = {
  departmentUid?: InputMaybe<Scalars['String']['input']>;
  description?: Scalars['String']['input'];
  name: Scalars['String']['input'];
  services?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** Union of possible outcomes */
export type AnalysisTemplateResponse = AnalysisTemplateType | OperationError;

export type AnalysisTemplateType = {
  __typename?: 'AnalysisTemplateType';
  analyses?: Maybe<Array<AnalysisType>>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  department?: Maybe<DepartmentType>;
  departmentUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type AnalysisType = {
  __typename?: 'AnalysisType';
  active?: Maybe<Scalars['Boolean']['output']>;
  category?: Maybe<AnalysisCategoryType>;
  categoryUid?: Maybe<Scalars['String']['output']>;
  correctionFactors?: Maybe<Array<AnalysisCorrectionFactorType>>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  department?: Maybe<DepartmentType>;
  departmentUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  detectionLimits?: Maybe<Array<AnalysisDetectionLimitType>>;
  hidden?: Maybe<Scalars['Boolean']['output']>;
  instruments?: Maybe<Array<InstrumentType>>;
  interims?: Maybe<Array<AnalysisInterimType>>;
  internalUse?: Maybe<Scalars['Boolean']['output']>;
  keyword?: Maybe<Scalars['String']['output']>;
  methods?: Maybe<Array<MethodType>>;
  name: Scalars['String']['output'];
  precision?: Maybe<Scalars['Int']['output']>;
  requiredVerifications?: Maybe<Scalars['Int']['output']>;
  resultOptions?: Maybe<Array<ResultOptionType>>;
  resultType?: Maybe<Scalars['String']['output']>;
  sampleTypes?: Maybe<Array<SampleTypeTyp>>;
  selfVerification?: Maybe<Scalars['Boolean']['output']>;
  sortKey?: Maybe<Scalars['Int']['output']>;
  specifications?: Maybe<Array<AnalysisSpecificationType>>;
  tatLengthMinutes?: Maybe<Scalars['Int']['output']>;
  uid: Scalars['String']['output'];
  uncertainties?: Maybe<Array<AnalysisUncertaintyType>>;
  unit?: Maybe<UnitType>;
  unitUid?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type AnalysisUncertaintyInput = {
  analysisUid: Scalars['String']['input'];
  instrumentUid: Scalars['String']['input'];
  max: Scalars['Float']['input'];
  methodUid: Scalars['String']['input'];
  min: Scalars['Float']['input'];
  value: Scalars['Float']['input'];
};

export type AnalysisUncertaintyResponse = AnalysisUncertaintyType | OperationError;

export type AnalysisUncertaintyType = {
  __typename?: 'AnalysisUncertaintyType';
  analysisUid: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  instrumentUid: Scalars['String']['output'];
  max: Scalars['Float']['output'];
  methodUid: Scalars['String']['output'];
  min: Scalars['Float']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  value: Scalars['Float']['output'];
};

export type AnalysisWithProfiles = {
  __typename?: 'AnalysisWithProfiles';
  active?: Maybe<Scalars['Boolean']['output']>;
  category?: Maybe<AnalysisCategoryType>;
  categoryUid?: Maybe<Scalars['String']['output']>;
  correctionFactors?: Maybe<Array<AnalysisCorrectionFactorType>>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  department?: Maybe<DepartmentType>;
  departmentUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  detectionLimits?: Maybe<Array<AnalysisDetectionLimitType>>;
  hidden?: Maybe<Scalars['Boolean']['output']>;
  instruments?: Maybe<Array<InstrumentType>>;
  interims?: Maybe<Array<AnalysisInterimType>>;
  internalUse?: Maybe<Scalars['Boolean']['output']>;
  keyword?: Maybe<Scalars['String']['output']>;
  methods?: Maybe<Array<MethodType>>;
  name: Scalars['String']['output'];
  precision?: Maybe<Scalars['Int']['output']>;
  profiles?: Maybe<Array<ProfileType>>;
  requiredVerifications?: Maybe<Scalars['Int']['output']>;
  resultOptions?: Maybe<Array<ResultOptionType>>;
  resultType?: Maybe<Scalars['String']['output']>;
  sampleTypes?: Maybe<Array<SampleTypeTyp>>;
  selfVerification?: Maybe<Scalars['Boolean']['output']>;
  sortKey?: Maybe<Scalars['Int']['output']>;
  specifications?: Maybe<Array<AnalysisSpecificationType>>;
  tatLengthMinutes?: Maybe<Scalars['Int']['output']>;
  uid: Scalars['String']['output'];
  uncertainties?: Maybe<Array<AnalysisUncertaintyType>>;
  unit?: Maybe<UnitType>;
  unitUid?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type ApplyVoucherInput = {
  customerUid: Scalars['String']['input'];
  testBillUid: Scalars['String']['input'];
  voucherCode: Scalars['String']['input'];
};

export type AuditLogType = {
  __typename?: 'AuditLogType';
  action?: Maybe<Scalars['Int']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  stateAfter?: Maybe<Scalars['JSONScalar']['output']>;
  stateBefore?: Maybe<Scalars['JSONScalar']['output']>;
  targetType?: Maybe<Scalars['String']['output']>;
  targetUid?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  userUid?: Maybe<Scalars['String']['output']>;
};

export type AuthenticatedData = {
  __typename?: 'AuthenticatedData';
  refresh: Scalars['String']['output'];
  token: Scalars['String']['output'];
  tokenType: Scalars['String']['output'];
  user: UserType;
};

export type AuthenticatedDataResponse = AuthenticatedData | OperationError;

export type BillTransactionInput = {
  amount: Scalars['Float']['input'];
  kind: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  testBillUid: Scalars['String']['input'];
};

export type CalibrationCertificateInput = {
  approvedBy?: InputMaybe<Scalars['String']['input']>;
  certificateCode?: InputMaybe<Scalars['String']['input']>;
  dateIssued?: InputMaybe<Scalars['DateTime']['input']>;
  internal?: Scalars['Boolean']['input'];
  issuer?: InputMaybe<Scalars['String']['input']>;
  laboratoryInstrumentUid: Scalars['String']['input'];
  performedBy?: InputMaybe<Scalars['String']['input']>;
  remarks?: InputMaybe<Scalars['String']['input']>;
  validFromDate?: InputMaybe<Scalars['String']['input']>;
  validToDate?: InputMaybe<Scalars['String']['input']>;
};

export type CalibrationCertificateResponse = CalibrationCertificateType | OperationError;

export type CalibrationCertificateType = {
  __typename?: 'CalibrationCertificateType';
  approvedBy: Scalars['String']['output'];
  certificateCode: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  dateIssued: Scalars['DateTime']['output'];
  internal: Scalars['Boolean']['output'];
  issuer: Scalars['String']['output'];
  laboratoryInstrument?: Maybe<LaboratoryInstrumentType>;
  laboratoryInstrumentUid: Scalars['String']['output'];
  performedBy: Scalars['String']['output'];
  remarks: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  validFromDate: Scalars['DateTime']['output'];
  validToDate: Scalars['DateTime']['output'];
};

export type ClientContactInputType = {
  clientUid: Scalars['String']['input'];
  consentSms?: InputMaybe<Scalars['Boolean']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  emailCc?: InputMaybe<Scalars['String']['input']>;
  firstName: Scalars['String']['input'];
  isActive?: Scalars['Boolean']['input'];
  lastName?: InputMaybe<Scalars['String']['input']>;
  mobilePhone?: InputMaybe<Scalars['String']['input']>;
};

export type ClientContactResponse = ClientContactType | OperationError;

export type ClientContactType = {
  __typename?: 'ClientContactType';
  businessPhone?: Maybe<Scalars['String']['output']>;
  client?: Maybe<ClientType>;
  clientUid: Scalars['String']['output'];
  consentSms: Scalars['Boolean']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  creatorName?: Maybe<Scalars['String']['output']>;
  creatorUid?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  emailCc?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  mobilePhone?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatorName?: Maybe<Scalars['String']['output']>;
  updatorUid?: Maybe<Scalars['String']['output']>;
};

export type ClientCursorPage = {
  __typename?: 'ClientCursorPage';
  edges?: Maybe<Array<ClientEdge>>;
  items?: Maybe<Array<ClientType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ClientEdge = {
  __typename?: 'ClientEdge';
  cursor: Scalars['String']['output'];
  node: ClientType;
};

export type ClientInputType = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  code: Scalars['String']['input'];
  consentEmail?: InputMaybe<Scalars['Boolean']['input']>;
  consentSms?: InputMaybe<Scalars['Boolean']['input']>;
  districtUid?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  emailCc?: InputMaybe<Scalars['String']['input']>;
  internalUse?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  phoneBusiness?: InputMaybe<Scalars['String']['input']>;
  phoneMobile?: InputMaybe<Scalars['String']['input']>;
};

export type ClientResponse = ClientType | OperationError;

export type ClientType = {
  __typename?: 'ClientType';
  active: Scalars['Boolean']['output'];
  code: Scalars['String']['output'];
  consentEmail: Scalars['Boolean']['output'];
  consentSms: Scalars['Boolean']['output'];
  contacts?: Maybe<Array<ClientContactType>>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  district?: Maybe<DistrictType>;
  districtUid?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  emailCc?: Maybe<Scalars['String']['output']>;
  internalUse: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  phoneBusiness?: Maybe<Scalars['String']['output']>;
  phoneMobile?: Maybe<Scalars['String']['output']>;
  province?: Maybe<ProvinceType>;
  provinceUid?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type CodingStandardInputType = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CodingStandardResponse = CodingStandardType | OperationError;

export type CodingStandardType = {
  __typename?: 'CodingStandardType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type CountryInputType = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  code: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type CountryResponse = CountryType | OperationError;

export type CountryType = {
  __typename?: 'CountryType';
  active?: Maybe<Scalars['String']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type CreateQcSetData = {
  __typename?: 'CreateQCSetData';
  qcSets: Array<QcSetWithSamples>;
};

export type DeleteContactResponse = DeletedItem | OperationError;

/** Union of possible outcomes when deleting some object */
export type DeleteResponse = DeletedItem | OperationError;

export type DeletedItem = {
  __typename?: 'DeletedItem';
  uid: Scalars['String']['output'];
};

export type DepartmentInputType = {
  code?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type DepartmentResponse = DepartmentType | OperationError;

export type DepartmentType = {
  __typename?: 'DepartmentType';
  code?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type DistrictCursorPage = {
  __typename?: 'DistrictCursorPage';
  edges?: Maybe<Array<DistrictEdge>>;
  items?: Maybe<Array<DistrictType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type DistrictEdge = {
  __typename?: 'DistrictEdge';
  cursor: Scalars['String']['output'];
  node: DistrictType;
};

export type DistrictInputType = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  businessPhone?: InputMaybe<Scalars['String']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  emailCc?: InputMaybe<Scalars['String']['input']>;
  mobilePhone?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  provinceUid?: InputMaybe<Scalars['String']['input']>;
};

export type DistrictResponse = DistrictType | OperationError;

export type DistrictType = {
  __typename?: 'DistrictType';
  active?: Maybe<Scalars['Boolean']['output']>;
  businessPhone?: Maybe<Scalars['String']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  emailCc?: Maybe<Scalars['String']['output']>;
  mobilePhone?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  province?: Maybe<ProvinceType>;
  provinceUid?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type DocumentAuditCursorPage = {
  __typename?: 'DocumentAuditCursorPage';
  edges?: Maybe<Array<DocumentAuditEdge>>;
  items?: Maybe<Array<DocumentAuditType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type DocumentAuditEdge = {
  __typename?: 'DocumentAuditEdge';
  cursor: Scalars['String']['output'];
  node: DocumentAuditType;
};

export type DocumentAuditInputType = {
  /** Audit action */
  action: Scalars['String']['input'];
  /** Action date */
  date?: InputMaybe<Scalars['DateTime']['input']>;
  /** Document UID */
  document: Scalars['String']['input'];
  /** IP address */
  ipAddress?: InputMaybe<Scalars['String']['input']>;
};

/** Response for document audit operations */
export type DocumentAuditResponse = DocumentAuditType | OperationError;

export type DocumentAuditType = {
  __typename?: 'DocumentAuditType';
  action: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  date: Scalars['String']['output'];
  document: DocumentType;
  documentUid: Scalars['String']['output'];
  ipAddress?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  user: UserType;
  userUid: Scalars['String']['output'];
};

export type DocumentCategoryInputType = {
  /** Category name */
  name: Scalars['String']['input'];
};

/** Response for document category operations */
export type DocumentCategoryResponse = DocumentCategoryType | OperationError;

export type DocumentCategoryType = {
  __typename?: 'DocumentCategoryType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type DocumentCategoryUpdateInputType = {
  /** Category name */
  name?: InputMaybe<Scalars['String']['input']>;
  uid: Scalars['String']['input'];
};

export type DocumentCursorPage = {
  __typename?: 'DocumentCursorPage';
  edges?: Maybe<Array<DocumentEdge>>;
  items?: Maybe<Array<DocumentType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type DocumentEdge = {
  __typename?: 'DocumentEdge';
  cursor: Scalars['String']['output'];
  node: DocumentType;
};

export type DocumentFolderCursorPage = {
  __typename?: 'DocumentFolderCursorPage';
  edges?: Maybe<Array<DocumentFolderEdge>>;
  items?: Maybe<Array<DocumentFolderType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type DocumentFolderEdge = {
  __typename?: 'DocumentFolderEdge';
  cursor: Scalars['String']['output'];
  node: DocumentFolderType;
};

export type DocumentFolderInputType = {
  /** Folder description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Folder name */
  name: Scalars['String']['input'];
  /** Parent folder UID */
  parentUid?: InputMaybe<Scalars['String']['input']>;
};

/** Response for document folder operations */
export type DocumentFolderResponse = DocumentFolderType | OperationError;

export type DocumentFolderType = {
  __typename?: 'DocumentFolderType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  documents: Array<DocumentType>;
  name: Scalars['String']['output'];
  parent?: Maybe<DocumentFolderType>;
  parentUid?: Maybe<Scalars['String']['output']>;
  subfolders: Array<DocumentFolderType>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type DocumentFolderUpdateInputType = {
  /** Folder description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Folder name */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Parent folder UID */
  parentUid?: InputMaybe<Scalars['String']['input']>;
  uid: Scalars['String']['input'];
};

export type DocumentInputType = {
  /** Author UIDs */
  authors?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Category UID */
  categoryUid?: InputMaybe<Scalars['String']['input']>;
  /** Department UID */
  departmentUid?: InputMaybe<Scalars['String']['input']>;
  /** Document ID */
  documentId: Scalars['String']['input'];
  /** Folder UID */
  folderUid?: InputMaybe<Scalars['String']['input']>;
  /** Initial version number */
  initialVersion?: InputMaybe<Scalars['String']['input']>;
  /** Document name */
  name: Scalars['String']['input'];
  /** Reader UIDs */
  readers?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Document subtitle */
  subtitle?: InputMaybe<Scalars['String']['input']>;
  /** Tag UIDs */
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Template UID */
  templateUid?: InputMaybe<Scalars['String']['input']>;
};

export type DocumentRelationInputType = {
  /** Relation type */
  relationType: Scalars['String']['input'];
  /** Source document UID */
  sourceDocument: Scalars['String']['input'];
  /** Target document UID */
  targetDocument: Scalars['String']['input'];
};

/** Response for document relation operations */
export type DocumentRelationResponse = DocumentType | OperationError;

/** Response for document operations */
export type DocumentResponse = DocumentType | OperationError;

export type DocumentReviewCycleCursorPage = {
  __typename?: 'DocumentReviewCycleCursorPage';
  edges?: Maybe<Array<DocumentReviewCycleEdge>>;
  items?: Maybe<Array<DocumentReviewCycleType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type DocumentReviewCycleEdge = {
  __typename?: 'DocumentReviewCycleEdge';
  cursor: Scalars['String']['output'];
  node: DocumentReviewCycleType;
};

export type DocumentReviewCycleInputType = {
  /** Document UID */
  document: Scalars['String']['input'];
  /** End date */
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** Reviewers UIDs */
  reviewers?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Start date */
  startDate: Scalars['DateTime']['input'];
  /** Review cycle status */
  status: Scalars['String']['input'];
};

/** Response for document review cycle operations */
export type DocumentReviewCycleResponse = DocumentReviewCycleType | OperationError;

export type DocumentReviewCycleType = {
  __typename?: 'DocumentReviewCycleType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  document: DocumentType;
  documentUid: Scalars['String']['output'];
  endDate?: Maybe<Scalars['String']['output']>;
  initiatedBy: UserType;
  initiatedByUid: Scalars['String']['output'];
  startDate: Scalars['String']['output'];
  status: Scalars['String']['output'];
  steps: Array<DocumentReviewStepType>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type DocumentReviewCycleUpdateInputType = {
  /** Document UID */
  document?: InputMaybe<Scalars['String']['input']>;
  /** End date */
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** Reviewers UIDs */
  reviewers?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Start date */
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** Review cycle status */
  status?: InputMaybe<Scalars['String']['input']>;
  uid: Scalars['String']['input'];
};

export type DocumentReviewStepCursorPage = {
  __typename?: 'DocumentReviewStepCursorPage';
  edges?: Maybe<Array<DocumentReviewStepEdge>>;
  items?: Maybe<Array<DocumentReviewStepType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type DocumentReviewStepEdge = {
  __typename?: 'DocumentReviewStepEdge';
  cursor: Scalars['String']['output'];
  node: DocumentReviewStepType;
};

/** Response for document review step operations */
export type DocumentReviewStepResponse = DocumentReviewStepType | OperationError;

export type DocumentReviewStepType = {
  __typename?: 'DocumentReviewStepType';
  actionDate?: Maybe<Scalars['String']['output']>;
  comments?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  reviewCycle: DocumentReviewCycleType;
  reviewCycleUid: Scalars['String']['output'];
  reviewer: UserType;
  reviewerUid: Scalars['String']['output'];
  sequence: Scalars['Int']['output'];
  status: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type DocumentReviewStepUpdateInputType = {
  /** Action date */
  actionDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** Review comments */
  comments?: InputMaybe<Scalars['String']['input']>;
  /** Review cycle UID */
  reviewCycle?: InputMaybe<Scalars['String']['input']>;
  /** Reviewer UID */
  reviewer?: InputMaybe<Scalars['String']['input']>;
  /** Review sequence */
  sequence?: InputMaybe<Scalars['Int']['input']>;
  /** Review status */
  status?: InputMaybe<Scalars['String']['input']>;
  uid: Scalars['String']['input'];
};

export type DocumentStatusCursorPage = {
  __typename?: 'DocumentStatusCursorPage';
  edges?: Maybe<Array<DocumentStatusEdge>>;
  items?: Maybe<Array<DocumentStatusType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type DocumentStatusEdge = {
  __typename?: 'DocumentStatusEdge';
  cursor: Scalars['String']['output'];
  node: DocumentStatusType;
};

export type DocumentStatusInputType = {
  /** Status date */
  date?: InputMaybe<Scalars['DateTime']['input']>;
  /** Document UID */
  document: Scalars['String']['input'];
  /** Document status */
  status: Scalars['String']['input'];
};

/** Response for document status operations */
export type DocumentStatusResponse = DocumentStatusType | OperationError;

export type DocumentStatusType = {
  __typename?: 'DocumentStatusType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  date: Scalars['String']['output'];
  document?: Maybe<DocumentType>;
  documentUid: Scalars['String']['output'];
  status: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  user: UserType;
  userUid: Scalars['String']['output'];
};

export type DocumentStatusUpdateInputType = {
  /** Status date */
  date?: InputMaybe<Scalars['DateTime']['input']>;
  /** Document UID */
  document?: InputMaybe<Scalars['String']['input']>;
  /** Document status */
  status?: InputMaybe<Scalars['String']['input']>;
  uid: Scalars['String']['input'];
};

export type DocumentSubscriptionCursorPage = {
  __typename?: 'DocumentSubscriptionCursorPage';
  edges?: Maybe<Array<DocumentSubscriptionEdge>>;
  items?: Maybe<Array<DocumentSubscriptionType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type DocumentSubscriptionEdge = {
  __typename?: 'DocumentSubscriptionEdge';
  cursor: Scalars['String']['output'];
  node: DocumentSubscriptionType;
};

export type DocumentSubscriptionInputType = {
  /** Document UID */
  document: Scalars['String']['input'];
  /** Subscription type */
  subscriptionType: Scalars['String']['input'];
  /** User UID */
  user: Scalars['String']['input'];
};

/** Response for document subscription operations */
export type DocumentSubscriptionResponse = DocumentSubscriptionType | OperationError;

export type DocumentSubscriptionType = {
  __typename?: 'DocumentSubscriptionType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  document: DocumentType;
  documentUid: Scalars['String']['output'];
  subscriptionType: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  user: UserType;
  userUid: Scalars['String']['output'];
};

export type DocumentSubscriptionUpdateInputType = {
  /** Document UID */
  document?: InputMaybe<Scalars['String']['input']>;
  /** Subscription type */
  subscriptionType?: InputMaybe<Scalars['String']['input']>;
  uid: Scalars['String']['input'];
  /** User UID */
  user?: InputMaybe<Scalars['String']['input']>;
};

export type DocumentTagCursorPage = {
  __typename?: 'DocumentTagCursorPage';
  edges?: Maybe<Array<DocumentTagEdge>>;
  items?: Maybe<Array<DocumentTagType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type DocumentTagEdge = {
  __typename?: 'DocumentTagEdge';
  cursor: Scalars['String']['output'];
  node: DocumentTagType;
};

export type DocumentTagInputType = {
  /** Tag name */
  name: Scalars['String']['input'];
};

/** Response for document tag operations */
export type DocumentTagResponse = DocumentTagType | OperationError;

export type DocumentTagType = {
  __typename?: 'DocumentTagType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  documents: Array<DocumentType>;
  name: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type DocumentTagUpdateInputType = {
  /** Tag name */
  name?: InputMaybe<Scalars['String']['input']>;
  uid: Scalars['String']['input'];
};

export type DocumentTemplateCursorPage = {
  __typename?: 'DocumentTemplateCursorPage';
  edges?: Maybe<Array<DocumentTemplateEdge>>;
  items?: Maybe<Array<DocumentTemplateType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type DocumentTemplateEdge = {
  __typename?: 'DocumentTemplateEdge';
  cursor: Scalars['String']['output'];
  node: DocumentTemplateType;
};

export type DocumentTemplateInputType = {
  /** Category UID */
  category?: InputMaybe<Scalars['String']['input']>;
  /** Template content */
  content: Scalars['String']['input'];
  /** Template description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Template name */
  name: Scalars['String']['input'];
};

/** Response for document template operations */
export type DocumentTemplateResponse = DocumentTemplateType | OperationError;

export type DocumentTemplateType = {
  __typename?: 'DocumentTemplateType';
  category?: Maybe<DocumentCategoryType>;
  categoryUid?: Maybe<Scalars['String']['output']>;
  content: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  documents: Array<DocumentType>;
  name: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type DocumentTemplateUpdateInputType = {
  /** Category UID */
  category?: InputMaybe<Scalars['String']['input']>;
  /** Template content */
  content?: InputMaybe<Scalars['String']['input']>;
  /** Template description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Template name */
  name?: InputMaybe<Scalars['String']['input']>;
  uid: Scalars['String']['input'];
};

export type DocumentType = {
  __typename?: 'DocumentType';
  auditRecords: Array<DocumentAuditType>;
  authors: Array<UserType>;
  category?: Maybe<DocumentCategoryType>;
  categoryUid?: Maybe<Scalars['String']['output']>;
  content?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  department?: Maybe<DepartmentType>;
  departmentUid?: Maybe<Scalars['String']['output']>;
  documentId: Scalars['String']['output'];
  editor?: Maybe<Scalars['String']['output']>;
  folder?: Maybe<DocumentFolderType>;
  folderUid?: Maybe<Scalars['String']['output']>;
  lastAccessed?: Maybe<Scalars['String']['output']>;
  lastAccessedBy?: Maybe<UserType>;
  lastAccessedByUid?: Maybe<Scalars['String']['output']>;
  latestVersion?: Maybe<DocumentVersionType>;
  name: Scalars['String']['output'];
  readers: Array<UserType>;
  relatedFrom: Array<DocumentType>;
  relatedTo: Array<DocumentType>;
  reviewCycles: Array<DocumentReviewCycleType>;
  status?: Maybe<Scalars['String']['output']>;
  statuses: Array<DocumentStatusType>;
  subscriptions: Array<DocumentSubscriptionType>;
  subtitle?: Maybe<Scalars['String']['output']>;
  tags: Array<DocumentTagType>;
  template?: Maybe<DocumentTemplateType>;
  templateUid?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  versions: Array<DocumentVersionType>;
};

export type DocumentUpdateInputType = {
  /** Author UIDs */
  authors?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Category UID */
  categoryUid?: InputMaybe<Scalars['String']['input']>;
  /** Department UID */
  departmentUid?: InputMaybe<Scalars['String']['input']>;
  /** Document ID */
  documentId?: InputMaybe<Scalars['String']['input']>;
  /** Folder UID */
  folderUid?: InputMaybe<Scalars['String']['input']>;
  /** Document name */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Reader UIDs */
  readers?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Document subtitle */
  subtitle?: InputMaybe<Scalars['String']['input']>;
  /** Tag UIDs */
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  uid: Scalars['String']['input'];
};

export type DocumentVersionCursorPage = {
  __typename?: 'DocumentVersionCursorPage';
  edges?: Maybe<Array<DocumentVersionEdge>>;
  items?: Maybe<Array<DocumentVersionType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type DocumentVersionEdge = {
  __typename?: 'DocumentVersionEdge';
  cursor: Scalars['String']['output'];
  node: DocumentVersionType;
};

export type DocumentVersionInputType = {
  /** Change summary */
  changeSummary?: InputMaybe<Scalars['String']['input']>;
  /** Document content */
  content: Scalars['String']['input'];
  /** Document UID */
  document: Scalars['String']['input'];
  /** Version number */
  versionNumber: Scalars['String']['input'];
};

/** Response for document version operations */
export type DocumentVersionResponse = DocumentVersionType | OperationError;

export type DocumentVersionType = {
  __typename?: 'DocumentVersionType';
  changeSummary?: Maybe<Scalars['String']['output']>;
  content: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  document?: Maybe<DocumentType>;
  documentUid: Scalars['String']['output'];
  editor: Scalars['String']['output'];
  thumbnail?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  versionNumber: Scalars['String']['output'];
};

export type DocumentVersionUpdateInputType = {
  /** Document content */
  content: Scalars['String']['input'];
};

export enum ErrandCategory {
  Engagement = 'ENGAGEMENT',
  Message = 'MESSAGE',
  Project = 'PROJECT',
  Ticket = 'TICKET',
  Todo = 'TODO'
}

export type FileResponseType = {
  __typename?: 'FileResponseType';
  content: Scalars['String']['output'];
  filename: Scalars['String']['output'];
  mimetype: Scalars['String']['output'];
  size: Scalars['Int']['output'];
  uid: Scalars['String']['output'];
};

export type FileUrlResponseType = {
  __typename?: 'FileUrlResponseType';
  downloadUrl: Scalars['String']['output'];
  filename: Scalars['String']['output'];
  mimetype: Scalars['String']['output'];
  uid: Scalars['String']['output'];
};

export type GrindBoardCursorPage = {
  __typename?: 'GrindBoardCursorPage';
  edges?: Maybe<Array<GrindBoardEdge>>;
  items?: Maybe<Array<GrindBoardType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type GrindBoardEdge = {
  __typename?: 'GrindBoardEdge';
  cursor: Scalars['String']['output'];
  node: GrindBoardType;
};

export type GrindBoardResponse = GrindBoardType | OperationError;

export type GrindBoardType = {
  __typename?: 'GrindBoardType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  posters: Array<GrindPosterType>;
  scheme?: Maybe<GrindSchemeType>;
  schemeUid?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type GrindCreateBoardInput = {
  /** Board Description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Board Scheme */
  schemeUid?: InputMaybe<Scalars['String']['input']>;
  /** Board Title */
  title: Scalars['String']['input'];
};

export type GrindCreateErrandDiscussionInput = {
  /** Comment */
  comment: Scalars['String']['input'];
  /** Errand uid */
  errandUid: Scalars['String']['input'];
  /** Parent comment uid */
  parentUid?: InputMaybe<Scalars['String']['input']>;
};

export type GrindCreateErrandInput = {
  /** Assigned To */
  assigneeUid?: InputMaybe<Scalars['String']['input']>;
  /** Errand Category */
  category?: InputMaybe<ErrandCategory>;
  /** Errand Description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** End Date */
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** Errand Label | Status */
  labelUid?: InputMaybe<Scalars['String']['input']>;
  /** Errand Members */
  members?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Errand Milestone */
  milestones?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Errand Poster */
  posterUid?: InputMaybe<Scalars['String']['input']>;
  /** Errand Priority */
  priority?: InputMaybe<Scalars['String']['input']>;
  /** Assigned To */
  reporterUid?: InputMaybe<Scalars['String']['input']>;
  /** Errand Stamps | Tags */
  stamps?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Start Date */
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** Errand Title */
  title?: InputMaybe<Scalars['String']['input']>;
};

export type GrindCreateLabelInput = {
  /** Label category */
  category: LabelCategory;
  /** Label title */
  title: Scalars['String']['input'];
};

export type GrindCreateMediaInput = {
  file: Scalars['Upload']['input'];
  /** Media target */
  target: MediaTarget;
  /** Media Target ID */
  targetUid: Scalars['String']['input'];
};

export type GrindCreateMilestoneInput = {
  /** Assigned to */
  assigneeUid?: InputMaybe<Scalars['String']['input']>;
  /** Status */
  complete?: InputMaybe<Scalars['Boolean']['input']>;
  /** Milestone Description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Milestone Errand */
  errandUid: Scalars['String']['input'];
  /** Milestone Title */
  title?: InputMaybe<Scalars['String']['input']>;
};

export type GrindCreatePosterInput = {
  /** Assigned To */
  assigneeUid?: InputMaybe<Scalars['String']['input']>;
  /** Poster Board */
  boardUid?: InputMaybe<Scalars['String']['input']>;
  /** Poster category */
  category: PosterCategory;
  /** Poster description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Poster Members */
  members?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Poster label */
  stamps?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Poster status */
  status?: InputMaybe<Scalars['String']['input']>;
  /** Poster Title */
  title: Scalars['String']['input'];
};

export type GrindCreateSchemeInput = {
  /** Assigned to */
  assignee?: InputMaybe<Scalars['String']['input']>;
  /** Scheme Description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** End Date */
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** Scheme Members */
  members?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Start Date */
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** Scheme Title */
  title: Scalars['String']['input'];
};

export type GrindCreateStampInput = {
  /** Stamp category */
  category: StampCategory;
  /** Stamp title */
  title: Scalars['String']['input'];
};

export type GrindErrandCursorPage = {
  __typename?: 'GrindErrandCursorPage';
  edges?: Maybe<Array<GrindErrandEdge>>;
  items?: Maybe<Array<GrindErrandType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type GrindErrandDiscussionResponse = GrindErrandDiscussionType | OperationError;

export type GrindErrandDiscussionType = {
  __typename?: 'GrindErrandDiscussionType';
  canEdit: Scalars['Boolean']['output'];
  comment: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  errand?: Maybe<GrindErrandType>;
  errandUid?: Maybe<Scalars['String']['output']>;
  parent?: Maybe<GrindErrandDiscussionType>;
  parentUid?: Maybe<Scalars['String']['output']>;
  subdiscussions: Array<GrindErrandDiscussionType>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type GrindErrandEdge = {
  __typename?: 'GrindErrandEdge';
  cursor: Scalars['String']['output'];
  node: GrindErrandType;
};

export type GrindErrandResponse = GrindErrandType | OperationError;

export type GrindErrandType = {
  __typename?: 'GrindErrandType';
  assignee?: Maybe<UserType>;
  assigneeUid?: Maybe<Scalars['String']['output']>;
  category?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  endDate?: Maybe<Scalars['String']['output']>;
  label?: Maybe<GrindLabelType>;
  labelUid?: Maybe<Scalars['String']['output']>;
  media: Array<GrindMediaType>;
  members: Array<UserType>;
  milestones: Array<GrindMilestoneType>;
  milestonesAt: Scalars['Float']['output'];
  occurrences: Array<GrindOccurrenceType>;
  poster?: Maybe<GrindPosterType>;
  posterUid?: Maybe<Scalars['String']['output']>;
  priority?: Maybe<Scalars['String']['output']>;
  progress?: Maybe<Scalars['Int']['output']>;
  reporter?: Maybe<UserType>;
  reporterUid?: Maybe<Scalars['String']['output']>;
  stamps: Array<GrindStampType>;
  startDate?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type GrindLabelCursorPage = {
  __typename?: 'GrindLabelCursorPage';
  edges?: Maybe<Array<GrindLabelEdge>>;
  items?: Maybe<Array<GrindLabelType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type GrindLabelEdge = {
  __typename?: 'GrindLabelEdge';
  cursor: Scalars['String']['output'];
  node: GrindLabelType;
};

export type GrindLabelResponse = GrindLabelType | OperationError;

export type GrindLabelType = {
  __typename?: 'GrindLabelType';
  category?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type GrindMediaCursorPage = {
  __typename?: 'GrindMediaCursorPage';
  edges?: Maybe<Array<GrindMediaEdge>>;
  items?: Maybe<Array<GrindMediaType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type GrindMediaEdge = {
  __typename?: 'GrindMediaEdge';
  cursor: Scalars['String']['output'];
  node: GrindMediaType;
};

export type GrindMediaResponse = GrindMediaType | OperationError;

export type GrindMediaType = {
  __typename?: 'GrindMediaType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  destination?: Maybe<Scalars['String']['output']>;
  encoding?: Maybe<Scalars['String']['output']>;
  filename?: Maybe<Scalars['String']['output']>;
  mimetype?: Maybe<Scalars['String']['output']>;
  originalName?: Maybe<Scalars['String']['output']>;
  path?: Maybe<Scalars['String']['output']>;
  size?: Maybe<Scalars['String']['output']>;
  target?: Maybe<Scalars['String']['output']>;
  targetUid?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type GrindMilestoneCursorPage = {
  __typename?: 'GrindMilestoneCursorPage';
  edges?: Maybe<Array<GrindMilestoneEdge>>;
  items?: Maybe<Array<GrindMilestoneType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type GrindMilestoneEdge = {
  __typename?: 'GrindMilestoneEdge';
  cursor: Scalars['String']['output'];
  node: GrindMilestoneType;
};

export type GrindMilestoneResponse = GrindMilestoneType | OperationError;

export type GrindMilestoneType = {
  __typename?: 'GrindMilestoneType';
  assignee?: Maybe<UserType>;
  assigneeUid?: Maybe<Scalars['String']['output']>;
  complete?: Maybe<Scalars['Boolean']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  errand?: Maybe<GrindErrandType>;
  errandUid?: Maybe<Scalars['String']['output']>;
  occurrences: Array<GrindOccurrenceType>;
  title?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type GrindOccurrenceCursorPage = {
  __typename?: 'GrindOccurrenceCursorPage';
  edges?: Maybe<Array<GrindOccurrenceEdge>>;
  items?: Maybe<Array<GrindOccurrenceType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type GrindOccurrenceEdge = {
  __typename?: 'GrindOccurrenceEdge';
  cursor: Scalars['String']['output'];
  node: GrindOccurrenceType;
};

export type GrindOccurrenceType = {
  __typename?: 'GrindOccurrenceType';
  actor?: Maybe<UserType>;
  actorUid?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  target?: Maybe<Scalars['String']['output']>;
  targetUid?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type GrindPosterCursorPage = {
  __typename?: 'GrindPosterCursorPage';
  edges?: Maybe<Array<GrindPosterEdge>>;
  items?: Maybe<Array<GrindPosterType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type GrindPosterEdge = {
  __typename?: 'GrindPosterEdge';
  cursor: Scalars['String']['output'];
  node: GrindPosterType;
};

export type GrindPosterResponse = GrindPosterType | OperationError;

export type GrindPosterType = {
  __typename?: 'GrindPosterType';
  assignee?: Maybe<UserType>;
  assigneeUid?: Maybe<Scalars['String']['output']>;
  board?: Maybe<GrindBoardType>;
  boardUid?: Maybe<Scalars['String']['output']>;
  category?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  errands: Array<GrindErrandType>;
  members: Array<UserType>;
  stamps: Array<GrindStampType>;
  status?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type GrindSchemeCursorPage = {
  __typename?: 'GrindSchemeCursorPage';
  edges?: Maybe<Array<GrindSchemeEdge>>;
  items?: Maybe<Array<GrindSchemeType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type GrindSchemeEdge = {
  __typename?: 'GrindSchemeEdge';
  cursor: Scalars['String']['output'];
  node: GrindSchemeType;
};

export type GrindSchemeResponse = GrindSchemeType | OperationError;

export type GrindSchemeType = {
  __typename?: 'GrindSchemeType';
  assignee?: Maybe<UserType>;
  assigneeUid?: Maybe<Scalars['String']['output']>;
  boards: Array<GrindBoardType>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  endDate?: Maybe<Scalars['String']['output']>;
  members: Array<UserType>;
  startDate?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type GrindStampCursorPage = {
  __typename?: 'GrindStampCursorPage';
  edges?: Maybe<Array<GrindStampEdge>>;
  items?: Maybe<Array<GrindStampType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type GrindStampEdge = {
  __typename?: 'GrindStampEdge';
  cursor: Scalars['String']['output'];
  node: GrindStampType;
};

export type GrindStampResponse = GrindStampType | OperationError;

export type GrindStampType = {
  __typename?: 'GrindStampType';
  category?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type GrindUpdateBoardInput = {
  /** Board Description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Board Scheme */
  schemeUid?: InputMaybe<Scalars['String']['input']>;
  /** Board Title */
  title?: InputMaybe<Scalars['String']['input']>;
};

export type GrindUpdateErrandDiscussionInput = {
  /** Comment */
  comment: Scalars['String']['input'];
  /** Errand uid */
  errandUid: Scalars['String']['input'];
  /** Parent comment uid */
  parentUid?: InputMaybe<Scalars['String']['input']>;
};

export type GrindUpdateErrandInput = {
  /** Assigned To */
  assigneeUid?: InputMaybe<Scalars['String']['input']>;
  /** Errand Category */
  category?: InputMaybe<ErrandCategory>;
  /** Errand Description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** End Date */
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** Errand Label | Status */
  labelUid?: InputMaybe<Scalars['String']['input']>;
  /** Errand Members */
  members?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Errand Milestone */
  milestones?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Errand Poster */
  posterUid?: InputMaybe<Scalars['String']['input']>;
  /** Errand Priority */
  priority?: InputMaybe<Scalars['String']['input']>;
  /** Assigned To */
  reporterUid?: InputMaybe<Scalars['String']['input']>;
  /** Errand Stamps | Tags */
  stamps?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Start Date */
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** Errand Title */
  title?: InputMaybe<Scalars['String']['input']>;
};

export type GrindUpdateLabelInput = {
  /** Label category */
  category?: InputMaybe<Scalars['String']['input']>;
  /** Label title */
  title?: InputMaybe<Scalars['String']['input']>;
};

export type GrindUpdateMilestoneInput = {
  /** Assigned to */
  assigneeUid?: InputMaybe<Scalars['String']['input']>;
  /** Status */
  complete?: InputMaybe<Scalars['Boolean']['input']>;
  /** Milestone Description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Milestone Errand */
  errandUid: Scalars['String']['input'];
  /** Milestone Title */
  title?: InputMaybe<Scalars['String']['input']>;
};

export type GrindUpdatePosterInput = {
  /** Assigned To */
  assigneeUid?: InputMaybe<Scalars['String']['input']>;
  /** Poster Board */
  boardUid?: InputMaybe<Scalars['String']['input']>;
  /** Poster category */
  category: PosterCategory;
  /** Poster description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Poster Members */
  members?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Poster label */
  stamps?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Poster status */
  status?: InputMaybe<Scalars['String']['input']>;
  /** Poster Title */
  title: Scalars['String']['input'];
};

export type GrindUpdateSchemeInput = {
  /** Assigned to */
  assignee?: InputMaybe<Scalars['String']['input']>;
  /** Scheme Description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** End Date */
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** Scheme Members */
  members?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Start Date */
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** Scheme Title */
  title?: InputMaybe<Scalars['String']['input']>;
};

export type GrindUpdateStampInput = {
  /** Stamp category */
  category?: InputMaybe<Scalars['String']['input']>;
  /** Stamp title */
  title?: InputMaybe<Scalars['String']['input']>;
};

export type GroupCount = {
  __typename?: 'GroupCount';
  count?: Maybe<Scalars['Int']['output']>;
  group: Scalars['String']['output'];
};

export type GroupData = {
  __typename?: 'GroupData';
  counts?: Maybe<Array<GroupCount>>;
  group: Scalars['String']['output'];
};

export type GroupInputType = {
  active?: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  pages: Scalars['String']['input'];
};

export type GroupResponse = GroupType | OperationError;

export type GroupType = {
  __typename?: 'GroupType';
  active?: Maybe<Scalars['Boolean']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<GroupType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  keyword?: Maybe<Scalars['String']['output']>;
  members?: Maybe<Array<UserType>>;
  name?: Maybe<Scalars['String']['output']>;
  pages?: Maybe<Scalars['String']['output']>;
  permissions?: Maybe<Array<PermissionType>>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<GroupType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type GroupedCounts = {
  __typename?: 'GroupedCounts';
  data: Array<GroupCount>;
};

export type GroupedData = {
  __typename?: 'GroupedData';
  data: Array<GroupData>;
};

export type HazardInputType = {
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type HazardResponse = HazardType | OperationError;

export type HazardType = {
  __typename?: 'HazardType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type IdentificationResponse = IdentificationType | OperationError;

export type IdentificationType = {
  __typename?: 'IdentificationType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type InstrumentCalibrationInput = {
  calibrationId?: InputMaybe<Scalars['String']['input']>;
  dateReported?: InputMaybe<Scalars['DateTime']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  laboratoryInstrumentUid: Scalars['String']['input'];
  notesBefore?: InputMaybe<Scalars['String']['input']>;
  performedBy?: InputMaybe<Scalars['String']['input']>;
  remarks?: InputMaybe<Scalars['String']['input']>;
  reportId?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  workDone?: InputMaybe<Scalars['String']['input']>;
};

export type InstrumentCalibrationResponse = InstrumentCalibrationType | OperationError;

export type InstrumentCalibrationType = {
  __typename?: 'InstrumentCalibrationType';
  calibrationId: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  dateReported: Scalars['DateTime']['output'];
  endDate: Scalars['DateTime']['output'];
  laboratoryInstrument?: Maybe<LaboratoryInstrumentType>;
  laboratoryInstrumentUid: Scalars['String']['output'];
  notesBefore: Scalars['String']['output'];
  performedBy: Scalars['String']['output'];
  remarks: Scalars['String']['output'];
  reportId: Scalars['String']['output'];
  startDate: Scalars['DateTime']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  workDone: Scalars['String']['output'];
};

export type InstrumentCompetenceInput = {
  competence: Scalars['String']['input'];
  description: Scalars['String']['input'];
  expiryDate: Scalars['DateTime']['input'];
  instrumentUid: Scalars['String']['input'];
  internal: Scalars['Boolean']['input'];
  issueDate: Scalars['DateTime']['input'];
  userUid: Scalars['String']['input'];
};

export type InstrumentCompetenceResponse = InstrumentCompetenceType | OperationError;

export type InstrumentCompetenceType = {
  __typename?: 'InstrumentCompetenceType';
  competence?: Maybe<Scalars['BytesScalar']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description: Scalars['String']['output'];
  expiryDate: Scalars['DateTime']['output'];
  instrument?: Maybe<InstrumentType>;
  instrumentUid: Scalars['String']['output'];
  internal: Scalars['Boolean']['output'];
  issueDate: Scalars['DateTime']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  user?: Maybe<UserType>;
  userUid: Scalars['String']['output'];
};

export type InstrumentCursorPage = {
  __typename?: 'InstrumentCursorPage';
  edges?: Maybe<Array<InstrumentEdge>>;
  items?: Maybe<Array<InstrumentType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type InstrumentEdge = {
  __typename?: 'InstrumentEdge';
  cursor: Scalars['String']['output'];
  node: InstrumentType;
};

export type InstrumentInputType = {
  description?: InputMaybe<Scalars['String']['input']>;
  instrumentTypeUid?: InputMaybe<Scalars['String']['input']>;
  keyword: Scalars['String']['input'];
  manufacturerUid?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  supplierUid?: InputMaybe<Scalars['String']['input']>;
};

export type InstrumentResponse = InstrumentType | OperationError;

export type InstrumentType = {
  __typename?: 'InstrumentType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  instrumentType?: Maybe<InstrumentTypeType>;
  instrumentTypeUid?: Maybe<Scalars['String']['output']>;
  keyword?: Maybe<Scalars['String']['output']>;
  laboratoryInstruments?: Maybe<Array<LaboratoryInstrumentType>>;
  manufacturer?: Maybe<ManufacturerType>;
  manufacturerUid?: Maybe<Scalars['String']['output']>;
  methods?: Maybe<Array<MethodType>>;
  name?: Maybe<Scalars['String']['output']>;
  supplier?: Maybe<SupplierType>;
  supplierUid?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type InstrumentTypeCursorPage = {
  __typename?: 'InstrumentTypeCursorPage';
  edges?: Maybe<Array<InstrumentTypeEdge>>;
  items?: Maybe<Array<InstrumentTypeType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type InstrumentTypeEdge = {
  __typename?: 'InstrumentTypeEdge';
  cursor: Scalars['String']['output'];
  node: InstrumentTypeType;
};

export type InstrumentTypeInputType = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type InstrumentTypeResponse = InstrumentTypeType | OperationError;

export type InstrumentTypeType = {
  __typename?: 'InstrumentTypeType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export enum LabelCategory {
  Ticket = 'TICKET'
}

export type LaboratoryInputType = {
  address?: InputMaybe<Scalars['String']['input']>;
  banking?: InputMaybe<Scalars['String']['input']>;
  businessPhone?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  emailCc?: InputMaybe<Scalars['String']['input']>;
  labManagerUid?: InputMaybe<Scalars['String']['input']>;
  labName: Scalars['String']['input'];
  logo?: InputMaybe<Scalars['String']['input']>;
  mobilePhone?: InputMaybe<Scalars['String']['input']>;
  qualityStatement?: InputMaybe<Scalars['String']['input']>;
  setupName?: Scalars['String']['input'];
  tagLine?: InputMaybe<Scalars['String']['input']>;
};

export type LaboratoryInstrumentCursorPage = {
  __typename?: 'LaboratoryInstrumentCursorPage';
  edges?: Maybe<Array<LaboratoryInstrumentEdge>>;
  items?: Maybe<Array<LaboratoryInstrumentType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type LaboratoryInstrumentEdge = {
  __typename?: 'LaboratoryInstrumentEdge';
  cursor: Scalars['String']['output'];
  node: LaboratoryInstrumentType;
};

export type LaboratoryInstrumentInputType = {
  dateCommissioned?: InputMaybe<Scalars['DateTime']['input']>;
  dateDecommissioned?: InputMaybe<Scalars['DateTime']['input']>;
  instrumentUid: Scalars['String']['input'];
  labName: Scalars['String']['input'];
  serialNumber?: InputMaybe<Scalars['String']['input']>;
};

export type LaboratoryInstrumentResponse = LaboratoryInstrumentType | OperationError;

export type LaboratoryInstrumentType = {
  __typename?: 'LaboratoryInstrumentType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  dateCommissioned?: Maybe<Scalars['DateTime']['output']>;
  dateDecommissioned?: Maybe<Scalars['DateTime']['output']>;
  instrument?: Maybe<InstrumentType>;
  instrumentUid?: Maybe<Scalars['String']['output']>;
  labName?: Maybe<Scalars['String']['output']>;
  serialNumber?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type LaboratoryResponse = LaboratoryType | OperationError;

export type LaboratorySettingInputType = {
  allowAutoBilling?: InputMaybe<Scalars['Boolean']['input']>;
  allowBilling?: InputMaybe<Scalars['Boolean']['input']>;
  allowPatientRegistration?: InputMaybe<Scalars['Boolean']['input']>;
  allowSampleRegistration?: InputMaybe<Scalars['Boolean']['input']>;
  allowSelfVerification?: InputMaybe<Scalars['Boolean']['input']>;
  allowWorksheetCreation?: InputMaybe<Scalars['Boolean']['input']>;
  autoReceiveSamples?: InputMaybe<Scalars['Boolean']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  defaultRoute?: InputMaybe<Scalars['String']['input']>;
  defaultTheme?: InputMaybe<Scalars['String']['input']>;
  inactivityLogOut?: InputMaybe<Scalars['Int']['input']>;
  laboratoryUid: Scalars['String']['input'];
  passwordLifetime?: InputMaybe<Scalars['Int']['input']>;
  paymentTermsDays?: InputMaybe<Scalars['Int']['input']>;
  stickerCopies?: InputMaybe<Scalars['Int']['input']>;
};

export type LaboratorySettingResponse = LaboratorySettingType | OperationError;

export type LaboratorySettingType = {
  __typename?: 'LaboratorySettingType';
  allowAutoBilling?: Maybe<Scalars['Boolean']['output']>;
  allowBilling?: Maybe<Scalars['Boolean']['output']>;
  allowPatientRegistration?: Maybe<Scalars['Boolean']['output']>;
  allowSampleRegistration?: Maybe<Scalars['Boolean']['output']>;
  allowSelfVerification?: Maybe<Scalars['Boolean']['output']>;
  allowWorksheetCreation?: Maybe<Scalars['Boolean']['output']>;
  autoReceiveSamples?: Maybe<Scalars['Boolean']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  defaultRoute?: Maybe<Scalars['String']['output']>;
  defaultTatMinutes?: Maybe<Scalars['Int']['output']>;
  defaultTheme?: Maybe<Scalars['String']['output']>;
  inactivityLogOut?: Maybe<Scalars['Int']['output']>;
  laboratory: LaboratoryType;
  laboratoryUid: Scalars['String']['output'];
  passwordLifetime?: Maybe<Scalars['Int']['output']>;
  paymentTermsDays?: Maybe<Scalars['Int']['output']>;
  stickerCopies?: Maybe<Scalars['Int']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type LaboratoryType = {
  __typename?: 'LaboratoryType';
  address?: Maybe<Scalars['String']['output']>;
  banking?: Maybe<Scalars['String']['output']>;
  businessPhone?: Maybe<Scalars['String']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  emailCc?: Maybe<Scalars['String']['output']>;
  labManager?: Maybe<UserType>;
  labManagerUid?: Maybe<Scalars['String']['output']>;
  labName: Scalars['String']['output'];
  logo?: Maybe<Scalars['String']['output']>;
  mobilePhone?: Maybe<Scalars['String']['output']>;
  qualityStatement?: Maybe<Scalars['String']['output']>;
  setupName: Scalars['String']['output'];
  tagLine?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type LaggardCounts = {
  __typename?: 'LaggardCounts';
  graterThanThirty?: Maybe<Scalars['Int']['output']>;
  lessThanTen?: Maybe<Scalars['Int']['output']>;
  tenToTwenty?: Maybe<Scalars['Int']['output']>;
  totalDelayed?: Maybe<Scalars['Int']['output']>;
  totalIncomplete?: Maybe<Scalars['Int']['output']>;
  totalNotDelayed?: Maybe<Scalars['Int']['output']>;
  twentyToThirty?: Maybe<Scalars['Int']['output']>;
};

export type LaggardData = {
  __typename?: 'LaggardData';
  category: Scalars['String']['output'];
  counts?: Maybe<LaggardCounts>;
};

export type LaggardStatistics = {
  __typename?: 'LaggardStatistics';
  data: Array<LaggardData>;
};

export type ManageAnalysisInputType = {
  add?: InputMaybe<Array<Scalars['String']['input']>>;
  cancel?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type ManufacturerInputType = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type ManufacturerResponse = ManufacturerType | OperationError;

export type ManufacturerType = {
  __typename?: 'ManufacturerType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export enum MediaTarget {
  Errand = 'ERRAND'
}

/** Union of possible outcomes when deleting some object */
export type MessageResponse = MessagesType | OperationError;

export type MessageThreadType = {
  __typename?: 'MessageThreadType';
  broadcast: Scalars['Boolean']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  deletedBy?: Maybe<Array<UserType>>;
  messages?: Maybe<Array<MessageType>>;
  recipients: Array<UserType>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type MessageType = {
  __typename?: 'MessageType';
  body: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  deletedBy?: Maybe<Array<UserType>>;
  left: Scalars['Int']['output'];
  parent?: Maybe<MessageType>;
  parentId: Scalars['String']['output'];
  right: Scalars['Int']['output'];
  thread?: Maybe<MessageThreadType>;
  threadUid: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  viewers?: Maybe<Array<UserType>>;
};

export type MessagesType = {
  __typename?: 'MessagesType';
  message: Scalars['String']['output'];
};

export type MethodCursorPage = {
  __typename?: 'MethodCursorPage';
  edges?: Maybe<Array<MethodEdge>>;
  items?: Maybe<Array<MethodType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type MethodEdge = {
  __typename?: 'MethodEdge';
  cursor: Scalars['String']['output'];
  node: MethodType;
};

export type MethodInputType = {
  analyses?: InputMaybe<Array<Scalars['String']['input']>>;
  description?: InputMaybe<Scalars['String']['input']>;
  instruments?: InputMaybe<Array<Scalars['String']['input']>>;
  keyword?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type MethodResponse = MethodType | OperationError;

export type MethodType = {
  __typename?: 'MethodType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  instruments?: Maybe<Array<InstrumentType>>;
  keyword?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  actionShipment: ShipmentResponse;
  actionWorksheets: WorkSheetsResponse;
  applyAbxAstPanel: AbxAstResultResponse;
  applyVoucher: TestBillTransactionResponse;
  approveStockOrder: StockOrderResponse;
  authenticateUser: AuthenticatedDataResponse;
  cancelAnalysisResults: AnalysisResultResponse;
  cancelSamples: ResultedSampleActionResponse;
  cloneSamples: SampleActionResponse;
  confirmTestBillTransaction: TestBillTransactionResponse;
  createAbxAntibiotic: AbxAntibioticResponse;
  createAbxAstPanel: AbxAstPanelResponse;
  createAbxBreakpoint: AbxBreakpointResponse;
  createAbxBreakpointType: AbxBreakpointTypeResponse;
  createAbxClass: AbxClassResponse;
  createAbxExpResPhenotype: AbxExpResPhenotypeResponse;
  createAbxExpertInterpretationRule: AbxExpertInterpretationRuleResponse;
  createAbxFamily: AbxFamilyResponse;
  createAbxGenus: AbxGenusResponse;
  createAbxGuideline: AbxGuidelineResponse;
  createAbxHost: AbxHostResponse;
  createAbxKingdom: AbxKingdomResponse;
  createAbxMedium: AbxMediumResponse;
  createAbxOrder: AbxOrderResponse;
  createAbxOrganism: AbxOrganismResponse;
  createAbxOrganismResult: AbxOrganismResultType;
  createAbxOrganismSerotype: AbxOrganismSerotypeResponse;
  createAbxPhylum: AbxPhylumResponse;
  createAbxQcRange: AbxQcRangeResponse;
  createAbxSiteOfInfection: AbxSiteOfInfectionResponse;
  createAbxTestMethod: AbxTestMethodResponse;
  createAnalysis: ProfilesServiceResponse;
  createAnalysisCategory: AnalysisCategoryResponse;
  createAnalysisCorrectionFactor: AnalysisCorrectionFactorResponse;
  createAnalysisDetectionLimit: AnalysisDetectionLimitResponse;
  createAnalysisInterim: AnalysisInterimResponse;
  createAnalysisMapping: AnalysisMappingResponse;
  createAnalysisRequest: AnalysisRequestResponse;
  createAnalysisSpecification: AnalysisSpecificationResponse;
  createAnalysisTemplate: AnalysisTemplateResponse;
  createAnalysisUncertainty: AnalysisUncertaintyResponse;
  createCaliberationCertificate: CalibrationCertificateResponse;
  createClient: ClientResponse;
  createClientContact: ClientContactResponse;
  createCodingStandard: CodingStandardResponse;
  createCountry: CountryResponse;
  createDepartment: DepartmentResponse;
  createDistrict: DistrictResponse;
  createDocument: DocumentResponse;
  createDocumentAudit: DocumentAuditResponse;
  createDocumentCategory: DocumentCategoryResponse;
  createDocumentFolder: DocumentFolderResponse;
  createDocumentRelation: DocumentRelationResponse;
  createDocumentReviewCycle: DocumentReviewCycleResponse;
  createDocumentStatus: DocumentStatusResponse;
  createDocumentSubscription: DocumentSubscriptionResponse;
  createDocumentTag: DocumentTagResponse;
  createDocumentTemplate: DocumentTemplateResponse;
  createDocumentVersion: DocumentVersionResponse;
  createGrindBoard: GrindBoardResponse;
  createGrindErrand: GrindErrandResponse;
  createGrindErrandDiscussion: GrindErrandDiscussionResponse;
  createGrindLabel: GrindLabelResponse;
  createGrindMedia: GrindMediaResponse;
  createGrindMilestone: GrindMilestoneResponse;
  createGrindPoster: GrindPosterResponse;
  createGrindScheme: GrindSchemeResponse;
  createGrindStamp: GrindStampResponse;
  createGroup: GroupResponse;
  createHazard: HazardResponse;
  createIdentification: IdentificationResponse;
  createInstrument: InstrumentResponse;
  createInstrumentCaliberation: InstrumentCalibrationResponse;
  createInstrumentCompetence: InstrumentCompetenceResponse;
  createInstrumentType: InstrumentTypeResponse;
  createLaboratoryInstrument: LaboratoryInstrumentResponse;
  createManufacturer: ManufacturerResponse;
  createMethod: MethodResponse;
  createNotice: NoticeResponse;
  createPatient: PatientResponse;
  createProfile: AnalysisProfileResponse;
  createProfileMapping: ProfileMappingResponse;
  createProvince: ProvinceResponse;
  createQcLevel: QcLevelResponse;
  createQcSet: QcSetResponse;
  createQcTemplate: QcTemplateResponse;
  createReferralLaboratory: ReferralLaboratoryResponse;
  createReflexAction: ReflexActionResponse;
  createReflexBrain: ReflexBrainResponse;
  createReflexRule: ReflexRuleResponse;
  createRejectionReason: RejectionReasonResponse;
  createResultOption: ResultOptionResponse;
  createSampleType: SampleTypeResponse;
  createSampleTypeMapping: SampleTypeMappingResponse;
  createShipment: ShipmentsResponse;
  createStockAdjustment: StockAdjustmentResponse;
  createStockCategory: StockCategoryResponse;
  createStockItem: StockItemResponse;
  createStockItemVariant: StockItemVariantResponse;
  createStockOrder: StockOrderResponse;
  createStockReceipt: StockItemVariantResponse;
  createStockUnit: StockUnitResponse;
  createStorageContainer: StorageContainerResponse;
  createStorageLocation: StorageLocationResponse;
  createStorageSection: StorageSectionResponse;
  createStoreRoom: StoreRoomResponse;
  createSupplier: SupplierResponse;
  createTestBillTransaction: TestBillTransactionResponse;
  createUnit: UnitResponse;
  createUser: UserResponse;
  createVoucher: VoucherResponse;
  createVoucherCode: VoucherCodeResponse;
  createWorksheet: WorkSheetsResponse;
  createWorksheetTemplate: WorkSheetTemplateResponse;
  deleteClientContact: DeleteContactResponse;
  deleteDocument: DocumentResponse;
  deleteDocumentCategory: DocumentCategoryResponse;
  deleteDocumentFolder: DocumentFolderResponse;
  deleteDocumentRelation: DocumentRelationResponse;
  deleteDocumentReviewCycle: DocumentReviewCycleResponse;
  deleteDocumentSubscription: DocumentSubscriptionResponse;
  deleteDocumentTag: DocumentTagResponse;
  deleteDocumentTemplate: DocumentTemplateResponse;
  deleteDocumentVersion: DocumentVersionResponse;
  deleteGrindBoard: DeleteResponse;
  deleteGrindErrand: DeleteResponse;
  deleteGrindLabel: DeleteResponse;
  deleteGrindMedia: DeleteResponse;
  deleteGrindMilestone: DeleteResponse;
  deleteGrindPoster: DeleteResponse;
  deleteGrindScheme: DeleteResponse;
  deleteGrindStamp: DeleteResponse;
  deleteMessage: DeleteResponse;
  deleteNotice: DeleteResponse;
  deleteReflexBrain: DeletedItem;
  deleteStockOrder: StockOrderResponse;
  deleteThread: DeleteResponse;
  discardAbxAntibiotic: DeletedItem;
  invalidateSamples: SampleActionResponse;
  issueStockOrder: StockOrderResponse;
  manageAnalyses: ResultedSampleActionResponse;
  printSamples: SampleActionResponse;
  publishSamples: SuccessErrorResponse;
  reInstateAnalysisResults: AnalysisResultResponse;
  reInstateSamples: ResultedSampleActionResponse;
  receiveSamples: ResultedSampleActionResponse;
  recoverSamples: StoreSampleResponse;
  refresh: AuthenticatedDataResponse;
  rejectSamples: SampleActionResponse;
  removeAbxOrganismResult: DeleteResponse;
  replyMessage: MessageResponse;
  requestPasswordReset: MessageResponse;
  resetPassword: MessageResponse;
  retestAnalysisResults: AnalysisResultResponse;
  retractAnalysisResults: AnalysisResultResponse;
  samplesApplyTemplate: ResultedSampleActionResponse;
  saveAbxOrganismResult: AbxOrganismResultType;
  sendMessage: MessageResponse;
  shipmentManageSamples: ShipmentResponse;
  storeSamples: StoreSampleResponse;
  submitAnalysisResults: AnalysisResultSubmitResponse;
  submitStockOrder: StockOrderResponse;
  updateAbxAntibiotic: AbxAntibioticResponse;
  updateAbxAstPanel: AbxAstPanelResponse;
  updateAbxAstResults: AbxAstResultResponse;
  updateAbxBreakpoint: AbxBreakpointResponse;
  updateAbxBreakpointType: AbxBreakpointTypeResponse;
  updateAbxClass: AbxClassResponse;
  updateAbxExpResPhenotype: AbxExpResPhenotypeResponse;
  updateAbxExpertInterpretationRule: AbxExpertInterpretationRuleResponse;
  updateAbxFamily: AbxFamilyResponse;
  updateAbxGenus: AbxGenusResponse;
  updateAbxGuideline: AbxGuidelineResponse;
  updateAbxHost: AbxHostResponse;
  updateAbxKingdom: AbxKingdomResponse;
  updateAbxMedium: AbxMediumResponse;
  updateAbxOrder: AbxOrderResponse;
  updateAbxOrganism: AbxOrganismResponse;
  updateAbxOrganismSerotype: AbxOrganismSerotypeResponse;
  updateAbxPhylum: AbxPhylumResponse;
  updateAbxQcRange: AbxQcRangeResponse;
  updateAbxSiteOfInfection: AbxSiteOfInfectionResponse;
  updateAbxTestMethod: AbxTestMethodResponse;
  updateAnalysis: ProfilesServiceResponse;
  updateAnalysisCategory: AnalysisCategoryResponse;
  updateAnalysisCorrectionFactor: AnalysisCorrectionFactorResponse;
  updateAnalysisDetectionLimit: AnalysisDetectionLimitResponse;
  updateAnalysisDiscount: AnalysisDiscountResponse;
  updateAnalysisInterim: AnalysisInterimResponse;
  updateAnalysisMapping: AnalysisMappingResponse;
  updateAnalysisPrice: AnalysisPriceResponse;
  updateAnalysisSpecification: AnalysisSpecificationResponse;
  updateAnalysisTemplate: AnalysisTemplateResponse;
  updateAnalysisUncertainty: AnalysisUncertaintyResponse;
  updateCaliberationCertificate: CalibrationCertificateResponse;
  updateClient: ClientResponse;
  updateClientContact: ClientContactResponse;
  updateCodingStandard: CodingStandardResponse;
  updateCountry: CountryResponse;
  updateDepartment: DepartmentResponse;
  updateDistrict: DistrictResponse;
  updateDocument: DocumentResponse;
  updateDocumentCategory: DocumentCategoryResponse;
  updateDocumentFolder: DocumentFolderResponse;
  updateDocumentReviewCycle: DocumentReviewCycleResponse;
  updateDocumentReviewStep: DocumentReviewStepResponse;
  updateDocumentStatus: DocumentStatusResponse;
  updateDocumentSubscription: DocumentSubscriptionResponse;
  updateDocumentTag: DocumentTagResponse;
  updateDocumentTemplate: DocumentTemplateResponse;
  updateDocumentVersion: DocumentVersionResponse;
  updateGrindBoard: GrindBoardResponse;
  updateGrindErrand: GrindErrandResponse;
  updateGrindErrandDiscussion: GrindErrandDiscussionResponse;
  updateGrindLabel: GrindLabelResponse;
  updateGrindMilestone: GrindMilestoneResponse;
  updateGrindPoster: GrindPosterResponse;
  updateGrindScheme: GrindSchemeResponse;
  updateGrindStamp: GrindStampResponse;
  updateGroup: GroupResponse;
  updateGroupPermissions: UpdatedGroupPermsResponse;
  updateHazard: HazardResponse;
  updateIdentification: IdentificationResponse;
  updateInstrument: InstrumentResponse;
  updateInstrumentCaliberation: InstrumentCalibrationResponse;
  updateInstrumentCompetence: InstrumentCompetenceResponse;
  updateInstrumentType: InstrumentTypeResponse;
  updateLaboratory: LaboratoryResponse;
  updateLaboratoryInstrument: LaboratoryInstrumentResponse;
  updateLaboratorySetting: LaboratorySettingResponse;
  updateManufacturer: ManufacturerResponse;
  updateMethod: MethodResponse;
  updateNotice: NoticeResponse;
  updatePatient: PatientResponse;
  updateProfile: AnalysisProfileResponse;
  updateProfileDiscount: ProfileDiscountResponse;
  updateProfileMapping: ProfileMappingResponse;
  updateProfilePrice: ProfilePriceResponse;
  updateProvince: ProvinceResponse;
  updateQcLevel: QcLevelResponse;
  updateQcTemplate: QcTemplateResponse;
  updateReferralLaboratory: ReferralLaboratoryResponse;
  updateReflexAction: ReflexActionResponse;
  updateReflexBrain: ReflexBrainResponse;
  updateReflexRule: ReflexRuleResponse;
  updateRejectionReason: RejectionReasonResponse;
  updateResultOption: ResultOptionResponse;
  updateSampleType: SampleTypeResponse;
  updateSampleTypeMapping: SampleTypeMappingResponse;
  updateShipment: ShipmentResponse;
  updateStockCategory: StockCategoryResponse;
  updateStockItem: StockItemResponse;
  updateStockItemVariant: StockItemVariantResponse;
  updateStockOrder: StockOrderResponse;
  updateStockUnit: StockUnitResponse;
  updateStorageContainer: StorageContainerResponse;
  updateStorageLocation: StorageLocationResponse;
  updateStorageSection: StorageSectionResponse;
  updateStoreRoom: StoreRoomResponse;
  updateSupplier: SupplierResponse;
  updateUnit: UnitResponse;
  updateUser: UserResponse;
  updateVoucher: VoucherResponse;
  updateVoucherCode: VoucherCodeResponse;
  updateWorksheet: WorkSheetResponse;
  updateWorksheetApplyTemplate: WorkSheetResponse;
  updateWorksheetManualAssign: WorkSheetResponse;
  updateWorksheetTemplate: WorkSheetTemplateResponse;
  useAbxAntibiotic: AbxAntibioticResponse;
  validatePasswordResetToken: PasswordResetValidityResponse;
  verifyAnalysisResults: AnalysisResultSubmitResponse;
  verifySamples: SampleActionResponse;
  viewMessage: MessageResponse;
  viewNotice: NoticeType;
};


export type MutationActionShipmentArgs = {
  action: Scalars['String']['input'];
  uid: Scalars['String']['input'];
};


export type MutationActionWorksheetsArgs = {
  action: Scalars['String']['input'];
  uids: Array<Scalars['String']['input']>;
};


export type MutationApplyAbxAstPanelArgs = {
  payload: AbxApplyAstPanelInput;
};


export type MutationApplyVoucherArgs = {
  payload: ApplyVoucherInput;
};


export type MutationApproveStockOrderArgs = {
  payload: StockOrderApprovalInputType;
  uid: Scalars['String']['input'];
};


export type MutationAuthenticateUserArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationCancelAnalysisResultsArgs = {
  analyses: Array<Scalars['String']['input']>;
};


export type MutationCancelSamplesArgs = {
  samples: Array<Scalars['String']['input']>;
};


export type MutationCloneSamplesArgs = {
  samples: Array<Scalars['String']['input']>;
};


export type MutationConfirmTestBillTransactionArgs = {
  notes?: InputMaybe<Scalars['String']['input']>;
  uid: Scalars['String']['input'];
};


export type MutationCreateAbxAntibioticArgs = {
  payload: AbxAntibioticInputType;
};


export type MutationCreateAbxAstPanelArgs = {
  payload: AbxAstPanelInputType;
};


export type MutationCreateAbxBreakpointArgs = {
  payload: AbxBreakpointInputType;
};


export type MutationCreateAbxBreakpointTypeArgs = {
  payload: AbxBreakpointTypeInputType;
};


export type MutationCreateAbxClassArgs = {
  payload: AbxClassInputType;
};


export type MutationCreateAbxExpResPhenotypeArgs = {
  payload: AbxExpResPhenotypeInputType;
};


export type MutationCreateAbxExpertInterpretationRuleArgs = {
  payload: AbxExpertInterpretationRuleInputType;
};


export type MutationCreateAbxFamilyArgs = {
  payload: AbxFamilyInputType;
};


export type MutationCreateAbxGenusArgs = {
  payload: AbxGenusInputType;
};


export type MutationCreateAbxGuidelineArgs = {
  payload: AbxGuidelineInputType;
};


export type MutationCreateAbxHostArgs = {
  payload: AbxHostInputType;
};


export type MutationCreateAbxKingdomArgs = {
  payload: AbxKingdomInputType;
};


export type MutationCreateAbxMediumArgs = {
  payload: AbxMediumInputType;
};


export type MutationCreateAbxOrderArgs = {
  payload: AbxOrderInputType;
};


export type MutationCreateAbxOrganismArgs = {
  payload: AbxOrganismInputType;
};


export type MutationCreateAbxOrganismResultArgs = {
  analysisResultUid: Scalars['String']['input'];
};


export type MutationCreateAbxOrganismSerotypeArgs = {
  payload: AbxOrganismSerotypeInputType;
};


export type MutationCreateAbxPhylumArgs = {
  payload: AbxPhylumInputType;
};


export type MutationCreateAbxQcRangeArgs = {
  payload: AbxQcRangeInputType;
};


export type MutationCreateAbxSiteOfInfectionArgs = {
  payload: AbxSiteOfInfectionInputType;
};


export type MutationCreateAbxTestMethodArgs = {
  payload: AbxTestMethodInputType;
};


export type MutationCreateAnalysisArgs = {
  payload: AnalysisInputType;
};


export type MutationCreateAnalysisCategoryArgs = {
  payload: AnalysisCategoryInputType;
};


export type MutationCreateAnalysisCorrectionFactorArgs = {
  payload: AnalysisCorrectionFactorInput;
};


export type MutationCreateAnalysisDetectionLimitArgs = {
  payload: AnalysisDetectionLimitInput;
};


export type MutationCreateAnalysisInterimArgs = {
  payload: AnalysisInterimInput;
};


export type MutationCreateAnalysisMappingArgs = {
  payload: AnalysisMappingInputType;
};


export type MutationCreateAnalysisRequestArgs = {
  payload: AnalysisRequestInputType;
};


export type MutationCreateAnalysisSpecificationArgs = {
  payload: AnalysisSpecificationInput;
};


export type MutationCreateAnalysisTemplateArgs = {
  payload: AnalysisTemplateInputType;
};


export type MutationCreateAnalysisUncertaintyArgs = {
  payload: AnalysisUncertaintyInput;
};


export type MutationCreateCaliberationCertificateArgs = {
  payload: CalibrationCertificateInput;
};


export type MutationCreateClientArgs = {
  payload: ClientInputType;
};


export type MutationCreateClientContactArgs = {
  payload: ClientContactInputType;
};


export type MutationCreateCodingStandardArgs = {
  payload: CodingStandardInputType;
};


export type MutationCreateCountryArgs = {
  payload: CountryInputType;
};


export type MutationCreateDepartmentArgs = {
  payload: DepartmentInputType;
};


export type MutationCreateDistrictArgs = {
  payload: DistrictInputType;
};


export type MutationCreateDocumentArgs = {
  payload: DocumentInputType;
};


export type MutationCreateDocumentAuditArgs = {
  payload: DocumentAuditInputType;
};


export type MutationCreateDocumentCategoryArgs = {
  payload: DocumentCategoryInputType;
};


export type MutationCreateDocumentFolderArgs = {
  payload: DocumentFolderInputType;
};


export type MutationCreateDocumentRelationArgs = {
  payload: DocumentRelationInputType;
};


export type MutationCreateDocumentReviewCycleArgs = {
  payload: DocumentReviewCycleInputType;
};


export type MutationCreateDocumentStatusArgs = {
  payload: DocumentStatusInputType;
};


export type MutationCreateDocumentSubscriptionArgs = {
  payload: DocumentSubscriptionInputType;
};


export type MutationCreateDocumentTagArgs = {
  payload: DocumentTagInputType;
};


export type MutationCreateDocumentTemplateArgs = {
  payload: DocumentTemplateInputType;
};


export type MutationCreateDocumentVersionArgs = {
  payload: DocumentVersionInputType;
};


export type MutationCreateGrindBoardArgs = {
  payload: GrindCreateBoardInput;
};


export type MutationCreateGrindErrandArgs = {
  payload: GrindCreateErrandInput;
};


export type MutationCreateGrindErrandDiscussionArgs = {
  payload: GrindCreateErrandDiscussionInput;
};


export type MutationCreateGrindLabelArgs = {
  payload: GrindCreateLabelInput;
};


export type MutationCreateGrindMediaArgs = {
  payload: GrindCreateMediaInput;
};


export type MutationCreateGrindMilestoneArgs = {
  payload: GrindCreateMilestoneInput;
};


export type MutationCreateGrindPosterArgs = {
  payload: GrindCreatePosterInput;
};


export type MutationCreateGrindSchemeArgs = {
  payload: GrindCreateSchemeInput;
};


export type MutationCreateGrindStampArgs = {
  payload: GrindCreateStampInput;
};


export type MutationCreateGroupArgs = {
  payload: GroupInputType;
};


export type MutationCreateHazardArgs = {
  payload: HazardInputType;
};


export type MutationCreateIdentificationArgs = {
  name: Scalars['String']['input'];
};


export type MutationCreateInstrumentArgs = {
  payload: InstrumentInputType;
};


export type MutationCreateInstrumentCaliberationArgs = {
  payload: InstrumentCalibrationInput;
};


export type MutationCreateInstrumentCompetenceArgs = {
  payload: InstrumentCompetenceInput;
};


export type MutationCreateInstrumentTypeArgs = {
  payload: InstrumentTypeInputType;
};


export type MutationCreateLaboratoryInstrumentArgs = {
  payload: LaboratoryInstrumentInputType;
};


export type MutationCreateManufacturerArgs = {
  payload: ManufacturerInputType;
};


export type MutationCreateMethodArgs = {
  payload: MethodInputType;
};


export type MutationCreateNoticeArgs = {
  payload: NoticeInputType;
};


export type MutationCreatePatientArgs = {
  payload: PatientInputType;
};


export type MutationCreateProfileArgs = {
  payload: ProfileInputType;
};


export type MutationCreateProfileMappingArgs = {
  payload: ProfileMappingInputType;
};


export type MutationCreateProvinceArgs = {
  payload: ProvinceInputType;
};


export type MutationCreateQcLevelArgs = {
  level: Scalars['String']['input'];
};


export type MutationCreateQcSetArgs = {
  samples: Array<QcSetInputType>;
};


export type MutationCreateQcTemplateArgs = {
  payload: QcTemplateInputType;
};


export type MutationCreateReferralLaboratoryArgs = {
  payload: ReferralLaboratoryInputType;
};


export type MutationCreateReflexActionArgs = {
  payload: ReflexActionInput;
};


export type MutationCreateReflexBrainArgs = {
  payload: ReflexBrainInput;
};


export type MutationCreateReflexRuleArgs = {
  payload: ReflexRuleInput;
};


export type MutationCreateRejectionReasonArgs = {
  reason: Scalars['String']['input'];
};


export type MutationCreateResultOptionArgs = {
  payload: ResultOptionInputType;
};


export type MutationCreateSampleTypeArgs = {
  payload: SampleTypeInputType;
};


export type MutationCreateSampleTypeMappingArgs = {
  payload: SampleTypeMappingInputType;
};


export type MutationCreateShipmentArgs = {
  payload: ShipmentInputType;
};


export type MutationCreateStockAdjustmentArgs = {
  payload: StockAdjustmentInputType;
};


export type MutationCreateStockCategoryArgs = {
  payload: StockCategoryInputType;
};


export type MutationCreateStockItemArgs = {
  payload: StockItemInputType;
};


export type MutationCreateStockItemVariantArgs = {
  payload: StockItemVariantInputType;
  stockItemUid: Scalars['String']['input'];
};


export type MutationCreateStockOrderArgs = {
  payload: StockOrderInputType;
};


export type MutationCreateStockReceiptArgs = {
  payload: StockReceiptInputType;
};


export type MutationCreateStockUnitArgs = {
  payload: StockUnitInputType;
};


export type MutationCreateStorageContainerArgs = {
  payload: StorageContainerInputType;
};


export type MutationCreateStorageLocationArgs = {
  payload: StorageLocationInputType;
};


export type MutationCreateStorageSectionArgs = {
  payload: StorageSectionInputType;
};


export type MutationCreateStoreRoomArgs = {
  payload: StoreRoomInputType;
};


export type MutationCreateSupplierArgs = {
  payload: SupplierInputType;
};


export type MutationCreateTestBillTransactionArgs = {
  payload: BillTransactionInput;
};


export type MutationCreateUnitArgs = {
  payload: UnitInputType;
};


export type MutationCreateUserArgs = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  groupUid?: InputMaybe<Scalars['String']['input']>;
  lastName: Scalars['String']['input'];
  openReg?: InputMaybe<Scalars['Boolean']['input']>;
  password: Scalars['String']['input'];
  passwordc: Scalars['String']['input'];
  userName: Scalars['String']['input'];
};


export type MutationCreateVoucherArgs = {
  payload: VoucherInput;
};


export type MutationCreateVoucherCodeArgs = {
  payload: VoucherCodeInput;
};


export type MutationCreateWorksheetArgs = {
  analystUid: Scalars['String']['input'];
  count?: InputMaybe<Scalars['Int']['input']>;
  templateUid: Scalars['String']['input'];
};


export type MutationCreateWorksheetTemplateArgs = {
  payload: WorksheetTemplateInputType;
};


export type MutationDeleteClientContactArgs = {
  uid: Scalars['String']['input'];
};


export type MutationDeleteDocumentArgs = {
  uid: Scalars['String']['input'];
};


export type MutationDeleteDocumentCategoryArgs = {
  uid: Scalars['String']['input'];
};


export type MutationDeleteDocumentFolderArgs = {
  uid: Scalars['String']['input'];
};


export type MutationDeleteDocumentRelationArgs = {
  payload: DocumentRelationInputType;
};


export type MutationDeleteDocumentReviewCycleArgs = {
  uid: Scalars['String']['input'];
};


export type MutationDeleteDocumentSubscriptionArgs = {
  uid: Scalars['String']['input'];
};


export type MutationDeleteDocumentTagArgs = {
  uid: Scalars['String']['input'];
};


export type MutationDeleteDocumentTemplateArgs = {
  uid: Scalars['String']['input'];
};


export type MutationDeleteDocumentVersionArgs = {
  uid: Scalars['String']['input'];
};


export type MutationDeleteGrindBoardArgs = {
  uid: Scalars['String']['input'];
};


export type MutationDeleteGrindErrandArgs = {
  uid: Scalars['String']['input'];
};


export type MutationDeleteGrindLabelArgs = {
  uid: Scalars['String']['input'];
};


export type MutationDeleteGrindMediaArgs = {
  uid: Scalars['String']['input'];
};


export type MutationDeleteGrindMilestoneArgs = {
  uid: Scalars['String']['input'];
};


export type MutationDeleteGrindPosterArgs = {
  uid: Scalars['String']['input'];
};


export type MutationDeleteGrindSchemeArgs = {
  uid: Scalars['String']['input'];
};


export type MutationDeleteGrindStampArgs = {
  uid: Scalars['String']['input'];
};


export type MutationDeleteMessageArgs = {
  uid: Scalars['String']['input'];
};


export type MutationDeleteNoticeArgs = {
  uid: Scalars['String']['input'];
};


export type MutationDeleteReflexBrainArgs = {
  uid: Scalars['String']['input'];
};


export type MutationDeleteStockOrderArgs = {
  uid: Scalars['String']['input'];
};


export type MutationDeleteThreadArgs = {
  uid: Scalars['String']['input'];
};


export type MutationDiscardAbxAntibioticArgs = {
  uid: Scalars['String']['input'];
};


export type MutationInvalidateSamplesArgs = {
  samples: Array<Scalars['String']['input']>;
};


export type MutationIssueStockOrderArgs = {
  payload: Array<StockOrderProductLineInputType>;
  uid: Scalars['String']['input'];
};


export type MutationManageAnalysesArgs = {
  payload: ManageAnalysisInputType;
  sampleUid: Scalars['String']['input'];
};


export type MutationPrintSamplesArgs = {
  samples: Array<Scalars['String']['input']>;
};


export type MutationPublishSamplesArgs = {
  samples: Array<SamplePublishInputType>;
};


export type MutationReInstateAnalysisResultsArgs = {
  analyses: Array<Scalars['String']['input']>;
};


export type MutationReInstateSamplesArgs = {
  samples: Array<Scalars['String']['input']>;
};


export type MutationReceiveSamplesArgs = {
  samples: Array<Scalars['String']['input']>;
};


export type MutationRecoverSamplesArgs = {
  sampleUids: Array<Scalars['String']['input']>;
};


export type MutationRefreshArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationRejectSamplesArgs = {
  samples: Array<SampleRejectInputType>;
};


export type MutationRemoveAbxOrganismResultArgs = {
  uid: Scalars['String']['input'];
};


export type MutationReplyMessageArgs = {
  body: Scalars['String']['input'];
  threadUid: Scalars['String']['input'];
};


export type MutationRequestPasswordResetArgs = {
  email: Scalars['String']['input'];
};


export type MutationResetPasswordArgs = {
  password: Scalars['String']['input'];
  passwordc: Scalars['String']['input'];
  userUid: Scalars['String']['input'];
};


export type MutationRetestAnalysisResultsArgs = {
  analyses: Array<Scalars['String']['input']>;
};


export type MutationRetractAnalysisResultsArgs = {
  analyses: Array<Scalars['String']['input']>;
};


export type MutationSamplesApplyTemplateArgs = {
  analysisTemplateUid: Scalars['String']['input'];
  uid: Scalars['String']['input'];
};


export type MutationSaveAbxOrganismResultArgs = {
  organismUid: Scalars['String']['input'];
  uid: Scalars['String']['input'];
};


export type MutationSendMessageArgs = {
  body: Scalars['String']['input'];
  recipients: Array<Scalars['String']['input']>;
};


export type MutationShipmentManageSamplesArgs = {
  payload: ShipmentManageSamplesInput;
  uid: Scalars['String']['input'];
};


export type MutationStoreSamplesArgs = {
  payload: Array<StoreSamplesInputType>;
};


export type MutationSubmitAnalysisResultsArgs = {
  analysisResults: Array<ArResultInputType>;
  sourceObject: Scalars['String']['input'];
  sourceObjectUid: Scalars['String']['input'];
};


export type MutationSubmitStockOrderArgs = {
  uid: Scalars['String']['input'];
};


export type MutationUpdateAbxAntibioticArgs = {
  payload: AbxAntibioticInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateAbxAstPanelArgs = {
  payload: AbxAstPanelInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateAbxAstResultsArgs = {
  payload: AbxAstResultsUpdateInput;
};


export type MutationUpdateAbxBreakpointArgs = {
  payload: AbxBreakpointInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateAbxBreakpointTypeArgs = {
  payload: AbxBreakpointTypeInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateAbxClassArgs = {
  payload: AbxClassInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateAbxExpResPhenotypeArgs = {
  payload: AbxExpResPhenotypeInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateAbxExpertInterpretationRuleArgs = {
  payload: AbxExpertInterpretationRuleInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateAbxFamilyArgs = {
  payload: AbxFamilyInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateAbxGenusArgs = {
  payload: AbxGenusInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateAbxGuidelineArgs = {
  payload: AbxGuidelineInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateAbxHostArgs = {
  payload: AbxHostInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateAbxKingdomArgs = {
  payload: AbxKingdomInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateAbxMediumArgs = {
  payload: AbxMediumInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateAbxOrderArgs = {
  payload: AbxOrderInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateAbxOrganismArgs = {
  payload: AbxOrganismInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateAbxOrganismSerotypeArgs = {
  payload: AbxOrganismSerotypeInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateAbxPhylumArgs = {
  payload: AbxPhylumInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateAbxQcRangeArgs = {
  payload: AbxQcRangeInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateAbxSiteOfInfectionArgs = {
  payload: AbxSiteOfInfectionInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateAbxTestMethodArgs = {
  payload: AbxTestMethodInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateAnalysisArgs = {
  payload: AnalysisInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateAnalysisCategoryArgs = {
  payload: AnalysisCategoryInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateAnalysisCorrectionFactorArgs = {
  payload: AnalysisCorrectionFactorInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateAnalysisDetectionLimitArgs = {
  payload: AnalysisDetectionLimitInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateAnalysisDiscountArgs = {
  payload: PriceDiscountInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateAnalysisInterimArgs = {
  payload: AnalysisInterimInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateAnalysisMappingArgs = {
  payload: AnalysisMappingInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateAnalysisPriceArgs = {
  payload: PriceInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateAnalysisSpecificationArgs = {
  payload: AnalysisSpecificationInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateAnalysisTemplateArgs = {
  payload: AnalysisTemplateInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateAnalysisUncertaintyArgs = {
  payload: AnalysisUncertaintyInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateCaliberationCertificateArgs = {
  payload: CalibrationCertificateInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateClientArgs = {
  payload: ClientInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateClientContactArgs = {
  payload: ClientContactInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateCodingStandardArgs = {
  payload: CodingStandardInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateCountryArgs = {
  payload: CountryInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateDepartmentArgs = {
  payload: DepartmentInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateDistrictArgs = {
  payload: DistrictInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateDocumentArgs = {
  payload: DocumentUpdateInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateDocumentCategoryArgs = {
  payload: DocumentCategoryUpdateInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateDocumentFolderArgs = {
  payload: DocumentFolderUpdateInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateDocumentReviewCycleArgs = {
  payload: DocumentReviewCycleUpdateInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateDocumentReviewStepArgs = {
  payload: DocumentReviewStepUpdateInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateDocumentStatusArgs = {
  payload: DocumentStatusUpdateInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateDocumentSubscriptionArgs = {
  payload: DocumentSubscriptionUpdateInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateDocumentTagArgs = {
  payload: DocumentTagUpdateInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateDocumentTemplateArgs = {
  payload: DocumentTemplateUpdateInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateDocumentVersionArgs = {
  payload: DocumentVersionUpdateInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateGrindBoardArgs = {
  payload: GrindUpdateBoardInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateGrindErrandArgs = {
  payload: GrindUpdateErrandInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateGrindErrandDiscussionArgs = {
  payload: GrindUpdateErrandDiscussionInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateGrindLabelArgs = {
  payload: GrindUpdateLabelInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateGrindMilestoneArgs = {
  payload: GrindUpdateMilestoneInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateGrindPosterArgs = {
  payload: GrindUpdatePosterInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateGrindSchemeArgs = {
  payload: GrindUpdateSchemeInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateGrindStampArgs = {
  payload: GrindUpdateStampInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateGroupArgs = {
  payload: GroupInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateGroupPermissionsArgs = {
  groupUid: Scalars['String']['input'];
  permissionUid: Scalars['String']['input'];
};


export type MutationUpdateHazardArgs = {
  payload: HazardInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateIdentificationArgs = {
  name: Scalars['String']['input'];
  uid: Scalars['String']['input'];
};


export type MutationUpdateInstrumentArgs = {
  payload: InstrumentInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateInstrumentCaliberationArgs = {
  payload: InstrumentInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateInstrumentCompetenceArgs = {
  payload: InstrumentInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateInstrumentTypeArgs = {
  payload: InstrumentTypeInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateLaboratoryArgs = {
  payload: LaboratoryInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateLaboratoryInstrumentArgs = {
  payload: LaboratoryInstrumentInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateLaboratorySettingArgs = {
  payload: LaboratorySettingInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateManufacturerArgs = {
  payload: ManufacturerInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateMethodArgs = {
  payload: MethodInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateNoticeArgs = {
  payload: NoticeInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdatePatientArgs = {
  payload: PatientInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateProfileArgs = {
  payload: ProfileInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateProfileDiscountArgs = {
  payload: PriceDiscountInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateProfileMappingArgs = {
  payload: ProfileMappingInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateProfilePriceArgs = {
  payload: PriceInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateProvinceArgs = {
  payload: ProvinceInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateQcLevelArgs = {
  level: Scalars['String']['input'];
  uid: Scalars['String']['input'];
};


export type MutationUpdateQcTemplateArgs = {
  payload: QcTemplateInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateReferralLaboratoryArgs = {
  payload: ReferralLaboratoryInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateReflexActionArgs = {
  payload: ReflexActionInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateReflexBrainArgs = {
  payload: ReflexBrainInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateReflexRuleArgs = {
  payload: ReflexRuleInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateRejectionReasonArgs = {
  reason: Scalars['String']['input'];
  uid: Scalars['String']['input'];
};


export type MutationUpdateResultOptionArgs = {
  payload: ResultOptionInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateSampleTypeArgs = {
  payload: SampleTypeInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateSampleTypeMappingArgs = {
  payload: SampleTypeMappingInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateShipmentArgs = {
  payload: ShipmentUpdateInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateStockCategoryArgs = {
  payload: StockCategoryInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateStockItemArgs = {
  payload: StockItemInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateStockItemVariantArgs = {
  payload: StockItemVariantInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateStockOrderArgs = {
  payload: StockOrderInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateStockUnitArgs = {
  payload: StockUnitInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateStorageContainerArgs = {
  payload: StorageContainerInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateStorageLocationArgs = {
  payload: StorageLocationInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateStorageSectionArgs = {
  payload: StorageSectionInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateStoreRoomArgs = {
  payload: StoreRoomInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateSupplierArgs = {
  payload: SupplierInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateUnitArgs = {
  payload: UnitInputType;
  uid: Scalars['String']['input'];
};


export type MutationUpdateUserArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  groupUid?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  mobilePhone?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  passwordc?: InputMaybe<Scalars['String']['input']>;
  userUid: Scalars['String']['input'];
};


export type MutationUpdateVoucherArgs = {
  payload: VoucherInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateVoucherCodeArgs = {
  payload: VoucherCodeInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateWorksheetArgs = {
  action?: InputMaybe<Scalars['String']['input']>;
  analystUid?: InputMaybe<Scalars['String']['input']>;
  instrumentUid?: InputMaybe<Scalars['String']['input']>;
  methodUid?: InputMaybe<Scalars['String']['input']>;
  samples?: InputMaybe<Array<Scalars['String']['input']>>;
  worksheetUid: Scalars['String']['input'];
};


export type MutationUpdateWorksheetApplyTemplateArgs = {
  templateUid: Scalars['String']['input'];
  worksheetUid: Scalars['String']['input'];
};


export type MutationUpdateWorksheetManualAssignArgs = {
  analysesUids: Array<Scalars['String']['input']>;
  qcTemplateUid?: InputMaybe<Scalars['String']['input']>;
  uid: Scalars['String']['input'];
};


export type MutationUpdateWorksheetTemplateArgs = {
  payload: WorksheetTemplateInputType;
  uid: Scalars['String']['input'];
};


export type MutationUseAbxAntibioticArgs = {
  uid: Scalars['String']['input'];
};


export type MutationValidatePasswordResetTokenArgs = {
  token: Scalars['String']['input'];
};


export type MutationVerifyAnalysisResultsArgs = {
  analyses: Array<Scalars['String']['input']>;
  sourceObject: Scalars['String']['input'];
  sourceObjectUid: Scalars['String']['input'];
};


export type MutationVerifySamplesArgs = {
  samples: Array<Scalars['String']['input']>;
};


export type MutationViewMessageArgs = {
  uid: Scalars['String']['input'];
};


export type MutationViewNoticeArgs = {
  uid: Scalars['String']['input'];
  viewer: Scalars['String']['input'];
};

export type Nothing = {
  __typename?: 'Nothing';
  data?: Maybe<Scalars['String']['output']>;
};

export type NoticeInputType = {
  body: Scalars['String']['input'];
  departments?: InputMaybe<Array<Scalars['String']['input']>>;
  expiry: Scalars['String']['input'];
  groups?: InputMaybe<Array<Scalars['String']['input']>>;
  title: Scalars['String']['input'];
};

/** Union of possible outcomes when adding a new notice */
export type NoticeResponse = NoticeType | OperationError;

export type NoticeType = {
  __typename?: 'NoticeType';
  body: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  departments?: Maybe<Array<DepartmentType>>;
  expiry: Scalars['String']['output'];
  groups?: Maybe<Array<GroupType>>;
  title: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  viewers?: Maybe<Array<UserType>>;
};

export type NotificationType = {
  __typename?: 'NotificationType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  departments?: Maybe<DepartmentType>;
  groups?: Maybe<GroupType>;
  message: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  users?: Maybe<UserType>;
  viewers?: Maybe<UserType>;
};

export type OperationError = {
  __typename?: 'OperationError';
  error: Scalars['String']['output'];
  suggestion?: Maybe<Scalars['String']['output']>;
};

export type OperationSuccess = {
  __typename?: 'OperationSuccess';
  message: Scalars['String']['output'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type PasswordResetValidityResponse = OperationError | PasswordResetValidityType;

export type PasswordResetValidityType = {
  __typename?: 'PasswordResetValidityType';
  authUid: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type PatientCursorPage = {
  __typename?: 'PatientCursorPage';
  edges?: Maybe<Array<PatientEdge>>;
  items?: Maybe<Array<PatientType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type PatientEdge = {
  __typename?: 'PatientEdge';
  cursor: Scalars['String']['output'];
  node: PatientType;
};

export type PatientIdentificationType = {
  __typename?: 'PatientIdentificationType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  identification?: Maybe<IdentificationType>;
  identificationUid: Scalars['String']['output'];
  patientUid: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  value: Scalars['String']['output'];
};

export type PatientInputType = {
  age?: InputMaybe<Scalars['Int']['input']>;
  ageDobEstimated?: InputMaybe<Scalars['Boolean']['input']>;
  clientPatientId: Scalars['String']['input'];
  clientUid: Scalars['String']['input'];
  consentSms?: InputMaybe<Scalars['Boolean']['input']>;
  countryUid?: InputMaybe<Scalars['String']['input']>;
  dateOfBirth?: InputMaybe<Scalars['DateTime']['input']>;
  districtUid?: InputMaybe<Scalars['String']['input']>;
  firstName: Scalars['String']['input'];
  gender: Scalars['String']['input'];
  identifications?: InputMaybe<Array<PatientidentificationInput>>;
  internalUse?: InputMaybe<Scalars['Boolean']['input']>;
  lastName: Scalars['String']['input'];
  middleName?: InputMaybe<Scalars['String']['input']>;
  phoneHome?: InputMaybe<Scalars['String']['input']>;
  phoneMobile?: InputMaybe<Scalars['String']['input']>;
  provinceUid?: InputMaybe<Scalars['String']['input']>;
};

export type PatientResponse = OperationError | PatientType;

export type PatientType = {
  __typename?: 'PatientType';
  active: Scalars['Boolean']['output'];
  age?: Maybe<Scalars['Int']['output']>;
  ageDobEstimated: Scalars['Boolean']['output'];
  client?: Maybe<ClientType>;
  clientPatientId: Scalars['String']['output'];
  clientUid: Scalars['String']['output'];
  consentSms: Scalars['Boolean']['output'];
  country?: Maybe<CountryType>;
  countryUid?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  dateOfBirth?: Maybe<Scalars['DateTime']['output']>;
  district?: Maybe<DistrictType>;
  districtUid?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<Scalars['String']['output']>;
  identifications?: Maybe<Array<PatientIdentificationType>>;
  internalUse: Scalars['Boolean']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  metadataSnapshot?: Maybe<Scalars['JSONScalar']['output']>;
  middleName?: Maybe<Scalars['String']['output']>;
  patientId: Scalars['String']['output'];
  phoneHome?: Maybe<Scalars['String']['output']>;
  phoneMobile?: Maybe<Scalars['String']['output']>;
  province?: Maybe<ProvinceType>;
  provinceUid?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type PatientidentificationInput = {
  identificationUid: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type PermissionType = {
  __typename?: 'PermissionType';
  action?: Maybe<Scalars['String']['output']>;
  active?: Maybe<Scalars['Boolean']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<PermissionType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  target?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<PermissionType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export enum PosterCategory {
  Engagement = 'ENGAGEMENT',
  Listing = 'LISTING',
  Message = 'MESSAGE',
  Todo = 'TODO'
}

export type PriceDiscountInput = {
  discountType: Scalars['String']['input'];
  endDate: Scalars['DateTime']['input'];
  isActive: Scalars['Boolean']['input'];
  startDate: Scalars['DateTime']['input'];
  valueAmount?: InputMaybe<Scalars['Float']['input']>;
  valuePercent?: InputMaybe<Scalars['Float']['input']>;
  valueType?: InputMaybe<Scalars['String']['input']>;
  voucherUid?: InputMaybe<Scalars['String']['input']>;
};

export type PriceInput = {
  amount: Scalars['Float']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ProcessCounts = {
  __typename?: 'ProcessCounts';
  avgExtraDays?: Maybe<Scalars['Int']['output']>;
  processAverage?: Maybe<Scalars['Int']['output']>;
  service?: Maybe<Scalars['String']['output']>;
  totalLate?: Maybe<Scalars['Int']['output']>;
  totalNotLate?: Maybe<Scalars['Int']['output']>;
  totalSamples?: Maybe<Scalars['Int']['output']>;
};

export type ProcessData = {
  __typename?: 'ProcessData';
  counts?: Maybe<ProcessCounts>;
  groups?: Maybe<Array<ProcessCounts>>;
  process: Scalars['String']['output'];
};

export type ProcessStatistics = {
  __typename?: 'ProcessStatistics';
  data: Array<ProcessData>;
};

export type ProfileDiscountResponse = OperationError | ProfileDiscountType;

export type ProfileDiscountType = {
  __typename?: 'ProfileDiscountType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  discountType: Scalars['String']['output'];
  endDate: Scalars['DateTime']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  profile: ProfileType;
  profileUid: Scalars['String']['output'];
  startDate: Scalars['DateTime']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  valueAmount: Scalars['Float']['output'];
  valuePercent: Scalars['Float']['output'];
  valueType: Scalars['String']['output'];
  voucher?: Maybe<VoucherType>;
  voucherUid?: Maybe<Scalars['String']['output']>;
};

export type ProfileInputType = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  departmentUid?: InputMaybe<Scalars['String']['input']>;
  description?: Scalars['String']['input'];
  keyword?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  sampleTypes?: InputMaybe<Array<Scalars['String']['input']>>;
  services?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type ProfileMappingInputType = {
  code: Scalars['String']['input'];
  codingStandardUid: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  profileUid: Scalars['String']['input'];
};

/** Union of possible outcomes when adding a new notice */
export type ProfileMappingResponse = OperationError | ProfileMappingType;

export type ProfileMappingType = {
  __typename?: 'ProfileMappingType';
  code: Scalars['String']['output'];
  codingStandard?: Maybe<CodingStandardType>;
  codingStandardUid: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  profile?: Maybe<ProfileType>;
  profileUid: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type ProfilePriceResponse = OperationError | ProfilePriceType;

export type ProfilePriceType = {
  __typename?: 'ProfilePriceType';
  amount: Scalars['Float']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  profile: ProfileType;
  profileUid: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type ProfileType = {
  __typename?: 'ProfileType';
  active: Scalars['Boolean']['output'];
  analyses?: Maybe<Array<AnalysisType>>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  department?: Maybe<DepartmentType>;
  departmentUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  keyword?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  sampleTypes?: Maybe<Array<SampleTypeTyp>>;
  tatLengthMinutes?: Maybe<Scalars['Int']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type ProfilesServiceResponse = AnalysisWithProfiles | OperationError;

export type ProvinceCursorPage = {
  __typename?: 'ProvinceCursorPage';
  edges?: Maybe<Array<ProvinceEdge>>;
  items?: Maybe<Array<ProvinceType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ProvinceEdge = {
  __typename?: 'ProvinceEdge';
  cursor: Scalars['String']['output'];
  node: ProvinceType;
};

export type ProvinceInputType = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  businessPhone?: InputMaybe<Scalars['String']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  countryUid?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  emailCc?: InputMaybe<Scalars['String']['input']>;
  mobilePhone?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type ProvinceResponse = OperationError | ProvinceType;

export type ProvinceType = {
  __typename?: 'ProvinceType';
  active?: Maybe<Scalars['Boolean']['output']>;
  businessPhone?: Maybe<Scalars['String']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  country?: Maybe<CountryType>;
  countryUid?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  emailCc?: Maybe<Scalars['String']['output']>;
  mobilePhone?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type QcLevelResponse = OperationError | QcLevelType;

export type QcLevelType = {
  __typename?: 'QCLevelType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  level: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type QcSetCursorPage = {
  __typename?: 'QCSetCursorPage';
  edges?: Maybe<Array<QcSetEdge>>;
  items?: Maybe<Array<QcSetWithSamples>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type QcSetEdge = {
  __typename?: 'QCSetEdge';
  cursor: Scalars['String']['output'];
  node: QcSetWithSamples;
};

export type QcSetInputType = {
  analysisProfiles: Array<Scalars['String']['input']>;
  analysisServices: Array<Scalars['String']['input']>;
  qcLevels: Array<Scalars['String']['input']>;
  qcTemplateUid?: InputMaybe<Scalars['String']['input']>;
};

export type QcSetResponse = CreateQcSetData | OperationError;

export type QcSetType = {
  __typename?: 'QCSetType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  note: Scalars['String']['output'];
  status: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type QcSetWithSamples = {
  __typename?: 'QCSetWithSamples';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  note: Scalars['String']['output'];
  samples?: Maybe<Array<SamplesWithResults>>;
  status: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type QcTemplateInputType = {
  departments?: InputMaybe<Array<Scalars['String']['input']>>;
  description?: Scalars['String']['input'];
  levels?: InputMaybe<Array<Scalars['String']['input']>>;
  name: Scalars['String']['input'];
};

export type QcTemplateResponse = OperationError | QcTemplateType;

export type QcTemplateType = {
  __typename?: 'QCTemplateType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  departments: Array<DepartmentType>;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  qcLevels: Array<QcLevelType>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  abxAntibioticAll: AbxAntibioticCursorPage;
  abxAntibioticByUid?: Maybe<AbxAntibioticType>;
  abxAstPanelAll?: Maybe<Array<AbxAstPanelType>>;
  abxAstPanelByUid?: Maybe<AbxAstPanelType>;
  abxAstPanelFilter?: Maybe<Array<AbxAstPanelType>>;
  abxAstResultAll?: Maybe<Array<AbxAstResultType>>;
  abxBreakpointAll: AbxBreakpointTypCursorPage;
  abxBreakpointByUid?: Maybe<AbxBreakpointTyp>;
  abxBreakpointTypeAll?: Maybe<Array<AbxBreakpointTypeTyp>>;
  abxBreakpointTypeByUid?: Maybe<AbxBreakpointTypeTyp>;
  abxClassAll?: Maybe<Array<AbxClassType>>;
  abxClassByUid?: Maybe<AbxClassType>;
  abxExpectedResistancePhenotypeAll: AbxExpResPhenotypeCursorPage;
  abxExpectedResistancePhenotypeByUid?: Maybe<AbxExpResPhenotypeType>;
  abxExpertInterpretationRuleAll: AbxExpertInterpretationRuleCursorPage;
  abxExpertInterpretationRuleByUid?: Maybe<AbxExpertInterpretationRuleType>;
  abxFamilyAll?: Maybe<Array<AbxFamilyType>>;
  abxFamilyByUid?: Maybe<AbxFamilyType>;
  abxGenusAll?: Maybe<Array<AbxGenusType>>;
  abxGenusByUid?: Maybe<AbxGenusType>;
  abxGuidelineByUid?: Maybe<AbxGuidelineType>;
  abxGuidelineYearAll?: Maybe<Array<AbxGuidelineYearType>>;
  abxGuidelinesAll?: Maybe<Array<AbxGuidelineType>>;
  abxHostAll?: Maybe<Array<AbxHostType>>;
  abxHostByUid?: Maybe<AbxHostType>;
  abxKingdomAll?: Maybe<Array<AbxKingdomType>>;
  abxKingdomByUid?: Maybe<AbxKingdomType>;
  abxLaboratoryAntibiotics?: Maybe<Array<AbxAntibioticType>>;
  abxMediumAll?: Maybe<Array<AbxMediumType>>;
  abxMediumByUid?: Maybe<AbxMediumType>;
  abxOrderAll?: Maybe<Array<AbxOrderType>>;
  abxOrderByUid?: Maybe<AbxOrderType>;
  abxOrganismAll: AbxOrganismCursorPage;
  abxOrganismByUid?: Maybe<AbxOrganismType>;
  abxOrganismResultAll?: Maybe<Array<AbxOrganismResultType>>;
  abxOrganismSerotypeAll: AbxOrganismSerotypeCursorPage;
  abxOrganismSerotypeByUid?: Maybe<AbxOrganismSerotypeType>;
  abxPhylumAll?: Maybe<Array<AbxPhylumType>>;
  abxPhylumByUid?: Maybe<AbxPhylumType>;
  abxQcRangeAll: AbxQcRangeCursorPage;
  abxQcRangeByUid?: Maybe<AbxQcRangeType>;
  abxSiteOfInfectionAll?: Maybe<Array<AbxSiteOfInfectionType>>;
  abxSiteOfInfectionByUid?: Maybe<AbxSiteOfInfectionType>;
  abxTestMethodAll?: Maybe<Array<AbxTestMethodType>>;
  abxTestMethodByUid?: Maybe<AbxTestMethodType>;
  analysisAll: AnalysisCursorPage;
  analysisByUid: AnalysisType;
  analysisCategoryAll: Array<AnalysisCategoryType>;
  analysisCategoryByUid: AnalysisCategoryType;
  analysisCorrectionFactorAll: Array<AnalysisCorrectionFactorType>;
  analysisCorrectionFactorByUid: AnalysisCorrectionFactorType;
  analysisDetectionLimitAll: Array<AnalysisDetectionLimitType>;
  analysisDetectionLimitByUid: AnalysisDetectionLimitType;
  analysisInterimAll: Array<AnalysisInterimType>;
  analysisInterimByUid: AnalysisInterimType;
  analysisMappingsByAnalysis: Array<AnalysisMappingType>;
  analysisProcessPerformance: ProcessStatistics;
  analysisRequestAll: AnalysisRequestCursorPage;
  analysisRequestByUid: AnalysisRequestWithSamples;
  analysisRequestsByClientUid: Array<AnalysisRequestWithSamples>;
  analysisRequestsByPatientUid: Array<AnalysisRequestWithSamples>;
  analysisResultBySampleUid: Array<AnalysisResultType>;
  analysisResultByUid: AnalysisResultType;
  analysisResultsForWsAssign: AnalysisResultCursorPage;
  analysisSpecificationAll: Array<AnalysisSpecificationType>;
  analysisSpecificationUid: AnalysisSpecificationType;
  analysisTemplateAll: Array<AnalysisTemplateType>;
  analysisTemplateByUid: AnalysisTemplateType;
  analysisUncertaintyAll: Array<AnalysisUncertaintyType>;
  analysisUncertaintyByUid: AnalysisUncertaintyType;
  analysisWithoutProfile: Array<AnalysisType>;
  auditLogsFilter?: Maybe<Array<AuditLogType>>;
  barcodeSamples?: Maybe<Array<Scalars['BytesScalar']['output']>>;
  billByUid?: Maybe<TestBillType>;
  billInvoice?: Maybe<TestBillInvoiceType>;
  billInvoiceCreate?: Maybe<Scalars['BytesScalar']['output']>;
  billInvoices?: Maybe<Array<TestBillInvoiceType>>;
  billTransactions?: Maybe<Array<TestBillTransactionType>>;
  bills: TestBillCursorPage;
  billsForClient?: Maybe<Array<TestBillType>>;
  billsForPatient?: Maybe<Array<TestBillType>>;
  clientAll: ClientCursorPage;
  clientByCode: ClientType;
  clientByUid: ClientType;
  clientContactAll: Array<ClientContactType>;
  clientContactByClientUid: Array<ClientContactType>;
  clientContactUid: ClientContactType;
  clientSearch: Array<ClientType>;
  clientsByName: Array<ClientType>;
  codingStandardAll: Array<CodingStandardType>;
  countAnalyteGroupByInstrument: GroupedCounts;
  countAnalyteGroupByStatus: GroupedCounts;
  countExtrasGroupByStatus: GroupedCounts;
  countSampleGroupByAction: GroupedData;
  countSampleGroupByStatus: GroupedCounts;
  countWorksheetGroupByStatus: GroupedCounts;
  countryAll: Array<CountryType>;
  countryByUid: CountryType;
  departmentAll: Array<DepartmentType>;
  departmentByUid: DepartmentType;
  discountForAnalysis?: Maybe<AnalysisDiscountType>;
  discountForProfile?: Maybe<ProfileDiscountType>;
  districtAll: DistrictCursorPage;
  districtByUid: DistrictType;
  districtsByProvinceUid: Array<DistrictType>;
  documentAll: DocumentCursorPage;
  documentAuditAll: DocumentAuditCursorPage;
  documentAuditByUid?: Maybe<DocumentAuditType>;
  documentAuditsByDocument: Array<DocumentAuditType>;
  documentByDocumentId?: Maybe<DocumentType>;
  documentByUid?: Maybe<DocumentType>;
  documentCategoryByUid?: Maybe<DocumentCategoryType>;
  documentFolderAll: DocumentFolderCursorPage;
  documentFolderByUid?: Maybe<DocumentFolderType>;
  documentReviewCycleAll: DocumentReviewCycleCursorPage;
  documentReviewCycleByUid?: Maybe<DocumentReviewCycleType>;
  documentReviewCyclesByDocument: Array<DocumentReviewCycleType>;
  documentReviewStepAll: DocumentReviewStepCursorPage;
  documentReviewStepByUid?: Maybe<DocumentReviewStepType>;
  documentReviewStepsByCycle: Array<DocumentReviewStepType>;
  documentReviewStepsByReviewer: Array<DocumentReviewStepType>;
  documentRootFolders: Array<DocumentFolderType>;
  documentStatusAll: DocumentStatusCursorPage;
  documentStatusByUid?: Maybe<DocumentStatusType>;
  documentStatusesByDocument: Array<DocumentStatusType>;
  documentSubscriptionAll: DocumentSubscriptionCursorPage;
  documentSubscriptionByUid?: Maybe<DocumentSubscriptionType>;
  documentSubscriptionsByDocument: Array<DocumentSubscriptionType>;
  documentSubscriptionsByUser: Array<DocumentSubscriptionType>;
  documentTagAll: DocumentTagCursorPage;
  documentTagByUid?: Maybe<DocumentTagType>;
  documentTemplateAll: DocumentTemplateCursorPage;
  documentTemplateByUid?: Maybe<DocumentTemplateType>;
  documentVersionAll: DocumentVersionCursorPage;
  documentVersionByUid?: Maybe<DocumentVersionType>;
  documentVersionsByDocument: Array<DocumentVersionType>;
  downloadGrindMediaFile: FileResponseType;
  downloadGrindMediaFileUrl: FileUrlResponseType;
  grindBoardAll: GrindBoardCursorPage;
  grindBoardByUid?: Maybe<GrindBoardType>;
  grindBoardsByScheme: Array<GrindBoardType>;
  grindErrandAll: GrindErrandCursorPage;
  grindErrandByUid?: Maybe<GrindErrandType>;
  grindErrandDiscussions: Array<GrindErrandDiscussionType>;
  grindErrandDiscussionsByParent: Array<GrindErrandDiscussionType>;
  grindErrandsByAssignee: Array<GrindErrandType>;
  grindErrandsByPoster: Array<GrindErrandType>;
  grindLabelAll: GrindLabelCursorPage;
  grindLabelByUid?: Maybe<GrindLabelType>;
  grindLabelsByCategory: Array<GrindLabelType>;
  grindMediaAll: GrindMediaCursorPage;
  grindMediaByTarget: Array<GrindMediaType>;
  grindMediaByUid?: Maybe<GrindMediaType>;
  grindMilestoneAll: GrindMilestoneCursorPage;
  grindMilestoneByUid?: Maybe<GrindMilestoneType>;
  grindMilestonesByAssignee: Array<GrindMilestoneType>;
  grindMilestonesByErrand: Array<GrindMilestoneType>;
  grindOccurrenceAll: GrindOccurrenceCursorPage;
  grindOccurrenceByUid?: Maybe<GrindOccurrenceType>;
  grindOccurrencesByActor: Array<GrindOccurrenceType>;
  grindOccurrencesByTarget: Array<GrindOccurrenceType>;
  grindPosterAll: GrindPosterCursorPage;
  grindPosterByUid?: Maybe<GrindPosterType>;
  grindPostersByBoard: Array<GrindPosterType>;
  grindSchemeAll: GrindSchemeCursorPage;
  grindSchemeByUid?: Maybe<GrindSchemeType>;
  grindStampAll: GrindStampCursorPage;
  grindStampByCategory: Array<GrindStampType>;
  grindStampByUid?: Maybe<GrindStampType>;
  groupAll: Array<GroupType>;
  groupByUid?: Maybe<GroupType>;
  hazardAll: Array<HazardType>;
  hazardByUid?: Maybe<HazardType>;
  identificationAll: Array<IdentificationType>;
  identificationByUid: IdentificationType;
  impressReportDownload?: Maybe<Scalars['BytesScalar']['output']>;
  impressReportsDownload?: Maybe<Scalars['BytesScalar']['output']>;
  impressReportsMeta: Array<ReportImpressType>;
  instrumentAll: InstrumentCursorPage;
  instrumentByUid: InstrumentType;
  instrumentTypeAll: InstrumentTypeCursorPage;
  instrumentTypeByUid: InstrumentTypeType;
  laboratory: LaboratoryType;
  laboratoryInstrumentAll: LaboratoryInstrumentCursorPage;
  laboratoryInstrumentByUid: LaboratoryInstrumentType;
  laboratorySetting: LaboratorySettingType;
  manifestReportDownload?: Maybe<Scalars['BytesScalar']['output']>;
  manufacturerAll: Array<ManufacturerType>;
  manufacturerByUid: ManufacturerType;
  methodAll: MethodCursorPage;
  methodByUid: MethodType;
  noticeByUid?: Maybe<NoticeType>;
  noticeFilter: Array<NoticeType>;
  noticesByCreator?: Maybe<Array<NoticeType>>;
  notificationByUid?: Maybe<NotificationType>;
  notificationFilter: Array<NotificationType>;
  patientAll: PatientCursorPage;
  patientByPatientId?: Maybe<PatientType>;
  patientByUid?: Maybe<PatientType>;
  patientSearch: Array<PatientType>;
  permissionAll: Array<PermissionType>;
  permissionByUid?: Maybe<PermissionType>;
  priceForAnalysis?: Maybe<AnalysisPriceType>;
  priceForProfile?: Maybe<ProfilePriceType>;
  profileAll: Array<ProfileType>;
  profileByUid: ProfileType;
  profileMappingsByProfile: Array<ProfileMappingType>;
  provinceAll: ProvinceCursorPage;
  provinceByUid: ProvinceType;
  provincesByCountryUid: Array<ProvinceType>;
  qcChartData: Array<AnalysisResultType>;
  qcLevelAll: Array<QcLevelType>;
  qcLevelByUid: QcLevelType;
  qcSetAll: QcSetCursorPage;
  qcSetByUid: QcSetWithSamples;
  qcTemplateAll: Array<QcTemplateType>;
  qcTemplateByUid: QcTemplateType;
  referralLaboratoryAll: Array<ReferralLaboratoryType>;
  referralLaboratoryByCode: ReferralLaboratoryType;
  referralLaboratoryByUid: ReferralLaboratoryType;
  reflexRuleAll: ReflexRuleCursorPage;
  reflexRuleByUid?: Maybe<ReflexRuleType>;
  rejectionReasonByUid: RejectionReasonType;
  rejectionReasonsAll: Array<RejectionReasonType>;
  resultMutationByResultUid?: Maybe<ResultMutationType>;
  resultOptionsByAnalysisUid: ResultOptionType;
  sampleAll: SampleCursorPage;
  sampleByParentId: Array<SampleType>;
  sampleByUid: SampleType;
  sampleCount: Scalars['Int']['output'];
  sampleLaggards: LaggardStatistics;
  sampleProcessPerformance: ProcessStatistics;
  sampleSearch: Array<SampleType>;
  sampleTypeAll: Array<SampleTypeTyp>;
  sampleTypeByUid: SampleTypeTyp;
  sampleTypeMappingsBySampleType: Array<SampleTypeMappingType>;
  samplesByStorageContainerUid: Array<SampleType>;
  samplesByUids: Array<SamplesWithResults>;
  samplesForShipmentAssign: SampleCursorPage;
  shipmentAll: ShipmentCursorPage;
  shipmentById: ShipmentType;
  shipmentByStatus: Array<ShipmentType>;
  shipmentByUid: ShipmentType;
  stockAdjustmentAll: StockAdjustmentCursorPage;
  stockAdjustmentByUid?: Maybe<StockAdjustmentType>;
  stockCategoryAll: Array<StockCategoryType>;
  stockCategoryByUid?: Maybe<StockCategoryType>;
  stockItemAll: StockItemCursorPage;
  stockItemByUid?: Maybe<StockItemType>;
  stockItemVariants: Array<StockItemVariantType>;
  stockLots: Array<StockLotType>;
  stockOrderAll: StockOrderCursorPage;
  stockOrderByUid?: Maybe<StockOrderType>;
  stockOrderProductAll: Array<StockOrderProductType>;
  stockOrderProductByUid?: Maybe<StockOrderProductType>;
  stockProductAll: StockItemVariantCursorPage;
  stockProductByUid?: Maybe<StockItemVariantType>;
  stockProductInventory: Array<StockProductInventoryType>;
  stockReceipt: Array<StockReceiptType>;
  stockUnitAll: Array<StockUnitType>;
  stockUnitByUid?: Maybe<StockUnitType>;
  storageContainerByUid?: Maybe<StorageContainerType>;
  storageContainers: Array<StorageContainerType>;
  storageLocationByUid?: Maybe<StorageLocationType>;
  storageLocations: Array<StorageLocationType>;
  storageSectionByUid?: Maybe<StorageSectionType>;
  storageSections: Array<StorageSectionType>;
  storeRoomAll: Array<StoreRoomType>;
  storeRoomByUid?: Maybe<StoreRoomType>;
  supplierAll: Array<SupplierType>;
  supplierByUid: SupplierType;
  threadByUid?: Maybe<MessageThreadType>;
  threadsForUser?: Maybe<Array<MessageThreadType>>;
  unitAll: Array<UnitType>;
  unitByUid: UnitType;
  userAll: UserCursorPage;
  userByEmail?: Maybe<UserType>;
  userMe?: Maybe<UserType>;
  voucherAll?: Maybe<Array<VoucherType>>;
  voucherByUid?: Maybe<VoucherType>;
  voucherCodes?: Maybe<Array<VoucherCodeType>>;
  worksheetAll: WorkSheetCursorPage;
  worksheetByAnalyst: Array<WorkSheetType>;
  worksheetById: WorkSheetType;
  worksheetByStatus: Array<WorkSheetType>;
  worksheetByUid: WorkSheetType;
  worksheetTemplateAll: Array<WorkSheetTemplateType>;
  worksheetTemplateByUid: Array<WorkSheetType>;
};


export type QueryAbxAntibioticAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text: Scalars['String']['input'];
};


export type QueryAbxAntibioticByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAbxAstPanelByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAbxAstPanelFilterArgs = {
  organismUid: Scalars['String']['input'];
  text?: Scalars['String']['input'];
};


export type QueryAbxAstResultAllArgs = {
  sampleUid: Scalars['String']['input'];
};


export type QueryAbxBreakpointAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text: Scalars['String']['input'];
};


export type QueryAbxBreakpointByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAbxBreakpointTypeByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAbxClassByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAbxExpectedResistancePhenotypeAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text: Scalars['String']['input'];
};


export type QueryAbxExpectedResistancePhenotypeByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAbxExpertInterpretationRuleAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text: Scalars['String']['input'];
};


export type QueryAbxExpertInterpretationRuleByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAbxFamilyByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAbxGenusByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAbxGuidelineByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAbxHostByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAbxKingdomByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAbxMediumByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAbxOrderByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAbxOrganismAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text: Scalars['String']['input'];
};


export type QueryAbxOrganismByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAbxOrganismResultAllArgs = {
  analysisResultUid: Scalars['String']['input'];
};


export type QueryAbxOrganismSerotypeAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text: Scalars['String']['input'];
};


export type QueryAbxOrganismSerotypeByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAbxPhylumByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAbxQcRangeAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text: Scalars['String']['input'];
};


export type QueryAbxQcRangeByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAbxSiteOfInfectionByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAbxTestMethodByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAnalysisAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  qcOnly?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryAnalysisByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAnalysisCategoryByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAnalysisCorrectionFactorByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAnalysisDetectionLimitByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAnalysisInterimByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAnalysisMappingsByAnalysisArgs = {
  analysisUid: Scalars['String']['input'];
};


export type QueryAnalysisProcessPerformanceArgs = {
  endDate: Scalars['String']['input'];
  process: Scalars['String']['input'];
  startDate: Scalars['String']['input'];
};


export type QueryAnalysisRequestAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryAnalysisRequestByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAnalysisRequestsByClientUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAnalysisRequestsByPatientUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAnalysisResultBySampleUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAnalysisResultByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAnalysisResultsForWsAssignArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  analysisUid?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sampleTypeUid?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryAnalysisSpecificationUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAnalysisTemplateByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAnalysisUncertaintyByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAuditLogsFilterArgs = {
  targetType: Scalars['String']['input'];
  targetUid: Scalars['String']['input'];
};


export type QueryBarcodeSamplesArgs = {
  sampleUids: Array<Scalars['String']['input']>;
};


export type QueryBillByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryBillInvoiceArgs = {
  invoiceUid: Scalars['String']['input'];
};


export type QueryBillInvoiceCreateArgs = {
  billUid: Scalars['String']['input'];
};


export type QueryBillInvoicesArgs = {
  billUid: Scalars['String']['input'];
};


export type QueryBillTransactionsArgs = {
  billUid: Scalars['String']['input'];
};


export type QueryBillsArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  clientUid?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  partial?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryBillsForClientArgs = {
  clientUid: Scalars['String']['input'];
};


export type QueryBillsForPatientArgs = {
  patientUid: Scalars['String']['input'];
};


export type QueryClientAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryClientByCodeArgs = {
  code: Scalars['String']['input'];
};


export type QueryClientByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryClientContactByClientUidArgs = {
  clientUid: Scalars['String']['input'];
};


export type QueryClientContactUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryClientSearchArgs = {
  queryString: Scalars['String']['input'];
};


export type QueryClientsByNameArgs = {
  name: Scalars['String']['input'];
};


export type QueryCountAnalyteGroupByInstrumentArgs = {
  endDate?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCountSampleGroupByActionArgs = {
  endDate?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCountryByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryDepartmentByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryDiscountForAnalysisArgs = {
  analysisUid: Scalars['String']['input'];
};


export type QueryDiscountForProfileArgs = {
  profileUid: Scalars['String']['input'];
};


export type QueryDistrictAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryDistrictByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryDistrictsByProvinceUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryDocumentAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  authorUid?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  categoryUid?: InputMaybe<Scalars['String']['input']>;
  departmentUid?: InputMaybe<Scalars['String']['input']>;
  folderUid?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  readerUid?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  status?: InputMaybe<Scalars['String']['input']>;
  tagUid?: InputMaybe<Scalars['String']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryDocumentAuditAllArgs = {
  action?: InputMaybe<Scalars['String']['input']>;
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  documentUid?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  userUid?: InputMaybe<Scalars['String']['input']>;
};


export type QueryDocumentAuditByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryDocumentAuditsByDocumentArgs = {
  documentUid: Scalars['String']['input'];
};


export type QueryDocumentByDocumentIdArgs = {
  documentId: Scalars['String']['input'];
};


export type QueryDocumentByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryDocumentCategoryByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryDocumentFolderAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  parentUid?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryDocumentFolderByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryDocumentReviewCycleAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  documentUid?: InputMaybe<Scalars['String']['input']>;
  initiatedByUid?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryDocumentReviewCycleByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryDocumentReviewCyclesByDocumentArgs = {
  documentUid: Scalars['String']['input'];
};


export type QueryDocumentReviewStepAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  reviewCycleUid?: InputMaybe<Scalars['String']['input']>;
  reviewerUid?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryDocumentReviewStepByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryDocumentReviewStepsByCycleArgs = {
  reviewCycleUid: Scalars['String']['input'];
};


export type QueryDocumentReviewStepsByReviewerArgs = {
  reviewerUid: Scalars['String']['input'];
};


export type QueryDocumentStatusAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  documentUid?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryDocumentStatusByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryDocumentStatusesByDocumentArgs = {
  documentUid: Scalars['String']['input'];
};


export type QueryDocumentSubscriptionAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  documentUid?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  subscriptionType?: InputMaybe<Scalars['String']['input']>;
  userUid?: InputMaybe<Scalars['String']['input']>;
};


export type QueryDocumentSubscriptionByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryDocumentSubscriptionsByDocumentArgs = {
  documentUid: Scalars['String']['input'];
};


export type QueryDocumentSubscriptionsByUserArgs = {
  userUid: Scalars['String']['input'];
};


export type QueryDocumentTagAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryDocumentTagByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryDocumentTemplateAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  categoryUid?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryDocumentTemplateByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryDocumentVersionAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  documentUid?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryDocumentVersionByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryDocumentVersionsByDocumentArgs = {
  documentUid: Scalars['String']['input'];
};


export type QueryDownloadGrindMediaFileArgs = {
  uid: Scalars['String']['input'];
};


export type QueryDownloadGrindMediaFileUrlArgs = {
  uid: Scalars['String']['input'];
};


export type QueryGrindBoardAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  schemeUid?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGrindBoardByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryGrindBoardsBySchemeArgs = {
  schemeUid: Scalars['String']['input'];
};


export type QueryGrindErrandAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  assigneeUid?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  posterUid?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<Scalars['String']['input']>;
  reporterUid?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGrindErrandByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryGrindErrandDiscussionsArgs = {
  errandUid: Scalars['String']['input'];
};


export type QueryGrindErrandDiscussionsByParentArgs = {
  parentUid: Scalars['String']['input'];
};


export type QueryGrindErrandsByAssigneeArgs = {
  assigneeUid: Scalars['String']['input'];
};


export type QueryGrindErrandsByPosterArgs = {
  posterUid: Scalars['String']['input'];
};


export type QueryGrindLabelAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGrindLabelByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryGrindLabelsByCategoryArgs = {
  category: Scalars['String']['input'];
};


export type QueryGrindMediaAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  target?: InputMaybe<Scalars['String']['input']>;
  targetUid?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGrindMediaByTargetArgs = {
  target: Scalars['String']['input'];
  targetUid: Scalars['String']['input'];
};


export type QueryGrindMediaByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryGrindMilestoneAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  assigneeUid?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  complete?: InputMaybe<Scalars['Boolean']['input']>;
  errandUid?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGrindMilestoneByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryGrindMilestonesByAssigneeArgs = {
  assigneeUid: Scalars['String']['input'];
};


export type QueryGrindMilestonesByErrandArgs = {
  errandUid: Scalars['String']['input'];
};


export type QueryGrindOccurrenceAllArgs = {
  actorUid?: InputMaybe<Scalars['String']['input']>;
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  target?: InputMaybe<Scalars['String']['input']>;
  targetUid?: InputMaybe<Scalars['String']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGrindOccurrenceByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryGrindOccurrencesByActorArgs = {
  actorUid: Scalars['String']['input'];
};


export type QueryGrindOccurrencesByTargetArgs = {
  target: Scalars['String']['input'];
  targetUid: Scalars['String']['input'];
};


export type QueryGrindPosterAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  boardUid?: InputMaybe<Scalars['String']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  status?: InputMaybe<Scalars['String']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGrindPosterByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryGrindPostersByBoardArgs = {
  boardUid: Scalars['String']['input'];
};


export type QueryGrindSchemeAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGrindSchemeByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryGrindStampAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGrindStampByCategoryArgs = {
  category: StampCategory;
};


export type QueryGrindStampByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryGroupByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryHazardByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryIdentificationByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryImpressReportDownloadArgs = {
  uid: Scalars['String']['input'];
};


export type QueryImpressReportsDownloadArgs = {
  sampleIds: Array<Scalars['String']['input']>;
};


export type QueryImpressReportsMetaArgs = {
  uids: Array<Scalars['String']['input']>;
};


export type QueryInstrumentAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryInstrumentByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryInstrumentTypeAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryInstrumentTypeByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryLaboratoryArgs = {
  setupName: Scalars['String']['input'];
};


export type QueryLaboratoryInstrumentAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryLaboratoryInstrumentByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryLaboratorySettingArgs = {
  setupName: Scalars['String']['input'];
};


export type QueryManifestReportDownloadArgs = {
  uid: Scalars['String']['input'];
};


export type QueryManufacturerByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryMethodAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryMethodByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryNoticeByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryNoticeFilterArgs = {
  departmentUid?: InputMaybe<Scalars['String']['input']>;
  groupUid?: InputMaybe<Scalars['String']['input']>;
};


export type QueryNoticesByCreatorArgs = {
  uid: Scalars['String']['input'];
};


export type QueryNotificationByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryNotificationFilterArgs = {
  departmentUid?: InputMaybe<Scalars['String']['input']>;
  groupUid?: InputMaybe<Scalars['String']['input']>;
  userUid?: InputMaybe<Scalars['String']['input']>;
};


export type QueryPatientAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryPatientByPatientIdArgs = {
  patientId: Scalars['String']['input'];
};


export type QueryPatientByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryPatientSearchArgs = {
  queryString: Scalars['String']['input'];
};


export type QueryPermissionByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryPriceForAnalysisArgs = {
  analysisUid: Scalars['String']['input'];
};


export type QueryPriceForProfileArgs = {
  profileUid: Scalars['String']['input'];
};


export type QueryProfileByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryProfileMappingsByProfileArgs = {
  profileUid: Scalars['String']['input'];
};


export type QueryProvinceAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryProvinceByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryProvincesByCountryUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryQcChartDataArgs = {
  analyses: Array<Scalars['String']['input']>;
  month: Scalars['Int']['input'];
  year: Scalars['Int']['input'];
};


export type QueryQcLevelByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryQcSetAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: Array<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryQcSetByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryQcTemplateByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryReferralLaboratoryByCodeArgs = {
  code: Scalars['String']['input'];
};


export type QueryReferralLaboratoryByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryReflexRuleAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryReflexRuleByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryRejectionReasonByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryResultMutationByResultUidArgs = {
  resultUid: Scalars['String']['input'];
};


export type QueryResultOptionsByAnalysisUidArgs = {
  uid: Scalars['String']['input'];
};


export type QuerySampleAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  clientUid?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  status?: InputMaybe<Scalars['String']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySampleByParentIdArgs = {
  parentId: Scalars['String']['input'];
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySampleByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QuerySampleCountArgs = {
  clientUid: Scalars['String']['input'];
  status: Scalars['String']['input'];
  text: Scalars['String']['input'];
};


export type QuerySampleProcessPerformanceArgs = {
  endDate: Scalars['String']['input'];
  startDate: Scalars['String']['input'];
};


export type QuerySampleSearchArgs = {
  clientUid: Scalars['String']['input'];
  status: Scalars['String']['input'];
  text: Scalars['String']['input'];
};


export type QuerySampleTypeByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QuerySampleTypeMappingsBySampleTypeArgs = {
  sampleTypeUid: Scalars['String']['input'];
};


export type QuerySamplesByStorageContainerUidArgs = {
  uid: Scalars['String']['input'];
};


export type QuerySamplesByUidsArgs = {
  sampleUids: Array<Scalars['String']['input']>;
};


export type QuerySamplesForShipmentAssignArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  analysisUid?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sampleTypeUid?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryShipmentAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  incoming?: Scalars['Boolean']['input'];
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  status?: InputMaybe<Scalars['String']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryShipmentByIdArgs = {
  shipmentId: Scalars['String']['input'];
};


export type QueryShipmentByStatusArgs = {
  shipmentStatus: Scalars['String']['input'];
};


export type QueryShipmentByUidArgs = {
  shipmentUid: Scalars['String']['input'];
};


export type QueryStockAdjustmentAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  productUid?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryStockAdjustmentByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryStockCategoryByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryStockItemAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryStockItemByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryStockItemVariantsArgs = {
  stockItemUid: Scalars['String']['input'];
};


export type QueryStockLotsArgs = {
  productUid: Scalars['String']['input'];
};


export type QueryStockOrderAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  status?: InputMaybe<Scalars['String']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryStockOrderByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryStockOrderProductAllArgs = {
  stockOrderUid: Scalars['String']['input'];
};


export type QueryStockOrderProductByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryStockProductAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryStockProductByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryStockProductInventoryArgs = {
  productUid: Scalars['String']['input'];
  stockLotUid: Scalars['String']['input'];
};


export type QueryStockReceiptArgs = {
  productUid: Scalars['String']['input'];
  stockLotUid: Scalars['String']['input'];
};


export type QueryStockUnitByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryStorageContainerByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryStorageContainersArgs = {
  storageSectionUid: Scalars['String']['input'];
};


export type QueryStorageLocationByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryStorageLocationsArgs = {
  storeRoomUid: Scalars['String']['input'];
};


export type QueryStorageSectionByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryStorageSectionsArgs = {
  storageLocationUid: Scalars['String']['input'];
};


export type QueryStoreRoomByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QuerySupplierByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryThreadByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryThreadsForUserArgs = {
  uid: Scalars['String']['input'];
};


export type QueryUnitByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryUserAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryUserByEmailArgs = {
  email: Scalars['String']['input'];
};


export type QueryUserMeArgs = {
  token: Scalars['String']['input'];
};


export type QueryVoucherByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryVoucherCodesArgs = {
  voucherUid: Scalars['String']['input'];
};


export type QueryWorksheetAllArgs = {
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  status?: InputMaybe<Scalars['String']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryWorksheetByAnalystArgs = {
  analystUid: Scalars['String']['input'];
};


export type QueryWorksheetByIdArgs = {
  worksheetId: Scalars['String']['input'];
};


export type QueryWorksheetByStatusArgs = {
  worksheetStatus: Scalars['String']['input'];
};


export type QueryWorksheetByUidArgs = {
  worksheetUid: Scalars['String']['input'];
};


export type QueryWorksheetTemplateByUidArgs = {
  worksheetUid: Scalars['String']['input'];
};

export type ReferenceSampleInput = {
  analyses: Array<Scalars['String']['input']>;
  sampleUid?: InputMaybe<Scalars['String']['input']>;
  shipedSampleUid?: InputMaybe<Scalars['String']['input']>;
};

export type ReferralLaboratoryInputType = {
  code: Scalars['String']['input'];
  isReference?: Scalars['Boolean']['input'];
  isReferral?: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  url: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type ReferralLaboratoryResponse = OperationError | ReferralLaboratoryType;

export type ReferralLaboratoryType = {
  __typename?: 'ReferralLaboratoryType';
  code?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  isReference?: Maybe<Scalars['Boolean']['output']>;
  isReferral?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  password?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};

export type ReflexActionInput = {
  analyses: Array<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  level: Scalars['Int']['input'];
  reflexRuleUid: Scalars['String']['input'];
  sampleTypeUid?: InputMaybe<Scalars['String']['input']>;
};

export type ReflexActionResponse = OperationError | ReflexActionType;

export type ReflexActionType = {
  __typename?: 'ReflexActionType';
  analyses?: Maybe<Array<AnalysisType>>;
  brains?: Maybe<Array<ReflexBrainType>>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description: Scalars['String']['output'];
  level: Scalars['Int']['output'];
  reflexRule?: Maybe<ReflexRuleType>;
  reflexRuleUid: Scalars['String']['output'];
  sampleType?: Maybe<SampleTypeTyp>;
  sampleTypeUid?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type ReflexAddNewInput = {
  analysisUid: Scalars['String']['input'];
  count: Scalars['Int']['input'];
};

export type ReflexBrainActionInput = {
  addNew?: InputMaybe<Array<ReflexAddNewInput>>;
  finalise?: InputMaybe<Array<ReflexFinalInput>>;
};

export type ReflexBrainActionType = {
  __typename?: 'ReflexBrainActionType';
  addNew?: Maybe<Array<ReflexBrainAdditionType>>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description: Scalars['String']['output'];
  finalise?: Maybe<Array<ReflexBrainFinalType>>;
  priority: Scalars['Int']['output'];
  reflexBrain?: Maybe<ReflexBrainType>;
  reflexBrainUid: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type ReflexBrainAdditionType = {
  __typename?: 'ReflexBrainAdditionType';
  analysis?: Maybe<AnalysisType>;
  analysisUid: Scalars['String']['output'];
  count: Scalars['Int']['output'];
  reflexBrainAction?: Maybe<ReflexBrainActionType>;
  reflexBrainActionUid: Scalars['String']['output'];
};

export type ReflexBrainConditionCriteriaType = {
  __typename?: 'ReflexBrainConditionCriteriaType';
  analysis?: Maybe<AnalysisType>;
  analysisUid: Scalars['String']['output'];
  operator: Scalars['String']['output'];
  reflexBrainCondition?: Maybe<ReflexBrainConditionType>;
  reflexBrainConditionUid: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type ReflexBrainConditionInput = {
  criteria?: InputMaybe<Array<ReflexBrainCriteriaInput>>;
  description?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<Scalars['Int']['input']>;
};

export type ReflexBrainConditionType = {
  __typename?: 'ReflexBrainConditionType';
  criteria?: Maybe<Array<ReflexBrainConditionCriteriaType>>;
  description?: Maybe<Scalars['String']['output']>;
  priority: Scalars['Int']['output'];
  reflexBrain: ReflexBrainType;
  reflexBrainUid: Scalars['String']['output'];
  uid: Scalars['String']['output'];
};

export type ReflexBrainCriteriaInput = {
  analysisUid: Scalars['String']['input'];
  operator: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type ReflexBrainFinalType = {
  __typename?: 'ReflexBrainFinalType';
  analysis?: Maybe<AnalysisType>;
  analysisUid: Scalars['String']['output'];
  reflexBrainAction?: Maybe<ReflexBrainActionType>;
  reflexBrainActionUid: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type ReflexBrainInput = {
  actions?: InputMaybe<Array<ReflexBrainActionInput>>;
  conditions?: InputMaybe<Array<ReflexBrainConditionInput>>;
  description?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<Scalars['Int']['input']>;
  reflexActionUid: Scalars['String']['input'];
};

export type ReflexBrainResponse = OperationError | ReflexBrainType;

export type ReflexBrainType = {
  __typename?: 'ReflexBrainType';
  actions: Array<ReflexBrainActionType>;
  conditions: Array<ReflexBrainConditionType>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description: Scalars['String']['output'];
  priority: Scalars['Int']['output'];
  reflexAction?: Maybe<ReflexBrainType>;
  reflexActionUid: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type ReflexFinalInput = {
  analysisUid: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type ReflexRuleCursorPage = {
  __typename?: 'ReflexRuleCursorPage';
  edges?: Maybe<Array<ReflexRuleEdge>>;
  items?: Maybe<Array<ReflexRuleType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ReflexRuleEdge = {
  __typename?: 'ReflexRuleEdge';
  cursor: Scalars['String']['output'];
  node: ReflexRuleType;
};

export type ReflexRuleInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type ReflexRuleResponse = OperationError | ReflexRuleType;

export type ReflexRuleType = {
  __typename?: 'ReflexRuleType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  priority: Scalars['Int']['output'];
  reflexActions?: Maybe<Array<ReflexActionType>>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type RejectionReasonResponse = OperationError | RejectionReasonType;

export type RejectionReasonType = {
  __typename?: 'RejectionReasonType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  reason: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type ReportImpressType = {
  __typename?: 'ReportImpressType';
  createdAt: Scalars['DateTime']['output'];
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  emailRequired?: Maybe<Scalars['Boolean']['output']>;
  emailSent?: Maybe<Scalars['Boolean']['output']>;
  generatedBy?: Maybe<UserType>;
  generatedByUid?: Maybe<Scalars['String']['output']>;
  jsonContent?: Maybe<Scalars['JSONScalar']['output']>;
  sample?: Maybe<SampleType>;
  sampleUid?: Maybe<Scalars['String']['output']>;
  smsRequired?: Maybe<Scalars['Boolean']['output']>;
  smsSent?: Maybe<Scalars['Boolean']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type ReportMetaType = {
  __typename?: 'ReportMetaType';
  analyses?: Maybe<Array<AnalysisType>>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  dateColumn: Scalars['String']['output'];
  location?: Maybe<Scalars['String']['output']>;
  periodEnd: Scalars['DateTime']['output'];
  periodStart: Scalars['DateTime']['output'];
  reportType: Scalars['String']['output'];
  sampleStates?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  temp?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type ReservedInputType = {
  levelUid?: InputMaybe<Scalars['String']['input']>;
  position: Scalars['Int']['input'];
};

export type ResultListingType = {
  __typename?: 'ResultListingType';
  results: Array<AnalysisResultType>;
};

export type ResultMutationType = {
  __typename?: 'ResultMutationType';
  after: Scalars['String']['output'];
  before: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  date?: Maybe<Scalars['String']['output']>;
  mutation: Scalars['String']['output'];
  resultUid: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type ResultOptionInputType = {
  analysisUid: Scalars['String']['input'];
  optionKey: Scalars['Int']['input'];
  sampleTypes?: InputMaybe<Array<Scalars['String']['input']>>;
  value: Scalars['String']['input'];
};

export type ResultOptionResponse = OperationError | ResultOptionType;

export type ResultOptionType = {
  __typename?: 'ResultOptionType';
  analysisUid: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  optionKey: Scalars['Int']['output'];
  sampleTypes?: Maybe<Array<SampleTypeTyp>>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  value: Scalars['String']['output'];
};

/** Union of possible outcomes when actioning samples */
export type ResultedSampleActionResponse = OperationError | ResultedSampleListingType;

export type ResultedSampleListingType = {
  __typename?: 'ResultedSampleListingType';
  samples: Array<SamplesWithResults>;
};

/** Union of possible outcomes when actioning samples */
export type SampleActionResponse = OperationError | SampleListingType;

export type SampleCursorPage = {
  __typename?: 'SampleCursorPage';
  edges?: Maybe<Array<SampleEdge>>;
  items?: Maybe<Array<SamplesWithResults>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type SampleEdge = {
  __typename?: 'SampleEdge';
  cursor: Scalars['String']['output'];
  node: SamplesWithResults;
};

export type SampleListingType = {
  __typename?: 'SampleListingType';
  samples: Array<SampleType>;
};

export type SamplePublishInputType = {
  action?: Scalars['String']['input'];
  uid: Scalars['String']['input'];
};

export type SampleRejectInputType = {
  other?: InputMaybe<Scalars['String']['input']>;
  reasons: Array<Scalars['String']['input']>;
  uid: Scalars['String']['input'];
};

export type SampleType = {
  __typename?: 'SampleType';
  analyses?: Maybe<Array<AnalysisType>>;
  analysisRequest?: Maybe<AnalysisRequestType>;
  analysisRequestUid: Scalars['String']['output'];
  assigned: Scalars['Boolean']['output'];
  cancelledBy?: Maybe<UserType>;
  cancelledByUid?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  dateCancelled?: Maybe<Scalars['DateTime']['output']>;
  dateCollected?: Maybe<Scalars['DateTime']['output']>;
  dateInvalidated?: Maybe<Scalars['DateTime']['output']>;
  datePrinted?: Maybe<Scalars['DateTime']['output']>;
  datePublished?: Maybe<Scalars['DateTime']['output']>;
  dateReceived?: Maybe<Scalars['DateTime']['output']>;
  dateRetrievedFromStorage?: Maybe<Scalars['DateTime']['output']>;
  dateStored?: Maybe<Scalars['DateTime']['output']>;
  dateSubmitted?: Maybe<Scalars['DateTime']['output']>;
  dateVerified?: Maybe<Scalars['DateTime']['output']>;
  dueDate?: Maybe<Scalars['String']['output']>;
  internalUse: Scalars['Boolean']['output'];
  invalidatedBy?: Maybe<UserType>;
  invalidatedByUid?: Maybe<Scalars['String']['output']>;
  metadataSnapshot?: Maybe<Scalars['JSONScalar']['output']>;
  parent?: Maybe<SampleType>;
  parentId?: Maybe<Scalars['String']['output']>;
  printed?: Maybe<Scalars['Boolean']['output']>;
  printedBy?: Maybe<UserType>;
  printedByUid?: Maybe<Scalars['String']['output']>;
  priority: Scalars['Int']['output'];
  profiles: Array<ProfileType>;
  publishedBy?: Maybe<UserType>;
  publishedByUid?: Maybe<Scalars['String']['output']>;
  qcLevel?: Maybe<QcLevelType>;
  qcLevelUid?: Maybe<Scalars['String']['output']>;
  qcSet?: Maybe<QcSetType>;
  qcSetUid?: Maybe<Scalars['String']['output']>;
  receivedBy?: Maybe<UserType>;
  receivedByUid?: Maybe<Scalars['String']['output']>;
  rejectionReasons?: Maybe<Array<RejectionReasonType>>;
  sampleId: Scalars['String']['output'];
  sampleType?: Maybe<SampleTypeTyp>;
  sampleTypeUid: Scalars['String']['output'];
  status?: Maybe<Scalars['String']['output']>;
  storageContainer?: Maybe<StorageContainerType>;
  storageContainerUid?: Maybe<Scalars['String']['output']>;
  storageSlot?: Maybe<Scalars['String']['output']>;
  storageSlotIndex?: Maybe<Scalars['Int']['output']>;
  storedBy?: Maybe<UserType>;
  storedByUid?: Maybe<Scalars['String']['output']>;
  submittedBy?: Maybe<UserType>;
  submittedByUid?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  verifiedBy?: Maybe<UserType>;
  verifiedByUid?: Maybe<Scalars['String']['output']>;
};

export type SampleTypeInputType = {
  abbr: Scalars['String']['input'];
  active?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  internalUse?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
};

export type SampleTypeMappingInputType = {
  code: Scalars['String']['input'];
  codingStandardUid: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  sampleTypeUid: Scalars['String']['input'];
};

/** Union of possible outcomes when adding a new notice */
export type SampleTypeMappingResponse = OperationError | SampleTypeMappingType;

export type SampleTypeMappingType = {
  __typename?: 'SampleTypeMappingType';
  code: Scalars['String']['output'];
  codingStandard?: Maybe<CodingStandardType>;
  codingStandardUid: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  sampleType?: Maybe<SampleTypeTyp>;
  sampleTypeUid: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type SampleTypeResponse = OperationError | SampleTypeTyp;

export type SampleTypeTyp = {
  __typename?: 'SampleTypeTyp';
  abbr: Scalars['String']['output'];
  active: Scalars['Boolean']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  internalUse: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type SamplesWithResults = {
  __typename?: 'SamplesWithResults';
  analyses?: Maybe<Array<AnalysisType>>;
  analysisRequest?: Maybe<AnalysisRequestType>;
  analysisRequestUid: Scalars['String']['output'];
  analysisResults?: Maybe<Array<AnalysisResultType>>;
  assigned: Scalars['Boolean']['output'];
  cancelledBy?: Maybe<UserType>;
  cancelledByUid?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  dateCancelled?: Maybe<Scalars['DateTime']['output']>;
  dateCollected?: Maybe<Scalars['DateTime']['output']>;
  dateInvalidated?: Maybe<Scalars['DateTime']['output']>;
  datePrinted?: Maybe<Scalars['DateTime']['output']>;
  datePublished?: Maybe<Scalars['DateTime']['output']>;
  dateReceived?: Maybe<Scalars['DateTime']['output']>;
  dateRetrievedFromStorage?: Maybe<Scalars['DateTime']['output']>;
  dateStored?: Maybe<Scalars['DateTime']['output']>;
  dateSubmitted?: Maybe<Scalars['DateTime']['output']>;
  dateVerified?: Maybe<Scalars['DateTime']['output']>;
  dueDate?: Maybe<Scalars['String']['output']>;
  internalUse: Scalars['Boolean']['output'];
  invalidatedBy?: Maybe<UserType>;
  invalidatedByUid?: Maybe<Scalars['String']['output']>;
  metadataSnapshot?: Maybe<Scalars['JSONScalar']['output']>;
  parent?: Maybe<SampleType>;
  parentId?: Maybe<Scalars['String']['output']>;
  printed?: Maybe<Scalars['Boolean']['output']>;
  printedBy?: Maybe<UserType>;
  printedByUid?: Maybe<Scalars['String']['output']>;
  priority: Scalars['Int']['output'];
  profiles: Array<ProfileType>;
  publishedBy?: Maybe<UserType>;
  publishedByUid?: Maybe<Scalars['String']['output']>;
  qcLevel?: Maybe<QcLevelType>;
  qcLevelUid?: Maybe<Scalars['String']['output']>;
  qcSet?: Maybe<QcSetType>;
  qcSetUid?: Maybe<Scalars['String']['output']>;
  receivedBy?: Maybe<UserType>;
  receivedByUid?: Maybe<Scalars['String']['output']>;
  rejectionReasons?: Maybe<Array<RejectionReasonType>>;
  sampleId: Scalars['String']['output'];
  sampleType?: Maybe<SampleTypeTyp>;
  sampleTypeUid: Scalars['String']['output'];
  status?: Maybe<Scalars['String']['output']>;
  storageContainer?: Maybe<StorageContainerType>;
  storageContainerUid?: Maybe<Scalars['String']['output']>;
  storageSlot?: Maybe<Scalars['String']['output']>;
  storageSlotIndex?: Maybe<Scalars['Int']['output']>;
  storedBy?: Maybe<UserType>;
  storedByUid?: Maybe<Scalars['String']['output']>;
  submittedBy?: Maybe<UserType>;
  submittedByUid?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  verifiedBy?: Maybe<UserType>;
  verifiedByUid?: Maybe<Scalars['String']['output']>;
};

export type ShipmentCursorPage = {
  __typename?: 'ShipmentCursorPage';
  edges?: Maybe<Array<ShipmentEdge>>;
  items?: Maybe<Array<ShipmentType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ShipmentEdge = {
  __typename?: 'ShipmentEdge';
  cursor: Scalars['String']['output'];
  node: ShipmentType;
};

export type ShipmentInputType = {
  comment?: InputMaybe<Scalars['String']['input']>;
  count?: InputMaybe<Scalars['Int']['input']>;
  courier: Scalars['String']['input'];
  laboratoryUid?: InputMaybe<Scalars['String']['input']>;
};

export type ShipmentListingType = {
  __typename?: 'ShipmentListingType';
  shipments?: Maybe<Array<ShipmentType>>;
};

export type ShipmentManageSamplesInput = {
  action: Scalars['String']['input'];
  samples: Array<ReferenceSampleInput>;
};

export type ShipmentResponse = OperationError | ShipmentType;

export type ShipmentType = {
  __typename?: 'ShipmentType';
  assignedCount?: Maybe<Scalars['Int']['output']>;
  comment?: Maybe<Scalars['String']['output']>;
  courier?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  data?: Maybe<Scalars['JSONScalar']['output']>;
  dateDispatched?: Maybe<Scalars['DateTime']['output']>;
  dateFinalised?: Maybe<Scalars['DateTime']['output']>;
  dateRecalled?: Maybe<Scalars['DateTime']['output']>;
  dateReceived?: Maybe<Scalars['DateTime']['output']>;
  dateRejected?: Maybe<Scalars['DateTime']['output']>;
  dispatchedBy?: Maybe<UserType>;
  dispatchedByUid?: Maybe<Scalars['String']['output']>;
  finalisedBy?: Maybe<UserType>;
  finalisedByUid?: Maybe<Scalars['String']['output']>;
  incoming: Scalars['Boolean']['output'];
  jsonContent?: Maybe<Scalars['JSONScalar']['output']>;
  laboratory?: Maybe<ReferralLaboratoryType>;
  laboratoryUid?: Maybe<Scalars['String']['output']>;
  pdfContent?: Maybe<Scalars['BytesScalar']['output']>;
  recalledBy?: Maybe<UserType>;
  recalledByUid?: Maybe<Scalars['String']['output']>;
  receivedBy?: Maybe<UserType>;
  receivedByUid?: Maybe<Scalars['String']['output']>;
  rejectedBy?: Maybe<UserType>;
  rejectedByUid?: Maybe<Scalars['String']['output']>;
  samples?: Maybe<Array<SampleType>>;
  shipmentId?: Maybe<Scalars['String']['output']>;
  shippedSamples?: Maybe<Array<ShippedSampleType>>;
  state?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type ShipmentUpdateInputType = {
  comment?: InputMaybe<Scalars['String']['input']>;
  courier: Scalars['String']['input'];
  laboratoryUid?: InputMaybe<Scalars['String']['input']>;
};

export type ShipmentsResponse = OperationError | ShipmentListingType;

export type ShippedSampleType = {
  __typename?: 'ShippedSampleType';
  extSampleId?: Maybe<Scalars['String']['output']>;
  extSampleUid?: Maybe<Scalars['String']['output']>;
  resultNotified?: Maybe<Scalars['Boolean']['output']>;
  sample: SampleType;
  sampleUid: Scalars['String']['output'];
  shipment: ShipmentType;
  shipmentUid: Scalars['String']['output'];
};

export enum StampCategory {
  Project = 'PROJECT',
  Ticket = 'TICKET'
}

export type StockAdjustmentCursorPage = {
  __typename?: 'StockAdjustmentCursorPage';
  edges?: Maybe<Array<StockAdjustmentEdge>>;
  items?: Maybe<Array<StockAdjustmentType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type StockAdjustmentEdge = {
  __typename?: 'StockAdjustmentEdge';
  cursor: Scalars['String']['output'];
  node: StockAdjustmentType;
};

export type StockAdjustmentInputType = {
  adjust: Scalars['Int']['input'];
  adjustmentType: Scalars['String']['input'];
  productUid: Scalars['String']['input'];
  remarks?: InputMaybe<Scalars['String']['input']>;
  stockLotUid: Scalars['String']['input'];
};

export type StockAdjustmentResponse = OperationError | StockAdjustmentType;

export type StockAdjustmentType = {
  __typename?: 'StockAdjustmentType';
  adjust?: Maybe<Scalars['Int']['output']>;
  adjustmentBy?: Maybe<UserType>;
  adjustmentByUid?: Maybe<Scalars['String']['output']>;
  adjustmentDate?: Maybe<Scalars['String']['output']>;
  adjustmentFor?: Maybe<UserType>;
  adjustmentForUid?: Maybe<Scalars['String']['output']>;
  adjustmentType?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  product?: Maybe<StockItemVariantType>;
  productUid?: Maybe<Scalars['String']['output']>;
  remarks?: Maybe<Scalars['String']['output']>;
  stockLot?: Maybe<StockLotType>;
  stockLotUid?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type StockCategoryInputType = {
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type StockCategoryResponse = OperationError | StockCategoryType;

export type StockCategoryType = {
  __typename?: 'StockCategoryType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type StockItemCursorPage = {
  __typename?: 'StockItemCursorPage';
  edges?: Maybe<Array<StockItemEdge>>;
  items?: Maybe<Array<StockItemType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type StockItemEdge = {
  __typename?: 'StockItemEdge';
  cursor: Scalars['String']['output'];
  node: StockItemType;
};

export type StockItemInputType = {
  categoryUid?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  hazardUid?: InputMaybe<Scalars['String']['input']>;
  maximumLevel?: InputMaybe<Scalars['Int']['input']>;
  minimumLevel?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
};

export type StockItemResponse = OperationError | StockItemType;

export type StockItemType = {
  __typename?: 'StockItemType';
  category?: Maybe<StockCategoryType>;
  categoryUid?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  hazard?: Maybe<HazardType>;
  hazardUid?: Maybe<Scalars['String']['output']>;
  maximumLevel?: Maybe<Scalars['Int']['output']>;
  minimumLevel?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  variants?: Maybe<Array<StockItemVariantType>>;
};

export type StockItemVariantCursorPage = {
  __typename?: 'StockItemVariantCursorPage';
  edges?: Maybe<Array<StockItemVariantType>>;
  items?: Maybe<Array<StockItemVariantType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type StockItemVariantEdge = {
  __typename?: 'StockItemVariantEdge';
  cursor: Scalars['String']['output'];
  node: StockItemVariantType;
};

export type StockItemVariantInputType = {
  description: Scalars['String']['input'];
  maximumLevel?: InputMaybe<Scalars['Int']['input']>;
  minimumLevel?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
};

export type StockItemVariantResponse = OperationError | StockItemVariantType;

export type StockItemVariantType = {
  __typename?: 'StockItemVariantType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  maximumLevel?: Maybe<Scalars['Int']['output']>;
  minimumLevel?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  quantity: Scalars['Int']['output'];
  stockItem?: Maybe<StockItemType>;
  stockItemUid?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type StockLotType = {
  __typename?: 'StockLotType';
  expiryDate: Scalars['DateTime']['output'];
  lotNumber: Scalars['String']['output'];
  product?: Maybe<StockItemVariantType>;
  productUid: Scalars['String']['output'];
  quantity: Scalars['Int']['output'];
  remarks?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
};

export type StockOrderApprovalInputType = {
  remarks: Scalars['String']['input'];
  status: Scalars['String']['input'];
};

export type StockOrderCursorPage = {
  __typename?: 'StockOrderCursorPage';
  edges?: Maybe<Array<StockOrderEdge>>;
  items?: Maybe<Array<StockOrderType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type StockOrderEdge = {
  __typename?: 'StockOrderEdge';
  cursor: Scalars['String']['output'];
  node: StockOrderType;
};

export type StockOrderInputType = {
  departmentUid?: InputMaybe<Scalars['String']['input']>;
  orderProducts: Array<StockOrderProductLineInputType>;
};

export type StockOrderLineType = {
  __typename?: 'StockOrderLineType';
  orderProducts: Array<StockOrderProductType>;
  stockOrder: StockOrderType;
};

export type StockOrderProductLineInputType = {
  price?: Scalars['Float']['input'];
  productUid: Scalars['String']['input'];
  quantity: Scalars['Int']['input'];
  remarks?: InputMaybe<Scalars['String']['input']>;
  stockLotUid: Scalars['String']['input'];
};

export type StockOrderProductType = {
  __typename?: 'StockOrderProductType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  order?: Maybe<StockOrderType>;
  orderUid?: Maybe<Scalars['String']['output']>;
  product?: Maybe<StockItemVariantType>;
  productUid?: Maybe<Scalars['String']['output']>;
  quantity?: Maybe<Scalars['Int']['output']>;
  stockLot?: Maybe<StockLotType>;
  stockLotUid: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type StockOrderResponse = OperationError | StockOrderLineType | StockOrderType;

export type StockOrderType = {
  __typename?: 'StockOrderType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  department?: Maybe<DepartmentType>;
  departmentUid?: Maybe<Scalars['String']['output']>;
  fulfilledBy?: Maybe<UserType>;
  fulfilledByUid?: Maybe<Scalars['String']['output']>;
  orderBy?: Maybe<UserType>;
  orderByUid?: Maybe<Scalars['String']['output']>;
  orderNumber?: Maybe<Scalars['String']['output']>;
  remarks?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type StockPackagingType = {
  __typename?: 'StockPackagingType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type StockProductInventoryType = {
  __typename?: 'StockProductInventoryType';
  product?: Maybe<StockItemVariantType>;
  productUid: Scalars['String']['output'];
  quantity: Scalars['Int']['output'];
  remarks?: Maybe<Scalars['String']['output']>;
  stockLot?: Maybe<StockLotType>;
  stockLotUid: Scalars['String']['output'];
  uid: Scalars['String']['output'];
};

export type StockReceiptInputType = {
  expiryDate?: InputMaybe<Scalars['DateTime']['input']>;
  lotNumber: Scalars['String']['input'];
  packageFactor: Scalars['Int']['input'];
  packagesReceived: Scalars['Int']['input'];
  productUid: Scalars['String']['input'];
  quantityReceived: Scalars['Int']['input'];
  receiptByUid: Scalars['String']['input'];
  receiptDate?: InputMaybe<Scalars['DateTime']['input']>;
  receiptType: Scalars['String']['input'];
  singlesReceived: Scalars['Int']['input'];
  supplierUid: Scalars['String']['input'];
  totalPrice?: InputMaybe<Scalars['Float']['input']>;
  unitPrice?: InputMaybe<Scalars['Float']['input']>;
  unitUid: Scalars['String']['input'];
};

export type StockReceiptType = {
  __typename?: 'StockReceiptType';
  packageFactor?: Maybe<Scalars['Int']['output']>;
  packagesReceived?: Maybe<Scalars['Int']['output']>;
  product?: Maybe<StockItemVariantType>;
  productUid?: Maybe<Scalars['String']['output']>;
  quantityReceived?: Maybe<Scalars['Int']['output']>;
  receiptBy?: Maybe<UserType>;
  receiptByUid: Scalars['String']['output'];
  receiptDate: Scalars['DateTime']['output'];
  receiptType: Scalars['String']['output'];
  singlesReceived?: Maybe<Scalars['Int']['output']>;
  stockLot?: Maybe<StockLotType>;
  stockLotUid?: Maybe<Scalars['String']['output']>;
  supplier?: Maybe<SupplierType>;
  supplierUid?: Maybe<Scalars['String']['output']>;
  totalPrice: Scalars['Float']['output'];
  uid: Scalars['String']['output'];
  unit?: Maybe<StockUnitType>;
  unitPrice: Scalars['Float']['output'];
  unitUid: Scalars['String']['output'];
};

export type StockTransactionCursorPage = {
  __typename?: 'StockTransactionCursorPage';
  edges?: Maybe<Array<StockTransactionEdge>>;
  items?: Maybe<Array<StockTransactionType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type StockTransactionEdge = {
  __typename?: 'StockTransactionEdge';
  cursor: Scalars['String']['output'];
  node: StockTransactionType;
};

export type StockTransactionType = {
  __typename?: 'StockTransactionType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  dateIssued?: Maybe<Scalars['DateTime']['output']>;
  department?: Maybe<DepartmentType>;
  departmentUid?: Maybe<Scalars['String']['output']>;
  issued?: Maybe<Scalars['Int']['output']>;
  issuedTo?: Maybe<UserType>;
  issuedToUid?: Maybe<Scalars['String']['output']>;
  product?: Maybe<StockItemVariantType>;
  productUid?: Maybe<Scalars['String']['output']>;
  transactionBy?: Maybe<UserType>;
  transactionByUid?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type StockUnitInputType = {
  name: Scalars['String']['input'];
};

export type StockUnitResponse = OperationError | StockUnitType;

export type StockUnitType = {
  __typename?: 'StockUnitType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description: Scalars['String']['output'];
  name: Scalars['String']['output'];
  synonyms: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type StorageContainerInputType = {
  cols?: InputMaybe<Scalars['Int']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  grid?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  rowWise?: InputMaybe<Scalars['Boolean']['input']>;
  rows?: InputMaybe<Scalars['Int']['input']>;
  slots?: InputMaybe<Scalars['Int']['input']>;
  storageSectionUid: Scalars['String']['input'];
};

export type StorageContainerResponse = OperationError | StorageContainerType;

export type StorageContainerType = {
  __typename?: 'StorageContainerType';
  cols?: Maybe<Scalars['Int']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  grid?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  rowWise?: Maybe<Scalars['Boolean']['output']>;
  rows?: Maybe<Scalars['Int']['output']>;
  slots?: Maybe<Scalars['Int']['output']>;
  storageSection?: Maybe<StorageSectionType>;
  storageSectionUid: Scalars['String']['output'];
  storedCount?: Maybe<Scalars['Int']['output']>;
  tag: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type StorageLocationInputType = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  storeRoomUid: Scalars['String']['input'];
};

export type StorageLocationResponse = OperationError | StorageLocationType;

export type StorageLocationType = {
  __typename?: 'StorageLocationType';
  children?: Maybe<Array<StorageSectionType>>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  storeRoom?: Maybe<StoreRoomType>;
  storeRoomUid: Scalars['String']['output'];
  tag: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type StorageSectionInputType = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  storageLocationUid: Scalars['String']['input'];
};

export type StorageSectionResponse = OperationError | StorageSectionType;

export type StorageSectionType = {
  __typename?: 'StorageSectionType';
  children?: Maybe<Array<StorageContainerType>>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  storageLocation?: Maybe<StorageLocationType>;
  storageLocationUid: Scalars['String']['output'];
  tag: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type StoreRoomInputType = {
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type StoreRoomResponse = OperationError | StoreRoomType;

export type StoreRoomType = {
  __typename?: 'StoreRoomType';
  children?: Maybe<Array<StorageLocationType>>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  tag: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type StoreSampleResponse = OperationError | StoredSamplesType;

export type StoreSamplesInputType = {
  sampleUid: Scalars['String']['input'];
  storageContainerUid: Scalars['String']['input'];
  storageSlot: Scalars['String']['input'];
  storageSlotIndex: Scalars['Int']['input'];
};

export type StoredSamplesType = {
  __typename?: 'StoredSamplesType';
  samples: Array<SampleType>;
};

export type Subscription = {
  __typename?: 'Subscription';
  latestActivity: ActivityStreamType;
  streamAll: ActivityStreamType;
  streamProcesses: ActivityProcessType;
};

/** Union of possible outcomes when deleting some object */
export type SuccessErrorResponse = OperationError | OperationSuccess;

export type SupplierInputType = {
  code?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type SupplierResponse = OperationError | SupplierType;

export type SupplierType = {
  __typename?: 'SupplierType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type TestBillCursorPage = {
  __typename?: 'TestBillCursorPage';
  edges?: Maybe<Array<TestBillEdge>>;
  items?: Maybe<Array<TestBillType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type TestBillEdge = {
  __typename?: 'TestBillEdge';
  cursor: Scalars['String']['output'];
  node: TestBillType;
};

export type TestBillInvoiceType = {
  __typename?: 'TestBillInvoiceType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  jsonContent?: Maybe<Scalars['JSONScalar']['output']>;
  pdfContent?: Maybe<Scalars['BytesScalar']['output']>;
  testBill: TestBillType;
  testBillUid: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type TestBillTransactionResponse = OperationError | TestBillTransactionType;

export type TestBillTransactionType = {
  __typename?: 'TestBillTransactionType';
  actionMessage: Scalars['String']['output'];
  actionRequired: Scalars['Boolean']['output'];
  amount: Scalars['Float']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  isSuccess: Scalars['Boolean']['output'];
  kind: Scalars['String']['output'];
  message: Scalars['String']['output'];
  notes: Scalars['String']['output'];
  processed: Scalars['Boolean']['output'];
  testBill: TestBillType;
  testBillUid: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type TestBillType = {
  __typename?: 'TestBillType';
  billId: Scalars['String']['output'];
  client: ClientType;
  clientUid: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  jsonContent?: Maybe<Scalars['JSONScalar']['output']>;
  orders?: Maybe<Array<AnalysisRequestType>>;
  partial: Scalars['Boolean']['output'];
  patient: PatientType;
  patientUid: Scalars['String']['output'];
  toConfirm: Scalars['Boolean']['output'];
  totalCharged: Scalars['Float']['output'];
  totalPaid: Scalars['Float']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type UnitInputType = {
  isSiUnit: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
};

export type UnitResponse = OperationError | UnitType;

export type UnitType = {
  __typename?: 'UnitType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type UnknownObjectType = {
  __typename?: 'UnknownObjectType';
  message: Scalars['String']['output'];
};

export type UpdatedGroupPerms = {
  __typename?: 'UpdatedGroupPerms';
  group: GroupType;
  permission: PermissionType;
};

export type UpdatedGroupPermsResponse = OperationError | UpdatedGroupPerms;

export type UserCursorPage = {
  __typename?: 'UserCursorPage';
  edges?: Maybe<Array<UserEdge>>;
  items?: Maybe<Array<UserType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type UserEdge = {
  __typename?: 'UserEdge';
  cursor: Scalars['String']['output'];
  node: UserType;
};

export type UserPreferenceType = {
  __typename?: 'UserPreferenceType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserPreferenceType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  departments?: Maybe<Array<DepartmentType>>;
  expandedMenu?: Maybe<Scalars['Boolean']['output']>;
  theme?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserPreferenceType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
};

export type UserResponse = OperationError | UserType;

export type UserType = {
  __typename?: 'UserType';
  avatar?: Maybe<Scalars['String']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  businessPhone?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  defaultRoute?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  groups?: Maybe<Array<GroupType>>;
  isActive: Scalars['Boolean']['output'];
  isBlocked: Scalars['Boolean']['output'];
  isSuperuser: Scalars['Boolean']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  loginRetry: Scalars['Int']['output'];
  mobilePhone?: Maybe<Scalars['String']['output']>;
  preference?: Maybe<UserPreferenceType>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  userName: Scalars['String']['output'];
};

export type VoucherCodeInput = {
  code: Scalars['String']['input'];
  isActive: Scalars['Boolean']['input'];
  usageLimit: Scalars['Int']['input'];
  voucherUid: Scalars['String']['input'];
};

export type VoucherCodeResponse = OperationError | VoucherCodeType;

export type VoucherCodeType = {
  __typename?: 'VoucherCodeType';
  code: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  uid: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  usageLimit: Scalars['Int']['output'];
  used: Scalars['Int']['output'];
  voucher: VoucherType;
  voucherUid: Scalars['String']['output'];
};

export type VoucherCustomerType = {
  __typename?: 'VoucherCustomerType';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  patient: PatientType;
  patientUid: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  voucherCode: VoucherCodeType;
  voucherCodeUid: Scalars['String']['output'];
};

export type VoucherInput = {
  endDate: Scalars['DateTime']['input'];
  name: Scalars['String']['input'];
  oncePerCustomer: Scalars['Boolean']['input'];
  oncePerOrder: Scalars['Boolean']['input'];
  startDate: Scalars['DateTime']['input'];
  usageLimit: Scalars['Int']['input'];
};

export type VoucherResponse = OperationError | VoucherType;

export type VoucherType = {
  __typename?: 'VoucherType';
  codes?: Maybe<Array<VoucherCodeType>>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  endDate: Scalars['String']['output'];
  name: Scalars['String']['output'];
  oncePerCustomer: Scalars['Boolean']['output'];
  oncePerOrder: Scalars['Boolean']['output'];
  startDate: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  usageLimit: Scalars['Int']['output'];
  used: Scalars['Int']['output'];
};

export type WorkSheetCursorPage = {
  __typename?: 'WorkSheetCursorPage';
  edges?: Maybe<Array<WorkSheetEdge>>;
  items?: Maybe<Array<WorkSheetType>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type WorkSheetEdge = {
  __typename?: 'WorkSheetEdge';
  cursor: Scalars['String']['output'];
  node: WorkSheetType;
};

export type WorkSheetResponse = OperationError | WorkSheetType;

export type WorkSheetTemplateResponse = OperationError | WorkSheetTemplateType;

export type WorkSheetTemplateType = {
  __typename?: 'WorkSheetTemplateType';
  analysis?: Maybe<AnalysisType>;
  analysisUid?: Maybe<Scalars['String']['output']>;
  cols?: Maybe<Scalars['Int']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  instrument?: Maybe<InstrumentType>;
  instrumentUid?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  numberOfSamples?: Maybe<Scalars['Int']['output']>;
  qcLevels?: Maybe<Array<QcLevelType>>;
  qcTemplate?: Maybe<QcTemplateType>;
  qcTemplateUid?: Maybe<Scalars['String']['output']>;
  reserved?: Maybe<Scalars['JSONScalar']['output']>;
  rowWise: Scalars['Boolean']['output'];
  rows?: Maybe<Scalars['Int']['output']>;
  sampleType?: Maybe<SampleTypeTyp>;
  sampleTypeUid?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  worksheetType: Scalars['String']['output'];
};

export type WorkSheetType = {
  __typename?: 'WorkSheetType';
  analysis?: Maybe<AnalysisType>;
  analysisResults?: Maybe<Array<AnalysisResultType>>;
  analysisUid?: Maybe<Scalars['String']['output']>;
  analyst?: Maybe<UserType>;
  analystUid?: Maybe<Scalars['String']['output']>;
  assignedCount: Scalars['Int']['output'];
  cols?: Maybe<Scalars['Int']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<UserType>;
  createdByUid?: Maybe<Scalars['String']['output']>;
  dateSubmitted?: Maybe<Scalars['DateTime']['output']>;
  dateVerified?: Maybe<Scalars['DateTime']['output']>;
  instrument?: Maybe<InstrumentType>;
  instrumentUid?: Maybe<Scalars['String']['output']>;
  numberOfSamples?: Maybe<Scalars['Int']['output']>;
  reserved?: Maybe<Scalars['JSONScalar']['output']>;
  rowWise: Scalars['Boolean']['output'];
  rows?: Maybe<Scalars['Int']['output']>;
  sampleType?: Maybe<SampleTypeTyp>;
  sampleTypeUid?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  submittedBy?: Maybe<UserType>;
  submittedByUid?: Maybe<Scalars['String']['output']>;
  template?: Maybe<WorkSheetTemplateType>;
  templateUid?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<UserType>;
  updatedByUid?: Maybe<Scalars['String']['output']>;
  verifiedBy?: Maybe<UserType>;
  verifiedByUid?: Maybe<Scalars['String']['output']>;
  worksheetId: Scalars['String']['output'];
  worksheetType: Scalars['String']['output'];
};

export type WorkSheetTypeSampleTypeAnalysisResultTypeReportMetaTypeUnknownObjectType = AnalysisResultType | ReportMetaType | SampleType | UnknownObjectType | WorkSheetType;

export type WorkSheetsResponse = OperationError | WorksheetListingType;

export type WorksheetListingType = {
  __typename?: 'WorksheetListingType';
  worksheets?: Maybe<Array<WorkSheetType>>;
};

export type WorksheetTemplateInputType = {
  analysisUid?: InputMaybe<Scalars['String']['input']>;
  cols?: InputMaybe<Scalars['Int']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  instrumentUid?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  numberOfSamples?: InputMaybe<Scalars['Int']['input']>;
  profiles?: InputMaybe<Array<Scalars['String']['input']>>;
  qcTemplateUid?: InputMaybe<Scalars['String']['input']>;
  reserved?: InputMaybe<Array<ReservedInputType>>;
  rowWise?: InputMaybe<Scalars['Boolean']['input']>;
  rows?: InputMaybe<Scalars['Int']['input']>;
  sampleTypeUid: Scalars['String']['input'];
  worksheetType?: InputMaybe<Scalars['String']['input']>;
};

export type AuthenticateUserMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type AuthenticateUserMutation = { __typename?: 'Mutation', authenticateUser: { __typename: 'AuthenticatedData', token: string, refresh: string, tokenType: string, user: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null, groups?: Array<{ __typename?: 'GroupType', uid: string, name?: string | null, keyword?: string | null, pages?: string | null, permissions?: Array<{ __typename?: 'PermissionType', uid: string, action?: string | null, target?: string | null }> | null }> | null, preference?: { __typename?: 'UserPreferenceType', uid: string, expandedMenu?: boolean | null, theme?: string | null, departments?: Array<{ __typename?: 'DepartmentType', uid: string, name?: string | null }> | null } | null } } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type RequestPassResetMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type RequestPassResetMutation = { __typename?: 'Mutation', requestPasswordReset: { __typename: 'MessagesType', message: string } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type ValidatePassResetTokenMutationVariables = Exact<{
  token: Scalars['String']['input'];
}>;


export type ValidatePassResetTokenMutation = { __typename?: 'Mutation', validatePasswordResetToken: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'PasswordResetValidityType', username: string } };

export type PasswordResetMutationVariables = Exact<{
  userUid: Scalars['String']['input'];
  password: Scalars['String']['input'];
  passwordc: Scalars['String']['input'];
}>;


export type PasswordResetMutation = { __typename?: 'Mutation', resetPassword: { __typename: 'MessagesType', message: string } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type TokenRefreshMutationVariables = Exact<{
  refreshToken: Scalars['String']['input'];
}>;


export type TokenRefreshMutation = { __typename?: 'Mutation', refresh: { __typename: 'AuthenticatedData', token: string, refresh: string, tokenType: string, user: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null, groups?: Array<{ __typename?: 'GroupType', uid: string, name?: string | null, keyword?: string | null, pages?: string | null, permissions?: Array<{ __typename?: 'PermissionType', uid: string, action?: string | null, target?: string | null }> | null }> | null, preference?: { __typename?: 'UserPreferenceType', uid: string, expandedMenu?: boolean | null, theme?: string | null, departments?: Array<{ __typename?: 'DepartmentType', uid: string, name?: string | null }> | null } | null } } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddUserMutationVariables = Exact<{
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  email: Scalars['String']['input'];
  groupUid?: InputMaybe<Scalars['String']['input']>;
  userName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  passwordc: Scalars['String']['input'];
}>;


export type AddUserMutation = { __typename?: 'Mutation', createUser: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null, email?: string | null, isActive: boolean, isSuperuser: boolean, mobilePhone?: string | null, userName: string, isBlocked: boolean, groups?: Array<{ __typename?: 'GroupType', uid: string, name?: string | null, keyword?: string | null, pages?: string | null, permissions?: Array<{ __typename?: 'PermissionType', uid: string, action?: string | null, target?: string | null }> | null }> | null } };

export type EditUserMutationVariables = Exact<{
  userUid: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  groupUid?: InputMaybe<Scalars['String']['input']>;
  mobilePhone?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  passwordc?: InputMaybe<Scalars['String']['input']>;
}>;


export type EditUserMutation = { __typename?: 'Mutation', updateUser: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null, email?: string | null, isActive: boolean, isSuperuser: boolean, mobilePhone?: string | null, userName: string, isBlocked: boolean, groups?: Array<{ __typename?: 'GroupType', uid: string, name?: string | null, keyword?: string | null, pages?: string | null, permissions?: Array<{ __typename?: 'PermissionType', uid: string, action?: string | null, target?: string | null }> | null }> | null } };

export type AddGroupMutationVariables = Exact<{
  payload: GroupInputType;
}>;


export type AddGroupMutation = { __typename?: 'Mutation', createGroup: { __typename: 'GroupType', uid: string, name?: string | null, pages?: string | null, active?: boolean | null, permissions?: Array<{ __typename?: 'PermissionType', uid: string, action?: string | null, target?: string | null, active?: boolean | null }> | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditGroupMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: GroupInputType;
}>;


export type EditGroupMutation = { __typename?: 'Mutation', updateGroup: { __typename: 'GroupType', uid: string, name?: string | null, pages?: string | null, active?: boolean | null, permissions?: Array<{ __typename?: 'PermissionType', uid: string, action?: string | null, target?: string | null, active?: boolean | null }> | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type UpdateGroupsAndPermissionsMutationVariables = Exact<{
  groupUid: Scalars['String']['input'];
  permissionUid: Scalars['String']['input'];
}>;


export type UpdateGroupsAndPermissionsMutation = { __typename?: 'Mutation', updateGroupPermissions: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'UpdatedGroupPerms', group: { __typename?: 'GroupType', uid: string, name?: string | null, pages?: string | null, active?: boolean | null, permissions?: Array<{ __typename?: 'PermissionType', uid: string, action?: string | null, target?: string | null, active?: boolean | null }> | null }, permission: { __typename?: 'PermissionType', uid: string, action?: string | null, target?: string | null } } };

export type AddDepartmentMutationVariables = Exact<{
  payload: DepartmentInputType;
}>;


export type AddDepartmentMutation = { __typename?: 'Mutation', createDepartment: { __typename?: 'DepartmentType', uid: string, name?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditDepartmentMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: DepartmentInputType;
}>;


export type EditDepartmentMutation = { __typename?: 'Mutation', updateDepartment: { __typename?: 'DepartmentType', uid: string, name?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditLaboratoryMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: LaboratoryInputType;
}>;


export type EditLaboratoryMutation = { __typename?: 'Mutation', updateLaboratory: { __typename?: 'LaboratoryType', uid: string, setupName: string, labName: string, tagLine?: string | null, labManagerUid?: string | null, email?: string | null, emailCc?: string | null, mobilePhone?: string | null, businessPhone?: string | null, address?: string | null, banking?: string | null, logo?: string | null, qualityStatement?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditLaboratorySettingMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: LaboratorySettingInputType;
}>;


export type EditLaboratorySettingMutation = { __typename?: 'Mutation', updateLaboratorySetting: { __typename?: 'LaboratorySettingType', uid: string, laboratoryUid: string, allowSelfVerification?: boolean | null, allowPatientRegistration?: boolean | null, allowSampleRegistration?: boolean | null, allowWorksheetCreation?: boolean | null, defaultRoute?: string | null, passwordLifetime?: number | null, inactivityLogOut?: number | null, defaultTheme?: string | null, autoReceiveSamples?: boolean | null, stickerCopies?: number | null, allowBilling?: boolean | null, allowAutoBilling?: boolean | null, currency?: string | null, paymentTermsDays?: number | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type GetLaboratoryQueryVariables = Exact<{
  setupName?: Scalars['String']['input'];
}>;


export type GetLaboratoryQuery = { __typename?: 'Query', laboratory: { __typename?: 'LaboratoryType', uid: string, setupName: string, labName: string, tagLine?: string | null, labManagerUid?: string | null, email?: string | null, emailCc?: string | null, mobilePhone?: string | null, businessPhone?: string | null, address?: string | null, banking?: string | null, logo?: string | null, qualityStatement?: string | null } };

export type GetLaboratorySettingQueryVariables = Exact<{
  setupName?: Scalars['String']['input'];
}>;


export type GetLaboratorySettingQuery = { __typename?: 'Query', laboratorySetting: { __typename?: 'LaboratorySettingType', uid: string, laboratoryUid: string, allowSelfVerification?: boolean | null, allowPatientRegistration?: boolean | null, allowSampleRegistration?: boolean | null, allowWorksheetCreation?: boolean | null, defaultRoute?: string | null, passwordLifetime?: number | null, inactivityLogOut?: number | null, defaultTheme?: string | null, autoReceiveSamples?: boolean | null, stickerCopies?: number | null, allowBilling?: boolean | null, allowAutoBilling?: boolean | null, currency?: string | null, paymentTermsDays?: number | null } };

export type UserAllQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type UserAllQuery = { __typename?: 'Query', userAll: { __typename?: 'UserCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null, email?: string | null, isActive: boolean, isSuperuser: boolean, mobilePhone?: string | null, userName: string, isBlocked: boolean, groups?: Array<{ __typename?: 'GroupType', uid: string, name?: string | null, keyword?: string | null, pages?: string | null, permissions?: Array<{ __typename?: 'PermissionType', uid: string, action?: string | null, target?: string | null }> | null }> | null }> | null } };

export type GroupsAndPermissionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GroupsAndPermissionsQuery = { __typename?: 'Query', groupAll: Array<{ __typename?: 'GroupType', uid: string, name?: string | null, keyword?: string | null, pages?: string | null, active?: boolean | null, permissions?: Array<{ __typename?: 'PermissionType', uid: string, action?: string | null, target?: string | null }> | null }>, permissionAll: Array<{ __typename?: 'PermissionType', uid: string, action?: string | null, target?: string | null }> };

export type GetAuditLogsQueryVariables = Exact<{
  targetType: Scalars['String']['input'];
  targetUid: Scalars['String']['input'];
}>;


export type GetAuditLogsQuery = { __typename?: 'Query', auditLogsFilter?: Array<{ __typename?: 'AuditLogType', uid: string, userUid?: string | null, targetType?: string | null, targetUid?: string | null, action?: number | null, stateBefore?: never | null, stateAfter?: never | null }> | null };

export type GetAllDepartmentsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllDepartmentsQuery = { __typename?: 'Query', departmentAll: Array<{ __typename?: 'DepartmentType', uid: string, name?: string | null, code?: string | null, description?: string | null }> };

export type AddCountryMutationVariables = Exact<{
  payload: CountryInputType;
}>;


export type AddCountryMutation = { __typename?: 'Mutation', createCountry: { __typename: 'CountryType', uid: string, name?: string | null, code?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditCountryMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: CountryInputType;
}>;


export type EditCountryMutation = { __typename?: 'Mutation', updateCountry: { __typename: 'CountryType', uid: string, name?: string | null, code?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddProvinceMutationVariables = Exact<{
  payload: ProvinceInputType;
}>;


export type AddProvinceMutation = { __typename?: 'Mutation', createProvince: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ProvinceType', uid: string, name?: string | null, code?: string | null, countryUid?: string | null } };

export type EditProvinceMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: ProvinceInputType;
}>;


export type EditProvinceMutation = { __typename?: 'Mutation', updateProvince: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ProvinceType', uid: string, name?: string | null, code?: string | null, countryUid?: string | null } };

export type AddDistrictMutationVariables = Exact<{
  payload: DistrictInputType;
}>;


export type AddDistrictMutation = { __typename?: 'Mutation', createDistrict: { __typename: 'DistrictType', uid: string, name?: string | null, code?: string | null, provinceUid?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditDistrictMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: DistrictInputType;
}>;


export type EditDistrictMutation = { __typename?: 'Mutation', updateDistrict: { __typename: 'DistrictType', uid: string, name?: string | null, code?: string | null, provinceUid?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type GetAllCountriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllCountriesQuery = { __typename?: 'Query', countryAll: Array<{ __typename?: 'CountryType', uid: string, name?: string | null, code?: string | null }> };

export type GetAllProvincesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllProvincesQuery = { __typename?: 'Query', provinceAll: { __typename?: 'ProvinceCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'ProvinceType', uid: string, name?: string | null, code?: string | null, email?: string | null, emailCc?: string | null, businessPhone?: string | null, mobilePhone?: string | null, countryUid?: string | null }> | null } };

export type FilterProvincesByCountryQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type FilterProvincesByCountryQuery = { __typename?: 'Query', provincesByCountryUid: Array<{ __typename?: 'ProvinceType', name?: string | null, uid: string, code?: string | null, countryUid?: string | null }> };

export type GetAllDistrictsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllDistrictsQuery = { __typename?: 'Query', districtAll: { __typename?: 'DistrictCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'DistrictType', uid: string, name?: string | null, code?: string | null, email?: string | null, emailCc?: string | null, businessPhone?: string | null, mobilePhone?: string | null, provinceUid?: string | null }> | null } };

export type FilterDistrictsByProvinceQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type FilterDistrictsByProvinceQuery = { __typename?: 'Query', districtsByProvinceUid: Array<{ __typename?: 'DistrictType', name?: string | null, uid: string, code?: string | null, provinceUid?: string | null }> };

export type AddCodingStandardMutationVariables = Exact<{
  payload: CodingStandardInputType;
}>;


export type AddCodingStandardMutation = { __typename?: 'Mutation', createCodingStandard: { __typename: 'CodingStandardType', uid: string, name: string, description?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditCodingStandardMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: CodingStandardInputType;
}>;


export type EditCodingStandardMutation = { __typename?: 'Mutation', updateCodingStandard: { __typename: 'CodingStandardType', uid: string, name: string, description?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddSampleTypeMutationVariables = Exact<{
  payload: SampleTypeInputType;
}>;


export type AddSampleTypeMutation = { __typename?: 'Mutation', createSampleType: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'SampleTypeTyp', uid: string, name: string, abbr: string, description?: string | null, active: boolean } };

export type EditSampleTypeMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: SampleTypeInputType;
}>;


export type EditSampleTypeMutation = { __typename?: 'Mutation', updateSampleType: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'SampleTypeTyp', uid: string, name: string, abbr: string, description?: string | null, active: boolean } };

export type AddSampleTypeMappingMutationVariables = Exact<{
  payload: SampleTypeMappingInputType;
}>;


export type AddSampleTypeMappingMutation = { __typename?: 'Mutation', createSampleTypeMapping: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'SampleTypeMappingType', uid: string, name?: string | null, description?: string | null, code: string, codingStandardUid: string, sampleTypeUid: string, codingStandard?: { __typename?: 'CodingStandardType', name: string } | null } };

export type EditSampleTypeMappingMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: SampleTypeMappingInputType;
}>;


export type EditSampleTypeMappingMutation = { __typename?: 'Mutation', updateSampleTypeMapping: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'SampleTypeMappingType', uid: string, name?: string | null, description?: string | null, code: string, codingStandardUid: string, sampleTypeUid: string, codingStandard?: { __typename?: 'CodingStandardType', name: string } | null } };

export type ReInstateSamplesMutationVariables = Exact<{
  samples: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type ReInstateSamplesMutation = { __typename?: 'Mutation', reInstateSamples: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ResultedSampleListingType', samples: Array<{ __typename?: 'SamplesWithResults', uid: string, status?: string | null }> } };

export type CloneSamplesMutationVariables = Exact<{
  samples: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type CloneSamplesMutation = { __typename?: 'Mutation', cloneSamples: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'SampleListingType', samples: Array<{ __typename?: 'SampleType', uid: string, parentId?: string | null, sampleId: string, priority: number, status?: string | null, sampleType?: { __typename?: 'SampleTypeTyp', uid: string, name: string } | null, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string, sortKey?: number | null }> | null, profiles: Array<{ __typename?: 'ProfileType', uid: string, name: string }> }> } };

export type CancelSamplesMutationVariables = Exact<{
  samples: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type CancelSamplesMutation = { __typename?: 'Mutation', cancelSamples: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ResultedSampleListingType', samples: Array<{ __typename?: 'SamplesWithResults', uid: string, status?: string | null }> } };

export type ReceiveSamplesMutationVariables = Exact<{
  samples: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type ReceiveSamplesMutation = { __typename?: 'Mutation', receiveSamples: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ResultedSampleListingType', samples: Array<{ __typename?: 'SamplesWithResults', uid: string, status?: string | null }> } };

export type PublishSamplesMutationVariables = Exact<{
  samples: Array<SamplePublishInputType> | SamplePublishInputType;
}>;


export type PublishSamplesMutation = { __typename?: 'Mutation', publishSamples: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'OperationSuccess', message: string } };

export type PrintSamplesMutationVariables = Exact<{
  samples: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type PrintSamplesMutation = { __typename?: 'Mutation', printSamples: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'SampleListingType', samples: Array<{ __typename?: 'SampleType', uid: string, status?: string | null }> } };

export type InvalidateSamplesMutationVariables = Exact<{
  samples: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type InvalidateSamplesMutation = { __typename?: 'Mutation', invalidateSamples: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'SampleListingType', samples: Array<{ __typename?: 'SampleType', uid: string, status?: string | null }> } };

export type VerifySamplesMutationVariables = Exact<{
  samples: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type VerifySamplesMutation = { __typename?: 'Mutation', verifySamples: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'SampleListingType', samples: Array<{ __typename?: 'SampleType', uid: string, status?: string | null }> } };

export type RejectSamplesMutationVariables = Exact<{
  samples: Array<SampleRejectInputType> | SampleRejectInputType;
}>;


export type RejectSamplesMutation = { __typename?: 'Mutation', rejectSamples: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'SampleListingType', samples: Array<{ __typename?: 'SampleType', uid: string, status?: string | null, rejectionReasons?: Array<{ __typename?: 'RejectionReasonType', uid: string, reason: string }> | null }> } };

export type AddResultOptionMutationVariables = Exact<{
  payload: ResultOptionInputType;
}>;


export type AddResultOptionMutation = { __typename?: 'Mutation', createResultOption: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'ResultOptionType', uid: string, optionKey: number, value: string, analysisUid: string, sampleTypes?: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string }> | null } };

export type EditResultOptionMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: ResultOptionInputType;
}>;


export type EditResultOptionMutation = { __typename?: 'Mutation', updateResultOption: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'ResultOptionType', uid: string, optionKey: number, value: string, analysisUid: string, sampleTypes?: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string }> | null } };

export type AddAnalysisInterimMutationVariables = Exact<{
  payload: AnalysisInterimInput;
}>;


export type AddAnalysisInterimMutation = { __typename?: 'Mutation', createAnalysisInterim: { __typename?: 'AnalysisInterimType', uid: string, key: number, value: string, analysisUid: string, instrumentUid: string } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditAnalysisInterimMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AnalysisInterimInput;
}>;


export type EditAnalysisInterimMutation = { __typename?: 'Mutation', updateAnalysisInterim: { __typename?: 'AnalysisInterimType', uid: string, key: number, value: string, analysisUid: string, instrumentUid: string } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddAnalysisCorrectionFactorMutationVariables = Exact<{
  payload: AnalysisCorrectionFactorInput;
}>;


export type AddAnalysisCorrectionFactorMutation = { __typename?: 'Mutation', createAnalysisCorrectionFactor: { __typename?: 'AnalysisCorrectionFactorType', uid: string, factor: number, analysisUid: string, instrumentUid: string, methodUid: string } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditAnalysisCorrectionFactorMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AnalysisCorrectionFactorInput;
}>;


export type EditAnalysisCorrectionFactorMutation = { __typename?: 'Mutation', updateAnalysisCorrectionFactor: { __typename?: 'AnalysisCorrectionFactorType', uid: string, factor: number, analysisUid: string, instrumentUid: string, methodUid: string } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddAnalysisUncertaintyMutationVariables = Exact<{
  payload: AnalysisUncertaintyInput;
}>;


export type AddAnalysisUncertaintyMutation = { __typename?: 'Mutation', createAnalysisUncertainty: { __typename?: 'AnalysisUncertaintyType', uid: string, value: number, min: number, max: number, analysisUid: string, instrumentUid: string, methodUid: string } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditAnalysisUncertaintyMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AnalysisUncertaintyInput;
}>;


export type EditAnalysisUncertaintyMutation = { __typename?: 'Mutation', updateAnalysisUncertainty: { __typename?: 'AnalysisUncertaintyType', uid: string, value: number, min: number, max: number, analysisUid: string, instrumentUid: string, methodUid: string } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddAnalysisDetectionLimitMutationVariables = Exact<{
  payload: AnalysisDetectionLimitInput;
}>;


export type AddAnalysisDetectionLimitMutation = { __typename?: 'Mutation', createAnalysisDetectionLimit: { __typename?: 'AnalysisDetectionLimitType', uid: string, lowerLimit: number, upperLimit: number, analysisUid: string, instrumentUid: string, methodUid: string } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditAnalysisDetectionLimitMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AnalysisDetectionLimitInput;
}>;


export type EditAnalysisDetectionLimitMutation = { __typename?: 'Mutation', updateAnalysisDetectionLimit: { __typename?: 'AnalysisDetectionLimitType', uid: string, lowerLimit: number, upperLimit: number, analysisUid: string, instrumentUid: string, methodUid: string } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddAnalysisSpecificationMutationVariables = Exact<{
  payload: AnalysisSpecificationInput;
}>;


export type AddAnalysisSpecificationMutation = { __typename?: 'Mutation', createAnalysisSpecification: { __typename?: 'AnalysisSpecificationType', uid: string, analysisUid: string, min?: number | null, max?: number | null, minWarn?: number | null, maxWarn?: number | null, minReport?: string | null, maxReport?: string | null, warnValues?: string | null, warnReport?: string | null, gender?: string | null, ageMin?: number | null, ageMax?: number | null, methodUid?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditAnalysisSpecificationMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AnalysisSpecificationInput;
}>;


export type EditAnalysisSpecificationMutation = { __typename?: 'Mutation', updateAnalysisSpecification: { __typename?: 'AnalysisSpecificationType', uid: string, analysisUid: string, min?: number | null, max?: number | null, minWarn?: number | null, maxWarn?: number | null, minReport?: string | null, maxReport?: string | null, warnValues?: string | null, warnReport?: string | null, gender?: string | null, ageMin?: number | null, ageMax?: number | null, methodUid?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddAnalysisServiceMutationVariables = Exact<{
  payload: AnalysisInputType;
}>;


export type AddAnalysisServiceMutation = { __typename?: 'Mutation', createAnalysis: { __typename: 'AnalysisWithProfiles', uid: string, name: string, keyword?: string | null, sortKey?: number | null, tatLengthMinutes?: number | null, precision?: number | null, requiredVerifications?: number | null, selfVerification?: boolean | null, description?: string | null, categoryUid?: string | null, departmentUid?: string | null, unitUid?: string | null, unit?: { __typename?: 'UnitType', uid: string, name: string } | null, sampleTypes?: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string }> | null, methods?: Array<{ __typename?: 'MethodType', uid: string, name?: string | null }> | null, resultOptions?: Array<{ __typename?: 'ResultOptionType', uid: string, optionKey: number, value: string }> | null, category?: { __typename?: 'AnalysisCategoryType', uid: string, name: string } | null, profiles?: Array<{ __typename?: 'ProfileType', uid: string, name: string }> | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditAnalysisServiceMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AnalysisInputType;
}>;


export type EditAnalysisServiceMutation = { __typename?: 'Mutation', updateAnalysis: { __typename: 'AnalysisWithProfiles', uid: string, name: string, keyword?: string | null, sortKey?: number | null, tatLengthMinutes?: number | null, precision?: number | null, requiredVerifications?: number | null, selfVerification?: boolean | null, description?: string | null, categoryUid?: string | null, departmentUid?: string | null, unitUid?: string | null, unit?: { __typename?: 'UnitType', uid: string, name: string } | null, sampleTypes?: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string }> | null, methods?: Array<{ __typename?: 'MethodType', uid: string, name?: string | null }> | null, resultOptions?: Array<{ __typename?: 'ResultOptionType', uid: string, optionKey: number, value: string }> | null, category?: { __typename?: 'AnalysisCategoryType', uid: string, name: string } | null, profiles?: Array<{ __typename?: 'ProfileType', uid: string, name: string }> | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddAnalysisMappingMutationVariables = Exact<{
  payload: AnalysisMappingInputType;
}>;


export type AddAnalysisMappingMutation = { __typename?: 'Mutation', createAnalysisMapping: { __typename?: 'AnalysisMappingType', uid: string, name?: string | null, description?: string | null, code: string, codingStandardUid: string, analysisUid: string, codingStandard?: { __typename?: 'CodingStandardType', name: string } | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditAnalysisMappingMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AnalysisMappingInputType;
}>;


export type EditAnalysisMappingMutation = { __typename?: 'Mutation', updateAnalysisMapping: { __typename?: 'AnalysisMappingType', uid: string, name?: string | null, description?: string | null, code: string, codingStandardUid: string, analysisUid: string, codingStandard?: { __typename?: 'CodingStandardType', name: string } | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddAnalysisProfileMutationVariables = Exact<{
  payload: ProfileInputType;
}>;


export type AddAnalysisProfileMutation = { __typename?: 'Mutation', createProfile: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'ProfileType', uid: string, name: string, description?: string | null, keyword?: string | null, active: boolean, departmentUid?: string | null, sampleTypes?: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string }> | null, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string, keyword?: string | null, active?: boolean | null }> | null } };

export type EditAnalysisProfileMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: ProfileInputType;
}>;


export type EditAnalysisProfileMutation = { __typename?: 'Mutation', updateProfile: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'ProfileType', uid: string, name: string, description?: string | null, keyword?: string | null, active: boolean, departmentUid?: string | null, sampleTypes?: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string }> | null, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string, keyword?: string | null, active?: boolean | null }> | null } };

export type AddProfileMappingMutationVariables = Exact<{
  payload: ProfileMappingInputType;
}>;


export type AddProfileMappingMutation = { __typename?: 'Mutation', createProfileMapping: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'ProfileMappingType', uid: string, name?: string | null, description?: string | null, code: string, codingStandardUid: string, profileUid: string, codingStandard?: { __typename?: 'CodingStandardType', name: string } | null } };

export type EditProfileMappingMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: ProfileMappingInputType;
}>;


export type EditProfileMappingMutation = { __typename?: 'Mutation', updateProfileMapping: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'ProfileMappingType', uid: string, name?: string | null, description?: string | null, code: string, codingStandardUid: string, profileUid: string, codingStandard?: { __typename?: 'CodingStandardType', name: string } | null } };

export type AddAnalysisTemplateMutationVariables = Exact<{
  payload: AnalysisTemplateInputType;
}>;


export type AddAnalysisTemplateMutation = { __typename?: 'Mutation', createAnalysisTemplate: { __typename?: 'AnalysisTemplateType', uid: string, name: string, description?: string | null, departmentUid?: string | null, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string, keyword?: string | null, active?: boolean | null }> | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditAnalysisTemplateMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AnalysisTemplateInputType;
}>;


export type EditAnalysisTemplateMutation = { __typename?: 'Mutation', updateAnalysisTemplate: { __typename?: 'AnalysisTemplateType', uid: string, name: string, description?: string | null, departmentUid?: string | null, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string, keyword?: string | null, active?: boolean | null }> | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditSampleApplyTemplateMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  analysisTemplateUid: Scalars['String']['input'];
}>;


export type EditSampleApplyTemplateMutation = { __typename?: 'Mutation', samplesApplyTemplate: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ResultedSampleListingType', samples: Array<{ __typename?: 'SamplesWithResults', uid: string }> } };

export type SampleManageAnalysisMutationVariables = Exact<{
  sampleUid: Scalars['String']['input'];
  payload: ManageAnalysisInputType;
}>;


export type SampleManageAnalysisMutation = { __typename?: 'Mutation', manageAnalyses: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ResultedSampleListingType', samples: Array<{ __typename?: 'SamplesWithResults', uid: string }> } };

export type AddAnalysisCategoryMutationVariables = Exact<{
  payload: AnalysisCategoryInputType;
}>;


export type AddAnalysisCategoryMutation = { __typename?: 'Mutation', createAnalysisCategory: { __typename?: 'AnalysisCategoryType', uid: string, name: string, active: boolean, description?: string | null, department?: { __typename?: 'DepartmentType', uid: string, name?: string | null } | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditAnalysisCategoryMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AnalysisCategoryInputType;
}>;


export type EditAnalysisCategoryMutation = { __typename?: 'Mutation', updateAnalysisCategory: { __typename?: 'AnalysisCategoryType', uid: string, name: string, active: boolean, description?: string | null, department?: { __typename?: 'DepartmentType', uid: string, name?: string | null } | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddAnalysisRequestMutationVariables = Exact<{
  payload: AnalysisRequestInputType;
}>;


export type AddAnalysisRequestMutation = { __typename?: 'Mutation', createAnalysisRequest: { __typename: 'AnalysisRequestWithSamples', uid: string, clientRequestId: string, createdAt?: string | null, patient: { __typename?: 'PatientType', uid: string, firstName?: string | null, lastName?: string | null, clientPatientId: string, gender?: string | null, dateOfBirth?: never | null, age?: number | null, ageDobEstimated: boolean, consentSms: boolean }, client?: { __typename?: 'ClientType', uid: string, name: string } | null, samples?: Array<{ __typename?: 'SampleType', uid: string, sampleId: string, priority: number, status?: string | null, sampleType?: { __typename?: 'SampleTypeTyp', uid: string, name: string } | null, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string, sortKey?: number | null }> | null, profiles: Array<{ __typename?: 'ProfileType', uid: string, name: string }> }> | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type SubmitAnalysisResultsMutationVariables = Exact<{
  analysisResults: Array<ArResultInputType> | ArResultInputType;
  sourceObject: Scalars['String']['input'];
  sourceObjectUid: Scalars['String']['input'];
}>;


export type SubmitAnalysisResultsMutation = { __typename?: 'Mutation', submitAnalysisResults: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'OperationSuccess', message: string } };

export type CancelAnalysisResultsMutationVariables = Exact<{
  analyses: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type CancelAnalysisResultsMutation = { __typename?: 'Mutation', cancelAnalysisResults: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'ResultListingType', results: Array<{ __typename?: 'AnalysisResultType', uid: string, status?: string | null }> } };

export type ReInstateAnalysisResultsMutationVariables = Exact<{
  analyses: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type ReInstateAnalysisResultsMutation = { __typename?: 'Mutation', reInstateAnalysisResults: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'ResultListingType', results: Array<{ __typename?: 'AnalysisResultType', uid: string, status?: string | null }> } };

export type VerifyAnalysisResultsMutationVariables = Exact<{
  analyses: Array<Scalars['String']['input']> | Scalars['String']['input'];
  sourceObject: Scalars['String']['input'];
  sourceObjectUid: Scalars['String']['input'];
}>;


export type VerifyAnalysisResultsMutation = { __typename?: 'Mutation', verifyAnalysisResults: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'OperationSuccess', message: string } };

export type RetractAnalysisResultsMutationVariables = Exact<{
  analyses: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type RetractAnalysisResultsMutation = { __typename?: 'Mutation', retractAnalysisResults: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'ResultListingType', results: Array<{ __typename?: 'AnalysisResultType', uid: string, status?: string | null, sampleUid: string, result?: string | null, analysisUid?: string | null, retest: boolean, reportable: boolean, createdAt?: string | null, createdByUid?: string | null, updatedAt?: string | null, updatedByUid?: string | null, sample: { __typename?: 'SampleType', uid: string, sampleId: string, status?: string | null, rejectionReasons?: Array<{ __typename?: 'RejectionReasonType', uid: string, reason: string }> | null }, analysis?: { __typename?: 'AnalysisType', uid: string, name: string, unitUid?: string | null, sortKey?: number | null, unit?: { __typename?: 'UnitType', uid: string, name: string } | null, interims?: Array<{ __typename?: 'AnalysisInterimType', uid: string, key: number, value: string, analysisUid: string, instrumentUid: string }> | null, resultOptions?: Array<{ __typename?: 'ResultOptionType', uid: string, optionKey: number, value: string }> | null } | null }> } };

export type RetestAnalysisResultsMutationVariables = Exact<{
  analyses: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type RetestAnalysisResultsMutation = { __typename?: 'Mutation', retestAnalysisResults: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'ResultListingType', results: Array<{ __typename?: 'AnalysisResultType', uid: string, status?: string | null, sampleUid: string, result?: string | null, analysisUid?: string | null, retest: boolean, reportable: boolean, createdAt?: string | null, createdByUid?: string | null, updatedAt?: string | null, updatedByUid?: string | null, sample: { __typename?: 'SampleType', uid: string, sampleId: string, status?: string | null, rejectionReasons?: Array<{ __typename?: 'RejectionReasonType', uid: string, reason: string }> | null }, analysis?: { __typename?: 'AnalysisType', uid: string, name: string, unitUid?: string | null, sortKey?: number | null, unit?: { __typename?: 'UnitType', uid: string, name: string } | null, interims?: Array<{ __typename?: 'AnalysisInterimType', uid: string, key: number, value: string, analysisUid: string, instrumentUid: string }> | null, resultOptions?: Array<{ __typename?: 'ResultOptionType', uid: string, optionKey: number, value: string }> | null } | null }> } };

export type AddQcLevelMutationVariables = Exact<{
  level: Scalars['String']['input'];
}>;


export type AddQcLevelMutation = { __typename?: 'Mutation', createQcLevel: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'QCLevelType', uid: string, level: string } };

export type EditQcLevelMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  level: Scalars['String']['input'];
}>;


export type EditQcLevelMutation = { __typename?: 'Mutation', updateQcLevel: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'QCLevelType', uid: string, level: string } };

export type AddQcTemplateMutationVariables = Exact<{
  payload: QcTemplateInputType;
}>;


export type AddQcTemplateMutation = { __typename?: 'Mutation', createQcTemplate: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'QCTemplateType', uid: string, name: string, description?: string | null, qcLevels: Array<{ __typename?: 'QCLevelType', uid: string, level: string }>, departments: Array<{ __typename?: 'DepartmentType', uid: string, name?: string | null }> } };

export type EditQcTemplateMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: QcTemplateInputType;
}>;


export type EditQcTemplateMutation = { __typename?: 'Mutation', updateQcTemplate: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'QCTemplateType', uid: string, name: string, description?: string | null, qcLevels: Array<{ __typename?: 'QCLevelType', uid: string, level: string }>, departments: Array<{ __typename?: 'DepartmentType', uid: string, name?: string | null }> } };

export type AddQcRequestMutationVariables = Exact<{
  samples: Array<QcSetInputType> | QcSetInputType;
}>;


export type AddQcRequestMutation = { __typename?: 'Mutation', createQcSet: { __typename: 'CreateQCSetData', qcSets: Array<{ __typename?: 'QCSetWithSamples', uid: string, name: string, note: string, status: string, createdAt?: string | null, samples?: Array<{ __typename?: 'SamplesWithResults', uid: string, sampleId: string, status?: string | null, createdAt?: string | null, updatedAt?: string | null, assigned: boolean, qcLevel?: { __typename?: 'QCLevelType', uid: string, level: string } | null, analysisResults?: Array<{ __typename?: 'AnalysisResultType', uid: string, status?: string | null, sampleUid: string, result?: string | null, analysisUid?: string | null, retest: boolean, reportable: boolean, analysis?: { __typename?: 'AnalysisType', uid: string, name: string, sortKey?: number | null, resultOptions?: Array<{ __typename?: 'ResultOptionType', uid: string, optionKey: number, value: string, sampleTypes?: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string }> | null }> | null } | null, method?: { __typename?: 'MethodType', uid: string, name?: string | null } | null, laboratoryInstrument?: { __typename?: 'LaboratoryInstrumentType', uid: string, labName?: string | null, instrument?: { __typename?: 'InstrumentType', uid: string, name?: string | null } | null } | null }> | null, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string, unitUid?: string | null, unit?: { __typename?: 'UnitType', uid: string, name: string } | null, resultOptions?: Array<{ __typename?: 'ResultOptionType', uid: string, optionKey: number, value: string, sampleTypes?: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string }> | null }> | null }> | null, profiles: Array<{ __typename?: 'ProfileType', uid: string, name: string }> }> | null }> } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddRejectionReasonMutationVariables = Exact<{
  reason: Scalars['String']['input'];
}>;


export type AddRejectionReasonMutation = { __typename?: 'Mutation', createRejectionReason: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'RejectionReasonType', uid: string, reason: string } };

export type EditRejectionReasonMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  reason: Scalars['String']['input'];
}>;


export type EditRejectionReasonMutation = { __typename?: 'Mutation', updateRejectionReason: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'RejectionReasonType', uid: string, reason: string } };

export type GetAllCodingStandardsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllCodingStandardsQuery = { __typename?: 'Query', codingStandardAll: Array<{ __typename?: 'CodingStandardType', uid: string, name: string, description?: string | null }> };

export type GetAllSampleTypesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllSampleTypesQuery = { __typename?: 'Query', sampleTypeAll: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string, abbr: string, description?: string | null, active: boolean }> };

export type GeSampleTypeMappingsBySampleTypeUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GeSampleTypeMappingsBySampleTypeUidQuery = { __typename?: 'Query', sampleTypeMappingsBySampleType: Array<{ __typename?: 'SampleTypeMappingType', uid: string, sampleTypeUid: string, codingStandardUid: string, name?: string | null, code: string, description?: string | null, codingStandard?: { __typename?: 'CodingStandardType', name: string } | null }> };

export type GetAllAnalysesServicesQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetAllAnalysesServicesQuery = { __typename?: 'Query', analysisAll: { __typename?: 'AnalysisCursorPage', items?: Array<{ __typename?: 'AnalysisWithProfiles', uid: string, name: string, keyword?: string | null, active?: boolean | null, sortKey?: number | null, tatLengthMinutes?: number | null, precision?: number | null, requiredVerifications?: number | null, selfVerification?: boolean | null, description?: string | null, categoryUid?: string | null, departmentUid?: string | null, unitUid?: string | null, unit?: { __typename?: 'UnitType', uid: string, name: string } | null, sampleTypes?: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string }> | null, specifications?: Array<{ __typename?: 'AnalysisSpecificationType', uid: string, analysisUid: string, unitUid?: string | null, min?: number | null, max?: number | null, minWarn?: number | null, maxWarn?: number | null, minReport?: string | null, maxReport?: string | null, warnValues?: string | null, warnReport?: string | null, gender?: string | null, ageMin?: number | null, ageMax?: number | null, methodUid?: string | null, unit?: { __typename?: 'UnitType', uid: string, name: string, description?: string | null } | null }> | null, uncertainties?: Array<{ __typename?: 'AnalysisUncertaintyType', uid: string, min: number, max: number, value: number, analysisUid: string, instrumentUid: string, methodUid: string }> | null, detectionLimits?: Array<{ __typename?: 'AnalysisDetectionLimitType', uid: string, lowerLimit: number, upperLimit: number, analysisUid: string, instrumentUid: string, methodUid: string }> | null, correctionFactors?: Array<{ __typename?: 'AnalysisCorrectionFactorType', uid: string, factor: number, analysisUid: string, instrumentUid: string, methodUid: string }> | null, interims?: Array<{ __typename?: 'AnalysisInterimType', uid: string, key: number, value: string, analysisUid: string, instrumentUid: string }> | null, instruments?: Array<{ __typename?: 'InstrumentType', uid: string, name?: string | null, keyword?: string | null }> | null, methods?: Array<{ __typename?: 'MethodType', uid: string, name?: string | null, keyword?: string | null, description?: string | null, instruments?: Array<{ __typename?: 'InstrumentType', uid: string, name?: string | null, keyword?: string | null, description?: string | null }> | null }> | null, resultOptions?: Array<{ __typename?: 'ResultOptionType', uid: string, optionKey: number, value: string, sampleTypes?: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string }> | null }> | null, category?: { __typename?: 'AnalysisCategoryType', uid: string, name: string } | null, profiles?: Array<{ __typename?: 'ProfileType', uid: string, name: string }> | null }> | null } };

export type GetAnalysesServicesByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAnalysesServicesByUidQuery = { __typename?: 'Query', analysisByUid: { __typename?: 'AnalysisType', uid: string, name: string, keyword?: string | null, description?: string | null, unit?: { __typename?: 'UnitType', uid: string, name: string } | null, category?: { __typename?: 'AnalysisCategoryType', uid: string, name: string } | null } };

export type GetAllAnalysesProfilesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllAnalysesProfilesQuery = { __typename?: 'Query', profileAll: Array<{ __typename?: 'ProfileType', uid: string, name: string, description?: string | null, keyword?: string | null, active: boolean, departmentUid?: string | null, sampleTypes?: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string }> | null, analyses?: Array<{ __typename?: 'AnalysisType', name: string, keyword?: string | null, active?: boolean | null, sortKey?: number | null }> | null }> };

export type GetAllAnalysesTemplatesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllAnalysesTemplatesQuery = { __typename?: 'Query', analysisTemplateAll: Array<{ __typename?: 'AnalysisTemplateType', uid: string, name: string, description?: string | null, departmentUid?: string | null, analyses?: Array<{ __typename?: 'AnalysisType', uid: string }> | null }> };

export type GetAnalysisMappingsByAnalysisUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAnalysisMappingsByAnalysisUidQuery = { __typename?: 'Query', analysisMappingsByAnalysis: Array<{ __typename?: 'AnalysisMappingType', uid: string, analysisUid: string, codingStandardUid: string, name?: string | null, code: string, description?: string | null, codingStandard?: { __typename?: 'CodingStandardType', name: string } | null }> };

export type GetAllProfilesAndServicesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllProfilesAndServicesQuery = { __typename?: 'Query', profileAll: Array<{ __typename?: 'ProfileType', uid: string, name: string, description?: string | null, keyword?: string | null, active: boolean, departmentUid?: string | null, sampleTypes?: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string }> | null, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string, keyword?: string | null, sortKey?: number | null, active?: boolean | null }> | null }>, analysisAll: { __typename?: 'AnalysisCursorPage', items?: Array<{ __typename?: 'AnalysisWithProfiles', uid: string, name: string, keyword?: string | null, active?: boolean | null, description?: string | null, sortKey?: number | null, tatLengthMinutes?: number | null, precision?: number | null, requiredVerifications?: number | null, selfVerification?: boolean | null, categoryUid?: string | null, departmentUid?: string | null, unitUid?: string | null, unit?: { __typename?: 'UnitType', uid: string, name: string } | null, sampleTypes?: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string }> | null, specifications?: Array<{ __typename?: 'AnalysisSpecificationType', uid: string, analysisUid: string, unitUid?: string | null, min?: number | null, max?: number | null, minWarn?: number | null, maxWarn?: number | null, minReport?: string | null, maxReport?: string | null, warnValues?: string | null, warnReport?: string | null, gender?: string | null, ageMin?: number | null, ageMax?: number | null, methodUid?: string | null, unit?: { __typename?: 'UnitType', uid: string, name: string, description?: string | null } | null }> | null, uncertainties?: Array<{ __typename?: 'AnalysisUncertaintyType', uid: string, min: number, max: number, value: number, analysisUid: string, instrumentUid: string, methodUid: string }> | null, detectionLimits?: Array<{ __typename?: 'AnalysisDetectionLimitType', uid: string, lowerLimit: number, upperLimit: number, analysisUid: string, instrumentUid: string, methodUid: string }> | null, correctionFactors?: Array<{ __typename?: 'AnalysisCorrectionFactorType', uid: string, factor: number, analysisUid: string, instrumentUid: string, methodUid: string }> | null, interims?: Array<{ __typename?: 'AnalysisInterimType', uid: string, key: number, value: string, analysisUid: string, instrumentUid: string }> | null, instruments?: Array<{ __typename?: 'InstrumentType', uid: string, name?: string | null, keyword?: string | null, description?: string | null }> | null, methods?: Array<{ __typename?: 'MethodType', uid: string, name?: string | null, keyword?: string | null, description?: string | null }> | null, resultOptions?: Array<{ __typename?: 'ResultOptionType', uid: string, optionKey: number, value: string, sampleTypes?: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string }> | null }> | null, category?: { __typename?: 'AnalysisCategoryType', uid: string, name: string } | null, profiles?: Array<{ __typename?: 'ProfileType', uid: string, name: string }> | null }> | null } };

export type GetProfileMappingsByProfileUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetProfileMappingsByProfileUidQuery = { __typename?: 'Query', profileMappingsByProfile: Array<{ __typename?: 'ProfileMappingType', uid: string, profileUid: string, codingStandardUid: string, name?: string | null, code: string, description?: string | null, codingStandard?: { __typename?: 'CodingStandardType', name: string } | null }> };

export type GetAllAnalysesCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllAnalysesCategoriesQuery = { __typename?: 'Query', analysisCategoryAll: Array<{ __typename?: 'AnalysisCategoryType', uid: string, name: string, description?: string | null, active: boolean, departmentUid?: string | null, department?: { __typename?: 'DepartmentType', uid: string, name?: string | null } | null }> };

export type GetAllSamplesQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  status: Scalars['String']['input'];
  text: Scalars['String']['input'];
  clientUid: Scalars['String']['input'];
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetAllSamplesQuery = { __typename?: 'Query', sampleAll: { __typename?: 'SampleCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, endCursor?: string | null, startCursor?: string | null }, items?: Array<{ __typename?: 'SamplesWithResults', uid: string, createdByUid?: string | null, createdAt?: string | null, dateCollected?: never | null, dateReceived?: never | null, dateSubmitted?: never | null, dateVerified?: never | null, datePublished?: never | null, datePrinted?: never | null, dateStored?: never | null, printed?: boolean | null, dueDate?: string | null, sampleId: string, priority: number, status?: string | null, storageSlot?: string | null, storageContainerUid?: string | null, createdBy?: { __typename?: 'UserType', firstName?: string | null, lastName?: string | null, userName: string } | null, analysisRequest?: { __typename?: 'AnalysisRequestType', uid: string, clientRequestId: string, patient: { __typename?: 'PatientType', uid: string, firstName?: string | null, lastName?: string | null, clientPatientId: string, gender?: string | null, dateOfBirth?: never | null, age?: number | null, ageDobEstimated: boolean, consentSms: boolean }, client?: { __typename?: 'ClientType', uid: string, name: string, code: string, district?: { __typename?: 'DistrictType', name?: string | null, province?: { __typename?: 'ProvinceType', name?: string | null } | null } | null } | null } | null, sampleType?: { __typename?: 'SampleTypeTyp', uid: string, name: string } | null, storageContainer?: { __typename?: 'StorageContainerType', uid: string, name: string, storageSection?: { __typename?: 'StorageSectionType', uid: string, name: string, storageLocation?: { __typename?: 'StorageLocationType', uid: string, name: string, storeRoom?: { __typename?: 'StoreRoomType', uid: string, name: string } | null } | null } | null } | null, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string, sortKey?: number | null }> | null, profiles: Array<{ __typename?: 'ProfileType', uid: string, name: string }>, rejectionReasons?: Array<{ __typename?: 'RejectionReasonType', uid: string, reason: string }> | null }> | null } };

export type GetSamplesForShipmentAssignQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  text: Scalars['String']['input'];
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  analysisUid?: InputMaybe<Scalars['String']['input']>;
  sampleTypeUid: Scalars['String']['input'];
}>;


export type GetSamplesForShipmentAssignQuery = { __typename?: 'Query', samplesForShipmentAssign: { __typename?: 'SampleCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'SamplesWithResults', uid: string, sampleId: string, status?: string | null, createdAt?: string | null, dateReceived?: never | null, sampleType?: { __typename?: 'SampleTypeTyp', name: string } | null, analysisRequest?: { __typename?: 'AnalysisRequestType', clientRequestId: string } | null, analysisResults?: Array<{ __typename?: 'AnalysisResultType', uid: string, assigned: boolean, status?: string | null, analysis?: { __typename?: 'AnalysisType', name: string } | null }> | null }> | null } };

export type GetAnalysesRequestsByPatientUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAnalysesRequestsByPatientUidQuery = { __typename?: 'Query', analysisRequestsByPatientUid: Array<{ __typename?: 'AnalysisRequestWithSamples', uid: string, clientRequestId: string, requestId: string, createdAt?: string | null, patient: { __typename?: 'PatientType', uid: string, firstName?: string | null, lastName?: string | null, clientPatientId: string, gender?: string | null, dateOfBirth?: never | null, age?: number | null, ageDobEstimated: boolean, consentSms: boolean }, client?: { __typename?: 'ClientType', uid: string, name: string } | null, samples?: Array<{ __typename?: 'SampleType', uid: string, createdByUid?: string | null, createdAt?: string | null, sampleId: string, priority: number, status?: string | null, storageSlot?: string | null, storageContainerUid?: string | null, createdBy?: { __typename?: 'UserType', firstName?: string | null, lastName?: string | null, userName: string } | null, sampleType?: { __typename?: 'SampleTypeTyp', uid: string, name: string } | null, storageContainer?: { __typename?: 'StorageContainerType', uid: string, name: string, storageSection?: { __typename?: 'StorageSectionType', uid: string, name: string, storageLocation?: { __typename?: 'StorageLocationType', uid: string, name: string, storeRoom?: { __typename?: 'StoreRoomType', uid: string, name: string } | null } | null } | null } | null, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string, sortKey?: number | null }> | null, rejectionReasons?: Array<{ __typename?: 'RejectionReasonType', uid: string, reason: string }> | null, profiles: Array<{ __typename?: 'ProfileType', uid: string, name: string }> }> | null }> };

export type GetAnalysesRequestsByClientUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAnalysesRequestsByClientUidQuery = { __typename?: 'Query', analysisRequestsByClientUid: Array<{ __typename?: 'AnalysisRequestWithSamples', uid: string, clientRequestId: string, createdAt?: string | null, patient: { __typename?: 'PatientType', uid: string, firstName?: string | null, lastName?: string | null, clientPatientId: string, gender?: string | null, dateOfBirth?: never | null, age?: number | null, ageDobEstimated: boolean, consentSms: boolean }, client?: { __typename?: 'ClientType', uid: string, name: string } | null, samples?: Array<{ __typename?: 'SampleType', uid: string, createdByUid?: string | null, createdAt?: string | null, sampleId: string, priority: number, status?: string | null, storageSlot?: string | null, storageContainerUid?: string | null, createdBy?: { __typename?: 'UserType', firstName?: string | null, lastName?: string | null, userName: string } | null, sampleType?: { __typename?: 'SampleTypeTyp', uid: string, name: string } | null, storageContainer?: { __typename?: 'StorageContainerType', uid: string, name: string, storageSection?: { __typename?: 'StorageSectionType', uid: string, name: string, storageLocation?: { __typename?: 'StorageLocationType', uid: string, name: string, storeRoom?: { __typename?: 'StoreRoomType', uid: string, name: string } | null } | null } | null } | null, rejectionReasons?: Array<{ __typename?: 'RejectionReasonType', uid: string, reason: string }> | null, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string, sortKey?: number | null }> | null, profiles: Array<{ __typename?: 'ProfileType', uid: string, name: string }> }> | null }> };

export type GetAnalysesResultsBySampleUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAnalysesResultsBySampleUidQuery = { __typename?: 'Query', analysisResultBySampleUid: Array<{ __typename?: 'AnalysisResultType', uid: string, status?: string | null, sampleUid: string, result?: string | null, analysisUid?: string | null, retest: boolean, reportable: boolean, dateSubmitted?: never | null, dueDate?: string | null, dateVerified?: never | null, createdAt?: string | null, createdByUid?: string | null, updatedAt?: string | null, updatedByUid?: string | null, worksheetUid?: string | null, worksheetId?: string | null, method?: { __typename?: 'MethodType', uid: string, name?: string | null } | null, laboratoryInstrument?: { __typename?: 'LaboratoryInstrumentType', uid: string, labName?: string | null, instrument?: { __typename?: 'InstrumentType', uid: string, name?: string | null } | null } | null, sample: { __typename?: 'SampleType', uid: string, sampleId: string, status?: string | null, rejectionReasons?: Array<{ __typename?: 'RejectionReasonType', uid: string, reason: string }> | null }, analysis?: { __typename?: 'AnalysisType', uid: string, name: string, unitUid?: string | null, sortKey?: number | null, unit?: { __typename?: 'UnitType', uid: string, name: string } | null, interims?: Array<{ __typename?: 'AnalysisInterimType', uid: string, key: number, value: string, analysisUid: string, instrumentUid: string }> | null, resultOptions?: Array<{ __typename?: 'ResultOptionType', uid: string, optionKey: number, value: string, sampleTypes?: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string }> | null }> | null, instruments?: Array<{ __typename?: 'InstrumentType', uid: string, name?: string | null, laboratoryInstruments?: Array<{ __typename?: 'LaboratoryInstrumentType', uid: string, labName?: string | null, serialNumber?: string | null }> | null }> | null, methods?: Array<{ __typename?: 'MethodType', uid: string, name?: string | null }> | null } | null, submittedBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null, userName: string } | null, verifiedBy?: Array<{ __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null, userName: string }> | null }> };

export type GetAnalysesResultsForWsAssignQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  text: Scalars['String']['input'];
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  analysisUid: Scalars['String']['input'];
  sampleTypeUid: Scalars['String']['input'];
}>;


export type GetAnalysesResultsForWsAssignQuery = { __typename?: 'Query', analysisResultsForWsAssign: { __typename?: 'AnalysisResultCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'AnalysisResultType', uid: string, assigned: boolean, sampleUid: string, status?: string | null, analysisUid?: string | null, sample: { __typename?: 'SampleType', sampleId: string, priority: number, status?: string | null, dateReceived?: never | null, createdAt?: string | null, sampleType?: { __typename?: 'SampleTypeTyp', name: string } | null }, analysis?: { __typename?: 'AnalysisType', name: string } | null }> | null } };

export type GetAnalysisResultMutationQueryVariables = Exact<{
  resultUid: Scalars['String']['input'];
}>;


export type GetAnalysisResultMutationQuery = { __typename?: 'Query', resultMutationByResultUid?: { __typename?: 'ResultMutationType', uid: string, resultUid: string, before: string, after: string, mutation: string, date?: string | null, createdByUid?: string | null, createdBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null, userName: string } | null } | null };

export type GetSampleByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetSampleByUidQuery = { __typename?: 'Query', sampleByUid: { __typename?: 'SampleType', uid: string, createdByUid?: string | null, createdAt?: string | null, dateReceived?: never | null, receivedByUid?: string | null, dateCollected?: never | null, dateSubmitted?: never | null, submittedByUid?: string | null, dateVerified?: never | null, verifiedByUid?: string | null, datePublished?: never | null, datePrinted?: never | null, printedByUid?: string | null, dateInvalidated?: never | null, invalidatedByUid?: string | null, dateCancelled?: never | null, cancelledByUid?: string | null, dueDate?: string | null, sampleId: string, priority: number, status?: string | null, dateStored?: never | null, storageSlot?: string | null, storageContainerUid?: string | null, createdBy?: { __typename?: 'UserType', firstName?: string | null, lastName?: string | null, userName: string } | null, analysisRequest?: { __typename?: 'AnalysisRequestType', uid: string, clientRequestId: string, patient: { __typename?: 'PatientType', uid: string, firstName?: string | null, lastName?: string | null, clientPatientId: string, gender?: string | null, dateOfBirth?: never | null, age?: number | null, ageDobEstimated: boolean, consentSms: boolean }, client?: { __typename?: 'ClientType', uid: string, name: string } | null } | null, sampleType?: { __typename?: 'SampleTypeTyp', uid: string, name: string } | null, storageContainer?: { __typename?: 'StorageContainerType', uid: string, name: string, storageSection?: { __typename?: 'StorageSectionType', uid: string, name: string, storageLocation?: { __typename?: 'StorageLocationType', uid: string, name: string, storeRoom?: { __typename?: 'StoreRoomType', uid: string, name: string } | null } | null } | null } | null, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string }> | null, profiles: Array<{ __typename?: 'ProfileType', uid: string, name: string }>, rejectionReasons?: Array<{ __typename?: 'RejectionReasonType', uid: string, reason: string }> | null } };

export type GetSampleParentIdQueryVariables = Exact<{
  parentId: Scalars['String']['input'];
  text?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetSampleParentIdQuery = { __typename?: 'Query', sampleByParentId: Array<{ __typename?: 'SampleType', uid: string, sampleId: string, status?: string | null }> };

export type GetSamplesByStorageContainerUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetSamplesByStorageContainerUidQuery = { __typename?: 'Query', samplesByStorageContainerUid: Array<{ __typename?: 'SampleType', uid: string, sampleId: string, storageSlot?: string | null, storageSlotIndex?: number | null, storageContainerUid?: string | null, status?: string | null, analysisRequest?: { __typename?: 'AnalysisRequestType', clientRequestId: string } | null }> };

export type GetAllQcLevelsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllQcLevelsQuery = { __typename?: 'Query', qcLevelAll: Array<{ __typename?: 'QCLevelType', uid: string, level: string }> };

export type GetAllQcTemplatesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllQcTemplatesQuery = { __typename?: 'Query', qcTemplateAll: Array<{ __typename?: 'QCTemplateType', uid: string, name: string, description?: string | null, qcLevels: Array<{ __typename?: 'QCLevelType', uid: string, level: string }>, departments: Array<{ __typename?: 'DepartmentType', uid: string, name?: string | null }> }> };

export type GetQcSeTsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  status: Scalars['String']['input'];
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetQcSeTsQuery = { __typename?: 'Query', qcSetAll: { __typename?: 'QCSetCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, endCursor?: string | null, startCursor?: string | null }, items?: Array<{ __typename?: 'QCSetWithSamples', uid: string, name: string, note: string, status: string, createdAt?: string | null, samples?: Array<{ __typename?: 'SamplesWithResults', uid: string, sampleId: string, status?: string | null, createdByUid?: string | null, createdAt?: string | null, updatedAt?: string | null, assigned: boolean, createdBy?: { __typename?: 'UserType', firstName?: string | null, lastName?: string | null, userName: string } | null, qcLevel?: { __typename?: 'QCLevelType', uid: string, level: string } | null, analysisResults?: Array<{ __typename?: 'AnalysisResultType', uid: string, status?: string | null, sampleUid: string, result?: string | null, analysisUid?: string | null, retest: boolean, reportable: boolean, analysis?: { __typename?: 'AnalysisType', uid: string, name: string, sortKey?: number | null, resultOptions?: Array<{ __typename?: 'ResultOptionType', uid: string, optionKey: number, value: string, sampleTypes?: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string }> | null }> | null } | null, method?: { __typename?: 'MethodType', uid: string, name?: string | null } | null, laboratoryInstrument?: { __typename?: 'LaboratoryInstrumentType', uid: string, labName?: string | null, instrument?: { __typename?: 'InstrumentType', uid: string, name?: string | null } | null } | null }> | null, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string, unitUid?: string | null, unit?: { __typename?: 'UnitType', uid: string, name: string } | null, resultOptions?: Array<{ __typename?: 'ResultOptionType', uid: string, optionKey: number, value: string, sampleTypes?: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string }> | null }> | null }> | null, profiles: Array<{ __typename?: 'ProfileType', uid: string, name: string }> }> | null }> | null } };

export type GetQcSetByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetQcSetByUidQuery = { __typename?: 'Query', qcSetByUid: { __typename?: 'QCSetWithSamples', uid: string, name: string, note: string, createdAt?: string | null, samples?: Array<{ __typename?: 'SamplesWithResults', uid: string, sampleId: string, status?: string | null, createdAt?: string | null, updatedAt?: string | null, assigned: boolean, qcLevel?: { __typename?: 'QCLevelType', uid: string, level: string } | null, analysisResults?: Array<{ __typename?: 'AnalysisResultType', uid: string, status?: string | null, sampleUid: string, result?: string | null, analysisUid?: string | null, retest: boolean, reportable: boolean, dateSubmitted?: never | null, dateVerified?: never | null, analysis?: { __typename?: 'AnalysisType', uid: string, name: string, sortKey?: number | null, interims?: Array<{ __typename?: 'AnalysisInterimType', uid: string, key: number, value: string }> | null, resultOptions?: Array<{ __typename?: 'ResultOptionType', uid: string, optionKey: number, value: string, sampleTypes?: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string }> | null }> | null, instruments?: Array<{ __typename?: 'InstrumentType', uid: string, name?: string | null, laboratoryInstruments?: Array<{ __typename?: 'LaboratoryInstrumentType', uid: string, labName?: string | null, serialNumber?: string | null }> | null }> | null, methods?: Array<{ __typename?: 'MethodType', uid: string, name?: string | null }> | null } | null, laboratoryInstrument?: { __typename?: 'LaboratoryInstrumentType', uid: string, labName?: string | null, instrument?: { __typename?: 'InstrumentType', uid: string, name?: string | null } | null } | null, method?: { __typename?: 'MethodType', uid: string, name?: string | null } | null, submittedBy?: { __typename?: 'UserType', uid: string, userName: string, firstName?: string | null, lastName?: string | null } | null, verifiedBy?: Array<{ __typename?: 'UserType', uid: string, userName: string, firstName?: string | null, lastName?: string | null }> | null }> | null }> | null } };

export type GetReferenceRunsQueryVariables = Exact<{
  analyses: Array<Scalars['String']['input']> | Scalars['String']['input'];
  month: Scalars['Int']['input'];
  year: Scalars['Int']['input'];
}>;


export type GetReferenceRunsQuery = { __typename?: 'Query', qcChartData: Array<{ __typename?: 'AnalysisResultType', result?: string | null, dateVerified?: never | null, analysis?: { __typename?: 'AnalysisType', uid: string, name: string } | null, sample: { __typename?: 'SampleType', qcLevel?: { __typename?: 'QCLevelType', level: string } | null } }> };

export type ResultOptionsByAnalysisUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type ResultOptionsByAnalysisUidQuery = { __typename?: 'Query', resultOptionsByAnalysisUid: { __typename?: 'ResultOptionType', uid: string, optionKey: number, value: string, analysisUid: string, sampleTypes?: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string }> | null } };

export type GetAllRejectionReasonsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllRejectionReasonsQuery = { __typename?: 'Query', rejectionReasonsAll: Array<{ __typename?: 'RejectionReasonType', uid: string, reason: string }> };

export type ImpressSamplesMetaQueryVariables = Exact<{
  uids: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type ImpressSamplesMetaQuery = { __typename?: 'Query', impressReportsMeta: Array<{ __typename?: 'ReportImpressType', uid: string, state?: string | null, sampleUid?: string | null, jsonContent?: never | null, emailRequired?: boolean | null, emailSent?: boolean | null, smsRequired?: boolean | null, smsSent?: boolean | null, generatedByUid?: string | null, createdAt: never, sample?: { __typename?: 'SampleType', sampleId: string } | null, generatedBy?: { __typename?: 'UserType', firstName?: string | null, lastName?: string | null } | null }> };

export type ImpressSampleReportsQueryVariables = Exact<{
  sampleIds: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type ImpressSampleReportsQuery = { __typename?: 'Query', impressReportsDownload?: never | null };

export type ImpressSampleReportQueryVariables = Exact<{
  impressUid: Scalars['String']['input'];
}>;


export type ImpressSampleReportQuery = { __typename?: 'Query', impressReportDownload?: never | null };

export type BarcodeSamplesQueryVariables = Exact<{
  sampleUids: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type BarcodeSamplesQuery = { __typename?: 'Query', barcodeSamples?: Array<never> | null };

export type EditProfilePricingMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: PriceInput;
}>;


export type EditProfilePricingMutation = { __typename?: 'Mutation', updateProfilePrice: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ProfilePriceType', uid: string, isActive: boolean, amount: number } };

export type EditAnalysisPricingMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: PriceInput;
}>;


export type EditAnalysisPricingMutation = { __typename?: 'Mutation', updateAnalysisPrice: { __typename: 'AnalysisPriceType', uid: string, isActive: boolean, amount: number } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditProfileDiscountMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: PriceDiscountInput;
}>;


export type EditProfileDiscountMutation = { __typename?: 'Mutation', updateProfileDiscount: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ProfileDiscountType', uid: string, profileUid: string, name: string, discountType: string, valueType: string, startDate: never, endDate: never, voucherUid?: string | null, valuePercent: number, valueAmount: number, isActive: boolean } };

export type EditAnalysisDiscountMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: PriceDiscountInput;
}>;


export type EditAnalysisDiscountMutation = { __typename?: 'Mutation', updateAnalysisDiscount: { __typename: 'AnalysisDiscountType', uid: string, analysisUid: string, name: string, discountType: string, valueType: string, startDate: never, endDate: never, voucherUid?: string | null, valuePercent: number, valueAmount: number, isActive: boolean } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddVoucherMutationVariables = Exact<{
  payload: VoucherInput;
}>;


export type AddVoucherMutation = { __typename?: 'Mutation', createVoucher: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'VoucherType', uid: string, name: string, usageLimit: number, used: number, startDate: string, endDate: string, oncePerCustomer: boolean, oncePerOrder: boolean, createdAt?: string | null, createdByUid?: string | null, updatedAt?: string | null, updatedByUid?: string | null } };

export type EditVoucherMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: VoucherInput;
}>;


export type EditVoucherMutation = { __typename?: 'Mutation', updateVoucher: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'VoucherType', uid: string, name: string, usageLimit: number, used: number, startDate: string, endDate: string, oncePerCustomer: boolean, oncePerOrder: boolean, createdAt?: string | null, createdByUid?: string | null, updatedAt?: string | null, updatedByUid?: string | null } };

export type AddVoucherCodeMutationVariables = Exact<{
  payload: VoucherCodeInput;
}>;


export type AddVoucherCodeMutation = { __typename?: 'Mutation', createVoucherCode: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'VoucherCodeType', uid: string, voucherUid: string, code: string, usageLimit: number, used: number, isActive: boolean, createdAt: string, createdByUid?: string | null, updatedAt: string, updatedByUid?: string | null } };

export type EditVoucherCodeMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: VoucherCodeInput;
}>;


export type EditVoucherCodeMutation = { __typename?: 'Mutation', updateVoucherCode: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'VoucherCodeType', uid: string, voucherUid: string, code: string, usageLimit: number, used: number, isActive: boolean, createdAt: string, createdByUid?: string | null, updatedAt: string, updatedByUid?: string | null } };

export type AddTestBillTransactionMutationVariables = Exact<{
  payload: BillTransactionInput;
}>;


export type AddTestBillTransactionMutation = { __typename?: 'Mutation', createTestBillTransaction: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'TestBillTransactionType', uid: string, testBillUid: string, kind: string, amount: number, isSuccess: boolean, actionRequired: boolean, processed: boolean, notes: string, createdAt?: string | null, createdByUid?: string | null } };

export type ConfirmTestBillTransactionMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
}>;


export type ConfirmTestBillTransactionMutation = { __typename?: 'Mutation', confirmTestBillTransaction: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'TestBillTransactionType', uid: string, testBillUid: string, kind: string, amount: number, isSuccess: boolean, actionRequired: boolean, processed: boolean, notes: string, createdAt?: string | null, createdByUid?: string | null } };

export type ApplyBillVoucherMutationVariables = Exact<{
  payload: ApplyVoucherInput;
}>;


export type ApplyBillVoucherMutation = { __typename?: 'Mutation', applyVoucher: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'TestBillTransactionType', uid: string, testBillUid: string, kind: string, amount: number, isSuccess: boolean, actionRequired: boolean, processed: boolean, notes: string, createdAt?: string | null, createdByUid?: string | null } };

export type GetPiceForProfileQueryVariables = Exact<{
  profileUid: Scalars['String']['input'];
}>;


export type GetPiceForProfileQuery = { __typename?: 'Query', priceForProfile?: { __typename?: 'ProfilePriceType', uid: string, profileUid: string, isActive: boolean, amount: number } | null };

export type GetPriceForAnalysisQueryVariables = Exact<{
  analysisUid: Scalars['String']['input'];
}>;


export type GetPriceForAnalysisQuery = { __typename?: 'Query', priceForAnalysis?: { __typename?: 'AnalysisPriceType', uid: string, analysisUid: string, isActive: boolean, amount: number } | null };

export type GetDiscountForProfileQueryVariables = Exact<{
  profileUid: Scalars['String']['input'];
}>;


export type GetDiscountForProfileQuery = { __typename?: 'Query', discountForProfile?: { __typename?: 'ProfileDiscountType', uid: string, profileUid: string, name: string, discountType: string, valueType: string, startDate: never, endDate: never, voucherUid?: string | null, valuePercent: number, valueAmount: number, isActive: boolean, voucher?: { __typename?: 'VoucherType', uid: string, name: string, usageLimit: number, used: number, startDate: string, endDate: string } | null } | null };

export type GetDiscountForAnalysisQueryVariables = Exact<{
  analysisUid: Scalars['String']['input'];
}>;


export type GetDiscountForAnalysisQuery = { __typename?: 'Query', discountForAnalysis?: { __typename?: 'AnalysisDiscountType', uid: string, analysisUid: string, name: string, discountType: string, valueType: string, startDate: never, endDate: never, voucherUid?: string | null, valuePercent: number, valueAmount: number, isActive: boolean, voucher?: { __typename?: 'VoucherType', uid: string, name: string, usageLimit: number, used: number, startDate: string, endDate: string } | null } | null };

export type GetAllVouchersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllVouchersQuery = { __typename?: 'Query', voucherAll?: Array<{ __typename?: 'VoucherType', uid: string, name: string, usageLimit: number, used: number, startDate: string, endDate: string, oncePerCustomer: boolean, oncePerOrder: boolean, createdAt?: string | null, createdByUid?: string | null, updatedAt?: string | null, updatedByUid?: string | null, codes?: Array<{ __typename?: 'VoucherCodeType', uid: string, code: string, usageLimit: number, used: number, isActive: boolean, createdAt: string, createdByUid?: string | null, updatedAt: string, updatedByUid?: string | null }> | null }> | null };

export type GetVoucherByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetVoucherByUidQuery = { __typename?: 'Query', voucherByUid?: { __typename?: 'VoucherType', uid: string, name: string, usageLimit: number, used: number, startDate: string, endDate: string, oncePerCustomer: boolean, oncePerOrder: boolean, createdAt?: string | null, createdByUid?: string | null, updatedAt?: string | null, updatedByUid?: string | null, codes?: Array<{ __typename?: 'VoucherCodeType', uid: string, code: string, usageLimit: number, used: number, isActive: boolean, createdAt: string, createdByUid?: string | null, updatedAt: string, updatedByUid?: string | null }> | null } | null };

export type GetVoucherCodesQueryVariables = Exact<{
  voucherUid: Scalars['String']['input'];
}>;


export type GetVoucherCodesQuery = { __typename?: 'Query', voucherCodes?: Array<{ __typename?: 'VoucherCodeType', uid: string, voucherUid: string, code: string, usageLimit: number, used: number, isActive: boolean, createdAt: string, createdByUid?: string | null, updatedAt: string, updatedByUid?: string | null }> | null };

export type GetBillsForPatientQueryVariables = Exact<{
  patientUid: Scalars['String']['input'];
}>;


export type GetBillsForPatientQuery = { __typename?: 'Query', billsForPatient?: Array<{ __typename?: 'TestBillType', uid: string, billId: string, patientUid: string, clientUid: string, isActive: boolean, toConfirm: boolean, partial: boolean, totalCharged: number, totalPaid: number, createdAt?: string | null, updatedAt?: string | null, client: { __typename?: 'ClientType', name: string }, orders?: Array<{ __typename?: 'AnalysisRequestType', uid: string, requestId: string, clientRequestId: string }> | null }> | null };

export type GetBillTransactionsQueryVariables = Exact<{
  billUid: Scalars['String']['input'];
}>;


export type GetBillTransactionsQuery = { __typename?: 'Query', billTransactions?: Array<{ __typename?: 'TestBillTransactionType', uid: string, testBillUid: string, kind: string, amount: number, isSuccess: boolean, actionRequired: boolean, processed: boolean, notes: string, createdAt?: string | null, createdByUid?: string | null }> | null };

export type ImpressBillingReportQueryVariables = Exact<{
  billUid: Scalars['String']['input'];
}>;


export type ImpressBillingReportQuery = { __typename?: 'Query', billInvoiceCreate?: never | null };

export type AddClientMutationVariables = Exact<{
  payload: ClientInputType;
}>;


export type AddClientMutation = { __typename?: 'Mutation', createClient: { __typename: 'ClientType', uid: string, name: string, code: string, districtUid?: string | null, district?: { __typename?: 'DistrictType', uid: string, name?: string | null, province?: { __typename?: 'ProvinceType', uid: string, name?: string | null, country?: { __typename?: 'CountryType', uid: string, name?: string | null } | null } | null } | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditClientMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: ClientInputType;
}>;


export type EditClientMutation = { __typename?: 'Mutation', updateClient: { __typename: 'ClientType', uid: string, name: string, code: string, districtUid?: string | null, district?: { __typename?: 'DistrictType', uid: string, name?: string | null, province?: { __typename?: 'ProvinceType', uid: string, name?: string | null, country?: { __typename?: 'CountryType', uid: string, name?: string | null } | null } | null } | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddClientContactMutationVariables = Exact<{
  payload: ClientContactInputType;
}>;


export type AddClientContactMutation = { __typename?: 'Mutation', createClientContact: { __typename: 'ClientContactType', uid: string, firstName?: string | null, lastName?: string | null, email?: string | null, mobilePhone?: string | null, consentSms: boolean } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditClientContactMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: ClientContactInputType;
}>;


export type EditClientContactMutation = { __typename?: 'Mutation', updateClientContact: { __typename: 'ClientContactType', uid: string, firstName?: string | null, lastName?: string | null, email?: string | null, mobilePhone?: string | null, consentSms: boolean } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type DeleteClientContactMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type DeleteClientContactMutation = { __typename?: 'Mutation', deleteClientContact: { __typename?: 'DeletedItem', uid: string } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type GetAllClientsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetAllClientsQuery = { __typename?: 'Query', clientAll: { __typename?: 'ClientCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'ClientType', uid: string, name: string, code: string, contacts?: Array<{ __typename?: 'ClientContactType', uid: string, firstName?: string | null, lastName?: string | null, email?: string | null, mobilePhone?: string | null, consentSms: boolean }> | null, district?: { __typename?: 'DistrictType', uid: string, name?: string | null, province?: { __typename?: 'ProvinceType', uid: string, name?: string | null, country?: { __typename?: 'CountryType', uid: string, name?: string | null } | null } | null } | null }> | null } };

export type SearchClientsQueryVariables = Exact<{
  queryString: Scalars['String']['input'];
}>;


export type SearchClientsQuery = { __typename?: 'Query', clientSearch: Array<{ __typename?: 'ClientType', uid: string, name: string, code: string, district?: { __typename?: 'DistrictType', uid: string, name?: string | null, province?: { __typename?: 'ProvinceType', uid: string, name?: string | null, country?: { __typename?: 'CountryType', uid: string, name?: string | null } | null } | null } | null }> };

export type GetClientContactsByClientUidQueryVariables = Exact<{
  clientUid: Scalars['String']['input'];
}>;


export type GetClientContactsByClientUidQuery = { __typename?: 'Query', clientContactByClientUid: Array<{ __typename?: 'ClientContactType', uid: string, firstName?: string | null, lastName?: string | null, email?: string | null, mobilePhone?: string | null, consentSms: boolean }> };

export type GetClientByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetClientByUidQuery = { __typename?: 'Query', clientByUid: { __typename?: 'ClientType', uid: string, name: string, code: string, districtUid?: string | null, district?: { __typename?: 'DistrictType', uid: string, name?: string | null, provinceUid?: string | null, province?: { __typename?: 'ProvinceType', uid: string, name?: string | null, countryUid?: string | null, country?: { __typename?: 'CountryType', uid: string, name?: string | null } | null } | null } | null } };

export type GetSampleGroupByStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSampleGroupByStatusQuery = { __typename?: 'Query', countSampleGroupByStatus: { __typename?: 'GroupedCounts', data: Array<{ __typename: 'GroupCount', group: string, count?: number | null }> } };

export type GetExtrasGroupByStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type GetExtrasGroupByStatusQuery = { __typename?: 'Query', countExtrasGroupByStatus: { __typename?: 'GroupedCounts', data: Array<{ __typename: 'GroupCount', group: string, count?: number | null }> } };

export type GetAnalysisGroupByStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAnalysisGroupByStatusQuery = { __typename?: 'Query', countAnalyteGroupByStatus: { __typename?: 'GroupedCounts', data: Array<{ __typename: 'GroupCount', group: string, count?: number | null }> } };

export type GetWorksheetGroupByStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type GetWorksheetGroupByStatusQuery = { __typename?: 'Query', countWorksheetGroupByStatus: { __typename?: 'GroupedCounts', data: Array<{ __typename: 'GroupCount', group: string, count?: number | null }> } };

export type GetAnalysisGroupByInstrumentQueryVariables = Exact<{
  startDate: Scalars['String']['input'];
  endDate: Scalars['String']['input'];
}>;


export type GetAnalysisGroupByInstrumentQuery = { __typename?: 'Query', countAnalyteGroupByInstrument: { __typename?: 'GroupedCounts', data: Array<{ __typename: 'GroupCount', group: string, count?: number | null }> } };

export type SampleProcessPeformanceQueryVariables = Exact<{
  startDate: Scalars['String']['input'];
  endDate: Scalars['String']['input'];
}>;


export type SampleProcessPeformanceQuery = { __typename?: 'Query', sampleProcessPerformance: { __typename: 'ProcessStatistics', data: Array<{ __typename?: 'ProcessData', process: string, counts?: { __typename?: 'ProcessCounts', totalSamples?: number | null, totalLate?: number | null, totalNotLate?: number | null, processAverage?: number | null, avgExtraDays?: number | null } | null }> } };

export type GetAnalysisProcessPeformanceQueryVariables = Exact<{
  process: Scalars['String']['input'];
  startDate: Scalars['String']['input'];
  endDate: Scalars['String']['input'];
}>;


export type GetAnalysisProcessPeformanceQuery = { __typename?: 'Query', analysisProcessPerformance: { __typename: 'ProcessStatistics', data: Array<{ __typename?: 'ProcessData', process: string, groups?: Array<{ __typename?: 'ProcessCounts', totalSamples?: number | null, totalLate?: number | null, totalNotLate?: number | null, processAverage?: number | null, avgExtraDays?: number | null, service?: string | null }> | null }> } };

export type SampleGroupByActionQueryVariables = Exact<{
  startDate: Scalars['String']['input'];
  endDate: Scalars['String']['input'];
}>;


export type SampleGroupByActionQuery = { __typename?: 'Query', countSampleGroupByAction: { __typename: 'GroupedData', data: Array<{ __typename: 'GroupData', group: string, counts?: Array<{ __typename: 'GroupCount', group: string, count?: number | null }> | null }> } };

export type GetSampleLaggardsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSampleLaggardsQuery = { __typename?: 'Query', sampleLaggards: { __typename: 'LaggardStatistics', data: Array<{ __typename: 'LaggardData', category: string, counts?: { __typename: 'LaggardCounts', totalIncomplete?: number | null, totalDelayed?: number | null, totalNotDelayed?: number | null, lessThanTen?: number | null, tenToTwenty?: number | null, twentyToThirty?: number | null, graterThanThirty?: number | null } | null }> } };

export type AddDocumentFolderMutationVariables = Exact<{
  payload: DocumentFolderInputType;
}>;


export type AddDocumentFolderMutation = { __typename?: 'Mutation', createDocumentFolder: { __typename?: 'DocumentFolderType', uid: string, name: string, parentUid?: string | null } | { __typename?: 'OperationError', error: string, suggestion?: string | null } };

export type AddDocumentMutationVariables = Exact<{
  payload: DocumentInputType;
}>;


export type AddDocumentMutation = { __typename?: 'Mutation', createDocument: { __typename?: 'DocumentType', uid: string, name: string, documentId: string, folderUid?: string | null, createdAt?: string | null, updatedAt?: string | null, latestVersion?: { __typename?: 'DocumentVersionType', uid: string, content: string, editor: string, thumbnail?: string | null } | null, createdBy?: { __typename?: 'UserType', firstName?: string | null, lastName?: string | null } | null } | { __typename?: 'OperationError', error: string, suggestion?: string | null } };

export type EditDocumentVersionMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: DocumentVersionUpdateInputType;
}>;


export type EditDocumentVersionMutation = { __typename?: 'Mutation', updateDocumentVersion: { __typename?: 'DocumentVersionType', uid: string, thumbnail?: string | null } | { __typename?: 'OperationError', error: string, suggestion?: string | null } };

export type GetDocumentFolderAllQueryVariables = Exact<{ [key: string]: never; }>;


export type GetDocumentFolderAllQuery = { __typename?: 'Query', documentFolderAll: { __typename?: 'DocumentFolderCursorPage', items?: Array<{ __typename?: 'DocumentFolderType', uid: string, name: string, parentUid?: string | null }> | null } };

export type GetDocumentAllQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  folderUid?: InputMaybe<Scalars['String']['input']>;
  categoryUid?: InputMaybe<Scalars['String']['input']>;
  tagUid?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  authorUid?: InputMaybe<Scalars['String']['input']>;
  readerUid?: InputMaybe<Scalars['String']['input']>;
  departmentUid?: InputMaybe<Scalars['String']['input']>;
  text: Scalars['String']['input'];
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetDocumentAllQuery = { __typename?: 'Query', documentAll: { __typename?: 'DocumentCursorPage', items?: Array<{ __typename?: 'DocumentType', uid: string, name: string, documentId: string, folderUid?: string | null, createdAt?: string | null, updatedAt?: string | null, latestVersion?: { __typename?: 'DocumentVersionType', uid: string, content: string, editor: string, thumbnail?: string | null } | null, createdBy?: { __typename?: 'UserType', firstName?: string | null, lastName?: string | null } | null }> | null } };

export type GetDocumentVersionByBidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetDocumentVersionByBidQuery = { __typename?: 'Query', documentVersionByUid?: { __typename?: 'DocumentVersionType', uid: string, content: string, editor: string, versionNumber: string, changeSummary?: string | null, thumbnail?: string | null, createdAt?: string | null, document?: { __typename?: 'DocumentType', uid: string, name: string, documentId: string, createdAt?: string | null, updatedAt?: string | null, createdBy?: { __typename?: 'UserType', firstName?: string | null, lastName?: string | null } | null, updatedBy?: { __typename?: 'UserType', firstName?: string | null, lastName?: string | null } | null } | null, createdBy?: { __typename?: 'UserType', firstName?: string | null, lastName?: string | null } | null } | null };

export type AddGrindErrandMutationVariables = Exact<{
  payload: GrindCreateErrandInput;
}>;


export type AddGrindErrandMutation = { __typename?: 'Mutation', createGrindErrand: { __typename?: 'GrindErrandType', uid: string, title?: string | null, description?: string | null, posterUid?: string | null, createdByUid?: string | null, createdAt?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditGrindErrandMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: GrindUpdateErrandInput;
}>;


export type EditGrindErrandMutation = { __typename?: 'Mutation', updateGrindErrand: { __typename?: 'GrindErrandType', uid: string, title?: string | null, description?: string | null, category?: string | null, priority?: string | null, startDate?: string | null, endDate?: string | null, poster?: { __typename?: 'GrindPosterType', uid: string } | null, stamps: Array<{ __typename?: 'GrindStampType', uid: string }>, label?: { __typename?: 'GrindLabelType', uid: string } | null, assignee?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null, reporter?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null, members: Array<{ __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null }>, createdBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddGrindErrandDiscussionMutationVariables = Exact<{
  payload: GrindCreateErrandDiscussionInput;
}>;


export type AddGrindErrandDiscussionMutation = { __typename?: 'Mutation', createGrindErrandDiscussion: { __typename?: 'GrindErrandDiscussionType', uid: string, comment: string, errandUid?: string | null, parentUid?: string | null, canEdit: boolean, createdAt?: string | null, createdByUid?: string | null, createdBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditGrindErrandDiscussionMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: GrindUpdateErrandDiscussionInput;
}>;


export type EditGrindErrandDiscussionMutation = { __typename?: 'Mutation', updateGrindErrandDiscussion: { __typename?: 'GrindErrandDiscussionType', uid: string, comment: string, errandUid?: string | null, parentUid?: string | null, canEdit: boolean, createdAt?: string | null, createdByUid?: string | null, createdBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddGrindMilestoneMutationVariables = Exact<{
  payload: GrindCreateMilestoneInput;
}>;


export type AddGrindMilestoneMutation = { __typename?: 'Mutation', createGrindMilestone: { __typename?: 'GrindMilestoneType', uid: string, title?: string | null, description?: string | null, createdAt?: string | null, complete?: boolean | null, errand?: { __typename?: 'GrindErrandType', uid: string } | null, createdBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null, assignee?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditGrindMilestoneMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: GrindUpdateMilestoneInput;
}>;


export type EditGrindMilestoneMutation = { __typename?: 'Mutation', updateGrindMilestone: { __typename?: 'GrindMilestoneType', uid: string, title?: string | null, description?: string | null, createdAt?: string | null, complete?: boolean | null, errand?: { __typename?: 'GrindErrandType', uid: string } | null, createdBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null, assignee?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type DeleteMilestoneMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type DeleteMilestoneMutation = { __typename?: 'Mutation', deleteGrindMilestone: { __typename?: 'DeletedItem', uid: string } | { __typename?: 'OperationError' } };

export type AddGrindSchemeMutationVariables = Exact<{
  payload: GrindCreateSchemeInput;
}>;


export type AddGrindSchemeMutation = { __typename?: 'Mutation', createGrindScheme: { __typename?: 'GrindSchemeType', uid: string, title: string, description?: string | null, startDate?: string | null, endDate?: string | null, createdAt?: string | null, assignee?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null, members: Array<{ __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null }>, createdBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditGrindSchemeMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: GrindUpdateSchemeInput;
}>;


export type EditGrindSchemeMutation = { __typename?: 'Mutation', updateGrindScheme: { __typename?: 'GrindSchemeType', uid: string, title: string, description?: string | null, startDate?: string | null, endDate?: string | null, createdAt?: string | null, assignee?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null, members: Array<{ __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null }>, createdBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddGrindBoardMutationVariables = Exact<{
  payload: GrindCreateBoardInput;
}>;


export type AddGrindBoardMutation = { __typename?: 'Mutation', createGrindBoard: { __typename?: 'GrindBoardType', uid: string, title: string, description?: string | null, createdAt?: string | null, scheme?: { __typename?: 'GrindSchemeType', uid: string, title: string } | null, createdBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditGrindBoardMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: GrindUpdateBoardInput;
}>;


export type EditGrindBoardMutation = { __typename?: 'Mutation', updateGrindBoard: { __typename?: 'GrindBoardType', uid: string, title: string, description?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddGrindPosterMutationVariables = Exact<{
  payload: GrindCreatePosterInput;
}>;


export type AddGrindPosterMutation = { __typename?: 'Mutation', createGrindPoster: { __typename?: 'GrindPosterType', uid: string, title?: string | null, errands: Array<{ __typename?: 'GrindErrandType', uid: string }> } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddGrindLabelMutationVariables = Exact<{
  payload: GrindCreateLabelInput;
}>;


export type AddGrindLabelMutation = { __typename?: 'Mutation', createGrindLabel: { __typename?: 'GrindLabelType', uid: string, title: string, category?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddGrindStampMutationVariables = Exact<{
  payload: GrindCreateStampInput;
}>;


export type AddGrindStampMutation = { __typename?: 'Mutation', createGrindStamp: { __typename?: 'GrindStampType', uid: string, title?: string | null, category?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddGrindMediaMutationVariables = Exact<{
  payload: GrindCreateMediaInput;
}>;


export type AddGrindMediaMutation = { __typename?: 'Mutation', createGrindMedia: { __typename?: 'GrindMediaType', uid: string, target?: string | null, targetUid?: string | null, filename?: string | null, originalName?: string | null, path?: string | null, size?: string | null, mimetype?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type DeleteGrindMediaMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type DeleteGrindMediaMutation = { __typename?: 'Mutation', deleteGrindMedia: { __typename?: 'DeletedItem', uid: string } | { __typename?: 'OperationError' } };

export type GetGrindErrandsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  text: Scalars['String']['input'];
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetGrindErrandsQuery = { __typename?: 'Query', grindErrandAll: { __typename?: 'GrindErrandCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'GrindErrandType', uid: string, title?: string | null, description?: string | null, category?: string | null, priority?: string | null, startDate?: string | null, endDate?: string | null, milestonesAt: number, createdAt?: string | null, poster?: { __typename?: 'GrindPosterType', uid: string, title?: string | null } | null, stamps: Array<{ __typename?: 'GrindStampType', uid: string, title?: string | null }>, label?: { __typename?: 'GrindLabelType', uid: string, title: string } | null, createdBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null, assignee?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null, reporter?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null, members: Array<{ __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null }> }> | null } };

export type GetGrindErrandQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetGrindErrandQuery = { __typename?: 'Query', grindErrandByUid?: { __typename?: 'GrindErrandType', uid: string, title?: string | null, description?: string | null, category?: string | null, priority?: string | null, startDate?: string | null, endDate?: string | null, posterUid?: string | null, milestonesAt: number, labelUid?: string | null, createdAt?: string | null, poster?: { __typename?: 'GrindPosterType', uid: string, title?: string | null } | null, stamps: Array<{ __typename?: 'GrindStampType', uid: string, title?: string | null }>, label?: { __typename?: 'GrindLabelType', uid: string, title: string } | null, assignee?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null, reporter?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null, members: Array<{ __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null }>, createdBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null } | null };

export type GetGrindErrandDiscussionsQueryVariables = Exact<{
  errandUid: Scalars['String']['input'];
}>;


export type GetGrindErrandDiscussionsQuery = { __typename?: 'Query', grindErrandDiscussions: Array<{ __typename?: 'GrindErrandDiscussionType', uid: string, comment: string, errandUid?: string | null, parentUid?: string | null, canEdit: boolean, createdAt?: string | null, createdByUid?: string | null, subdiscussions: Array<{ __typename?: 'GrindErrandDiscussionType', uid: string, comment: string, errandUid?: string | null, parentUid?: string | null }>, createdBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null }> };

export type GetGrindErrandDiscussionsByParentQueryVariables = Exact<{
  parentUid: Scalars['String']['input'];
}>;


export type GetGrindErrandDiscussionsByParentQuery = { __typename?: 'Query', grindErrandDiscussionsByParent: Array<{ __typename?: 'GrindErrandDiscussionType', uid: string, comment: string, errandUid?: string | null, parentUid?: string | null, canEdit: boolean, createdAt?: string | null, createdByUid?: string | null, subdiscussions: Array<{ __typename?: 'GrindErrandDiscussionType', uid: string, comment: string, errandUid?: string | null, parentUid?: string | null }>, createdBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null }> };

export type GetGrindOccurrenciesByTargetQueryVariables = Exact<{
  target: Scalars['String']['input'];
  targetUid: Scalars['String']['input'];
}>;


export type GetGrindOccurrenciesByTargetQuery = { __typename?: 'Query', grindOccurrencesByTarget: Array<{ __typename?: 'GrindOccurrenceType', uid: string, description?: string | null, target?: string | null, targetUid?: string | null, createdAt?: string | null, actor?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null }> };

export type GetGrindMilestonesByErrandQueryVariables = Exact<{
  errandUid: Scalars['String']['input'];
}>;


export type GetGrindMilestonesByErrandQuery = { __typename?: 'Query', grindMilestonesByErrand: Array<{ __typename?: 'GrindMilestoneType', uid: string, title?: string | null, description?: string | null, createdAt?: string | null, complete?: boolean | null, errand?: { __typename?: 'GrindErrandType', uid: string } | null, createdBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null, assignee?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null }> };

export type GetGrindMediaQueryVariables = Exact<{
  target: Scalars['String']['input'];
  targetUid: Scalars['String']['input'];
}>;


export type GetGrindMediaQuery = { __typename?: 'Query', grindMediaByTarget: Array<{ __typename?: 'GrindMediaType', uid: string, target?: string | null, targetUid?: string | null, destination?: string | null, encoding?: string | null, filename?: string | null, mimetype?: string | null, originalName?: string | null, path?: string | null, size?: string | null, createdAt?: string | null, createdBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null }> };

export type GetGrindSchemeAllQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  text: Scalars['String']['input'];
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetGrindSchemeAllQuery = { __typename?: 'Query', grindSchemeAll: { __typename?: 'GrindSchemeCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'GrindSchemeType', uid: string, title: string, description?: string | null, startDate?: string | null, endDate?: string | null, createdAt?: string | null, assignee?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null, members: Array<{ __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null }>, createdBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null }> | null } };

export type GetGrindSchemeQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetGrindSchemeQuery = { __typename?: 'Query', grindSchemeByUid?: { __typename?: 'GrindSchemeType', uid: string, title: string, description?: string | null, startDate?: string | null, endDate?: string | null, createdAt?: string | null, assignee?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null, members: Array<{ __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null }>, boards: Array<{ __typename?: 'GrindBoardType', uid: string, title: string, description?: string | null }>, createdBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null } | null };

export type GetGrindPostersByBoardQueryVariables = Exact<{
  boardUid: Scalars['String']['input'];
}>;


export type GetGrindPostersByBoardQuery = { __typename?: 'Query', grindPostersByBoard: Array<{ __typename?: 'GrindPosterType', uid: string, title?: string | null, boardUid?: string | null, errands: Array<{ __typename?: 'GrindErrandType', uid: string, title?: string | null, description?: string | null, priority?: string | null, startDate?: string | null, endDate?: string | null, progress?: number | null, posterUid?: string | null, milestonesAt: number, labelUid?: string | null, stamps: Array<{ __typename?: 'GrindStampType', uid: string, title?: string | null }>, assignee?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null, members: Array<{ __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null }> }> }> };

export type GetGrindStampAllQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  text: Scalars['String']['input'];
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetGrindStampAllQuery = { __typename?: 'Query', grindStampAll: { __typename?: 'GrindStampCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'GrindStampType', uid: string, title?: string | null, category?: string | null }> | null } };

export type GetGrindStampByCategoryQueryVariables = Exact<{
  category: StampCategory;
}>;


export type GetGrindStampByCategoryQuery = { __typename?: 'Query', grindStampByCategory: Array<{ __typename?: 'GrindStampType', uid: string, title?: string | null, category?: string | null }> };

export type GetGrindLabelAllQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  text: Scalars['String']['input'];
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetGrindLabelAllQuery = { __typename?: 'Query', grindLabelAll: { __typename?: 'GrindLabelCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'GrindLabelType', uid: string, title: string, category?: string | null }> | null } };

export type DownloadGrindMediaFileUrlQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type DownloadGrindMediaFileUrlQuery = { __typename?: 'Query', downloadGrindMediaFileUrl: { __typename?: 'FileUrlResponseType', uid: string, mimetype: string, filename: string, downloadUrl: string } };

export type DownloadGrindMediaFileQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type DownloadGrindMediaFileQuery = { __typename?: 'Query', downloadGrindMediaFile: { __typename?: 'FileResponseType', uid: string, filename: string, mimetype: string, content: string, size: number } };

export type AddSupplierMutationVariables = Exact<{
  payload: SupplierInputType;
}>;


export type AddSupplierMutation = { __typename?: 'Mutation', createSupplier: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'SupplierType', uid: string, name?: string | null, description?: string | null } };

export type EditSupplierMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: SupplierInputType;
}>;


export type EditSupplierMutation = { __typename?: 'Mutation', updateSupplier: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'SupplierType', uid: string, name?: string | null, description?: string | null } };

export type AddManufacturerMutationVariables = Exact<{
  payload: ManufacturerInputType;
}>;


export type AddManufacturerMutation = { __typename?: 'Mutation', createManufacturer: { __typename?: 'ManufacturerType', uid: string, name?: string | null, description?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditManufacturerMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: ManufacturerInputType;
}>;


export type EditManufacturerMutation = { __typename?: 'Mutation', updateManufacturer: { __typename?: 'ManufacturerType', uid: string, name?: string | null, description?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddInstrumentTypeMutationVariables = Exact<{
  payload: InstrumentTypeInputType;
}>;


export type AddInstrumentTypeMutation = { __typename?: 'Mutation', createInstrumentType: { __typename?: 'InstrumentTypeType', uid: string, name?: string | null, description?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditInstrumentTypeMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: InstrumentTypeInputType;
}>;


export type EditInstrumentTypeMutation = { __typename?: 'Mutation', updateInstrumentType: { __typename?: 'InstrumentTypeType', uid: string, name?: string | null, description?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddInstrumentMutationVariables = Exact<{
  payload: InstrumentInputType;
}>;


export type AddInstrumentMutation = { __typename?: 'Mutation', createInstrument: { __typename?: 'InstrumentType', uid: string, name?: string | null, description?: string | null, keyword?: string | null, instrumentType?: { __typename?: 'InstrumentTypeType', uid: string, name?: string | null } | null, manufacturer?: { __typename?: 'ManufacturerType', uid: string, name?: string | null } | null, supplier?: { __typename?: 'SupplierType', uid: string, name?: string | null } | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditInstrumentMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: InstrumentInputType;
}>;


export type EditInstrumentMutation = { __typename?: 'Mutation', updateInstrument: { __typename?: 'InstrumentType', uid: string, name?: string | null, description?: string | null, keyword?: string | null, instrumentType?: { __typename?: 'InstrumentTypeType', uid: string, name?: string | null } | null, manufacturer?: { __typename?: 'ManufacturerType', uid: string, name?: string | null } | null, supplier?: { __typename?: 'SupplierType', uid: string, name?: string | null } | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddLaboratoryInstrumentMutationVariables = Exact<{
  payload: LaboratoryInstrumentInputType;
}>;


export type AddLaboratoryInstrumentMutation = { __typename?: 'Mutation', createLaboratoryInstrument: { __typename?: 'LaboratoryInstrumentType', uid: string, labName?: string | null, serialNumber?: string | null, instrumentUid?: string | null, dateCommissioned?: never | null, dateDecommissioned?: never | null, instrument?: { __typename?: 'InstrumentType', uid: string, name?: string | null } | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditLaboratoryInstrumentMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: LaboratoryInstrumentInputType;
}>;


export type EditLaboratoryInstrumentMutation = { __typename?: 'Mutation', updateLaboratoryInstrument: { __typename?: 'LaboratoryInstrumentType', uid: string, labName?: string | null, serialNumber?: string | null, instrumentUid?: string | null, dateCommissioned?: never | null, dateDecommissioned?: never | null, instrument?: { __typename?: 'InstrumentType', uid: string, name?: string | null } | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddMethodMutationVariables = Exact<{
  payload: MethodInputType;
}>;


export type AddMethodMutation = { __typename?: 'Mutation', createMethod: { __typename?: 'MethodType', uid: string, name?: string | null, description?: string | null, keyword?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditMethodMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: MethodInputType;
}>;


export type EditMethodMutation = { __typename?: 'Mutation', updateMethod: { __typename?: 'MethodType', uid: string, name?: string | null, description?: string | null, keyword?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddUnitMutationVariables = Exact<{
  payload: UnitInputType;
}>;


export type AddUnitMutation = { __typename?: 'Mutation', createUnit: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'UnitType', uid: string, name: string, description?: string | null } };

export type EditUnitMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: UnitInputType;
}>;


export type EditUnitMutation = { __typename?: 'Mutation', updateUnit: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'UnitType', uid: string, name: string, description?: string | null } };

export type GetAllSuppliersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllSuppliersQuery = { __typename?: 'Query', supplierAll: Array<{ __typename?: 'SupplierType', uid: string, name?: string | null, description?: string | null }> };

export type GetAllManufacturersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllManufacturersQuery = { __typename?: 'Query', manufacturerAll: Array<{ __typename?: 'ManufacturerType', uid: string, name?: string | null, description?: string | null }> };

export type GetAllInstrumentTypesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllInstrumentTypesQuery = { __typename?: 'Query', instrumentTypeAll: { __typename?: 'InstrumentTypeCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'InstrumentTypeType', uid: string, name?: string | null, description?: string | null }> | null } };

export type GetAllInstrumentsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllInstrumentsQuery = { __typename?: 'Query', instrumentAll: { __typename?: 'InstrumentCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'InstrumentType', uid: string, name?: string | null, description?: string | null, keyword?: string | null, supplierUid?: string | null, manufacturerUid?: string | null, instrumentTypeUid?: string | null, supplier?: { __typename?: 'SupplierType', uid: string, name?: string | null } | null, manufacturer?: { __typename?: 'ManufacturerType', uid: string, name?: string | null } | null, instrumentType?: { __typename?: 'InstrumentTypeType', uid: string, name?: string | null } | null }> | null } };

export type GetAllLaboratoryInstrumentsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllLaboratoryInstrumentsQuery = { __typename?: 'Query', laboratoryInstrumentAll: { __typename?: 'LaboratoryInstrumentCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'LaboratoryInstrumentType', uid: string, labName?: string | null, serialNumber?: string | null, instrumentUid?: string | null, dateCommissioned?: never | null, dateDecommissioned?: never | null, instrument?: { __typename?: 'InstrumentType', uid: string, name?: string | null } | null }> | null } };

export type GetAllMethodsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllMethodsQuery = { __typename?: 'Query', methodAll: { __typename?: 'MethodCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'MethodType', uid: string, name?: string | null, description?: string | null, keyword?: string | null, instruments?: Array<{ __typename?: 'InstrumentType', uid: string, name?: string | null, description?: string | null }> | null }> | null } };

export type GetAllUnitsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllUnitsQuery = { __typename?: 'Query', unitAll: Array<{ __typename?: 'UnitType', uid: string, name: string }> };

export type AddHazardMutationVariables = Exact<{
  payload: HazardInputType;
}>;


export type AddHazardMutation = { __typename?: 'Mutation', createHazard: { __typename: 'HazardType', uid: string, name: string, description?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditHazardMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: HazardInputType;
}>;


export type EditHazardMutation = { __typename?: 'Mutation', updateHazard: { __typename: 'HazardType', uid: string, name: string, description?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddStockCategoryMutationVariables = Exact<{
  payload: StockCategoryInputType;
}>;


export type AddStockCategoryMutation = { __typename?: 'Mutation', createStockCategory: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StockCategoryType', uid: string, name: string, description?: string | null } };

export type EditStockCategoryMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: StockCategoryInputType;
}>;


export type EditStockCategoryMutation = { __typename?: 'Mutation', updateStockCategory: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StockCategoryType', uid: string, name: string, description?: string | null } };

export type AddStockUnitMutationVariables = Exact<{
  payload: StockUnitInputType;
}>;


export type AddStockUnitMutation = { __typename?: 'Mutation', createStockUnit: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StockUnitType', uid: string, name: string } };

export type EditStockUnitMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: StockUnitInputType;
}>;


export type EditStockUnitMutation = { __typename?: 'Mutation', updateStockUnit: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StockUnitType', uid: string, name: string } };

export type ReceiveStockProductMutationVariables = Exact<{
  payload: StockReceiptInputType;
}>;


export type ReceiveStockProductMutation = { __typename?: 'Mutation', createStockReceipt: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StockItemVariantType', uid: string, name: string, description?: string | null, quantity: number, stockItem?: { __typename?: 'StockItemType', name: string, description?: string | null, category?: { __typename?: 'StockCategoryType', name: string } | null, hazard?: { __typename?: 'HazardType', name: string } | null } | null } };

export type AddStockItemMutationVariables = Exact<{
  payload: StockItemInputType;
}>;


export type AddStockItemMutation = { __typename?: 'Mutation', createStockItem: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StockItemType', uid: string, name: string, description?: string | null } };

export type EditStockItemMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: StockItemInputType;
}>;


export type EditStockItemMutation = { __typename?: 'Mutation', updateStockItem: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StockItemType', uid: string, name: string, description?: string | null } };

export type AddStockItemVariantMutationVariables = Exact<{
  stockItemUid: Scalars['String']['input'];
  payload: StockItemVariantInputType;
}>;


export type AddStockItemVariantMutation = { __typename?: 'Mutation', createStockItemVariant: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StockItemVariantType', uid: string, name: string, description?: string | null, stockItemUid?: string | null, minimumLevel?: number | null, maximumLevel?: number | null, createdAt?: string | null, createdBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null } };

export type EditStockItemVariantMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: StockItemVariantInputType;
}>;


export type EditStockItemVariantMutation = { __typename?: 'Mutation', updateStockItemVariant: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StockItemVariantType', uid: string, name: string, description?: string | null, stockItemUid?: string | null, minimumLevel?: number | null, maximumLevel?: number | null, createdAt?: string | null, updatedAt?: string | null, createdBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null, updatedBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null } };

export type AddStockAdjustmentMutationVariables = Exact<{
  payload: StockAdjustmentInputType;
}>;


export type AddStockAdjustmentMutation = { __typename?: 'Mutation', createStockAdjustment: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StockAdjustmentType', uid: string, productUid?: string | null, adjustmentType?: string | null, adjust?: number | null, adjustmentDate?: string | null, remarks?: string | null, adjustmentByUid?: string | null, createdAt?: string | null, createdByUid?: string | null } };

export type AddStockOrderMutationVariables = Exact<{
  payload: StockOrderInputType;
}>;


export type AddStockOrderMutation = { __typename?: 'Mutation', createStockOrder: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StockOrderLineType', stockOrder: { __typename?: 'StockOrderType', uid: string, orderByUid?: string | null, departmentUid?: string | null, status?: string | null, orderNumber?: string | null }, orderProducts: Array<{ __typename?: 'StockOrderProductType', uid: string, productUid?: string | null, orderUid?: string | null, quantity?: number | null }> } | { __typename?: 'StockOrderType' } };

export type EditStockOrderMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: StockOrderInputType;
}>;


export type EditStockOrderMutation = { __typename?: 'Mutation', updateStockOrder: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StockOrderLineType', stockOrder: { __typename?: 'StockOrderType', uid: string, orderByUid?: string | null, departmentUid?: string | null, status?: string | null, orderNumber?: string | null, remarks?: string | null }, orderProducts: Array<{ __typename?: 'StockOrderProductType', uid: string, productUid?: string | null, orderUid?: string | null, quantity?: number | null }> } | { __typename?: 'StockOrderType' } };

export type SubmitStockOrderMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type SubmitStockOrderMutation = { __typename?: 'Mutation', submitStockOrder: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'StockOrderLineType' } | { __typename: 'StockOrderType', uid: string, status?: string | null, orderNumber?: string | null } };

export type ApproveStockOrderMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: StockOrderApprovalInputType;
}>;


export type ApproveStockOrderMutation = { __typename?: 'Mutation', approveStockOrder: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'StockOrderLineType' } | { __typename: 'StockOrderType', uid: string, orderByUid?: string | null, departmentUid?: string | null, status?: string | null, orderNumber?: string | null, remarks?: string | null } };

export type IssueStockOrderMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: Array<StockOrderProductLineInputType> | StockOrderProductLineInputType;
}>;


export type IssueStockOrderMutation = { __typename?: 'Mutation', issueStockOrder: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StockOrderLineType', stockOrder: { __typename?: 'StockOrderType', uid: string, orderByUid?: string | null, departmentUid?: string | null, status?: string | null, orderNumber?: string | null, remarks?: string | null }, orderProducts: Array<{ __typename?: 'StockOrderProductType', uid: string, orderUid?: string | null, quantity?: number | null, product?: { __typename?: 'StockItemVariantType', uid: string, quantity: number } | null }> } | { __typename?: 'StockOrderType' } };

export type DeleteStockOrderMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type DeleteStockOrderMutation = { __typename?: 'Mutation', deleteStockOrder: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StockOrderLineType' } | { __typename?: 'StockOrderType' } };

export type GetAllHazardsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllHazardsQuery = { __typename?: 'Query', hazardAll: Array<{ __typename?: 'HazardType', uid: string, name: string, description?: string | null }> };

export type GetAllStockCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllStockCategoriesQuery = { __typename?: 'Query', stockCategoryAll: Array<{ __typename?: 'StockCategoryType', uid: string, name: string, description?: string | null }> };

export type GetAllStockUnitsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllStockUnitsQuery = { __typename?: 'Query', stockUnitAll: Array<{ __typename?: 'StockUnitType', uid: string, name: string }> };

export type GetAllStockItemsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  text: Scalars['String']['input'];
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetAllStockItemsQuery = { __typename?: 'Query', stockItemAll: { __typename?: 'StockItemCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'StockItemType', uid: string, name: string, description?: string | null, categoryUid?: string | null, hazardUid?: string | null, category?: { __typename?: 'StockCategoryType', uid: string, name: string } | null, hazard?: { __typename?: 'HazardType', uid: string, name: string } | null }> | null } };

export type GetAllStockItemVariantsQueryVariables = Exact<{
  stockItemUid: Scalars['String']['input'];
}>;


export type GetAllStockItemVariantsQuery = { __typename?: 'Query', stockItemVariants: Array<{ __typename?: 'StockItemVariantType', uid: string, name: string, description?: string | null, stockItemUid?: string | null, minimumLevel?: number | null, maximumLevel?: number | null }> };

export type GetAllStockProductsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  text: Scalars['String']['input'];
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetAllStockProductsQuery = { __typename?: 'Query', stockProductAll: { __typename?: 'StockItemVariantCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'StockItemVariantType', uid: string, name: string, description?: string | null, quantity: number, createdAt?: string | null, updatedAt?: string | null, stockItem?: { __typename?: 'StockItemType', name: string, description?: string | null, category?: { __typename?: 'StockCategoryType', name: string } | null, hazard?: { __typename?: 'HazardType', name: string } | null } | null, createdBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null, updatedBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null }> | null } };

export type GetAllStockLotsQueryVariables = Exact<{
  productUid: Scalars['String']['input'];
}>;


export type GetAllStockLotsQuery = { __typename?: 'Query', stockLots: Array<{ __typename?: 'StockLotType', uid: string, lotNumber: string, quantity: number, expiryDate: never }> };

export type GetAllStockOrdersQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  status: Scalars['String']['input'];
  text: Scalars['String']['input'];
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetAllStockOrdersQuery = { __typename?: 'Query', stockOrderAll: { __typename?: 'StockOrderCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'StockOrderType', uid: string, status?: string | null, orderNumber?: string | null, orderBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null, department?: { __typename?: 'DepartmentType', uid: string, name?: string | null } | null }> | null } };

export type GetAllStockOrderProductsQueryVariables = Exact<{
  stockOrderUid: Scalars['String']['input'];
}>;


export type GetAllStockOrderProductsQuery = { __typename?: 'Query', stockOrderProductAll: Array<{ __typename?: 'StockOrderProductType', uid: string, quantity?: number | null, product?: { __typename?: 'StockItemVariantType', uid: string, name: string, quantity: number } | null, stockLot?: { __typename?: 'StockLotType', uid: string, lotNumber: string, quantity: number } | null }> };

export type GetAllStockAdjustmentsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  text: Scalars['String']['input'];
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  productUid?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAllStockAdjustmentsQuery = { __typename?: 'Query', stockAdjustmentAll: { __typename?: 'StockAdjustmentCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'StockAdjustmentType', uid: string, productUid?: string | null, adjustmentType?: string | null, adjust?: number | null, adjustmentDate?: string | null, remarks?: string | null, adjustmentByUid?: string | null, createdAt?: string | null, createdByUid?: string | null, updatedAt?: string | null, updatedByUid?: string | null, product?: { __typename?: 'StockItemVariantType', name: string } | null, adjustmentBy?: { __typename?: 'UserType', firstName?: string | null, lastName?: string | null } | null }> | null } };

export type AddAbxGuidelineMutationVariables = Exact<{
  payload: AbxGuidelineInputType;
}>;


export type AddAbxGuidelineMutation = { __typename?: 'Mutation', createAbxGuideline: { __typename?: 'AbxGuidelineType', uid: string, name: string, code?: string | null, description?: string | null } | { __typename?: 'OperationError' } };

export type EditAbxGuidelineMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AbxGuidelineInputType;
}>;


export type EditAbxGuidelineMutation = { __typename?: 'Mutation', updateAbxGuideline: { __typename?: 'AbxGuidelineType', uid: string, name: string, code?: string | null, description?: string | null } | { __typename?: 'OperationError' } };

export type AddAbxAntibioticMutationVariables = Exact<{
  payload: AbxAntibioticInputType;
}>;


export type AddAbxAntibioticMutation = { __typename?: 'Mutation', createAbxAntibiotic: { __typename?: 'AbxAntibioticType', uid: string, name: string, whonetAbxCode?: string | null, whoCode?: string | null, dinCode?: string | null, jacCode?: string | null, eucastCode?: string | null, userCode?: string | null, abxNumber?: string | null, potency?: string | null, atcCode?: string | null, class_?: string | null, subclass?: string | null, profClass?: string | null, ciaCategory?: string | null, clsiOrder?: string | null, eucastOrder?: string | null, human?: boolean | null, veterinary?: boolean | null, animalGp?: string | null, loinccomp?: string | null, loincgen?: string | null, loincdisk?: string | null, loincmic?: string | null, loincetest?: string | null, loincslow?: string | null, loincafb?: string | null, loincsbt?: string | null, loincmlc?: string | null, createdAt?: string | null, createdByUid?: string | null, guidelines?: Array<{ __typename?: 'AbxGuidelineType', uid: string, name: string }> | null } | { __typename?: 'OperationError' } };

export type EditAbxAntibioticMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AbxAntibioticInputType;
}>;


export type EditAbxAntibioticMutation = { __typename?: 'Mutation', updateAbxAntibiotic: { __typename?: 'AbxAntibioticType', uid: string, name: string, whonetAbxCode?: string | null, whoCode?: string | null, dinCode?: string | null, jacCode?: string | null, eucastCode?: string | null, userCode?: string | null, abxNumber?: string | null, potency?: string | null, atcCode?: string | null, class_?: string | null, subclass?: string | null, profClass?: string | null, ciaCategory?: string | null, clsiOrder?: string | null, eucastOrder?: string | null, human?: boolean | null, veterinary?: boolean | null, animalGp?: string | null, loinccomp?: string | null, loincgen?: string | null, loincdisk?: string | null, loincmic?: string | null, loincetest?: string | null, loincslow?: string | null, loincafb?: string | null, loincsbt?: string | null, loincmlc?: string | null, createdAt?: string | null, createdByUid?: string | null, guidelines?: Array<{ __typename?: 'AbxGuidelineType', uid: string, name: string }> | null } | { __typename?: 'OperationError' } };

export type UseAbxAntibioticMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type UseAbxAntibioticMutation = { __typename?: 'Mutation', useAbxAntibiotic: { __typename?: 'AbxAntibioticType', uid: string, name: string, potency?: string | null, human?: boolean | null, veterinary?: boolean | null, loincdisk?: string | null, loincmic?: string | null, loincetest?: string | null, guidelines?: Array<{ __typename?: 'AbxGuidelineType', name: string }> | null } | { __typename?: 'OperationError' } };

export type DiscardAbxAntibioticMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type DiscardAbxAntibioticMutation = { __typename?: 'Mutation', discardAbxAntibiotic: { __typename?: 'DeletedItem', uid: string } };

export type AddAbxAstPanelMutationVariables = Exact<{
  payload: AbxAstPanelInputType;
}>;


export type AddAbxAstPanelMutation = { __typename?: 'Mutation', createAbxAstPanel: { __typename?: 'AbxASTPanelType', uid: string, name: string, description?: string | null, active: boolean, createdAt?: string | null, createdByUid?: string | null, organisms?: Array<{ __typename?: 'AbxOrganismType', uid: string, name: string }> | null, antibiotics?: Array<{ __typename?: 'AbxAntibioticType', uid: string, name: string }> | null } | { __typename?: 'OperationError' } };

export type EditAbxAstPanelMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AbxAstPanelInputType;
}>;


export type EditAbxAstPanelMutation = { __typename?: 'Mutation', updateAbxAstPanel: { __typename?: 'AbxASTPanelType', uid: string, name: string, description?: string | null, active: boolean, createdAt?: string | null, createdByUid?: string | null, organisms?: Array<{ __typename?: 'AbxOrganismType', uid: string, name: string }> | null, antibiotics?: Array<{ __typename?: 'AbxAntibioticType', uid: string, name: string }> | null } | { __typename?: 'OperationError' } };

export type AddAbxTestMethodMutationVariables = Exact<{
  payload: AbxTestMethodInputType;
}>;


export type AddAbxTestMethodMutation = { __typename?: 'Mutation', createAbxTestMethod: { __typename?: 'AbxTestMethodType', uid: string, name: string, description?: string | null, createdAt?: string | null, createdByUid?: string | null } | { __typename?: 'OperationError' } };

export type EditAbxTestMethodMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AbxTestMethodInputType;
}>;


export type EditAbxTestMethodMutation = { __typename?: 'Mutation', updateAbxTestMethod: { __typename?: 'AbxTestMethodType', uid: string, name: string, description?: string | null, createdAt?: string | null, createdByUid?: string | null } | { __typename?: 'OperationError' } };

export type AddAbxBreakpointTypeMutationVariables = Exact<{
  payload: AbxBreakpointTypeInputType;
}>;


export type AddAbxBreakpointTypeMutation = { __typename?: 'Mutation', createAbxBreakpointType: { __typename?: 'AbxBreakpointTypeTyp', uid: string, name: string, description?: string | null, createdAt?: string | null, createdByUid?: string | null } | { __typename?: 'OperationError' } };

export type EditAbxBreakpointTypeMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AbxBreakpointTypeInputType;
}>;


export type EditAbxBreakpointTypeMutation = { __typename?: 'Mutation', updateAbxBreakpointType: { __typename?: 'AbxBreakpointTypeTyp', uid: string, name: string, description?: string | null, createdAt?: string | null, createdByUid?: string | null } | { __typename?: 'OperationError' } };

export type AddAbxHostMutationVariables = Exact<{
  payload: AbxHostInputType;
}>;


export type AddAbxHostMutation = { __typename?: 'Mutation', createAbxHost: { __typename?: 'AbxHostType', uid: string, name: string, description?: string | null, createdAt?: string | null, createdByUid?: string | null } | { __typename?: 'OperationError' } };

export type EditAbxHostMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AbxHostInputType;
}>;


export type EditAbxHostMutation = { __typename?: 'Mutation', updateAbxHost: { __typename?: 'AbxHostType', uid: string, name: string, description?: string | null, createdAt?: string | null, createdByUid?: string | null } | { __typename?: 'OperationError' } };

export type AddAbxSiteOfInfectionMutationVariables = Exact<{
  payload: AbxSiteOfInfectionInputType;
}>;


export type AddAbxSiteOfInfectionMutation = { __typename?: 'Mutation', createAbxSiteOfInfection: { __typename?: 'AbxSiteOfInfectionType', uid: string, name: string, description?: string | null, createdAt?: string | null, createdByUid?: string | null } | { __typename?: 'OperationError' } };

export type EditAbxSiteOfInfectionMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AbxSiteOfInfectionInputType;
}>;


export type EditAbxSiteOfInfectionMutation = { __typename?: 'Mutation', updateAbxSiteOfInfection: { __typename?: 'AbxSiteOfInfectionType', uid: string, name: string, description?: string | null, createdAt?: string | null, createdByUid?: string | null } | { __typename?: 'OperationError' } };

export type AddAbxBreakpointMutationVariables = Exact<{
  payload: AbxBreakpointInputType;
}>;


export type AddAbxBreakpointMutation = { __typename?: 'Mutation', createAbxBreakpoint: { __typename?: 'AbxBreakpointTyp', uid: string, guidelineYearUid: string, testMethodUid: string, potency?: string | null, organismCode: string, organismCodeType: string, breakpointTypeUid: string, hostUid?: string | null, siteOfInfectionUid?: string | null, referenceTable?: string | null, referenceSequence?: string | null, whonetAbxCode?: string | null, comments?: string | null, r?: string | null, i?: string | null, sdd?: string | null, s?: string | null, ecvEcoff?: string | null, ecvEcoffTentative?: string | null, createdAt?: string | null, createdByUid?: string | null, guidelineYear?: { __typename?: 'AbxGuidelineYearType', uid: string, code: string } | null, testMethod?: { __typename?: 'AbxTestMethodType', name: string } | null, breakpointType?: { __typename?: 'AbxBreakpointTypeTyp', name: string } | null, host?: { __typename?: 'AbxHostType', name: string } | null, siteOfInfection?: { __typename?: 'AbxSiteOfInfectionType', name: string } | null } | { __typename?: 'OperationError' } };

export type EditAbxBreakpointMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AbxBreakpointInputType;
}>;


export type EditAbxBreakpointMutation = { __typename?: 'Mutation', updateAbxBreakpoint: { __typename?: 'AbxBreakpointTyp', uid: string, guidelineYearUid: string, testMethodUid: string, potency?: string | null, organismCode: string, organismCodeType: string, breakpointTypeUid: string, hostUid?: string | null, siteOfInfectionUid?: string | null, referenceTable?: string | null, referenceSequence?: string | null, whonetAbxCode?: string | null, comments?: string | null, r?: string | null, i?: string | null, sdd?: string | null, s?: string | null, ecvEcoff?: string | null, ecvEcoffTentative?: string | null, createdAt?: string | null, createdByUid?: string | null, guidelineYear?: { __typename?: 'AbxGuidelineYearType', uid: string, code: string } | null, testMethod?: { __typename?: 'AbxTestMethodType', name: string } | null, breakpointType?: { __typename?: 'AbxBreakpointTypeTyp', name: string } | null, host?: { __typename?: 'AbxHostType', name: string } | null, siteOfInfection?: { __typename?: 'AbxSiteOfInfectionType', name: string } | null } | { __typename?: 'OperationError' } };

export type AddAbxMediumMutationVariables = Exact<{
  payload: AbxMediumInputType;
}>;


export type AddAbxMediumMutation = { __typename?: 'Mutation', createAbxMedium: { __typename?: 'AbxMediumType', uid: string, name: string, description?: string | null, createdAt?: string | null, createdByUid?: string | null } | { __typename?: 'OperationError' } };

export type EditAbxMediumMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AbxMediumInputType;
}>;


export type EditAbxMediumMutation = { __typename?: 'Mutation', updateAbxMedium: { __typename?: 'AbxMediumType', uid: string, name: string, description?: string | null, createdAt?: string | null, createdByUid?: string | null } | { __typename?: 'OperationError' } };

export type AddAbxQcRangeMutationVariables = Exact<{
  payload: AbxQcRangeInputType;
}>;


export type AddAbxQcRangeMutation = { __typename?: 'Mutation', createAbxQcRange: { __typename?: 'AbxQCRangeType', uid: string, guidelineUid: string, year: number, strain: string, referenceTable: string, whonetOrgCode: string, antibiotic: string, abxTest: string, whonetAbxCode: string, method: string, mediumUid?: string | null, minimum?: string | null, maximum?: string | null, createdAt?: string | null, createdByUid?: string | null, guideline?: { __typename?: 'AbxGuidelineType', name: string } | null, medium?: { __typename?: 'AbxMediumType', name: string } | null } | { __typename?: 'OperationError' } };

export type EditAbxQcRangeMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AbxQcRangeInputType;
}>;


export type EditAbxQcRangeMutation = { __typename?: 'Mutation', updateAbxQcRange: { __typename?: 'AbxQCRangeType', uid: string, guidelineUid: string, year: number, strain: string, referenceTable: string, whonetOrgCode: string, antibiotic: string, abxTest: string, whonetAbxCode: string, method: string, mediumUid?: string | null, minimum?: string | null, maximum?: string | null, createdAt?: string | null, createdByUid?: string | null, guideline?: { __typename?: 'AbxGuidelineType', name: string } | null, medium?: { __typename?: 'AbxMediumType', name: string } | null } | { __typename?: 'OperationError' } };

export type AddAbxKingdomMutationVariables = Exact<{
  payload: AbxKingdomInputType;
}>;


export type AddAbxKingdomMutation = { __typename?: 'Mutation', createAbxKingdom: { __typename?: 'AbxKingdomType', uid: string, name: string } | { __typename?: 'OperationError' } };

export type EditAbxKingdomMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AbxKingdomInputType;
}>;


export type EditAbxKingdomMutation = { __typename?: 'Mutation', updateAbxKingdom: { __typename?: 'AbxKingdomType', uid: string, name: string } | { __typename?: 'OperationError' } };

export type AddAbxPhylumMutationVariables = Exact<{
  payload: AbxPhylumInputType;
}>;


export type AddAbxPhylumMutation = { __typename?: 'Mutation', createAbxPhylum: { __typename?: 'AbxPhylumType', uid: string, name: string, kingdomUid?: string | null } | { __typename?: 'OperationError' } };

export type EditAbxPhylumMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AbxPhylumInputType;
}>;


export type EditAbxPhylumMutation = { __typename?: 'Mutation', updateAbxPhylum: { __typename?: 'AbxPhylumType', uid: string, name: string, kingdomUid?: string | null } | { __typename?: 'OperationError' } };

export type AddAbxClassMutationVariables = Exact<{
  payload: AbxClassInputType;
}>;


export type AddAbxClassMutation = { __typename?: 'Mutation', createAbxClass: { __typename?: 'AbxClassType', uid: string, name: string, phylumUid?: string | null } | { __typename?: 'OperationError' } };

export type EditAbxClassMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AbxClassInputType;
}>;


export type EditAbxClassMutation = { __typename?: 'Mutation', updateAbxClass: { __typename?: 'AbxClassType', uid: string, name: string, phylumUid?: string | null } | { __typename?: 'OperationError' } };

export type AddAbxOrderMutationVariables = Exact<{
  payload: AbxOrderInputType;
}>;


export type AddAbxOrderMutation = { __typename?: 'Mutation', createAbxOrder: { __typename?: 'AbxOrderType', uid: string, name: string, classUid?: string | null } | { __typename?: 'OperationError' } };

export type EditAbxOrderMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AbxOrderInputType;
}>;


export type EditAbxOrderMutation = { __typename?: 'Mutation', updateAbxOrder: { __typename?: 'AbxOrderType', uid: string, name: string, classUid?: string | null } | { __typename?: 'OperationError' } };

export type AddAbxFamilyMutationVariables = Exact<{
  payload: AbxFamilyInputType;
}>;


export type AddAbxFamilyMutation = { __typename?: 'Mutation', createAbxFamily: { __typename?: 'AbxFamilyType', uid: string, name: string, orderUid?: string | null } | { __typename?: 'OperationError' } };

export type EditAbxFamilyMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AbxFamilyInputType;
}>;


export type EditAbxFamilyMutation = { __typename?: 'Mutation', updateAbxFamily: { __typename?: 'AbxFamilyType', uid: string, name: string, orderUid?: string | null } | { __typename?: 'OperationError' } };

export type AddAbxGenusMutationVariables = Exact<{
  payload: AbxGenusInputType;
}>;


export type AddAbxGenusMutation = { __typename?: 'Mutation', createAbxGenus: { __typename?: 'AbxGenusType', uid: string, name: string, familyUid?: string | null } | { __typename?: 'OperationError' } };

export type EditAbxGenusMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AbxGenusInputType;
}>;


export type EditAbxGenusMutation = { __typename?: 'Mutation', updateAbxGenus: { __typename?: 'AbxGenusType', uid: string, name: string, familyUid?: string | null } | { __typename?: 'OperationError' } };

export type AddAbxOrganismMutationVariables = Exact<{
  payload: AbxOrganismInputType;
}>;


export type AddAbxOrganismMutation = { __typename?: 'Mutation', createAbxOrganism: { __typename?: 'AbxOrganismType', uid: string, name: string, whonetOrgCode?: string | null, replacedBy?: string | null, taxonomicStatus?: string | null, common?: string | null, organismType?: string | null, anaerobe?: boolean | null, morphology?: string | null, subkingdomCode?: string | null, familyCode?: string | null, genusGroup?: string | null, genusCode?: string | null, speciesGroup?: string | null, serovarGroup?: string | null, msfGrpClin?: string | null, sctCode?: string | null, sctText?: string | null, gbifTaxonId?: string | null, gbifDatasetId?: string | null, gbifTaxonomicStatus?: string | null, kingdomUid?: string | null, phylumUid?: string | null, classUid?: string | null, orderUid?: string | null, familyUid?: string | null, genusUid?: string | null, comments?: string | null, createdAt?: string | null, createdByUid?: string | null, kingdom?: { __typename?: 'AbxKingdomType', name: string } | null, phylum?: { __typename?: 'AbxPhylumType', name: string } | null, class_?: { __typename?: 'AbxClassType', name: string } | null, order?: { __typename?: 'AbxOrderType', name: string } | null, family?: { __typename?: 'AbxFamilyType', name: string } | null, genus?: { __typename?: 'AbxGenusType', name: string } | null } | { __typename?: 'OperationError' } };

export type EditAbxOrganismMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AbxOrganismInputType;
}>;


export type EditAbxOrganismMutation = { __typename?: 'Mutation', updateAbxOrganism: { __typename?: 'AbxOrganismType', uid: string, name: string, whonetOrgCode?: string | null, replacedBy?: string | null, taxonomicStatus?: string | null, common?: string | null, organismType?: string | null, anaerobe?: boolean | null, morphology?: string | null, subkingdomCode?: string | null, familyCode?: string | null, genusGroup?: string | null, genusCode?: string | null, speciesGroup?: string | null, serovarGroup?: string | null, msfGrpClin?: string | null, sctCode?: string | null, sctText?: string | null, gbifTaxonId?: string | null, gbifDatasetId?: string | null, gbifTaxonomicStatus?: string | null, kingdomUid?: string | null, phylumUid?: string | null, classUid?: string | null, orderUid?: string | null, familyUid?: string | null, genusUid?: string | null, comments?: string | null, createdAt?: string | null, createdByUid?: string | null, kingdom?: { __typename?: 'AbxKingdomType', name: string } | null, phylum?: { __typename?: 'AbxPhylumType', name: string } | null, class_?: { __typename?: 'AbxClassType', name: string } | null, order?: { __typename?: 'AbxOrderType', name: string } | null, family?: { __typename?: 'AbxFamilyType', name: string } | null, genus?: { __typename?: 'AbxGenusType', name: string } | null } | { __typename?: 'OperationError' } };

export type AddAbxOrganismSerotypeMutationVariables = Exact<{
  payload: AbxOrganismSerotypeInputType;
}>;


export type AddAbxOrganismSerotypeMutation = { __typename?: 'Mutation', createAbxOrganismSerotype: { __typename?: 'AbxOrganismSerotypeType', uid: string, organismUid: string, serotype: string, serogroup?: string | null, subspecies?: string | null, oAntigens?: string | null, hPhase1?: string | null, hPhase2?: string | null, x997Check?: string | null, fate?: string | null, createdAt?: string | null, createdByUid?: string | null, organism?: { __typename?: 'AbxOrganismType', name: string } | null } | { __typename?: 'OperationError' } };

export type EditAbxOrganismSerotypeMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AbxOrganismSerotypeInputType;
}>;


export type EditAbxOrganismSerotypeMutation = { __typename?: 'Mutation', updateAbxOrganismSerotype: { __typename?: 'AbxOrganismSerotypeType', uid: string, organismUid: string, serotype: string, serogroup?: string | null, subspecies?: string | null, oAntigens?: string | null, hPhase1?: string | null, hPhase2?: string | null, x997Check?: string | null, fate?: string | null, createdAt?: string | null, createdByUid?: string | null, organism?: { __typename?: 'AbxOrganismType', name: string } | null } | { __typename?: 'OperationError' } };

export type AddAbxExpResPhenotypeMutationVariables = Exact<{
  payload: AbxExpResPhenotypeInputType;
}>;


export type AddAbxExpResPhenotypeMutation = { __typename?: 'Mutation', createAbxExpResPhenotype: { __typename?: 'AbxExpResPhenotypeType', uid: string, guidelineUid: string, referenceTable?: string | null, organismCode: string, organismCodeType: string, exceptionOrganismCode: string, exceptionOrganismCodeType: string, abxCode: string, abxCodeType: string, antibioticExceptions: string, comments?: string | null, createdAt?: string | null, createdByUid?: string | null, guideline?: { __typename?: 'AbxGuidelineType', name: string } | null } | { __typename?: 'OperationError' } };

export type EditAbxExpResPhenotypeMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AbxExpResPhenotypeInputType;
}>;


export type EditAbxExpResPhenotypeMutation = { __typename?: 'Mutation', updateAbxExpResPhenotype: { __typename?: 'AbxExpResPhenotypeType', uid: string, guidelineUid: string, referenceTable?: string | null, organismCode: string, organismCodeType: string, exceptionOrganismCode: string, exceptionOrganismCodeType: string, abxCode: string, abxCodeType: string, antibioticExceptions: string, comments?: string | null, createdAt?: string | null, createdByUid?: string | null, guideline?: { __typename?: 'AbxGuidelineType', name: string } | null } | { __typename?: 'OperationError' } };

export type AddAbxExpertInterpretationRuleMutationVariables = Exact<{
  payload: AbxExpertInterpretationRuleInputType;
}>;


export type AddAbxExpertInterpretationRuleMutation = { __typename?: 'Mutation', createAbxExpertInterpretationRule: { __typename?: 'AbxExpertInterpretationRuleType', uid: string, ruleCode: string, description?: string | null, organismCode: string, organismCodeType: string, ruleCriteria: string, affectedAntibiotics: string, antibioticExceptions: string, createdAt?: string | null, createdByUid?: string | null } | { __typename?: 'OperationError' } };

export type EditAbxExpertInterpretationRuleMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AbxExpertInterpretationRuleInputType;
}>;


export type EditAbxExpertInterpretationRuleMutation = { __typename?: 'Mutation', updateAbxExpertInterpretationRule: { __typename?: 'AbxExpertInterpretationRuleType', uid: string, ruleCode: string, description?: string | null, organismCode: string, organismCodeType: string, ruleCriteria: string, affectedAntibiotics: string, antibioticExceptions: string, createdAt?: string | null, createdByUid?: string | null } | { __typename?: 'OperationError' } };

export type AddAbxOrganismResultMutationVariables = Exact<{
  analysisResultUid: Scalars['String']['input'];
}>;


export type AddAbxOrganismResultMutation = { __typename?: 'Mutation', createAbxOrganismResult: { __typename?: 'AbxOrganismResultType', uid: string, analysisResultUid: string, organismUid?: string | null, isolateNumber?: number | null, createdAt?: string | null, createdByUid?: string | null, organism?: { __typename?: 'AbxOrganismType', uid: string, name: string } | null } };

export type SaveAbxOrganismResultMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  organismUid: Scalars['String']['input'];
}>;


export type SaveAbxOrganismResultMutation = { __typename?: 'Mutation', saveAbxOrganismResult: { __typename?: 'AbxOrganismResultType', uid: string, analysisResultUid: string, organismUid?: string | null, isolateNumber?: number | null, createdAt?: string | null, createdByUid?: string | null, organism?: { __typename?: 'AbxOrganismType', uid: string, name: string } | null } };

export type DeleteAbxOrganismResultMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type DeleteAbxOrganismResultMutation = { __typename?: 'Mutation', removeAbxOrganismResult: { __typename?: 'DeletedItem', uid: string } | { __typename?: 'OperationError', error: string, suggestion?: string | null } };

export type ApplyAbxAstPanelMutationVariables = Exact<{
  payload: AbxApplyAstPanelInput;
}>;


export type ApplyAbxAstPanelMutation = { __typename?: 'Mutation', applyAbxAstPanel: { __typename?: 'AbxASTResultsType', astResults: Array<{ __typename?: 'AbxASTResultType', uid: string, organismResultUid: string, analysisResultUid: string, antibioticUid: string, breakpointUid?: string | null, astMethodUid?: string | null, astValue?: string | null, createdAt?: string | null, createdByUid?: string | null, analysisResult?: { __typename?: 'AnalysisResultType', uid: string, result?: string | null, status?: string | null, reportable: boolean } | null, antibiotic?: { __typename?: 'AbxAntibioticType', uid: string, name: string, guidelines?: Array<{ __typename?: 'AbxGuidelineType', uid: string, name: string }> | null } | null, astMethod?: { __typename?: 'AbxTestMethodType', uid: string, name: string } | null }> } | { __typename?: 'OperationError', error: string, suggestion?: string | null } };

export type UpdateAbxAstResultsMutationVariables = Exact<{
  payload: AbxAstResultsUpdateInput;
}>;


export type UpdateAbxAstResultsMutation = { __typename?: 'Mutation', updateAbxAstResults: { __typename?: 'AbxASTResultsType', astResults: Array<{ __typename?: 'AbxASTResultType', uid: string, organismResultUid: string, analysisResultUid: string, antibioticUid: string, breakpointUid?: string | null, astMethodUid?: string | null, astValue?: string | null, createdAt?: string | null, createdByUid?: string | null, analysisResult?: { __typename?: 'AnalysisResultType', uid: string, result?: string | null, status?: string | null, reportable: boolean } | null, antibiotic?: { __typename?: 'AbxAntibioticType', uid: string, name: string, guidelines?: Array<{ __typename?: 'AbxGuidelineType', uid: string, name: string }> | null } | null, astMethod?: { __typename?: 'AbxTestMethodType', uid: string, name: string } | null }> } | { __typename?: 'OperationError', error: string, suggestion?: string | null } };

export type GetAbxGuidelinesAllQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAbxGuidelinesAllQuery = { __typename?: 'Query', abxGuidelinesAll?: Array<{ __typename?: 'AbxGuidelineType', uid: string, name: string, code?: string | null, description?: string | null }> | null };

export type GetAbxGuidelineByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAbxGuidelineByUidQuery = { __typename?: 'Query', abxGuidelineByUid?: { __typename?: 'AbxGuidelineType', uid: string, name: string, code?: string | null, description?: string | null } | null };

export type GetAbxAntibioticAllQueryVariables = Exact<{
  text: Scalars['String']['input'];
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetAbxAntibioticAllQuery = { __typename?: 'Query', abxAntibioticAll: { __typename?: 'AbxAntibioticCursorPage', totalCount: number, items?: Array<{ __typename?: 'AbxAntibioticType', uid: string, name: string, whonetAbxCode?: string | null, whoCode?: string | null, dinCode?: string | null, jacCode?: string | null, eucastCode?: string | null, userCode?: string | null, abxNumber?: string | null, potency?: string | null, atcCode?: string | null, class_?: string | null, subclass?: string | null, profClass?: string | null, ciaCategory?: string | null, clsiOrder?: string | null, eucastOrder?: string | null, human?: boolean | null, veterinary?: boolean | null, animalGp?: string | null, loinccomp?: string | null, loincgen?: string | null, loincdisk?: string | null, loincmic?: string | null, loincetest?: string | null, loincslow?: string | null, loincafb?: string | null, loincsbt?: string | null, loincmlc?: string | null, createdAt?: string | null, createdByUid?: string | null, guidelines?: Array<{ __typename?: 'AbxGuidelineType', uid: string, name: string }> | null }> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } };

export type GetAbxAntibioticByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAbxAntibioticByUidQuery = { __typename?: 'Query', abxAntibioticByUid?: { __typename?: 'AbxAntibioticType', uid: string, name: string, whonetAbxCode?: string | null, whoCode?: string | null, dinCode?: string | null, jacCode?: string | null, eucastCode?: string | null, userCode?: string | null, abxNumber?: string | null, potency?: string | null, atcCode?: string | null, class_?: string | null, subclass?: string | null, profClass?: string | null, ciaCategory?: string | null, clsiOrder?: string | null, eucastOrder?: string | null, human?: boolean | null, veterinary?: boolean | null, animalGp?: string | null, loinccomp?: string | null, loincgen?: string | null, loincdisk?: string | null, loincmic?: string | null, loincetest?: string | null, loincslow?: string | null, loincafb?: string | null, loincsbt?: string | null, loincmlc?: string | null, comments?: string | null, createdAt?: string | null, createdByUid?: string | null, guidelines?: Array<{ __typename?: 'AbxGuidelineType', uid: string, name: string }> | null } | null };

export type GetAbxLaboratoryAntibioticsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAbxLaboratoryAntibioticsQuery = { __typename?: 'Query', abxLaboratoryAntibiotics?: Array<{ __typename?: 'AbxAntibioticType', uid: string, name: string, potency?: string | null, human?: boolean | null, veterinary?: boolean | null, loincdisk?: string | null, loincmic?: string | null, loincetest?: string | null, guidelines?: Array<{ __typename?: 'AbxGuidelineType', name: string }> | null }> | null };

export type GetAbxKingdomAllQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAbxKingdomAllQuery = { __typename?: 'Query', abxKingdomAll?: Array<{ __typename?: 'AbxKingdomType', uid: string, name: string }> | null };

export type GetAbxKingdomByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAbxKingdomByUidQuery = { __typename?: 'Query', abxKingdomByUid?: { __typename?: 'AbxKingdomType', uid: string, name: string } | null };

export type GetAbxPhylumAllQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAbxPhylumAllQuery = { __typename?: 'Query', abxPhylumAll?: Array<{ __typename?: 'AbxPhylumType', uid: string, name: string, kingdomUid?: string | null, kingdom?: { __typename?: 'AbxKingdomType', name: string } | null }> | null };

export type GetAbxPhylumByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAbxPhylumByUidQuery = { __typename?: 'Query', abxPhylumByUid?: { __typename?: 'AbxPhylumType', uid: string, name: string, kingdomUid?: string | null, kingdom?: { __typename?: 'AbxKingdomType', name: string } | null } | null };

export type GetAbxClassAllQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAbxClassAllQuery = { __typename?: 'Query', abxClassAll?: Array<{ __typename?: 'AbxClassType', uid: string, name: string, phylumUid?: string | null, phylum?: { __typename?: 'AbxPhylumType', name: string } | null }> | null };

export type GetAbxClassByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAbxClassByUidQuery = { __typename?: 'Query', abxClassByUid?: { __typename?: 'AbxClassType', uid: string, name: string, phylumUid?: string | null, phylum?: { __typename?: 'AbxPhylumType', name: string } | null } | null };

export type GetAbxOrderAllQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAbxOrderAllQuery = { __typename?: 'Query', abxOrderAll?: Array<{ __typename?: 'AbxOrderType', uid: string, name: string, classUid?: string | null, class_?: { __typename?: 'AbxClassType', name: string } | null }> | null };

export type GetAbxOrderByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAbxOrderByUidQuery = { __typename?: 'Query', abxOrderByUid?: { __typename?: 'AbxOrderType', uid: string, name: string, classUid?: string | null, class_?: { __typename?: 'AbxClassType', name: string } | null } | null };

export type GetAbxFamilyAllQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAbxFamilyAllQuery = { __typename?: 'Query', abxFamilyAll?: Array<{ __typename?: 'AbxFamilyType', uid: string, name: string, orderUid?: string | null, order?: { __typename?: 'AbxOrderType', name: string } | null }> | null };

export type GetAbxFamilyByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAbxFamilyByUidQuery = { __typename?: 'Query', abxFamilyByUid?: { __typename?: 'AbxFamilyType', uid: string, name: string, orderUid?: string | null, order?: { __typename?: 'AbxOrderType', name: string } | null } | null };

export type GetAbxGenusAllQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAbxGenusAllQuery = { __typename?: 'Query', abxGenusAll?: Array<{ __typename?: 'AbxGenusType', uid: string, name: string, familyUid?: string | null, family?: { __typename?: 'AbxFamilyType', name: string } | null }> | null };

export type GetAbxGenusByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAbxGenusByUidQuery = { __typename?: 'Query', abxGenusByUid?: { __typename?: 'AbxGenusType', uid: string, name: string, familyUid?: string | null, family?: { __typename?: 'AbxFamilyType', name: string } | null } | null };

export type GetAbxOrganismAllQueryVariables = Exact<{
  text: Scalars['String']['input'];
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetAbxOrganismAllQuery = { __typename?: 'Query', abxOrganismAll: { __typename?: 'AbxOrganismCursorPage', totalCount: number, items?: Array<{ __typename?: 'AbxOrganismType', uid: string, name: string, whonetOrgCode?: string | null, replacedBy?: string | null, taxonomicStatus?: string | null, common?: string | null, organismType?: string | null, anaerobe?: boolean | null, morphology?: string | null, subkingdomCode?: string | null, familyCode?: string | null, genusGroup?: string | null, genusCode?: string | null, speciesGroup?: string | null, serovarGroup?: string | null, msfGrpClin?: string | null, sctCode?: string | null, sctText?: string | null, gbifTaxonId?: string | null, gbifDatasetId?: string | null, gbifTaxonomicStatus?: string | null, kingdomUid?: string | null, phylumUid?: string | null, classUid?: string | null, orderUid?: string | null, familyUid?: string | null, genusUid?: string | null, comments?: string | null, createdAt?: string | null, createdByUid?: string | null, kingdom?: { __typename?: 'AbxKingdomType', name: string } | null, phylum?: { __typename?: 'AbxPhylumType', name: string } | null, class_?: { __typename?: 'AbxClassType', name: string } | null, order?: { __typename?: 'AbxOrderType', name: string } | null, family?: { __typename?: 'AbxFamilyType', name: string } | null, genus?: { __typename?: 'AbxGenusType', name: string } | null }> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } };

export type GetAbxOrganismByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAbxOrganismByUidQuery = { __typename?: 'Query', abxOrganismByUid?: { __typename?: 'AbxOrganismType', uid: string, name: string, whonetOrgCode?: string | null, replacedBy?: string | null, taxonomicStatus?: string | null, common?: string | null, organismType?: string | null, anaerobe?: boolean | null, morphology?: string | null, subkingdomCode?: string | null, familyCode?: string | null, genusGroup?: string | null, genusCode?: string | null, speciesGroup?: string | null, serovarGroup?: string | null, msfGrpClin?: string | null, sctCode?: string | null, sctText?: string | null, gbifTaxonId?: string | null, gbifDatasetId?: string | null, gbifTaxonomicStatus?: string | null, kingdomUid?: string | null, phylumUid?: string | null, classUid?: string | null, orderUid?: string | null, familyUid?: string | null, genusUid?: string | null, comments?: string | null, createdAt?: string | null, createdByUid?: string | null, kingdom?: { __typename?: 'AbxKingdomType', name: string } | null, phylum?: { __typename?: 'AbxPhylumType', name: string } | null, class_?: { __typename?: 'AbxClassType', name: string } | null, order?: { __typename?: 'AbxOrderType', name: string } | null, family?: { __typename?: 'AbxFamilyType', name: string } | null, genus?: { __typename?: 'AbxGenusType', name: string } | null } | null };

export type GetAbxOrganismSerotypeAllQueryVariables = Exact<{
  text: Scalars['String']['input'];
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetAbxOrganismSerotypeAllQuery = { __typename?: 'Query', abxOrganismSerotypeAll: { __typename?: 'AbxOrganismSerotypeCursorPage', totalCount: number, items?: Array<{ __typename?: 'AbxOrganismSerotypeType', uid: string, organismUid: string, serotype: string, serogroup?: string | null, subspecies?: string | null, oAntigens?: string | null, hPhase1?: string | null, hPhase2?: string | null, x997Check?: string | null, fate?: string | null, createdAt?: string | null, createdByUid?: string | null, organism?: { __typename?: 'AbxOrganismType', name: string } | null }> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } };

export type GetAbxOrganismSerotypeByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAbxOrganismSerotypeByUidQuery = { __typename?: 'Query', abxOrganismSerotypeByUid?: { __typename?: 'AbxOrganismSerotypeType', uid: string, organismUid: string, serotype: string, serogroup?: string | null, subspecies?: string | null, oAntigens?: string | null, hPhase1?: string | null, hPhase2?: string | null, x997Check?: string | null, fate?: string | null, createdAt?: string | null, createdByUid?: string | null, organism?: { __typename?: 'AbxOrganismType', name: string } | null } | null };

export type GetAbxTestMethodAllQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAbxTestMethodAllQuery = { __typename?: 'Query', abxTestMethodAll?: Array<{ __typename?: 'AbxTestMethodType', uid: string, name: string, description?: string | null, createdAt?: string | null, createdByUid?: string | null }> | null };

export type GetAbxTestMethodByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAbxTestMethodByUidQuery = { __typename?: 'Query', abxTestMethodByUid?: { __typename?: 'AbxTestMethodType', uid: string, name: string, description?: string | null, createdAt?: string | null, createdByUid?: string | null } | null };

export type GetAbxBreakpointTypeAllQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAbxBreakpointTypeAllQuery = { __typename?: 'Query', abxBreakpointTypeAll?: Array<{ __typename?: 'AbxBreakpointTypeTyp', uid: string, name: string, description?: string | null, createdAt?: string | null, createdByUid?: string | null }> | null };

export type GetAbxBreakpointTypeByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAbxBreakpointTypeByUidQuery = { __typename?: 'Query', abxBreakpointTypeByUid?: { __typename?: 'AbxBreakpointTypeTyp', uid: string, name: string, description?: string | null, createdAt?: string | null, createdByUid?: string | null } | null };

export type GetAbxHostAllQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAbxHostAllQuery = { __typename?: 'Query', abxHostAll?: Array<{ __typename?: 'AbxHostType', uid: string, name: string, description?: string | null, createdAt?: string | null, createdByUid?: string | null }> | null };

export type GetAbxHostUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAbxHostUidQuery = { __typename?: 'Query', abxHostByUid?: { __typename?: 'AbxHostType', uid: string, name: string, description?: string | null, createdAt?: string | null, createdByUid?: string | null } | null };

export type GetAbxSiteOfInfectionAllQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAbxSiteOfInfectionAllQuery = { __typename?: 'Query', abxSiteOfInfectionAll?: Array<{ __typename?: 'AbxSiteOfInfectionType', uid: string, name: string, description?: string | null, createdAt?: string | null, createdByUid?: string | null }> | null };

export type GetAbxSiteOfInfectionUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAbxSiteOfInfectionUidQuery = { __typename?: 'Query', abxSiteOfInfectionByUid?: { __typename?: 'AbxSiteOfInfectionType', uid: string, name: string, description?: string | null, createdAt?: string | null, createdByUid?: string | null } | null };

export type GetAbxGuidelineYearAllQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAbxGuidelineYearAllQuery = { __typename?: 'Query', abxGuidelineYearAll?: Array<{ __typename?: 'AbxGuidelineYearType', uid: string, guidelineUid: string, year: number, code: string, guideline?: { __typename?: 'AbxGuidelineType', uid: string, name: string } | null }> | null };

export type GetAbxBreakpointAllQueryVariables = Exact<{
  text: Scalars['String']['input'];
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetAbxBreakpointAllQuery = { __typename?: 'Query', abxBreakpointAll: { __typename?: 'AbxBreakpointTypCursorPage', totalCount: number, items?: Array<{ __typename?: 'AbxBreakpointTyp', uid: string, guidelineYearUid: string, testMethodUid: string, potency?: string | null, organismCode: string, organismCodeType: string, breakpointTypeUid: string, hostUid?: string | null, siteOfInfectionUid?: string | null, referenceTable?: string | null, referenceSequence?: string | null, whonetAbxCode?: string | null, comments?: string | null, r?: string | null, i?: string | null, sdd?: string | null, s?: string | null, ecvEcoff?: string | null, ecvEcoffTentative?: string | null, createdAt?: string | null, createdByUid?: string | null, guidelineYear?: { __typename?: 'AbxGuidelineYearType', uid: string, code: string } | null, testMethod?: { __typename?: 'AbxTestMethodType', name: string } | null, breakpointType?: { __typename?: 'AbxBreakpointTypeTyp', name: string } | null, host?: { __typename?: 'AbxHostType', name: string } | null, siteOfInfection?: { __typename?: 'AbxSiteOfInfectionType', name: string } | null }> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } };

export type GetAbxBreakpointUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAbxBreakpointUidQuery = { __typename?: 'Query', abxBreakpointByUid?: { __typename?: 'AbxBreakpointTyp', uid: string, guidelineYearUid: string, testMethodUid: string, potency?: string | null, organismCode: string, organismCodeType: string, breakpointTypeUid: string, hostUid?: string | null, siteOfInfectionUid?: string | null, referenceTable?: string | null, referenceSequence?: string | null, whonetAbxCode?: string | null, comments?: string | null, r?: string | null, i?: string | null, sdd?: string | null, s?: string | null, ecvEcoff?: string | null, ecvEcoffTentative?: string | null, createdAt?: string | null, createdByUid?: string | null, guidelineYear?: { __typename?: 'AbxGuidelineYearType', uid: string, code: string } | null, testMethod?: { __typename?: 'AbxTestMethodType', name: string } | null, breakpointType?: { __typename?: 'AbxBreakpointTypeTyp', name: string } | null, host?: { __typename?: 'AbxHostType', name: string } | null, siteOfInfection?: { __typename?: 'AbxSiteOfInfectionType', name: string } | null } | null };

export type GetAbxExpResPhenotypeAllQueryVariables = Exact<{
  text: Scalars['String']['input'];
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetAbxExpResPhenotypeAllQuery = { __typename?: 'Query', abxExpectedResistancePhenotypeAll: { __typename?: 'AbxExpResPhenotypeCursorPage', totalCount: number, items?: Array<{ __typename?: 'AbxExpResPhenotypeType', uid: string, guidelineUid: string, referenceTable?: string | null, organismCode: string, organismCodeType: string, exceptionOrganismCode: string, exceptionOrganismCodeType: string, abxCode: string, abxCodeType: string, antibioticExceptions: string, comments?: string | null, createdAt?: string | null, createdByUid?: string | null, guideline?: { __typename?: 'AbxGuidelineType', name: string } | null }> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } };

export type GetAbxExpResPhenotypeUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAbxExpResPhenotypeUidQuery = { __typename?: 'Query', abxExpectedResistancePhenotypeByUid?: { __typename?: 'AbxExpResPhenotypeType', uid: string, guidelineUid: string, referenceTable?: string | null, organismCode: string, organismCodeType: string, exceptionOrganismCode: string, exceptionOrganismCodeType: string, abxCode: string, abxCodeType: string, antibioticExceptions: string, comments?: string | null, createdAt?: string | null, createdByUid?: string | null, guideline?: { __typename?: 'AbxGuidelineType', name: string } | null } | null };

export type GetAbxExpertInterpretationRuleAllQueryVariables = Exact<{
  text: Scalars['String']['input'];
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetAbxExpertInterpretationRuleAllQuery = { __typename?: 'Query', abxExpertInterpretationRuleAll: { __typename?: 'AbxExpertInterpretationRuleCursorPage', totalCount: number, items?: Array<{ __typename?: 'AbxExpertInterpretationRuleType', uid: string, ruleCode: string, description?: string | null, organismCode: string, organismCodeType: string, ruleCriteria: string, affectedAntibiotics: string, antibioticExceptions: string, createdAt?: string | null, createdByUid?: string | null }> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } };

export type GetAbxExpertInterpretationRuleUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAbxExpertInterpretationRuleUidQuery = { __typename?: 'Query', abxExpertInterpretationRuleByUid?: { __typename?: 'AbxExpertInterpretationRuleType', uid: string, ruleCode: string, description?: string | null, organismCode: string, organismCodeType: string, ruleCriteria: string, affectedAntibiotics: string, antibioticExceptions: string, createdAt?: string | null, createdByUid?: string | null } | null };

export type GetAbxMediumAllQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAbxMediumAllQuery = { __typename?: 'Query', abxMediumAll?: Array<{ __typename?: 'AbxMediumType', uid: string, name: string, description?: string | null, createdAt?: string | null, createdByUid?: string | null }> | null };

export type GetAbxMediumUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAbxMediumUidQuery = { __typename?: 'Query', abxMediumByUid?: { __typename?: 'AbxMediumType', uid: string, name: string, description?: string | null, createdAt?: string | null, createdByUid?: string | null } | null };

export type GetAbxQcRangeAllQueryVariables = Exact<{
  text: Scalars['String']['input'];
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetAbxQcRangeAllQuery = { __typename?: 'Query', abxQcRangeAll: { __typename?: 'AbxQCRangeCursorPage', totalCount: number, items?: Array<{ __typename?: 'AbxQCRangeType', uid: string, guidelineUid: string, year: number, strain: string, referenceTable: string, whonetOrgCode: string, antibiotic: string, abxTest: string, whonetAbxCode: string, method: string, mediumUid?: string | null, minimum?: string | null, maximum?: string | null, createdAt?: string | null, createdByUid?: string | null, guideline?: { __typename?: 'AbxGuidelineType', name: string } | null, medium?: { __typename?: 'AbxMediumType', name: string } | null }> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } };

export type GetAbxQcRangeUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAbxQcRangeUidQuery = { __typename?: 'Query', abxQcRangeByUid?: { __typename?: 'AbxQCRangeType', uid: string, guidelineUid: string, year: number, strain: string, referenceTable: string, whonetOrgCode: string, antibiotic: string, abxTest: string, whonetAbxCode: string, method: string, mediumUid?: string | null, minimum?: string | null, maximum?: string | null, createdAt?: string | null, createdByUid?: string | null, guideline?: { __typename?: 'AbxGuidelineType', name: string } | null, medium?: { __typename?: 'AbxMediumType', name: string } | null } | null };

export type GetAbxAstPanelFilterQueryVariables = Exact<{
  organismUid: Scalars['String']['input'];
  text?: Scalars['String']['input'];
}>;


export type GetAbxAstPanelFilterQuery = { __typename?: 'Query', abxAstPanelFilter?: Array<{ __typename?: 'AbxASTPanelType', uid: string, name: string, description?: string | null, organisms?: Array<{ __typename?: 'AbxOrganismType', uid: string, name: string }> | null, antibiotics?: Array<{ __typename?: 'AbxAntibioticType', uid: string, name: string }> | null }> | null };

export type GetAbxAstPanelAllQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAbxAstPanelAllQuery = { __typename?: 'Query', abxAstPanelAll?: Array<{ __typename?: 'AbxASTPanelType', uid: string, name: string, description?: string | null, active: boolean, createdAt?: string | null, createdByUid?: string | null, organisms?: Array<{ __typename?: 'AbxOrganismType', uid: string, name: string }> | null, antibiotics?: Array<{ __typename?: 'AbxAntibioticType', uid: string, name: string, potency?: string | null }> | null }> | null };

export type GetAbxAstPanelUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAbxAstPanelUidQuery = { __typename?: 'Query', abxAstPanelByUid?: { __typename?: 'AbxASTPanelType', uid: string, name: string, description?: string | null, active: boolean, createdAt?: string | null, createdByUid?: string | null, organisms?: Array<{ __typename?: 'AbxOrganismType', uid: string, name: string }> | null, antibiotics?: Array<{ __typename?: 'AbxAntibioticType', uid: string, name: string, potency?: string | null }> | null } | null };

export type GetAbxAstResultAllQueryVariables = Exact<{
  sampleUid: Scalars['String']['input'];
}>;


export type GetAbxAstResultAllQuery = { __typename?: 'Query', abxAstResultAll?: Array<{ __typename?: 'AbxASTResultType', uid: string, organismResultUid: string, analysisResultUid: string, antibioticUid: string, guidelineYearUid?: string | null, breakpointUid?: string | null, astMethodUid?: string | null, astValue?: string | null, createdAt?: string | null, createdByUid?: string | null, analysisResult?: { __typename?: 'AnalysisResultType', result?: string | null, reportable: boolean, status?: string | null } | null, antibiotic?: { __typename?: 'AbxAntibioticType', uid: string, name: string, potency?: string | null } | null, guidelineYear?: { __typename?: 'AbxGuidelineYearType', uid: string, code: string } | null, astMethod?: { __typename?: 'AbxTestMethodType', uid: string, name: string } | null }> | null };

export type GetAbxOrganismResultAllQueryVariables = Exact<{
  analysisResultUid: Scalars['String']['input'];
}>;


export type GetAbxOrganismResultAllQuery = { __typename?: 'Query', abxOrganismResultAll?: Array<{ __typename?: 'AbxOrganismResultType', uid: string, analysisResultUid: string, organismUid?: string | null, isolateNumber?: number | null, createdAt?: string | null, createdByUid?: string | null, organism?: { __typename?: 'AbxOrganismType', uid: string, name: string } | null }> | null };

export type AddNoticeMutationVariables = Exact<{
  payload: NoticeInputType;
}>;


export type AddNoticeMutation = { __typename?: 'Mutation', createNotice: { __typename: 'NoticeType', uid: string, title: string, body: string, expiry: string, createdByUid?: string | null, departments?: Array<{ __typename?: 'DepartmentType', uid: string, name?: string | null }> | null, groups?: Array<{ __typename?: 'GroupType', uid: string, name?: string | null }> | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditNoticeMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: NoticeInputType;
}>;


export type EditNoticeMutation = { __typename?: 'Mutation', updateNotice: { __typename: 'NoticeType', uid: string, title: string, body: string, expiry: string, createdByUid?: string | null, departments?: Array<{ __typename?: 'DepartmentType', uid: string, name?: string | null }> | null, groups?: Array<{ __typename?: 'GroupType', uid: string, name?: string | null }> | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type DeleteNoticeMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type DeleteNoticeMutation = { __typename?: 'Mutation', deleteNotice: { __typename: 'DeletedItem', uid: string } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type GetNoticesByCreatorUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetNoticesByCreatorUidQuery = { __typename?: 'Query', noticesByCreator?: Array<{ __typename?: 'NoticeType', uid: string, title: string, body: string, expiry: string, createdByUid?: string | null, departments?: Array<{ __typename?: 'DepartmentType', uid: string, name?: string | null }> | null, groups?: Array<{ __typename?: 'GroupType', uid: string, name?: string | null }> | null }> | null };

export type AddIdentificationMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type AddIdentificationMutation = { __typename?: 'Mutation', createIdentification: { __typename: 'IdentificationType', uid: string, name: string } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditIdentificationMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  name: Scalars['String']['input'];
}>;


export type EditIdentificationMutation = { __typename?: 'Mutation', updateIdentification: { __typename: 'IdentificationType', uid: string, name: string } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddPatientMutationVariables = Exact<{
  payload: PatientInputType;
}>;


export type AddPatientMutation = { __typename?: 'Mutation', createPatient: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'PatientType', uid: string, clientPatientId: string, patientId: string, firstName?: string | null, middleName?: string | null, lastName?: string | null, age?: number | null, gender?: string | null, dateOfBirth?: never | null, ageDobEstimated: boolean, phoneHome?: string | null, phoneMobile?: string | null, consentSms: boolean, countryUid?: string | null, provinceUid?: string | null, districtUid?: string | null, client?: { __typename?: 'ClientType', uid: string, name: string, district?: { __typename?: 'DistrictType', name?: string | null, province?: { __typename?: 'ProvinceType', name?: string | null } | null } | null } | null, identifications?: Array<{ __typename?: 'PatientIdentificationType', uid: string, value: string, identificationUid: string, identification?: { __typename?: 'IdentificationType', uid: string, name: string } | null }> | null, country?: { __typename?: 'CountryType', uid: string, name?: string | null } | null, province?: { __typename?: 'ProvinceType', uid: string, name?: string | null } | null, district?: { __typename?: 'DistrictType', uid: string, name?: string | null } | null } };

export type EditPatientMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: PatientInputType;
}>;


export type EditPatientMutation = { __typename?: 'Mutation', updatePatient: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'PatientType', uid: string, clientPatientId: string, patientId: string, firstName?: string | null, middleName?: string | null, lastName?: string | null, age?: number | null, gender?: string | null, dateOfBirth?: never | null, ageDobEstimated: boolean, phoneHome?: string | null, phoneMobile?: string | null, consentSms: boolean, countryUid?: string | null, provinceUid?: string | null, districtUid?: string | null, client?: { __typename?: 'ClientType', uid: string, name: string, district?: { __typename?: 'DistrictType', name?: string | null, province?: { __typename?: 'ProvinceType', name?: string | null } | null } | null } | null, identifications?: Array<{ __typename?: 'PatientIdentificationType', uid: string, value: string, identificationUid: string, identification?: { __typename?: 'IdentificationType', uid: string, name: string } | null }> | null, country?: { __typename?: 'CountryType', uid: string, name?: string | null } | null, province?: { __typename?: 'ProvinceType', uid: string, name?: string | null } | null, district?: { __typename?: 'DistrictType', uid: string, name?: string | null } | null } };

export type GetAllPatientsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  text: Scalars['String']['input'];
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetAllPatientsQuery = { __typename?: 'Query', patientAll: { __typename?: 'PatientCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'PatientType', uid: string, clientPatientId: string, patientId: string, firstName?: string | null, middleName?: string | null, lastName?: string | null, age?: number | null, gender?: string | null, dateOfBirth?: never | null, ageDobEstimated: boolean, clientUid: string, phoneHome?: string | null, phoneMobile?: string | null, consentSms: boolean, countryUid?: string | null, provinceUid?: string | null, districtUid?: string | null, client?: { __typename?: 'ClientType', uid: string, name: string, district?: { __typename?: 'DistrictType', uid: string, name?: string | null, province?: { __typename?: 'ProvinceType', uid: string, name?: string | null, country?: { __typename?: 'CountryType', uid: string, name?: string | null } | null } | null } | null } | null, identifications?: Array<{ __typename?: 'PatientIdentificationType', uid: string, value: string, identificationUid: string, identification?: { __typename?: 'IdentificationType', uid: string, name: string } | null }> | null, country?: { __typename?: 'CountryType', uid: string, name?: string | null } | null, province?: { __typename?: 'ProvinceType', uid: string, name?: string | null } | null, district?: { __typename?: 'DistrictType', uid: string, name?: string | null } | null }> | null } };

export type SearchPatientsQueryVariables = Exact<{
  queryString: Scalars['String']['input'];
}>;


export type SearchPatientsQuery = { __typename?: 'Query', patientSearch: Array<{ __typename?: 'PatientType', uid: string, clientPatientId: string, patientId: string, firstName?: string | null, middleName?: string | null, lastName?: string | null, age?: number | null, gender?: string | null, dateOfBirth?: never | null, ageDobEstimated: boolean, phoneHome?: string | null, phoneMobile?: string | null, consentSms: boolean, countryUid?: string | null, provinceUid?: string | null, districtUid?: string | null, client?: { __typename?: 'ClientType', uid: string, name: string, district?: { __typename?: 'DistrictType', name?: string | null, province?: { __typename?: 'ProvinceType', name?: string | null } | null } | null } | null, identifications?: Array<{ __typename?: 'PatientIdentificationType', uid: string, value: string, identificationUid: string, identification?: { __typename?: 'IdentificationType', uid: string, name: string } | null }> | null, country?: { __typename?: 'CountryType', uid: string, name?: string | null } | null, province?: { __typename?: 'ProvinceType', uid: string, name?: string | null } | null, district?: { __typename?: 'DistrictType', uid: string, name?: string | null } | null }> };

export type GetPatientByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetPatientByUidQuery = { __typename?: 'Query', patientByUid?: { __typename?: 'PatientType', uid: string, clientPatientId: string, patientId: string, firstName?: string | null, middleName?: string | null, lastName?: string | null, age?: number | null, gender?: string | null, dateOfBirth?: never | null, ageDobEstimated: boolean, phoneHome?: string | null, phoneMobile?: string | null, consentSms: boolean, countryUid?: string | null, provinceUid?: string | null, districtUid?: string | null, client?: { __typename?: 'ClientType', uid: string, name: string, district?: { __typename?: 'DistrictType', name?: string | null, province?: { __typename?: 'ProvinceType', name?: string | null } | null } | null } | null, identifications?: Array<{ __typename?: 'PatientIdentificationType', uid: string, value: string, identificationUid: string, identification?: { __typename?: 'IdentificationType', uid: string, name: string } | null }> | null, country?: { __typename?: 'CountryType', uid: string, name?: string | null } | null, province?: { __typename?: 'ProvinceType', uid: string, name?: string | null } | null, district?: { __typename?: 'DistrictType', uid: string, name?: string | null } | null } | null };

export type IdentificationTypesQueryVariables = Exact<{ [key: string]: never; }>;


export type IdentificationTypesQuery = { __typename?: 'Query', identificationAll: Array<{ __typename?: 'IdentificationType', uid: string, name: string }> };

export type AddReflexRuleMutationVariables = Exact<{
  payload: ReflexRuleInput;
}>;


export type AddReflexRuleMutation = { __typename?: 'Mutation', createReflexRule: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ReflexRuleType', uid: string, name: string, description: string, createdByUid?: string | null, createdAt?: string | null } };

export type EditReflexRuleMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: ReflexRuleInput;
}>;


export type EditReflexRuleMutation = { __typename?: 'Mutation', updateReflexRule: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ReflexRuleType', uid: string, name: string, description: string, createdByUid?: string | null, createdAt?: string | null } };

export type AddReflexActionMutationVariables = Exact<{
  payload: ReflexActionInput;
}>;


export type AddReflexActionMutation = { __typename?: 'Mutation', createReflexAction: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ReflexActionType', uid: string, description: string, level: number, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string }> | null, reflexRule?: { __typename?: 'ReflexRuleType', uid: string, name: string } | null } };

export type EditReflexActionMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: ReflexActionInput;
}>;


export type EditReflexActionMutation = { __typename?: 'Mutation', updateReflexAction: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ReflexActionType', uid: string, description: string, level: number, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string }> | null, reflexRule?: { __typename?: 'ReflexRuleType', uid: string, name: string } | null } };

export type AddReflexBrainMutationVariables = Exact<{
  payload: ReflexBrainInput;
}>;


export type AddReflexBrainMutation = { __typename?: 'Mutation', createReflexBrain: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ReflexBrainType', uid: string, description: string, conditions: Array<{ __typename?: 'ReflexBrainConditionType', description?: string | null, priority: number, criteria?: Array<{ __typename: 'ReflexBrainConditionCriteriaType', analysisUid: string, operator: string, value: string, analysis?: { __typename: 'AnalysisType', uid: string, name: string, resultOptions?: Array<{ __typename: 'ResultOptionType', optionKey: number, value: string }> | null } | null }> | null }>, actions: Array<{ __typename: 'ReflexBrainActionType', addNew?: Array<{ __typename: 'ReflexBrainAdditionType', analysisUid: string, count: number, analysis?: { __typename: 'AnalysisType', uid: string, name: string, resultOptions?: Array<{ __typename: 'ResultOptionType', optionKey: number, value: string }> | null } | null }> | null, finalise?: Array<{ __typename: 'ReflexBrainFinalType', analysisUid: string, value: string, analysis?: { __typename: 'AnalysisType', name: string, resultOptions?: Array<{ __typename: 'ResultOptionType', optionKey: number, value: string }> | null } | null }> | null }> } };

export type EditReflexBrainMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: ReflexBrainInput;
}>;


export type EditReflexBrainMutation = { __typename?: 'Mutation', updateReflexBrain: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ReflexBrainType', uid: string, description: string, conditions: Array<{ __typename?: 'ReflexBrainConditionType', description?: string | null, priority: number, criteria?: Array<{ __typename: 'ReflexBrainConditionCriteriaType', analysisUid: string, operator: string, value: string, analysis?: { __typename: 'AnalysisType', uid: string, name: string, resultOptions?: Array<{ __typename: 'ResultOptionType', optionKey: number, value: string }> | null } | null }> | null }>, actions: Array<{ __typename: 'ReflexBrainActionType', addNew?: Array<{ __typename: 'ReflexBrainAdditionType', analysisUid: string, count: number, analysis?: { __typename: 'AnalysisType', uid: string, name: string, resultOptions?: Array<{ __typename: 'ResultOptionType', optionKey: number, value: string }> | null } | null }> | null, finalise?: Array<{ __typename: 'ReflexBrainFinalType', analysisUid: string, value: string, analysis?: { __typename: 'AnalysisType', name: string, resultOptions?: Array<{ __typename: 'ResultOptionType', optionKey: number, value: string }> | null } | null }> | null }> } };

export type DeleteReflexBrainMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type DeleteReflexBrainMutation = { __typename?: 'Mutation', deleteReflexBrain: { __typename: 'DeletedItem', uid: string } };

export type GetAllReflexRulesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllReflexRulesQuery = { __typename?: 'Query', reflexRuleAll: { __typename?: 'ReflexRuleCursorPage', totalCount: number, items?: Array<{ __typename?: 'ReflexRuleType', uid: string, name: string, description: string, createdBy?: { __typename?: 'UserType', firstName?: string | null, lastName?: string | null } | null }> | null } };

export type GetReflexRuleByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetReflexRuleByUidQuery = { __typename?: 'Query', reflexRuleByUid?: { __typename?: 'ReflexRuleType', uid: string, name: string, description: string, reflexActions?: Array<{ __typename: 'ReflexActionType', uid: string, level: number, description: string, analyses?: Array<{ __typename: 'AnalysisType', uid: string, name: string }> | null, brains?: Array<{ __typename: 'ReflexBrainType', uid: string, description: string, conditions: Array<{ __typename?: 'ReflexBrainConditionType', description?: string | null, priority: number, criteria?: Array<{ __typename: 'ReflexBrainConditionCriteriaType', analysisUid: string, operator: string, value: string, analysis?: { __typename: 'AnalysisType', uid: string, name: string, resultOptions?: Array<{ __typename: 'ResultOptionType', optionKey: number, value: string }> | null } | null }> | null }>, actions: Array<{ __typename: 'ReflexBrainActionType', addNew?: Array<{ __typename: 'ReflexBrainAdditionType', analysisUid: string, count: number, analysis?: { __typename: 'AnalysisType', uid: string, name: string, resultOptions?: Array<{ __typename: 'ResultOptionType', optionKey: number, value: string }> | null } | null }> | null, finalise?: Array<{ __typename: 'ReflexBrainFinalType', analysisUid: string, value: string, analysis?: { __typename: 'AnalysisType', name: string, resultOptions?: Array<{ __typename: 'ResultOptionType', optionKey: number, value: string }> | null } | null }> | null }> }> | null, createdBy?: { __typename: 'UserType', firstName?: string | null, lastName?: string | null } | null }> | null } | null };

export type AddReferralLaboratoryMutationVariables = Exact<{
  payload: ReferralLaboratoryInputType;
}>;


export type AddReferralLaboratoryMutation = { __typename?: 'Mutation', createReferralLaboratory: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ReferralLaboratoryType', uid: string, name?: string | null, code?: string | null, url?: string | null, password?: string | null, username?: string | null, isReferral?: boolean | null, isReference?: boolean | null } };

export type EditReferralLaboratoryMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: ReferralLaboratoryInputType;
}>;


export type EditReferralLaboratoryMutation = { __typename?: 'Mutation', updateReferralLaboratory: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ReferralLaboratoryType', uid: string, name?: string | null, code?: string | null, url?: string | null, password?: string | null, username?: string | null, isReferral?: boolean | null, isReference?: boolean | null } };

export type AddShipmentMutationVariables = Exact<{
  payload: ShipmentInputType;
}>;


export type AddShipmentMutation = { __typename?: 'Mutation', createShipment: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ShipmentListingType', shipments?: Array<{ __typename?: 'ShipmentType', uid: string, shipmentId?: string | null, assignedCount?: number | null, state?: string | null, laboratoryUid?: string | null, createdAt?: string | null, laboratory?: { __typename?: 'ReferralLaboratoryType', name?: string | null } | null }> | null } };

export type UpdateShipmentMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: ShipmentUpdateInputType;
}>;


export type UpdateShipmentMutation = { __typename?: 'Mutation', updateShipment: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ShipmentType', uid: string, shipmentId?: string | null, assignedCount?: number | null, state?: string | null, incoming: boolean, comment?: string | null, createdAt?: string | null, courier?: string | null, laboratory?: { __typename?: 'ReferralLaboratoryType', uid: string, name?: string | null } | null } };

export type ShipmentManageSamplesMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: ShipmentManageSamplesInput;
}>;


export type ShipmentManageSamplesMutation = { __typename?: 'Mutation', shipmentManageSamples: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ShipmentType', uid: string, shipmentId?: string | null, assignedCount?: number | null, state?: string | null, incoming: boolean, comment?: string | null, createdAt?: string | null, courier?: string | null, laboratory?: { __typename?: 'ReferralLaboratoryType', uid: string, name?: string | null } | null, samples?: Array<{ __typename?: 'SampleType', uid: string, sampleId: string, status?: string | null, analysisRequest?: { __typename?: 'AnalysisRequestType', patient: { __typename?: 'PatientType', uid: string } } | null, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string, keyword?: string | null }> | null }> | null } };

export type ActionShipmentMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  action: Scalars['String']['input'];
}>;


export type ActionShipmentMutation = { __typename?: 'Mutation', actionShipment: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ShipmentType', uid: string, state?: string | null } };

export type GetAllReferralLaboratoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllReferralLaboratoriesQuery = { __typename?: 'Query', referralLaboratoryAll: Array<{ __typename?: 'ReferralLaboratoryType', uid: string, name?: string | null, code?: string | null, url?: string | null, password?: string | null, username?: string | null, isReferral?: boolean | null, isReference?: boolean | null }> };

export type GetAllShipmentsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  incoming: Scalars['Boolean']['input'];
  status: Scalars['String']['input'];
  text: Scalars['String']['input'];
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetAllShipmentsQuery = { __typename?: 'Query', shipmentAll: { __typename?: 'ShipmentCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'ShipmentType', uid: string, shipmentId?: string | null, assignedCount?: number | null, incoming: boolean, state?: string | null, laboratoryUid?: string | null, courier?: string | null, createdAt?: string | null, laboratory?: { __typename?: 'ReferralLaboratoryType', name?: string | null } | null }> | null } };

export type GetShipmentByUidQueryVariables = Exact<{
  shipmentUid: Scalars['String']['input'];
}>;


export type GetShipmentByUidQuery = { __typename?: 'Query', shipmentByUid: { __typename?: 'ShipmentType', uid: string, shipmentId?: string | null, assignedCount?: number | null, state?: string | null, incoming: boolean, comment?: string | null, createdAt?: string | null, courier?: string | null, jsonContent?: never | null, laboratory?: { __typename?: 'ReferralLaboratoryType', name?: string | null, url?: string | null, username?: string | null, password?: string | null } | null, shippedSamples?: Array<{ __typename?: 'ShippedSampleType', resultNotified?: boolean | null, extSampleId?: string | null, sample: { __typename?: 'SampleType', uid: string, sampleId: string, status?: string | null, analysisRequest?: { __typename?: 'AnalysisRequestType', clientRequestId: string, patient: { __typename?: 'PatientType', uid: string } } | null, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string, keyword?: string | null }> | null } }> | null } };

export type ManifestReportQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type ManifestReportQuery = { __typename?: 'Query', manifestReportDownload?: never | null };

export type AddStoreRoomMutationVariables = Exact<{
  payload: StoreRoomInputType;
}>;


export type AddStoreRoomMutation = { __typename?: 'Mutation', createStoreRoom: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StoreRoomType', uid: string, name: string, description?: string | null } };

export type EditStoreRoomMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: StoreRoomInputType;
}>;


export type EditStoreRoomMutation = { __typename?: 'Mutation', updateStoreRoom: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StoreRoomType', uid: string, name: string, description?: string | null } };

export type AddStorageLocationMutationVariables = Exact<{
  payload: StorageLocationInputType;
}>;


export type AddStorageLocationMutation = { __typename?: 'Mutation', createStorageLocation: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StorageLocationType', uid: string, name: string, description?: string | null, storeRoomUid: string } };

export type EditStorageLocationMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: StorageLocationInputType;
}>;


export type EditStorageLocationMutation = { __typename?: 'Mutation', updateStorageLocation: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StorageLocationType', uid: string, name: string, description?: string | null, storeRoomUid: string } };

export type AddStorageSectionMutationVariables = Exact<{
  payload: StorageSectionInputType;
}>;


export type AddStorageSectionMutation = { __typename?: 'Mutation', createStorageSection: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StorageSectionType', uid: string, name: string, description?: string | null, storageLocationUid: string, storageLocation?: { __typename?: 'StorageLocationType', uid: string, storeRoomUid: string } | null } };

export type EditStorageSectionMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: StorageSectionInputType;
}>;


export type EditStorageSectionMutation = { __typename?: 'Mutation', updateStorageSection: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StorageSectionType', uid: string, name: string, description?: string | null, storageLocationUid: string, storageLocation?: { __typename?: 'StorageLocationType', uid: string, storeRoomUid: string } | null } };

export type AddStorageContainerMutationVariables = Exact<{
  payload: StorageContainerInputType;
}>;


export type AddStorageContainerMutation = { __typename?: 'Mutation', createStorageContainer: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StorageContainerType', uid: string, name: string, description?: string | null, storageSectionUid: string, grid?: boolean | null, rowWise?: boolean | null, cols?: number | null, rows?: number | null, slots?: number | null, storageSection?: { __typename?: 'StorageSectionType', uid: string, storageLocationUid: string, storageLocation?: { __typename?: 'StorageLocationType', uid: string, storeRoomUid: string } | null } | null } };

export type EditStorageContainerMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: StorageContainerInputType;
}>;


export type EditStorageContainerMutation = { __typename?: 'Mutation', updateStorageContainer: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StorageContainerType', uid: string, name: string, description?: string | null, storageSectionUid: string, grid?: boolean | null, rowWise?: boolean | null, cols?: number | null, rows?: number | null, slots?: number | null, storageSection?: { __typename?: 'StorageSectionType', uid: string, storageLocationUid: string, storageLocation?: { __typename?: 'StorageLocationType', uid: string, storeRoomUid: string } | null } | null } };

export type StoreSamplesMutationVariables = Exact<{
  payload: Array<StoreSamplesInputType> | StoreSamplesInputType;
}>;


export type StoreSamplesMutation = { __typename?: 'Mutation', storeSamples: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StoredSamplesType', samples: Array<{ __typename?: 'SampleType', uid: string, sampleId: string, priority: number, status?: string | null, storageSlot?: string | null, storageContainerUid?: string | null }> } };

export type RecoverSamplesMutationVariables = Exact<{
  sampleUids: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type RecoverSamplesMutation = { __typename?: 'Mutation', recoverSamples: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StoredSamplesType', samples: Array<{ __typename?: 'SampleType', uid: string, status?: string | null, storageSlot?: string | null, storageContainerUid?: string | null }> } };

export type GetAllStoreRoomsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllStoreRoomsQuery = { __typename?: 'Query', storeRoomAll: Array<{ __typename?: 'StoreRoomType', uid: string, name: string, description?: string | null }> };

export type GetStoreRoomByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetStoreRoomByUidQuery = { __typename?: 'Query', storeRoomByUid?: { __typename?: 'StoreRoomType', uid: string, name: string, description?: string | null } | null };

export type GetAllStorageLocationsQueryVariables = Exact<{
  storeRoomUid: Scalars['String']['input'];
}>;


export type GetAllStorageLocationsQuery = { __typename?: 'Query', storageLocations: Array<{ __typename?: 'StorageLocationType', uid: string, name: string, description?: string | null, storeRoomUid: string }> };

export type GetStorageLocationByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetStorageLocationByUidQuery = { __typename?: 'Query', storageLocationByUid?: { __typename?: 'StorageLocationType', uid: string, name: string, description?: string | null, storeRoomUid: string } | null };

export type GetAllStorageSectionsQueryVariables = Exact<{
  storageLocationUid: Scalars['String']['input'];
}>;


export type GetAllStorageSectionsQuery = { __typename?: 'Query', storageSections: Array<{ __typename?: 'StorageSectionType', uid: string, name: string, description?: string | null, storageLocationUid: string }> };

export type GetStorageSectionByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetStorageSectionByUidQuery = { __typename?: 'Query', storageSectionByUid?: { __typename?: 'StorageSectionType', uid: string, name: string, description?: string | null, storageLocationUid: string } | null };

export type GetAllStorageContainersQueryVariables = Exact<{
  storageSectionUid: Scalars['String']['input'];
}>;


export type GetAllStorageContainersQuery = { __typename?: 'Query', storageContainers: Array<{ __typename?: 'StorageContainerType', uid: string, name: string, description?: string | null, storageSectionUid: string, grid?: boolean | null, rowWise?: boolean | null, cols?: number | null, rows?: number | null, slots?: number | null }> };

export type GetSrorageContainerByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetSrorageContainerByUidQuery = { __typename?: 'Query', storageContainerByUid?: { __typename?: 'StorageContainerType', uid: string, name: string, description?: string | null, storageSectionUid: string, grid?: boolean | null, rowWise?: boolean | null, cols?: number | null, rows?: number | null, slots?: number | null, storedCount?: number | null } | null };

export type GetStoreRoomsTreeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetStoreRoomsTreeQuery = { __typename?: 'Query', storeRoomAll: Array<{ __typename?: 'StoreRoomType', uid: string, name: string, description?: string | null, tag: string, children?: Array<{ __typename?: 'StorageLocationType', uid: string, name: string, description?: string | null, tag: string, children?: Array<{ __typename?: 'StorageSectionType', uid: string, name: string, description?: string | null, tag: string, children?: Array<{ __typename?: 'StorageContainerType', uid: string, name: string, description?: string | null, tag: string }> | null }> | null }> | null }> };

export type GetSystemActivitySubscriptionVariables = Exact<{ [key: string]: never; }>;


export type GetSystemActivitySubscription = { __typename?: 'Subscription', latestActivity: { __typename?: 'ActivityStreamType', uid: string, actorUid?: string | null, actionObjectUid?: string | null, actionObjectType?: string | null, targetUid?: string | null, verb?: string | null, actor: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null }, actionObject: { __typename: 'AnalysisResultType', uid: string, sampleUid: string, result?: string | null, status?: string | null } | { __typename: 'ReportMetaType', uid: string, status?: string | null, location?: string | null } | { __typename: 'SampleType', uid: string, sampleId: string, status?: string | null, analysisRequest?: { __typename?: 'AnalysisRequestType', patientUid: string } | null } | { __typename: 'UnknownObjectType' } | { __typename: 'WorkSheetType', uid: string, worksheetId: string, state?: string | null } } };

export type AddWorkSheetTemplateMutationVariables = Exact<{
  payload: WorksheetTemplateInputType;
}>;


export type AddWorkSheetTemplateMutation = { __typename?: 'Mutation', createWorksheetTemplate: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'WorkSheetTemplateType', uid: string, name: string, reserved?: never | null, numberOfSamples?: number | null, rows?: number | null, cols?: number | null, rowWise: boolean, worksheetType: string, instrumentUid?: string | null, sampleTypeUid?: string | null, description?: string | null, analysisUid?: string | null, state?: string | null, instrument?: { __typename?: 'InstrumentType', uid: string, name?: string | null } | null, sampleType?: { __typename?: 'SampleTypeTyp', uid: string, name: string } | null, qcTemplate?: { __typename?: 'QCTemplateType', uid: string, name: string, description?: string | null, qcLevels: Array<{ __typename?: 'QCLevelType', uid: string, level: string }> } | null, qcLevels?: Array<{ __typename?: 'QCLevelType', uid: string, level: string }> | null, analysis?: { __typename?: 'AnalysisType', uid: string, name: string } | null } };

export type EditWorkSheetTemplateMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: WorksheetTemplateInputType;
}>;


export type EditWorkSheetTemplateMutation = { __typename?: 'Mutation', updateWorksheetTemplate: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'WorkSheetTemplateType', uid: string, name: string, reserved?: never | null, numberOfSamples?: number | null, rows?: number | null, cols?: number | null, rowWise: boolean, worksheetType: string, instrumentUid?: string | null, sampleTypeUid?: string | null, description?: string | null, analysisUid?: string | null, state?: string | null, instrument?: { __typename?: 'InstrumentType', uid: string, name?: string | null } | null, sampleType?: { __typename?: 'SampleTypeTyp', uid: string, name: string } | null, qcTemplate?: { __typename?: 'QCTemplateType', uid: string, name: string, description?: string | null, qcLevels: Array<{ __typename?: 'QCLevelType', uid: string, level: string }> } | null, qcLevels?: Array<{ __typename?: 'QCLevelType', uid: string, level: string }> | null, analysis?: { __typename?: 'AnalysisType', uid: string, name: string } | null } };

export type AddWorkSheetMutationVariables = Exact<{
  analystUid: Scalars['String']['input'];
  templateUid: Scalars['String']['input'];
  count?: InputMaybe<Scalars['Int']['input']>;
}>;


export type AddWorkSheetMutation = { __typename?: 'Mutation', createWorksheet: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'WorksheetListingType', worksheets?: Array<{ __typename?: 'WorkSheetType', uid: string, worksheetId: string, numberOfSamples?: number | null, assignedCount: number, instrumentUid?: string | null, analysisUid?: string | null, state?: string | null, createdAt?: string | null, analyst?: { __typename?: 'UserType', uid: string, userName: string, firstName?: string | null, lastName?: string | null } | null, instrument?: { __typename?: 'InstrumentType', uid: string, name?: string | null } | null, analysis?: { __typename?: 'AnalysisType', uid: string, name: string } | null }> | null } };

export type UpdateWorkSheetMutationVariables = Exact<{
  worksheetUid: Scalars['String']['input'];
  analystUid?: InputMaybe<Scalars['String']['input']>;
  instrumentUid?: InputMaybe<Scalars['String']['input']>;
  methodUid?: InputMaybe<Scalars['String']['input']>;
  action?: InputMaybe<Scalars['String']['input']>;
  samples?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type UpdateWorkSheetMutation = { __typename?: 'Mutation', updateWorksheet: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'WorkSheetType', uid: string, numberOfSamples?: number | null, sampleTypeUid?: string | null, instrumentUid?: string | null, templateUid?: string | null, sampleType?: { __typename?: 'SampleTypeTyp', name: string } | null, instrument?: { __typename?: 'InstrumentType', uid: string, name?: string | null } | null, template?: { __typename?: 'WorkSheetTemplateType', uid: string, name: string } | null } };

export type EditWorkSheetApplyTemplateMutationVariables = Exact<{
  worksheetUid: Scalars['String']['input'];
  templateUid: Scalars['String']['input'];
}>;


export type EditWorkSheetApplyTemplateMutation = { __typename?: 'Mutation', updateWorksheetApplyTemplate: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'WorkSheetType', uid: string, numberOfSamples?: number | null, sampleTypeUid?: string | null, instrumentUid?: string | null, templateUid?: string | null, sampleType?: { __typename?: 'SampleTypeTyp', name: string } | null, instrument?: { __typename?: 'InstrumentType', uid: string, name?: string | null } | null, template?: { __typename?: 'WorkSheetTemplateType', uid: string, name: string } | null } };

export type ManualyAssignWorsheetMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  qcTemplateUid?: InputMaybe<Scalars['String']['input']>;
  analysesUids: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type ManualyAssignWorsheetMutation = { __typename?: 'Mutation', updateWorksheetManualAssign: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'WorkSheetType', uid: string, numberOfSamples?: number | null, sampleTypeUid?: string | null, instrumentUid?: string | null, templateUid?: string | null, sampleType?: { __typename?: 'SampleTypeTyp', name: string } | null, instrument?: { __typename?: 'InstrumentType', uid: string, name?: string | null } | null, template?: { __typename?: 'WorkSheetTemplateType', uid: string, name: string } | null } };

export type ActionAssignWorsheetMutationVariables = Exact<{
  uids: Array<Scalars['String']['input']> | Scalars['String']['input'];
  action: Scalars['String']['input'];
}>;


export type ActionAssignWorsheetMutation = { __typename?: 'Mutation', actionWorksheets: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'WorksheetListingType', worksheets?: Array<{ __typename?: 'WorkSheetType', uid: string, state?: string | null }> | null } };

export type GetAllWorksheetTemplatesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllWorksheetTemplatesQuery = { __typename?: 'Query', worksheetTemplateAll: Array<{ __typename?: 'WorkSheetTemplateType', uid: string, name: string, reserved?: never | null, numberOfSamples?: number | null, rows?: number | null, cols?: number | null, rowWise: boolean, worksheetType: string, instrumentUid?: string | null, sampleTypeUid?: string | null, description?: string | null, analysisUid?: string | null, state?: string | null, instrument?: { __typename?: 'InstrumentType', uid: string, name?: string | null } | null, sampleType?: { __typename?: 'SampleTypeTyp', uid: string, name: string } | null, analysis?: { __typename?: 'AnalysisType', uid: string, name: string } | null }> };

export type GetAllWorksheetsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  status: Scalars['String']['input'];
  text: Scalars['String']['input'];
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetAllWorksheetsQuery = { __typename?: 'Query', worksheetAll: { __typename?: 'WorkSheetCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'WorkSheetType', uid: string, worksheetId: string, numberOfSamples?: number | null, assignedCount: number, state?: string | null, createdAt?: string | null, analyst?: { __typename?: 'UserType', uid: string, userName: string, firstName?: string | null, lastName?: string | null } | null, instrument?: { __typename?: 'InstrumentType', uid: string, name?: string | null } | null, analysis?: { __typename?: 'AnalysisType', uid: string, name: string } | null }> | null } };

export type GetWorkSheetByUidQueryVariables = Exact<{
  worksheetUid: Scalars['String']['input'];
}>;


export type GetWorkSheetByUidQuery = { __typename?: 'Query', worksheetByUid: { __typename?: 'WorkSheetType', uid: string, worksheetId: string, numberOfSamples?: number | null, assignedCount: number, reserved?: never | null, state?: string | null, createdAt?: string | null, analyst?: { __typename?: 'UserType', uid: string, userName: string, firstName?: string | null, lastName?: string | null } | null, sampleType?: { __typename?: 'SampleTypeTyp', name: string } | null, instrument?: { __typename?: 'InstrumentType', uid: string, name?: string | null } | null, template?: { __typename?: 'WorkSheetTemplateType', uid: string, name: string } | null, analysis?: { __typename?: 'AnalysisType', uid: string, name: string } | null, analysisResults?: Array<{ __typename?: 'AnalysisResultType', uid: string, result?: string | null, status?: string | null, worksheetPosition?: number | null, retest: boolean, reportable: boolean, method?: { __typename?: 'MethodType', uid: string, name?: string | null } | null, laboratoryInstrument?: { __typename?: 'LaboratoryInstrumentType', uid: string, labName?: string | null, instrument?: { __typename?: 'InstrumentType', uid: string, name?: string | null } | null } | null, analysis?: { __typename?: 'AnalysisType', uid: string, name: string, unitUid?: string | null, unit?: { __typename?: 'UnitType', uid: string, name: string } | null, resultOptions?: Array<{ __typename?: 'ResultOptionType', uid: string, optionKey: number, value: string }> | null, interims?: Array<{ __typename?: 'AnalysisInterimType', uid: string, key: number, value: string }> | null, instruments?: Array<{ __typename?: 'InstrumentType', uid: string, name?: string | null, laboratoryInstruments?: Array<{ __typename?: 'LaboratoryInstrumentType', uid: string, labName?: string | null, serialNumber?: string | null }> | null }> | null, methods?: Array<{ __typename?: 'MethodType', uid: string, name?: string | null }> | null } | null, sample: { __typename?: 'SampleType', uid: string, sampleId: string, priority: number, analysisRequest?: { __typename?: 'AnalysisRequestType', uid: string, client?: { __typename?: 'ClientType', uid: string, name: string } | null, patient: { __typename?: 'PatientType', uid: string, firstName?: string | null, lastName?: string | null, clientPatientId: string, patientId: string } } | null, qcLevel?: { __typename?: 'QCLevelType', uid: string, level: string } | null } }> | null } };
