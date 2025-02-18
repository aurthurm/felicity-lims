import type * as Types from '../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type AddAbxGuidelineMutationVariables = Types.Exact<{
  payload: Types.AbxGuidelineInputType;
}>;


export type AddAbxGuidelineMutation = (
  { __typename?: 'Mutation' }
  & { createAbxGuideline: (
    { __typename?: 'AbxGuidelineType' }
    & Pick<Types.AbxGuidelineType, 'uid' | 'name' | 'code' | 'description'>
  ) | { __typename?: 'OperationError' } }
);

export type EditAbxGuidelineMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.AbxGuidelineInputType;
}>;


export type EditAbxGuidelineMutation = (
  { __typename?: 'Mutation' }
  & { updateAbxGuideline: (
    { __typename?: 'AbxGuidelineType' }
    & Pick<Types.AbxGuidelineType, 'uid' | 'name' | 'code' | 'description'>
  ) | { __typename?: 'OperationError' } }
);

export type AddAbxAntibioticMutationVariables = Types.Exact<{
  payload: Types.AbxAntibioticInputType;
}>;


export type AddAbxAntibioticMutation = (
  { __typename?: 'Mutation' }
  & { createAbxAntibiotic: (
    { __typename?: 'AbxAntibioticType' }
    & Pick<Types.AbxAntibioticType, 'uid' | 'name' | 'whonetAbxCode' | 'whoCode' | 'dinCode' | 'jacCode' | 'eucastCode' | 'userCode' | 'abxNumber' | 'potency' | 'atcCode' | 'class_' | 'subclass' | 'profClass' | 'ciaCategory' | 'clsiOrder' | 'eucastOrder' | 'human' | 'veterinary' | 'animalGp' | 'loinccomp' | 'loincgen' | 'loincdisk' | 'loincmic' | 'loincetest' | 'loincslow' | 'loincafb' | 'loincsbt' | 'loincmlc' | 'createdAt' | 'createdByUid'>
    & { guidelines: Array<(
      { __typename?: 'AbxGuidelineType' }
      & Pick<Types.AbxGuidelineType, 'uid' | 'name'>
    )> }
  ) | { __typename?: 'OperationError' } }
);

export type EditAbxAntibioticMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.AbxAntibioticInputType;
}>;


export type EditAbxAntibioticMutation = (
  { __typename?: 'Mutation' }
  & { updateAbxAntibiotic: (
    { __typename?: 'AbxAntibioticType' }
    & Pick<Types.AbxAntibioticType, 'uid' | 'name' | 'whonetAbxCode' | 'whoCode' | 'dinCode' | 'jacCode' | 'eucastCode' | 'userCode' | 'abxNumber' | 'potency' | 'atcCode' | 'class_' | 'subclass' | 'profClass' | 'ciaCategory' | 'clsiOrder' | 'eucastOrder' | 'human' | 'veterinary' | 'animalGp' | 'loinccomp' | 'loincgen' | 'loincdisk' | 'loincmic' | 'loincetest' | 'loincslow' | 'loincafb' | 'loincsbt' | 'loincmlc' | 'createdAt' | 'createdByUid'>
    & { guidelines: Array<(
      { __typename?: 'AbxGuidelineType' }
      & Pick<Types.AbxGuidelineType, 'uid' | 'name'>
    )> }
  ) | { __typename?: 'OperationError' } }
);

export type AddAbxAstPanelMutationVariables = Types.Exact<{
  payload: Types.AbxAstPanelInputType;
}>;


export type AddAbxAstPanelMutation = (
  { __typename?: 'Mutation' }
  & { createAbxAstPanel: (
    { __typename?: 'AbxASTPanelType' }
    & Pick<Types.AbxAstPanelType, 'uid' | 'name' | 'description' | 'active' | 'createdAt' | 'createdByUid'>
    & { breakpoints?: Types.Maybe<Array<(
      { __typename?: 'AbxBreakpointTyp' }
      & Pick<Types.AbxBreakpointTyp, 'uid'>
    )>> }
  ) | { __typename?: 'OperationError' } }
);

export type EditAbxAstPanelMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.AbxAstPanelInputType;
}>;


export type EditAbxAstPanelMutation = (
  { __typename?: 'Mutation' }
  & { updateAbxAstPanel: (
    { __typename?: 'AbxASTPanelType' }
    & Pick<Types.AbxAstPanelType, 'uid' | 'name' | 'description' | 'active' | 'createdAt' | 'createdByUid'>
    & { breakpoints?: Types.Maybe<Array<(
      { __typename?: 'AbxBreakpointTyp' }
      & Pick<Types.AbxBreakpointTyp, 'uid'>
    )>> }
  ) | { __typename?: 'OperationError' } }
);

export type AddAbxTestMethodMutationVariables = Types.Exact<{
  payload: Types.AbxTestMethodInputType;
}>;


export type AddAbxTestMethodMutation = (
  { __typename?: 'Mutation' }
  & { createAbxTestMethod: (
    { __typename?: 'AbxTestMethodType' }
    & Pick<Types.AbxTestMethodType, 'uid' | 'name' | 'description' | 'createdAt' | 'createdByUid'>
  ) | { __typename?: 'OperationError' } }
);

export type EditAbxTestMethodMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.AbxTestMethodInputType;
}>;


