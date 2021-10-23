import gql from 'graphql-tag';

export const GET_ALL_SAMPLE_TYPES = gql`
  query getAllSampleTypes {
    sampleTypeAll {
        uid
        name
        abbr
        description
        active
    }
}`;

export const GET_ALL_ANALYSES_SERVICES = gql`
  query getAllAnalysesServices($first: Int, $after: String, $text: String, $sortBy: [String!] = ["name"]) {
    analysisAll(pageSize:$first, afterCursor:$after, text:$text, sortBy:$sortBy){
      items {
        uid
        name
        keyword
        active
        sortKey
        categoryUid
        resultoptions {
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
}`;


export const GET_ALL_ANALYSES_PROFILES = gql`
    query getAllAnalysesProfiles {
        profileAll {
          uid
          name  
          description
          keyword
          active
          analyses {
            name
            keyword
            active
            sortKey
          }
        }
    }`;


export const GET_ALL_ANALYSES_PROFILES_AND_SERVICES = gql`
    query getAllProfilesANDServices {
        profileAll {
            uid
            name  
            description
            keyword
            active
            analyses {
              uid
              name
              keyword
              sortKey
              active
            }
        }
        analysisAll{
          items {
            uid
            name
            keyword
            active
            sortKey
            categoryUid
            resultoptions {
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
    }`;

export const GET_ALL_ANALYSES_CATEGORIES = gql`
    query getAllAnalysesCategories {
        analysisCategoryAll {
            uid
            name
            description
            active
        }
    }`;


export const GET_ALL_SAMPLES = gql`
    query getAllSamples($first: Int!, $after: String, $status: String!, $text: String!, $clientUid: Int!, $sortBy: [String!]) {
        sampleAll(pageSize: $first, afterCursor: $after, status: $status, text: $text, clientUid: $clientUid, sortBy: $sortBy) {
          totalCount
        	pageInfo {
              hasNextPage
              hasPreviousPage
              endCursor
              startCursor
            }
          items {
            uid
            analysisrequest {
                uid
                clientRequestId
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
            }
            sampletype {
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
    }`;


export const GET_ANALYSIS_REQUESTS_BY_PATIENT_UID = gql`
query getAnalysesRequestsByPatientUid($uid: Int!) {
  analysisRequestsByPatientUid(uid: $uid) {
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
      sampletype {
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

}`;




export const GET_ANALYSIS_REQUESTS_BY_CLIENT_UID = gql`
query getAnalysesRequestsByClientUid($uid: Int!) {
  analysisRequestsByClientUid(uid: $uid) {
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
      sampletype {
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

}`;



export const GET_ANALYSIS_RESULTS_BY_SAMPLE_UID = gql`
  query getAnalysesResultsBySampleUid($uid: Int!) {
    analysisResultBySampleUid(uid: $uid) {
        uid
        status
        sampleUid
        result
          method {
            uid
            name
          }
          instrument {
            uid
            name
          }
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
          resultoptions {
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

      sampleByUid(uid: $uid){
        uid
        analysisrequest {
            uid
            clientRequestId
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
        }
        sampletype {
            uid
            name
        }
        sampleId
        priority
        status
        analyses {
            uid
            name
        }
        profiles {
          uid
          name
        }
      }
}`;


export const GET_ALL_QC_LEVELS = gql`
  query getAllQCLevels {
    qcLevelAll {
      uid
      level
    }
}`;

export const GET_ALL_QC_TEMPLATES = gql`
    query getAllQCTemplates {
    qcTemplateAll {
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
  }`;


export const GET_ALL_QC_SETS = gql`
  query getQCSeTs($first: Int!, $after: String, $text: String!, $sortBy: [String!] = ["uid"]) {
    qcSetAll(pageSize: $first, afterCursor: $after, text: $text, sortBy: $sortBy){
    totalCount
    pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
        startCursor
      }
      items {
          uid
          name
          note
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
              resultoptions {
                uid
                optionKey
                value
              }
            }
            method {
              uid
              name
            }
            instrument {
              uid
              name
            }
          }
          analyses {
            uid
            name
            unit
            resultoptions {
              uid
              optionKey
              value
            }
          }
          profiles {
            uid
            name
          }
        }
      }
    }
  }`;


export const GET_QC_SET_BY_UID = gql`
    query getQCSetByUid($uid: Int!) {
      qcSetByUid(uid: $uid) {
        uid
        name
        note
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
              resultoptions {
                uid
                optionKey
                value
              }
            }
            method {
              uid
              name
            }
            instrument {
              uid
              name
            }
          }
          analyses {
            uid
            name
            unit
            resultoptions {
              uid
              optionKey
              value
            }
          }
          profiles {
            uid
            name
          }
        }
      }
    }`;


export const GET_RESULT_OPTIONS_FOR_ANALYSIS = gql`
    query resultOptionsByAnalysisUid($uid: Int!) {
      resultOptionsByAnalysisUid(uid: $uid) {
        uid
        optionKey
        value
        analysisUid
      }
  }`;