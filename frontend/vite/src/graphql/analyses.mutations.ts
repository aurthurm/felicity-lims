import gql from 'graphql-tag';

// SAMPLE_TYPE
export const ADD_SAMPLE_TYPE= gql`
  mutation AddSampleType ($name: String!, $abbr: String!, $active: Boolean, $description: String!) {
    createSampleType(name: $name, abbr: $abbr, active: $active, description: $description){
        uid
        name
        abbr
        description
        active
    }
  }
`;

export const EDIT_SAMPLE_TYPE= gql`
  mutation EditSampleType ($uid: Int!, $name: String, $abbr: String, $active: Boolean, $description: String) {
    updateSampleType(uid: $uid, name: $name, abbr: $abbr, active: $active, description: $description){
        uid
        name
        abbr
        description
        active
    }
  }
`;

export const REINSTATE_SAMPLES = gql`
  mutation ReInstateSamples ($samples: [Int!]!) {
    reInstateSamples(samples: $samples){
        uid
        status
    }
  }
`;

export const CANCEL_SAMPLES = gql`
  mutation CancelSamples ($samples: [Int!]!) {
    cancelSamples(samples: $samples){
        uid
        status
    }
  }
`;

export const RECEIVE_SAMPLES = gql`
  mutation ReceiveSamples ($samples: [Int!]!) {
    receiveSamples(samples: $samples){
        uid
        status
    }
  }
`;


export const PUBLISH_SAMPLES = gql`
  mutation PublishSamples ($samples: [Int!]!) {
    publishSamples(samples: $samples){
        uid
        status
    }
  }
`;

export const INVALIDATE_SAMPLES = gql`
  mutation InvalidateSamples ($samples: [Int!]!) {
    invalidateSamples(samples: $samples){
        uid
        sampleId
        status
    }
  }
`;

export const VERIFY_SAMPLES = gql`
  mutation VerifySamples ($samples: [Int!]!) {
    verifySamples(samples: $samples){
        uid
        status
    }
  }
`;

export const REJECT_SAMPLES = gql`
  mutation RejectSamples ($samples: [SampleRejectInputType!]!) {
    rejectSamples(samples: $samples){
        uid
        status
        rejectionReasons{
          uid
          reason
        }
    }
  }
`;

// RESULT_OPTION
export const ADD_RESULT_OPTION= gql`
  mutation AddResultOption ($optionKey: Int!, $value: String!, $analysisUid: Int!) {
    createResultOption(optionKey: $optionKey, value: $value, analysisUid: $analysisUid){
        uid
        optionKey
        value
        analysisUid
    }
  }
`;

export const EDIT_RESULT_OPTION= gql`
  mutation EditResultOption ($uid: Int!, $optionKey: Int!, $value: String!) {
    updateResultOption(uid: $uid, optionKey: $optionKey, value: $value){
        uid
        optionKey
        value
        analysisUid
    }
  }
`;

// ANALYSIS_SERVICE
export const ADD_ANALYSIS_SERVICE= gql`
  mutation AddAnalysisService ($name: String!, $keyword: String!, $active: Boolean!, $internalUse: Boolean, $description: String!, $categoryUid: Int, $sortKey: Int!, $sampleTypes: [Int!]) {
    createAnalysis(name: $name, keyword: $keyword, active: $active, internalUse: $internalUse, description: $description, sortKey: $sortKey, categoryUid: $categoryUid, sampleTypes:$sampleTypes){
      uid
      name
      keyword
      sortKey
      description   
      categoryUid   
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
  }
`;

export const EDIT_ANALYSIS_SERVICE= gql`
  mutation EditAnalysisService ($uid: Int!, $name: String!, $keyword: String!, $active: Boolean, $sortKey: Int!, $internalUse: Boolean, $categoryUid: Int, $description: String!, $sampleTypes: [String!]!) {
    updateAnalysis(uid: $uid, name: $name, keyword: $keyword, active: $active, internalUse: $internalUse, sortKey: $sortKey, categoryUid: $categoryUid, description: $description, sampleTypes:$sampleTypes){
      uid
      name
      keyword
      sortKey
      description
      categoryUid   
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
  }
`;

// ANALYSIS_PROFILES
export const ADD_ANALYSIS_PROFILE= gql`
  mutation AddAnalysisProfile ($name: String!, $keyword: String!, $active: Boolean!, $description: String!) {
    createProfile(name: $name, keyword: $keyword, active: $active, description: $description){
      uid
      name
      description
      keyword
      active
      analyses {
        uid
        name
        keyword
        active
      }
  }
  }
`;

export const EDIT_ANALYSIS_PROFILE= gql`
  mutation EditAnalysisProfile ($uid: Int!, $name: String!, $keyword: String!, $active: Boolean!, $description: String! $services: [Int!]) {
    updateProfile(uid: $uid, name: $name, keyword: $keyword, active: $active, description: $description, services: $services){
      uid
      name     
      description
      keyword
      active
      analyses {
        uid
        name
        keyword
        active
      }
  }
  }
`;