export type EditAbxTestMethodMutation = (
  { __typename?: 'Mutation' }
  & { updateAbxTestMethod: (
    { __typename?: 'AbxTestMethodType' }
    & Pick<Types.AbxTestMethodType, 'uid' | 'name' | 'description' | 'createdAt' | 'createdByUid'>
  ) | { __typename?: 'OperationError' } }
);

export type AddAbxBreakpointTypeMutationVariables = Types.Exact<{
  payload: Types.AbxBreakpointTypeInputType;
}>;


export type AddAbxBreakpointTypeMutation = (
  { __typename?: 'Mutation' }
  & { createAbxBreakpointType: (
    { __typename?: 'AbxBreakpointTypeTyp' }
    & Pick<Types.AbxBreakpointTypeTyp, 'uid' | 'name' | 'description' | 'createdAt' | 'createdByUid'>
  ) | { __typename?: 'OperationError' } }
);

export type EditAbxBreakpointTypeMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.AbxBreakpointTypeInputType;
}>;


export type EditAbxBreakpointTypeMutation = (
  { __typename?: 'Mutation' }
  & { updateAbxBreakpointType: (
    { __typename?: 'AbxBreakpointTypeTyp' }
    & Pick<Types.AbxBreakpointTypeTyp, 'uid' | 'name' | 'description' | 'createdAt' | 'createdByUid'>
  ) | { __typename?: 'OperationError' } }
);

export type AddAbxHostMutationVariables = Types.Exact<{
  payload: Types.AbxHostInputType;
}>;


export type AddAbxHostMutation = (
  { __typename?: 'Mutation' }
  & { createAbxHost: (
    { __typename?: 'AbxHostType' }
    & Pick<Types.AbxHostType, 'uid' | 'name' | 'description' | 'createdAt' | 'createdByUid'>
  ) | { __typename?: 'OperationError' } }
);

export type EditAbxHostMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.AbxHostInputType;
}>;


export type EditAbxHostMutation = (
  { __typename?: 'Mutation' }
  & { updateAbxHost: (
    { __typename?: 'AbxHostType' }
    & Pick<Types.AbxHostType, 'uid' | 'name' | 'description' | 'createdAt' | 'createdByUid'>
  ) | { __typename?: 'OperationError' } }
);

export type AddAbxSiteOfInfectionMutationVariables = Types.Exact<{
  payload: Types.AbxSiteOfInfectionInputType;
}>;


export type AddAbxSiteOfInfectionMutation = (
  { __typename?: 'Mutation' }
  & { createAbxSiteOfInfection: (
    { __typename?: 'AbxSiteOfInfectionType' }
    & Pick<Types.AbxSiteOfInfectionType, 'uid' | 'name' | 'description' | 'createdAt' | 'createdByUid'>
  ) | { __typename?: 'OperationError' } }
);

export type EditAbxSiteOfInfectionMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.AbxSiteOfInfectionInputType;
}>;


export type EditAbxSiteOfInfectionMutation = (
  { __typename?: 'Mutation' }
  & { updateAbxSiteOfInfection: (
    { __typename?: 'AbxSiteOfInfectionType' }
    & Pick<Types.AbxSiteOfInfectionType, 'uid' | 'name' | 'description' | 'createdAt' | 'createdByUid'>
  ) | { __typename?: 'OperationError' } }
);

export type AddAbxBreakpointMutationVariables = Types.Exact<{
  payload: Types.AbxBreakpointInputType;
}>;


export type AddAbxBreakpointMutation = (
  { __typename?: 'Mutation' }
  & { createAbxBreakpoint: (
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
  ) | { __typename?: 'OperationError' } }
);

export type EditAbxBreakpointMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.AbxBreakpointInputType;
}>;


export type EditAbxBreakpointMutation = (
  { __typename?: 'Mutation' }
  & { updateAbxBreakpoint: (
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
  ) | { __typename?: 'OperationError' } }
);

export type AddAbxMediumMutationVariables = Types.Exact<{
  payload: Types.AbxMediumInputType;
}>;


export type AddAbxMediumMutation = (
  { __typename?: 'Mutation' }
  & { createAbxMedium: (
    { __typename?: 'AbxMediumType' }
    & Pick<Types.AbxMediumType, 'uid' | 'name' | 'description' | 'createdAt' | 'createdByUid'>
  ) | { __typename?: 'OperationError' } }
);

export type EditAbxMediumMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.AbxMediumInputType;
}>;


export type EditAbxMediumMutation = (
  { __typename?: 'Mutation' }
  & { updateAbxMedium: (
    { __typename?: 'AbxMediumType' }
    & Pick<Types.AbxMediumType, 'uid' | 'name' | 'description' | 'createdAt' | 'createdByUid'>
  ) | { __typename?: 'OperationError' } }
);

export type AddAbxQcRangeMutationVariables = Types.Exact<{
  payload: Types.AbxQcRangeInputType;
}>;


