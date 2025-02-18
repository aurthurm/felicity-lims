import type * as Types from '../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetAbxGuidelinesAllQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAbxGuidelinesAllQuery = (
  { __typename?: 'Query' }
  & { abxGuidelinesAll?: Types.Maybe<Array<(
    { __typename?: 'AbxGuidelineType' }
    & Pick<Types.AbxGuidelineType, 'uid' | 'name' | 'code' | 'description'>
  )>> }
);

export type GetAbxGuidelineByUidQueryVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type GetAbxGuidelineByUidQuery = (
  { __typename?: 'Query' }
  & { abxGuidelineByUid?: Types.Maybe<(
    { __typename?: 'AbxGuidelineType' }
    & Pick<Types.AbxGuidelineType, 'uid' | 'name' | 'code' | 'description'>
  )> }
);

export type GetAbxAntibioticAllQueryVariables = Types.Exact<{
  text: Types.Scalars['String']['input'];
  pageSize?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  afterCursor?: Types.InputMaybe<Types.Scalars['String']['input']>;
  beforeCursor?: Types.InputMaybe<Types.Scalars['String']['input']>;
  sortBy?: Types.InputMaybe<Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input']>;
}>;


export type GetAbxAntibioticAllQuery = (
  { __typename?: 'Query' }
  & { abxAntibioticAll: (
    { __typename?: 'AbxAntibioticCursorPage' }
    & Pick<Types.AbxAntibioticCursorPage, 'totalCount'>
    & { items?: Types.Maybe<Array<(
      { __typename?: 'AbxAntibioticType' }
      & Pick<Types.AbxAntibioticType, 'uid' | 'name' | 'whonetAbxCode' | 'whoCode' | 'dinCode' | 'jacCode' | 'eucastCode' | 'userCode' | 'abxNumber' | 'potency' | 'atcCode' | 'class_' | 'subclass' | 'profClass' | 'ciaCategory' | 'clsiOrder' | 'eucastOrder' | 'human' | 'veterinary' | 'animalGp' | 'loinccomp' | 'loincgen' | 'loincdisk' | 'loincmic' | 'loincetest' | 'loincslow' | 'loincafb' | 'loincsbt' | 'loincmlc' | 'createdAt' | 'createdByUid'>
      & { guidelines: Array<(
        { __typename?: 'AbxGuidelineType' }
        & Pick<Types.AbxGuidelineType, 'uid' | 'name'>
      )> }
    )>>, pageInfo: (
      { __typename?: 'PageInfo' }
      & Pick<Types.PageInfo, 'hasNextPage' | 'hasPreviousPage'>
    ) }
  ) }
);

export type GetAbxAntibioticByUidQueryVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type GetAbxAntibioticByUidQuery = (
  { __typename?: 'Query' }
  & { abxAntibioticByUid?: Types.Maybe<(
    { __typename?: 'AbxAntibioticType' }
    & Pick<Types.AbxAntibioticType, 'uid' | 'name' | 'whonetAbxCode' | 'whoCode' | 'dinCode' | 'jacCode' | 'eucastCode' | 'userCode' | 'abxNumber' | 'potency' | 'atcCode' | 'class_' | 'subclass' | 'profClass' | 'ciaCategory' | 'clsiOrder' | 'eucastOrder' | 'human' | 'veterinary' | 'animalGp' | 'loinccomp' | 'loincgen' | 'loincdisk' | 'loincmic' | 'loincetest' | 'loincslow' | 'loincafb' | 'loincsbt' | 'loincmlc' | 'comments' | 'createdAt' | 'createdByUid'>
    & { guidelines: Array<(
      { __typename?: 'AbxGuidelineType' }
      & Pick<Types.AbxGuidelineType, 'uid' | 'name'>
    )> }
  )> }
);

export type GetAbxKingdomAllQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAbxKingdomAllQuery = (
  { __typename?: 'Query' }
  & { abxKingdomAll?: Types.Maybe<Array<(
    { __typename?: 'AbxKingdomType' }
    & Pick<Types.AbxKingdomType, 'uid' | 'name'>
  )>> }
);

export type GetAbxKingdomByUidQueryVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type GetAbxKingdomByUidQuery = (
  { __typename?: 'Query' }
  & { abxKingdomByUid?: Types.Maybe<(
    { __typename?: 'AbxKingdomType' }
    & Pick<Types.AbxKingdomType, 'uid' | 'name'>
  )> }
);

export type GetAbxPhylumAllQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAbxPhylumAllQuery = (
  { __typename?: 'Query' }
  & { abxPhylumAll?: Types.Maybe<Array<(
    { __typename?: 'AbxPhylumType' }
    & Pick<Types.AbxPhylumType, 'uid' | 'name' | 'kingdomUid'>
    & { kingdom?: Types.Maybe<(
      { __typename?: 'AbxKingdomType' }
      & Pick<Types.AbxKingdomType, 'name'>
    )> }
  )>> }
);

export type GetAbxPhylumByUidQueryVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type GetAbxPhylumByUidQuery = (
  { __typename?: 'Query' }
  & { abxPhylumByUid?: Types.Maybe<(
    { __typename?: 'AbxPhylumType' }
    & Pick<Types.AbxPhylumType, 'uid' | 'name' | 'kingdomUid'>
    & { kingdom?: Types.Maybe<(
      { __typename?: 'AbxKingdomType' }
      & Pick<Types.AbxKingdomType, 'name'>
    )> }
  )> }
);

export type GetAbxClassAllQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAbxClassAllQuery = (
  { __typename?: 'Query' }
  & { abxClassAll?: Types.Maybe<Array<(
    { __typename?: 'AbxClassType' }
    & Pick<Types.AbxClassType, 'uid' | 'name' | 'phylumUid'>
    & { phylum?: Types.Maybe<(
      { __typename?: 'AbxPhylumType' }
      & Pick<Types.AbxPhylumType, 'name'>
    )> }
  )>> }
);

export type GetAbxClassByUidQueryVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type GetAbxClassByUidQuery = (
  { __typename?: 'Query' }
  & { abxClassByUid?: Types.Maybe<(
    { __typename?: 'AbxClassType' }
    & Pick<Types.AbxClassType, 'uid' | 'name' | 'phylumUid'>
    & { phylum?: Types.Maybe<(
      { __typename?: 'AbxPhylumType' }
      & Pick<Types.AbxPhylumType, 'name'>
    )> }
  )> }
);

export type GetAbxOrderAllQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAbxOrderAllQuery = (
  { __typename?: 'Query' }
  & { abxOrderAll?: Types.Maybe<Array<(
    { __typename?: 'AbxOrderType' }
    & Pick<Types.AbxOrderType, 'uid' | 'name' | 'classUid'>
    & { class_?: Types.Maybe<(
      { __typename?: 'AbxClassType' }
      & Pick<Types.AbxClassType, 'name'>
    )> }
  )>> }
);

export type GetAbxOrderByUidQueryVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type GetAbxOrderByUidQuery = (
  { __typename?: 'Query' }
  & { abxOrderByUid?: Types.Maybe<(
    { __typename?: 'AbxOrderType' }
    & Pick<Types.AbxOrderType, 'uid' | 'name' | 'classUid'>
    & { class_?: Types.Maybe<(
      { __typename?: 'AbxClassType' }
      & Pick<Types.AbxClassType, 'name'>
    )> }
  )> }
);

export type GetAbxFamilyAllQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAbxFamilyAllQuery = (
  { __typename?: 'Query' }
  & { abxFamilyAll?: Types.Maybe<Array<(
    { __typename?: 'AbxFamilyType' }
    & Pick<Types.AbxFamilyType, 'uid' | 'name' | 'orderUid'>
    & { order?: Types.Maybe<(
      { __typename?: 'AbxOrderType' }
      & Pick<Types.AbxOrderType, 'name'>
    )> }
  )>> }
);

export type GetAbxFamilyByUidQueryVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type GetAbxFamilyByUidQuery = (
  { __typename?: 'Query' }
  & { abxFamilyByUid?: Types.Maybe<(
    { __typename?: 'AbxFamilyType' }
    & Pick<Types.AbxFamilyType, 'uid' | 'name' | 'orderUid'>
    & { order?: Types.Maybe<(
      { __typename?: 'AbxOrderType' }
      & Pick<Types.AbxOrderType, 'name'>
    )> }
  )> }
);

export type GetAbxGenusAllQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAbxGenusAllQuery = (
  { __typename?: 'Query' }
  & { abxGenusAll?: Types.Maybe<Array<(
    { __typename?: 'AbxGenusType' }
    & Pick<Types.AbxGenusType, 'uid' | 'name' | 'familyUid'>
    & { family?: Types.Maybe<(
      { __typename?: 'AbxFamilyType' }
      & Pick<Types.AbxFamilyType, 'name'>
    )> }
  )>> }
);

export type GetAbxGenusByUidQueryVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type GetAbxGenusByUidQuery = (
  { __typename?: 'Query' }
  & { abxGenusByUid?: Types.Maybe<(
    { __typename?: 'AbxGenusType' }
    & Pick<Types.AbxGenusType, 'uid' | 'name' | 'familyUid'>
    & { family?: Types.Maybe<(
      { __typename?: 'AbxFamilyType' }
      & Pick<Types.AbxFamilyType, 'name'>
    )> }
  )> }
);

export type GetAbxOrganismAllQueryVariables = Types.Exact<{
  text: Types.Scalars['String']['input'];
  pageSize?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  afterCursor?: Types.InputMaybe<Types.Scalars['String']['input']>;
  beforeCursor?: Types.InputMaybe<Types.Scalars['String']['input']>;
  sortBy?: Types.InputMaybe<Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input']>;
}>;


export type GetAbxOrganismAllQuery = (
  { __typename?: 'Query' }
  & { abxOrganismAll: (
    { __typename?: 'AbxOrganismCursorPage' }
    & Pick<Types.AbxOrganismCursorPage, 'totalCount'>
    & { items?: Types.Maybe<Array<(
      { __typename?: 'AbxOrganismType' }
      & Pick<Types.AbxOrganismType, 'uid' | 'name' | 'whonetOrgCode' | 'replacedBy' | 'taxonomicStatus' | 'common' | 'organismType' | 'anaerobe' | 'morphology' | 'subkingdomCode' | 'familyCode' | 'genusGroup' | 'genusCode' | 'speciesGroup' | 'serovarGroup' | 'msfGrpClin' | 'sctCode' | 'sctText' | 'gbifTaxonId' | 'gbifDatasetId' | 'gbifTaxonomicStatus' | 'kingdomUid' | 'phylumUid' | 'classUid' | 'orderUid' | 'familyUid' | 'genusUid' | 'comments' | 'createdAt' | 'createdByUid'>
      & { kingdom?: Types.Maybe<(
        { __typename?: 'AbxKingdomType' }
        & Pick<Types.AbxKingdomType, 'name'>
      )>, phylum?: Types.Maybe<(
        { __typename?: 'AbxPhylumType' }
        & Pick<Types.AbxPhylumType, 'name'>
      )>, class_?: Types.Maybe<(
        { __typename?: 'AbxClassType' }
        & Pick<Types.AbxClassType, 'name'>
      )>, order?: Types.Maybe<(
        { __typename?: 'AbxOrderType' }
        & Pick<Types.AbxOrderType, 'name'>
      )>, family?: Types.Maybe<(
        { __typename?: 'AbxFamilyType' }
        & Pick<Types.AbxFamilyType, 'name'>
      )>, genus?: Types.Maybe<(
        { __typename?: 'AbxGenusType' }
        & Pick<Types.AbxGenusType, 'name'>
      )> }
    )>>, pageInfo: (
      { __typename?: 'PageInfo' }
      & Pick<Types.PageInfo, 'hasNextPage' | 'hasPreviousPage'>
    ) }
  ) }
);

export type GetAbxOrganismByUidQueryVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type GetAbxOrganismByUidQuery = (
  { __typename?: 'Query' }
  & { abxOrganismByUid?: Types.Maybe<(
    { __typename?: 'AbxOrganismType' }
    & Pick<Types.AbxOrganismType, 'uid' | 'name' | 'whonetOrgCode' | 'replacedBy' | 'taxonomicStatus' | 'common' | 'organismType' | 'anaerobe' | 'morphology' | 'subkingdomCode' | 'familyCode' | 'genusGroup' | 'genusCode' | 'speciesGroup' | 'serovarGroup' | 'msfGrpClin' | 'sctCode' | 'sctText' | 'gbifTaxonId' | 'gbifDatasetId' | 'gbifTaxonomicStatus' | 'kingdomUid' | 'phylumUid' | 'classUid' | 'orderUid' | 'familyUid' | 'genusUid' | 'comments' | 'createdAt' | 'createdByUid'>
    & { kingdom?: Types.Maybe<(
      { __typename?: 'AbxKingdomType' }
      & Pick<Types.AbxKingdomType, 'name'>
    )>, phylum?: Types.Maybe<(
      { __typename?: 'AbxPhylumType' }
      & Pick<Types.AbxPhylumType, 'name'>
    )>, class_?: Types.Maybe<(
      { __typename?: 'AbxClassType' }
      & Pick<Types.AbxClassType, 'name'>
    )>, order?: Types.Maybe<(
      { __typename?: 'AbxOrderType' }
      & Pick<Types.AbxOrderType, 'name'>
    )>, family?: Types.Maybe<(
      { __typename?: 'AbxFamilyType' }
      & Pick<Types.AbxFamilyType, 'name'>
    )>, genus?: Types.Maybe<(
      { __typename?: 'AbxGenusType' }
      & Pick<Types.AbxGenusType, 'name'>
    )> }
  )> }
);

