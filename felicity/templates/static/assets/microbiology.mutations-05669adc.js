import{g as e}from"./index-74595aff.js";const i=e`
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
    `;const n=e`
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
    `,d=e`
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
    `;const s=e`
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
    `;const l=e`
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
    `;const c=e`
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
    `;const p=e`
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
    query GetAbxGuidelineYearAll {
  abxGuidelineYearAll {
    uid
    guidelineUid
    guideline {
      uid
      name
    }
    year
    code
  }
}
    `,g=e`
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
      guidelineYearUid
      guidelineYear {
        uid
        code
      }
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
    guidelineYearUid
    guidelineYear {
      uid
      code
    }
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
    `;const $=e`
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
    `;const U=e`
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
    `;const T=e`
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
    `;const f=e`
    query GetAbxAstPanelFilter($organismUid: String!, $text: String! = "") {
  abxAstPanelFilter(organismUid: $organismUid, text: $text) {
    uid
    name
    description
    organisms {
      uid
      name
    }
    antibiotics {
      uid
      name
    }
  }
}
    `,h=e`
    query GetAbxAstPanelAll {
  abxAstPanelAll {
    uid
    name
    description
    organisms {
      uid
      name
    }
    antibiotics {
      uid
      name
      potency
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
    organisms {
      uid
      name
    }
    antibiotics {
      uid
      name
      potency
    }
    active
    createdAt
    createdByUid
  }
}
    `;const S=e`
    query GetAbxAstResultAll($sampleUid: String!) {
  abxAstResultAll(sampleUid: $sampleUid) {
    uid
    organismResultUid
    analysisResultUid
    analysisResult {
      result
      reportable
      status
    }
    antibioticUid
    antibiotic {
      uid
      name
      potency
    }
    guidelineYearUid
    guidelineYear {
      uid
      code
    }
    breakpointUid
    astMethodUid
    astMethod {
      uid
      name
    }
    astValue
    createdAt
    createdByUid
  }
}
    `,B=e`
    query GetAbxOrganismResultAll($analysisResultUid: String!) {
  abxOrganismResultAll(analysisResultUid: $analysisResultUid) {
    uid
    analysisResultUid
    organismUid
    organism {
      uid
      name
    }
    isolateNumber
    createdAt
    createdByUid
  }
}
    `,G=e`
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
    `,O=e`
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
    `,I=e`
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
    `,R=e`
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
    `,E=e`
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
    `,D=e`
    mutation DiscardAbxAntibiotic($uid: String!) {
  discardAbxAntibiotic(uid: $uid) {
    ... on DeletedItem {
      uid
    }
  }
}
    `,P=e`
    mutation AddAbxAstPanel($payload: AbxASTPanelInputType!) {
  createAbxAstPanel(payload: $payload) {
    ... on AbxASTPanelType {
      uid
      name
      description
      organisms {
        uid
        name
      }
      antibiotics {
        uid
        name
      }
      active
      createdAt
      createdByUid
    }
  }
}
    `,k=e`
    mutation EditAbxAstPanel($uid: String!, $payload: AbxASTPanelInputType!) {
  updateAbxAstPanel(uid: $uid, payload: $payload) {
    ... on AbxASTPanelType {
      uid
      name
      description
      organisms {
        uid
        name
      }
      antibiotics {
        uid
        name
      }
      active
      createdAt
      createdByUid
    }
  }
}
    `,q=e`
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
    `,M=e`
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
    `,v=e`
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
    `,w=e`
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
    `,z=e`
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
    `,F=e`
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
    `,H=e`
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
    `,K=e`
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
    `,Q=e`
    mutation AddAbxBreakpoint($payload: AbxBreakpointInputType!) {
  createAbxBreakpoint(payload: $payload) {
    ... on AbxBreakpointTyp {
      uid
      guidelineYearUid
      guidelineYear {
        uid
        code
      }
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
    `,N=e`
    mutation EditAbxBreakpoint($uid: String!, $payload: AbxBreakpointInputType!) {
  updateAbxBreakpoint(uid: $uid, payload: $payload) {
    ... on AbxBreakpointTyp {
      uid
      guidelineYearUid
      guidelineYear {
        uid
        code
      }
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
    `,Y=e`
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
    `,_=e`
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
    `,j=e`
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
    `,L=e`
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
    `,V=e`
    mutation AddAbxKingdom($payload: AbxKingdomInputType!) {
  createAbxKingdom(payload: $payload) {
    ... on AbxKingdomType {
      uid
      name
    }
  }
}
    `,J=e`
    mutation EditAbxKingdom($uid: String!, $payload: AbxKingdomInputType!) {
  updateAbxKingdom(uid: $uid, payload: $payload) {
    ... on AbxKingdomType {
      uid
      name
    }
  }
}
    `,W=e`
    mutation AddAbxPhylum($payload: AbxPhylumInputType!) {
  createAbxPhylum(payload: $payload) {
    ... on AbxPhylumType {
      uid
      name
      kingdomUid
    }
  }
}
    `,X=e`
    mutation EditAbxPhylum($uid: String!, $payload: AbxPhylumInputType!) {
  updateAbxPhylum(uid: $uid, payload: $payload) {
    ... on AbxPhylumType {
      uid
      name
      kingdomUid
    }
  }
}
    `,Z=e`
    mutation AddAbxClass($payload: AbxClassInputType!) {
  createAbxClass(payload: $payload) {
    ... on AbxClassType {
      uid
      name
      phylumUid
    }
  }
}
    `,ee=e`
    mutation EditAbxClass($uid: String!, $payload: AbxClassInputType!) {
  updateAbxClass(uid: $uid, payload: $payload) {
    ... on AbxClassType {
      uid
      name
      phylumUid
    }
  }
}
    `,te=e`
    mutation AddAbxOrder($payload: AbxOrderInputType!) {
  createAbxOrder(payload: $payload) {
    ... on AbxOrderType {
      uid
      name
      classUid
    }
  }
}
    `,ie=e`
    mutation EditAbxOrder($uid: String!, $payload: AbxOrderInputType!) {
  updateAbxOrder(uid: $uid, payload: $payload) {
    ... on AbxOrderType {
      uid
      name
      classUid
    }
  }
}
    `,ae=e`
    mutation AddAbxFamily($payload: AbxFamilyInputType!) {
  createAbxFamily(payload: $payload) {
    ... on AbxFamilyType {
      uid
      name
      orderUid
    }
  }
}
    `,ne=e`
    mutation EditAbxFamily($uid: String!, $payload: AbxFamilyInputType!) {
  updateAbxFamily(uid: $uid, payload: $payload) {
    ... on AbxFamilyType {
      uid
      name
      orderUid
    }
  }
}
    `,de=e`
    mutation AddAbxGenus($payload: AbxGenusInputType!) {
  createAbxGenus(payload: $payload) {
    ... on AbxGenusType {
      uid
      name
      familyUid
    }
  }
}
    `,oe=e`
    mutation EditAbxGenus($uid: String!, $payload: AbxGenusInputType!) {
  updateAbxGenus(uid: $uid, payload: $payload) {
    ... on AbxGenusType {
      uid
      name
      familyUid
    }
  }
}
    `,re=e`
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
    `,se=e`
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
    `,ue=e`
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
    `,le=e`
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
    `,ce=e`
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
    `,me=e`
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
    `,pe=e`
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
    `,ye=e`
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
    `,Ae=e`
    mutation AddAbxOrganismResult($analysisResultUid: String!) {
  createAbxOrganismResult(analysisResultUid: $analysisResultUid) {
    ... on AbxOrganismResultType {
      uid
      analysisResultUid
      organismUid
      organism {
        uid
        name
      }
      isolateNumber
      createdAt
      createdByUid
    }
  }
}
    `,be=e`
    mutation SaveAbxOrganismResult($uid: String!, $organismUid: String!) {
  saveAbxOrganismResult(uid: $uid, organismUid: $organismUid) {
    ... on AbxOrganismResultType {
      uid
      analysisResultUid
      organismUid
      organism {
        uid
        name
      }
      isolateNumber
      createdAt
      createdByUid
    }
  }
}
    `,xe=e`
    mutation DeleteAbxOrganismResult($uid: String!) {
  removeAbxOrganismResult(uid: $uid) {
    ... on DeletedItem {
      uid
    }
    ... on OperationError {
      error
      suggestion
    }
  }
}
    `,ge=e`
    mutation ApplyAbxAstPanel($payload: AbxApplyAstPanelInput!) {
  applyAbxAstPanel(payload: $payload) {
    ... on AbxASTResultsType {
      astResults {
        uid
        analysisResult {
          uid
          result
          status
        }
        organismResultUid
        analysisResultUid
        analysisResult {
          result
          reportable
          status
        }
        antibioticUid
        antibiotic {
          uid
          name
          guidelines {
            uid
            name
          }
        }
        breakpointUid
        astMethodUid
        astMethod {
          uid
          name
        }
        astValue
        createdAt
        createdByUid
      }
    }
    ... on OperationError {
      error
      suggestion
    }
  }
}
    `,$e=e`
    mutation UpdateAbxAstResults($payload: AbxASTResultsUpdateInput!) {
  updateAbxAstResults(payload: $payload) {
    ... on AbxASTResultsType {
      astResults {
        uid
        analysisResult {
          uid
          result
          status
        }
        organismResultUid
        analysisResultUid
        analysisResult {
          result
          reportable
          status
        }
        antibioticUid
        antibiotic {
          uid
          name
          guidelines {
            uid
            name
          }
        }
        breakpointUid
        astMethodUid
        astMethod {
          uid
          name
        }
        astValue
        createdAt
        createdByUid
      }
    }
    ... on OperationError {
      error
      suggestion
    }
  }
}
    `;export{pe as $,Ae as A,J as B,W as C,xe as D,R as E,X as F,B as G,Z as H,ee as I,te as J,ie as K,ae as L,ne as M,de as N,oe as O,C as P,T as Q,j as R,be as S,L as T,$e as U,Y as V,_ as W,h as X,P as Y,k as Z,U as _,c as a,ye as a0,$ as a1,ce as a2,me as a3,A as a4,b as a5,y as a6,g as a7,Q as a8,N as a9,z as aa,F as ab,H as ac,K as ad,v as ae,w as af,q as ag,M as ah,x as b,p as c,S as d,f as e,ge as f,n as g,D as h,E as i,i as j,a as k,I as l,G as m,O as n,s as o,u as p,d as q,o as r,l as s,r as t,re as u,se as v,m as w,ue as x,le as y,V as z};