export type AddAbxQcRangeMutation = (
  { __typename?: 'Mutation' }
  & { createAbxQcRange: (
    { __typename?: 'AbxQCRangeType' }
    & Pick<Types.AbxQcRangeType, 'uid' | 'guidelineUid' | 'year' | 'strain' | 'referenceTable' | 'whonetOrgCode' | 'antibiotic' | 'abxTest' | 'whonetAbxCode' | 'method' | 'mediumUid' | 'minimum' | 'maximum' | 'createdAt' | 'createdByUid'>
    & { guideline?: Types.Maybe<(
      { __typename?: 'AbxGuidelineType' }
      & Pick<Types.AbxGuidelineType, 'name'>
    )>, medium?: Types.Maybe<(
      { __typename?: 'AbxMediumType' }
      & Pick<Types.AbxMediumType, 'name'>
    )> }
  ) | { __typename?: 'OperationError' } }
);

export type EditAbxQcRangeMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.AbxQcRangeInputType;
}>;


export type EditAbxQcRangeMutation = (
  { __typename?: 'Mutation' }
  & { updateAbxQcRange: (
    { __typename?: 'AbxQCRangeType' }
    & Pick<Types.AbxQcRangeType, 'uid' | 'guidelineUid' | 'year' | 'strain' | 'referenceTable' | 'whonetOrgCode' | 'antibiotic' | 'abxTest' | 'whonetAbxCode' | 'method' | 'mediumUid' | 'minimum' | 'maximum' | 'createdAt' | 'createdByUid'>
    & { guideline?: Types.Maybe<(
      { __typename?: 'AbxGuidelineType' }
      & Pick<Types.AbxGuidelineType, 'name'>
    )>, medium?: Types.Maybe<(
      { __typename?: 'AbxMediumType' }
      & Pick<Types.AbxMediumType, 'name'>
    )> }
  ) | { __typename?: 'OperationError' } }
);

export type AddAbxKingdomMutationVariables = Types.Exact<{
  payload: Types.AbxKingdomInputType;
}>;


export type AddAbxKingdomMutation = (
  { __typename?: 'Mutation' }
  & { createAbxKingdom: (
    { __typename?: 'AbxKingdomType' }
    & Pick<Types.AbxKingdomType, 'uid' | 'name'>
  ) | { __typename?: 'OperationError' } }
);

export type EditAbxKingdomMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.AbxKingdomInputType;
}>;


export type EditAbxKingdomMutation = (
  { __typename?: 'Mutation' }
  & { updateAbxKingdom: (
    { __typename?: 'AbxKingdomType' }
    & Pick<Types.AbxKingdomType, 'uid' | 'name'>
  ) | { __typename?: 'OperationError' } }
);

export type AddAbxPhylumMutationVariables = Types.Exact<{
  payload: Types.AbxPhylumInputType;
}>;


export type AddAbxPhylumMutation = (
  { __typename?: 'Mutation' }
  & { createAbxPhylum: (
    { __typename?: 'AbxPhylumType' }
    & Pick<Types.AbxPhylumType, 'uid' | 'name' | 'kingdomUid'>
  ) | { __typename?: 'OperationError' } }
);

export type EditAbxPhylumMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.AbxPhylumInputType;
}>;


export type EditAbxPhylumMutation = (
  { __typename?: 'Mutation' }
  & { updateAbxPhylum: (
    { __typename?: 'AbxPhylumType' }
    & Pick<Types.AbxPhylumType, 'uid' | 'name' | 'kingdomUid'>
  ) | { __typename?: 'OperationError' } }
);

export type AddAbxClassMutationVariables = Types.Exact<{
  payload: Types.AbxClassInputType;
}>;


export type AddAbxClassMutation = (
  { __typename?: 'Mutation' }
  & { createAbxClass: (
    { __typename?: 'AbxClassType' }
    & Pick<Types.AbxClassType, 'uid' | 'name' | 'phylumUid'>
  ) | { __typename?: 'OperationError' } }
);

export type EditAbxClassMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.AbxClassInputType;
}>;


export type EditAbxClassMutation = (
  { __typename?: 'Mutation' }
  & { updateAbxClass: (
    { __typename?: 'AbxClassType' }
    & Pick<Types.AbxClassType, 'uid' | 'name' | 'phylumUid'>
  ) | { __typename?: 'OperationError' } }
);

export type AddAbxOrderMutationVariables = Types.Exact<{
  payload: Types.AbxOrderInputType;
}>;


export type AddAbxOrderMutation = (
  { __typename?: 'Mutation' }
  & { createAbxOrder: (
    { __typename?: 'AbxOrderType' }
    & Pick<Types.AbxOrderType, 'uid' | 'name' | 'classUid'>
  ) | { __typename?: 'OperationError' } }
);

export type EditAbxOrderMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.AbxOrderInputType;
}>;


export type EditAbxOrderMutation = (
  { __typename?: 'Mutation' }
  & { updateAbxOrder: (
    { __typename?: 'AbxOrderType' }
    & Pick<Types.AbxOrderType, 'uid' | 'name' | 'classUid'>
  ) | { __typename?: 'OperationError' } }
);

export type AddAbxFamilyMutationVariables = Types.Exact<{
  payload: Types.AbxFamilyInputType;
}>;


export type AddAbxFamilyMutation = (
  { __typename?: 'Mutation' }
  & { createAbxFamily: (
    { __typename?: 'AbxFamilyType' }
    & Pick<Types.AbxFamilyType, 'uid' | 'name' | 'orderUid'>
  ) | { __typename?: 'OperationError' } }
);

export type EditAbxFamilyMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.AbxFamilyInputType;
}>;