export type GetAbxOrganismSerotypeAllQueryVariables = Types.Exact<{
  text: Types.Scalars['String']['input'];
  pageSize?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  afterCursor?: Types.InputMaybe<Types.Scalars['String']['input']>;
  beforeCursor?: Types.InputMaybe<Types.Scalars['String']['input']>;
  sortBy?: Types.InputMaybe<Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input']>;
}>;


export type GetAbxOrganismSerotypeAllQuery = (
  { __typename?: 'Query' }
  & { abxOrganismSerotypeAll: (
    { __typename?: 'AbxOrganismSerotypeCursorPage' }
    & Pick<Types.AbxOrganismSerotypeCursorPage, 'totalCount'>
    & { items?: Types.Maybe<Array<(
      { __typename?: 'AbxOrganismSerotypeType' }
      & Pick<Types.AbxOrganismSerotypeType, 'uid' | 'organismUid' | 'serotype' | 'serogroup' | 'subspecies' | 'oAntigens' | 'hPhase1' | 'hPhase2' | 'x997Check' | 'fate' | 'createdAt' | 'createdByUid'>
      & { organism?: Types.Maybe<(
        { __typename?: 'AbxOrganismType' }
        & Pick<Types.AbxOrganismType, 'name'>
      )> }
    )>>, pageInfo: (
      { __typename?: 'PageInfo' }
      & Pick<Types.PageInfo, 'hasNextPage' | 'hasPreviousPage'>
    ) }
  ) }
);

export type GetAbxOrganismSerotypeByUidQueryVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type GetAbxOrganismSerotypeByUidQuery = (
  { __typename?: 'Query' }
  & { abxOrganismSerotypeByUid?: Types.Maybe<(
    { __typename?: 'AbxOrganismSerotypeType' }
    & Pick<Types.AbxOrganismSerotypeType, 'uid' | 'organismUid' | 'serotype' | 'serogroup' | 'subspecies' | 'oAntigens' | 'hPhase1' | 'hPhase2' | 'x997Check' | 'fate' | 'createdAt' | 'createdByUid'>
    & { organism?: Types.Maybe<(
      { __typename?: 'AbxOrganismType' }
      & Pick<Types.AbxOrganismType, 'name'>
    )> }
  )> }
);

export type GetAbxTestMethodAllQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAbxTestMethodAllQuery = (
  { __typename?: 'Query' }
  & { abxTestMethodAll?: Types.Maybe<Array<(
    { __typename?: 'AbxTestMethodType' }
    & Pick<Types.AbxTestMethodType, 'uid' | 'name' | 'description' | 'createdAt' | 'createdByUid'>
  )>> }
);

export type GetAbxTestMethodByUidQueryVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type GetAbxTestMethodByUidQuery = (
  { __typename?: 'Query' }
  & { abxTestMethodByUid?: Types.Maybe<(
    { __typename?: 'AbxTestMethodType' }
    & Pick<Types.AbxTestMethodType, 'uid' | 'name' | 'description' | 'createdAt' | 'createdByUid'>
  )> }
);

export type GetAbxBreakpointTypeAllQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAbxBreakpointTypeAllQuery = (
  { __typename?: 'Query' }
  & { abxBreakpointTypeAll?: Types.Maybe<Array<(
    { __typename?: 'AbxBreakpointTypeTyp' }
    & Pick<Types.AbxBreakpointTypeTyp, 'uid' | 'name' | 'description' | 'createdAt' | 'createdByUid'>
  )>> }
);

export type GetAbxBreakpointTypeByUidQueryVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type GetAbxBreakpointTypeByUidQuery = (
  { __typename?: 'Query' }
  & { abxBreakpointTypeByUid?: Types.Maybe<(
    { __typename?: 'AbxBreakpointTypeTyp' }
    & Pick<Types.AbxBreakpointTypeTyp, 'uid' | 'name' | 'description' | 'createdAt' | 'createdByUid'>
  )> }
);

export type GetAbxHostAllQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAbxHostAllQuery = (
  { __typename?: 'Query' }
  & { abxHostAll?: Types.Maybe<Array<(
    { __typename?: 'AbxHostType' }
    & Pick<Types.AbxHostType, 'uid' | 'name' | 'description' | 'createdAt' | 'createdByUid'>
  )>> }
);

export type GetAbxHostUidQueryVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type GetAbxHostUidQuery = (
  { __typename?: 'Query' }
  & { abxHostByUid?: Types.Maybe<(
    { __typename?: 'AbxHostType' }
    & Pick<Types.AbxHostType, 'uid' | 'name' | 'description' | 'createdAt' | 'createdByUid'>
  )> }
);

export type GetAbxSiteOfInfectionAllQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAbxSiteOfInfectionAllQuery = (
  { __typename?: 'Query' }
  & { abxSiteOfInfectionAll?: Types.Maybe<Array<(
    { __typename?: 'AbxSiteOfInfectionType' }
    & Pick<Types.AbxSiteOfInfectionType, 'uid' | 'name' | 'description' | 'createdAt' | 'createdByUid'>
  )>> }
);

export type GetAbxSiteOfInfectionUidQueryVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type GetAbxSiteOfInfectionUidQuery = (
  { __typename?: 'Query' }
  & { abxSiteOfInfectionByUid?: Types.Maybe<(
    { __typename?: 'AbxSiteOfInfectionType' }
    & Pick<Types.AbxSiteOfInfectionType, 'uid' | 'name' | 'description' | 'createdAt' | 'createdByUid'>
  )> }
);

export type GetAbxBreakpointAllQueryVariables = Types.Exact<{
  text: Types.Scalars['String']['input'];
  pageSize?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  afterCursor?: Types.InputMaybe<Types.Scalars['String']['input']>;
  beforeCursor?: Types.InputMaybe<Types.Scalars['String']['input']>;
  sortBy?: Types.InputMaybe<Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input']>;
}>;


