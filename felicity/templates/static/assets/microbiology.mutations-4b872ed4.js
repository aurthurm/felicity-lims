import{H as e}from"./index-fe6b305f.js";const i=e`
    query GetAbxGuidelinesAll {
  abxGuidelinesAll {
    uid
    name
    code
    description
  }
}
    `;e`
    query GetAbxGuidelineByUid($uid: String!) {
  abxGuidelineByUid(uid: $uid) {
    uid
    name
    code
    description
  }
}
    `;const a=e`
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
    `;e`
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
    `;const d=e`
    query GetAbxLaboratoryAntibiotics {
  abxLaboratoryAntibiotics {
    uid
    name
    guidelines {
      name
    }
    potency
    human
    veterinary
    loincdisk
    loincmic
    loincetest
  }
}
    `,n=e`
    query GetAbxKingdomAll {
  abxKingdomAll {
    uid
    name
  }
}
    `;e`
    query GetAbxKingdomByUid($uid: String!) {
  abxKingdomByUid(uid: $uid) {
    uid
    name
  }
}
    `;const o=e`
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
    `;e`
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
    `;const r=e`
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
    `;e`
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
    `;const u=e`
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
    `;e`
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
    `;const s=e`
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
    `;e`
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
    `;const c=e`
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
    `;e`
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
    `;const p=e`
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
    `;e`
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
    `;const m=e`
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
    `;e`
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
    `;const y=e`
    query GetAbxTestMethodAll {
  abxTestMethodAll {
    uid
    name
    description
    createdAt
    createdByUid
  }
}
    `;e`
    query GetAbxTestMethodByUid($uid: String!) {
  abxTestMethodByUid(uid: $uid) {
    uid
    name
    description
    createdAt
    createdByUid
  }
}
    `;const l=e`
    query GetAbxBreakpointTypeAll {
  abxBreakpointTypeAll {
    uid
    name
    description
    createdAt
    createdByUid
  }
}
    `;e`
    query GetAbxBreakpointTypeByUid($uid: String!) {
  abxBreakpointTypeByUid(uid: $uid) {
    uid
    name
    description
    createdAt
    createdByUid
  }
}
    `;const A=e`
    query GetAbxHostAll {
  abxHostAll {
    uid
    name
    description
    createdAt
    createdByUid
  }
}
    `;e`
    query GetAbxHostUid($uid: String!) {
  abxHostByUid(uid: $uid) {
    uid
    name
    description
    createdAt
    createdByUid
  }
}
    `;const b=e`
    query GetAbxSiteOfInfectionAll {
  abxSiteOfInfectionAll {
    uid
    name
    description
    createdAt
    createdByUid
  }
}
    `;e`
    query GetAbxSiteOfInfectionUid($uid: String!) {
  abxSiteOfInfectionByUid(uid: $uid) {
    uid
    name
    description
    createdAt
    createdByUid
  }
}
    `;const x=e`
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
      testMethodUid
      testMethod {
        name
      }
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
    `;e`
    query GetAbxBreakpointUid($uid: String!) {
  abxBreakpointByUid(uid: $uid) {
    uid
    guidelineUid
    guideline {
      name
    }
    year
    testMethodUid
    testMethod {
      name
    }
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
    `;const g=e`
    query GetAbxExpResPhenotypeAll($text: String!, $pageSize: Int, $afterCursor: String, $beforeCursor: String, $sortBy: [String!]) {
  abxExpectedResistancePhenotypeAll(
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
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
    `;e`
    query GetAbxExpResPhenotypeUid($uid: String!) {
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
    `;const $=e`
    query GetAbxExpertInterpretationRuleAll($text: String!, $pageSize: Int, $afterCursor: String, $beforeCursor: String, $sortBy: [String!]) {
  abxExpertInterpretationRuleAll(
    text: $text
    pageSize: $pageSize
    afterCursor: $afterCursor
    beforeCursor: $beforeCursor
    sortBy: $sortBy
  ) {
    items {
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
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
    `;e`
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
    `;const C=e`
    query GetAbxMediumAll {
  abxMediumAll {
    uid
    name
    description
    createdAt
    createdByUid
  }
}
    `;e`
    query GetAbxMediumUid($uid: String!) {
  abxMediumByUid(uid: $uid) {
    uid
    name
    description
    createdAt
    createdByUid
  }
}
    `;const f=e`
    query GetAbxQcRangeAll($text: String!, $pageSize: Int, $afterCursor: String, $beforeCursor: String, $sortBy: [String!]) {
  abxQcRangeAll(
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
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
    `;e`
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
    `;e`
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
    `;e`
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
    `;const T=e`
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
    `,U=e`
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
    `,h=e`
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
    `,B=e`
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
    `,S=e`
    mutation UseAbxAntibiotic($uid: String!) {
  useAbxAntibiotic(uid: $uid) {
    ... on AbxAntibioticType {
      uid
      name
      guidelines {
        name
      }
      potency
      human
      veterinary
      loincdisk
      loincmic
      loincetest
    }
  }
}
    `,G=e`
    mutation DiscardAbxAntibiotic($uid: String!) {
  discardAbxAntibiotic(uid: $uid) {
    ... on DeletedItem {
      uid
    }
  }
}
    `;e`
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
    `;e`
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
    `;const I=e`
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
    `,O=e`
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
    `,E=e`
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
    `,P=e`
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
    `,k=e`
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
    `,D=e`
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
    `,q=e`
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
    `,R=e`
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
    `,M=e`
    mutation AddAbxBreakpoint($payload: AbxBreakpointInputType!) {
  createAbxBreakpoint(payload: $payload) {
    ... on AbxBreakpointTyp {
      uid
      guidelineUid
      guideline {
        name
      }
      year
      testMethodUid
      testMethod {
        name
      }
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
    `,v=e`
    mutation EditAbxBreakpoint($uid: String!, $payload: AbxBreakpointInputType!) {
  updateAbxBreakpoint(uid: $uid, payload: $payload) {
    ... on AbxBreakpointTyp {
      uid
      guidelineUid
      guideline {
        name
      }
      year
      testMethodUid
      testMethod {
        name
      }
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
    `,w=e`
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
    `,z=e`
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
    `,H=e`
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
    `,F=e`
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
    `,K=e`
    mutation AddAbxKingdom($payload: AbxKingdomInputType!) {
  createAbxKingdom(payload: $payload) {
    ... on AbxKingdomType {
      uid
      name
    }
  }
}
    `,Q=e`
    mutation EditAbxKingdom($uid: String!, $payload: AbxKingdomInputType!) {
  updateAbxKingdom(uid: $uid, payload: $payload) {
    ... on AbxKingdomType {
      uid
      name
    }
  }
}
    `,N=e`
    mutation AddAbxPhylum($payload: AbxPhylumInputType!) {
  createAbxPhylum(payload: $payload) {
    ... on AbxPhylumType {
      uid
      name
      kingdomUid
    }
  }
}
    `,_=e`
    mutation EditAbxPhylum($uid: String!, $payload: AbxPhylumInputType!) {
  updateAbxPhylum(uid: $uid, payload: $payload) {
    ... on AbxPhylumType {
      uid
      name
      kingdomUid
    }
  }
}
    `,j=e`
    mutation AddAbxClass($payload: AbxClassInputType!) {
  createAbxClass(payload: $payload) {
    ... on AbxClassType {
      uid
      name
      phylumUid
    }
  }
}
    `,L=e`
    mutation EditAbxClass($uid: String!, $payload: AbxClassInputType!) {
  updateAbxClass(uid: $uid, payload: $payload) {
    ... on AbxClassType {
      uid
      name
      phylumUid
    }
  }
}
    `,J=e`
    mutation AddAbxOrder($payload: AbxOrderInputType!) {
  createAbxOrder(payload: $payload) {
    ... on AbxOrderType {
      uid
      name
      classUid
    }
  }
}
    `,V=e`
    mutation EditAbxOrder($uid: String!, $payload: AbxOrderInputType!) {
  updateAbxOrder(uid: $uid, payload: $payload) {
    ... on AbxOrderType {
      uid
      name
      classUid
    }
  }
}
    `,W=e`
    mutation AddAbxFamily($payload: AbxFamilyInputType!) {
  createAbxFamily(payload: $payload) {
    ... on AbxFamilyType {
      uid
      name
      orderUid
    }
  }
}
    `,X=e`
    mutation EditAbxFamily($uid: String!, $payload: AbxFamilyInputType!) {
  updateAbxFamily(uid: $uid, payload: $payload) {
    ... on AbxFamilyType {
      uid
      name
      orderUid
    }
  }
}
    `,Y=e`
    mutation AddAbxGenus($payload: AbxGenusInputType!) {
  createAbxGenus(payload: $payload) {
    ... on AbxGenusType {
      uid
      name
      familyUid
    }
  }
}
    `,Z=e`
    mutation EditAbxGenus($uid: String!, $payload: AbxGenusInputType!) {
  updateAbxGenus(uid: $uid, payload: $payload) {
    ... on AbxGenusType {
      uid
      name
      familyUid
    }
  }
}
    `,ee=e`
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
    `,te=e`
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
    `,ie=e`
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
    `,ae=e`
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
    `,de=e`
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
    `,ne=e`
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
    `,oe=e`
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
    `,re=e`
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
    `;export{D as $,h as A,Y as B,Z as C,G as D,B as E,C as F,d as G,f as H,H as I,F as J,w as K,z as L,$ as M,oe as N,re as O,g as P,de as Q,ne as R,A as S,b as T,S as U,y as V,l as W,x as X,M as Y,v as Z,k as _,i as a,q as a0,R as a1,E as a2,P as a3,I as a4,O as a5,a as b,T as c,U as d,u as e,s as f,n as g,o as h,c as i,r as j,p as k,ee as l,te as m,m as n,ie as o,ae as p,K as q,Q as r,N as s,_ as t,j as u,L as v,J as w,V as x,W as y,X as z};