export type EditAbxFamilyMutation = (
  { __typename?: 'Mutation' }
  & { updateAbxFamily: (
    { __typename?: 'AbxFamilyType' }
    & Pick<Types.AbxFamilyType, 'uid' | 'name' | 'orderUid'>
  ) | { __typename?: 'OperationError' } }
);

export type AddAbxGenusMutationVariables = Types.Exact<{
  payload: Types.AbxGenusInputType;
}>;


export type AddAbxGenusMutation = (
  { __typename?: 'Mutation' }
  & { createAbxGenus: (
    { __typename?: 'AbxGenusType' }
    & Pick<Types.AbxGenusType, 'uid' | 'name' | 'familyUid'>
  ) | { __typename?: 'OperationError' } }
);

export type EditAbxGenusMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.AbxGenusInputType;
}>;


export type EditAbxGenusMutation = (
  { __typename?: 'Mutation' }
  & { updateAbxGenus: (
    { __typename?: 'AbxGenusType' }
    & Pick<Types.AbxGenusType, 'uid' | 'name' | 'familyUid'>
  ) | { __typename?: 'OperationError' } }
);

export type AddAbxOrganismMutationVariables = Types.Exact<{
  payload: Types.AbxOrganismInputType;
}>;


export type AddAbxOrganismMutation = (
  { __typename?: 'Mutation' }
  & { createAbxOrganism: (
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
  ) | { __typename?: 'OperationError' } }
);

export type EditAbxOrganismMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.AbxOrganismInputType;
}>;


export type EditAbxOrganismMutation = (
  { __typename?: 'Mutation' }
  & { updateAbxOrganism: (
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
  ) | { __typename?: 'OperationError' } }
);

export type AddAbxOrganismSerotypeMutationVariables = Types.Exact<{
  payload: Types.AbxOrganismSerotypeInputType;
}>;


export type AddAbxOrganismSerotypeMutation = (
  { __typename?: 'Mutation' }
  & { createAbxOrganismSerotype: (
    { __typename?: 'AbxOrganismSerotypeType' }
    & Pick<Types.AbxOrganismSerotypeType, 'uid' | 'organismUid' | 'serotype' | 'serogroup' | 'subspecies' | 'oAntigens' | 'hPhase1' | 'hPhase2' | 'x997Check' | 'fate' | 'createdAt' | 'createdByUid'>
    & { organism?: Types.Maybe<(
      { __typename?: 'AbxOrganismType' }
      & Pick<Types.AbxOrganismType, 'name'>
    )> }
  ) | { __typename?: 'OperationError' } }
);

export type EditAbxOrganismSerotypeMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.AbxOrganismSerotypeInputType;
}>;


export type EditAbxOrganismSerotypeMutation = (
  { __typename?: 'Mutation' }
  & { updateAbxOrganismSerotype: (
    { __typename?: 'AbxOrganismSerotypeType' }
    & Pick<Types.AbxOrganismSerotypeType, 'uid' | 'organismUid' | 'serotype' | 'serogroup' | 'subspecies' | 'oAntigens' | 'hPhase1' | 'hPhase2' | 'x997Check' | 'fate' | 'createdAt' | 'createdByUid'>
    & { organism?: Types.Maybe<(
      { __typename?: 'AbxOrganismType' }
      & Pick<Types.AbxOrganismType, 'name'>
    )> }
  ) | { __typename?: 'OperationError' } }
);

export type AddAbxExpResPhenotypeMutationVariables = Types.Exact<{
  payload: Types.AbxExpResPhenotypeInputType;
}>;


export type AddAbxExpResPhenotypeMutation = (
  { __typename?: 'Mutation' }
  & { createAbxExpResPhenotype: (
    { __typename?: 'AbxExpResPhenotypeType' }
    & Pick<Types.AbxExpResPhenotypeType, 'uid' | 'guidelineUid' | 'referenceTable' | 'organismCode' | 'organismCodeType' | 'exceptionOrganismCode' | 'exceptionOrganismCodeType' | 'abxCode' | 'abxCodeType' | 'antibioticExceptions' | 'comments' | 'createdAt' | 'createdByUid'>
    & { guideline?: Types.Maybe<(
      { __typename?: 'AbxGuidelineType' }
      & Pick<Types.AbxGuidelineType, 'name'>
    )> }
  ) | { __typename?: 'OperationError' } }
);

export type EditAbxExpResPhenotypeMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.AbxExpResPhenotypeInputType;
}>;


export type EditAbxExpResPhenotypeMutation = (
  { __typename?: 'Mutation' }
  & { updateAbxExpResPhenotype: (
    { __typename?: 'AbxExpResPhenotypeType' }
    & Pick<Types.AbxExpResPhenotypeType, 'uid' | 'guidelineUid' | 'referenceTable' | 'organismCode' | 'organismCodeType' | 'exceptionOrganismCode' | 'exceptionOrganismCodeType' | 'abxCode' | 'abxCodeType' | 'antibioticExceptions' | 'comments' | 'createdAt' | 'createdByUid'>
    & { guideline?: Types.Maybe<(
      { __typename?: 'AbxGuidelineType' }
      & Pick<Types.AbxGuidelineType, 'name'>
    )> }
  ) | { __typename?: 'OperationError' } }
);