export type GetAbxBreakpointAllQuery = (
  { __typename?: 'Query' }
  & { abxBreakpointAll: (
    { __typename?: 'AbxBreakpointTypCursorPage' }
    & Pick<Types.AbxBreakpointTypCursorPage, 'totalCount'>
    & { items?: Types.Maybe<Array<(
      { __typename?: 'AbxBreakpointTyp' }
      & Pick<Types.AbxBreakpointTyp, 'uid' | 'guidelineUid' | 'year' | 'testMethod' | 'potency' | 'organismCode' | 'organismCodeType' | 'breakpointTypeUid' | 'hostUid' | 'siteOfInfectionUid' | 'referenceTable' | 'referenceSequence' | 'whonetAbxCode' | 'comments' | 'r' | 'i' | 'sdd' | 's' | 'ecvEcoff' | 'ecvEcoffTentative' | 'createdAt' | 'createdByUid'>
      & { guideline?: Types.Maybe<(
        { __typename?: 'AbxGuidelineType' }
        & Pick<Types.AbxGuidelineType, 'name'>
      )>, breakpointType?: Types.Maybe<(
        { __typename?: 'AbxBreakpointTypeTyp' }
        & Pick<Types.AbxBreakpointTypeTyp, 'name'>
      )>, host?: Types.Maybe<(
        { __typename?: 'AbxHostType' }
        & Pick<Types.AbxHostType, 'name'>
      )>, siteOfInfection?: Types.Maybe<(
        { __typename?: 'AbxSiteOfInfectionType' }
        & Pick<Types.AbxSiteOfInfectionType, 'name'>
      )> }
    )>>, pageInfo: (
      { __typename?: 'PageInfo' }
      & Pick<Types.PageInfo, 'hasNextPage' | 'hasPreviousPage'>
    ) }
  ) }
);

export type GetAbxBreakpointUidQueryVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type GetAbxBreakpointUidQuery = (
  { __typename?: 'Query' }
  & { abxBreakpointByUid?: Types.Maybe<(
    { __typename?: 'AbxBreakpointTyp' }
    & Pick<Types.AbxBreakpointTyp, 'uid' | 'guidelineUid' | 'year' | 'testMethod' | 'potency' | 'organismCode' | 'organismCodeType' | 'breakpointTypeUid' | 'hostUid' | 'siteOfInfectionUid' | 'referenceTable' | 'referenceSequence' | 'whonetAbxCode' | 'comments' | 'r' | 'i' | 'sdd' | 's' | 'ecvEcoff' | 'ecvEcoffTentative' | 'createdAt' | 'createdByUid'>
    & { guideline?: Types.Maybe<(
      { __typename?: 'AbxGuidelineType' }
      & Pick<Types.AbxGuidelineType, 'name'>
    )>, breakpointType?: Types.Maybe<(
      { __typename?: 'AbxBreakpointTypeTyp' }
      & Pick<Types.AbxBreakpointTypeTyp, 'name'>
    )>, host?: Types.Maybe<(
      { __typename?: 'AbxHostType' }
      & Pick<Types.AbxHostType, 'name'>
    )>, siteOfInfection?: Types.Maybe<(
      { __typename?: 'AbxSiteOfInfectionType' }
      & Pick<Types.AbxSiteOfInfectionType, 'name'>
    )> }
  )> }
);

export type GetAbxExpectedResistancePhenotypeAllQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAbxExpectedResistancePhenotypeAllQuery = (
  { __typename?: 'Query' }
  & { abxExpectedResistancePhenotypeAll?: Types.Maybe<Array<(
    { __typename?: 'AbxExpResPhenotypeType' }
    & Pick<Types.AbxExpResPhenotypeType, 'uid' | 'guidelineUid' | 'referenceTable' | 'organismCode' | 'organismCodeType' | 'exceptionOrganismCode' | 'exceptionOrganismCodeType' | 'abxCode' | 'abxCodeType' | 'antibioticExceptions' | 'comments' | 'createdAt' | 'createdByUid'>
    & { guideline?: Types.Maybe<(
      { __typename?: 'AbxGuidelineType' }
      & Pick<Types.AbxGuidelineType, 'name'>
    )> }
  )>> }
);

export type GetAbxExpectedResistancePhenotypeUidQueryVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type GetAbxExpectedResistancePhenotypeUidQuery = (
  { __typename?: 'Query' }
  & { abxExpectedResistancePhenotypeByUid?: Types.Maybe<(
    { __typename?: 'AbxExpResPhenotypeType' }
    & Pick<Types.AbxExpResPhenotypeType, 'uid' | 'guidelineUid' | 'referenceTable' | 'organismCode' | 'organismCodeType' | 'exceptionOrganismCode' | 'exceptionOrganismCodeType' | 'abxCode' | 'abxCodeType' | 'antibioticExceptions' | 'comments' | 'createdAt' | 'createdByUid'>
    & { guideline?: Types.Maybe<(
      { __typename?: 'AbxGuidelineType' }
      & Pick<Types.AbxGuidelineType, 'name'>
    )> }
  )> }
);

export type GetAbxExpertInterpretationRuleAllQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAbxExpertInterpretationRuleAllQuery = (
  { __typename?: 'Query' }
  & { abxExpertInterpretationRuleAll?: Types.Maybe<Array<(
    { __typename?: 'AbxExpertInterpretationRuleType' }
    & Pick<Types.AbxExpertInterpretationRuleType, 'uid' | 'ruleCode' | 'description' | 'organismCode' | 'organismCodeType' | 'ruleCriteria' | 'affectedAntibiotics' | 'antibioticExceptions' | 'createdAt' | 'createdByUid'>
  )>> }
);

export type GetAbxExpertInterpretationRuleUidQueryVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type GetAbxExpertInterpretationRuleUidQuery = (
  { __typename?: 'Query' }
  & { abxExpertInterpretationRuleByUid?: Types.Maybe<(
    { __typename?: 'AbxExpertInterpretationRuleType' }
    & Pick<Types.AbxExpertInterpretationRuleType, 'uid' | 'ruleCode' | 'description' | 'organismCode' | 'organismCodeType' | 'ruleCriteria' | 'affectedAntibiotics' | 'antibioticExceptions' | 'createdAt' | 'createdByUid'>
  )> }
);

export type GetAbxMediumAllQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAbxMediumAllQuery = (
  { __typename?: 'Query' }
  & { abxMediumAll?: Types.Maybe<Array<(
    { __typename?: 'AbxMediumType' }
    & Pick<Types.AbxMediumType, 'uid' | 'name' | 'description' | 'createdAt' | 'createdByUid'>
  )>> }
);

export type GetAbxMediumUidQueryVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type GetAbxMediumUidQuery = (
  { __typename?: 'Query' }
  & { abxMediumByUid?: Types.Maybe<(
    { __typename?: 'AbxMediumType' }
    & Pick<Types.AbxMediumType, 'uid' | 'name' | 'description' | 'createdAt' | 'createdByUid'>
  )> }
);

export type GetAbxQcRangeAllQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAbxQcRangeAllQuery = (
  { __typename?: 'Query' }
  & { abxQcRangeAll?: Types.Maybe<Array<(
    { __typename?: 'AbxQCRangeType' }
    & Pick<Types.AbxQcRangeType, 'uid' | 'guidelineUid' | 'year' | 'strain' | 'referenceTable' | 'whonetOrgCode' | 'antibiotic' | 'abxTest' | 'whonetAbxCode' | 'method' | 'mediumUid' | 'minimum' | 'maximum' | 'createdAt' | 'createdByUid'>
    & { guideline?: Types.Maybe<(
      { __typename?: 'AbxGuidelineType' }
      & Pick<Types.AbxGuidelineType, 'name'>
    )>, medium?: Types.Maybe<(
      { __typename?: 'AbxMediumType' }
      & Pick<Types.AbxMediumType, 'name'>
    )> }
  )>> }
);

export type GetAbxQcRangeUidQueryVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type GetAbxQcRangeUidQuery = (
  { __typename?: 'Query' }
  & { abxQcRangeByUid?: Types.Maybe<(
    { __typename?: 'AbxQCRangeType' }
    & Pick<Types.AbxQcRangeType, 'uid' | 'guidelineUid' | 'year' | 'strain' | 'referenceTable' | 'whonetOrgCode' | 'antibiotic' | 'abxTest' | 'whonetAbxCode' | 'method' | 'mediumUid' | 'minimum' | 'maximum' | 'createdAt' | 'createdByUid'>
    & { guideline?: Types.Maybe<(
      { __typename?: 'AbxGuidelineType' }
      & Pick<Types.AbxGuidelineType, 'name'>
    )>, medium?: Types.Maybe<(
      { __typename?: 'AbxMediumType' }
      & Pick<Types.AbxMediumType, 'name'>
    )> }
  )> }
);

export type GetAbxAstPanelAllQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAbxAstPanelAllQuery = (
  { __typename?: 'Query' }
  & { abxAstPanelAll?: Types.Maybe<Array<(
    { __typename?: 'AbxASTPanelType' }
    & Pick<Types.AbxAstPanelType, 'uid' | 'name' | 'description' | 'active' | 'createdAt' | 'createdByUid'>
    & { breakpoints?: Types.Maybe<Array<(
      { __typename?: 'AbxBreakpointTyp' }
      & Pick<Types.AbxBreakpointTyp, 'uid'>
    )>> }
  )>> }
);

export type GetAbxAstPanelUidQueryVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type GetAbxAstPanelUidQuery = (
  { __typename?: 'Query' }
  & { abxAstPanelByUid?: Types.Maybe<(
    { __typename?: 'AbxASTPanelType' }
    & Pick<Types.AbxAstPanelType, 'uid' | 'name' | 'description' | 'active' | 'createdAt' | 'createdByUid'>
    & { breakpoints?: Types.Maybe<Array<(
      { __typename?: 'AbxBreakpointTyp' }
      & Pick<Types.AbxBreakpointTyp, 'uid'>
    )>> }
  )> }
);


export const GetAbxGuidelinesAllDocument = gql`
    query GetAbxGuidelinesAll {
  abxGuidelinesAll {
    uid
    name
    code
    description
  }
}
    `;

export function useGetAbxGuidelinesAllQuery(options: Omit<Urql.UseQueryArgs<never, GetAbxGuidelinesAllQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAbxGuidelinesAllQuery>({ query: GetAbxGuidelinesAllDocument, ...options });
};
export const GetAbxGuidelineByUidDocument = gql`
    query GetAbxGuidelineByUid($uid: String!) {
  abxGuidelineByUid(uid: $uid) {
    uid
    name
    code
    description
  }
}
    `;

export function useGetAbxGuidelineByUidQuery(options: Omit<Urql.UseQueryArgs<never, GetAbxGuidelineByUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAbxGuidelineByUidQuery>({ query: GetAbxGuidelineByUidDocument, ...options });
};
export const GetAbxAntibioticAllDocument = gql`
    query GetAbxAntibioticAll($text: String!, $pageSize: Int, $afterCursor: String, $beforeCursor: String, $sortBy: [String!]) {
  abxAntibioticAll(
    text: $text
    pageSize: $pageSize
    afterCursor: $afterCursor
    beforeCursor: $beforeCursor
    sortBy: $sortBy
  ) {
    totalCount
    items {
      uid
      name
      guidelines {
        uid
        name
      }
      whonetAbxCode
      whoCode
      dinCode
      jacCode
      eucastCode
      userCode
      abxNumber
      potency
      atcCode
      class_
      subclass
      profClass
      ciaCategory
      clsiOrder
      eucastOrder
      human
      veterinary
      animalGp
      loinccomp
      loincgen
      loincdisk
      loincmic
      loincetest
      loincslow
      loincafb
      loincsbt
      loincmlc
      createdAt
      createdByUid
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
    `;

export function useGetAbxAntibioticAllQuery(options: Omit<Urql.UseQueryArgs<never, GetAbxAntibioticAllQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAbxAntibioticAllQuery>({ query: GetAbxAntibioticAllDocument, ...options });
};
export const GetAbxAntibioticByUidDocument = gql`
    query GetAbxAntibioticByUid($uid: String!) {
  abxAntibioticByUid(uid: $uid) {
    uid
    name
    guidelines {
      uid
      name
    }
    whonetAbxCode
    whoCode
    dinCode
    jacCode
    eucastCode
    userCode
    abxNumber
    potency
    atcCode
    class_
    subclass
    profClass
    ciaCategory
    clsiOrder
    eucastOrder
    human
    veterinary
    animalGp
    loinccomp
    loincgen
    loincdisk
    loincmic
    loincetest
    loincslow
    loincafb
    loincsbt
    loincmlc
    comments
    createdAt
    createdByUid
  }
}
    `;

export function useGetAbxAntibioticByUidQuery(options: Omit<Urql.UseQueryArgs<never, GetAbxAntibioticByUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAbxAntibioticByUidQuery>({ query: GetAbxAntibioticByUidDocument, ...options });
};
export const GetAbxKingdomAllDocument = gql`
    query GetAbxKingdomAll {
  abxKingdomAll {
    uid
    name
  }
}
    `;

export function useGetAbxKingdomAllQuery(options: Omit<Urql.UseQueryArgs<never, GetAbxKingdomAllQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAbxKingdomAllQuery>({ query: GetAbxKingdomAllDocument, ...options });
};
export const GetAbxKingdomByUidDocument = gql`
    query GetAbxKingdomByUid($uid: String!) {
  abxKingdomByUid(uid: $uid) {
    uid
    name
  }
}
    `;

export function useGetAbxKingdomByUidQuery(options: Omit<Urql.UseQueryArgs<never, GetAbxKingdomByUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAbxKingdomByUidQuery>({ query: GetAbxKingdomByUidDocument, ...options });
};
export const GetAbxPhylumAllDocument = gql`
    query GetAbxPhylumAll {
  abxPhylumAll {
    uid
    name
    kingdomUid
    kingdom {
      name
    }
  }
}
    `;

