import gql from 'graphql-tag';

// SAMPLE_TYPE
export const ADD_SAMPLE_TYPE= gql`
  mutation AddSampleType ($name: String!, $abbr: String!, $active: Boolean, $description: String!) {
    createSampleType(name: $name, abbr: $abbr, active: $active, description: $description){
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
`;

export const EDIT_SAMPLE_TYPE= gql`
  mutation EditSampleType ($uid: Int!, $name: String, $abbr: String, $active: Boolean, $description: String) {
    updateSampleType(uid: $uid, name: $name, abbr: $abbr, active: $active, description: $description){
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
`;

export const REINSTATE_SAMPLES = gql`
  mutation ReInstateSamples ($samples: [Int!]!) {
    reInstateSamples(samples: $samples){
      ... on ResultedSampleListingType{
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
`;

export const CANCEL_SAMPLES = gql`
  mutation CancelSamples ($samples: [Int!]!) {
    cancelSamples(samples: $samples){
      ... on ResultedSampleListingType{
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
`;

export const RECEIVE_SAMPLES = gql`
  mutation ReceiveSamples ($samples: [Int!]!) {
    receiveSamples(samples: $samples){
      ... on ResultedSampleListingType{
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
`;


export const PUBLISH_SAMPLES = gql`
  mutation PublishSamples ($samples: [Int!]!) {
    publishSamples(samples: $samples){
      ... on SampleListingType{
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
`;

export const INVALIDATE_SAMPLES = gql`
  mutation InvalidateSamples ($samples: [Int!]!) {
    invalidateSamples(samples: $samples){
      ... on SampleListingType{
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
`;

export const VERIFY_SAMPLES = gql`
  mutation VerifySamples ($samples: [Int!]!) {
    verifySamples(samples: $samples){
      ... on SampleListingType{
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
`;

export const REJECT_SAMPLES = gql`
  mutation RejectSamples ($samples: [SampleRejectInputType!]!) {
    rejectSamples(samples: $samples){
      ... on SampleListingType{
        __typename
        uid
        status
        rejectionReasons{
          uid
          reason
        }

      }

      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`;

// RESULT_OPTION
export const ADD_RESULT_OPTION= gql`
  mutation AddResultOption ($optionKey: Int!, $value: String!, $analysisUid: Int!) {
    createResultOption(optionKey: $optionKey, value: $value, analysisUid: $analysisUid){
      ... on ResultOptionType {
        __typename
        uid
        optionKey
        value
        analysisUid

      }

      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`;

export const EDIT_RESULT_OPTION= gql`
  mutation EditResultOption ($uid: Int!, $optionKey: Int!, $value: String!) {
    updateResultOption(uid: $uid, optionKey: $optionKey, value: $value){
      ... on ResultOptionType {
        __typename
        uid
        optionKey
        value
        analysisUid

      }


      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`;

// ANALYSIS_SERVICE
export const ADD_ANALYSIS_SERVICE= gql`
  mutation AddAnalysisService ($name: String!, $keyword: String!, $active: Boolean!, $internalUse: Boolean, $description: String!, $categoryUid: Int, $sortKey: Int!, $sampleTypes: [Int!]) {
    createAnalysis(name: $name, keyword: $keyword, active: $active, internalUse: $internalUse, description: $description, sortKey: $sortKey, categoryUid: $categoryUid, sampleTypes:$sampleTypes){
      ... on AnalysisWithProfiles {
        __typename
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

      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`;

export const EDIT_ANALYSIS_SERVICE= gql`
  mutation EditAnalysisService ($uid: Int!, $name: String!, $keyword: String!, $active: Boolean, $sortKey: Int!, $internalUse: Boolean, $categoryUid: Int, $description: String!, $sampleTypes: [String!]!) {
    updateAnalysis(uid: $uid, name: $name, keyword: $keyword, active: $active, internalUse: $internalUse, sortKey: $sortKey, categoryUid: $categoryUid, description: $description, sampleTypes:$sampleTypes){
      ... on AnalysisWithProfiles {
        __typename
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
      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`;

// ANALYSIS_PROFILES
export const ADD_ANALYSIS_PROFILE= gql`
  mutation AddAnalysisProfile ($name: String!, $keyword: String!, $active: Boolean!, $description: String!) {
    createProfile(name: $name, keyword: $keyword, active: $active, description: $description){
      ... on ProfileType {
        __typename
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

      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`;

export const EDIT_ANALYSIS_PROFILE= gql`
  mutation EditAnalysisProfile ($uid: Int!, $name: String!, $keyword: String!, $active: Boolean!, $description: String! $services: [Int!]) {
    updateProfile(uid: $uid, name: $name, keyword: $keyword, active: $active, description: $description, services: $services){
      ... on ProfileType {
        __typename
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
      
      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`;