export type AddAbxExpertInterpretationRuleMutationVariables = Types.Exact<{
  payload: Types.AbxExpertInterpretationRuleInputType;
}>;


export type AddAbxExpertInterpretationRuleMutation = (
  { __typename?: 'Mutation' }
  & { createAbxExpertInterpretationRule: (
    { __typename?: 'AbxExpertInterpretationRuleType' }
    & Pick<Types.AbxExpertInterpretationRuleType, 'uid' | 'ruleCode' | 'description' | 'organismCode' | 'organismCodeType' | 'ruleCriteria' | 'affectedAntibiotics' | 'antibioticExceptions' | 'createdAt' | 'createdByUid'>
  ) | { __typename?: 'OperationError' } }
);

export type EditAbxExpertInterpretationRuleMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.AbxExpertInterpretationRuleInputType;
}>;


export type EditAbxExpertInterpretationRuleMutation = (
  { __typename?: 'Mutation' }
  & { updateAbxExpertInterpretationRule: (
    { __typename?: 'AbxExpertInterpretationRuleType' }
    & Pick<Types.AbxExpertInterpretationRuleType, 'uid' | 'ruleCode' | 'description' | 'organismCode' | 'organismCodeType' | 'ruleCriteria' | 'affectedAntibiotics' | 'antibioticExceptions' | 'createdAt' | 'createdByUid'>
  ) | { __typename?: 'OperationError' } }
);


export const AddAbxGuidelineDocument = gql`
    mutation AddAbxGuideline($payload: AbxGuidelineInputType!) {
  createAbxGuideline(payload: $payload) {
    ... on AbxGuidelineType {
      uid
      name
      code
      description
    }
  }
}
    `;

export function useAddAbxGuidelineMutation() {
  return Urql.useMutation<AddAbxGuidelineMutation, AddAbxGuidelineMutationVariables>(AddAbxGuidelineDocument);
};
export const EditAbxGuidelineDocument = gql`
    mutation EditAbxGuideline($uid: String!, $payload: AbxGuidelineInputType!) {
  updateAbxGuideline(uid: $uid, payload: $payload) {
    ... on AbxGuidelineType {
      uid
      name
      code
      description
    }
  }
}
    `;

export function useEditAbxGuidelineMutation() {
  return Urql.useMutation<EditAbxGuidelineMutation, EditAbxGuidelineMutationVariables>(EditAbxGuidelineDocument);
};
export const AddAbxAntibioticDocument = gql`
    mutation AddAbxAntibiotic($payload: AbxAntibioticInputType!) {
  createAbxAntibiotic(payload: $payload) {
    ... on AbxAntibioticType {
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
  }
}
    `;

export function useAddAbxAntibioticMutation() {
  return Urql.useMutation<AddAbxAntibioticMutation, AddAbxAntibioticMutationVariables>(AddAbxAntibioticDocument);
};
export const EditAbxAntibioticDocument = gql`
    mutation EditAbxAntibiotic($uid: String!, $payload: AbxAntibioticInputType!) {
  updateAbxAntibiotic(uid: $uid, payload: $payload) {
    ... on AbxAntibioticType {
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
  }
}
    `;

export function useEditAbxAntibioticMutation() {
  return Urql.useMutation<EditAbxAntibioticMutation, EditAbxAntibioticMutationVariables>(EditAbxAntibioticDocument);
};
export const AddAbxAstPanelDocument = gql`
    mutation AddAbxAstPanel($payload: AbxASTPanelInputType!) {
  createAbxAstPanel(payload: $payload) {
    ... on AbxASTPanelType {
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
}
    `;

export function useAddAbxAstPanelMutation() {
  return Urql.useMutation<AddAbxAstPanelMutation, AddAbxAstPanelMutationVariables>(AddAbxAstPanelDocument);
};
export const EditAbxAstPanelDocument = gql`
    mutation EditAbxAstPanel($uid: String!, $payload: AbxASTPanelInputType!) {
  updateAbxAstPanel(uid: $uid, payload: $payload) {
    ... on AbxASTPanelType {
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
}
    `;

export function useEditAbxAstPanelMutation() {
  return Urql.useMutation<EditAbxAstPanelMutation, EditAbxAstPanelMutationVariables>(EditAbxAstPanelDocument);
};
export const AddAbxTestMethodDocument = gql`
    mutation AddAbxTestMethod($payload: AbxTestMethodInputType!) {
  createAbxTestMethod(payload: $payload) {
    ... on AbxTestMethodType {
      uid
      name
      description
      createdAt
      createdByUid
    }
  }
}
    `;

export function useAddAbxTestMethodMutation() {
  return Urql.useMutation<AddAbxTestMethodMutation, AddAbxTestMethodMutationVariables>(AddAbxTestMethodDocument);
};
export const EditAbxTestMethodDocument = gql`
    mutation EditAbxTestMethod($uid: String!, $payload: AbxTestMethodInputType!) {
  updateAbxTestMethod(uid: $uid, payload: $payload) {
    ... on AbxTestMethodType {
      uid
      name
      description
      createdAt
      createdByUid
    }
  }
}
    `;