export function useGetAbxPhylumAllQuery(options: Omit<Urql.UseQueryArgs<never, GetAbxPhylumAllQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAbxPhylumAllQuery>({ query: GetAbxPhylumAllDocument, ...options });
};
export const GetAbxPhylumByUidDocument = gql`
    query GetAbxPhylumByUid($uid: String!) {
  abxPhylumByUid(uid: $uid) {
    uid
    name
    kingdomUid
    kingdom {
      name
    }
  }
}
    `;

export function useGetAbxPhylumByUidQuery(options: Omit<Urql.UseQueryArgs<never, GetAbxPhylumByUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAbxPhylumByUidQuery>({ query: GetAbxPhylumByUidDocument, ...options });
};
export const GetAbxClassAllDocument = gql`
    query GetAbxClassAll {
  abxClassAll {
    uid
    name
    phylumUid
    phylum {
      name
    }
  }
}
    `;

export function useGetAbxClassAllQuery(options: Omit<Urql.UseQueryArgs<never, GetAbxClassAllQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAbxClassAllQuery>({ query: GetAbxClassAllDocument, ...options });
};
export const GetAbxClassByUidDocument = gql`
    query GetAbxClassByUid($uid: String!) {
  abxClassByUid(uid: $uid) {
    uid
    name
    phylumUid
    phylum {
      name
    }
  }
}
    `;

export function useGetAbxClassByUidQuery(options: Omit<Urql.UseQueryArgs<never, GetAbxClassByUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAbxClassByUidQuery>({ query: GetAbxClassByUidDocument, ...options });
};
export const GetAbxOrderAllDocument = gql`
    query GetAbxOrderAll {
  abxOrderAll {
    uid
    name
    classUid
    class_ {
      name
    }
  }
}
    `;

export function useGetAbxOrderAllQuery(options: Omit<Urql.UseQueryArgs<never, GetAbxOrderAllQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAbxOrderAllQuery>({ query: GetAbxOrderAllDocument, ...options });
};
export const GetAbxOrderByUidDocument = gql`
    query GetAbxOrderByUid($uid: String!) {
  abxOrderByUid(uid: $uid) {
    uid
    name
    classUid
    class_ {
      name
    }
  }
}
    `;

export function useGetAbxOrderByUidQuery(options: Omit<Urql.UseQueryArgs<never, GetAbxOrderByUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAbxOrderByUidQuery>({ query: GetAbxOrderByUidDocument, ...options });
};
export const GetAbxFamilyAllDocument = gql`
    query GetAbxFamilyAll {
  abxFamilyAll {
    uid
    name
    orderUid
    order {
      name
    }
  }
}
    `;

export function useGetAbxFamilyAllQuery(options: Omit<Urql.UseQueryArgs<never, GetAbxFamilyAllQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAbxFamilyAllQuery>({ query: GetAbxFamilyAllDocument, ...options });
};
export const GetAbxFamilyByUidDocument = gql`
    query GetAbxFamilyByUid($uid: String!) {
  abxFamilyByUid(uid: $uid) {
    uid
    name
    orderUid
    order {
      name
    }
  }
}
    `;

export function useGetAbxFamilyByUidQuery(options: Omit<Urql.UseQueryArgs<never, GetAbxFamilyByUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAbxFamilyByUidQuery>({ query: GetAbxFamilyByUidDocument, ...options });
};
export const GetAbxGenusAllDocument = gql`
    query GetAbxGenusAll {
  abxGenusAll {
    uid
    name
    familyUid
    family {
      name
    }
  }
}
    `;

export function useGetAbxGenusAllQuery(options: Omit<Urql.UseQueryArgs<never, GetAbxGenusAllQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAbxGenusAllQuery>({ query: GetAbxGenusAllDocument, ...options });
};
export const GetAbxGenusByUidDocument = gql`
    query GetAbxGenusByUid($uid: String!) {
  abxGenusByUid(uid: $uid) {
    uid
    name
    familyUid
    family {
      name
    }
  }
}
    `;

export function useGetAbxGenusByUidQuery(options: Omit<Urql.UseQueryArgs<never, GetAbxGenusByUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAbxGenusByUidQuery>({ query: GetAbxGenusByUidDocument, ...options });
};
export const GetAbxOrganismAllDocument = gql`
    query GetAbxOrganismAll($text: String!, $pageSize: Int, $afterCursor: String, $beforeCursor: String, $sortBy: [String!]) {
  abxOrganismAll(
    text: $text
    pageSize: $pageSize
    afterCursor: $afterCursor
    beforeCursor: $beforeCursor
    sortBy: $sortBy
  ) {
    totalCount
    items {
      uid
      name
      whonetOrgCode
      replacedBy
      taxonomicStatus
      common
      organismType
      anaerobe
      morphology
      subkingdomCode
      familyCode
      genusGroup
      genusCode
      speciesGroup
      serovarGroup
      msfGrpClin
      sctCode
      sctText
      gbifTaxonId
      gbifDatasetId
      gbifTaxonomicStatus
      kingdomUid
      kingdom {
        name
      }
      phylumUid
      phylum {
        name
      }
      classUid
      class_ {
        name
      }
      orderUid
      order {
        name
      }
      familyUid
      family {
        name
      }
      genusUid
      genus {
        name
      }
      comments
      createdAt
      createdByUid
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
    `;

export function useGetAbxOrganismAllQuery(options: Omit<Urql.UseQueryArgs<never, GetAbxOrganismAllQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAbxOrganismAllQuery>({ query: GetAbxOrganismAllDocument, ...options });
};
export const GetAbxOrganismByUidDocument = gql`
    query GetAbxOrganismByUid($uid: String!) {
  abxOrganismByUid(uid: $uid) {
    uid
    name
    whonetOrgCode
    replacedBy
    taxonomicStatus
    common
    organismType
    anaerobe
    morphology
    subkingdomCode
    familyCode
    genusGroup
    genusCode
    speciesGroup
    serovarGroup
    msfGrpClin
    sctCode
    sctText
    gbifTaxonId
    gbifDatasetId
    gbifTaxonomicStatus
    kingdomUid
    kingdom {
      name
    }
    phylumUid
    phylum {
      name
    }
    classUid
    class_ {
      name
    }
    orderUid
    order {
      name
    }
    familyUid
    family {
      name
    }
    genusUid
    genus {
      name
    }
    comments
    createdAt
    createdByUid
  }
}
    `;

export function useGetAbxOrganismByUidQuery(options: Omit<Urql.UseQueryArgs<never, GetAbxOrganismByUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAbxOrganismByUidQuery>({ query: GetAbxOrganismByUidDocument, ...options });
};
export const GetAbxOrganismSerotypeAllDocument = gql`
    query GetAbxOrganismSerotypeAll($text: String!, $pageSize: Int, $afterCursor: String, $beforeCursor: String, $sortBy: [String!]) {
  abxOrganismSerotypeAll(
    text: $text
    pageSize: $pageSize
    afterCursor: $afterCursor
    beforeCursor: $beforeCursor
    sortBy: $sortBy
  ) {
    totalCount
    items {
      uid
      organismUid
      organism {
        name
      }
      serotype
      serogroup
      subspecies
      oAntigens
      hPhase1
      hPhase2
      x997Check
      fate
      createdAt
      createdByUid
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
    `;