// ANALYSIS_CATEGORIES
export const ADD_ANALYSIS_CATEGORY= gql`
  mutation AddAnalysisCategory ($name: String!, $description: String!, $active: Boolean) {
    createAnalysisCategory(name: $name, description: $description, active: $active){
        uid
        name
        active
        description
  }
  }
`;

export const EDIT_ANALYSIS_CATEGORY= gql`
  mutation EditAnalysisCategory ($uid: Int!, $name: String!, $description: String!, $active: Boolean) {
    updateAnalysisCategory(uid: $uid, name: $name, description: $description, active: $active){
        uid
        name
        active
        description
  }
  }
`;

// ANALYSIS REQUEST
export const ADD_ANALYSIS_REQUEST = gql`
mutation AddAnalysisRequest ($clientRequestId: String!, $clientUid: Int!, $patientUid: Int!, $samples: [ARSampleInputType!]!) {
  createAnalysisRequest(clientRequestId: $clientRequestId, clientUid: $clientUid, patientUid: $patientUid, samples: $samples) {
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
}
`;

// ANALYSIS RESULTS
export const SUBMIT_ANALYSIS_RESULTS = gql`
  mutation SubmitAnalysisResults ($analysisResults: [ARResultInputType!]!) {
    submitAnalysisResults(analysisResults: $analysisResults){
        uid
        status
        sampleUid
        result
        sample{
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
          unit
          sortKey
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
`; 

export const CANCEL_ANALYSIS_RESULTS = gql`
  mutation CancelAnalysisResults ($analyses: [Int!]!) {
    cancelAnalysisResults(analyses: $analyses){
        uid
        status
    }
  }
`; 

export const REINSTATE_ANALYSIS_RESULTS = gql`
  mutation ReInstateAnalysisResults ($analyses: [Int!]!) {
    reInstateAnalysisResults(analyses: $analyses){
        uid
        status
    }
  }
`;

export const VERIFY_ANALYSIS_RESULTS = gql`
  mutation VerifyAnalysisResults ($analyses: [Int!]!) {
    verifyAnalysisResults(analyses: $analyses){
        uid
        status
        sampleUid
        result
        sample{
          uid
          sampleId
          status
          rejectionReasons {
                uid
                reason
          }
        }
        analysisUid
        analysis{
          uid
          name
          unit
          sortKey
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
`; 
 
export const RETRACT_ANALYSIS_RESULTS = gql`
  mutation RetractAnalysisResults ($analyses: [Int!]!) {
    retractAnalysisResults(analyses: $analyses){
        uid
        status
        sampleUid
        result
        sample{
          uid
          sampleId
          status
          rejectionReasons {
            uid
            reason
          }
        }
        analysisUid
        analysis{
          uid
          name
          unit
          sortKey
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
`;

export const RETEST_ANALYSIS_RESULTS = gql`
  mutation RetestAnalysisResults ($analyses: [Int!]!) {
    retestAnalysisResults(analyses: $analyses){
        uid
        status
        sampleUid
        result
        sample{
          uid
          sampleId
          status
          rejectionReasons {
                uid
                reason
          }
        }
        analysisUid
        analysis{
          uid
          name
          unit
          sortKey
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
`; 

// qc levels
export const ADD_QC_LEVEL = gql`
  mutation AddQCLevel($level: String!) {
    createQcLevel(level: $level ){
        uid
        level
  }
  }
`;

export const EDIT_QC_LEVEL = gql`
  mutation EditQCLevel ($uid: Int!, $level: String!) {
    updateQcLevel(uid: $uid, level: $level){
        uid
        level
    }
  }
`;

// ANALYSIS_CATEGORIES
export const ADD_QC_TEMPLATE = gql`
  mutation AddQCTemplate ($name: String!, $description: String!, $levels: [Int!]!, $departments: [Int!]) {
    createQcTemplate(name: $name, description: $description, levels: $levels, departments: $departments ){
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
  }
`;

export const EDIT_QC_TEMPLATE = gql`
  mutation EditQCTemplate ($uid: Int!, $name: String!, $description: String!, $levels: [Int!]!, $departments: [Int!]) {
    updateQcTemplate(uid: $uid, name: $name, description: $description, levels: $levels, departments: $departments){
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
  }
`;

// ANALYSIS_CATEGORIES
export const ADD_QC_REQUEST = gql`
  mutation AddQCRequest($samples: [QCSetInputType!]!) {
    createQcSet(samples: $samples){
        samples {
          uid
          sampleId
          status
          qcLevel {
            uid
            level
          }
          analyses {
                uid
                name
          }
          profiles {
                uid
                name
          }
        }
        qcSets {
          uid
          name
          note
        }
    }
  }
`;

// REJECTION REASONS
export const ADD_REJECTION_REASON = gql`
mutation AddRejectionReason($reason: String!) {
  createRejectionReason(reason: $reason ){
      uid
      reason
  }
}
`;

export const EDIT_REJECTION_REASON = gql`
mutation EditRejectionReason ($uid: Int!, $reason: String!) {
  updateRejectionReason(uid: $uid, reason: $reason){
      uid
      reason
  }
}
`;