export function useEditAbxTestMethodMutation() {
  return Urql.useMutation<EditAbxTestMethodMutation, EditAbxTestMethodMutationVariables>(EditAbxTestMethodDocument);
};
export const AddAbxBreakpointTypeDocument = gql`
    mutation AddAbxBreakpointType($payload: AbxBreakpointTypeInputType!) {
  createAbxBreakpointType(payload: $payload) {
    ... on AbxBreakpointTypeTyp {
      uid
      name
      description
      createdAt
      createdByUid
    }
  }
}
    `;

export function useAddAbxBreakpointTypeMutation() {
  return Urql.useMutation<AddAbxBreakpointTypeMutation, AddAbxBreakpointTypeMutationVariables>(AddAbxBreakpointTypeDocument);
};
export const EditAbxBreakpointTypeDocument = gql`
    mutation EditAbxBreakpointType($uid: String!, $payload: AbxBreakpointTypeInputType!) {
  updateAbxBreakpointType(uid: $uid, payload: $payload) {
    ... on AbxBreakpointTypeTyp {
      uid
      name
      description
      createdAt
      createdByUid
    }
  }
}
    `;

export function useEditAbxBreakpointTypeMutation() {
  return Urql.useMutation<EditAbxBreakpointTypeMutation, EditAbxBreakpointTypeMutationVariables>(EditAbxBreakpointTypeDocument);
};
export const AddAbxHostDocument = gql`
    mutation AddAbxHost($payload: AbxHostInputType!) {
  createAbxHost(payload: $payload) {
    ... on AbxHostType {
      uid
      name
      description
      createdAt
      createdByUid
    }
  }
}
    `;

export function useAddAbxHostMutation() {
  return Urql.useMutation<AddAbxHostMutation, AddAbxHostMutationVariables>(AddAbxHostDocument);
};
export const EditAbxHostDocument = gql`
    mutation EditAbxHost($uid: String!, $payload: AbxHostInputType!) {
  updateAbxHost(uid: $uid, payload: $payload) {
    ... on AbxHostType {
      uid
      name
      description
      createdAt
      createdByUid
    }
  }
}
    `;

export function useEditAbxHostMutation() {
  return Urql.useMutation<EditAbxHostMutation, EditAbxHostMutationVariables>(EditAbxHostDocument);
};
export const AddAbxSiteOfInfectionDocument = gql`
    mutation AddAbxSiteOfInfection($payload: AbxSiteOfInfectionInputType!) {
  createAbxSiteOfInfection(payload: $payload) {
    ... on AbxSiteOfInfectionType {
      uid
      name
      description
      createdAt
      createdByUid
    }
  }
}
    `;

export function useAddAbxSiteOfInfectionMutation() {
  return Urql.useMutation<AddAbxSiteOfInfectionMutation, AddAbxSiteOfInfectionMutationVariables>(AddAbxSiteOfInfectionDocument);
};
export const EditAbxSiteOfInfectionDocument = gql`
    mutation EditAbxSiteOfInfection($uid: String!, $payload: AbxSiteOfInfectionInputType!) {
  updateAbxSiteOfInfection(uid: $uid, payload: $payload) {
    ... on AbxSiteOfInfectionType {
      uid
      name
      description
      createdAt
      createdByUid
    }
  }
}
    `;

export function useEditAbxSiteOfInfectionMutation() {
  return Urql.useMutation<EditAbxSiteOfInfectionMutation, EditAbxSiteOfInfectionMutationVariables>(EditAbxSiteOfInfectionDocument);
};
export const AddAbxBreakpointDocument = gql`
    mutation AddAbxBreakpoint($payload: AbxBreakpointInputType!) {
  createAbxBreakpoint(payload: $payload) {
    ... on AbxBreakpointTyp {
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
}
    `;

export function useAddAbxBreakpointMutation() {
  return Urql.useMutation<AddAbxBreakpointMutation, AddAbxBreakpointMutationVariables>(AddAbxBreakpointDocument);
};
export const EditAbxBreakpointDocument = gql`
    mutation EditAbxBreakpoint($uid: String!, $payload: AbxBreakpointInputType!) {
  updateAbxBreakpoint(uid: $uid, payload: $payload) {
    ... on AbxBreakpointTyp {
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
}
    `;

export function useEditAbxBreakpointMutation() {
  return Urql.useMutation<EditAbxBreakpointMutation, EditAbxBreakpointMutationVariables>(EditAbxBreakpointDocument);
};
export const AddAbxMediumDocument = gql`
    mutation AddAbxMedium($payload: AbxMediumInputType!) {
  createAbxMedium(payload: $payload) {
    ... on AbxMediumType {
      uid
      name
      description
      createdAt
      createdByUid
    }
  }
}
    `;

export function useAddAbxMediumMutation() {
  return Urql.useMutation<AddAbxMediumMutation, AddAbxMediumMutationVariables>(AddAbxMediumDocument);
};
export const EditAbxMediumDocument = gql`
    mutation EditAbxMedium($uid: String!, $payload: AbxMediumInputType!) {
  updateAbxMedium(uid: $uid, payload: $payload) {
    ... on AbxMediumType {
      uid
      name
      description
      createdAt
      createdByUid
    }
  }
}
    `;

export function useEditAbxMediumMutation() {
  return Urql.useMutation<EditAbxMediumMutation, EditAbxMediumMutationVariables>(EditAbxMediumDocument);
};
export const AddAbxQcRangeDocument = gql`
    mutation AddAbxQcRange($payload: AbxQCRangeInputType!) {
  createAbxQcRange(payload: $payload) {
    ... on AbxQCRangeType {
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
}
    `;

