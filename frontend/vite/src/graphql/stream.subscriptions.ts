import gql from 'graphql-tag'


export const SUBSCRIBE_TO_TEST_STREAM = gql`
  subscription getTestingStream {
    testStream {
      uid
      actorUid
      actor{
        uid
        firstName
        lastName
      }
      actionObjectUid
      actionObjectType
      actionObject {
        __typename
        ...on SampleType {
          uid
          sampleId
          analysisRequest {
            patientUid
          }
        }
        ...on WorkSheetType {
          uid
          worksheetId
        }
      }
      targetUid
      verb
    }
  }`;


export const SUBSCRIBE_TO_ACTIVITY_STREAM = gql`
subscription getSystemActivity {
  latestActivity {
    uid
    actorUid
    actor{
      uid
      firstName
      lastName
    }
    actionObjectUid
    actionObjectType
    actionObject {
      __typename
      ...on SampleType {
        uid
        sampleId
        status
        analysisRequest {
          patientUid
        }
      }
      ...on WorkSheetType {
        uid
        worksheetId
        state
      }
      ...on AnalysisResultType {
        uid
        sampleUid
        result
        status
      }
    }
    targetUid
    verb
  }
}`;
