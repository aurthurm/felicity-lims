import{H as e}from"./index-ad4ed84b.js";const t=e`
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
    `;e`
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
    `;e`
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
    `;e`
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
    `;e`
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
    `;e`
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
    `;e`
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
    `;e`
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
    `;e`
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
    `;e`
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
    `;e`
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
    `;e`
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
    `;const y=e`
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
    `,c=e`
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
    `,l=e`
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
    `,A=e`
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
    `;e`
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
    `;e`
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
    `;e`
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
    `;e`
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
    `;e`
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
    `;e`
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
    `;e`
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
    `;e`
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
    `;e`
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
    `;e`
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
    `;e`
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
    `;e`
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
    `;e`
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
    `;e`
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
    `;const b=e`
    mutation AddAbxKingdom($payload: AbxKingdomInputType!) {
  createAbxKingdom(payload: $payload) {
    ... on AbxKingdomType {
      uid
      name
    }
  }
}
    `,x=e`
    mutation EditAbxKingdom($uid: String!, $payload: AbxKingdomInputType!) {
  updateAbxKingdom(uid: $uid, payload: $payload) {
    ... on AbxKingdomType {
      uid
      name
    }
  }
}
    `,g=e`
    mutation AddAbxPhylum($payload: AbxPhylumInputType!) {
  createAbxPhylum(payload: $payload) {
    ... on AbxPhylumType {
      uid
      name
      kingdomUid
    }
  }
}
    `,$=e`
    mutation EditAbxPhylum($uid: String!, $payload: AbxPhylumInputType!) {
  updateAbxPhylum(uid: $uid, payload: $payload) {
    ... on AbxPhylumType {
      uid
      name
      kingdomUid
    }
  }
}
    `,T=e`
    mutation AddAbxClass($payload: AbxClassInputType!) {
  createAbxClass(payload: $payload) {
    ... on AbxClassType {
      uid
      name
      phylumUid
    }
  }
}
    `,C=e`
    mutation EditAbxClass($uid: String!, $payload: AbxClassInputType!) {
  updateAbxClass(uid: $uid, payload: $payload) {
    ... on AbxClassType {
      uid
      name
      phylumUid
    }
  }
}
    `,U=e`
    mutation AddAbxOrder($payload: AbxOrderInputType!) {
  createAbxOrder(payload: $payload) {
    ... on AbxOrderType {
      uid
      name
      classUid
    }
  }
}
    `,f=e`
    mutation EditAbxOrder($uid: String!, $payload: AbxOrderInputType!) {
  updateAbxOrder(uid: $uid, payload: $payload) {
    ... on AbxOrderType {
      uid
      name
      classUid
    }
  }
}
    `,h=e`
    mutation AddAbxFamily($payload: AbxFamilyInputType!) {
  createAbxFamily(payload: $payload) {
    ... on AbxFamilyType {
      uid
      name
      orderUid
    }
  }
}
    `,B=e`
    mutation EditAbxFamily($uid: String!, $payload: AbxFamilyInputType!) {
  updateAbxFamily(uid: $uid, payload: $payload) {
    ... on AbxFamilyType {
      uid
      name
      orderUid
    }
  }
}
    `,S=e`
    mutation AddAbxGenus($payload: AbxGenusInputType!) {
  createAbxGenus(payload: $payload) {
    ... on AbxGenusType {
      uid
      name
      familyUid
    }
  }
}
    `,G=e`
    mutation EditAbxGenus($uid: String!, $payload: AbxGenusInputType!) {
  updateAbxGenus(uid: $uid, payload: $payload) {
    ... on AbxGenusType {
      uid
      name
      familyUid
    }
  }
}
    `,O=e`
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
    `,I=e`
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
    `,E=e`
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
    `,k=e`
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
    `;e`
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
    `;e`
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
    `;e`
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
    `;e`
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
    `;export{l as A,G as B,A as E,t as G,a,y as b,c,r as d,u as e,d as f,n as g,s as h,o as i,p as j,O as k,I as l,m,E as n,k as o,b as p,x as q,g as r,$ as s,T as t,C as u,U as v,f as w,h as x,B as y,S as z};