export function useAddAbxQcRangeMutation() {
  return Urql.useMutation<AddAbxQcRangeMutation, AddAbxQcRangeMutationVariables>(AddAbxQcRangeDocument);
};
export const EditAbxQcRangeDocument = gql`
    mutation EditAbxQcRange($uid: String!, $payload: AbxQCRangeInputType!) {
  updateAbxQcRange(uid: $uid, payload: $payload) {
    ... on AbxQCRangeType {
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
}
    `;

export function useEditAbxQcRangeMutation() {
  return Urql.useMutation<EditAbxQcRangeMutation, EditAbxQcRangeMutationVariables>(EditAbxQcRangeDocument);
};
export const AddAbxKingdomDocument = gql`
    mutation AddAbxKingdom($payload: AbxKingdomInputType!) {
  createAbxKingdom(payload: $payload) {
    ... on AbxKingdomType {
      uid
      name
    }
  }
}
    `;

export function useAddAbxKingdomMutation() {
  return Urql.useMutation<AddAbxKingdomMutation, AddAbxKingdomMutationVariables>(AddAbxKingdomDocument);
};
export const EditAbxKingdomDocument = gql`
    mutation EditAbxKingdom($uid: String!, $payload: AbxKingdomInputType!) {
  updateAbxKingdom(uid: $uid, payload: $payload) {
    ... on AbxKingdomType {
      uid
      name
    }
  }
}
    `;

export function useEditAbxKingdomMutation() {
  return Urql.useMutation<EditAbxKingdomMutation, EditAbxKingdomMutationVariables>(EditAbxKingdomDocument);
};
export const AddAbxPhylumDocument = gql`
    mutation AddAbxPhylum($payload: AbxPhylumInputType!) {
  createAbxPhylum(payload: $payload) {
    ... on AbxPhylumType {
      uid
      name
      kingdomUid
    }
  }
}
    `;

export function useAddAbxPhylumMutation() {
  return Urql.useMutation<AddAbxPhylumMutation, AddAbxPhylumMutationVariables>(AddAbxPhylumDocument);
};
export const EditAbxPhylumDocument = gql`
    mutation EditAbxPhylum($uid: String!, $payload: AbxPhylumInputType!) {
  updateAbxPhylum(uid: $uid, payload: $payload) {
    ... on AbxPhylumType {
      uid
      name
      kingdomUid
    }
  }
}
    `;

export function useEditAbxPhylumMutation() {
  return Urql.useMutation<EditAbxPhylumMutation, EditAbxPhylumMutationVariables>(EditAbxPhylumDocument);
};
export const AddAbxClassDocument = gql`
    mutation AddAbxClass($payload: AbxClassInputType!) {
  createAbxClass(payload: $payload) {
    ... on AbxClassType {
      uid
      name
      phylumUid
    }
  }
}
    `;

export function useAddAbxClassMutation() {
  return Urql.useMutation<AddAbxClassMutation, AddAbxClassMutationVariables>(AddAbxClassDocument);
};
export const EditAbxClassDocument = gql`
    mutation EditAbxClass($uid: String!, $payload: AbxClassInputType!) {
  updateAbxClass(uid: $uid, payload: $payload) {
    ... on AbxClassType {
      uid
      name
      phylumUid
    }
  }
}
    `;

export function useEditAbxClassMutation() {
  return Urql.useMutation<EditAbxClassMutation, EditAbxClassMutationVariables>(EditAbxClassDocument);
};
export const AddAbxOrderDocument = gql`
    mutation AddAbxOrder($payload: AbxOrderInputType!) {
  createAbxOrder(payload: $payload) {
    ... on AbxOrderType {
      uid
      name
      classUid
    }
  }
}
    `;

export function useAddAbxOrderMutation() {
  return Urql.useMutation<AddAbxOrderMutation, AddAbxOrderMutationVariables>(AddAbxOrderDocument);
};
export const EditAbxOrderDocument = gql`
    mutation EditAbxOrder($uid: String!, $payload: AbxOrderInputType!) {
  updateAbxOrder(uid: $uid, payload: $payload) {
    ... on AbxOrderType {
      uid
      name
      classUid
    }
  }
}
    `;

export function useEditAbxOrderMutation() {
  return Urql.useMutation<EditAbxOrderMutation, EditAbxOrderMutationVariables>(EditAbxOrderDocument);
};
export const AddAbxFamilyDocument = gql`
    mutation AddAbxFamily($payload: AbxFamilyInputType!) {
  createAbxFamily(payload: $payload) {
    ... on AbxFamilyType {
      uid
      name
      orderUid
    }
  }
}
    `;

export function useAddAbxFamilyMutation() {
  return Urql.useMutation<AddAbxFamilyMutation, AddAbxFamilyMutationVariables>(AddAbxFamilyDocument);
};
export const EditAbxFamilyDocument = gql`
    mutation EditAbxFamily($uid: String!, $payload: AbxFamilyInputType!) {
  updateAbxFamily(uid: $uid, payload: $payload) {
    ... on AbxFamilyType {
      uid
      name
      orderUid
    }
  }
}
    `;

