import gql from 'graphql-tag';


export const GET_ALL_WORKSHEET_TEMPLATES = gql`
  query getAllWorksheetTemplates {
    worksheetTemplateAll {
      uid
      name
      reserved
      plate
      numberOfSamples
      rows
      cols
      rowWise
      worksheetType
      instrument {
        uid
        name
      }
      sampleType {
        uid
        name
      }
      description
      analyses {
        uid
        name
      }
      state
    }
  }`;



export const GET_ALL_WORKSHEETS = gql`
  query getAllWorksheets {
    worksheetAll {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      items {
          uid
          worksheetId
          numberOfSamples
          assignedCount
          analyst {
            uid
            auth{
              uid
              userName
            }
            firstName
            lastName
          }
          instrument {
            uid
            name
          }
          analyses {
            uid
            name
          }
          state
          createdAt
        }
      }
  }`;




export const GET_WORKSHEET_BY_UID = gql`
  query getWorkSheetByUid($worksheetUid: Int!) {
    worksheetByUid(worksheetUid: $worksheetUid) {
      uid
      worksheetId
      numberOfSamples
      assignedCount
      reserved
      state
      createdAt
      analyst {
        uid
        auth{
          uid
          userName
        }
        firstName
        lastName
      }
      sampleType {
        name
        name
      }
      instrument {
        uid
        name
      }
      template {
        uid
        name
      }
      analyses {
        uid
        name
      }
      plate
      analysisResults {
        uid
        result
        status
        worksheetPosition
        retest 
        reportable
        method {
          uid
          name
        }
        instrument {
          uid
          name
        }
        analysis {
          uid
          name
          unit
          resultoptions {
            uid
            optionKey
            value
          }
        }
        sample {
          uid
          sampleId
          priority
          analysisrequest {
            uid
            client {
              uid
              name
            }
            patient {
              uid
              firstName
              lastName
              clientPatientId
              patientId
            }
          }
        }
      }
    }
  }`;
