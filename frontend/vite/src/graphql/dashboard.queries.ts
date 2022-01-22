import gql from 'graphql-tag'


export const GET_SAMPLE_GROUP_BY_STATUS = gql`
  query getSampleGroupByStatus {
    countSampleGroupByStatus {
      data {
        __typename
        group
        count
      }
    }
}`;

export const GET_ANALYSIS_GROUP_BY_STATUS = gql`
  query getAnalysisGroupByStatus {
    countAnalyteGroupByStatus {
      data {
        __typename
        group
        count
      }
    }
}`;

export const GET_WORKSHEET_GROUP_BY_STATUS = gql`
  query getWorksheetGroupByStatus {
    countWorksheetGroupByStatus {
      data {
        __typename
        group
        count
      }
    }
}`;

export const GET_ANALYSIS_GROUP_BY_INSTRUMENT = gql`
  query getAnalysisGroupByInstrument {
    countAnalyteGroupByInstrument {
      data {
        __typename
        group
        count
      }
    }
}`;

export const GET_SAMPLE_PROCESS_PEFORMANCE = gql`
  query sampleProcessPeformance {
    sampleProcessPerformance(
      startDate: "10-20-2017",
      endDate: "10-10-2022"
    ) {
      __typename
      data {
        process
        counts {
          totalSamples
          totalLate
          totalNotLate
          processAverage
          avgExtraDays
        }
      }
    }
}`;

export const GET_ANALYSIS_PROCESS_PEFORMANCE = gql`
  query getAnalysisProcessPeformance {
    analysisProcessPerformance(
      process: "verified_to_published",
      startDate: "10-20-2017",
      endDate: "10-10-2022"
    ) {
      __typename
      data {
        process
        groups {
          totalSamples
          totalLate
          totalNotLate
          processAverage
          avgExtraDays
          service
        }
      }
    }
}`;


export const GET_SAMPLE_GROUPS_BY_ACTION = gql`
  query sampleGroupByAction {
    countSampleGroupByAction {
      __typename
      data {
        __typename
        group
        counts {
        __typename
          group
          count
        }
      }
    }
}`;

export const GET_SAMPLE_LAGGARDS = gql`
  query getSampleLaggards {
    sampleLaggards {
      __typename
     data {
         __typename
       category
       counts {
         __typename
         totalIncomplete
         totalDelayed
         totalNotDelayed
         lessThanTen
         tenToTwenty
         twentyToThirty
         graterThanThirty
       }
     }
   }
}`;