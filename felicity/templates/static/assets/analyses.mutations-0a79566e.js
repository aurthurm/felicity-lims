import{g as e}from"./index-f86d8273.js";const n=e`
    mutation AddCodingStandard($payload: CodingStandardInputType!) {
  createCodingStandard(payload: $payload) {
    ... on CodingStandardType {
      __typename
      uid
      name
      description
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,t=e`
    mutation EditCodingStandard($uid: String!, $payload: CodingStandardInputType!) {
  updateCodingStandard(uid: $uid, payload: $payload) {
    ... on CodingStandardType {
      __typename
      uid
      name
      description
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,i=e`
    mutation AddSampleType($payload: SampleTypeInputType!) {
  createSampleType(payload: $payload) {
    ... on SampleTypeTyp {
      __typename
      uid
      name
      abbr
      description
      active
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,s=e`
    mutation EditSampleType($uid: String!, $payload: SampleTypeInputType!) {
  updateSampleType(uid: $uid, payload: $payload) {
    ... on SampleTypeTyp {
      __typename
      uid
      name
      abbr
      description
      active
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;e`
    mutation AddSampleTypeMapping($payload: SampleTypeMappingInputType!) {
  createSampleTypeMapping(payload: $payload) {
    ... on SampleTypeMappingType {
      uid
      name
      description
      code
      codingStandardUid
      codingStandard {
        name
      }
      sampleTypeUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;e`
    mutation EditSampleTypeMapping($uid: String!, $payload: SampleTypeMappingInputType!) {
  updateSampleTypeMapping(uid: $uid, payload: $payload) {
    ... on SampleTypeMappingType {
      uid
      name
      description
      code
      codingStandardUid
      codingStandard {
        name
      }
      sampleTypeUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;const o=e`
    mutation ReInstateSamples($samples: [String!]!) {
  reInstateSamples(samples: $samples) {
    ... on ResultedSampleListingType {
      __typename
      samples {
        uid
        status
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,r=e`
    mutation CloneSamples($samples: [String!]!) {
  cloneSamples(samples: $samples) {
    ... on SampleListingType {
      __typename
      samples {
        uid
        parentId
        sampleType {
          uid
          name
        }
        sampleId
        priority
        status
        analyses {
          uid
          name
          sortKey
        }
        profiles {
          uid
          name
        }
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,p=e`
    mutation CancelSamples($samples: [String!]!) {
  cancelSamples(samples: $samples) {
    ... on ResultedSampleListingType {
      __typename
      samples {
        uid
        status
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,d=e`
    mutation ReceiveSamples($samples: [String!]!) {
  receiveSamples(samples: $samples) {
    ... on ResultedSampleListingType {
      __typename
      samples {
        uid
        status
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,l=e`
    mutation PublishSamples($samples: [SamplePublishInputType!]!) {
  publishSamples(samples: $samples) {
    ... on OperationSuccess {
      __typename
      message
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,u=e`
    mutation PrintSamples($samples: [String!]!) {
  printSamples(samples: $samples) {
    ... on SampleListingType {
      __typename
      samples {
        uid
        status
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,y=e`
    mutation InvalidateSamples($samples: [String!]!) {
  invalidateSamples(samples: $samples) {
    ... on SampleListingType {
      __typename
      samples {
        uid
        status
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,m=e`
    mutation VerifySamples($samples: [String!]!) {
  verifySamples(samples: $samples) {
    ... on SampleListingType {
      __typename
      samples {
        uid
        status
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,c=e`
    mutation RejectSamples($samples: [SampleRejectInputType!]!) {
  rejectSamples(samples: $samples) {
    ... on SampleListingType {
      __typename
      samples {
        uid
        status
        rejectionReasons {
          uid
          reason
        }
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,g=e`
    mutation AddResultOption($payload: ResultOptionInputType!) {
  createResultOption(payload: $payload) {
    ... on ResultOptionType {
      uid
      optionKey
      value
      analysisUid
      sampleTypes {
        uid
        name
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,A=e`
    mutation EditResultOption($uid: String!, $payload: ResultOptionInputType!) {
  updateResultOption(uid: $uid, payload: $payload) {
    ... on ResultOptionType {
      uid
      optionKey
      value
      analysisUid
      sampleTypes {
        uid
        name
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,$=e`
    mutation AddAnalysisInterim($payload: AnalysisInterimInput!) {
  createAnalysisInterim(payload: $payload) {
    ... on AnalysisInterimType {
      uid
      key
      value
      analysisUid
      instrumentUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,_=e`
    mutation EditAnalysisInterim($uid: String!, $payload: AnalysisInterimInput!) {
  updateAnalysisInterim(uid: $uid, payload: $payload) {
    ... on AnalysisInterimType {
      uid
      key
      value
      analysisUid
      instrumentUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,S=e`
    mutation AddAnalysisCorrectionFactor($payload: AnalysisCorrectionFactorInput!) {
  createAnalysisCorrectionFactor(payload: $payload) {
    ... on AnalysisCorrectionFactorType {
      uid
      factor
      analysisUid
      instrumentUid
      methodUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,T=e`
    mutation EditAnalysisCorrectionFactor($uid: String!, $payload: AnalysisCorrectionFactorInput!) {
  updateAnalysisCorrectionFactor(uid: $uid, payload: $payload) {
    ... on AnalysisCorrectionFactorType {
      uid
      factor
      analysisUid
      instrumentUid
      methodUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,E=e`
    mutation AddAnalysisUncertainty($payload: AnalysisUncertaintyInput!) {
  createAnalysisUncertainty(payload: $payload) {
    ... on AnalysisUncertaintyType {
      uid
      value
      min
      max
      analysisUid
      instrumentUid
      methodUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,R=e`
    mutation EditAnalysisUncertainty($uid: String!, $payload: AnalysisUncertaintyInput!) {
  updateAnalysisUncertainty(uid: $uid, payload: $payload) {
    ... on AnalysisUncertaintyType {
      uid
      value
      min
      max
      analysisUid
      instrumentUid
      methodUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,U=e`
    mutation AddAnalysisDetectionLimit($payload: AnalysisDetectionLimitInput!) {
  createAnalysisDetectionLimit(payload: $payload) {
    ... on AnalysisDetectionLimitType {
      uid
      lowerLimit
      upperLimit
      analysisUid
      instrumentUid
      methodUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,O=e`
    mutation EditAnalysisDetectionLimit($uid: String!, $payload: AnalysisDetectionLimitInput!) {
  updateAnalysisDetectionLimit(uid: $uid, payload: $payload) {
    ... on AnalysisDetectionLimitType {
      uid
      lowerLimit
      upperLimit
      analysisUid
      instrumentUid
      methodUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,D=e`
    mutation AddAnalysisSpecification($payload: AnalysisSpecificationInput!) {
  createAnalysisSpecification(payload: $payload) {
    ... on AnalysisSpecificationType {
      uid
      analysisUid
      min
      max
      minWarn
      maxWarn
      minReport
      maxReport
      warnValues
      warnReport
      gender
      ageMin
      ageMax
      methodUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,I=e`
    mutation EditAnalysisSpecification($uid: String!, $payload: AnalysisSpecificationInput!) {
  updateAnalysisSpecification(uid: $uid, payload: $payload) {
    ... on AnalysisSpecificationType {
      uid
      analysisUid
      min
      max
      minWarn
      maxWarn
      minReport
      maxReport
      warnValues
      warnReport
      gender
      ageMin
      ageMax
      methodUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,v=e`
    mutation AddAnalysisService($payload: AnalysisInputType!) {
  createAnalysis(payload: $payload) {
    ... on AnalysisWithProfiles {
      __typename
      uid
      name
      keyword
      sortKey
      tatLengthMinutes
      precision
      requiredVerifications
      selfVerification
      description
      categoryUid
      departmentUid
      unitUid
      unit {
        uid
        name
      }
      sampleTypes {
        uid
        name
      }
      methods {
        uid
        name
      }
      resultOptions {
        uid
        optionKey
        value
      }
      category {
        uid
        name
      }
      profiles {
        uid
        name
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,f=e`
    mutation EditAnalysisService($uid: String!, $payload: AnalysisInputType!) {
  updateAnalysis(uid: $uid, payload: $payload) {
    ... on AnalysisWithProfiles {
      __typename
      uid
      name
      keyword
      sortKey
      tatLengthMinutes
      precision
      requiredVerifications
      selfVerification
      description
      categoryUid
      departmentUid
      unitUid
      unit {
        uid
        name
      }
      sampleTypes {
        uid
        name
      }
      methods {
        uid
        name
      }
      resultOptions {
        uid
        optionKey
        value
      }
      category {
        uid
        name
      }
      profiles {
        uid
        name
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,C=e`
    mutation AddAnalysisMapping($payload: AnalysisMappingInputType!) {
  createAnalysisMapping(payload: $payload) {
    ... on AnalysisMappingType {
      uid
      name
      description
      code
      codingStandardUid
      codingStandard {
        name
      }
      analysisUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,L=e`
    mutation EditAnalysisMapping($uid: String!, $payload: AnalysisMappingInputType!) {
  updateAnalysisMapping(uid: $uid, payload: $payload) {
    ... on AnalysisMappingType {
      uid
      name
      description
      code
      codingStandardUid
      codingStandard {
        name
      }
      analysisUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,M=e`
    mutation AddAnalysisProfile($payload: ProfileInputType!) {
  createProfile(payload: $payload) {
    ... on ProfileType {
      uid
      name
      description
      keyword
      active
      departmentUid
      sampleTypes {
        uid
        name
      }
      analyses {
        uid
        name
        keyword
        active
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,b=e`
    mutation EditAnalysisProfile($uid: String!, $payload: ProfileInputType!) {
  updateProfile(uid: $uid, payload: $payload) {
    ... on ProfileType {
      uid
      name
      description
      keyword
      active
      departmentUid
      sampleTypes {
        uid
        name
      }
      analyses {
        uid
        name
        keyword
        active
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,P=e`
    mutation AddProfileMapping($payload: ProfileMappingInputType!) {
  createProfileMapping(payload: $payload) {
    ... on ProfileMappingType {
      uid
      name
      description
      code
      codingStandardUid
      codingStandard {
        name
      }
      profileUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,j=e`
    mutation EditProfileMapping($uid: String!, $payload: ProfileMappingInputType!) {
  updateProfileMapping(uid: $uid, payload: $payload) {
    ... on ProfileMappingType {
      uid
      name
      description
      code
      codingStandardUid
      codingStandard {
        name
      }
      profileUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,Q=e`
    mutation AddAnalysisTemplate($payload: AnalysisTemplateInputType!) {
  createAnalysisTemplate(payload: $payload) {
    ... on AnalysisTemplateType {
      uid
      name
      description
      departmentUid
      analyses {
        uid
        name
        keyword
        active
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,h=e`
    mutation EditAnalysisTemplate($uid: String!, $payload: AnalysisTemplateInputType!) {
  updateAnalysisTemplate(uid: $uid, payload: $payload) {
    ... on AnalysisTemplateType {
      uid
      name
      description
      departmentUid
      analyses {
        uid
        name
        keyword
        active
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,q=e`
    mutation EditSampleApplyTemplate($uid: String!, $analysisTemplateUid: String!) {
  samplesApplyTemplate(uid: $uid, analysisTemplateUid: $analysisTemplateUid) {
    ... on ResultedSampleListingType {
      __typename
      samples {
        uid
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,K=e`
    mutation SampleManageAnalysis($sampleUid: String!, $payload: ManageAnalysisInputType!) {
  manageAnalyses(sampleUid: $sampleUid, payload: $payload) {
    ... on ResultedSampleListingType {
      __typename
      samples {
        uid
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,w=e`
    mutation AddAnalysisCategory($payload: AnalysisCategoryInputType!) {
  createAnalysisCategory(payload: $payload) {
    ... on AnalysisCategoryType {
      uid
      name
      active
      description
      department {
        uid
        name
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,k=e`
    mutation EditAnalysisCategory($uid: String!, $payload: AnalysisCategoryInputType!) {
  updateAnalysisCategory(uid: $uid, payload: $payload) {
    ... on AnalysisCategoryType {
      uid
      name
      active
      description
      department {
        uid
        name
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,x=e`
    mutation AddAnalysisRequest($payload: AnalysisRequestInputType!) {
  createAnalysisRequest(payload: $payload) {
    ... on AnalysisRequestWithSamples {
      __typename
      uid
      clientRequestId
      createdAt
      patient {
        uid
        firstName
        lastName
        clientPatientId
        gender
        dateOfBirth
        age
        ageDobEstimated
        consentSms
      }
      client {
        uid
        name
      }
      samples {
        uid
        sampleType {
          uid
          name
        }
        sampleId
        priority
        status
        analyses {
          uid
          name
          sortKey
        }
        profiles {
          uid
          name
        }
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,F=e`
    mutation SubmitAnalysisResults($analysisResults: [ARResultInputType!]!, $sourceObject: String!, $sourceObjectUid: String!) {
  submitAnalysisResults(
    analysisResults: $analysisResults
    sourceObject: $sourceObject
    sourceObjectUid: $sourceObjectUid
  ) {
    ... on OperationSuccess {
      message
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,V=e`
    mutation CancelAnalysisResults($analyses: [String!]!) {
  cancelAnalysisResults(analyses: $analyses) {
    ... on ResultListingType {
      results {
        uid
        status
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,W=e`
    mutation ReInstateAnalysisResults($analyses: [String!]!) {
  reInstateAnalysisResults(analyses: $analyses) {
    ... on ResultListingType {
      results {
        uid
        status
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,B=e`
    mutation VerifyAnalysisResults($analyses: [String!]!, $sourceObject: String!, $sourceObjectUid: String!) {
  verifyAnalysisResults(
    analyses: $analyses
    sourceObject: $sourceObject
    sourceObjectUid: $sourceObjectUid
  ) {
    ... on OperationSuccess {
      message
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,N=e`
    mutation RetractAnalysisResults($analyses: [String!]!) {
  retractAnalysisResults(analyses: $analyses) {
    ... on ResultListingType {
      results {
        uid
        status
        sampleUid
        result
        sample {
          uid
          sampleId
          status
          rejectionReasons {
            uid
            reason
          }
        }
        analysisUid
        analysis {
          uid
          name
          unitUid
          unit {
            uid
            name
          }
          sortKey
          interims {
            uid
            key
            value
            analysisUid
            instrumentUid
          }
          resultOptions {
            uid
            optionKey
            value
          }
        }
        retest
        reportable
        createdAt
        createdByUid
        updatedAt
        updatedByUid
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,z=e`
    mutation RetestAnalysisResults($analyses: [String!]!) {
  retestAnalysisResults(analyses: $analyses) {
    ... on ResultListingType {
      results {
        uid
        status
        sampleUid
        result
        sample {
          uid
          sampleId
          status
          rejectionReasons {
            uid
            reason
          }
        }
        analysisUid
        analysis {
          uid
          name
          unitUid
          unit {
            uid
            name
          }
          sortKey
          interims {
            uid
            key
            value
            analysisUid
            instrumentUid
          }
          resultOptions {
            uid
            optionKey
            value
          }
        }
        retest
        reportable
        createdAt
        createdByUid
        updatedAt
        updatedByUid
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,G=e`
    mutation AddQCLevel($level: String!) {
  createQcLevel(level: $level) {
    ... on QCLevelType {
      uid
      level
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,H=e`
    mutation EditQCLevel($uid: String!, $level: String!) {
  updateQcLevel(uid: $uid, level: $level) {
    ... on QCLevelType {
      uid
      level
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,J=e`
    mutation AddQCTemplate($payload: QCTemplateInputType!) {
  createQcTemplate(payload: $payload) {
    ... on QCTemplateType {
      uid
      name
      description
      qcLevels {
        uid
        level
      }
      departments {
        uid
        name
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,X=e`
    mutation EditQCTemplate($uid: String!, $payload: QCTemplateInputType!) {
  updateQcTemplate(uid: $uid, payload: $payload) {
    ... on QCTemplateType {
      uid
      name
      description
      qcLevels {
        uid
        level
      }
      departments {
        uid
        name
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,Y=e`
    mutation AddQCRequest($samples: [QCSetInputType!]!) {
  createQcSet(samples: $samples) {
    ... on CreateQCSetData {
      __typename
      qcSets {
        uid
        name
        note
        status
        createdAt
        samples {
          uid
          sampleId
          status
          createdAt
          updatedAt
          assigned
          qcLevel {
            uid
            level
          }
          analysisResults {
            uid
            status
            sampleUid
            result
            analysisUid
            retest
            reportable
            analysis {
              uid
              name
              sortKey
              resultOptions {
                uid
                optionKey
                value
                sampleTypes {
                  uid
                  name
                }
              }
            }
            method {
              uid
              name
            }
            laboratoryInstrument {
              uid
              labName
              instrument {
                uid
                name
              }
            }
          }
          analyses {
            uid
            name
            unitUid
            unit {
              uid
              name
            }
            resultOptions {
              uid
              optionKey
              value
              sampleTypes {
                uid
                name
              }
            }
          }
          profiles {
            uid
            name
          }
        }
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,Z=e`
    mutation AddRejectionReason($reason: String!) {
  createRejectionReason(reason: $reason) {
    ... on RejectionReasonType {
      __typename
      uid
      reason
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,ee=e`
    mutation EditRejectionReason($uid: String!, $reason: String!) {
  updateRejectionReason(uid: $uid, reason: $reason) {
    ... on RejectionReasonType {
      __typename
      uid
      reason
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;export{x as A,t as B,p as C,q as D,k as E,K as F,g as G,A as H,y as I,$ as J,_ as K,S as L,T as M,E as N,R as O,l as P,U as Q,o as R,F as S,O as T,D as U,m as V,I as W,G as X,H as Y,i as Z,s as _,r as a,d as b,u as c,c as d,V as e,W as f,B as g,N as h,z as i,Y as j,w as k,M as l,b as m,P as n,j as o,Q as p,h as q,v as r,f as s,C as t,L as u,J as v,X as w,Z as x,ee as y,n as z};