export function useEditAbxFamilyMutation() {
  return Urql.useMutation<EditAbxFamilyMutation, EditAbxFamilyMutationVariables>(EditAbxFamilyDocument);
};
export const AddAbxGenusDocument = gql`
    mutation AddAbxGenus($payload: AbxGenusInputType!) {
  createAbxGenus(payload: $payload) {
    ... on AbxGenusType {
      uid
      name
      familyUid
    }
  }
}
    `;

export function useAddAbxGenusMutation() {
  return Urql.useMutation<AddAbxGenusMutation, AddAbxGenusMutationVariables>(AddAbxGenusDocument);
};
export const EditAbxGenusDocument = gql`
    mutation EditAbxGenus($uid: String!, $payload: AbxGenusInputType!) {
  updateAbxGenus(uid: $uid, payload: $payload) {
    ... on AbxGenusType {
      uid
      name
      familyUid
    }
  }
}
    `;

export function useEditAbxGenusMutation() {
  return Urql.useMutation<EditAbxGenusMutation, EditAbxGenusMutationVariables>(EditAbxGenusDocument);
};
export const AddAbxOrganismDocument = gql`
    mutation AddAbxOrganism($payload: AbxOrganismInputType!) {
  createAbxOrganism(payload: $payload) {
    ... on AbxOrganismType {
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
}
    `;

export function useAddAbxOrganismMutation() {
  return Urql.useMutation<AddAbxOrganismMutation, AddAbxOrganismMutationVariables>(AddAbxOrganismDocument);
};
export const EditAbxOrganismDocument = gql`
    mutation EditAbxOrganism($uid: String!, $payload: AbxOrganismInputType!) {
  updateAbxOrganism(uid: $uid, payload: $payload) {
    ... on AbxOrganismType {
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
}
    `;

export function useEditAbxOrganismMutation() {
  return Urql.useMutation<EditAbxOrganismMutation, EditAbxOrganismMutationVariables>(EditAbxOrganismDocument);
};
export const AddAbxOrganismSerotypeDocument = gql`
    mutation AddAbxOrganismSerotype($payload: AbxOrganismSerotypeInputType!) {
  createAbxOrganismSerotype(payload: $payload) {
    ... on AbxOrganismSerotypeType {
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
}
    `;

export function useAddAbxOrganismSerotypeMutation() {
  return Urql.useMutation<AddAbxOrganismSerotypeMutation, AddAbxOrganismSerotypeMutationVariables>(AddAbxOrganismSerotypeDocument);
};
export const EditAbxOrganismSerotypeDocument = gql`
    mutation EditAbxOrganismSerotype($uid: String!, $payload: AbxOrganismSerotypeInputType!) {
  updateAbxOrganismSerotype(uid: $uid, payload: $payload) {
    ... on AbxOrganismSerotypeType {
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
}
    `;

export function useEditAbxOrganismSerotypeMutation() {
  return Urql.useMutation<EditAbxOrganismSerotypeMutation, EditAbxOrganismSerotypeMutationVariables>(EditAbxOrganismSerotypeDocument);
};
export const AddAbxExpResPhenotypeDocument = gql`
    mutation AddAbxExpResPhenotype($payload: AbxExpResPhenotypeInputType!) {
  createAbxExpResPhenotype(payload: $payload) {
    ... on AbxExpResPhenotypeType {
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
}
    `;

export function useAddAbxExpResPhenotypeMutation() {
  return Urql.useMutation<AddAbxExpResPhenotypeMutation, AddAbxExpResPhenotypeMutationVariables>(AddAbxExpResPhenotypeDocument);
};
export const EditAbxExpResPhenotypeDocument = gql`
    mutation EditAbxExpResPhenotype($uid: String!, $payload: AbxExpResPhenotypeInputType!) {
  updateAbxExpResPhenotype(uid: $uid, payload: $payload) {
    ... on AbxExpResPhenotypeType {
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
}
    `;

export function useEditAbxExpResPhenotypeMutation() {
  return Urql.useMutation<EditAbxExpResPhenotypeMutation, EditAbxExpResPhenotypeMutationVariables>(EditAbxExpResPhenotypeDocument);
};
export const AddAbxExpertInterpretationRuleDocument = gql`
    mutation AddAbxExpertInterpretationRule($payload: AbxExpertInterpretationRuleInputType!) {
  createAbxExpertInterpretationRule(payload: $payload) {
    ... on AbxExpertInterpretationRuleType {
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
}
    `;

export function useAddAbxExpertInterpretationRuleMutation() {
  return Urql.useMutation<AddAbxExpertInterpretationRuleMutation, AddAbxExpertInterpretationRuleMutationVariables>(AddAbxExpertInterpretationRuleDocument);
};
export const EditAbxExpertInterpretationRuleDocument = gql`
    mutation EditAbxExpertInterpretationRule($uid: String!, $payload: AbxExpertInterpretationRuleInputType!) {
  updateAbxExpertInterpretationRule(uid: $uid, payload: $payload) {
    ... on AbxExpertInterpretationRuleType {
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
}
    `;

export function useEditAbxExpertInterpretationRuleMutation() {
  return Urql.useMutation<EditAbxExpertInterpretationRuleMutation, EditAbxExpertInterpretationRuleMutationVariables>(EditAbxExpertInterpretationRuleDocument);
};