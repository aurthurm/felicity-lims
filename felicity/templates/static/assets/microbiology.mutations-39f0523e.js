import{H as e}from"./index-06e172a4.js";const i=e`
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
    `;const n=e`
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
    `;const o=e`
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
    `;const r=e`
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
    `;const u=e`
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
    `;const s=e`
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
    `;const c=e`
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
    `;const m=e`
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
    `;const y=e`
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
    `;const l=e`
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
    `;const A=e`
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
    `;const b=e`
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
    `;const x=e`
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
    `;const g=e`
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
    `;const $=e`
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
    `;const C=e`
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
    `;const f=e`
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
    `,T=e`
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
    `,U=e`
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
    `,h=e`
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
    `;const B=e`
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
    `,S=e`
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
    `,G=e`
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
    `,I=e`
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
    `,O=e`
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
    `,E=e`
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
    `,P=e`
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
    `,k=e`
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
    `,D=e`
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
    `,q=e`
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
    `,R=e`
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
    `,M=e`
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
    `,v=e`
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
    `,w=e`
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
    `,z=e`
    mutation AddAbxKingdom($payload: AbxKingdomInputType!) {
  createAbxKingdom(payload: $payload) {
    ... on AbxKingdomType {
      uid
      name
    }
  }
}
    `,H=e`
    mutation EditAbxKingdom($uid: String!, $payload: AbxKingdomInputType!) {
  updateAbxKingdom(uid: $uid, payload: $payload) {
    ... on AbxKingdomType {
      uid
      name
    }
  }
}
    `,F=e`
    mutation AddAbxPhylum($payload: AbxPhylumInputType!) {
  createAbxPhylum(payload: $payload) {
    ... on AbxPhylumType {
      uid
      name
      kingdomUid
    }
  }
}
    `,K=e`
    mutation EditAbxPhylum($uid: String!, $payload: AbxPhylumInputType!) {
  updateAbxPhylum(uid: $uid, payload: $payload) {
    ... on AbxPhylumType {
      uid
      name
      kingdomUid
    }
  }
}
    `,Q=e`
    mutation AddAbxClass($payload: AbxClassInputType!) {
  createAbxClass(payload: $payload) {
    ... on AbxClassType {
      uid
      name
      phylumUid
    }
  }
}
    `,N=e`
    mutation EditAbxClass($uid: String!, $payload: AbxClassInputType!) {
  updateAbxClass(uid: $uid, payload: $payload) {
    ... on AbxClassType {
      uid
      name
      phylumUid
    }
  }
}
    `,_=e`
    mutation AddAbxOrder($payload: AbxOrderInputType!) {
  createAbxOrder(payload: $payload) {
    ... on AbxOrderType {
      uid
      name
      classUid
    }
  }
}
    `,j=e`
    mutation EditAbxOrder($uid: String!, $payload: AbxOrderInputType!) {
  updateAbxOrder(uid: $uid, payload: $payload) {
    ... on AbxOrderType {
      uid
      name
      classUid
    }
  }
}
    `,J=e`
    mutation AddAbxFamily($payload: AbxFamilyInputType!) {
  createAbxFamily(payload: $payload) {
    ... on AbxFamilyType {
      uid
      name
      orderUid
    }
  }
}
    `,L=e`
    mutation EditAbxFamily($uid: String!, $payload: AbxFamilyInputType!) {
  updateAbxFamily(uid: $uid, payload: $payload) {
    ... on AbxFamilyType {
      uid
      name
      orderUid
    }
  }
}
    `,V=e`
    mutation AddAbxGenus($payload: AbxGenusInputType!) {
  createAbxGenus(payload: $payload) {
    ... on AbxGenusType {
      uid
      name
      familyUid
    }
  }
}
    `,W=e`
    mutation EditAbxGenus($uid: String!, $payload: AbxGenusInputType!) {
  updateAbxGenus(uid: $uid, payload: $payload) {
    ... on AbxGenusType {
      uid
      name
      familyUid
    }
  }
}
    `,X=e`
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
    `,Y=e`
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
    `,Z=e`
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
    `,ee=e`
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
    `,te=e`
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
    `,ie=e`
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
    `,ae=e`
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
    `,de=e`
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
    `;export{G as $,U as A,W as B,$ as C,C as D,h as E,v as F,i as G,w as H,R as I,M as J,g as K,ae as L,de as M,x as N,te as O,ie as P,l as Q,A as R,m as S,y as T,b as U,D as V,q as W,O as X,E as Y,P as Z,k as _,a,I as a0,B as a1,S as a2,f as b,T as c,r as d,u as e,d as f,n as g,s as h,o as i,p as j,X as k,Y as l,c as m,Z as n,ee as o,z as p,H as q,F as r,K as s,Q as t,N as u,_ as v,j as w,J as x,L as y,V as z};