export function useGetAbxOrganismSerotypeAllQuery(options: Omit<Urql.UseQueryArgs<never, GetAbxOrganismSerotypeAllQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAbxOrganismSerotypeAllQuery>({ query: GetAbxOrganismSerotypeAllDocument, ...options });
};
export const GetAbxOrganismSerotypeByUidDocument = gql`
    query GetAbxOrganismSerotypeByUid($uid: String!) {
  abxOrganismSerotypeByUid(uid: $uid) {
    uid
    organismUid
    organism {
      name
    }
    serotype
    serogroup
    subspecies
    oAntigens
    hPhase1
    hPhase2
    x997Check
    fate
    createdAt
    createdByUid
  }
}
    `;

export function useGetAbxOrganismSerotypeByUidQuery(options: Omit<Urql.UseQueryArgs<never, GetAbxOrganismSerotypeByUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAbxOrganismSerotypeByUidQuery>({ query: GetAbxOrganismSerotypeByUidDocument, ...options });
};
export const GetAbxTestMethodAllDocument = gql`
    query GetAbxTestMethodAll {
  abxTestMethodAll {
    uid
    name
    description
    createdAt
    createdByUid
  }
}
    `;

export function useGetAbxTestMethodAllQuery(options: Omit<Urql.UseQueryArgs<never, GetAbxTestMethodAllQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAbxTestMethodAllQuery>({ query: GetAbxTestMethodAllDocument, ...options });
};
export const GetAbxTestMethodByUidDocument = gql`
    query GetAbxTestMethodByUid($uid: String!) {
  abxTestMethodByUid(uid: $uid) {
    uid
    name
    description
    createdAt
    createdByUid
  }
}
    `;

export function useGetAbxTestMethodByUidQuery(options: Omit<Urql.UseQueryArgs<never, GetAbxTestMethodByUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAbxTestMethodByUidQuery>({ query: GetAbxTestMethodByUidDocument, ...options });
};
export const GetAbxBreakpointTypeAllDocument = gql`
    query GetAbxBreakpointTypeAll {
  abxBreakpointTypeAll {
    uid
    name
    description
    createdAt
    createdByUid
  }
}
    `;

export function useGetAbxBreakpointTypeAllQuery(options: Omit<Urql.UseQueryArgs<never, GetAbxBreakpointTypeAllQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAbxBreakpointTypeAllQuery>({ query: GetAbxBreakpointTypeAllDocument, ...options });
};
export const GetAbxBreakpointTypeByUidDocument = gql`
    query GetAbxBreakpointTypeByUid($uid: String!) {
  abxBreakpointTypeByUid(uid: $uid) {
    uid
    name
    description
    createdAt
    createdByUid
  }
}
    `;

export function useGetAbxBreakpointTypeByUidQuery(options: Omit<Urql.UseQueryArgs<never, GetAbxBreakpointTypeByUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAbxBreakpointTypeByUidQuery>({ query: GetAbxBreakpointTypeByUidDocument, ...options });
};
export const GetAbxHostAllDocument = gql`
    query GetAbxHostAll {
  abxHostAll {
    uid
    name
    description
    createdAt
    createdByUid
  }
}
    `;

export function useGetAbxHostAllQuery(options: Omit<Urql.UseQueryArgs<never, GetAbxHostAllQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAbxHostAllQuery>({ query: GetAbxHostAllDocument, ...options });
};
export const GetAbxHostUidDocument = gql`
    query GetAbxHostUid($uid: String!) {
  abxHostByUid(uid: $uid) {
    uid
    name
    description
    createdAt
    createdByUid
  }
}
    `;

export function useGetAbxHostUidQuery(options: Omit<Urql.UseQueryArgs<never, GetAbxHostUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAbxHostUidQuery>({ query: GetAbxHostUidDocument, ...options });
};
export const GetAbxSiteOfInfectionAllDocument = gql`
    query GetAbxSiteOfInfectionAll {
  abxSiteOfInfectionAll {
    uid
    name
    description
    createdAt
    createdByUid
  }
}
    `;

export function useGetAbxSiteOfInfectionAllQuery(options: Omit<Urql.UseQueryArgs<never, GetAbxSiteOfInfectionAllQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAbxSiteOfInfectionAllQuery>({ query: GetAbxSiteOfInfectionAllDocument, ...options });
};
export const GetAbxSiteOfInfectionUidDocument = gql`
    query GetAbxSiteOfInfectionUid($uid: String!) {
  abxSiteOfInfectionByUid(uid: $uid) {
    uid
    name
    description
    createdAt
    createdByUid
  }
}
    `;

export function useGetAbxSiteOfInfectionUidQuery(options: Omit<Urql.UseQueryArgs<never, GetAbxSiteOfInfectionUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAbxSiteOfInfectionUidQuery>({ query: GetAbxSiteOfInfectionUidDocument, ...options });
};
export const GetAbxBreakpointAllDocument = gql`
    query GetAbxBreakpointAll($text: String!, $pageSize: Int, $afterCursor: String, $beforeCursor: String, $sortBy: [String!]) {
  abxBreakpointAll(
    text: $text
    pageSize: $pageSize
    afterCursor: $afterCursor
    beforeCursor: $beforeCursor
    sortBy: $sortBy
  ) {
    items {
      uid
      guidelineUid
      guideline {
        name
      }
      year
      testMethod
      potency
      organismCode
      organismCodeType
      breakpointTypeUid
      breakpointType {
        name
      }
      hostUid
      host {
        name
      }
      siteOfInfectionUid
      siteOfInfection {
        name
      }
      referenceTable
      referenceSequence
      whonetAbxCode
      comments
      r
      i
      sdd
      s
      ecvEcoff
      ecvEcoffTentative
      createdAt
      createdByUid
    }
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
    `;

export function useGetAbxBreakpointAllQuery(options: Omit<Urql.UseQueryArgs<never, GetAbxBreakpointAllQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAbxBreakpointAllQuery>({ query: GetAbxBreakpointAllDocument, ...options });
};
export const GetAbxBreakpointUidDocument = gql`
    query GetAbxBreakpointUid($uid: String!) {
  abxBreakpointByUid(uid: $uid) {
    uid
    guidelineUid
    guideline {
      name
    }
    year
    testMethod
    potency
    organismCode
    organismCodeType
    breakpointTypeUid
    breakpointType {
      name
    }
    hostUid
    host {
      name
    }
    siteOfInfectionUid
    siteOfInfection {
      name
    }
    referenceTable
    referenceSequence
    whonetAbxCode
    comments
    r
    i
    sdd
    s
    ecvEcoff
    ecvEcoffTentative
    createdAt
    createdByUid
  }
}
    `;