// ANALYSIS_CATEGORIES
export const ADD_ANALYSIS_CATEGORY= gql`
  mutation AddAnalysisCategory ($name: String!, $description: String!, $active: Boolean) {
    createAnalysisCategory(name: $name, description: $description, active: $active){
      ... on AnalysisCategoryType {
        __typename
        uid
        name
        active
        description
      }

      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`;

export const EDIT_ANALYSIS_CATEGORY= gql`
  mutation EditAnalysisCategory ($uid: Int!, $name: String!, $description: String!, $active: Boolean) {
    updateAnalysisCategory(uid: $uid, name: $name, description: $description, active: $active){
      ... on AnalysisCategoryType {
        __typename
        uid
        name
        active
        description
      }
  
      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`;

// ANALYSIS REQUEST
export const ADD_ANALYSIS_REQUEST = gql`
mutation AddAnalysisRequest ($clientRequestId: String!, $clientUid: Int!, $patientUid: Int!, $samples: [ARSampleInputType!]!) {
  createAnalysisRequest(clientRequestId: $clientRequestId, clientUid: $clientUid, patientUid: $patientUid, samples: $samples) {
    ... on AnalysisRequestWithSamples{
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
`;

// ANALYSIS RESULTS
export const SUBMIT_ANALYSIS_RESULTS = gql`
  mutation SubmitAnalysisResults ($analysisResults: [ARResultInputType!]!) {
    submitAnalysisResults(analysisResults: $analysisResults){
      ... on ResultListingType {
        __typename
        results {
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
  
      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`; 

export const CANCEL_ANALYSIS_RESULTS = gql`
  mutation CancelAnalysisResults ($analyses: [Int!]!) {
    cancelAnalysisResults(analyses: $analyses){
      ... on ResultListingType {
        __typename
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
`; 

export const REINSTATE_ANALYSIS_RESULTS = gql`
  mutation ReInstateAnalysisResults ($analyses: [Int!]!) {
    reInstateAnalysisResults(analyses: $analyses){      
      ... on ResultListingType {
        __typename
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
`;

export const VERIFY_ANALYSIS_RESULTS = gql`
  mutation VerifyAnalysisResults ($analyses: [Int!]!) {
    verifyAnalysisResults(analyses: $analyses){
      ... on ResultListingType {
        __typename
        results {
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

      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`; 
 
export const RETRACT_ANALYSIS_RESULTS = gql`
  mutation RetractAnalysisResults ($analyses: [Int!]!) {
    retractAnalysisResults(analyses: $analyses){
      ... on ResultListingType {
        __typename
        results {
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
  
      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`;

export const RETEST_ANALYSIS_RESULTS = gql`
  mutation RetestAnalysisResults ($analyses: [Int!]!) {
    retestAnalysisResults(analyses: $analyses){
      ... on ResultListingType {
        __typename
        results {
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
  
      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`; 

// qc levels
export const ADD_QC_LEVEL = gql`
  mutation AddQCLevel($level: String!) {
    createQcLevel(level: $level ){
      ... on QCLevelType {
        __typename
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
`;

export const EDIT_QC_LEVEL = gql`
  mutation EditQCLevel ($uid: Int!, $level: String!) {
    updateQcLevel(uid: $uid, level: $level){
      ... on QCLevelType {
        __typename
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
`;

// ANALYSIS_CATEGORIES
export const ADD_QC_TEMPLATE = gql`
  mutation AddQCTemplate ($name: String!, $description: String!, $levels: [Int!]!, $departments: [Int!]) {
    createQcTemplate(name: $name, description: $description, levels: $levels, departments: $departments ){
      ... on QCTemplateType {
        __typename
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
`;

export const EDIT_QC_TEMPLATE = gql`
  mutation EditQCTemplate ($uid: Int!, $name: String!, $description: String!, $levels: [Int!]!, $departments: [Int!]) {
    updateQcTemplate(uid: $uid, name: $name, description: $description, levels: $levels, departments: $departments){
      ... on QCTemplateType {
        __typename
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
`;

// ANALYSIS_CATEGORIES
export const ADD_QC_REQUEST = gql`
  mutation AddQCRequest($samples: [QCSetInputType!]!) {
    createQcSet(samples: $samples){
      ... on CreateQCSetData {
        __typename
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

      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`;

// REJECTION REASONS
export const ADD_REJECTION_REASON = gql`
mutation AddRejectionReason($reason: String!) {
  createRejectionReason(reason: $reason ){
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
`;

export const EDIT_REJECTION_REASON = gql`
mutation EditRejectionReason ($uid: Int!, $reason: String!) {
  updateRejectionReason(uid: $uid, reason: $reason){
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
`;