export function useGetAbxBreakpointUidQuery(options: Omit<Urql.UseQueryArgs<never, GetAbxBreakpointUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAbxBreakpointUidQuery>({ query: GetAbxBreakpointUidDocument, ...options });
};
export const GetAbxExpectedResistancePhenotypeAllDocument = gql`
    query GetAbxExpectedResistancePhenotypeAll {
  abxExpectedResistancePhenotypeAll {
    uid
    guidelineUid
    guideline {
      name
    }
    referenceTable
    organismCode
    organismCodeType
    exceptionOrganismCode
    exceptionOrganismCodeType
    abxCode
    abxCodeType
    antibioticExceptions
    comments
    createdAt
    createdByUid
  }
}
    `;

export function useGetAbxExpectedResistancePhenotypeAllQuery(options: Omit<Urql.UseQueryArgs<never, GetAbxExpectedResistancePhenotypeAllQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAbxExpectedResistancePhenotypeAllQuery>({ query: GetAbxExpectedResistancePhenotypeAllDocument, ...options });
};
export const GetAbxExpectedResistancePhenotypeUidDocument = gql`
    query GetAbxExpectedResistancePhenotypeUid($uid: String!) {
  abxExpectedResistancePhenotypeByUid(uid: $uid) {
    uid
    guidelineUid
    guideline {
      name
    }
    referenceTable
    organismCode
    organismCodeType
    exceptionOrganismCode
    exceptionOrganismCodeType
    abxCode
    abxCodeType
    antibioticExceptions
    comments
    createdAt
    createdByUid
  }
}
    `;

export function useGetAbxExpectedResistancePhenotypeUidQuery(options: Omit<Urql.UseQueryArgs<never, GetAbxExpectedResistancePhenotypeUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAbxExpectedResistancePhenotypeUidQuery>({ query: GetAbxExpectedResistancePhenotypeUidDocument, ...options });
};
export const GetAbxExpertInterpretationRuleAllDocument = gql`
    query GetAbxExpertInterpretationRuleAll {
  abxExpertInterpretationRuleAll {
    uid
    ruleCode
    description
    organismCode
    organismCodeType
    ruleCriteria
    affectedAntibiotics
    antibioticExceptions
    createdAt
    createdByUid
  }
}
    `;

export function useGetAbxExpertInterpretationRuleAllQuery(options: Omit<Urql.UseQueryArgs<never, GetAbxExpertInterpretationRuleAllQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAbxExpertInterpretationRuleAllQuery>({ query: GetAbxExpertInterpretationRuleAllDocument, ...options });
};
export const GetAbxExpertInterpretationRuleUidDocument = gql`
    query GetAbxExpertInterpretationRuleUid($uid: String!) {
  abxExpertInterpretationRuleByUid(uid: $uid) {
    uid
    ruleCode
    description
    organismCode
    organismCodeType
    ruleCriteria
    affectedAntibiotics
    antibioticExceptions
    createdAt
    createdByUid
  }
}
    `;

export function useGetAbxExpertInterpretationRuleUidQuery(options: Omit<Urql.UseQueryArgs<never, GetAbxExpertInterpretationRuleUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAbxExpertInterpretationRuleUidQuery>({ query: GetAbxExpertInterpretationRuleUidDocument, ...options });
};
export const GetAbxMediumAllDocument = gql`
    query GetAbxMediumAll {
  abxMediumAll {
    uid
    name
    description
    createdAt
    createdByUid
  }
}
    `;

export function useGetAbxMediumAllQuery(options: Omit<Urql.UseQueryArgs<never, GetAbxMediumAllQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAbxMediumAllQuery>({ query: GetAbxMediumAllDocument, ...options });
};
export const GetAbxMediumUidDocument = gql`
    query GetAbxMediumUid($uid: String!) {
  abxMediumByUid(uid: $uid) {
    uid
    name
    description
    createdAt
    createdByUid
  }
}
    `;

export function useGetAbxMediumUidQuery(options: Omit<Urql.UseQueryArgs<never, GetAbxMediumUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAbxMediumUidQuery>({ query: GetAbxMediumUidDocument, ...options });
};
export const GetAbxQcRangeAllDocument = gql`
    query GetAbxQcRangeAll {
  abxQcRangeAll {
    uid
    guidelineUid
    guideline {
      name
    }
    year
    strain
    referenceTable
    whonetOrgCode
    antibiotic
    abxTest
    whonetAbxCode
    method
    mediumUid
    medium {
      name
    }
    minimum
    maximum
    createdAt
    createdByUid
  }
}
    `;

export function useGetAbxQcRangeAllQuery(options: Omit<Urql.UseQueryArgs<never, GetAbxQcRangeAllQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAbxQcRangeAllQuery>({ query: GetAbxQcRangeAllDocument, ...options });
};
export const GetAbxQcRangeUidDocument = gql`
    query GetAbxQcRangeUid($uid: String!) {
  abxQcRangeByUid(uid: $uid) {
    uid
    guidelineUid
    guideline {
      name
    }
    year
    strain
    referenceTable
    whonetOrgCode
    antibiotic
    abxTest
    whonetAbxCode
    method
    mediumUid
    medium {
      name
    }
    minimum
    maximum
    createdAt
    createdByUid
  }
}
    `;

export function useGetAbxQcRangeUidQuery(options: Omit<Urql.UseQueryArgs<never, GetAbxQcRangeUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAbxQcRangeUidQuery>({ query: GetAbxQcRangeUidDocument, ...options });
};
export const GetAbxAstPanelAllDocument = gql`
    query GetAbxAstPanelAll {
  abxAstPanelAll {
    uid
    name
    description
    breakpoints {
      uid
    }
    active
    createdAt
    createdByUid
  }
}
    `;

export function useGetAbxAstPanelAllQuery(options: Omit<Urql.UseQueryArgs<never, GetAbxAstPanelAllQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAbxAstPanelAllQuery>({ query: GetAbxAstPanelAllDocument, ...options });
};
export const GetAbxAstPanelUidDocument = gql`
    query GetAbxAstPanelUid($uid: String!) {
  abxAstPanelByUid(uid: $uid) {
    uid
    name
    description
    breakpoints {
      uid
    }
    active
    createdAt
    createdByUid
  }
}
    `;

export function useGetAbxAstPanelUidQuery(options: Omit<Urql.UseQueryArgs<never, GetAbxAstPanelUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAbxAstPanelUidQuery>({ query: GetAbxAstPanelUidDocument, ...options });
};